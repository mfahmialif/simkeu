<script setup>
const chartColors = {
  donut: {
    // bisa ganti ke token tema: 'rgb(var(--v-theme-success))', dst.
    series1: '#22C55E', // SPP
    series2: '#10B981', // Registrasi
    series3: '#06B6D4', // Donasi
    series4: '#F59E0B', // Lainnya
  },
}

const headingColor = 'rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity))'
const labelColor = 'rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity))'

// ====== DATA KEUANGAN (contoh) ======
const financeDonutSeries = [
  125_000_000, // SPP
  80_000_000,  // Registrasi
  45_000_000,  // Donasi
  30_000_000,  // Lainnya
]

const labels = ['SPP', 'Registrasi', 'Donasi', 'Lainnya']

const fmtIDR = v => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
const fmtPct = v => `${Number.parseInt(v)}%`

const financeDonutConfig = {
  labels,
  colors: [
    chartColors.donut.series1,
    chartColors.donut.series2,
    chartColors.donut.series3,
    chartColors.donut.series4,
  ],
  stroke: { width: 0 },

  // tampilkan persentase pada sektor, bukan angka mentah
  dataLabels: {
    enabled: true,
    formatter(val) {
      return fmtPct(val)
    },
    style: { fontSize: '12px', colors: ['#fff'] },
    dropShadow: { enabled: false },
  },

  legend: {
    show: true,
    position: 'bottom',
    offsetY: 10,
    markers: { width: 8, height: 8, offsetX: -3 },
    itemMargin: { horizontal: 15, vertical: 5 },
    fontSize: '13px',
    fontWeight: 400,
    labels: { colors: headingColor, useSeriesColors: false },
    // tampilkan nilai rupiah di legend
    formatter(seriesName, opts) {
      const val = opts.w.globals.series[opts.seriesIndex]
      return `${seriesName} — ${fmtIDR(val)}`
    },
  },

  tooltip: {
    theme: false,
    y: {
      formatter(value, { w, seriesIndex }) {
        const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0)
        const pct = (value / (total || 1)) * 100
        return `${fmtIDR(value)} (${pct.toFixed(1)}%)`
      },
    },
  },

  grid: { padding: { top: 15 } },

  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          name: { offsetY: 22, color: labelColor },
          value: {
            fontSize: '24px',
            color: headingColor,
            fontWeight: 600,
            offsetY: -23,
            // tampilkan % saat hover sektor
            formatter(val) {
              return fmtPct(val)
            },
          },
          total: {
            show: true,
            fontSize: '1rem',
            label: 'Total Penerimaan',
            color: labelColor,
            formatter(w) {
              const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0)
              return fmtIDR(total)
            },
          },
        },
      },
    },
  },

  responsive: [
    { breakpoint: 420, options: { chart: { height: 400 } } },
  ],
}

const moreList = [
  { title: 'Bulan Ini', value: 'this-month' },
  { title: 'Triwulan Ini', value: 'this-quarter' },
  { title: 'Tahun Berjalan', value: 'ytd' },
]
</script>

<template>
  <VCard>
    <VCardItem title="Komposisi Penerimaan">
      <template #append>
        <MoreBtn :menu-list="moreList" />
      </template>
    </VCardItem>

    <VCardText>
      <VueApexCharts type="donut" height="428" :options="financeDonutConfig" :series="financeDonutSeries" />
    </VCardText>
  </VCard>
</template>
