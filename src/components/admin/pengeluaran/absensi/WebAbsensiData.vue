<script setup>
import { downloadFileExport } from "@/composables/exportFile"
import { formatRupiah } from "@/composables/formatRupiah"
import { fDate } from "@/composables/fDate.js"
import { ref, computed, watch, onMounted } from "vue"

const webAbsensiTab = ref("harian")

const loadingWebAbsensi = ref(false)
const webAbsensiList = ref([])
const webAbsensiTotal = ref(0)
const webAbsensiPage = ref(1)
const webAbsensiLimit = ref(15)

const webAbsensiRekapList = ref([])
const webAbsensiRekapLimit = ref(15)
const webAbsensiRekapPage = ref(1)

const webAbsensiDept = ref(null)
const webAbsensiDeptOptions = [
  { title: "Semua Departemen", value: null },
  { title: "Dosen", value: "Dosen" },
  { title: "Staff", value: "Staff" },
  { title: "Admin", value: "Admin" },
]

const webAbsensiMode = ref("bulan_tahun")
const webAbsensiModeOptions = [
  { title: "Mode Bulan", value: "bulan_tahun" },
  { title: "Mode Rentang Tanggal", value: "range" },
]
const webAbsensiMonthOptions = [
  { title: "Januari", value: 1 },
  { title: "Februari", value: 2 },
  { title: "Maret", value: 3 },
  { title: "April", value: 4 },
  { title: "Mei", value: 5 },
  { title: "Juni", value: 6 },
  { title: "Juli", value: 7 },
  { title: "Agustus", value: 8 },
  { title: "September", value: 9 },
  { title: "Oktober", value: 10 },
  { title: "November", value: 11 },
  { title: "Desember", value: 12 },
]
const webAbsensiBulan = ref(new Date().getMonth() + 1)
const webAbsensiTahun = ref(new Date().getFullYear())
const webAbsensiStartDate = ref(fDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)))
const webAbsensiEndDate = ref(fDate(new Date()))
const webAbsensiSearch = ref("")
const webAbsensiPeriodeInfo = ref("")

const webAbsensiHeaders = [
  { title: "NO", key: "no", sortable: false, width: 60 },
  { title: "USERNAME / KODE", key: "username", sortable: false },
  { title: "NAMA", key: "nama", sortable: false },
  { title: "DEPARTEMEN", key: "departemen", sortable: false },
  { title: "TANGGAL ABSEN", key: "tgl_absen", sortable: false },
  { title: "HARI", key: "hari", sortable: false },
  { title: "JAM DATANG", key: "jam_datang", sortable: false },
  { title: "JAM PULANG", key: "jam_pulang", sortable: false },
  { title: "TOTAL JAM", key: "total_jam", sortable: false },
  { title: "PERINCIAN JAM", key: "perincian_jam", sortable: false },
  { title: "BAROKAH", key: "barokah", sortable: false },
]

const webAbsensiRekapHeaders = [
  { title: "NO", key: "no", sortable: false, width: 60, align: "center" },
  { title: "NAMA", key: "nama", sortable: false },
  { title: "DEPARTEMEN", key: "departemen", sortable: false, align: "center" },
  { title: "JAM SEHARUSNYA DATANG", key: "jam_seharusnya_datang", sortable: false, align: "center" },
  { title: "JAM SEHARUSNYA PULANG", key: "jam_seharusnya_pulang", sortable: false, align: "center" },
  { title: "TOTAL HARI", key: "total_hari", sortable: false, align: "center" },
  { title: "TOTAL JAM", key: "total_jam", sortable: false, align: "center" },
  { title: "TOTAL BAROKAH", key: "total_barokah", sortable: false, align: "end" },
]

const formatKodeOnly = item => {
  const raw = item?.user?.kode || item?.kode_user || item?.user?.username || ''
  const digits = String(raw).replace(/^KD-/i, '').replace(/[^0-9]/g, '')
  return digits || String(raw) || '-'
}

const formatIndoDay = dateStr => {
  if (!dateStr) return '-'
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const d = new Date(dateStr)
  return !Number.isNaN(d.getTime()) ? days[d.getDay()] : '-'
}

const getHariTotal = item => {
  if (!item?.rekap_per_kategori || !Array.isArray(item.rekap_per_kategori)) return 0
  return item.rekap_per_kategori.reduce((acc, kat) => acc + (Number(kat?.jumlah) || 0), 0)
}

const totalSemuaHari = computed(() => webAbsensiRekapList.value.reduce((acc, item) => acc + getHariTotal(item), 0))
const totalSemuaJam = computed(() => webAbsensiRekapList.value.reduce((acc, item) => acc + (Number(item?.total_jam_keseluruhan?.total_jam) || 0), 0))
const totalSemuaBarokah = computed(() => webAbsensiRekapList.value.reduce((acc, item) => acc + (Number(item?.total_perolehan_dana) || 0), 0))

