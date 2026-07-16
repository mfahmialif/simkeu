<script setup>
import { downloadFileExport, openFileExport } from "@/composables/exportFile"

const props = defineProps({
  title: {
    type: String,
    default: "Pegawai",
  },
  fixedTipe: {
    type: String,
    default: null,
    validator: value => value === null || ["dosen", "staff"].includes(value),
  },
  documentTitle: {
    type: String,
    default: "",
  },
})

const userData = useCookie("userData").value ?? {}

const isAdmin = computed(
  () => String(userData.role?.name || "").toLowerCase() === "admin",
)

const page = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref({ key: "id", order: "desc" })
const search = ref("")
const selectedRows = ref([])
const selectAllPages = ref(false)
const isBatchUpdating = ref(false)
const dataTable = ref([])
const totalItems = ref(0)
const loading = ref(true)
const initialLoading = ref(true)
const route = useRoute()
const isAbsensiSettingMode = computed(() => route.query.filter_absensi === "1" || route.query.filter_absensi === "aktif" || route.query.filter_absensi === "tidak_aktif")
const selectedTipe = ref(props.fixedTipe)
const selectedJenisKelamin = ref(null)
const selectedStatus = ref(null)
const selectedStatusAbsensi = ref(route.query.filter_absensi === "aktif" ? "aktif" : (route.query.filter_absensi === "tidak_aktif" ? "tidak aktif" : null))
const selectedProdi = ref(null)
const prodiOptions = ref([])
const isLoadingExport = ref(false)
const isImportDialogVisible = ref(false)
const isImporting = ref(false)
const importFile = ref(null)
const importSummary = ref(null)
const isSlipDialogVisible = ref(false)
const isLoadingSlipPreview = ref(false)
const isDownloadingSlip = ref(false)
const slipPegawai = ref(null)
const slipBulan = ref(currentMonthValue())
const slipData = ref(null)
let searchTimer = null

const stats = ref({
  total: 0,
  dosen: 0,
  staff: 0,
  aktif: 0,
  tidak_aktif: 0,
  absensi_aktif: 0,
  absensi_tidak_aktif: 0,
})

const isTipeLocked = computed(() => Boolean(props.fixedTipe))
const showProdiFilter = computed(() => props.fixedTipe === "dosen")
const cardTitle = computed(() => props.title)
const listNameLower = computed(() => props.title.toLowerCase())
const addUrl = computed(() => "/admin/setting/pegawai/add")
const detailUrl = id => `/admin/setting/pegawai/detail/${id}`
const slipModules = computed(() => slipData.value?.modules || [])
const slipRows = computed(() => slipData.value?.rows || [])
const slipStats = computed(() => slipData.value?.stats || {})
const slipPeriodLabel = computed(() => slipData.value?.filters?.label || "-")

const filterColMd = computed(() => {
  if (props.fixedTipe === "staff") return 4

  return 3
})

const currentFilterPayload = () => {
  const tipe = props.fixedTipe || selectedTipe.value

  return {
    search: search.value,
    ...(tipe && { tipe }),
    ...(selectedJenisKelamin.value && {
      jenis_kelamin: selectedJenisKelamin.value,
    }),
    ...(selectedStatus.value && { status: selectedStatus.value }),
    ...(selectedStatusAbsensi.value && { status_absensi: selectedStatusAbsensi.value }),
    ...(showProdiFilter.value &&
      selectedProdi.value && { prodi_id: selectedProdi.value }),
  }
}

const tipeOptions = [
  { title: "Dosen", value: "dosen" },
  { title: "Staff", value: "staff" },
]

const jenisKelaminOptions = [
  { title: "Laki-laki", value: "Laki-laki" },
  { title: "Perempuan", value: "Perempuan" },
]

const statusOptions = [
  { title: "Aktif", value: "aktif" },
  { title: "Tidak Aktif", value: "tidak aktif" },
]

const statusAbsensiOptions = [
  { title: "Aktif di Absensi", value: "aktif" },
  { title: "Tidak Aktif / Sembunyikan", value: "tidak aktif" },
]

