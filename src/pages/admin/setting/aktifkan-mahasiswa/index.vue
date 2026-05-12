<script setup>
const router = useRouter();

const userData = useCookie("userData").value ?? {};
const isAdmin = computed(() => (userData.role?.name || "").toLowerCase() === "admin");

const thAkademikList = ref([]);
const selectedThAkademik = ref(null);
const mahasiswaRows = ref([]);
const loadingThAkademik = ref(false);
const loadingPreview = ref(false);
const activating = ref(false);
const processedCount = ref(0);
const successCount = ref(0);
const failedCount = ref(0);
const skippedCount = ref(0);
const activationTargetCount = ref(0);
const selectedNims = ref([]);
const tableSearchInput = ref("");
const tableSearch = ref("");
const batchSize = 10;
const searchDebounceDelay = 250;

let searchDebounceTimer = null;

const headers = [
  { title: "NIM", key: "nim", minWidth: 130 },
  { title: "Prodi", key: "prodi", minWidth: 240 },
];

const selectedThAkademikLabel = computed(() => {
  return thAkademikList.value.find((item) => item.value === selectedThAkademik.value)?.title || "-";
});

const searchText = computed(() => tableSearch.value.trim().toLowerCase());
const searchInputText = computed(() => tableSearchInput.value.trim().toLowerCase());

const filteredMahasiswaRows = computed(() => {
  if (!searchText.value) return mahasiswaRows.value;

  return mahasiswaRows.value.filter((row) => {
    const searchable = row.search_text || `${row.nim || ""} ${row.prodi || ""}`.toLowerCase();

    return searchable.includes(searchText.value);
  });
});

const selectedNimValues = computed(() => {
  return selectedNims.value
    .map((item) => (typeof item === "object" ? item?.nim : item))
    .filter(Boolean);
});

const selectedNimSet = computed(() => new Set(selectedNimValues.value));

const selectedCount = computed(() => selectedNimSet.value.size);

const selectedVisibleCount = computed(() => {
  return filteredMahasiswaRows.value.filter((row) => selectedNimSet.value.has(row.nim)).length;
});

const progressPercent = computed(() => {
  if (!activationTargetCount.value) return 0;
  return Math.round((processedCount.value / activationTargetCount.value) * 100);
});

const canActivate = computed(() => {
  return isAdmin.value && selectedCount.value > 0 && !loadingPreview.value && !activating.value;
});

const getErrorMessage = (error) => {
  const message = error?.data?.message || error?.message;

  if (Array.isArray(message)) return message.join("; ");
  if (message && typeof message === "object") return Object.values(message).flat().join("; ");

  return message || "Terjadi kesalahan.";
};

const clearSearchDebounce = () => {
  if (!searchDebounceTimer) return;

  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = null;
};

const resetTableSearch = () => {
  clearSearchDebounce();
  tableSearchInput.value = "";
  tableSearch.value = "";
};

const flushTableSearch = () => {
  clearSearchDebounce();
  tableSearch.value = tableSearchInput.value;
};

const fetchThAkademik = async () => {
  try {
    loadingThAkademik.value = true;
    const { data } = await $api("/admin/th-akademik", {
      method: "GET",
      body: {
        limit: 100,
        sort_key: "id",
        sort_order: "desc",
      },
    });

    thAkademikList.value = (data?.data || []).map((item) => ({
      title: `${item.kode} - ${item.nama} (${item.semester})${item.aktif === "Y" ? " - Aktif" : ""}`,
      value: item.id,
      aktif: item.aktif,
    }));

    const activeItem = thAkademikList.value.find((item) => item.aktif === "Y");
    if (activeItem) selectedThAkademik.value = activeItem.value;
  } catch (error) {
    showSnackbar({
      text: getErrorMessage(error),
      color: "error",
    });
  } finally {
    loadingThAkademik.value = false;
  }
};

