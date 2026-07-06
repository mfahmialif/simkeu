<script setup>
/* eslint-disable camelcase */
import { VDatePicker } from "vuetify/components/VDatePicker"
import { downloadFileExport } from "@/composables/exportFile"
import { formatRupiah } from "@/composables/formatRupiah"
import PengeluaranPetugasFilter from "@/components/admin/pengeluaran/PengeluaranPetugasFilter.vue"
import { fetchPetugasPengeluaranOptions } from "@/composables/petugasPengeluaran"
import { showSnackbar } from "@/composables/snackbar"

const router = useRouter()
const route = useRoute()
const currentDate = new Date()
const PIUTANG_MODULE_KEY = "piutang"

const todayDateValue = () => {
  const date = new Date()

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

const page = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref([{ key: "tanggal_rekap", order: "desc" }])
const search = ref("")
const selectedBulan = ref([currentDate.getMonth() + 1])
const selectedTahun = ref(currentDate.getFullYear())
const selectedModule = ref(null)
const selectedPetugasId = ref(null)
const petugasList = ref([])
const dataTable = ref([])
const totalItems = ref(0)
const stats = ref({})
const years = ref([currentDate.getFullYear()])
const modules = ref([])
const loading = ref(false)
const initialLoading = ref(true)
const statsLoading = ref(false)
const exportingExcel = ref(false)
const prosesRabList = ref([])
const prosesRabKategoriOptions = ref([])
const prosesRabKategoriHistory = ref([])
const prosesRabLoading = ref(false)
const prosesRabSearch = ref("")
const prosesRabDateMenu = ref(false)
const prosesRabDialog = ref(false)
const prosesRabSaving = ref(false)
const prosesRabDownloading = ref({})
const exportingProsesRabRekapan = ref(false)
const prosesRabDeleting = ref({})
const prosesRabDetailDialog = ref(false)
const prosesRabDetailLoading = ref(false)
const prosesRabDetailItem = ref(null)
const prosesRabDetailRows = ref([])
const prosesRabEditingId = ref(null)
const prosesRabEditingRows = ref([])
const prosesRabSelectedKeys = ref([])
const prosesRabPencairanDateMenus = ref({})
const prosesRabBulkPencairanDateMenu = ref(false)
const prosesRabBulkTanggalSaving = ref(false)
const appendProsesRabDialog = ref(false)
const appendProsesRabTargetId = ref(null)
const appendProsesRabSaving = ref(false)
const kasLoading = ref(false)
const kasSummary = ref([])
const kasTotals = ref({})
const kasManualRows = ref([])
const kasPetugas = ref(null)
const kasDetailDialog = ref(false)
const kasFormDialog = ref(false)
const kasEditingId = ref(null)
const kasSaving = ref(false)
const rekapFormDialog = ref(false)
const rekapTanggalRekapMenu = ref(false)
const rekapTanggalPencairanMenu = ref(false)
const rekapSaving = ref(false)
const rekapPetugasLoading = ref(false)
const rekapPetugasList = ref([])
const piutangPegawaiLoading = ref(false)
const piutangPegawaiList = ref([])
const selectedRekapKeys = ref([])
const selectedRekapCache = ref({})
const bulkTanggalPencairan = ref(null)
const bulkTanggalSaving = ref(false)
const tanggalPencairanSaving = ref({})
const resettingFilters = ref(false)

const userData = useCookie("userData").value ?? {}
const userRole = String(userData?.role?.name ?? "").toLowerCase()

const canEditTanggalPencairan = [
  "admin",
  "keuangan",
  "kabag",
  "kabag_pengeluaran",
  "barokahdosen_tatapmuka",
  "barokahdosen_kegiatan",
  "barokahdosen_bulanan",
].includes(userRole)

const canProcessRab = [
  "admin",
  "keuangan",
  "kabag",
  "kabag_pengeluaran",
  "barokahdosen_tatapmuka",
  "barokahdosen_kegiatan",
  "barokahdosen_bulanan",
].includes(userRole)

const canSelectRekap = computed(() => canEditTanggalPencairan || canProcessRab)

const kasForm = ref({
  petugas_id: null,
  module_key: null,
  tanggal: [
    currentDate.getFullYear(),
    String(currentDate.getMonth() + 1).padStart(2, "0"),
    String(currentDate.getDate()).padStart(2, "0"),
  ].join("-"),
  tipe: "masuk",
  nominal: 0,
  keterangan: "",
})

const rekapForm = ref({
  input_piutang: false,
  module_key: null,
  petugas_id: null,
  piutang_pegawai_id: null,
  nama: "",
  bulan: currentDate.getMonth() + 1,
  tahun: currentDate.getFullYear(),
  tanggal_rekap: [
    currentDate.getFullYear(),
    String(currentDate.getMonth() + 1).padStart(2, "0"),
    String(currentDate.getDate()).padStart(2, "0"),
  ].join("-"),
  tanggal_pencairan: null,
  jumlah_sementara: 0,
  default_cicilan: null,
  keterangan: "",
})

const monthFilterValues = value => {
  const rawValues = Array.isArray(value) ? value : value ? [value] : []

  return [...new Set(
    rawValues
      .flatMap(item => String(item).split(","))
      .map(item => Number(item))
      .filter(month => month >= 1 && month <= 12),
  )]
}

const selectedBulanFilterValues = () => monthFilterValues(selectedBulan.value)

const selectedBulanForDefault = () => {
  const values = selectedBulanFilterValues()
  const currentMonth = currentDate.getMonth() + 1

  return values.includes(currentMonth) ? currentMonth : values[0] || null
}

const selectedBulanFilterParam = () => {
  const values = selectedBulanFilterValues()

  return values.length ? values.join(",") : null
}

const prosesRabDefaultTanggalCetak = () => {
  const today = todayDateValue()
  const todayMatch = today.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  const tahun = Number(selectedTahun.value || todayMatch?.[1] || currentDate.getFullYear())
  const selectedMonths = selectedBulanFilterValues()
  const bulan = Number(selectedBulanForDefault() || todayMatch?.[2] || currentDate.getMonth() + 1)

  if (!selectedMonths.length) {
    return selectedTahun.value && tahun !== Number(todayMatch?.[1])
      ? `${tahun}-01-01`
      : today
  }

  const isCurrentMonth = tahun === Number(todayMatch?.[1]) && bulan === Number(todayMatch?.[2])
  const tanggal = isCurrentMonth ? todayMatch?.[3] || "01" : "01"

  return [
    tahun,
    String(bulan).padStart(2, "0"),
    tanggal,
  ].join("-")
}

const createDefaultProsesRabForm = () => ({
  kategori_tipe: "rab",
  susulan_kategori: null,
  custom_kategori: "",
  tanggal_cetak: prosesRabDefaultTanggalCetak(),
  keterangan: "",
})

const prosesRabForm = ref(createDefaultProsesRabForm())

let searchTimer = null
let prosesRabSearchTimer = null
let statsRequestToken = 0

const bulanItems = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
].map((title, index) => ({ title, value: index + 1 }))

const tanggalPencairanPickerConfig = {
  altInput: true,
  altFormat: "d F Y",
  dateFormat: "Y-m-d",
  disableMobile: true,
}

const formatMonthYear = value => {
  const match = String(value || "").match(/^(\d{4})-(\d{2})/)

  if (!match) return "Belum diatur"

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(Number(match[1]), Number(match[2]) - 1, 1))
}

const formatDate = value => {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})/)

  if (!match) return "-"

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
}

const parseDateValue = value => {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})/)

  if (!match) return null

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

const toDateValue = value => {
  if (!value) return ""

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) return ""

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

const yearItems = computed(() => [...new Set([
  currentDate.getFullYear(),
  ...years.value,
])].sort((a, b) => b - a))

const regularModuleItems = computed(() =>
  modules.value.filter(item => item.value !== PIUTANG_MODULE_KEY),
)

const selectedPiutangPegawai = computed(() =>
  piutangPegawaiList.value.find(item =>
    String(item.value) === String(rekapForm.value.piutang_pegawai_id),
  ) || null,
)

const saldoAdjustmentTotal = computed(() =>
  Number(kasTotals.value.manual_masuk || 0) - Number(kasTotals.value.manual_keluar || 0),
)

const selectedRekapItems = computed(() =>
  selectedRekapKeys.value
    .map(key => selectedRekapCache.value[key])
    .filter(Boolean),
)

const prosesRabDialogRows = computed(() =>
  prosesRabEditingId.value ? prosesRabEditingRows.value : selectedRekapItems.value,
)

const prosesRabSelectedRows = computed(() => {
  const selectedKeys = new Set(prosesRabSelectedKeys.value)

  return prosesRabDialogRows.value.filter(item => selectedKeys.has(item.row_key))
})

const prosesRabDialogTotal = computed(() =>
  prosesRabDialogRows.value.reduce((total, item) => total + Number(item.jumlah || 0), 0),
)

const prosesRabDialogTotalLpj = computed(() =>
  prosesRabDialogRows.value.reduce((total, item) => total + Number(item.total_lpj || 0), 0),
)

const prosesRabDetailTotalRab = computed(() =>
  prosesRabDetailRows.value.reduce((total, item) => total + Number(item.jumlah || 0), 0),
)

const prosesRabDetailTotalLpj = computed(() =>
  prosesRabDetailRows.value.reduce((total, item) => total + Number(item.total_lpj || 0), 0),
)

const prosesRabDialogTitle = computed(() =>
  prosesRabEditingId.value ? "Edit Proses RAB" : "Proses RAB",
)

const prosesRabDialogHeaders = computed(() => [
  { title: "Tanggal", key: "tanggal_rekap" },
  { title: "Tanggal Pencairan", key: "tanggal_pencairan" },
  { title: "Petugas", key: "petugas_nama" },
  { title: "Jenis", key: "module_name" },
  { title: "Nama Rekap", key: "nama" },
  { title: "Jumlah RAB", key: "jumlah", align: "end" },
  { title: "Jumlah LPJ", key: "total_lpj", align: "end" },
  { title: "Keterangan", key: "keterangan", sortable: false },
  ...(prosesRabEditingId.value
    ? [{ title: "", key: "actions", sortable: false, align: "end" }]
    : []),
])

const selectedPetugasName = computed(() => {
  if (kasPetugas.value?.name) return kasPetugas.value.name

  const petugas = petugasList.value.find(item => String(item.value) === String(selectedPetugasId.value))

  if (!petugas?.title) return ""

  return String(petugas.title)
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s*-\s*.+$/, "")
    .trim()
})

const saldoCardTitle = computed(() => (
  selectedPetugasName.value ? `Saldo ${selectedPetugasName.value}` : "Saldo"
))

const syncSelectedRekapCache = () => {
  const selected = new Set(selectedRekapKeys.value)
  const nextCache = { ...selectedRekapCache.value }

  dataTable.value.forEach(item => {
    if (selected.has(item.row_key)) {
      nextCache[item.row_key] = { ...item }
    }
  })

  Object.keys(nextCache).forEach(key => {
    if (!selected.has(key)) {
      delete nextCache[key]
    }
  })

  selectedRekapCache.value = nextCache
}

const clearSelectedRekaps = () => {
  selectedRekapKeys.value = []
  selectedRekapCache.value = {}
}

const isStatsPending = computed(() => statsLoading.value && Boolean(stats.value?.partial))

const statCards = computed(() => [
  {
    key: "total_anggaran",
    title: "Total RAB",
    value: formatRupiah(stats.value.total_anggaran || 0),
    note: "Akumulasi seluruh rekap",
    icon: "ri-wallet-3-line",
    color: "primary",
    loading: isStatsPending.value,
  },
  {
    key: "total_lpj",
    title: "Total LPJ",
    value: formatRupiah(stats.value.total_lpj || 0),
    note: "Akumulasi realisasi LPJ",
    icon: "ri-file-check-line",
    color: "info",
    loading: isStatsPending.value,
  },
  {
    key: "selisih",
    title: "Selisih",
    value: formatRupiah(stats.value.selisih || 0),
    note: "Total RAB dikurangi LPJ",
    icon: "ri-scales-3-line",
    color: Number(stats.value.selisih || 0) < 0 ? "error" : "success",
    loading: isStatsPending.value,
  },
  {
    key: "total_data",
    title: "Jumlah Data",
    value: Number(stats.value.total_data || 0).toLocaleString("id-ID"),
    note: "Detail pengeluaran",
    icon: "ri-database-2-line",
    color: "warning",
    loading: isStatsPending.value,
  },
  {
    key: "total_modul",
    title: "Modul Terlibat",
    value: Number(stats.value.total_modul || 0).toLocaleString("id-ID"),
    note: "Jenis Barokah",
    icon: "ri-layout-grid-line",
    color: "secondary",
    loading: isStatsPending.value,
  },
])

