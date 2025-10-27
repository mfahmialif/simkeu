<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";

const chartColors = {
  penerimaan: "#666CFF",
  pengeluaran: "#FF4C51",
};

const headingColor =
  "rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity))";
const labelColor =
  "rgba(var(--v-theme-on-background), var(--v-disabled-opacity))";
const borderColor = "rgba(var(--v-border-color), var(--v-border-opacity))";

// ==== STATE REAKTIF DARI API ====
const categories = ref([]);
const penerimaan = ref([]);
const pengeluaran = ref([]);

// Series mengikuti state di atas
const series = computed(() => [
  { name: "Pemasukan (Rp)", type: "column", data: penerimaan.value },
  { name: "Pengeluaran (Rp)", type: "line", data: pengeluaran.value },
]);

// Formatter Rupiah
const fmtIDR = (v) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);

// Opsi chart reactive
const shipmentConfig = reactive({
  chart: {
    type: "line",
    stacked: false,
    parentHeightOffset: 0,
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  markers: {
    size: 5,
    colors: "#fff",
    strokeColors: chartColors.pengeluaran,
    hover: { size: 6 },
    borderRadius: 4,
  },
  stroke: {
    curve: "smooth",
    width: [0, 3],
    lineCap: "round",
  },
  legend: {
    show: true,
    position: "bottom",
    markers: { width: 8, height: 8, offsetX: -3 },
    height: 40,
    itemMargin: { horizontal: 10, vertical: 0 },
    fontSize: "15px",
    fontFamily: "Inter",
    fontWeight: 400,
    labels: { colors: headingColor, useSeriesColors: false },
    offsetY: 10,
  },
  grid: { strokeDashArray: 8, borderColor },
  colors: [chartColors.penerimaan, chartColors.pengeluaran],
  fill: { opacity: [1, 1] },
  plotOptions: {
    bar: { columnWidth: "30%", borderRadius: 4, borderRadiusApplication: "end" },
  },
  dataLabels: { enabled: false },
  xaxis: {
    tickAmount: 10,
    categories: [],
    labels: {
      style: {
        colors: labelColor,
        fontSize: "13px",
        fontFamily: "Inter",
        fontWeight: 400,
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: [
    {
      seriesName: "Penerimaan (Rp)",
      labels: {
        style: {
          colors: labelColor,
          fontSize: "13px",
          fontFamily: "Inter",
          fontWeight: 400,
        },
        formatter: (val) => fmtIDR(val),
      },
      tooltip: { enabled: true },
    },
    {
      opposite: true,
      seriesName: "Pengeluaran (Rp)",
      labels: {
        style: {
          colors: labelColor,
          fontSize: "13px",
          fontFamily: "Inter",
          fontWeight: 400,
        },
        formatter: (val) => fmtIDR(val),
      },
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
    y: { formatter: (val) => fmtIDR(val) },
  },
  responsive: [
    {
      breakpoint: 1400,
      options: {
        chart: { height: 320 },
        xaxis: { labels: { style: { fontSize: "10px" } } },
        legend: {
          itemMargin: { vertical: 0, horizontal: 10 },
          fontSize: "13px",
          offsetY: 12,
        },
      },
    },
    { breakpoint: 1025, options: { chart: { height: 415 }, plotOptions: { bar: { columnWidth: "50%" } } } },
    { breakpoint: 982,  options: { plotOptions: { bar: { columnWidth: "30%" } } } },
    { breakpoint: 480,  options: { chart: { height: 250 }, legend: { offsetY: 7 } } },
  ],
});

// Sinkronkan categories dengan xaxis
watch(categories, (cats) => {
  shipmentConfig.xaxis.categories = cats || [];
  shipmentConfig.xaxis.tickAmount = (cats?.length || 10);
});

// FETCH DATA DARI API
const isLoading = ref(false);
const fetchData = async () => {
  isLoading.value = true;
  try {
    const response = await $api("/admin/dashboard/statistic");

    if (!response || !response.status) {
      showSnackbar({ text: response?.message || "Gagal mengambil data", color: "error" });
      return;
    }

    const len = Math.min(
      response.categories?.length ?? 0,
      response.penerimaan?.length ?? 0,
      response.pengeluaran?.length ?? 0
    );

    categories.value  = (response.categories || []).slice(0, len);
    penerimaan.value  = (response.penerimaan || []).slice(0, len);
    pengeluaran.value = (response.pengeluaran || []).slice(0, len);
  } catch (e) {
    console.error(e);
    showSnackbar({ text: "Terjadi kesalahan jaringan", color: "error" });
  } finally {
    isLoading.value = false;
  }
};

const month = new Date().toLocaleString("default", { month: "long" });

onMounted(fetchData);
</script>

<template>
  <VCard>
    <VSkeletonLoader
      v-if="isLoading"
      type="card, list-item, paragraph, paragraph"
    />
    <template v-else>
      <VCardItem
        title="Statistik Keuangan"
        subtitle="Data Statistik Pemasukan harian UII Dalwa"
      >
        <template #append>
          <VBtnGroup density="compact" variant="outlined" divided>
            <VBtn color="primary">{{ month }}</VBtn>
          </VBtnGroup>
        </template>
      </VCardItem>

      <VCardText>
        <VueApexCharts
          id="finance-statistics"
          type="line"
          height="320"
          :options="shipmentConfig"
          :series="series"
        />
      </VCardText>
    </template>
  </VCard>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart";

.v-btn-group--divided .v-btn:not(:last-child) {
  border-inline-end-color: rgba(var(--v-theme-primary), 0.5);
}

#finance-statistics {
  .apexcharts-legend-text {
    font-size: 15px !important;
    line-height: 22px;
  }

  .apexcharts-legend {
    .apexcharts-legend-series {
      border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
      border-radius: 0.5rem;
      block-size: 75%;
      margin-inline: 8px !important;
      padding-block: 4px;
      padding-inline: 16px;
    }
  }
}
</style>
