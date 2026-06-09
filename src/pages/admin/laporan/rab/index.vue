<script setup>
import { formatRupiah } from "@/composables/formatRupiah";
import { showSnackbar } from "@/composables/snackbar";

const router = useRouter();
const route = useRoute();
const currentDate = new Date();
const page = ref(1);
const itemsPerPage = ref(10);
const sortBy = ref([{ key: "bulan_tahun", order: "desc" }]);
const search = ref("");
const selectedBulan = ref(currentDate.getMonth() + 1);
const selectedTahun = ref(currentDate.getFullYear());
const selectedModule = ref(null);
const dataTable = ref([]);
const totalItems = ref(0);
const stats = ref({});
const years = ref([currentDate.getFullYear()]);
const modules = ref([]);
const loading = ref(false);
const initialLoading = ref(true);
let searchTimer = null;

const bulanItems = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
].map((title, index) => ({ title, value: index + 1 }));
const formatMonthYear = (value) => {
  const match = String(value || "").match(/^(\d{4})-(\d{2})/);

  if (!match) return "Belum diatur";

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(Number(match[1]), Number(match[2]) - 1, 1));
};
const yearItems = computed(() => [...new Set([
  currentDate.getFullYear(),
  ...years.value,
])].sort((a, b) => b - a));

const statCards = computed(() => [
  {
    key: "total_anggaran",
    title: "Total RAB",
    value: formatRupiah(stats.value.total_anggaran || 0),
    note: "Akumulasi seluruh rekap",
    icon: "ri-wallet-3-line",
    color: "primary",
  },
  {
    key: "total_rekap",
    title: "Jumlah Rekap",
    value: Number(stats.value.total_rekap || 0).toLocaleString("id-ID"),
    note: "Rekap sesuai filter",
    icon: "ri-file-list-3-line",
    color: "info",
  },
  {
    key: "total_data",
    title: "Jumlah Data",
    value: Number(stats.value.total_data || 0).toLocaleString("id-ID"),
    note: "Detail pengeluaran",
    icon: "ri-database-2-line",
    color: "warning",
  },
  {
    key: "total_modul",
    title: "Modul Terlibat",
    value: Number(stats.value.total_modul || 0).toLocaleString("id-ID"),
    note: "Jenis Barokah",
    icon: "ri-layout-grid-line",
    color: "success",
  },
]);

const moduleColor = key => ({
  tatap_muka: "primary",
  kegiatan: "warning",
  dosen_bulanan: "info",
  staff_bulanan: "success",
}[key] || "secondary");

const errorMessage = (err) => {
  const message =
    err?.data?.message
    || err?.response?._data?.message
    || err?.response?.data?.message
    || err?.message;

  if (typeof message === "object") {
    return Object.values(message).flat().join("; ");
  }

  return message || "Terjadi kesalahan.";
};

const fetchData = async () => {
  try {
    loading.value = true;
    const activeSort = sortBy.value?.[0] || { key: "bulan_tahun", order: "desc" };
    const response = await $api("/admin/laporan/rab", {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: activeSort.key,
        sort_order: activeSort.order,
        search: search.value,
        ...(selectedBulan.value && { bulan: selectedBulan.value }),
        ...(selectedTahun.value && { tahun: selectedTahun.value }),
        ...(selectedModule.value && { module_key: selectedModule.value }),
      },
    });

    dataTable.value = response.data?.data || [];
    totalItems.value = Number(response.data?.total || 0);
    stats.value = response.stats || {};
    years.value = response.filters?.years || years.value;
    modules.value = response.filters?.modules || modules.value;
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    });
  } finally {
    loading.value = false;
    initialLoading.value = false;
  }
};

const loadItems = ({ page: nextPage, itemsPerPage: nextLimit, sortBy: nextSort }) => {
  page.value = nextPage;
  itemsPerPage.value = nextLimit;
  sortBy.value = nextSort.length ? nextSort : [{ key: "bulan_tahun", order: "desc" }];
  fetchData();
};

const resetFilters = () => {
  search.value = "";
  selectedBulan.value = null;
  selectedTahun.value = null;
  selectedModule.value = null;
  page.value = 1;
  fetchData();
};

const openDetail = item => router.push({
  path: `${item.detail_path}${item.id}`,
  query: {
    return_to: route.fullPath,
  },
});

watch([selectedBulan, selectedTahun, selectedModule], () => {
  page.value = 1;
  fetchData();
});

watch(search, () => {
  clearTimeout(searchTimer);
  page.value = 1;
  searchTimer = setTimeout(fetchData, 350);
});

onMounted(() => {
  document.title = "RAB - SIMKEU";
});

onBeforeUnmount(() => clearTimeout(searchTimer));
</script>

