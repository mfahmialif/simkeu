<script setup>
import { showSnackbar } from "@/composables/snackbar";
import { computed, onMounted, ref, watch } from "vue";

// Palette warna dan ikon untuk kategori dinamis
const colorPalette = [
  { bg: "rgb(var(--v-theme-primary))", text: "rgb(var(--v-theme-on-primary))" },
  { bg: "rgb(var(--v-theme-info))", text: "rgb(var(--v-theme-on-primary))" },
  { bg: "rgba(var(--v-theme-on-surface), var(--v-hover-opacity))", text: "rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))" },
];

const iconPalette = [
  "ri-wallet-3-line",
  "ri-cash-line",
  "ri-hand-coin-line",
  "ri-bank-card-line",
  "ri-money-dollar-circle-line",
  "ri-coins-line",
  "ri-exchange-funds-line",
  "ri-gift-line",
  "ri-file-list-3-line",
];

const rawFinanceData = ref([]);

// ===== FILTER =====
const thAkademikList = ref([]);
const prodiList = ref([]);

const selectedThAkademik = ref(null);
const selectedProdi = ref(null);
const selectedJk = ref(null);

const fetchThAkademik = async () => {
  try {
    const { data } = await $api("/admin/th-akademik", {
      method: "GET",
      body: { limit: 0, sort_key: "kode", sort_order: "desc" },
    });
    thAkademikList.value = (data.data || []).map((i) => ({
      title: `${i.nama} - ${i.semester}`,
      value: i.id,
    }));
  } catch (e) {
    console.error(e);
  }
};

const fetchProdi = async () => {
  try {
    const { data } = await $api("/admin/prodi", {
      method: "GET",
      body: { limit: 0, sort_key: "kode", sort_order: "desc" },
    });
    prodiList.value = (data.data || []).map((i) => ({
      title: i.nama,
      value: i.id,
    }));
  } catch (e) {
    console.error(e);
  }
};

const jkList = [
  { title: "Laki-laki", value: 8 },
  { title: "Perempuan", value: 9 },
];

// Watch filter changes -> refetch
watch([selectedThAkademik, selectedProdi, selectedJk], () => {
  fetchData();
});

// ===== DATA =====
const totalAmount = computed(() =>
  rawFinanceData.value.reduce((s, i) => s + i.amount, 0)
);

const allFinanceData = computed(() => {
  const total = totalAmount.value || 1;
  return rawFinanceData.value.map((i, index) => ({
    ...i,
    icon: iconPalette[index % iconPalette.length],
    color: colorPalette[Math.min(index, colorPalette.length - 1)],
    percentage: +((i.amount / total) * 100).toFixed(1),
  }));
});

// Data untuk card: top 2 + Lainnya
const financeData = computed(() => {
  const total = totalAmount.value || 1;
  const all = allFinanceData.value;

  if (all.length <= 3) return all;

  const top2 = all.slice(0, 2);

  const lainnyaAmount = all.slice(2).reduce((s, i) => s + i.amount, 0);
  const lainnya = {
    icon: "ri-more-line",
    name: "Lainnya",
    amount: lainnyaAmount,
    color: colorPalette[2],
    percentage: +((lainnyaAmount / total) * 100).toFixed(1),
    isLainnya: true,
  };

  return [...top2, lainnya];
});

const lainnyaDetails = computed(() => allFinanceData.value.slice(2));

// Format Rupiah
const toIDR = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const moreList = [{ title: "Lihat Data", value: "lihat-data" }];

// Modal state
const showLainnyaModal = ref(false);

// Router untuk navigasi ke detail
const router = useRouter();

const goToDetail = (category) => {
  const query = { category };
  if (selectedThAkademik.value) query.th_akademik_id = selectedThAkademik.value;
  if (selectedProdi.value) query.prodi_id = selectedProdi.value;
  if (selectedJk.value) query.jk_id = selectedJk.value;
  router.push({ path: '/admin/dashboard/finance-detail', query });
};

const handleRowClick = (row) => {
  if (row.isLainnya) {
    showLainnyaModal.value = true;
  } else {
    goToDetail(row.name);
  }
};

const isLoading = ref(false);
const fetchData = async () => {
  isLoading.value = true;

  // Build query params
  const params = {};
  if (selectedThAkademik.value) params.th_akademik_id = selectedThAkademik.value;
  if (selectedProdi.value) params.prodi_id = selectedProdi.value;
  if (selectedJk.value) params.jk_id = selectedJk.value;

  const queryString = new URLSearchParams(params).toString();
  const url = `/admin/dashboard/finance-overview${queryString ? '?' + queryString : ''}`;

  const response = await $api(url);
  isLoading.value = false;
  if (!response.status) {
    showSnackbar({
      text: response.message,
      color: "error",
    });
    return;
  }

  rawFinanceData.value = (response.data || []).map((item) => ({
    name: item.name,
    amount: item.amount,
  }));
};

onMounted(() => {
  fetchThAkademik();
  fetchProdi();
  fetchData();
});
</script>

