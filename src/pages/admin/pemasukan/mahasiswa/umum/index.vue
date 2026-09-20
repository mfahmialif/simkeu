<script setup>
import { computed, onMounted, ref, watch } from "vue"
import { showSnackbar } from "@/composables/snackbar"
import { formatRupiah } from "@/composables/formatRupiah"
import { openFileExport } from "@/composables/exportFile"

// Role & User
const userData = useCookie("userData").value ?? {}
const userRole = computed(() => {
  const roleName = String(userData?.role?.name ?? "").toLowerCase().trim()
  if (roleName) return roleName
  const roleMap = {
    1: "admin",
    2: "pimpinan",
    3: "keuangan",
    4: "kabag",
    5: "staff",
    13: "kabag_pemasukan",
    14: "kabag_pengeluaran",
  }
  return roleMap[userData?.role_id] || ""
})

// Akses: admin, keuangan, kabag, staff, pimpinan
const canAccess = computed(() => {
  return ["admin", "keuangan", "kabag", "kabag_pemasukan", "kabag_pengeluaran", "staff", "staff_pemasukan", "pimpinan"].includes(userRole.value)
})

// Tambah / Edit: admin, keuangan, kabag, staff, pimpinan
const canManage = computed(() => {
  return ["admin", "keuangan", "kabag", "kabag_pemasukan", "kabag_pengeluaran", "staff", "staff_pemasukan", "pimpinan"].includes(userRole.value)
})

// Hapus: HANYA role admin dan kabag
const canDelete = computed(() => {
  return ["admin", "kabag", "kabag_pemasukan"].includes(userRole.value)
})

const currentUserName = computed(() => userData?.name || userData?.username || "Petugas")

// Datatable state
const page = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref({ key: "id", order: "desc" })
const search = ref("")
const selectedRows = ref([])
const dataTable = ref([])
const totalItems = ref(0)
const loading = ref(true)
const initialLoading = ref(true)

// Filter state
const filterDateRange = ref("")
const filterMinNominal = ref("")
const filterMaxNominal = ref("")
const filterJenisPembayaran = ref(null)

// Jenis Pembayaran State
const jenisPembayaranList = ref([])
const loadingJenisPembayaran = ref(false)

const getJenisPembayaranColor = (nama = "") => {
  const n = String(nama).toLowerCase()
  if (n.includes("cash") || n.includes("tunai")) return "success"
  if (n.includes("transfer") || n.includes("tf")) return "primary"
  if (n.includes("yayasan") || n.includes("yys")) return "warning"
  return "info"
}

const fetchJenisPembayaran = async () => {
  try {
    loadingJenisPembayaran.value = true
    const res = await $api("/admin/pemasukan/mahasiswa/jenis-pembayaran", {
      method: "GET",
      params: { limit: 0, manual_only: 1 },
    })
    const items = res?.data?.data ?? res?.data ?? []
    jenisPembayaranList.value = items.map(jp => ({
      title: `${jp.nama} (${jp.kategori})`,
      value: jp.id,
      nama: jp.nama,
      kategori: jp.kategori,
    }))
  } catch (err) {
    console.error("Gagal mengambil jenis pembayaran:", err)
  } finally {
    loadingJenisPembayaran.value = false
  }
}

// Stats state
const stats = ref({
  total_nominal: 0,
  total_transaksi: 0,
  nominal_bulan_ini: 0,
  transaksi_bulan_ini: 0,
})
const loadingStats = ref(false)

// Download PDF states
const downloadingPdfId = ref(null)
const downloadingBundlingPdf = ref(false)

