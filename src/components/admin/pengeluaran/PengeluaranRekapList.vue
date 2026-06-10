<script setup>
import { formatRupiah } from "@/composables/formatRupiah";
import {
  listenPengeluaranRekapUpdated,
  notifyPengeluaranRekapUpdated,
} from "@/composables/pengeluaranRekap";
import { showSnackbar } from "@/composables/snackbar";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect/index.js";
import "flatpickr/dist/plugins/monthSelect/style.css";

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
  defaultExpanded: {
    type: Boolean,
    default: false,
  },
  allowRelease: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["updated"]);

const router = useRouter();
const page = ref(1);
const itemsPerPage = ref(5);
const search = ref("");
const filterTanggalMulai = ref(null);
const filterTanggalAkhir = ref(null);
const filterBulanTahun = ref(null);
const dataTable = ref([]);
const totalItems = ref(0);
const loading = ref(false);
const hasLoaded = ref(false);
const isExpanded = ref(props.defaultExpanded);
const dialog = ref(false);
const saving = ref(false);
const editingItem = ref(null);
const namaInput = ref(null);
const nama = ref("");
const keterangan = ref("");
const jumlahSementara = ref(0);
const currentDateValue = () => {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};
const tanggalRekap = ref(currentDateValue());
const currentMonthValue = () => {
  const date = new Date();

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};
const bulanTahun = ref(currentMonthValue());
const actionDialog = ref(false);
const actionItem = ref(null);
const actionType = ref(null);
const actionLoading = ref(false);
let searchTimer = null;
let stopListeningRekapUpdates = null;

const monthYearPickerConfig = {
  altInput: true,
  altFormat: "F Y",
  dateFormat: "Y-m",
  disableMobile: true,
  plugins: [
    monthSelectPlugin({
      shorthand: false,
      dateFormat: "Y-m",
      altFormat: "F Y",
    }),
  ],
};
const datePickerConfig = {
  altInput: true,
  altFormat: "d F Y",
  dateFormat: "Y-m-d",
  disableMobile: true,
};
const formatMonthYear = (value) => {
  const match = String(value || "").match(/^(\d{4})-(\d{2})/);

  if (!match) return "Tanpa periode";

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(Number(match[1]), Number(match[2]) - 1, 1));
};
const formatDate = (value) => {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!match) return "Tanggal belum diisi";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
};

const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value)),
);

const firstItem = computed(() =>
  totalItems.value ? (page.value - 1) * itemsPerPage.value + 1 : 0,
);

const lastItem = computed(() =>
  Math.min(page.value * itemsPerPage.value, totalItems.value),
);
const bulanTahunFilter = computed(() => {
  const match = String(filterBulanTahun.value || "").match(/^(\d{4})-(\d{2})/);

  if (!match) return {};

  return {
    tahun: match[1],
    bulan: match[2],
  };
});

const actionDialogTitle = computed(() => (
  actionType.value === "release"
    ? "Batalkan Rekap"
    : "Hapus Rekap"
));
const formDialogTitle = computed(() => (
  editingItem.value ? "Edit Data" : "Tambah Data"
));
const editingHasDetails = computed(() =>
  Number(editingItem.value?.jumlah_data || 0) > 0,
);
const canDeleteRekapWithDetails = computed(() =>
  props.endpoint === "/admin/pengeluaran/dosen-kegiatan",
);
const canDeleteRekap = item =>
  canDeleteRekapWithDetails.value || Number(item?.jumlah_data || 0) === 0;

const actionDialogMessage = computed(() => {
  if (actionType.value === "release") {
    return `Semua data dalam rekap "${actionItem.value?.nama || ""}" akan dikeluarkan dari rekap.`;
  }

  if (canDeleteRekapWithDetails.value && Number(actionItem.value?.jumlah_data || 0) > 0) {
    return `Rekap "${actionItem.value?.nama || ""}" beserta ${actionItem.value?.jumlah_data || 0} data pengeluaran di dalamnya akan dihapus permanen.`;
  }

  return `Rekap "${actionItem.value?.nama || ""}" akan dihapus permanen.`;
});

const openDetail = item => router.push(`${props.basePath}/rekap/${item.id}`);

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

