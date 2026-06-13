<script setup>
import { formatRupiah } from "@/composables/formatRupiah"

const props = defineProps({
  stats: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  filterActive: {
    type: Boolean,
    default: false,
  },
  filterTitle: {
    type: String,
    default: "Pengeluaran Sesuai Filter",
  },
})

const statNumber = (key, field) => Number(props.stats?.[key]?.[field] ?? 0)

const saldoColor = value => {
  if (value > 0) return "success"
  if (value < 0) return "error"

  return "secondary"
}

const defaultStatCards = computed(() => [
  {
    key: "hari_ini",
    title: "Pengeluaran Hari Ini",
    amount: statNumber("hari_ini", "total"),
    count: statNumber("hari_ini", "jumlah"),
    icon: "ri-calendar-event-line",
    color: "error",
  },
  {
    key: "mingguan",
    title: "Pengeluaran Mingguan",
    amount: statNumber("mingguan", "total"),
    count: statNumber("mingguan", "jumlah"),
    icon: "ri-calendar-todo-line",
    color: "warning",
  },
  {
    key: "bulanan",
    title: "Pengeluaran Bulanan",
    amount: statNumber("bulanan", "total"),
    count: statNumber("bulanan", "jumlah"),
    icon: "ri-calendar-2-line",
    color: "info",
  },
  {
    key: "keseluruhan",
    title: "Pengeluaran Keseluruhan",
    amount: statNumber("keseluruhan", "total"),
    count: statNumber("keseluruhan", "jumlah"),
    icon: "ri-wallet-3-line",
    color: "primary",
  },
  {
    key: "belum_rekap",
    title: "Belum Masuk Rekap",
    amount: statNumber("belum_rekap", "total"),
    count: statNumber("belum_rekap", "jumlah"),
    icon: "ri-file-warning-line",
    color: "secondary",
  },
])

const saldoCards = computed(() => {
  const saldo = props.stats?.saldo
  if (!Array.isArray(saldo) || saldo.length === 0) return []

  return saldo.map(item => {
    const s = Number(item.saldo ?? 0)

    return {
      key: `saldo-${item.petugas_id}`,
      title: `Saldo ${item.petugas_name || "-"}`,
      amount: s,
      icon: "ri-scales-3-line",
      color: saldoColor(s),
      isSaldo: true,
      totalRab: Number(item.total_rab ?? 0),
      totalLpj: Number(item.total_lpj ?? 0),
      tambahan: Number(item.tambahan ?? 0),
    }
  })
})

const allCards = computed(() => [
  ...defaultStatCards.value,
  ...saldoCards.value,
])
</script>

<template>
  <div class="pengeluaran-stat-grid mb-4">
    <VCard
      v-for="item in allCards"
      :key="item.key"
    >
      <VCardText class="d-flex align-center justify-space-between gap-3">
        <div class="stat-content">
          <div class="text-sm text-medium-emphasis">
            {{ item.title }}
          </div>

          <VSkeletonLoader
            v-if="loading"
            type="text"
            width="160"
            class="mt-1"
          />
          <div
            v-else
            class="stat-amount text-h5 font-weight-medium"
            :title="formatRupiah(item.amount)"
          >
            {{ formatRupiah(item.amount) }}
          </div>

          <div
            v-if="!item.isSaldo"
            class="d-flex align-center mt-1"
          >
            <span class="text-caption text-disabled me-2">Total Data</span>
            <VChip
              size="x-small"
              :color="item.color"
              label
            >
              {{ item.count }}
            </VChip>
          </div>

          <div
            v-else
            class="d-flex align-center flex-wrap gap-1 mt-1"
          >
            <span class="text-caption text-disabled">RAB</span>
            <VChip
              size="x-small"
              color="info"
              label
            >
              {{ formatRupiah(item.totalRab) }}
            </VChip>
            <span class="text-caption text-disabled">LPJ</span>
            <VChip
              size="x-small"
              color="warning"
              label
            >
              {{ formatRupiah(item.totalLpj) }}
            </VChip>
            <span
              v-if="item.tambahan"
              class="text-caption text-disabled"
            >Tambah</span>
            <VChip
              v-if="item.tambahan"
              size="x-small"
              color="success"
              label
            >
              {{ formatRupiah(item.tambahan) }}
            </VChip>
          </div>
        </div>

        <VAvatar
          :color="item.color"
          variant="tonal"
          rounded
        >
          <VIcon :icon="item.icon" />
        </VAvatar>
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
.pengeluaran-stat-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.stat-content {
  min-inline-size: 0;
}

.stat-amount {
  overflow-wrap: anywhere;
  white-space: normal;
}

@media (max-width: 1199px) {
  .pengeluaran-stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 599px) {
  .pengeluaran-stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>
