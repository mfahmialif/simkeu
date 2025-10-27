<script setup>
const selectedRole = ref();
const page = ref(1);
const itemsPerPage = ref(5);
const sortBy = ref({ key: "id", order: "desc" });
const search = ref("");
const selectedRows = ref([]);
const dataTable = ref([]);
const totalItems = ref(0);
const loading = ref(true);
const initialLoading = ref(true);

const fetchData = async () => {
  try {
    const { data } = await $api("/admin/pemasukan/mahasiswa/setoran", {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        search: search.value,
        ...(selectedRole.value && { role_id: selectedRole.value }),
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
    loading.value = true;
    const response = await $api("/admin/pemasukan/mahasiswa/setoran/" + id, {
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
    const message = Array.isArray(err.data?.message)
      ? err.data.message.join("; ")
      : err.data?.message || "Terjadi kesalahan.";

    showSnackbar({
      text: message,
      color: "error",
    });
  } finally {
    isDialogDeleteVisible.value = false;
    loading.value = false;
  }
};

const isDialogValidasiVisible = ref(false);
const validasiData = ref({});

const showDialogValidasi = (id, name) => {
  validasiData.value = {
    id: id,
    name: name,
  };
  isDialogValidasiVisible.value = true;
};

const validasiDataSubmit = async (id, status) => {
  try {
    loading.value = true;
    const formData = new FormData();
    formData.append("status", status);
    formData.append("_method", "PUT");

    const response = await $api(
      "/admin/pemasukan/mahasiswa/setoran/" + id + "/validasi",
      {
        method: "POST",
        body: formData,
      }
    );

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
    const message = Array.isArray(err.data?.message)
      ? err.data.message.join("; ")
      : err.data?.message || "Terjadi kesalahan.";

    showSnackbar({
      text: message,
      color: "error",
    });
  } finally {
    isDialogValidasiVisible.value = false;
    loading.value = false;
  }
};

onMounted(() => {
  document.title = "Catatan Setoran - SIMKEU";
  fetchData();
});

watch(
  selectedRows,
  (newValue) => {
    newValue.forEach((row, index) => {
      console.log(`${index + 1}.`, row);
    });
  },
  { deep: true }
);

watch(selectedRole, () => {
  console.log("value from wathc", selectedRole.value);
  fetchData();
});
</script>

<template>
  <div>
    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Setoran</VCardTitle>
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

        <div class="d-flex gap-x-4 align-center">
          <!-- 👉 Export button -->
          <VBtn
            variant="outlined"
            color="secondary"
            prepend-icon="ri-upload-2-line"
          >
            Export
          </VBtn>

          <VBtn
            color="primary"
            prepend-icon="ri-add-line"
            @click="$router.push('/admin/pemasukan/mahasiswa/setoran/add')"
          >
            Add Data
          </VBtn>
        </div>
      </VCardText>

      <!-- 👉 Datatable  -->
      <VDataTableServer
        :headers="[
          { title: 'No', key: 'id' },
          { title: 'Tanggal', key: 'tanggal' },
          { title: 'Petugas', key: 'petugas' },
          { title: 'Jumlah', key: 'jumlah' },
          { title: 'Keterangan', key: 'keterangan' },
          { title: 'Validator', key: 'validator' },
          { title: 'kategori', key: 'kategori' },
          { title: 'status', key: 'status' },
          { title: 'Actions', key: 'actions', sortable: false },
        ]"
        v-model:model-value="selectedRows"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        show-select
        :items="dataTable"
        :items-length="totalItems"
        :loading="loading"
        :search="search"
        item-value="name"
        @update:options="loadItems"
      >
        <template v-if="initialLoading" #loading>
          <div class="text-center pa-4">
            <VProgressCircular indeterminate color="primary" class="mb-2" />
            <div>Memuat data setoran...</div>
          </div>
        </template>

        <template v-else #no-data>
          <div class="text-center pa-4">Tidak ada data setoran.</div>
        </template>

        <template #item.id="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </template>

        <template #item.status="{ item }">
          <VChip color="success" v-if="item.status === 'Disetujui'">
            {{ item.status }}
          </VChip>
          <VChip color="error" v-else-if="item.status === 'Ditolak'">
            {{ item.status }}
          </VChip>
          <VChip color="warning" v-else>
            {{ item.status }}
          </VChip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn size="small">
            <VIcon icon="ri-more-2-fill" />

            <VMenu activator="parent">
              <VList>
                <VListItem
                  value="download"
                  prepend-icon="ri-edit-box-line"
                  @click="
                    $router.push(
                      `/admin/pemasukan/mahasiswa/setoran/edit/${item.id}`
                    )
                  "
                >
                  Edit
                </VListItem>
                <VListItem
                  value="validasi"
                  prepend-icon="ri-check-line"
                  @click="showDialogValidasi(item.id, item.tanggal)"
                >
                  Validasi
                </VListItem>

                <VListItem
                  value="delete"
                  prepend-icon="ri-delete-bin-line"
                  @click="showDialogDelete(item.id, item.tanggal)"
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
            Anda yakin ingin menghapus data setoran ini? Penghapusan data
            setoran tidak dapat dibatalkan.
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

    <VDialog v-model="isDialogValidasiVisible" width="500">
      <!-- Dialog Content -->
      <VCard :title="'Validasi Data: ' + validasiData.name">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogValidasiVisible = false"
        />

        <VCardText class="d-flex align-center">
          <VIcon icon="ri-alert-line" size="32" class="me-2" />
          <span> Anda yakin ingin memvalidasi data setoran ini? </span>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            color="warning"
            @click="validasiDataSubmit(validasiData.id, 'Belum Divalidasi')"
          >
            <VIcon icon="ri-close-line" class="me-1" />
            Belum Divalidasi
          </VBtn>
          <VBtn
            color="error"
            @click="validasiDataSubmit(validasiData.id, 'Ditolak')"
          >
            <VIcon icon="ri-close-line" class="me-1" />
            Ditolak
          </VBtn>
          <VBtn
            color="success"
            @click="validasiDataSubmit(validasiData.id, 'Disetujui')"
          >
            <VIcon icon="ri-check-line" class="me-1" />
            Disetujui
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
