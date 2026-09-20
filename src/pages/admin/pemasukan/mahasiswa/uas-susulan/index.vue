<script setup>
const page = ref(1)
const itemsPerPage = ref(5)
const sortBy = ref({ key: "id", order: "desc" })
const search = ref("")
const selectedRows = ref([])
const dataTable = ref([])
const totalItems = ref(0)
const loading = ref(true)
const initialLoading = ref(true)

const userData = useCookie("userData").value ?? {}
const userRole = computed(() => String(userData?.role?.name ?? "").toLowerCase())
const canDelete = computed(() => ["admin", "kabag", "kabag_pemasukan"].includes(userRole.value))

const fetchData = async () => {
  try {
    const { data } = await $api("/admin/pemasukan/mahasiswa/uas-susulan", {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        search: search.value,
      },
    })

    dataTable.value = data.data
    totalItems.value = data.total

    fetchDetailData()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
    if (initialLoading.value) initialLoading.value = false
  }
}

const fetchDetailData = async () => {
  const nimList = dataTable.value.map(item => item.nim)

  if (!nimList.length) return

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
      mahasiswa: mhs ? mhs : false,
    }
  })
}

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb, search: s }) => {
  loading.value = true
  page.value = p
  itemsPerPage.value = ipp
  if (sb.length) sortBy.value = sb[0]
  fetchData()
}

// Detail Dialog State
const isDialogDetailVisible = ref(false)
const detailLoading = ref(false)
const selectedDetail = ref(null)

const showDetail = async item => {
  isDialogDetailVisible.value = true
  detailLoading.value = true
  selectedDetail.value = { ...item }

  try {
    const res = await $api(`/admin/pemasukan/mahasiswa/uas-susulan/${item.id}`, {
      method: "GET",
    })
    selectedDetail.value = {
      ...item,
      ...res,
      mahasiswa: res.mahasiswa || item.mahasiswa || null,
      th_akademik: res.th_akademik || {
        nama: item.th_akademik_nama,
        kode: item.th_akademik_kode,
        semester: item.th_akademik_semester,
      },
    }
  } catch (err) {
    console.error("Gagal mengambil detail UAS Susulan:", err)
    showSnackbar({
      text: "Gagal memuat detail data UAS Susulan",
      color: "error",
    })
  } finally {
    detailLoading.value = false
  }
}

const detailMkList = computed(() => {
  return selectedDetail.value?.uas_susulan_mk || selectedDetail.value?.uasSusulanMk || []
})

const detailTotalSks = computed(() => {
  return detailMkList.value.reduce((acc, curr) => {
    const sks = Number(curr.mk_detail?.sks_mk || curr.sks_mk || 0)
    return isNaN(sks) ? acc : acc + sks
  }, 0)
})

const getNilaiColor = item => {
  const huruf = String(item?.nilai_huruf || "").trim().toUpperCase()
  if (huruf === "A" || huruf === "A-") return "success"
  if (huruf === "B" || huruf === "B+") return "info"
  if (huruf === "C" || huruf === "C+") return "warning"
  if (huruf === "D" || huruf === "E" || huruf === "F") return "error"
  return "secondary"
}

// Delete Dialog State
const isDialogDeleteVisible = ref(false)
const deleteData = ref({})

const showDialogDelete = (id, nim, nama) => {
  deleteData.value = {
    id: id,
    name: nama ? `${nim} - ${nama}` : nim,
  }
  isDialogDeleteVisible.value = true
}

const deleteDataSubmit = async id => {
  try {
    const response = await $api(
      "/admin/pemasukan/mahasiswa/uas-susulan/full/" + id,
      {
        method: "DELETE",
      },
    )

    if (response.status === true) {
      showSnackbar({
        text: response.message || "Data UAS Susulan dan mata kuliah terkait berhasil dihapus.",
        color: "success",
      })

      fetchData()
    } else {
      showSnackbar({
        text: response.message || "Gagal menghapus data UAS Susulan.",
        color: "error",
      })
    }
  } catch (err) {
    const message = Array.isArray(err.data?.message)
      ? err.data.message.join("; ")
      : err.data?.message || err.message || "Terjadi kesalahan saat menghapus data."

    showSnackbar({
      text: message,
      color: "error",
    })
  } finally {
    isDialogDeleteVisible.value = false
  }
}