const fetchWebAbsensiData = async () => {
  loadingWebAbsensi.value = true
  try {
    const params = {
      mode: webAbsensiMode.value,
      page: webAbsensiPage.value,
      limit: webAbsensiLimit.value,
    }

    if (webAbsensiMode.value === "bulan_tahun") {
      params.bulan = webAbsensiBulan.value
      params.tahun = webAbsensiTahun.value
    } else {
      params.start_date = webAbsensiStartDate.value
      params.end_date = webAbsensiEndDate.value
    }

    if (webAbsensiDept.value) {
      params.departemen = webAbsensiDept.value
    }

    if (webAbsensiSearch.value && String(webAbsensiSearch.value).trim()) {
      params.search = String(webAbsensiSearch.value).trim()
    }

    const response = await $api("/admin/pengeluaran/absensi/web-absensi/data", {
      method: "GET",
      params,
    })

    if (response && response.status) {
      webAbsensiList.value = Array.isArray(response.data) ? response.data : []
      webAbsensiTotal.value = response.pagination?.total || webAbsensiList.value.length
      if (response.periode) {
        if (response.periode.mode === "bulan_tahun" || webAbsensiMode.value === "bulan_tahun") {
          const mName = webAbsensiMonthOptions.find(m => m.value === Number(response.periode.bulan || webAbsensiBulan.value))?.title || response.periode.bulan
          webAbsensiPeriodeInfo.value = `Bulan ${mName} ${response.periode.tahun || webAbsensiTahun.value}`
        } else {
          webAbsensiPeriodeInfo.value = `Rentang ${response.periode.start_date || webAbsensiStartDate.value} s/d ${response.periode.end_date || webAbsensiEndDate.value}`
        }
      }
    } else {
      webAbsensiList.value = []
      webAbsensiTotal.value = 0
      webAbsensiPeriodeInfo.value = ""
    }
  } catch (err) {
    webAbsensiList.value = []
    webAbsensiTotal.value = 0
    webAbsensiPeriodeInfo.value = ""
  } finally {
    loadingWebAbsensi.value = false
  }
}

const fetchWebAbsensiRekapData = async () => {
  loadingWebAbsensi.value = true
  try {
    const params = {
      mode: webAbsensiMode.value,
    }

    if (webAbsensiMode.value === "bulan_tahun") {
      params.bulan = webAbsensiBulan.value
      params.tahun = webAbsensiTahun.value
    } else {
      params.start_date = webAbsensiStartDate.value
      params.end_date = webAbsensiEndDate.value
    }

    if (webAbsensiDept.value) {
      params.departemen = webAbsensiDept.value
    }

    if (webAbsensiSearch.value && String(webAbsensiSearch.value).trim()) {
      params.search = String(webAbsensiSearch.value).trim()
    }

    const response = await $api("/admin/pengeluaran/absensi/web-absensi/rekap", {
      method: "GET",
      params,
    })

    if (response && response.status) {
      webAbsensiRekapList.value = Array.isArray(response.data) ? response.data : []
      if (response.periode) {
        if (response.periode.mode === "bulan_tahun" || webAbsensiMode.value === "bulan_tahun") {
          const mName = webAbsensiMonthOptions.find(m => m.value === Number(response.periode.bulan || webAbsensiBulan.value))?.title || response.periode.bulan
          webAbsensiPeriodeInfo.value = `Bulan ${mName} ${response.periode.tahun || webAbsensiTahun.value}`
        } else {
          webAbsensiPeriodeInfo.value = `Rentang ${response.periode.start_date || webAbsensiStartDate.value} s/d ${response.periode.end_date || webAbsensiEndDate.value}`
        }
      }
    } else {
      webAbsensiRekapList.value = []
    }
  } catch (err) {
    webAbsensiRekapList.value = []
  } finally {
    loadingWebAbsensi.value = false
  }
}

const webAbsensiSlipPegawai = ref(null)
const webAbsensiSlipLoading = ref(false)
const webAbsensiSlipDataList = ref([])
const webAbsensiSlipRekapItem = ref(null)
const webAbsensiSlipPeriode = ref(null)

const webAbsensiSlipPegawaiOptions = computed(() => {
  return webAbsensiRekapList.value.map(item => {
    const name = item.user?.name || item.user?.nama || '-'
    const kode = item.user?.kode || item.kode_user || '-'
    const dept = item.user?.departemen || '-'
    return {
      title: `${kode} - ${name} (${dept})`,
      value: kode
    }
  })
})

