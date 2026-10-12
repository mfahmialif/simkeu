<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { formatRupiah } from '@/composables/formatRupiah'
import { showSnackbar } from '@/composables/snackbar'

// --- State: Table & Pagination ---
const page = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref({ key: 'id', order: 'desc' })
const search = ref('')
const selectedRows = ref([])
const dataTable = ref([])
const totalItems = ref(0)
const loading = ref(false)
const initialLoading = ref(true)

// --- State: Filters ---
const selectedStatusSinkron = ref('all')
const selectedTanggal = ref('')
const selectedTanggalMulai = ref('')
const selectedTanggalAkhir = ref('')
const selectedJenisKelamin = ref('all')
const selectedJenisPembayaran = ref(null)
const selectedPeriode = ref(null)

// --- State: Filter Options ---
const jenisPembayaranList = ref([])
const periodeList = ref([])

// --- State: Statistics ---
const statistics = ref({
  total: { count: 0, amount: 0 },
  synced: { count: 0, amount: 0 },
  not_synced: { count: 0, amount: 0 },
  no_tagihan: { count: 0, amount: 0 },
})
const statisticsLoading = ref(false)

// --- State: Single Sync Dialog ---
const isSingleSyncDialogVisible = ref(false)
const singleSyncLoading = ref(false)
const singleSyncItem = ref(null)
const manualNim = ref('')

// --- State: Batch Sync Dialog ---
const isBatchSyncDialogVisible = ref(false)
const batchSyncMode = ref('selected') // 'selected' | 'all_unsynced'
const batchSyncLoading = ref(false)
const batchSyncSummary = ref(null)

// --- Options Constants ---
const statusSinkronOptions = [
  { title: 'Semua Status', value: 'all' },
  { title: 'Belum Sinkron', value: 'not_synced' },
  { title: 'Sudah Sinkron', value: 'synced' },
  { title: 'Belum Ada Tagihan', value: 'no_tagihan' },
]

const jenisKelaminOptions = [
  { title: 'Semua', value: 'all' },
  { title: 'Putra (Laki-Laki)', value: 'putra' },
  { title: 'Putri (Perempuan)', value: 'putri' },
]

// --- Table Headers ---
const headers = [
  { title: 'NO. NOTA & TANGGAL', key: 'nomor', sortable: true },
  { title: 'MAHASISWA', key: 'mahasiswa', sortable: false },
  { title: 'KRS / PERIODE', key: 'krs', sortable: true },
  { title: 'METODE & JK', key: 'metode', sortable: false },
  { title: 'NOMINAL', key: 'jumlah', sortable: true },
  { title: 'STATUS TAGIHAN', key: 'has_tagihan', sortable: false },
  { title: 'STATUS SINKRON', key: 'is_synced', sortable: false },
  { title: 'AKSI', key: 'actions', sortable: false, align: 'center' },
]

// --- Computed ---
const isAllSelected = computed(() => {
  const unsyncedItems = dataTable.value.filter(item => !item.is_synced)
  if (unsyncedItems.length === 0) return false
  return unsyncedItems.every(item => selectedRows.value.includes(item.id))
})

const selectedUnsyncedCount = computed(() => {
  return selectedRows.value.length
})

// --- Methods: Fetch Data ---
const fetchSemesterPendek = async () => {
  loading.value = true
  try {
    const sortKey = Array.isArray(sortBy.value) ? (sortBy.value[0]?.key || 'id') : (sortBy.value?.key || 'id')
    const sortOrder = Array.isArray(sortBy.value) ? (sortBy.value[0]?.order || 'desc') : (sortBy.value?.order || 'desc')

    const params = {
      page: page.value,
      limit: itemsPerPage.value,
      sort_key: sortKey,
      sort_order: sortOrder,
      search: search.value ? search.value.trim() : undefined,
      status_sinkron: selectedStatusSinkron.value !== 'all' ? selectedStatusSinkron.value : undefined,
      ...(selectedTanggal.value && { tanggal: selectedTanggal.value }),
      ...(selectedTanggalMulai.value && { tanggal_mulai: selectedTanggalMulai.value }),
      ...(selectedTanggalAkhir.value && { tanggal_akhir: selectedTanggalAkhir.value }),
      ...(selectedJenisKelamin.value !== 'all' && { jenis_kelamin: selectedJenisKelamin.value }),
      ...(selectedJenisPembayaran.value && { jenis_pembayaran_id: selectedJenisPembayaran.value }),
      ...(selectedPeriode.value && { periode_id: selectedPeriode.value }),
    }

    const response = await $api('/admin/semester-pendek-sync', {
      method: 'GET',
      params,
    })

    if (response) {
      const payload = response.data
      if (payload && Array.isArray(payload.data)) {
        dataTable.value = payload.data
        totalItems.value = Number(payload.total ?? response.total ?? payload.data.length)
      } else if (Array.isArray(payload)) {
        dataTable.value = payload
        totalItems.value = Number(response.total ?? payload.length)
      } else if (Array.isArray(response)) {
        dataTable.value = response
        totalItems.value = response.length
      } else {
        dataTable.value = []
        totalItems.value = 0
      }
    }
  } catch (err) {
    console.error('Failed to fetch semester pendek data:', err)
    showSnackbar({
      text: 'Gagal memuat data semester pendek: ' + (err.message || err),
      color: 'error',
    })
  } finally {
    loading.value = false
    if (initialLoading.value) initialLoading.value = false
  }
}