<template>
  <VCard>
    <VSkeletonLoader v-if=isLoading
      type="card, list-item, paragraph, paragraph"
    ></VSkeletonLoader>
    <template v-else>
      <VCardItem
        :title="`Distribusi Pemasukan Keuangan UII Dalwa`"
        :subtitle="`Total: ${toIDR(totalAmount)}`"
      >
        <template #append>
          <MoreBtn :menu-list="moreList" />
        </template>
      </VCardItem>

      <VCardText>
        <!-- Filter -->
        <VRow class="mb-4">
          <VCol cols="12" sm="4">
            <VSelect
              v-model="selectedThAkademik"
              :items="thAkademikList"
              label="Tahun Akademik"
              placeholder="Semua"
              clearable
              density="compact"
              hide-details
            />
          </VCol>
          <VCol cols="12" sm="4">
            <VSelect
              v-model="selectedProdi"
              :items="prodiList"
              label="Prodi"
              placeholder="Semua"
              clearable
              density="compact"
              hide-details
            />
          </VCol>
          <VCol cols="12" sm="4">
            <VSelect
              v-model="selectedJk"
              :items="jkList"
              label="Jenis Kelamin"
              placeholder="Semua"
              clearable
              density="compact"
              hide-details
            />
          </VCol>
        </VRow>

        <!-- Progress gabungan per kategori -->
        <div class="finance-progress-wrapper mb-6">
          <!-- Labels di atas bar -->
          <div class="d-flex mb-2">
            <div
              v-for="item in financeData"
              :key="'label-' + item.name"
              :style="`flex: ${Math.max(item.percentage, 8)} 0 0%;`"
              class="d-none d-sm-block"
            >
              <span
                v-if="item.percentage >= 15"
                class="text-body-2 text-medium-emphasis"
              >
                {{ item.name }}
              </span>
            </div>
          </div>

          <!-- Bar gabungan -->
          <div class="finance-progress-bar d-flex rounded-lg overflow-hidden" style="block-size: 46px;">
            <div
              v-for="(item, index) in financeData"
              :key="'bar-' + item.name"
              class="finance-progress-segment d-flex align-center"
              :style="{
                backgroundColor: item.color.bg,
                flex: `${Math.max(item.percentage, 8)} 0 0%`,
                paddingInlineStart: '12px',
              }"
            >
              <span
                v-if="item.percentage >= 10"
                class="text-sm font-weight-medium"
                :style="`color: ${item.color.text}; white-space: nowrap;`"
              >
                {{ item.percentage }}%
              </span>
            </div>
          </div>

          <!-- Legend di bawah bar pada mobile -->
          <div class="d-flex d-sm-none flex-wrap gap-3 mt-3">
            <div
              v-for="item in financeData"
              :key="'legend-' + item.name"
              class="d-flex align-center gap-2"
            >
              <div
                class="rounded-circle"
                :style="`background-color: ${item.color.bg}; block-size: 10px; inline-size: 10px;`"
              />
              <span class="text-caption text-medium-emphasis">
                {{ item.name }} ({{ item.percentage }}%)
              </span>
            </div>
          </div>
        </div>

        <!-- Tabel rincian -->
        <VTable class="text-no-wrap">
          <tbody>
            <tr
              v-for="(row, idx) in financeData"
              :key="idx"
              style="cursor: pointer"
              @click="handleRowClick(row)"
            >
              <td width="50%" class="ps-0" style="block-size: 48px">
                <div class="d-flex align-center text-high-emphasis">
                  <VIcon :icon="row.icon" size="24" class="me-2" />
                  <h6 class="text-h6 font-weight-regular">
                    {{ row.name }}
                    <VIcon
                      icon="ri-arrow-right-s-line"
                      size="18"
                      class="ms-1"
                    />
                  </h6>
                </div>
              </td>
              <td width="30%">
                <h6 class="text-h6">{{ toIDR(row.amount) }}</h6>
              </td>
              <td width="20%">
                <span class="text-body-1">{{ row.percentage }}%</span>
              </td>
            </tr>

            <!-- Baris total -->
            <tr>
              <td class="ps-0">
                <strong>Total</strong>
              </td>
              <td>
                <strong>{{ toIDR(totalAmount) }}</strong>
              </td>
              <td>
                <strong>100%</strong>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>
    </template>
  </VCard>

  <!-- Modal detail Lainnya -->
  <VDialog v-model="showLainnyaModal" max-width="600">
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between pa-4">
        <span>Detail Pemasukan Lainnya</span>
        <VBtn icon variant="text" size="small" @click="showLainnyaModal = false">
          <VIcon icon="ri-close-line" />
        </VBtn>
      </VCardTitle>
      <VDivider />
      <VCardText>
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th class="ps-0">Jenis Tagihan</th>
              <th>Jumlah</th>
              <th>Persentase</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, idx) in lainnyaDetails"
              :key="idx"
              style="cursor: pointer"
              @click="showLainnyaModal = false; goToDetail(row.name)"
            >
              <td class="ps-0" style="block-size: 48px">
                <div class="d-flex align-center text-high-emphasis">
                  <VIcon :icon="row.icon" size="24" class="me-2" />
                  <span class="text-body-1 font-weight-medium">
                    {{ row.name }}
                    <VIcon icon="ri-arrow-right-s-line" size="16" class="ms-1" />
                  </span>
                </div>
              </td>
              <td>
                <span class="text-body-1 font-weight-medium">{{ toIDR(row.amount) }}</span>
              </td>
              <td>
                <span class="text-body-1">{{ row.percentage }}%</span>
              </td>
            </tr>

            <!-- Total Lainnya -->
            <tr>
              <td class="ps-0">
                <strong>Total Lainnya</strong>
              </td>
              <td>
                <strong>{{ toIDR(lainnyaDetails.reduce((s, i) => s + i.amount, 0)) }}</strong>
              </td>
              <td>
                <strong>{{ lainnyaDetails.reduce((s, i) => s + i.percentage, 0).toFixed(1) }}%</strong>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.finance-progress-segment {
  transition: opacity 0.2s ease;

  &:not(:last-child) {
    border-inline-end: 2px solid rgba(var(--v-theme-surface), 0.8);
  }
}
</style>
