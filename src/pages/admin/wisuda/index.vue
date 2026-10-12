<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { formatMoney, formatRupiah } from '@/composables/formatRupiah'
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
const selectedThAkademik = ref(null)
const selectedProdi = ref(null)
const selectedJenisPembayaran = ref(null)
const selectedPetugas = ref(null)
const tanggalMulai = ref(null)
const tanggalAkhir = ref(null)

// --- State: Options for Filters ---
const thAkademikList = ref([])
const prodiList = ref([])
const jenisPembayaranList = ref([])
const petugasList = ref([])
const tahunWisudaList = ref([])

// --- State: Statistics ---
const statistics = ref({
  total: { count: 0, amount: 0, total_mahasiswa: 0 },
  synced: { count: 0, amount: 0 },
  not_synced: { count: 0, amount: 0 },
})
const statisticsLoading = ref(false)

// --- State: Single Sync Dialog ---
const isSingleSyncDialogVisible = ref(false)
const singleSyncLoading = ref(false)
const singleSyncItem = ref(null)
const singleSyncForm = ref({
  pembayaran_id: null,
  nim: '',
  nama: '',
  prodi_nama: '',
  tahun_id: null,
  ukuran_baju: 'L',
  nama_ayah: '',
  judul: '-',
  tanggal_sidang: new Date().toISOString().split('T')[0],
})

// --- State: Batch Sync Dialog ---
const isBatchSyncDialogVisible = ref(false)
const batchSyncMode = ref('selected') // 'selected' | 'all_unsynced'
const batchSyncLoading = ref(false)
const batchSyncTahunId = ref(null)
const batchSyncUkuranBaju = ref('L')
const batchSyncResult = ref(null)
const isBatchResultDialogVisible = ref(false)

// --- State: Detail Dialog ---
const isDetailDialogVisible = ref(false)
const selectedDetailItem = ref(null)

// --- Table Headers ---
const headers = [
  { title: 'No', key: 'row_number', sortable: false, width: 60 },
  { title: 'Transaksi', key: 'transaction', sortable: false },
  { title: 'Mahasiswa', key: 'student', sortable: false },
  { title: 'Tagihan', key: 'tagihan', sortable: false },
  { title: 'Nominal', key: 'jumlah', sortable: true, align: 'end' },
  { title: 'Metode', key: 'metode', sortable: false, align: 'center' },
  { title: 'Status Sinkron', key: 'status_sinkron', sortable: false, align: 'center' },
  { title: 'Aksi', key: 'actions', sortable: false, align: 'center', width: 140 },
]

const ukuranBajuOptions = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']

const statusSinkronFilterOptions = [
  { title: 'Semua Status Sinkron', value: 'all' },
  { title: 'Sudah Sinkron', value: 'synced' },
  { title: 'Belum Sinkron', value: 'not_synced' },
]

// --- Fetch Functions ---
const fetchStatistics = async () => {
  statisticsLoading.value = true
  try {
    const params = {
      ...(search.value && { search: search.value }),
      ...(selectedThAkademik.value && { th_akademik_id: selectedThAkademik.value }),
      ...(selectedProdi.value && { prodi_id: selectedProdi.value }),
      ...(selectedJenisPembayaran.value && { jenis_pembayaran_id: selectedJenisPembayaran.value }),
      ...(selectedPetugas.value && { user_id: selectedPetugas.value }),
      ...(tanggalMulai.value && { tanggal_mulai: tanggalMulai.value }),
      ...(tanggalAkhir.value && { tanggal_akhir: tanggalAkhir.value }),
    }

    const response = await $api('/admin/wisuda/statistics', {
      method: 'GET',
      params,
    })

    if (response && response.status && response.data) {
      statistics.value = response.data
    }
  } catch (err) {
    console.error('Failed to fetch wisuda statistics:', err)
  } finally {
    statisticsLoading.value = false
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      page: page.value,
      limit: itemsPerPage.value,
      sort_key: sortBy.value.key || 'id',
      sort_order: sortBy.value.order || 'desc',
      search: search.value || undefined,
      status_sinkron: selectedStatusSinkron.value !== 'all' ? selectedStatusSinkron.value : undefined,
      ...(selectedThAkademik.value && { th_akademik_id: selectedThAkademik.value }),
      ...(selectedProdi.value && { prodi_id: selectedProdi.value }),
      ...(selectedJenisPembayaran.value && { jenis_pembayaran_id: selectedJenisPembayaran.value }),
      ...(selectedPetugas.value && { user_id: selectedPetugas.value }),
      ...(tanggalMulai.value && { tanggal_mulai: tanggalMulai.value }),
      ...(tanggalAkhir.value && { tanggal_akhir: tanggalAkhir.value }),
    }

    const response = await $api('/admin/wisuda', {
      method: 'GET',
      params,
    })

    if (response && response.status && response.data) {
      dataTable.value = response.data.data || []
      totalItems.value = response.data.total || 0
    }
  } catch (err) {
    console.error('Failed to fetch wisuda payments:', err)
    showSnackbar({
      text: 'Gagal memuat data pembayaran wisuda: ' + (err.message || err),
      color: 'error',
    })
  } finally {
    loading.value = false
    if (initialLoading.value) initialLoading.value = false
  }
}