const resetActivationState = () => {
  processedCount.value = 0;
  successCount.value = 0;
  failedCount.value = 0;
  skippedCount.value = 0;
  activationTargetCount.value = 0;
};

const selectFilteredRows = () => {
  flushTableSearch();

  const nextSelected = new Set(selectedNimValues.value);

  filteredMahasiswaRows.value.forEach((row) => {
    if (row.nim) nextSelected.add(row.nim);
  });

  selectedNims.value = Array.from(nextSelected);
};

const clearSelectedRows = () => {
  selectedNims.value = [];
};

const previewMahasiswa = async () => {
  if (!selectedThAkademik.value) {
    showSnackbar({
      text: "Pilih tahun akademik terlebih dahulu.",
      color: "error",
    });
    return;
  }

  try {
    loadingPreview.value = true;
    resetActivationState();

    const response = await $api("/admin/aktifkan-mahasiswa/preview", {
      method: "GET",
      body: {
        th_akademik_id: selectedThAkademik.value,
      },
    });

    const uniqueRows = new Map();

    (response.data || []).forEach((item) => {
      const nim = String(item.nim || "").trim().toUpperCase();
      if (!nim || uniqueRows.has(nim)) return;

      uniqueRows.set(nim, {
        nim,
        prodi: item.prodi || "-",
        search_text: `${nim} ${item.prodi || "-"}`.toLowerCase(),
        activation_status: "pending",
        activation_message: "",
      });
    });

    mahasiswaRows.value = Array.from(uniqueRows.values());
    selectedNims.value = mahasiswaRows.value.map((item) => item.nim).filter(Boolean);
    resetTableSearch();

    showSnackbar({
      text: `${mahasiswaRows.value.length} NIM unik ditemukan.`,
      color: "success",
    });
  } catch (error) {
    mahasiswaRows.value = [];
    selectedNims.value = [];
    showSnackbar({
      text: getErrorMessage(error),
      color: "error",
    });
  } finally {
    loadingPreview.value = false;
  }
};

const applyBatchResult = (items, status) => {
  items.forEach((result) => {
    const row = mahasiswaRows.value.find((item) => item.nim === result.nim);
    if (!row) return;

    row.activation_status = status;
    row.activation_message = result.message || "";
  });
};

const activateMahasiswa = async () => {
  if (!canActivate.value) return;

  const rows = mahasiswaRows.value.filter((row) => selectedNimSet.value.has(row.nim));

  if (!rows.length) {
    showSnackbar({
      text: "Centang minimal satu mahasiswa yang akan diaktifkan.",
      color: "error",
    });
    return;
  }

  activating.value = true;
  resetActivationState();
  activationTargetCount.value = rows.length;

  for (let index = 0; index < rows.length; index += batchSize) {
    const batch = rows.slice(index, index + batchSize);

    batch.forEach((row) => {
      row.activation_status = "processing";
      row.activation_message = "";
    });

    try {
      const response = await $api("/admin/aktifkan-mahasiswa/activate", {
        method: "POST",
        body: {
          th_akademik_id: selectedThAkademik.value,
          nims: batch.map((item) => item.nim),
        },
      });

      applyBatchResult(response.data?.success || [], "success");
      applyBatchResult(response.data?.failed || [], "failed");
      applyBatchResult(response.data?.skipped || [], "skipped");

      successCount.value += response.summary?.success || 0;
      failedCount.value += response.summary?.failed || 0;
      skippedCount.value += response.summary?.skipped || 0;
      processedCount.value += batch.length;
    } catch (error) {
      const message = getErrorMessage(error);

      batch.forEach((row) => {
        row.activation_status = "failed";
        row.activation_message = message;
      });

      failedCount.value += batch.length;
      processedCount.value += batch.length;

      showSnackbar({
        text: message,
        color: "error",
      });
      break;
    }
  }

  activating.value = false;

  showSnackbar({
    text: `Selesai. Aktif: ${successCount.value}, gagal: ${failedCount.value}, dilewati: ${skippedCount.value}.`,
    color: failedCount.value ? "warning" : "success",
  });
};