const fetchData = async () => {
  try {
    loading.value = true;
    const response = await $api(`${props.endpoint}/rekap`, {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: "id",
        sort_order: "desc",
        search: search.value,
        ...bulanTahunFilter.value,
        ...(filterTanggalMulai.value && { tanggal_mulai: filterTanggalMulai.value }),
        ...(filterTanggalAkhir.value && { tanggal_akhir: filterTanggalAkhir.value }),
      },
    });

    dataTable.value = response.data.data;
    totalItems.value = response.data.total;
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    });
  } finally {
    loading.value = false;
    hasLoaded.value = true;
  }
};

const resetForm = () => {
  editingItem.value = null;
  nama.value = "";
  keterangan.value = "";
  jumlahSementara.value = 0;
  tanggalRekap.value = currentDateValue();
  bulanTahun.value = currentMonthValue();
};

const openCreateDialog = () => {
  resetForm();
  dialog.value = true;
};

const openEditDialog = (item) => {
  editingItem.value = item;
  nama.value = item.nama || "";
  bulanTahun.value = String(item.bulan_tahun || "").slice(0, 7);
  tanggalRekap.value = String(item.tanggal_rekap || "").slice(0, 10) || currentDateValue();
  jumlahSementara.value = Number(item.jumlah_sementara ?? item.jumlah ?? 0);
  keterangan.value = item.keterangan || "";
  dialog.value = true;
};

const saveRekap = async (openDetailInput = false) => {
  if (saving.value) return;

  const trimmedNama = nama.value.trim();

  if (!trimmedNama) {
    showSnackbar({
      text: "Nama rekap harus diisi.",
      color: "warning",
    });
    namaInput.value?.focus();
    return;
  }

  if (!tanggalRekap.value) {
    showSnackbar({
      text: "Tanggal rekap harus diisi.",
      color: "warning",
    });
    return;
  }

  const temporaryAmount = Number(jumlahSementara.value);

  if (!editingHasDetails.value && (
    jumlahSementara.value === ""
    || jumlahSementara.value === null
    || !Number.isFinite(temporaryAmount)
    || temporaryAmount < 0
  )) {
    showSnackbar({
      text: "Jumlah sementara harus diisi dengan nilai yang valid.",
      color: "warning",
    });
    return;
  }

  try {
    saving.value = true;
    const isEditing = !!editingItem.value;
    const response = await $api(
      isEditing
        ? `${props.endpoint}/rekap/${editingItem.value.id}`
        : `${props.endpoint}/rekap`,
      {
        method: isEditing ? "PUT" : "POST",
        body: {
          nama: trimmedNama,
          bulan_tahun: bulanTahun.value,
          tanggal_rekap: tanggalRekap.value,
          jumlah_sementara: editingHasDetails.value ? null : temporaryAmount,
          keterangan: keterangan.value,
        },
      },
    );

    if (response.status === true) {
      const createdRekapId = response.data?.id;

      dialog.value = false;
      if (!isEditing) page.value = 1;
      resetForm();
      notifyPengeluaranRekapUpdated(props.endpoint);
      showSnackbar({
        text: response.message,
        color: "success",
      });

      if (!isEditing && openDetailInput && createdRekapId) {
        router.push({
          path: `${props.basePath}/add`,
          query: {
            rekap_id: createdRekapId,
            return_to: `${props.basePath}/rekap/${createdRekapId}`,
          },
        });
      }
    }
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    });
  } finally {
    saving.value = false;
  }
};

const requestAction = (type, item) => {
  actionType.value = type;
  actionItem.value = item;
  actionDialog.value = true;
};

const confirmAction = async () => {
  if (!actionItem.value || actionLoading.value) return;

  try {
    actionLoading.value = true;
    const isRelease = actionType.value === "release";
    const response = await $api(
      isRelease
        ? `${props.endpoint}/rekap/${actionItem.value.id}/release`
        : `${props.endpoint}/rekap/${actionItem.value.id}`,
      {
        method: isRelease ? "POST" : "DELETE",
      },
    );

    if (response.status === true) {
      actionDialog.value = false;
      notifyPengeluaranRekapUpdated(props.endpoint);
      emit("updated");
      showSnackbar({
        text: response.message,
        color: "success",
      });
    }
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    });
  } finally {
    actionLoading.value = false;
  }
};

watch(search, () => {
  clearTimeout(searchTimer);
  page.value = 1;
  searchTimer = setTimeout(fetchData, 350);
});

