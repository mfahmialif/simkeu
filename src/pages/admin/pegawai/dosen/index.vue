<script setup>
import { showSnackbar } from "@/composables/snackbar"
import PegawaiTable from "@/components/admin/pegawai/PegawaiTable.vue"

const tableKey = ref(0)
const userData = useCookie("userData").value ?? {}
const isAdmin = computed(() => String(userData.role?.name || "").toLowerCase() === "admin")
const isSyncDialogVisible = ref(false)
const isLoadingPreview = ref(false)
const isSyncing = ref(false)
const isSelectingAll = ref(false)
const previewInitialLoading = ref(true)
const previewRows = ref([])
const previewTotal = ref(0)
const previewPage = ref(1)
const previewItemsPerPage = ref(25)
const previewSearch = ref("")
const previewSortBy = ref({ key: "nama", order: "asc" })
const selectedRows = ref([])
const isAllFilteredSelected = ref(false)
const allFilteredSelectionTotal = ref(0)
const syncSummary = ref(null)
const syncRequestSize = 5000
const syncBackendBatchSize = 200

const syncProgress = ref({
  total: 0,
  processed: 0,
  batch: 0,
  batches: 0,
  created: 0,
  updated: 0,
  skipped: 0,
})

const previewHeaders = [
  { title: "No", key: "no", sortable: false, width: 70 },
  { title: "Nama", key: "nama" },
  { title: "Kode", key: "kode", width: 120 },
  { title: "NIDN", key: "nidn", width: 140 },
  { title: "Prodi", key: "prodi" },
  { title: "Email", key: "email" },
  { title: "Status Data", key: "exists", sortable: false, width: 150 },
]

const errorMessage = err => {
  const message =
    err?.data?.message ||
    err?.response?._data?.message ||
    err?.response?.data?.message ||
    err?.message

  if (typeof message === "object") {
    return Object.values(message).flat().join("; ")
  }

  return message || "Terjadi kesalahan."
}

const syncSummaryText = computed(() => {
  if (!syncSummary.value) return ""

  return `${syncSummary.value.synced || 0} diproses, ${
    syncSummary.value.created || 0
  } baru, ${syncSummary.value.updated || 0} diperbarui, ${
    syncSummary.value.skipped || 0
  } dilewati.`
})

const syncProgressPercent = computed(() => {
  if (!syncProgress.value.total) return 0

  return Math.min(
    100,
    Math.round((syncProgress.value.processed / syncProgress.value.total) * 100),
  )
})

const syncProgressText = computed(() => {
  if (!syncProgress.value.total) return ""

  return `${syncProgress.value.processed} dari ${syncProgress.value.total} data, batch ${syncProgress.value.batch} dari ${syncProgress.value.batches}.`
})

const selectedCount = computed(() => selectedRows.value.length)

const isSelectAllChecked = computed(() => (
  allFilteredSelectionTotal.value > 0 &&
  selectedCount.value >= allFilteredSelectionTotal.value
))

const isSelectAllIndeterminate = computed(() => selectedCount.value > 0 && !isSelectAllChecked.value)

const previewStatus = item => {
  if (!item.exists) {
    return {
      color: "info",
      label: "Baru",
    }
  }

  if (item.can_sync) {
    return {
      color: "success",
      label: "Sudah ada",
    }
  }

  return {
    color: "error",
    label: "Kode konflik",
  }
}

const siakadFilterBody = () => {
  const sort = previewSortBy.value || {}

  return {
    search: previewSearch.value,
    "order_by": sort.key || "nama",
    "order_dir": sort.order || "asc",
  }
}

const resetSelection = () => {
  selectedRows.value = []
  isAllFilteredSelected.value = false
  allFilteredSelectionTotal.value = 0
}

const resetSyncProgress = () => {
  syncProgress.value = {
    total: 0,
    processed: 0,
    batch: 0,
    batches: 0,
    created: 0,
    updated: 0,
    skipped: 0,
  }
}