const fetchFilterOptions = async () => {
  // 1. Tahun Akademik
  try {
    const resTh = await $api('/admin/th-akademik', { method: 'GET' })
    if (resTh && resTh.data) {
      const items = resTh.data.data || resTh.data || []
      thAkademikList.value = items.map(th => ({
        title: `${th.nama} - ${th.semester}`,
        value: th.id,
      }))
    }
  } catch (err) {
    console.warn('Failed to fetch th-akademik:', err)
  }

  // 2. Prodi
  try {
    const resProdi = await $api('/admin/prodi', {
      method: 'GET',
      params: { limit: 100, sort_key: 'nama', sort_order: 'asc' },
    })
    if (resProdi && resProdi.data) {
      const items = resProdi.data.data || resProdi.data || []
      prodiList.value = [
        { title: '📚 Semua Prodi Sarjana', value: 'sarjana' },
        { title: '🎓 Semua Prodi Pasca', value: 'pasca' },
        ...items
          .filter(p => p.jenjang !== '---')
          .map(p => ({
            title: `${p.alias} - ${p.nama} (${p.jenjang})`,
            value: p.id,
          })),
      ]
    }
  } catch (err) {
    console.warn('Failed to fetch prodi:', err)
  }

  // 3. Jenis Pembayaran
  try {
    const resJp = await $api('/admin/pemasukan/mahasiswa/jenis-pembayaran', {
      method: 'GET',
      params: { limit: 100 },
    })
    if (resJp && resJp.data) {
      const items = resJp.data.data || resJp.data || []
      jenisPembayaranList.value = items.map(jp => ({
        title: `${jp.nama} - ${jp.kategori}`,
        value: jp.id,
      }))
    }
  } catch (err) {
    console.warn('Failed to fetch jenis pembayaran:', err)
  }

  // 4. Petugas
  try {
    const resPetugas = await $api('/helper/petugas-pembayaran', { method: 'GET' })
    if (resPetugas && resPetugas.data) {
      const items = resPetugas.data.data || resPetugas.data || []
      petugasList.value = items.map(u => ({
        title: `${u.name} (${u.jenis_kelamin || '-'})`,
        value: u.id,
      }))
    }
  } catch (err) {
    console.warn('Failed to fetch petugas:', err)
  }

  // 5. Tahun Wisuda (from Web Wisuda)
  try {
    const resTahunWisuda = await $api('/admin/wisuda/tahun', { method: 'GET' })
    if (resTahunWisuda && resTahunWisuda.data) {
      const items = Array.isArray(resTahunWisuda.data) ? resTahunWisuda.data : []
      tahunWisudaList.value = items.map(tw => ({
        title: tw.nama || tw.th_akademik || `Tahun ID: ${tw.id}`,
        value: tw.id,
        is_active: tw.is_active ?? false,
      }))

      // Default select the active or first tahun wisuda
      if (tahunWisudaList.value.length) {
        const activeYear = tahunWisudaList.value.find(t => t.is_active) || tahunWisudaList.value[0]
        batchSyncTahunId.value = activeYear.value
        singleSyncForm.value.tahun_id = activeYear.value
      }
    }
  } catch (err) {
    console.warn('Failed to fetch tahun wisuda:', err)
  }
}

// --- Table Sorting & Pagination Handlers ---
const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb }) => {
  page.value = p
  itemsPerPage.value = ipp
  if (Array.isArray(sb) && sb.length) {
    sortBy.value = sb[0]
  }
  fetchData()
}

const refreshAll = () => {
  fetchStatistics()
  fetchData()
}

const resetFilters = () => {
  search.value = ''
  selectedStatusSinkron.value = 'all'
  selectedThAkademik.value = null
  selectedProdi.value = null
  selectedJenisPembayaran.value = null
  selectedPetugas.value = null
  tanggalMulai.value = null
  tanggalAkhir.value = null
  page.value = 1
  refreshAll()
}

const filterBySyncStatus = status => {
  selectedStatusSinkron.value = status
  page.value = 1
  fetchData()
}

// Debounced search watcher
let searchDebounceTimer = null
watch(search, () => {
  clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    page.value = 1
    fetchData()
    fetchStatistics()
  }, 400)
})

watch(
  [
    selectedStatusSinkron,
    selectedThAkademik,
    selectedProdi,
    selectedJenisPembayaran,
    selectedPetugas,
    tanggalMulai,
    tanggalAkhir,
  ],
  () => {
    page.value = 1
    fetchData()
    fetchStatistics()
  },
)

// --- Single Sync Methods ---
const openSingleSyncModal = item => {
  singleSyncItem.value = item
  const mhs = item.mahasiswa || {}
  
  // Choose default tahun wisuda if not set
  let defaultTahunId = singleSyncForm.value.tahun_id
  if (!defaultTahunId && tahunWisudaList.value.length) {
    defaultTahunId = tahunWisudaList.value[0].value
  }

  singleSyncForm.value = {
    pembayaran_id: item.id,
    nim: item.nim,
    nama: item.nama_mahasiswa || mhs.nama || '-',
    prodi_nama: `${item.prodi?.alias || ''} - ${item.prodi?.nama || ''} (${item.prodi?.jenjang || ''})`,
    tahun_id: defaultTahunId,
    ukuran_baju: 'L',
    nama_ayah: mhs.ayah?.nama || mhs.nama_ayah || '',
    judul: mhs.judul_skripsi || mhs.judul || '-',
    tanggal_sidang: mhs.tanggal_sidang || new Date().toISOString().split('T')[0],
  }

  isSingleSyncDialogVisible.value = true
}