watch([filterTanggalMulai, filterTanggalAkhir, filterBulanTahun], () => {
  page.value = 1;
  fetchData();
});

watch(page, fetchData);

watch(itemsPerPage, () => {
  if (page.value === 1) {
    fetchData();
    return;
  }

  page.value = 1;
});

onMounted(() => {
  fetchData();
  stopListeningRekapUpdates = listenPengeluaranRekapUpdated(
    props.endpoint,
    fetchData,
  );
});

onBeforeUnmount(() => {
  clearTimeout(searchTimer);
  stopListeningRekapUpdates?.();
});
</script>

<template>
  <VCard class="mb-6 rekap-panel">
    <VCardItem class="rekap-panel-header">
      <template #prepend>
        <div class="rekap-header-icon">
          <VIcon icon="ri-folder-chart-line" size="24" />
        </div>
      </template>

      <VCardTitle>Rekap {{ title }}</VCardTitle>
      <VCardSubtitle>
        {{ totalItems }} rekap tersimpan
      </VCardSubtitle>

      <template #append>
        <div class="rekap-header-actions">
          <VBtn
            color="primary"
            prepend-icon="ri-add-line"
            @click="openCreateDialog"
          >
            Tambah Data
          </VBtn>

          <VTooltip
            :text="isExpanded ? 'Tutup daftar rekap' : 'Buka daftar rekap'"
            location="top"
          >
            <template #activator="{ props: tooltipProps }">
              <VBtn
                v-bind="tooltipProps"
                :aria-expanded="isExpanded"
                :aria-label="isExpanded ? 'Tutup daftar rekap' : 'Buka daftar rekap'"
                :icon="isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"
                class="rekap-toggle-btn"
                variant="text"
                color="secondary"
                @click="isExpanded = !isExpanded"
              />
            </template>
          </VTooltip>
        </div>
      </template>
    </VCardItem>

    <VExpandTransition>
      <div v-show="isExpanded">
        <VDivider />

        <VCardText class="rekap-toolbar">
          <VTextField
            v-model="search"
            placeholder="Cari nama atau keterangan rekap"
            prepend-inner-icon="ri-search-line"
            density="compact"
            clearable
            clear-icon="ri-close-line"
            hide-details
          />

          <AppDateTimePicker
            v-model="filterTanggalMulai"
            label="Dari Tanggal"
            placeholder="Pilih tanggal awal"
            hide-details
            clearable
            clear-icon="ri-close-line"
            :config="datePickerConfig"
          />

          <AppDateTimePicker
            v-model="filterTanggalAkhir"
            label="Sampai Tanggal"
            placeholder="Pilih tanggal akhir"
            hide-details
            clearable
            clear-icon="ri-close-line"
            :config="datePickerConfig"
          />

          <AppDateTimePicker
            v-model="filterBulanTahun"
            label="Bulan/Tahun"
            placeholder="Pilih bulan"
            hide-details
            clearable
            clear-icon="ri-close-line"
            :config="monthYearPickerConfig"
          />
        </VCardText>

        <div class="rekap-list-wrap" :class="{ 'is-refreshing': loading && dataTable.length }">
          <VProgressLinear
            v-if="loading && dataTable.length"
            indeterminate
            color="primary"
            height="2"
            class="rekap-refresh-indicator"
          />

          <template v-if="loading && !hasLoaded">
            <div
              v-for="index in 3"
              :key="index"
              class="rekap-list-item rekap-list-skeleton"
            >
              <VSkeletonLoader type="avatar" />
              <div class="flex-grow-1">
                <VSkeletonLoader type="heading, text" />
              </div>
              <VSkeletonLoader class="rekap-skeleton-value" type="text" />
            </div>
          </template>

          <div v-else-if="!dataTable.length" class="rekap-empty">
            <div class="rekap-empty-icon">
              <VIcon icon="ri-folder-open-line" size="30" />
            </div>
            <div class="text-subtitle-1 font-weight-semibold">
              {{ search ? "Rekap tidak ditemukan" : "Belum ada rekap" }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{ search ? "Coba gunakan kata pencarian lain." : "Tambahkan rekap untuk mulai mengelompokkan pengeluaran." }}
            </div>
          </div>

          <div v-else class="rekap-list" role="list">
            <div
              v-for="(item, index) in dataTable"
              :key="item.id"
              class="rekap-list-item"
              role="listitem"
              tabindex="0"
              :aria-label="`Lihat detail rekap ${item.nama}`"
              @click="openDetail(item)"
              @keydown.enter.prevent="openDetail(item)"
            >
              <div class="rekap-item-number">
                {{ (page - 1) * itemsPerPage + index + 1 }}
              </div>

              <div class="rekap-item-main">
                <div class="rekap-item-heading">
                  <span class="rekap-item-name">{{ item.nama }}</span>
                  <VChip
                    size="x-small"
                    color="primary"
                    variant="tonal"
                    label
                  >
                    {{ formatMonthYear(item.bulan_tahun) }}
                  </VChip>
                  <VChip
                    size="x-small"
                    color="secondary"
                    variant="tonal"
                    label
                  >
                    {{ formatDate(item.tanggal_rekap) }}
                  </VChip>
                </div>

                <div class="rekap-item-note">
                  {{ item.keterangan || "Tanpa keterangan" }}
                </div>
                <div
                  v-if="item.jumlah_sementara !== null && Number(item.jumlah_data || 0) > 0"
                  class="rekap-item-sync"
                >
                  Total detail masih kurang
                  {{ formatRupiah(item.selisih_sementara || 0) }}
                  dari target sementara {{ formatRupiah(item.jumlah_sementara) }}.
                </div>
              </div>

              <div class="rekap-item-stats">
                <div class="rekap-item-stat">
                  <span>Data</span>
                  <strong>{{ item.jumlah_data || 0 }}</strong>
                </div>
                <div class="rekap-item-stat rekap-item-total">
                  <span>Jumlah RAB</span>
                  <strong>{{ formatRupiah(item.jumlah || 0) }}</strong>
                  <small>{{ item.is_jumlah_sementara ? "Sementara" : "Dari detail" }}</small>
                </div>
              </div>

              <div class="rekap-item-actions" @click.stop @keydown.stop>
                <VTooltip text="Edit rekap" location="top">
                  <template #activator="{ props: tooltipProps }">
                    <VBtn
                      v-bind="tooltipProps"
                      icon="ri-edit-line"
                      size="small"
                      variant="text"
                      color="primary"
                      @click="openEditDialog(item)"
                    />
                  </template>
                </VTooltip>

                <VTooltip v-if="allowRelease" text="Batalkan semua data dari rekap" location="top">
                  <template #activator="{ props: tooltipProps }">
                    <VBtn
                      v-bind="tooltipProps"
                      icon="ri-link-unlink-m"
                      size="small"
                      variant="text"
                      color="warning"
                      :disabled="Number(item.jumlah_data || 0) === 0"
                      @click="requestAction('release', item)"
                    />
                  </template>
                </VTooltip>

                <VTooltip
                  :text="canDeleteRekap(item)
                    ? 'Hapus rekap'
                    : 'Rekap hanya dapat dihapus ketika jumlah data 0'"
                  location="top"
                >
                  <template #activator="{ props: tooltipProps }">
                    <span v-bind="tooltipProps">
                      <VBtn
                        icon="ri-delete-bin-line"
                        size="small"
                        variant="text"
                        color="error"
                        :disabled="!canDeleteRekap(item)"
                        @click="requestAction('delete', item)"
                      />
                    </span>
                  </template>
                </VTooltip>

                <VTooltip text="Lihat detail rekap" location="top">
                  <template #activator="{ props: tooltipProps }">
                    <VIcon
                      v-bind="tooltipProps"
                      class="rekap-item-arrow"
                      icon="ri-arrow-right-s-line"
                      size="24"
                    />
                  </template>
                </VTooltip>
              </div>
            </div>
          </div>
        </div>

        <template v-if="totalItems">
          <VDivider />

          <div class="rekap-pagination">
            <div class="rekap-pagination-info text-body-2 text-medium-emphasis">
              {{ firstItem }}-{{ lastItem }} dari {{ totalItems }} rekap
            </div>

            <div class="rekap-pagination-controls">
              <VSelect
                v-model="itemsPerPage"
                :items="[5, 10, 20]"
                density="compact"
                hide-details
                aria-label="Jumlah rekap per halaman"
                class="rekap-page-size"
              />

              <VPagination
                v-model="page"
                :length="totalPages"
                :total-visible="5"
                density="compact"
              />
            </div>
          </div>
        </template>
      </div>
    </VExpandTransition>

    <VDialog
      v-model="dialog"
      width="640"
      @after-enter="namaInput?.focus()"
    >
      <VCard :title="formDialogTitle">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="dialog = false"
        />

        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField
                ref="namaInput"
                v-model="nama"
                label="Nama Rekap *"
                :rules="[requiredValidator]"
                autofocus
                hint="Wajib diisi"
                persistent-hint
                @keydown.enter.prevent="saveRekap"
              />
            </VCol>

            <VCol cols="12" md="6">
              <AppDateTimePicker
                v-model="tanggalRekap"
                label="Tanggal Rekap *"
                placeholder="Pilih tanggal rekap"
                prepend-inner-icon="ri-calendar-event-line"
                :config="datePickerConfig"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField
                v-model="jumlahSementara"
                :label="editingHasDetails ? 'Jumlah RAB dari Detail' : 'Jumlah Sementara *'"
                type="number"
                min="0"
                prefix="Rp"
                :disabled="editingHasDetails"
                :hint="editingHasDetails
                  ? 'Jumlah dihitung otomatis dari total data pengeluaran.'
                  : `${formatRupiah(jumlahSementara)} - dipakai sampai detail tersedia`"
                persistent-hint
                :rules="editingHasDetails ? [] : [requiredValidator]"
              />
            </VCol>

            <VCol cols="12">
              <AppDateTimePicker
                v-model="bulanTahun"
                label="Bulan dan Tahun *"
                placeholder="Pilih bulan dan tahun"
                prepend-inner-icon="ri-calendar-line"
                :config="monthYearPickerConfig"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol cols="12">
              <VTextarea
                v-model="keterangan"
                label="Keterangan (Opsional)"
                hint="Tidak wajib diisi"
                persistent-hint
                auto-grow
              />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="rekap-dialog-actions">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="dialog = false"
          >
            Batal
          </VBtn>
          <VBtn
            v-if="!editingItem"
            variant="tonal"
            color="primary"
            :loading="saving"
            :disabled="saving"
            @click="saveRekap(true)"
          >
            Simpan dan Inputkan Detail
          </VBtn>
          <VBtn
            color="primary"
            :loading="saving"
            :disabled="saving"
            @click="saveRekap"
          >
            {{ editingItem ? "Simpan Perubahan" : "Simpan" }}
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <VDialog v-model="actionDialog" width="500">
      <VCard :title="actionDialogTitle">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="actionDialog = false"
        />

        <VCardText>
          {{ actionDialogMessage }}
        </VCardText>

        <VCardText class="d-flex justify-end gap-3">
          <VBtn
            variant="outlined"
            color="secondary"
            :disabled="actionLoading"
            @click="actionDialog = false"
          >
            Kembali
          </VBtn>
          <VBtn
            :color="actionType === 'release' ? 'warning' : 'error'"
            :prepend-icon="actionType === 'release' ? 'ri-link-unlink-m' : 'ri-delete-bin-line'"
            :loading="actionLoading"
            :disabled="actionLoading"
            @click="confirmAction"
          >
            {{ actionType === "release" ? "Batalkan Rekap" : "Hapus Rekap" }}
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </VCard>
</template>

