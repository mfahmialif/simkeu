<script setup>
import { showSnackbar } from "@/composables/snackbar";
import { ref, watch, onMounted, computed } from "vue";

// ===== FILTER =====
const thAkademikList = ref([]);
const prodiList = ref([]);

const selectedThAkademik = ref(null);
const selectedProdi = ref(null);
const selectedJk = ref(null);

const jkList = [
  { title: "Laki-laki", value: 8 },
  { title: "Perempuan", value: 9 },
];

const fetchThAkademik = async () => {
  try {
    const { data } = await $api("/admin/th-akademik", {
      method: "GET",
      body: { limit: 0, sort_key: "kode", sort_order: "desc" },
    });
    thAkademikList.value = (data.data || []).map((i) => ({
      title: `${i.nama} - ${i.semester}`,
      value: i.id,
      aktif: i.aktif,
    }));

    // Set default ke th akademik yang aktif
    const aktif = thAkademikList.value.find((i) => i.aktif === "Y");
    if (aktif) {
      selectedThAkademik.value = aktif.value;
    }
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

// ===== SUMMARY DATA =====
const isLoading = ref(false);
const summaryData = ref({
  total_mahasiswa_bayar: 0,
  total_amount: 0,
  total_lunas: 0,
  total_belum_lunas: 0,
});

const toIDR = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const fetchSummary = async () => {
  isLoading.value = true;
  try {
    const params = {};
    if (selectedThAkademik.value) params.th_akademik_id = selectedThAkademik.value;
    if (selectedProdi.value) params.prodi_id = selectedProdi.value;
    if (selectedJk.value) params.jk_id = selectedJk.value;

    const queryString = new URLSearchParams(params).toString();
    const url = `/admin/dashboard/krs-report${queryString ? "?" + queryString : ""}`;

    const response = await $api(url);
    if (!response.status) {
      showSnackbar({ text: response.message, color: "error" });
      return;
    }
    summaryData.value = response.data;
  } catch (e) {
    console.error(e);
    showSnackbar({ text: "Gagal memuat laporan KRS", color: "error" });
  } finally {
    isLoading.value = false;
  }
};

// ===== DETAIL DIALOG =====
const showDetailDialog = ref(false);
const isLoadingDetail = ref(false);
const detailData = ref([]);
const detailPagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 15,
});
const searchQuery = ref("");
const currentPage = ref(1);

const fetchDetail = async () => {
  isLoadingDetail.value = true;
  try {
    const params = {
      page: currentPage.value,
      per_page: 15,
    };
    if (selectedThAkademik.value) params.th_akademik_id = selectedThAkademik.value;
    if (selectedProdi.value) params.prodi_id = selectedProdi.value;
    if (selectedJk.value) params.jk_id = selectedJk.value;
    if (searchQuery.value) params.search = searchQuery.value;

    const queryString = new URLSearchParams(params).toString();
    const url = `/admin/dashboard/krs-report-detail?${queryString}`;

    const response = await $api(url);
    if (!response.status) {
      showSnackbar({ text: response.message, color: "error" });
      return;
    }
    detailData.value = response.data.data || [];
    detailPagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      total: response.data.total,
      per_page: response.data.per_page,
    };
  } catch (e) {
    console.error(e);
    showSnackbar({ text: "Gagal memuat detail", color: "error" });
  } finally {
    isLoadingDetail.value = false;
  }
};

const openDetail = () => {
  showDetailDialog.value = true;
  currentPage.value = 1;
  searchQuery.value = "";
  fetchDetail();
};

// Watch search with debounce
let searchTimeout = null;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    fetchDetail();
  }, 400);
});

watch(currentPage, () => {
  fetchDetail();
});

// Watch filters -> refetch summary
const filtersInitialized = ref(false);
watch([selectedThAkademik, selectedProdi, selectedJk], () => {
  if (filtersInitialized.value) {
    fetchSummary();
  }
});

// Summary stats cards
const statCards = computed(() => [
  {
    title: "Sudah Bayar",
    value: summaryData.value.total_mahasiswa_bayar,
    icon: "ri-user-follow-line",
    color: "primary",
    subtitle: "Mahasiswa",
  },
  {
    title: "Total Pembayaran",
    value: toIDR(summaryData.value.total_amount),
    icon: "ri-money-dollar-circle-line",
    color: "success",
    subtitle: "Rupiah",
  },
  {
    title: "Lunas",
    value: summaryData.value.total_lunas,
    icon: "ri-checkbox-circle-line",
    color: "info",
    subtitle: "Mahasiswa",
  },
  {
    title: "Belum Lunas",
    value: summaryData.value.total_belum_lunas,
    icon: "ri-time-line",
    color: "warning",
    subtitle: "Mahasiswa",
  },
]);

onMounted(async () => {
  await Promise.all([fetchThAkademik(), fetchProdi()]);
  filtersInitialized.value = true;
  fetchSummary();
});
</script>