// Format date time helper
const formatDateTime = value => {
  if (!value) return "-"
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

// Format date time for input (YYYY-MM-DDTHH:mm)
const formatForDateTimeInput = (d = new Date()) => {
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Fetch Stats
const fetchStats = async () => {
  try {
    loadingStats.value = true

    const params = {}
    if (filterDateRange.value) {
      const dates = filterDateRange.value.split(" to ")
      if (dates[0]) params.start_date = dates[0]
      if (dates[1] || dates[0]) params.end_date = dates[1] || dates[0]
    }
    if (filterJenisPembayaran.value) {
      params.jenis_pembayaran_id = filterJenisPembayaran.value
    }

    const response = await $api("/admin/pemasukan/mahasiswa/pemasukan-umum/stats", {
      method: "GET",
      params,
    })

    if (response?.data) {
      stats.value = response.data
    }
  } catch (err) {
    console.error("Gagal mengambil statistik pemasukan umum:", err)
  } finally {
    loadingStats.value = false
  }
}

// Fetch Data Table
const fetchData = async () => {
  try {
    loading.value = true

    const params = {
      page: page.value,
      limit: itemsPerPage.value,
      sort_key: sortBy.value.key,
      sort_order: sortBy.value.order,
    }

    if (search.value && search.value.trim() !== "") {
      params.search = search.value.trim()
    }

    if (filterDateRange.value) {
      const dates = filterDateRange.value.split(" to ")
      if (dates[0]) params.start_date = dates[0]
      if (dates[1] || dates[0]) params.end_date = dates[1] || dates[0]
    }

    if (filterJenisPembayaran.value) {
      params.jenis_pembayaran_id = filterJenisPembayaran.value
    }

    if (filterMinNominal.value !== "" && filterMinNominal.value !== null && filterMinNominal.value !== undefined) {
      params.min_nominal = filterMinNominal.value
    }
    if (filterMaxNominal.value !== "" && filterMaxNominal.value !== null && filterMaxNominal.value !== undefined) {
      params.max_nominal = filterMaxNominal.value
    }

    const response = await $api("/admin/pemasukan/mahasiswa/pemasukan-umum", {
      method: "GET",
      params,
    })

    if (response?.data) {
      dataTable.value = response.data.data || []
      totalItems.value = response.data.total || 0
    }
  } catch (err) {
    console.error("Gagal mengambil data pemasukan umum:", err)
    showSnackbar({
      text: err?.data?.message || "Gagal memuat data pemasukan umum.",
      color: "error",
    })
  } finally {
    loading.value = false
    if (initialLoading.value) initialLoading.value = false
  }
}

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb }) => {
  page.value = p
  itemsPerPage.value = ipp
  if (sb?.length) {
    sortBy.value = sb[0]
  }
  fetchData()
}

const applyFilter = () => {
  page.value = 1
  fetchData()
  fetchStats()
}

const resetFilter = () => {
  search.value = ""
  filterDateRange.value = ""
  filterJenisPembayaran.value = null
  filterMinNominal.value = ""
  filterMaxNominal.value = ""
  page.value = 1
  fetchData()
  fetchStats()
}

// Download Single PDF
const handleCetakSinglePdf = async item => {
  try {
    downloadingPdfId.value = item.id
    showSnackbar({
      text: `Menyiapkan PDF Bukti ${item.no_transaksi}...`,
      color: "info",
    })

    const blob = await $api(`/admin/pemasukan/mahasiswa/pemasukan-umum/${item.id}/pdf`, {
      method: "GET",
      headers: { Accept: "application/pdf" },
    })

    openFileExport(blob)
  } catch (err) {
    console.error("Gagal mencetak PDF bukti pemasukan:", err)
    showSnackbar({
      text: err?.data?.message || err?.response?._data?.message || err?.message || "Gagal mencetak PDF bukti pemasukan umum.",
      color: "error",
    })
  } finally {
    downloadingPdfId.value = null
  }
}

// Download Bundling PDF (Filter Rekap & Lampiran Scrolling)
const handleDownloadBundlingPdf = async () => {
  try {
    downloadingBundlingPdf.value = true
    showSnackbar({
      text: "Menyiapkan PDF Rekap Pemasukan Umum & Lampiran (Bundling)...",
      color: "info",
    })

    const params = {}
    if (search.value && search.value.trim() !== "") {
      params.search = search.value.trim()
    }
    if (filterDateRange.value) {
      const dates = filterDateRange.value.split(" to ")
      if (dates[0]) params.start_date = dates[0]
      if (dates[1] || dates[0]) params.end_date = dates[1] || dates[0]
    }
    if (filterJenisPembayaran.value) {
      params.jenis_pembayaran_id = filterJenisPembayaran.value
    }
    if (filterMinNominal.value !== "" && filterMinNominal.value != null) {
      params.min_nominal = filterMinNominal.value
    }
    if (filterMaxNominal.value !== "" && filterMaxNominal.value != null) {
      params.max_nominal = filterMaxNominal.value
    }

    const blob = await $api("/admin/pemasukan/mahasiswa/pemasukan-umum/pdf-bundling", {
      method: "GET",
      params,
      headers: { Accept: "application/pdf" },
    })

    openFileExport(blob)
  } catch (err) {
    console.error("Gagal mendownload PDF bundling:", err)
    showSnackbar({
      text: err?.data?.message || err?.response?._data?.message || err?.message || "Gagal mendownload PDF bundling.",
      color: "error",
    })
  } finally {
    downloadingBundlingPdf.value = false
  }
}

// Modal Form State
const isDialogFormVisible = ref(false)
const isEditMode = ref(false)
const formRef = ref(null)
const submitting = ref(false)

const formData = ref({
  id: null,
  jenis_pembayaran_id: null,
  tanggal: "",
  nominal: "",
  keterangan: "",
  lampiranFiles: [],
  existingLampiran: [],
  hapusLampiran: [],
})

