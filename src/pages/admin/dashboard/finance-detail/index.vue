<script setup>
import { showSnackbar } from "@/composables/snackbar";
import { computed, onMounted, ref, watch } from "vue";

const route = useRoute();
const router = useRouter();

// Params dari query string
const category = computed(() => route.query.category || "SPP");

// ===== FILTER =====
const thAkademikList = ref([]);
const prodiList = ref([]);

const selectedThAkademik = ref(route.query.th_akademik_id ? Number(route.query.th_akademik_id) : null);
const selectedProdi = ref(route.query.prodi_id ? Number(route.query.prodi_id) : null);
const selectedJk = ref(route.query.jk_id ? Number(route.query.jk_id) : null);

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
  fetchDetail();
});

// Tabs
const tabs = [
  { value: "detail", label: "Per Tagihan" },
  { value: "semester", label: "Per Semester" },
  { value: "prodi", label: "Per Prodi" },
  { value: "bulan", label: "Per Bulan" },
  { value: "tahun", label: "Per Tahun" },
];
const activeTab = ref("detail");

// Data
const isLoading = ref(false);
const detailData = ref([]);
const totalAmount = ref(0);

const toIDR = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const fetchDetail = async () => {
  isLoading.value = true;

  const params = {
    category: category.value,
    group_by: activeTab.value,
  };
  if (selectedThAkademik.value) params.th_akademik_id = selectedThAkademik.value;
  if (selectedProdi.value) params.prodi_id = selectedProdi.value;
  if (selectedJk.value) params.jk_id = selectedJk.value;

  const queryString = new URLSearchParams(params).toString();
  const url = `/admin/dashboard/finance-overview-detail?${queryString}`;

  try {
    const response = await $api(url);
    isLoading.value = false;

    if (!response.status) {
      showSnackbar({ text: response.message, color: "error" });
      return;
    }

    detailData.value = response.data || [];
    totalAmount.value = response.total || 0;
  } catch (err) {
    isLoading.value = false;
    showSnackbar({ text: "Gagal memuat data", color: "error" });
  }
};

watch(activeTab, () => fetchDetail());

onMounted(() => {
  document.title = `Detail ${category.value} - SIMKEU`;
  fetchThAkademik();
  fetchProdi();
  fetchDetail();
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <template #prepend>
            <VBtn
              icon
              variant="text"
              size="small"
              @click="router.push('/admin/dashboard')"
            >
              <VIcon icon="ri-arrow-left-line" />
            </VBtn>
          </template>

          <VCardTitle class="text-h5">
            Detail Pemasukan: {{ category }}
          </VCardTitle>
          <VCardSubtitle>
            Total: {{ toIDR(totalAmount) }}
          </VCardSubtitle>
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

          <!-- Tabs -->
          <VTabs v-model="activeTab" class="mb-6">
            <VTab
              v-for="tab in tabs"
              :key="tab.value"
              :value="tab.value"
            >
              {{ tab.label }}
            </VTab>
          </VTabs>

          <!-- Loading -->
          <VSkeletonLoader
            v-if="isLoading"
            type="table-heading, table-tbody"
          />

          <!-- Data Table -->
          <VTable v-else class="text-no-wrap">
            <thead>
              <tr>
                <th>No</th>
                <th>{{ activeTab === 'detail' ? 'Nama Tagihan' : activeTab === 'semester' ? 'Semester' : activeTab === 'prodi' ? 'Prodi' : activeTab === 'bulan' ? 'Bulan' : 'Tahun' }}</th>
                <th>Jumlah</th>
                <th>Persentase</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="detailData.length === 0">
                <td colspan="4" class="text-center text-disabled py-8">
                  Tidak ada data
                </td>
              </tr>
              <tr v-for="(row, idx) in detailData" :key="idx">
                <td>{{ idx + 1 }}</td>
                <td>
                  <span class="font-weight-medium">{{ row.label }}</span>
                </td>
                <td>
                  <span class="font-weight-medium">{{ toIDR(row.amount) }}</span>
                </td>
                <td>
                  <div class="d-flex align-center gap-2">
                    <VProgressLinear
                      :model-value="row.percent"
                      :color="row.percent > 50 ? 'primary' : row.percent > 20 ? 'info' : 'warning'"
                      height="6"
                      rounded
                      style="max-inline-size: 80px;"
                    />
                    <span class="text-body-2">{{ row.percent }}%</span>
                  </div>
                </td>
              </tr>

              <!-- Total -->
              <tr v-if="detailData.length > 0">
                <td></td>
                <td><strong>Total</strong></td>
                <td><strong>{{ toIDR(totalAmount) }}</strong></td>
                <td><strong>100%</strong></td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
