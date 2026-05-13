<script setup>
import { ref, computed, onMounted } from "vue";
import { useTheme } from "vuetify";
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect/index.js'
import 'flatpickr/dist/plugins/monthSelect/style.css'
import { downloadFileExport } from "@/composables/exportFile";
import { useCookie } from '@/@core/composable/useCookie';

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

const userData = useCookie("userData").value ?? {};
const isAdmin = computed(() => {
  const role = (userData?.role?.name || '').toLowerCase();
  return role === 'admin' || role === 'kabag';
});

const selectedJenisKelamin = ref("%");
const jenisKelaminOptions = computed(() => {
  const options = [
    { title: "Putra", value: "putra" },
    { title: "Putri", value: "putri" }
  ];
  if (isAdmin.value) {
    options.unshift({ title: "Semua", value: "%" });
  }
  return options;
});

const selectedUser = ref(null);
const userList = ref([]);

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
const tableData = ref([]);
const allData = ref([]);
const totals = ref({});
const hasData = ref(false);
const jkInfo = ref("");

const formatRupiah = (val) => {
  if (!val || val === 0) return "-";
  return "Rp " + new Intl.NumberFormat("id-ID").format(val);
};

const normalizeKategoriText = (value) => String(value || "")
  .toUpperCase()
  .replace(/[^A-Z0-9]+/g, " ")
  .trim();

const KATEGORI_ROW_GROUPS = [
  {
    key: "uas",
    label: "UAS",
    match: ({ normalized, compact }) =>
      /\bUAS\b/.test(normalized)
      || compact.includes("UASSEMESTER")
      || compact.includes("UJIANAKHIRSEMESTER"),
  },
  {
    key: "uts",
    label: "UTS",
    match: ({ normalized, compact }) =>
      /\bUTS\b/.test(normalized)
      || compact.includes("UTSSEMESTER")
      || compact.includes("UJIANTENGAHSEMESTER"),
  },
];

const getKategoriRowGroup = (kategori) => {
  const normalized = normalizeKategoriText(kategori);
  const compact = normalized.replace(/\s+/g, "");

  return KATEGORI_ROW_GROUPS.find((group) =>
    group.match({ normalized, compact })
  );
};

const toNumber = (value) => Number(value) || 0;

const groupKategoriRows = (rows = []) => {
  const groupRows = new Map();
  const groupedRows = [];

  rows.forEach((row) => {
    const group = getKategoriRowGroup(row?.kategori);

    if (!group) {
      groupedRows.push({ ...row });
      return;
    }

    if (!groupRows.has(group.key)) {
      const groupedRow = {
        ...row,
        kategori: group.label,
        tunai: 0,
        transfer: 0,
        yayasan: 0,
        total: 0,
      };

      groupRows.set(group.key, groupedRow);
      groupedRows.push(groupedRow);
    }

    const groupedRow = groupRows.get(group.key);
    groupedRow.tunai += toNumber(row.tunai);
    groupedRow.transfer += toNumber(row.transfer);
    groupedRow.yayasan += toNumber(row.yayasan);
    groupedRow.total += toNumber(row.total);
  });

  return groupedRows.map((row, index) => ({
    ...row,
    no: index + 1,
  }));
};

const normalizeReportData = (response = {}) => ({
  ...response,
  data: groupKategoriRows(response.data || []),
  all_data: response.all_data
    ? response.all_data.map((monthInfo) => ({
      ...monthInfo,
      data: groupKategoriRows(monthInfo.data || []),
    }))
    : response.all_data,
});