const openAddDialog = () => {
  isEditMode.value = false
  const defaultCash = jenisPembayaranList.value.find(item =>
    item.nama.toLowerCase().includes("cash") || item.nama.toLowerCase().includes("tunai")
  )
  formData.value = {
    id: null,
    jenis_pembayaran_id: defaultCash ? defaultCash.value : (jenisPembayaranList.value[0]?.value ?? null),
    tanggal: formatForDateTimeInput(new Date()),
    nominal: "",
    keterangan: "",
    lampiranFiles: [],
    existingLampiran: [],
    hapusLampiran: [],
  }
  isDialogFormVisible.value = true
}

const openEditDialog = item => {
  isEditMode.value = true
  let formattedDate = formatForDateTimeInput(new Date())
  if (item.tanggal) {
    const d = new Date(item.tanggal)
    if (!isNaN(d.getTime())) {
      formattedDate = formatForDateTimeInput(d)
    } else {
      formattedDate = String(item.tanggal).slice(0, 16)
    }
  }

  formData.value = {
    id: item.id,
    jenis_pembayaran_id: item.jenis_pembayaran_id ?? item.jenis_pembayaran?.id ?? null,
    tanggal: formattedDate,
    nominal: item.nominal,
    keterangan: item.keterangan || "",
    lampiranFiles: [],
    existingLampiran: [...(item.lampiran_list || [])],
    hapusLampiran: [],
  }
  isDialogFormVisible.value = true
}

const toggleHapusExistingLampiran = path => {
  const index = formData.value.hapusLampiran.indexOf(path)
  if (index > -1) {
    formData.value.hapusLampiran.splice(index, 1)
  } else {
    formData.value.hapusLampiran.push(path)
  }
}

const submitForm = async () => {
  if (!formRef.value) return

  const { valid } = await formRef.value.validate()
  if (!valid) return

  try {
    submitting.value = true

    const data = new FormData()

    let tgl = formData.value.tanggal
    if (!tgl || tgl === "undefined" || tgl === "null") {
      tgl = formatForDateTimeInput(new Date())
    }
    data.append("tanggal", tgl)
    if (formData.value.jenis_pembayaran_id) {
      data.append("jenis_pembayaran_id", formData.value.jenis_pembayaran_id)
    }

    const cleanNominal = String(formData.value.nominal ?? "").replace(/[^0-9]/g, "")
    data.append("nominal", cleanNominal)
    data.append("keterangan", formData.value.keterangan || "")

    // Lampiran baru (multi file)
    if (formData.value.lampiranFiles) {
      const files = Array.isArray(formData.value.lampiranFiles)
        ? formData.value.lampiranFiles
        : [formData.value.lampiranFiles]

      files.forEach(f => {
        if (f instanceof File) {
          data.append("lampiran[]", f)
        }
      })
    }

    if (isEditMode.value) {
      data.append("_method", "PUT")

      // Lampiran yang dihapus
      if (formData.value.hapusLampiran.length > 0) {
        formData.value.hapusLampiran.forEach(path => {
          data.append("hapus_lampiran[]", path)
        })
      }

      await $api(`/admin/pemasukan/mahasiswa/pemasukan-umum/${formData.value.id}`, {
        method: "POST",
        body: data,
      })

      showSnackbar({
        text: "Data pemasukan umum berhasil diperbarui.",
        color: "success",
      })
    } else {
      await $api("/admin/pemasukan/mahasiswa/pemasukan-umum", {
        method: "POST",
        body: data,
      })

      showSnackbar({
        text: "Data pemasukan umum berhasil disimpan.",
        color: "success",
      })
    }

    isDialogFormVisible.value = false
    fetchData()
    fetchStats()
  } catch (err) {
    console.error("Gagal menyimpan pemasukan umum:", err)
    let errorMsg = "Gagal menyimpan data pemasukan umum."
    if (err?.data?.message) {
      errorMsg = err.data.message
    } else if (err?.response?._data?.message) {
      errorMsg = err.response._data.message
    } else if (err?.data?.errors && typeof err.data.errors === "object") {
      errorMsg = Object.values(err.data.errors).flat().join(", ")
    } else if (err?.message) {
      errorMsg = err.message
    }

    showSnackbar({
      text: errorMsg,
      color: "error",
    })
  } finally {
    submitting.value = false
  }
}

// Delete Dialog State
const isDialogDeleteVisible = ref(false)
const deleteData = ref({})
const deleting = ref(false)

const showDialogDelete = item => {
  deleteData.value = {
    id: item.id,
    no_transaksi: item.no_transaksi,
    nominal: item.nominal,
  }
  isDialogDeleteVisible.value = true
}

