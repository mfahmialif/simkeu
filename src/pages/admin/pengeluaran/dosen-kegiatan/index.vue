<script setup>
import PengeluaranLampiranList from "@/components/admin/pengeluaran/PengeluaranLampiranList.vue";
import PengeluaranStatCards from "@/components/admin/pengeluaran/PengeluaranStatCards.vue";
import PengeluaranRekapBulkUpdate from "@/components/admin/pengeluaran/PengeluaranRekapBulkUpdate.vue";
import PengeluaranRekapList from "@/components/admin/pengeluaran/PengeluaranRekapList.vue";
import PengeluaranRekapSelect from "@/components/admin/pengeluaran/PengeluaranRekapSelect.vue";
import { downloadFileExport } from "@/composables/exportFile";
import { formatRupiah } from "@/composables/formatRupiah";
import { copyTextToClipboard } from "@/utils/clipboard";

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
const selectedRekapId = ref(null);
const selectAllPages = ref(false);
const isLoadingExcel = ref(false);
const isLoadingBsiExcel = ref(false);
const isLoadingBsiCopy = ref(false);
const hasDateFilter = computed(() => !!(
  tanggalHarian.value
  || tanggalMulai.value
  || tanggalAkhir.value
));
const hasContextFilter = computed(() => !!selectedRekapId.value || hasDateFilter.value);
const contextFilterTitle = computed(() => {
  if (selectedRekapId.value) return "Pengeluaran Sesuai Data Rekap";
  if (tanggalHarian.value) return "Pengeluaran Sesuai Tanggal";

  return "Pengeluaran Sesuai Rentang Tanggal";
});

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
const requestFilterPayload = computed(() => ({
  ...dateFilterPayload.value,
  ...(selectedRekapId.value && { rekap_id: selectedRekapId.value }),
}));
const batchFilterPayload = computed(() => ({
  search: search.value,
  ...requestFilterPayload.value,
}));
const selectedIds = computed(() => selectedRows.value
  .map(row => (typeof row === "object" ? row.id : row))
  .filter(Boolean));

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
        ...requestFilterPayload.value,
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
  selectedRekapId.value = null;
  selectedRows.value = [];
  selectAllPages.value = false;
  page.value = 1;
  fetchData();
};

const clearBatchSelection = () => {
  selectedRows.value = [];
  selectAllPages.value = false;
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
        ...requestFilterPayload.value,
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

const exportBsiExcel = async () => {
  try {
    isLoadingBsiExcel.value = true;
    showSnackbar({
      text: "Loading...",
      color: "info",
    });

    const response = await $api("/admin/pengeluaran/dosen-kegiatan/export-bsi", {
      method: "GET",
      headers: {
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      body: {
        search: search.value,
        ...requestFilterPayload.value,
      },
    });

    downloadFileExport(response, "CUS BSI Barokah Pegawai Kegiatan.xlsx");
    showSnackbar({
      text: "Laporan CUS BSI berhasil di download.",
      color: "success",
    });
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    });
  } finally {
    isLoadingBsiExcel.value = false;
  }
};

const copyBsiData = async () => {
  try {
    isLoadingBsiCopy.value = true;
    showSnackbar({
      text: "Loading...",
      color: "info",
    });

    const response = await $api("/admin/pengeluaran/dosen-kegiatan/copy-bsi", {
      method: "GET",
      body: {
        search: search.value,
        ...requestFilterPayload.value,
      },
    });

    const text = response.data?.text || "";
    const total = Number(response.data?.total || 0);

    if (!text || total === 0) {
      showSnackbar({
        text: "Tidak ada data CUS BSI untuk disalin.",
        color: "warning",
      });
      return;
    }

    await copyTextToClipboard(text);
    showSnackbar({
      text: `${total} data CUS BSI berhasil disalin.`,
      color: "success",
    });
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    });
  } finally {
    isLoadingBsiCopy.value = false;
  }
};

