<script setup>
import { formatMoney, formatRupiah } from "@/composables/formatRupiah";
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  thAkademikId: {
    type: [String, Number],
    default: null,
  },
  prodiId: {
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
const harianDetailData = ref([]);
const semuaDetailData = ref([]);
const router = useRouter();

const isModalOpen = ref(false);
const selectedData = ref(null);

const openDetail = (data) => {
  selectedData.value = data;
  isModalOpen.value = true;
};

const selectedCategory = ref(null);
const selectedPaymentMethod = ref(null);
const detailProdiData = ref([]);
const loadingDetailProdi = ref(false);

const defaultMataUang = { kode: "IDR", nama: "Rupiah", simbol: "Rp" };

const normalizeMataUang = (item = {}) => ({
  kode: String(item?.mata_uang?.kode ?? item?.mata_uang_kode ?? defaultMataUang.kode).toUpperCase(),
  nama: item?.mata_uang?.nama ?? item?.mata_uang_nama ?? defaultMataUang.nama,
  simbol: item?.mata_uang?.simbol ?? item?.mata_uang_simbol ?? defaultMataUang.simbol,
});

const formatByCurrency = (rows, fallbackValue = 0) => {
  const data = Array.isArray(rows) ? rows : [];
  const filtered = data.filter((row) => Number(row.total || 0) > 0);

  if (!filtered.length) {
    return formatRupiah(fallbackValue || 0);
  }

  return filtered
    .map((row) => {
      const mataUang = normalizeMataUang(row);
      return `${mataUang.kode}: ${formatMoney(row.total, mataUang)}`;
    })
    .join(" | ");
};

const getCurrencyRows = (rows, fallbackValue = 0) => {
  const data = Array.isArray(rows) ? rows : [];
  const filtered = data.filter(row => Number(row.total || 0) > 0);
  const source = filtered.length
    ? filtered
    : [{ mata_uang: defaultMataUang, total: fallbackValue || 0 }];

  return source
    .map(row => {
      const mataUang = normalizeMataUang(row);

      return {
        key: mataUang.kode,
        kode: mataUang.kode,
        amount: formatMoney(row.total, mataUang),
      };
    })
    .sort((left, right) => {
      if (left.kode === right.kode) return 0;
      if (left.kode === "IDR") return -1;
      if (right.kode === "IDR") return 1;

      return left.kode.localeCompare(right.kode);
    });
};

const formatRowMoney = (row, field) =>
  formatMoney(row?.[field] || 0, normalizeMataUang(row));

const sumRowsByCurrency = (rows, field) => {
  const map = new Map();

  for (const row of rows || []) {
    const mataUang = normalizeMataUang(row);
    const key = mataUang.kode;
    const current = map.get(key) || { mata_uang: mataUang, total: 0 };
    current.total += Number(row?.[field] || 0);
    map.set(key, current);
  }

  return Array.from(map.values());
};

const openDetailProdi = async (row) => {
  const category = typeof row === 'string' ? row : row?.tagihan_nama;
  const paymentMethod = typeof row === 'string' ? null : row?.jp_nama;
  const mataUangKode = typeof row === 'string' ? null : row?.mata_uang?.kode;

  selectedCategory.value = category;
  selectedPaymentMethod.value = paymentMethod;
  loadingDetailProdi.value = true;
  
  try {
    const params = {
      category,
      ...(props.thAkademikId && props.thAkademikId !== 'all' && { th_akademik_id: props.thAkademikId }),
      ...(props.prodiId && props.prodiId !== 'all' && { prodi_id: props.prodiId }),
      ...(props.jenisPembayaranId && props.jenisPembayaranId !== 'all' && { jenis_pembayaran_id: props.jenisPembayaranId }),
      ...((!props.jenisPembayaranId || props.jenisPembayaranId === 'all') && paymentMethod && { payment_method: paymentMethod }),
      ...(props.userId && props.userId !== 'all' && { user_id: props.userId }),
      ...(mataUangKode && { mata_uang_kode: mataUangKode }),
      ...(props.tanggalMulai && { tanggal_mulai: props.tanggalMulai }),
      ...(props.tanggalAkhir && { tanggal_akhir: props.tanggalAkhir }),
      period: selectedData.value?.title || 'Harian'
    };

    const { data: response } = await $api(`/admin/pemasukan/mahasiswa/pembayaran-statistic-detail-prodi`, {
      method: "GET",
      params
    });
    
    // Log response to help debug
    console.log("Detail Prodi API Response:", response);

    // Handle different response structures
    if (response && response.data) {
      detailProdiData.value = response.data;
    } else if (Array.isArray(response)) {
      detailProdiData.value = response;
    } else {
      detailProdiData.value = [];
    }
  } catch (error) {
    console.error("Failed to fetch detail prodi:", error);
    detailProdiData.value = [];
  } finally {
    loadingDetailProdi.value = false;
  }
};

watch(isModalOpen, (val) => {
  if (!val) {
    selectedCategory.value = null;
    selectedPaymentMethod.value = null;
    detailProdiData.value = [];
  }
});

const widgetData = ref([
  {
    title: "Harian",
    value: 0,
    icon: "ri-calendar-event-line",
    change: 0,
    breakdown: {},
    currencies: [],
  },
  {
    title: "Mingguan",
    value: 0,
    icon: "ri-calendar-todo-line",
    change: 0,
    breakdown: {},
    currencies: [],
  },
  {
    title: "Bulanan",
    value: 0,
    icon: "ri-calendar-2-line",
    change: 0,
    breakdown: {},
    currencies: [],
  },
  {
    title: "Keseluruhan",
    value: 0,
    icon: "ri-wallet-3-line",
    change: 0,
    breakdown: {},
    currencies: [],
  },
]);

const fetchStatistics = async () => {
  loading.value = true;
  try {
    const response = await $api("/admin/pemasukan/mahasiswa/pembayaran-statistic", {
      method: "GET",
      body: {
        ...(props.thAkademikId && { th_akademik_id: props.thAkademikId }),
        ...(props.prodiId && { prodi_id: props.prodiId }),
        ...(props.jenisPembayaranId && { jenis_pembayaran_id: props.jenisPembayaranId }),
        ...(props.userId && { user_id: props.userId }),
        ...(props.tanggalMulai && { tanggal_mulai: props.tanggalMulai }),
        ...(props.tanggalAkhir && { tanggal_akhir: props.tanggalAkhir }),
      },
    });

    if (response && response.data) {
      statistics.value = response.data;

      // Assign to widgetData
      const mapPeriod = (periodName, index) => {
        const periodData = response.data[periodName];
        if (periodData) {
          widgetData.value[index].currencies = getCurrencyRows(
            periodData.Keseluruhan?.by_currency,
            periodData.Keseluruhan?.value || 0
          );
          widgetData.value[index].value = formatByCurrency(
            periodData.Keseluruhan?.by_currency,
            periodData.Keseluruhan?.value || 0
          );
          widgetData.value[index].change = periodData.Keseluruhan?.change || 0;
          widgetData.value[index].breakdown = {};
          
          for (const [gender, item] of Object.entries(periodData)) {
            widgetData.value[index].breakdown[gender] = {
              value: formatByCurrency(item.by_currency, item.value || 0),
              by_currency: item.by_currency || [],
              change: item.change || 0
            };
          }
        }
      };

      mapPeriod('Harian', 0);
      mapPeriod('Mingguan', 1);
      mapPeriod('Bulanan', 2);
      mapPeriod('Semua', 3);

      if (response.data['Harian_Detail']) {
        harianDetailData.value = response.data['Harian_Detail'];
      }
      if (response.data['Semua_Detail']) {
        semuaDetailData.value = response.data['Semua_Detail'];
      }
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
  () => props.thAkademikId,
  () => {
    fetchStatistics();
  }
);

watch(
  () => props.prodiId,
  () => {
    fetchStatistics();
  }
);

watch(
  () => props.jenisPembayaranId,
  () => {
    fetchStatistics();
  }
);

watch(
  () => props.tanggalMulai,
  () => {
    fetchStatistics();
  }
);

watch(
  () => props.tanggalAkhir,
  () => {
    fetchStatistics();
  }
);

watch(
  () => props.userId,
  () => {
    fetchStatistics();
  }
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
            <VCol cols="12" sm="6" :md="widgetColSize" class="stat-widget-col px-3 px-lg-4">
              <div
                class="stat-widget d-flex justify-space-between cursor-pointer"
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
                <div class="stat-widget-content d-flex flex-column gap-y-1">
                  <p class="stat-widget-title text-capitalize mb-0">
                    Pemasukan {{ data.title }}
                  </p>

                  <div class="stat-widget-date text-caption text-disabled">
                    {{ getDateInfo(data.title) }}
                  </div>

                  <div class="stat-currency-list" :title="data.value">
                    <div
                      v-for="currency in data.currencies"
                      :key="currency.key"
                      class="stat-currency-row"
                    >
                      <span class="stat-currency-code">{{ currency.kode }}</span>
                      <span class="stat-currency-amount">{{ currency.amount }}</span>
                    </div>
                  </div>

                  <div class="stat-widget-footer d-flex align-center">
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

                <VAvatar class="stat-widget-icon" variant="tonal" rounded="lg" size="44" color="primary">
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
              length="128"
            />
          </template>
        </VRow>
      </VCardText>
    </VCard>



    <VDialog v-model="isModalOpen" :max-width="selectedData?.title === 'Harian' ? 700 : 400">
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

          <!-- Detail Harian Summary -->
          <div v-if="!selectedCategory && (selectedData?.title === 'Harian' && harianDetailData.length > 0)" class="mt-6">
            <h6 class="text-h6 mb-3">Rincian Berdasarkan Jenis Pembayaran</h6>
            <VTable class="text-no-wrap border rounded">
              <thead>
                <tr style="background-color: rgba(var(--v-theme-on-surface), 0.04);">
                  <th class="ps-4 text-uppercase">Tagihan</th>
                  <th class="text-uppercase">Jenis Pembayaran</th>
                  <th class="text-uppercase">Laki-laki</th>
                  <th class="text-uppercase">Perempuan</th>
                  <th class="text-uppercase text-primary">Keseluruhan</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(row, idx) in harianDetailData" 
                  :key="idx" 
                  @click="openDetailProdi(row)"
                  style="cursor: pointer;"
                  class="hover-row"
                >
                  <td class="ps-4">
                    <span class="text-body-1 font-weight-medium">{{ row.tagihan_nama }}</span>
                  </td>
                  <td>
                    <span class="text-body-1">{{ row.jp_nama }}</span>
                  </td>
                  <td>{{ formatRowMoney(row, "laki_laki") }}</td>
                  <td>{{ formatRowMoney(row, "perempuan") }}</td>
                  <td class="text-primary font-weight-bold">{{ formatRowMoney(row, "keseluruhan") }}</td>
                </tr>
                <tr style="background-color: rgba(var(--v-theme-on-surface), 0.04);">
                  <td class="ps-4" colspan="2"><strong>Total</strong></td>
                  <td><strong>{{ formatByCurrency(sumRowsByCurrency(harianDetailData, "laki_laki")) }}</strong></td>
                  <td><strong>{{ formatByCurrency(sumRowsByCurrency(harianDetailData, "perempuan")) }}</strong></td>
                  <td class="text-primary"><strong>{{ formatByCurrency(sumRowsByCurrency(harianDetailData, "keseluruhan")) }}</strong></td>
                </tr>
              </tbody>
            </VTable>
          </div>

          <!-- Detail Keseluruhan Summary -->
          <div v-if="!selectedCategory && (selectedData?.title === 'Keseluruhan' && semuaDetailData.length > 0)" class="mt-6">
            <h6 class="text-h6 mb-3">Rincian Berdasarkan Jenis Pembayaran</h6>
            <VTable class="text-no-wrap border rounded">
              <thead>
                <tr style="background-color: rgba(var(--v-theme-on-surface), 0.04);">
                  <th class="ps-4 text-uppercase">Tagihan</th>
                  <th class="text-uppercase">Jenis Pembayaran</th>
                  <th class="text-uppercase">Laki-laki</th>
                  <th class="text-uppercase">Perempuan</th>
                  <th class="text-uppercase text-primary">Keseluruhan</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(row, idx) in semuaDetailData" 
                  :key="idx" 
                  @click="openDetailProdi(row)"
                  style="cursor: pointer;"
                  class="hover-row"
                >
                  <td class="ps-4">
                    <span class="text-body-1 font-weight-medium">{{ row.tagihan_nama }}</span>
                  </td>
                  <td>
                    <span class="text-body-1">{{ row.jp_nama }}</span>
                  </td>
                  <td>{{ formatRowMoney(row, "laki_laki") }}</td>
                  <td>{{ formatRowMoney(row, "perempuan") }}</td>
                  <td class="text-primary font-weight-bold">{{ formatRowMoney(row, "keseluruhan") }}</td>
                </tr>
                <tr style="background-color: rgba(var(--v-theme-on-surface), 0.04);">
                  <td class="ps-4" colspan="2"><strong>Total</strong></td>
                  <td><strong>{{ formatByCurrency(sumRowsByCurrency(semuaDetailData, "laki_laki")) }}</strong></td>
                  <td><strong>{{ formatByCurrency(sumRowsByCurrency(semuaDetailData, "perempuan")) }}</strong></td>
                  <td class="text-primary"><strong>{{ formatByCurrency(sumRowsByCurrency(semuaDetailData, "keseluruhan")) }}</strong></td>
                </tr>
              </tbody>
            </VTable>
          </div>

          <!-- Detail per Prodi -->
          <div v-if="selectedCategory" class="mt-6">
            <div class="d-flex justify-space-between align-center mb-3">
              <h6 class="text-h6">
                Detail Pemasukan per Prodi: {{ selectedCategory }}
                <span v-if="selectedPaymentMethod" class="text-body-2 text-disabled">
                  - {{ selectedPaymentMethod }}
                </span>
              </h6>
              <VBtn size="small" variant="tonal" color="primary" @click="selectedCategory = null">
                <VIcon icon="ri-arrow-left-line" start /> Kembali
              </VBtn>
            </div>
            
            <div v-if="loadingDetailProdi" class="d-flex justify-center py-4">
              <VProgressCircular indeterminate color="primary" />
            </div>
            <VTable v-else class="text-no-wrap border rounded">
              <thead>
                <tr style="background-color: rgba(var(--v-theme-on-surface), 0.04);">
                  <th class="ps-4 text-uppercase">Prodi</th>
                  <th class="text-uppercase">Laki-laki</th>
                  <th class="text-uppercase">Perempuan</th>
                  <th class="text-uppercase text-primary">Keseluruhan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in detailProdiData" :key="idx">
                  <td class="ps-4">
                    <span class="text-body-1 font-weight-medium">{{ row.prodi_nama }}</span>
                  </td>
                  <td>{{ formatRowMoney(row, "laki_laki") }}</td>
                  <td>{{ formatRowMoney(row, "perempuan") }}</td>
                  <td class="text-primary font-weight-bold">{{ formatRowMoney(row, "keseluruhan") }}</td>
                </tr>
                <tr v-if="detailProdiData.length === 0">
                  <td colspan="4" class="text-center text-disabled py-4">Tidak ada data.</td>
                </tr>
                <tr v-else style="background-color: rgba(var(--v-theme-on-surface), 0.04);">
                  <td class="ps-4"><strong>Total</strong></td>
                  <td><strong>{{ formatByCurrency(sumRowsByCurrency(detailProdiData, "laki_laki")) }}</strong></td>
                  <td><strong>{{ formatByCurrency(sumRowsByCurrency(detailProdiData, "perempuan")) }}</strong></td>
                  <td class="text-primary"><strong>{{ formatByCurrency(sumRowsByCurrency(detailProdiData, "keseluruhan")) }}</strong></td>
                </tr>
              </tbody>
            </VTable>
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

.stat-widget-col {
  min-width: 0;
}

.stat-widget {
  min-width: 0;
  min-height: 144px;
  gap: 12px;
}

.stat-widget-content {
  flex: 1 1 auto;
  min-width: 0;
}

.stat-widget-title {
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  font-size: 1rem;
  line-height: 1.35;
}

.stat-widget-date {
  min-height: 18px;
  font-size: 11px !important;
  line-height: 1.35;
}

.stat-currency-list {
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-block: 6px;
  gap: 4px;
}

.stat-currency-row {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  align-items: baseline;
  min-width: 0;
  gap: 6px;
}

.stat-currency-code {
  color: rgba(var(--v-theme-primary), 0.78);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.stat-currency-amount {
  min-width: 0;
  color: rgb(var(--v-theme-primary));
  font-size: clamp(1rem, 1.2vw, 1.25rem);
  font-weight: 700;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.stat-widget-footer {
  margin-block-start: auto;
  padding-block-start: 4px;
}

.stat-widget-icon {
  flex: 0 0 auto;
  margin-block-start: 4px;
}

.hover-row {
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(var(--v-theme-primary), 0.08);
  }
}

@media (max-width: 1279px) {
  .stat-widget {
    min-height: 136px;
  }

  .stat-currency-amount {
    font-size: 1rem;
  }
}

@media (max-width: 959px) {
  .stat-widget {
    min-height: 132px;
  }

  .stat-currency-amount {
    font-size: 1.1rem;
  }
}
</style>
