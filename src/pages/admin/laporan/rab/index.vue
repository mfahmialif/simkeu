<script setup>
/* eslint-disable camelcase */
import { downloadFileExport } from "@/composables/exportFile"
import { formatRupiah } from "@/composables/formatRupiah"
import PengeluaranPetugasFilter from "@/components/admin/pengeluaran/PengeluaranPetugasFilter.vue"
import { fetchPetugasPengeluaranOptions } from "@/composables/petugasPengeluaran"
import { showSnackbar } from "@/composables/snackbar"

const router = useRouter()
const route = useRoute()
const currentDate = new Date()
const page = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref([{ key: "tanggal_rekap", order: "desc" }])
const search = ref("")
const selectedBulan = ref(currentDate.getMonth() + 1)
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
const exportingRekapan = ref(false)
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
const rekapSaving = ref(false)
const rekapPetugasLoading = ref(false)
const rekapPetugasList = ref([])
const selectedRekapKeys = ref([])
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
  module_key: null,
  petugas_id: null,
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
  keterangan: "",
})

let searchTimer = null
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

const yearItems = computed(() => [...new Set([
  currentDate.getFullYear(),
  ...years.value,
])].sort((a, b) => b - a))

const saldoAdjustmentTotal = computed(() =>
  Number(kasTotals.value.manual_masuk || 0) - Number(kasTotals.value.manual_keluar || 0),
)

const selectedRekapItems = computed(() => {
  const selected = new Set(selectedRekapKeys.value)

  return dataTable.value.filter(item => selected.has(item.row_key))
})

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
}[key] || "secondary")

const kasTipeItems = [
  { title: "Saldo Awal / Penyesuaian Masuk", value: "masuk" },
  { title: "Penyesuaian Keluar", value: "keluar" },
]

const activeFilterPayload = () => {
  const searchTerm = String(search.value || "").trim()

  return {
    ...(searchTerm && { search: searchTerm }),
    ...(selectedBulan.value && { bulan: selectedBulan.value }),
    ...(selectedTahun.value && { tahun: selectedTahun.value }),
    ...(selectedModule.value && { module_key: selectedModule.value }),
    ...(selectedPetugasId.value && { petugas_id: selectedPetugasId.value }),
  }
}

const hasActiveFilters = () => Object.keys(activeFilterPayload()).length > 0

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
    selectedRekapKeys.value = []
    totalItems.value = Number(response.data?.total || 0)
    stats.value = response.stats || {}
    years.value = response.filters?.years || years.value
    modules.value = response.filters?.modules || modules.value

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

const exportRekapanExcel = async () => {
  if (exportingRekapan.value) return

  try {
    exportingRekapan.value = true
    showSnackbar({
      text: "Loading...",
      color: "info",
    })

    const activeSort = sortBy.value?.[0] || { key: "tanggal_rekap", order: "desc" }

    const response = await $api("/admin/laporan/rab/export-rekapan", {
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

    downloadFileExport(response, "Rekapan RAB.xlsx")
    showSnackbar({
      text: "Rekapan berhasil di download.",
      color: "success",
    })
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    exportingRekapan.value = false
  }
}

const resetFilters = async () => {
  resettingFilters.value = true
  clearTimeout(searchTimer)
  search.value = ""
  selectedBulan.value = null
  selectedTahun.value = null
  selectedModule.value = null
  selectedPetugasId.value = null
  page.value = 1
  await nextTick()
  resettingFilters.value = false
  fetchData()
}

const fetchPetugas = async () => {
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
    module_key: item?.module_key || selectedModule.value || modules.value?.[0]?.value || "tatap_muka",
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
  if (!moduleKey) {
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
  const moduleKey = selectedModule.value || modules.value?.[0]?.value || "tatap_muka"

  rekapForm.value = {
    module_key: moduleKey,
    petugas_id: selectedPetugasId.value || null,
    nama: "",
    bulan: selectedBulan.value || currentDate.getMonth() + 1,
    tahun: selectedTahun.value || currentDate.getFullYear(),
    tanggal_rekap: [
      currentDate.getFullYear(),
      String(currentDate.getMonth() + 1).padStart(2, "0"),
      String(currentDate.getDate()).padStart(2, "0"),
    ].join("-"),
    tanggal_pencairan: null,
    jumlah_sementara: 0,
    keterangan: "",
  }
  rekapFormDialog.value = true
  await fetchRekapPetugas(moduleKey)
}

const saveRekap = async () => {
  if (rekapSaving.value) return

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

    selectedRekapKeys.value = []
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

watch([selectedBulan, selectedTahun, selectedModule, selectedPetugasId], () => {
  if (resettingFilters.value) return

  page.value = 1
  fetchData()
})

watch(selectedModule, fetchPetugas)

watch(() => rekapForm.value.module_key, moduleKey => {
  if (rekapFormDialog.value) fetchRekapPetugas(moduleKey)
})

watch(search, () => {
  if (resettingFilters.value) return

  clearTimeout(searchTimer)
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
            class="rab-export-button"
            color="success"
            variant="tonal"
            prepend-icon="ri-file-list-3-line"
            :loading="exportingRekapan"
            :disabled="exportingRekapan"
            @click="exportRekapanExcel"
          >
            Download Rekapan
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
        :show-select="canEditTanggalPencairan"
        :headers="[
          { title: 'No', key: 'nomor', sortable: false },
          { title: 'Tanggal Rekap', key: 'tanggal_rekap' },
          { title: 'Tanggal Pencairan', key: 'tanggal_pencairan' },
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
      v-model="rekapFormDialog"
      width="760"
    >
      <VCard title="Tambah Rekap Anggaran">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="rekapFormDialog = false"
        />

        <VCardText>
          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="rekapForm.module_key"
                label="Jenis Rekap *"
                :items="modules"
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

            <VCol cols="12">
              <VTextField
                v-model="rekapForm.nama"
                label="Nama Rekap *"
                placeholder="Contoh: RAB Kegiatan Juni 2026"
                :disabled="rekapSaving"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
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
              md="4"
            >
              <AppDateTimePicker
                v-model="rekapForm.tanggal_rekap"
                label="Tanggal Rekap *"
                :config="{
                  altInput: true,
                  altFormat: 'd F Y',
                  dateFormat: 'Y-m-d',
                }"
                :disabled="rekapSaving"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              md="4"
            >
              <AppDateTimePicker
                v-model="rekapForm.tanggal_pencairan"
                label="Tanggal Pencairan (Opsional)"
                placeholder="Belum ditentukan"
                clearable
                :config="{
                  altInput: true,
                  altFormat: 'd F Y',
                  dateFormat: 'Y-m-d',
                }"
                :disabled="rekapSaving"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="rekapForm.jumlah_sementara"
                label="Jumlah RAB Sementara *"
                type="number"
                min="0"
                prefix="Rp"
                :hint="formatRupiah(rekapForm.jumlah_sementara)"
                persistent-hint
                :disabled="rekapSaving"
                :rules="[requiredValidator]"
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
            :disabled="rekapSaving || rekapPetugasLoading"
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
                :items="modules"
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
  .kas-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
