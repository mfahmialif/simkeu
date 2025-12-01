<script setup>

const page = ref(1);
const itemsPerPage = ref(5);
const sortBy = ref({ key: "id", order: "desc" });
const search = ref("");
const selectedRows = ref([]);
const dataTable = ref([]);
const totalItems = ref(0);
const loading = ref(true);
const initialLoading = ref(true);

const fetchData = async (kode = "9999999") => {
  try {
    loading.value = true;
    const { data } = await $api("/admin/pengeluaran/dosen", {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        search: search.value,
        kode: kode
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
    const response = await $api("/admin/pengeluaran/dosen/" + id, {
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
  }
};

defineExpose({
  fetchData,
});
</script>

<template>
  <div>
    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Catatan Pengeluaran</VCardTitle>
      </VCardItem>

      <VDivider />

      <VCardText class="d-flex flex-wrap gap-4 w-100">
        <div class="d-flex align-center w-100">
          <!-- 👉 Search  -->
          <VTextField
            v-model="search"
            placeholder="Search Data"
            density="compact"
            class="me-3"
          />
        </div>

        <VSpacer />
        
      </VCardText>

      <!-- 👉 Datatable  -->
      <VDataTableServer
        :headers="[
          { title: 'No', key: 'id' },
          { title: 'Tanggal', key: 'tanggal' },
          { title: 'Jam', key: 'jam' },
          { title: 'Hari', key: 'hari' },
          { title: 'Transport', key: 'transport' },
          { title: 'Barokah', key: 'barokah' },
          { title: 'Total', key: 'total' },
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

        <template #item.transport="{ item }">
          {{ formatRupiah(item.transport) }}
        </template>

        <template #item.barokah="{ item }">
          {{ formatRupiah(item.barokah) }}
        </template>

        <template #item.total="{ item }">
          {{ formatRupiah(item.total) }}
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn size="small">
            <VIcon icon="ri-more-2-fill" />

            <VMenu activator="parent">
              <VList>
                <VListItem
                  value="edit"
                  prepend-icon="ri-edit-box-line"
                  @click="
                    $router.push(`/admin/pengeluaran/dosen/edit/${item.id}`)
                  "
                >
                  Edit
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
