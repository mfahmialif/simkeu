<script setup>
import { ref, computed, onMounted } from "vue";
import { useTheme } from "vuetify";
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect/index.js'
import 'flatpickr/dist/plugins/monthSelect/style.css'
import { downloadFileExport } from "@/composables/exportFile";

const theme = useTheme();

const selectedMode = ref("bulanan");
const modeOptions = [
  { title: "Mode Bulanan", value: "bulanan" },
  { title: "Mode Tahunan", value: "tahunan" }
];

const selectedJenjang = ref("sarjana");
const jenjangOptions = [
  { title: "Sarjana", value: "sarjana" },
  { title: "Pascasarjana", value: "pascasarjana" }
];

const selectedTahun = ref(new Date().getFullYear().toString());
const tahunOptions = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for(let i = currentYear; i >= 2020; i--) {
    years.push(i.toString());
  }
  return years;
});

const monthPickerConfig = computed(() => ({
  disableMobile: true,
  plugins: [
    new monthSelectPlugin({
      shorthand: true,
      dateFormat: 'Y-m',
      altFormat: 'F Y',
      theme: theme.global.name.value === 'dark' ? 'dark' : 'light',
    }),
  ],
  altInput: true,
}));

const selectedBulan = ref("");
const isLoading = ref(false);
const reportTitle = ref("");
const columns = ref([]);
const tableData = ref([]);
const allData = ref({});
const totals = ref({});
const hasData = ref(false);
const jkInfo = ref("");


const formatRupiah = (val) => {
  if (!val || val === 0) return "-";
  return "Rp " + new Intl.NumberFormat("id-ID").format(val);
};

const formatTanggal = (dateStr) => {
  const d = new Date(dateStr);
  return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();
};

const fetchData = async () => {
  if (selectedMode.value === 'bulanan' && !selectedBulan.value) return;
  if (selectedMode.value === 'tahunan' && !selectedTahun.value) return;
  
  try {
    isLoading.value = true;
    const bodyData = selectedMode.value === 'tahunan' 
      ? { mode: 'tahunan', tahun: selectedTahun.value, jenjang: selectedJenjang.value }
      : { mode: 'bulanan', bulan: selectedBulan.value, jenjang: selectedJenjang.value };

    const response = await $api("/admin/pemasukan/mahasiswa/laporan/pemasukan-tunai-harian", {
      method: "GET",
      body: bodyData,
    });

    if (response.status) {
      if (selectedMode.value === 'tahunan') {
        reportTitle.value = "PEMASUKAN TUNAI TAHUN " + selectedTahun.value;
        columns.value = Object.freeze(response.columns);
        allData.value = Object.freeze(response.all_data);
        jkInfo.value = response.jenis_kelamin == '%' ? 'Semua' : response.jenis_kelamin;
        hasData.value = true;
      } else {
        reportTitle.value = response.title;
        columns.value = Object.freeze(response.columns);
        tableData.value = Object.freeze(response.data);
        totals.value = Object.freeze(response.totals);
        jkInfo.value = response.jenis_kelamin == '%' ? 'Semua' : response.jenis_kelamin;
        hasData.value = true;
      }
    } else {
      showSnackbar({ text: response.message, color: "error" });
    }
  } catch (err) {
    showSnackbar({ text: err.message, color: "error" });
  } finally {
    isLoading.value = false;
  }
};