function currentMonthValue() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, "0")

  return `${now.getFullYear()}-${month}`
}

const statusStatCards = computed(() => [
  {
    title: "Aktif Umum",
    value: stats.value.aktif,
    icon: "ri-checkbox-circle-line",
    color: "success",
  },
  {
    title: "Aktif Absensi",
    value: stats.value.absensi_aktif || 0,
    icon: "ri-user-follow-line",
    color: "info",
  },
  {
    title: "Tidak Aktif",
    value: stats.value.tidak_aktif,
    icon: "ri-close-circle-line",
    color: "error",
  },
])

const statCards = computed(() => {
  if (props.fixedTipe === "dosen") {
    return [
      {
        title: "Total Dosen",
        value: stats.value.total,
        icon: "ri-graduation-cap-line",
        color: "info",
      },
      ...statusStatCards.value,
    ]
  }

  if (props.fixedTipe === "staff") {
    return [
      {
        title: "Total Staff",
        value: stats.value.total,
        icon: "ri-briefcase-line",
        color: "warning",
      },
      ...statusStatCards.value,
    ]
  }

  return [
    {
      title: "Total Pegawai",
      value: stats.value.total,
      icon: "ri-team-line",
      color: "primary",
    },
    {
      title: "Dosen",
      value: stats.value.dosen,
      icon: "ri-graduation-cap-line",
      color: "info",
    },
    {
      title: "Staff",
      value: stats.value.staff,
      icon: "ri-briefcase-line",
      color: "warning",
    },
    ...statusStatCards.value,
  ]
})

const fetchProdi = async () => {
  try {
    const response = await $api("/admin/prodi", {
      method: "GET",
      body: {
        limit: 0,
        sort_key: "nama",
        sort_order: "asc",
      },
    })

    prodiOptions.value = (response?.data?.data || []).map(item => ({
      title: `${item.kode} - ${item.nama}`,
      value: item.id,
    }))
  } catch (err) {
    console.error(err)
  }
}

const fetchData = async () => {
  try {
    loading.value = true

    const response = await $api("/admin/pegawai", {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        ...currentFilterPayload(),
      },
    })

    dataTable.value = response.data.data
    totalItems.value = response.data.total
    stats.value = response.stats || stats.value
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
    if (initialLoading.value) initialLoading.value = false
  }
}

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb }) => {
  loading.value = true
  page.value = p
  itemsPerPage.value = ipp
  if (sb.length) sortBy.value = sb[0]
  fetchData()
}

const isDialogDeleteVisible = ref(false)
const deleteData = ref({})

const showDialogDelete = (id, name) => {
  deleteData.value = {
    id,
    name,
  }
  isDialogDeleteVisible.value = true
}

const errorMessage = err => {
  const message =
    err?.data?.message ||
    err?.response?._data?.message ||
    err?.response?.data?.message ||
    err?.message

  if (typeof message === "object") {
    return Object.values(message).flat().join("; ")
  }

  return message || "Terjadi kesalahan."
}

const deleteDataSubmit = async id => {
  try {
    const response = await $api("/admin/pegawai/" + id, {
      method: "DELETE",
    })

    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: "success",
      })

      fetchData()
    } else {
      showSnackbar({
        text: response.message,
        color: "error",
      })
    }
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    isDialogDeleteVisible.value = false
  }
}

const selectedIds = computed(() => selectedRows.value
  .map(row => (typeof row === "object" ? row?.id : row))
  .filter(Boolean))

const selectedCount = computed(() => (
  selectAllPages.value
    ? Number(totalItems.value || 0)
    : selectedIds.value.length
))

const batchUpdateStatusAbsensi = async status => {
  if (selectedCount.value === 0) return

  isBatchUpdating.value = true
  try {
    const response = await $api("/admin/pegawai/update-status-absensi", {
      method: "POST",
      body: {
        all_pages: selectAllPages.value,
        ids: selectedIds.value,
        filters: currentFilterPayload(),
        status_absensi: status,
      },
    })

    if (response.status === true) {
      showSnackbar({
        text: response.message || "Status absensi berhasil diperbarui",
        color: "success",
      })
      selectedRows.value = []
      selectAllPages.value = false
      fetchData()
    } else {
      showSnackbar({
        text: response.message || "Gagal memperbarui status absensi",
        color: "error",
      })
    }
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    isBatchUpdating.value = false
  }
}

