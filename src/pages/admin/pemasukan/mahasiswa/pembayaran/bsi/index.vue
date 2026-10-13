<script setup>
import { copyTextToClipboard } from '@/utils/clipboard'

const router = useRouter()
const page = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const dataTable = ref([])
const loading = ref(false)
const initialLoading = ref(true)

// Filters
const search = ref('')
const selectedStatus = ref('all')
const selectedSync = ref('all')
const selectedReconciliation = ref('all')
const dateStart = ref('')
const dateEnd = ref('')

// Reconciliation Statistics
const reconciliationStats = ref(null)
const reconciliationStatsLoading = ref(false)

// Dialogs & action state
const detailDialog = ref(false)
const selectedPayment = ref(null)
const detailLoading = ref(false)
const actionLoading = ref(false)
const recheckLoading = ref(false)
const rejectDialog = ref(false)
const rejectTarget = ref(null)
const rejectionReason = ref('')

// User data & role
const userData = useCookie('userData').value ?? {}
const roleMap = {
  1: 'admin',
  2: 'pimpinan',
  3: 'keuangan',
  4: 'kabag',
  5: 'staff',
  13: 'kabag_pemasukan',
  14: 'kabag_pengeluaran',
}
const currentRole = computed(() => {
  const roleName = String(userData?.role?.name ?? '').toLowerCase().trim()
  if (roleName) return roleName

  return roleMap[userData?.role_id] || ''
})
const canProcess = computed(() => ['admin', 'keuangan', 'kabag', 'kabag_pemasukan', 'staff'].includes(currentRole.value))

const statusOptions = [
  { title: 'Semua Status', value: 'all' },
  { title: 'Menunggu Pembayaran', value: 'pending' },
  { title: 'Sudah Dibayar', value: 'paid' },
  { title: 'Perlu Ditinjau', value: 'needs_review' },
  { title: 'Berhasil', value: 'success' },
  { title: 'Sudah Diposting', value: 'posted' },
  { title: 'Ditolak', value: 'rejected' },
  { title: 'Kedaluwarsa', value: 'expired' },
  { title: 'Dibatalkan', value: 'cancelled' },
  { title: 'Gagal', value: 'failed' },
]

const syncOptions = [
  { title: 'Semua Sinkronisasi', value: 'all' },
  { title: 'Sudah Sinkron', value: '1' },
  { title: 'Belum Sinkron', value: '0' },
]

const reconciliationOptions = [
  { title: 'Semua Rekonsiliasi', value: 'all' },
  { title: 'Sudah Cocok (Matched)', value: 'matched' },
  { title: 'Belum Cocok (Mismatch)', value: 'mismatch' },
  { title: 'Belum Ada Rekon', value: 'unreconciled' },
]

const headers = [
  { title: 'No', key: 'row_number', sortable: false, width: 54, align: 'center' },
  { title: 'Transaksi', key: 'transaction', sortable: false, minWidth: '175px' },
  { title: 'Mahasiswa', key: 'student', sortable: false, minWidth: '160px' },
  { title: 'Virtual Account', key: 'va_number', sortable: false, minWidth: '170px' },
  { title: 'Total', key: 'total', sortable: false, align: 'end', minWidth: '125px' },
  { title: 'Status', key: 'status', sortable: false, align: 'center', minWidth: '115px' },
  { title: 'Rekonsiliasi', key: 'reconciliation', sortable: false, align: 'center', minWidth: '135px' },
  { title: 'Sinkronisasi', key: 'transferred', sortable: false, align: 'center', minWidth: '125px' },
  { title: 'Waktu', key: 'created_at', sortable: false, minWidth: '155px' },
  { title: 'Aksi', key: 'actions', sortable: false, align: 'center', width: 90 },
]

const statusMeta = {
  pending: { label: 'Menunggu', color: 'warning' },
  paid: { label: 'Dibayar', color: 'success' },
  needs_review: { label: 'Perlu Ditinjau', color: 'error' },
  success: { label: 'Berhasil', color: 'success' },
  posted: { label: 'Diposting', color: 'primary' },
  rejected: { label: 'Ditolak', color: 'error' },
  expired: { label: 'Kedaluwarsa', color: 'secondary' },
  cancelled: { label: 'Dibatalkan', color: 'secondary' },
  failed: { label: 'Gagal', color: 'error' },
}

const getStatusMeta = status => statusMeta[status] ?? {
  label: status || '-',
  color: 'secondary',
}

