<script setup>
/* eslint-disable camelcase */
import { computed, onMounted, ref, watch } from "vue"
import { showSnackbar } from "@/composables/snackbar"
import { formatRupiah } from "@/composables/formatRupiah"

definePage({
  meta: {
    roles: ["admin", "kabag", "kabag_pemasukan", "staff", "keuangan"],
  },
})

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
const canAccess = computed(() => ["admin", "kabag", "kabag_pemasukan", "staff", "keuangan"].includes(userRole.value))
const canManage = computed(() => ["admin", "kabag", "kabag_pemasukan", "staff", "keuangan"].includes(userRole.value))
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

const getMetodeColor = (nama = "") => {
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

    const response = await $api("/admin/pemasukan/mahasiswa/pengembalian/stats", {
      method: "GET",
      params,
    })

    if (response?.data) {
      stats.value = response.data
    }
  } catch (err) {
    console.error("Gagal mengambil statistik pengembalian:", err)
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

    const response = await $api("/admin/pemasukan/mahasiswa/pengembalian", {
      method: "GET",
      params,
    })

    if (response?.data) {
      dataTable.value = response.data.data || []
      totalItems.value = response.data.total || 0
    }
  } catch (err) {
    console.error("Gagal mengambil data pengembalian:", err)
    showSnackbar({
      text: err?.data?.message || "Gagal memuat data pengembalian dana.",
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
  filterMinNominal.value = ""
  filterMaxNominal.value = ""
  filterJenisPembayaran.value = null
  page.value = 1
  fetchData()
  fetchStats()
}

// Download Single PDF
const handleDownloadPdf = async item => {
  try {
    downloadingPdfId.value = item.id
    showSnackbar({
      text: `Menyiapkan PDF Bukti ${item.no_transaksi || item.id}...`,
      color: "info",
    })

    const res = await $api(`/admin/pemasukan/mahasiswa/pengembalian/${item.id}/pdf`, {
      method: "GET",
      responseType: "blob",
      headers: { Accept: "application/pdf" },
    })

    const blob = new Blob([res], { type: "application/pdf" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url

    const filename = `Bukti_Pengembalian_${String(item.no_transaksi || item.id).replace(/\//g, "-")}.pdf`

    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    showSnackbar({
      text: "PDF Bukti pengembalian dana berhasil diunduh.",
      color: "success",
    })
  } catch (err) {
    console.error("Gagal mendownload PDF pengembalian:", err)
    showSnackbar({
      text: "Gagal mendownload PDF bukti pengembalian dana.",
      color: "error",
    })
  } finally {
    downloadingPdfId.value = null
  }
}

// Download Bundling PDF
const handleDownloadBundlingPdf = async () => {
  try {
    downloadingBundlingPdf.value = true
    showSnackbar({
      text: "Menyiapkan PDF Rekap & Bundling pengembalian dana...",
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
    if (filterMinNominal.value !== "" && filterMinNominal.value !== null && filterMinNominal.value !== undefined) {
      params.min_nominal = filterMinNominal.value
    }
    if (filterMaxNominal.value !== "" && filterMaxNominal.value !== null && filterMaxNominal.value !== undefined) {
      params.max_nominal = filterMaxNominal.value
    }

    const res = await $api("/admin/pemasukan/mahasiswa/pengembalian/pdf-bundling", {
      method: "GET",
      params,
      responseType: "blob",
      headers: { Accept: "application/pdf" },
    })

    const blob = new Blob([res], { type: "application/pdf" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url

    const nowStr = new Date().toISOString().slice(0, 10)

    link.setAttribute("download", `Rekap_Pengembalian_Dana_${nowStr}.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    showSnackbar({
      text: "PDF Rekap bundling pengembalian dana berhasil diunduh.",
      color: "success",
    })
  } catch (err) {
    console.error("Gagal mendownload PDF bundling pengembalian:", err)
    showSnackbar({
      text: "Gagal mendownload PDF rekap bundling pengembalian dana.",
      color: "error",
    })
  } finally {
    downloadingBundlingPdf.value = false
  }
}

// Headers Table
const headers = [
  { title: "NO", key: "no", sortable: false, width: "60px", align: "center" },
  { title: "NO. TRANSAKSI", key: "no_transaksi", sortable: true, width: "165px" },
  { title: "TANGGAL & WAKTU", key: "tanggal", sortable: true, width: "170px" },
  { title: "METODE", key: "jenis_pembayaran_id", sortable: false, width: "120px", align: "center" },
  { title: "BANK & REK. TUJUAN", key: "no_rek_tujuan", sortable: false, width: "175px" },
  { title: "NOMINAL", key: "nominal", sortable: true, width: "150px" },
  { title: "PETUGAS", key: "petugas_id", sortable: false, width: "140px" },
  { title: "BUKTI MASUK", key: "file_bukti_masuk", sortable: false, align: "center", width: "130px" },
  { title: "BUKTI KELUAR", key: "file_bukti_keluar", sortable: false, align: "center", width: "130px" },
  { title: "KETERANGAN", key: "keterangan", sortable: false },
  { title: "AKSI", key: "actions", sortable: false, width: "130px", align: "center" },
]

// Pilihan Bank Populer
const bankList = [
  "BSI (Bank Syariah Indonesia)",
  "BCA",
  "Bank Mandiri",
  "BRI",
  "BNI",
  "Bank Jatim",
  "Bank Jatim Syariah",
  "Bank Muamalat",
  "CIMB Niaga",
  "Bank Permata",
  "Bank Danamon",
  "Bank BTN",
  "BCA Syariah",
  "Bank Mega",
  "Bank Sinarmas",
]

// Dialog Form (Add / Edit) State
const isDialogFormVisible = ref(false)
const isEditMode = ref(false)
const formRef = ref(null)
const submitting = ref(false)

const formData = ref({
  id: null,
  nominal: "",
  tanggal: "",
  jenis_pembayaran_id: null,
  nama_tujuan: "",
  nama_bank: "",
  no_rek_tujuan: "",
  keterangan: "",
  file_bukti_masuk: null,
  file_bukti_keluar: null,
  file_bukti_masuk_existing: null,
  file_bukti_keluar_existing: null,
  petugas_name: "",
})

// File Upload Validation Helpers (PDF / Image max 10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "webp"]

const validateFile = file => {
  const f = Array.isArray(file) ? file[0] : file
  if (!f) return true

  // Cek ukuran file
  if (f.size && f.size > MAX_FILE_SIZE) {
    return `Ukuran file (${(f.size / (1024 * 1024)).toFixed(2)} MB) melebihi batas maksimal 10MB.`
  }

  // Cek format file (ekstensi & MIME)
  const fileName = f.name || ""
  const ext = fileName ? fileName.split(".").pop().toLowerCase() : ""
  const mime = (f.type || "").toLowerCase()

  const isExtValid = ALLOWED_EXTENSIONS.includes(ext)
  const isMimeValid = mime.startsWith("image/") || mime === "application/pdf"

  if (fileName && !isExtValid && !isMimeValid) {
    return "Format file tidak didukung. Hanya file PDF dan Gambar (JPG, JPEG, PNG, WEBP) yang diperbolehkan."
  }

  return true
}

const fileMasukRules = computed(() => {
  const rules = []
  if (!isEditMode.value) {
    rules.push(v => {
      const f = Array.isArray(v) ? v[0] : v
      if (!f) return "File bukti dana masuk wajib diunggah."
      
      return true
    })
  }
  rules.push(validateFile)
  
  return rules
})

const fileKeluarRules = computed(() => {
  return [validateFile]
})

const openAddDialog = () => {
  isEditMode.value = false

  const now = new Date()
  const pad = n => String(n).padStart(2, "0")
  const defaultDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`

  let defaultJpId = null
  if (jenisPembayaranList.value.length > 0) {
    const cashItem = jenisPembayaranList.value.find(j =>
      j.nama?.toLowerCase().includes("cash") || j.nama?.toLowerCase().includes("tunai"),
    )

    defaultJpId = cashItem ? cashItem.value : jenisPembayaranList.value[0].value
  }

  formData.value = {
    id: null,
    nominal: "",
    tanggal: defaultDate,
    jenis_pembayaran_id: defaultJpId,
    nama_tujuan: "",
    nama_bank: "",
    no_rek_tujuan: "",
    keterangan: "",
    file_bukti_masuk: null,
    file_bukti_keluar: null,
    file_bukti_masuk_existing: null,
    file_bukti_keluar_existing: null,
    petugas_name: currentUserName.value,
  }
  isDialogFormVisible.value = true
}

const openEditDialog = item => {
  isEditMode.value = true

  let formattedDate = ""
  if (item.tanggal) {
    const d = new Date(item.tanggal)
    if (!isNaN(d.getTime())) {
      const pad = n => String(n).padStart(2, "0")

      formattedDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
    } else {
      formattedDate = String(item.tanggal).slice(0, 16)
    }
  }

  formData.value = {
    id: item.id,
    nominal: item.nominal,
    tanggal: formattedDate,
    jenis_pembayaran_id: item.jenis_pembayaran_id || item.jenis_pembayaran?.id || null,
    nama_tujuan: item.nama_tujuan || "",
    nama_bank: item.nama_bank || "",
    no_rek_tujuan: item.no_rek_tujuan || "",
    keterangan: item.keterangan || "",
    file_bukti_masuk: null,
    file_bukti_keluar: null,
    file_bukti_masuk_path: item.file_bukti_masuk,
    file_bukti_keluar_path: item.file_bukti_keluar,
    file_bukti_masuk_existing: resolveFileUrl(item, 'masuk'),
    file_bukti_keluar_existing: resolveFileUrl(item, 'keluar'),
    petugas_name: item.petugas?.name || currentUserName.value,
  }
  isDialogFormVisible.value = true
}

const submitForm = async () => {
  const validation = await formRef.value?.validate()
  if (!validation?.valid) return

  const fileMasuk = Array.isArray(formData.value.file_bukti_masuk)
    ? formData.value.file_bukti_masuk[0]
    : formData.value.file_bukti_masuk

  const fileKeluar = Array.isArray(formData.value.file_bukti_keluar)
    ? formData.value.file_bukti_keluar[0]
    : formData.value.file_bukti_keluar

  if (!isEditMode.value && !fileMasuk) {
    showSnackbar({
      text: "File bukti dana masuk wajib diunggah.",
      color: "warning",
    })
    
    return
  }

  if (fileMasuk) {
    const checkMasuk = validateFile(fileMasuk)
    if (checkMasuk !== true) {
      showSnackbar({ text: checkMasuk, color: "warning" })
      
      return
    }
  }

  if (fileKeluar) {
    const checkKeluar = validateFile(fileKeluar)
    if (checkKeluar !== true) {
      showSnackbar({ text: checkKeluar, color: "warning" })
      
      return
    }
  }

  try {
    submitting.value = true

    const fd = new FormData()

    fd.append("nominal", formData.value.nominal)
    fd.append("tanggal", formData.value.tanggal)
    fd.append("jenis_pembayaran_id", formData.value.jenis_pembayaran_id)
    fd.append("nama_tujuan", formData.value.nama_tujuan || "")
    fd.append("nama_bank", formData.value.nama_bank || "")
    fd.append("no_rek_tujuan", formData.value.no_rek_tujuan || "")
    fd.append("keterangan", formData.value.keterangan || "")

    if (fileMasuk) {
      fd.append("file_bukti_masuk", fileMasuk)
    }
    if (fileKeluar) {
      fd.append("file_bukti_keluar", fileKeluar)
    }

    if (isEditMode.value) {
      fd.append("_method", "PUT")

      const res = await $api(`/admin/pemasukan/mahasiswa/pengembalian/${formData.value.id}`, {
        method: "POST",
        body: fd,
      })

      showSnackbar({
        text: res?.message || "Data pengembalian dana berhasil diperbarui.",
        color: "success",
      })
    } else {
      const res = await $api("/admin/pemasukan/mahasiswa/pengembalian", {
        method: "POST",
        body: fd,
      })

      showSnackbar({
        text: res?.message || "Data pengembalian dana berhasil disimpan.",
        color: "success",
      })
    }

    isDialogFormVisible.value = false
    fetchData()
    fetchStats()
  } catch (err) {
    console.error("Gagal menyimpan data:", err)
    showSnackbar({
      text: err?.data?.message || err?.message || "Gagal menyimpan pengembalian dana.",
      color: "error",
    })
  } finally {
    submitting.value = false
  }
}

// Dialog Detail State
const isDialogDetailVisible = ref(false)
const detailItem = ref(null)

const openDetailDialog = item => {
  detailItem.value = item
  isDialogDetailVisible.value = true
}

// Resolve File URL Helper (selalu menggunakan VITE_API_BASE_URL yang valid)
const resolveFileUrl = (item, type) => {
  if (!item) return ""

  const path = type === "masuk"
    ? (item.file_bukti_masuk || item.file_bukti_masuk_existing)
    : (item.file_bukti_keluar || item.file_bukti_keluar_existing)

  if (!path) return ""

  const apiBase = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/+$/, "")
  
  return `${apiBase}/admin/pemasukan/mahasiswa/pengembalian/file/${item.id}/${type}`
}

// Dialog Preview File State
const isDialogFileVisible = ref(false)
const previewFileUrl = ref("")
const previewFileTitle = ref("")
const isPreviewImage = ref(true)
const imageLoadError = ref(false)

const openPreviewFile = (url, title, rawFilePath = "") => {
  if (!url) return
  previewFileUrl.value = url
  previewFileTitle.value = title || "Bukti File"
  imageLoadError.value = false

  const target = (rawFilePath || url).toLowerCase()

  isPreviewImage.value = !target.includes(".pdf")
  isDialogFileVisible.value = true
}

const openFileInNewTab = url => {
  if (!url) return
  window.open(url, "_blank")
}

// Dialog Delete State
const isDialogDeleteVisible = ref(false)
const itemToDelete = ref(null)
const deleting = ref(false)

const openDeleteDialog = item => {
  itemToDelete.value = item
  isDialogDeleteVisible.value = true
}

const confirmDelete = async () => {
  if (!itemToDelete.value?.id) return

  try {
    deleting.value = true

    const res = await $api(`/admin/pemasukan/mahasiswa/pengembalian/${itemToDelete.value.id}`, {
      method: "DELETE",
    })

    showSnackbar({
      text: res?.message || "Data pengembalian dana berhasil dihapus.",
      color: "success",
    })

    isDialogDeleteVisible.value = false
    fetchData()
    fetchStats()
  } catch (err) {
    console.error("Gagal menghapus:", err)
    showSnackbar({
      text: err?.data?.message || "Gagal menghapus data pengembalian dana.",
      color: "error",
    })
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  document.title = "Pengembalian Dana - SIMKEU"
  fetchJenisPembayaran()
  fetchStats()
  fetchData()
})
</script>

<template>
  <div>
    <!-- Header Page -->
    <div class="d-flex flex-wrap align-center justify-space-between gap-4 mb-6">
      <div>
        <h4 class="text-h4 font-weight-bold">
          Pengembalian Dana
        </h4>
        <div class="text-body-1 text-medium-emphasis">
          Kelola data pengembalian dana dengan pencatatan bukti masuk dan bukti keluar
        </div>
      </div>

      <div class="d-flex gap-3">
        <VBtn
          v-if="canManage"
          color="primary"
          prepend-icon="ri-add-line"
          @click="openAddDialog"
        >
          Tambah Pengembalian
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
      Anda tidak memiliki izin untuk mengakses halaman Pengembalian Dana.
    </VAlert>

    <!-- Stat Cards Row -->
    <VRow class="mb-6">
      <!-- Total Nominal -->
      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard class="h-100">
          <VCardText class="d-flex align-center justify-space-between">
            <div>
              <div class="text-caption text-medium-emphasis mb-1 font-weight-medium">
                TOTAL DANA DIKEMBALIKAN
              </div>
              <div class="text-h5 font-weight-bold text-primary">
                {{ formatRupiah(stats.total_nominal || 0) }}
              </div>
            </div>
            <VAvatar
              color="primary"
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
        <VCard class="h-100">
          <VCardText class="d-flex align-center justify-space-between">
            <div>
              <div class="text-caption text-medium-emphasis mb-1 font-weight-medium">
                TOTAL TRANSAKSI
              </div>
              <div class="text-h5 font-weight-bold">
                {{ Number(stats.total_transaksi || 0).toLocaleString('id-ID') }} <span class="text-body-2 font-weight-regular text-medium-emphasis">Transaksi</span>
              </div>
            </div>
            <VAvatar
              color="info"
              variant="tonal"
              size="48"
              rounded
            >
              <VIcon
                icon="ri-exchange-funds-line"
                size="28"
              />
            </VAvatar>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Pengembalian Bulan Ini -->
      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard class="h-100">
          <VCardText class="d-flex align-center justify-space-between">
            <div>
              <div class="text-caption text-medium-emphasis mb-1 font-weight-medium">
                PENGEMBALIAN BULAN INI
              </div>
              <div class="text-h5 font-weight-bold text-warning">
                {{ formatRupiah(stats.nominal_bulan_ini || 0) }}
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

      <!-- Transaksi Bulan Ini -->
      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard class="h-100">
          <VCardText class="d-flex align-center justify-space-between">
            <div>
              <div class="text-caption text-medium-emphasis mb-1 font-weight-medium">
                TRANSAKSI BULAN INI
              </div>
              <div class="text-h5 font-weight-bold text-success">
                {{ Number(stats.transaksi_bulan_ini || 0).toLocaleString('id-ID') }} <span class="text-body-2 font-weight-regular text-medium-emphasis">Transaksi</span>
              </div>
            </div>
            <VAvatar
              color="success"
              variant="tonal"
              size="48"
              rounded
            >
              <VIcon
                icon="ri-arrow-go-back-line"
                size="28"
              />
            </VAvatar>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Filter Card -->
    <VCard class="mb-6">
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

          <!-- Metode Pengembalian -->
          <VCol
            cols="12"
            sm="6"
            md="2"
          >
            <VSelect
              v-model="filterJenisPembayaran"
              :items="jenisPembayaranList"
              label="Metode Pengembalian"
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
            Ditemukan <strong>{{ totalItems }}</strong> data transaksi pengembalian dana.
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

    <!-- Table Card -->
    <VCard>
      <VCardItem class="pb-4">
        <div class="d-flex align-center justify-space-between flex-wrap gap-2">
          <VCardTitle class="text-h6 font-weight-bold">
            Daftar Pengembalian Dana
          </VCardTitle>

          <div
            v-if="!canManage"
            class="text-caption text-medium-emphasis"
          >
            <VChip
              size="small"
              color="secondary"
              label
            >
              Mode Read-Only (Hanya Admin, Kabag, Staff, dan Keuangan yang dapat menginput)
            </VChip>
          </div>
        </div>
      </VCardItem>

      <VDivider />

      <VDataTableServer
        v-model:model-value="selectedRows"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :headers="headers"
        :items="dataTable"
        :items-length="totalItems"
        :loading="loading"
        @update:options="loadItems"
      >
        <!-- Loading Slot -->
        <template
          v-if="initialLoading"
          #loading
        >
          <div class="text-center pa-6">
            <VProgressCircular
              indeterminate
              color="primary"
              class="mb-2"
            />
            <div>Memuat data pengembalian dana...</div>
          </div>
        </template>

        <!-- No Data Slot -->
        <template
          v-else
          #no-data
        >
          <div class="text-center pa-6 text-medium-emphasis">
            <VIcon
              icon="ri-inbox-line"
              size="32"
              class="mb-2 text-secondary"
            />
            <div>Tidak ada data pengembalian dana ditemukan.</div>
          </div>
        </template>

        <!-- No Column -->
        <template #item.no="{ index }">
          <span class="text-medium-emphasis">{{ itemsPerPage * (page - 1) + index + 1 }}</span>
        </template>

        <!-- No Transaksi -->
        <template #item.no_transaksi="{ item }">
          <VChip
            size="small"
            color="primary"
            variant="tonal"
            class="font-weight-medium"
          >
            {{ item.no_transaksi || ('PD-' + item.id) }}
          </VChip>
        </template>

        <!-- Tanggal & Waktu -->
        <template #item.tanggal="{ item }">
          <div class="font-weight-medium">
            {{ formatDateTime(item.tanggal) }}
          </div>
        </template>

        <!-- Metode Pengembalian -->
        <template #item.jenis_pembayaran_id="{ item }">
          <VChip
            size="x-small"
            :color="getMetodeColor(item.jenis_pembayaran?.nama)"
            variant="tonal"
            class="font-weight-medium"
          >
            {{ item.jenis_pembayaran?.nama || 'Tunai' }}
          </VChip>
        </template>

        <!-- Bank & Rekening Tujuan -->
        <template #item.no_rek_tujuan="{ item }">
          <div v-if="item.nama_tujuan || item.nama_bank || item.no_rek_tujuan">
            <div
              v-if="item.nama_tujuan"
              class="font-weight-bold text-body-2"
            >
              {{ item.nama_tujuan }}
            </div>
            <div class="text-caption text-medium-emphasis">
              <span
                v-if="item.nama_bank"
                class="font-weight-medium text-primary"
              >
                {{ item.nama_bank }}
              </span>
              <span v-if="item.nama_bank && item.no_rek_tujuan"> - </span>
              <span v-if="item.no_rek_tujuan">
                No. Rek: {{ item.no_rek_tujuan }}
              </span>
            </div>
          </div>
          <span
            v-else
            class="text-caption text-medium-emphasis"
          >-</span>
        </template>

        <!-- Nominal -->
        <template #item.nominal="{ item }">
          <VChip
            color="primary"
            size="small"
            class="font-weight-bold"
            label
          >
            {{ formatRupiah(item.nominal) }}
          </VChip>
        </template>

        <!-- Petugas -->
        <template #item.petugas_id="{ item }">
          <div class="d-flex align-center gap-2">
            <VAvatar
              color="primary"
              variant="tonal"
              size="28"
            >
              <VIcon
                icon="ri-user-3-line"
                size="16"
              />
            </VAvatar>
            <span class="text-body-2 font-weight-medium">
              {{ item.petugas?.name || '-' }}
            </span>
          </div>
        </template>

        <!-- Bukti Dana Masuk -->
        <template #item.file_bukti_masuk="{ item }">
          <VBtn
            v-if="item.file_bukti_masuk"
            size="x-small"
            color="success"
            variant="tonal"
            prepend-icon="ri-file-text-line"
            @click="openPreviewFile(resolveFileUrl(item, 'masuk'), 'Bukti Dana Masuk', item.file_bukti_masuk)"
          >
            Lihat Bukti
          </VBtn>
          <span
            v-else
            class="text-caption text-medium-emphasis"
          >-</span>
        </template>

        <!-- Bukti Dana Keluar -->
        <template #item.file_bukti_keluar="{ item }">
          <VBtn
            v-if="item.file_bukti_keluar"
            size="x-small"
            color="info"
            variant="tonal"
            prepend-icon="ri-file-text-line"
            @click="openPreviewFile(resolveFileUrl(item, 'keluar'), 'Bukti Dana Keluar', item.file_bukti_keluar)"
          >
            Lihat Bukti
          </VBtn>
          <VChip
            v-else
            size="x-small"
            color="secondary"
            variant="tonal"
            label
          >
            Belum Ada
          </VChip>
        </template>

        <!-- Keterangan -->
        <template #item.keterangan="{ item }">
          <span
            class="text-caption text-truncate d-inline-block"
            style="max-width: 220px;"
            :title="item.keterangan || '-'"
          >
            {{ item.keterangan || '-' }}
          </span>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="d-flex align-center justify-center gap-1">
            <!-- Tombol Cetak PDF Satuan Langsung -->
            <VTooltip
              text="Cetak Bukti PDF"
              location="top"
            >
              <template #activator="{ props }">
                <IconBtn
                  v-bind="props"
                  size="small"
                  color="error"
                  variant="text"
                  :loading="downloadingPdfId === item.id"
                  @click="handleDownloadPdf(item)"
                >
                  <VIcon
                    icon="ri-file-pdf-2-line"
                    size="18"
                  />
                </IconBtn>
              </template>
            </VTooltip>

            <IconBtn size="small">
              <VIcon icon="ri-more-2-fill" />

              <VMenu activator="parent">
                <VList density="compact">
                  <!-- Cetak PDF -->
                  <VListItem
                    value="pdf"
                    prepend-icon="ri-file-pdf-2-line"
                    @click="handleDownloadPdf(item)"
                  >
                    Cetak PDF
                  </VListItem>

                  <!-- Detail -->
                  <VListItem
                    value="detail"
                    prepend-icon="ri-eye-line"
                    @click="openDetailDialog(item)"
                  >
                    Detail
                  </VListItem>

                  <!-- Edit (Admin & Kabag only) -->
                  <VListItem
                    v-if="canManage"
                    value="edit"
                    prepend-icon="ri-edit-box-line"
                    @click="openEditDialog(item)"
                  >
                    Edit
                  </VListItem>

                  <!-- Delete (Admin & Kabag only) -->
                  <VListItem
                    v-if="canManage"
                    value="delete"
                    color="error"
                    prepend-icon="ri-delete-bin-line"
                    @click="openDeleteDialog(item)"
                  >
                    Hapus
                  </VListItem>
                </VList>
              </VMenu>
            </IconBtn>
          </div>
        </template>
      </VDataTableServer>
    </VCard>

    <!-- Dialog Form (Add & Edit) -->
    <VDialog
      v-model="isDialogFormVisible"
      max-width="650px"
      persistent
    >
      <VCard>
        <VCardTitle class="pa-4 d-flex align-center justify-space-between">
          <div class="d-flex align-center gap-2">
            <VIcon
              :icon="isEditMode ? 'ri-edit-box-line' : 'ri-add-circle-line'"
              color="primary"
            />
            <span class="text-h6 font-weight-bold">
              {{ isEditMode ? 'Edit Pengembalian Dana' : 'Tambah Pengembalian Dana' }}
            </span>
          </div>
          <IconBtn
            icon="ri-close-line"
            size="small"
            @click="isDialogFormVisible = false"
          />
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-4">
          <!-- Petugas Info Banner -->
          <VAlert
            type="info"
            variant="tonal"
            density="compact"
            class="mb-4"
          >
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center gap-2">
                <VIcon
                  icon="ri-user-smile-line"
                  size="18"
                />
                <span>Petugas: <strong>{{ formData.petugas_name }}</strong></span>
              </div>
              <VChip
                size="x-small"
                color="info"
                label
              >
                Otomatis Tercatat
              </VChip>
            </div>
          </VAlert>

          <VForm
            ref="formRef"
            @submit.prevent="submitForm"
          >
            <VRow>
              <!-- Tanggal & Waktu -->
              <VCol
                cols="12"
                md="4"
              >
                <AppDateTimePicker
                  v-model="formData.tanggal"
                  label="Tanggal & Waktu Pengembalian *"
                  placeholder="Pilih tanggal dan waktu"
                  :rules="[requiredValidator]"
                  :config="{
                    enableTime: true,
                    dateFormat: 'Y-m-d H:i',
                    altInput: true,
                    altFormat: 'F j, Y H:i',
                  }"
                />
              </VCol>

              <!-- Metode Pengembalian -->
              <VCol
                cols="12"
                md="4"
              >
                <VSelect
                  v-model="formData.jenis_pembayaran_id"
                  :items="jenisPembayaranList"
                  item-title="title"
                  item-value="value"
                  label="Metode Pengembalian *"
                  placeholder="Pilih metode"
                  :loading="loadingJenisPembayaran"
                  :rules="[v => !!v || 'Metode pengembalian wajib dipilih']"
                />
              </VCol>

              <!-- Nominal -->
              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="formData.nominal"
                  label="Nominal Pengembalian (Rp) *"
                  placeholder="Contoh: 500000"
                  type="number"
                  :rules="[
                    requiredValidator,
                    v => Number(v) > 0 || 'Nominal harus lebih dari 0',
                  ]"
                  :hint="formData.nominal ? `Nominal: ${formatRupiah(formData.nominal)}` : ''"
                  persistent-hint
                />
              </VCol>

              <!-- Nama Tujuan / Penerima -->
              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="formData.nama_tujuan"
                  label="Nama Tujuan (Atas Nama)"
                  placeholder="Contoh: Muhammad Ali"
                  clearable
                />
              </VCol>

              <!-- Nama Bank Tujuan -->
              <VCol
                cols="12"
                md="4"
              >
                <VCombobox
                  v-model="formData.nama_bank"
                  :items="bankList"
                  label="Nama Bank Tujuan"
                  placeholder="Pilih atau ketik nama bank"
                  clearable
                />
              </VCol>

              <!-- No. Rekening Tujuan -->
              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="formData.no_rek_tujuan"
                  label="No. Rekening Tujuan"
                  placeholder="Contoh: 1234567890"
                  clearable
                />
              </VCol>

              <!-- File Bukti Dana Masuk (Required) -->
              <VCol cols="12">
                <VFileInput
                  v-model="formData.file_bukti_masuk"
                  label="File Bukti Dana Masuk *"
                  placeholder="Pilih file gambar atau PDF (Maks. 10MB)"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
                  prepend-icon=""
                  prepend-inner-icon="ri-upload-2-line"
                  :rules="fileMasukRules"
                  hint="Format: PDF, JPG, JPEG, PNG, WEBP (Maksimal 10MB)"
                  persistent-hint
                  show-size
                />
                <div
                  v-if="isEditMode && formData.file_bukti_masuk_existing"
                  class="mt-1 d-flex align-center gap-2 text-caption text-medium-emphasis"
                >
                  <span>File saat ini:</span>
                  <VBtn
                    variant="text"
                    size="x-small"
                    color="primary"
                    prepend-icon="ri-eye-line"
                    class="pa-0"
                    @click="openPreviewFile(formData.file_bukti_masuk_existing, 'Bukti Dana Masuk Saat Ini', formData.file_bukti_masuk_path)"
                  >
                    Lihat File Saat Ini
                  </VBtn>
                  <span class="text-caption">(Biarkan kosong jika tidak ingin mengubah file)</span>
                </div>
              </VCol>

              <!-- File Bukti Dana Keluar (Nullable) -->
              <VCol cols="12">
                <VFileInput
                  v-model="formData.file_bukti_keluar"
                  label="File Bukti Dana Dikeluarkan (Opsional)"
                  placeholder="Pilih file gambar atau PDF (opsional, Maks. 10MB)"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
                  prepend-icon=""
                  prepend-inner-icon="ri-upload-2-line"
                  :rules="fileKeluarRules"
                  hint="Format: PDF, JPG, JPEG, PNG, WEBP (Maksimal 10MB)"
                  persistent-hint
                  show-size
                />
                <div
                  v-if="isEditMode && formData.file_bukti_keluar_existing"
                  class="mt-1 d-flex align-center gap-2 text-caption text-medium-emphasis"
                >
                  <span>File saat ini:</span>
                  <VBtn
                    variant="text"
                    size="x-small"
                    color="info"
                    prepend-icon="ri-eye-line"
                    class="pa-0"
                    @click="openPreviewFile(formData.file_bukti_keluar_existing, 'Bukti Dana Keluar Saat Ini', formData.file_bukti_keluar_path)"
                  >
                    Lihat File Saat Ini
                  </VBtn>
                  <span class="text-caption">(Biarkan kosong jika tidak ingin mengubah file)</span>
                </div>
              </VCol>

              <!-- Keterangan -->
              <VCol cols="12">
                <VTextarea
                  v-model="formData.keterangan"
                  label="Keterangan / Catatan (Opsional)"
                  placeholder="Contoh: Pengembalian sisa deposit mahasiswa transfer, kelebihan bayar, dsb."
                  rows="3"
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
            {{ isEditMode ? 'Simpan Perubahan' : 'Simpan Pengembalian' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Dialog Detail -->
    <VDialog
      v-model="isDialogDetailVisible"
      max-width="600px"
    >
      <VCard v-if="detailItem">
        <VCardTitle class="pa-4 d-flex align-center justify-space-between">
          <div class="d-flex align-center gap-2">
            <VIcon
              icon="ri-file-list-3-line"
              color="primary"
            />
            <span class="text-h6 font-weight-bold">
              Detail Pengembalian Dana #{{ detailItem.id }}
            </span>
          </div>
          <IconBtn
            icon="ri-close-line"
            size="small"
            @click="isDialogDetailVisible = false"
          />
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-4">
          <!-- Nominal Highlight Box -->
          <VCard
            variant="tonal"
            color="primary"
            class="pa-4 mb-4 text-center"
          >
            <div class="text-caption font-weight-medium text-medium-emphasis mb-1">
              NOMINAL PENGEMBALIAN
            </div>
            <div class="text-h4 font-weight-bold text-primary">
              {{ formatRupiah(detailItem.nominal) }}
            </div>
          </VCard>

          <VTable
            density="comfortable"
            class="border rounded text-no-wrap mb-4"
          >
            <tbody>
              <tr>
                <td
                  class="font-weight-medium text-medium-emphasis"
                  style="inline-size: 180px;"
                >
                  No. Transaksi
                </td>
                <td>
                  <VChip
                    size="small"
                    color="primary"
                    variant="tonal"
                    class="font-weight-medium"
                  >
                    {{ detailItem.no_transaksi || ('PD-' + detailItem.id) }}
                  </VChip>
                </td>
              </tr>
              <tr>
                <td
                  class="font-weight-medium text-medium-emphasis"
                  style="inline-size: 180px;"
                >
                  Tanggal & Waktu
                </td>
                <td class="font-weight-bold">
                  {{ formatDateTime(detailItem.tanggal) }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-medium text-medium-emphasis">
                  Metode Pengembalian
                </td>
                <td>
                  <VChip
                    size="small"
                    :color="getMetodeColor(detailItem.jenis_pembayaran?.nama)"
                    variant="tonal"
                    class="font-weight-medium"
                  >
                    {{ detailItem.jenis_pembayaran?.nama || 'Tunai' }}
                  </VChip>
                </td>
              </tr>
              <tr v-if="detailItem.nama_tujuan">
                <td class="font-weight-medium text-medium-emphasis">
                  Nama Penerima / Tujuan
                </td>
                <td class="font-weight-bold">
                  {{ detailItem.nama_tujuan }}
                </td>
              </tr>
              <tr v-if="detailItem.nama_bank || detailItem.no_rek_tujuan">
                <td class="font-weight-medium text-medium-emphasis">
                  Rekening Tujuan
                </td>
                <td>
                  <div
                    v-if="detailItem.nama_bank"
                    class="font-weight-bold text-primary"
                  >
                    {{ detailItem.nama_bank }}
                  </div>
                  <div
                    v-if="detailItem.no_rek_tujuan"
                    class="text-caption text-medium-emphasis"
                  >
                    No. Rek: {{ detailItem.no_rek_tujuan }}
                  </div>
                </td>
              </tr>
              <tr>
                <td class="font-weight-medium text-medium-emphasis">
                  Petugas Penginput
                </td>
                <td>
                  <div class="d-flex align-center gap-2">
                    <VAvatar
                      color="primary"
                      variant="tonal"
                      size="24"
                    >
                      <VIcon
                        icon="ri-user-3-line"
                        size="14"
                      />
                    </VAvatar>
                    <span>{{ detailItem.petugas?.name || '-' }} ({{ detailItem.petugas?.email || '-' }})</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="font-weight-medium text-medium-emphasis">
                  Keterangan
                </td>
                <td>
                  {{ detailItem.keterangan || '-' }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-medium text-medium-emphasis">
                  Waktu Pembuatan Record
                </td>
                <td class="text-caption">
                  {{ formatDateTime(detailItem.created_at) }}
                </td>
              </tr>
            </tbody>
          </VTable>

          <!-- Bukti Files Section -->
          <div class="text-subtitle-2 font-weight-bold mb-2">
            File Bukti Terlampir
          </div>
          <VRow>
            <!-- Bukti Dana Masuk -->
            <VCol
              cols="12"
              md="6"
            >
              <VCard
                variant="outlined"
                class="pa-3 text-center h-100 d-flex flex-column justify-space-between"
              >
                <div>
                  <VIcon
                    icon="ri-file-download-line"
                    size="32"
                    color="success"
                    class="mb-2"
                  />
                  <div class="text-body-2 font-weight-bold">
                    Bukti Dana Masuk
                  </div>
                  <div class="text-caption text-medium-emphasis mb-3">
                    Wajib diunggah saat pencatatan
                  </div>
                </div>

                <div class="d-flex justify-center gap-2">
                  <VBtn
                    v-if="detailItem.file_bukti_masuk"
                    size="small"
                    color="success"
                    prepend-icon="ri-eye-line"
                    @click="openPreviewFile(resolveFileUrl(detailItem, 'masuk'), 'Bukti Dana Masuk', detailItem.file_bukti_masuk)"
                  >
                    Pratinjau
                  </VBtn>
                  <VBtn
                    v-if="detailItem.file_bukti_masuk"
                    size="small"
                    variant="outlined"
                    color="secondary"
                    icon="ri-external-link-line"
                    title="Buka di Tab Baru"
                    @click="openFileInNewTab(resolveFileUrl(detailItem, 'masuk'))"
                  />
                </div>
              </VCard>
            </VCol>

            <!-- Bukti Dana Keluar -->
            <VCol
              cols="12"
              md="6"
            >
              <VCard
                variant="outlined"
                class="pa-3 text-center h-100 d-flex flex-column justify-space-between"
              >
                <div>
                  <VIcon
                    icon="ri-file-upload-line"
                    size="32"
                    :color="detailItem.file_bukti_keluar ? 'info' : 'secondary'"
                    class="mb-2"
                  />
                  <div class="text-body-2 font-weight-bold">
                    Bukti Dana Keluar
                  </div>
                  <div class="text-caption text-medium-emphasis mb-3">
                    {{ detailItem.file_bukti_keluar ? 'Terlampir' : 'Belum diunggah' }}
                  </div>
                </div>

                <div
                  v-if="detailItem.file_bukti_keluar"
                  class="d-flex justify-center gap-2"
                >
                  <VBtn
                    size="small"
                    color="info"
                    prepend-icon="ri-eye-line"
                    @click="openPreviewFile(resolveFileUrl(detailItem, 'keluar'), 'Bukti Dana Keluar', detailItem.file_bukti_keluar)"
                  >
                    Pratinjau
                  </VBtn>
                  <VBtn
                    size="small"
                    variant="outlined"
                    color="secondary"
                    icon="ri-external-link-line"
                    title="Buka di Tab Baru"
                    @click="openFileInNewTab(resolveFileUrl(detailItem, 'keluar'))"
                  />
                </div>
                <div
                  v-else
                  class="text-caption text-medium-emphasis"
                >
                  Tidak ada file
                </div>
              </VCard>
            </VCol>
          </VRow>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-4">
          <VBtn
            color="error"
            variant="tonal"
            prepend-icon="ri-file-pdf-2-line"
            :loading="downloadingPdfId === detailItem?.id"
            @click="handleDownloadPdf(detailItem)"
          >
            Cetak Bukti PDF
          </VBtn>
          <VSpacer />
          <VBtn
            v-if="canManage"
            color="primary"
            variant="tonal"
            prepend-icon="ri-edit-box-line"
            @click="isDialogDetailVisible = false; openEditDialog(detailItem)"
          >
            Edit Data
          </VBtn>
          <VBtn
            variant="outlined"
            color="secondary"
            @click="isDialogDetailVisible = false"
          >
            Tutup
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Dialog Preview File -->
    <VDialog
      v-model="isDialogFileVisible"
      max-width="750px"
    >
      <VCard>
        <VCardTitle class="pa-4 d-flex align-center justify-space-between">
          <span class="text-h6 font-weight-bold">{{ previewFileTitle }}</span>
          <div class="d-flex align-center gap-2">
            <VBtn
              size="small"
              variant="outlined"
              color="primary"
              prepend-icon="ri-external-link-line"
              @click="openFileInNewTab(previewFileUrl)"
            >
              Buka Tab Baru
            </VBtn>
            <IconBtn
              icon="ri-close-line"
              size="small"
              @click="isDialogFileVisible = false"
            />
          </div>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-4 text-center">
          <!-- Preview Gambar -->
          <div
            v-if="isPreviewImage"
            class="d-flex flex-column align-center justify-center"
          >
            <img
              v-show="!imageLoadError"
              :src="previewFileUrl"
              :alt="previewFileTitle"
              style="max-width: 100%; max-height: 500px; object-fit: contain; border-radius: 8px;"
              @error="imageLoadError = true"
            >
            <div
              v-if="imageLoadError"
              class="pa-6 text-center text-medium-emphasis"
            >
              <VIcon
                icon="ri-image-line"
                size="48"
                color="secondary"
                class="mb-2"
              />
              <div class="text-body-2">
                Gambar tidak dapat dimuat langsung di dalam modal.
              </div>
              <VBtn
                class="mt-3"
                size="small"
                variant="outlined"
                color="primary"
                prepend-icon="ri-external-link-line"
                @click="openFileInNewTab(previewFileUrl)"
              >
                Buka File di Tab Baru
              </VBtn>
            </div>
          </div>

          <!-- Preview PDF -->
          <div
            v-else
            class="pa-2"
          >
            <iframe
              :src="previewFileUrl"
              width="100%"
              height="500px"
              style="border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 8px;"
            />
            <div class="d-flex justify-center mt-3">
              <VBtn
                size="small"
                color="primary"
                prepend-icon="ri-external-link-line"
                @click="openFileInNewTab(previewFileUrl)"
              >
                Buka Dokumen PDF di Tab Baru
              </VBtn>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Dialog Delete Confirmation -->
    <VDialog
      v-model="isDialogDeleteVisible"
      max-width="450px"
    >
      <VCard>
        <VCardTitle class="pa-4 text-h6 font-weight-bold">
          Konfirmasi Hapus
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-4">
          Apakah Anda yakin ingin menghapus data pengembalian dana sebesar
          <strong class="text-primary">{{ formatRupiah(itemToDelete?.nominal || 0) }}</strong>
          tertanggal <strong>{{ formatDateTime(itemToDelete?.tanggal) }}</strong>?
          <div class="text-caption text-error mt-2">
            File bukti masuk dan keluar terkait juga akan dihapus secara permanen dari server.
          </div>
        </VCardText>

        <VDivider />

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
            @click="confirmDelete"
          >
            Hapus Data
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