const chunkArray = (items, size) => {
  const chunks = []

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }

  return chunks
}

const fetchSiakadPreview = async () => {
  try {
    isLoadingPreview.value = true

    const response = await $api("/admin/pegawai/dosen-siakad/preview", {
      method: "GET",
      body: {
        page: previewPage.value,
        "per_page": previewItemsPerPage.value,
        ...siakadFilterBody(),
      },
    })

    if (response.status === true) {
      previewRows.value = response.data?.data || []
      previewTotal.value = Number(response.data?.total || 0)

      return
    }

    showSnackbar({
      text: errorMessage(response),
      color: "error",
    })
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    isLoadingPreview.value = false
    previewInitialLoading.value = false
  }
}

const toggleSelectAllFiltered = async value => {
  if (!value) {
    resetSelection()

    return
  }

  try {
    isSelectingAll.value = true

    const response = await $api("/admin/pegawai/dosen-siakad/ids", {
      method: "GET",
      body: siakadFilterBody(),
    })

    if (response.status === true) {
      const ids = response.data?.ids || []

      selectedRows.value = ids.map(id => String(id))
      allFilteredSelectionTotal.value = Number(response.data?.total || selectedRows.value.length)
      isAllFilteredSelected.value = selectedRows.value.length > 0

      if (response.data?.skipped_conflict) {
        showSnackbar({
          text: `${response.data.skipped_conflict} data dilewati karena kode konflik.`,
          color: "warning",
        })
      }

      return
    }

    showSnackbar({
      text: errorMessage(response),
      color: "error",
    })
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    isSelectingAll.value = false
  }
}

const loadPreviewItems = ({ page, itemsPerPage, sortBy }) => {
  previewPage.value = page
  previewItemsPerPage.value = itemsPerPage
  previewSortBy.value = sortBy?.length
    ? sortBy[0]
    : { key: "nama", order: "asc" }
  fetchSiakadPreview()
}

const openSyncDialog = () => {
  resetSelection()
  resetSyncProgress()
  syncSummary.value = null
  previewRows.value = []
  previewTotal.value = 0
  previewPage.value = 1
  previewItemsPerPage.value = 25
  previewSearch.value = ""
  previewSortBy.value = { key: "nama", order: "asc" }
  previewInitialLoading.value = true
  isSyncDialogVisible.value = true
  fetchSiakadPreview()
}

const syncSelectedDosen = async () => {
  if (!selectedRows.value.length) return

  try {
    isSyncing.value = true
    syncSummary.value = null

    const ids = [...new Set(selectedRows.value.map(id => String(id)))]
    const batches = chunkArray(ids, syncRequestSize)

    const summary = {
      synced: 0,
      created: 0,
      updated: 0,
      skipped: 0,
    }

    syncProgress.value = {
      total: ids.length,
      processed: 0,
      batch: 0,
      batches: batches.length,
      created: 0,
      updated: 0,
      skipped: 0,
    }

    for (const [index, batchIds] of batches.entries()) {
      syncProgress.value.batch = index + 1

      const response = await $api("/admin/pegawai/sync-dosen-siakad", {
        method: "POST",
        body: {
          ids: batchIds,
          "batch_size": syncBackendBatchSize,
        },
      })

      if (response.status !== true) {
        throw new Error(errorMessage(response))
      }

      const data = response.data || {}

      summary.synced += Number(data.synced || 0)
      summary.created += Number(data.created || 0)
      summary.updated += Number(data.updated || 0)
      summary.skipped += Number(data.skipped || 0)

      syncProgress.value.processed = Math.min(
        ids.length,
        syncProgress.value.processed + batchIds.length,
      )
      syncProgress.value.created = summary.created
      syncProgress.value.updated = summary.updated
      syncProgress.value.skipped = summary.skipped

      await nextTick()
    }

    syncSummary.value = {
      ...summary,
      "batch_size": syncBackendBatchSize,
    }

    resetSelection()
    tableKey.value += 1
    showSnackbar({
      text: `Sinkronisasi dosen SIAKAD selesai. ${summary.synced} data diproses.`,
      color: "success",
    })
    fetchSiakadPreview()
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    isSyncing.value = false
  }
}

