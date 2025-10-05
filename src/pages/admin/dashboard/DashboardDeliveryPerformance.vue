<script setup>
const IDR = v => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)
const PCT = v => `${v}%`

/**
 * fields:
 * - title: judul metrik
 * - value: angka murni (number)
 * - unit: 'currency' | 'percent' | 'number'  -> untuk format tampilan
 * - change: perubahan dalam % (positif/negatif)
 * - icon: remix icon
 * - color: token warna vuetify
 * - goodIsUp: true jika kenaikan itu baik (default true). Misal Pengeluaran: goodIsUp = false
 */
const financeData = [
  {
    title: 'Total Penerimaan',
    value: 1_520_000_000,
    unit: 'currency',
    change: 4.8,
    icon: 'ri-wallet-3-line',
    color: 'primary',
    goodIsUp: true,
  },
  {
    title: 'Total Pengeluaran',
    value: 980_000_000,
    unit: 'currency',
    change: 3.2,
    icon: 'ri-exchange-dollar-line',
    color: 'error',
    goodIsUp: false, // naik = kurang baik
  },
  {
    title: 'Saldo Kas',
    value: 540_000_000,
    unit: 'currency',
    change: 1.5,
    icon: 'ri-safe-2-line',
    color: 'success',
    goodIsUp: true,
  },
  {
    title: 'Piutang (Outstanding)',
    value: 210_000_000,
    unit: 'currency',
    change: -2.1,
    icon: 'ri-hand-coin-line',
    color: 'warning',
    goodIsUp: false, // piutang turun = baik
  },
  {
    title: 'Tagihan Jatuh Tempo (7 hari)',
    value: 125_000_000,
    unit: 'currency',
    change: 0.9,
    icon: 'ri-timer-flash-line',
    color: 'info',
    goodIsUp: false,
  },
  {
    title: 'Rasio Realisasi Anggaran',
    value: 76.4,
    unit: 'percent',
    change: 1.1,
    icon: 'ri-bar-chart-grouped-line',
    color: 'secondary',
    goodIsUp: true,
  },
]

// formatter tampilan nilai
const formatValue = (val, unit) => {
  if (unit === 'currency') return IDR(val)
  if (unit === 'percent') return PCT(val)
  return val.toLocaleString('id-ID')
}

const moreList = [
  { title: 'Bulan Ini', value: 'this-month' },
  { title: 'Triwulan Ini', value: 'this-quarter' },
  { title: 'Tahun Berjalan', value: 'ytd' },
]
</script>

<template>
  <VCard>
    <VCardItem title="Ringkasan Keuangan" subtitle="Update keuangan periode ini">
      <template #append>
        <MoreBtn class="mt-n5" :menu-list="moreList" />
      </template>
    </VCardItem>

    <VCardText>
      <VList class="card-list">
        <VListItem v-for="(data, index) in financeData" :key="index">
          <template #prepend>
            <VAvatar :color="data.color" variant="tonal" rounded="lg" size="40">
              <VIcon :icon="data.icon" size="24" />
            </VAvatar>
          </template>

          <VListItemTitle>{{ data.title }}</VListItemTitle>

          <VListItemSubtitle>
            <div class="d-flex align-center"
              :class="(data.goodIsUp ? data.change > 0 : data.change < 0) ? 'text-success' : 'text-error'">
              <VIcon
                :icon="(data.goodIsUp ? data.change > 0 : data.change < 0) ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"
                size="24" class="me-1" />
              <span>{{ data.change }}%</span>
            </div>
          </VListItemSubtitle>

          <template #append>
            <span class="text-high-emphasis text-body-1 font-weight-medium">
              {{ formatValue(data.value, data.unit) }}
            </span>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>
