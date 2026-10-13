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

// Stat Cards Tab & Data
const activeStatTab = ref('all')
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
  { title: 'Berhasil', value: 'success' },
  { title: 'Menunggu Pembayaran', value: 'pending' },
  { title: 'Kedaluwarsa', value: 'expired' },
  { title: 'Dibatalkan', value: 'cancelled' },
  { title: 'Ditolak', value: 'rejected' },
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

const activeDateShortcut = ref('')

const formatDateISO = date => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const setDateShortcut = shortcut => {
  const now = new Date()
  activeDateShortcut.value = shortcut

  if (shortcut === 'this-month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    dateStart.value = formatDateISO(start)
    dateEnd.value = formatDateISO(end)
  } else if (shortcut === 'last-month') {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const end = new Date(now.getFullYear(), now.getMonth(), 0)
    dateStart.value = formatDateISO(start)
    dateEnd.value = formatDateISO(end)
  } else if (shortcut === 'today') {
    dateStart.value = formatDateISO(now)
    dateEnd.value = formatDateISO(now)
  } else if (shortcut === 'last-30-days') {
    const start = new Date()
    start.setDate(start.getDate() - 29)
    dateStart.value = formatDateISO(start)
    dateEnd.value = formatDateISO(now)
  } else if (shortcut === 'this-year') {
    const start = new Date(now.getFullYear(), 0, 1)
    const end = new Date(now.getFullYear(), 11, 31)
    dateStart.value = formatDateISO(start)
    dateEnd.value = formatDateISO(end)
  } else if (shortcut === 'all') {
    dateStart.value = ''
    dateEnd.value = ''
    activeDateShortcut.value = ''
  }

  applyDateFilter()
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
  activeDateShortcut.value = ''
  page.value = 1
  refreshAll()
}

// Koleksi Stat Cards Komprehensif (Rekon, Sinkron, Status)
const allStatCards = computed(() => {
  const stats = reconciliationStats.value || {}

  return [
    {
      group: 'recon',
      key: 'total',
      filterType: 'reset',
      filterValue: 'all',
      title: 'Total Transaksi',
      color: 'primary',
      icon: 'ri-file-list-3-line',
      count: stats.total?.count || 0,
      amount: stats.total?.amount || 0,
      isActive: selectedReconciliation.value === 'all' && selectedSync.value === 'all' && selectedStatus.value === 'all',
    },
    {
      group: 'recon',
      key: 'matched',
      filterType: 'recon',
      filterValue: 'matched',
      title: 'Rekon Cocok',
      color: 'success',
      icon: 'ri-checkbox-circle-line',
      count: stats.matched?.count || 0,
      amount: stats.matched?.amount || 0,
      isActive: selectedReconciliation.value === 'matched',
    },
    {
      group: 'recon',
      key: 'mismatch',
      filterType: 'recon',
      filterValue: 'mismatch',
      title: 'Rekon Mismatch',
      color: 'error',
      icon: 'ri-error-warning-line',
      count: stats.mismatch?.count || 0,
      amount: stats.mismatch?.amount || 0,
      isActive: selectedReconciliation.value === 'mismatch',
    },
    {
      group: 'sync',
      key: 'synced',
      filterType: 'sync',
      filterValue: '1',
      title: 'Sudah Sinkron',
      color: 'info',
      icon: 'ri-check-double-line',
      count: stats.synced?.count || 0,
      amount: stats.synced?.amount || 0,
      isActive: selectedSync.value === '1',
    },
    {
      group: 'sync',
      key: 'unsynced',
      filterType: 'sync',
      filterValue: '0',
      title: 'Belum Sinkron',
      color: 'warning',
      icon: 'ri-history-line',
      count: stats.unsynced?.count || 0,
      amount: stats.unsynced?.amount || 0,
      isActive: selectedSync.value === '0',
    },
    {
      group: 'status',
      key: 'success',
      filterType: 'status',
      filterValue: 'success',
      title: 'Status Berhasil',
      color: 'success',
      icon: 'ri-shield-check-line',
      count: stats.success?.count || 0,
      amount: stats.success?.amount || 0,
      isActive: selectedStatus.value === 'success',
    },
    {
      group: 'status',
      key: 'pending',
      filterType: 'status',
      filterValue: 'pending',
      title: 'Menunggu Bayar',
      color: 'warning',
      icon: 'ri-hourglass-2-line',
      count: stats.pending?.count || 0,
      amount: stats.pending?.amount || 0,
      isActive: selectedStatus.value === 'pending',
    },
    {
      group: 'status',
      key: 'expired',
      filterType: 'status',
      filterValue: 'expired',
      title: 'Kedaluwarsa',
      color: 'secondary',
      icon: 'ri-alarm-warning-line',
      count: stats.expired?.count || 0,
      amount: stats.expired?.amount || 0,
      isActive: selectedStatus.value === 'expired',
    },
    {
      group: 'status',
      key: 'cancelled',
      filterType: 'status',
      filterValue: 'cancelled',
      title: 'Dibatalkan',
      color: 'secondary',
      icon: 'ri-close-circle-line',
      count: stats.cancelled?.count || 0,
      amount: stats.cancelled?.amount || 0,
      isActive: selectedStatus.value === 'cancelled',
    },
  ]
})

