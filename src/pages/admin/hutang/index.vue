<script setup>
/* eslint-disable camelcase */
import { fetchPetugasPengeluaranOptions } from "@/composables/petugasPengeluaran"
import { formatRupiah } from "@/composables/formatRupiah"
import { showSnackbar } from "@/composables/snackbar"
import { computed, onMounted, ref, watch } from "vue"

const page = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref({ key: "tanggal", order: "desc" })
const search = ref("")
const selectedTipe = ref(null)
const tanggalMulai = ref(null)
const tanggalSelesai = ref(null)
const selectedRows = ref([])
const dataTable = ref([])
const totalItems = ref(0)
const loading = ref(true)
const initialLoading = ref(true)
const saving = ref(false)
const summary = ref({ total_hutang: 0, total_pelunasan: 0, saldo: 0 })
const lenderSummary = ref([])
const lenderOptions = ref([])
const hasLoadedLenderOptions = ref(false)
const canManageAll = ref(false)
const petugasOptions = ref([])
const selectedPetugas = ref(null)
const dialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const editingId = ref(null)
const deleteData = ref({})
let filterTimer = null
let activeRequestKey = ""
let latestRequestId = 0

const userData = useCookie("userData").value ?? {}

const form = ref({
  petugas_id: userData.id || null,
  pemberi_pinjaman: "",
  tanggal: new Date().toISOString().slice(0, 10),
  tipe: "hutang",
  nominal: null,
  keterangan: "",
})

const tipeOptions = [
  { title: "Hutang", value: "hutang" },
  { title: "Pelunasan", value: "pelunasan" },
]

const tipeFilterOptions = [
  { title: "Semua Tipe", value: null },
  ...tipeOptions,
]

const saldoColor = value => {
  if (value > 0) return "success"
  if (value < 0) return "error"

  return "secondary"
}

const tipeColor = tipe => (tipe === "hutang" ? "success" : "error")
const tipeLabel = tipe => (tipe === "hutang" ? "Hutang" : "Pelunasan")

const selectedTipeLabel = computed(() => {
  const selected = tipeOptions.find(item => item.value === selectedTipe.value)

  return selected?.title || "Semua tipe"
})

const selectedPetugasLabel = computed(() => {
  if (!selectedPetugas.value) return "Semua petugas"

  const selected = petugasOptions.value.find(item => String(item.value) === String(selectedPetugas.value))

  return selected?.title || "Petugas terpilih"
})

const periodeFilterLabel = computed(() => {
  if (tanggalMulai.value && tanggalSelesai.value) return `${tanggalMulai.value} s/d ${tanggalSelesai.value}`
  if (tanggalMulai.value) return `Mulai ${tanggalMulai.value}`
  if (tanggalSelesai.value) return `Sampai ${tanggalSelesai.value}`

  return "Semua tanggal"
})

const statFilterInfo = computed(() => {
  const parts = [
    periodeFilterLabel.value,
    selectedTipeLabel.value,
  ]

  if (canManageAll.value) parts.push(selectedPetugasLabel.value)
  if (search.value) parts.push(`Pencarian: "${search.value}"`)

  return parts.join(" | ")
})

const requestParams = computed(() => ({
  page: page.value,
  limit: itemsPerPage.value,
  sort_key: sortBy.value.key,
  sort_order: sortBy.value.order,
  search: search.value,
  ...(selectedPetugas.value && { petugas_id: selectedPetugas.value }),
  ...(selectedTipe.value && { tipe: selectedTipe.value }),
  ...(tanggalMulai.value && { tanggal_mulai: tanggalMulai.value }),
  ...(tanggalSelesai.value && { tanggal_selesai: tanggalSelesai.value }),
}))