watch(previewSearch, () => {
  if (!isSyncDialogVisible.value) return

  resetSelection()
  previewPage.value = 1
  fetchSiakadPreview()
})

watch(
  selectedRows,
  value => {
    if (isSelectingAll.value) return

    if (!value.length) {
      isAllFilteredSelected.value = false
      allFilteredSelectionTotal.value = 0

      return
    }

    if (isAllFilteredSelected.value && value.length < allFilteredSelectionTotal.value) {
      isAllFilteredSelected.value = false
    }

    if (allFilteredSelectionTotal.value && value.length >= allFilteredSelectionTotal.value) {
      isAllFilteredSelected.value = true
    }
  },
  { deep: true },
)
</script>

<template>
  <div>
    <div v-if="isAdmin" class="d-flex justify-end mb-4">
      <VBtn
        color="primary"
        prepend-icon="ri-loop-right-line"
        @click="openSyncDialog"
      >
        Sinkronisasi SIAKAD
      </VBtn>
    </div>

    <PegawaiTable
      :key="tableKey"
      title="Dosen"
      fixed-tipe="dosen"
    />

    <VDialog
      v-if="isAdmin"
      v-model="isSyncDialogVisible"
      width="1120"
      scrollable
    >
      <VCard>
        <VCardItem class="pb-4">
          <VCardTitle>Sinkronisasi Dosen SIAKAD</VCardTitle>
        </VCardItem>

        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isSyncDialogVisible = false"
        />

        <VDivider />

        <VCardText>
          <div class="dosen-sync-toolbar d-flex flex-wrap align-center mb-4">
            <VTextField
              v-model="previewSearch"
              class="dosen-sync-search"
              placeholder="Search Data"
              density="compact"
              clearable
              clear-icon="ri-close-line"
            />

            <VSpacer />

            <VBtn
              variant="outlined"
              color="secondary"
              prepend-icon="ri-refresh-line"
              :loading="isLoadingPreview"
              @click="fetchSiakadPreview"
            >
              Refresh
            </VBtn>
          </div>

          <VAlert
            color="info"
            variant="tonal"
            prepend-icon="ri-information-line"
            class="mb-4"
          >
            <div class="font-weight-medium mb-1">
              Jika data sudah ada, sinkronisasi akan memperbarui 11 kolom pegawai dan 5 kolom dosen.
            </div>
            <div class="text-body-2">
              Acuan update: <strong>kode pegawai = kode dosen SIAKAD</strong>. Kolom pegawai yang diperbarui:
              nama, jenis_kelamin, tipe, tempat_lahir, tanggal_lahir, alamat, email, hp, nomer_rekening, bank, status.
              Kolom dosen yang diperbarui: kode, nidn, gelar_depan, gelar_belakang, prodi_id. Data dengan kode yang sudah dipakai tipe selain dosen akan dilewati.
            </div>
          </VAlert>

          <VAlert
            v-if="syncSummary"
            color="success"
            variant="tonal"
            class="mb-4"
          >
            {{ syncSummaryText }}
          </VAlert>

          <div
            v-if="isSyncing || syncProgress.total"
            class="dosen-sync-progress mb-4"
          >
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="font-weight-medium">
                Sinkronisasi batch
              </div>
              <div class="text-medium-emphasis">
                {{ syncProgressPercent }}%
              </div>
            </div>

            <VProgressLinear
              :model-value="syncProgressPercent"
              color="primary"
              height="10"
              rounded
            />

            <VProgressLinear
              v-if="isSyncing"
              indeterminate
              color="primary"
              height="3"
              rounded
              class="mt-2"
            />

            <div class="d-flex flex-wrap gap-4 text-caption text-medium-emphasis mt-2">
              <span>{{ syncProgressText }}</span>
              <span>Baru {{ syncProgress.created }}</span>
              <span>Diperbarui {{ syncProgress.updated }}</span>
              <span>Dilewati {{ syncProgress.skipped }}</span>
            </div>
          </div>

          <VDataTableServer
            v-model:model-value="selectedRows"
            v-model:items-per-page="previewItemsPerPage"
            v-model:page="previewPage"
            :headers="previewHeaders"
            show-select
            select-strategy="all"
            :items="previewRows"
            :items-length="previewTotal"
            :items-per-page-options="[10, 25, 50, 100]"
            :loading="isLoadingPreview || isSelectingAll"
            :search="previewSearch"
            item-value="id"
            class="text-no-wrap"
            @update:options="loadPreviewItems"
          >
            <template #header.data-table-select>
              <VCheckboxBtn
                :model-value="isSelectAllChecked"
                :indeterminate="isSelectAllIndeterminate"
                :disabled="isLoadingPreview || isSelectingAll || previewTotal === 0"
                @update:model-value="toggleSelectAllFiltered"
              />
            </template>

            <template
              v-if="previewInitialLoading"
              #loading
            >
              <div class="text-center pa-4">
                <VProgressCircular
                  indeterminate
                  color="primary"
                  class="mb-2"
                />
                <div>Memuat data dosen SIAKAD...</div>
              </div>
            </template>

            <template
              v-else
              #no-data
            >
              <div class="text-center pa-4">
                Tidak ada data dosen SIAKAD.
              </div>
            </template>

            <template #item.no="{ index }">
              {{ previewItemsPerPage * (previewPage - 1) + index + 1 }}
            </template>

            <template #item.nama="{ item }">
              <div class="d-flex flex-column">
                <span class="font-weight-medium">{{ item.nama }}</span>
                <small class="text-medium-emphasis">{{ item.email || "-" }}</small>
              </div>
            </template>

            <template #item.nidn="{ item }">
              {{ item.nidn || "-" }}
            </template>

            <template #item.prodi="{ item }">
              {{ item.prodi || "-" }}
            </template>

            <template #item.email="{ item }">
              {{ item.email || "-" }}
            </template>

            <template #item.exists="{ item }">
              <VChip
                :color="previewStatus(item).color"
                size="small"
                label
              >
                {{ previewStatus(item).label }}
              </VChip>
            </template>
          </VDataTableServer>
        </VCardText>

        <VDivider />

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <div
            v-if="selectedCount"
            class="dosen-sync-selected text-medium-emphasis"
          >
            {{ selectedCount }} data dipilih
          </div>

          <VBtn
            variant="outlined"
            color="secondary"
            @click="isSyncDialogVisible = false"
          >
            Tutup
          </VBtn>

          <VBtn
            color="primary"
            prepend-icon="ri-download-cloud-line"
            :loading="isSyncing"
            :disabled="isSyncing || selectedCount === 0"
            @click="syncSelectedDosen"
          >
            Sinkronkan Terpilih
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.dosen-sync-toolbar {
  gap: 12px;
}

.dosen-sync-search {
  max-inline-size: 360px;
  min-inline-size: 260px;
}

.dosen-sync-selected {
  display: flex;
  align-items: center;
  margin-inline-end: auto;
  min-block-size: 38px;
}

.dosen-sync-progress {
  border: 1px solid rgba(var(--v-theme-primary), 0.16);
  border-radius: 8px;
  background: rgba(var(--v-theme-primary), 0.04);
  padding: 14px 16px;
}

@media (max-width: 599px) {
  .dosen-sync-search {
    inline-size: 100%;
    max-inline-size: none;
  }
}
</style>