<style scoped>
.rekap-panel {
  overflow: hidden;
}

.rekap-panel-header {
  padding: 18px 20px;
}

.rekap-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rekap-dialog-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
}

.rekap-header-icon,
.rekap-empty-icon {
  display: grid;
  color: rgb(var(--v-theme-primary));
  place-items: center;
}

.rekap-header-icon {
  inline-size: 42px;
  block-size: 42px;
  border: 1px solid rgba(var(--v-theme-primary), 0.24);
  border-radius: 8px;
  background: rgba(var(--v-theme-primary), 0.08);
}

.rekap-toolbar {
  display: grid;
  padding-block: 14px;
  gap: 12px;
  grid-template-columns: minmax(220px, 1.4fr) repeat(3, minmax(170px, 1fr));
}

.rekap-toolbar :deep(.v-input) {
  min-inline-size: 0;
}

@media (max-width: 959px) {
  .rekap-toolbar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 599px) {
  .rekap-toolbar {
    grid-template-columns: 1fr;
  }

  .rekap-dialog-actions :deep(.v-btn) {
    flex: 1 1 100%;
  }
}

.rekap-list-wrap {
  position: relative;
  min-block-size: 130px;
}

.rekap-refresh-indicator {
  position: absolute;
  z-index: 1;
  inset-block-start: 0;
  inset-inline: 0;
}

