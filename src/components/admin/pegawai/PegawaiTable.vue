<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "Pegawai",
  },
  fixedTipe: {
    type: String,
    default: null,
    validator: (value) => value === null || ["dosen", "staff"].includes(value),
  },
  documentTitle: {
    type: String,
    default: "",
  },
});

const router = useRouter();

const userData = useCookie("userData").value ?? {};
const isAdmin = computed(
  () => String(userData.role?.name || "").toLowerCase() === "admin"
);

const page = ref(1);
const itemsPerPage = ref(10);
const sortBy = ref({ key: "id", order: "desc" });
const search = ref("");
const selectedRows = ref([]);
const dataTable = ref([]);
const totalItems = ref(0);
const loading = ref(true);
const initialLoading = ref(true);
const selectedTipe = ref(props.fixedTipe);
const selectedJenisKelamin = ref(null);
const selectedStatus = ref(null);
const selectedProdi = ref(null);
const prodiOptions = ref([]);

const stats = ref({
  total: 0,
  dosen: 0,
  staff: 0,
  aktif: 0,
  tidak_aktif: 0,
});

const isTipeLocked = computed(() => Boolean(props.fixedTipe));
const showProdiFilter = computed(() => props.fixedTipe === "dosen");
const cardTitle = computed(() => props.title);
const listNameLower = computed(() => props.title.toLowerCase());
const addUrl = computed(() => "/admin/setting/pegawai/add");
const filterColMd = computed(() => {
  if (props.fixedTipe === "staff") return 4;

  return 3;
});

const tipeOptions = [
  { title: "Dosen", value: "dosen" },
  { title: "Staff", value: "staff" },
];

const jenisKelaminOptions = [
  { title: "Laki-laki", value: "Laki-laki" },
  { title: "Perempuan", value: "Perempuan" },
];

const statusOptions = [
  { title: "Aktif", value: "aktif" },
  { title: "Tidak Aktif", value: "tidak aktif" },
];

const statusStatCards = computed(() => [
  {
    title: "Aktif",
    value: stats.value.aktif,
    icon: "ri-checkbox-circle-line",
    color: "success",
  },
  {
    title: "Tidak Aktif",
    value: stats.value.tidak_aktif,
    icon: "ri-close-circle-line",
    color: "error",
  },
]);

const statCards = computed(() => {
  if (props.fixedTipe === "dosen") {
    return [
      {
        title: "Total Dosen",
        value: stats.value.total,
        icon: "ri-graduation-cap-line",
        color: "info",
      },
      ...statusStatCards.value,
    ];
  }

  if (props.fixedTipe === "staff") {
    return [
      {
        title: "Total Staff",
        value: stats.value.total,
        icon: "ri-briefcase-line",
        color: "warning",
      },
      ...statusStatCards.value,
    ];
  }

  return [
    {
      title: "Total Pegawai",
      value: stats.value.total,
      icon: "ri-team-line",
      color: "primary",
    },
    {
      title: "Dosen",
      value: stats.value.dosen,
      icon: "ri-graduation-cap-line",
      color: "info",
    },
    {
      title: "Staff",
      value: stats.value.staff,
      icon: "ri-briefcase-line",
      color: "warning",
    },
    ...statusStatCards.value,
  ];
});

const fetchProdi = async () => {
  try {
    const response = await $api("/admin/prodi", {
      method: "GET",
      body: {
        limit: 0,
        sort_key: "nama",
        sort_order: "asc",
      },
    });

    prodiOptions.value = (response?.data?.data || []).map((item) => ({
      title: `${item.kode} - ${item.nama}`,
      value: item.id,
    }));
  } catch (err) {
    console.error(err);
  }
};

const fetchData = async () => {
  if (!isAdmin.value) return;

  try {
    loading.value = true;
    const tipe = props.fixedTipe || selectedTipe.value;
    const response = await $api("/admin/pegawai", {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        search: search.value,
        ...(tipe && { tipe }),
        ...(selectedJenisKelamin.value && {
          jenis_kelamin: selectedJenisKelamin.value,
        }),
        ...(selectedStatus.value && { status: selectedStatus.value }),
        ...(showProdiFilter.value &&
          selectedProdi.value && { prodi_id: selectedProdi.value }),
      },
    });

    dataTable.value = response.data.data;
    totalItems.value = response.data.total;
    stats.value = response.stats || stats.value;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
    if (initialLoading.value) initialLoading.value = false;
  }
};

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb }) => {
  loading.value = true;
  page.value = p;
  itemsPerPage.value = ipp;
  if (sb.length) sortBy.value = sb[0];
  fetchData();
};