const submitSingleSync = async () => {
  if (!singleSyncForm.value.nim) {
    showSnackbar({ text: 'NIM tidak boleh kosong', color: 'error' })
    return
  }

  singleSyncLoading.value = true
  try {
    const payload = {
      nim: singleSyncForm.value.nim,
      pembayaran_id: singleSyncForm.value.pembayaran_id,
      tahun_id: singleSyncForm.value.tahun_id,
      ukuran_baju: singleSyncForm.value.ukuran_baju,
      nama_ayah: singleSyncForm.value.nama_ayah || '-',
      judul: singleSyncForm.value.judul || '-',
      tanggal_sidang: singleSyncForm.value.tanggal_sidang,
    }

    const response = await $api('/admin/wisuda/sinkronkan', {
      method: 'POST',
      body: payload,
    })

    if (response && response.status) {
      showSnackbar({
        text: response.message || 'Mahasiswa berhasil disinkronkan ke Web Wisuda!',
        color: 'success',
      })
      isSingleSyncDialogVisible.value = false
      refreshAll()
    } else {
      showSnackbar({
        text: response.message || 'Gagal menyinkronkan data mahasiswa.',
        color: 'error',
      })
    }
  } catch (err) {
    console.error('Sync failed:', err)
    const errorMsg = err.response?.data?.message || err.message || 'Terjadi kesalahan saat sinkronisasi.'
    showSnackbar({
      text: errorMsg,
      color: 'error',
    })
  } finally {
    singleSyncLoading.value = false
  }
}

// --- Batch Sync Methods ---
const openBatchSyncModal = mode => {
  batchSyncMode.value = mode

  if (mode === 'selected' && (!selectedRows.value || !selectedRows.value.length)) {
    showSnackbar({
      text: 'Pilih minimal satu pembayaran terlebih dahulu!',
      color: 'warning',
    })
    return
  }

  if (!batchSyncTahunId.value && tahunWisudaList.value.length) {
    batchSyncTahunId.value = tahunWisudaList.value[0].value
  }

  isBatchSyncDialogVisible.value = true
}

const submitBatchSync = async () => {
  batchSyncLoading.value = true
  try {
    let payload = {
      mode: batchSyncMode.value,
      tahun_id: batchSyncTahunId.value,
      ukuran_baju: batchSyncUkuranBaju.value,
    }

    if (batchSyncMode.value === 'selected') {
      // Selected rows contain the full object or IDs depending on item-value
      const ids = selectedRows.value.map(row => (typeof row === 'object' ? row.id : row))
      payload.pembayaran_ids = ids
    }

    const response = await $api('/admin/wisuda/sinkronkan-batch', {
      method: 'POST',
      body: payload,
    })

    if (response && response.status) {
      batchSyncResult.value = response.data || { total: 0, success: 0, failed: 0, logs: [] }
      isBatchSyncDialogVisible.value = false
      isBatchResultDialogVisible.value = true
      selectedRows.value = []
      refreshAll()
    } else {
      showSnackbar({
        text: response.message || 'Gagal memproses sinkronisasi batch.',
        color: 'error',
      })
    }
  } catch (err) {
    console.error('Batch sync failed:', err)
    const errorMsg = err.response?.data?.message || err.message || 'Terjadi kesalahan pada sinkronisasi batch.'
    showSnackbar({
      text: errorMsg,
      color: 'error',
    })
  } finally {
    batchSyncLoading.value = false
  }
}

// --- Detail Dialog ---
const openDetailModal = item => {
  selectedDetailItem.value = item
  isDetailDialogVisible.value = true
}