const fetchData = async ({ includeOptions = false } = {}) => {
  const params = {
    ...requestParams.value,
    include_options: includeOptions || !hasLoadedLenderOptions.value,
  }

  const requestKey = JSON.stringify(params)

  if (activeRequestKey === requestKey) return

  try {
    activeRequestKey = requestKey

    const requestId = ++latestRequestId

    loading.value = true

    const response = await $api("/admin/hutang", {
      method: "GET",
      body: params,
    })

    if (requestId !== latestRequestId) return

    dataTable.value = response.data?.data || []
    totalItems.value = response.data?.total || dataTable.value.length
    summary.value = response.summary || { total_hutang: 0, total_pelunasan: 0, saldo: 0 }
    lenderSummary.value = response.lender_summary || []
    if (Array.isArray(response.lender_options)) {
      lenderOptions.value = response.lender_options
      hasLoadedLenderOptions.value = true
    }
    canManageAll.value = Boolean(response.can_manage_all)
  } catch (err) {
    console.error(err)
    showSnackbar({ color: "error", text: "Gagal memuat data hutang." })
  } finally {
    if (activeRequestKey === requestKey) activeRequestKey = ""
    if (!activeRequestKey) {
      loading.value = false
      if (initialLoading.value) initialLoading.value = false
    }
  }
}

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb }) => {
  const nextSort = sb.length ? sb[0] : sortBy.value

  const shouldFetch = page.value !== p
    || itemsPerPage.value !== ipp
    || sortBy.value.key !== nextSort.key
    || sortBy.value.order !== nextSort.order

  page.value = p
  itemsPerPage.value = ipp
  sortBy.value = nextSort

  if (shouldFetch) fetchData()
}

const resetForm = () => {
  editingId.value = null
  form.value = {
    petugas_id: selectedPetugas.value || userData.id || null,
    pemberi_pinjaman: "",
    tanggal: new Date().toISOString().slice(0, 10),
    tipe: "hutang",
    nominal: null,
    keterangan: "",
  }
}

const openCreate = () => {
  resetForm()
  dialogVisible.value = true
}

const openEdit = item => {
  editingId.value = item.id
  form.value = {
    petugas_id: item.petugas_id,
    pemberi_pinjaman: item.pemberi_pinjaman || "",
    tanggal: item.tanggal,
    tipe: item.tipe,
    nominal: item.nominal,
    keterangan: item.keterangan || "",
  }
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!form.value.pemberi_pinjaman || !form.value.tanggal || !form.value.tipe || !form.value.nominal) {
    showSnackbar({ color: "error", text: "Pemberi pinjaman, tanggal, tipe, dan nominal wajib diisi." })

    return
  }

  if (canManageAll.value && !form.value.petugas_id) {
    showSnackbar({ color: "error", text: "Petugas wajib dipilih." })

    return
  }

  saving.value = true
  try {
    const url = editingId.value ? `/admin/hutang/${editingId.value}` : "/admin/hutang"
    const method = editingId.value ? "PUT" : "POST"

    const response = await $api(url, {
      method,
      body: {
        petugas_id: form.value.petugas_id,
        pemberi_pinjaman: form.value.pemberi_pinjaman,
        tanggal: form.value.tanggal,
        tipe: form.value.tipe,
        nominal: Number(form.value.nominal),
        keterangan: form.value.keterangan,
      },
    })

    showSnackbar({ color: "success", text: response.message || "Data hutang berhasil disimpan." })
    dialogVisible.value = false
    resetForm()
    await fetchData({ includeOptions: true })
  } catch (err) {
    console.error(err)
    showSnackbar({ color: "error", text: "Gagal menyimpan data hutang." })
  } finally {
    saving.value = false
  }
}

const showDeleteDialog = item => {
  deleteData.value = item
  deleteDialogVisible.value = true
}

const resetFilters = () => {
  const alreadyReset = !search.value
    && !selectedPetugas.value
    && !selectedTipe.value
    && !tanggalMulai.value
    && !tanggalSelesai.value
    && page.value === 1

  search.value = ""
  selectedPetugas.value = null
  selectedTipe.value = null
  tanggalMulai.value = null
  tanggalSelesai.value = null
  page.value = 1

  if (alreadyReset) fetchData()
}

const deleteSubmit = async () => {
  try {
    const response = await $api(`/admin/hutang/${deleteData.value.id}`, {
      method: "DELETE",
    })

    showSnackbar({ color: "success", text: response.message || "Data hutang berhasil dihapus." })
    await fetchData({ includeOptions: true })
  } catch (err) {
    console.error(err)
    showSnackbar({ color: "error", text: "Gagal menghapus data hutang." })
  } finally {
    deleteDialogVisible.value = false
    deleteData.value = {}
  }
}

watch([search, selectedPetugas, selectedTipe, tanggalMulai, tanggalSelesai], () => {
  page.value = 1
  clearTimeout(filterTimer)
  filterTimer = setTimeout(() => fetchData(), 300)
})

onMounted(async () => {
  document.title = "Hutang - SIMKEU"
  try {
    petugasOptions.value = await fetchPetugasPengeluaranOptions()
  } catch (err) {
    console.error(err)
  }
  await fetchData({ includeOptions: true })
})
</script>