<template>
  <div>
    <div class="rab-header mb-5">
      <div>
        <h1 class="text-h4 font-weight-semibold">RAB</h1>
        <p class="text-body-1 text-medium-emphasis mb-0">
          Rekap anggaran seluruh pengeluaran Barokah
        </p>
      </div>
    </div>

    <div class="rab-stat-grid mb-5">
      <VCard v-for="item in statCards" :key="item.key">
        <VCardText class="d-flex align-center gap-4">
          <VAvatar :color="item.color" variant="tonal" rounded size="48">
            <VIcon :icon="item.icon" size="24" />
          </VAvatar>

          <div class="min-w-0">
            <div class="text-body-2 text-medium-emphasis">{{ item.title }}</div>
            <VSkeletonLoader v-if="initialLoading" type="text" width="120" />
            <div v-else class="text-h5 font-weight-semibold rab-stat-value">
              {{ item.value }}
            </div>
            <div class="text-caption text-disabled">{{ item.note }}</div>
          </div>
        </VCardText>
      </VCard>
    </div>

    <VCard class="mb-5">
      <VCardText>
        <VRow align="center">
          <VCol cols="12" md="4">
            <VTextField
              v-model="search"
              label="Cari Rekap"
              placeholder="Nama, keterangan, atau modul"
              prepend-inner-icon="ri-search-line"
              clearable
              hide-details
            />
          </VCol>

          <VCol cols="12" sm="6" md="2">
            <VSelect
              v-model="selectedBulan"
              label="Bulan"
              :items="bulanItems"
              clearable
              hide-details
            />
          </VCol>

          <VCol cols="12" sm="6" md="2">
            <VSelect
              v-model="selectedTahun"
              label="Tahun"
              :items="yearItems"
              clearable
              hide-details
            />
          </VCol>

          <VCol cols="12" md="2">
            <VSelect
              v-model="selectedModule"
              label="Jenis Rekap"
              :items="modules"
              clearable
              hide-details
            />
          </VCol>

          <VCol cols="12" md="2">
            <VBtn
              class="w-100"
              height="56"
              variant="outlined"
              color="secondary"
              prepend-icon="ri-refresh-line"
              @click="resetFilters"
            >
              Reset
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VCard>
      <VCardItem>
        <VCardTitle>Daftar Rekap Anggaran</VCardTitle>
        <VCardSubtitle>{{ totalItems }} rekap ditemukan</VCardSubtitle>
      </VCardItem>

      <VDivider />

      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        v-model:sort-by="sortBy"
        :headers="[
          { title: 'No', key: 'nomor', sortable: false },
          { title: 'Periode', key: 'bulan_tahun' },
          { title: 'Nama Rekap', key: 'nama' },
          { title: 'Jenis', key: 'module_name' },
          { title: 'Jumlah Data', key: 'jumlah_data', align: 'end' },
          { title: 'Total', key: 'total_pengeluaran', align: 'end' },
          { title: 'Keterangan', key: 'keterangan', sortable: false },
          { title: '', key: 'actions', sortable: false, align: 'end' },
        ]"
        :items="dataTable"
        :items-length="totalItems"
        :loading="loading"
        item-value="row_key"
        @update:options="loadItems"
      >
        <template #loading>
          <div class="text-center pa-6">
            <VProgressCircular indeterminate color="primary" />
          </div>
        </template>

        <template #no-data>
          <div class="text-center pa-8">
            <VIcon icon="ri-file-search-line" size="36" class="mb-2" />
            <div>Tidak ada rekap sesuai filter.</div>
          </div>
        </template>

        <template #item.nomor="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </template>

        <template #item.bulan_tahun="{ item }">
          <div class="font-weight-medium">
            {{ formatMonthYear(item.bulan_tahun) }}
          </div>
        </template>

        <template #item.nama="{ item }">
          <button type="button" class="rab-name" @click="openDetail(item)">
            {{ item.nama }}
          </button>
        </template>

        <template #item.module_name="{ item }">
          <VChip :color="moduleColor(item.module_key)" size="small" label>
            {{ item.module_name }}
          </VChip>
        </template>

        <template #item.jumlah_data="{ item }">
          {{ Number(item.jumlah_data || 0).toLocaleString("id-ID") }}
        </template>

        <template #item.total_pengeluaran="{ item }">
          <strong>{{ formatRupiah(item.total_pengeluaran) }}</strong>
        </template>

        <template #item.keterangan="{ item }">
          <span class="text-medium-emphasis">{{ item.keterangan || "-" }}</span>
        </template>

        <template #item.actions="{ item }">
          <VTooltip text="Lihat detail rekap" location="top">
            <template #activator="{ props: tooltipProps }">
              <VBtn
                v-bind="tooltipProps"
                icon="ri-arrow-right-line"
                variant="text"
                color="primary"
                size="small"
                @click="openDetail(item)"
              />
            </template>
          </VTooltip>
        </template>
      </VDataTableServer>
    </VCard>
  </div>
</template>

<style scoped>
.rab-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rab-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.rab-stat-value {
  overflow-wrap: anywhere;
}

.rab-name {
  color: rgb(var(--v-theme-primary));
  font: inherit;
  font-weight: 600;
  text-align: start;
}

.rab-name:hover {
  text-decoration: underline;
}

@media (max-width: 1199px) {
  .rab-stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 599px) {
  .rab-stat-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
