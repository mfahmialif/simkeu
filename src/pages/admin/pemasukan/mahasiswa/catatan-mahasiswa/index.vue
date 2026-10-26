<script setup>
import { showSnackbar } from "@/composables/snackbar"
import { useRouter } from "vue-router"

const router = useRouter()

const page = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref({ key: "id", order: "desc" })
const search = ref("")
const selectedThAkademik = ref(null)
const thAkademikList = ref([])

const dataTable = ref([])
const totalItems = ref(0)
const loading = ref(false)
const initialLoading = ref(true)

// Detail modal
const isDialogDetailVisible = ref(false)
const selectedDetail = ref(null)

// Delete dialog
const isDialogDeleteVisible = ref(false)
const deleteData = ref({})

const fetchThAkademikList = async () => {
  try {
    const { data } = await $api("/admin/th-akademik", {
      method: "GET",
      params: { limit: 0 },
    })

    thAkademikList.value = (data?.data || []).map(th => ({
      title: `${th.nama} - ${th.semester}`,
      value: Number(th.id),
    }))
  } catch (err) {
    console.error("Gagal load th-akademik:", err)
  }
}

const fetchData = async () => {
  try {
    loading.value = true

    const { data } = await $api("/admin/pemasukan/mahasiswa/catatan-mahasiswa", {
      method: "GET",
      params: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        search: search.value,
        ...(selectedThAkademik.value && { th_akademik_id: selectedThAkademik.value }),
      },
    })

    dataTable.value = data?.data || []
    totalItems.value = data?.total || 0

    fetchMahasiswaDetails()
  } catch (err) {
    console.error("Gagal mengambil data catatan mahasiswa:", err)
  } finally {
    loading.value = false
    if (initialLoading.value) initialLoading.value = false
  }
}

const fetchMahasiswaDetails = async () => {
  const nimList = dataTable.value.map(item => item.nim).filter(Boolean)
  if (!nimList.length) return

  try {
    const res = await $api("/admin/mahasiswa/nim", {
      method: "GET",
      body: {
        nim: JSON.stringify(nimList),
        whereIn: true,
      },
    })

    dataTable.value = dataTable.value.map(item => {
      const mhs = Array.isArray(res) ? res.find(m => m.nim === item.nim) : false
      return {
        ...item,
        mahasiswa: mhs || false,
      }
    })
  } catch (e) {
    console.error("Gagal fetch detail mahasiswa:", e)
  }
}

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb }) => {
  loading.value = true
  page.value = p
  itemsPerPage.value = ipp
  if (sb?.length) sortBy.value = sb[0]
  fetchData()
}

const openDetail = item => {
  selectedDetail.value = item
  isDialogDetailVisible.value = true
}

const showDialogDelete = (id, nim) => {
  deleteData.value = { id, nim }
  isDialogDeleteVisible.value = true
}

const deleteDataSubmit = async id => {
  try {
    const res = await $api(`/admin/pemasukan/mahasiswa/catatan-mahasiswa/${id}`, {
      method: "DELETE",
    })

    if (res?.status === true) {
      showSnackbar({
        text: res.message || "Catatan mahasiswa berhasil dihapus",
        color: "success",
      })
      fetchData()
    } else {
      showSnackbar({
        text: res?.message || "Gagal menghapus catatan mahasiswa",
        color: "error",
      })
    }
  } catch (err) {
    showSnackbar({
      text: err?.data?.message || err?.message || "Terjadi kesalahan saat menghapus",
      color: "error",
    })
  } finally {
    isDialogDeleteVisible.value = false
  }
}

let searchTimer = null
watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    page.value = 1
    fetchData()
  }, 400)
})

watch(selectedThAkademik, () => {
  page.value = 1
  fetchData()
})

onMounted(async () => {
  await fetchThAkademikList()
  fetchData()
})

const headers = [
  { title: "No", key: "id", width: 70 },
  { title: "Mahasiswa", key: "nim" },
  { title: "Tahun Akademik", key: "th_akademik_id" },
  { title: "Tanggal", key: "tanggal" },
  { title: "Catatan", key: "catatan" },
  { title: "Petugas", key: "user" },
  { title: "Aksi", key: "actions", sortable: false, width: 110, align: "center" },
]
</script>