const exportData = async () => {
  try {
    isLoadingExport.value = true

    const response = await $api("/admin/pegawai/export-excel", {
      method: "GET",
      headers: {
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      body: {
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        ...currentFilterPayload(),
      },
    })

    downloadFileExport(response, `Data ${props.title}.xlsx`)
    showSnackbar({
      text: `Data ${listNameLower.value} berhasil di download.`,
      color: "success",
    })
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    isLoadingExport.value = false
  }
}

const openImportDialog = () => {
  importFile.value = null
  importSummary.value = null
  isImportDialogVisible.value = true
}

const importData = async () => {
  const file = Array.isArray(importFile.value)
    ? importFile.value[0]
    : importFile.value

  if (!file) {
    showSnackbar({
      text: "Pilih file Excel terlebih dahulu.",
      color: "warning",
    })
    
    return
  }

  try {
    isImporting.value = true

    const formData = new FormData()

    formData.append("file", file)

    const tipe = props.fixedTipe || selectedTipe.value
    if (tipe) {
      formData.append("tipe", tipe)
    }

    const response = await $api("/admin/pegawai/import-excel", {
      method: "POST",
      body: formData,
    })

    importSummary.value = response.data || null
    showSnackbar({
      text: response.message || "Import data selesai.",
      color: "success",
    })
    fetchData()
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    isImporting.value = false
  }
}

const fetchSlipBarokahPreview = async () => {
  if (!slipPegawai.value?.id) return

  try {
    isLoadingSlipPreview.value = true

    const response = await $api(`/admin/pegawai/${slipPegawai.value.id}/slip-barokah`, {
      method: "GET",
      params: {
        bulan: slipBulan.value,
      },
    })

    if (response.status === true) {
      slipData.value = response.data || null

      return
    }

    showSnackbar({
      text: errorMessage(response),
      color: "error",
    })
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    isLoadingSlipPreview.value = false
  }
}

const openSlipBarokahDialog = item => {
  const bulan = currentMonthValue()

  slipPegawai.value = item
  slipData.value = null
  isSlipDialogVisible.value = true

  if (slipBulan.value === bulan) {
    fetchSlipBarokahPreview()
  } else {
    slipBulan.value = bulan
  }
}

const downloadSlipBarokah = async () => {
  if (!slipPegawai.value?.id) return

  try {
    isDownloadingSlip.value = true

    const response = await $api(`/admin/pegawai/${slipPegawai.value.id}/slip-barokah/download`, {
      method: "GET",
      headers: {
        Accept: "application/pdf",
      },
      params: {
        bulan: slipBulan.value,
      },
    })

    openFileExport(response)
    showSnackbar({
      text: "Slip barokah berhasil di download.",
      color: "success",
    })
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    isDownloadingSlip.value = false
  }
}

const resetFilters = () => {
  selectedTipe.value = props.fixedTipe || null
  selectedJenisKelamin.value = null
  selectedStatus.value = null
  selectedStatusAbsensi.value = null
  selectedProdi.value = null
  search.value = ""
  page.value = 1
  fetchData()
}

watch(
  [selectedTipe, selectedJenisKelamin, selectedStatus, selectedStatusAbsensi, selectedProdi],
  () => {
    selectedRows.value = []
    selectAllPages.value = false
    page.value = 1
    fetchData()
  },
)

watch(selectAllPages, enabled => {
  selectedRows.value = enabled ? dataTable.value.map(item => item.id) : []
})

watch(dataTable, () => {
  if (selectAllPages.value) {
    selectedRows.value = dataTable.value.map(item => item.id)
  }
})

watch(search, () => {
  page.value = 1
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchData()
  }, 450)
})

watch(slipBulan, () => {
  if (!isSlipDialogVisible.value || !slipPegawai.value?.id) return

  fetchSlipBarokahPreview()
})