const handleDelete = async () => {
  if (!deleteData.value.id) return

  try {
    deleting.value = true
    await $api(`/admin/pemasukan/mahasiswa/pemasukan-umum/${deleteData.value.id}`, {
      method: "DELETE",
    })

    showSnackbar({
      text: "Data pemasukan umum berhasil dihapus.",
      color: "success",
    })

    isDialogDeleteVisible.value = false
    fetchData()
    fetchStats()
  } catch (err) {
    console.error("Gagal menghapus pemasukan umum:", err)
    showSnackbar({
      text: err?.data?.message || err?.response?._data?.message || err?.message || "Gagal menghapus data pemasukan umum.",
      color: "error",
    })
  } finally {
    deleting.value = false
  }
}

// Modal Preview Lampiran
const isPreviewModalVisible = ref(false)
const previewData = ref({
  title: "",
  url: "",
  name: "",
  isImage: false,
  isPdf: false,
})

const openPreviewFile = (fileItem, title = "Pratinjau Berkas") => {
  if (!fileItem?.url) return
  const ext = String(fileItem.name || fileItem.path || "").split(".").pop().toLowerCase()
  const isImg = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext)
  const isPdf = ext === "pdf"

  previewData.value = {
    title: title || fileItem.name,
    url: fileItem.url,
    name: fileItem.name,
    isImage: isImg,
    isPdf: isPdf,
  }
  isPreviewModalVisible.value = true
}

// Headers Table
const headers = [
  { title: "NO", key: "no", sortable: false, width: "60px", align: "center" },
  { title: "NO. TRANSAKSI", key: "no_transaksi", sortable: true, width: "165px" },
  { title: "TANGGAL & WAKTU", key: "tanggal", sortable: true, width: "170px" },
  { title: "METODE", key: "jenis_pembayaran", sortable: false, width: "140px" },
  { title: "NOMINAL", key: "nominal", sortable: true, width: "160px" },
  { title: "KETERANGAN", key: "keterangan", sortable: false },
  { title: "PETUGAS", key: "petugas_id", sortable: false, width: "150px" },
  { title: "LAMPIRAN", key: "lampiran", sortable: false, width: "130px", align: "center" },
  { title: "AKSI", key: "actions", sortable: false, width: "160px", align: "center" },
]

