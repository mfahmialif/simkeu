<script setup>
import { formatRupiah } from "@/composables/formatRupiah";
import { ref, computed, onMounted, watch } from "vue";

const props = defineProps({
  periodeId: {
    type: [String, Number],
    default: null,
  },
  jenisPembayaranId: {
    type: [String, Number],
    default: null,
  },
  tanggalMulai: {
    type: String,
    default: null,
  },
  tanggalAkhir: {
    type: String,
    default: null,
  },
  userId: {
    type: String,
    default: null,
  },
});

const loading = ref(true);
const statistics = ref(null);

const isModalOpen = ref(false);
const selectedData = ref(null);

const openDetail = (data) => {
  selectedData.value = data;
  isModalOpen.value = true;
};

const widgetData = ref([
  {
    title: "Harian",
    value: 0,
    icon: "ri-calendar-event-line",
    change: 0,
    breakdown: {},
  },
  {
    title: "Mingguan",
    value: 0,
    icon: "ri-calendar-todo-line",
    change: 0,
    breakdown: {},
  },
  {
    title: "Bulanan",
    value: 0,
    icon: "ri-calendar-2-line",
    change: 0,
    breakdown: {},
  },
  {
    title: "Keseluruhan",
    value: 0,
    icon: "ri-wallet-3-line",
    change: 0,
    breakdown: {},
  },
]);