.rekap-list-wrap.is-refreshing .rekap-list {
  opacity: 0.72;
  pointer-events: none;
  transition: opacity 160ms ease;
}

.rekap-list {
  display: grid;
}

.rekap-list-item {
  display: grid;
  inline-size: 100%;
  min-block-size: 92px;
  grid-template-columns: 46px minmax(0, 1fr) auto auto;
  align-items: center;
  border: 0;
  border-block-start: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding: 16px 20px;
  background: transparent;
  color: inherit;
  column-gap: 16px;
  cursor: pointer;
  font: inherit;
  text-align: start;
  transition: background-color 160ms ease;
}

.rekap-list-item:hover,
.rekap-list-item:focus-visible {
  background: rgba(var(--v-theme-primary), 0.045);
  outline: none;
}

.rekap-list-item:hover .rekap-item-arrow,
.rekap-list-item:focus-visible .rekap-item-arrow {
  color: rgb(var(--v-theme-primary));
  transform: translateX(3px);
}

.rekap-item-number {
  display: grid;
  inline-size: 44px;
  block-size: 44px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  background: rgba(var(--v-theme-on-surface), 0.035);
  color: rgb(var(--v-theme-primary));
  font-size: 0.9rem;
  font-weight: 700;
  place-items: center;
}