const moduleColor = key => ({
  tatap_muka: "primary",
  kegiatan: "warning",
  dosen_bulanan: "info",
  [PIUTANG_MODULE_KEY]: "success",
}[key] || "secondary")

const kasTipeItems = [
  { title: "Saldo Awal / Penyesuaian Masuk", value: "masuk" },
  { title: "Penyesuaian Keluar", value: "keluar" },
]

const prosesRabExistingKategoriItems = computed(() =>
  prosesRabKategoriOptions.value.map(kategori => ({
    title: kategori,
    value: kategori,
  })),
)

const appendProsesRabOptions = computed(() =>
  prosesRabList.value.map(item => ({
    title: `${item.kategori || `Proses #${item.id}`} - ${formatDate(item.tanggal_cetak)} (${Number(item.jumlah_rekap || 0).toLocaleString("id-ID")} rekap, ${formatRupiah(item.total_rab || 0)})`,
    value: item.id,
  })),
)

const selectedAppendProsesRab = computed(() =>
  prosesRabList.value.find(item => String(item.id) === String(appendProsesRabTargetId.value)) || null,
)

const prosesRabMonthKey = value => {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-\d{2}/)

  return match ? `${match[1]}-${match[2]}` : ""
}

const prosesRabNextNumber = computed(() => {
  const selectedMonth = prosesRabMonthKey(prosesRabForm.value.tanggal_cetak)

  if (!selectedMonth) return 1

  const usedNumbers = prosesRabKategoriHistory.value
    .filter(item => prosesRabMonthKey(item.tanggal_cetak) === selectedMonth)
    .map(item => {
      const kategori = String(item.kategori || "").trim()

      if (/\(\s*SUSULAN\s*\)$/i.test(kategori)) return 0

      const match = kategori.match(/^RAB\s+(\d+)$/i)
        || kategori.match(/^RAB\s*\(\s*RAB\s+(\d+)\s*\)$/i)

      return match ? Number(match[1]) : 0
    })

  return Math.max(0, ...usedNumbers) + 1
})

const prosesRabAutoKategori = computed(() => `RAB ${prosesRabNextNumber.value}`)

const prosesRabKategoriModeItems = computed(() => [
  { title: prosesRabAutoKategori.value, value: "rab" },
  { title: "RAB Susulan", value: "rab_susulan" },
  { title: "BAROKAH STRUKTURAL", value: "barokah_struktural" },
  { title: "BAROKAH MENGAJAR", value: "barokah_mengajar" },
  { title: "Input lain", value: "custom" },
])

const susulanKategoriValue = value => {
  const kategori = String(value || "").trim()

  if (!kategori) return ""
  if (/\(\s*SUSULAN\s*\)$/i.test(kategori)) return kategori

  return `${kategori} ( SUSULAN )`
}

const prosesRabFinalKategori = computed(() => {
  const form = prosesRabForm.value

  if (form.kategori_tipe === "rab") {
    return prosesRabAutoKategori.value
  }

  if (form.kategori_tipe === "rab_susulan") {
    return susulanKategoriValue(form.susulan_kategori)
  }

  if (form.kategori_tipe === "barokah_struktural") return "BAROKAH STRUKTURAL"
  if (form.kategori_tipe === "barokah_mengajar") return "BAROKAH MENGAJAR"
  if (form.kategori_tipe === "custom") return String(form.custom_kategori || "").trim()

  return ""
})

const prosesRabTanggalCetakPicker = computed({
  get: () => parseDateValue(prosesRabForm.value.tanggal_cetak) || parseDateValue(todayDateValue()),
  set: value => {
    const nextValue = toDateValue(value)

    if (nextValue) {
      prosesRabForm.value.tanggal_cetak = nextValue
      prosesRabDateMenu.value = false
    }
  },
})

const rekapTanggalRekapPicker = computed({
  get: () => parseDateValue(rekapForm.value.tanggal_rekap) || parseDateValue(todayDateValue()),
  set: value => {
    const nextValue = toDateValue(value)

    if (nextValue) {
      rekapForm.value.tanggal_rekap = nextValue
      rekapTanggalRekapMenu.value = false
    }
  },
})

const rekapTanggalPencairanPicker = computed({
  get: () => parseDateValue(rekapForm.value.tanggal_pencairan) || parseDateValue(todayDateValue()),
  set: value => {
    const nextValue = toDateValue(value)

    if (nextValue) {
      rekapForm.value.tanggal_pencairan = nextValue
      rekapTanggalPencairanMenu.value = false
    }
  },
})

const sharedRabFilterPayload = () => {
  const searchTerm = String(search.value || "").trim()
  const bulan = selectedBulanFilterParam()

  return {
    ...(searchTerm && { search: searchTerm }),
    ...(bulan && { bulan }),
    ...(selectedTahun.value && { tahun: selectedTahun.value }),
    ...(selectedModule.value && { module_key: selectedModule.value }),
    ...(selectedModule.value !== PIUTANG_MODULE_KEY && selectedPetugasId.value && { petugas_id: selectedPetugasId.value }),
  }
}

const activeFilterPayload = () => ({
  belum_cetak_rab: 1,
  ...sharedRabFilterPayload(),
})

const hasActiveFilters = () => Object.keys(activeFilterPayload()).length > 0

const prosesRabFilterPayload = () => {
  const searchTerm = String(prosesRabSearch.value || "").trim()
  const sharedPayload = sharedRabFilterPayload()

  const {
    bulan,
    tahun,
    ...rekapFilters
  } = sharedPayload

  return {
    ...rekapFilters,
    ...(bulan && { proses_bulan: bulan }),
    ...(tahun && { proses_tahun: tahun }),
    ...(searchTerm && { proses_search: searchTerm }),
  }
}

const errorMessage = err => {
  const message =
    err?.data?.message
    || err?.response?._data?.message
    || err?.response?.data?.message
    || err?.message

  if (typeof message === "object") {
    return Object.values(message).flat().join("; ")
  }

  return message || "Terjadi kesalahan."
}

const defaultRegularModuleKey = () => {
  if (selectedModule.value && selectedModule.value !== PIUTANG_MODULE_KEY) {
    return selectedModule.value
  }

  return regularModuleItems.value?.[0]?.value || "tatap_muka"
}

const piutangPegawaiTitle = item =>
  `${item.nama || "-"} (${item.kode || "-"}) - ${item.tipe || "pegawai"}`

const buildPiutangRekapName = () => {
  const pegawaiName = selectedPiutangPegawai.value?.nama || ""
  const keterangan = String(rekapForm.value.keterangan || "").trim()
  const suffix = keterangan ? ` ( ${keterangan} )` : ""

  return ["CASHBON", pegawaiName]
    .filter(Boolean)
    .join(" ") + suffix
}

const syncPiutangRekapName = () => {
  if (!rekapForm.value.input_piutang) return

  rekapForm.value.nama = buildPiutangRekapName()
}

const fetchPiutangPegawaiOptions = async () => {
  if (piutangPegawaiList.value.length || piutangPegawaiLoading.value) return

  try {
    piutangPegawaiLoading.value = true

    const response = await $api("/admin/pegawai", {
      method: "GET",
      body: {
        limit: 0,
        status: "aktif",
        sort_key: "nama",
        sort_order: "asc",
      },
    })

    const rows = response.data?.data || response.data || []

    piutangPegawaiList.value = rows.map(item => ({
      title: piutangPegawaiTitle(item),
      value: item.id,
      nama: item.nama || "",
      kode: item.kode || "",
      tipe: item.tipe || "pegawai",
    }))
    syncPiutangRekapName()
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    piutangPegawaiLoading.value = false
  }
}

const fetchKas = async () => {
  try {
    kasLoading.value = true

    const response = await $api("/admin/laporan/rab/kas", {
      method: "GET",
      body: activeFilterPayload(),
    })

    kasSummary.value = response.data?.summary || []
    kasTotals.value = response.data?.totals || {}
    kasManualRows.value = response.data?.manual || []
    kasPetugas.value = response.data?.petugas || null
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    kasLoading.value = false
  }
}

const fetchProsesRab = async (silent = false) => {
  try {
    prosesRabLoading.value = true

    const response = await $api("/admin/laporan/rab/proses", {
      method: "GET",
      body: prosesRabFilterPayload(),
    })

    prosesRabList.value = response.data || []
    prosesRabKategoriOptions.value = response.filters?.kategori_options || []
    prosesRabKategoriHistory.value = response.filters?.kategori_history || []
  } catch (err) {
    prosesRabList.value = []

    if (!silent) {
      showSnackbar({
        text: errorMessage(err),
        color: "error",
      })
    }
  } finally {
    prosesRabLoading.value = false
  }
}

const fetchProsesRabDetail = async item => {
  const response = await $api(`/admin/laporan/rab/proses/${item.id}`, {
    method: "GET",
    body: prosesRabFilterPayload(),
  })

  return {
    proses: response.data?.proses || item,
    items: response.data?.items || [],
  }
}

const fetchDeferredStats = async filterPayload => {
  const requestToken = ++statsRequestToken
  const signature = JSON.stringify(filterPayload)

  try {
    statsLoading.value = true

    const response = await $api("/admin/laporan/rab", {
      method: "GET",
      body: {
        ...filterPayload,
        stats_only: true,
      },
    })

    if (
      requestToken !== statsRequestToken
      || signature !== JSON.stringify(activeFilterPayload())
    ) {
      return
    }

    stats.value = response.stats || stats.value
  } catch (err) {
    console.error("Failed to fetch RAB stats:", err)
  } finally {
    if (requestToken === statsRequestToken) {
      statsLoading.value = false
    }
  }
}

const fetchData = async () => {
  try {
    loading.value = true

    const activeSort = sortBy.value?.[0] || { key: "tanggal_rekap", order: "desc" }
    const filterPayload = activeFilterPayload()
    const useFastList = !hasActiveFilters()

    if (!useFastList) {
      statsRequestToken += 1
      statsLoading.value = false
    }

    const response = await $api("/admin/laporan/rab", {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: activeSort.key,
        sort_order: activeSort.order,
        ...filterPayload,
        ...(useFastList && { fast_list: true }),
      },
    })

    dataTable.value = response.data?.data || []
    totalItems.value = Number(response.data?.total || 0)
    stats.value = response.stats || {}
    years.value = response.filters?.years || years.value
    modules.value = response.filters?.modules || modules.value

    fetchProsesRab(true)

    if (useFastList && response.stats?.partial) {
      fetchDeferredStats(filterPayload)
    } else {
      statsRequestToken += 1
      statsLoading.value = false
    }

    if (kasDetailDialog.value) fetchKas()
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    loading.value = false
    initialLoading.value = false
  }
}

const loadItems = ({ page: nextPage, itemsPerPage: nextLimit, sortBy: nextSort }) => {
  page.value = nextPage
  itemsPerPage.value = nextLimit
  sortBy.value = nextSort.length ? nextSort : [{ key: "tanggal_rekap", order: "desc" }]
  fetchData()
}