const isDialogDeleteVisible = ref(false);
const deleteData = ref({});

const showDialogDelete = (id, name) => {
  deleteData.value = {
    id,
    name,
  };
  isDialogDeleteVisible.value = true;
};

const errorMessage = (err) => {
  const message =
    err?.data?.message ||
    err?.response?._data?.message ||
    err?.response?.data?.message ||
    err?.message;

  if (typeof message === "object") {
    return Object.values(message).flat().join("; ");
  }

  return message || "Terjadi kesalahan.";
};

const deleteDataSubmit = async (id) => {
  try {
    const response = await $api("/admin/pegawai/" + id, {
      method: "DELETE",
    });

    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: "success",
      });

      fetchData();
    } else {
      showSnackbar({
        text: response.message,
        color: "error",
      });
    }
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    });
  } finally {
    isDialogDeleteVisible.value = false;
  }
};

const resetFilters = () => {
  selectedTipe.value = props.fixedTipe || null;
  selectedJenisKelamin.value = null;
  selectedStatus.value = null;
  selectedProdi.value = null;
  search.value = "";
  page.value = 1;
  fetchData();
};

watch(
  [selectedTipe, selectedJenisKelamin, selectedStatus, selectedProdi],
  () => {
    page.value = 1;
    fetchData();
  }
);

watch(search, () => {
  page.value = 1;
  fetchData();
});

watch(
  () => props.fixedTipe,
  (tipe) => {
    selectedTipe.value = tipe || null;
    selectedProdi.value = null;
    page.value = 1;
    fetchData();
  }
);

onMounted(() => {
  document.title = `${props.documentTitle || props.title} - SIMKEU`;

  if (!isAdmin.value) {
    router.replace({ name: "not-authorized" });
    return;
  }

  if (showProdiFilter.value) fetchProdi();
});
</script>

