<script setup>
import { formatRupiah } from "@/composables/formatRupiah";

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
});

const statNumber = (key, field) => Number(props.stats?.[key]?.[field] ?? 0);

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
]);

const statCards = computed(() => {
  if (!props.filterActive) return defaultStatCards.value;

  return [
    {
      key: "filter",
      title: props.filterTitle,
      amount: statNumber("keseluruhan", "total"),
      count: statNumber("keseluruhan", "jumlah"),
      icon: "ri-filter-3-line",
      color: "primary",
    },
  ];
});
</script>

<template>
  <div
    class="pengeluaran-stat-grid mb-4"
    :class="{ 'pengeluaran-stat-grid--filtered': filterActive }"
  >
    <VCard
      v-for="item in statCards"
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

          <div class="d-flex align-center mt-1">
            <span class="text-caption text-disabled me-2">Total Data</span>
            <VChip
              size="x-small"
              :color="item.color"
              label
            >
              {{ item.count }}
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

.pengeluaran-stat-grid--filtered {
  grid-template-columns: minmax(0, 1fr);
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