const fetchStatistics = async () => {
  statisticsLoading.value = true
  try {
    const params = {
      search: search.value ? search.value.trim() : undefined,
      ...(selectedTanggal.value && { tanggal: selectedTanggal.value }),
      ...(selectedTanggalMulai.value && { tanggal_mulai: selectedTanggalMulai.value }),
      ...(selectedTanggalAkhir.value && { tanggal_akhir: selectedTanggalAkhir.value }),
      ...(selectedJenisKelamin.value !== 'all' && { jenis_kelamin: selectedJenisKelamin.value }),
      ...(selectedJenisPembayaran.value && { jenis_pembayaran_id: selectedJenisPembayaran.value }),
      ...(selectedPeriode.value && { periode_id: selectedPeriode.value }),
    }

    const response = await $api('/admin/semester-pendek-sync/statistics', {
      method: 'GET',
      params,
    })

    if (response && response.status) {
      const stats = response.data?.total ? response.data : (response.data?.data?.total ? response.data.data : response.data)
      if (stats && stats.total) {
        statistics.value = stats
      }
    }
  } catch (err) {
    console.warn('Failed to fetch SP statistics:', err)
  } finally {
    statisticsLoading.value = false
  }
}

const fetchFilterOptions = async () => {
  try {
    const res = await $api('/admin/semester-pendek-sync/filter-options', { method: 'GET' })
    if (res && res.status && res.data) {
      const data = res.data.data || res.data || {}
      jenisPembayaranList.value = (data.jenis_pembayaran_list || []).map(jp => ({
        title: jp.nama,
        value: jp.id,
      }))
      periodeList.value = (data.periode_list || []).map(p => ({
        title: `Periode ${p}`,
        value: p,
      }))
    }
  } catch (err) {
    console.warn('Failed to fetch filter options:', err)
  }
}

const refreshAll = () => {
  selectedRows.value = []
  fetchSemesterPendek()
  fetchStatistics()
}

// --- Quick Date Helper ---
const setQuickDate = (mode) => {
  const now = new Date()
  if (mode === 'today') {
    selectedTanggal.value = now.toISOString().split('T')[0]
    selectedTanggalMulai.value = ''
    selectedTanggalAkhir.value = ''
  } else if (mode === 'tgl4') {
    // Current month, date 4
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    selectedTanggal.value = `${y}-${m}-04`
    selectedTanggalMulai.value = ''
    selectedTanggalAkhir.value = ''
  } else if (mode === 'clear') {
    selectedTanggal.value = ''
    selectedTanggalMulai.value = ''
    selectedTanggalAkhir.value = ''
  }
}

// --- Selection Handlers ---
const toggleSelectAll = () => {
  const unsyncedItems = dataTable.value.filter(item => !item.is_synced)
  if (isAllSelected.value) {
    // Deselect all from current page
    const currentPageIds = unsyncedItems.map(item => item.id)
    selectedRows.value = selectedRows.value.filter(id => !currentPageIds.includes(id))
  } else {
    // Select all unsynced from current page
    const newIds = unsyncedItems.map(item => item.id).filter(id => !selectedRows.value.includes(id))
    selectedRows.value = [...selectedRows.value, ...newIds]
  }
}

const toggleRowSelection = (item) => {
  if (item.is_synced) return
  const index = selectedRows.value.indexOf(item.id)
  if (index >= 0) {
    selectedRows.value.splice(index, 1)
  } else {
    selectedRows.value.push(item.id)
  }
}