// --- Lifecycle ---
onMounted(() => {
  document.title = 'Pembayaran Wisuda - SIMKEU'
  fetchFilterOptions()
  fetchStatistics()
  fetchData()
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex flex-wrap justify-space-between align-center mb-6 gap-3">
      <div>
        <h3 class="text-h4 font-weight-bold mb-1">
          Pembayaran Wisuda
        </h3>
        <p class="text-body-1 text-medium-emphasis mb-0">
          Kelola pembayaran wisuda mahasiswa dan integrasi sinkronisasi data ke Web Wisuda
        </p>
      </div>
      <div class="d-flex gap-3">
        <VBtn
          color="secondary"
          variant="outlined"
          prepend-icon="ri-refresh-line"
          :loading="loading || statisticsLoading"
          @click="refreshAll"
        >
          Refresh Data
        </VBtn>

        <!-- Batch Sync Buttons -->
        <VBtn
          v-if="selectedRows.length > 0"
          color="primary"
          prepend-icon="ri-check-double-line"
          @click="openBatchSyncModal('selected')"
        >
          Sinkronkan Terpilih ({{ selectedRows.length }})
        </VBtn>

        <VBtn
          v-if="statistics.not_synced.count > 0"
          color="error"
          variant="tonal"
          prepend-icon="ri-cloud-upload-line"
          @click="openBatchSyncModal('all_unsynced')"
        >
          Sinkronkan Semua Belum Sinkron ({{ statistics.not_synced.count }})
        </VBtn>
      </div>
    </div>

    <!-- Alert Notification if Unsynced Data Exists -->
    <VAlert
      v-if="statistics.not_synced.count > 0 && selectedStatusSinkron === 'all'"
      color="warning"
      variant="tonal"
      closable
      class="mb-6"
    >
      <template #prepend>
        <VIcon
          icon="ri-alert-line"
          size="28"
        />
      </template>
      <div class="d-flex flex-wrap justify-space-between align-center w-100 gap-2">
        <div>
          <span class="font-weight-semibold">Perhatian:</span> Terdapat 
          <strong>{{ statistics.not_synced.count }} pembayaran wisuda</strong> 
          ({{ formatRupiah(statistics.not_synced.amount) }}) yang 
          <span class="text-error font-weight-semibold">belum disinkronkan</span> ke Web Wisuda!
        </div>
        <div class="d-flex gap-2">
          <VBtn
            size="small"
            color="warning"
            variant="flat"
            @click="filterBySyncStatus('not_synced')"
          >
            Lihat Yang Belum Sinkron
          </VBtn>
          <VBtn
            size="small"
            color="primary"
            variant="flat"
            @click="openBatchSyncModal('all_unsynced')"
          >
            Sinkronkan Sekarang
          </VBtn>
        </div>
      </div>
    </VAlert>

    <!-- 👉 Stat Cards -->
    <VCard class="mb-6">
      <VCardText class="px-2 py-4">
        <VRow no-gutters>
          <!-- 1. Total Transaksi Wisuda -->
          <VCol
            cols="12"
            sm="6"
            md="3"
            class="px-4 py-2"
          >
            <div class="d-flex justify-space-between align-center">
              <div class="d-flex flex-column gap-y-1">
                <span class="text-caption text-medium-emphasis text-uppercase font-weight-medium">
                  Total Transaksi Wisuda
                </span>
                <h4 class="text-h4 font-weight-bold">
                  {{ statistics.total.count.toLocaleString('id-ID') }}
                </h4>
                <div class="text-caption text-medium-emphasis">
                  {{ statistics.total.total_mahasiswa.toLocaleString('id-ID') }} Mahasiswa
                </div>
              </div>
              <VAvatar
                color="primary"
                variant="tonal"
                rounded="lg"
                size="46"
              >
                <VIcon
                  icon="ri-graduation-cap-line"
                  size="26"
                />
              </VAvatar>
            </div>
          </VCol>

          <VDivider
            vertical
            inset
            class="d-none d-md-block"
          />

          <!-- 2. Sudah Sinkron -->
          <VCol
            cols="12"
            sm="6"
            md="3"
            class="px-4 py-2 cursor-pointer"
            @click="filterBySyncStatus('synced')"
          >
            <div class="d-flex justify-space-between align-center">
              <div class="d-flex flex-column gap-y-1">
                <div class="d-flex align-center gap-1">
                  <span class="text-caption text-medium-emphasis text-uppercase font-weight-medium">
                    Sudah Sinkron
                  </span>
                  <VIcon
                    v-if="selectedStatusSinkron === 'synced'"
                    icon="ri-check-line"
                    size="16"
                    color="success"
                  />
                </div>
                <h4 class="text-h4 font-weight-bold text-success">
                  {{ statistics.synced.count.toLocaleString('id-ID') }}
                </h4>
                <div class="text-caption text-medium-emphasis">
                  {{ formatRupiah(statistics.synced.amount) }}
                </div>
              </div>
              <VAvatar
                color="success"
                variant="tonal"
                rounded="lg"
                size="46"
              >
                <VIcon
                  icon="ri-checkbox-circle-line"
                  size="26"
                />
              </VAvatar>
            </div>
          </VCol>

          <VDivider
            vertical
            inset
            class="d-none d-md-block"
          />

          <!-- 3. Belum Sinkron -->
          <VCol
            cols="12"
            sm="6"
            md="3"
            class="px-4 py-2 cursor-pointer"
            @click="filterBySyncStatus('not_synced')"
          >
            <div class="d-flex justify-space-between align-center">
              <div class="d-flex flex-column gap-y-1">
                <div class="d-flex align-center gap-1">
                  <span class="text-caption text-medium-emphasis text-uppercase font-weight-medium">
                    Belum Sinkron
                  </span>
                  <VChip
                    v-if="statistics.not_synced.count > 0"
                    size="x-small"
                    color="error"
                    label
                  >
                    Perlu Sinkron
                  </VChip>
                </div>
                <h4 class="text-h4 font-weight-bold text-error">
                  {{ statistics.not_synced.count.toLocaleString('id-ID') }}
                </h4>
                <div class="text-caption text-medium-emphasis">
                  {{ formatRupiah(statistics.not_synced.amount) }}
                </div>
              </div>
              <VAvatar
                color="error"
                variant="tonal"
                rounded="lg"
                size="46"
              >
                <VIcon
                  icon="ri-alert-line"
                  size="26"
                />
              </VAvatar>
            </div>
          </VCol>

          <VDivider
            vertical
            inset
            class="d-none d-md-block"
          />

          <!-- 4. Total Nominal Wisuda -->
          <VCol
            cols="12"
            sm="6"
            md="3"
            class="px-4 py-2"
          >
            <div class="d-flex justify-space-between align-center">
              <div class="d-flex flex-column gap-y-1">
                <span class="text-caption text-medium-emphasis text-uppercase font-weight-medium">
                  Total Nominal Pembayaran
                </span>
                <h4 class="text-h4 font-weight-bold text-info">
                  {{ formatRupiah(statistics.total.amount) }}
                </h4>
                <div class="text-caption text-medium-emphasis">
                  Pembayaran Terverifikasi
                </div>
              </div>
              <VAvatar
                color="info"
                variant="tonal"
                rounded="lg"
                size="46"
              >
                <VIcon
                  icon="ri-money-dollar-circle-line"
                  size="26"
                />
              </VAvatar>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- 👉 Full Filter Card -->
    <VCard
      title="Filter Data Pembayaran Wisuda"
      class="mb-6"
    >
      <VCardText>
        <VRow dense>
          <!-- Search -->
          <VCol
            cols="12"
            sm="6"
            md="3"
          >
            <VTextField
              v-model="search"
              label="Cari Mahasiswa / Transaksi"
              placeholder="NIM, Nama, No. Bayar, Nota..."
              prepend-inner-icon="ri-search-line"
              clearable
              density="compact"
            />
          </VCol>

          <!-- Status Sinkron -->
          <VCol
            cols="12"
            sm="6"
            md="3"
          >
            <VSelect
              v-model="selectedStatusSinkron"
              label="Status Sinkron Web Wisuda"
              :items="statusSinkronFilterOptions"
              density="compact"
              prepend-inner-icon="ri-cloud-line"
            />
          </VCol>

          <!-- Tahun Akademik SIMKEU -->
          <VCol
            cols="12"
            sm="6"
            md="3"
          >
            <VSelect
              v-model="selectedThAkademik"
              label="Tahun Akademik"
              placeholder="Semua Tahun Akademik"
              :items="thAkademikList"
              clearable
              density="compact"
              prepend-inner-icon="ri-calendar-line"
            />
          </VCol>

          <!-- Prodi -->
          <VCol
            cols="12"
            sm="6"
            md="3"
          >
            <VSelect
              v-model="selectedProdi"
              label="Program Studi"
              placeholder="Semua Prodi"
              :items="prodiList"
              clearable
              density="compact"
              prepend-inner-icon="ri-book-open-line"
            />
          </VCol>

          <!-- Metode / Jenis Pembayaran -->
          <VCol
            cols="12"
            sm="6"
            md="3"
          >
            <VSelect
              v-model="selectedJenisPembayaran"
              label="Metode / Jenis Pembayaran"
              placeholder="Semua Jenis"
              :items="jenisPembayaranList"
              clearable
              density="compact"
              prepend-inner-icon="ri-bank-card-line"
            />
          </VCol>

          <!-- Petugas -->
          <VCol
            cols="12"
            sm="6"
            md="3"
          >
            <VSelect
              v-model="selectedPetugas"
              label="Petugas Penerima"
              placeholder="Semua Petugas"
              :items="petugasList"
              clearable
              density="compact"
              prepend-inner-icon="ri-user-follow-line"
            />
          </VCol>

          <!-- Tanggal Mulai -->
          <VCol
            cols="12"
            sm="6"
            md="2"
          >
            <AppDateTimePicker
              v-model="tanggalMulai"
              label="Tanggal Mulai"
              placeholder="Pilih Tanggal Mulai"
              clearable
              density="compact"
              :config="{ dateFormat: 'Y-m-d' }"
            />
          </VCol>

          <!-- Tanggal Akhir -->
          <VCol
            cols="12"
            sm="6"
            md="2"
          >
            <AppDateTimePicker
              v-model="tanggalAkhir"
              label="Tanggal Akhir"
              placeholder="Pilih Tanggal Akhir"
              clearable
              density="compact"
              :config="{ dateFormat: 'Y-m-d' }"
            />
          </VCol>

          <!-- Reset Filter Button -->
          <VCol
            cols="12"
            sm="12"
            md="2"
            class="d-flex align-center justify-end"
          >
            <VBtn
              color="secondary"
              variant="tonal"
              block
              prepend-icon="ri-refresh-line"
              @click="resetFilters"
            >
              Reset Filter
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- 👉 Data Table Card -->
    <VCard>
      <VCardText class="d-flex justify-space-between align-center flex-wrap gap-4 py-3">
        <div class="d-flex align-center gap-2">
          <span class="text-subtitle-1 font-weight-bold">
            Daftar Pembayaran Wisuda
          </span>
          <VChip
            size="small"
            color="primary"
            variant="tonal"
          >
            {{ totalItems.toLocaleString('id-ID') }} Data
          </VChip>
        </div>

        <div class="d-flex align-center gap-3">
          <span
            v-if="selectedRows.length"
            class="text-caption text-medium-emphasis"
          >
            {{ selectedRows.length }} baris dipilih
          </span>

          <VBtn
            v-if="selectedRows.length"
            size="small"
            color="primary"
            prepend-icon="ri-cloud-upload-line"
            @click="openBatchSyncModal('selected')"
          >
            Sinkronkan Terpilih
          </VBtn>
        </div>
      </VCardText>

      <VDivider />

      <!-- Server-side Datatable -->
      <VDataTableServer
        v-model="selectedRows"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :headers="headers"
        :items="dataTable"
        :items-length="totalItems"
        :loading="loading"
        show-select
        return-object
        class="text-no-wrap"
        @update:options="loadItems"
      >
        <!-- No / Row Number -->
        <template #item.row_number="{ index }">
          {{ (page - 1) * itemsPerPage + index + 1 }}
        </template>

        <!-- Transaksi (Nomor, Nota, Tanggal) -->
        <template #item.transaction="{ item }">
          <div class="d-flex flex-column">
            <span class="font-weight-semibold text-high-emphasis">
              {{ item.nomor || '-' }}
            </span>
            <span
              v-if="item.nota && item.nota !== item.nomor"
              class="text-caption text-medium-emphasis"
            >
              Nota: {{ item.nota }}
            </span>
            <span class="text-caption text-medium-emphasis">
              <VIcon
                icon="ri-calendar-line"
                size="12"
                class="me-1"
              />
              {{ item.tanggal_formatted || item.tanggal || '-' }}
            </span>
          </div>
        </template>

        <!-- Mahasiswa (NIM, Nama, Prodi, JK) -->
        <template #item.student="{ item }">
          <div class="d-flex flex-column py-2">
            <div class="d-flex align-center gap-2">
              <VChip
                size="x-small"
                color="primary"
                label
                class="font-weight-bold"
              >
                {{ item.nim }}
              </VChip>
              <VChip
                size="x-small"
                :color="item.jenis_kelamin === 'Laki-Laki' ? 'info' : 'secondary'"
                variant="outlined"
              >
                {{ item.jenis_kelamin === 'Laki-Laki' ? 'L' : 'P' }}
              </VChip>
            </div>
            <span class="font-weight-medium text-high-emphasis mt-1">
              {{ item.nama_mahasiswa || '-' }}
            </span>
            <span class="text-caption text-medium-emphasis">
              {{ item.prodi?.alias || '-' }} - {{ item.prodi?.nama || '-' }} ({{ item.prodi?.jenjang || '-' }})
            </span>
          </div>
        </template>

        <!-- Tagihan -->
        <template #item.tagihan="{ item }">
          <div class="d-flex flex-column">
            <span class="font-weight-medium">
              {{ item.tagihan?.nama || 'WISUDA' }}
            </span>
            <span class="text-caption text-medium-emphasis">
              TA: {{ item.tagihan?.th_akademik_kode || '-' }}
            </span>
          </div>
        </template>

        <!-- Nominal -->
        <template #item.jumlah="{ item }">
          <span class="font-weight-bold text-high-emphasis">
            {{ formatMoney(item.jumlah, item.mata_uang) }}
          </span>
        </template>

        <!-- Metode Pembayaran -->
        <template #item.metode="{ item }">
          <VChip
            size="small"
            :color="item.jenis_pembayaran?.nama === 'BSI' ? 'info' : 'secondary'"
            variant="tonal"
          >
            {{ item.jenis_pembayaran?.nama || 'CASH' }}
          </VChip>
        </template>

        <!-- Status Sinkronisasi Web Wisuda -->
        <template #item.status_sinkron="{ item }">
          <div class="d-flex flex-column align-center gap-1">
            <VChip
              size="small"
              :color="item.is_synced ? 'success' : 'error'"
              :prepend-icon="item.is_synced ? 'ri-checkbox-circle-line' : 'ri-close-circle-line'"
            >
              {{ item.is_synced ? 'Sudah Sinkron' : 'Belum Sinkron' }}
            </VChip>
            <span
              v-if="item.sync_info?.no_unik"
              class="text-caption text-success font-weight-medium"
            >
              No: {{ item.sync_info.no_unik }}
            </span>
          </div>
        </template>

        <!-- Aksi -->
        <template #item.actions="{ item }">
          <div class="d-flex align-center justify-center gap-1">
            <!-- Tombol Sinkronkan -->
            <VBtn
              size="x-small"
              :color="item.is_synced ? 'secondary' : 'primary'"
              :variant="item.is_synced ? 'outlined' : 'flat'"
              prepend-icon="ri-cloud-upload-line"
              @click="openSingleSyncModal(item)"
            >
              {{ item.is_synced ? 'Resync' : 'Sinkronkan' }}
            </VBtn>

            <!-- Tombol Detail -->
            <IconBtn
              size="small"
              color="default"
              @click="openDetailModal(item)"
            >
              <VIcon icon="ri-eye-line" />
              <VTooltip activator="parent">
                Lihat Detail
              </VTooltip>
            </IconBtn>
          </div>
        </template>

        <!-- Empty State -->
        <template #no-data>
          <div class="text-center pa-6">
            <VIcon
              icon="ri-folder-info-line"
              size="48"
              class="text-medium-emphasis mb-2"
            />
            <p class="text-body-1 mb-0">
              Tidak ada data pembayaran wisuda ditemukan.
            </p>
          </div>
        </template>
      </VDataTableServer>
    </VCard>

    <!-- 👉 Dialog: Sinkronkan Single Mahasiswa -->
    <VDialog
      v-model="isSingleSyncDialogVisible"
      max-width="640"
    >
      <VCard title="Sinkronisasi Mahasiswa ke Web Wisuda">
        <DialogCloseBtn @click="isSingleSyncDialogVisible = false" />
        <VDivider />

        <VCardText class="pt-4">
          <VAlert
            v-if="singleSyncItem?.is_synced"
            color="info"
            variant="tonal"
            class="mb-4"
          >
            <template #prepend>
              <VIcon icon="ri-information-line" />
            </template>
            Mahasiswa ini sudah terdaftar di Web Wisuda
            <span v-if="singleSyncItem?.sync_info?.no_unik">
              dengan Nomor Unik <strong>#{{ singleSyncItem.sync_info.no_unik }}</strong>
            </span>.
            Sinkronisasi ulang akan memperbarui data jika diperlukan.
          </VAlert>

          <VRow dense>
            <!-- Data Mahasiswa (Readonly) -->
            <VCol
              cols="12"
              sm="6"
            >
              <VTextField
                v-model="singleSyncForm.nim"
                label="NIM"
                readonly
                density="compact"
                prepend-inner-icon="ri-id-card-line"
              />
            </VCol>
            <VCol
              cols="12"
              sm="6"
            >
              <VTextField
                v-model="singleSyncForm.nama"
                label="Nama Mahasiswa"
                readonly
                density="compact"
                prepend-inner-icon="ri-user-line"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="singleSyncForm.prodi_nama"
                label="Program Studi"
                readonly
                density="compact"
                prepend-inner-icon="ri-graduation-cap-line"
              />
            </VCol>

            <!-- Target Tahun Wisuda -->
            <VCol
              cols="12"
              sm="6"
            >
              <VSelect
                v-model="singleSyncForm.tahun_id"
                label="Target Tahun Wisuda"
                :items="tahunWisudaList"
                placeholder="Pilih Tahun Wisuda"
                density="compact"
                prepend-inner-icon="ri-calendar-event-line"
                hint="Periode wisuda pada sistem Web Wisuda"
                persistent-hint
              />
            </VCol>

            <!-- Ukuran Baju -->
            <VCol
              cols="12"
              sm="6"
            >
              <VSelect
                v-model="singleSyncForm.ukuran_baju"
                label="Ukuran Jubah / Baju"
                :items="ukuranBajuOptions"
                density="compact"
                prepend-inner-icon="ri-t-shirt-line"
                hint="Ukuran baju toga wisuda"
                persistent-hint
              />
            </VCol>

            <!-- Nama Ayah -->
            <VCol
              cols="12"
              sm="6"
            >
              <VTextField
                v-model="singleSyncForm.nama_ayah"
                label="Nama Ayah"
                placeholder="Nama ayah kandung"
                density="compact"
                prepend-inner-icon="ri-parent-line"
              />
            </VCol>

            <!-- Tanggal Sidang -->
            <VCol
              cols="12"
              sm="6"
            >
              <AppDateTimePicker
                v-model="singleSyncForm.tanggal_sidang"
                label="Tanggal Sidang / Lulus"
                placeholder="Pilih Tanggal Sidang"
                density="compact"
                :config="{ dateFormat: 'Y-m-d' }"
              />
            </VCol>

            <!-- Judul Skripsi / Tesis -->
            <VCol cols="12">
              <VTextField
                v-model="singleSyncForm.judul"
                label="Judul Skripsi / Tesis"
                placeholder="Judul karya ilmiah akhir"
                density="compact"
                prepend-inner-icon="ri-book-2-line"
              />
            </VCol>
          </VRow>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn
            color="secondary"
            variant="outlined"
            :disabled="singleSyncLoading"
            @click="isSingleSyncDialogVisible = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="primary"
            prepend-icon="ri-cloud-upload-line"
            :loading="singleSyncLoading"
            @click="submitSingleSync"
          >
            Simpan & Sinkronkan
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- 👉 Dialog: Batch Sinkronisasi -->
    <VDialog
      v-model="isBatchSyncDialogVisible"
      max-width="540"
    >
      <VCard title="Sinkronisasi Massal (Batch) ke Web Wisuda">
        <DialogCloseBtn @click="isBatchSyncDialogVisible = false" />
        <VDivider />

        <VCardText class="pt-4">
          <VAlert
            color="primary"
            variant="tonal"
            class="mb-4"
          >
            <template #prepend>
              <VIcon icon="ri-information-line" />
            </template>
            <div v-if="batchSyncMode === 'selected'">
              Anda akan menyinkronkan <strong>{{ selectedRows.length }} mahasiswa</strong> yang dipilih ke Web Wisuda.
            </div>
            <div v-else>
              Anda akan menyinkronkan <strong>SEMUA ({{ statistics.not_synced.count }}) mahasiswa</strong> yang belum sinkron ke Web Wisuda.
            </div>
          </VAlert>

          <VRow dense>
            <VCol cols="12">
              <VSelect
                v-model="batchSyncTahunId"
                label="Target Tahun Wisuda"
                :items="tahunWisudaList"
                placeholder="Pilih Tahun Wisuda"
                density="compact"
                prepend-inner-icon="ri-calendar-event-line"
                hint="Periode wisuda pada sistem Web Wisuda"
                persistent-hint
              />
            </VCol>

            <VCol cols="12">
              <VSelect
                v-model="batchSyncUkuranBaju"
                label="Default Ukuran Baju"
                :items="ukuranBajuOptions"
                density="compact"
                prepend-inner-icon="ri-t-shirt-line"
                hint="Akan digunakan sebagai default jika belum diisi"
                persistent-hint
              />
            </VCol>
          </VRow>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn
            color="secondary"
            variant="outlined"
            :disabled="batchSyncLoading"
            @click="isBatchSyncDialogVisible = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="primary"
            prepend-icon="ri-cloud-upload-line"
            :loading="batchSyncLoading"
            @click="submitBatchSync"
          >
            Mulai Sinkronisasi Massal
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- 👉 Dialog: Laporan Hasil Batch Sinkronisasi -->
    <VDialog
      v-model="isBatchResultDialogVisible"
      max-width="680"
    >
      <VCard title="Hasil Sinkronisasi Massal">
        <DialogCloseBtn @click="isBatchResultDialogVisible = false" />
        <VDivider />

        <VCardText class="pt-4">
          <div class="d-flex gap-4 mb-4">
            <VCard
              variant="tonal"
              color="success"
              class="flex-grow-1 text-center py-3"
            >
              <div class="text-h5 font-weight-bold">
                {{ batchSyncResult?.success || 0 }}
              </div>
              <div class="text-caption">
                Berhasil Disinkronkan
              </div>
            </VCard>

            <VCard
              variant="tonal"
              :color="batchSyncResult?.failed > 0 ? 'error' : 'secondary'"
              class="flex-grow-1 text-center py-3"
            >
              <div class="text-h5 font-weight-bold">
                {{ batchSyncResult?.failed || 0 }}
              </div>
              <div class="text-caption">
                Gagal Disinkronkan
              </div>
            </VCard>

            <VCard
              variant="tonal"
              color="primary"
              class="flex-grow-1 text-center py-3"
            >
              <div class="text-h5 font-weight-bold">
                {{ batchSyncResult?.total || 0 }}
              </div>
              <div class="text-caption">
                Total Diproses
              </div>
            </VCard>
          </div>

          <!-- Log List -->
          <span class="text-subtitle-2 font-weight-bold mb-2 d-block">
            Rincian Log Sinkronisasi:
          </span>
          <VTable
            density="compact"
            class="border rounded"
          >
            <thead>
              <tr>
                <th style="width: 130px;">
                  NIM
                </th>
                <th style="width: 100px;">
                  Status
                </th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(log, idx) in (batchSyncResult?.logs || [])"
                :key="idx"
              >
                <td class="font-weight-medium">
                  {{ log.nim }}
                </td>
                <td>
                  <VChip
                    size="x-small"
                    :color="log.success ? 'success' : 'error'"
                    label
                  >
                    {{ log.success ? 'Sukses' : 'Gagal' }}
                  </VChip>
                </td>
                <td class="text-caption">
                  {{ log.message }}
                </td>
              </tr>
              <tr v-if="!batchSyncResult?.logs?.length">
                <td
                  colspan="3"
                  class="text-center text-medium-emphasis py-4"
                >
                  Tidak ada catatan log.
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn
            color="primary"
            @click="isBatchResultDialogVisible = false"
          >
            Tutup
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- 👉 Dialog: Detail Pembayaran & Status Wisuda -->
    <VDialog
      v-model="isDetailDialogVisible"
      max-width="700"
    >
      <VCard title="Detail Pembayaran & Status Wisuda">
        <DialogCloseBtn @click="isDetailDialogVisible = false" />
        <VDivider />

        <VCardText
          v-if="selectedDetailItem"
          class="pt-4"
        >
          <!-- Mahasiswa Info -->
          <div class="mb-4">
            <span class="text-subtitle-2 font-weight-bold text-primary mb-2 d-block">
              1. Data Mahasiswa
            </span>
            <VTable density="compact">
              <tbody>
                <tr>
                  <td
                    class="font-weight-medium text-medium-emphasis"
                    style="width: 180px;"
                  >
                    NIM
                  </td>
                  <td><strong>{{ selectedDetailItem.nim }}</strong></td>
                </tr>
                <tr>
                  <td class="font-weight-medium text-medium-emphasis">
                    Nama Mahasiswa
                  </td>
                  <td>{{ selectedDetailItem.nama_mahasiswa || '-' }}</td>
                </tr>
                <tr>
                  <td class="font-weight-medium text-medium-emphasis">
                    Jenis Kelamin
                  </td>
                  <td>{{ selectedDetailItem.jenis_kelamin || '-' }}</td>
                </tr>
                <tr>
                  <td class="font-weight-medium text-medium-emphasis">
                    Program Studi
                  </td>
                  <td>{{ selectedDetailItem.prodi?.alias }} - {{ selectedDetailItem.prodi?.nama }} ({{ selectedDetailItem.prodi?.jenjang }})</td>
                </tr>
              </tbody>
            </VTable>
          </div>

          <!-- Transaksi Info -->
          <div class="mb-4">
            <span class="text-subtitle-2 font-weight-bold text-primary mb-2 d-block">
              2. Data Transaksi Pembayaran
            </span>
            <VTable density="compact">
              <tbody>
                <tr>
                  <td
                    class="font-weight-medium text-medium-emphasis"
                    style="width: 180px;"
                  >
                    Nomor Transaksi
                  </td>
                  <td>{{ selectedDetailItem.nomor }}</td>
                </tr>
                <tr>
                  <td class="font-weight-medium text-medium-emphasis">
                    Nomor Nota
                  </td>
                  <td>{{ selectedDetailItem.nota || '-' }}</td>
                </tr>
                <tr>
                  <td class="font-weight-medium text-medium-emphasis">
                    Tanggal Transaksi
                  </td>
                  <td>{{ selectedDetailItem.tanggal_formatted }}</td>
                </tr>
                <tr>
                  <td class="font-weight-medium text-medium-emphasis">
                    Tagihan
                  </td>
                  <td>{{ selectedDetailItem.tagihan?.nama }} (TA: {{ selectedDetailItem.tagihan?.th_akademik_kode }})</td>
                </tr>
                <tr>
                  <td class="font-weight-medium text-medium-emphasis">
                    Nominal Pembayaran
                  </td>
                  <td>
                    <strong class="text-success text-subtitle-1">
                      {{ formatMoney(selectedDetailItem.jumlah, selectedDetailItem.mata_uang) }}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-medium text-medium-emphasis">
                    Metode Pembayaran
                  </td>
                  <td>{{ selectedDetailItem.jenis_pembayaran?.nama }}</td>
                </tr>
                <tr>
                  <td class="font-weight-medium text-medium-emphasis">
                    Petugas Penerima
                  </td>
                  <td>{{ selectedDetailItem.petugas?.name }}</td>
                </tr>
              </tbody>
            </VTable>
          </div>

          <!-- Web Wisuda Sync Info -->
          <div>
            <span class="text-subtitle-2 font-weight-bold text-primary mb-2 d-block">
              3. Status Sinkronisasi Web Wisuda
            </span>
            <VTable density="compact">
              <tbody>
                <tr>
                  <td
                    class="font-weight-medium text-medium-emphasis"
                    style="width: 180px;"
                  >
                    Status Integrasi
                  </td>
                  <td>
                    <VChip
                      size="small"
                      :color="selectedDetailItem.is_synced ? 'success' : 'error'"
                      :prepend-icon="selectedDetailItem.is_synced ? 'ri-checkbox-circle-line' : 'ri-close-circle-line'"
                    >
                      {{ selectedDetailItem.is_synced ? 'Sudah Terdaftar di Web Wisuda' : 'Belum Terdaftar di Web Wisuda' }}
                    </VChip>
                  </td>
                </tr>
                <tr v-if="selectedDetailItem.sync_info?.no_unik">
                  <td class="font-weight-medium text-medium-emphasis">
                    Nomor Unik Wisuda
                  </td>
                  <td>
                    <VChip
                      size="small"
                      color="primary"
                      variant="tonal"
                      class="font-weight-bold"
                    >
                      #{{ selectedDetailItem.sync_info.no_unik }}
                    </VChip>
                  </td>
                </tr>
                <tr v-if="selectedDetailItem.sync_info?.tahun_wisuda">
                  <td class="font-weight-medium text-medium-emphasis">
                    Tahun / Gelombang Wisuda
                  </td>
                  <td>{{ selectedDetailItem.sync_info.tahun_wisuda }}</td>
                </tr>
                <tr v-if="selectedDetailItem.sync_info?.synced_at">
                  <td class="font-weight-medium text-medium-emphasis">
                    Waktu Sinkronisasi
                  </td>
                  <td>{{ selectedDetailItem.sync_info.synced_at }}</td>
                </tr>
              </tbody>
            </VTable>
          </div>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-4">
          <VBtn
            v-if="selectedDetailItem && !selectedDetailItem.is_synced"
            color="primary"
            prepend-icon="ri-cloud-upload-line"
            @click="isDetailDialogVisible = false; openSingleSyncModal(selectedDetailItem)"
          >
            Sinkronkan Sekarang
          </VBtn>
          <VSpacer />
          <VBtn
            color="secondary"
            variant="outlined"
            @click="isDetailDialogVisible = false"
          >
            Tutup
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.cursor-pointer:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.04);
}
</style>
