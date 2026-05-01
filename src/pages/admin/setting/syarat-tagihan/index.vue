<script setup>
import { showSnackbar } from "@/composables/snackbar";

const page = ref(1);
const itemsPerPage = ref(10);
const sortBy = ref({ key: "nama", order: "asc" });
const search = ref("");
const selectedRows = ref([]);
const dataTable = ref([]);
const totalItems = ref(0);
const loading = ref(true);
const initialLoading = ref(true);
const syncing = ref(false);
const smtFilter = ref(""); // '' = semua, 'filled' = sudah diisi, 'empty' = belum diisi

// Stats
const stats = ref({ total: 0, filled: 0, empty: 0 });

// Get user role for conditional rendering
const userData = useCookie("userData").value ?? {};
const isAdmin = computed(() => userData.role?.name === "admin");

const fetchStats = async () => {
  try {
    const response = await $api("/admin/syarat-tagihan/stats", {
      method: "GET",
    });
    if (response.status) {
      stats.value = response.data;
    }
  } catch (err) {
    console.error(err);
  }
};

const fetchData = async () => {
  try {
    loading.value = true;
    const { data } = await $api("/admin/syarat-tagihan", {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        search: search.value,
        smt_status: smtFilter.value || undefined,
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
  loading.value = true;
  page.value = p;
  itemsPerPage.value = ipp;
  if (sb.length) sortBy.value = sb[0];
  fetchData();
};

const setFilter = (filter) => {
  smtFilter.value = smtFilter.value === filter ? "" : filter;
  page.value = 1;
  fetchData();
};

const syncTagihan = async () => {
  try {
    syncing.value = true;
    const response = await $api("/admin/syarat-tagihan/sync", {
      method: "POST",
    });

    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: "success",
      });
      fetchData();
      fetchStats();
    } else {
      showSnackbar({
        text: response.message,
        color: "error",
      });
    }
  } catch (err) {
    showSnackbar({
      text: err.data?.message || "Gagal sync tagihan.",
      color: "error",
    });
  } finally {
    syncing.value = false;
  }
};

const isDialogDeleteVisible = ref(false);
const deleteData = ref({});

const showDialogDelete = (id, name) => {
  deleteData.value = {
    id: id,
    name: name,
  };
  isDialogDeleteVisible.value = true;
};

const deleteDataSubmit = async (id) => {
  try {
    const response = await $api("/admin/syarat-tagihan/" + id, {
      method: "DELETE",
    });

    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: "success",
      });

      fetchData();
      fetchStats();
    } else {
      showSnackbar({
        text: response.message,
        color: "error",
      });
    }
  } catch (err) {
    const message = Array.isArray(err.data?.message)
      ? err.data.message.join("; ")
      : err.data?.message || "Terjadi kesalahan.";

    showSnackbar({
      text: message,
      color: "error",
    });
  } finally {
    isDialogDeleteVisible.value = false;
  }
};

onMounted(() => {
  document.title = "Syarat Tagihan - SIMKEU";
  fetchStats();
});
</script>

