<script setup>
/* eslint-disable camelcase, import/extensions */
import { downloadFileExport } from "@/composables/exportFile"
import { formatRupiah } from "@/composables/formatRupiah"
import { showSnackbar } from "@/composables/snackbar"
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect/index.js"
import "flatpickr/dist/plugins/monthSelect/style.css"

const page = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref({ key: "id", order: "desc" })
const search = ref("")
const dataTable = ref([])
const totalItems = ref(0)
const loading = ref(true)
const initialLoading = ref(true)

const selectedTipe = ref(null)
const selectedJenisKelamin = ref(null)
const selectedStatus = ref(null)
const selectedProdi = ref(null)
const prodiOptions = ref([])
const reportLoading = ref(false)
const isExportingExcel = ref(false)
const isExportingPdf = ref(false)
const pdfChartsRef = ref(null)
const reportMode = ref("bulan")
const today = new Date()
const selectedMonth = ref(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`)

const selectedDateRange = ref({
  start: `${selectedMonth.value}-01`,
  end: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
})

const report = ref({
  filters: {},
  stats: {},
  table_totals: {},
  modules: [],
  top_pegawai: [],
  all_pegawai: [],
  charts: {
    monthly: { categories: [], series: [] },
    distribution: { labels: [], series: [] },
  },
})

let searchTimer = null

const tipeOptions = [
  { title: "Semua Tipe", value: null },
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

const showProdiFilter = computed(() => selectedTipe.value === "dosen")

const monthPickerConfig = {
  altInput: true,
  altFormat: "F Y",
  dateFormat: "Y-m",
  disableMobile: true,
  plugins: [
    monthSelectPlugin({
      shorthand: false,
      dateFormat: "Y-m",
      altFormat: "F Y",
    }),
  ],
}

const datePickerConfig = {
  altInput: true,
  altFormat: "d F Y",
  dateFormat: "Y-m-d",
  disableMobile: true,
}

const currentFilterPayload = () => ({
  search: search.value,
  ...(selectedTipe.value && { tipe: selectedTipe.value }),
  ...(selectedJenisKelamin.value && { jenis_kelamin: selectedJenisKelamin.value }),
  ...(selectedStatus.value && { status: selectedStatus.value }),
  ...(showProdiFilter.value && selectedProdi.value && { prodi_id: selectedProdi.value }),
})

const periodPayload = computed(() => {
  if (reportMode.value === "rentang") {
    return {
      mode: "rentang",
      tanggal_mulai: selectedDateRange.value.start,
      tanggal_akhir: selectedDateRange.value.end,
    }
  }

  return {
    mode: "bulan",
    bulan: selectedMonth.value,
  }
})

const reportStats = computed(() => report.value?.stats || {})
const modules = computed(() => report.value?.modules || [])
const topPegawai = computed(() => report.value?.top_pegawai || [])
const allPegawai = computed(() => report.value?.all_pegawai || [])
const chartColors = ["#666CFF", "#28C76F", "#16B1FF"]

const pdfAccentColors = [
  [102, 108, 255],
  [40, 199, 111],
  [22, 177, 255],
  [255, 159, 67],
]

const compactCurrency = value =>
  new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value || 0))

const statCards = computed(() => [
  {
    title: "Total Barokah",
    value: formatRupiah(reportStats.value.total || 0),
    subtitle: report.value?.filters?.label || "-",
    icon: "ri-funds-line",
    color: "primary",
  },
  {
    title: "Transaksi",
    value: `${reportStats.value.jumlah || 0}`,
    subtitle: "Data pengeluaran",
    icon: "ri-file-list-3-line",
    color: "success",
  },
  {
    title: "Pegawai Terbayar",
    value: `${reportStats.value.pegawai_dengan_barokah || 0}`,
    subtitle: `Dari ${reportStats.value.pegawai || 0} pegawai`,
    icon: "ri-team-line",
    color: "info",
  },
  {
    title: "Rata-rata Pegawai",
    value: formatRupiah(reportStats.value.rata_rata_pegawai || 0),
    subtitle: "Pegawai terbayar",
    icon: "ri-line-chart-line",
    color: "warning",
  },
])

const monthlySeries = computed(() => report.value?.charts?.monthly?.series || [])

const monthlyOptions = computed(() => ({
  chart: {
    parentHeightOffset: 0,
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  colors: chartColors,
  dataLabels: { enabled: false },
  grid: {
    borderColor: "rgba(var(--v-border-color), var(--v-border-opacity))",
    strokeDashArray: 8,
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
  },
  plotOptions: {
    bar: {
      borderRadius: 5,
      borderRadiusApplication: "end",
      columnWidth: "42%",
    },
  },
  xaxis: {
    categories: report.value?.charts?.monthly?.categories || [],
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      formatter: value => compactCurrency(value),
    },
  },
  tooltip: {
    y: {
      formatter: value => formatRupiah(value),
    },
  },
}))

const distributionSeries = computed(() => {
  const series = report.value?.charts?.distribution?.series || []

  return series.some(item => Number(item) > 0) ? series : []
})

const distributionOptions = computed(() => ({
  labels: report.value?.charts?.distribution?.labels || [],
  colors: chartColors,
  chart: {
    parentHeightOffset: 0,
    toolbar: { show: false },
  },
  dataLabels: { enabled: false },
  legend: { position: "bottom" },
  stroke: { width: 0 },
  plotOptions: {
    pie: {
      donut: {
        size: "72%",
        labels: {
          show: true,
          total: {
            show: true,
            label: "Total",
            formatter: () => compactCurrency(reportStats.value.total || 0),
          },
        },
      },
    },
  },
  tooltip: {
    y: {
      formatter: value => formatRupiah(value),
    },
  },
}))

const pegawaiReportRow = item => report.value?.table_totals?.[item.id] || {
  total: 0,
  jumlah: 0,
  modules: [],
}

const exportFileLabel = computed(() => {
  const label = report.value?.filters?.label || selectedMonth.value

  return String(label)
    .replace(/[^\p{L}\p{N} _-]+/gu, "-")
    .replace(/\s+/g, " ")
    .trim()
})

const reportFilterSummary = computed(() => {
  const filters = []

  if (search.value) filters.push(`Pencarian: ${search.value}`)
  if (selectedTipe.value) filters.push(`Tipe: ${selectedTipe.value}`)
  if (selectedJenisKelamin.value) filters.push(`Jenis kelamin: ${selectedJenisKelamin.value}`)
  if (selectedStatus.value) filters.push(`Status: ${selectedStatus.value}`)

  if (showProdiFilter.value && selectedProdi.value) {
    const prodi = prodiOptions.value.find(item => item.value === selectedProdi.value)

    filters.push(`Prodi: ${prodi?.title || selectedProdi.value}`)
  }

  return filters.length ? filters.join(" | ") : "Semua pegawai"
})

const exportExcel = async () => {
  try {
    isExportingExcel.value = true

    const response = await $api("/admin/pegawai/barokah-report/export-excel", {
      method: "GET",
      headers: {
        Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      body: {
        ...currentFilterPayload(),
        ...periodPayload.value,
      },
    })

    downloadFileExport(response, `Laporan Barokah Pegawai ${exportFileLabel.value}.xlsx`)
    showSnackbar({
      color: "success",
      text: "Laporan Excel berhasil diunduh.",
    })
  } catch (err) {
    const message = typeof err.data?.message === "object"
      ? Object.values(err.data.message).flat().join("; ")
      : err.data?.message || "Gagal membuat laporan Excel."

    showSnackbar({ color: "error", text: message })
  } finally {
    isExportingExcel.value = false
  }
}

const addPdfFooter = pdf => {
  const pageCount = pdf.getNumberOfPages()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
    pdf.setPage(pageNumber)
    pdf.setDrawColor(226, 232, 240)
    pdf.line(12, pageHeight - 11, pageWidth - 12, pageHeight - 11)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(8)
    pdf.setTextColor(100, 116, 139)
    pdf.text("SIMKEU - Laporan Pengeluaran Barokah Pegawai", 12, pageHeight - 6)
    pdf.text(`${pageNumber} / ${pageCount}`, pageWidth - 12, pageHeight - 6, { align: "right" })
  }
}

const drawPdfSummaryCards = (pdf, startY) => {
  const pageWidth = pdf.internal.pageSize.getWidth()
  const margin = 12
  const gap = 4
  const cardWidth = (pageWidth - (margin * 2) - (gap * 3)) / 4
  const cardHeight = 28

  statCards.value.forEach((item, index) => {
    const x = margin + (index * (cardWidth + gap))
    const color = pdfAccentColors[index]

    pdf.setFillColor(248, 250, 252)
    pdf.setDrawColor(226, 232, 240)
    pdf.roundedRect(x, startY, cardWidth, cardHeight, 2, 2, "FD")
    pdf.setFillColor(...color)
    pdf.roundedRect(x, startY, 3, cardHeight, 1, 1, "F")
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(8)
    pdf.setTextColor(100, 116, 139)
    pdf.text(item.title, x + 7, startY + 7)
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(item.value.length > 20 ? 10 : 12)
    pdf.setTextColor(30, 41, 59)
    pdf.text(item.value, x + 7, startY + 16)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(7)
    pdf.setTextColor(148, 163, 184)
    pdf.text(pdf.splitTextToSize(item.subtitle, cardWidth - 11)[0] || "-", x + 7, startY + 23)
  })

  return startY + cardHeight
}

const drawPdfModuleCards = (pdf, startY) => {
  const pageWidth = pdf.internal.pageSize.getWidth()
  const margin = 12
  const gap = 5
  const moduleItems = modules.value

  if (!moduleItems.length) return startY

  const cardWidth = (pageWidth - (margin * 2) - (gap * (moduleItems.length - 1))) / moduleItems.length

  moduleItems.forEach((module, index) => {
    const x = margin + (index * (cardWidth + gap))
    const color = pdfAccentColors[index % pdfAccentColors.length]

    pdf.setFillColor(248, 250, 252)
    pdf.setDrawColor(226, 232, 240)
    pdf.roundedRect(x, startY, cardWidth, 25, 2, 2, "FD")
    pdf.setFillColor(...color)
    pdf.circle(x + 8, startY + 8, 3, "F")
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(9)
    pdf.setTextColor(30, 41, 59)
    pdf.text(module.short_label, x + 14, startY + 9)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(8)
    pdf.setTextColor(100, 116, 139)
    pdf.text(`${module.jumlah} data`, x + 7, startY + 17)
    pdf.setFont("helvetica", "bold")
    pdf.setTextColor(30, 41, 59)
    pdf.text(formatRupiah(module.total), x + cardWidth - 7, startY + 17, { align: "right" })
  })

  return startY + 25
}

const drawPdfEmployees = (pdf, startY) => {
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 12
  const tableWidth = pageWidth - (margin * 2)
  const rowHeight = 9
  const rows = allPegawai.value
  const maxY = pageHeight - 17

  const columns = {
    rank: margin + 5,
    employee: margin + 16,
    type: margin + (tableWidth * 0.58),
    transactions: margin + (tableWidth * 0.73),
    total: pageWidth - margin - 5,
  }

  const drawHeader = y => {
    pdf.setFillColor(51, 65, 85)
    pdf.roundedRect(margin, y, tableWidth, rowHeight, 2, 2, "F")
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(8)
    pdf.setTextColor(255, 255, 255)
    pdf.text("No", columns.rank, y + 6, { align: "center" })
    pdf.text("Pegawai", columns.employee, y + 6)
    pdf.text("Tipe", columns.type, y + 6)
    pdf.text("Transaksi", columns.transactions, y + 6, { align: "right" })
    pdf.text("Total Barokah", columns.total, y + 6, { align: "right" })

    return y + rowHeight
  }

  let currentY = drawHeader(startY)

  if (!rows.length) {
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor(100, 116, 139)
    pdf.text("Belum ada data pada periode ini.", margin + 5, currentY + 8)

    return
  }

  rows.forEach((item, index) => {
    if (currentY + rowHeight > maxY) {
      pdf.addPage()
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(15)
      pdf.setTextColor(30, 41, 59)
      pdf.text("Daftar Seluruh Pegawai", margin, 17)
      currentY = drawHeader(23)
    }

    if (index % 2 === 0) {
      pdf.setFillColor(248, 250, 252)
      pdf.rect(margin, currentY, tableWidth, rowHeight, "F")
    }

    pdf.setDrawColor(226, 232, 240)
    pdf.line(margin, currentY + rowHeight, pageWidth - margin, currentY + rowHeight)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(8)
    pdf.setTextColor(51, 65, 85)
    pdf.text(String(index + 1), columns.rank, currentY + 5.8, { align: "center" })
    pdf.setFont("helvetica", "bold")
    pdf.text(pdf.splitTextToSize(item.nama || "-", 112)[0], columns.employee, currentY + 4)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(6.5)
    pdf.setTextColor(100, 116, 139)
    pdf.text(item.kode || "-", columns.employee, currentY + 7.2)
    pdf.setFontSize(8)
    pdf.setTextColor(51, 65, 85)
    pdf.text(item.tipe === "dosen" ? "Dosen" : "Staff", columns.type, currentY + 5.8)
    pdf.text(String(item.jumlah || 0), columns.transactions, currentY + 5.8, { align: "right" })
    pdf.setFont("helvetica", "bold")
    pdf.text(formatRupiah(item.total), columns.total, currentY + 5.8, { align: "right" })
    currentY += rowHeight
  })
}

const exportPdf = async () => {
  if (!pdfChartsRef.value) {
    showSnackbar({ color: "error", text: "Grafik laporan belum siap." })

    return
  }

  try {
    isExportingPdf.value = true
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 300))

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ])

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 12

    pdf.setProperties({
      title: `Laporan Barokah Pegawai ${report.value?.filters?.label || ""}`,
      subject: "Laporan pengeluaran barokah pegawai",
      author: "SIMKEU",
    })
    pdf.setFillColor(51, 65, 85)
    pdf.rect(0, 0, pageWidth, 34, "F")
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(18)
    pdf.setTextColor(255, 255, 255)
    pdf.text("Laporan Pengeluaran Barokah Pegawai", margin, 14)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(9)
    pdf.setTextColor(203, 213, 225)
    pdf.text(`Periode: ${report.value?.filters?.label || "-"}`, margin, 21)
    pdf.text(pdf.splitTextToSize(`Filter: ${reportFilterSummary.value}`, pageWidth - 98)[0], margin, 27)
    pdf.text(
      `Dicetak ${new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(new Date())}`,
      pageWidth - margin,
      21,
      { align: "right" },
    )

    let currentY = drawPdfSummaryCards(pdf, 40) + 8

    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(12)
    pdf.setTextColor(30, 41, 59)
    pdf.text("Grafik Laporan", margin, currentY)
    currentY += 4

    const chartCanvas = await html2canvas(pdfChartsRef.value, {
      scale: Math.min(window.devicePixelRatio || 1, 2),
      useCORS: true,
      logging: false,
      backgroundColor: getComputedStyle(document.body).backgroundColor || "#282a42",
    })

    const chartImage = chartCanvas.toDataURL("image/png", 0.95)
    const maxChartWidth = pageWidth - (margin * 2)
    const maxChartHeight = pageHeight - currentY - 18
    const chartScale = Math.min(maxChartWidth / chartCanvas.width, maxChartHeight / chartCanvas.height)
    const chartWidth = chartCanvas.width * chartScale
    const chartHeight = chartCanvas.height * chartScale

    pdf.addImage(chartImage, "PNG", margin, currentY, chartWidth, chartHeight, undefined, "FAST")

    pdf.addPage()
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(15)
    pdf.setTextColor(30, 41, 59)
    pdf.text("Ringkasan Modul", margin, 17)
    currentY = drawPdfModuleCards(pdf, 23) + 11
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(12)
    pdf.setTextColor(30, 41, 59)
    pdf.text("Daftar Seluruh Pegawai", margin, currentY)
    drawPdfEmployees(pdf, currentY + 5)
    addPdfFooter(pdf)

    pdf.save(`Laporan Barokah Pegawai ${exportFileLabel.value}.pdf`)
    showSnackbar({
      color: "success",
      text: "Laporan PDF berhasil dibuat.",
    })
  } catch (err) {
    console.error(err)
    showSnackbar({
      color: "error",
      text: "Gagal membuat laporan PDF. Muat ulang halaman lalu coba kembali.",
    })
  } finally {
    isExportingPdf.value = false
  }
}

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

const fetchReport = async () => {
  try {
    reportLoading.value = true

    const response = await $api("/admin/pegawai/barokah-report", {
      method: "GET",
      body: {
        ...currentFilterPayload(),
        ...periodPayload.value,
        pegawai_ids: dataTable.value.map(item => item.id).join(","),
      },
    })

    if (response?.status) {
      report.value = response.data || report.value
    }
  } catch (err) {
    console.error(err)
  } finally {
    reportLoading.value = false
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
    await fetchReport()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
    if (initialLoading.value) initialLoading.value = false
  }
}

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb }) => {
  page.value = p
  itemsPerPage.value = ipp
  if (sb.length) sortBy.value = sb[0]
  fetchData()
}

const resetFilters = () => {
  selectedTipe.value = null
  selectedJenisKelamin.value = null
  selectedStatus.value = null
  selectedProdi.value = null
  search.value = ""
  page.value = 1
  fetchData()
}

watch(
  [selectedTipe, selectedJenisKelamin, selectedStatus, selectedProdi],
  () => {
    if (!showProdiFilter.value && selectedProdi.value) {
      selectedProdi.value = null

      return
    }

    page.value = 1
    fetchData()
  },
)

watch(search, () => {
  page.value = 1
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchData()
  }, 450)
})

watch([reportMode, selectedMonth, () => selectedDateRange.value.start, () => selectedDateRange.value.end], () => {
  fetchReport()
})

onMounted(() => {
  document.title = "Laporan Pengeluaran Pegawai - SIMKEU"
  fetchProdi()
})
</script>

<template>
  <div>
    <VCard class="report-hero mb-4">
      <VCardText>
        <div class="report-hero-header">
          <VAvatar
            color="primary"
            variant="tonal"
            rounded
            size="52"
          >
            <VIcon
              icon="ri-funds-line"
              size="28"
            />
          </VAvatar>
          <div>
            <h1 class="text-h5 mb-1">
              Laporan Pengeluaran Pegawai
            </h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Rekap barokah pegawai lintas modul berdasarkan bulan atau rentang tanggal
            </p>
          </div>
        </div>
      </VCardText>

      <VDivider />

      <VCardText>
        <div class="report-period-toolbar">
          <VBtnToggle
            v-model="reportMode"
            mandatory
            density="comfortable"
            variant="tonal"
            color="primary"
            class="report-mode-toggle"
          >
            <VBtn
              value="bulan"
              class="report-mode-btn"
            >
              <VIcon
                icon="ri-calendar-2-line"
                size="18"
              />
              <span class="ms-2">Bulan</span>
            </VBtn>
            <VBtn
              value="rentang"
              class="report-mode-btn"
            >
              <VIcon
                icon="ri-calendar-event-line"
                size="18"
              />
              <span class="ms-2">Rentang</span>
            </VBtn>
          </VBtnToggle>

          <AppDateTimePicker
            v-if="reportMode === 'bulan'"
            v-model="selectedMonth"
            density="compact"
            hide-details
            prepend-inner-icon="ri-calendar-2-line"
            :config="monthPickerConfig"
            class="report-date-field"
          />
          <template v-else>
            <AppDateTimePicker
              v-model="selectedDateRange.start"
              density="compact"
              hide-details
              prepend-inner-icon="ri-calendar-event-line"
              :config="datePickerConfig"
              class="report-date-field"
            />
            <AppDateTimePicker
              v-model="selectedDateRange.end"
              density="compact"
              hide-details
              prepend-inner-icon="ri-calendar-check-line"
              :config="datePickerConfig"
              class="report-date-field"
            />
          </template>

          <VBtn
            icon
            color="primary"
            :loading="reportLoading"
            @click="fetchReport"
          >
            <VIcon icon="ri-refresh-line" />
          </VBtn>

          <div class="report-export-actions">
            <VBtn
              color="error"
              variant="outlined"
              prepend-icon="ri-file-pdf-2-line"
              :loading="isExportingPdf"
              :disabled="reportLoading || isExportingExcel"
              @click="exportPdf"
            >
              PDF
            </VBtn>
            <VBtn
              color="success"
              variant="outlined"
              prepend-icon="ri-file-excel-2-line"
              :loading="isExportingExcel"
              :disabled="reportLoading || isExportingPdf"
              @click="exportExcel"
            >
              Excel
            </VBtn>
          </div>
        </div>
      </VCardText>
    </VCard>

    <VCard class="mb-4">
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            md="3"
          >
            <VTextField
              v-model="search"
              label="Cari Pegawai"
              placeholder="Nama, kode, email..."
              density="compact"
              clearable
              clear-icon="ri-close-line"
            />
          </VCol>

          <VCol
            cols="12"
            md="2"
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
            md="2"
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
            md="2"
          >
            <VSelect
              v-model="selectedStatus"
              :items="statusOptions"
              label="Status"
              density="compact"
              clearable
              clear-icon="ri-close-line"
            />
          </VCol>

          <VCol
            v-if="showProdiFilter"
            cols="12"
            md="3"
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

        <div class="d-flex justify-end mt-2">
          <VBtn
            variant="outlined"
            color="secondary"
            prepend-icon="ri-filter-off-line"
            @click="resetFilters"
          >
            Reset Filter
          </VBtn>
        </div>
      </VCardText>
    </VCard>

    <VProgressLinear
      v-if="reportLoading"
      indeterminate
      color="primary"
      class="mb-4"
    />

    <div class="report-stat-grid mb-4">
      <div
        v-for="item in statCards"
        :key="item.title"
        class="report-stat-tile"
      >
        <div class="min-w-0">
          <div class="text-body-2 text-medium-emphasis">
            {{ item.title }}
          </div>
          <div
            class="text-h6 font-weight-medium text-truncate"
            :title="item.value"
          >
            {{ item.value }}
          </div>
          <div class="text-caption text-disabled text-truncate">
            {{ item.subtitle }}
          </div>
        </div>
        <VAvatar
          :color="item.color"
          variant="tonal"
          rounded
          size="40"
        >
          <VIcon :icon="item.icon" />
        </VAvatar>
      </div>
    </div>

    <div ref="pdfChartsRef">
      <VRow>
        <VCol
          cols="12"
          lg="8"
        >
          <div class="report-panel">
            <div class="d-flex justify-space-between align-center gap-3 mb-3">
              <div>
                <div class="text-h6">
                  Tren Barokah
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  Akumulasi pengeluaran per modul
                </div>
              </div>
              <VChip
                color="primary"
                variant="tonal"
                size="small"
              >
                {{ report?.filters?.label || "-" }}
              </VChip>
            </div>
            <VueApexCharts
              type="bar"
              height="310"
              :options="monthlyOptions"
              :series="monthlySeries"
            />
          </div>
        </VCol>

        <VCol
          cols="12"
          lg="4"
        >
          <div class="report-panel">
            <div class="mb-3">
              <div class="text-h6">
                Distribusi Modul
              </div>
              <div class="text-body-2 text-medium-emphasis">
                Porsi total pengeluaran
              </div>
            </div>

            <VueApexCharts
              v-if="distributionSeries.length"
              type="donut"
              height="310"
              :options="distributionOptions"
              :series="distributionSeries"
            />
            <div
              v-else
              class="report-empty-chart"
            >
              <VIcon
                icon="ri-pie-chart-2-line"
                size="40"
              />
              <span>Belum ada data</span>
            </div>
          </div>
        </VCol>
      </VRow>
    </div>

    <VRow class="mt-2">
      <VCol
        v-for="module in modules"
        :key="module.key"
        cols="12"
        md="4"
      >
        <div class="report-module-tile">
          <VAvatar
            :color="module.color"
            variant="tonal"
            rounded
          >
            <VIcon :icon="module.icon" />
          </VAvatar>
          <div class="min-w-0 flex-grow-1">
            <div class="font-weight-medium text-truncate">
              {{ module.short_label }}
            </div>
            <div class="text-caption text-disabled">
              {{ module.jumlah }} data
            </div>
          </div>
          <div class="font-weight-medium text-no-wrap">
            {{ formatRupiah(module.total) }}
          </div>
        </div>
      </VCol>
    </VRow>

    <VRow class="mt-2">
      <VCol
        cols="12"
        lg="4"
      >
        <VCard class="h-100">
          <VCardItem
            title="Pegawai Barokah Terbesar"
            subtitle="Top 10 sesuai filter laporan"
          />
          <VDivider />
          <VTable density="comfortable">
            <tbody>
              <tr
                v-for="item in topPegawai"
                :key="item.pegawai_id"
              >
                <td>
                  <div class="font-weight-medium">
                    {{ item.nama }}
                  </div>
                  <div class="text-caption text-disabled">
                    {{ item.kode }} · {{ item.tipe }}
                  </div>
                </td>
                <td class="text-end font-weight-medium text-no-wrap">
                  {{ formatRupiah(item.total) }}
                </td>
              </tr>
              <tr v-if="!topPegawai.length">
                <td class="text-center text-medium-emphasis py-6">
                  Belum ada data
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        lg="8"
      >
        <VCard>
          <VCardItem
            title="Total Barokah Pegawai"
            subtitle="Data pegawai sesuai filter dan periode laporan"
          />
          <VDivider />
          <VDataTableServer
            v-model:items-per-page="itemsPerPage"
            v-model:page="page"
            :headers="[
              { title: 'No', key: 'id', width: 60 },
              { title: 'Pegawai', key: 'nama' },
              { title: 'Tipe', key: 'tipe' },
              { title: 'Unit', key: 'unit' },
              { title: 'Total Barokah', key: 'barokah_total', sortable: false },
              { title: 'Modul', key: 'barokah_modules', sortable: false },
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
                <div>Memuat laporan pegawai...</div>
              </div>
            </template>

            <template #item.id="{ index }">
              {{ itemsPerPage * (page - 1) + index + 1 }}
            </template>

            <template #item.nama="{ item }">
              <div class="d-flex flex-column">
                <span class="font-weight-medium">{{ item.nama }}</span>
                <small class="text-medium-emphasis">{{ item.kode || "-" }}</small>
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

            <template #item.barokah_total="{ item }">
              <div class="d-flex flex-column">
                <span class="font-weight-medium">
                  {{ formatRupiah(pegawaiReportRow(item).total) }}
                </span>
                <small class="text-medium-emphasis">
                  {{ pegawaiReportRow(item).jumlah }} data
                </small>
              </div>
            </template>

            <template #item.barokah_modules="{ item }">
              <div class="d-flex flex-wrap gap-1">
                <VChip
                  v-for="module in pegawaiReportRow(item).modules"
                  :key="module.label"
                  size="small"
                  variant="tonal"
                  color="primary"
                >
                  {{ module.label }}: {{ formatRupiah(module.total) }}
                </VChip>
                <span
                  v-if="!pegawaiReportRow(item).modules.length"
                  class="text-medium-emphasis"
                >
                  -
                </span>
              </div>
            </template>
          </VDataTableServer>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped>
.report-hero-header {
  display: flex;
  align-items: center;
  gap: 16px;
  min-inline-size: 0;
}

.report-period-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  flex-wrap: wrap;
}

.report-mode-toggle {
  gap: 8px;
  padding: 6px;
}

.report-mode-btn {
  min-inline-size: 112px;
}

.report-date-field {
  flex: 0 0 224px;
  inline-size: 224px;
}

.report-export-actions {
  display: flex;
  gap: 10px;
}

.report-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.report-stat-tile,
.report-panel,
.report-module-tile {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  background: rgba(var(--v-theme-surface), 0.72);
}

.report-stat-tile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
}

.report-panel {
  min-block-size: 100%;
  padding: 18px;
}

.report-empty-chart {
  display: flex;
  min-block-size: 310px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.report-module-tile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
}

:global(.flatpickr-calendar .flatpickr-monthSelect-month) {
  border-radius: 6px;
  color: rgba(var(--v-theme-on-surface), 0.82);
}

:global(.flatpickr-calendar .flatpickr-monthSelect-month:hover) {
  background: rgba(var(--v-theme-primary), 0.12);
  color: rgba(var(--v-theme-on-surface), 0.92);
}

:global(.flatpickr-calendar .flatpickr-monthSelect-month.selected) {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

@media (max-width: 959px) {
  .report-period-toolbar {
    justify-content: flex-start;
  }

  .report-stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 599px) {
  .report-stat-grid {
    grid-template-columns: 1fr;
  }

  .report-period-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .report-mode-toggle {
    inline-size: 100%;
  }

  .report-mode-btn {
    flex: 1 1 0;
    min-inline-size: 0;
  }

  .report-date-field {
    flex-basis: auto;
    inline-size: 100%;
  }

  .report-export-actions {
    inline-size: 100%;
  }

  .report-export-actions > * {
    flex: 1 1 0;
  }
}
</style>