onMounted(() => {
  document.title = "Pemasukan Umum - SIMKEU"
  fetchJenisPembayaran()
  fetchStats()
  fetchData()
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between flex-wrap gap-4 mb-6">
      <div>
        <VBreadcrumbs
          :items="[
            { title: 'Beranda', to: '/admin/dashboard' },
            { title: 'Pemasukan', disabled: true },
            { title: 'Umum', disabled: true }
          ]"
          class="pa-0 mb-1"
        />
        <h3 class="text-h4 font-weight-bold">
          Pemasukan Umum
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-0">
          Kelola data transaksi pemasukan umum institusi, berkas lampiran, dan cetak dokumen resmi.
        </p>
      </div>

      <div class="d-flex align-center gap-3">
        <VBtn
          v-if="canManage"
          color="primary"
          prepend-icon="ri-add-line"
          @click="openAddDialog"
        >
          Tambah Pemasukan
        </VBtn>
      </div>
    </div>

    <!-- Alert Hak Akses jika bukan role yang diizinkan -->
    <VAlert
      v-if="!canAccess"
      type="error"
      variant="tonal"
      class="mb-6"
    >
      Anda tidak memiliki izin untuk mengakses halaman Pemasukan Umum.
    </VAlert>

    <!-- Stat Cards -->
    <VRow class="mb-6">
      <!-- Total Pemasukan -->
      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard class="h-100 border">
          <VCardText class="d-flex align-center justify-space-between">
            <div>
              <div class="text-caption text-medium-emphasis mb-1 font-weight-medium">
                TOTAL PEMASUKAN UMUM
              </div>
              <div class="text-h5 font-weight-bold text-success">
                {{ formatRupiah(stats.total_nominal || 0) }}
              </div>
            </div>
            <VAvatar
              color="success"
              variant="tonal"
              size="48"
              rounded
            >
              <VIcon
                icon="ri-money-dollar-circle-line"
                size="28"
              />
            </VAvatar>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Total Transaksi -->
      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard class="h-100 border">
          <VCardText class="d-flex align-center justify-space-between">
            <div>
              <div class="text-caption text-medium-emphasis mb-1 font-weight-medium">
                TOTAL TRANSAKSI
              </div>
              <div class="text-h5 font-weight-bold">
                {{ Number(stats.total_transaksi || 0).toLocaleString('id-ID') }}
                <span class="text-body-2 font-weight-regular text-medium-emphasis">Transaksi</span>
              </div>
            </div>
            <VAvatar
              color="info"
              variant="tonal"
              size="48"
              rounded
            >
              <VIcon
                icon="ri-file-list-3-line"
                size="28"
              />
            </VAvatar>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Pemasukan Bulan Ini -->
      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard class="h-100 border">
          <VCardText class="d-flex align-center justify-space-between">
            <div>
              <div class="text-caption text-medium-emphasis mb-1 font-weight-medium">
                PEMASUKAN BULAN INI
              </div>
              <div class="text-h5 font-weight-bold text-primary">
                {{ formatRupiah(stats.nominal_bulan_ini || 0) }}
              </div>
            </div>
            <VAvatar
              color="primary"
              variant="tonal"
              size="48"
              rounded
            >
              <VIcon
                icon="ri-calendar-check-line"
                size="28"
              />
            </VAvatar>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Transaksi Bulan Ini -->
      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard class="h-100 border">
          <VCardText class="d-flex align-center justify-space-between">
            <div>
              <div class="text-caption text-medium-emphasis mb-1 font-weight-medium">
                TRANSAKSI BULAN INI
              </div>
              <div class="text-h5 font-weight-bold text-warning">
                {{ Number(stats.transaksi_bulan_ini || 0).toLocaleString('id-ID') }}
                <span class="text-body-2 font-weight-regular text-medium-emphasis">Transaksi</span>
              </div>
            </div>
            <VAvatar
              color="warning"
              variant="tonal"
              size="48"
              rounded
            >
              <VIcon
                icon="ri-calendar-event-line"
                size="28"
              />
            </VAvatar>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Filter Card -->
    <VCard class="mb-6 border">
      <VCardItem class="pb-3">
        <VCardTitle class="text-subtitle-1 font-weight-bold d-flex align-center gap-2">
          <VIcon
            icon="ri-filter-3-line"
            size="20"
          />
          Filter & Pencarian
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <VRow>
          <!-- Search -->
          <VCol
            cols="12"
            sm="6"
            md="3"
          >
            <VTextField
              v-model="search"
              placeholder="Cari keterangan / petugas / nominal..."
              label="Pencarian"
              density="compact"
              clearable
              prepend-inner-icon="ri-search-line"
              @keyup.enter="applyFilter"
            />
          </VCol>

          <!-- Rentang Tanggal -->
          <VCol
            cols="12"
            sm="6"
            md="3"
          >
            <AppDateTimePicker
              v-model="filterDateRange"
              label="Rentang Tanggal"
              placeholder="Pilih rentang tanggal"
              density="compact"
              clearable
              :config="{ mode: 'range', dateFormat: 'Y-m-d' }"
            />
          </VCol>

          <!-- Metode Pembayaran -->
          <VCol
            cols="12"
            sm="6"
            md="2"
          >
            <VSelect
              v-model="filterJenisPembayaran"
              :items="jenisPembayaranList"
              label="Metode Pembayaran"
              placeholder="Semua Metode"
              density="compact"
              clearable
              :loading="loadingJenisPembayaran"
            />
          </VCol>

          <!-- Min Nominal -->
          <VCol
            cols="12"
            sm="6"
            md="2"
          >
            <VTextField
              v-model="filterMinNominal"
              label="Nominal Minimal"
              placeholder="Contoh: 100000"
              type="number"
              density="compact"
              clearable
            />
          </VCol>

          <!-- Max Nominal -->
          <VCol
            cols="12"
            sm="6"
            md="2"
          >
            <VTextField
              v-model="filterMaxNominal"
              label="Nominal Maksimal"
              placeholder="Contoh: 1000000"
              type="number"
              density="compact"
              clearable
            />
          </VCol>

          <!-- Action Buttons -->
          <VCol
            cols="12"
            class="d-flex align-center justify-end gap-2 flex-wrap pt-0"
          >
            <VBtn
              color="primary"
              density="compact"
              variant="elevated"
              prepend-icon="ri-search-line"
              @click="applyFilter"
            >
              Filter
            </VBtn>

            <VBtn
              variant="outlined"
              color="secondary"
              density="compact"
              prepend-icon="ri-refresh-line"
              @click="resetFilter"
            >
              Reset
            </VBtn>
          </VCol>
        </VRow>

        <VDivider class="my-3" />

        <!-- Tombol Download PDF Bundling di samping Filter -->
        <div class="d-flex align-center justify-space-between flex-wrap gap-2">
          <div class="text-caption text-medium-emphasis">
            Ditemukan <strong>{{ totalItems }}</strong> data transaksi pemasukan umum.
          </div>

          <div class="d-flex align-center gap-2 flex-wrap">
            <VBtn
              color="error"
              variant="tonal"
              density="compact"
              prepend-icon="ri-file-pdf-2-line"
              :loading="downloadingBundlingPdf"
              @click="handleDownloadBundlingPdf"
            >
              Download PDF (Bundling)
            </VBtn>
          </div>
        </div>
      </VCardText>
    </VCard>

    <!-- Data Table Card -->
    <VCard class="border">
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :items="dataTable"
        :items-length="totalItems"
        :headers="headers"
        :loading="loading"
        density="compact"
        class="text-no-wrap"
        @update:options="loadItems"
      >
        <!-- No Urut -->
        <template #item.no="{ index }">
          <span class="text-medium-emphasis">{{ (page - 1) * itemsPerPage + index + 1 }}</span>
        </template>

        <!-- No Transaksi -->
        <template #item.no_transaksi="{ item }">
          <VChip
            size="small"
            color="primary"
            variant="tonal"
            class="font-weight-medium"
          >
            {{ item.no_transaksi }}
          </VChip>
        </template>

        <!-- Tanggal & Waktu -->
        <template #item.tanggal="{ item }">
          <div>
            <div class="font-weight-medium">
              {{ formatDateTime(item.tanggal) }}
            </div>
          </div>
        </template>

        <!-- Metode Pembayaran -->
        <template #item.jenis_pembayaran="{ item }">
          <VChip
            size="small"
            :color="getJenisPembayaranColor(item.jenis_pembayaran?.nama)"
            variant="tonal"
            class="font-weight-medium"
          >
            {{ item.jenis_pembayaran?.nama || '-' }}
          </VChip>
        </template>

        <!-- Nominal -->
        <template #item.nominal="{ item }">
          <div class="font-weight-bold text-success">
            {{ formatRupiah(item.nominal) }}
          </div>
        </template>

        <!-- Keterangan -->
        <template #item.keterangan="{ item }">
          <div
            class="text-body-2 text-truncate"
            style="max-inline-size: 280px;"
            :title="item.keterangan"
          >
            {{ item.keterangan || '-' }}
          </div>
        </template>

        <!-- Petugas -->
        <template #item.petugas_id="{ item }">
          <div class="d-flex align-center gap-2">
            <VAvatar
              size="24"
              color="primary"
              variant="tonal"
            >
              <VIcon
                icon="ri-user-line"
                size="14"
              />
            </VAvatar>
            <span class="text-body-2 font-weight-medium">
              {{ item.petugas?.name || item.petugas?.username || '-' }}
            </span>
          </div>
        </template>

        <!-- Lampiran Column -->
        <template #item.lampiran="{ item }">
          <div v-if="item.lampiran_list && item.lampiran_list.length > 0">
            <VMenu location="bottom end">
              <template #activator="{ props }">
                <VChip
                  v-bind="props"
                  size="small"
                  color="info"
                  variant="tonal"
                  class="cursor-pointer"
                  prepend-icon="ri-attachment-line"
                >
                  {{ item.lampiran_list.length }} Berkas
                </VChip>
              </template>
              <VList density="compact">
                <VListItem
                  v-for="(att, aIdx) in item.lampiran_list"
                  :key="aIdx"
                  link
                  @click="openPreviewFile(att, `Lampiran Transaksi ${item.no_transaksi}`)"
                >
                  <template #prepend>
                    <VIcon
                      :icon="att.name.endsWith('.pdf') ? 'ri-file-pdf-line' : 'ri-image-line'"
                      size="18"
                      class="me-2"
                    />
                  </template>
                  <VListItemTitle class="text-caption">
                    {{ att.name }}
                  </VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </div>
          <span
            v-else
            class="text-medium-emphasis text-caption"
          >
            -
          </span>
        </template>

        <!-- Actions Column -->
        <template #item.actions="{ item }">
          <div class="d-flex align-center justify-center gap-1">
            <!-- Cetak PDF Single -->
            <VTooltip text="Cetak PDF Bukti Pemasukan">
              <template #activator="{ props }">
                <VBtn
                  v-bind="props"
                  icon
                  size="x-small"
                  color="info"
                  variant="text"
                  :loading="downloadingPdfId === item.id"
                  @click="handleCetakSinglePdf(item)"
                >
                  <VIcon
                    icon="ri-printer-line"
                    size="18"
                  />
                </VBtn>
              </template>
            </VTooltip>

            <!-- Edit (admin, keuangan, kabag, staff) -->
            <VTooltip
              v-if="canManage"
              text="Edit Pemasukan"
            >
              <template #activator="{ props }">
                <VBtn
                  v-bind="props"
                  icon
                  size="x-small"
                  color="warning"
                  variant="text"
                  @click="openEditDialog(item)"
                >
                  <VIcon
                    icon="ri-pencil-line"
                    size="18"
                  />
                </VBtn>
              </template>
            </VTooltip>

            <!-- Hapus (khusus admin & kabag) -->
            <VTooltip
              v-if="canDelete"
              text="Hapus Data"
            >
              <template #activator="{ props }">
                <VBtn
                  v-bind="props"
                  icon
                  size="x-small"
                  color="error"
                  variant="text"
                  @click="showDialogDelete(item)"
                >
                  <VIcon
                    icon="ri-delete-bin-line"
                    size="18"
                  />
                </VBtn>
              </template>
            </VTooltip>
          </div>
        </template>

        <!-- Empty State -->
        <template #no-data>
          <div class="text-center py-6">
            <VIcon
              icon="ri-inbox-line"
              size="48"
              class="text-medium-emphasis mb-2"
            />
            <div class="text-body-1 font-weight-medium">
              Tidak ada data pemasukan umum
            </div>
            <div class="text-caption text-medium-emphasis">
              Silakan sesuaikan filter atau tambahkan data transaksi baru.
            </div>
          </div>
        </template>
      </VDataTableServer>
    </VCard>

    <!-- Modal Form Tambah / Edit -->
    <VDialog
      v-model="isDialogFormVisible"
      max-width="650px"
      persistent
    >
      <VCard>
        <VCardTitle class="d-flex align-center justify-space-between pa-4">
          <div class="text-h6 font-weight-bold">
            {{ isEditMode ? 'Edit Pemasukan Umum' : 'Tambah Pemasukan Umum' }}
          </div>
          <VBtn
            icon
            variant="text"
            size="small"
            @click="isDialogFormVisible = false"
          >
            <VIcon icon="ri-close-line" />
          </VBtn>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-4">
          <VForm
            ref="formRef"
            @submit.prevent="submitForm"
          >
            <VRow>
              <!-- Tanggal & Waktu -->
              <VCol
                cols="12"
                md="6"
              >
                <AppDateTimePicker
                  v-model="formData.tanggal"
                  label="Tanggal & Waktu *"
                  placeholder="Pilih tanggal & waktu"
                  :config="{ enableTime: true, dateFormat: 'Y-m-d H:i', time_24hr: true }"
                  :rules="[v => !!v || 'Tanggal & waktu wajib diisi']"
                />
              </VCol>

              <!-- Metode Pembayaran -->
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="formData.jenis_pembayaran_id"
                  :items="jenisPembayaranList"
                  item-title="title"
                  item-value="value"
                  label="Metode / Jenis Pembayaran *"
                  placeholder="Pilih metode pembayaran"
                  :loading="loadingJenisPembayaran"
                  :rules="[v => !!v || 'Metode pembayaran wajib dipilih']"
                />
              </VCol>

              <!-- Nominal -->
              <VCol cols="12">
                <VTextField
                  v-model="formData.nominal"
                  label="Nominal (Rp) *"
                  placeholder="Contoh: 500000"
                  type="number"
                  prefix="Rp"
                  :messages="formData.nominal ? [formatRupiah(formData.nominal)] : []"
                  :rules="[
                    v => !!v || 'Nominal wajib diisi',
                    v => Number(v) > 0 || 'Nominal harus lebih dari 0'
                  ]"
                />
              </VCol>

              <!-- Keterangan -->
              <VCol cols="12">
                <VTextarea
                  v-model="formData.keterangan"
                  label="Keterangan / Keperluan (Opsional)"
                  placeholder="Contoh: Sumbangan operasional, sewa aula, dsb."
                  rows="3"
                />
              </VCol>

              <!-- Existing Lampiran (Edit Mode) -->
              <VCol
                v-if="isEditMode && formData.existingLampiran.length > 0"
                cols="12"
              >
                <div class="text-subtitle-2 font-weight-bold mb-2">
                  Berkas Lampiran Saat Ini:
                </div>
                <div class="d-flex flex-column gap-2">
                  <div
                    v-for="(att, idx) in formData.existingLampiran"
                    :key="idx"
                    class="d-flex align-center justify-space-between pa-2 rounded border"
                    :class="{ 'bg-error-subtle': formData.hapusLampiran.includes(att.path) }"
                  >
                    <div class="d-flex align-center gap-2 overflow-hidden">
                      <VIcon
                        :icon="att.name.endsWith('.pdf') ? 'ri-file-pdf-line' : 'ri-image-line'"
                        size="20"
                        :color="formData.hapusLampiran.includes(att.path) ? 'error' : 'primary'"
                      />
                      <span
                        class="text-body-2 text-truncate"
                        :style="formData.hapusLampiran.includes(att.path) ? 'text-decoration: line-through;' : ''"
                      >
                        {{ att.name }}
                      </span>
                    </div>

                    <div class="d-flex align-center gap-1 ms-2">
                      <VBtn
                        size="x-small"
                        variant="text"
                        color="info"
                        prepend-icon="ri-eye-line"
                        @click="openPreviewFile(att, att.name)"
                      >
                        Lihat
                      </VBtn>

                      <VBtn
                        size="x-small"
                        :color="formData.hapusLampiran.includes(att.path) ? 'secondary' : 'error'"
                        :variant="formData.hapusLampiran.includes(att.path) ? 'tonal' : 'text'"
                        @click="toggleHapusExistingLampiran(att.path)"
                      >
                        {{ formData.hapusLampiran.includes(att.path) ? 'Batal Hapus' : 'Hapus' }}
                      </VBtn>
                    </div>
                  </div>
                </div>
              </VCol>

              <!-- Upload Lampiran Baru (Multi File) -->
              <VCol cols="12">
                <VFileInput
                  v-model="formData.lampiranFiles"
                  label="Tambah Berkas Lampiran (Opsional, Bisa Multi File)"
                  placeholder="Pilih berkas lampiran"
                  multiple
                  chips
                  show-size
                  accept="image/*,application/pdf"
                  prepend-icon=""
                  prepend-inner-icon="ri-attachment-line"
                  hint="Format diperbolehkan: Gambar (JPG, PNG) atau PDF. Maksimal 10MB per berkas."
                  persistent-hint
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn
            variant="outlined"
            color="secondary"
            :disabled="submitting"
            @click="isDialogFormVisible = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="primary"
            :loading="submitting"
            @click="submitForm"
          >
            {{ isEditMode ? 'Simpan Perubahan' : 'Simpan Pemasukan' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Modal Delete Confirmation (Khusus Admin & Kabag) -->
    <VDialog
      v-model="isDialogDeleteVisible"
      max-width="450px"
    >
      <VCard>
        <VCardItem class="pb-2">
          <VCardTitle class="text-h6 text-error d-flex align-center gap-2">
            <VIcon
              icon="ri-error-warning-line"
              color="error"
            />
            Hapus Pemasukan Umum
          </VCardTitle>
        </VCardItem>

        <VCardText>
          Apakah Anda yakin ingin menghapus data transaksi <strong>{{ deleteData.no_transaksi }}</strong> sejumlah <strong>{{ formatRupiah(deleteData.nominal) }}</strong>?
          <div class="text-caption text-error mt-2">
            * Seluruh file lampiran terkait juga akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
          </div>
        </VCardText>

        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn
            variant="outlined"
            color="secondary"
            :disabled="deleting"
            @click="isDialogDeleteVisible = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="error"
            :loading="deleting"
            @click="handleDelete"
          >
            Ya, Hapus
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Modal Pratinjau Lampiran -->
    <VDialog
      v-model="isPreviewModalVisible"
      max-width="850px"
    >
      <VCard>
        <VCardTitle class="d-flex align-center justify-space-between pa-4">
          <div class="text-subtitle-1 font-weight-bold text-truncate">
            {{ previewData.title }}
          </div>
          <div class="d-flex align-center gap-1">
            <VBtn
              v-if="previewData.url"
              icon
              variant="text"
              size="small"
              color="primary"
              :href="previewData.url"
              target="_blank"
              title="Buka di tab baru"
            >
              <VIcon icon="ri-external-link-line" />
            </VBtn>
            <VBtn
              icon
              variant="text"
              size="small"
              @click="isPreviewModalVisible = false"
            >
              <VIcon icon="ri-close-line" />
            </VBtn>
          </div>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-4 text-center">
          <!-- Image Viewer -->
          <div
            v-if="previewData.isImage"
            class="d-flex justify-center align-center"
          >
            <img
              :src="previewData.url"
              alt="Pratinjau Berkas"
              style="max-inline-size: 100%; max-block-size: 70vh; object-fit: contain;"
              class="rounded border"
            />
          </div>

          <!-- PDF Viewer -->
          <div
            v-else-if="previewData.isPdf"
            style="block-size: 70vh;"
          >
            <iframe
              :src="previewData.url"
              style="inline-size: 100%; block-size: 100%; border: none;"
            />
          </div>

          <!-- Other Files -->
          <div
            v-else
            class="py-8"
          >
            <VIcon
              icon="ri-file-line"
              size="64"
              class="text-medium-emphasis mb-3"
            />
            <div class="text-body-1 font-weight-medium">
              Berkas: {{ previewData.name }}
            </div>
            <div class="text-caption text-medium-emphasis mb-4">
              Pratinjau langsung tidak didukung untuk tipe berkas ini.
            </div>
            <VBtn
              color="primary"
              :href="previewData.url"
              target="_blank"
              prepend-icon="ri-download-line"
            >
              Unduh / Buka Berkas
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