.rekap-item-main {
  min-inline-size: 0;
}

.rekap-item-heading {
  display: flex;
  min-inline-size: 0;
  align-items: center;
  gap: 12px;
}

.rekap-item-name {
  overflow: hidden;
  font-size: 0.95rem;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rekap-item-note {
  overflow: hidden;
  margin-block-start: 5px;
  color: rgba(var(--v-theme-on-surface), 0.62);
  font-size: 0.8125rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rekap-item-sync {
  margin-block-start: 5px;
  color: rgb(var(--v-theme-warning));
  font-size: 0.75rem;
  font-weight: 600;
}

.rekap-item-stats {
  display: grid;
  grid-template-columns: 60px minmax(135px, auto);
  gap: 20px;
}

.rekap-item-stat {
  display: grid;
  gap: 3px;
}

.rekap-item-stat span {
  color: rgba(var(--v-theme-on-surface), 0.56);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.rekap-item-stat strong {
  font-size: 0.9rem;
  font-weight: 650;
}

.rekap-item-stat small {
  color: rgba(var(--v-theme-on-surface), 0.52);
  font-size: 0.68rem;
}

.rekap-item-total {
  text-align: end;
}

.rekap-item-total strong {
  color: rgb(var(--v-theme-primary));
}

.rekap-item-arrow {
  color: rgba(var(--v-theme-on-surface), 0.42);
  transition: color 160ms ease, transform 160ms ease;
}

.rekap-item-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.rekap-empty {
  display: grid;
  min-block-size: 210px;
  place-content: center;
  justify-items: center;
  padding: 24px;
  text-align: center;
}

.rekap-empty-icon {
  inline-size: 58px;
  block-size: 58px;
  border-radius: 50%;
  margin-block-end: 12px;
  background: rgba(var(--v-theme-primary), 0.08);
}

.rekap-list-skeleton {
  cursor: default;
}

.rekap-list-skeleton:hover {
  background: transparent;
}

.rekap-skeleton-value {
  inline-size: 170px;
}

.rekap-pagination {
  display: flex;
  min-block-size: 64px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  gap: 16px;
}

.rekap-page-size {
  inline-size: 76px;
}

.rekap-pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  min-inline-size: 0;
}

@media (max-width: 959px) {
  .rekap-list-item {
    grid-template-columns: 44px minmax(0, 1fr) auto;
  }

  .rekap-item-stats {
    grid-column: 2 / 3;
    grid-template-columns: 60px minmax(130px, 1fr);
    margin-block-start: 12px;
  }

  .rekap-item-total {
    text-align: start;
  }

  .rekap-item-actions {
    grid-column: 3;
    grid-row: 1;
  }
}

@media (max-width: 599px) {
  .rekap-panel-header {
    align-items: flex-start;
  }

  .rekap-panel-header :deep(.v-card-item__append) {
    align-self: center;
    margin-inline-start: 8px;
  }

  .rekap-header-actions {
    gap: 2px;
  }

  .rekap-panel-header :deep(.v-btn__content) {
    display: none;
  }

  .rekap-panel-header :deep(.rekap-toggle-btn .v-btn__content) {
    display: flex;
  }

  .rekap-panel-header :deep(.v-btn) {
    inline-size: 40px;
    min-inline-size: 40px;
    padding-inline: 0;
  }

  .rekap-panel-header :deep(.rekap-toggle-btn) {
    background: rgba(var(--v-theme-primary), 0.08);
    color: rgb(var(--v-theme-primary)) !important;
  }

  .rekap-panel-header :deep(.v-btn__prepend) {
    margin: 0;
  }

  .rekap-list-item {
    grid-template-columns: minmax(0, 1fr) 34px;
    align-items: flex-start;
    padding: 15px 14px;
    column-gap: 12px;
  }

  .rekap-item-number {
    grid-column: 1;
    grid-row: 1;
    inline-size: 30px;
    block-size: 30px;
    align-self: start;
    border-radius: 999px;
    font-size: 0.8rem;
  }

  .rekap-item-main {
    grid-column: 1 / 2;
    grid-row: 2;
    padding-block-start: 8px;
    padding-inline-start: 0;
  }

  .rekap-item-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }

  .rekap-item-heading .v-chip {
    max-inline-size: 100%;
  }

  .rekap-item-name,
  .rekap-item-note {
    white-space: normal;
  }

  .rekap-item-name {
    font-size: 0.95rem;
    line-height: 1.35;
  }

  .rekap-item-note {
    margin-block-start: 8px;
    line-height: 1.35;
  }

  .rekap-item-sync {
    margin-block-start: 8px;
    font-size: 0.78rem;
    line-height: 1.35;
  }

  .rekap-item-stats {
    grid-column: 1 / 3;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin-block-start: 14px;
  }

  .rekap-item-stat {
    min-block-size: 64px;
    border: 1px solid rgba(var(--v-border-color), 0.12);
    border-radius: 10px;
    background: rgba(var(--v-theme-on-surface), 0.025);
    padding: 10px;
  }

  .rekap-item-total {
    text-align: start;
  }

  .rekap-item-total strong {
    overflow-wrap: anywhere;
  }

  .rekap-item-actions {
    grid-column: 2;
    grid-row: 1 / span 3;
    align-self: flex-start;
    flex-direction: column;
    gap: 6px;
  }

  .rekap-item-actions :deep(.v-btn) {
    inline-size: 30px;
    min-inline-size: 30px;
    block-size: 30px;
  }

  .rekap-item-arrow {
    margin-block-start: 2px;
  }

  .rekap-pagination {
    align-items: stretch;
    flex-direction: column;
    padding: 12px 14px;
    gap: 12px;
  }

  .rekap-pagination-info {
    text-align: center;
  }

  .rekap-pagination-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
    inline-size: 100%;
  }

  .rekap-page-size {
    order: -1;
    inline-size: 84px;
  }

  .rekap-pagination-controls :deep(.v-pagination) {
    flex: 1 1 100%;
    min-inline-size: 0;
    justify-content: center;
  }

  .rekap-pagination-controls :deep(.v-pagination__list) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
  }

  .rekap-pagination-controls :deep(.v-pagination__item),
  .rekap-pagination-controls :deep(.v-pagination__first),
  .rekap-pagination-controls :deep(.v-pagination__prev),
  .rekap-pagination-controls :deep(.v-pagination__next),
  .rekap-pagination-controls :deep(.v-pagination__last) {
    margin: 0;
  }

  .rekap-pagination-controls :deep(.v-btn) {
    min-inline-size: 34px;
    inline-size: 34px;
    block-size: 34px;
  }

  .rekap-pagination-controls :deep(.v-pagination__item--is-active .v-btn) {
    min-inline-size: 36px;
    inline-size: 36px;
  }
}
</style>