const exportRabExcel = async () => {
  if (exportingExcel.value) return

  try {
    exportingExcel.value = true
    showSnackbar({
      text: "Loading...",
      color: "info",
    })

    const activeSort = sortBy.value?.[0] || { key: "tanggal_rekap", order: "desc" }

    const response = await $api("/admin/laporan/rab/export-excel", {
      method: "GET",
      headers: {
        Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      body: {
        sort_key: activeSort.key,
        sort_order: activeSort.order,
        ...activeFilterPayload(),
      },
    })

    downloadFileExport(response, "RAB.xlsx")
    showSnackbar({
      text: "RAB berhasil di download.",
      color: "success",
    })
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    exportingExcel.value = false
  }
}

const openProsesRabDialog = () => {
  if (selectedRekapItems.value.length === 0) {
    showSnackbar({
      text: "Centang rekap yang akan diproses terlebih dahulu.",
      color: "warning",
    })

    return
  }

  prosesRabEditingId.value = null
  prosesRabEditingRows.value = []
  prosesRabSelectedKeys.value = []
  prosesRabForm.value = createDefaultProsesRabForm()
  prosesRabDialog.value = true
}

const openAppendProsesRabDialog = () => {
  if (selectedRekapItems.value.length === 0) {
    showSnackbar({
      text: "Centang rekap yang akan dimasukkan terlebih dahulu.",
      color: "warning",
    })

    return
  }

  if (prosesRabList.value.length === 0) {
    showSnackbar({
      text: "Belum ada proses RAB tujuan sesuai filter.",
      color: "warning",
    })

    return
  }

  prosesRabEditingId.value = null
  prosesRabEditingRows.value = []
  prosesRabSelectedKeys.value = []
  appendProsesRabTargetId.value = prosesRabList.value[0]?.id || null
  appendProsesRabDialog.value = true
}

const saveAppendProsesRab = async () => {
  if (appendProsesRabSaving.value) return

  if (selectedRekapItems.value.length === 0) {
    showSnackbar({
      text: "Centang rekap yang akan dimasukkan terlebih dahulu.",
      color: "warning",
    })

    return
  }

  if (!appendProsesRabTargetId.value) {
    showSnackbar({
      text: "Pilih proses RAB tujuan terlebih dahulu.",
      color: "warning",
    })

    return
  }

  try {
    appendProsesRabSaving.value = true

    const response = await $api(`/admin/laporan/rab/proses/${appendProsesRabTargetId.value}/items`, {
      method: "POST",
      body: {
        items: selectedRekapItems.value.map(item => ({
          module_key: item.module_key,
          id: item.id,
        })),
      },
    })

    const updatedKeys = new Set(response.data?.row_keys || [])

    dataTable.value.forEach(item => {
      if (updatedKeys.has(item.row_key)) {
        item.cetak_rab = true
      }
    })

    appendProsesRabDialog.value = false
    appendProsesRabTargetId.value = null
    clearSelectedRekaps()
    showSnackbar({
      text: response.message,
      color: "success",
    })
    await Promise.all([
      fetchData(),
      fetchProsesRab(true),
    ])
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    appendProsesRabSaving.value = false
  }
}

const openProsesRabDetail = async item => {
  if (prosesRabDetailLoading.value) return

  try {
    prosesRabDetailLoading.value = true
    prosesRabDetailItem.value = item
    prosesRabDetailRows.value = []
    prosesRabDetailDialog.value = true

    const detail = await fetchProsesRabDetail(item)

    prosesRabDetailItem.value = detail.proses
    prosesRabDetailRows.value = detail.items
  } catch (err) {
    prosesRabDetailDialog.value = false
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    prosesRabDetailLoading.value = false
  }
}

const openEditProsesRab = async item => {
  if (prosesRabSaving.value || prosesRabDetailLoading.value) return

  try {
    prosesRabDetailLoading.value = true

    const detail = await fetchProsesRabDetail(item)
    const proses = detail.proses

    prosesRabEditingId.value = proses.id || item.id
    prosesRabEditingRows.value = detail.items
    prosesRabSelectedKeys.value = []
    prosesRabForm.value = {
      kategori_tipe: "custom",
      susulan_kategori: null,
      custom_kategori: proses.kategori || item.kategori || "",
      tanggal_cetak: String(proses.tanggal_cetak || item.tanggal_cetak || "").slice(0, 10),
      keterangan: proses.keterangan || item.keterangan || "",
    }
    prosesRabDetailDialog.value = false
    prosesRabDialog.value = true
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    prosesRabDetailLoading.value = false
  }
}

const releaseProsesRabItem = item => {
  if (!prosesRabEditingId.value || prosesRabSaving.value) return

  const targetKey = item.row_key || `${item.module_key}:${item.id}`

  prosesRabEditingRows.value = prosesRabEditingRows.value.filter(row =>
    (row.row_key || `${row.module_key}:${row.id}`) !== targetKey,
  )
  prosesRabSelectedKeys.value = prosesRabSelectedKeys.value.filter(key => key !== targetKey)
}

const releaseSelectedProsesRabItems = () => {
  if (!prosesRabEditingId.value || prosesRabSaving.value || prosesRabSelectedRows.value.length === 0) return

  const selectedKeys = new Set(prosesRabSelectedKeys.value)

  prosesRabEditingRows.value = prosesRabEditingRows.value.filter(row =>
    !selectedKeys.has(row.row_key || `${row.module_key}:${row.id}`),
  )
  prosesRabSelectedKeys.value = []
}

const setSelectedProsesRabPencairanDate = async value => {
  const nextValue = toDateValue(value)

  if (!nextValue || prosesRabSelectedRows.value.length === 0) return

  try {
    prosesRabBulkTanggalSaving.value = true
    prosesRabBulkPencairanDateMenu.value = false

    const response = await updateTanggalPencairan(prosesRabSelectedRows.value, nextValue)

    showSnackbar({
      text: response.message,
      color: "success",
    })
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    prosesRabBulkTanggalSaving.value = false
  }
}

const clearSelectedProsesRabPencairanDate = async () => {
  if (prosesRabSelectedRows.value.length === 0 || prosesRabBulkTanggalSaving.value) return

  try {
    prosesRabBulkTanggalSaving.value = true

    const response = await updateTanggalPencairan(prosesRabSelectedRows.value, null)

    showSnackbar({
      text: response.message,
      color: "success",
    })
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    prosesRabBulkTanggalSaving.value = false
  }
}

const saveProsesRab = async () => {
  if (prosesRabSaving.value) return

  if (!prosesRabEditingId.value && selectedRekapItems.value.length === 0) {
    showSnackbar({
      text: "Centang rekap yang akan diproses terlebih dahulu.",
      color: "warning",
    })

    return
  }

  if (!prosesRabForm.value.tanggal_cetak) {
    showSnackbar({
      text: "Tanggal cetak wajib diisi.",
      color: "warning",
    })

    return
  }

  const kategori = prosesRabFinalKategori.value

  if (!kategori) {
    showSnackbar({
      text: prosesRabForm.value.kategori_tipe === "rab_susulan"
        ? "Pilih kategori yang akan dibuat susulan."
        : "Kategori wajib diisi.",
      color: "warning",
    })

    return
  }

  try {
    prosesRabSaving.value = true

    const isEditingProcess = Boolean(prosesRabEditingId.value)

    const payload = {
      tanggal_cetak: prosesRabForm.value.tanggal_cetak,
      kategori,
      keterangan: prosesRabForm.value.keterangan,
    }

    const response = isEditingProcess
      ? await $api(`/admin/laporan/rab/proses/${prosesRabEditingId.value}`, {
        method: "PUT",
        body: {
          ...payload,
          items: prosesRabEditingRows.value.map(item => ({
            module_key: item.module_key,
            id: item.id,
          })),
        },
      })
      : await $api("/admin/laporan/rab/proses", {
        method: "POST",
        body: {
          ...payload,
          items: selectedRekapItems.value.map(item => ({
            module_key: item.module_key,
            id: item.id,
          })),
        },
      })

    const updatedKeys = new Set(response.data?.row_keys || [])

    if (!isEditingProcess) {
      dataTable.value.forEach(item => {
        if (updatedKeys.has(item.row_key)) {
          item.cetak_rab = true
        }
      })
      clearSelectedRekaps()
    }

    prosesRabDialog.value = false
    prosesRabEditingId.value = null
    prosesRabEditingRows.value = []
    prosesRabSelectedKeys.value = []
    showSnackbar({
      text: response.message,
      color: "success",
    })
    await Promise.all([
      fetchData(),
      fetchProsesRab(true),
    ])
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    prosesRabSaving.value = false
  }
}

const downloadProsesRab = async item => {
  if (prosesRabDownloading.value[item.id]) return

  try {
    prosesRabDownloading.value = {
      ...prosesRabDownloading.value,
      [item.id]: true,
    }

    const response = await $api(`/admin/laporan/rab/proses/${item.id}/export-excel`, {
      method: "GET",
      headers: {
        Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    })

    const fileLabel = String(item.keterangan || formatDate(item.tanggal_cetak) || item.id)
      .replace(/[\\/:*?"<>|]+/g, "-")
      .trim()

    downloadFileExport(response, `RAB ${fileLabel || item.id}.xlsx`)
    showSnackbar({
      text: "RAB proses berhasil di download.",
      color: "success",
    })
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    prosesRabDownloading.value = {
      ...prosesRabDownloading.value,
      [item.id]: false,
    }
  }
}

const downloadProsesRabRekapan = async () => {
  if (exportingProsesRabRekapan.value) return

  try {
    exportingProsesRabRekapan.value = true

    const response = await $api("/admin/laporan/rab/proses/export-rekapan", {
      method: "GET",
      headers: {
        Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      body: prosesRabFilterPayload(),
    })

    downloadFileExport(response, "Rekapan RAB List Proses.xlsx")
    showSnackbar({
      text: "Rekapan list proses berhasil di download.",
      color: "success",
    })
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    exportingProsesRabRekapan.value = false
  }
}

const deleteProsesRab = async item => {
  if (prosesRabDeleting.value[item.id]) return

  try {
    prosesRabDeleting.value = {
      ...prosesRabDeleting.value,
      [item.id]: true,
    }

    const response = await $api(`/admin/laporan/rab/proses/${item.id}`, {
      method: "DELETE",
    })

    const resetKeys = new Set(response.data?.reset_row_keys || [])

    dataTable.value.forEach(row => {
      if (resetKeys.has(row.row_key)) {
        row.cetak_rab = false
      }
    })

    prosesRabList.value = prosesRabList.value.filter(row => String(row.id) !== String(item.id))
    selectedRekapKeys.value = selectedRekapKeys.value.filter(key => !resetKeys.has(key))

    showSnackbar({
      text: response.message,
      color: "success",
    })
    await fetchData()
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    prosesRabDeleting.value = {
      ...prosesRabDeleting.value,
      [item.id]: false,
    }
  }
}

const resetFilters = async () => {
  resettingFilters.value = true
  clearTimeout(searchTimer)
  clearSelectedRekaps()
  search.value = ""
  selectedBulan.value = []
  selectedTahun.value = null
  selectedModule.value = null
  selectedPetugasId.value = null
  page.value = 1
  await nextTick()
  resettingFilters.value = false
  fetchData()
}

const fetchPetugas = async () => {
  if (selectedModule.value === PIUTANG_MODULE_KEY) {
    petugasList.value = []
    selectedPetugasId.value = null

    return
  }

  try {
    const items = await fetchPetugasPengeluaranOptions(selectedModule.value || "rab")

    petugasList.value = items

    // Jika sudah ada petugas yang dipilih tapi tidak valid lagi, reset ke null
    if (
      selectedPetugasId.value
      && !items.some(item => String(item.value) === String(selectedPetugasId.value))
    ) {
      selectedPetugasId.value = null
    }
  } catch (err) {
    console.error("Failed to fetch petugas pengeluaran:", err)
  }
}

const openDetail = item => router.push({
  path: `${item.detail_path}${item.id}`,
  query: {
    return_to: route.fullPath,
  },
})

const openKasDetailDialog = () => {
  kasDetailDialog.value = true
  fetchKas()
}

const openKasForm = (item = null) => {
  kasEditingId.value = item?.id || null
  kasForm.value = {
    petugas_id: item?.petugas_id || selectedPetugasId.value || null,
    module_key: item?.module_key || defaultRegularModuleKey(),
    tanggal: item?.tanggal || [
      currentDate.getFullYear(),
      String(currentDate.getMonth() + 1).padStart(2, "0"),
      String(currentDate.getDate()).padStart(2, "0"),
    ].join("-"),
    tipe: item?.tipe || "masuk",
    nominal: item?.nominal || 0,
    keterangan: item?.keterangan || "Saldo awal",
  }
  kasFormDialog.value = true
}

const fetchRekapPetugas = async moduleKey => {
  if (!moduleKey || moduleKey === PIUTANG_MODULE_KEY) {
    rekapPetugasList.value = []
    rekapForm.value.petugas_id = null

    return
  }

  try {
    rekapPetugasLoading.value = true

    const items = await fetchPetugasPengeluaranOptions(moduleKey)

    rekapPetugasList.value = items

    const hasSelectedPetugas = rekapForm.value.petugas_id
      && items.some(item => String(item.value) === String(rekapForm.value.petugas_id))

    if (!hasSelectedPetugas) {
      const filterPetugas = selectedPetugasId.value
        && items.find(item => String(item.value) === String(selectedPetugasId.value))

      rekapForm.value.petugas_id = filterPetugas?.value || items[0]?.value || null
    }
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    rekapPetugasLoading.value = false
  }
}

const openRekapForm = async () => {
  const inputPiutang = selectedModule.value === PIUTANG_MODULE_KEY
  const moduleKey = inputPiutang ? PIUTANG_MODULE_KEY : defaultRegularModuleKey()

  rekapForm.value = {
    input_piutang: inputPiutang,
    module_key: moduleKey,
    petugas_id: inputPiutang ? null : selectedPetugasId.value || null,
    piutang_pegawai_id: null,
    nama: "",
    bulan: selectedBulanForDefault() || currentDate.getMonth() + 1,
    tahun: selectedTahun.value || currentDate.getFullYear(),
    tanggal_rekap: [
      currentDate.getFullYear(),
      String(currentDate.getMonth() + 1).padStart(2, "0"),
      String(currentDate.getDate()).padStart(2, "0"),
    ].join("-"),
    tanggal_pencairan: null,
    jumlah_sementara: 0,
    default_cicilan: null,
    keterangan: "",
  }
  rekapTanggalRekapMenu.value = false
  rekapTanggalPencairanMenu.value = false
  rekapFormDialog.value = true

  if (inputPiutang) {
    syncPiutangRekapName()
    await fetchPiutangPegawaiOptions()

    return
  }

  await fetchRekapPetugas(moduleKey)
}

const saveRekap = async () => {
  if (rekapSaving.value) return

  if (rekapForm.value.input_piutang) {
    syncPiutangRekapName()

    const nominal = Number(rekapForm.value.jumlah_sementara || 0)

    if (
      !rekapForm.value.piutang_pegawai_id
      || !rekapForm.value.tanggal_rekap
      || nominal <= 0
    ) {
      showSnackbar({
        text: "Pegawai, tanggal, dan nominal piutang wajib diisi.",
        color: "warning",
      })

      return
    }

    try {
      rekapSaving.value = true

      const response = await $api("/admin/piutang", {
        method: "POST",
        body: {
          pegawai_id: rekapForm.value.piutang_pegawai_id,
          tanggal: rekapForm.value.tanggal_rekap,
          tanggal_pencairan: rekapForm.value.tanggal_pencairan || null,
          nominal,
          default_cicilan: Number(rekapForm.value.default_cicilan || 0),
          keterangan: rekapForm.value.keterangan,
        },
      })

      rekapFormDialog.value = false
      showSnackbar({
        text: response.message,
        color: "success",
      })
      fetchData()
    } catch (err) {
      showSnackbar({
        text: errorMessage(err),
        color: "error",
      })
    } finally {
      rekapSaving.value = false
    }

    return
  }

  const bulan = Number(rekapForm.value.bulan)
  const tahun = Number(rekapForm.value.tahun)

  if (
    !rekapForm.value.module_key
    || !rekapForm.value.petugas_id
    || !String(rekapForm.value.nama || "").trim()
    || !bulan
    || !tahun
    || !rekapForm.value.tanggal_rekap
  ) {
    showSnackbar({
      text: "Jenis rekap, petugas, nama, periode, dan tanggal rekap wajib diisi.",
      color: "warning",
    })
    
    return
  }

  try {
    rekapSaving.value = true

    const response = await $api("/admin/laporan/rab", {
      method: "POST",
      body: {
        module_key: rekapForm.value.module_key,
        petugas_id: rekapForm.value.petugas_id,
        nama: rekapForm.value.nama,
        bulan_tahun: `${tahun}-${String(bulan).padStart(2, "0")}`,
        tanggal_rekap: rekapForm.value.tanggal_rekap,
        tanggal_pencairan: rekapForm.value.tanggal_pencairan || null,
        jumlah_sementara: Number(rekapForm.value.jumlah_sementara || 0),
        keterangan: rekapForm.value.keterangan,
      },
    })

    rekapFormDialog.value = false
    showSnackbar({
      text: response.message,
      color: "success",
    })
    fetchData()
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    rekapSaving.value = false
  }
}

const updateTanggalPencairan = async (items, tanggalPencairan) => {
  const response = await $api("/admin/laporan/rab/tanggal-pencairan", {
    method: "PUT",
    body: {
      items: items.map(item => ({
        module_key: item.module_key,
        id: item.id,
      })),
      tanggal_pencairan: tanggalPencairan || null,
    },
  })

  const updatedKeys = new Set(response.data?.row_keys || [])

  dataTable.value.forEach(item => {
    if (updatedKeys.has(item.row_key)) {
      item.tanggal_pencairan = response.data?.tanggal_pencairan || null
    }
  })

  prosesRabEditingRows.value.forEach(item => {
    if (updatedKeys.has(item.row_key)) {
      item.tanggal_pencairan = response.data?.tanggal_pencairan || null
    }
  })

  prosesRabDetailRows.value.forEach(item => {
    if (updatedKeys.has(item.row_key)) {
      item.tanggal_pencairan = response.data?.tanggal_pencairan || null
    }
  })

  return response
}

const saveTanggalPencairan = async (item, value) => {
  const tanggalPencairan = value || null

  if (
    tanggalPencairanSaving.value[item.row_key]
    || tanggalPencairan === (item.tanggal_pencairan || null)
  ) {
    return
  }

  try {
    tanggalPencairanSaving.value = {
      ...tanggalPencairanSaving.value,
      [item.row_key]: true,
    }

    const response = await updateTanggalPencairan([item], tanggalPencairan)

    showSnackbar({
      text: response.message,
      color: "success",
    })
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    tanggalPencairanSaving.value = {
      ...tanggalPencairanSaving.value,
      [item.row_key]: false,
    }
  }
}

const setProsesRabPencairanDate = async (item, value) => {
  const nextValue = toDateValue(value)

  if (!nextValue) return

  prosesRabPencairanDateMenus.value = {
    ...prosesRabPencairanDateMenus.value,
    [item.row_key]: false,
  }

  await saveTanggalPencairan(item, nextValue)
}

const saveBulkTanggalPencairan = async (clearDate = false) => {
  if (bulkTanggalSaving.value || selectedRekapItems.value.length === 0) return

  if (!clearDate && !bulkTanggalPencairan.value) {
    showSnackbar({
      text: "Pilih tanggal pencairan terlebih dahulu.",
      color: "warning",
    })

    return
  }

  try {
    bulkTanggalSaving.value = true

    const response = await updateTanggalPencairan(
      selectedRekapItems.value,
      clearDate ? null : bulkTanggalPencairan.value,
    )

    clearSelectedRekaps()
    if (clearDate) bulkTanggalPencairan.value = null

    showSnackbar({
      text: response.message,
      color: "success",
    })
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    bulkTanggalSaving.value = false
  }
}

const saveKasManual = async () => {
  if (kasSaving.value) return

  if (
    !kasForm.value.petugas_id
    || !kasForm.value.module_key
    || !kasForm.value.tanggal
    || !String(kasForm.value.keterangan || "").trim()
  ) {
    showSnackbar({
      text: "Petugas, kategori, tanggal, dan keterangan saldo wajib diisi.",
      color: "warning",
    })
    
    return
  }

  try {
    kasSaving.value = true

    const response = await $api(
      kasEditingId.value
        ? `/admin/laporan/rab/kas/manual/${kasEditingId.value}`
        : "/admin/laporan/rab/kas/manual",
      {
        method: kasEditingId.value ? "PUT" : "POST",
        body: {
          ...kasForm.value,
          nominal: Number(kasForm.value.nominal || 0),
        },
      },
    )

    kasFormDialog.value = false
    kasEditingId.value = null
    showSnackbar({
      text: response.message,
      color: "success",
    })
    fetchKas()
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    kasSaving.value = false
  }
}

const deleteKasManual = async item => {
  try {
    const response = await $api(`/admin/laporan/rab/kas/manual/${item.id}`, {
      method: "DELETE",
    })

    showSnackbar({
      text: response.message,
      color: "success",
    })
    fetchKas()
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  }
}

watch([selectedRekapKeys, dataTable], syncSelectedRekapCache, { deep: true })

watch(prosesRabSearch, () => {
  clearTimeout(prosesRabSearchTimer)
  prosesRabSearchTimer = setTimeout(fetchProsesRab, 350)
})

watch([selectedBulan, selectedTahun, selectedModule, selectedPetugasId], () => {
  if (resettingFilters.value) return

  clearSelectedRekaps()
  page.value = 1
  fetchData()
}, { deep: true })

watch(selectedModule, fetchPetugas)

watch(() => rekapForm.value.module_key, moduleKey => {
  if (rekapFormDialog.value && !rekapForm.value.input_piutang) {
    fetchRekapPetugas(moduleKey)
  }
})

watch(() => rekapForm.value.input_piutang, async inputPiutang => {
  if (!rekapFormDialog.value) return

  if (inputPiutang) {
    rekapForm.value.module_key = PIUTANG_MODULE_KEY
    rekapForm.value.petugas_id = null
    syncPiutangRekapName()
    await fetchPiutangPegawaiOptions()

    return
  }

  const moduleKey = defaultRegularModuleKey()

  rekapForm.value.module_key = moduleKey
  rekapForm.value.piutang_pegawai_id = null
  rekapForm.value.nama = ""
  await fetchRekapPetugas(moduleKey)
})

watch(
  [
    () => rekapForm.value.piutang_pegawai_id,
    () => rekapForm.value.keterangan,
    piutangPegawaiList,
  ],
  syncPiutangRekapName,
  { deep: true },
)

watch(search, () => {
  if (resettingFilters.value) return

  clearTimeout(searchTimer)
  clearSelectedRekaps()
  page.value = 1
  searchTimer = setTimeout(fetchData, 350)
})

onMounted(async () => {
  document.title = "RAB - SIMKEU"
  await fetchPetugas()
  fetchData()
})

onBeforeUnmount(() => {
  clearTimeout(searchTimer)
  clearTimeout(prosesRabSearchTimer)
  statsRequestToken += 1
})
</script>

<template>
  <div>
    <div class="rab-header mb-5">
      <div>
        <h1 class="text-h4 font-weight-semibold">
          RAB
        </h1>
        <p class="text-body-1 text-medium-emphasis mb-0">
          Rekap anggaran seluruh pengeluaran Barokah
        </p>
      </div>
    </div>

    <div class="rab-stat-grid mb-5">
      <VCard
        v-for="item in statCards"
        :key="item.key"
        :class="{ 'rab-stat-card--clickable': item.clickable }"
        :role="item.clickable ? 'button' : undefined"
        :tabindex="item.clickable ? 0 : undefined"
        @click="item.clickable && openKasDetailDialog()"
        @keydown.enter="item.clickable && openKasDetailDialog()"
      >
        <VCardText class="d-flex align-center gap-4">
          <VAvatar
            :color="item.color"
            variant="tonal"
            rounded
            size="48"
          >
            <VIcon
              :icon="item.icon"
              size="24"
            />
          </VAvatar>

          <div class="min-w-0">
            <div class="text-body-2 text-medium-emphasis">
              {{ item.title }}
            </div>
            <VSkeletonLoader
              v-if="initialLoading || item.loading"
              type="text"
              width="120"
            />
            <div
              v-else
              class="text-h5 font-weight-semibold rab-stat-value"
            >
              {{ item.value }}
            </div>
            <div class="text-caption text-disabled">
              {{ item.note }}
            </div>
          </div>
        </VCardText>
      </VCard>
    </div>

    <PengeluaranPetugasFilter
      v-model="selectedPetugasId"
      :items="petugasList"
    />

    <VCard class="mb-5">
      <VCardText>
        <VRow align="center">
          <VCol
            cols="12"
            md="4"
            lg="3"
          >
            <VTextField
              v-model="search"
              label="Cari Rekap"
              placeholder="Nama, keterangan, atau modul"
              prepend-inner-icon="ri-search-line"
              clearable
              hide-details
            />
          </VCol>

          <VCol
            cols="12"
            sm="6"
            md="2"
            lg="2"
          >
            <VSelect
              v-model="selectedBulan"
              label="Bulan"
              :items="bulanItems"
              multiple
              chips
              closable-chips
              placeholder="Semua bulan"
              clearable
              hide-details
            />
          </VCol>

          <VCol
            cols="12"
            sm="6"
            md="2"
            lg="2"
          >
            <VSelect
              v-model="selectedTahun"
              label="Tahun"
              :items="yearItems"
              clearable
              hide-details
            />
          </VCol>

          <VCol
            cols="12"
            md="4"
            lg="2"
          >
            <VSelect
              v-model="selectedModule"
              label="Jenis Rekap"
              :items="modules"
              clearable
              hide-details
            />
          </VCol>

          <VCol
            cols="12"
            sm="6"
            md="4"
            lg="2"
          >
            <VBtn
              class="w-100"
              height="56"
              variant="outlined"
              color="secondary"
              prepend-icon="ri-refresh-line"
              @click="resetFilters"
            >
              Reset
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VCard class="mb-5">
      <VCardText class="rab-table-header">
        <div class="min-w-0">
          <div class="text-h6 font-weight-semibold text-truncate">
            List Proses RAB
          </div>
          <div class="text-body-2 text-medium-emphasis text-truncate">
            {{ prosesRabList.length }} proses ditemukan
          </div>
        </div>

        <div class="d-flex flex-wrap justify-end gap-2">
          <VBtn
            color="success"
            variant="tonal"
            prepend-icon="ri-file-list-3-line"
            :loading="exportingProsesRabRekapan"
            :disabled="prosesRabLoading || exportingProsesRabRekapan || prosesRabList.length === 0"
            @click="downloadProsesRabRekapan"
          >
            Download Rekapan
          </VBtn>

          <VBtn
            variant="outlined"
            color="secondary"
            prepend-icon="ri-refresh-line"
            :loading="prosesRabLoading"
            :disabled="prosesRabLoading || exportingProsesRabRekapan"
            @click="fetchProsesRab"
          >
            Refresh
          </VBtn>
        </div>
      </VCardText>

      <VDivider />

      <VCardText>
        <VRow align="center">
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="prosesRabSearch"
              label="Cari Proses RAB"
              placeholder="Kategori, keterangan, nama rekap, petugas, atau jenis"
              prepend-inner-icon="ri-search-line"
              clearable
              hide-details
            />
          </VCol>
        </VRow>
      </VCardText>

      <VDivider />

      <VDataTable
        :headers="[
          { title: 'No', key: 'nomor', sortable: false },
          { title: 'Tanggal Cetak', key: 'tanggal_cetak' },
          { title: 'Kategori', key: 'kategori', sortable: false },
          { title: 'Jumlah Rekap', key: 'jumlah_rekap', align: 'end' },
          { title: 'Total RAB', key: 'total_rab', align: 'end' },
          { title: 'Keterangan', key: 'keterangan', sortable: false },
          { title: '', key: 'actions', sortable: false, align: 'end' },
        ]"
        :items="prosesRabList"
        :loading="prosesRabLoading"
        density="comfortable"
        item-value="id"
      >
        <template #no-data>
          <div class="text-center pa-6 text-medium-emphasis">
            Belum ada proses RAB sesuai filter.
          </div>
        </template>

        <template #item.nomor="{ index }">
          {{ index + 1 }}
        </template>

        <template #item.tanggal_cetak="{ item }">
          <div class="font-weight-medium">
            {{ formatDate(item.tanggal_cetak) }}
          </div>
        </template>

        <template #item.kategori="{ item }">
          <span class="font-weight-medium">{{ item.kategori || "-" }}</span>
        </template>

        <template #item.jumlah_rekap="{ item }">
          {{ Number(item.jumlah_rekap || 0).toLocaleString("id-ID") }}
        </template>

        <template #item.total_rab="{ item }">
          <strong>{{ formatRupiah(item.total_rab || 0) }}</strong>
        </template>

        <template #item.keterangan="{ item }">
          <span class="text-medium-emphasis">{{ item.keterangan || "-" }}</span>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex justify-end gap-1">
            <VTooltip
              text="Lihat detail proses"
              location="top"
            >
              <template #activator="{ props: tooltipProps }">
                <VBtn
                  v-bind="tooltipProps"
                  icon="ri-eye-line"
                  variant="text"
                  color="primary"
                  size="small"
                  :loading="prosesRabDetailLoading && String(prosesRabDetailItem?.id) === String(item.id)"
                  :disabled="Boolean(prosesRabDeleting[item.id]) || Boolean(prosesRabDownloading[item.id]) || exportingProsesRabRekapan"
                  @click="openProsesRabDetail(item)"
                />
              </template>
            </VTooltip>

            <VTooltip
              text="Edit proses"
              location="top"
            >
              <template #activator="{ props: tooltipProps }">
                <VBtn
                  v-bind="tooltipProps"
                  icon="ri-edit-2-line"
                  variant="text"
                  color="warning"
                  size="small"
                  :disabled="Boolean(prosesRabDeleting[item.id]) || Boolean(prosesRabDownloading[item.id]) || prosesRabDetailLoading || exportingProsesRabRekapan"
                  @click="openEditProsesRab(item)"
                />
              </template>
            </VTooltip>

            <VTooltip
              text="Download RAB"
              location="top"
            >
              <template #activator="{ props: tooltipProps }">
                <VBtn
                  v-bind="tooltipProps"
                  icon="ri-file-excel-2-line"
                  variant="text"
                  color="success"
                  size="small"
                  :loading="Boolean(prosesRabDownloading[item.id])"
                  :disabled="Boolean(prosesRabDeleting[item.id]) || exportingProsesRabRekapan"
                  @click="downloadProsesRab(item)"
                />
              </template>
            </VTooltip>

            <VTooltip
              text="Hapus proses RAB"
              location="top"
            >
              <template #activator="{ props: tooltipProps }">
                <VBtn
                  v-bind="tooltipProps"
                  icon="ri-delete-bin-line"
                  variant="text"
                  color="error"
                  size="small"
                  :loading="Boolean(prosesRabDeleting[item.id])"
                  :disabled="Boolean(prosesRabDownloading[item.id]) || exportingProsesRabRekapan"
                  @click="deleteProsesRab(item)"
                />
              </template>
            </VTooltip>
          </div>
        </template>
      </VDataTable>
    </VCard>

    <VDialog
      v-model="prosesRabDetailDialog"
      max-width="1120"
    >
      <VCard>
        <VCardTitle class="d-flex align-center justify-space-between gap-3">
          <div class="min-w-0">
            <div class="text-h6 font-weight-semibold text-truncate">
              Detail Proses RAB
            </div>
            <div class="text-body-2 text-medium-emphasis text-truncate">
              {{ prosesRabDetailItem?.kategori || "-" }} - {{ formatDate(prosesRabDetailItem?.tanggal_cetak) }}
            </div>
          </div>

          <DialogCloseBtn
            variant="text"
            size="default"
            @click="prosesRabDetailDialog = false"
          />
        </VCardTitle>

        <VDivider />

        <VCardText>
          <div class="rab-process-summary mb-4">
            <div>
              <span>Jumlah Rekap</span>
              <strong>{{ Number(prosesRabDetailItem?.jumlah_rekap || prosesRabDetailRows.length || 0).toLocaleString("id-ID") }}</strong>
            </div>
            <div>
              <span>Total RAB</span>
              <strong>{{ formatRupiah(prosesRabDetailItem?.total_rab || prosesRabDetailTotalRab) }}</strong>
            </div>
            <div>
              <span>Total LPJ</span>
              <strong>{{ formatRupiah(prosesRabDetailTotalLpj) }}</strong>
            </div>
            <div>
              <span>Keterangan</span>
              <strong>{{ prosesRabDetailItem?.keterangan || "-" }}</strong>
            </div>
          </div>

          <VDataTable
            :headers="[
              { title: 'Tanggal', key: 'tanggal_rekap' },
              { title: 'Tanggal Pencairan', key: 'tanggal_pencairan' },
              { title: 'Petugas', key: 'petugas_nama' },
              { title: 'Jenis', key: 'module_name' },
              { title: 'Nama Rekap', key: 'nama' },
              { title: 'Jumlah RAB', key: 'jumlah', align: 'end' },
              { title: 'Jumlah LPJ', key: 'total_lpj', align: 'end' },
              { title: 'Keterangan', key: 'keterangan', sortable: false },
              { title: '', key: 'actions', sortable: false, align: 'end' },
            ]"
            :items="prosesRabDetailRows"
            :loading="prosesRabDetailLoading"
            density="compact"
            fixed-header
            height="420"
            item-value="row_key"
            :items-per-page="10"
          >
            <template #item.tanggal_rekap="{ item }">
              {{ formatDate(item.tanggal_rekap) }}
            </template>

            <template #item.tanggal_pencairan="{ item }">
              {{ formatDate(item.tanggal_pencairan) }}
            </template>

            <template #item.petugas_nama="{ item }">
              {{ item.petugas_nama || "-" }}
            </template>

            <template #item.module_name="{ item }">
              <VChip
                :color="moduleColor(item.module_key)"
                size="x-small"
                label
              >
                {{ item.module_name }}
              </VChip>
            </template>

            <template #item.nama="{ item }">
              <span class="font-weight-medium">{{ item.nama }}</span>
            </template>

            <template #item.jumlah="{ item }">
              <strong>{{ formatRupiah(item.jumlah || 0) }}</strong>
            </template>

            <template #item.total_lpj="{ item }">
              <strong>{{ formatRupiah(item.total_lpj || 0) }}</strong>
            </template>

            <template #item.keterangan="{ item }">
              <span class="text-medium-emphasis">{{ item.keterangan || "-" }}</span>
            </template>

            <template #item.actions="{ item }">
              <VTooltip
                text="Buka rekap"
                location="top"
              >
                <template #activator="{ props: tooltipProps }">
                  <VBtn
                    v-bind="tooltipProps"
                    icon="ri-arrow-right-line"
                    variant="text"
                    color="primary"
                    size="small"
                    @click="openDetail(item)"
                  />
                </template>
              </VTooltip>
            </template>
          </VDataTable>
        </VCardText>

        <VCardText class="d-flex justify-end gap-3">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="prosesRabDetailDialog = false"
          >
            Tutup
          </VBtn>
          <VBtn
            color="warning"
            variant="tonal"
            prepend-icon="ri-edit-2-line"
            :disabled="!prosesRabDetailItem || prosesRabDetailLoading"
            @click="openEditProsesRab(prosesRabDetailItem)"
          >
            Edit Proses
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <VCard>
      <VCardText class="rab-table-header">
        <div class="min-w-0">
          <div class="text-h6 font-weight-semibold text-truncate">
            Daftar Rekap Anggaran
          </div>
          <div class="text-body-2 text-medium-emphasis text-truncate">
            {{ totalItems }} rekap ditemukan
          </div>
        </div>

        <div class="rab-table-header-action">
          <VBtn
            class="rab-export-button"
            color="success"
            variant="tonal"
            prepend-icon="ri-file-excel-2-line"
            :loading="exportingExcel"
            :disabled="exportingExcel"
            @click="exportRabExcel"
          >
            Download RAB
          </VBtn>

          <VBtn
            v-if="canProcessRab"
            class="rab-export-button"
            color="warning"
            variant="tonal"
            prepend-icon="ri-printer-line"
            :disabled="selectedRekapItems.length === 0 || prosesRabSaving"
            @click="openProsesRabDialog"
          >
            Proses RAB
          </VBtn>

          <VBtn
            v-if="canProcessRab"
            class="rab-export-button"
            color="info"
            variant="tonal"
            prepend-icon="ri-folder-add-line"
            :disabled="selectedRekapItems.length === 0 || appendProsesRabSaving"
            @click="openAppendProsesRabDialog"
          >
            Masukkan di Proses RAB
          </VBtn>

          <VBtn
            class="rab-add-button"
            color="primary"
            prepend-icon="ri-add-line"
            @click="openRekapForm"
          >
            Tambah Data
          </VBtn>
        </div>
      </VCardText>

      <VDivider />

      <VCardText
        v-if="canEditTanggalPencairan"
        class="rab-pencairan-toolbar"
      >
        <div class="rab-pencairan-toolbar-copy">
          <div class="font-weight-semibold">
            Input Tanggal Pencairan
          </div>
          <div class="text-caption text-medium-emphasis">
            Edit langsung pada kolom tanggal, atau pilih beberapa baris untuk memakai tanggal yang sama.
          </div>
        </div>

        <div class="rab-pencairan-toolbar-actions">
          <VChip
            color="primary"
            variant="tonal"
            label
          >
            {{ selectedRekapItems.length }} dipilih
          </VChip>

          <div class="rab-bulk-date">
            <AppDateTimePicker
              v-model="bulkTanggalPencairan"
              placeholder="Pilih tanggal cair"
              prepend-inner-icon="ri-calendar-check-line"
              clearable
              hide-details
              density="compact"
              :config="tanggalPencairanPickerConfig"
              :disabled="bulkTanggalSaving"
            />
          </div>

          <VBtn
            color="primary"
            prepend-icon="ri-check-double-line"
            :loading="bulkTanggalSaving"
            :disabled="bulkTanggalSaving || selectedRekapItems.length === 0 || !bulkTanggalPencairan"
            @click="saveBulkTanggalPencairan(false)"
          >
            Terapkan
          </VBtn>

          <VBtn
            variant="outlined"
            color="secondary"
            prepend-icon="ri-eraser-line"
            :disabled="bulkTanggalSaving || selectedRekapItems.length === 0"
            @click="saveBulkTanggalPencairan(true)"
          >
            Kosongkan
          </VBtn>
        </div>
      </VCardText>

      <VDivider v-if="canEditTanggalPencairan" />

      <VDataTableServer
        v-model:model-value="selectedRekapKeys"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        v-model:sort-by="sortBy"
        :show-select="canSelectRekap"
        :headers="[
          { title: 'No', key: 'nomor', sortable: false },
          { title: 'Tanggal Rekap', key: 'tanggal_rekap' },
          { title: 'Tanggal Pencairan', key: 'tanggal_pencairan' },
          { title: 'Cetak RAB', key: 'cetak_rab', sortable: false },
          { title: 'Periode', key: 'bulan_tahun' },
          { title: 'Nama Petugas', key: 'petugas_nama' },
          { title: 'Nama Rekap', key: 'nama' },
          { title: 'Jenis', key: 'module_name' },
          { title: 'Jumlah Data', key: 'jumlah_data', align: 'end' },
          { title: 'Jumlah RAB', key: 'jumlah', align: 'end' },
          { title: 'Jumlah LPJ', key: 'total_lpj', align: 'end' },
          { title: 'Keterangan', key: 'keterangan', sortable: false },
          { title: '', key: 'actions', sortable: false, align: 'end' },
        ]"
        :items="dataTable"
        :items-length="totalItems"
        :loading="loading"
        item-value="row_key"
        @update:options="loadItems"
      >
        <template #loading>
          <div class="text-center pa-6">
            <VProgressCircular
              indeterminate
              color="primary"
            />
          </div>
        </template>

        <template #no-data>
          <div class="text-center pa-8">
            <VIcon
              icon="ri-file-search-line"
              size="36"
              class="mb-2"
            />
            <div>Tidak ada rekap sesuai filter.</div>
          </div>
        </template>

        <template #item.nomor="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </template>

        <template #item.tanggal_rekap="{ item }">
          <div class="font-weight-medium">
            {{ formatDate(item.tanggal_rekap) }}
          </div>
        </template>

        <template #item.tanggal_pencairan="{ item }">
          <div
            v-if="canEditTanggalPencairan"
            class="rab-inline-date"
          >
            <AppDateTimePicker
              :model-value="item.tanggal_pencairan"
              placeholder="Belum cair"
              prepend-inner-icon="ri-calendar-check-line"
              clearable
              hide-details
              density="compact"
              :config="tanggalPencairanPickerConfig"
              :disabled="Boolean(tanggalPencairanSaving[item.row_key])"
              @update:model-value="value => saveTanggalPencairan(item, value)"
            />
            <VProgressCircular
              v-if="tanggalPencairanSaving[item.row_key]"
              indeterminate
              color="primary"
              size="18"
              width="2"
            />
          </div>

          <VChip
            v-else
            :color="item.tanggal_pencairan ? 'success' : 'warning'"
            size="small"
            variant="tonal"
            label
          >
            {{ item.tanggal_pencairan ? formatDate(item.tanggal_pencairan) : "Belum cair" }}
          </VChip>
        </template>

        <template #item.cetak_rab="{ item }">
          <VChip
            :color="item.cetak_rab ? 'success' : 'secondary'"
            size="small"
            variant="tonal"
            label
          >
            {{ item.cetak_rab ? "Sudah" : "Belum" }}
          </VChip>
        </template>

        <template #item.bulan_tahun="{ item }">
          <div class="font-weight-medium">
            {{ formatMonthYear(item.bulan_tahun) }}
          </div>
        </template>

        <template #item.petugas_nama="{ item }">
          {{ item.petugas_nama || "-" }}
        </template>

        <template #item.nama="{ item }">
          <button
            type="button"
            class="rab-name"
            @click="openDetail(item)"
          >
            {{ item.nama }}
          </button>
        </template>

        <template #item.module_name="{ item }">
          <VChip
            :color="moduleColor(item.module_key)"
            size="small"
            label
          >
            {{ item.module_name }}
          </VChip>
        </template>

        <template #item.jumlah_data="{ item }">
          {{ Number(item.jumlah_data || 0).toLocaleString("id-ID") }}
        </template>

        <template #item.jumlah="{ item }">
          <div class="rab-amount">
            <strong>{{ formatRupiah(item.jumlah) }}</strong>
            <VChip
              :color="item.jumlah_sementara !== null && Number(item.jumlah_data || 0) > 0
                ? 'warning'
                : item.is_jumlah_sementara ? 'secondary' : 'success'"
              size="x-small"
              variant="tonal"
              label
            >
              {{ item.jumlah_sementara !== null && Number(item.jumlah_data || 0) > 0
                ? 'Belum sinkron'
                : item.is_jumlah_sementara ? 'Sementara' : 'Detail' }}
            </VChip>
          </div>
        </template>

        <template #item.total_lpj="{ item }">
          <strong>{{ formatRupiah(item.total_lpj || 0) }}</strong>
        </template>

        <template #item.keterangan="{ item }">
          <span class="text-medium-emphasis">{{ item.keterangan || "-" }}</span>
        </template>

        <template #item.actions="{ item }">
          <VTooltip
            text="Lihat detail rekap"
            location="top"
          >
            <template #activator="{ props: tooltipProps }">
              <VBtn
                v-bind="tooltipProps"
                icon="ri-arrow-right-line"
                variant="text"
                color="primary"
                size="small"
                @click="openDetail(item)"
              />
            </template>
          </VTooltip>
        </template>
      </VDataTableServer>
    </VCard>

    <VDialog
      v-model="appendProsesRabDialog"
      max-width="920"
    >
      <VCard title="Masukkan di Proses RAB">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="appendProsesRabDialog = false"
        />

        <VCardText>
          <div class="rab-process-summary mb-4">
            <div>
              <span>Rekap Dipilih</span>
              <strong>{{ selectedRekapItems.length.toLocaleString("id-ID") }}</strong>
            </div>
            <div>
              <span>Total RAB</span>
              <strong>{{ formatRupiah(prosesRabDialogTotal) }}</strong>
            </div>
            <div>
              <span>Proses Tujuan</span>
              <strong>{{ selectedAppendProsesRab?.kategori || "-" }}</strong>
            </div>
          </div>

          <VAutocomplete
            v-model="appendProsesRabTargetId"
            label="Proses RAB Tujuan *"
            placeholder="Pilih proses RAB"
            :items="appendProsesRabOptions"
            prepend-inner-icon="ri-folder-add-line"
            no-data-text="Belum ada proses RAB sesuai filter"
            :loading="prosesRabLoading"
            :disabled="appendProsesRabSaving"
            :rules="[requiredValidator]"
          />
        </VCardText>

        <VDivider />

        <VCardText>
          <div class="font-weight-semibold mb-3">
            Data yang Dimasukkan
          </div>

          <VDataTable
            :headers="prosesRabDialogHeaders"
            :items="selectedRekapItems"
            density="compact"
            fixed-header
            height="300"
            item-value="row_key"
            :items-per-page="5"
          >
            <template #item.tanggal_rekap="{ item }">
              {{ formatDate(item.tanggal_rekap) }}
            </template>

            <template #item.tanggal_pencairan="{ item }">
              {{ formatDate(item.tanggal_pencairan) }}
            </template>

            <template #item.petugas_nama="{ item }">
              {{ item.petugas_nama || "-" }}
            </template>

            <template #item.module_name="{ item }">
              <VChip
                :color="moduleColor(item.module_key)"
                size="x-small"
                label
              >
                {{ item.module_name }}
              </VChip>
            </template>

            <template #item.nama="{ item }">
              <span class="font-weight-medium">{{ item.nama }}</span>
            </template>

            <template #item.jumlah="{ item }">
              <strong>{{ formatRupiah(item.jumlah || 0) }}</strong>
            </template>

            <template #item.total_lpj="{ item }">
              <strong>{{ formatRupiah(item.total_lpj || 0) }}</strong>
            </template>

            <template #item.keterangan="{ item }">
              <span class="text-medium-emphasis">{{ item.keterangan || "-" }}</span>
            </template>
          </VDataTable>
        </VCardText>

        <VCardText class="d-flex justify-end gap-3">
          <VBtn
            variant="outlined"
            color="secondary"
            :disabled="appendProsesRabSaving"
            @click="appendProsesRabDialog = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="info"
            prepend-icon="ri-folder-add-line"
            :loading="appendProsesRabSaving"
            :disabled="appendProsesRabSaving || selectedRekapItems.length === 0 || !appendProsesRabTargetId"
            @click="saveAppendProsesRab"
          >
            Masukkan
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <VDialog
      v-model="prosesRabDialog"
      max-width="1120"
    >
      <VCard :title="prosesRabDialogTitle">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="prosesRabDialog = false"
        />

        <VCardText>
          <div class="rab-process-summary mb-4">
            <div>
              <span>{{ prosesRabEditingId ? "Isi Proses" : "Rekap Dipilih" }}</span>
              <strong>{{ prosesRabDialogRows.length.toLocaleString("id-ID") }}</strong>
            </div>
            <div>
              <span>Total RAB</span>
              <strong>{{ formatRupiah(prosesRabDialogTotal) }}</strong>
            </div>
            <div>
              <span>Total LPJ</span>
              <strong>{{ formatRupiah(prosesRabDialogTotalLpj) }}</strong>
            </div>
          </div>

          <div class="rab-process-detail mb-5">
            <div class="d-flex flex-wrap align-center justify-space-between gap-3 mb-3">
              <div class="font-weight-semibold">
                Data yang Diproses
              </div>
              <div class="d-flex flex-wrap justify-end gap-2">
                <VChip
                  v-if="prosesRabEditingId"
                  color="secondary"
                  variant="tonal"
                  label
                >
                  {{ prosesRabSelectedRows.length }} dipilih
                </VChip>

                <VMenu
                  v-if="prosesRabEditingId && canEditTanggalPencairan"
                  v-model="prosesRabBulkPencairanDateMenu"
                  :close-on-content-click="false"
                  location="bottom"
                  offset="6"
                >
                  <template #activator="{ props: menuProps }">
                    <VBtn
                      v-bind="menuProps"
                      size="small"
                      variant="tonal"
                      color="primary"
                      prepend-icon="ri-calendar-check-line"
                      :loading="prosesRabBulkTanggalSaving"
                      :disabled="prosesRabBulkTanggalSaving || prosesRabSelectedRows.length === 0"
                    >
                      Isi Tanggal
                    </VBtn>
                  </template>

                  <VDatePicker
                    :model-value="parseDateValue(todayDateValue())"
                    color="primary"
                    hide-header
                    @update:model-value="setSelectedProsesRabPencairanDate"
                  />
                </VMenu>

                <VBtn
                  v-if="prosesRabEditingId && canEditTanggalPencairan"
                  size="small"
                  variant="outlined"
                  color="secondary"
                  prepend-icon="ri-eraser-line"
                  :disabled="prosesRabBulkTanggalSaving || prosesRabSelectedRows.length === 0"
                  @click="clearSelectedProsesRabPencairanDate"
                >
                  Kosongkan
                </VBtn>

                <VBtn
                  v-if="prosesRabEditingId"
                  size="small"
                  variant="tonal"
                  color="error"
                  prepend-icon="ri-delete-bin-line"
                  :disabled="prosesRabSaving || prosesRabBulkTanggalSaving || prosesRabSelectedRows.length === 0"
                  @click="releaseSelectedProsesRabItems"
                >
                  Lepas
                </VBtn>

                <VChip
                  color="primary"
                  variant="tonal"
                  label
                >
                  {{ prosesRabDialogRows.length }} rekap
                </VChip>
              </div>
            </div>

            <VDataTable
              v-model:model-value="prosesRabSelectedKeys"
              :show-select="Boolean(prosesRabEditingId)"
              :headers="prosesRabDialogHeaders"
              :items="prosesRabDialogRows"
              density="compact"
              fixed-header
              height="320"
              item-value="row_key"
              :items-per-page="-1"
              hide-default-footer
            >
              <template #item.tanggal_rekap="{ item }">
                {{ formatDate(item.tanggal_rekap) }}
              </template>

              <template #item.tanggal_pencairan="{ item }">
                <div
                  v-if="prosesRabEditingId && canEditTanggalPencairan"
                  class="rab-inline-date"
                >
                  <VMenu
                    v-model="prosesRabPencairanDateMenus[item.row_key]"
                    :close-on-content-click="false"
                    location="bottom"
                    offset="6"
                  >
                    <template #activator="{ props: menuProps }">
                      <VTextField
                        v-bind="menuProps"
                        :model-value="item.tanggal_pencairan ? formatDate(item.tanggal_pencairan) : 'Belum cair'"
                        prepend-inner-icon="ri-calendar-check-line"
                        readonly
                        hide-details
                        density="compact"
                        :disabled="prosesRabSaving || Boolean(tanggalPencairanSaving[item.row_key])"
                      />
                    </template>

                    <VDatePicker
                      :model-value="parseDateValue(item.tanggal_pencairan) || parseDateValue(todayDateValue())"
                      color="primary"
                      hide-header
                      @update:model-value="value => setProsesRabPencairanDate(item, value)"
                    />
                  </VMenu>

                  <VBtn
                    icon="ri-eraser-line"
                    variant="text"
                    color="secondary"
                    size="small"
                    :disabled="prosesRabSaving || Boolean(tanggalPencairanSaving[item.row_key]) || !item.tanggal_pencairan"
                    @click="saveTanggalPencairan(item, null)"
                  />

                  <VProgressCircular
                    v-if="tanggalPencairanSaving[item.row_key]"
                    indeterminate
                    color="primary"
                    size="18"
                    width="2"
                  />
                </div>

                <VChip
                  v-else
                  :color="item.tanggal_pencairan ? 'success' : 'warning'"
                  size="small"
                  variant="tonal"
                  label
                >
                  {{ item.tanggal_pencairan ? formatDate(item.tanggal_pencairan) : "Belum cair" }}
                </VChip>
              </template>

              <template #item.petugas_nama="{ item }">
                {{ item.petugas_nama || "-" }}
              </template>

              <template #item.module_name="{ item }">
                <VChip
                  :color="moduleColor(item.module_key)"
                  size="x-small"
                  label
                >
                  {{ item.module_name }}
                </VChip>
              </template>

              <template #item.nama="{ item }">
                <span class="font-weight-medium">{{ item.nama }}</span>
              </template>

              <template #item.jumlah="{ item }">
                <strong>{{ formatRupiah(item.jumlah || 0) }}</strong>
              </template>

              <template #item.total_lpj="{ item }">
                <strong>{{ formatRupiah(item.total_lpj || 0) }}</strong>
              </template>

              <template #item.keterangan="{ item }">
                <span class="text-medium-emphasis">{{ item.keterangan || "-" }}</span>
              </template>

              <template #item.actions="{ item }">
                <VTooltip
                  text="Lepas dari proses"
                  location="top"
                >
                  <template #activator="{ props: tooltipProps }">
                    <VBtn
                      v-bind="tooltipProps"
                      icon="ri-delete-bin-line"
                      variant="text"
                      color="error"
                      size="small"
                      :disabled="prosesRabSaving"
                      @click="releaseProsesRabItem(item)"
                    />
                  </template>
                </VTooltip>
              </template>
            </VDataTable>

            <VAlert
              v-if="prosesRabEditingId && prosesRabDialogRows.length === 0"
              class="mt-3"
              type="warning"
              variant="tonal"
              density="compact"
            >
              Semua rekap dilepas. Saat disimpan, proses RAB ini akan dihapus.
            </VAlert>
          </div>

          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <VMenu
                v-model="prosesRabDateMenu"
                :close-on-content-click="false"
                location="bottom"
                offset="6"
              >
                <template #activator="{ props: menuProps }">
                  <VTextField
                    v-bind="menuProps"
                    :model-value="formatDate(prosesRabForm.tanggal_cetak)"
                    label="Tanggal Cetak *"
                    prepend-inner-icon="ri-calendar-line"
                    readonly
                    :disabled="prosesRabSaving"
                    :rules="[requiredValidator]"
                  />
                </template>

                <VDatePicker
                  v-model="prosesRabTanggalCetakPicker"
                  color="primary"
                  hide-header
                  @update:model-value="prosesRabDateMenu = false"
                />
              </VMenu>
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="prosesRabForm.kategori_tipe"
                label="Kategori *"
                :items="prosesRabKategoriModeItems"
                :disabled="prosesRabSaving"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              v-if="prosesRabForm.kategori_tipe === 'rab_susulan'"
              cols="12"
              md="6"
            >
              <VSelect
                v-model="prosesRabForm.susulan_kategori"
                label="Kategori yang Disusulkan *"
                :items="prosesRabExistingKategoriItems"
                no-data-text="Belum ada kategori proses RAB"
                :disabled="prosesRabSaving"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              v-else-if="prosesRabForm.kategori_tipe === 'custom'"
              cols="12"
              md="6"
            >
              <VTextField
                v-model="prosesRabForm.custom_kategori"
                label="Kategori Lain *"
                placeholder="Masukkan kategori"
                :disabled="prosesRabSaving"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol cols="12">
              <VTextarea
                v-model="prosesRabForm.keterangan"
                label="Keterangan"
                placeholder="Contoh: RAB tahap 1 Juni 2026"
                auto-grow
                :disabled="prosesRabSaving"
              />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end gap-3">
          <VBtn
            variant="outlined"
            color="secondary"
            :disabled="prosesRabSaving"
            @click="prosesRabDialog = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="primary"
            prepend-icon="ri-save-line"
            :loading="prosesRabSaving"
            :disabled="prosesRabSaving || (!prosesRabEditingId && selectedRekapItems.length === 0) || !prosesRabFinalKategori"
            @click="saveProsesRab"
          >
            {{ prosesRabEditingId ? "Simpan Perubahan" : "Simpan" }}
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <VDialog
      v-model="rekapFormDialog"
      width="760"
    >
      <VCard :title="rekapForm.input_piutang ? 'Tambah Piutang Cashbon' : 'Tambah Rekap Anggaran'">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="rekapFormDialog = false"
        />

        <VCardText>
          <VRow>
            <VCol cols="12">
              <VCheckbox
                v-model="rekapForm.input_piutang"
                label="Input Piutang"
                density="compact"
                hide-details
                :disabled="rekapSaving"
              />
            </VCol>

            <template v-if="!rekapForm.input_piutang">
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="rekapForm.module_key"
                  label="Jenis Rekap *"
                  :items="regularModuleItems"
                  :disabled="rekapSaving"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VAutocomplete
                  v-model="rekapForm.petugas_id"
                  label="Petugas *"
                  :items="rekapPetugasList"
                  :loading="rekapPetugasLoading"
                  :disabled="rekapSaving || !rekapForm.module_key"
                  :rules="[requiredValidator]"
                  clearable
                />
              </VCol>
            </template>

            <VCol
              v-else
              cols="12"
              md="6"
            >
              <VAutocomplete
                v-model="rekapForm.piutang_pegawai_id"
                label="Pegawai *"
                :items="piutangPegawaiList"
                :loading="piutangPegawaiLoading"
                :disabled="rekapSaving"
                :rules="[requiredValidator]"
                clearable
              />
            </VCol>

            <VCol cols="12">
              <VTextField
                v-model="rekapForm.nama"
                label="Nama Rekap *"
                :placeholder="rekapForm.input_piutang ? 'CASHBON Nama Pegawai ( Keterangan )' : 'Contoh: RAB Kegiatan Juni 2026'"
                :readonly="rekapForm.input_piutang"
                :disabled="rekapSaving"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              v-if="!rekapForm.input_piutang"
              cols="12"
              sm="6"
              md="4"
            >
              <VSelect
                v-model="rekapForm.bulan"
                label="Bulan Periode *"
                :items="bulanItems"
                :disabled="rekapSaving"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              v-if="!rekapForm.input_piutang"
              cols="12"
              sm="6"
              md="4"
            >
              <VSelect
                v-model="rekapForm.tahun"
                label="Tahun Periode *"
                :items="yearItems"
                :disabled="rekapSaving"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              :md="rekapForm.input_piutang ? 6 : 4"
            >
              <VMenu
                v-model="rekapTanggalRekapMenu"
                :close-on-content-click="false"
                location="bottom"
                offset="6"
              >
                <template #activator="{ props: menuProps }">
                  <VTextField
                    v-bind="menuProps"
                    :model-value="formatDate(rekapForm.tanggal_rekap)"
                    :label="rekapForm.input_piutang ? 'Tanggal Piutang *' : 'Tanggal Rekap *'"
                    prepend-inner-icon="ri-calendar-line"
                    readonly
                    :disabled="rekapSaving"
                    :rules="[requiredValidator]"
                  />
                </template>

                <VDatePicker
                  v-model="rekapTanggalRekapPicker"
                  color="primary"
                  hide-header
                />
              </VMenu>
            </VCol>

            <VCol
              cols="12"
              :md="rekapForm.input_piutang ? 6 : 4"
            >
              <VMenu
                v-model="rekapTanggalPencairanMenu"
                :close-on-content-click="false"
                location="bottom"
                offset="6"
              >
                <template #activator="{ props: menuProps }">
                  <VTextField
                    v-bind="menuProps"
                    :model-value="rekapForm.tanggal_pencairan ? formatDate(rekapForm.tanggal_pencairan) : ''"
                    label="Tanggal Pencairan (Opsional)"
                    placeholder="Belum ditentukan"
                    prepend-inner-icon="ri-calendar-check-line"
                    readonly
                    clearable
                    :disabled="rekapSaving"
                    @click:clear="rekapForm.tanggal_pencairan = null"
                  />
                </template>

                <VDatePicker
                  v-model="rekapTanggalPencairanPicker"
                  color="primary"
                  hide-header
                />
              </VMenu>
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="rekapForm.jumlah_sementara"
                :label="rekapForm.input_piutang ? 'Nominal Piutang *' : 'Jumlah RAB Sementara *'"
                type="number"
                :min="rekapForm.input_piutang ? 1 : 0"
                prefix="Rp"
                :hint="formatRupiah(rekapForm.jumlah_sementara)"
                persistent-hint
                :disabled="rekapSaving"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              v-if="rekapForm.input_piutang"
              cols="12"
              md="6"
            >
              <VTextField
                v-model="rekapForm.default_cicilan"
                label="Default Cicilan"
                type="number"
                min="0"
                prefix="Rp"
                :hint="formatRupiah(rekapForm.default_cicilan)"
                persistent-hint
                :disabled="rekapSaving"
              />
            </VCol>

            <VCol cols="12">
              <VTextarea
                v-model="rekapForm.keterangan"
                label="Keterangan"
                placeholder="Catatan singkat kebutuhan rekap"
                auto-grow
                :disabled="rekapSaving"
              />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end gap-3">
          <VBtn
            variant="outlined"
            color="secondary"
            :disabled="rekapSaving"
            @click="rekapFormDialog = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="primary"
            prepend-icon="ri-save-line"
            :loading="rekapSaving"
            :disabled="rekapSaving || rekapPetugasLoading || piutangPegawaiLoading"
            @click="saveRekap"
          >
            Simpan
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <VDialog
      v-model="kasDetailDialog"
      max-width="1120"
      scrollable
    >
      <VCard>
        <VCardItem>
          <VCardTitle>{{ saldoCardTitle }}</VCardTitle>
          <VCardSubtitle>
            RAB menambah saldo, LPJ mengurangi saldo, dan saldo awal menyesuaikan saldo petugas.
          </VCardSubtitle>

          <template #append>
            <VBtn
              color="primary"
              prepend-icon="ri-add-line"
              @click="openKasForm"
            >
              Tambah Saldo Awal
            </VBtn>
          </template>
        </VCardItem>

        <DialogCloseBtn
          variant="text"
          size="default"
          @click="kasDetailDialog = false"
        />

        <VDivider />

        <VCardText>
          <div class="kas-total-row mb-4">
            <div>
              <span>Total RAB</span>
              <strong>{{ formatRupiah(kasTotals.total_rab || 0) }}</strong>
            </div>
            <div>
              <span>Total LPJ</span>
              <strong>{{ formatRupiah(kasTotals.total_lpj || 0) }}</strong>
            </div>
            <div>
              <span>Saldo Awal / Penyesuaian</span>
              <strong>{{ formatRupiah(saldoAdjustmentTotal) }}</strong>
            </div>
            <div>
              <span>Saldo Akhir</span>
              <strong class="text-primary">{{ formatRupiah(kasTotals.saldo_kas || 0) }}</strong>
            </div>
          </div>

          <div
            v-if="kasLoading"
            class="text-center pa-4"
          >
            <VProgressCircular
              indeterminate
              color="primary"
            />
          </div>

          <div
            v-else
            class="kas-grid"
          >
            <div
              v-for="item in kasSummary"
              :key="item.module_key"
              class="kas-item"
            >
              <div class="kas-item-header">
                <VChip
                  :color="moduleColor(item.module_key)"
                  size="small"
                  label
                >
                  {{ item.module_name }}
                </VChip>
                <strong>{{ formatRupiah(item.saldo_kas) }}</strong>
              </div>
              <div class="kas-item-lines">
                <span>RAB masuk {{ formatRupiah(item.total_rab) }}</span>
                <span>LPJ keluar {{ formatRupiah(item.total_lpj) }}</span>
                <span>Saldo awal +{{ formatRupiah(item.manual_masuk) }} / -{{ formatRupiah(item.manual_keluar) }}</span>
              </div>
            </div>
          </div>

          <VDivider class="my-4" />

          <div class="d-flex flex-wrap align-center justify-space-between gap-3 mb-3">
            <div>
              <div class="font-weight-semibold">
                Detail Saldo Awal / Penyesuaian
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ kasManualRows.length }} data
              </div>
            </div>

            <VBtn
              variant="tonal"
              color="primary"
              prepend-icon="ri-add-line"
              @click="openKasForm"
            >
              Tambah
            </VBtn>
          </div>

          <VDataTable
            :headers="[
              { title: 'Tanggal', key: 'tanggal' },
              { title: 'Petugas', key: 'petugas_nama' },
              { title: 'Kategori', key: 'module_name' },
              { title: 'Tipe', key: 'tipe' },
              { title: 'Nominal', key: 'nominal', align: 'end' },
              { title: 'Keterangan', key: 'keterangan' },
              { title: '', key: 'actions', sortable: false, align: 'end' },
            ]"
            :items="kasManualRows"
            density="comfortable"
            class="kas-manual-table"
          >
            <template #no-data>
              <div class="text-center pa-6 text-medium-emphasis">
                Belum ada saldo awal atau penyesuaian.
              </div>
            </template>

            <template #item.tanggal="{ item }">
              {{ formatDate(item.tanggal) }}
            </template>

            <template #item.petugas_nama="{ item }">
              {{ item.petugas_nama || "-" }}
            </template>

            <template #item.module_name="{ item }">
              <VChip
                :color="moduleColor(item.module_key)"
                size="small"
                label
              >
                {{ item.module_name }}
              </VChip>
            </template>

            <template #item.tipe="{ item }">
              <VChip
                :color="item.tipe === 'masuk' ? 'success' : 'error'"
                size="small"
                label
              >
                {{ item.tipe === "masuk" ? "Masuk" : "Keluar" }}
              </VChip>
            </template>

            <template #item.nominal="{ item }">
              <strong>{{ item.tipe === "masuk" ? "+" : "-" }}{{ formatRupiah(item.nominal) }}</strong>
            </template>

            <template #item.keterangan="{ item }">
              <span class="text-medium-emphasis">{{ item.keterangan || "-" }}</span>
            </template>

            <template #item.actions="{ item }">
              <div class="d-flex justify-end gap-1">
                <VTooltip
                  text="Edit saldo awal"
                  location="top"
                >
                  <template #activator="{ props: tooltipProps }">
                    <VBtn
                      v-bind="tooltipProps"
                      icon="ri-pencil-line"
                      size="small"
                      variant="text"
                      color="primary"
                      @click="openKasForm(item)"
                    />
                  </template>
                </VTooltip>

                <VTooltip
                  text="Hapus saldo awal"
                  location="top"
                >
                  <template #activator="{ props: tooltipProps }">
                    <VBtn
                      v-bind="tooltipProps"
                      icon="ri-delete-bin-line"
                      size="small"
                      variant="text"
                      color="error"
                      @click="deleteKasManual(item)"
                    />
                  </template>
                </VTooltip>
              </div>
            </template>
          </VDataTable>
        </VCardText>
      </VCard>
    </VDialog>

    <VDialog
      v-model="kasFormDialog"
      width="680"
    >
      <VCard :title="kasEditingId ? 'Edit Saldo Awal' : 'Tambah Saldo Awal'">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="kasFormDialog = false"
        />

        <VCardText>
          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="kasForm.petugas_id"
                label="Petugas *"
                :items="petugasList"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="kasForm.module_key"
                label="Kategori *"
                :items="regularModuleItems"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <AppDateTimePicker
                v-model="kasForm.tanggal"
                label="Tanggal *"
                :config="{
                  altInput: true,
                  altFormat: 'd F Y',
                  dateFormat: 'Y-m-d',
                }"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="kasForm.tipe"
                label="Tipe Saldo *"
                :items="kasTipeItems"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="kasForm.nominal"
                label="Nominal *"
                type="number"
                min="1"
                prefix="Rp"
                :hint="formatRupiah(kasForm.nominal)"
                persistent-hint
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol cols="12">
              <VTextarea
                v-model="kasForm.keterangan"
                label="Keterangan *"
                placeholder="Saldo awal, hibah, koreksi saldo, dll."
                auto-grow
                :rules="[requiredValidator]"
              />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end gap-3">
          <VBtn
            variant="outlined"
            color="secondary"
            :disabled="kasSaving"
            @click="kasFormDialog = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="primary"
            prepend-icon="ri-save-line"
            :loading="kasSaving"
            :disabled="kasSaving"
            @click="saveKasManual"
          >
            Simpan
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.rab-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rab-stat-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
}

