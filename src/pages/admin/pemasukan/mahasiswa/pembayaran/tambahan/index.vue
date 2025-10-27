<script setup>
const page = ref(1);
const itemsPerPage = ref(10);
const sortBy = ref({ key: "id", order: "desc" });
const search = ref("");
const selectedRows = ref([]);
const dataTable = ref([]);
const totalItems = ref(0);
const loading = ref(true);
const initialLoading = ref(true);

const fetchData = async () => {
  loading.value = true;
  try {
    const { data } = await $api("/admin/pemasukan/mahasiswa/pembayaran-tambahan", {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        search: search.value,
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
const disabledDelete = ref(false);

const showDialogDelete = (id, name) => {
  deleteData.value = {
    id: id,
    name: name,
  };
  isDialogDeleteVisible.value = true;
};

const deleteDataSubmit = async (id) => {
  try {
    disabledDelete.value = true;
    const response = await $api("/admin/pemasukan/mahasiswa/pembayaran-tambahan/" + id, {
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
      text: err,
      color: "error",
    });
  } finally {
    isDialogDeleteVisible.value = false;
    disabledDelete.value = false;
  }
};

const kwitansi = async (id) => {
  try {
    showSnackbar({
      text: "Loading...",
      color: "info",
    });
    const blob = await $api(
      "/admin/pemasukan/mahasiswa/pembayaran-tambahan/kwitansi/" + id,
      {
        method: "GET",
        headers: { Accept: "application/pdf" },
      }
    );
    
    openFileExport(blob);
  } catch (err) {
    console.info(err);
    showSnackbar({
      text: err,
      color: "error",
    });
  }
};

onMounted(() => {
  document.title = "Pembayaran Mahasiswa - SIMKEU";
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

</script>

<template>
  <div>
    <!-- <WidgetPembayaranMahasiswa /> -->


    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Pembayaran Mahasiswa Tambahan</VCardTitle>
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
            @click="
              $router.push(
                '/admin/pemasukan/mahasiswa/pembayaran/tambahan/add'
              )
            "
          >
            Add Data
          </VBtn>
        </div>
      </VCardText>

      <!-- 👉 Datatable  -->
      <VDataTableServer
        :headers="[
          { title: 'No', key: 'id' },
          { title: 'Pembayaran', key: 'tagihan' },
          { title: 'Jumlah', key: 'jumlah' },
          { title: 'Tahun', key: 'th_akademik' },
          { title: 'Tanggal', key: 'tanggal' },
          { title: 'Actions', key: 'actions', sortable: false },
        ]"
        v-model:model-value="selectedRows"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
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
            <div>Memuat data...</div>
          </div>
        </template>

        <template v-else #no-data>
          <div class="text-center pa-4">Tidak ada data.</div>
        </template>

        <template #item.id="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </template>

        <template #item.tagihan="{ item }">
          <div style="margin: 15px 0">
            <VChip color="primary" size="x-small" label>
              {{ item.nota ?? item.nomor }}
            </VChip>
            <VChip color="success" size="x-small" label>
              {{ item.jenis_pembayaran }}
            </VChip>
            <div>
              <b>{{ item.tagihan }}</b>
            </div>
            <div>
              {{ item.nim }} -
              {{ item.nama }} - {{ item.prodi }} -
              {{ item.jenis_kelamin }}
            </div>
          </div>
        </template>

        <template #item.tanggal="{ item }">
          <div>{{ new Date(item.tanggal).toISOString().split("T")[0] }}</div>
        </template>

        <template #item.jumlah="{ item }">
          <div>Dibayar: {{ formatRupiah(item.bayar) }}</div>
          <div>Total: {{ formatRupiah(item.jumlah) }}</div>
        </template>


        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn size="small">
            <VIcon icon="ri-more-2-fill" />

            <VMenu activator="parent">
              <VList>
                <VListItem
                  value="download"
                  prepend-icon="ri-download-cloud-2-line"
                  @click="kwitansi(item.id)"
                >
                  Kwitansi
                </VListItem>
                <VListItem
                  value="download"
                  prepend-icon="ri-edit-box-line"
                  @click="
                    $router.push(
                      `/admin/pemasukan/mahasiswa/pembayaran/tambahan/edit/${item.id}`
                    )
                  "
                >
                  Edit
                </VListItem>

                <VListItem
                  value="delete"
                  prepend-icon="ri-delete-bin-line"
                  @click="
                    showDialogDelete(item.id, `${item.tagihan}`)
                  "
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
          <VBtn
            color="error"
            :disabled="disabledDelete"
            @click="deleteDataSubmit(deleteData.id)"
          >
            <VIcon icon="ri-delete-bin-line" class="me-1" />
            Delete
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