<template>
  <div>
    <!-- 👉 Stat Cards -->
    <VRow class="mb-4">
      <VCol cols="12" sm="4">
        <VCard
          :variant="smtFilter === '' ? 'elevated' : 'outlined'"
          :class="{ 'border-primary': smtFilter === '' }"
          style="cursor: pointer;"
          @click="setFilter('')"
        >
          <VCardText class="d-flex align-center gap-3">
            <VAvatar color="primary" variant="tonal" size="42" rounded>
              <VIcon icon="ri-price-tag-3-line" size="24" />
            </VAvatar>
            <div>
              <div class="text-body-2 text-medium-emphasis">Total Tagihan</div>
              <div class="text-h5 font-weight-bold">{{ stats.total }}</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="4">
        <VCard
          :variant="smtFilter === 'filled' ? 'elevated' : 'outlined'"
          :class="{ 'border-success': smtFilter === 'filled' }"
          style="cursor: pointer;"
          @click="setFilter('filled')"
        >
          <VCardText class="d-flex align-center gap-3">
            <VAvatar color="success" variant="tonal" size="42" rounded>
              <VIcon icon="ri-checkbox-circle-line" size="24" />
            </VAvatar>
            <div>
              <div class="text-body-2 text-medium-emphasis">Sudah Diisi SMT</div>
              <div class="text-h5 font-weight-bold">{{ stats.filled }}</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="4">
        <VCard
          :variant="smtFilter === 'empty' ? 'elevated' : 'outlined'"
          :class="{ 'border-warning': smtFilter === 'empty' }"
          style="cursor: pointer;"
          @click="setFilter('empty')"
        >
          <VCardText class="d-flex align-center gap-3">
            <VAvatar color="warning" variant="tonal" size="42" rounded>
              <VIcon icon="ri-error-warning-line" size="24" />
            </VAvatar>
            <div>
              <div class="text-body-2 text-medium-emphasis">Belum Diisi SMT</div>
              <div class="text-h5 font-weight-bold">{{ stats.empty }}</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 👉 Table Card -->
    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Syarat Tagihan</VCardTitle>
      </VCardItem>

      <VDivider />

      <VCardText class="d-flex flex-wrap gap-4">
        <div class="d-flex align-center w-100 w-sm-auto">
          <!-- 👉 Search  -->
          <VTextField
            v-model="search"
            placeholder="Search Data"
            style="inline-size: 200px"
            density="compact"
            class="me-3"
          />
        </div>

        <VSpacer />

        <div class="d-flex gap-x-4 align-center" v-if="isAdmin">
          <VBtn
            color="info"
            prepend-icon="ri-refresh-line"
            variant="outlined"
            :loading="syncing"
            @click="syncTagihan"
          >
            Sync Tagihan
          </VBtn>
          <VBtn
            color="primary"
            prepend-icon="ri-add-line"
            @click="$router.push('/admin/setting/syarat-tagihan/add')"
          >
            Add Data
          </VBtn>
        </div>
      </VCardText>

      <!-- Active filter indicator -->
      <VCardText v-if="smtFilter" class="pt-0 pb-2">
        <VChip
          :color="smtFilter === 'filled' ? 'success' : 'warning'"
          closable
          size="small"
          label
          @click:close="setFilter('')"
        >
          Filter: {{ smtFilter === 'filled' ? 'Sudah Diisi SMT' : 'Belum Diisi SMT' }}
        </VChip>
      </VCardText>

      <!-- 👉 Datatable  -->
      <VDataTableServer
        :headers="[
          { title: 'No', key: 'id', width: 60 },
          { title: 'Nama Tagihan', key: 'nama' },
          { title: 'Semester', key: 'smt', width: 120 },
          { title: 'Keterangan', key: 'keterangan' },
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
            <div>Memuat data...</div>
          </div>
        </template>

        <template v-else #no-data>
          <div class="text-center pa-4">Tidak ada data.</div>
        </template>

        <template #item.id="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </template>

        <template #item.smt="{ item }">
          <VChip v-if="item.smt" color="primary" size="small" label>
            Semester {{ item.smt }}
          </VChip>
          <VChip v-else color="warning" size="small" label variant="outlined">
            Belum diisi
          </VChip>
        </template>

        <template #item.keterangan="{ item }">
          <span v-if="item.keterangan">{{ item.keterangan }}</span>
          <span v-else class="text-disabled">-</span>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn size="small">
            <VIcon icon="ri-more-2-fill" />

            <VMenu activator="parent">
              <VList>
                <VListItem
                  v-if="isAdmin"
                  value="edit"
                  prepend-icon="ri-edit-box-line"
                  @click="$router.push(`/admin/setting/syarat-tagihan/edit/${item.id}`)"
                >
                  Edit
                </VListItem>

                <VListItem
                  v-if="!isAdmin"
                  value="view"
                  prepend-icon="ri-eye-line"
                  @click="$router.push(`/admin/setting/syarat-tagihan/edit/${item.id}`)"
                >
                  View
                </VListItem>

                <VListItem
                  v-if="isAdmin"
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
      <!-- Dialog Content -->
      <VCard :title="'Hapus Data: ' + deleteData.name">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogDeleteVisible = false"
        />

        <VCardText class="d-flex align-center">
          <VIcon icon="ri-alert-line" size="32" class="me-2" />
          <span>
            Anda yakin ingin menghapus data ini? Penghapusan data tidak dapat
            dibatalkan.
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
