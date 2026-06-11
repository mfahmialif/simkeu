<script setup>
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect/index.js";
import "flatpickr/dist/plugins/monthSelect/style.css";
import PengeluaranLampiranList from "@/components/admin/pengeluaran/PengeluaranLampiranList.vue";
import PengeluaranStatCards from "@/components/admin/pengeluaran/PengeluaranStatCards.vue";
import PengeluaranRekapBulkUpdate from "@/components/admin/pengeluaran/PengeluaranRekapBulkUpdate.vue";
import PengeluaranRekapList from "@/components/admin/pengeluaran/PengeluaranRekapList.vue";
import PengeluaranPetugasFilter from "@/components/admin/pengeluaran/PengeluaranPetugasFilter.vue";
import PengeluaranRekapSelect from "@/components/admin/pengeluaran/PengeluaranRekapSelect.vue";
import { downloadFileExport } from "@/composables/exportFile";
import { formatRupiah } from "@/composables/formatRupiah";
import { defaultPetugasPengeluaranId, fetchPetugasPengeluaranOptions } from "@/composables/petugasPengeluaran";
import { copyTextToClipboard } from "@/utils/clipboard";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  basePath: {
    type: String,
    required: true,
  },
  showPeriod: {
    type: Boolean,
    default: false,
  },
});
const isDosenBulanan = computed(() => props.endpoint.includes("dosen-bulanan"));

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
const periodeBulanTahun = ref(null);
const selectedRekapId = ref(null);
const selectedPetugasId = ref(null);
const petugasList = ref([]);
const selectAllPages = ref(false);
const isLoadingExcel = ref(false);
const isLoadingBsiExcel = ref(false);
const isLoadingBsiCopy = ref(false);
const hasDateFilter = computed(() => !!(
  tanggalHarian.value
  || tanggalMulai.value
  || tanggalAkhir.value
));
const hasPeriodFilter = computed(() => !!periodeBulanTahun.value);
const hasContextFilter = computed(() => !!(
  selectedRekapId.value
  || hasDateFilter.value
  || hasPeriodFilter.value
));
const contextFilterTitle = computed(() => {
  if (selectedRekapId.value) return "Pengeluaran Sesuai Data Rekap";
  if (tanggalHarian.value) return "Pengeluaran Sesuai Tanggal";
  if (tanggalMulai.value || tanggalAkhir.value) {
    return "Pengeluaran Sesuai Rentang Tanggal";
  }

  return "Pengeluaran Sesuai Periode";
});

const filterModeOptions = [
  { title: "Harian", value: "harian" },
  { title: "Rentang Tanggal", value: "rentang" },
];

const monthYearPickerConfig = {
  altInput: true,
  altFormat: "F Y",
  dateFormat: "Y-m",
  plugins: [
    monthSelectPlugin({
      shorthand: false,
      dateFormat: "Y-m",
      altFormat: "F Y",
    }),
  ],
};