<template>
  <div>
    <div class="d-flex flex-wrap align-center justify-space-between gap-4 mb-6">
      <div>
        <h4 class="text-h4 font-weight-medium">
          Hutang
        </h4>
        <div class="text-body-1 text-medium-emphasis mt-1">
          Input hutang dan pelunasan direkap per pemberi pinjaman.
        </div>
      </div>

      <VBtn
        color="primary"
        prepend-icon="ri-add-line"
        @click="openCreate"
      >
        Input Hutang
      </VBtn>
    </div>

    <div class="d-flex flex-wrap align-center gap-2 mb-3 text-body-2 text-medium-emphasis">
      <VIcon
        icon="ri-filter-3-line"
        size="18"
      />
      <span>Stat card mengikuti filter: <span class="font-weight-medium">{{ statFilterInfo }}</span></span>
    </div>

    <VRow class="mb-4">
      <VCol
        cols="12"
        md="4"
      >
        <VCard>
          <VCardText>
            <div class="text-body-2 text-medium-emphasis mb-1">
              Total Hutang
            </div>
            <div class="text-h5 font-weight-medium text-success">
              {{ formatRupiah(summary.total_hutang || 0) }}
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol
        cols="12"
        md="4"
      >
        <VCard>
          <VCardText>
            <div class="text-body-2 text-medium-emphasis mb-1">
              Total Pelunasan
            </div>
            <div class="text-h5 font-weight-medium text-error">
              {{ formatRupiah(summary.total_pelunasan || 0) }}
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol
        cols="12"
        md="4"
      >
        <VCard>
          <VCardText>
            <div class="text-body-2 text-medium-emphasis mb-1">
              Saldo Hutang
            </div>
            <div
              class="text-h5 font-weight-medium"
              :class="`text-${saldoColor(summary.saldo || 0)}`"
            >
              {{ formatRupiah(summary.saldo || 0) }}
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VCard class="mb-4">
      <VCardTitle>Rekap per Pemberi Pinjaman</VCardTitle>
      <VCardText>
        <div
          v-if="lenderSummary.length === 0"
          class="text-body-2 text-medium-emphasis py-4"
        >
          Belum ada rekap hutang.
        </div>
        <VTable
          v-else
          density="comfortable"
        >
          <thead>
            <tr>
              <th>Pemberi Pinjaman</th>
              <th class="text-end">
                Hutang
              </th>
              <th class="text-end">
                Pelunasan
              </th>
              <th class="text-end">
                Sisa Hutang
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in lenderSummary"
              :key="item.pemberi_pinjaman"
            >
              <td class="font-weight-medium">
                {{ item.pemberi_pinjaman }}
              </td>
              <td class="text-end text-success">
                {{ formatRupiah(item.total_hutang || 0) }}
              </td>
              <td class="text-end text-error">
                {{ formatRupiah(item.total_pelunasan || 0) }}
              </td>
              <td
                class="text-end font-weight-medium"
                :class="`text-${saldoColor(item.saldo || 0)}`"
              >
                {{ formatRupiah(item.saldo || 0) }}
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>
    </VCard>

    <VCard>
      <VCardText class="d-flex flex-wrap gap-4 align-center">
        <VTextField
          v-model="search"
          prepend-inner-icon="ri-search-line"
          placeholder="Cari pemberi pinjaman, petugas, atau keterangan..."
          density="compact"
          hide-details
          style="inline-size: 280px"
        />

        <VSelect
          v-if="canManageAll"
          v-model="selectedPetugas"
          :items="petugasOptions"
          label="Filter Petugas"
          density="compact"
          clearable
          hide-details
          style="inline-size: 280px"
        />

        <VSelect
          v-model="selectedTipe"
          :items="tipeFilterOptions"
          label="Filter Tipe"
          density="compact"
          clearable
          hide-details
          style="inline-size: 180px"
        />

        <VTextField
          v-model="tanggalMulai"
          type="date"
          label="Tanggal Mulai"
          density="compact"
          hide-details
          style="inline-size: 180px"
        />

        <VTextField
          v-model="tanggalSelesai"
          type="date"
          label="Tanggal Selesai"
          density="compact"
          hide-details
          style="inline-size: 180px"
        />

        <VSpacer />

        <VBtn
          color="secondary"
          variant="tonal"
          prepend-icon="ri-filter-off-line"
          @click="resetFilters"
        >
          Reset
        </VBtn>

        <VBtn
          color="primary"
          variant="tonal"
          prepend-icon="ri-refresh-line"
          :loading="loading"
          @click="fetchData({ includeOptions: true })"
        >
          Refresh
        </VBtn>
      </VCardText>

      <VDataTableServer
        v-model:model-value="selectedRows"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :headers="[
          { title: 'No', key: 'no', width: 60, sortable: false },
          { title: 'Tanggal', key: 'tanggal' },
          { title: 'Petugas', key: 'petugas_name' },
          { title: 'Pemberi Pinjaman', key: 'pemberi_pinjaman' },
          { title: 'Tipe', key: 'tipe' },
          { title: 'Keterangan', key: 'keterangan', sortable: false },
          { title: 'Nominal', key: 'nominal', align: 'end' },
          { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
        ]"
        :items="dataTable"
        :items-length="totalItems"
        :loading="loading"
        :search="search"
        item-value="id"
        @update:options="loadItems"
      >
        <template
          v-if="initialLoading"
          #loading
        >
          <div class="text-center pa-4">
            <VProgressCircular
              indeterminate
              color="primary"
              class="mb-2"
            />
            <div>Memuat data...</div>
          </div>
        </template>

        <template
          v-else
          #no-data
        >
          <div class="text-center pa-4">
            Belum ada data hutang.
          </div>
        </template>

        <template #item.no="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </template>

        <template #item.tipe="{ item }">
          <VChip
            :color="tipeColor(item.tipe)"
            size="small"
            label
          >
            {{ tipeLabel(item.tipe) }}
          </VChip>
        </template>

        <template #item.nominal="{ item }">
          <span :class="`text-${tipeColor(item.tipe)} font-weight-medium`">
            {{ item.tipe === 'hutang' ? '+' : '-' }} {{ formatRupiah(item.nominal || 0) }}
          </span>
        </template>

        <template #item.actions="{ item }">
          <IconBtn size="small">
            <VIcon icon="ri-more-2-fill" />
            <VMenu activator="parent">
              <VList>
                <VListItem
                  value="edit"
                  prepend-icon="ri-edit-box-line"
                  @click="openEdit(item)"
                >
                  Edit
                </VListItem>
                <VListItem
                  value="delete"
                  prepend-icon="ri-delete-bin-line"
                  @click="showDeleteDialog(item)"
                >
                  Hapus
                </VListItem>
              </VList>
            </VMenu>
          </IconBtn>
        </template>
      </VDataTableServer>
    </VCard>

    <VDialog
      v-model="dialogVisible"
      width="640"
    >
      <VCard :title="editingId ? 'Edit Hutang' : 'Input Hutang'">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="dialogVisible = false"
        />

        <VCardText>
          <VForm @submit.prevent="submitForm">
            <VSelect
              v-if="canManageAll"
              v-model="form.petugas_id"
              :items="petugasOptions"
              label="Petugas"
              class="mb-4"
            />
            <VCombobox
              v-model="form.pemberi_pinjaman"
              :items="lenderOptions"
              label="Pemberi Pinjaman"
              placeholder="Nama pemberi pinjaman, misal A"
              clearable
              class="mb-4"
            />
            <VTextField
              v-model="form.tanggal"
              type="date"
              label="Tanggal"
              class="mb-4"
            />
            <VSelect
              v-model="form.tipe"
              :items="tipeOptions"
              label="Tipe"
              class="mb-4"
            />
            <VTextField
              v-model="form.nominal"
              type="number"
              min="1"
              label="Nominal"
              prefix="Rp"
              class="mb-4"
            />
            <VTextarea
              v-model="form.keterangan"
              label="Keterangan"
              rows="3"
              placeholder="Catatan hutang atau pelunasan"
              class="mb-4"
            />

            <div class="d-flex justify-end gap-4">
              <VBtn
                variant="outlined"
                color="secondary"
                @click="dialogVisible = false"
              >
                Batal
              </VBtn>
              <VBtn
                type="submit"
                color="primary"
                prepend-icon="ri-save-line"
                :loading="saving"
              >
                Simpan
              </VBtn>
            </div>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>

    <VDialog
      v-model="deleteDialogVisible"
      width="500"
    >
      <VCard title="Hapus Transaksi Hutang">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="deleteDialogVisible = false"
        />

        <VCardText>
          Anda yakin ingin menghapus transaksi {{ tipeLabel(deleteData.tipe) }} ke {{ deleteData.pemberi_pinjaman || '-' }} sebesar
          {{ formatRupiah(deleteData.nominal || 0) }}?
        </VCardText>

        <VCardText class="d-flex justify-end gap-4">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="deleteDialogVisible = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="error"
            prepend-icon="ri-delete-bin-line"
            @click="deleteSubmit"
          >
            Hapus
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
