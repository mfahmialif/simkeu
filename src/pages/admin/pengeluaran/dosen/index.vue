<script setup>
import { formatRupiah } from "@/composables/formatRupiah";

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
    loading.value = true;

    const { data } = await $api("/admin/pengeluaran/dosen", {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        search: search.value,
        ...(tanggalMulai.value && { tanggal_mulai: tanggalMulai.value }),
        ...(tanggalAkhir.value && { tanggal_akhir: tanggalAkhir.value }),
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

const tanggalMulai = ref(null);
const tanggalAkhir = ref(null);

const clearFilter = () => {
  tanggalMulai.value = null;
  tanggalAkhir.value = null;
  fetchData();
};

onMounted(() => {
  document.title = "Pengeluaran Dosen- SIMKEU";
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

watch(
  [tanggalMulai, tanggalAkhir],
  () => {
    fetchData();
  },
  { deep: true }
);

const isLoadingExcel = ref(false);
const exportExcel = async () => {
  try {
    isLoadingExcel.value = true;
    showSnackbar({
      text: "Loading...",
      color: "info",
    });
    const response = await $api("/admin/pengeluaran/dosen/export-excel", {
      method: "GET",
      headers: {
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      body: {
        search: search.value,
        ...(tanggalMulai.value && { tanggal_mulai: tanggalMulai.value }),
        ...(tanggalAkhir.value && { tanggal_akhir: tanggalAkhir.value }),
      },
    });

    downloadFileExport(response, "Laporan Pengeluaran Dosen.xlsx");
    showSnackbar({
      text: "Laporan berhasil di download.",
      color: "success",
    });
  } catch (err) {
    showSnackbar({
      text: err.message,
      color: "error",
    });
  } finally {
    isLoadingExcel.value = false;
  }
};

const isLoadingSlip = ref(false);
const printSlip = async (id) => {
  try {
    isLoadingSlip.value = true;
    showSnackbar({
      text: "Loading...",
      color: "info",
    });
    const response = await $api("/admin/pengeluaran/dosen/print-slip/" + id, {
      method: "GET",
      headers: {
        Accept: "application/pdf",
      },
    });

    openFileExport(response);
    showSnackbar({
      text: "Slip gaji berhasil di download.",
      color: "success",
    });
  } catch (err) {
    showSnackbar({
      text: err.message,
      color: "error",
    });
  } finally {
    isLoadingSlip.value = false;
  }
};
</script>

<template>
  <div>
    <VRow class="mb-3">
      <VCol cols="12" md="5">
        <AppDateTimePicker
          v-model="tanggalMulai"
          label="Dari Tanggal"
          placeholder="Select date"
          :config="{
            altInput: true,
            altFormat: 'F j, Y',
            dateFormat: 'Y-m-d',
          }"
        />
      </VCol>
      <VCol cols="12" md="5">
        <AppDateTimePicker
          v-model="tanggalAkhir"
          label="Sampai Tanggal"
          placeholder="Select date"
          :config="{
            altInput: true,
            altFormat: 'F j, Y',
            dateFormat: 'Y-m-d',
          }"
        />
      </VCol>
      <VCol cols="12" md="2" class="d-flex align-end">
        <VBtn
          color="primary"
          class="w-100"
          height="48"
          prepend-icon="ri-refresh-line"
          @click="clearFilter"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>

    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Pengeluaran Dosen</VCardTitle>
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
            color="success"
            prepend-icon="ri-upload-2-line"
            @click="exportExcel"
            :loading="isLoadingExcel"
          >
            Export
          </VBtn>

          <VBtn
            color="primary"
            prepend-icon="ri-add-line"
            @click="$router.push('/admin/pengeluaran/dosen/add')"
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
          { title: 'Dosen', key: 'nama_dosen' },
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

        <template #item.nama_dosen="{ item }">
          <div style="margin: 5px 0">
            <VChip color="primary" size="x-small" label>
              {{ item.kode_dosen }}
            </VChip>
            <div>
              <b>{{ item.nama_dosen }}</b>
            </div>
            <div>
              {{ item.nama_prodi_dosen }}
            </div>
          </div>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn size="small">
            <VIcon icon="ri-more-2-fill" />

            <VMenu activator="parent">
              <VList>
                <VListItem
                  value="Print Slip"
                  prepend-icon="ri-file-paper-2-fill"
                  @click="printSlip(item.id)"
                >
                  Slip Barokah
                </VListItem>
                <VDivider />
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