const fetchWebAbsensiSlipList = async () => {
  if (!webAbsensiSlipPegawai.value) return
  webAbsensiSlipLoading.value = true
  try {
    const params = {
      mode: webAbsensiMode.value,
      kode_user: webAbsensiSlipPegawai.value
    }
    if (webAbsensiMode.value === "bulan_tahun") {
      params.bulan = webAbsensiBulan.value
      params.tahun = webAbsensiTahun.value
    } else {
      params.start_date = webAbsensiStartDate.value
      params.end_date = webAbsensiEndDate.value
    }
    if (webAbsensiDept.value) {
      params.departemen = webAbsensiDept.value
    }

    const response = await $api("/admin/pengeluaran/absensi/web-absensi/slip/data", {
      method: "GET",
      params,
    })
    if (response && response.status) {
      webAbsensiSlipDataList.value = response.data || []
      webAbsensiSlipRekapItem.value = response.rekap_item || null
      webAbsensiSlipPeriode.value = response.periode || null
    } else {
      webAbsensiSlipDataList.value = []
      webAbsensiSlipRekapItem.value = null
    }
  } catch (err) {
    console.error("Gagal mengambil data slip:", err)
    webAbsensiSlipDataList.value = []
    webAbsensiSlipRekapItem.value = null
  } finally {
    webAbsensiSlipLoading.value = false
  }
}

const fetchActiveTabData = async () => {
  if (webAbsensiTab.value === "harian") {
    fetchWebAbsensiData()
  } else if (webAbsensiTab.value === "rekap") {
    fetchWebAbsensiRekapData()
  } else if (webAbsensiTab.value === "slip") {
    await fetchWebAbsensiRekapData()
    if (!webAbsensiSlipPegawai.value && webAbsensiRekapList.value.length > 0) {
      webAbsensiSlipPegawai.value = webAbsensiRekapList.value[0].user?.kode || webAbsensiRekapList.value[0].kode_user || null
    }
    if (webAbsensiSlipPegawai.value) {
      fetchWebAbsensiSlipList()
    }
  }
}

const loadWebAbsensiItems = ({ page: newPage, itemsPerPage: newLimit }) => {
  webAbsensiPage.value = newPage || 1
  webAbsensiLimit.value = newLimit || 15
  if (webAbsensiTab.value === "harian") {
    fetchWebAbsensiData()
  }
}

const resetWebAbsensiFilter = () => {
  webAbsensiMode.value = "bulan_tahun"
  webAbsensiDept.value = null
  const d = new Date()
  webAbsensiBulan.value = d.getMonth() + 1
  webAbsensiTahun.value = d.getFullYear()
  const firstDay = new Date(d.getFullYear(), d.getMonth(), 1)
  webAbsensiStartDate.value = fDate(firstDay)
  webAbsensiEndDate.value = fDate(d)
  webAbsensiSearch.value = ""
  webAbsensiPage.value = 1
  webAbsensiRekapPage.value = 1
  fetchActiveTabData()
}

const loadingExportExcel = ref(false)
const loadingExportPdf = ref(false)

const getExportParams = () => {
  const params = {
    mode: webAbsensiMode.value,
  }
  if (webAbsensiMode.value === "bulan_tahun") {
    params.bulan = webAbsensiBulan.value
    params.tahun = webAbsensiTahun.value
  } else {
    params.start_date = webAbsensiStartDate.value
    params.end_date = webAbsensiEndDate.value
  }
  if (webAbsensiDept.value) {
    params.departemen = webAbsensiDept.value
  }
  if (webAbsensiSearch.value && String(webAbsensiSearch.value).trim()) {
    params.search = String(webAbsensiSearch.value).trim()
  }
  return params
}