const downloadExcel = async () => {
  try {
    isLoading.value = true;
    showSnackbar({ text: "Loading Excel...", color: "info" });
    
    const bodyData = selectedMode.value === 'tahunan' 
      ? { mode: 'tahunan', tahun: selectedTahun.value, action: 'excel', jenjang: selectedJenjang.value }
      : { mode: 'bulanan', bulan: selectedBulan.value, action: 'excel', jenjang: selectedJenjang.value };
      
    const filename = selectedMode.value === 'tahunan' 
      ? `Pemasukan_Tunai_Harian_Tahun_${selectedTahun.value}.xlsx`
      : `Pemasukan_Tunai_Harian_${selectedBulan.value}.xlsx`;

    const response = await $api("/admin/pemasukan/mahasiswa/laporan/pemasukan-tunai-harian", {
      method: "GET",
      headers: { Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
      body: bodyData,
    });

    downloadFileExport(response, filename);
    showSnackbar({ text: "Excel berhasil diunduh.", color: "success" });
  } catch (err) {
    showSnackbar({ text: err.message, color: "error" });
  } finally {
    isLoading.value = false;
  }
};

const printTable = () => {
  const printContent = document.getElementById("report-table-container");
  const win = window.open("", "_blank");
  win.document.write(`
    <html>
    <head>
      <title>${reportTitle.value}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; }
        h2 { text-align: center; color: #1a237e; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th { background: #1a237e; color: white; padding: 8px 6px; text-align: center; border: 1px solid #ccc; }
        td { padding: 6px; border: 1px solid #ddd; text-align: right; }
        td:first-child, td:nth-child(2) { text-align: center; }
        tr:nth-child(even) { background: #f5f7ff; }
        .print-card-content {
          background-color: transparent !important;
        }
        .total-row { background: #1a237e !important; color: white; font-weight: bold; }
        .total-row td { border-color: #283593; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style>
    </head>
    <body>
      <h2>${reportTitle.value}</h2>
      ${printContent.innerHTML}
    </body>
    </html>
  `);
  win.document.close();
  setTimeout(() => { win.print(); }, 500);
};

onMounted(() => {
  document.title = "Pemasukan Tunai Harian";
  const now = new Date();
  selectedBulan.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  fetchData();
});
</script>

<template>
  <div>
    <!-- Header Card -->
    <VCard class="report-header-card mb-6">
      <div class="header-gradient">
        <div class="header-content">
          <div class="header-icon-wrap">
            <VIcon icon="ri-money-dollar-circle-line" size="32" color="white" />
          </div>
          <div>
            <h1 class="header-title">Pemasukan Tunai Harian</h1>
            <p class="header-subtitle">
              Laporan pemasukan tunai harian per kategori tagihan
              <span v-if="jkInfo" class="ml-2 px-2 py-1 bg-white text-primary rounded-pill font-weight-bold" style="font-size: 0.85rem;">
                <VIcon start icon="ri-user-line" size="14" class="mr-1" />
                {{ jkInfo }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <VCardText class="pt-6 pb-4">
        <VRow align="center">
          <VCol cols="12" md="2">
            <VSelect
              v-model="selectedMode"
              :items="modeOptions"
              label="Mode Laporan"
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </VCol>
          <VCol cols="12" md="2">
            <VSelect
              v-model="selectedJenjang"
              :items="jenjangOptions"
              label="Jenjang"
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </VCol>
          <VCol cols="12" md="2">
            <AppDateTimePicker
              v-if="selectedMode === 'bulanan'"
              v-model="selectedBulan"
              :key="'month-'+theme.global.name.value"
              label="Pilih Bulan"
              placeholder="Pilih bulan laporan"
              :config="monthPickerConfig"
              prepend-inner-icon="ri-calendar-line"
              hide-details
            />
            <VSelect
              v-else
              v-model="selectedTahun"
              :items="tahunOptions"
              label="Pilih Tahun"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="ri-calendar-line"
              hide-details
            />
          </VCol>
          <VCol cols="12" md="2">
            <VBtn
              color="primary"
              size="large"
              @click="fetchData"
              :loading="isLoading"
              block
              class="fetch-btn"
            >
              <template #loader>
                <span class="custom-loader">
                  Loading<span class="loading-dots"></span>
                </span>
              </template>
              <VIcon start icon="ri-search-line" />
              Tampilkan
            </VBtn>
          </VCol>
          <VCol cols="12" md="2">
            <VBtn
              color="success"
              size="large"
              @click="downloadExcel"
              :loading="isLoading"
              :disabled="!hasData"
              block
            >
              <template #loader>
                <span class="custom-loader">
                  Loading<span class="loading-dots"></span>
                </span>
              </template>
              <VIcon start icon="ri-file-excel-2-line" />
              Excel
            </VBtn>
          </VCol>
          <VCol cols="12" md="2">
            <VBtn
              variant="outlined"
              color="secondary"
              size="large"
              @click="printTable"
              :disabled="!hasData || isLoading || selectedMode === 'tahunan'"
              block
            >
              <VIcon start icon="ri-printer-line" />
              Print
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Loading -->
    <VCard v-if="isLoading" class="pa-8 text-center">
      <VProgressCircular indeterminate color="primary" size="64" width="6" />
      <p class="mt-4 text-body-1" style="color: #64748b">Memuat data laporan...</p>
    </VCard>

    <!-- No Data -->
    <VCard v-else-if="!hasData" class="pa-8 text-center">
      <VIcon icon="ri-file-search-line" size="80" color="grey" class="mb-4" />
      <h3 style="color: #94a3b8">Pilih {{ selectedMode === 'bulanan' ? 'bulan' : 'tahun' }} untuk menampilkan laporan</h3>
    </VCard>

    <!-- Report Tables -->
    <template v-else-if="selectedMode === 'bulanan'">
      <VCard class="report-table-card">
        <VCardItem class="report-table-header">
          <VCardTitle class="text-center">
            <VIcon icon="ri-bar-chart-grouped-line" class="me-2" />
            {{ reportTitle }}
          </VCardTitle>
        </VCardItem>

        <VDivider />

        <div id="report-table-container" class="table-scroll-container">
          <table class="report-table">
            <thead>
              <tr>
                <th class="sticky-col col-no" rowspan="1">No</th>
                <th class="sticky-col col-tanggal" rowspan="1">Tanggal</th>
                <th
                  v-for="col in columns"
                  :key="col.key"
                  class="col-amount"
                >
                  {{ col.label }}
                </th>
                <th class="col-total">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in tableData"
                :key="index"
                class="data-row"
                :class="{ 'even-row': index % 2 === 0 }"
              >
                <td class="sticky-col col-no text-center">{{ row.no }}</td>
                <td class="sticky-col col-tanggal text-center">{{ formatTanggal(row.tanggal) }}</td>
                <td
                  v-for="col in columns"
                  :key="col.key"
                  class="col-amount text-right"
                  :class="{ 'has-value': row[col.key] > 0 }"
                >
                  {{ formatRupiah(row[col.key]) }}
                </td>
                <td class="col-total text-right" :class="{ 'has-value-total': row.jumlah > 0 }">
                  {{ formatRupiah(row.jumlah) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td class="sticky-col col-no text-center" colspan="2">TOTAL</td>
                <td
                  v-for="col in columns"
                  :key="col.key"
                  class="col-amount text-right"
                >
                  {{ formatRupiah(totals[col.key]) }}
                </td>
                <td class="col-total text-right">
                  {{ formatRupiah(totals.jumlah) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Summary Cards -->
        <VCardText class="pa-6">
          <VRow>
            <VCol cols="12" md="4">
              <div class="summary-card summary-total">
                <div class="summary-icon">
                  <VIcon icon="ri-funds-line" size="28" />
                </div>
                <div>
                  <span class="summary-label">Total Pemasukan</span>
                  <span class="summary-value">{{ formatRupiah(totals.jumlah) }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="12" md="4">
              <div class="summary-card summary-days">
                <div class="summary-icon">
                  <VIcon icon="ri-calendar-check-line" size="28" />
                </div>
                <div>
                  <span class="summary-label">Hari dengan Transaksi</span>
                  <span class="summary-value">{{ tableData.filter(r => r.jumlah > 0).length }} hari</span>
                </div>
              </div>
            </VCol>
            <VCol cols="12" md="4">
              <div class="summary-card summary-categories">
                <div class="summary-icon">
                  <VIcon icon="ri-stack-line" size="28" />
                </div>
                <div>
                  <span class="summary-label">Kategori Tagihan</span>
                  <span class="summary-value">{{ columns.length }} kategori</span>
                </div>
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </template>

    <template v-else-if="selectedMode === 'tahunan'">
      <VCard v-for="(monthInfo, mIdx) in allData" :key="mIdx" class="report-table-card mb-6">
        <VCardItem class="report-table-header">
          <VCardTitle class="text-center">
            <VIcon icon="ri-bar-chart-grouped-line" class="me-2" />
            {{ monthInfo.title }}
          </VCardTitle>
        </VCardItem>

        <VDivider />

        <div class="table-scroll-container">
          <table class="report-table">
            <thead>
              <tr>
                <th class="sticky-col col-no" rowspan="1">No</th>
                <th class="sticky-col col-tanggal" rowspan="1">Tanggal</th>
                <th
                  v-for="col in columns"
                  :key="col.key"
                  class="col-amount"
                >
                  {{ col.label }}
                </th>
                <th class="col-total">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in monthInfo.data"
                :key="index"
                class="data-row"
                :class="{ 'even-row': index % 2 === 0 }"
              >
                <td class="sticky-col col-no text-center">{{ row.no }}</td>
                <td class="sticky-col col-tanggal text-center">{{ formatTanggal(row.tanggal) }}</td>
                <td
                  v-for="col in columns"
                  :key="col.key"
                  class="col-amount text-right"
                  :class="{ 'has-value': row[col.key] > 0 }"
                >
                  {{ formatRupiah(row[col.key]) }}
                </td>
                <td class="col-total text-right" :class="{ 'has-value-total': row.jumlah > 0 }">
                  {{ formatRupiah(row.jumlah) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td class="sticky-col col-no text-center" colspan="2">TOTAL</td>
                <td
                  v-for="col in columns"
                  :key="col.key"
                  class="col-amount text-right"
                >
                  {{ formatRupiah(monthInfo.totals[col.key]) }}
                </td>
                <td class="col-total text-right">
                  {{ formatRupiah(monthInfo.totals.jumlah) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </VCard>
    </template>
  </div>
</template>

<style scoped>
/* ══════════════════════════════════════════════════════
   HEADER CARD
   ══════════════════════════════════════════════════════ */
.report-header-card {
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.header-gradient {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1a237e 100%);
  padding: 32px 28px;
  position: relative;
  overflow: hidden;
}

.header-gradient::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -20%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 70%);
  border-radius: 50%;
}

.header-gradient::after {
  content: "";
  position: absolute;
  bottom: -30%;
  left: 10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(99, 179, 237, 0.08) 0%, transparent 70%);
  border-radius: 50%;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.header-icon-wrap {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 14px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: -0.02em;
}

.header-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 4px 0 0;
}

.bulan-select :deep(.v-field) {
  border-radius: 12px;
}

.fetch-btn {
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: none;
}

/* ══════════════════════════════════════════════════════
   REPORT TABLE CARD
   ══════════════════════════════════════════════════════ */
.report-table-card {
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.report-table-header {
  background: linear-gradient(135deg, #f8faff 0%, #eef2ff 100%);
}

.report-table-header :deep(.v-card-title) {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a237e;
  letter-spacing: 0.04em;
}

/* ══════════════════════════════════════════════════════
   TABLE SCROLL
   ══════════════════════════════════════════════════════ */
.table-scroll-container {
  overflow-x: auto;
  overflow-y: visible;
  max-height: none;
  scrollbar-width: thin;
  scrollbar-color: #c7d2fe #f1f5f9;
}

.table-scroll-container::-webkit-scrollbar {
  height: 8px;
}

.table-scroll-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 8px;
}

.table-scroll-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #818cf8, #6366f1);
  border-radius: 8px;
}

/* ══════════════════════════════════════════════════════
   TABLE STYLES
   ══════════════════════════════════════════════════════ */
.report-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.8rem;
  min-width: max-content;
}

.report-table thead th {
  background: linear-gradient(180deg, #1a237e 0%, #283593 100%);
  color: white;
  padding: 12px 10px;
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 3px solid #3949ab;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
  text-align: center;
}

.report-table tbody td {
  padding: 8px 10px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  white-space: nowrap;
  transition: all 0.15s ease;
  font-variant-numeric: tabular-nums;
  color: inherit;
}

.report-table .data-row:hover td {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
}

.report-table .even-row td {
  background-color: rgba(var(--v-theme-on-surface), 0.02);
}

/* Sticky columns */
.sticky-col {
  position: sticky;
  z-index: 5;
  background-color: rgb(var(--v-theme-surface));
}

.col-no {
  left: 0;
  min-width: 50px;
  width: 50px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.col-tanggal {
  left: 50px;
  min-width: 110px;
  width: 110px;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.85);
}

.report-table thead .col-no,
.report-table thead .col-tanggal {
  z-index: 15;
}

.report-table .even-row .sticky-col {
  background-color: rgba(var(--v-theme-on-surface), 0.04);
}

.report-table .data-row:hover .sticky-col {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
}

.report-table tbody .sticky-col {
  background-color: rgb(var(--v-theme-surface));
}

.col-amount {
  min-width: 120px;
}

.col-total {
  min-width: 130px;
  font-weight: 700;
  background: rgba(var(--v-theme-on-surface), 0.04);
}

.report-table thead .col-total {
  background: linear-gradient(180deg, #0d1b6e 0%, #1a237e 100%);
}

/* Value styling */
.has-value {
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 500;
}

.has-value-total {
  color: rgb(var(--v-theme-success)) !important;
  font-weight: 700;
}

/* ══════════════════════════════════════════════════════
   TOTAL ROW
   ══════════════════════════════════════════════════════ */
.total-row td {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%) !important;
  color: white !important;
  font-weight: 700;
  padding: 14px 10px;
  border: none;
  font-size: 0.82rem;
  letter-spacing: 0.02em;
}

.total-row .sticky-col {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%) !important;
  color: white !important;
  z-index: 6;
}

/* ══════════════════════════════════════════════════════
   SUMMARY CARDS
   ══════════════════════════════════════════════════════ */
.summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 14px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.summary-total {
  background: rgba(var(--v-theme-success), 0.1);
  border: 1px solid rgba(var(--v-theme-success), 0.2);
}

.summary-total .summary-icon {
  background: rgb(var(--v-theme-success));
  color: white;
  border-radius: 12px;
  padding: 10px;
}

.summary-total .summary-value {
  color: rgb(var(--v-theme-success));
}

.summary-days {
  background: rgba(var(--v-theme-info), 0.1);
  border: 1px solid rgba(var(--v-theme-info), 0.2);
}

.summary-days .summary-icon {
  background: rgb(var(--v-theme-info));
  color: white;
  border-radius: 12px;
  padding: 10px;
}

.summary-days .summary-value {
  color: rgb(var(--v-theme-info));
}

.summary-categories {
  background: rgba(var(--v-theme-primary), 0.1);
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
}

.summary-categories .summary-icon {
  background: rgb(var(--v-theme-primary));
  color: white;
  border-radius: 12px;
  padding: 10px;
}

.summary-categories .summary-value {
  color: rgb(var(--v-theme-primary));
}

.summary-label {
  display: block;
  font-size: 0.78rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-weight: 500;
  margin-bottom: 2px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.summary-value {
  display: block;
  font-size: 1.15rem;
  font-weight: 700;
}

.custom-loader {
  display: flex;
  align-items: center;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.loading-dots::after {
  content: '.';
  animation: loading-dots 1.5s steps(4, end) infinite;
  display: inline-block;
  width: 1em;
  text-align: left;
}

@keyframes loading-dots {
  0%, 20% { content: ''; }
  40% { content: '.'; }
  60% { content: '..'; }
  80%, 100% { content: '...'; }
}
</style>