.rab-table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.rab-table-header-action {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  flex-wrap: wrap;
  gap: 10px;
}

.rab-pencairan-toolbar {
  display: flex;
  align-items: stretch;
  flex-direction: column;
  gap: 12px;
}

.rab-pencairan-toolbar-copy {
  width: 100%;
}

.rab-pencairan-toolbar-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 10px;
}

.rab-bulk-date {
  flex: 0 0 280px;
  min-width: 280px;
  width: 280px;
}

.rab-bulk-date :deep(.v-input),
.rab-bulk-date :deep(.v-field),
.rab-bulk-date :deep(.app-picker-field) {
  width: 100%;
}

.rab-inline-date {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 190px;
}

.rab-inline-date :deep(.v-input) {
  min-width: 160px;
}

.rab-process-summary {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.rab-process-summary > div {
  border: 1px solid rgba(var(--v-border-color), 0.16);
  border-radius: 8px;
  padding: 12px 14px;
}

.rab-process-summary span {
  color: rgba(var(--v-theme-on-surface), 0.64);
  display: block;
  font-size: 0.76rem;
  font-weight: 600;
}

.rab-process-summary strong {
  display: block;
  margin-block-start: 4px;
  overflow-wrap: anywhere;
}

.rab-process-detail {
  border: 1px solid rgba(var(--v-border-color), 0.16);
  border-radius: 8px;
  padding: 12px;
}

.rab-process-detail :deep(.v-table) {
  border-radius: 6px;
}

.rab-stat-card--clickable {
  cursor: pointer;
  transition: border-color 0.16s ease, transform 0.16s ease;
}

.rab-stat-card--clickable:hover {
  border-color: rgba(var(--v-theme-primary), 0.44);
  transform: translateY(-1px);
}

.rab-stat-card--clickable:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.rab-stat-value {
  overflow-wrap: anywhere;
}

.kas-total-row {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.kas-total-row > div,
.kas-item {
  border: 1px solid rgba(var(--v-border-color), 0.16);
  border-radius: 8px;
  padding: 12px 14px;
}

.kas-total-row span,
.kas-item-lines span {
  color: rgba(var(--v-theme-on-surface), 0.64);
  font-size: 0.76rem;
  font-weight: 600;
}

.kas-total-row strong {
  display: block;
  margin-block-start: 4px;
  font-size: 0.95rem;
  overflow-wrap: anywhere;
}

.kas-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.kas-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.kas-item-header strong {
  color: rgb(var(--v-theme-primary));
  overflow-wrap: anywhere;
  text-align: end;
}

.kas-item-lines {
  display: grid;
  margin-block-start: 10px;
  gap: 4px;
}

.kas-manual-table {
  border: 1px solid rgba(var(--v-border-color), 0.16);
  border-radius: 8px;
}

.rab-name {
  color: rgb(var(--v-theme-primary));
  font: inherit;
  font-weight: 600;
  text-align: start;
}

.rab-name:hover {
  text-decoration: underline;
}

.rab-amount {
  display: grid;
  justify-items: end;
  gap: 4px;
}

@media (max-width: 1199px) {
  .rab-stat-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .kas-total-row,
  .kas-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 599px) {
  .rab-stat-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .rab-table-header {
    align-items: stretch;
    flex-direction: column;
  }

  .rab-pencairan-toolbar,
  .rab-pencairan-toolbar-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .rab-pencairan-toolbar-actions {
    width: 100%;
  }

  .rab-bulk-date {
    min-width: 0;
    width: 100%;
  }

  .rab-table-header-action,
  .rab-add-button,
  .rab-export-button {
    inline-size: 100%;
  }

  .kas-total-row,
  .kas-grid,
  .rab-process-summary {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