watch(filterMode, () => {
  tanggalHarian.value = null;
  tanggalMulai.value = null;
  tanggalAkhir.value = null;
  selectedRows.value = [];
  selectAllPages.value = false;
  page.value = 1;
  fetchData();
});

watch([tanggalHarian, tanggalMulai, tanggalAkhir, selectedRekapId, search], () => {
  selectedRows.value = [];
  selectAllPages.value = false;
  page.value = 1;
  fetchData();
});

watch(selectAllPages, (enabled) => {
  selectedRows.value = enabled ? dataTable.value.map(item => item.id) : [];
});

watch(dataTable, () => {
  if (selectAllPages.value) {
    selectedRows.value = dataTable.value.map(item => item.id);
  }
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
      :filter-active="hasContextFilter"
      :filter-title="contextFilterTitle"
    />

    <section class="numbered-section">
      <div class="section-heading">
        <span class="section-number">1</span>
        <div>
          <div class="text-h6 font-weight-semibold">Rekap Pengeluaran</div>
          <div class="text-body-2 text-medium-emphasis">Kelompok rekap barokah pegawai kegiatan.</div>
        </div>
      </div>

      <PengeluaranRekapList
        title="Barokah Pegawai Kegiatan"
        endpoint="/admin/pengeluaran/dosen-kegiatan"
        base-path="/admin/pengeluaran/dosen-kegiatan"
        default-expanded
        :allow-release="false"
        @updated="clearBatchSelection"
      />
    </section>

    <section class="numbered-section">
      <div class="section-heading">
        <span class="section-number">2</span>
        <div>
          <div class="text-h6 font-weight-semibold">Data Pengeluaran</div>
          <div class="text-body-2 text-medium-emphasis">Detail pengeluaran pegawai dan nonpegawai.</div>
        </div>
      </div>

      <VRow class="mb-3 filter-controls-row">
        <VCol cols="12" md="2" class="filter-control-col">
          <VSelect
            v-model="filterMode"
            :items="filterModeOptions"
            label="Filter Hari"
            hide-details
          />
        </VCol>

        <VCol
          v-if="filterMode === 'harian'"
          cols="12"
          md="3"
          class="filter-control-col"
        >
          <AppDateTimePicker
            v-model="tanggalHarian"
            label="Tanggal"
            placeholder="Pilih tanggal"
            hide-details
            :config="{
              altInput: true,
              altFormat: 'F j, Y',
              dateFormat: 'Y-m-d',
            }"
          />
        </VCol>

        <template v-else>
          <VCol cols="12" md="2" class="filter-control-col">
            <AppDateTimePicker
              v-model="tanggalMulai"
              label="Dari Tanggal"
              placeholder="Pilih tanggal awal"
              hide-details
              :config="{
                altInput: true,
                altFormat: 'F j, Y',
                dateFormat: 'Y-m-d',
              }"
            />
          </VCol>

          <VCol cols="12" md="2" class="filter-control-col">
            <AppDateTimePicker
              v-model="tanggalAkhir"
              label="Sampai Tanggal"
              placeholder="Pilih tanggal akhir"
              hide-details
              :config="{
                altInput: true,
                altFormat: 'F j, Y',
                dateFormat: 'Y-m-d',
              }"
            />
          </VCol>
        </template>

        <VCol
          cols="12"
          :md="filterMode === 'harian' ? 5 : 4"
          class="filter-control-col filter-rekap-col"
        >
          <PengeluaranRekapSelect
            v-model="selectedRekapId"
            endpoint="/admin/pengeluaran/dosen-kegiatan"
            label="Filter Rekap"
            :allow-create="false"
          />
        </VCol>

        <VCol cols="12" md="2" class="filter-control-col">
          <VBtn
            color="primary"
            class="w-100 filter-reset-btn"
            height="56"
            prepend-icon="ri-refresh-line"
            @click="clearFilter"
          >
            Reset
          </VBtn>
        </VCol>
      </VRow>

      <PengeluaranRekapBulkUpdate
        v-model:all-pages="selectAllPages"
        endpoint="/admin/pengeluaran/dosen-kegiatan"
        :selected-ids="selectedIds"
        :total-items="totalItems"
        :filters="batchFilterPayload"
        :allow-cancel="false"
        @updated="clearBatchSelection"
      />

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

        <div class="d-flex flex-wrap gap-3 align-center">
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
            variant="outlined"
            color="success"
            prepend-icon="ri-bank-card-line"
            :loading="isLoadingBsiExcel"
            @click="exportBsiExcel"
          >
            Download CUS BSI
          </VBtn>

          <VBtn
            variant="outlined"
            color="primary"
            prepend-icon="ri-file-copy-line"
            :loading="isLoadingBsiCopy"
            @click="copyBsiData"
          >
            Salin untuk CUS BSI
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
        show-select
        :headers="[
          { title: 'No', key: 'id' },
          { title: 'Tanggal', key: 'tanggal' },
          { title: 'Kategori', key: 'kategori_detail' },
          { title: 'Pegawai', key: 'nama_pegawai' },
          { title: 'Rekap', key: 'nama_rekap' },
          { title: 'Transport', key: 'transport' },
          { title: 'Barokah', key: 'barokah' },
          { title: 'Nominal', key: 'nominal' },
          { title: 'Total', key: 'total' },
          { title: 'Jenis Pembayaran', key: 'jenis_pembayaran' },
          { title: 'Bukti', key: 'bukti_transfer', sortable: false },
          { title: 'Lampiran', key: 'lampiran', sortable: false },
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
            {{
              item.kategori_detail === "non_pegawai"
                ? "Nonpegawai"
                : item.nama_pegawai || item.nama_dosen || "-"
            }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{
              item.kategori_detail === "non_pegawai"
                ? "Tanpa pegawai"
                : item.kode_pegawai || item.kode_dosen || "-"
            }}
          </div>
          <div v-if="item.kategori_detail !== 'non_pegawai'" class="text-caption text-medium-emphasis">
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

        <template #item.kategori_detail="{ item }">
          <VChip
            :color="item.kategori_detail === 'non_pegawai' ? 'secondary' : 'primary'"
            size="small"
            label
          >
            {{ item.kategori_detail === "non_pegawai" ? "Nonpegawai" : "Pegawai" }}
          </VChip>
        </template>

        <template #item.nama_rekap="{ item }">
          {{ item.nama_rekap || "-" }}
        </template>

        <template #item.transport="{ item }">
          {{ formatRupiah(item.transport) }}
        </template>

        <template #item.barokah="{ item }">
          {{ formatRupiah(item.barokah) }}
        </template>

        <template #item.nominal="{ item }">
          {{ item.kategori_detail === "non_pegawai" ? formatRupiah(item.nominal) : "-" }}
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

        <template #item.lampiran="{ item }">
          <PengeluaranLampiranList :items="item.lampiran" />
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
                  @click="showDialogDelete(item.id, item.nama_rekap || item.tanggal)"
                >
                  Delete
                </VListItem>
              </VList>
            </VMenu>
          </IconBtn>
        </template>
      </VDataTableServer>
      </VCard>
    </section>

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
.numbered-section {
  margin-block-end: 24px;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-block-end: 12px;
}

.section-number {
  display: grid;
  flex: 0 0 auto;
  inline-size: 34px;
  block-size: 34px;
  border-radius: 10px;
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
  font-weight: 700;
  place-items: center;
}

.filter-controls-row :deep(.v-input) {
  --v-input-control-height: 56px;
}

.filter-controls-row :deep(.v-field) {
  block-size: 56px;
  min-block-size: 56px;
}

.filter-controls-row :deep(.v-field__input) {
  block-size: 56px;
  min-block-size: 56px;
  padding-block: 16px 8px;
}

.filter-controls-row :deep(.flat-picker-custom-style) {
  block-size: 56px;
  line-height: 56px;
  padding-block: 0;
}

.filter-reset-btn {
  block-size: 56px !important;
  min-block-size: 56px;
}
</style>
