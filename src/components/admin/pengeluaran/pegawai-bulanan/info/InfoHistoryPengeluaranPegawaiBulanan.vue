<script setup>
import { formatRupiah } from "@/composables/formatRupiah";
import { showSnackbar } from "@/composables/snackbar";

const props = defineProps({
  refDataPegawai: {
    type: Object,
    default: () => ({}),
  },
  endpoint: {
    type: String,
    required: true,
  },
  basePath: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const page = ref(1);
const itemsPerPage = ref(5);
const sortBy = ref({ key: "id", order: "desc" });
const search = ref("");
const selectedRows = ref([]);
const dataTable = ref([]);
const totalItems = ref(0);
const loading = ref(false);
const initialLoading = ref(false);
const selectedKode = ref("");

const monthName = (value) => {
  const months = [
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
  ];

  return months[Number(value) - 1] || "-";
};

const subtotalHarian = item => Number(item.barokah_harian || 0) * Number(item.hari || 0);

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

const fetchData = async (kode = null) => {
  selectedKode.value = kode || props.refDataPegawai?.pegawai?.kode || selectedKode.value;

  if (!selectedKode.value) {
    dataTable.value = [];
    totalItems.value = 0;
    loading.value = false;
    initialLoading.value = false;
    return;
  }

  try {
    loading.value = true;
    initialLoading.value = true;

    const { data } = await $api(props.endpoint, {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        search: search.value,
        kode: selectedKode.value,
      },
    });

    dataTable.value = data.data;
    totalItems.value = data.total;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
    initialLoading.value = false;
  }
};

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb }) => {
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

const deleteDataSubmit = async (id) => {
  try {
    const response = await $api(`${props.endpoint}/${id}`, {
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

watch(search, () => {
  page.value = 1;
  fetchData();
});

defineExpose({
  fetchData,
});
</script>

<template>
  <VCard>
    <VCardItem class="pb-4">
      <VCardTitle>Riwayat {{ title }}</VCardTitle>
    </VCardItem>

    <VDivider />

    <VCardText class="d-flex flex-wrap gap-4 w-100">
      <VTextField
        v-model="search"
        placeholder="Search Data"
        density="compact"
        class="w-100"
      />
    </VCardText>

    <VDataTableServer
      :headers="[
        { title: 'No', key: 'id' },
        { title: 'Tanggal', key: 'tanggal' },
        { title: 'Periode', key: 'periode', sortable: false },
        { title: 'Total Hari', key: 'hari' },
        { title: 'Barokah Harian', key: 'barokah_harian' },
        { title: 'Subtotal Harian', key: 'subtotal_harian', sortable: false },
        { title: 'Barokah Bulanan', key: 'barokah_bulanan' },
        { title: 'Total', key: 'total' },
        { title: 'Jenis Pembayaran', key: 'jenis_pembayaran' },
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

      <template #item.periode="{ item }">
        {{ monthName(item.bulan) }} {{ item.tahun || "" }}
      </template>

      <template #item.barokah_harian="{ item }">
        {{ formatRupiah(item.barokah_harian) }}
      </template>

      <template #item.subtotal_harian="{ item }">
        {{ formatRupiah(subtotalHarian(item)) }}
      </template>

      <template #item.barokah_bulanan="{ item }">
        {{ formatRupiah(item.barokah_bulanan) }}
      </template>

      <template #item.total="{ item }">
        {{ formatRupiah(item.total) }}
      </template>

      <template #item.jenis_pembayaran="{ item }">
        {{ item.jenis_pembayaran || "-" }}
      </template>

      <template #item.actions="{ item }">
        <IconBtn size="small">
          <VIcon icon="ri-more-2-fill" />

          <VMenu activator="parent">
            <VList>
              <VListItem
                value="edit"
                prepend-icon="ri-edit-box-line"
                @click="$router.push(`${basePath}/edit/${item.id}`)"
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

    <VDialog v-model="isDialogDeleteVisible" width="500">
      <VCard :title="'Hapus Data: ' + deleteData.name">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogDeleteVisible = false"
        />

        <VCardText class="d-flex align-center">
          <VIcon icon="ri-alert-line" size="32" class="me-2" />
          <span>Anda yakin ingin menghapus data ini? Penghapusan data tidak dapat dibatalkan.</span>
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
  </VCard>
</template>