<template>
  <div>
    <VCard>
      <VCardItem class="pb-2">
        <div class="d-flex flex-wrap align-center justify-space-between gap-4">
          <div>
            <VCardTitle class="text-h5 font-weight-bold">
              Catatan Mahasiswa
            </VCardTitle>
            <div class="text-body-2 text-medium-emphasis">
              Daftar catatan mahasiswa yang diinput saat pembayaran skripsi atau melalui modul ini.
            </div>
          </div>

          <VBtn
            color="primary"
            prepend-icon="ri-add-line"
            @click="router.push('/admin/pemasukan/mahasiswa/catatan-mahasiswa/add')"
          >
            Tambah Catatan
          </VBtn>
        </div>
      </VCardItem>

      <VDivider />

      <!-- Filter Bar -->
      <VCardText class="py-4">
        <VRow>
          <VCol
            cols="12"
            md="4"
          >
            <VTextField
              v-model="search"
              placeholder="Cari NIM atau Catatan..."
              prepend-inner-icon="ri-search-line"
              variant="outlined"
              density="comfortable"
              clearable
              hide-details
            />
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <VSelect
              v-model="selectedThAkademik"
              :items="thAkademikList"
              item-title="title"
              item-value="value"
              placeholder="Semua Tahun Akademik"
              label="Filter Tahun Akademik"
              variant="outlined"
              density="comfortable"
              clearable
              hide-details
            />
          </VCol>
        </VRow>
      </VCardText>

      <!-- Data Table -->
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :headers="headers"
        :items="dataTable"
        :items-length="totalItems"
        :loading="loading"
        density="comfortable"
        hover
        @update:options="loadItems"
      >
        <template #item.id="{ index }">
          {{ (page - 1) * itemsPerPage + index + 1 }}
        </template>

        <template #item.nim="{ item }">
          <div class="py-2">
            <div class="d-flex align-center gap-2">
              <VChip
                color="primary"
                size="x-small"
                label
                class="font-weight-medium"
              >
                {{ item.nim }}
              </VChip>
            </div>
            <div class="mt-1 text-body-2 font-weight-medium">
              <template v-if="item.mahasiswa">
                {{ item.mahasiswa.nama }}
                <span
                  v-if="item.mahasiswa.prodi?.alias"
                  class="text-caption text-medium-emphasis"
                >
                  ({{ item.mahasiswa.prodi.alias }})
                </span>
              </template>
              <template v-else-if="item.mahasiswa === false">
                <span class="text-caption text-error">Data mahasiswa tidak ditemukan</span>
              </template>
              <template v-else>
                <VProgressCircular
                  indeterminate
                  size="14"
                  width="2"
                  color="primary"
                />
              </template>
            </div>
          </div>
        </template>

        <template #item.th_akademik_id="{ item }">
          <span v-if="item.th_akademik">
            {{ item.th_akademik.nama }} - {{ item.th_akademik.semester }}
          </span>
          <span
            v-else
            class="text-medium-emphasis"
          >-</span>
        </template>

        <template #item.tanggal="{ item }">
          {{ item.tanggal || '-' }}
        </template>

        <template #item.catatan="{ item }">
          <div
            class="text-truncate"
            style="max-width: 280px;"
            :title="item.catatan"
          >
            <span v-if="item.catatan">{{ item.catatan }}</span>
            <span
              v-else
              class="text-medium-emphasis fst-italic"
            >(Tidak ada catatan)</span>
          </div>
        </template>

        <template #item.user="{ item }">
          <span class="text-caption">{{ item.user?.name || item.user?.username || '-' }}</span>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex align-center justify-center gap-1">
            <IconBtn
              size="small"
              title="Lihat Detail"
              @click="openDetail(item)"
            >
              <VIcon
                icon="ri-eye-line"
                size="18"
              />
            </IconBtn>
            <IconBtn
              size="small"
              title="Edit Catatan"
              @click="router.push(`/admin/pemasukan/mahasiswa/catatan-mahasiswa/edit/${item.id}`)"
            >
              <VIcon
                icon="ri-pencil-line"
                size="18"
              />
            </IconBtn>
            <IconBtn
              size="small"
              color="error"
              title="Hapus Catatan"
              @click="showDialogDelete(item.id, item.nim)"
            >
              <VIcon
                icon="ri-delete-bin-line"
                size="18"
              />
            </IconBtn>
          </div>
        </template>
      </VDataTableServer>
    </VCard>

    <!-- Dialog Detail -->
    <VDialog
      v-model="isDialogDetailVisible"
      max-width="600"
    >
      <VCard v-if="selectedDetail">
        <VCardItem>
          <VCardTitle class="d-flex align-center justify-space-between">
            <span>Detail Catatan Mahasiswa</span>
            <IconBtn
              size="small"
              @click="isDialogDetailVisible = false"
            >
              <VIcon icon="ri-close-line" />
            </IconBtn>
          </VCardTitle>
        </VCardItem>
        <VDivider />
        <VCardText class="pa-4">
          <VRow>
            <VCol
              cols="12"
              sm="6"
            >
              <div class="text-caption text-medium-emphasis">
                NIM
              </div>
              <div class="text-body-1 font-weight-bold">
                {{ selectedDetail.nim }}
              </div>
            </VCol>
            <VCol
              cols="12"
              sm="6"
            >
              <div class="text-caption text-medium-emphasis">
                Nama Mahasiswa
              </div>
              <div class="text-body-1 font-weight-medium">
                {{ selectedDetail.mahasiswa?.nama || '-' }}
              </div>
            </VCol>
            <VCol
              cols="12"
              sm="6"
            >
              <div class="text-caption text-medium-emphasis">
                Tahun Akademik
              </div>
              <div class="text-body-1">
                {{ selectedDetail.th_akademik ? `${selectedDetail.th_akademik.nama} - ${selectedDetail.th_akademik.semester}` : '-' }}
              </div>
            </VCol>
            <VCol
              cols="12"
              sm="6"
            >
              <div class="text-caption text-medium-emphasis">
                Tanggal
              </div>
              <div class="text-body-1">
                {{ selectedDetail.tanggal || '-' }}
              </div>
            </VCol>
            <VCol
              v-if="selectedDetail.pembayaran"
              cols="12"
              sm="6"
            >
              <div class="text-caption text-medium-emphasis">
                Nomor Pembayaran
              </div>
              <div class="text-body-1">
                {{ selectedDetail.pembayaran.nomor || '-' }}
              </div>
            </VCol>
            <VCol
              cols="12"
              sm="6"
            >
              <div class="text-caption text-medium-emphasis">
                Petugas Input
              </div>
              <div class="text-body-1">
                {{ selectedDetail.user?.name || selectedDetail.user?.username || '-' }}
              </div>
            </VCol>
            <VCol cols="12">
              <div class="text-caption text-medium-emphasis mb-1">
                Isi Catatan
              </div>
              <div class="border rounded pa-3 bg-var-theme-background">
                <span
                  v-if="selectedDetail.catatan"
                  style="white-space: pre-wrap;"
                >{{ selectedDetail.catatan }}</span>
                <span
                  v-else
                  class="text-medium-emphasis fst-italic"
                >(Tidak ada catatan)</span>
              </div>
            </VCol>
          </VRow>
        </VCardText>
        <VCardActions class="justify-end pa-4">
          <VBtn
            variant="outlined"
            @click="isDialogDetailVisible = false"
          >
            Tutup
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Dialog Delete -->
    <VDialog
      v-model="isDialogDeleteVisible"
      max-width="450"
    >
      <VCard>
        <VCardItem>
          <VCardTitle>Konfirmasi Hapus</VCardTitle>
        </VCardItem>
        <VCardText>
          Apakah Anda yakin ingin menghapus catatan untuk NIM <strong>{{ deleteData.nim }}</strong>?
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="isDialogDeleteVisible = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="error"
            @click="deleteDataSubmit(deleteData.id)"
          >
            Hapus
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