const exportWebAbsensiExcel = async () => {
  loadingExportExcel.value = true
  try {
    const params = getExportParams()
    const endpoint = webAbsensiTab.value === "harian"
      ? "/admin/pengeluaran/absensi/web-absensi/data/export-excel"
      : "/admin/pengeluaran/absensi/web-absensi/rekap/export-excel"

    const response = await $api(endpoint, {
      method: "GET",
      params,
      headers: { Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    })

    let filename = webAbsensiTab.value === "harian" ? "Data_Web_Absensi" : "Rekap_Total_Web_Absensi"
    if (webAbsensiDept.value) {
      filename += `_${webAbsensiDept.value}`
    }
    if (webAbsensiMode.value === "bulan_tahun") {
      filename += `_Bulan_${webAbsensiBulan.value}_${webAbsensiTahun.value}`
    } else {
      filename += `_${webAbsensiStartDate.value}_sd_${webAbsensiEndDate.value}`
    }
    downloadFileExport(response, `${filename}.xlsx`)
  } catch (error) {
    console.error("Gagal export Excel:", error)
  } finally {
    loadingExportExcel.value = false
  }
}

const exportWebAbsensiPdf = async () => {
  loadingExportPdf.value = true
  try {
    const params = getExportParams()
    const endpoint = webAbsensiTab.value === "harian"
      ? "/admin/pengeluaran/absensi/web-absensi/data/export-pdf"
      : "/admin/pengeluaran/absensi/web-absensi/rekap/export-pdf"

    const response = await $api(endpoint, {
      method: "GET",
      params,
      headers: { Accept: "application/pdf" },
    })

    let filename = webAbsensiTab.value === "harian" ? "Data_Web_Absensi" : "Rekap_Total_Web_Absensi"
    if (webAbsensiDept.value) {
      filename += `_${webAbsensiDept.value}`
    }
    if (webAbsensiMode.value === "bulan_tahun") {
      filename += `_Bulan_${webAbsensiBulan.value}_${webAbsensiTahun.value}`
    } else {
      filename += `_${webAbsensiStartDate.value}_sd_${webAbsensiEndDate.value}`
    }
    downloadFileExport(response, `${filename}.pdf`)
  } catch (error) {
    console.error("Gagal export PDF:", error)
  } finally {
    loadingExportPdf.value = false
  }
}

const loadingSlipExcel = ref(false)
const loadingSlipPdf = ref(false)

const downloadWebAbsensiSlipExcel = async () => {
  if (!webAbsensiSlipPegawai.value) return
  loadingSlipExcel.value = true
  try {
    const params = {
      mode: webAbsensiMode.value,
      kode_user: webAbsensiSlipPegawai.value
    }
    if (webAbsensiMode.value === "bulan_tahun") {
      params.bulan = webAbsensiBulan.value
      params.tahun = webAbsensiTahun.value
    } else {
      params.start_date = webAbsensiStartDate.value
      params.end_date = webAbsensiEndDate.value
    }
    if (webAbsensiDept.value) {
      params.departemen = webAbsensiDept.value
    }

    const response = await $api("/admin/pengeluaran/absensi/web-absensi/slip/export-excel", {
      method: "GET",
      params,
      headers: { Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    })
    const name = webAbsensiSlipRekapItem.value?.user?.name || webAbsensiSlipRekapItem.value?.user?.nama || "Pegawai"
    downloadFileExport(response, `Slip_Rekap_Kehadiran_${name.replace(/[^A-Za-z0-9]/g, '_')}.xlsx`)
  } catch (err) {
    console.error("Gagal download Excel Slip:", err)
  } finally {
    loadingSlipExcel.value = false
  }
}

const downloadWebAbsensiSlipPdf = async () => {
  if (!webAbsensiSlipPegawai.value) return
  loadingSlipPdf.value = true
  try {
    const params = {
      mode: webAbsensiMode.value,
      kode_user: webAbsensiSlipPegawai.value
    }
    if (webAbsensiMode.value === "bulan_tahun") {
      params.bulan = webAbsensiBulan.value
      params.tahun = webAbsensiTahun.value
    } else {
      params.start_date = webAbsensiStartDate.value
      params.end_date = webAbsensiEndDate.value
    }
    if (webAbsensiDept.value) {
      params.departemen = webAbsensiDept.value
    }

    const response = await $api("/admin/pengeluaran/absensi/web-absensi/slip/export-pdf", {
      method: "GET",
      params,
      headers: { Accept: "application/pdf" },
    })
    const name = webAbsensiSlipRekapItem.value?.user?.name || webAbsensiSlipRekapItem.value?.user?.nama || "Pegawai"
    downloadFileExport(response, `Slip_Rekap_Kehadiran_${name.replace(/[^A-Za-z0-9]/g, '_')}.pdf`)
  } catch (err) {
    console.error("Gagal download PDF Slip:", err)
  } finally {
    loadingSlipPdf.value = false
  }
}

const formatSlipTotalHari = (item) => {
  if (!item) return 0
  if (item._total_hari_calculated) return item._total_hari_calculated
  if (Array.isArray(item.rekap_per_kategori)) {
    return item.rekap_per_kategori.reduce((acc, kat) => acc + (Number(kat.jumlah) || 0), 0)
  }
  return webAbsensiSlipDataList.value.length || 0
}

const formatSlipPeriode = (p) => {
  if (!p) return '-'
  if (p.mode === 'bulan_tahun') {
    const months = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER']
    const b = Number(p.bulan || new Date().getMonth() + 1)
    return `${months[b - 1] || b} ${p.tahun || new Date().getFullYear()}`
  }
  if (p.start_date && p.end_date) {
    return `${p.start_date} s/d ${p.end_date}`.toUpperCase()
  }
  return '-'
}

const formatSlipTanggal = (tgl) => {
  if (!tgl || tgl === '-') return '-'
  const parts = tgl.split('-')
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0].slice(-2)}`
  }
  return tgl
}

watch([webAbsensiTab, webAbsensiMode, webAbsensiDept, webAbsensiBulan, webAbsensiTahun, webAbsensiStartDate, webAbsensiEndDate], () => {
  webAbsensiPage.value = 1
  webAbsensiRekapPage.value = 1
  fetchActiveTabData()
})

onMounted(() => {
  fetchActiveTabData()
})
</script>

<template>
  <VCard class="border">
    <VCardItem class="pb-3 bg-light-primary">
      <template #title>
        <div class="d-flex align-center gap-2">
          <VIcon icon="ri-global-line" color="primary" />
          <span class="font-weight-bold text-primary">Data dari Web Absensi</span>
        </div>
      </template>
    </VCardItem>

    <VTabs
      v-model="webAbsensiTab"
      class="px-4 border-b"
      color="primary"
    >
      <VTab value="harian" prepend-icon="ri-calendar-todo-line">
        Rekap Harian (Detail Log)
      </VTab>
      <VTab value="rekap" prepend-icon="ri-bar-chart-grouped-line">
        Rekap Total
      </VTab>
      <VTab value="slip" prepend-icon="ri-file-paper-2-line">
        Slip Rekap Kehadiran
      </VTab>
    </VTabs>

    <VCardText class="pt-4">
      <!-- Filter Bar -->
      <VRow class="mb-4">
        <VCol cols="12" sm="6" md="3">
          <VSelect
            v-model="webAbsensiMode"
            :items="webAbsensiModeOptions"
            label="Mode Filter"
            hide-details
            density="compact"
          />
        </VCol>

        <template v-if="webAbsensiMode === 'bulan_tahun'">
          <VCol cols="12" sm="6" md="3">
            <VSelect
              v-model="webAbsensiBulan"
              :items="webAbsensiMonthOptions"
              label="Bulan"
              hide-details
              density="compact"
            />
          </VCol>
          <VCol cols="12" sm="6" md="3">
            <VTextField
              v-model.number="webAbsensiTahun"
              type="number"
              label="Tahun"
              hide-details
              density="compact"
            />
          </VCol>
        </template>

        <template v-else>
          <VCol cols="12" sm="6" md="3">
            <AppDateTimePicker
              v-model="webAbsensiStartDate"
              label="Dari Tanggal"
              placeholder="Pilih tanggal awal"
              hide-details
              density="compact"
              :config="{ altInput: true, altFormat: 'F j, Y', dateFormat: 'Y-m-d' }"
            />
          </VCol>
          <VCol cols="12" sm="6" md="3">
            <AppDateTimePicker
              v-model="webAbsensiEndDate"
              label="Sampai Tanggal"
              placeholder="Pilih tanggal akhir"
              hide-details
              density="compact"
              :config="{ altInput: true, altFormat: 'F j, Y', dateFormat: 'Y-m-d' }"
            />
          </VCol>
        </template>

        <VCol cols="12" sm="6" md="3">
          <VSelect
            v-model="webAbsensiDept"
            :items="webAbsensiDeptOptions"
            label="Departemen"
            clearable
            hide-details
            density="compact"
          />
        </VCol>

        <VCol cols="12" sm="7" md="8">
          <VTextField
            v-model="webAbsensiSearch"
            label="Cari Nama / Kode / Departemen"
            placeholder="Pencarian..."
            prepend-inner-icon="ri-search-line"
            clearable
            hide-details
            density="compact"
            @keyup.enter="fetchActiveTabData"
          />
        </VCol>

        <VCol cols="12" sm="5" md="4" class="d-flex gap-2 align-center">
          <VBtn color="primary" prepend-icon="ri-search-line" :loading="loadingWebAbsensi" @click="fetchActiveTabData">
            Cari
          </VBtn>
          <VBtn variant="outlined" color="secondary" prepend-icon="ri-refresh-line" :loading="loadingWebAbsensi" @click="resetWebAbsensiFilter">
            Reset
          </VBtn>
        </VCol>
      </VRow>

      <!-- Periode & Info & Export Actions -->
      <div v-if="webAbsensiTab !== 'slip'" class="d-flex flex-wrap justify-space-between align-center gap-3 mb-3">
        <div v-if="webAbsensiPeriodeInfo" class="text-caption text-medium-emphasis">
          Menampilkan data <span class="font-weight-bold text-high-emphasis">{{ webAbsensiPeriodeInfo }}</span>
          (Total: {{ webAbsensiTab === 'harian' ? webAbsensiTotal + ' baris log' : webAbsensiRekapList.length + ' pegawai' }})
        </div>
        <div v-else class="text-caption text-medium-emphasis">
          Total: {{ webAbsensiTab === 'harian' ? webAbsensiTotal + ' baris log' : webAbsensiRekapList.length + ' pegawai' }}
        </div>

        <div class="d-flex gap-2">
          <VBtn
            color="success"
            variant="flat"
            size="small"
            prepend-icon="ri-file-excel-2-line"
            :loading="loadingExportExcel"
            @click="exportWebAbsensiExcel"
          >
            Download Excel
          </VBtn>
          <VBtn
            color="error"
            variant="flat"
            size="small"
            prepend-icon="ri-file-pdf-2-line"
            :loading="loadingExportPdf"
            @click="exportWebAbsensiPdf"
          >
            Download PDF
          </VBtn>
        </div>
      </div>

      <!-- Table Rekap Harian (Detail Log) -->
      <VDataTableServer
        v-if="webAbsensiTab === 'harian'"
        v-model:items-per-page="webAbsensiLimit"
        v-model:page="webAbsensiPage"
        :headers="webAbsensiHeaders"
        :items="webAbsensiList"
        :items-length="webAbsensiTotal"
        :loading="loadingWebAbsensi"
        item-value="id"
        class="border rounded"
        @update:options="loadWebAbsensiItems"
      >
        <template #item.no="{ index }">
          {{ (webAbsensiPage - 1) * webAbsensiLimit + index + 1 }}
        </template>

        <template #item.username="{ item }">
          <span class="font-weight-medium text-primary">{{ formatKodeOnly(item) }}</span>
        </template>

        <template #item.nama="{ item }">
          {{ item.user?.name || '-' }}
        </template>

        <template #item.departemen="{ item }">
          {{ item.user?.departemen || '-' }}
        </template>

        <template #item.tgl_absen="{ item }">
          {{ item.tgl_absen || '-' }}
        </template>

        <template #item.hari="{ item }">
          <div :class="['Kamis', 'Jumat'].includes(formatIndoDay(item.tgl_absen)) ? 'bg-error text-white px-2 py-1 rounded font-weight-bold text-center d-inline-block' : ''">
            {{ formatIndoDay(item.tgl_absen) }}
          </div>
        </template>

        <template #item.jam_datang="{ item }">
          {{ item.pagi || '-' }}
        </template>

        <template #item.jam_pulang="{ item }">
          {{ item.sore || '-' }}
        </template>

        <template #item.total_jam="{ item }">
          {{ item.durasi_jam ?? '-' }}
        </template>

        <template #item.perincian_jam="{ item }">
          {{ item.durasi_teks || item.keterangan || '-' }}
        </template>

        <template #item.barokah="{ item }">
          <span v-if="Number(item.perolehan_dana) > 0" class="font-weight-medium">
            {{ formatRupiah(item.perolehan_dana) }}
          </span>
          <span v-else class="text-disabled">
            TIDAK DAPAT
          </span>
        </template>

        <template #no-data>
          <div class="text-center pa-4 text-medium-emphasis">
            Tidak ada data rekap harian yang ditemukan.
          </div>
        </template>
      </VDataTableServer>

      <!-- Table Rekap Total -->
      <VDataTable
        v-else-if="webAbsensiTab === 'rekap'"
        v-model:page="webAbsensiRekapPage"
        v-model:items-per-page="webAbsensiRekapLimit"
        :headers="webAbsensiRekapHeaders"
        :items="webAbsensiRekapList"
        :loading="loadingWebAbsensi"
        class="border rounded"
      >
        <template #item.no="{ index }">
          {{ (webAbsensiRekapPage - 1) * webAbsensiRekapLimit + index + 1 }}
        </template>

        <template #item.nama="{ item }">
          <span class="font-weight-medium">{{ item.user?.name || item.user?.nama || '-' }}</span>
        </template>

        <template #item.departemen="{ item }">
          <VChip size="small" color="secondary" variant="flat">
            {{ item.user?.departemen || '-' }}
          </VChip>
        </template>

        <template #item.jam_seharusnya_datang="{ item }">
          {{ item.jam_seharusnya_datang || '13:00:00' }}
        </template>

        <template #item.jam_seharusnya_pulang="{ item }">
          {{ item.jam_seharusnya_pulang || '19:00:00' }}
        </template>

        <template #item.total_hari="{ item }">
          <span class="font-weight-bold text-high-emphasis">{{ getHariTotal(item) }}</span>
        </template>

        <template #item.total_jam="{ item }">
          <span class="font-weight-bold text-high-emphasis">
            {{ Number(item.total_jam_keseluruhan?.total_jam || 0).toFixed(2) }}
          </span>
        </template>

        <template #item.total_barokah="{ item }">
          <span v-if="Number(item.total_perolehan_dana) > 0" class="font-weight-bold text-success">
            {{ formatRupiah(item.total_perolehan_dana) }}
          </span>
          <span v-else class="text-disabled">
            Rp 0
          </span>
        </template>

        <template #body.append>
          <tr v-if="webAbsensiRekapList.length > 0" class="bg-light-primary font-weight-bold">
            <td colspan="5" class="text-center">TOTAL KESELURUHAN</td>
            <td class="text-center">{{ totalSemuaHari }}</td>
            <td class="text-center">{{ Number(totalSemuaJam).toFixed(2) }}</td>
            <td class="text-end text-success">{{ formatRupiah(totalSemuaBarokah) }}</td>
          </tr>
        </template>

        <template #no-data>
          <div class="text-center pa-4 text-medium-emphasis">
            Tidak ada data rekap total yang ditemukan.
          </div>
        </template>
      </VDataTable>

      <!-- Tab Slip Rekap Kehadiran -->
      <div v-else-if="webAbsensiTab === 'slip'">
        <!-- Employee selector and actions -->
        <VCard class="mb-6 border bg-light-primary pa-4 elevation-0">
          <VRow class="align-center">
            <VCol cols="12" sm="6" md="6">
              <VAutocomplete
                v-model="webAbsensiSlipPegawai"
                :items="webAbsensiSlipPegawaiOptions"
                label="Pilih Pegawai"
                placeholder="Cari & pilih pegawai..."
                density="compact"
                hide-details
                clearable
                prepend-inner-icon="ri-user-search-line"
                @update:model-value="fetchWebAbsensiSlipList"
              />
            </VCol>
            <VCol cols="12" sm="6" md="6" class="d-flex justify-end gap-2 flex-wrap">
              <VBtn
                color="success"
                variant="flat"
                size="small"
                prepend-icon="ri-file-excel-2-line"
                :loading="loadingSlipExcel"
                :disabled="!webAbsensiSlipPegawai || webAbsensiSlipLoading"
                @click="downloadWebAbsensiSlipExcel"
              >
                Download Excel
              </VBtn>
              <VBtn
                color="error"
                variant="flat"
                size="small"
                prepend-icon="ri-file-pdf-2-line"
                :loading="loadingSlipPdf"
                :disabled="!webAbsensiSlipPegawai || webAbsensiSlipLoading"
                @click="downloadWebAbsensiSlipPdf"
              >
                Download PDF
              </VBtn>
            </VCol>
          </VRow>
        </VCard>

        <div v-if="webAbsensiSlipLoading" class="d-flex flex-column align-center justify-center py-12">
          <VProgressCircular indeterminate color="primary" size="48" class="mb-3" />
          <span class="text-medium-emphasis">Memuat preview slip rekap kehadiran...</span>
        </div>

        <div v-else-if="!webAbsensiSlipPegawai" class="text-center pa-12 border rounded bg-light-primary">
          <VIcon icon="ri-file-paper-2-line" size="48" color="primary" class="mb-3" />
          <div class="text-h6 font-weight-bold text-primary mb-1">Pilih Pegawai Terlebih Dahulu</div>
          <div class="text-caption text-medium-emphasis">Silakan pilih nama atau kode pegawai pada kotak pencarian di atas untuk melihat preview Slip Rekap Kehadiran.</div>
        </div>

        <!-- Authentic Slip Document Preview Box -->
        <div v-else-if="webAbsensiSlipRekapItem" class="pa-2 pa-sm-6 border mx-auto rounded elevation-3" style="max-width: 960px; background-color: #ffffff; color: #000000; font-family: 'Arial', sans-serif;">
          <!-- Kop Surat Banner -->
          <div class="text-center mb-4 pb-3" style="border-bottom: 2px solid #000000;">
            <img
              src="/img/kop uiidalwa mantap.png"
              alt="Kop UIIDalwa"
              style="max-width: 100%; height: auto; max-height: 140px; object-fit: contain;"
              @error="$event.target.style.display='none'"
            />
          </div>

          <!-- Title -->
          <div class="text-center font-weight-bold mb-6 text-uppercase" style="font-size: 1.2rem; text-decoration: underline; letter-spacing: 0.5px; color: #000000;">
            REKAP KEHADIRAN
          </div>

          <!-- Employee Summary Profile -->
          <div class="mb-6 px-2" style="font-size: 0.95rem; line-height: 1.8; color: #000000;">
            <VRow no-gutters>
              <VCol cols="4" sm="3" class="font-weight-bold">NAMA</VCol>
              <VCol cols="8" sm="9" class="font-weight-bold">: {{ webAbsensiSlipRekapItem.user?.name || webAbsensiSlipRekapItem.user?.nama || '-' }}</VCol>
            </VRow>
            <VRow no-gutters>
              <VCol cols="4" sm="3" class="font-weight-bold">DEPARTEMEN</VCol>
              <VCol cols="8" sm="9">: {{ webAbsensiSlipRekapItem.user?.departemen || '-' }}</VCol>
            </VRow>
            <VRow no-gutters>
              <VCol cols="4" sm="3" class="font-weight-bold">TOTAL JAM</VCol>
              <VCol cols="8" sm="9">: {{ String(webAbsensiSlipRekapItem.total_jam_keseluruhan?.total_jam || 0).replace('.', ',') }}</VCol>
            </VRow>
            <VRow no-gutters>
              <VCol cols="4" sm="3" class="font-weight-bold">TOTAL HARI</VCol>
              <VCol cols="8" sm="9">: {{ formatSlipTotalHari(webAbsensiSlipRekapItem) }}</VCol>
            </VRow>
            <VRow no-gutters>
              <VCol cols="4" sm="3" class="font-weight-bold">TOTAL BAROKAH</VCol>
              <VCol cols="8" sm="9" class="font-weight-bold">: {{ webAbsensiSlipRekapItem.total_perolehan_dana > 0 ? formatRupiah(webAbsensiSlipRekapItem.total_perolehan_dana) : '-' }}</VCol>
            </VRow>
            <VRow no-gutters>
              <VCol cols="4" sm="3" class="font-weight-bold">PERIODE</VCol>
              <VCol cols="8" sm="9">: {{ formatSlipPeriode(webAbsensiSlipPeriode) }}</VCol>
            </VRow>
          </div>

          <!-- Daily Logs Table -->
          <div class="table-responsive">
            <table class="w-100" style="border-collapse: collapse; font-size: 0.85rem; color: #000000; border: 1px solid #000000;">
              <thead>
                <tr style="background-color: #f1f5f9; border-bottom: 2px solid #000000;">
                  <th class="pa-2 text-center" style="border: 1px solid #000000; width: 45px;">NO</th>
                  <th class="pa-2 text-center" style="border: 1px solid #000000; width: 100px;">TANGGAL</th>
                  <th class="pa-2 text-center" style="border: 1px solid #000000; width: 100px;">JAM DATANG</th>
                  <th class="pa-2 text-center" style="border: 1px solid #000000; width: 100px;">JAM PULANG</th>
                  <th class="pa-2 text-center" style="border: 1px solid #000000; width: 90px;">TOTAL JAM</th>
                  <th class="pa-2 text-center" style="border: 1px solid #000000;">PERINCIAN JAM</th>
                  <th class="pa-2 text-center" style="border: 1px solid #000000; width: 120px;">BAROKAH</th>
                  <th class="pa-2 text-left" style="border: 1px solid #000000; width: 110px;">KET.</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in webAbsensiSlipDataList" :key="idx" style="border-bottom: 1px solid #000000;">
                  <td class="pa-2 text-center" style="border: 1px solid #000000;">{{ idx + 1 }}</td>
                  <td class="pa-2 text-center" style="border: 1px solid #000000;">{{ formatSlipTanggal(row.tgl_absen) }}</td>
                  <td class="pa-2 text-center" style="border: 1px solid #000000;">{{ row.pagi || '-' }}</td>
                  <td class="pa-2 text-center" style="border: 1px solid #000000;">{{ row.sore || '-' }}</td>
                  <td class="pa-2 text-center" style="border: 1px solid #000000;">{{ row.durasi_jam !== undefined && row.durasi_jam !== null ? String(row.durasi_jam).replace('.', ',') : '-' }}</td>
                  <td class="pa-2 text-center" style="border: 1px solid #000000;">{{ row.durasi_teks || (row.kategori?.nama || '-') }}</td>
                  <td class="pa-2 text-right font-weight-medium" style="border: 1px solid #000000;">{{ row.perolehan_dana > 0 ? formatRupiah(row.perolehan_dana) : '-' }}</td>
                  <td class="pa-2 text-left" style="border: 1px solid #000000;">{{ row.keterangan || '-' }}</td>
                </tr>
                <tr v-if="!webAbsensiSlipDataList.length">
                  <td colspan="8" class="pa-6 text-center text-medium-emphasis" style="border: 1px solid #000000;">
                    Tidak ada data kehadiran untuk pegawai ini pada periode yang dipilih.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>
