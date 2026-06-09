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
});

const emit = defineEmits(["updated"]);

const router = useRouter();
const page = ref(1);
const itemsPerPage = ref(5);
const search = ref("");
const dataTable = ref([]);
const totalItems = ref(0);
const loading = ref(false);
const isExpanded = ref(false);
const dialog = ref(false);
const saving = ref(false);
const namaInput = ref(null);
const nama = ref("");
const keterangan = ref("");
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
const formatMonthYear = (value) => {
  const match = String(value || "").match(/^(\d{4})-(\d{2})/);

  if (!match) return "Tanpa periode";

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(Number(match[1]), Number(match[2]) - 1, 1));
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

const actionDialogTitle = computed(() => (
  actionType.value === "release"
    ? "Batalkan Rekap"
    : "Hapus Rekap"
));

const actionDialogMessage = computed(() => {
  if (actionType.value === "release") {
    return `Semua data dalam rekap "${actionItem.value?.nama || ""}" akan dikeluarkan dari rekap.`;
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
  }
};

const resetForm = () => {
  nama.value = "";
  keterangan.value = "";
  bulanTahun.value = currentMonthValue();
};

const createRekap = async () => {
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

  try {
    saving.value = true;
    const response = await $api(`${props.endpoint}/rekap`, {
      method: "POST",
      body: {
        nama: trimmedNama,
        bulan_tahun: bulanTahun.value,
        keterangan: keterangan.value,
      },
    });

    if (response.status === true) {
      dialog.value = false;
      resetForm();
      page.value = 1;
      notifyPengeluaranRekapUpdated(props.endpoint);
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
            @click="dialog = true"
          >
            Tambah Rekap
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
        </VCardText>

        <div class="rekap-list-wrap">
          <template v-if="loading">
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
              v-for="item in dataTable"
              :key="item.id"
              class="rekap-list-item"
              role="listitem"
              tabindex="0"
              :aria-label="`Lihat detail rekap ${item.nama}`"
              @click="openDetail(item)"
              @keydown.enter.prevent="openDetail(item)"
            >
              <div class="rekap-item-icon">
                <VIcon icon="ri-file-list-3-line" size="22" />
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
                </div>

                <div class="rekap-item-note">
                  {{ item.keterangan || "Tanpa keterangan" }}
                </div>
              </div>

              <div class="rekap-item-stats">
                <div class="rekap-item-stat">
                  <span>Data</span>
                  <strong>{{ item.jumlah_data || 0 }}</strong>
                </div>
                <div class="rekap-item-stat rekap-item-total">
                  <span>Total Pengeluaran</span>
                  <strong>{{ formatRupiah(item.total_pengeluaran || 0) }}</strong>
                </div>
              </div>

              <div class="rekap-item-actions" @click.stop @keydown.stop>
                <VTooltip text="Batalkan semua data dari rekap" location="top">
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
                  :text="Number(item.jumlah_data || 0) === 0
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
                        :disabled="Number(item.jumlah_data || 0) > 0"
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
            <div class="text-body-2 text-medium-emphasis">
              {{ firstItem }}-{{ lastItem }} dari {{ totalItems }} rekap
            </div>

            <div class="d-flex align-center gap-3">
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
      width="560"
      @after-enter="namaInput?.focus()"
    >
      <VCard title="Tambah Rekap">
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
                @keydown.enter.prevent="createRekap"
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

        <VCardText class="d-flex justify-end gap-3">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="dialog = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="primary"
            :loading="saving"
            :disabled="saving"
            @click="createRekap"
          >
            Simpan
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
  padding-block: 14px;
}

.rekap-toolbar :deep(.v-input) {
  max-inline-size: 420px;
}

.rekap-list-wrap {
  min-block-size: 130px;
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

.rekap-item-icon {
  display: grid;
  inline-size: 44px;
  block-size: 44px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  background: rgba(var(--v-theme-on-surface), 0.035);
  color: rgb(var(--v-theme-primary));
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

.rekap-item-stats {
  display: grid;
  grid-template-columns: 70px minmax(150px, auto);
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

.rekap-item-total {
  text-align: end;
}

.rekap-item-total strong {
  color: rgb(var(--v-theme-success));
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

@media (max-width: 959px) {
  .rekap-list-item {
    grid-template-columns: 44px minmax(0, 1fr) auto;
  }

  .rekap-item-stats {
    grid-column: 2 / 3;
    grid-template-columns: 70px minmax(140px, 1fr);
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

  .rekap-panel-header :deep(.v-btn) {
    inline-size: 40px;
    min-inline-size: 40px;
    padding-inline: 0;
  }

  .rekap-panel-header :deep(.v-btn__prepend) {
    margin: 0;
  }

  .rekap-list-item {
    padding: 15px 14px;
    column-gap: 12px;
  }

  .rekap-item-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .rekap-item-name,
  .rekap-item-note {
    white-space: normal;
  }

  .rekap-item-stats {
    grid-template-columns: 56px minmax(0, 1fr);
    gap: 12px;
  }

  .rekap-item-total strong {
    overflow-wrap: anywhere;
  }

  .rekap-pagination {
    align-items: stretch;
    flex-direction: column;
  }

  .rekap-pagination > .d-flex {
    justify-content: space-between;
  }
}
</style>