const fetchData = async () => {
  if (selectedMode.value === 'bulanan' && !selectedBulan.value) return;
  if (selectedMode.value === 'tahunan' && !selectedTahun.value) return;
  
  try {
    isLoading.value = true;
    const filterData = {
      jenjang: selectedJenjang.value,
      jenis_kelamin: selectedJenisKelamin.value,
      ...(selectedUser.value && { user_id: selectedUser.value }),
    };
    const bodyData = selectedMode.value === 'tahunan' 
      ? { mode: 'tahunan', tahun: selectedTahun.value, ...filterData }
      : { mode: 'bulanan', bulan: selectedBulan.value, ...filterData };

    const response = await $api("/admin/pemasukan/mahasiswa/laporan/pemasukan-uii-dalwa", {
      method: "GET",
      body: bodyData,
    });

    if (response.status) {
      const normalizedResponse = normalizeReportData(response);

      reportTitle.value = normalizedResponse.title;
      tableData.value = Object.freeze(normalizedResponse.data);
      totals.value = Object.freeze(normalizedResponse.totals);
      allData.value = Object.freeze(normalizedResponse.all_data || []);
      jkInfo.value = normalizedResponse.jenis_kelamin == '%' ? 'Semua' : normalizedResponse.jenis_kelamin;
      hasData.value = true;
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
    
    const filterData = {
      action: 'excel',
      jenjang: selectedJenjang.value,
      jenis_kelamin: selectedJenisKelamin.value,
      ...(selectedUser.value && { user_id: selectedUser.value }),
    };
    const bodyData = selectedMode.value === 'tahunan' 
      ? { mode: 'tahunan', tahun: selectedTahun.value, ...filterData }
      : { mode: 'bulanan', bulan: selectedBulan.value, ...filterData };
      
    const filename = `Pemasukan_UII_Dalwa_${selectedMode.value === 'tahunan' ? selectedTahun.value : selectedBulan.value}.xlsx`;

    const response = await $api("/admin/pemasukan/mahasiswa/laporan/pemasukan-uii-dalwa", {
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
        h2 { text-align: center; color: #1a237e; margin-bottom: 20px; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th { background: #ffc000; color: #000; padding: 8px 6px; text-align: center; border: 1px solid #000; }
        .bg-white th { background: #fff; }
        td { padding: 6px; border: 1px solid #000; text-align: right; }
        td:first-child, td:nth-child(2) { text-align: center; }
        td:nth-child(2) { text-align: left; }
        .print-card-content {
          background-color: transparent !important;
        }
        .total-row { font-weight: bold; }
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

const fetchUser = async () => {
  try {
    const response = await $api("/helper/petugas-pembayaran", {
      method: "GET",
    });
    if (response && response.data) {
      const items = response.data.data || response.data;
      userList.value = items.map(u => ({
        title: `${u.name} (${u.jenis_kelamin})`,
        value: u.id,
      }));
    }
  } catch (err) {
    console.error('Failed to fetch petugas:', err);
  }
};

onMounted(() => {
  if (isAdmin.value) {
    selectedJenisKelamin.value = "%";
  } else {
    const userJk = (userData?.jenis_kelamin || '').toLowerCase();
    if (userJk === 'perempuan') selectedJenisKelamin.value = 'putri';
    else selectedJenisKelamin.value = 'putra';
  }

  document.title = "Pemasukan UII Dalwa";
  const now = new Date();
  selectedBulan.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  fetchUser();
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
            <VIcon icon="ri-file-chart-line" size="32" color="white" />
          </div>
          <div>
            <h1 class="header-title">Pemasukan UII Dalwa</h1>
            <p class="header-subtitle">
              Laporan rekapitulasi pemasukan metode Tunai, Transfer, dan Yayasan
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
          <VCol cols="12" md="3">
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
          <VCol cols="12" md="3">
            <AppDateTimePicker
              v-if="selectedMode === 'bulanan'"
              v-model="selectedBulan"
              :key="'month-'+theme.global.name.value"
              label="Bulan"
              placeholder="Bulan laporan"
              :config="monthPickerConfig"
              prepend-inner-icon="ri-calendar-line"
              hide-details
            />
            <VSelect
              v-else
              v-model="selectedTahun"
              :items="tahunOptions"
              label="Tahun"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="ri-calendar-line"
              hide-details
            />
          </VCol>
          <VCol cols="12" md="2">
            <VSelect
              v-model="selectedJenisKelamin"
              :items="jenisKelaminOptions"
              label="Jenis Kelamin"
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </VCol>
          <VCol cols="12" md="2">
            <VSelect
              v-model="selectedUser"
              :items="userList"
              label="Filter Petugas"
              placeholder="Semua Petugas"
              variant="outlined"
              density="comfortable"
              clearable
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
      <h3 style="color: #94a3b8">Klik Tampilkan untuk melihat laporan</h3>
    </VCard>

    <!-- Report Table -->
    <template v-else>
      <VCard class="report-table-card mb-6">
        <div id="report-table-container" class="table-scroll-container pa-4">
          <table class="report-table">
            <thead>
              <tr class="header-main">
                <th colspan="6" class="text-center font-weight-black text-uppercase">
                  {{ reportTitle }}
                </th>
              </tr>
              <tr class="header-sub">
                <th class="col-no">NO</th>
                <th class="col-kategori">KATEGORI</th>
                <th class="col-amount">TUNAI</th>
                <th class="col-amount">TRANSFER</th>
                <th class="col-amount">YAYASAN</th>
                <th class="col-amount">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in tableData"
                :key="index"
                class="data-row"
                :class="{ 'even-row': index % 2 === 0 }"
              >
                <td class="col-no text-center border-cell">{{ row.no }}</td>
                <td class="col-kategori text-left border-cell font-weight-medium text-uppercase">{{ row.kategori }}</td>
                <td class="col-amount text-right border-cell">{{ formatRupiah(row.tunai) }}</td>
                <td class="col-amount text-right border-cell">{{ formatRupiah(row.transfer) }}</td>
                <td class="col-amount text-right border-cell">{{ formatRupiah(row.yayasan) }}</td>
                <td class="col-amount text-right border-cell font-weight-bold">{{ formatRupiah(row.total) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="2" class="text-center text-uppercase font-weight-black border-cell font-italic">TOTAL</td>
                <td class="text-right font-weight-black border-cell">{{ formatRupiah(totals.tunai) }}</td>
                <td class="text-right font-weight-black border-cell">{{ formatRupiah(totals.transfer) }}</td>
                <td class="text-right font-weight-black border-cell">{{ formatRupiah(totals.yayasan) }}</td>
                <td class="text-right font-weight-black border-cell">{{ formatRupiah(totals.total) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </VCard>

      <!-- Monthly Tables (Tahunan Mode) -->
      <template v-if="selectedMode === 'tahunan'">
        <VCard v-for="(monthInfo, mIdx) in allData" :key="mIdx" class="report-table-card mb-6">
          <div class="table-scroll-container pa-4">
            <table class="report-table">
              <thead>
                <tr class="header-main">
                  <th colspan="6" class="text-center font-weight-black text-uppercase month-header">
                    {{ monthInfo.title }}
                  </th>
                </tr>
                <tr class="header-sub">
                  <th class="col-no">NO</th>
                  <th class="col-kategori">KATEGORI</th>
                  <th class="col-amount">TUNAI</th>
                  <th class="col-amount">TRANSFER</th>
                  <th class="col-amount">YAYASAN</th>
                  <th class="col-amount">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, index) in monthInfo.data"
                  :key="index"
                  class="data-row"
                  :class="{ 'even-row': index % 2 === 0 }"
                >
                  <td class="col-no text-center border-cell">{{ row.no }}</td>
                  <td class="col-kategori text-left border-cell font-weight-medium text-uppercase">{{ row.kategori }}</td>
                  <td class="col-amount text-right border-cell">{{ formatRupiah(row.tunai) }}</td>
                  <td class="col-amount text-right border-cell">{{ formatRupiah(row.transfer) }}</td>
                  <td class="col-amount text-right border-cell">{{ formatRupiah(row.yayasan) }}</td>
                  <td class="col-amount text-right border-cell font-weight-bold">{{ formatRupiah(row.total) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="total-row">
                  <td colspan="2" class="text-center text-uppercase font-weight-black border-cell font-italic">TOTAL</td>
                  <td class="text-right font-weight-black border-cell">{{ formatRupiah(monthInfo.totals.tunai) }}</td>
                  <td class="text-right font-weight-black border-cell">{{ formatRupiah(monthInfo.totals.transfer) }}</td>
                  <td class="text-right font-weight-black border-cell">{{ formatRupiah(monthInfo.totals.yayasan) }}</td>
                  <td class="text-right font-weight-black border-cell">{{ formatRupiah(monthInfo.totals.total) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </VCard>
      </template>
    </template>
  </div>
</template>

<style scoped>
/* HEADER CARD */
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

.header-gradient::before, .header-gradient::after {
  content: "";
  position: absolute;
  border-radius: 50%;
}
.header-gradient::before {
  top: -50%;
  right: -20%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 70%);
}
.header-gradient::after {
  bottom: -30%;
  left: 10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(99, 179, 237, 0.08) 0%, transparent 70%);
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

.fetch-btn {
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: none;
}

/* REPORT TABLE CARD */
.report-table-card {
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* TABLE SCROLL */
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

/* TABLE STYLES */
.report-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.8rem;
  min-width: max-content;
}

.report-table thead .header-main th {
  background: linear-gradient(180deg, #1a237e 0%, #283593 100%);
  color: white;
  padding: 12px 10px;
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-block-end: 3px solid #3949ab;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
  text-align: center;
}

.report-table thead .header-main th.month-header {
  background: linear-gradient(180deg, #1a237e 0%, #283593 100%);
}

.report-table thead .header-sub th {
  background: linear-gradient(180deg, #1a237e 0%, #283593 100%);
  color: white;
  padding: 12px 10px;
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-block-end: 3px solid #3949ab;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
  text-align: center;
}

.report-table tbody td {
  padding: 8px 10px;
  border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  white-space: nowrap;
  transition: all 0.15s ease;
  font-variant-numeric: tabular-nums;
  color: inherit;
}

.col-no { width: 50px; }
.col-kategori { min-width: 250px; }
.col-amount { min-width: 140px; font-variant-numeric: tabular-nums; }

.report-table .data-row:hover td {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
}

.report-table .even-row td {
  background-color: rgba(var(--v-theme-on-surface), 0.02);
}

.total-row td {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%) !important;
  color: white !important;
  font-weight: 700;
  padding: 14px 10px;
  border: none;
  font-size: 0.82rem;
  letter-spacing: 0.02em;
}


/* LOADER */
.custom-loader {
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.loading-dots {
  display: inline-block;
  width: 1.2em;
  text-align: left;
}

.loading-dots::after {
  content: '...';
  animation: loading-dots 1.5s steps(4, end) infinite;
  display: inline-block;
  vertical-align: bottom;
  overflow: hidden;
}

@keyframes loading-dots {
  0%, 20% { content: ''; }
  40% { content: '.'; }
  60% { content: '..'; }
  80%, 100% { content: '...'; }
}
</style>
