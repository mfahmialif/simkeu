<script setup>
import { formatMoney } from "@/composables/formatRupiah"
import { ref, reactive, computed, watch, onMounted } from "vue"

const chartColors = {
  penerimaan: "#666CFF",
  pengeluaran: "#FF4C51",
}

const headingColor =
  "rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity))"

const labelColor =
  "rgba(var(--v-theme-on-background), var(--v-disabled-opacity))"

const borderColor = "rgba(var(--v-border-color), var(--v-border-opacity))"

// ==== STATE REAKTIF DARI API ====
const categories = ref([])
const seriesByCurrency = ref([])
const selectedCurrency = ref("IDR")

const currencyOptions = computed(() =>
  seriesByCurrency.value.map(item => ({
    title: `${item.mata_uang?.kode || "IDR"} - ${item.mata_uang?.nama || "Rupiah"}`,
    value: String(item.mata_uang?.kode || "IDR").toUpperCase(),
  })),
)

const activeCurrency = computed(() =>
  seriesByCurrency.value.find(
    item =>
      String(item.mata_uang?.kode || "IDR").toUpperCase() === selectedCurrency.value,
  ) || {
    mata_uang: { kode: "IDR", simbol: "Rp" },
    penerimaan: [],
    pengeluaran: [],
  },
)

const penerimaan = computed(() => activeCurrency.value.penerimaan || [])
const pengeluaran = computed(() => activeCurrency.value.pengeluaran || [])

// Series mengikuti state di atas
const series = computed(() => [
  { name: `Pemasukan (${selectedCurrency.value})`, type: "column", data: penerimaan.value },
  { name: `Pengeluaran (${selectedCurrency.value})`, type: "line", data: pengeluaran.value },
])

const fmtMoney = value => formatMoney(value, activeCurrency.value.mata_uang)

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
      seriesName: "Pemasukan (IDR)",
      labels: {
        style: {
          colors: labelColor,
          fontSize: "13px",
          fontFamily: "Inter",
          fontWeight: 400,
        },
        formatter: val => fmtMoney(val),
      },
      tooltip: { enabled: true },
    },
    {
      opposite: true,
      seriesName: "Pengeluaran (IDR)",
      labels: {
        style: {
          colors: labelColor,
          fontSize: "13px",
          fontFamily: "Inter",
          fontWeight: 400,
        },
        formatter: val => fmtMoney(val),
      },
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
    y: { formatter: val => fmtMoney(val) },
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
})

// Sinkronkan categories dengan xaxis
watch(categories, cats => {
  shipmentConfig.xaxis.categories = cats || []
  shipmentConfig.xaxis.tickAmount = (cats?.length || 10)
})

watch(selectedCurrency, kode => {
  shipmentConfig.yaxis[0].seriesName = `Pemasukan (${kode})`
  shipmentConfig.yaxis[1].seriesName = `Pengeluaran (${kode})`
})

// FETCH DATA DARI API
const isLoading = ref(false)

const fetchData = async () => {
  isLoading.value = true
  try {
    const response = await $api("/admin/dashboard/statistic")

    if (!response || !response.status) {
      showSnackbar({ text: response?.message || "Gagal mengambil data", color: "error" })
      
      return
    }

    categories.value = response.categories || []
    seriesByCurrency.value = (response.series_by_currency || []).map(item => ({
      ...item,
      penerimaan: (item.penerimaan || []).map(Number),
      pengeluaran: (item.pengeluaran || []).map(Number),
    }))

    if (!seriesByCurrency.value.length) {
      seriesByCurrency.value = [{
        key: "kode:IDR",
        mata_uang: { kode: "IDR", nama: "Rupiah", simbol: "Rp" },
        penerimaan: (response.penerimaan || []).map(Number),
        pengeluaran: (response.pengeluaran || []).map(Number),
      }]
    }

    if (!currencyOptions.value.some(item => item.value === selectedCurrency.value)) {
      selectedCurrency.value =
        currencyOptions.value.find(item => item.value === "IDR")?.value
        || currencyOptions.value[0]?.value
        || "IDR"
    }
  } catch (e) {
    console.error(e)
    showSnackbar({ text: "Terjadi kesalahan jaringan", color: "error" })
  } finally {
    isLoading.value = false
  }
}

const month = new Date().toLocaleString("default", { month: "long" })

onMounted(fetchData)
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
          <div class="d-flex align-center gap-2">
            <VSelect
              v-model="selectedCurrency"
              :items="currencyOptions"
              density="compact"
              hide-details
              label="Mata Uang"
              style="inline-size: 150px"
              :disabled="currencyOptions.length <= 1"
            />
            <VChip
              color="primary"
              variant="tonal"
            >
              {{ month }}
            </VChip>
          </div>
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