const fetchStatistics = async () => {
  loading.value = true;
  try {
    const response = await $api("/admin/pemasukan/mahasiswa/semester-pendek/statistic", {
      method: "GET",
      params: {
        ...(props.periodeId && { periode_id: props.periodeId }),
        ...(props.jenisPembayaranId && { jenis_pembayaran_id: props.jenisPembayaranId }),
        ...(props.userId && { user_id: props.userId }),
        ...(props.tanggalMulai && { tanggal_mulai: props.tanggalMulai }),
        ...(props.tanggalAkhir && { tanggal_akhir: props.tanggalAkhir }),
      },
    });

    if (response && response.data) {
      statistics.value = response.data;

      const mapPeriod = (periodName, index) => {
        const periodData = response.data[periodName];
        if (periodData) {
          widgetData.value[index].value = formatRupiah(periodData.Keseluruhan?.value || 0);
          widgetData.value[index].change = periodData.Keseluruhan?.change || 0;
          widgetData.value[index].breakdown = {};
          
          for (const [gender, item] of Object.entries(periodData)) {
            widgetData.value[index].breakdown[gender] = {
              value: formatRupiah(item.value || 0),
              change: item.change || 0
            };
          }
        }
      };

      mapPeriod('Harian', 0);
      mapPeriod('Mingguan', 1);
      mapPeriod('Bulanan', 2);
      mapPeriod('Semua', 3);
    }
  } catch (err) {
    console.error("Failed to fetch statistics:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchStatistics();
});

watch(
  () => props.periodeId,
  () => fetchStatistics()
);
watch(
  () => props.jenisPembayaranId,
  () => fetchStatistics()
);
watch(
  () => props.tanggalMulai,
  () => fetchStatistics()
);
watch(
  () => props.tanggalAkhir,
  () => fetchStatistics()
);
watch(
  () => props.userId,
  () => fetchStatistics()
);

const hasDateFilter = computed(() => !!props.tanggalMulai || !!props.tanggalAkhir);

const filteredWidgetData = computed(() => {
  if (hasDateFilter.value) {
    return widgetData.value.filter(d => d.title !== 'Mingguan' && d.title !== 'Bulanan');
  }
  return widgetData.value;
});

const widgetColSize = computed(() => hasDateFilter.value ? 6 : 3);

defineExpose({ fetchStatistics });

const formatTanggal = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const todayFormatted = computed(() => {
  return new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
});

const getDateInfo = (title) => {
  if (title === 'Harian') {
    if (props.tanggalMulai) {
      return `📅 ${formatTanggal(props.tanggalMulai)}`;
    }
    return `📅 Hari ini, ${todayFormatted.value}`;
  }
  if (title === 'Keseluruhan') {
    if (props.tanggalMulai && props.tanggalAkhir) {
      return `📅 ${formatTanggal(props.tanggalMulai)} - ${formatTanggal(props.tanggalAkhir)}`;
    }
    if (props.tanggalMulai) {
      return `📅 Dari ${formatTanggal(props.tanggalMulai)}`;
    }
    if (props.tanggalAkhir) {
      return `📅 Sampai ${formatTanggal(props.tanggalAkhir)}`;
    }
    return '📅 Semua waktu';
  }
  if (title === 'Mingguan') return '📅 Minggu ini';
  if (title === 'Bulanan') return '📅 Bulan ini';
  return '';
};
</script>

<template>
  <div>
    <!-- 👉 widgets -->
    <VCard class="mb-6">
      <VCardText class="px-2">
        <VRow v-if="loading">
          <template v-for="i in (hasDateFilter ? 2 : 4)" :key="i">
            <VCol cols="12" sm="6" :md="widgetColSize" class="px-6">
              <div class="d-flex justify-space-between align-center py-2">
                <div class="d-flex flex-column gap-y-2 flex-grow-1">
                  <VSkeletonLoader type="text" width="120" />
                  <VSkeletonLoader type="heading" width="180" />
                  <VSkeletonLoader type="text" width="100" />
                </div>
                <VSkeletonLoader type="avatar" />
              </div>
            </VCol>
            <VDivider v-if="i < (hasDateFilter ? 2 : 4)" vertical inset length="92" class="d-none d-md-block" />
          </template>
        </VRow>
        <VRow v-else>
          <template v-for="(data, index) in filteredWidgetData" :key="index">
            <VCol cols="12" sm="6" :md="widgetColSize" class="px-6">
              <div
                class="d-flex justify-space-between cursor-pointer"
                @click="openDetail(data)"
                :class="
                  $vuetify.display.xs
                    ? index !== filteredWidgetData.length - 1
                      ? 'border-b pb-4'
                      : ''
                    : $vuetify.display.sm
                    ? index < filteredWidgetData.length / 2
                      ? 'border-b pb-4'
                      : ''
                    : ''
                "
              >
                <div class="d-flex flex-column gap-y-1">
                  <p class="text-capitalize mb-0">
                    Pemasukan {{ data.title }}
                  </p>

                  <div class="text-caption text-disabled" style="font-size: 11px !important;">
                    {{ getDateInfo(data.title) }}
                  </div>

                  <div style="min-width: 0;">
                    <h5 class="text-h5 text-primary font-weight-bold text-truncate" :title="data.value">
                      {{ data.value }}
                    </h5>
                  </div>

                  <div class="d-flex align-center">
                    <div class="text-no-wrap me-2 text-body-2 text-disabled">
                      Total Data
                    </div>

                    <VChip
                      size="small"
                      color="primary"
                    >
                      {{ data.change }}
                    </VChip>
                  </div>
                </div>

                <VAvatar variant="tonal" rounded="lg" size="44" color="primary">
                  <VIcon :icon="data.icon" size="28" />
                </VAvatar>
              </div>
            </VCol>
            <VDivider
              v-if="
                $vuetify.display.mdAndUp
                  ? index !== filteredWidgetData.length - 1
                  : $vuetify.display.smAndUp
                  ? index % 2 === 0
                  : false
              "
              vertical
              inset
              length="92"
            />
          </template>
        </VRow>
      </VCardText>
    </VCard>

    <VDialog v-model="isModalOpen" max-width="400">
      <VCard>
        <VCardItem class="pb-2">
          <VCardTitle class="text-h5 text-primary">
            Detail Pemasukan {{ selectedData?.title }}
          </VCardTitle>
        </VCardItem>
        <VCardText>
          <div class="d-flex flex-column gap-y-4 mt-2">
            <template v-for="(item, key) in selectedData?.breakdown" :key="key">
              <div class="d-flex align-center gap-x-3">
                <VAvatar color="primary" variant="tonal" rounded>
                  <VIcon :icon="selectedData?.icon" size="24" />
                </VAvatar>
                <div class="flex-grow-1" style="min-width: 0;">
                  <div class="text-body-1 font-weight-medium text-capitalize">{{ key }}</div>
                  <h5 class="text-h5 font-weight-bold text-truncate" :title="item.value">{{ item.value }}</h5>
                </div>
                <div class="text-right">
                  <span class="text-body-2 text-disabled">Total Data</span>
                  <div class="text-h6">{{ item.change }}</div>
                </div>
              </div>
              <VDivider v-if="key !== 'Keseluruhan'" />
            </template>
          </div>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="tonal" color="secondary" @click="isModalOpen = false">
            Tutup
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  padding: 8px;
  border-radius: 8px;

  &:hover {
    transform: translateY(-2px);
    background-color: rgba(var(--v-theme-primary), 0.04);
  }
}
</style>
