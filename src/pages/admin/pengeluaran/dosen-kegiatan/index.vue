<script setup>
import PengeluaranStatCards from "@/components/admin/pengeluaran/PengeluaranStatCards.vue";
import { downloadFileExport } from "@/composables/exportFile";
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
const stats = ref({});
const filterMode = ref("harian");
const tanggalHarian = ref(null);
const tanggalMulai = ref(null);
const tanggalAkhir = ref(null);
const isLoadingExcel = ref(false);

const filterModeOptions = [
  { title: "Harian", value: "harian" },
  { title: "Rentang Tanggal", value: "rentang" },
];

const dateFilterPayload = computed(() => {
  if (filterMode.value === "harian") {
    return tanggalHarian.value
      ? {
          tanggal_mulai: tanggalHarian.value,
          tanggal_akhir: tanggalHarian.value,
        }
      : {};
  }

  return {
    ...(tanggalMulai.value && { tanggal_mulai: tanggalMulai.value }),
    ...(tanggalAkhir.value && { tanggal_akhir: tanggalAkhir.value }),
  };
});

const fetchData = async () => {
  try {
    loading.value = true;

    const response = await $api("/admin/pengeluaran/dosen-kegiatan", {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        search: search.value,
        ...dateFilterPayload.value,
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
    const response = await $api("/admin/pengeluaran/dosen-kegiatan/" + id, {
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

const clearFilter = () => {
  tanggalHarian.value = null;
  tanggalMulai.value = null;
  tanggalAkhir.value = null;
  page.value = 1;
  fetchData();
};

const exportExcel = async () => {
  try {
    isLoadingExcel.value = true;
    showSnackbar({
      text: "Loading...",
      color: "info",
    });

    const response = await $api("/admin/pengeluaran/dosen-kegiatan/export-excel", {
      method: "GET",
      headers: {
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      body: {
        search: search.value,
        ...dateFilterPayload.value,
      },
    });

    downloadFileExport(response, "Laporan Barokah Pegawai Kegiatan.xlsx");
    showSnackbar({
      text: "Laporan berhasil di download.",
      color: "success",
    });
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    });
  } finally {
    isLoadingExcel.value = false;
  }
};

watch(filterMode, () => {
  tanggalHarian.value = null;
  tanggalMulai.value = null;
  tanggalAkhir.value = null;
  page.value = 1;
  fetchData();
});

watch([tanggalHarian, tanggalMulai, tanggalAkhir, search], () => {
  page.value = 1;
  fetchData();
});

onMounted(() => {
  document.title = "Barokah Pegawai Kegiatan - SIMKEU";
});
</script>

<template>
  <div>
    <PengeluaranStatCards
      :stats="stats"
      :loading="initialLoading"
    />

    <VRow class="mb-3">
      <VCol cols="12" md="3">
        <VSelect
          v-model="filterMode"
          :items="filterModeOptions"
          label="Filter Hari"
          class="filter-day-select"
          hide-details
        />
      </VCol>

      <VCol
        v-if="filterMode === 'harian'"
        cols="12"
        md="6"
      >
        <AppDateTimePicker
          v-model="tanggalHarian"
          label="Tanggal"
          placeholder="Pilih tanggal"
          :config="{
            altInput: true,
            altFormat: 'F j, Y',
            dateFormat: 'Y-m-d',
          }"
        />
      </VCol>

      <template v-else>
        <VCol cols="12" md="3">
          <AppDateTimePicker
            v-model="tanggalMulai"
            label="Dari Tanggal"
            placeholder="Pilih tanggal awal"
            :config="{
              altInput: true,
              altFormat: 'F j, Y',
              dateFormat: 'Y-m-d',
            }"
          />
        </VCol>

        <VCol cols="12" md="3">
          <AppDateTimePicker
            v-model="tanggalAkhir"
            label="Sampai Tanggal"
            placeholder="Pilih tanggal akhir"
            :config="{
              altInput: true,
              altFormat: 'F j, Y',
              dateFormat: 'Y-m-d',
            }"
          />
        </VCol>
      </template>

      <VCol cols="12" md="3" class="d-flex align-end">
        <VBtn
          color="primary"
          class="w-100"
          height="56"
          prepend-icon="ri-refresh-line"
          @click="clearFilter"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>

    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Barokah Pegawai Kegiatan</VCardTitle>
      </VCardItem>

      <VDivider />

      <VCardText class="d-flex flex-wrap gap-4">
        <div class="d-flex align-center w-100 w-sm-auto">
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
          <VBtn
            variant="outlined"
            color="success"
            prepend-icon="ri-file-excel-2-line"
            :loading="isLoadingExcel"
            @click="exportExcel"
          >
            Download Excel
          </VBtn>

          <VBtn
            color="primary"
            prepend-icon="ri-add-line"
            @click="$router.push('/admin/pengeluaran/dosen-kegiatan/add')"
          >
            Add Data
          </VBtn>
        </div>
      </VCardText>

      <VDataTableServer
        :headers="[
          { title: 'No', key: 'id' },
          { title: 'Tanggal', key: 'tanggal' },
          { title: 'Pegawai', key: 'nama_pegawai' },
          { title: 'Nama Kegiatan', key: 'nama_kegiatan' },
          { title: 'Transport', key: 'transport' },
          { title: 'Barokah', key: 'barokah' },
          { title: 'Total', key: 'total' },
          { title: 'Jenis Pembayaran', key: 'jenis_pembayaran' },
          { title: 'Bukti', key: 'bukti_transfer', sortable: false },
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

        <template #item.tanggal="{ item }">
          {{ item.tanggal || "-" }}
        </template>

        <template #item.nama_pegawai="{ item }">
          <div class="font-weight-medium">
            {{ item.nama_pegawai || item.nama_dosen || "-" }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ item.kode_pegawai || item.kode_dosen || "-" }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{
              item.tipe_pegawai === "staff"
                ? "Staff"
                : item.tipe_pegawai === "dosen"
                  ? "Dosen"
                  : "-"
            }}
            <span v-if="item.jabatan_staff || item.nama_prodi_dosen">
              - {{ item.jabatan_staff || item.nama_prodi_dosen }}
            </span>
          </div>
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

        <template #item.jenis_pembayaran="{ item }">
          <VChip
            :color="item.jenis_pembayaran === 'Transfer' ? 'info' : 'success'"
            size="small"
            label
          >
            {{ item.jenis_pembayaran }}
          </VChip>
        </template>

        <template #item.bukti_transfer="{ item }">
          <VBtn
            v-if="item.bukti_transfer_url"
            icon
            size="small"
            variant="text"
            color="primary"
            :href="item.bukti_transfer_url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <VIcon icon="ri-file-paper-2-line" />
          </VBtn>
          <span v-else>-</span>
        </template>

        <template #item.keterangan="{ item }">
          {{ item.keterangan || "-" }}
        </template>

        <template #item.actions="{ item }">
          <IconBtn size="small">
            <VIcon icon="ri-more-2-fill" />

            <VMenu activator="parent">
              <VList>
                <VListItem
                  value="edit"
                  prepend-icon="ri-edit-box-line"
                  @click="
                    $router.push(`/admin/pengeluaran/dosen-kegiatan/edit/${item.id}`)
                  "
                >
                  Edit
                </VListItem>

                <VListItem
                  value="delete"
                  prepend-icon="ri-delete-bin-line"
                  @click="showDialogDelete(item.id, item.nama_kegiatan)"
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

<style scoped>
.filter-day-select :deep(.v-field) {
  min-height: 56px;
}

.filter-day-select :deep(.v-field__input) {
  min-height: 56px;
  padding-block: 16px 8px;
}
</style>