onMounted(() => {
  document.title = "Aktifkan Mahasiswa - SIMKEU";

  if (!isAdmin.value) {
    router.replace({ name: "not-authorized" });
    return;
  }

  fetchThAkademik();
});

watch(tableSearchInput, (value) => {
  clearSearchDebounce();

  if (!value) {
    tableSearch.value = "";
    return;
  }

  searchDebounceTimer = setTimeout(() => {
    tableSearch.value = value;
    searchDebounceTimer = null;
  }, searchDebounceDelay);
});

watch(selectedThAkademik, () => {
  if (activating.value) return;

  mahasiswaRows.value = [];
  selectedNims.value = [];
  resetTableSearch();
  resetActivationState();
});

onBeforeUnmount(() => {
  clearSearchDebounce();
});
</script>

<template>
  <div>
    <VCard>
      <VCardItem class="pb-4">
        <template #prepend>
          <VAvatar
            color="primary"
            variant="tonal"
            rounded
          >
            <VIcon icon="ri-user-settings-line" />
          </VAvatar>
        </template>

        <VCardTitle>Aktifkan Mahasiswa</VCardTitle>
        <VCardSubtitle>
          Verifikasi pembayaran KRS-1/KRS-2 atau dispensasi sebelum status mahasiswa diaktifkan.
        </VCardSubtitle>
      </VCardItem>

      <VDivider />

      <VCardText>
        <div class="text-body-1">
          Data ditampilkan dahulu, bisa dicari dan dicentang, lalu diproses bertahap agar tidak timeout.
        </div>
      </VCardText>
    </VCard>

    <VCard class="mt-4">
      <VCardItem class="pb-3">
        <VCardTitle>Data Aktivasi Mahasiswa</VCardTitle>
        <VCardSubtitle>
          Pilih tahun akademik, cek daftar mahasiswa, lalu aktifkan hanya data yang dicentang.
        </VCardSubtitle>
      </VCardItem>

      <VDivider />

      <VCardText>
        <VRow>
          <VCol cols="12" md="8">
            <VSelect
              v-model="selectedThAkademik"
              label="Tahun Akademik"
              placeholder="Pilih tahun akademik"
              :items="thAkademikList"
              :loading="loadingThAkademik"
              :disabled="activating || loadingPreview"
              clearable
            />
          </VCol>

          <VCol cols="12" md="4" class="d-flex align-start">
            <VBtn
              block
              color="primary"
              prepend-icon="ri-search-line"
              :loading="loadingPreview"
              :disabled="activating"
              @click="previewMahasiswa"
            >
              Tampilkan Mahasiswa
            </VBtn>
          </VCol>
        </VRow>

        <VAlert
          v-if="mahasiswaRows.length"
          color="primary"
          variant="tonal"
          class="mt-2"
        >
          {{ mahasiswaRows.length }} NIM unik siap diverifikasi untuk {{ selectedThAkademikLabel }}.
          {{ selectedCount }} mahasiswa tercentang.
        </VAlert>

        <VProgressLinear
          v-if="activating || processedCount"
          class="mt-4"
          color="primary"
          height="8"
          rounded
          :model-value="progressPercent"
        />

        <div
          v-if="activating || processedCount"
          class="d-flex flex-wrap gap-3 mt-3"
        >
          <VChip color="primary" label>Diproses {{ processedCount }}/{{ activationTargetCount }}</VChip>
          <VChip color="success" label>Aktif {{ successCount }}</VChip>
          <VChip color="error" label>Gagal {{ failedCount }}</VChip>
          <VChip color="warning" label>Dilewati {{ skippedCount }}</VChip>
        </div>

        <div
          v-if="mahasiswaRows.length"
          class="activation-toolbar mt-4"
        >
          <VRow
            align="center"
            dense
          >
            <VCol cols="12" md="5">
              <VTextField
                v-model="tableSearchInput"
                density="compact"
                label="Cari mahasiswa"
                placeholder="NIM atau prodi"
                prepend-inner-icon="ri-search-line"
                clearable
                hide-details
                :disabled="activating"
              />
            </VCol>

            <VCol
              cols="12"
              md="7"
              class="d-flex flex-wrap gap-2 justify-md-end"
            >
              <VBtn
                color="primary"
                variant="tonal"
                prepend-icon="ri-checkbox-multiple-line"
                :disabled="!filteredMahasiswaRows.length || activating"
                @click="selectFilteredRows"
              >
                {{ searchInputText ? "Centang Hasil Cari" : "Centang Semua" }}
              </VBtn>

              <VBtn
                color="secondary"
                variant="text"
                prepend-icon="ri-checkbox-blank-line"
                :disabled="!selectedCount || activating"
                @click="clearSelectedRows"
              >
                Uncentang Semua
              </VBtn>
            </VCol>
          </VRow>

          <div class="text-caption text-medium-emphasis mt-2">
            Menampilkan {{ filteredMahasiswaRows.length }} dari {{ mahasiswaRows.length }} data.
            {{ selectedVisibleCount }} dari hasil tampil sedang tercentang, total {{ selectedCount }} mahasiswa dipilih.
          </div>
        </div>

        <VDataTable
          class="mt-4"
          v-model:model-value="selectedNims"
          :headers="headers"
          :items="filteredMahasiswaRows"
          :items-per-page="10"
          :loading="loadingPreview"
          :disabled="activating"
          item-value="nim"
          select-strategy="all"
          show-select
          fixed-header
          height="520"
        >
          <template #loading>
            <div class="text-center pa-4">
              <VProgressCircular indeterminate color="primary" class="mb-2" />
              <div>Memuat data mahasiswa...</div>
            </div>
          </template>

          <template #no-data>
            <div class="text-center pa-4">
              {{ mahasiswaRows.length ? "Tidak ada mahasiswa sesuai pencarian." : "Pilih tahun akademik lalu tampilkan mahasiswa." }}
            </div>
          </template>

          <template #item.prodi="{ item }">
            {{ item.prodi || "-" }}
          </template>
        </VDataTable>
      </VCardText>

      <VDivider />

      <VCardText class="activation-footer">
        <div class="activation-footer__summary">
          <div class="font-weight-medium">
            {{ selectedCount }} mahasiswa dipilih
          </div>
          <div class="text-caption text-medium-emphasis">
            Proses berjalan per {{ batchSize }} data.
          </div>
        </div>

        <VBtn
          color="success"
          prepend-icon="ri-user-follow-line"
          :loading="activating"
          :disabled="!canActivate"
          @click="activateMahasiswa"
        >
          Aktifkan Terpilih
        </VBtn>
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
.activation-toolbar {
  border: 1px solid rgba(var(--v-theme-primary), 0.16);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(var(--v-theme-primary), 0.07), rgba(var(--v-theme-surface), 0.96) 58%),
    rgb(var(--v-theme-surface));
  box-shadow: 0 2px 10px rgba(var(--v-theme-on-surface), 0.04);
  padding: 12px;
}

:global(.v-theme--dark) .activation-toolbar {
  border-color: rgba(var(--v-theme-primary), 0.28);
  background:
    linear-gradient(135deg, rgba(var(--v-theme-primary), 0.16), rgba(var(--v-theme-surface), 0.9) 62%),
    rgb(var(--v-theme-surface));
  box-shadow: none;
}

.activation-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.activation-footer__summary {
  min-inline-size: 180px;
}

@media (max-width: 600px) {
  .activation-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .activation-footer__summary {
    min-inline-size: 0;
  }
}
</style>