watch(
  () => props.fixedTipe,
  tipe => {
    selectedTipe.value = tipe || null
    selectedProdi.value = null
    page.value = 1
    fetchData()
  },
)

onMounted(() => {
  document.title = `${props.documentTitle || props.title} - SIMKEU`

  if (showProdiFilter.value) fetchProdi()
})
</script>

<template>
  <div>
    <div
      class="pegawai-stat-grid mb-4"
      :style="{ '--stat-count': statCards.length }"
    >
      <VCard
        v-for="item in statCards"
        :key="item.title"
      >
        <VCardText class="d-flex align-center justify-space-between">
          <div>
            <div class="text-sm text-medium-emphasis">
              {{ item.title }}
            </div>
            <div class="text-h5 font-weight-medium">
              {{ item.value }}
            </div>
          </div>
          <VAvatar
            :color="item.color"
            variant="tonal"
            rounded
          >
            <VIcon :icon="item.icon" />
          </VAvatar>
        </VCardText>
      </VCard>
    </div>

    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>{{ cardTitle }}</VCardTitle>
      </VCardItem>

      <VDivider />

      <VCardText>
        <VRow>
          <VCol
            cols="12"
            :md="filterColMd"
          >
            <VTextField
              v-model="search"
              placeholder="Search Data"
              density="compact"
              clearable
              clear-icon="ri-close-line"
            />
          </VCol>

          <VCol
            v-if="!isTipeLocked"
            cols="12"
            :md="filterColMd"
          >
            <VSelect
              v-model="selectedTipe"
              :items="tipeOptions"
              label="Tipe"
              density="compact"
              clearable
              clear-icon="ri-close-line"
            />
          </VCol>

          <VCol
            cols="12"
            :md="filterColMd"
          >
            <VSelect
              v-model="selectedJenisKelamin"
              :items="jenisKelaminOptions"
              label="Jenis Kelamin"
              density="compact"
              clearable
              clear-icon="ri-close-line"
            />
          </VCol>

          <VCol
            cols="12"
            :md="filterColMd"
          >
            <VSelect
              v-model="selectedStatus"
              :items="statusOptions"
              label="Status Umum"
              density="compact"
              clearable
              clear-icon="ri-close-line"
            />
          </VCol>

          <VCol
            cols="12"
            :md="filterColMd"
          >
            <VSelect
              v-model="selectedStatusAbsensi"
              :items="statusAbsensiOptions"
              label="Status Absensi"
              density="compact"
              clearable
              clear-icon="ri-close-line"
            />
          </VCol>

          <VCol
            v-if="showProdiFilter"
            cols="12"
            :md="filterColMd"
          >
            <VSelect
              v-model="selectedProdi"
              :items="prodiOptions"
              label="Prodi"
              density="compact"
              clearable
              clear-icon="ri-close-line"
            />
          </VCol>
        </VRow>

        <div class="pegawai-actions d-flex justify-end flex-wrap gap-3 mt-4">
          <VBtn
            class="pegawai-action-btn"
            variant="outlined"
            color="success"
            prepend-icon="ri-file-excel-2-line"
            :loading="isLoadingExport"
            @click="exportData"
          >
            Download Data
          </VBtn>

          <VBtn
            v-if="isAdmin"
            class="pegawai-action-btn"
            variant="outlined"
            color="primary"
            prepend-icon="ri-upload-cloud-2-line"
            @click="openImportDialog"
          >
            Import Data
          </VBtn>

          <VBtn
            class="pegawai-action-btn"
            variant="outlined"
            color="secondary"
            prepend-icon="ri-filter-off-line"
            @click="resetFilters"
          >
            Reset Filter
          </VBtn>

          <VBtn
            v-if="isAdmin"
            class="pegawai-action-btn"
            color="primary"
            prepend-icon="ri-add-line"
            @click="$router.push(addUrl)"
          >
            Add Data
          </VBtn>
        </div>

        <VAlert
          v-if="isAbsensiSettingMode"
          color="info"
          variant="tonal"
          icon="ri-user-settings-line"
          class="mt-4 w-100"
        >
          <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center gap-4">
            <div>
              <h4 class="text-h6 font-weight-bold text-info mb-1">
                Pengaturan Tampilan Pegawai di Form Absensi
              </h4>
              <p class="mb-0 text-body-2">
                Centang pegawai pada tabel di bawah ini, kemudian klik tombol <strong>Aktifkan di Absensi (Tampil)</strong> untuk menampilkan pegawai atau <strong>Nonaktifkan dari Absensi (Sembunyikan)</strong> untuk menyembunyikan dari form Add & Edit Absensi.
              </p>
            </div>
          </div>
        </VAlert>

        <VCard
          v-if="isAdmin && selectedCount > 0"
          color="light-info"
          class="mt-4 w-100 pa-4 border border-info"
        >
          <div class="d-flex flex-column flex-sm-row align-center justify-space-between gap-4">
            <div class="d-flex align-center flex-wrap gap-4">
              <div class="d-flex align-center gap-2">
                <VIcon icon="ri-checkbox-multiple-line" color="info" size="24" />
                <span class="font-weight-medium text-info">
                  {{ selectedCount }} pegawai dipilih
                </span>
              </div>
              <VCheckbox
                v-model="selectAllPages"
                label="Pilih semua halaman (sesuai filter aktif)"
                color="info"
                density="compact"
                hide-details
              />
            </div>
            <div class="d-flex flex-wrap gap-2">
              <VBtn
                color="success"
                prepend-icon="ri-check-line"
                :loading="isBatchUpdating"
                @click="batchUpdateStatusAbsensi('aktif')"
              >
                Aktifkan di Absensi (Tampil)
              </VBtn>
              <VBtn
                color="secondary"
                prepend-icon="ri-close-line"
                :loading="isBatchUpdating"
                @click="batchUpdateStatusAbsensi('tidak aktif')"
              >
                Nonaktifkan dari Absensi (Sembunyikan)
              </VBtn>
              <VBtn
                variant="text"
                color="error"
                @click="selectedRows = []; selectAllPages = false"
              >
                Batal Pilih
              </VBtn>
            </div>
          </div>
        </VCard>
      </VCardText>

      <VDataTableServer
        v-model:model-value="selectedRows"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :show-select="isAdmin"
        :headers="[
          { title: 'No', key: 'id', width: 60 },
          { title: 'Nama', key: 'nama' },
          { title: 'Kode', key: 'kode' },
          { title: 'Tipe', key: 'tipe' },
          { title: 'Jenis Kelamin', key: 'jenis_kelamin' },
          { title: 'Prodi/Jabatan', key: 'unit' },
          { title: 'Email', key: 'email' },
          { title: 'Rekening', key: 'rekening', sortable: false },
          { title: 'Status Umum', key: 'status' },
          { title: 'Status Absensi', key: 'status_absensi' },
          { title: 'Actions', key: 'actions', sortable: false },
        ]"
        :items="dataTable"
        :items-length="totalItems"
        :loading="loading"
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
            <div>Memuat data {{ listNameLower }}...</div>
          </div>
        </template>

        <template
          v-else
          #no-data
        >
          <div class="text-center pa-4">
            Tidak ada data {{ listNameLower }}.
          </div>
        </template>

        <template #item.id="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </template>

        <template #item.nama="{ item }">
          <div class="d-flex flex-column">
            <RouterLink
              :to="detailUrl(item.id)"
              class="pegawai-name-link font-weight-medium"
            >
              {{ item.nama }}
            </RouterLink>
            <small class="text-medium-emphasis">{{ item.hp || "-" }}</small>
          </div>
        </template>

        <template #item.tipe="{ item }">
          <VChip
            :color="item.tipe === 'dosen' ? 'info' : 'warning'"
            size="small"
            label
          >
            {{ item.tipe === "dosen" ? "Dosen" : "Staff" }}
          </VChip>
        </template>

        <template #item.unit="{ item }">
          <span v-if="item.tipe === 'dosen'">
            {{ item.dosen?.prodi?.nama || "-" }}
          </span>
          <span v-else>
            {{ item.staff?.jabatan || "-" }}
          </span>
        </template>

        <template #item.email="{ item }">
          {{ item.email || "-" }}
        </template>

        <template #item.rekening="{ item }">
          <div class="d-flex flex-column">
            <span class="font-weight-medium">{{ item.nomer_rekening || "-" }}</span>
            <small class="text-medium-emphasis">{{ item.nama_pemilik_rekening || item.nama || "-" }}</small>
            <small class="text-medium-emphasis">{{ item.bank || "-" }}</small>
          </div>
        </template>

        <template #item.status="{ item }">
          <VChip
            :color="item.status === 'aktif' ? 'success' : 'error'"
            size="small"
            label
          >
            {{ item.status === "aktif" ? "Aktif" : "Tidak Aktif" }}
          </VChip>
        </template>

        <template #item.status_absensi="{ item }">
          <VChip
            :color="item.status_absensi === 'aktif' ? 'info' : 'secondary'"
            size="small"
            label
          >
            {{ item.status_absensi === "aktif" ? "Aktif (Tampil)" : "Tidak Aktif (Sembunyikan)" }}
          </VChip>
        </template>

        <template #item.actions="{ item }">
          <IconBtn size="small">
            <VIcon icon="ri-more-2-fill" />

            <VMenu activator="parent">
              <VList>
                <VListItem
                  value="detail"
                  prepend-icon="ri-eye-line"
                  @click="$router.push(detailUrl(item.id))"
                >
                  Detail
                </VListItem>

                <VListItem
                  value="slip-barokah"
                  prepend-icon="ri-receipt-line"
                  @click="openSlipBarokahDialog(item)"
                >
                  Slip Barokah
                </VListItem>

                <VListItem
                  v-if="isAdmin"
                  value="edit"
                  prepend-icon="ri-edit-box-line"
                  @click="$router.push(`/admin/setting/pegawai/edit/${item.id}`)"
                >
                  Edit
                </VListItem>

                <VListItem
                  v-if="isAdmin"
                  value="delete"
                  prepend-icon="ri-delete-bin-line"
                  @click="showDialogDelete(item.id, item.nama)"
                >
                  Delete
                </VListItem>
              </VList>
            </VMenu>
          </IconBtn>
        </template>
      </VDataTableServer>
    </VCard>

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
            class="me-2"
          />
          <span>
            Anda yakin ingin menghapus data pegawai ini? Penghapusan data tidak
            dapat dibatalkan.
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

    <VDialog
      v-model="isSlipDialogVisible"
      width="1040"
      scrollable
    >
      <VCard>
        <VCardItem class="pb-4">
          <VCardTitle>Slip Barokah</VCardTitle>
          <VCardSubtitle>
            {{ slipPegawai?.nama || "-" }}
          </VCardSubtitle>
        </VCardItem>

        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isSlipDialogVisible = false"
        />

        <VDivider />

        <VCardText>
          <VRow class="align-center">
            <VCol
              cols="12"
              md="4"
            >
              <VTextField
                v-model="slipBulan"
                type="month"
                label="Bulan"
                density="compact"
                prepend-inner-icon="ri-calendar-line"
                :disabled="isLoadingSlipPreview"
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <div class="slip-summary-box">
                <span class="text-medium-emphasis">Periode</span>
                <strong>{{ slipPeriodLabel }}</strong>
              </div>
            </VCol>

            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <div class="slip-summary-box">
                <span class="text-medium-emphasis">Total Barokah</span>
                <strong>{{ formatRupiah(slipStats.total || 0) }}</strong>
              </div>
            </VCol>
          </VRow>

          <VProgressLinear
            v-if="isLoadingSlipPreview"
            indeterminate
            color="primary"
            class="mb-4"
          />

          <div class="slip-module-grid mb-4">
            <div
              v-for="module in slipModules"
              :key="module.key"
              class="slip-module-item"
            >
              <div class="d-flex align-center justify-space-between gap-3">
                <div class="d-flex align-center gap-2">
                  <VAvatar
                    :color="module.color"
                    variant="tonal"
                    size="34"
                  >
                    <VIcon :icon="module.icon" />
                  </VAvatar>
                  <div>
                    <div class="font-weight-medium">
                      {{ module.short_label }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ module.jumlah || 0 }} data
                    </div>
                  </div>
                </div>
                <div class="font-weight-semibold text-end">
                  {{ formatRupiah(module.total || 0) }}
                </div>
              </div>
            </div>
          </div>

          <VDataTable
            :headers="[
              { title: 'No', key: 'no', sortable: false, width: 64 },
              { title: 'Tanggal', key: 'tanggal_label', width: 140 },
              { title: 'Modul', key: 'module_label', width: 140 },
              { title: 'Deskripsi', key: 'deskripsi' },
              { title: 'Rincian', key: 'detail_text' },
              { title: 'Total', key: 'total', align: 'end', width: 150 },
            ]"
            :items="slipRows"
            :loading="isLoadingSlipPreview"
            :items-per-page="10"
            item-value="row_key"
            class="slip-preview-table"
            no-data-text="Belum ada pengeluaran pada bulan ini."
          >
            <template #item.no="{ index }">
              {{ index + 1 }}
            </template>

            <template #item.module_label="{ item }">
              <VChip
                :color="item.module_color"
                size="small"
                label
              >
                {{ item.module_label }}
              </VChip>
            </template>

            <template #item.deskripsi="{ item }">
              <div class="slip-detail-text">
                {{ item.deskripsi || "-" }}
              </div>
            </template>

            <template #item.detail_text="{ item }">
              <div class="slip-detail-text text-medium-emphasis">
                {{ item.detail_text || "-" }}
              </div>
            </template>

            <template #item.total="{ item }">
              <span class="font-weight-medium">{{ formatRupiah(item.total || 0) }}</span>
            </template>
          </VDataTable>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            variant="outlined"
            color="secondary"
            prepend-icon="ri-refresh-line"
            :loading="isLoadingSlipPreview"
            @click="fetchSlipBarokahPreview"
          >
            Refresh
          </VBtn>

          <VBtn
            color="primary"
            prepend-icon="ri-file-pdf-2-line"
            :loading="isDownloadingSlip"
            :disabled="!slipPegawai?.id"
            @click="downloadSlipBarokah"
          >
            Download Slip
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <VDialog
      v-if="isAdmin"
      v-model="isImportDialogVisible"
      width="560"
    >
      <VCard :title="`Import Data ${title}`">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isImportDialogVisible = false"
        />

        <VCardText>
          <VFileInput
            v-model="importFile"
            label="File Excel"
            accept=".xlsx,.xls,.csv"
            prepend-icon="ri-file-excel-2-line"
            show-size
          />

          <VAlert
            v-if="importSummary"
            type="success"
            variant="tonal"
            class="mt-4"
          >
            {{ importSummary.created || 0 }} baru,
            {{ importSummary.updated || 0 }} diperbarui,
            {{ importSummary.skipped || 0 }} dilewati.
          </VAlert>

          <VAlert
            v-if="importSummary?.errors?.length"
            type="warning"
            variant="tonal"
            class="mt-3"
          >
            <div
              v-for="item in importSummary.errors"
              :key="item"
            >
              {{ item }}
            </div>
          </VAlert>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="isImportDialogVisible = false"
          >
            Tutup
          </VBtn>
          <VBtn
            color="primary"
            :loading="isImporting"
            @click="importData"
          >
            Import
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.pegawai-stat-grid {
  display: grid;
  grid-template-columns: repeat(var(--stat-count), minmax(0, 1fr));
  gap: 16px;
}

.pegawai-name-link {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}

.pegawai-name-link:hover {
  text-decoration: underline;
}

.slip-summary-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-block-size: 48px;
  padding: 10px 14px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
}

.slip-module-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.slip-module-item {
  padding: 12px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
}

.slip-detail-text {
  min-inline-size: 180px;
  white-space: normal;
}

@media (max-width: 959px) {
  .pegawai-stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .slip-module-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 599px) {
  .pegawai-stat-grid {
    grid-template-columns: 1fr;
  }

  .pegawai-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .pegawai-action-btn {
    inline-size: 100%;
  }

  .slip-module-grid {
    grid-template-columns: 1fr;
  }
}
</style>
