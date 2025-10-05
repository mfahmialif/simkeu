<script setup>
const chartColors = {
  bar: '#666CFF',   // primary untuk penerimaan (Rp)
  line: '#22C55E',   // success untuk realisasi (%)
}

const headingColor = 'rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity))'
const labelColor = 'rgba(var(--v-theme-on-background), var(--v-disabled-opacity))'
const borderColor = 'rgba(var(--v-border-color), var(--v-border-opacity))'

// ====== DATA KEUANGAN (contoh harian 1–10 Jan) ======
const categories = [
  '1 Jan', '2 Jan', '3 Jan', '4 Jan', '5 Jan', '6 Jan', '7 Jan', '8 Jan', '9 Jan', '10 Jan',
]

// Penerimaan harian (Rp)
const penerimaan = [
  120_000_000,
  130_000_000,
  125_000_000,
  140_000_000,
  135_000_000,
  150_000_000,
  145_000_000,
  155_000_000,
  160_000_000,
  158_000_000,
]

// Realisasi (%) terhadap target harian
const realisasi = [82, 86, 90, 92, 88, 95, 93, 97, 100, 98]

// Series: kolom = Rp, garis = %
const series = [
  { name: 'Penerimaan (Rp)', type: 'column', data: penerimaan },
  { name: 'Realisasi (%)', type: 'line', data: realisasi },
]

// Formatter Rupiah & Persen
const fmtIDR = v => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
const fmtPct = v => `${v}%`

const shipmentConfig = {
  chart: {
    type: 'line',
    stacked: false,
    parentHeightOffset: 0,
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  markers: {
    size: 5,
    colors: '#fff',
    strokeColors: chartColors.line,
    hover: { size: 6 },
    borderRadius: 4,
  },
  stroke: {
    curve: 'smooth',
    width: [0, 3],
    lineCap: 'round',
  },
  legend: {
    show: true,
    position: 'bottom',
    markers: { width: 8, height: 8, offsetX: -3 },
    height: 40,
    itemMargin: { horizontal: 10, vertical: 0 },
    fontSize: '15px',
    fontFamily: 'Inter',
    fontWeight: 400,
    labels: { colors: headingColor, useSeriesColors: !1 },
    offsetY: 10,
  },
  grid: {
    strokeDashArray: 8,
    borderColor,
  },
  colors: [chartColors.bar, chartColors.line],
  fill: { opacity: [1, 1] },
  plotOptions: {
    bar: {
      columnWidth: '30%',
      borderRadius: 4,
      borderRadiusApplication: 'end',
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    tickAmount: categories.length,
    categories,
    labels: {
      style: { colors: labelColor, fontSize: '13px', fontFamily: 'Inter', fontWeight: 400 },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },

  // ====== 2 Sumbu-Y: kiri Rupiah, kanan Persen ======
  yaxis: [
    {
      seriesName: 'Penerimaan (Rp)',
      labels: {
        style: { colors: labelColor, fontSize: '13px', fontFamily: 'Inter', fontWeight: 400 },
        formatter: val => fmtIDR(val),
      },
      tooltip: { enabled: true },
    },
    {
      opposite: true,
      seriesName: 'Realisasi (%)',
      min: 0,
      max: 100,
      tickAmount: 4,
      labels: {
        style: { colors: labelColor, fontSize: '13px', fontFamily: 'Inter', fontWeight: 400 },
        formatter: val => fmtPct(val),
      },
    },
  ],

  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: (val, { seriesIndex }) => (seriesIndex === 0 ? fmtIDR(val) : fmtPct(val)),
    },
  },

  responsive: [
    {
      breakpoint: 1400,
      options: {
        chart: { height: 320 },
        xaxis: { labels: { style: { fontSize: '10px' } } },
        legend: {
          itemMargin: { vertical: 0, horizontal: 10 },
          fontSize: '13px',
          offsetY: 12,
        },
      },
    },
    {
      breakpoint: 1025,
      options: { chart: { height: 415 }, plotOptions: { bar: { columnWidth: '50%' } } },
    },
    { breakpoint: 982, options: { plotOptions: { bar: { columnWidth: '30%' } } } },
    { breakpoint: 480, options: { chart: { height: 250 }, legend: { offsetY: 7 } } },
  ],
}
</script>

<template>
  <VCard>
    <VCardItem title="Statistik Keuangan" subtitle="Penerimaan harian & tingkat realisasi terhadap target">
      <template #append>
        <VBtnGroup density="compact" variant="outlined" divided>
          <VBtn color="primary">Januari</VBtn>
          <VBtn icon="ri-arrow-down-s-line" color="primary" />
        </VBtnGroup>
      </template>
    </VCardItem>

    <VCardText>
      <VueApexCharts id="finance-statistics" type="line" height="320" :options="shipmentConfig" :series="series" />
    </VCardText>
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
