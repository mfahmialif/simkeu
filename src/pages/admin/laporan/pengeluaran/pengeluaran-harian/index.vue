<script setup>
/* eslint-disable camelcase, import/extensions */
import { computed, onMounted, ref, watch } from "vue"
import { useTheme } from "vuetify"
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect/index.js"
import "flatpickr/dist/plugins/monthSelect/style.css"
import DailyExpenseTable from "@/components/admin/laporan/DailyExpenseTable.vue"
import { downloadFileExport } from "@/composables/exportFile"
import { formatRupiah } from "@/composables/formatRupiah"
import { showSnackbar } from "@/composables/snackbar"

const theme = useTheme()
const now = new Date()
const jkScope = useCookie("simkeuJkScope", { default: () => "semua" })

const scopeGender = computed(() => ({
  putra: "Laki-laki",
  putri: "Perempuan",
})[jkScope.value] || null)

const selectedMode = ref("bulanan")
const selectedMonth = ref(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`)
const selectedYear = ref(String(now.getFullYear()))
const selectedPayment = ref(null)
const selectedOfficer = ref(null)
const selectedGender = ref(scopeGender.value)
const paymentOptions = ref([])
const officerList = ref([])
const loading = ref(false)
const exporting = ref(false)
const hasReport = ref(false)
const reportTitle = ref("")
const columns = ref([])
const rows = ref([])
const totals = ref({})
const annualData = ref({})

const stats = ref({
  total: 0,
  hari_transaksi: 0,
  kategori: 0,
  rata_rata_harian: 0,
})

const modeOptions = [
  { title: "Mode Bulanan", value: "bulanan" },
  { title: "Mode Tahunan", value: "tahunan" },
]

const genderOptions = computed(() => scopeGender.value
  ? [{ title: scopeGender.value, value: scopeGender.value }]
  : [
    { title: "Laki-laki", value: "Laki-laki" },
    { title: "Perempuan", value: "Perempuan" },
  ])

const officerOptions = computed(() => officerList.value
  .filter(item => !selectedGender.value || item.jenis_kelamin === selectedGender.value)
  .map(item => ({
    title: `${item.name}${item.role_name ? ` (${item.role_name})` : ""}`,
    value: item.id,
  })))

const yearOptions = computed(() => {
  const currentYear = now.getFullYear()

  return Array.from({ length: currentYear - 2019 }, (_, index) => String(currentYear - index))
})

const monthPickerConfig = computed(() => ({
  disableMobile: true,
  altInput: true,
  plugins: [
    monthSelectPlugin({
      shorthand: false,
      dateFormat: "Y-m",
      altFormat: "F Y",
      theme: theme.global.name.value === "dark" ? "dark" : "light",
    }),
  ],
}))

const requestPayload = computed(() => ({
  mode: selectedMode.value,
  ...(selectedMode.value === "bulanan"
    ? { bulan: selectedMonth.value }
    : { tahun: selectedYear.value }),
  ...(selectedPayment.value && { jenis_pembayaran: selectedPayment.value }),
  ...(selectedOfficer.value && { petugas_id: selectedOfficer.value }),
  ...(!scopeGender.value && selectedGender.value && { jenis_kelamin: selectedGender.value }),
}))

const summaryCards = computed(() => [
  {
    title: "Total Pengeluaran",
    value: formatRupiah(stats.value.total),
    subtitle: reportTitle.value || "-",
    icon: "ri-wallet-3-line",
    color: "error",
  },
  {
    title: "Hari Transaksi",
    value: `${stats.value.hari_transaksi || 0} hari`,
    subtitle: "Hari dengan pengeluaran",
    icon: "ri-calendar-check-line",
    color: "info",
  },
  {
    title: "Modul Pengeluaran",
    value: `${stats.value.kategori || 0} modul`,
    subtitle: "Sumber data aktif",
    icon: "ri-stack-line",
    color: "primary",
  },
  {
    title: "Rata-rata Harian",
    value: formatRupiah(stats.value.rata_rata_harian),
    subtitle: "Per hari transaksi",
    icon: "ri-line-chart-line",
    color: "warning",
  },
])

const formatDate = value => {
  if (!value) return "-"

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`))
}

const applyResponse = response => {
  reportTitle.value = response.title || ""
  columns.value = response.columns || []
  stats.value = response.stats || stats.value
  paymentOptions.value = (response.filter_options?.jenis_pembayaran || []).map(item => ({
    title: item,
    value: item,
  }))

  if (selectedMode.value === "tahunan") {
    annualData.value = response.all_data || {}
    rows.value = []
    totals.value = {}
  } else {
    rows.value = response.data || []
    totals.value = response.totals || {}
    annualData.value = {}
  }

  hasReport.value = true
}