const displayedStatCards = computed(() => {
  if (activeStatTab.value === 'all') {
    return allStatCards.value
  }

  return allStatCards.value.filter(c => c.group === activeStatTab.value || c.key === 'total')
})

const cardMdCols = computed(() => {
  if (displayedStatCards.value.length === 3) return 4

  return 3
})

const handleStatCardClick = card => {
  if (card.filterType === 'reset') {
    selectedReconciliation.value = 'all'
    selectedSync.value = 'all'
    selectedStatus.value = 'all'
  } else if (card.filterType === 'recon') {
    const nextVal = selectedReconciliation.value === card.filterValue ? 'all' : card.filterValue
    selectedReconciliation.value = nextVal
    selectedSync.value = 'all'
    selectedStatus.value = 'all'
  } else if (card.filterType === 'sync') {
    const nextVal = selectedSync.value === card.filterValue ? 'all' : card.filterValue
    selectedSync.value = nextVal
    selectedReconciliation.value = 'all'
    selectedStatus.value = 'all'
  } else if (card.filterType === 'status') {
    const nextVal = selectedStatus.value === card.filterValue ? 'all' : card.filterValue
    selectedStatus.value = nextVal
    selectedReconciliation.value = 'all'
    selectedSync.value = 'all'
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

// --- Manual Payment Dialog State & Handlers ---
const addDialog = ref(false)
const manualStudentLoading = ref(false)
const manualSubmitting = ref(false)
const manualAvailableBills = ref([])
const reconcilePickerOpen = ref(false)
const unreconciledList = ref([])
const loadingUnreconciled = ref(false)

const defaultManualForm = () => {
  const now = new Date()
  const localDatetime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)

  return {
    nim: '',
    nama_mahasiswa: '',
    jk_id: 8,
    kategori: 'Putra',
    prodi: '',
    kelas: '',
    semester: '',
    paid_at: localDatetime,
    status: 'success',
    va_number: '',
    customer_no: '',
    bsi_payment_number: '',
    bank_reference: '',
    recon_id: '',
    metode_va_id: null,
    sync_now: true,
    reconcile_now: true,
    production: true,
  }
}

const manualForm = ref(defaultManualForm())

const openAddDialog = () => {
  manualForm.value = defaultManualForm()
  manualAvailableBills.value = []
  addDialog.value = true
}

const searchManualStudent = async () => {
  const nim = String(manualForm.value.nim || '').trim()
  if (!nim) {
    showSnackbar({
      text: 'NIM mahasiswa wajib diisi.',
      color: 'warning',
    })
    return
  }

  manualStudentLoading.value = true
  try {
    const res = await $api('/admin/pemasukan/mahasiswa/pembayaran-bsi/student-bills', {
      method: 'GET',
      params: { nim },
    })

    if (res?.status && res?.data) {
      const data = res.data
      manualForm.value.nama_mahasiswa = data.nama || ''
      manualForm.value.jk_id = data.jk_id || 8
      manualForm.value.kategori = data.kategori || 'Putra'
      manualForm.value.prodi = data.prodi || ''
      manualForm.value.kelas = data.kelas || ''
      manualForm.value.semester = data.semester || ''

      if (!manualForm.value.va_number) {
        manualForm.value.va_number = `2700${nim}`
      }
      if (!manualForm.value.customer_no) {
        manualForm.value.customer_no = nim
      }
      if (!manualForm.value.bsi_payment_number) {
        manualForm.value.bsi_payment_number = `2700${nim}`
      }

      manualAvailableBills.value = (data.bills || []).map(bill => ({
        ...bill,
        tagihan_id: bill.id,
        tagihan_nama: bill.nama,
        bayar: bill.sisa > 0 ? bill.sisa : bill.jumlah_tagihan,
        selected: false,
      }))

      if (manualAvailableBills.value.length === 0) {
        showSnackbar({
          text: `Mahasiswa ${data.nama} tidak memiliki tagihan aktif dengan sisa belum lunas.`,
          color: 'info',
        })
      } else {
        showSnackbar({
          text: `Data mahasiswa ${data.nama} dan ${manualAvailableBills.value.length} tagihan berhasil dimuat.`,
          color: 'success',
        })
      }
    }
  } catch (error) {
    showSnackbar({
      text: errorMessage(error),
      color: 'error',
    })
  } finally {
    manualStudentLoading.value = false
  }
}

const manualTotalAmount = computed(() => {
  return manualAvailableBills.value
    .filter(b => b.selected)
    .reduce((sum, b) => sum + (Number(b.bayar) || 0), 0)
})

const selectAllBills = () => {
  manualAvailableBills.value.forEach(b => {
    b.selected = true
    if (!b.bayar || Number(b.bayar) <= 0) {
      b.bayar = b.sisa > 0 ? b.sisa : b.jumlah_tagihan
    }
  })
}

const deselectAllBills = () => {
  manualAvailableBills.value.forEach(b => {
    b.selected = false
  })
}

const toggleBillSelect = bill => {
  bill.selected = !bill.selected
  if (bill.selected && (!bill.bayar || Number(bill.bayar) <= 0)) {
    bill.bayar = bill.sisa > 0 ? bill.sisa : bill.jumlah_tagihan
  }
}

const fetchUnreconciledReconciliations = async () => {
  loadingUnreconciled.value = true
  try {
    const res = await $api('/admin/pemasukan/mahasiswa/pembayaran-bsi/unreconciled-reconciliations', {
      method: 'GET',
    })
    unreconciledList.value = res?.data || []
    reconcilePickerOpen.value = true
  } catch (error) {
    showSnackbar({
      text: errorMessage(error),
      color: 'error',
    })
  } finally {
    loadingUnreconciled.value = false
  }
}

const applyReconciledItem = async item => {
  reconcilePickerOpen.value = false
  manualForm.value.recon_id = item.recon_id || ''
  manualForm.value.bsi_payment_number = item.payment_number || ''
  manualForm.value.reconcile_now = true

  if (item.transaction_at) {
    manualForm.value.paid_at = new Date(new Date(item.transaction_at).getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
  }

  const rawNumber = String(item.payment_number || '').trim()
  const candidateNim = rawNumber.replace(/\D/g, '')

  if (candidateNim.length >= 8 && candidateNim.length <= 15) {
    manualForm.value.nim = candidateNim
    await searchManualStudent()
  } else if (candidateNim.startsWith('2700') && candidateNim.length > 8) {
    manualForm.value.nim = candidateNim.slice(4)
    await searchManualStudent()
  }

  showSnackbar({
    text: `Data rekonsiliasi ID ${item.recon_id} (${formatCurrency(item.payment_amount)}) dimuat ke form.`,
    color: 'success',
  })
}

const submitManualPayment = async () => {
  const selected = manualAvailableBills.value.filter(b => b.selected)
  if (!manualForm.value.nim) {
    showSnackbar({
      text: 'NIM mahasiswa wajib diisi.',
      color: 'warning',
    })
    return
  }
  if (selected.length === 0) {
    showSnackbar({
      text: 'Pilih minimal satu tagihan untuk dibayarkan.',
      color: 'warning',
    })
    return
  }
  for (const b of selected) {
    if (!b.bayar || Number(b.bayar) <= 0) {
      showSnackbar({
        text: `Nominal untuk tagihan "${b.tagihan_nama}" harus lebih dari 0.`,
        color: 'warning',
      })
      return
    }
  }

  manualSubmitting.value = true
  try {
    const payload = {
      nim: manualForm.value.nim,
      nama_mahasiswa: manualForm.value.nama_mahasiswa,
      jk_id: manualForm.value.jk_id,
      status: manualForm.value.status,
      paid_at: manualForm.value.paid_at,
      va_number: manualForm.value.va_number,
      customer_no: manualForm.value.customer_no,
      bsi_payment_number: manualForm.value.bsi_payment_number,
      bank_reference: manualForm.value.bank_reference,
      recon_id: manualForm.value.recon_id,
      metode_va_id: manualForm.value.metode_va_id,
      sync_now: manualForm.value.sync_now,
      reconcile_now: manualForm.value.reconcile_now,
      production: manualForm.value.production,
      items: selected.map(b => ({
        tagihan_id: b.tagihan_id,
        jumlah: Number(b.bayar),
        tagihan_nama: b.tagihan_nama,
        th_akademik_id: b.th_akademik_id,
        jumlah_tagihan: Number(b.jumlah_tagihan || b.bayar),
        sisa_awal: Number(b.sisa || b.bayar),
      })),
    }

    const res = await $api('/admin/pemasukan/mahasiswa/pembayaran-bsi', {
      method: 'POST',
      body: payload,
    })

    if (res?.status) {
      showSnackbar({
        text: res.message || 'Pembayaran BSI manual berhasil disimpan.',
        color: 'success',
      })
      addDialog.value = false
      await refreshAll()
    } else {
      showSnackbar({
        text: res?.message || 'Gagal menyimpan pembayaran manual.',
        color: 'error',
      })
    }
  } catch (error) {
    showSnackbar({
      text: errorMessage(error),
      color: 'error',
    })
  } finally {
    manualSubmitting.value = false
  }
}

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

      <!-- Shortcut Periode (Bulan Ini, Bulan Lalu, dll.) -->
      <div
        class="d-flex flex-wrap align-center gap-2 mt-3 pt-3"
        style="border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));"
      >
        <span class="text-caption font-weight-medium text-medium-emphasis d-flex align-center gap-1">
          <VIcon
            icon="ri-flashlight-line"
            size="15"
            color="warning"
          />
          Shortcut Periode:
        </span>

        <VChip
          size="small"
          variant="tonal"
          :color="activeDateShortcut === 'this-month' ? 'primary' : 'default'"
          class="cursor-pointer"
          :class="{ 'font-weight-bold': activeDateShortcut === 'this-month' }"
          prepend-icon="ri-calendar-check-line"
          @click="setDateShortcut('this-month')"
        >
          Bulan Ini
        </VChip>

        <VChip
          size="small"
          variant="tonal"
          :color="activeDateShortcut === 'last-month' ? 'primary' : 'default'"
          class="cursor-pointer"
          :class="{ 'font-weight-bold': activeDateShortcut === 'last-month' }"
          prepend-icon="ri-history-line"
          @click="setDateShortcut('last-month')"
        >
          Bulan Lalu
        </VChip>

        <VChip
          size="small"
          variant="tonal"
          :color="activeDateShortcut === 'today' ? 'primary' : 'default'"
          class="cursor-pointer"
          :class="{ 'font-weight-bold': activeDateShortcut === 'today' }"
          prepend-icon="ri-sun-line"
          @click="setDateShortcut('today')"
        >
          Hari Ini
        </VChip>

        <VChip
          size="small"
          variant="tonal"
          :color="activeDateShortcut === 'last-30-days' ? 'primary' : 'default'"
          class="cursor-pointer"
          :class="{ 'font-weight-bold': activeDateShortcut === 'last-30-days' }"
          prepend-icon="ri-time-line"
          @click="setDateShortcut('last-30-days')"
        >
          30 Hari Terakhir
        </VChip>

        <VChip
          size="small"
          variant="tonal"
          :color="activeDateShortcut === 'this-year' ? 'primary' : 'default'"
          class="cursor-pointer"
          :class="{ 'font-weight-bold': activeDateShortcut === 'this-year' }"
          prepend-icon="ri-calendar-2-line"
          @click="setDateShortcut('this-year')"
        >
          Tahun Ini
        </VChip>

        <VChip
          v-if="dateStart || dateEnd"
          size="small"
          variant="text"
          color="secondary"
          class="cursor-pointer"
          prepend-icon="ri-close-circle-line"
          @click="setDateShortcut('all')"
        >
          Semua Periode (Reset)
        </VChip>
      </div>
    </VCardText>
  </VCard>

  <!-- Stat Cards Interaktif Terpadu (Rekon, Sinkron, Status) -->
  <VCard class="mb-4">
    <VCardItem class="pb-2">
      <div class="d-flex flex-wrap align-center justify-space-between gap-3">
        <div class="d-flex align-center gap-2">
          <VIcon
            icon="ri-dashboard-line"
            color="primary"
            size="22"
          />
          <div>
            <div class="text-subtitle-1 font-weight-bold">
              Ringkasan & Statistik Transaksi
            </div>
            <div class="text-caption text-medium-emphasis">
              Klik kartu di bawah untuk memfilter data pada tabel (jumlah card dan tabel 100% konsisten).
            </div>
          </div>
        </div>

        <VTabs
          v-model="activeStatTab"
          density="compact"
        >
          <VTab value="all">
            Semua Ringkasan
          </VTab>
          <VTab value="recon">
            Rekonsiliasi
          </VTab>
          <VTab value="sync">
            Sinkronisasi
          </VTab>
          <VTab value="status">
            Status
          </VTab>
        </VTabs>
      </div>
    </VCardItem>

    <VDivider />

    <VCardText>
      <VRow>
        <VCol
          v-for="card in displayedStatCards"
          :key="card.key"
          cols="12"
          sm="6"
          :md="cardMdCols"
        >
          <VCard
            variant="outlined"
            class="cursor-pointer stat-filter-card"
            :class="{ 'stat-card-active': card.isActive }"
            :style="card.isActive ? `border: 2px solid rgb(var(--v-theme-${card.color})) !important; background-color: rgba(var(--v-theme-${card.color}), 0.05);` : ''"
            @click="handleStatCardClick(card)"
          >
            <VCardText class="pa-4 d-flex align-center justify-space-between gap-2">
              <div class="d-flex align-center gap-3">
                <VAvatar
                  :color="card.color"
                  variant="tonal"
                  size="44"
                >
                  <VIcon
                    :icon="card.icon"
                    size="22"
                  />
                </VAvatar>
                <div>
                  <div class="text-caption text-medium-emphasis">
                    {{ card.title }}
                  </div>
                  <div class="text-h6 font-weight-bold">
                    {{ Number(card.count).toLocaleString('id-ID') }}
                    <span class="text-caption font-weight-regular text-medium-emphasis">data</span>
                  </div>
                  <div class="text-caption font-weight-medium">
                    {{ formatCurrency(card.amount) }}
                  </div>
                </div>
              </div>

              <div class="text-end">
                <VChip
                  v-if="card.isActive"
                  :color="card.color"
                  size="x-small"
                  label
                  variant="flat"
                >
                  Aktif
                </VChip>
                <div
                  v-else
                  class="text-caption text-disabled d-none d-sm-block"
                  style="font-size: 11px;"
                >
                  Klik filter
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

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
          v-if="canProcess"
          color="success"
          prepend-icon="ri-add-line"
          @click="openAddDialog"
        >
          Tambah Data
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
          <div
            class="font-weight-medium text-high-emphasis text-truncate"
            style="max-width: 160px;"
            :title="item.nama_mahasiswa || '-'"
          >
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

  <!-- Dialog Tambah Pembayaran BSI Manual -->
  <VDialog
    v-model="addDialog"
    max-width="950"
    scrollable
  >
    <VCard>
      <VCardItem class="pb-3 border-b">
        <div class="d-flex align-center gap-3">
          <VAvatar
            color="success"
            variant="tonal"
            size="42"
          >
            <VIcon
              icon="ri-add-circle-line"
              size="24"
            />
          </VAvatar>
          <div>
            <VCardTitle class="text-h6 font-weight-bold">
              Input Pembayaran BSI Manual
            </VCardTitle>
            <VCardSubtitle>
              Catat transaksi pembayaran BSI yang belum masuk dengan opsi langsung sinkron dan/atau rekonsiliasi.
            </VCardSubtitle>
          </div>
          <VSpacer />
          <DialogCloseBtn @click="addDialog = false" />
        </div>
      </VCardItem>

      <VCardText
        class="pt-4"
        style="max-height: 75vh;"
      >
        <!-- Banner Helper -->
        <VAlert
          color="info"
          variant="tonal"
          density="comfortable"
          class="mb-4"
          closable
        >
          <div class="d-flex flex-wrap align-center justify-space-between gap-2">
            <div class="d-flex align-center gap-2">
              <VIcon
                icon="ri-information-line"
                size="20"
              />
              <span class="text-body-2">
                Punya data dari rekonsiliasi BSI yang gagal/mismatch atau belum ada transaksi?
              </span>
            </div>
            <VBtn
              size="small"
              color="info"
              variant="flat"
              prepend-icon="ri-magic-line"
              :loading="loadingUnreconciled"
              @click="fetchUnreconciledReconciliations"
            >
              Ambil dari Rekon Mismatch
            </VBtn>
          </div>
        </VAlert>

        <!-- Bagian 1: Cari Mahasiswa -->
        <VCard
          variant="outlined"
          class="mb-4"
        >
          <VCardItem class="py-2 bg-var-theme-background">
            <span class="font-weight-semibold text-subtitle-2 d-flex align-center gap-2">
              <VIcon
                icon="ri-user-search-line"
                color="primary"
                size="18"
              />
              1. Identitas Mahasiswa
            </span>
          </VCardItem>
          <VDivider />
          <VCardText>
            <VRow align="center">
              <VCol
                cols="12"
                sm="6"
                md="5"
              >
                <VTextField
                  v-model="manualForm.nim"
                  label="NIM Mahasiswa"
                  placeholder="Ketik NIM, misal: 202285010004"
                  prepend-inner-icon="ri-user-line"
                  density="compact"
                  hide-details="auto"
                  :loading="manualStudentLoading"
                  @keyup.enter="searchManualStudent"
                >
                  <template #append-inner>
                    <VBtn
                      size="x-small"
                      color="primary"
                      variant="tonal"
                      :loading="manualStudentLoading"
                      @click="searchManualStudent"
                    >
                      Cari
                    </VBtn>
                  </template>
                </VTextField>
              </VCol>
              <VCol
                cols="12"
                sm="6"
                md="7"
              >
                <div
                  v-if="manualForm.nama_mahasiswa"
                  class="d-flex flex-wrap align-center gap-2 pa-2 rounded border"
                  style="background: rgba(var(--v-theme-primary), 0.05); border-color: rgba(var(--v-theme-primary), 0.3) !important;"
                >
                  <VIcon
                    icon="ri-account-circle-line"
                    color="primary"
                    size="22"
                  />
                  <div>
                    <div class="font-weight-bold text-body-2">
                      {{ manualForm.nama_mahasiswa }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ manualForm.prodi }} &bull; Semester {{ manualForm.semester || '-' }} &bull; {{ manualForm.kelas || '-' }}
                    </div>
                  </div>
                  <VSpacer />
                  <VChip
                    size="x-small"
                    :color="manualForm.kategori === 'Putra' ? 'info' : 'warning'"
                    label
                  >
                    {{ manualForm.kategori }}
                  </VChip>
                </div>
                <div
                  v-else
                  class="text-caption text-medium-emphasis font-italic"
                >
                  Masukkan NIM lalu tekan "Cari" atau Enter untuk memuat tagihan mahasiswa.
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <!-- Bagian 2: Tagihan yang Dibayar -->
        <VCard
          variant="outlined"
          class="mb-4"
        >
          <VCardItem class="py-2 bg-var-theme-background">
            <div class="d-flex align-center justify-space-between flex-wrap gap-2">
              <span class="font-weight-semibold text-subtitle-2 d-flex align-center gap-2">
                <VIcon
                  icon="ri-bill-line"
                  color="warning"
                  size="18"
                />
                2. Tagihan Mahasiswa yang Dibayarkan
              </span>
              <div
                v-if="manualAvailableBills.length > 0"
                class="d-flex align-center gap-2"
              >
                <VBtn
                  size="x-small"
                  variant="text"
                  color="primary"
                  @click="selectAllBills"
                >
                  Pilih Semua
                </VBtn>
                <VBtn
                  size="x-small"
                  variant="text"
                  color="secondary"
                  @click="deselectAllBills"
                >
                  Batal Pilih
                </VBtn>
              </div>
            </div>
          </VCardItem>
          <VDivider />
          <VCardText class="pa-0">
            <div
              v-if="manualAvailableBills.length === 0"
              class="text-center py-6 text-medium-emphasis"
            >
              <VIcon
                icon="ri-inbox-line"
                size="36"
                class="mb-1 opacity-50"
              />
              <div class="text-body-2">
                {{ manualForm.nama_mahasiswa ? 'Tidak ada tagihan yang belum lunas untuk mahasiswa ini.' : 'Cari NIM mahasiswa di atas untuk menampilkan daftar tagihan.' }}
              </div>
            </div>

            <VTable
              v-else
              density="compact"
              hover
            >
              <thead>
                <tr>
                  <th style="width: 48px;">
                    Pilih
                  </th>
                  <th>Tagihan</th>
                  <th>Tahun Akademik</th>
                  <th class="text-end">
                    Sisa Tagihan
                  </th>
                  <th
                    class="text-end"
                    style="width: 220px;"
                  >
                    Nominal Bayar (Rp)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(bill, bIdx) in manualAvailableBills"
                  :key="bill.id || bIdx"
                >
                  <td>
                    <VCheckbox
                      v-model="bill.selected"
                      density="compact"
                      hide-details
                      @change="bill.selected && (!bill.bayar || bill.bayar <= 0) ? (bill.bayar = bill.sisa > 0 ? bill.sisa : bill.jumlah_tagihan) : null"
                    />
                  </td>
                  <td>
                    <div class="font-weight-medium">
                      {{ bill.nama }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Total Tagihan: {{ formatCurrency(bill.jumlah_tagihan) }}
                    </div>
                  </td>
                  <td>
                    <VChip
                      size="x-small"
                      label
                      variant="outlined"
                    >
                      {{ bill.tahun_akademik || '-' }}
                    </VChip>
                  </td>
                  <td class="text-end font-weight-medium">
                    {{ formatCurrency(bill.sisa) }}
                  </td>
                  <td class="text-end">
                    <VTextField
                      v-model.number="bill.bayar"
                      type="number"
                      density="compact"
                      hide-details
                      min="0"
                      :disabled="!bill.selected"
                      placeholder="0"
                      class="text-end"
                    />
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-var-theme-background">
                  <td
                    colspan="4"
                    class="font-weight-bold text-end"
                  >
                    Total Pembayaran:
                  </td>
                  <td class="text-end font-weight-bold text-primary text-subtitle-1">
                    {{ formatCurrency(manualTotalAmount) }}
                  </td>
                </tr>
              </tfoot>
            </VTable>
          </VCardText>
        </VCard>

        <!-- Bagian 3: Detail Transaksi Bank -->
        <VCard
          variant="outlined"
          class="mb-4"
        >
          <VCardItem class="py-2 bg-var-theme-background">
            <span class="font-weight-semibold text-subtitle-2 d-flex align-center gap-2">
              <VIcon
                icon="ri-bank-card-line"
                color="info"
                size="18"
              />
              3. Informasi Transaksi Bank BSI
            </span>
          </VCardItem>
          <VDivider />
          <VCardText>
            <VRow>
              <VCol
                cols="12"
                sm="6"
                md="4"
              >
                <VTextField
                  v-model="manualForm.paid_at"
                  type="datetime-local"
                  label="Tanggal & Jam Transaksi"
                  density="compact"
                  hide-details="auto"
                />
              </VCol>

              <VCol
                cols="12"
                sm="6"
                md="4"
              >
                <VSelect
                  v-model="manualForm.status"
                  label="Status Pembayaran"
                  :items="[
                    { title: 'Berhasil (Success)', value: 'success' },
                    { title: 'Menunggu (Pending)', value: 'pending' },
                    { title: 'Terbayar (Paid)', value: 'paid' },
                  ]"
                  density="compact"
                  hide-details="auto"
                />
              </VCol>

              <VCol
                cols="12"
                sm="6"
                md="4"
              >
                <VTextField
                  v-model="manualForm.va_number"
                  label="Nomor VA / Pembayaran"
                  placeholder="Otomatis jika kosong"
                  density="compact"
                  hide-details="auto"
                />
              </VCol>

              <VCol
                cols="12"
                sm="6"
                md="4"
              >
                <VTextField
                  v-model="manualForm.bank_reference"
                  label="Referensi Bank / No. Jurnal"
                  placeholder="Misal: FT2610... atau kosong"
                  density="compact"
                  hide-details="auto"
                />
              </VCol>

              <VCol
                cols="12"
                sm="6"
                md="4"
              >
                <VTextField
                  v-model="manualForm.recon_id"
                  label="ID Rekonsiliasi BSI (Opsional)"
                  placeholder="Misal: 228861"
                  density="compact"
                  hide-details="auto"
                />
              </VCol>

              <VCol
                cols="12"
                sm="6"
                md="4"
              >
                <VTextField
                  v-model="manualForm.bsi_payment_number"
                  label="BSI Payment Number (Opsional)"
                  placeholder="Misal: 202285010004"
                  density="compact"
                  hide-details="auto"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <!-- Bagian 4: Pengaturan Fleksibel (Luwes) -->
        <VCard
          variant="outlined"
          class="border-primary"
        >
          <VCardItem class="py-2" style="background: rgba(var(--v-theme-primary), 0.08);">
            <span class="font-weight-semibold text-subtitle-2 text-primary d-flex align-center gap-2">
              <VIcon
                icon="ri-settings-4-line"
                size="18"
              />
              4. Opsi Sinkronisasi & Rekonsiliasi (Fleksibel)
            </span>
          </VCardItem>
          <VDivider />
          <VCardText>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <div class="d-flex align-start gap-3 pa-3 rounded bg-var-theme-background">
                  <VSwitch
                    v-model="manualForm.sync_now"
                    color="success"
                    hide-details
                  />
                  <div>
                    <div class="font-weight-bold text-body-2">
                      Langsung Sinkronkan ke Buku Keuangan
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Mencatat transaksi ke buku pembayaran resmi, membuat nota, dan melunasi/memotong tagihan mahasiswa. Jika dimatikan, transaksi tetap tersimpan dan dapat disinkronkan kemudian.
                    </div>
                  </div>
                </div>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <div class="d-flex align-start gap-3 pa-3 rounded bg-var-theme-background">
                  <VSwitch
                    v-model="manualForm.reconcile_now"
                    color="primary"
                    hide-details
                  />
                  <div>
                    <div class="font-weight-bold text-body-2">
                      Langsung Tandai Rekonsiliasi Cocok (Matched)
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Menandai status rekonsiliasi transaksi ini sebagai "matched" dan menautkannya ke data rekonsiliasi bank. Jika dimatikan, status akan "Belum Rekonsiliasi".
                    </div>
                  </div>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCardText>

      <VDivider />

      <VCardActions class="justify-space-between px-6 py-3">
        <div class="text-caption text-medium-emphasis">
          Total Bayar: <span class="font-weight-bold text-primary">{{ formatCurrency(manualTotalAmount) }}</span>
        </div>
        <div class="d-flex gap-2">
          <VBtn
            variant="outlined"
            color="secondary"
            :disabled="manualSubmitting"
            @click="addDialog = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="success"
            prepend-icon="ri-save-line"
            :loading="manualSubmitting"
            :disabled="manualAvailableBills.filter(b => b.selected).length === 0 || manualTotalAmount <= 0"
            @click="submitManualPayment"
          >
            Simpan Pembayaran
          </VBtn>
        </div>
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- Sub-dialog: Pemilih Rekonsiliasi Mismatch / Orphan -->
  <VDialog
    v-model="reconcilePickerOpen"
    max-width="850"
    scrollable
  >
    <VCard>
      <VCardItem class="pb-3 border-b">
        <div class="d-flex align-center gap-2">
          <VIcon
            icon="ri-search-eye-line"
            color="info"
            size="24"
          />
          <div>
            <VCardTitle class="text-h6 font-weight-bold">
              Pilih Rekonsiliasi BSI Mismatch / Belum Masuk
            </VCardTitle>
            <VCardSubtitle>
              Daftar data rekonsiliasi yang diterima dari BSI namun belum tertaut ke transaksi SIMKEU atau berstatus mismatch.
            </VCardSubtitle>
          </div>
          <VSpacer />
          <DialogCloseBtn @click="reconcilePickerOpen = false" />
        </div>
      </VCardItem>

      <VCardText
        class="pa-0"
        style="max-height: 65vh;"
      >
        <div
          v-if="unreconciledList.length === 0"
          class="text-center py-8 text-medium-emphasis"
        >
          <VIcon
            icon="ri-checkbox-circle-line"
            size="40"
            color="success"
            class="mb-2"
          />
          <div class="text-subtitle-2">
            Tidak ada rekonsiliasi yang mismatch atau belum tertaut.
          </div>
        </div>

        <VTable
          v-else
          density="compact"
          hover
        >
          <thead>
            <tr>
              <th>ID Rekon</th>
              <th>No. Pembayaran / VA</th>
              <th>Tanggal</th>
              <th class="text-end">
                Nominal
              </th>
              <th>Status / Masalah</th>
              <th class="text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in unreconciledList"
              :key="item.id"
            >
              <td class="font-weight-bold font-monospace">
                #{{ item.recon_id }}
              </td>
              <td>
                <span class="font-monospace">{{ item.payment_number || '-' }}</span>
              </td>
              <td class="text-caption">
                {{ formatDateTime(item.transaction_at) }}
              </td>
              <td class="text-end font-weight-semibold">
                {{ formatCurrency(item.payment_amount) }}
              </td>
              <td>
                <div class="text-caption text-error">
                  {{ item.mismatch_description || (item.match_status === 'mismatch' ? 'Mismatch' : 'Belum tertaut') }}
                </div>
              </td>
              <td class="text-center">
                <VBtn
                  size="x-small"
                  color="primary"
                  variant="tonal"
                  prepend-icon="ri-check-line"
                  @click="applyReconciledItem(item)"
                >
                  Gunakan
                </VBtn>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>

      <VDivider />

      <VCardActions class="justify-end">
        <VBtn
          variant="outlined"
          color="secondary"
          @click="reconcilePickerOpen = false"
        >
          Tutup
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