const formatCurrency = value => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
}).format(Number(value ?? 0))

const formatDateTime = value => {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

const errorMessage = error => {
  const errors = error?.data?.errors
  if (errors && typeof errors === 'object')
    return Object.values(errors).flat().join(' ')

  return error?.data?.message || error?.message || 'Terjadi kesalahan.'
}

const hasActiveFilters = computed(() => {
  return (
    Boolean(search.value.trim()) ||
    selectedStatus.value !== 'all' ||
    selectedSync.value !== 'all' ||
    selectedReconciliation.value !== 'all' ||
    Boolean(dateStart.value) ||
    Boolean(dateEnd.value)
  )
})

let currentRequestId = 0

const fetchData = async () => {
  const requestId = ++currentRequestId
  loading.value = true

  try {
    const params = {
      page: page.value,
      limit: itemsPerPage.value,
      ...(search.value.trim() ? { search: search.value.trim() } : {}),
      ...(selectedStatus.value !== 'all' ? { status: selectedStatus.value } : {}),
      ...(selectedSync.value !== 'all' ? { transferred: selectedSync.value } : {}),
      ...(selectedReconciliation.value !== 'all' ? { reconciliation_status: selectedReconciliation.value } : {}),
      ...(dateStart.value ? { tanggal_mulai: dateStart.value } : {}),
      ...(dateEnd.value ? { tanggal_akhir: dateEnd.value } : {}),
    }

    const response = await $api('/admin/pemasukan/mahasiswa/pembayaran-bsi', {
      method: 'GET',
      params,
    })

    if (requestId !== currentRequestId) return

    dataTable.value = response.data?.data || []
    totalItems.value = Number(response.data?.total || 0)
  } catch (error) {
    if (requestId !== currentRequestId) return
    showSnackbar({
      text: errorMessage(error),
      color: 'error',
    })
  } finally {
    if (requestId === currentRequestId) {
      loading.value = false
      initialLoading.value = false
    }
  }
}

const fetchReconciliationStats = async () => {
  reconciliationStatsLoading.value = true
  try {
    const params = {
      ...(dateStart.value ? { tanggal_mulai: dateStart.value } : {}),
      ...(dateEnd.value ? { tanggal_akhir: dateEnd.value } : {}),
    }

    const response = await $api('/admin/pemasukan/mahasiswa/pembayaran-bsi/reconciliation-stats', {
      method: 'GET',
      params,
    })

    reconciliationStats.value = response.data
  } catch (error) {
    showSnackbar({ text: errorMessage(error), color: 'error' })
  } finally {
    reconciliationStatsLoading.value = false
  }
}

const handleRecheckReconciliations = async () => {
  recheckLoading.value = true
  try {
    const response = await $api('/admin/pemasukan/mahasiswa/pembayaran-bsi/recheck-reconciliations', {
      method: 'POST',
    })

    showSnackbar({
      text: response.message || 'Pemeriksaan ulang rekonsiliasi selesai.',
      color: 'success',
    })
    await refreshAll()
  } catch (error) {
    showSnackbar({
      text: errorMessage(error),
      color: 'error',
    })
  } finally {
    recheckLoading.value = false
  }
}

const refreshAll = () => Promise.all([fetchData(), fetchReconciliationStats()])

const loadItems = ({ page: nextPage, itemsPerPage: nextItemsPerPage }) => {
  page.value = nextPage
  itemsPerPage.value = nextItemsPerPage
  fetchData()
}

const handleFilterChange = () => {
  if (page.value === 1) {
    fetchData()
  } else {
    page.value = 1
  }
}

const applyDateFilter = () => {
  page.value = 1
  refreshAll()
}

const resetFilters = () => {
  search.value = ''
  selectedStatus.value = 'all'
  selectedSync.value = 'all'
  selectedReconciliation.value = 'all'
  dateStart.value = ''
  dateEnd.value = ''
  page.value = 1
  refreshAll()
}

const statCards = computed(() => [
  {
    key: 'total',
    filterKey: 'all',
    title: 'Total Rekonsiliasi',
    subtitle: 'Semua data rekonsiliasi',
    color: 'primary',
    icon: 'ri-file-list-3-line',
    count: reconciliationStats.value?.total?.count || 0,
    amount: reconciliationStats.value?.total?.amount || 0,
    isActive: selectedReconciliation.value === 'all',
  },
  {
    key: 'matched',
    filterKey: 'matched',
    title: 'Sudah Cocok',
    subtitle: 'Data rekonsiliasi matched',
    color: 'success',
    icon: 'ri-checkbox-circle-line',
    count: reconciliationStats.value?.matched?.count || 0,
    amount: reconciliationStats.value?.matched?.amount || 0,
    isActive: selectedReconciliation.value === 'matched',
  },
  {
    key: 'mismatch',
    filterKey: 'mismatch',
    title: 'Belum Cocok',
    subtitle: 'Perlu ditinjau / mismatch',
    color: 'error',
    icon: 'ri-error-warning-line',
    count: reconciliationStats.value?.mismatch?.count || 0,
    amount: reconciliationStats.value?.mismatch?.amount || 0,
    isActive: selectedReconciliation.value === 'mismatch',
  },
])

const setStatFilter = key => {
  if (key === 'matched') {
    selectedReconciliation.value = selectedReconciliation.value === 'matched' ? 'all' : 'matched'
  } else if (key === 'mismatch') {
    selectedReconciliation.value = selectedReconciliation.value === 'mismatch' ? 'all' : 'mismatch'
  } else {
    selectedReconciliation.value = 'all'
  }
  handleFilterChange()
}

const handleCopyVa = async va => {
  if (!va) return
  try {
    await copyTextToClipboard(va)
    showSnackbar({
      text: `Nomor VA ${va} berhasil disalin.`,
      color: 'info',
    })
  } catch {
    showSnackbar({
      text: 'Gagal menyalin nomor VA.',
      color: 'error',
    })
  }
}

const showDetail = async item => {
  detailDialog.value = true
  detailLoading.value = true
  selectedPayment.value = item

  try {
    const response = await $api(
      `/admin/pemasukan/mahasiswa/pembayaran-bsi/${item.id}`,
      { method: 'GET' },
    )

    selectedPayment.value = response.data
  } catch (error) {
    showSnackbar({
      text: errorMessage(error),
      color: 'error',
    })
  } finally {
    detailLoading.value = false
  }
}

const showRejectDialog = item => {
  rejectTarget.value = item
  rejectionReason.value = ''
  rejectDialog.value = true
}

const submitReject = async () => {
  if (!rejectionReason.value.trim()) {
    showSnackbar({
      text: 'Alasan penolakan wajib diisi.',
      color: 'warning',
    })

    return
  }

  actionLoading.value = true

  try {
    const response = await $api(
      `/admin/pemasukan/mahasiswa/pembayaran-bsi/${rejectTarget.value.id}/reject`,
      {
        method: 'POST',
        body: {
          reason: rejectionReason.value,
        },
      },
    )

    showSnackbar({
      text: response.message,
      color: 'success',
    })
    rejectDialog.value = false
    await refreshAll()
  } catch (error) {
    showSnackbar({
      text: errorMessage(error),
      color: 'error',
    })
  } finally {
    actionLoading.value = false
  }
}

const canReject = item => canProcess.value && !['success', 'posted', 'rejected'].includes(item.status)

onMounted(() => {
  document.title = 'Pembayaran VA BSI - SIMKEU'
  refreshAll()
})
</script>

<template>
  <!-- Card Filter Periode Tanggal -->
  <VCard class="mb-4">
    <VCardText>
      <VRow align="center">
        <VCol
          cols="12"
          md="4"
        >
          <div class="d-flex align-center gap-2">
            <VIcon
              icon="ri-calendar-event-line"
              color="primary"
              size="24"
            />
            <div>
              <div class="text-h6 font-weight-bold">
                Periode & Statistik
              </div>
              <div class="text-caption text-medium-emphasis">
                Filter transaksi dan rekonsiliasi berdasarkan rentang tanggal.
              </div>
            </div>
          </div>
        </VCol>

        <VCol
          cols="12"
          sm="6"
          md="3"
        >
          <VTextField
            v-model="dateStart"
            type="date"
            label="Tanggal Mulai"
            density="compact"
            hide-details
            clearable
            @click:clear="dateStart = ''; applyDateFilter()"
            @keyup.enter="applyDateFilter"
          />
        </VCol>

        <VCol
          cols="12"
          sm="6"
          md="3"
        >
          <VTextField
            v-model="dateEnd"
            type="date"
            label="Tanggal Akhir"
            density="compact"
            hide-details
            clearable
            @click:clear="dateEnd = ''; applyDateFilter()"
            @keyup.enter="applyDateFilter"
          />
        </VCol>

        <VCol
          cols="12"
          md="2"
          class="d-flex gap-2"
        >
          <VBtn
            block
            color="primary"
            variant="tonal"
            prepend-icon="ri-filter-3-line"
            :loading="reconciliationStatsLoading || loading"
            @click="applyDateFilter"
          >
            Terapkan
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

  <!-- Stat Cards Interaktif -->
  <VRow class="mb-4">
    <VCol
      v-for="card in statCards"
      :key="card.key"
      cols="12"
      md="4"
    >
      <VCard
        :loading="reconciliationStatsLoading"
        class="cursor-pointer stat-filter-card"
        :class="{ 'stat-card-active': card.isActive }"
        :style="card.isActive ? `border: 2px solid rgb(var(--v-theme-${card.color})) !important;` : ''"
        @click="setStatFilter(card.filterKey)"
      >
        <VCardText class="d-flex align-center justify-space-between gap-3">
          <div class="d-flex align-center gap-4">
            <VAvatar
              :color="card.color"
              variant="tonal"
              size="48"
            >
              <VIcon
                :icon="card.icon"
                size="26"
              />
            </VAvatar>
            <div>
              <div class="text-caption text-medium-emphasis">
                {{ card.title }}
              </div>
              <div class="text-h5 font-weight-bold">
                {{ Number(card.count).toLocaleString('id-ID') }}
                <span class="text-body-2 font-weight-regular text-medium-emphasis">data</span>
              </div>
              <div class="text-body-2 font-weight-medium">
                {{ formatCurrency(card.amount) }}
              </div>
            </div>
          </div>

          <div class="text-end">
            <VChip
              v-if="card.isActive"
              :color="card.color"
              size="small"
              label
              variant="flat"
            >
              Aktif
            </VChip>
            <div
              v-else
              class="text-caption text-disabled d-none d-sm-block"
            >
              Klik filter
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <!-- Tabel Utama -->
  <VCard>
    <VCardItem class="pb-3">
      <div class="d-flex flex-wrap align-center gap-3">
        <div>
          <VCardTitle class="text-h6 font-weight-bold">
            Daftar Pembayaran VA BSI
          </VCardTitle>
          <VCardSubtitle>
            Monitoring payment order, transaksi BI-SNAP, rekonsiliasi BSI, dan sinkronisasi pembukuan.
          </VCardSubtitle>
        </div>

        <VSpacer />

        <VBtn
          v-if="canProcess"
          variant="outlined"
          color="secondary"
          prepend-icon="ri-check-double-line"
          :loading="recheckLoading"
          @click="handleRecheckReconciliations"
        >
          Cek Ulang Rekon
        </VBtn>

        <VBtn
          v-if="canProcess"
          color="primary"
          prepend-icon="ri-loop-left-line"
          @click="router.push('/admin/pemasukan/mahasiswa/pembayaran/bsi/sinkronisasi')"
        >
          Sinkronisasi
        </VBtn>

        <VBtn
          variant="tonal"
          prepend-icon="ri-refresh-line"
          :loading="loading"
          @click="refreshAll"
        >
          Muat Ulang
        </VBtn>
      </div>
    </VCardItem>

    <VDivider />

    <!-- Filter Controls Bar -->
    <VCardText class="pb-3">
      <VRow>
        <VCol
          cols="12"
          md="4"
        >
          <VTextField
            v-model="search"
            label="Cari transaksi..."
            placeholder="Nomor, NIM, nama, VA, atau referensi"
            prepend-inner-icon="ri-search-line"
            clearable
            density="compact"
            hide-details
            @keyup.enter="handleFilterChange"
            @click:clear="search = ''; handleFilterChange()"
          />
        </VCol>

        <VCol
          cols="12"
          sm="6"
          md="3"
        >
          <VSelect
            v-model="selectedStatus"
            :items="statusOptions"
            label="Status"
            density="compact"
            hide-details
            @update:model-value="handleFilterChange"
          />
        </VCol>

        <VCol
          cols="12"
          sm="6"
          md="2"
        >
          <VSelect
            v-model="selectedReconciliation"
            :items="reconciliationOptions"
            label="Rekonsiliasi"
            density="compact"
            hide-details
            @update:model-value="handleFilterChange"
          />
        </VCol>

        <VCol
          cols="12"
          sm="6"
          md="2"
        >
          <VSelect
            v-model="selectedSync"
            :items="syncOptions"
            label="Sinkronisasi"
            density="compact"
            hide-details
            @update:model-value="handleFilterChange"
          />
        </VCol>

        <VCol
          cols="12"
          sm="6"
          md="1"
          class="d-flex align-center"
        >
          <VBtn
            icon="ri-filter-off-line"
            variant="tonal"
            color="secondary"
            density="compact"
            title="Reset semua filter"
            :disabled="!hasActiveFilters"
            @click="resetFilters"
          />
        </VCol>
      </VRow>
    </VCardText>

    <!-- Chips Filter Aktif -->
    <div
      v-if="hasActiveFilters"
      class="d-flex flex-wrap align-center gap-2 px-6 pb-3 pt-1"
    >
      <span class="text-caption font-weight-medium text-medium-emphasis">
        Filter aktif:
      </span>

      <VChip
        v-if="search.trim()"
        size="small"
        closable
        @click:close="search = ''; handleFilterChange()"
      >
        Cari: {{ search }}
      </VChip>

      <VChip
        v-if="selectedStatus !== 'all'"
        size="small"
        color="primary"
        variant="tonal"
        closable
        @click:close="selectedStatus = 'all'; handleFilterChange()"
      >
        Status: {{ getStatusMeta(selectedStatus).label }}
      </VChip>

      <VChip
        v-if="selectedReconciliation !== 'all'"
        size="small"
        :color="selectedReconciliation === 'matched' ? 'success' : selectedReconciliation === 'mismatch' ? 'error' : 'secondary'"
        variant="tonal"
        closable
        @click:close="selectedReconciliation = 'all'; handleFilterChange()"
      >
        Rekon: {{ selectedReconciliation === 'matched' ? 'Cocok' : selectedReconciliation === 'mismatch' ? 'Belum Cocok' : 'Belum Ada' }}
      </VChip>

      <VChip
        v-if="selectedSync !== 'all'"
        size="small"
        color="info"
        variant="tonal"
        closable
        @click:close="selectedSync = 'all'; handleFilterChange()"
      >
        Sinkron: {{ selectedSync === '1' ? 'Sudah' : 'Belum' }}
      </VChip>

      <VChip
        v-if="dateStart || dateEnd"
        size="small"
        color="warning"
        variant="tonal"
        closable
        @click:close="dateStart = ''; dateEnd = ''; applyDateFilter()"
      >
        Periode: {{ dateStart || 'Awal' }} s/d {{ dateEnd || 'Akhir' }}
      </VChip>

      <VBtn
        size="x-small"
        variant="text"
        color="error"
        prepend-icon="ri-close-line"
        @click="resetFilters"
      >
        Reset Semua
      </VBtn>
    </div>

    <!-- Data Table Server -->
    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :headers="headers"
      :items="dataTable"
      :items-length="totalItems"
      :loading="loading"
      class="text-no-wrap"
      @update:options="loadItems"
    >
      <template
        v-if="initialLoading"
        #loading
      >
        <div class="text-center pa-8">
          <VProgressCircular
            indeterminate
            color="primary"
            class="mb-3"
          />
          <div class="text-body-2 text-medium-emphasis">
            Memuat transaksi VA BSI...
          </div>
        </div>
      </template>

      <template #no-data>
        <div class="text-center pa-8">
          <VAvatar
            color="secondary"
            variant="tonal"
            size="56"
            class="mb-3"
          >
            <VIcon
              icon="ri-inbox-line"
              size="32"
            />
          </VAvatar>
          <div class="text-h6 font-weight-medium">
            Tidak ada transaksi ditemukan
          </div>
          <div class="text-body-2 text-medium-emphasis mb-3">
            {{ hasActiveFilters ? 'Coba ubah atau reset filter pencarian Anda.' : 'Belum ada data transaksi VA BSI yang tercatat.' }}
          </div>
          <VBtn
            v-if="hasActiveFilters"
            size="small"
            variant="tonal"
            color="primary"
            @click="resetFilters"
          >
            Reset Filter
          </VBtn>
        </div>
      </template>

      <!-- Kolom No -->
      <template #item.row_number="{ index }">
        <span class="text-caption text-medium-emphasis">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </span>
      </template>

      <!-- Kolom Transaksi -->
      <template #item.transaction="{ item }">
        <div class="py-2">
          <div
            class="font-weight-semibold cursor-pointer text-primary"
            title="Lihat detail transaksi"
            @click="showDetail(item)"
          >
            {{ item.nomor }}
          </div>
          <div
            class="text-caption text-medium-emphasis text-truncate"
            style="max-width: 170px;"
            :title="item.request_id"
          >
            {{ item.request_id }}
          </div>
          <div
            v-if="item.bank_reference"
            class="text-caption text-disabled"
          >
            Ref: {{ item.bank_reference }}
          </div>
        </div>
      </template>

      <!-- Kolom Mahasiswa -->
      <template #item.student="{ item }">
        <div class="py-2">
          <div class="font-weight-medium text-high-emphasis text-truncate" style="max-width: 160px;" :title="item.nama_mahasiswa || '-'">
            {{ item.nama_mahasiswa || '-' }}
          </div>
          <div class="text-caption text-medium-emphasis font-weight-medium">
            {{ item.nim }}
          </div>
        </div>
      </template>

      <!-- Kolom Virtual Account -->
      <template #item.va_number="{ item }">
        <div class="py-2">
          <div class="d-flex align-center gap-1">
            <span class="font-weight-bold font-monospace text-body-2">
              {{ item.va_number }}
            </span>
            <IconBtn
              size="x-small"
              title="Salin Nomor VA"
              @click.stop="handleCopyVa(item.va_number)"
            >
              <VIcon
                icon="ri-file-copy-line"
                size="15"
              />
            </IconBtn>
          </div>
          <div
            v-if="item.metode_va"
            class="mt-1"
          >
            <VChip
              size="x-small"
              variant="tonal"
              color="info"
              label
            >
              {{ item.metode_va.nama }}
            </VChip>
          </div>
        </div>
      </template>

      <!-- Kolom Total -->
      <template #item.total="{ item }">
        <div class="py-2 text-end">
          <div class="font-weight-bold text-high-emphasis">
            {{ formatCurrency(item.total) }}
          </div>
          <div
            v-if="item.admin_fee_amount && Number(item.admin_fee_amount) > 0"
            class="text-caption text-medium-emphasis"
          >
            + Fee: {{ formatCurrency(item.admin_fee_amount) }}
          </div>
        </div>
      </template>

      <!-- Kolom Status -->
      <template #item.status="{ item }">
        <VChip
          :color="getStatusMeta(item.status).color"
          size="small"
          label
          variant="tonal"
        >
          {{ getStatusMeta(item.status).label }}
        </VChip>
      </template>

      <!-- Kolom Rekonsiliasi (BARU) -->
      <template #item.reconciliation="{ item }">
        <div class="d-flex flex-column align-center gap-1">
          <VChip
            v-if="item.reconciliation_status === 'matched' || item.reconciliations?.[0]?.match_status === 'matched'"
            color="success"
            size="small"
            label
            variant="tonal"
            prepend-icon="ri-checkbox-circle-line"
          >
            Cocok
          </VChip>
          <VChip
            v-else-if="item.reconciliation_status === 'mismatch' || (item.reconciliations?.[0] && item.reconciliations[0].match_status !== 'matched')"
            color="error"
            size="small"
            label
            variant="tonal"
            prepend-icon="ri-close-circle-line"
          >
            Mismatch
          </VChip>
          <VChip
            v-else
            color="secondary"
            size="small"
            label
            variant="tonal"
            prepend-icon="ri-subtract-line"
          >
            Belum Ada
          </VChip>
          <span
            v-if="item.reconciliations?.[0]?.settlement_code"
            class="text-caption text-disabled font-monospace"
            style="font-size: 10px;"
          >
            {{ item.reconciliations[0].settlement_code }}
          </span>
        </div>
      </template>

      <!-- Kolom Sinkronisasi -->
      <template #item.transferred="{ item }">
        <VChip
          :color="item.transferred ? 'success' : 'warning'"
          size="small"
          label
          variant="tonal"
          :prepend-icon="item.transferred ? 'ri-check-double-line' : 'ri-time-line'"
        >
          {{ item.transferred ? 'Sudah' : 'Belum' }}
        </VChip>
      </template>

      <!-- Kolom Waktu -->
      <template #item.created_at="{ item }">
        <div class="py-2 text-caption">
          <div class="d-flex align-center gap-1 text-medium-emphasis">
            <VIcon
              icon="ri-calendar-line"
              size="13"
              class="text-disabled"
            />
            <span>{{ formatDateTime(item.created_at) }}</span>
          </div>
          <div
            v-if="item.paid_at"
            class="text-success d-flex align-center gap-1 mt-1 font-weight-medium"
          >
            <VIcon
              icon="ri-check-line"
              size="13"
            />
            <span>{{ formatDateTime(item.paid_at) }}</span>
          </div>
          <div
            v-else-if="item.expired_at"
            class="text-disabled d-flex align-center gap-1 mt-1"
          >
            <VIcon
              icon="ri-time-line"
              size="13"
            />
            <span>Exp: {{ formatDateTime(item.expired_at) }}</span>
          </div>
        </div>
      </template>

      <!-- Kolom Aksi -->
      <template #item.actions="{ item }">
        <div class="d-flex justify-center gap-1">
          <IconBtn
            size="small"
            title="Lihat detail"
            @click="showDetail(item)"
          >
            <VIcon icon="ri-eye-line" />
          </IconBtn>

          <IconBtn
            v-if="canReject(item)"
            size="small"
            color="error"
            title="Tolak transaksi"
            @click="showRejectDialog(item)"
          >
            <VIcon icon="ri-close-circle-line" />
          </IconBtn>
        </div>
      </template>
    </VDataTableServer>
  </VCard>

  <!-- Dialog Detail Pembayaran VA BSI -->
  <VDialog
    v-model="detailDialog"
    max-width="850"
  >
    <VCard title="Detail Pembayaran VA BSI">
      <DialogCloseBtn @click="detailDialog = false" />

      <VCardText v-if="detailLoading">
        <div class="text-center pa-8">
          <VProgressCircular
            indeterminate
            color="primary"
          />
        </div>
      </VCardText>

      <VCardText v-else-if="selectedPayment">
        <VRow>
          <VCol
            cols="12"
            md="6"
          >
            <div class="text-caption text-medium-emphasis">
              Nomor Transaksi
            </div>
            <div class="font-weight-medium">
              {{ selectedPayment.nomor }}
            </div>
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <div class="text-caption text-medium-emphasis">
              Status
            </div>
            <VChip
              :color="getStatusMeta(selectedPayment.status).color"
              size="small"
              label
              variant="tonal"
            >
              {{ getStatusMeta(selectedPayment.status).label }}
            </VChip>
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <div class="text-caption text-medium-emphasis">
              Mahasiswa
            </div>
            <div>{{ selectedPayment.nim }} - {{ selectedPayment.nama_mahasiswa || '-' }}</div>
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <div class="text-caption text-medium-emphasis">
              Virtual Account
            </div>
            <div class="d-flex align-center gap-2">
              <span class="font-weight-medium font-monospace">{{ selectedPayment.va_number }}</span>
              <IconBtn
                size="x-small"
                title="Salin"
                @click="handleCopyVa(selectedPayment.va_number)"
              >
                <VIcon
                  icon="ri-file-copy-line"
                  size="15"
                />
              </IconBtn>
            </div>
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <div class="text-caption text-medium-emphasis">
              Environment Transaksi
            </div>
            <VChip
              size="small"
              :color="selectedPayment.production ? 'success' : 'warning'"
              variant="tonal"
            >
              {{ selectedPayment.production ? 'PRODUCTION' : 'SANDBOX' }}
            </VChip>
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <div class="text-caption text-medium-emphasis">
              Metode Pembayaran
            </div>
            <div class="font-weight-medium">
              {{ selectedPayment.metode_va?.nama || '-' }}
            </div>
            <div class="text-caption text-medium-emphasis">
              Channel {{ selectedPayment.channel_id || '-' }}
            </div>
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <div class="text-caption text-medium-emphasis">
              Status Rekonsiliasi
            </div>
            <VChip
              size="small"
              label
              variant="tonal"
              :color="selectedPayment.reconciliation_status === 'matched' ? 'success' : selectedPayment.reconciliation_status === 'mismatch' ? 'error' : 'secondary'"
            >
              {{ selectedPayment.reconciliation_status === 'matched' ? 'Cocok (Matched)' : selectedPayment.reconciliation_status === 'mismatch' ? 'Mismatch' : 'Belum Rekonsiliasi' }}
            </VChip>
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <div class="text-caption text-medium-emphasis">
              Status Sinkronisasi
            </div>
            <VChip
              size="small"
              label
              variant="tonal"
              :color="selectedPayment.transferred ? 'success' : 'warning'"
            >
              {{ selectedPayment.transferred ? 'Sudah Sinkron ke Pembukuan' : 'Belum Sinkron' }}
            </VChip>
          </VCol>
        </VRow>

        <VDivider class="my-5" />

        <VTable density="compact">
          <thead>
            <tr>
              <th>Tagihan</th>
              <th>Cara Bayar</th>
              <th class="text-end">
                Nominal
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="detail in selectedPayment.details"
              :key="detail.id"
            >
              <td>{{ detail.tagihan_nama }}</td>
              <td class="text-capitalize">
                {{ detail.cara_bayar }}
              </td>
              <td class="text-end font-weight-medium">
                {{ formatCurrency(detail.jumlah) }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="2">
                Total
              </th>
              <th class="text-end">
                {{ formatCurrency(selectedPayment.total) }}
              </th>
            </tr>
          </tfoot>
        </VTable>

        <VAlert
          v-if="selectedPayment.status === 'needs_review'"
          type="warning"
          variant="tonal"
          class="mt-5"
        >
          Nominal callback bank berbeda dari total transaksi. Periksa payload callback dan
          rekonsiliasi transaksi.
        </VAlert>

        <VAlert
          v-if="selectedPayment.rejection_reason"
          type="error"
          variant="tonal"
          class="mt-5"
        >
          {{ selectedPayment.rejection_reason }}
        </VAlert>

        <template v-if="selectedPayment.snap_logs?.length">
          <h4 class="text-h6 mt-6 mb-3">
            Log BI-SNAP
          </h4>
          <VTable density="compact">
            <thead>
              <tr>
                <th>Operasi</th>
                <th>External ID</th>
                <th>Response</th>
                <th>Durasi</th>
                <th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="log in selectedPayment.snap_logs"
                :key="log.id"
              >
                <td class="text-capitalize">
                  {{ log.operation }}
                </td>
                <td>{{ log.external_id || '-' }}</td>
                <td><code>{{ log.response_code || log.http_status }}</code></td>
                <td>{{ log.duration_ms }} ms</td>
                <td>{{ formatDateTime(log.requested_at) }}</td>
              </tr>
            </tbody>
          </VTable>
        </template>

        <template v-if="selectedPayment.reconciliations?.length">
          <h4 class="text-h6 mt-6 mb-3">
            Rekonsiliasi
          </h4>
          <VTable density="compact">
            <thead>
              <tr>
                <th>ID Rekon</th>
                <th>Status</th>
                <th class="text-end">
                  Nominal
                </th>
                <th>Settlement</th>
                <th>Deskripsi Ketidakcocokan</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="recon in selectedPayment.reconciliations"
                :key="recon.id"
              >
                <td>{{ recon.recon_id }}</td>
                <td>
                  <VChip
                    size="x-small"
                    variant="tonal"
                    :color="recon.match_status === 'matched' ? 'success' : 'error'"
                  >
                    {{ recon.match_status }}
                  </VChip>
                </td>
                <td class="text-end">
                  {{ formatCurrency(recon.payment_amount) }}
                </td>
                <td>{{ recon.settlement_code || '-' }}</td>
                <td style="min-width: 280px; white-space: normal">
                  {{ recon.mismatch_description || '-' }}
                </td>
              </tr>
            </tbody>
          </VTable>
        </template>
      </VCardText>

      <VCardActions class="justify-end">
        <VBtn
          variant="outlined"
          color="secondary"
          @click="detailDialog = false"
        >
          Tutup
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- Dialog Tolak Transaksi -->
  <VDialog
    v-model="rejectDialog"
    max-width="560"
  >
    <VCard title="Tolak Pembayaran BSI">
      <DialogCloseBtn @click="rejectDialog = false" />

      <VCardText>
        <p>
          Transaksi <strong>{{ rejectTarget?.nomor }}</strong> akan ditolak.
        </p>
        <VTextarea
          v-model="rejectionReason"
          label="Alasan penolakan"
          rows="3"
          counter="1000"
          maxlength="1000"
        />
      </VCardText>

      <VCardActions class="justify-end">
        <VBtn
          variant="outlined"
          color="secondary"
          :disabled="actionLoading"
          @click="rejectDialog = false"
        >
          Batal
        </VBtn>
        <VBtn
          color="error"
          :loading="actionLoading"
          @click="submitReject"
        >
          Tolak
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped>
.stat-filter-card {
  transition: all 0.2s ease-in-out;
}
.stat-filter-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.08);
}
.stat-card-active {
  box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.12);
}
</style>
