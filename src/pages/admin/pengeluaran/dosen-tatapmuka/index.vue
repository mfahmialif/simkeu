<script setup>
import PengeluaranLampiranList from "@/components/admin/pengeluaran/PengeluaranLampiranList.vue";
import PengeluaranStatCards from "@/components/admin/pengeluaran/PengeluaranStatCards.vue";
import PengeluaranRekapBulkUpdate from "@/components/admin/pengeluaran/PengeluaranRekapBulkUpdate.vue";
import PengeluaranRekapList from "@/components/admin/pengeluaran/PengeluaranRekapList.vue";
import PengeluaranPetugasFilter from "@/components/admin/pengeluaran/PengeluaranPetugasFilter.vue";
import PengeluaranRekapSelect from "@/components/admin/pengeluaran/PengeluaranRekapSelect.vue";
import { defaultPetugasPengeluaranId, fetchPetugasPengeluaranOptions } from "@/composables/petugasPengeluaran";
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
const selectedRekapId = ref(null);
const selectedPetugasId = ref(null);
const petugasList = ref([]);
const selectAllPages = ref(false);
const tanggalMulai = ref(null);
const tanggalAkhir = ref(null);
const hasDateFilter = computed(() => !!(tanggalMulai.value || tanggalAkhir.value));
const hasContextFilter = computed(() => !!selectedRekapId.value || hasDateFilter.value);
const contextFilterTitle = computed(() => (
  selectedRekapId.value
    ? "Pengeluaran Sesuai Data Rekap"
    : hasDateFilter.value
      ? "Pengeluaran Sesuai Rentang Tanggal"
      : "Pengeluaran Sesuai Filter"
));

const numberValue = (value) => Number(value ?? 0);
const amountValue = (value, fallback = 0) => value ?? fallback ?? 0;
const subtotalTransport = (item) => {
  const transportMotor = numberValue(amountValue(item.transport_motor, item.transport));
  const hariMotor = numberValue(amountValue(item.hari_transport_motor, item.hari));
  const transportMobil = numberValue(amountValue(item.transport_mobil, item.transport_mobil_tanpa_tol));
  const hariMobil = numberValue(amountValue(item.hari_transport_mobil, item.hari_transport_mobil_tanpa_tol));

  return transportMotor * hariMotor
    + transportMobil * hariMobil;
};
const subtotalMengajar = (item) => {
  const barokahBiasa = numberValue(amountValue(item.barokah_mengajar_biasa, item.barokah));
  const jamBiasa = numberValue(item.jam);
  const barokahDoubleDegree = numberValue(item.barokah_mengajar_double_degree);
  const jamDoubleDegree = numberValue(amountValue(item.jam_mengajar_double_degree, item.jam));

  return Math.round((barokahBiasa * jamBiasa) + (barokahDoubleDegree * jamDoubleDegree));
};
const subtotalSempro = (item) => numberValue(item.barokah_sempro) * numberValue(amountValue(item.jam_sempro, item.barokah_sempro ? 1 : 0));
const subtotalUas = (item) => numberValue(item.barokah_uas) * numberValue(item.jumlah_mahasiswa_uas);
const requestFilterPayload = () => ({
  ...(tanggalMulai.value && { tanggal_mulai: tanggalMulai.value }),
  ...(tanggalAkhir.value && { tanggal_akhir: tanggalAkhir.value }),
  ...(selectedRekapId.value && { rekap_id: selectedRekapId.value }),
  ...(selectedPetugasId.value && { petugas_id: selectedPetugasId.value }),
});
const rekapFilterPayload = computed(() => ({
  ...(selectedPetugasId.value && { petugas_id: selectedPetugasId.value }),
}));
const batchFilterPayload = computed(() => ({
  search: search.value,
  ...requestFilterPayload(),
}));
const selectedIds = computed(() => selectedRows.value
  .map(row => (typeof row === "object" ? row.id : row))
  .filter(Boolean));