const dateFilterPayload = computed(() => {
  if (!props.showPeriod) return {};

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

const periodFilterPayload = computed(() => {
  if (!props.showPeriod || !periodeBulanTahun.value) return {};

  const period = String(periodeBulanTahun.value);
  const match = period.match(/^(\d{4})-(\d{1,2})/);

  if (match) {
    return {
      tahun: Number(match[1]),
      bulan: Number(match[2]),
    };
  }

  const date = new Date(period);

  if (Number.isNaN(date.getTime())) return {};

  return {
    tahun: date.getFullYear(),
    bulan: date.getMonth() + 1,
  };
});

const requestFilterPayload = computed(() => ({
  ...dateFilterPayload.value,
  ...periodFilterPayload.value,
  ...(selectedRekapId.value && { rekap_id: selectedRekapId.value }),
  ...(selectedPetugasId.value && { petugas_id: selectedPetugasId.value }),
}));
const rekapFilterPayload = computed(() => ({
  ...(selectedPetugasId.value && { petugas_id: selectedPetugasId.value }),
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

    const response = await $api(props.endpoint, {
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

const clearFilter = () => {
  tanggalHarian.value = null;
  tanggalMulai.value = null;
  tanggalAkhir.value = null;
  periodeBulanTahun.value = null;
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

const fetchPetugas = async () => {
  try {
    const items = await fetchPetugasPengeluaranOptions(
      isDosenBulanan.value ? "dosen_bulanan" : "staff_bulanan"
    );
    petugasList.value = items;

    if (!selectedPetugasId.value) {
      selectedPetugasId.value = defaultPetugasPengeluaranId(items);
    }
  } catch (err) {
    console.error("Failed to fetch petugas pengeluaran:", err);
  }
};

const exportExcel = async () => {
  try {
    isLoadingExcel.value = true;
    showSnackbar({
      text: "Loading...",
      color: "info",
    });

    const response = await $api(`${props.endpoint}/export-excel`, {
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

    downloadFileExport(response, `Laporan ${props.title}.xlsx`);
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

    const response = await $api(`${props.endpoint}/export-bsi`, {
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

    downloadFileExport(response, `CUS BSI ${props.title}.xlsx`);
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

    const response = await $api(`${props.endpoint}/copy-bsi`, {
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

const unitLabel = item => item.tipe_pegawai === "staff"
  ? item.jabatan_staff
  : item.nama_prodi_dosen;

const subtotalHarian = item => Number(item.barokah_harian || 0) * Number(item.hari || 0);
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

watch(search, () => {
  selectedRows.value = [];
  selectAllPages.value = false;
  page.value = 1;
  fetchData();
});

watch(filterMode, () => {
  tanggalHarian.value = null;
  tanggalMulai.value = null;
  tanggalAkhir.value = null;
  selectedRows.value = [];
  selectAllPages.value = false;
  page.value = 1;
  fetchData();
});

watch([tanggalHarian, tanggalMulai, tanggalAkhir, periodeBulanTahun, selectedRekapId, selectedPetugasId], () => {
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
  document.title = `${props.title} - SIMKEU`;
  fetchPetugas();
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

    <PengeluaranPetugasFilter
      v-model="selectedPetugasId"
      :items="petugasList"
    />

    <PengeluaranRekapList
      :title="title"
      :endpoint="endpoint"
      :base-path="basePath"
      :filters="rekapFilterPayload"
      @updated="clearBatchSelection"
    />

    <VRow
      v-if="showPeriod"
      class="mb-3 filter-controls-row"
    >
      <VCol
        cols="12"
        sm="6"
        md="2"
        class="filter-control-col"
      >
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
        sm="6"
        md="2"
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
        <VCol cols="12" sm="6" md="2" class="filter-control-col">
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

        <VCol cols="12" sm="6" md="2" class="filter-control-col">
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
        sm="6"
        md="2"
        class="filter-control-col"
      >
        <AppDateTimePicker
          v-model="periodeBulanTahun"
          label="Bulan/Tahun"
          placeholder="Pilih bulan dan tahun"
          hide-details
          :config="monthYearPickerConfig"
        />
      </VCol>

      <VCol
        cols="12"
        sm="6"
        :md="filterMode === 'harian' ? 4 : 2"
        class="filter-control-col filter-rekap-col"
      >
        <PengeluaranRekapSelect
          v-model="selectedRekapId"
          :endpoint="endpoint"
          label="Filter Rekap"
          :allow-create="false"
          :filters="rekapFilterPayload"
        />
      </VCol>

      <VCol
        cols="12"
        sm="6"
        md="2"
        class="filter-control-col"
      >
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

    <VRow
      v-else
      class="mb-3 filter-controls-row"
    >
      <VCol cols="12" md="10" class="filter-control-col">
        <PengeluaranRekapSelect
          v-model="selectedRekapId"
          :endpoint="endpoint"
          label="Filter Rekap"
          :allow-create="false"
          :filters="rekapFilterPayload"
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
      :endpoint="endpoint"
      :selected-ids="selectedIds"
      :total-items="totalItems"
      :filters="batchFilterPayload"
      @updated="clearBatchSelection"
    />

    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>{{ title }}</VCardTitle>
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
            clearable
            clear-icon="ri-close-line"
          />
        </div>

        <VSpacer />

        <div class="d-flex flex-wrap gap-3 align-center">
          <VBtn
            v-if="showPeriod"
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
            @click="$router.push(`${basePath}/add`)"
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
          ...(showPeriod ? [{ title: 'Periode', key: 'periode', sortable: false }] : []),
          { title: 'Pegawai', key: 'nama_pegawai' },
          { title: 'Rekap', key: 'nama_rekap' },
          ...(isDosenBulanan
            ? [
                { title: 'Dosen Tetap', key: 'barokah_dosen_tetap' },
                { title: 'Struktural', key: 'barokah_struktural' },
              ]
            : [
                { title: showPeriod ? 'Total Hari' : 'Hari', key: 'hari' },
                { title: 'Barokah Harian', key: 'barokah_harian' },
                { title: 'Subtotal Harian', key: 'subtotal_harian', sortable: false },
                { title: 'Barokah Bulanan', key: 'barokah_bulanan' },
              ]),
          { title: 'Total', key: 'total' },
          { title: 'Jenis Pembayaran', key: 'jenis_pembayaran' },
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

        <template #item.nama_pegawai="{ item }">
          <div class="font-weight-medium">
            {{ item.nama_pegawai || "-" }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ item.kode_pegawai || "-" }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ item.tipe_pegawai === "staff" ? "Staff" : "Dosen" }}
            <span v-if="unitLabel(item)"> - {{ unitLabel(item) }}</span>
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ item.jenis_kelamin_pegawai || "-" }}
          </div>
        </template>

        <template #item.periode="{ item }">
          {{ monthName(item.bulan) }} {{ item.tahun || "" }}
        </template>

        <template #item.nama_rekap="{ item }">
          {{ item.nama_rekap || "-" }}
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

        <template #item.barokah_dosen_tetap="{ item }">
          {{ formatRupiah(item.barokah_dosen_tetap) }}
        </template>

        <template #item.barokah_struktural="{ item }">
          {{ formatRupiah(item.barokah_struktural) }}
        </template>

        <template #item.total="{ item }">
          {{ formatRupiah(item.total) }}
        </template>

        <template #item.jenis_pembayaran="{ item }">
          <div
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
              v-if="!isDosenBulanan && item.jenis_pembayaran === 'Transfer' && item.bukti_transfer_url"
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
        </template>

        <template #item.keterangan="{ item }">
          {{ item.keterangan || "-" }}
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