// --- Single Sync Action ---
const openSingleSync = (item) => {
  singleSyncItem.value = item
  manualNim.value = item.nim || ''
  isSingleSyncDialogVisible.value = true
}

const executeSingleSync = async () => {
  if (!singleSyncItem.value) return
  singleSyncLoading.value = true
  try {
    const payload = {
      id: singleSyncItem.value.id,
      nim: manualNim.value ? manualNim.value.trim() : undefined,
    }

    const response = await $api('/admin/semester-pendek-sync/sinkronkan', {
      method: 'POST',
      body: payload,
    })

    if (response && response.status) {
      showSnackbar({
        text: response.message || 'Pembayaran Semester Pendek berhasil disinkronkan!',
        color: 'success',
      })
      isSingleSyncDialogVisible.value = false
      refreshAll()
    } else {
      showSnackbar({
        text: response.message || 'Gagal menyinkronkan pembayaran',
        color: 'error',
      })
    }
  } catch (err) {
    console.error('Error executing single sync:', err)
    showSnackbar({
      text: 'Error sinkronisasi: ' + (err.message || err),
      color: 'error',
    })
  } finally {
    singleSyncLoading.value = false
  }
}

// --- Batch Sync Action ---
const openBatchSync = (mode = 'selected') => {
  batchSyncMode.value = mode
  batchSyncSummary.value = null
  isBatchSyncDialogVisible.value = true
}

const executeBatchSync = async () => {
  batchSyncLoading.value = true
  try {
    let payload = {}
    if (batchSyncMode.value === 'selected') {
      payload = { ids: selectedRows.value }
    } else {
      payload = {
        sync_all_filtered: true,
        search: search.value ? search.value.trim() : undefined,
        ...(selectedTanggal.value && { tanggal: selectedTanggal.value }),
        ...(selectedTanggalMulai.value && { tanggal_mulai: selectedTanggalMulai.value }),
        ...(selectedTanggalAkhir.value && { tanggal_akhir: selectedTanggalAkhir.value }),
        ...(selectedJenisKelamin.value !== 'all' && { jenis_kelamin: selectedJenisKelamin.value }),
        ...(selectedJenisPembayaran.value && { jenis_pembayaran_id: selectedJenisPembayaran.value }),
        ...(selectedPeriode.value && { periode_id: selectedPeriode.value }),
      }
    }

    const response = await $api('/admin/semester-pendek-sync/sinkronkan-batch', {
      method: 'POST',
      body: payload,
    })

    if (response && response.status) {
      batchSyncSummary.value = response.data
      showSnackbar({
        text: response.message || 'Sinkronisasi batch selesai!',
        color: 'success',
      })
      selectedRows.value = []
      refreshAll()
    } else {
      showSnackbar({
        text: response.message || 'Gagal sinkronisasi batch',
        color: 'error',
      })
    }
  } catch (err) {
    console.error('Error in batch sync:', err)
    showSnackbar({
      text: 'Gagal sinkronisasi batch: ' + (err.message || err),
      color: 'error',
    })
  } finally {
    batchSyncLoading.value = false
  }
}

// --- Reset Filters ---
const resetFilters = () => {
  search.value = ''
  selectedStatusSinkron.value = 'all'
  selectedTanggal.value = ''
  selectedTanggalMulai.value = ''
  selectedTanggalAkhir.value = ''
  selectedJenisKelamin.value = 'all'
  selectedJenisPembayaran.value = null
  selectedPeriode.value = null
  page.value = 1
  refreshAll()
}

// --- Watchers ---
let searchDebounce = null
watch(search, () => {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    page.value = 1
    fetchSemesterPendek()
    fetchStatistics()
  }, 400)
})

watch([selectedStatusSinkron, selectedTanggal, selectedTanggalMulai, selectedTanggalAkhir, selectedJenisKelamin, selectedJenisPembayaran, selectedPeriode], () => {
  page.value = 1
  fetchSemesterPendek()
  fetchStatistics()
})

watch([page, itemsPerPage, sortBy], () => {
  fetchSemesterPendek()
})

// --- Lifecycle ---
onMounted(async () => {
  await fetchFilterOptions()
  refreshAll()
})
</script>