const fetchData = async () => {
  try {
    loading.value = true;

    const response = await $api("/admin/pengeluaran/dosen", {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        search: search.value,
        ...requestFilterPayload(),
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

const clearFilter = () => {
  tanggalMulai.value = null;
  tanggalAkhir.value = null;
  selectedRekapId.value = null;
  selectedRows.value = [];
  selectAllPages.value = false;
  fetchData();
};

onMounted(() => {
  document.title = "Barokah Dosen Tatapmuka - SIMKEU";
  fetchPetugas();
});

const fetchPetugas = async () => {
  try {
    const items = await fetchPetugasPengeluaranOptions("tatap_muka");
    petugasList.value = items;

    if (!selectedPetugasId.value) {
      selectedPetugasId.value = defaultPetugasPengeluaranId(items);
    }
  } catch (err) {
    console.error("Failed to fetch petugas pengeluaran:", err);
  }
};

const clearBatchSelection = () => {
  selectedRows.value = [];
  selectAllPages.value = false;
  fetchData();
};

watch(
  [tanggalMulai, tanggalAkhir, selectedRekapId, selectedPetugasId, search],
  () => {
    selectedRows.value = [];
    selectAllPages.value = false;
    fetchData();
  },
  { deep: true }
);

watch(selectAllPages, (enabled) => {
  selectedRows.value = enabled ? dataTable.value.map(item => item.id) : [];
});

watch(dataTable, () => {
  if (selectAllPages.value) {
    selectedRows.value = dataTable.value.map(item => item.id);
  }
});

const isLoadingExcel = ref(false);
const isLoadingBsiExcel = ref(false);
const isLoadingBsiCopy = ref(false);
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
        ...requestFilterPayload(),
      },
    });

    downloadFileExport(response, "Laporan Barokah Dosen Tatapmuka.xlsx");
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

const exportBsiExcel = async () => {
  try {
    isLoadingBsiExcel.value = true;
    showSnackbar({
      text: "Loading...",
      color: "info",
    });

    const response = await $api("/admin/pengeluaran/dosen/export-bsi", {
      method: "GET",
      headers: {
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      body: {
        search: search.value,
        ...requestFilterPayload(),
      },
    });

    downloadFileExport(response, "CUS BSI Barokah Dosen Tatapmuka.xlsx");
    showSnackbar({
      text: "Laporan CUS BSI berhasil di download.",
      color: "success",
    });
  } catch (err) {
    showSnackbar({
      text: err.message,
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

    const response = await $api("/admin/pengeluaran/dosen/copy-bsi", {
      method: "GET",
      body: {
        search: search.value,
        ...requestFilterPayload(),
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
      text: err.data?.message || err.message || "Gagal menyalin data CUS BSI.",
      color: "error",
    });
  } finally {
    isLoadingBsiCopy.value = false;
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
      text: "Slip barokah berhasil di download.",
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
    <PengeluaranStatCards
      :stats="stats"
      :loading="initialLoading"
      :filter-active="hasContextFilter"
      :filter-title="contextFilterTitle"
    />

    <PengeluaranPetugasFilter
      v-model="selectedPetugasId"
      :items="petugasList"
    />

    <PengeluaranRekapList
      title="Barokah Dosen Tatapmuka"
      endpoint="/admin/pengeluaran/dosen"
      base-path="/admin/pengeluaran/dosen-tatapmuka"
      :filters="rekapFilterPayload"
      @updated="clearBatchSelection"
    />

    <VRow class="mb-3 filter-controls-row">
      <VCol cols="12" md="2" class="filter-control-col">
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
      <VCol cols="12" md="2" class="filter-control-col">
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
      <VCol cols="12" md="6" class="filter-control-col filter-rekap-col">
        <PengeluaranRekapSelect
          v-model="selectedRekapId"
          endpoint="/admin/pengeluaran/dosen"
          label="Filter Rekap"
          :allow-create="false"
          :filters="rekapFilterPayload"
        />
      </VCol>
      <VCol cols="12" md="2" class="d-flex align-end filter-control-col">
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
      endpoint="/admin/pengeluaran/dosen"
      :selected-ids="selectedIds"
      :total-items="totalItems"
      :filters="batchFilterPayload"
      @updated="clearBatchSelection"
    />

    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Barokah Dosen Tatapmuka</VCardTitle>
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
            prepend-icon="ri-upload-2-line"
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
            @click="$router.push('/admin/pengeluaran/dosen-tatapmuka/add')"
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
          { title: 'Dosen', key: 'nama_dosen' },
          { title: 'Rekap', key: 'nama_rekap' },
          { title: 'Transport', key: 'subtotal_transport', sortable: false },
          { title: 'Mengajar', key: 'subtotal_mengajar', sortable: false },
          { title: 'Sempro', key: 'subtotal_sempro', sortable: false },
          { title: 'UAS', key: 'subtotal_uas', sortable: false },
          { title: 'Jenis Pembayaran', key: 'jenis_pembayaran' },
          { title: 'Total', key: 'total' },
          { title: 'Lampiran', key: 'lampiran', sortable: false },
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

        <template #item.subtotal_transport="{ item }">
          {{ formatRupiah(subtotalTransport(item)) }}
        </template>

        <template #item.subtotal_mengajar="{ item }">
          {{ formatRupiah(subtotalMengajar(item)) }}
        </template>

        <template #item.subtotal_sempro="{ item }">
          {{ formatRupiah(subtotalSempro(item)) }}
        </template>

        <template #item.subtotal_uas="{ item }">
          {{ formatRupiah(subtotalUas(item)) }}
        </template>

        <template #item.total="{ item }">
          {{ formatRupiah(item.total) }}
        </template>

        <template #item.jenis_pembayaran="{ item }">
          <div
            v-if="item.jenis_pembayaran"
            class="d-flex flex-column align-start gap-1 py-1"
          >
            <VChip
              :color="item.jenis_pembayaran === 'Transfer' ? 'info' : 'success'"
              size="small"
              label
            >
              {{ item.jenis_pembayaran }}
            </VChip>

            <VBtn
              v-if="item.jenis_pembayaran === 'Transfer' && item.bukti_transfer_url"
              :href="item.bukti_transfer_url"
              target="_blank"
              rel="noopener noreferrer"
              variant="text"
              color="primary"
              size="x-small"
              prepend-icon="ri-file-paper-2-line"
              class="px-0"
            >
              Lihat Bukti
            </VBtn>
          </div>
          <span v-else>-</span>
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

        <template #item.nama_rekap="{ item }">
          {{ item.nama_rekap || "-" }}
        </template>

        <template #item.lampiran="{ item }">
          <PengeluaranLampiranList :items="item.lampiran" />
        </template>

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
                    $router.push(`/admin/pengeluaran/dosen-tatapmuka/edit/${item.id}`)
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
