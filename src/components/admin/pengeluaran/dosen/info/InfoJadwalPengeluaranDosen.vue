<script setup>
const props = defineProps({
  refDataDosen: {
    type: Object,
    default: () => ({}),
  },
});

const page = ref(1);
const itemsPerPage = ref(25);
const sortBy = ref({ key: "id", order: "desc" });
const search = ref("");
const selectedRows = ref([]);
const dataTable = ref([]);
const totalItems = ref(0);
const loading = ref(true);
const initialLoading = ref(true);

const fetchData = async () => {
  if (props.refDataDosen.dosen.kode == '') {
    return;
  }

  try {
    loading.value = true;
    const { data } = await $api("/admin/jadwal/dosenTable", {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        search: search.value,
        dosen_kode: props.refDataDosen.dosen.kode,
        th_akademik_kode: selectedThAkademik.value,
      },
    });

    dataTable.value = data.data;
    totalItems.value = data.total;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
    if (initialLoading.value) initialLoading.value = false;
  }
};

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb, search: s }) => {
  if (selectedThAkademik.value == null) {
    loading.value = false;
    return;
  }
  page.value = p;
  itemsPerPage.value = ipp;
  if (sb.length) sortBy.value = sb[0];
  fetchData();
};

const selectedThAkademik = ref(null);
const thAkademik = ref([]);
const isLoadingThAkademik = ref(false);

const fetchThAkademik = async () => {
  try {
    isLoadingThAkademik.value = true;
    const { data } = await $api("/admin/th-akademik", {
      method: "GET",
    });

    thAkademik.value = data.data.map((thAkademik) => {
      return {
        title: `${thAkademik.nama} - ${thAkademik.semester}`,
        value: thAkademik.kode,
      };
    });

    selectedThAkademik.value = thAkademik.value[0].value;
  } catch (err) {
    console.error(err);
  } finally {
    isLoadingThAkademik.value = false;
  }
};

watch(selectedThAkademik, (newVal) => {
  if (newVal) {
    fetchData();
  }
});

onMounted(() => {
  fetchThAkademik();
});

defineExpose({
  fetchData,
});
</script>

<template>
  <div>
    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Jadwal SIAKAD</VCardTitle>
      </VCardItem>

      <VDivider />

      <VCardText class="d-flex flex-wrap gap-4 w-100">
        <div class="d-flex align-center w-100 flex-column gap-3">
          <!-- 👉 Select Tahun Akademik -->
          <VSelect
            v-model="selectedThAkademik"
            label="Select Tahun Akademik"
            placeholder="Select Tahun Akademik"
            :items="thAkademik"
            clearable
            clear-icon="ri-close-line"
            class="custom-bg-select w-100"
            style="margin-left: -10px"
            :loading="isLoadingThAkademik"
          />

          <!-- 👉 Search  -->
          <VTextField
            v-model="search"
            placeholder="Search Data"
            density="compact"
            class="me-3 w-100"
          />
        </div>

        <VSpacer />
      </VCardText>

      <!-- 👉 Datatable  -->
      <VDataTableServer
        :headers="[
          { title: 'No', key: 'id' },
          { title: 'Mata Kuliah', key: 'nama_matkul' },
          { title: 'Kelompok', key: 'kelompok' },
          { title: 'semester', key: 'semester' },
          { title: 'Hari', key: 'hari_nama' },
          { title: 'Jam', key: 'jam_nama' },
        ]"
        v-model:model-value="selectedRows"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :items="dataTable"
        :items-length="totalItems"
        :loading="loading"
        :search="search"
        item-value="id"
        @update:options="loadItems"
      >
        <template v-if="initialLoading" #loading>
          <div class="text-center pa-4">
            <VProgressCircular indeterminate color="primary" class="mb-2" />
            <div>Memuat data...</div>
          </div>
        </template>

        <template v-else #no-data>
          <div class="text-center pa-4">Tidak ada data.</div>
        </template>

        <template #item.id="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </template>
      </VDataTableServer>
    </VCard>
  </div>
</template>