<template>
  <div class="semester-pendek-sync-page">
    <!-- Header Section -->
    <VCard class="mb-6">
      <VCardItem class="pb-3">
        <div class="d-flex flex-wrap align-center justify-space-between gap-4">
          <div>
            <VCardTitle class="text-h5 font-weight-bold d-flex align-center gap-2">
              <VIcon icon="ri-calendar-check-line" color="primary" />
              Sinkronisasi Semester Pendek
            </VCardTitle>
            <VCardSubtitle class="mt-1">
              Pengecekan dan sinkronisasi pembayaran Semester Pendek ke tagihan perorangan (keuangan_pembayaran) agar akurat di Laporan Pemasukan Tunai Harian.
            </VCardSubtitle>
          </div>
          <div class="d-flex align-center flex-wrap gap-2">
            <VBtn
              color="secondary"
              variant="outlined"
              prepend-icon="ri-refresh-line"
              :loading="loading || statisticsLoading"
              @click="refreshAll"
            >
              Refresh Data
            </VBtn>

            <VBtn
              v-if="selectedRows.length > 0"
              color="primary"
              variant="elevated"
              prepend-icon="ri-loop-right-line"
              @click="openBatchSync('selected')"
            >
              Sinkronkan Terpilih ({{ selectedRows.length }})
            </VBtn>

            <VBtn
              v-else-if="statistics.not_synced.count > 0"
              color="warning"
              variant="elevated"
              prepend-icon="ri-folder-sync-line"
              @click="openBatchSync('all_unsynced')"
            >
              Sinkronkan Semua Belum Sinkron ({{ statistics.not_synced.count }})
            </VBtn>
          </div>
        </div>
      </VCardItem>
    </VCard>

    <!-- Statistics Cards -->
    <VRow class="mb-6">
      <!-- Total Pembayaran SP -->
      <VCol cols="12" sm="6" md="3">
        <VCard elevation="1" class="h-100">
          <VCardText>
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-subtitle-2 text-medium-emphasis">Total Pembayaran SP</span>
              <VAvatar color="primary" variant="tonal" size="40">
                <VIcon icon="ri-file-list-3-line" size="22" />
              </VAvatar>
            </div>
            <div class="text-h5 font-weight-bold mb-1">
              {{ statistics.total.count }} <span class="text-caption text-medium-emphasis">Transaksi</span>
            </div>
            <div class="text-subtitle-2 text-primary font-weight-medium">
              {{ formatRupiah(statistics.total.amount) }}
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Sudah Sinkron -->
      <VCol cols="12" sm="6" md="3">
        <VCard elevation="1" class="h-100">
          <VCardText>
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-subtitle-2 text-medium-emphasis">Sudah Sinkron</span>
              <VAvatar color="success" variant="tonal" size="40">
                <VIcon icon="ri-checkbox-circle-line" size="22" />
              </VAvatar>
            </div>
            <div class="text-h5 font-weight-bold text-success mb-1">
              {{ statistics.synced.count }} <span class="text-caption text-medium-emphasis">Transaksi</span>
            </div>
            <div class="text-subtitle-2 text-success font-weight-medium">
              {{ formatRupiah(statistics.synced.amount) }}
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Belum Sinkron -->
      <VCol cols="12" sm="6" md="3">
        <VCard elevation="1" class="h-100" :style="statistics.not_synced.count > 0 ? 'border: 1px solid rgba(var(--v-theme-warning), 0.5);' : ''">
          <VCardText>
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-subtitle-2 text-medium-emphasis">Belum Sinkron</span>
              <VAvatar color="warning" variant="tonal" size="40">
                <VIcon icon="ri-time-line" size="22" />
              </VAvatar>
            </div>
            <div class="text-h5 font-weight-bold text-warning mb-1">
              {{ statistics.not_synced.count }} <span class="text-caption text-medium-emphasis">Transaksi</span>
            </div>
            <div class="text-subtitle-2 text-warning font-weight-medium">
              {{ formatRupiah(statistics.not_synced.amount) }}
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Belum Ada Tagihan -->
      <VCol cols="12" sm="6" md="3">
        <VCard elevation="1" class="h-100">
          <VCardText>
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-subtitle-2 text-medium-emphasis">Belum Ada Tagihan</span>
              <VAvatar color="error" variant="tonal" size="40">
                <VIcon icon="ri-error-warning-line" size="22" />
              </VAvatar>
            </div>
            <div class="text-h5 font-weight-bold text-error mb-1">
              {{ statistics.no_tagihan.count }} <span class="text-caption text-medium-emphasis">Transaksi</span>
            </div>
            <div class="text-subtitle-2 text-error font-weight-medium">
              {{ formatRupiah(statistics.no_tagihan.amount) }}
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Filters Section -->
    <VCard class="mb-6">
      <VCardItem class="pb-2">
        <div class="d-flex align-center justify-space-between">
          <VCardTitle class="text-subtitle-1 font-weight-bold d-flex align-center gap-2">
            <VIcon icon="ri-filter-3-line" size="20" />
            Filter Data
          </VCardTitle>

          <!-- Quick Date Helper Buttons -->
          <div class="d-flex align-center gap-1">
            <span class="text-caption text-medium-emphasis mr-1">Shortcut Tanggal:</span>
            <VBtn
              size="x-small"
              variant="tonal"
              color="primary"
              @click="setQuickDate('today')"
            >
              Hari Ini
            </VBtn>
            <VBtn
              size="x-small"
              variant="tonal"
              color="warning"
              @click="setQuickDate('tgl4')"
            >
              Tanggal 4
            </VBtn>
            <VBtn
              v-if="selectedTanggal || selectedTanggalMulai || selectedTanggalAkhir"
              size="x-small"
              variant="text"
              color="secondary"
              @click="setQuickDate('clear')"
            >
              Clear
            </VBtn>
          </div>
        </div>
      </VCardItem>

      <VCardText>
        <VRow dense>
          <!-- Filter Tanggal Spesifik (e.g. Tanggal 4) -->
          <VCol cols="12" sm="6" md="3">
            <VTextField
              v-model="selectedTanggal"
              type="date"
              label="Filter Tanggal Spesifik"
              placeholder="YYYY-MM-DD"
              clearable
              density="compact"
              prepend-inner-icon="ri-calendar-line"
              hint="Pilih tanggal tertentu (contoh: tgl 4)"
              persistent-hint
            />
          </VCol>

          <!-- Filter Tanggal Mulai -->
          <VCol cols="12" sm="6" md="2">
            <VTextField
              v-model="selectedTanggalMulai"
              type="date"
              label="Tanggal Mulai"
              clearable
              density="compact"
              :disabled="!!selectedTanggal"
            />
          </VCol>

          <!-- Filter Tanggal Akhir -->
          <VCol cols="12" sm="6" md="2">
            <VTextField
              v-model="selectedTanggalAkhir"
              type="date"
              label="Tanggal Akhir"
              clearable
              density="compact"
              :disabled="!!selectedTanggal"
            />
          </VCol>

          <!-- Status Sinkron -->
          <VCol cols="12" sm="6" md="2">
            <VSelect
              v-model="selectedStatusSinkron"
              :items="statusSinkronOptions"
              item-title="title"
              item-value="value"
              label="Status Sinkron"
              density="compact"
            />
          </VCol>

          <!-- Jenis Kelamin -->
          <VCol cols="12" sm="6" md="3">
            <VSelect
              v-model="selectedJenisKelamin"
              :items="jenisKelaminOptions"
              item-title="title"
              item-value="value"
              label="Jenis Kelamin"
              density="compact"
            />
          </VCol>

          <!-- Jenis Pembayaran -->
          <VCol cols="12" sm="6" md="3">
            <VSelect
              v-model="selectedJenisPembayaran"
              :items="jenisPembayaranList"
              item-title="title"
              item-value="value"
              label="Jenis Pembayaran"
              placeholder="Semua Metode"
              clearable
              density="compact"
            />
          </VCol>

          <!-- Periode SP -->
          <VCol cols="12" sm="6" md="2">
            <VSelect
              v-model="selectedPeriode"
              :items="periodeList"
              item-title="title"
              item-value="value"
              label="Periode SP"
              placeholder="Semua Periode"
              clearable
              density="compact"
            />
          </VCol>

          <!-- Search Field -->
          <VCol cols="12" sm="6" md="5">
            <VTextField
              v-model="search"
              prepend-inner-icon="ri-search-line"
              label="Cari NIM, Nama, No. Nota, atau KRS ID"
              placeholder="Ketik untuk mencari..."
              clearable
              density="compact"
            />
          </VCol>

          <!-- Reset Filter Button -->
          <VCol cols="12" sm="6" md="2" class="d-flex align-center">
            <VBtn
              block
              variant="outlined"
              color="secondary"
              density="compact"
              prepend-icon="ri-refresh-line"
              @click="resetFilters"
            >
              Reset Filter
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Table Section -->
    <VCard>
      <!-- Selection Bar if rows are checked -->
      <VCardItem v-if="selectedRows.length > 0" class="bg-primary-subtle py-2">
        <div class="d-flex align-center justify-space-between flex-wrap gap-2">
          <div class="d-flex align-center gap-2">
            <VIcon icon="ri-checkbox-circle-fill" color="primary" />
            <span class="font-weight-medium">{{ selectedRows.length }} transaksi dipilih untuk disinkronkan.</span>
          </div>
          <div class="d-flex align-center gap-2">
            <VBtn
              size="small"
              color="primary"
              variant="elevated"
              prepend-icon="ri-loop-right-line"
              @click="openBatchSync('selected')"
            >
              Sinkronkan Sekarang
            </VBtn>
            <VBtn
              size="small"
              variant="text"
              color="secondary"
              @click="selectedRows = []"
            >
              Batal Pilih
            </VBtn>
          </div>
        </div>
      </VCardItem>

      <!-- Table Content -->
      <VDataTableServer
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        v-model:sort-by="sortBy"
        :headers="headers"
        :items="dataTable"
        :items-length="totalItems"
        :loading="loading"
        class="text-no-wrap"
      >
        <!-- Custom Header Checkbox -->
        <template #header.nomor>
          <div class="d-flex align-center gap-2">
            <VCheckbox
              :model-value="isAllSelected"
              density="compact"
              hide-details
              @click.stop="toggleSelectAll"
            />
            <span>NO. NOTA & TANGGAL</span>
          </div>
        </template>

        <!-- Row: No. Nota & Tanggal -->
        <template #item.nomor="{ item }">
          <div class="d-flex align-center gap-2 py-2">
            <VCheckbox
              :model-value="selectedRows.includes(item.id)"
              :disabled="item.is_synced"
              density="compact"
              hide-details
              @click.stop="toggleRowSelection(item)"
            />
            <div>
              <div class="font-weight-bold text-body-2 font-mono">
                {{ item.nomor || `SP-#${item.id}` }}
              </div>
              <div class="text-caption text-medium-emphasis d-flex align-center gap-1">
                <VIcon icon="ri-calendar-line" size="14" />
                {{ item.tanggal_formatted }}
              </div>
            </div>
          </div>
        </template>

        <!-- Row: Mahasiswa -->
        <template #item.mahasiswa="{ item }">
          <div class="py-1">
            <div class="font-weight-medium text-body-2">
              {{ item.nama_mahasiswa && item.nama_mahasiswa !== '-' ? item.nama_mahasiswa : (item.nim ? 'Mahasiswa' : 'Belum Terhubung') }}
            </div>
            <div class="text-caption text-medium-emphasis">
              <span v-if="item.nim" class="font-mono text-primary font-weight-bold mr-2">{{ item.nim }}</span>
              <span v-if="item.prodi?.nama && item.prodi.nama !== '-'">{{ item.prodi.nama }}</span>
            </div>
          </div>
        </template>

        <!-- Row: KRS / Periode -->
        <template #item.krs="{ item }">
          <div>
            <div class="text-body-2 font-weight-medium">
              KRS ID: <span class="font-mono">{{ item.krs_id }}</span>
            </div>
            <div class="text-caption text-medium-emphasis">
              Periode {{ item.periode_id || 1 }} &bull; {{ item.th_akademik?.nama || '-' }}
            </div>
          </div>
        </template>

        <!-- Row: Metode & JK -->
        <template #item.metode="{ item }">
          <div>
            <VChip
              size="x-small"
              :color="item.jk_id == 9 ? 'pink' : 'info'"
              class="mr-1 font-weight-medium"
            >
              {{ item.jenis_kelamin }}
            </VChip>
            <VChip size="x-small" variant="outlined" color="secondary">
              {{ item.jenis_pembayaran?.nama || 'Tunai' }}
            </VChip>
          </div>
        </template>

        <!-- Row: Nominal -->
        <template #item.jumlah="{ item }">
          <div class="font-weight-bold text-body-2 text-primary font-mono">
            {{ formatRupiah(item.jumlah) }}
          </div>
        </template>

        <!-- Row: Status Tagihan -->
        <template #item.has_tagihan="{ item }">
          <div v-if="item.has_tagihan">
            <VChip size="small" color="success" variant="tonal" prepend-icon="ri-checkbox-circle-line">
              Ada Tagihan
            </VChip>
            <div v-if="item.tagihan" class="text-caption text-medium-emphasis mt-1">
              ID: {{ item.tagihan.id }} ({{ formatRupiah(item.tagihan.jumlah) }})
            </div>
          </div>
          <div v-else>
            <VChip size="small" color="error" variant="tonal" prepend-icon="ri-close-circle-line">
              Belum Ada Tagihan
            </VChip>
            <div class="text-caption text-error mt-1">
              Akan dibuat otomatis
            </div>
          </div>
        </template>

        <!-- Row: Status Sinkron -->
        <template #item.is_synced="{ item }">
          <div v-if="item.is_synced">
            <VChip size="small" color="success" variant="elevated" prepend-icon="ri-check-line">
              Sudah Sinkron
            </VChip>
            <div v-if="item.pembayaran_terkait" class="text-caption text-medium-emphasis mt-1">
              Bayar ID: #{{ item.pembayaran_terkait.id }}
            </div>
          </div>
          <div v-else>
            <VChip size="small" color="warning" variant="elevated" prepend-icon="ri-time-line">
              Belum Sinkron
            </VChip>
          </div>
        </template>

        <!-- Row: Actions -->
        <template #item.actions="{ item }">
          <div class="d-flex align-center justify-center gap-1">
            <VBtn
              v-if="!item.is_synced"
              size="small"
              color="primary"
              variant="elevated"
              prepend-icon="ri-loop-right-line"
              @click="openSingleSync(item)"
            >
              Sinkronkan
            </VBtn>

            <VTooltip v-else text="Transaksi ini sudah tersinkronkan ke tagihan perorangan (keuangan_pembayaran).">
              <template #activator="{ props }">
                <VBtn
                  v-bind="props"
                  size="small"
                  color="success"
                  variant="tonal"
                  prepend-icon="ri-checkbox-circle-line"
                  disabled
                >
                  Tersinkron
                </VBtn>
              </template>
            </VTooltip>
          </div>
        </template>

        <!-- Empty State -->
        <template #no-data>
          <div class="pa-8 text-center">
            <VIcon icon="ri-inbox-line" size="48" color="medium-emphasis" class="mb-2" />
            <div class="text-subtitle-1 font-weight-medium">Tidak ada data pembayaran Semester Pendek</div>
            <div class="text-caption text-medium-emphasis">
              Coba sesuaikan filter tanggal atau filter pencarian Anda.
            </div>
          </div>
        </template>
      </VDataTableServer>
    </VCard>

    <!-- Dialog: Single Sync Confirmation -->
    <VDialog
      v-model="isSingleSyncDialogVisible"
      max-width="540"
      persistent
    >
      <VCard>
        <VCardTitle class="pa-4 bg-primary text-white d-flex align-center gap-2">
          <VIcon icon="ri-loop-right-line" color="white" />
          Konfirmasi Sinkronisasi Pembayaran
        </VCardTitle>

        <VCardText class="pa-4 pt-5">
          <p class="text-body-2 mb-4">
            Apakah Anda yakin ingin menyinkronkan transaksi Semester Pendek ini ke tabel pembayaran tagihan perorangan (<strong>keuangan_pembayaran</strong>)?
          </p>

          <VCard variant="outlined" class="pa-3 mb-4 bg-light">
            <div class="d-flex justify-space-between mb-1">
              <span class="text-caption text-medium-emphasis">No. Nota SP:</span>
              <span class="text-caption font-weight-bold font-mono">{{ singleSyncItem?.nomor }}</span>
            </div>
            <div class="d-flex justify-space-between mb-1">
              <span class="text-caption text-medium-emphasis">Tanggal Pembayaran:</span>
              <span class="text-caption font-weight-medium">{{ singleSyncItem?.tanggal_formatted }}</span>
            </div>
            <div class="d-flex justify-space-between mb-1">
              <span class="text-caption text-medium-emphasis">KRS ID:</span>
              <span class="text-caption font-weight-medium">{{ singleSyncItem?.krs_id }}</span>
            </div>
            <div class="d-flex justify-space-between mb-1">
              <span class="text-caption text-medium-emphasis">Nominal:</span>
              <span class="text-body-2 font-weight-bold text-primary">{{ formatRupiah(singleSyncItem?.jumlah) }}</span>
            </div>
            <div class="d-flex justify-space-between mb-1">
              <span class="text-caption text-medium-emphasis">Mahasiswa:</span>
              <span class="text-caption font-weight-medium">{{ singleSyncItem?.nama_mahasiswa || '-' }}</span>
            </div>
            <div class="d-flex justify-space-between">
              <span class="text-caption text-medium-emphasis">Status Tagihan:</span>
              <VChip size="x-small" :color="singleSyncItem?.has_tagihan ? 'success' : 'warning'">
                {{ singleSyncItem?.has_tagihan ? 'Tagihan Ditemukan' : 'Akan Dibuat Otomatis' }}
              </VChip>
            </div>
          </VCard>

          <!-- Input Manual NIM if no tagihan and no NIM detected -->
          <div v-if="!singleSyncItem?.has_tagihan && !singleSyncItem?.nim" class="mb-3">
            <VAlert type="info" variant="tonal" density="compact" class="mb-3">
              Data tagihan belum ditemukan. Silakan masukkan NIM mahasiswa agar tagihan perorangan dapat dibuat secara otomatis.
            </VAlert>
            <VTextField
              v-model="manualNim"
              label="NIM Mahasiswa"
              placeholder="Masukkan NIM..."
              prepend-inner-icon="ri-user-line"
              density="compact"
              required
            />
          </div>
        </VCardText>

        <VCardActions class="pa-4 pt-0 d-flex justify-end gap-2">
          <VBtn
            color="secondary"
            variant="text"
            :disabled="singleSyncLoading"
            @click="isSingleSyncDialogVisible = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="primary"
            variant="elevated"
            :loading="singleSyncLoading"
            @click="executeSingleSync"
          >
            Ya, Sinkronkan
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Dialog: Batch Sync Confirmation -->
    <VDialog
      v-model="isBatchSyncDialogVisible"
      max-width="540"
      persistent
    >
      <VCard>
        <VCardTitle class="pa-4 bg-primary text-white d-flex align-center gap-2">
          <VIcon icon="ri-loop-right-line" color="white" />
          Konfirmasi Sinkronisasi Batch
        </VCardTitle>

        <VCardText class="pa-4 pt-5">
          <div v-if="batchSyncMode === 'selected'">
            <p class="text-body-2 mb-2">
              Anda akan menyinkronkan <strong>{{ selectedRows.length }} transaksi</strong> Semester Pendek yang dipilih ke tabel pembayaran perorangan (<strong>keuangan_pembayaran</strong>).
            </p>
          </div>
          <div v-else>
            <p class="text-body-2 mb-2">
              Anda akan menyinkronkan <strong>semua transaksi belum sinkron ({{ statistics.not_synced.count }} transaksi)</strong> sesuai filter yang aktif saat ini.
            </p>
          </div>

          <VAlert type="warning" variant="tonal" density="compact" class="mb-4">
            Proses ini akan membuat data tagihan (jika belum ada) dan mencatat transaksi ke pembayaran perorangan serta nota kwitansi. Transaksi yang sudah pernah sinkron akan dilewati secara otomatis.
          </VAlert>

          <!-- Result Summary if done -->
          <div v-if="batchSyncSummary" class="pa-3 bg-light rounded">
            <div class="text-subtitle-2 font-weight-bold mb-2 text-success">Hasil Sinkronisasi:</div>
            <div class="text-caption">Total Diproses: {{ batchSyncSummary.total }}</div>
            <div class="text-caption text-success font-weight-bold">Berhasil Disinkronkan: {{ batchSyncSummary.synced }}</div>
            <div class="text-caption text-secondary">Dilewati (sudah sinkron): {{ batchSyncSummary.skipped }}</div>
            <div v-if="batchSyncSummary.failed > 0" class="text-caption text-error font-weight-bold">Gagal: {{ batchSyncSummary.failed }}</div>
          </div>
        </VCardText>

        <VCardActions class="pa-4 pt-0 d-flex justify-end gap-2">
          <VBtn
            color="secondary"
            variant="text"
            :disabled="batchSyncLoading"
            @click="isBatchSyncDialogVisible = false"
          >
            {{ batchSyncSummary ? 'Tutup' : 'Batal' }}
          </VBtn>
          <VBtn
            v-if="!batchSyncSummary"
            color="primary"
            variant="elevated"
            :loading="batchSyncLoading"
            @click="executeBatchSync"
          >
            Mulai Sinkronisasi
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.semester-pendek-sync-page {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
</style>