const tanggal = ref("")
const prodi = ref([])
const selectedProdi = ref("*")
const isLoadingProdi = ref(false)

const fetchProdi = async () => {
  try {
    isLoadingProdi.value = true

    const { data } = await $api("/admin/prodi", {
      method: "GET",
    })

    prodi.value.push({
      title: "Semua Prodi",
      value: "*",
    })

    prodi.value.push(
      ...data.data.map(prodi => {
        return {
          title: `${prodi.nama}`,
          value: prodi.id,
        }
      }),
    )
  } catch (err) {
    console.error(err)
  } finally {
    isLoadingProdi.value = false
  }
}

const isLoadingExcel = ref(false)

const downloadExcel = async () => {
  const valid = await refForm.value.validate()
  if (!valid.valid) return

  try {
    isLoadingExcel.value = true
    showSnackbar({
      text: "Loading...",
      color: "info",
    })

    const response = await $api("/admin/pemasukan/mahasiswa/uas-susulan/excel", {
      method: "GET",
      headers: {
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      body: {
        tanggal_print: tanggal.value,
        ...(selectedProdi.value && {
          prodi_id_print: selectedProdi.value,
        }),
      },
    })

    const namaProdi = selectedProdi.value === "*" ? "Semua Prodi" : prodi.value.find(item => item.value === selectedProdi.value)?.title

    downloadFileExport(response, `Catatan UAS Susulan ${namaProdi}.xlsx`)
    showSnackbar({
      text: "Laporan berhasil di download.",
      color: "success",
    })
  } catch (err) {
    showSnackbar({
      text: err.message,
      color: "error",
    })
  } finally {
    isLoadingExcel.value = false
  }
}

const refForm = ref(null)

onMounted(() => {
  document.title = "Catatan UAS Susulan - SIMKEU"
  tanggal.value = fDate(new Date())
  fetchData()
  fetchProdi()
})
</script>

<template>
  <div>
    <!-- Section Cetak -->
    <VCard class="mb-4">
      <VCardItem class="pb-4">
        <VCardTitle>Print</VCardTitle>
      </VCardItem>
      <VDivider />
      <VCardText>
        <VForm
          ref="refForm"
          @submit.prevent="downloadExcel"
        >
          <VRow class="mb-2">
            <!-- Input Tanggal -->
            <VCol
              cols="12"
              md="12"
            >
              <AppDateTimePicker
                v-model="tanggal"
                label="Tanggal"
                placeholder="Select date"
                :rules="[requiredValidator]"
                :config="{
                  altInput: true,
                  altFormat: 'F j, Y',
                  dateFormat: 'Y-m-d',
                }"
              />
            </VCol>

            <!-- 👉 Select Prodi -->
            <VCol
              cols="12"
              sm="12"
            >
              <VSelect
                v-model="selectedProdi"
                label="Select Prodi"
                placeholder="Select Prodi"
                :items="prodi"
                clearable
                clear-icon="ri-close-line"
                class="custom-bg-select"
                :rules="[requiredValidator]"
              />
            </VCol>
          </VRow>
          <VSpacer />
          <VBtn
            color="primary"
            prepend-icon="ri-printer-fill"
            :loading="isLoadingExcel"
            @click="downloadExcel"
          >
            Cetak
          </VBtn>
        </VForm>
      </VCardText>
    </VCard>

    <!-- Section Data UAS Susulan -->
    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>UAS Susulan</VCardTitle>
      </VCardItem>
      <VDivider />
      <VCardText class="d-flex flex-wrap gap-4">
        <div class="d-flex align-center w-100 w-sm-auto">
          <!-- 👉 Search  -->
          <VTextField
            v-model="search"
            placeholder="Search Data"
            style="inline-size: 200px"
            density="compact"
            class="me-3"
          />
        </div>

        <VSpacer />

        <div class="d-flex gap-x-4 align-center">
          <!-- 👉 Export button -->
          <VBtn
            variant="outlined"
            color="secondary"
            prepend-icon="ri-upload-2-line"
          >
            Export
          </VBtn>
        </div>
      </VCardText>

      <!-- 👉 Datatable  -->
      <VDataTableServer
        v-model:model-value="selectedRows"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :headers="[
          { title: 'No', key: 'id' },
          { title: 'Tahun Akademik', key: 'th_akademik_kode' },
          { title: 'Tanggal', key: 'tanggal' },
          { title: 'Nim', key: 'nim' },
          { title: 'Keterangan', key: 'keterangan' },
          { title: 'Actions', key: 'actions', sortable: false },
        ]"
        show-select
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
            <div>Memuat data uas susulan...</div>
          </div>
        </template>

        <template
          v-else
          #no-data
        >
          <div class="text-center pa-4">
            Tidak ada data uas susulan.
          </div>
        </template>

        <template #item.id="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </template>

        <template #item.th_akademik_kode="{ item }">
          {{ item.th_akademik_nama ? `${item.th_akademik_nama} - ${item.th_akademik_semester}` : (item.th_akademik_kode || '-') }}
        </template>

        <template #item.nim="{ item }">
          <div style="margin: 15px 0">
            <VChip
              color="primary"
              size="x-small"
              label
            >
              {{ item.nim }}
            </VChip>
            <div class="mt-1">
              <template v-if="item.mahasiswa">
                {{ item.mahasiswa.nama }} - {{ item.mahasiswa.prodi?.alias }} -
                {{ item.mahasiswa.jk?.kode }}
              </template>
              <template v-else-if="item.mahasiswa === false">
                Data tidak ditemukan di SIAKAD.<br>Silakan periksa kembali di SIAKAD.
              </template>
              <template v-else>
                <VProgressCircular
                  indeterminate
                  color="primary"
                  size="16"
                  width="2"
                  style="vertical-align: middle"
                />
              </template>
            </div>
          </div>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn size="small">
            <VIcon icon="ri-more-2-fill" />

            <VMenu activator="parent">
              <VList>
                <!-- Detail -->
                <VListItem
                  value="detail"
                  prepend-icon="ri-eye-line"
                  @click="showDetail(item)"
                >
                  Detail
                </VListItem>

                <!-- Edit -->
                <VListItem
                  value="edit"
                  prepend-icon="ri-edit-box-line"
                  @click="
                    $router.push(
                      `/admin/pemasukan/mahasiswa/uas-susulan/edit/${item.id}`
                    )
                  "
                >
                  Edit
                </VListItem>

                <!-- Delete (Khusus Admin dan Kabag) -->
                <VListItem
                  v-if="canDelete"
                  value="delete"
                  prepend-icon="ri-delete-bin-line"
                  @click="showDialogDelete(item.id, item.nim, item.mahasiswa?.nama)"
                >
                  Delete
                </VListItem>
              </VList>
            </VMenu>
          </IconBtn>
        </template>
      </VDataTableServer>
    </VCard>

    <!-- 👉 Modal Detail UAS Susulan -->
    <VDialog
      v-model="isDialogDetailVisible"
      width="850"
    >
      <VCard>
        <VCardItem class="pb-2">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center gap-2">
              <VIcon
                icon="ri-file-list-3-line"
                color="primary"
                size="24"
              />
              <VCardTitle class="text-h6 font-weight-bold">
                Detail UAS Susulan: {{ selectedDetail?.nim }}
              </VCardTitle>
            </div>
            <DialogCloseBtn
              variant="text"
              size="default"
              @click="isDialogDetailVisible = false"
            />
          </div>
        </VCardItem>
        <VDivider />

        <VCardText>
          <!-- Loading state -->
          <div
            v-if="detailLoading"
            class="text-center pa-8"
          >
            <VProgressCircular
              indeterminate
              color="primary"
              class="mb-3"
            />
            <div class="text-body-2 text-medium-emphasis">
              Memuat data detail UAS Susulan...
            </div>
          </div>

          <template v-else-if="selectedDetail">
            <!-- Informasi Mahasiswa & UAS Susulan -->
            <VRow class="mb-4">
              <VCol
                cols="12"
                md="6"
              >
                <div class="text-subtitle-2 font-weight-bold mb-2">
                  Informasi Mahasiswa
                </div>
                <VTable density="compact" class="border rounded text-no-wrap">
                  <tbody>
                    <tr>
                      <td class="font-weight-medium text-medium-emphasis" style="inline-size: 130px;">
                        NIM
                      </td>
                      <td>
                        <VChip
                          color="primary"
                          size="small"
                          label
                        >
                          {{ selectedDetail.nim }}
                        </VChip>
                      </td>
                    </tr>
                    <tr>
                      <td class="font-weight-medium text-medium-emphasis">
                        Nama
                      </td>
                      <td class="font-weight-bold">
                        {{ selectedDetail.mahasiswa?.nama || "-" }}
                      </td>
                    </tr>
                    <tr>
                      <td class="font-weight-medium text-medium-emphasis">
                        Program Studi
                      </td>
                      <td>
                        {{ selectedDetail.mahasiswa?.prodi?.nama || selectedDetail.mahasiswa?.prodi?.alias || "-" }}
                      </td>
                    </tr>
                    <tr>
                      <td class="font-weight-medium text-medium-emphasis">
                        Jenis Kelamin
                      </td>
                      <td>
                        {{ selectedDetail.mahasiswa?.jk?.nama || "-" }}
                      </td>
                    </tr>
                    <tr>
                      <td class="font-weight-medium text-medium-emphasis">
                        Kelas / Smt
                      </td>
                      <td>
                        {{ selectedDetail.mahasiswa?.kelas?.nama || "-" }} / Smt {{ selectedDetail.mahasiswa?.semester || "-" }}
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <div class="text-subtitle-2 font-weight-bold mb-2">
                  Informasi UAS Susulan
                </div>
                <VTable density="compact" class="border rounded text-no-wrap">
                  <tbody>
                    <tr>
                      <td class="font-weight-medium text-medium-emphasis" style="inline-size: 130px;">
                        Tahun Akademik
                      </td>
                      <td class="font-weight-bold">
                        {{ selectedDetail.th_akademik?.nama }} - {{ selectedDetail.th_akademik?.semester }} ({{ selectedDetail.th_akademik?.kode }})
                      </td>
                    </tr>
                    <tr>
                      <td class="font-weight-medium text-medium-emphasis">
                        Tanggal Daftar
                      </td>
                      <td>
                        <VChip
                          color="info"
                          size="small"
                          label
                        >
                          {{ selectedDetail.tanggal }}
                        </VChip>
                      </td>
                    </tr>
                    <tr>
                      <td class="font-weight-medium text-medium-emphasis">
                        Jumlah MK
                      </td>
                      <td>
                        <VChip
                          color="primary"
                          size="small"
                          label
                        >
                          {{ selectedDetail.uasSusulanMk?.length || 0 }} MK ({{ detailTotalSks }} SKS)
                        </VChip>
                      </td>
                    </tr>
                    <tr>
                      <td class="font-weight-medium text-medium-emphasis">
                        Keterangan
                      </td>
                      <td>
                        {{ selectedDetail.keterangan || "-" }}
                      </td>
                    </tr>
                    <tr>
                      <td class="font-weight-medium text-medium-emphasis">
                        Waktu Input
                      </td>
                      <td class="text-caption">
                        {{ selectedDetail.created_at || "-" }}
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </VCol>
            </VRow>

            <!-- Daftar Mata Kuliah UAS Susulan -->
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="text-subtitle-2 font-weight-bold">
                Daftar Mata Kuliah yang Diikuti:
              </div>
              <VChip
                color="primary"
                size="small"
                label
              >
                Total: {{ detailMkList.length }} MK | {{ detailTotalSks }} SKS
              </VChip>
            </div>

            <div
              v-if="!detailMkList.length"
              class="text-center pa-4 border rounded text-medium-emphasis"
            >
              Tidak ada mata kuliah terdaftar pada UAS Susulan ini.
            </div>

            <VTable
              v-else
              density="compact"
              class="border rounded text-no-wrap"
            >
              <thead>
                <tr>
                  <th style="inline-size: 50px;">
                    No
                  </th>
                  <th>Kode MK</th>
                  <th>Nama Mata Kuliah</th>
                  <th class="text-center">
                    SKS
                  </th>
                  <th class="text-center">
                    Smt
                  </th>
                  <th>Dosen Pengampu</th>
                  <th class="text-center">
                    Nilai
                  </th>
                  <th>Kelompok</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, idx) in detailMkList"
                  :key="item.id || item.jadwal_kuliah_id"
                >
                  <td>{{ idx + 1 }}</td>
                  <td class="font-weight-medium">
                    {{ item.mk_detail?.kode_mk || item.kode_mk || "-" }}
                  </td>
                  <td>
                    <span class="font-weight-bold">
                      {{ item.mk_detail?.nama_mk || item.nama_mk || `Mata Kuliah #${item.jadwal_kuliah_id}` }}
                    </span>
                  </td>
                  <td class="text-center">
                    {{ item.mk_detail?.sks_mk || item.sks_mk || "-" }}
                  </td>
                  <td class="text-center">
                    {{ item.mk_detail?.smt_mk || item.smt_mk || "-" }}
                  </td>
                  <td>
                    <span class="text-body-2">
                      {{ item.mk_detail?.dosen_nama || item.dosen_nama || "-" }}
                    </span>
                  </td>
                  <td class="text-center">
                    <VChip
                      v-if="(item.mk_detail?.nilai_akhir != null || item.mk_detail?.nilai_huruf)"
                      size="x-small"
                      :color="getNilaiColor(item.mk_detail)"
                      label
                    >
                      {{ item.mk_detail?.nilai_akhir != null ? item.mk_detail.nilai_akhir : '-' }}
                      <span v-if="item.mk_detail?.nilai_huruf"> ({{ item.mk_detail.nilai_huruf }})</span>
                    </VChip>
                    <span
                      v-else
                      class="text-medium-emphasis"
                    >-</span>
                  </td>
                  <td>
                    <span class="text-caption">
                      {{ item.mk_detail?.kelompok || item.kelompok || "-" }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </VTable>
          </template>
        </VCardText>

        <VCardText class="d-flex justify-end gap-3 pt-0">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="isDialogDetailVisible = false"
          >
            Tutup
          </VBtn>
          <VBtn
            v-if="selectedDetail"
            variant="tonal"
            color="info"
            prepend-icon="ri-external-link-line"
            @click="
              isDialogDetailVisible = false;
              $router.push(`/admin/pemasukan/mahasiswa/uas-susulan/detail/${selectedDetail.id}`);
            "
          >
            Halaman Penuh
          </VBtn>
          <VBtn
            v-if="selectedDetail"
            color="primary"
            prepend-icon="ri-edit-box-line"
            @click="
              isDialogDetailVisible = false;
              $router.push(`/admin/pemasukan/mahasiswa/uas-susulan/edit/${selectedDetail.id}`);
            "
          >
            Edit
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- 👉 Modal Delete UAS Susulan -->
    <VDialog
      v-model="isDialogDeleteVisible"
      width="500"
    >
      <VCard :title="'Hapus Data: ' + deleteData.name">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogDeleteVisible = false"
        />

        <VCardText class="d-flex align-center">
          <VIcon
            icon="ri-alert-line"
            size="32"
            class="me-2 text-warning"
          />
          <span>
            Anda yakin ingin menghapus data UAS Susulan ini? Data mata kuliah UAS Susulan terkait juga akan ikut terhapus dan tidak dapat dibatalkan.
          </span>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
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
            <VIcon
              icon="ri-delete-bin-line"
              class="me-1"
            />
            Hapus
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