<template>
  <div v-if="isAdmin">
    <div
      class="pegawai-stat-grid mb-4"
      :style="{ '--stat-count': statCards.length }"
    >
      <VCard
        v-for="item in statCards"
        :key="item.title"
      >
        <VCardText class="d-flex align-center justify-space-between">
          <div>
            <div class="text-sm text-medium-emphasis">
              {{ item.title }}
            </div>
            <div class="text-h5 font-weight-medium">
              {{ item.value }}
            </div>
          </div>
          <VAvatar :color="item.color" variant="tonal" rounded>
            <VIcon :icon="item.icon" />
          </VAvatar>
        </VCardText>
      </VCard>
    </div>

    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>{{ cardTitle }}</VCardTitle>
      </VCardItem>

      <VDivider />

      <VCardText>
        <VRow>
          <VCol cols="12" :md="filterColMd">
            <VTextField
              v-model="search"
              placeholder="Search Data"
              density="compact"
              clearable
              clear-icon="ri-close-line"
            />
          </VCol>

          <VCol v-if="!isTipeLocked" cols="12" :md="filterColMd">
            <VSelect
              v-model="selectedTipe"
              :items="tipeOptions"
              label="Tipe"
              density="compact"
              clearable
              clear-icon="ri-close-line"
            />
          </VCol>

          <VCol cols="12" :md="filterColMd">
            <VSelect
              v-model="selectedJenisKelamin"
              :items="jenisKelaminOptions"
              label="Jenis Kelamin"
              density="compact"
              clearable
              clear-icon="ri-close-line"
            />
          </VCol>

          <VCol cols="12" :md="filterColMd">
            <VSelect
              v-model="selectedStatus"
              :items="statusOptions"
              label="Status"
              density="compact"
              clearable
              clear-icon="ri-close-line"
            />
          </VCol>

          <VCol v-if="showProdiFilter" cols="12" :md="filterColMd">
            <VSelect
              v-model="selectedProdi"
              :items="prodiOptions"
              label="Prodi"
              density="compact"
              clearable
              clear-icon="ri-close-line"
            />
          </VCol>
        </VRow>

        <div class="d-flex justify-end flex-wrap gap-3 mt-4">
          <VBtn
            variant="outlined"
            color="secondary"
            prepend-icon="ri-filter-off-line"
            @click="resetFilters"
          >
            Reset Filter
          </VBtn>

          <VBtn
            color="primary"
            prepend-icon="ri-add-line"
            @click="$router.push(addUrl)"
          >
            Add Data
          </VBtn>
        </div>
      </VCardText>

      <VDataTableServer
        :headers="[
          { title: 'No', key: 'id', width: 60 },
          { title: 'Nama', key: 'nama' },
          { title: 'Kode', key: 'kode' },
          { title: 'Tipe', key: 'tipe' },
          { title: 'Jenis Kelamin', key: 'jenis_kelamin' },
          { title: 'Prodi/Jabatan', key: 'unit' },
          { title: 'Email', key: 'email' },
          { title: 'Status', key: 'status' },
          { title: 'Actions', key: 'actions', sortable: false },
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
            <div>Memuat data {{ listNameLower }}...</div>
          </div>
        </template>

        <template v-else #no-data>
          <div class="text-center pa-4">
            Tidak ada data {{ listNameLower }}.
          </div>
        </template>

        <template #item.id="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </template>

        <template #item.nama="{ item }">
          <div class="d-flex flex-column">
            <span class="font-weight-medium">{{ item.nama }}</span>
            <small class="text-medium-emphasis">{{ item.hp || "-" }}</small>
          </div>
        </template>

        <template #item.tipe="{ item }">
          <VChip
            :color="item.tipe === 'dosen' ? 'info' : 'warning'"
            size="small"
            label
          >
            {{ item.tipe === "dosen" ? "Dosen" : "Staff" }}
          </VChip>
        </template>

        <template #item.unit="{ item }">
          <span v-if="item.tipe === 'dosen'">
            {{ item.dosen?.prodi?.nama || "-" }}
          </span>
          <span v-else>
            {{ item.staff?.jabatan || "-" }}
          </span>
        </template>

        <template #item.email="{ item }">
          {{ item.email || "-" }}
        </template>

        <template #item.status="{ item }">
          <VChip
            :color="item.status === 'aktif' ? 'success' : 'error'"
            size="small"
            label
          >
            {{ item.status === "aktif" ? "Aktif" : "Tidak Aktif" }}
          </VChip>
        </template>

        <template #item.actions="{ item }">
          <IconBtn size="small">
            <VIcon icon="ri-more-2-fill" />

            <VMenu activator="parent">
              <VList>
                <VListItem
                  value="detail"
                  prepend-icon="ri-eye-line"
                  @click="$router.push(`/admin/setting/pegawai/detail/${item.id}`)"
                >
                  Detail
                </VListItem>

                <VListItem
                  value="edit"
                  prepend-icon="ri-edit-box-line"
                  @click="$router.push(`/admin/setting/pegawai/edit/${item.id}`)"
                >
                  Edit
                </VListItem>

                <VListItem
                  value="delete"
                  prepend-icon="ri-delete-bin-line"
                  @click="showDialogDelete(item.id, item.nama)"
                >
                  Delete
                </VListItem>
              </VList>
            </VMenu>
          </IconBtn>
        </template>
      </VDataTableServer>
    </VCard>

    <VDialog v-model="isDialogDeleteVisible" width="500">
      <VCard :title="'Hapus Data: ' + deleteData.name">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogDeleteVisible = false"
        />

        <VCardText class="d-flex align-center">
          <VIcon icon="ri-alert-line" size="32" class="me-2" />
          <span>
            Anda yakin ingin menghapus data pegawai ini? Penghapusan data tidak
            dapat dibatalkan.
          </span>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="isDialogDeleteVisible = false"
          >
            Batal
          </VBtn>
          <VBtn color="error" @click="deleteDataSubmit(deleteData.id)">
            <VIcon icon="ri-delete-bin-line" class="me-1" />
            Hapus
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.pegawai-stat-grid {
  display: grid;
  grid-template-columns: repeat(var(--stat-count), minmax(0, 1fr));
  gap: 16px;
}

@media (max-width: 959px) {
  .pegawai-stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 599px) {
  .pegawai-stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>