<template>
  <VCard>
    <VSkeletonLoader
      v-if="isLoading && !filtersInitialized"
      type="card, list-item, paragraph, paragraph"
    />
    <template v-else>
      <VCardItem>
        <template #prepend>
          <VAvatar color="primary" variant="tonal" rounded="lg" class="me-2">
            <VIcon icon="ri-file-list-3-line" size="24" />
          </VAvatar>
        </template>
        <VCardTitle>Laporan KRS</VCardTitle>
        <VCardSubtitle>
          Rekapitulasi pembayaran registrasi / daftar ulang mahasiswa
        </VCardSubtitle>
        <template #append>
          <VBtn
            variant="tonal"
            color="primary"
            size="small"
            prepend-icon="ri-eye-line"
            @click="openDetail"
          >
            Lihat Detail
          </VBtn>
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

        <!-- Stats Cards -->
        <VRow>
          <VCol
            v-for="(card, index) in statCards"
            :key="index"
            cols="6"
            md="3"
          >
            <VCard
              variant="tonal"
              :color="card.color"
              class="krs-stat-card"
            >
              <VCardText class="pa-4">
                <VSkeletonLoader v-if="isLoading" type="text, text" />
                <template v-else>
                  <div class="d-flex align-center gap-3 mb-2">
                    <VAvatar
                      :color="card.color"
                      variant="flat"
                      size="40"
                      rounded="lg"
                    >
                      <VIcon :icon="card.icon" size="22" color="white" />
                    </VAvatar>
                    <div>
                      <h4 class="text-h5 font-weight-bold">
                        {{ card.value }}
                      </h4>
                    </div>
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    {{ card.title }}
                  </div>
                  <div class="text-caption text-disabled">
                    {{ card.subtitle }}
                  </div>
                </template>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>

        <!-- Lunas Progress -->
        <div v-if="!isLoading && summaryData.total_mahasiswa_bayar > 0" class="mt-4">
          <div class="d-flex justify-space-between mb-1">
            <span class="text-body-2 text-medium-emphasis">
              Progress Pelunasan
            </span>
            <span class="text-body-2 font-weight-medium">
              {{ summaryData.total_lunas }} / {{ summaryData.total_mahasiswa_bayar }}
              ({{ Math.round((summaryData.total_lunas / summaryData.total_mahasiswa_bayar) * 100) }}%)
            </span>
          </div>
          <VProgressLinear
            :model-value="(summaryData.total_lunas / summaryData.total_mahasiswa_bayar) * 100"
            color="success"
            height="10"
            rounded
          />
        </div>
      </VCardText>
    </template>
  </VCard>

  <!-- Detail Dialog -->
  <VDialog
    v-model="showDetailDialog"
    max-width="960"
    scrollable
  >
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between pa-4 pb-2">
        <div class="d-flex align-center gap-2">
          <VIcon icon="ri-file-list-3-line" size="22" color="primary" />
          <span>Detail Pembayaran KRS</span>
        </div>
        <VBtn
          icon
          variant="text"
          size="small"
          @click="showDetailDialog = false"
        >
          <VIcon icon="ri-close-line" />
        </VBtn>
      </VCardTitle>

      <VDivider />

      <VCardText class="pa-4">
        <!-- Search -->
        <VTextField
          v-model="searchQuery"
          label="Cari NIM / Nama"
          placeholder="Ketik NIM atau Nama..."
          prepend-inner-icon="ri-search-line"
          density="compact"
          hide-details
          clearable
          class="mb-4"
        />

        <!-- Loading -->
        <VSkeletonLoader
          v-if="isLoadingDetail"
          type="table-heading, table-tbody"
        />

        <!-- Data Table -->
        <div v-else>
          <VTable class="text-no-wrap" density="compact">
            <thead>
              <tr>
                <th>No</th>
                <th>NIM</th>
                <th>Nama</th>
                <th>Prodi</th>
                <th>Tagihan</th>
                <th>Dibayar</th>
                <th>Sisa</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="detailData.length === 0">
                <td colspan="8" class="text-center text-disabled py-8">
                  Tidak ada data
                </td>
              </tr>
              <tr v-for="(row, idx) in detailData" :key="idx">
                <td>{{ (detailPagination.current_page - 1) * detailPagination.per_page + idx + 1 }}</td>
                <td>
                  <span class="font-weight-medium">{{ row.nim }}</span>
                </td>
                <td>{{ row.nama || '-' }}</td>
                <td>
                  <span class="text-caption">{{ row.prodi_nama }}</span>
                </td>
                <td>{{ toIDR(row.tagihan_amount) }}</td>
                <td>
                  <span class="font-weight-medium text-success">
                    {{ toIDR(row.total_paid) }}
                  </span>
                </td>
                <td>
                  <span :class="row.sisa > 0 ? 'text-error' : 'text-success'">
                    {{ toIDR(row.sisa) }}
                  </span>
                </td>
                <td>
                  <VChip
                    :color="row.is_lunas ? 'success' : 'warning'"
                    size="small"
                    variant="flat"
                    label
                  >
                    {{ row.is_lunas ? 'Lunas' : 'Belum Lunas' }}
                  </VChip>
                </td>
              </tr>
            </tbody>
          </VTable>

          <!-- Pagination -->
          <div
            v-if="detailPagination.last_page > 1"
            class="d-flex align-center justify-space-between mt-4"
          >
            <span class="text-body-2 text-disabled">
              Menampilkan {{ detailData.length }} dari {{ detailPagination.total }} data
            </span>
            <VPagination
              v-model="currentPage"
              :length="detailPagination.last_page"
              :total-visible="5"
              density="compact"
              size="small"
            />
          </div>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.krs-stat-card {
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}
</style>