const fetchReport = async () => {
  try {
    loading.value = true

    const response = await $api("/admin/pengeluaran/laporan-harian", {
      method: "GET",
      body: requestPayload.value,
    })

    if (!response?.status) {
      showSnackbar({
        color: "error",
        text: response?.message || "Gagal memuat laporan pengeluaran.",
      })

      return
    }

    applyResponse(response)
  } catch (error) {
    showSnackbar({
      color: "error",
      text: error?.data?.message || error.message || "Gagal memuat laporan pengeluaran.",
    })
  } finally {
    loading.value = false
  }
}

const downloadExcel = async () => {
  try {
    exporting.value = true

    const response = await $api("/admin/pengeluaran/laporan-harian", {
      method: "GET",
      headers: {
        Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      body: {
        ...requestPayload.value,
        action: "excel",
      },
    })

    const period = selectedMode.value === "tahunan" ? selectedYear.value : selectedMonth.value

    downloadFileExport(response, `Pengeluaran Harian ${period}.xlsx`)
    showSnackbar({
      color: "success",
      text: "Laporan Excel berhasil diunduh.",
    })
  } catch (error) {
    showSnackbar({
      color: "error",
      text: error?.data?.message || error.message || "Gagal mengunduh laporan Excel.",
    })
  } finally {
    exporting.value = false
  }
}

const printReport = () => {
  const content = document.getElementById("daily-expense-report")
  const printWindow = window.open("", "_blank")

  if (!content || !printWindow) {
    showSnackbar({
      color: "error",
      text: "Jendela print tidak dapat dibuka.",
    })

    return
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>${reportTitle.value}</title>
        <style>
          @page { size: landscape; margin: 12mm; }
          body { font-family: Arial, sans-serif; color: #1e293b; }
          h1 { margin: 0 0 16px; text-align: center; font-size: 18px; }
          table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 24px; }
          th { background: #334155; color: white; padding: 7px; border: 1px solid #cbd5e1; }
          td { padding: 6px; border: 1px solid #cbd5e1; text-align: right; }
          td:first-child, td:nth-child(2) { text-align: center; }
          tbody tr:nth-child(even) { background: #f8fafc; }
          tfoot td { background: #e2e8f0; font-weight: bold; }
          .report-table-card { page-break-after: always; }
          .report-table-card:last-child { page-break-after: auto; }
          .screen-only { display: none !important; }
        </style>
      </head>
      <body>
        <h1>${reportTitle.value}</h1>
        ${content.innerHTML}
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => printWindow.print(), 400)
}

const fetchOfficers = async () => {
  try {
    const response = await $api("/helper/petugas-pengeluaran", {
      method: "GET",
    })

    officerList.value = response?.data || []
  } catch (error) {
    console.error(error)
  }
}

watch(selectedGender, () => {
  if (
    selectedOfficer.value
    && !officerOptions.value.some(item => item.value === selectedOfficer.value)
  ) {
    selectedOfficer.value = null
  }
})

onMounted(() => {
  document.title = "Pengeluaran Harian - SIMKEU"
  fetchOfficers()
  fetchReport()
})
</script>

<template>
  <div>
    <VCard class="report-header mb-4">
      <VCardText class="pa-5">
        <div class="report-heading">
          <VAvatar
            color="error"
            variant="tonal"
            rounded
            size="52"
          >
            <VIcon
              icon="ri-money-dollar-circle-line"
              size="28"
            />
          </VAvatar>
          <div>
            <h1 class="text-h5 mb-1">
              Pengeluaran Harian
            </h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Rekap pengeluaran harian dari seluruh modul pengeluaran
            </p>
          </div>
        </div>
      </VCardText>

      <VDivider />

      <VCardText class="pa-5">
        <VRow align="center">
          <VCol
            cols="12"
            md="2"
          >
            <VSelect
              v-model="selectedMode"
              :items="modeOptions"
              label="Mode Laporan"
              density="comfortable"
              hide-details
            />
          </VCol>

          <VCol
            cols="12"
            md="2"
          >
            <AppDateTimePicker
              v-if="selectedMode === 'bulanan'"
              :key="`month-${theme.global.name.value}`"
              v-model="selectedMonth"
              label="Bulan"
              prepend-inner-icon="ri-calendar-2-line"
              :config="monthPickerConfig"
              hide-details
            />
            <VSelect
              v-else
              v-model="selectedYear"
              :items="yearOptions"
              label="Tahun"
              prepend-inner-icon="ri-calendar-line"
              density="comfortable"
              hide-details
            />
          </VCol>

          <VCol
            cols="12"
            md="2"
          >
            <VSelect
              v-model="selectedPayment"
              :items="paymentOptions"
              label="Jenis Pembayaran"
              placeholder="Semua"
              clearable
              density="comfortable"
              hide-details
            />
          </VCol>

          <VCol
            cols="12"
            md="2"
          >
            <VSelect
              v-model="selectedGender"
              :items="genderOptions"
              label="Jenis Kelamin Petugas"
              :placeholder="scopeGender ? scopeGender : 'Semua'"
              :clearable="!scopeGender"
              :disabled="Boolean(scopeGender)"
              density="comfortable"
              hide-details
            />
          </VCol>

          <VCol
            cols="12"
            md="2"
          >
            <VSelect
              v-model="selectedOfficer"
              :items="officerOptions"
              label="Petugas"
              placeholder="Semua"
              clearable
              density="comfortable"
              hide-details
            />
          </VCol>

          <VCol
            cols="12"
            md="12"
          >
            <div class="report-actions">
              <VBtn
                color="primary"
                prepend-icon="ri-search-line"
                :loading="loading"
                @click="fetchReport"
              >
                Tampilkan
              </VBtn>
              <VBtn
                color="success"
                variant="outlined"
                prepend-icon="ri-file-excel-2-line"
                :loading="exporting"
                :disabled="!hasReport || loading"
                @click="downloadExcel"
              >
                Excel
              </VBtn>
              <VBtn
                color="secondary"
                variant="outlined"
                prepend-icon="ri-printer-line"
                :disabled="!hasReport || loading"
                @click="printReport"
              >
                Print
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VProgressLinear
      v-if="loading"
      color="primary"
      indeterminate
      class="mb-4"
    />

    <div
      v-if="hasReport"
      class="summary-grid mb-4"
    >
      <div
        v-for="card in summaryCards"
        :key="card.title"
        class="summary-tile"
      >
        <div class="summary-content">
          <div class="text-body-2 text-medium-emphasis">
            {{ card.title }}
          </div>
          <div
            class="summary-value font-weight-medium"
            :title="card.value"
          >
            {{ card.value }}
          </div>
          <div
            class="summary-subtitle text-caption text-disabled"
            :title="card.subtitle"
          >
            {{ card.subtitle }}
          </div>
        </div>
        <VAvatar
          :color="card.color"
          variant="tonal"
          rounded
          size="42"
        >
          <VIcon :icon="card.icon" />
        </VAvatar>
      </div>
    </div>

    <VCard
      v-if="!loading && !hasReport"
      class="pa-10 text-center"
    >
      <VIcon
        icon="ri-file-chart-line"
        size="64"
        color="secondary"
        class="mb-3"
      />
      <div class="text-h6">
        Pilih periode laporan
      </div>
      <div class="text-body-2 text-medium-emphasis">
        Data pengeluaran akan dirangkum per tanggal dan modul.
      </div>
    </VCard>

    <div
      v-if="hasReport"
      id="daily-expense-report"
    >
      <VCard
        v-if="selectedMode === 'bulanan'"
        class="report-table-card"
      >
        <VCardItem>
          <VCardTitle class="text-center">
            {{ reportTitle }}
          </VCardTitle>
        </VCardItem>
        <VDivider />
        <DailyExpenseTable
          :columns="columns"
          :rows="rows"
          :totals="totals"
          :format-date="formatDate"
        />
      </VCard>

      <template v-else>
        <VCard
          v-for="(monthData, monthKey) in annualData"
          :key="monthKey"
          class="report-table-card mb-5"
        >
          <VCardItem>
            <VCardTitle class="text-center">
              {{ monthData.title }}
            </VCardTitle>
          </VCardItem>
          <VDivider />
          <DailyExpenseTable
            :columns="columns"
            :rows="monthData.data"
            :totals="monthData.totals"
            :format-date="formatDate"
          />
        </VCard>
      </template>
    </div>
  </div>
</template>

<style scoped>
.report-header,
.report-table-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
}

.report-heading {
  display: flex;
  align-items: center;
  gap: 16px;
}

.report-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.summary-tile {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 42px;
  align-items: center;
  gap: 14px;
  min-inline-size: 0;
  padding: 16px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  background: rgb(var(--v-theme-surface));
}

.summary-content {
  min-inline-size: 0;
  overflow: hidden;
}

.summary-value {
  overflow: hidden;
  font-size: 1.15rem;
  line-height: 1.55rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-subtitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-tile :deep(.v-avatar) {
  grid-column: 2;
  flex: none;
}

@media (max-width: 959px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .report-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 599px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .report-actions {
    flex-direction: column;
  }
}
</style>
