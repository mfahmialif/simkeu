<script setup>
const activeTab = ref('summary')
const configurationSection = ref('identity')
const loading = ref(true)
const saving = ref(false)
const validating = ref(false)
const rotatingKey = ref(false)
const rotatingH2hCredentials = ref(false)
const rotatingReconciliationSecret = ref(false)
const clientSecretVisible = ref(false)
const reconciliationSecretVisible = ref(false)
const generatedApiKey = ref('')
const apiKeyDialog = ref(false)
const credentialDialog = ref(false)
const credentialDialogTitle = ref('')
const generatedCredentials = ref([])
const settingsData = ref(null)
const simulationNim = ref('')
const simulationLoading = ref(false)
const simulationPaying = ref(false)
const simulationCancelling = ref(false)
const simulationBills = ref(null)
const selectedSimulationBills = ref([])
const simulationAmounts = reactive({})
const simulationResult = ref(null)
const summaryLoading = ref(false)
const summaryData = ref(null)
const testPaymentsLoading = ref(false)
const testPayments = ref([])
const testPaymentDeletingId = ref(null)
const deleteTestPaymentDialog = ref(false)
const selectedTestPayment = ref(null)
const messagingLogsLoading = ref(false)
const messagingLogs = ref([])
const messagingLogsPage = ref(1)
const messagingLogsLastPage = ref(1)
const messagingLogSearch = ref('')
const messagingLogOperation = ref('all')
const messagingLogFailedOnly = ref(false)
const logDetailDialog = ref(false)
const selectedMessagingLog = ref(null)
const reconciliationsLoading = ref(false)
const reconciliations = ref([])
const reconciliationsPage = ref(1)
const reconciliationsLastPage = ref(1)
const reconciliationSearch = ref('')
const reconciliationStatus = ref('all')
const reconciliationDateStart = ref('')
const reconciliationDateEnd = ref('')
const reconciliationStatsLoading = ref(false)
const reconciliationStats = ref(null)
const paymentMethodsLoading = ref(false)
const paymentMethods = ref([])
const paymentMethodDialog = ref(false)
const paymentMethodSaving = ref(false)
const paymentMethodTogglingId = ref(null)
const paymentMethodForm = reactive({
  id: null,
  nama: '',
  keterangan: '',
  aktif: true,
})

const form = reactive({
  enabled: false,
  environment: 'sandbox',
  testMode: false,
  institutionName: '',
  kodeBpi: '',
  clientId: '',
  clientSecret: '',
  bpiPublicKey: '',
  reconciliationSecret: '',
  reconciliationEmail: '',
  paymentExpiryValue: '1440',
  paymentExpiryUnit: 'minutes',
  paymentMode: 'open',
  adminFeeBearer: 'institution',
  adminFeeAmount: 2500,
  sandboxAdminFeeAmount: 3000,
  timestampTolerance: 300,
  allowedIpsText: '',
  enforceIpAllowlist: false,
  verifySignatures: true,
  logPayloads: true,
  serveTestVa: false,
  databaseFailureMode: 'none',
  autoTransferEnabled: false,
})

const isSandbox = computed(() => form.environment === 'sandbox')

const adminFeeBearerInput = computed({
  get: () => isSandbox.value ? 'payer' : form.adminFeeBearer,
  set: value => {
    if (!isSandbox.value)
      form.adminFeeBearer = value
  },
})

const adminFeeAmountInput = computed({
  get: () => isSandbox.value ? form.sandboxAdminFeeAmount : form.adminFeeAmount,
  set: value => {
    if (isSandbox.value)
      form.sandboxAdminFeeAmount = Number(value)
    else
      form.adminFeeAmount = Number(value)
  },
})

const errorMessage = error => {
  const errors = error?.data?.errors
  if (errors && typeof errors === 'object')
    return Object.values(errors).flat().join(' ')

  return error?.data?.message || error?.message || 'Terjadi kesalahan.'
}

const applySettings = data => {
  settingsData.value = data
  Object.assign(form, {
    enabled: Boolean(data.enabled),
    environment: data.environment || 'sandbox',
    testMode: Boolean(data.test_mode),
    institutionName: data.institution_name || '',
    kodeBpi: data.kode_bpi || '',
    clientId: data.client_id || '',
    clientSecret: data.client_secret || '',
    bpiPublicKey: data.bpi_public_key || '',
    reconciliationSecret: data.reconciliation_secret || '',
    reconciliationEmail: data.reconciliation_email || '',
    paymentExpiryValue: String(Number(data.payment_expiry_minutes || 1440)),
    paymentExpiryUnit: 'minutes',
    paymentMode: data.payment_mode || 'open',
    adminFeeBearer: data.production_admin_fee_bearer || data.admin_fee_bearer || 'institution',
    adminFeeAmount: Number(data.production_admin_fee_amount ?? data.admin_fee_amount ?? 2500),
    sandboxAdminFeeAmount: Number(data.sandbox_admin_fee_amount ?? 3000),
    timestampTolerance: Number(data.timestamp_tolerance ?? 300),
    allowedIpsText: (data.allowed_ips || []).join('\n'),
    enforceIpAllowlist: Boolean(data.enforce_ip_allowlist),
    verifySignatures: data.verify_signatures !== false,
    logPayloads: data.log_payloads !== false,
    serveTestVa: Boolean(data.serve_test_va),
    databaseFailureMode: data.database_failure_mode || 'none',
    autoTransferEnabled: Boolean(data.auto_transfer_enabled),
  })
}

const expiryMinutes = () => {
  const raw = String(form.paymentExpiryValue ?? '').trim()

  const validPattern = form.paymentExpiryUnit === 'minutes'
    ? /^\d+$/
    : /^\d+(?:[.,]\d+)?$/

  if (!validPattern.test(raw))
    throw new Error(form.paymentExpiryUnit === 'minutes'
      ? 'Expiry dalam menit harus berupa bilangan bulat.'
      : 'Expiry jam/hari harus berupa angka; koma dan titik dapat digunakan sebagai desimal.')

  const value = Number(raw.replace(',', '.'))

  const multiplier = {
    minutes: 1,
    hours: 60,
    days: 1440,
  }[form.paymentExpiryUnit]

  const minutes = Math.ceil(value * multiplier)

  if (!Number.isFinite(minutes) || minutes < 5 || minutes > 10080)
    throw new Error('Expiry setelah dikonversi harus antara 5 menit dan 7 hari.')

  return minutes
}

const fetchSettings = async () => {
  loading.value = true
  try {
    const response = await $api('/admin/setting/bsi')

    applySettings(response.data)
  } catch (error) {
    showSnackbar({ text: errorMessage(error), color: 'error' })
  } finally {
    loading.value = false
  }
}

const loadPaymentMethods = async () => {
  paymentMethodsLoading.value = true
  try {
    const response = await $api('/admin/setting/bsi/payment-methods')

    paymentMethods.value = response.data || []
  } catch (error) {
    showSnackbar({ text: errorMessage(error), color: 'error' })
  } finally {
    paymentMethodsLoading.value = false
  }
}

const editPaymentMethod = item => {
  Object.assign(paymentMethodForm, {
    id: item.id,
    nama: item.nama || '',
    keterangan: item.keterangan || '',
    aktif: Boolean(item.aktif),
  })
  paymentMethodDialog.value = true
}

const updatePaymentMethod = async (item, values) => {
  const response = await $api(`/admin/setting/bsi/payment-methods/${item.id}`, {
    method: 'PUT',
    body: {
      nama: values.nama,
      keterangan: values.keterangan || null,
      aktif: Boolean(values.aktif),
    },
  })

  const index = paymentMethods.value.findIndex(method => method.id === item.id)
  if (index !== -1)
    paymentMethods.value[index] = response.data

  return response
}

const savePaymentMethod = async () => {
  if (!paymentMethodForm.nama.trim()) {
    showSnackbar({ text: 'Nama metode pembayaran wajib diisi.', color: 'warning' })

    return
  }

  paymentMethodSaving.value = true
  try {
    const response = await updatePaymentMethod(paymentMethodForm, {
      ...paymentMethodForm,
      nama: paymentMethodForm.nama.trim(),
      keterangan: paymentMethodForm.keterangan.trim(),
    })

    paymentMethodDialog.value = false
    showSnackbar({ text: response.message, color: 'success' })
  } catch (error) {
    showSnackbar({ text: errorMessage(error), color: 'error' })
  } finally {
    paymentMethodSaving.value = false
  }
}

const togglePaymentMethod = async (item, aktif) => {
  paymentMethodTogglingId.value = item.id
  try {
    const response = await updatePaymentMethod(item, { ...item, aktif })

    showSnackbar({ text: response.message, color: 'success' })
  } catch (error) {
    showSnackbar({ text: errorMessage(error), color: 'error' })
  } finally {
    paymentMethodTogglingId.value = null
  }
}

const saveSettings = async () => {
  saving.value = true
  try {
    const allowedIps = form.allowedIpsText
      .split(/\r?\n|,/)
      .map(value => value.trim())
      .filter(Boolean)

    const response = await $api('/admin/setting/bsi', {
      method: 'PUT',
      body: {
        enabled: form.enabled,
        environment: form.environment,
        'test_mode': form.testMode,
        'institution_name': form.institutionName || null,
        'kode_bpi': form.kodeBpi || null,
        'client_id': form.clientId || null,
        'client_secret': form.clientSecret || null,
        'bpi_public_key': form.bpiPublicKey || null,
        'reconciliation_secret': form.reconciliationSecret || null,
        'reconciliation_email': form.reconciliationEmail || null,
        'payment_expiry_minutes': expiryMinutes(),
        'payment_mode': form.paymentMode,
        'admin_fee_bearer': form.adminFeeBearer,
        'admin_fee_amount': Number(form.adminFeeAmount),
        'sandbox_admin_fee_amount': Number(form.sandboxAdminFeeAmount),
        'timestamp_tolerance': Number(form.timestampTolerance),
        'allowed_ips': allowedIps,
        'enforce_ip_allowlist': form.enforceIpAllowlist,
        'verify_signatures': form.verifySignatures,
        'log_payloads': form.logPayloads,
        'serve_test_va': form.serveTestVa,
        'database_failure_mode': form.databaseFailureMode,
        'auto_transfer_enabled': form.autoTransferEnabled,
      },
    })

    applySettings(response.data)
    showSnackbar({ text: response.message, color: 'success' })
  } catch (error) {
    showSnackbar({ text: errorMessage(error), color: 'error' })
  } finally {
    saving.value = false
  }
}

const validateSettings = async () => {
  validating.value = true
  try {
    const response = await $api('/admin/setting/bsi/validate', { method: 'POST' })

    showSnackbar({ text: response.message, color: 'success' })
    await fetchSettings()
  } catch (error) {
    showSnackbar({ text: errorMessage(error), color: 'warning' })
  } finally {
    validating.value = false
  }
}

const rotateSiakadKey = async () => {
  rotatingKey.value = true
  try {
    const response = await $api('/admin/setting/bsi/siakad-key/rotate', { method: 'POST' })

    generatedApiKey.value = response.data.api_key
    apiKeyDialog.value = true
    showSnackbar({ text: response.message, color: 'success' })
    await fetchSettings()
  } catch (error) {
    showSnackbar({ text: errorMessage(error), color: 'error' })
  } finally {
    rotatingKey.value = false
  }
}

const showGeneratedCredentials = (title, credentials) => {
  credentialDialogTitle.value = title
  generatedCredentials.value = credentials
  credentialDialog.value = true
}

const closeApiKeyDialog = () => {
  apiKeyDialog.value = false
  generatedApiKey.value = ''
}

const closeCredentialDialog = () => {
  credentialDialog.value = false
  generatedCredentials.value = []
  credentialDialogTitle.value = ''
}

const rotateH2hCredentials = async () => {
  rotatingH2hCredentials.value = true
  try {
    const response = await $api('/admin/setting/bsi/h2h-credentials/rotate', { method: 'POST' })

    showGeneratedCredentials('Kredensial Host-to-Host Baru', [
      { label: 'Client ID', value: response.data.client_id },
      { label: 'Client Secret', value: response.data.client_secret },
    ])
    showSnackbar({ text: response.message, color: 'success' })
    await fetchSettings()
  } catch (error) {
    showSnackbar({ text: errorMessage(error), color: 'error' })
  } finally {
    rotatingH2hCredentials.value = false
  }
}

const rotateReconciliationCredential = async () => {
  rotatingReconciliationSecret.value = true
  try {
    const response = await $api('/admin/setting/bsi/reconciliation-secret/rotate', { method: 'POST' })

    showGeneratedCredentials('Secret Rekonsiliasi Baru', [
      { label: 'Secret Key Checksum Rekonsiliasi', value: response.data.reconciliation_secret },
    ])
    showSnackbar({ text: response.message, color: 'success' })
    await fetchSettings()
  } catch (error) {
    showSnackbar({ text: errorMessage(error), color: 'error' })
  } finally {
    rotatingReconciliationSecret.value = false
  }
}

const copyText = async (value, label = 'Teks') => {
  try {
    await navigator.clipboard.writeText(String(value || ''))
    showSnackbar({ text: `${label} berhasil disalin.`, color: 'success' })
  } catch {
    showSnackbar({ text: `${label} gagal disalin.`, color: 'error' })
  }
}

const readinessItems = computed(() => {
  const readiness = settingsData.value?.readiness || {}

  return [
    ['Integrasi aktif', readiness.enabled],
    ['KODE BPI', readiness.kode_bpi],
    ['Client ID', readiness.client_id],
    ['Client Secret', readiness.client_secret],
    ['Public Key BPI', readiness.bpi_public_key],
    ['Reconciliation Secret', readiness.reconciliation_secret],
    ['API Key SIAKAD', readiness.siakad_api_key],
  ]
})

const endpoints = computed(() => settingsData.value?.endpoints || {})
const hostToHostSpecification = 'BI-SNAP - Host-to-Host (Auth, Inquiry, Payment) [v3.5]'
const hostToHostToken = computed(() => form.clientSecret)
const reconciliationToken = computed(() => form.reconciliationSecret || form.clientSecret)

const vaSampleCustomer = computed(() => {
  const testNim = simulationNim.value.replace(/\D/g, '')

  return testNim ? testNim.slice(-12) : '123456789012'
})

const bsiVaSample = computed(() => `${form.kodeBpi || '0000'}${vaSampleCustomer.value}`)
const interbankVaSample = computed(() => `900${bsiVaSample.value}`)

const secretDisplay = (value, configured, label) => {
  if (value)
    return value

  return configured
    ? `${label} tersimpan — isi ulang pada form untuk menyalin`
    : `${label} belum diisi`
}

const adminPanelText = computed(() => [
  `Status & Spesifikasi: ${hostToHostSpecification}`,
  'Skema Pembayaran: Close amount — nominal harus sama persis',
  `Token Host to Host (Secret Key): ${hostToHostToken.value || ''}`,
  `URL Host to Host Inquiry: ${endpoints.value.inquiry || ''}`,
  `URL Host to Host Payment: ${endpoints.value.payment || ''}`,
  `URL Otentikasi: ${endpoints.value.auth || ''}`,
  `URL Advice: ${endpoints.value.advice || ''}`,
  `Email Tujuan Rekonsiliasi: ${form.reconciliationEmail || ''}`,
  `Token Custom Report: ${reconciliationToken.value || ''}`,
  `URL Webservice Custom Report Rekonsiliasi: ${endpoints.value.reconciliation || ''}`,
].join('\n'))

const rupiah = value => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 2,
}).format(Number(value || 0))

const formatDateTime = value => value
  ? new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
  : '-'

const formatJson = value => JSON.stringify(value ?? null, null, 2)

const messagingLogCustomerNo = log => log.request_payload?.customerNo
  || log.payment?.customer_no
  || log.payment?.bsi_payment_number
  || log.request_payload?.virtualAccountNo?.trim()
  || '-'

const messagingLogMessage = log => {
  if (log.response_code === '4017300')
    return 'Unauthorized Client — X-CLIENT-KEY berbeda dari Client ID aktif'

  return log.response_payload?.responseMessage
    || (Array.isArray(log.response_payload) ? `${log.response_payload.length} baris diterima` : null)
    || (log.outcome === 'success' ? 'Successful' : 'Request gagal')
}

const showMessagingLogDetail = log => {
  selectedMessagingLog.value = log
  logDetailDialog.value = true
}

const reconciliationMatchLabel = item => {
  if (item.match_status === 'matched')
    return 'cocok'

  return item.payment ? 'tidak cocok' : 'tidak ditemukan'
}

const paymentStatusColor = status => ({
  pending: 'warning',
  success: 'success',
  cancelled: 'secondary',
  expired: 'error',
  failed: 'error',
}[status] || 'info')

const simulationTotal = computed(() => selectedSimulationBills.value.reduce(
  (total, id) => total + Number(simulationAmounts[id] || 0),
  0,
))

const loadSummary = async () => {
  summaryLoading.value = true
  try {
    const response = await $api('/admin/setting/bsi/summary')

    summaryData.value = response.data
  } catch (error) {
    showSnackbar({ text: errorMessage(error), color: 'error' })
  } finally {
    summaryLoading.value = false
  }
}

const loadTestPayments = async () => {
  testPaymentsLoading.value = true
  try {
    const response = await $api('/admin/setting/bsi/simulation/payments?limit=50')

    testPayments.value = response.data?.data || []
  } catch (error) {
    showSnackbar({ text: errorMessage(error), color: 'error' })
  } finally {
    testPaymentsLoading.value = false
  }
}

const loadMessagingLogs = async (page = messagingLogsPage.value) => {
  messagingLogsLoading.value = true
  try {
    const response = await $api('/admin/setting/bsi/messaging-logs', {
      params: {
        page,
        limit: 20,
        ...(String(messagingLogSearch.value || '').trim()
          ? { search: String(messagingLogSearch.value).trim() }
          : {}),
        operation: messagingLogOperation.value,
        'failed_only': messagingLogFailedOnly.value ? 1 : 0,
      },
    })

    messagingLogs.value = response.data?.data || []
    messagingLogsPage.value = Number(response.data?.current_page || 1)
    messagingLogsLastPage.value = Number(response.data?.last_page || 1)
  } catch (error) {
    showSnackbar({ text: errorMessage(error), color: 'error' })
  } finally {
    messagingLogsLoading.value = false
  }
}

const loadReconciliations = async (page = reconciliationsPage.value) => {
  reconciliationsLoading.value = true
  try {
    const response = await $api('/admin/setting/bsi/reconciliations', {
      params: {
        page,
        limit: 20,
        ...(String(reconciliationSearch.value || '').trim()
          ? { search: String(reconciliationSearch.value).trim() }
          : {}),
        status: reconciliationStatus.value,
        ...(reconciliationDateStart.value ? { 'tanggal_mulai': reconciliationDateStart.value } : {}),
        ...(reconciliationDateEnd.value ? { 'tanggal_akhir': reconciliationDateEnd.value } : {}),
      },
    })

    reconciliations.value = response.data?.data || []
    reconciliationsPage.value = Number(response.data?.current_page || 1)
    reconciliationsLastPage.value = Number(response.data?.last_page || 1)
  } catch (error) {
    showSnackbar({ text: errorMessage(error), color: 'error' })
  } finally {
    reconciliationsLoading.value = false
  }
}

const loadReconciliationStats = async () => {
  reconciliationStatsLoading.value = true
  try {
    const response = await $api('/admin/pemasukan/mahasiswa/pembayaran-bsi/reconciliation-stats', {
      params: {
        ...(reconciliationDateStart.value ? { 'tanggal_mulai': reconciliationDateStart.value } : {}),
        ...(reconciliationDateEnd.value ? { 'tanggal_akhir': reconciliationDateEnd.value } : {}),
      },
    })

    reconciliationStats.value = response.data
  } catch (error) {
    showSnackbar({ text: errorMessage(error), color: 'error' })
  } finally {
    reconciliationStatsLoading.value = false
  }
}

const loadReconciliationData = async () => {
  await Promise.all([
    loadReconciliations(1),
    loadReconciliationStats(),
  ])
}

const loadSimulationBills = async () => {
  if (!simulationNim.value.trim()) {
    showSnackbar({ text: 'Masukkan NIM terlebih dahulu.', color: 'warning' })

    return
  }

  simulationLoading.value = true
  simulationResult.value = null
  selectedSimulationBills.value = []
  Object.keys(simulationAmounts).forEach(key => delete simulationAmounts[key])

  try {
    const response = await $api(`/admin/setting/bsi/simulation/bills/${encodeURIComponent(simulationNim.value.trim())}`)

    simulationBills.value = response.data
  } catch (error) {
    simulationBills.value = null
    showSnackbar({ text: errorMessage(error), color: 'error' })
  } finally {
    simulationLoading.value = false
  }
}

const toggleSimulationBill = (bill, selected) => {
  if (selected) {
    if (!selectedSimulationBills.value.includes(bill.id))
      selectedSimulationBills.value.push(bill.id)

    simulationAmounts[bill.id] = Number(bill.tersedia)
  } else {
    selectedSimulationBills.value = selectedSimulationBills.value.filter(id => id !== bill.id)
    delete simulationAmounts[bill.id]
  }
}

const clampSimulationAmount = bill => {
  const value = Number(simulationAmounts[bill.id] || 0)

  simulationAmounts[bill.id] = Math.min(Math.max(value, 0), Number(bill.tersedia))
}

const createSimulationPayment = async () => {
  const billsById = new Map((simulationBills.value?.list_tagihan || []).map(bill => [bill.id, bill]))

  const invalid = selectedSimulationBills.value.some(id => {
    const amount = Number(simulationAmounts[id] || 0)
    const maximum = Number(billsById.get(id)?.tersedia || 0)

    return amount <= 0 || amount > maximum
  })

  if (!selectedSimulationBills.value.length || invalid) {
    showSnackbar({ text: 'Pilih tagihan dan isi nominal antara Rp1 sampai sisa tagihan.', color: 'warning' })

    return
  }

  simulationPaying.value = true
  try {
    const response = await $api('/admin/setting/bsi/simulation/payment-orders', {
      method: 'POST',
      body: {
        'request_id': `SIM-BSI-${Date.now()}`,
        nim: simulationBills.value.nim,
        items: selectedSimulationBills.value.map(id => ({
          'tagihan_id': id,
          jumlah: Number(simulationAmounts[id]),
        })),
      },
    })

    showSnackbar({ text: response.message, color: 'success' })
    await loadSimulationBills()
    simulationResult.value = response.data
    await loadTestPayments()
  } catch (error) {
    showSnackbar({ text: errorMessage(error), color: 'error' })
  } finally {
    simulationPaying.value = false
  }
}

const cancelSimulationPayment = async () => {
  if (!simulationResult.value?.request_id)
    return

  simulationCancelling.value = true
  try {
    const response = await $api(`/admin/setting/bsi/simulation/payment-orders/${encodeURIComponent(simulationResult.value.request_id)}/cancel`, {
      method: 'POST',
    })

    showSnackbar({ text: response.message, color: 'success' })
    await loadSimulationBills()
    simulationResult.value = response.data
    await loadTestPayments()
  } catch (error) {
    showSnackbar({ text: errorMessage(error), color: 'error' })
  } finally {
    simulationCancelling.value = false
  }
}

const openDeleteTestPaymentDialog = payment => {
  selectedTestPayment.value = payment
  deleteTestPaymentDialog.value = true
}

const closeDeleteTestPaymentDialog = () => {
  if (testPaymentDeletingId.value)
    return

  deleteTestPaymentDialog.value = false
  selectedTestPayment.value = null
}

const deleteTestPayment = async () => {
  const payment = selectedTestPayment.value

  if (!payment?.id)
    return

  testPaymentDeletingId.value = payment.id
  try {
    const response = await $api(`/admin/setting/bsi/simulation/payments/${payment.id}`, {
      method: 'DELETE',
    })

    showSnackbar({ text: response.message, color: 'success' })

    if (simulationResult.value?.request_id === payment.request_id)
      simulationResult.value = null

    deleteTestPaymentDialog.value = false
    selectedTestPayment.value = null

    await Promise.all([
      loadTestPayments(),
      loadSummary(),
    ])

    if (String(simulationNim.value || '').trim())
      await loadSimulationBills()
  } catch (error) {
    showSnackbar({ text: errorMessage(error), color: 'error' })
  } finally {
    testPaymentDeletingId.value = null
  }
}

const billsEndpoint = computed(() => endpoints.value.siakad_bills || '/api/v1/integrations/siakad/bsi/bills/{nim}')
const paymentHistoryEndpoint = computed(() => endpoints.value.siakad_payment_history || '/api/v1/integrations/siakad/bsi/payment-history/{nim}')
const ordersEndpoint = computed(() => endpoints.value.siakad_payment_orders || '/api/v1/integrations/siakad/bsi/payment-orders')
const requestIdExample = 'SIAKAD-ORDER-000001'

const siakadEndpoints = computed(() => [
  {
    key: 'bills',
    method: 'GET',
    title: 'Ambil tagihan mahasiswa',
    url: billsEndpoint.value,
  },
  {
    key: 'payment-history',
    method: 'GET',
    title: 'Riwayat pembayaran mahasiswa',
    url: paymentHistoryEndpoint.value,
  },
  {
    key: 'create',
    method: 'POST',
    title: 'Buat payment order',
    url: ordersEndpoint.value,
  },
  {
    key: 'status',
    method: 'GET',
    title: 'Cek status payment order',
    url: `${ordersEndpoint.value}/{request_id}`,
  },
  {
    key: 'cancel',
    method: 'POST',
    title: 'Batalkan payment order',
    url: `${ordersEndpoint.value}/{request_id}/cancel`,
  },
])

const paymentModeDescription = computed(() => settingsData.value?.payment_mode === 'close'
  ? 'Nominal yang dibayar di kanal BSI wajib sama dengan nilai transaksi yang ditagihkan.'
  : 'Nominal pembayaran dapat berbeda. Dana dialokasikan ke detail tagihan sesuai urutan; kelebihan pokok menjadi deposit pada transaksi production non-test.')

const createOrderBody = `{
  "request_id": "${requestIdExample}",
  "nim": "20240001",
  "items": [
    { "tagihan_id": 10, "jumlah": 250000 },
    { "tagihan_id": 12, "jumlah": 100000 }
  ]
}`

const billsResponseExample = `{
  "status": true,
  "data": {
    "nim": "20240001",
    "nama_mahasiswa": "Nama Mahasiswa",
    "nama_prodi": "S1 Sistem Informasi",
    "nama_kelas": "A",
    "semester": 5,
    "list_tagihan": [
      {
        "id": 10,
        "nama": "Daftar Ulang",
        "th_akademik_id": 25,
        "th_akademik_kode": "20261",
        "tahun_akademik": "2026/2027 Ganjil",
        "jumlah_tagihan": 500000,
        "sisa_resmi": 500000,
        "reservasi_bsi": 0,
        "tersedia": 500000,
        "mata_uang_kode": "IDR",
        "tidak_bisa_dibayar": false,
        "keterangan_pembayaran": null
      }
    ],
    "total_tersedia": 500000
  }
}`

const paymentHistoryResponseExample = `{
  "status": true,
  "data": {
    "nim": "20240001",
    "total_transaksi": 2,
    "total_pembayaran": 425000,
    "riwayat": [
      {
        "nota": "130826-00001-L-123",
        "tanggal": "2026-08-13 09:00:00",
        "nim": "2024.0001",
        "total": 350000,
        "jumlah_item": 2,
        "items": [
          {
            "pembayaran_id": 101,
            "nomor": "PAY-001",
            "th_akademik_id": 25,
            "tagihan_id": 10,
            "semester": 5,
            "jumlah_sks": 1,
            "jumlah": 250000
          }
        ]
      }
    ]
  }
}`

const orderResponseExample = `{
  "status": true,
  "created": true,
  "message": "Payment order BSI berhasil dibuat.",
  "data": {
    "request_id": "${requestIdExample}",
    "reference_no": "BSI-20260813-00000001",
    "nim": "20240001",
    "nama_mahasiswa": "Nama Mahasiswa",
    "customer_no": "20240001",
    "bsi_payment_number": "509020240001",
    "interbank_va_number": "900509020240001",
    "total": "350000.00",
    "admin_fee_bearer": "institution",
    "admin_fee_amount": 2500,
    "payable_total": 350000,
    "expected_settlement_total": 347500,
    "currency": "IDR",
    "status": "pending",
    "data_test": false,
    "production": true,
    "transferred": false,
    "expired_at": "2026-08-14T10:00:00+07:00",
    "paid_at": null,
    "posted_at": null,
    "details": [
      {
        "tagihan_id": 10,
        "tagihan_nama": "Daftar Ulang",
        "jumlah": "250000.00",
        "cara_bayar": "cicilan"
      }
    ]
  }
}`

const curlBills = computed(() => `curl --request GET \\
  --url '${billsEndpoint.value.replace('{nim}', '20240001')}' \\
  --header 'Accept: application/json' \\
  --header 'X-SIAKAD-API-KEY: GANTI_DENGAN_API_KEY'`)

const curlPaymentHistory = computed(() => `curl --request GET \\
  --url '${paymentHistoryEndpoint.value.replace('{nim}', '20240001')}' \\
  --header 'Accept: application/json' \\
  --header 'X-SIAKAD-API-KEY: GANTI_DENGAN_API_KEY'`)

const curlCreate = computed(() => `curl --request POST \\
  --url '${ordersEndpoint.value}' \\
  --header 'Accept: application/json' \\
  --header 'Content-Type: application/json' \\
  --header 'X-SIAKAD-API-KEY: GANTI_DENGAN_API_KEY' \\
  --data '${createOrderBody.replaceAll("'", "'\\''")}'`)

const curlStatus = computed(() => `curl --request GET \\
  --url '${ordersEndpoint.value}/${requestIdExample}' \\
  --header 'Accept: application/json' \\
  --header 'X-SIAKAD-API-KEY: GANTI_DENGAN_API_KEY'`)

const curlCancel = computed(() => `curl --request POST \\
  --url '${ordersEndpoint.value}/${requestIdExample}/cancel' \\
  --header 'Accept: application/json' \\
  --header 'X-SIAKAD-API-KEY: GANTI_DENGAN_API_KEY'`)

/* eslint-disable case-police/string-check */
const phpExample = computed(() => `<?php
$response = Http::withHeaders([
    'X-SIAKAD-API-KEY' => env('SIMKEU_BSI_API_KEY'),
    'Accept' => 'application/json',
])->post('${ordersEndpoint.value}', [
    'request_id' => '${requestIdExample}',
    'nim' => '20240001',
    'items' => [
        ['tagihan_id' => 10, 'jumlah' => 250000],
    ],
]);

$paymentOrder = $response->throw()->json('data');`)
/* eslint-enable case-police/string-check */

const javascriptExample = computed(() => `const response = await fetch('${ordersEndpoint.value}', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-SIAKAD-API-KEY': process.env.SIMKEU_BSI_API_KEY,
  },
  body: JSON.stringify({
    request_id: '${requestIdExample}',
    nim: '20240001',
    items: [{ tagihan_id: 10, jumlah: 250000 }],
  }),
})

if (!response.ok) throw new Error(await response.text())
const { data } = await response.json()`)

watch(activeTab, tab => {
  if (tab === 'summary')
    loadSummary()

  if (tab === 'simulation')
    loadTestPayments()

  if (tab === 'messaging')
    loadMessagingLogs()

  if (tab === 'reconciliation')
    loadReconciliationData()

  if (tab === 'payment-methods')
    loadPaymentMethods()
})

onMounted(async () => {
  document.title = 'Konfig BSI - SIMKEU'
  await fetchSettings()
  await loadSummary()
})
</script>

<template>
  <div>
    <VCard class="mb-6">
      <VCardItem>
        <div class="d-flex flex-wrap align-center gap-3">
          <div>
            <VCardTitle>Konfig BSI</VCardTitle>
            <VCardSubtitle>Konfigurasi BI-SNAP v3.5 dan dokumentasi integrasi SIAKAD.</VCardSubtitle>
          </div>
          <VSpacer />
          <VChip
            :color="settingsData?.environment === 'production' ? 'success' : 'warning'"
            label
          >
            {{ (settingsData?.environment || 'sandbox').toUpperCase() }}
          </VChip>
          <VChip
            :color="settingsData?.readiness?.enabled ? 'success' : 'error'"
            label
          >
            {{ settingsData?.readiness?.enabled ? 'H2H Aktif' : 'H2H Nonaktif' }}
          </VChip>
          <VChip
            :color="settingsData?.readiness?.ready ? 'success' : 'warning'"
            label
          >
            {{ settingsData?.readiness?.ready ? 'Siap Digunakan' : 'Belum Lengkap' }}
          </VChip>
        </div>
      </VCardItem>

      <VTabs v-model="activeTab">
        <VTab
          value="summary"
          prepend-icon="ri-pulse-line"
        >
          Ringkasan
        </VTab>
        <VTab
          value="configuration"
          prepend-icon="ri-settings-3-line"
        >
          Konfigurasi H2H
        </VTab>
        <VTab
          value="messaging"
          prepend-icon="ri-list-check-3"
        >
          Log Messaging
        </VTab>
        <VTab
          value="reconciliation"
          prepend-icon="ri-file-list-3-line"
        >
          Rekonsiliasi
        </VTab>
        <VTab
          value="payment-methods"
          prepend-icon="ri-secure-payment-line"
        >
          Metode Pembayaran
        </VTab>
        <VTab
          value="docs"
          prepend-icon="ri-code-box-line"
        >
          API SIAKAD
        </VTab>
        <VTab
          value="simulation"
          prepend-icon="ri-bank-card-line"
        >
          Simulasi Pembayaran
        </VTab>
      </VTabs>
    </VCard>

    <VAlert
      v-if="settingsData?.test_mode"
      type="warning"
      variant="tonal"
      class="mb-6"
    >
      <strong>Mode uji aktif.</strong>
      Semua NIM dapat digunakan dan payment order baru ditandai sebagai data test.
      Matikan mode uji setelah SIT selesai agar transaksi production tidak ditandai sebagai test.
    </VAlert>

    <VAlert
      v-if="settingsData?.database_failure_mode && settingsData.database_failure_mode !== 'none'"
      type="error"
      variant="tonal"
      class="mb-6"
    >
      <strong>Simulasi DB Error aktif.</strong>
      {{ settingsData.database_failure_mode === 'all'
        ? 'Auth dan seluruh transaksi BSI sedang dipaksa gagal.'
        : 'Inquiry, Payment, Advice, dan Rekonsiliasi sedang dipaksa gagal; Auth tetap berjalan.' }}
      Nonaktifkan kembali setelah tester BSI selesai.
    </VAlert>

    <VProgressLinear
      v-if="loading"
      indeterminate
      color="primary"
      class="mb-4"
    />

    <VWindow
      v-else
      v-model="activeTab"
    >
      <VWindowItem value="summary">
        <VProgressLinear
          v-if="summaryLoading"
          indeterminate
          color="primary"
          class="mb-4"
        />

        <VRow class="mb-2">
          <VCol
            cols="12"
            sm="6"
            lg="3"
            class="d-flex"
          >
            <VCard class="summary-stat-card flex-grow-1">
              <VCardText>
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-caption text-uppercase">
                      VA Menunggu Bayar
                    </div>
                    <div class="text-h4 mt-2">
                      {{ summaryData?.pending || 0 }}
                    </div>
                  </div>
                  <VIcon
                    icon="ri-wallet-3-line"
                    size="32"
                    color="primary"
                  />
                </div>
              </VCardText>
            </VCard>
          </VCol>
          <VCol
            cols="12"
            sm="6"
            lg="3"
            class="d-flex"
          >
            <VCard class="summary-stat-card flex-grow-1">
              <VCardText>
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-caption text-uppercase">
                      Lunas (30 Hari)
                    </div>
                    <div class="text-h4 text-success mt-2">
                      {{ summaryData?.success_30_days || 0 }}
                    </div>
                    <div class="text-caption">
                      {{ rupiah(summaryData?.success_amount_30_days) }}
                    </div>
                  </div>
                  <VIcon
                    icon="ri-check-line"
                    size="32"
                    color="success"
                  />
                </div>
              </VCardText>
            </VCard>
          </VCol>
          <VCol
            cols="12"
            sm="6"
            lg="3"
            class="d-flex"
          >
            <VCard class="summary-stat-card flex-grow-1">
              <VCardText>
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-caption text-uppercase">
                      Inquiry / Payment
                    </div>
                    <div class="text-h4 mt-2">
                      {{ summaryData?.inquiry_count || 0 }} / {{ summaryData?.payment_count || 0 }}
                    </div>
                  </div>
                  <VIcon
                    icon="ri-pulse-line"
                    size="32"
                    color="info"
                  />
                </div>
              </VCardText>
            </VCard>
          </VCol>
          <VCol
            cols="12"
            sm="6"
            lg="3"
            class="d-flex"
          >
            <VCard class="summary-stat-card flex-grow-1">
              <VCardText>
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-caption text-uppercase">
                      Response Gagal
                    </div>
                    <div class="text-h4 text-error mt-2">
                      {{ summaryData?.failed_count || 0 }}
                    </div>
                    <div class="text-caption">
                      Data test: {{ summaryData?.test_transactions || 0 }}
                    </div>
                  </div>
                  <VIcon
                    icon="ri-error-warning-line"
                    size="32"
                    color="error"
                  />
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>

        <VCard class="mb-6">
          <VCardItem>
            <VCardTitle>URL Endpoint untuk Dashboard Smart Billing</VCardTitle>
            <VCardSubtitle>
              Salin nilai berikut ke konfigurasi Host-to-Host pada portal BSI.
            </VCardSubtitle>
          </VCardItem>
          <VCardText class="admin-panel-fields">
            <VTextField
              v-for="(url, name) in endpoints"
              v-show="!name.startsWith('siakad_')"
              :key="name"
              :model-value="url"
              :label="name === 'reconciliation' ? 'URL Webservice Rekonsiliasi' : `URL Host to Host ${name.toUpperCase()}`"
              readonly
              append-inner-icon="ri-file-copy-line"
              @click:append-inner="copyText(url, `URL ${name}`)"
            />
          </VCardText>
        </VCard>

        <VCard>
          <VCardItem>
            <VCardTitle>Format Nomor Virtual Account</VCardTitle>
          </VCardItem>
          <VCardText>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VCard variant="tonal">
                  <VCardText>
                    <div class="text-caption text-uppercase">
                      Kanal BSI (ATM / BYOND / Net Banking)
                    </div>
                    <div class="text-h6 my-2">
                      {{ bsiVaSample }}
                    </div>
                    <div class="text-caption">
                      kode BPI ({{ form.kodeBpi || '0000' }}) + NIM tanpa titik, maksimal 12 digit
                    </div>
                  </VCardText>
                </VCard>
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VCard variant="tonal">
                  <VCardText>
                    <div class="text-caption text-uppercase">
                      Transfer dari Bank Lain (Prima / Bersama)
                    </div>
                    <div class="text-h6 my-2">
                      {{ interbankVaSample }}
                    </div>
                    <div class="text-caption">
                      900 + kode BPI + NIM tanpa titik, maksimal 19 digit
                    </div>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VWindowItem>

      <VWindowItem value="configuration">
        <VCard class="mb-6">
          <VTabs v-model="configurationSection">
            <VTab
              value="identity"
              prepend-icon="ri-building-line"
            >
              Identitas Biller
            </VTab>
            <VTab
              value="credentials"
              prepend-icon="ri-key-2-line"
            >
              Kredensial Host-to-Host
            </VTab>
            <VTab
              value="security"
              prepend-icon="ri-shield-check-line"
            >
              Keamanan & Operasional
            </VTab>
            <VTab
              value="portal"
              prepend-icon="ri-dashboard-line"
            >
              Data Portal BSI
            </VTab>
          </VTabs>
        </VCard>

        <VRow v-show="configurationSection !== 'portal'">
          <VCol
            cols="12"
            lg="8"
          >
            <VCard :title="configurationSection === 'identity' ? 'Identitas Biller' : configurationSection === 'credentials' ? 'Kredensial Host-to-Host' : 'Keamanan & Operasional'">
              <VCardText>
                <VRow>
                  <VCol
                    v-show="configurationSection === 'identity'"
                    cols="12"
                    md="12"
                  >
                    <VSelect
                      v-model="form.environment"
                      label="Mode"
                      :items="[{ title: 'Sandbox', value: 'sandbox' }, { title: 'Production', value: 'production' }]"
                    />
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'identity'"
                    cols="12"
                    md="8"
                  >
                    <VTextField
                      v-model="form.institutionName"
                      label="Nama Institusi"
                    />
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'identity'"
                    cols="12"
                    md="4"
                  >
                    <VTextField
                      v-model="form.kodeBpi"
                      label="KODE BPI"
                      maxlength="4"
                      counter="4"
                    />
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'credentials'"
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="form.clientId"
                      label="Client ID"
                      append-inner-icon="ri-file-copy-line"
                      @click:append-inner="copyText(form.clientId, 'Client ID')"
                    />
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'credentials'"
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="form.clientSecret"
                      :type="clientSecretVisible ? 'text' : 'password'"
                      label="Client Secret"
                      :placeholder="settingsData?.client_secret_configured ? 'Sudah tersimpan terenkripsi' : 'Masukkan Client Secret'"
                    >
                      <template #append-inner>
                        <VBtn
                          :icon="clientSecretVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                          variant="text"
                          size="small"
                          @click="clientSecretVisible = !clientSecretVisible"
                        />
                        <VBtn
                          icon="ri-file-copy-line"
                          variant="text"
                          size="small"
                          :disabled="!form.clientSecret"
                          @click="copyText(form.clientSecret, 'Client Secret')"
                        />
                      </template>
                    </VTextField>
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'credentials'"
                    cols="12"
                  >
                    <VTextarea
                      v-model="form.bpiPublicKey"
                      label="BPI RSA Public Key"
                      rows="7"
                      auto-grow
                      placeholder="-----BEGIN PUBLIC KEY-----"
                    >
                      <template #append-inner>
                        <VBtn
                          icon="ri-file-copy-line"
                          variant="text"
                          size="small"
                          :disabled="!form.bpiPublicKey"
                          @click="copyText(form.bpiPublicKey, 'BPI RSA Public Key')"
                        />
                      </template>
                    </VTextarea>
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'credentials'"
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="form.reconciliationSecret"
                      :type="reconciliationSecretVisible ? 'text' : 'password'"
                      label="Reconciliation Secret"
                      :placeholder="settingsData?.reconciliation_secret_configured ? 'Sudah tersimpan terenkripsi' : 'Opsional, fallback ke Client Secret'"
                    >
                      <template #append-inner>
                        <VBtn
                          :icon="reconciliationSecretVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                          variant="text"
                          size="small"
                          @click="reconciliationSecretVisible = !reconciliationSecretVisible"
                        />
                        <VBtn
                          icon="ri-file-copy-line"
                          variant="text"
                          size="small"
                          :disabled="!form.reconciliationSecret"
                          @click="copyText(form.reconciliationSecret, 'Reconciliation Secret')"
                        />
                      </template>
                    </VTextField>
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'credentials'"
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="form.reconciliationEmail"
                      type="email"
                      label="Email Tujuan Rekonsiliasi"
                      placeholder="keuangan@institusi.ac.id"
                      append-inner-icon="ri-file-copy-line"
                      @click:append-inner="copyText(form.reconciliationEmail, 'Email Rekonsiliasi')"
                    />
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'credentials'"
                    cols="12"
                  >
                    <VAlert
                      type="info"
                      variant="tonal"
                      class="mb-4"
                    >
                      Sesuai Tutorial BSI v3.5, Client ID dan Client Secret ditentukan oleh institusi, kemudian disalin ke portal SmartBilling BSI. KODE BPI dan RSA Public Key diberikan oleh BSI.
                    </VAlert>
                    <div class="d-flex flex-wrap gap-3">
                      <VBtn
                        color="warning"
                        variant="outlined"
                        prepend-icon="ri-refresh-line"
                        :loading="rotatingH2hCredentials"
                        @click="rotateH2hCredentials"
                      >
                        Terbitkan Ulang Client ID & Secret
                      </VBtn>
                      <VBtn
                        color="warning"
                        variant="outlined"
                        prepend-icon="ri-refresh-line"
                        :loading="rotatingReconciliationSecret"
                        @click="rotateReconciliationCredential"
                      >
                        Terbitkan Ulang Secret Rekonsiliasi
                      </VBtn>
                    </div>
                    <p class="text-caption text-warning mt-3 mb-0">
                      Penerbitan ulang langsung menonaktifkan nilai lama. Salin nilai baru ke portal BSI sebelum pengujian berikutnya.
                    </p>
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'security'"
                    cols="12"
                    md="6"
                  >
                    <VSelect
                      v-model="form.paymentMode"
                      label="Mode Pembayaran"
                      :items="[
                        { title: 'Open Payment', value: 'open' },
                        { title: 'Close Payment', value: 'close' },
                      ]"
                      hint="Open menerima nominal berbeda dan membaginya dari detail teratas."
                      persistent-hint
                    />
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'security'"
                    cols="12"
                    md="6"
                  >
                    <VSelect
                      v-model="adminFeeBearerInput"
                      label="Penanggung Biaya Admin BSI"
                      :disabled="isSandbox"
                      :items="[
                        { title: 'Dibebankan ke institusi', value: 'institution' },
                        { title: 'Dibebankan ke pembayar', value: 'payer' },
                      ]"
                    />
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'security'"
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model.number="adminFeeAmountInput"
                      type="number"
                      min="0"
                      prefix="Rp"
                      label="Nominal Biaya Admin BSI"
                      :hint="isSandbox
                        ? 'Biaya sandbox dapat disesuaikan; penanggungnya tetap pembayar.'
                        : 'Dapat diubah jika tarif BSI berubah.'"
                      persistent-hint
                    />
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'security'"
                    cols="12"
                  >
                    <VAlert
                      :type="isSandbox ? 'warning' : 'info'"
                      variant="tonal"
                    >
                      <template v-if="isSandbox">
                        <strong>Ketentuan Sandbox:</strong> biaya admin <strong>{{ rupiah(form.sandboxAdminFeeAmount) }}</strong>
                        dan selalu dibebankan kepada pembayar. SIMKEU hanya mengirim nominal pokok tagihan;
                        kanal BSI yang menambahkan biaya tersebut satu kali.
                      </template>
                      <template v-else-if="form.adminFeeBearer === 'payer'">
                        Biaya dibebankan ke pembayar. Contoh tagihan Rp10.000 akan ditampilkan di BSI sebesar
                        <strong>{{ rupiah(10000 + Number(form.adminFeeAmount || 0)) }}</strong>;
                        transaksi BSI tetap menyimpan nilai pokok tagihan Rp10.000.
                      </template>
                      <template v-else>
                        Biaya ditanggung institusi. Pembayar tetap membayar sesuai tagihan; dana settlement diperkirakan
                        berkurang <strong>{{ rupiah(form.adminFeeAmount) }}</strong>.
                      </template>
                    </VAlert>
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'security'"
                    cols="12"
                    md="3"
                  >
                    <VTextField
                      v-model="form.paymentExpiryValue"
                      inputmode="decimal"
                      label="Masa berlaku VA"
                      hint="Jam dan hari mendukung koma; menit harus bulat."
                      persistent-hint
                    />
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'security'"
                    cols="12"
                    md="3"
                  >
                    <VSelect
                      v-model="form.paymentExpiryUnit"
                      label="Satuan expiry"
                      :items="[
                        { title: 'Menit', value: 'minutes' },
                        { title: 'Jam', value: 'hours' },
                        { title: 'Hari', value: 'days' },
                      ]"
                    />
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'security'"
                    cols="12"
                    md="3"
                  >
                    <VTextField
                      v-model.number="form.timestampTolerance"
                      type="number"
                      label="Toleransi waktu (detik)"
                    />
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'security'"
                    cols="12"
                    md="6"
                  >
                    <VCard
                      variant="outlined"
                      class="h-100"
                    >
                      <VCardText>
                        <VSwitch
                          v-model="form.autoTransferEnabled"
                          label="Sinkronisasi pembayaran otomatis"
                          color="success"
                          hide-details
                        />
                        <div class="text-caption text-medium-emphasis ms-10">
                          Saat aktif, transaksi production yang success langsung dipindahkan ke pembukuan.
                          Jika gagal, transaksi tetap dapat disinkronkan secara manual.
                        </div>
                      </VCardText>
                    </VCard>
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'security'"
                    cols="12"
                  >
                    <VTextarea
                      v-model="form.allowedIpsText"
                      label="IP BPI yang Diizinkan"
                      rows="4"
                      hint="Satu IP per baris. Utamakan whitelist pada Cloudflare/firewall."
                      persistent-hint
                    />
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'security'"
                    cols="12"
                    md="6"
                  >
                    <VCard
                      variant="outlined"
                      class="h-100"
                    >
                      <VCardText>
                        <VSwitch
                          v-model="form.enabled"
                          label="Aktifkan endpoint H2H"
                          color="success"
                          hide-details
                        />
                        <div class="text-caption text-medium-emphasis ms-10">
                          Bila dimatikan, semua request BSI dibalas Service Unavailable.
                        </div>
                      </VCardText>
                    </VCard>
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'security'"
                    cols="12"
                    md="6"
                  >
                    <VCard
                      variant="outlined"
                      class="h-100"
                    >
                      <VCardText>
                        <VSwitch
                          v-model="form.enforceIpAllowlist"
                          label="Terapkan IP whitelist"
                          color="warning"
                          hide-details
                        />
                        <div class="text-caption text-medium-emphasis ms-10">
                          Tolak request dari IP di luar daftar.
                        </div>
                      </VCardText>
                    </VCard>
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'security'"
                    cols="12"
                    md="6"
                  >
                    <VCard
                      variant="outlined"
                      class="h-100"
                    >
                      <VCardText>
                        <VSwitch
                          v-model="form.verifySignatures"
                          label="Terapkan verifikasi signature"
                          color="warning"
                          hide-details
                        />
                        <div class="text-caption text-medium-emphasis ms-10">
                          Matikan hanya sementara saat menelusuri kegagalan SIT.
                        </div>
                      </VCardText>
                    </VCard>
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'security'"
                    cols="12"
                    md="6"
                  >
                    <VCard
                      variant="outlined"
                      class="h-100"
                    >
                      <VCardText>
                        <VSwitch
                          v-model="form.logPayloads"
                          label="Simpan body request/response"
                          color="warning"
                          hide-details
                        />
                        <div class="text-caption text-medium-emphasis ms-10">
                          Diperlukan untuk menelusuri kegagalan signature dan SIT.
                        </div>
                      </VCardText>
                    </VCard>
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'security'"
                    cols="12"
                    md="6"
                  >
                    <VCard
                      variant="outlined"
                      class="h-100"
                    >
                      <VCardText>
                        <VSwitch
                          v-model="form.testMode"
                          label="Mode uji (semua NIM)"
                          color="warning"
                          hide-details
                        />
                        <div class="text-caption text-medium-emphasis ms-10">
                          Payment order baru akan ditandai data_test=true.
                        </div>
                      </VCardText>
                    </VCard>
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'security'"
                    cols="12"
                    md="6"
                  >
                    <VCard
                      variant="outlined"
                      class="h-100"
                    >
                      <VCardText>
                        <VSwitch
                          v-model="form.serveTestVa"
                          label="Layani nomor VA uji (9999xxxxxx)"
                          color="warning"
                          hide-details
                        />
                        <div class="text-caption text-medium-emphasis ms-10">
                          Matikan di produksi; hanya VA uji yang sudah dibuat di SIMKEU yang dilayani.
                        </div>
                      </VCardText>
                    </VCard>
                  </VCol>
                  <VCol
                    v-show="configurationSection === 'security'"
                    cols="12"
                  >
                    <VSelect
                      v-model="form.databaseFailureMode"
                      label="Simulasi DB Down (Skenario SIT A4 / B3)"
                      :items="[
                        { title: 'Nonaktif — layanan normal', value: 'none' },
                        { title: 'Transaksi saja — Inquiry/Payment balas DB Error, Auth tetap jalan', value: 'transactions' },
                        { title: 'Semua — Auth ikut gagal, seperti DB benar-benar mati', value: 'all' },
                      ]"
                    />
                    <VAlert
                      v-if="form.databaseFailureMode !== 'none'"
                      type="error"
                      variant="tonal"
                      density="compact"
                    >
                      Simulasi DB Error sedang aktif. Nonaktifkan kembali segera setelah pengujian BSI selesai.
                    </VAlert>
                  </VCol>
                </VRow>
              </VCardText>
              <VCardActions class="justify-end pa-6 pt-0">
                <VBtn
                  variant="outlined"
                  :loading="validating"
                  @click="validateSettings"
                >
                  Validasi
                </VBtn>
                <VBtn
                  color="primary"
                  :loading="saving"
                  @click="saveSettings"
                >
                  Simpan Konfigurasi
                </VBtn>
              </VCardActions>
            </VCard>
          </VCol>

          <VCol
            cols="12"
            lg="4"
          >
            <VCard
              title="Status Kesiapan"
              class="mb-6"
            >
              <VList density="compact">
                <VListItem
                  v-for="([label, ready], index) in readinessItems"
                  :key="index"
                  :title="label"
                >
                  <template #append>
                    <VIcon
                      :icon="ready ? 'ri-checkbox-circle-fill' : 'ri-close-circle-fill'"
                      :color="ready ? 'success' : 'error'"
                    />
                  </template>
                </VListItem>
              </VList>
            </VCard>
          </VCol>
        </VRow>

        <VCard v-show="configurationSection === 'portal'">
          <VCardItem>
            <div class="d-flex flex-wrap align-center gap-3">
              <div>
                <VCardTitle>Data untuk Admin Panel BSI</VCardTitle>
                <VCardSubtitle>
                  Nilai berikut disusun mengikuti kolom Host-to-Host dan Rekonsiliasi pada portal BSI.
                </VCardSubtitle>
              </div>
              <VSpacer />
              <VBtn
                color="primary"
                variant="tonal"
                prepend-icon="ri-file-copy-line"
                @click="copyText(adminPanelText, 'Data Admin Panel BSI')"
              >
                Salin Semua
              </VBtn>
            </div>
          </VCardItem>

          <VCardText>
            <VAlert
              type="info"
              variant="tonal"
              class="mb-6"
            >
              Secret disimpan terenkripsi di database dan hanya ditampilkan pada menu admin ini. Gunakan tombol salin untuk mengisikan nilainya ke portal BSI.
            </VAlert>

            <VRow>
              <VCol
                cols="12"
                lg="6"
                class="admin-panel-fields"
              >
                <h3 class="text-h5 mb-4">
                  Host-to-Host
                </h3>

                <VTextField
                  :model-value="hostToHostSpecification"
                  label="Status & Spesifikasi"
                  readonly
                  append-inner-icon="ri-file-copy-line"
                  @click:append-inner="copyText(hostToHostSpecification, 'Status & Spesifikasi')"
                />
                <VTextField
                  model-value="Pilih routing network sesuai arahan tim BSI"
                  label="Routing Network"
                  readonly
                  hint="Dropdown ini dipilih langsung di portal BSI. Daftar IP ada pada konfigurasi allowlist di atas."
                  persistent-hint
                  class="mb-3"
                />
                <VTextField
                  model-value="Close amount — nominal harus sama persis"
                  label="Skema Pembayaran"
                  readonly
                  append-inner-icon="ri-file-copy-line"
                  @click:append-inner="copyText('Close amount — nominal harus sama persis', 'Skema Pembayaran')"
                />
                <VTextField
                  :model-value="secretDisplay(hostToHostToken, settingsData?.client_secret_configured, 'Client Secret')"
                  label="Token Host to Host (Secret Key)"
                  :type="hostToHostToken ? 'text' : 'password'"
                  readonly
                  :append-inner-icon="hostToHostToken ? 'ri-file-copy-line' : undefined"
                  @click:append-inner="hostToHostToken && copyText(hostToHostToken, 'Token Host-to-Host')"
                />
                <VTextField
                  :model-value="endpoints.inquiry"
                  label="URL Host to Host Inquiry"
                  readonly
                  append-inner-icon="ri-file-copy-line"
                  @click:append-inner="copyText(endpoints.inquiry, 'URL Inquiry')"
                />
                <VTextField
                  :model-value="endpoints.payment"
                  label="URL Host to Host Payment"
                  readonly
                  append-inner-icon="ri-file-copy-line"
                  @click:append-inner="copyText(endpoints.payment, 'URL Payment')"
                />
                <VTextField
                  :model-value="endpoints.auth"
                  label="URL Otentikasi"
                  readonly
                  append-inner-icon="ri-file-copy-line"
                  @click:append-inner="copyText(endpoints.auth, 'URL Otentikasi')"
                />
                <VTextField
                  :model-value="endpoints.advice"
                  label="URL Advice"
                  readonly
                  append-inner-icon="ri-file-copy-line"
                  @click:append-inner="copyText(endpoints.advice, 'URL Advice')"
                />
              </VCol>

              <VCol
                cols="12"
                lg="6"
                class="admin-panel-fields"
              >
                <div class="d-flex flex-wrap align-center gap-2 mb-4">
                  <h3 class="text-h5">
                    Rekonsiliasi
                  </h3>
                  <VChip
                    color="success"
                    size="small"
                    label
                  >
                    Aktifkan Email & Webservice di BSI
                  </VChip>
                </div>

                <VTextField
                  :model-value="form.reconciliationEmail"
                  label="Email Tujuan Rekonsiliasi"
                  readonly
                  append-inner-icon="ri-file-copy-line"
                  @click:append-inner="copyText(form.reconciliationEmail, 'Email Rekonsiliasi')"
                />
                <VTextField
                  :model-value="secretDisplay(reconciliationToken, settingsData?.reconciliation_secret_configured || settingsData?.client_secret_configured, 'Reconciliation Secret')"
                  label="Token Custom Report"
                  :type="reconciliationToken ? 'text' : 'password'"
                  readonly
                  :append-inner-icon="reconciliationToken ? 'ri-file-copy-line' : undefined"
                  @click:append-inner="reconciliationToken && copyText(reconciliationToken, 'Token Custom Report')"
                />
                <VTextField
                  :model-value="endpoints.reconciliation"
                  label="URL Webservice Custom Report Rekonsiliasi"
                  readonly
                  append-inner-icon="ri-file-copy-line"
                  @click:append-inner="copyText(endpoints.reconciliation, 'URL Rekonsiliasi')"
                />

                <VAlert
                  type="info"
                  variant="tonal"
                >
                  Di portal BSI, centang <strong>Kirim Berkas Rekonsiliasi ke Email Institusi</strong> dan <strong>Panggil URL Webservice Custom Report Institusi</strong>.
                </VAlert>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VWindowItem>

      <VWindowItem value="messaging">
        <VCard>
          <VCardItem>
            <div class="d-flex flex-wrap align-center gap-3">
              <div>
                <VCardTitle>Log Messaging H2H</VCardTitle>
                <VCardSubtitle>
                  Riwayat Auth, Inquiry, Payment, Advice, dan Rekonsiliasi yang diterima dari BSI.
                </VCardSubtitle>
              </div>
              <VSpacer />
              <VBtn
                variant="tonal"
                prepend-icon="ri-refresh-line"
                :loading="messagingLogsLoading"
                @click="loadMessagingLogs(1)"
              >
                Muat Ulang
              </VBtn>
            </div>
          </VCardItem>

          <VCardText>
            <VRow align="center">
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="messagingLogSearch"
                  label="Cari customer number / external ID / kode"
                  prepend-inner-icon="ri-search-line"
                  clearable
                  @keyup.enter="loadMessagingLogs(1)"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VSelect
                  v-model="messagingLogOperation"
                  label="Event"
                  :items="[
                    { title: 'Semua event', value: 'all' },
                    { title: 'Auth', value: 'auth' },
                    { title: 'Inquiry', value: 'inquiry' },
                    { title: 'Payment', value: 'payment' },
                    { title: 'Advice', value: 'advice' },
                    { title: 'Rekonsiliasi', value: 'reconciliation' },
                  ]"
                  @update:model-value="loadMessagingLogs(1)"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VCheckbox
                  v-model="messagingLogFailedOnly"
                  label="Hanya gagal"
                  hide-details
                  @update:model-value="loadMessagingLogs(1)"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VProgressLinear
            v-if="messagingLogsLoading"
            indeterminate
            color="primary"
          />

          <VTable class="text-no-wrap">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Event</th>
                <th>Customer No.</th>
                <th>Kode</th>
                <th>Pesan</th>
                <th class="text-center">
                  SIG
                </th>
                <th class="text-end">
                  MS
                </th>
                <th>IP</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="log in messagingLogs"
                :key="log.id"
              >
                <td>{{ formatDateTime(log.requested_at) }}</td>
                <td class="font-weight-medium text-uppercase">
                  {{ log.operation }}
                </td>
                <td class="font-monospace">
                  {{ messagingLogCustomerNo(log) }}
                </td>
                <td>
                  <VChip
                    :color="log.outcome === 'success' ? 'success' : 'error'"
                    size="small"
                    label
                  >
                    {{ log.response_code || log.http_status || '-' }}
                  </VChip>
                </td>
                <td>{{ messagingLogMessage(log) }}</td>
                <td class="text-center">
                  <VIcon
                    v-if="log.signature_valid === true"
                    icon="ri-shield-check-line"
                    color="success"
                  />
                  <VIcon
                    v-else-if="log.signature_valid === false"
                    icon="ri-shield-cross-line"
                    color="error"
                  />
                  <span
                    v-else
                    class="text-medium-emphasis"
                  >—</span>
                </td>
                <td class="text-end">
                  {{ log.duration_ms }}
                </td>
                <td class="font-monospace">
                  {{ log.source_ip || '-' }}
                </td>
                <td class="text-end">
                  <VBtn
                    variant="text"
                    size="small"
                    @click="showMessagingLogDetail(log)"
                  >
                    Detail
                  </VBtn>
                </td>
              </tr>
              <tr v-if="!messagingLogsLoading && !messagingLogs.length">
                <td
                  colspan="9"
                  class="text-center text-medium-emphasis py-8"
                >
                  Belum ada log messaging yang sesuai filter.
                </td>
              </tr>
            </tbody>
          </VTable>

          <VCardActions
            v-if="messagingLogsLastPage > 1"
            class="justify-center py-4"
          >
            <VPagination
              v-model="messagingLogsPage"
              :length="messagingLogsLastPage"
              :total-visible="7"
              @update:model-value="loadMessagingLogs"
            />
          </VCardActions>
        </VCard>
      </VWindowItem>

      <VWindowItem value="reconciliation">
        <VRow class="mb-4">
          <VCol
            v-for="card in [
              { key: 'total', title: 'Total Rekonsiliasi', color: 'primary', icon: 'ri-file-list-3-line' },
              { key: 'matched', title: 'Sudah Cocok', color: 'success', icon: 'ri-checkbox-circle-line' },
              { key: 'mismatch', title: 'Belum Cocok', color: 'error', icon: 'ri-error-warning-line' },
            ]"
            :key="card.key"
            cols="12"
            md="4"
          >
            <VCard :loading="reconciliationStatsLoading">
              <VCardText class="d-flex align-center gap-4">
                <VAvatar
                  :color="card.color"
                  variant="tonal"
                  size="48"
                >
                  <VIcon :icon="card.icon" />
                </VAvatar>
                <div>
                  <div class="text-body-2 text-medium-emphasis">
                    {{ card.title }}
                  </div>
                  <div class="text-h5 font-weight-bold">
                    {{ reconciliationStats?.[card.key]?.count || 0 }} data
                  </div>
                  <div class="text-body-2">
                    {{ rupiah(reconciliationStats?.[card.key]?.amount || 0) }}
                  </div>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>

        <VCard>
          <VCardItem>
            <div class="d-flex flex-wrap align-center gap-3">
              <div>
                <VCardTitle>Data Rekonsiliasi dari BSI</VCardTitle>
                <VCardSubtitle>
                  Hasil pencocokan pembayaran, settlement, dan checksum laporan BSI.
                </VCardSubtitle>
              </div>
              <VSpacer />
              <VBtn
                variant="tonal"
                prepend-icon="ri-refresh-line"
                :loading="reconciliationsLoading"
                @click="loadReconciliationData"
              >
                Muat Ulang
              </VBtn>
            </div>
          </VCardItem>

          <VCardText>
            <VRow align="center">
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="reconciliationSearch"
                  label="Cari ID rekon / nomor pembayaran / jurnal / mahasiswa"
                  prepend-inner-icon="ri-search-line"
                  clearable
                  @keyup.enter="loadReconciliations(1)"
                />
              </VCol>
              <VCol
                cols="12"
                md="2"
              >
                <VSelect
                  v-model="reconciliationStatus"
                  label="Hasil Pencocokan"
                  :items="[
                    { title: 'Semua hasil', value: 'all' },
                    { title: 'Cocok', value: 'matched' },
                    { title: 'Tidak cocok / tidak ditemukan', value: 'mismatch' },
                  ]"
                  @update:model-value="loadReconciliations(1)"
                />
              </VCol>
              <VCol
                cols="12"
                md="2"
              >
                <VTextField
                  v-model="reconciliationDateStart"
                  type="date"
                  label="Tanggal mulai"
                  @update:model-value="loadReconciliationData"
                />
              </VCol>
              <VCol
                cols="12"
                md="2"
              >
                <VTextField
                  v-model="reconciliationDateEnd"
                  type="date"
                  label="Tanggal akhir"
                  @update:model-value="loadReconciliationData"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VProgressLinear
            v-if="reconciliationsLoading"
            indeterminate
            color="primary"
          />

          <VTable class="text-no-wrap">
            <thead>
              <tr>
                <th>ID Rekon</th>
                <th>Waktu Transaksi</th>
                <th>Nomor Bayar</th>
                <th>Nama</th>
                <th class="text-end">
                  Pembayaran
                </th>
                <th class="text-end">
                  Settlement
                </th>
                <th>Kode FT</th>
                <th class="text-center">
                  Checksum
                </th>
                <th>Cocok</th>
                <th>Deskripsi Ketidakcocokan</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in reconciliations"
                :key="item.id"
              >
                <td class="font-monospace">
                  {{ item.recon_id }}
                </td>
                <td>{{ formatDateTime(item.transaction_at) }}</td>
                <td class="font-monospace">
                  {{ item.payment_number || item.payment?.bsi_payment_number || '-' }}
                </td>
                <td>{{ item.payment?.nama_mahasiswa || '-' }}</td>
                <td class="text-end font-weight-medium">
                  {{ rupiah(item.payment_amount) }}
                </td>
                <td class="text-end">
                  {{ rupiah(item.settlement_amount) }}
                </td>
                <td class="font-monospace">
                  {{ [item.journal_number, item.settlement_code].filter(Boolean).join(' / ') || '-' }}
                </td>
                <td class="text-center">
                  <VIcon
                    :icon="item.checksum_valid ? 'ri-shield-check-line' : 'ri-shield-cross-line'"
                    :color="item.checksum_valid ? 'success' : 'error'"
                  />
                </td>
                <td>
                  <VChip
                    :color="item.match_status === 'matched' ? 'success' : 'error'"
                    size="small"
                    label
                  >
                    {{ reconciliationMatchLabel(item) }}
                  </VChip>
                </td>
                <td
                  style="min-width: 320px; white-space: normal"
                  class="text-body-2"
                >
                  {{ item.mismatch_description || '-' }}
                </td>
              </tr>
              <tr v-if="!reconciliationsLoading && !reconciliations.length">
                <td
                  colspan="10"
                  class="text-center text-medium-emphasis py-8"
                >
                  Belum ada data rekonsiliasi yang sesuai filter.
                </td>
              </tr>
            </tbody>
          </VTable>

          <VCardActions
            v-if="reconciliationsLastPage > 1"
            class="justify-center py-4"
          >
            <VPagination
              v-model="reconciliationsPage"
              :length="reconciliationsLastPage"
              :total-visible="7"
              @update:model-value="loadReconciliations"
            />
          </VCardActions>
        </VCard>
      </VWindowItem>

      <VWindowItem value="simulation">
        <VCard>
          <VCardItem>
            <VCardTitle>Simulasi Pembayaran BSI</VCardTitle>
            <VCardSubtitle>
              Cari mahasiswa, pilih tagihan, lalu tentukan nominal pembayaran maksimal sebesar sisa yang tersedia. Customer number memakai NIM tanpa titik.
            </VCardSubtitle>
          </VCardItem>

          <VCardText>
            <VAlert
              type="info"
              variant="tonal"
              class="mb-6"
            >
              Simulasi ini membuat payment order BSI berstatus <code>pending</code>. Endpoint Payment hanya memperbarui transaksi BSI dan tidak menulis ledger mahasiswa.
            </VAlert>

            <VRow align="center">
              <VCol
                cols="12"
                md="8"
              >
                <VTextField
                  v-model="simulationNim"
                  label="NIM Mahasiswa"
                  placeholder="Masukkan NIM"
                  clearable
                  prepend-inner-icon="ri-user-search-line"
                  @keyup.enter="loadSimulationBills"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <VBtn
                  block
                  size="large"
                  :loading="simulationLoading"
                  prepend-icon="ri-search-line"
                  @click="loadSimulationBills"
                >
                  Tampilkan Tagihan
                </VBtn>
              </VCol>
            </VRow>

            <template v-if="simulationBills">
              <VCard
                variant="tonal"
                class="my-6"
              >
                <VCardText>
                  <VRow>
                    <VCol
                      cols="12"
                      md="4"
                    >
                      <div class="text-caption">
                        Mahasiswa
                      </div>
                      <div class="font-weight-medium">
                        {{ simulationBills.nama_mahasiswa || '-' }}
                      </div>
                      <div>{{ simulationBills.nim }}</div>
                    </VCol>
                    <VCol
                      cols="12"
                      md="4"
                    >
                      <div class="text-caption">
                        Program Studi / Kelas
                      </div>
                      <div class="font-weight-medium">
                        {{ simulationBills.nama_prodi || '-' }}
                      </div>
                      <div>{{ simulationBills.nama_kelas || '-' }}</div>
                    </VCol>
                    <VCol
                      cols="12"
                      md="4"
                    >
                      <div class="text-caption">
                        Total Tersedia
                      </div>
                      <div class="text-h6 text-primary">
                        {{ rupiah(simulationBills.total_tersedia) }}
                      </div>
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>

              <VAlert
                v-if="!simulationBills.list_tagihan?.length"
                type="warning"
                variant="tonal"
              >
                Tidak ada tagihan yang dapat dibayar untuk mahasiswa ini.
              </VAlert>

              <VTable
                v-else
                class="simulation-table"
              >
                <thead>
                  <tr>
                    <th>Pilih</th>
                    <th>Tagihan</th>
                    <th>Tahun Akademik</th>
                    <th class="text-end">
                      Sisa Resmi
                    </th>
                    <th class="text-end">
                      Reservasi BSI
                    </th>
                    <th class="text-end">
                      Maksimal Dibayar
                    </th>
                    <th style="min-inline-size: 220px;">
                      Nominal Bayar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="bill in simulationBills.list_tagihan"
                    :key="bill.id"
                  >
                    <td>
                      <VCheckboxBtn
                        :model-value="selectedSimulationBills.includes(bill.id)"
                        :disabled="bill.tidak_bisa_dibayar"
                        @update:model-value="toggleSimulationBill(bill, $event)"
                      />
                    </td>
                    <td>
                      <div class="font-weight-medium">
                        {{ bill.nama }}
                      </div>
                      <div
                        v-if="bill.keterangan_pembayaran"
                        class="text-caption text-warning"
                      >
                        {{ bill.keterangan_pembayaran }}
                      </div>
                    </td>
                    <td>{{ bill.tahun_akademik || bill.th_akademik_kode || '-' }}</td>
                    <td class="text-end">
                      {{ rupiah(bill.sisa_resmi) }}
                    </td>
                    <td class="text-end">
                      {{ rupiah(bill.reservasi_bsi) }}
                    </td>
                    <td class="text-end font-weight-medium">
                      {{ rupiah(bill.tersedia) }}
                    </td>
                    <td>
                      <VTextField
                        v-model.number="simulationAmounts[bill.id]"
                        type="number"
                        density="compact"
                        prefix="Rp"
                        min="0"
                        :max="bill.tersedia"
                        :disabled="!selectedSimulationBills.includes(bill.id)"
                        hide-details
                        @blur="clampSimulationAmount(bill)"
                      />
                    </td>
                  </tr>
                </tbody>
              </VTable>

              <div
                v-if="simulationBills.list_tagihan?.length"
                class="d-flex flex-wrap align-center justify-end gap-4 mt-6"
              >
                <div class="text-end">
                  <div class="text-caption">
                    Total Pembayaran
                  </div>
                  <div class="text-h5 text-primary">
                    {{ rupiah(simulationTotal) }}
                  </div>
                </div>
                <VBtn
                  color="success"
                  size="large"
                  prepend-icon="ri-bank-card-line"
                  :loading="simulationPaying"
                  :disabled="!selectedSimulationBills.length || simulationTotal <= 0"
                  @click="createSimulationPayment"
                >
                  Bayar / Buat Nomor Pembayaran
                </VBtn>
              </div>
            </template>

            <VCard
              v-if="simulationResult"
              color="success"
              variant="tonal"
              class="mt-6"
            >
              <VCardItem>
                <VCardTitle>Payment Order Berhasil Dibuat</VCardTitle>
                <VCardSubtitle>Status: {{ simulationResult.status }}</VCardSubtitle>
              </VCardItem>
              <VCardText>
                <VRow>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      :model-value="simulationResult.bsi_payment_number"
                      label="Nomor Pembayaran BSI"
                      readonly
                      append-inner-icon="ri-file-copy-line"
                      @click:append-inner="copyText(simulationResult.bsi_payment_number, 'Nomor Pembayaran BSI')"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      :model-value="simulationResult.interbank_va_number"
                      label="Nomor VA Antarbank"
                      readonly
                      append-inner-icon="ri-file-copy-line"
                      @click:append-inner="copyText(simulationResult.interbank_va_number, 'Nomor VA Antarbank')"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="4"
                  >
                    <div><strong>Nilai tagihan:</strong> {{ rupiah(simulationResult.total) }}</div>
                    <div class="text-body-2">
                      <strong>Biaya admin:</strong> {{ rupiah(simulationResult.admin_fee_amount) }}
                      ({{ simulationResult.admin_fee_bearer === 'payer' ? 'pembayar' : 'institusi' }})
                    </div>
                    <template v-if="!simulationResult.production">
                      <div class="text-body-2">
                        <strong>Nominal dikirim ke BSI:</strong> {{ rupiah(simulationResult.total) }}
                      </div>
                      <div class="text-body-2 text-primary">
                        <strong>Perkiraan total di kanal BSI:</strong> {{ rupiah(simulationResult.payable_total) }}
                      </div>
                      <div class="text-caption text-warning">
                        Biaya {{ rupiah(simulationResult.admin_fee_amount) }} ditambahkan oleh sandbox BSI,
                        bukan oleh nominal API SIMKEU.
                      </div>
                    </template>
                    <div
                      v-else
                      class="text-body-2 text-primary"
                    >
                      <strong>Total dibayar di BSI:</strong> {{ rupiah(simulationResult.payable_total) }}
                    </div>
                  </VCol>
                  <VCol
                    cols="12"
                    md="4"
                  >
                    <strong>Referensi:</strong> {{ simulationResult.reference_no }}
                  </VCol>
                  <VCol
                    cols="12"
                    md="4"
                  >
                    <strong>Berlaku hingga:</strong> {{ simulationResult.expired_at }}
                  </VCol>
                </VRow>
              </VCardText>
              <VCardActions
                v-if="simulationResult.status === 'pending'"
                class="justify-end px-6 pb-6"
              >
                <VBtn
                  color="error"
                  variant="outlined"
                  prepend-icon="ri-close-circle-line"
                  :loading="simulationCancelling"
                  @click="cancelSimulationPayment"
                >
                  Batalkan Simulasi
                </VBtn>
              </VCardActions>
            </VCard>

            <VCard
              variant="outlined"
              class="mt-6"
            >
              <VCardItem>
                <div class="d-flex flex-wrap align-center gap-3">
                  <div>
                    <VCardTitle>Data Transaksi Mode Uji</VCardTitle>
                    <VCardSubtitle>
                      Hanya transaksi dengan penanda <code>data_test=true</code> yang ditampilkan.
                    </VCardSubtitle>
                  </div>
                  <VSpacer />
                  <VBtn
                    variant="tonal"
                    prepend-icon="ri-refresh-line"
                    :loading="testPaymentsLoading"
                    @click="loadTestPayments"
                  >
                    Muat Ulang
                  </VBtn>
                </div>
              </VCardItem>

              <VProgressLinear
                v-if="testPaymentsLoading"
                indeterminate
                color="primary"
              />

              <VCardText v-if="!testPaymentsLoading && !testPayments.length">
                <VAlert
                  type="info"
                  variant="tonal"
                >
                  Belum ada transaksi mode uji.
                </VAlert>
              </VCardText>

              <VTable v-else>
                <thead>
                  <tr>
                    <th>Waktu / Referensi</th>
                    <th>Mahasiswa</th>
                    <th>Nomor Pembayaran</th>
                    <th class="text-end">
                      Tagihan / Total BSI
                    </th>
                    <th>Status</th>
                    <th class="text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="payment in testPayments"
                    :key="payment.id"
                  >
                    <td>
                      <div class="font-weight-medium">
                        {{ formatDateTime(payment.created_at) }}
                      </div>
                      <div class="text-caption">
                        {{ payment.reference_no || payment.request_id || payment.nomor }}
                      </div>
                    </td>
                    <td>
                      <div class="font-weight-medium">
                        {{ payment.nama_mahasiswa || '-' }}
                      </div>
                      <div class="text-caption">
                        {{ payment.nim }}
                      </div>
                    </td>
                    <td>
                      <div>{{ payment.bsi_payment_number || payment.va_number }}</div>
                      <div class="text-caption">
                        Antarbank: {{ payment.interbank_va_number || '-' }}
                      </div>
                    </td>
                    <td class="text-end font-weight-medium">
                      <div>{{ rupiah(payment.total) }}</div>
                      <div class="text-caption text-primary">
                        BSI: {{ rupiah(payment.payable_total) }}
                      </div>
                    </td>
                    <td>
                      <div class="d-flex flex-column align-start gap-1">
                        <VChip
                          :color="paymentStatusColor(payment.status)"
                          size="small"
                          label
                        >
                          {{ payment.status }}
                        </VChip>
                        <VChip
                          color="warning"
                          size="x-small"
                          label
                        >
                          DATA TEST
                        </VChip>
                      </div>
                    </td>
                    <td class="text-center">
                      <VBtn
                        icon="ri-delete-bin-line"
                        color="error"
                        variant="text"
                        size="small"
                        title="Hapus transaksi mode uji"
                        :loading="testPaymentDeletingId === payment.id"
                        :disabled="Boolean(testPaymentDeletingId)"
                        @click="openDeleteTestPaymentDialog(payment)"
                      />
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </VCard>
          </VCardText>
        </VCard>
      </VWindowItem>

      <VWindowItem value="payment-methods">
        <VCard>
          <VCardItem>
            <div class="d-flex flex-wrap align-center gap-3">
              <div>
                <VCardTitle>Metode Pembayaran VA</VCardTitle>
                <VCardSubtitle>
                  Master metode yang dicatat otomatis ketika notifikasi pembayaran BSI diterima.
                </VCardSubtitle>
              </div>
              <VSpacer />
              <VBtn
                variant="tonal"
                prepend-icon="ri-refresh-line"
                :loading="paymentMethodsLoading"
                @click="loadPaymentMethods"
              >
                Muat Ulang
              </VBtn>
            </div>
          </VCardItem>

          <VDivider />

          <VAlert
            type="info"
            variant="tonal"
            class="ma-5"
          >
            BYOND BSI dikenali dari channel Mobile Banking, ATM BSI dari channel ATM,
            dan ATM LAIN dari nomor VA antarbank berawalan <code>900</code>.
          </VAlert>

          <VProgressLinear
            v-if="paymentMethodsLoading"
            indeterminate
            color="primary"
          />

          <VTable>
            <thead>
              <tr>
                <th style="width: 70px">
                  No
                </th>
                <th>Nama</th>
                <th>Keterangan</th>
                <th style="width: 130px">
                  Aktif
                </th>
                <th
                  class="text-center"
                  style="width: 100px"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(method, index) in paymentMethods"
                :key="method.id"
              >
                <td>{{ index + 1 }}</td>
                <td class="font-weight-medium">
                  {{ method.nama }}
                </td>
                <td>{{ method.keterangan || '-' }}</td>
                <td>
                  <VSwitch
                    :model-value="method.aktif"
                    color="success"
                    hide-details
                    density="compact"
                    :loading="paymentMethodTogglingId === method.id"
                    :disabled="paymentMethodTogglingId !== null"
                    @update:model-value="aktif => togglePaymentMethod(method, aktif)"
                  />
                </td>
                <td class="text-center">
                  <IconBtn
                    title="Edit metode pembayaran"
                    @click="editPaymentMethod(method)"
                  >
                    <VIcon icon="ri-pencil-line" />
                  </IconBtn>
                </td>
              </tr>
              <tr v-if="!paymentMethodsLoading && paymentMethods.length === 0">
                <td
                  colspan="5"
                  class="text-center text-medium-emphasis py-8"
                >
                  Belum ada metode pembayaran.
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCard>
      </VWindowItem>

      <VWindowItem value="docs">
        <VRow class="mb-6">
          <VCol
            cols="12"
            md="4"
            class="d-flex"
          >
            <VCard
              title="API Key SIAKAD"
              class="flex-grow-1"
            >
              <VCardText>
                <p class="mb-4">
                  {{ settingsData?.siakad_api_key_configured ? `Tersimpan ••••${settingsData?.siakad_api_key_hint}` : 'Belum dibuat.' }}
                </p>
                <VAlert
                  type="info"
                  variant="tonal"
                  density="compact"
                  class="mb-4"
                >
                  API key dipakai SIAKAD pada header <code>X-SIAKAD-API-KEY</code> dan hanya ditampilkan satu kali saat dibuat.
                </VAlert>
                <VBtn
                  block
                  color="warning"
                  variant="tonal"
                  :loading="rotatingKey"
                  @click="rotateSiakadKey"
                >
                  {{ settingsData?.siakad_api_key_configured ? 'Rotasi API Key' : 'Buat API Key' }}
                </VBtn>
                <p class="text-caption text-medium-emphasis mb-0 mt-3">
                  Rotasi langsung menonaktifkan key lama. Perbarui key di server SIAKAD pada waktu yang sama.
                </p>
              </VCardText>
            </VCard>
          </VCol>

          <VCol
            cols="12"
            md="8"
            class="d-flex"
          >
            <VCard
              title="Endpoint Integrasi"
              class="flex-grow-1"
            >
              <VList density="compact">
                <VListItem
                  v-for="endpoint in siakadEndpoints"
                  :key="endpoint.key"
                  :title="endpoint.title"
                  :subtitle="endpoint.url"
                >
                  <template #prepend>
                    <VChip
                      :color="endpoint.method === 'GET' ? 'info' : 'primary'"
                      size="small"
                      label
                      class="me-3"
                    >
                      {{ endpoint.method }}
                    </VChip>
                  </template>
                  <template #append>
                    <IconBtn
                      size="small"
                      @click="copyText(endpoint.url, `URL ${endpoint.title}`)"
                    >
                      <VIcon icon="ri-file-copy-line" />
                    </IconBtn>
                  </template>
                </VListItem>
              </VList>
            </VCard>
          </VCol>
        </VRow>

        <VCard
          title="Kontrak Aktif"
          class="mb-6"
        >
          <VCardText>
            <div class="d-flex flex-wrap gap-3 mb-4">
              <VChip
                :color="settingsData?.enabled ? 'success' : 'error'"
                label
              >
                {{ settingsData?.enabled ? 'Integrasi aktif' : 'Integrasi nonaktif' }}
              </VChip>
              <VChip
                :color="settingsData?.environment === 'production' ? 'success' : 'warning'"
                variant="tonal"
                label
              >
                {{ (settingsData?.environment || 'sandbox').toUpperCase() }}
              </VChip>
              <VChip
                :color="settingsData?.test_mode ? 'warning' : 'success'"
                variant="tonal"
                label
              >
                {{ settingsData?.test_mode ? 'Data test aktif' : 'Data test nonaktif' }}
              </VChip>
              <VChip
                color="primary"
                variant="tonal"
                label
              >
                {{ settingsData?.payment_mode === 'close' ? 'Close Payment' : 'Open Payment' }}
              </VChip>
              <VChip
                color="info"
                variant="tonal"
                label
              >
                Expiry {{ settingsData?.payment_expiry_minutes || 1440 }} menit
              </VChip>
              <VChip
                color="secondary"
                variant="tonal"
                label
              >
                Biaya admin {{ settingsData?.admin_fee_bearer === 'payer' ? 'dibayar mahasiswa' : 'ditanggung institusi' }}
                · {{ rupiah(settingsData?.admin_fee_amount || 0) }}
              </VChip>
              <VChip
                :color="settingsData?.auto_transfer_enabled ? 'success' : 'warning'"
                variant="tonal"
                label
              >
                Auto transfer {{ settingsData?.auto_transfer_enabled ? 'aktif' : 'nonaktif' }}
              </VChip>
            </div>

            <VAlert
              type="info"
              variant="tonal"
              density="compact"
            >
              <strong>{{ settingsData?.payment_mode === 'close' ? 'Close Payment:' : 'Open Payment:' }}</strong>
              {{ paymentModeDescription }}
            </VAlert>
          </VCardText>
        </VCard>

        <VCard>
          <VCardText>
            <VAlert
              :type="settingsData?.enabled && settingsData?.siakad_api_key_configured ? 'info' : 'warning'"
              variant="tonal"
              class="mb-6"
            >
              SIAKAD menangani login mahasiswa dan UI pemilihan tagihan. Semua request dilakukan dari server SIAKAD, memakai <code>Accept: application/json</code> dan <code>X-SIAKAD-API-KEY</code>. Jangan panggil endpoint ini langsung dari browser mahasiswa karena API key dapat terekspos.
            </VAlert>

            <h3 class="text-h5 mb-3">
              Arsitektur Standalone dan Sumber Konfigurasi
            </h3>
            <p class="mb-4">
              Payment order dari SIAKAD memang masuk ke tabel transaksi BSI standalone terlebih dahulu. Status <code>success</code> berarti pembayaran sudah dikonfirmasi BSI, sedangkan <code>transferred: true</code> berarti transaksi tersebut sudah disinkronkan ke ledger pembayaran resmi SIMKEU.
            </p>
            <VAlert
              type="success"
              variant="tonal"
              density="compact"
              class="mb-4"
            >
              SIAKAD tidak menentukan konfigurasi transaksi. SIAKAD hanya mengirim identitas request, NIM, dan pilihan tagihan. Seluruh nilai operasional berikut dibaca oleh backend dari Konfig BSI SIMKEU saat order dibuat atau diproses.
            </VAlert>
            <VTable
              density="compact"
              class="mb-8"
            >
              <thead><tr><th>Konfig SIMKEU</th><th>Diterapkan sebagai</th><th>Boleh dikirim SIAKAD?</th></tr></thead>
              <tbody>
                <tr><td><code>enabled</code></td><td>Menentukan apakah seluruh API SIAKAD dapat diakses.</td><td>Tidak</td></tr>
                <tr><td><code>environment</code></td><td>Menentukan nilai <code>production</code> pada order.</td><td>Tidak</td></tr>
                <tr><td><code>test_mode</code></td><td>Menentukan nilai <code>data_test</code> pada order.</td><td>Tidak</td></tr>
                <tr><td><code>kode_bpi</code></td><td>Membentuk nomor pembayaran BSI dan VA antarbank.</td><td>Tidak</td></tr>
                <tr><td><code>payment_expiry_minutes</code></td><td>Menghasilkan <code>expired_at</code>.</td><td>Tidak</td></tr>
                <tr><td><code>payment_mode</code></td><td>Menentukan perilaku Open/Close Payment saat pembayaran diterima BSI.</td><td>Tidak</td></tr>
                <tr><td><code>admin_fee_bearer</code> dan nominal biaya</td><td>Menghasilkan <code>admin_fee_amount</code>, <code>payable_total</code>, dan <code>expected_settlement_total</code>.</td><td>Tidak</td></tr>
                <tr><td><code>auto_transfer_enabled</code></td><td>Menentukan sinkronisasi otomatis transaksi sukses ke ledger resmi.</td><td>Tidak</td></tr>
              </tbody>
            </VTable>

            <h3 class="text-h5 mb-3">
              Header Request
            </h3>
            <VTable
              density="compact"
              class="mb-4"
            >
              <thead><tr><th>Header</th><th>Digunakan pada</th><th>Status</th><th>Nilai</th></tr></thead>
              <tbody>
                <tr><td><code>X-SIAKAD-API-KEY</code></td><td>Semua endpoint</td><td>Wajib</td><td>API key yang dibuat dari tab ini.</td></tr>
                <tr><td><code>Accept</code></td><td>Semua endpoint</td><td>Wajib</td><td><code>application/json</code></td></tr>
                <tr><td><code>Content-Type</code></td><td>POST create payment order</td><td>Wajib</td><td><code>application/json</code></td></tr>
                <tr><td><code>User-Agent</code></td><td>Semua endpoint</td><td>Opsional</td><td>Identitas aplikasi/versi SIAKAD untuk membantu penelusuran.</td></tr>
              </tbody>
            </VTable>
            <VAlert
              type="info"
              variant="tonal"
              density="compact"
              class="mb-8"
            >
              API ini tidak memakai header <code>Authorization: Bearer</code>, signature BI-SNAP, <code>X-TIMESTAMP</code>, atau <code>X-EXTERNAL-ID</code>. Header tersebut hanya terkait komunikasi Host-to-Host BSI, bukan API SIAKAD.
            </VAlert>

            <h3 class="text-h5 mb-3">
              Body POST Payment Order
            </h3>
            <VTable
              density="compact"
              class="mb-4"
            >
              <thead><tr><th>Field</th><th>Tipe</th><th>Status</th><th>Aturan</th></tr></thead>
              <tbody>
                <tr><td><code>request_id</code></td><td>string</td><td>Wajib</td><td>Maksimal 255 karakter, unik, dan stabil untuk idempotensi.</td></tr>
                <tr><td><code>nim</code></td><td>string</td><td>Wajib</td><td>Maksimal 255 karakter; setelah titik dan spasi dihapus harus 5–12 digit.</td></tr>
                <tr><td><code>items</code></td><td>array</td><td>Wajib</td><td>Berisi 1–100 item tagihan.</td></tr>
                <tr><td><code>items[].tagihan_id</code></td><td>integer</td><td>Wajib</td><td>Harus unik dan berasal dari respons endpoint bills yang masih tersedia.</td></tr>
                <tr><td><code>items[].jumlah</code></td><td>number</td><td>Wajib</td><td>Minimal 0,01 dan tidak melebihi nilai <code>tersedia</code> tagihan.</td></tr>
              </tbody>
            </VTable>
            <VAlert
              type="warning"
              variant="tonal"
              density="compact"
              class="mb-8"
            >
              Tidak ada field body opsional. Field tambahan—termasuk <code>data_test</code>, <code>production</code>, <code>payment_mode</code>, expiry, biaya admin, nomor VA, status, atau <code>cara_bayar</code>—akan ditolak dengan HTTP 422 karena seluruhnya dikelola SIMKEU.
            </VAlert>

            <h3 class="text-h5 mb-3">
              1. Ambil Tagihan Mahasiswa
            </h3>
            <p class="mb-3">
              <code>GET {{ billsEndpoint }}</code>
            </p>
            <p class="mb-3">
              <strong>Path wajib:</strong> <code>nim</code>. <strong>Body:</strong> tidak ada. Gunakan NIM mahasiswa sebagai parameter path. Respons berisi profil ringkas, daftar tagihan yang masih mempunyai nominal <code>tersedia</code>, aturan dapat dibayar, dan total seluruh tagihan tersedia.
            </p>
            <div class="code-block mb-6">
              <IconBtn
                class="copy-btn"
                @click="copyText(curlBills, 'Contoh curl')"
              >
                <VIcon icon="ri-file-copy-line" />
              </IconBtn><pre>{{ curlBills }}</pre>
            </div>

            <h4 class="text-h6 mb-3">
              Contoh Respons Tagihan
            </h4>
            <div class="code-block mb-6">
              <IconBtn
                class="copy-btn"
                @click="copyText(billsResponseExample, 'Respons tagihan')"
              >
                <VIcon icon="ri-file-copy-line" />
              </IconBtn><pre>{{ billsResponseExample }}</pre>
            </div>

            <VAlert
              type="warning"
              variant="tonal"
              density="compact"
              class="mb-8"
            >
              Kirim hanya tagihan bermata uang <code>IDR</code>, <code>tidak_bisa_dibayar: false</code>, dan nominal antara 0,01 sampai nilai <code>tersedia</code>. Validasi final tetap dilakukan SIMKEU saat payment order dibuat.
            </VAlert>

            <h3 class="text-h5 mb-3">
              2. Ambil Riwayat Pembayaran Mahasiswa
            </h3>
            <p class="mb-3">
              <code>GET {{ paymentHistoryEndpoint }}</code>
            </p>
            <p class="mb-3">
              <strong>Path wajib:</strong> <code>nim</code>. <strong>Body:</strong> tidak ada. Endpoint ini hanya membaca pembayaran yang sudah masuk ke ledger resmi <code>keuangan_pembayaran</code>; data payment order BSI standalone tidak ikut ditampilkan.
            </p>
            <VAlert
              type="info"
              variant="tonal"
              density="compact"
              class="mb-4"
            >
              Satu pembayaran mahasiswa dapat tersimpan sebagai beberapa baris. Baris dengan nilai <code>keuangan_nota.nota</code> yang sama dibundel menjadi satu transaksi, lengkap dengan <code>total</code> dan daftar <code>items</code>. Baris lama tanpa nota menjadi satu bundel tersendiri menggunakan nilai <code>nomor</code> pembayaran.
            </VAlert>
            <div class="code-block mb-6">
              <IconBtn
                class="copy-btn"
                @click="copyText(curlPaymentHistory, 'Contoh riwayat pembayaran')"
              >
                <VIcon icon="ri-file-copy-line" />
              </IconBtn><pre>{{ curlPaymentHistory }}</pre>
            </div>

            <h4 class="text-h6 mb-3">
              Contoh Respons Riwayat Pembayaran
            </h4>
            <div class="code-block mb-8">
              <IconBtn
                class="copy-btn"
                @click="copyText(paymentHistoryResponseExample, 'Respons riwayat pembayaran')"
              >
                <VIcon icon="ri-file-copy-line" />
              </IconBtn><pre>{{ paymentHistoryResponseExample }}</pre>
            </div>

            <h3 class="text-h5 mb-3">
              3. Buat Payment Order
            </h3>
            <p class="mb-3">
              <code>POST {{ ordersEndpoint }}</code>
            </p>
            <p class="mb-3">
              <strong>Body:</strong> JSON dengan tiga field utama wajib; setiap item berisi dua field wajib. Tidak ada field opsional.
            </p>
            <ul class="mb-4 ps-5">
              <li><code>request_id</code> wajib unik dan stabil untuk satu transaksi SIAKAD.</li>
              <li>NIM setelah titik dan spasi dihapus harus terdiri dari 5–12 digit.</li>
              <li>Pengiriman ulang <code>request_id</code> dengan payload yang sama bersifat idempoten dan mengembalikan HTTP 200 dengan <code>created: false</code>.</li>
              <li><code>request_id</code> yang sama dengan payload berbeda ditolak dengan HTTP 422.</li>
              <li><code>items</code> berisi 1–100 tagihan unik. Nominal setiap item tidak boleh melebihi <code>tersedia</code>.</li>
              <li>Satu mahasiswa hanya dapat memiliki satu payment order aktif pada saat yang sama.</li>
            </ul>
            <div class="code-block mb-4">
              <IconBtn
                class="copy-btn"
                @click="copyText(createOrderBody, 'Payload JSON')"
              >
                <VIcon icon="ri-file-copy-line" />
              </IconBtn><pre>{{ createOrderBody }}</pre>
            </div>
            <div class="code-block mb-6">
              <IconBtn
                class="copy-btn"
                @click="copyText(curlCreate, 'Contoh curl')"
              >
                <VIcon icon="ri-file-copy-line" />
              </IconBtn><pre>{{ curlCreate }}</pre>
            </div>

            <h4 class="text-h6 mb-3">
              Contoh Respons Payment Order
            </h4>
            <div class="code-block mb-4">
              <IconBtn
                class="copy-btn"
                @click="copyText(orderResponseExample, 'Respons payment order')"
              >
                <VIcon icon="ri-file-copy-line" />
              </IconBtn><pre>{{ orderResponseExample }}</pre>
            </div>

            <VTable
              density="compact"
              class="mb-8"
            >
              <thead><tr><th>Field</th><th>Keterangan</th></tr></thead>
              <tbody>
                <tr><td><code>bsi_payment_number</code></td><td>Nomor pembayaran untuk kanal BSI.</td></tr>
                <tr><td><code>interbank_va_number</code></td><td>Nomor VA untuk pembayaran dari bank lain.</td></tr>
                <tr><td><code>total</code></td><td>Total pokok item yang dipilih; pada Open Payment dapat berubah mengikuti nominal pokok yang benar-benar dibayar.</td></tr>
                <tr><td><code>payable_total</code></td><td>Pokok ditambah biaya admin apabila biaya dibebankan kepada mahasiswa.</td></tr>
                <tr><td><code>expected_settlement_total</code></td><td>Perkiraan dana bersih setelah biaya yang ditanggung institusi.</td></tr>
                <tr><td><code>data_test</code> / <code>production</code></td><td>Penanda lingkungan dan data uji pada saat order dibuat.</td></tr>
                <tr><td><code>transferred</code></td><td><code>true</code> jika pembayaran BSI sudah disinkronkan ke ledger pembayaran resmi SIMKEU.</td></tr>
                <tr><td><code>details</code></td><td>Snapshot tagihan, nominal, dan cara bayar yang diproses.</td></tr>
              </tbody>
            </VTable>

            <h3 class="text-h5 mb-3">
              4. Cek Status Payment Order
            </h3>
            <p class="mb-3">
              <code>GET {{ ordersEndpoint }}/{request_id}</code>
            </p>
            <p class="mb-3">
              <strong>Path wajib:</strong> <code>request_id</code>. <strong>Body:</strong> tidak ada. Poll endpoint ini menggunakan <code>request_id</code> milik SIAKAD. Respons memakai struktur <code>data</code> yang sama seperti respons pembuatan order dan selalu menjalankan pengecekan kedaluwarsa order <code>pending</code> terlebih dahulu.
            </p>
            <div class="code-block mb-6">
              <IconBtn
                class="copy-btn"
                @click="copyText(curlStatus, 'Contoh cek status')"
              >
                <VIcon icon="ri-file-copy-line" />
              </IconBtn><pre>{{ curlStatus }}</pre>
            </div>

            <h3 class="text-h5 mb-3">
              5. Batalkan Payment Order
            </h3>
            <p class="mb-3">
              <strong>Path wajib:</strong> <code>request_id</code>. <strong>Body:</strong> tidak ada. Hanya payment order berstatus <code>pending</code> yang dapat dibatalkan. Pengulangan pembatalan order yang sudah <code>cancelled</code> tetap mengembalikan sukses; status lainnya ditolak dengan HTTP 422.
            </p>
            <div class="code-block mb-6">
              <IconBtn
                class="copy-btn"
                @click="copyText(curlCancel, 'Contoh pembatalan')"
              >
                <VIcon icon="ri-file-copy-line" />
              </IconBtn><pre>{{ curlCancel }}</pre>
            </div>

            <h3 class="text-h5 mb-3">
              6. Contoh Integrasi Laravel/PHP
            </h3>
            <div class="code-block mb-6">
              <IconBtn
                class="copy-btn"
                @click="copyText(phpExample, 'Contoh PHP')"
              >
                <VIcon icon="ri-file-copy-line" />
              </IconBtn><pre>{{ phpExample }}</pre>
            </div>

            <h3 class="text-h5 mb-3">
              7. Contoh Integrasi JavaScript
            </h3>
            <div class="code-block mb-6">
              <IconBtn
                class="copy-btn"
                @click="copyText(javascriptExample, 'Contoh JavaScript')"
              >
                <VIcon icon="ri-file-copy-line" />
              </IconBtn><pre>{{ javascriptExample }}</pre>
            </div>

            <h3 class="text-h5 mb-3">
              Referensi Status Payment Order
            </h3>
            <VTable
              density="compact"
              class="mb-6"
            >
              <thead><tr><th>Status</th><th>Arti</th></tr></thead>
              <tbody>
                <tr><td><code>pending</code></td><td>Menunggu pembayaran mahasiswa.</td></tr>
                <tr><td><code>paid</code></td><td>Status antara/kompatibilitas transaksi lama yang masih menahan order aktif.</td></tr>
                <tr><td><code>success</code></td><td>Pembayaran dikonfirmasi BSI. Cek <code>transferred</code> untuk status sinkronisasi ke ledger resmi.</td></tr>
                <tr><td><code>posted</code></td><td>Status posting pada data lama; integrasi baru memakai <code>success</code> dan <code>transferred</code>.</td></tr>
                <tr><td><code>needs_review</code></td><td>Nominal/status callback bermasalah dan perlu pemeriksaan staf keuangan.</td></tr>
                <tr><td><code>expired</code></td><td>Masa berlaku nomor pembayaran habis.</td></tr>
                <tr><td><code>cancelled</code></td><td>Dibatalkan oleh SIAKAD/admin sebelum dibayar.</td></tr>
                <tr><td><code>failed</code></td><td>Pembayaran dinyatakan gagal.</td></tr>
                <tr><td><code>rejected</code></td><td>Transaksi ditolak oleh staf keuangan.</td></tr>
              </tbody>
            </VTable>

            <VAlert
              type="info"
              variant="tonal"
              density="compact"
            >
              Gunakan kombinasi <code>status === 'success'</code> dan <code>transferred === true</code> jika SIAKAD perlu memastikan pembayaran sudah masuk ke ledger resmi SIMKEU. Timestamp terkait tersedia pada <code>paid_at</code> dan <code>posted_at</code>.
            </VAlert>

            <VDivider class="my-8" />

            <h3 class="text-h5 mb-2">
              Kode HTTP API SIAKAD
            </h3>
            <p class="mb-4">
              Selalu periksa HTTP status dan body JSON. Kesalahan validasi memakai properti <code>message</code> dan <code>errors</code> sesuai format Laravel.
            </p>

            <VTable>
              <thead>
                <tr>
                  <th>HTTP</th>
                  <th>Kondisi</th>
                  <th>Tindakan SIAKAD</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><code>200</code></td><td>Request berhasil, termasuk replay idempoten dan pembatalan ulang.</td><td>Gunakan nilai terbaru pada <code>data</code>.</td></tr>
                <tr><td><code>201</code></td><td>Payment order baru berhasil dibuat.</td><td>Simpan seluruh data order dan tampilkan nomor pembayaran.</td></tr>
                <tr><td><code>401</code></td><td>Header API key tidak ada atau tidak valid.</td><td>Periksa secret server; jangan melakukan retry tanpa memperbaiki key.</td></tr>
                <tr><td><code>404</code></td><td><code>request_id</code> payment order tidak ditemukan.</td><td>Periksa ID yang disimpan SIAKAD.</td></tr>
                <tr><td><code>422</code></td><td>Payload tidak valid, order aktif masih ada, konflik idempotensi, atau status tidak dapat dibatalkan.</td><td>Tampilkan pesan dari <code>errors</code> dan koreksi request.</td></tr>
                <tr><td><code>500</code></td><td>API key belum dikonfigurasi atau terjadi kesalahan server.</td><td>Hubungi admin SIMKEU dan simpan request untuk penelusuran.</td></tr>
                <tr><td><code>503</code></td><td>Integrasi BSI sedang dinonaktifkan.</td><td>Hentikan retry cepat dan tampilkan layanan belum tersedia.</td></tr>
              </tbody>
            </VTable>

            <VAlert
              type="warning"
              variant="tonal"
              class="mt-4"
            >
              Jika respons create order timeout/tidak diterima, kirim ulang <code>request_id</code> dan payload yang sama. Jangan membuat <code>request_id</code> baru sebelum hasil order lama dipastikan agar tidak menimbulkan transaksi ganda.
            </VAlert>
          </VCardText>
        </VCard>
      </VWindowItem>
    </VWindow>

    <VDialog
      v-model="paymentMethodDialog"
      max-width="620"
      :persistent="paymentMethodSaving"
    >
      <VCard title="Edit Metode Pembayaran">
        <DialogCloseBtn
          :disabled="paymentMethodSaving"
          @click="paymentMethodDialog = false"
        />
        <VCardText>
          <VTextField
            v-model="paymentMethodForm.nama"
            label="Nama"
            maxlength="255"
            counter
          />
          <VTextarea
            v-model="paymentMethodForm.keterangan"
            label="Keterangan"
            rows="3"
            maxlength="1000"
            counter
          />
          <VSwitch
            v-model="paymentMethodForm.aktif"
            color="success"
            label="Metode aktif"
            hide-details
          />
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn
            variant="outlined"
            color="secondary"
            :disabled="paymentMethodSaving"
            @click="paymentMethodDialog = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="primary"
            :loading="paymentMethodSaving"
            @click="savePaymentMethod"
          >
            Simpan
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog
      v-model="deleteTestPaymentDialog"
      max-width="560"
      :persistent="Boolean(testPaymentDeletingId)"
    >
      <VCard title="Hapus Transaksi Mode Uji?">
        <VCardText>
          <VAlert
            type="warning"
            variant="tonal"
            class="mb-4"
          >
            Tindakan ini hanya menghapus payment order dan detail transaksi uji BSI.
          </VAlert>

          <div v-if="selectedTestPayment">
            <div class="font-weight-medium">
              {{ selectedTestPayment.nama_mahasiswa || selectedTestPayment.nim }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{ selectedTestPayment.bsi_payment_number || selectedTestPayment.va_number }} · {{ rupiah(selectedTestPayment.total) }}
            </div>
          </div>
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn
            variant="text"
            :disabled="Boolean(testPaymentDeletingId)"
            @click="closeDeleteTestPaymentDialog"
          >
            Batal
          </VBtn>
          <VBtn
            color="error"
            prepend-icon="ri-delete-bin-line"
            :loading="Boolean(testPaymentDeletingId)"
            @click="deleteTestPayment"
          >
            Hapus Data Uji
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog
      v-model="logDetailDialog"
      max-width="1000"
      scrollable
    >
      <VCard title="Detail Log Messaging H2H">
        <VCardText v-if="selectedMessagingLog">
          <VRow class="mb-4">
            <VCol
              cols="12"
              md="4"
            >
              <div class="text-caption text-medium-emphasis">
                Event / Waktu
              </div>
              <div class="font-weight-medium text-uppercase">
                {{ selectedMessagingLog.operation }}
              </div>
              <div>{{ formatDateTime(selectedMessagingLog.requested_at) }}</div>
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <div class="text-caption text-medium-emphasis">
                Respons
              </div>
              <div class="font-weight-medium">
                {{ selectedMessagingLog.response_code || selectedMessagingLog.http_status || '-' }}
                — {{ messagingLogMessage(selectedMessagingLog) }}
              </div>
              <div>{{ selectedMessagingLog.duration_ms }} ms</div>
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <div class="text-caption text-medium-emphasis">
                Customer / External ID
              </div>
              <div class="font-weight-medium font-monospace">
                {{ messagingLogCustomerNo(selectedMessagingLog) }}
              </div>
              <div class="font-monospace">
                {{ selectedMessagingLog.external_id || '-' }}
              </div>
            </VCol>
          </VRow>

          <VAlert
            v-if="selectedMessagingLog.response_code === '4017300'"
            type="warning"
            variant="tonal"
            class="mb-5"
          >
            Auth ditolak karena <code>X-CLIENT-KEY</code> dari BSI tidak sama dengan Client ID aktif.
            Gunakan Client ID dan Client Secret SIMKEU yang sama pada seluruh skenario flagging BSI.
          </VAlert>

          <h4 class="text-subtitle-1 mb-2">
            Request Headers
          </h4>
          <div class="code-block mb-5">
            <pre>{{ formatJson(selectedMessagingLog.request_headers) }}</pre>
          </div>

          <h4 class="text-subtitle-1 mb-2">
            Request Body
          </h4>
          <div class="code-block mb-5">
            <pre>{{ formatJson(selectedMessagingLog.request_payload) }}</pre>
          </div>

          <h4 class="text-subtitle-1 mb-2">
            Response Body
          </h4>
          <div class="code-block">
            <pre>{{ formatJson(selectedMessagingLog.response_payload) }}</pre>
          </div>
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn @click="logDetailDialog = false">
            Tutup
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog
      v-model="apiKeyDialog"
      max-width="720"
      persistent
    >
      <VCard title="API Key SIAKAD Berhasil Dibuat">
        <VCardText>
          <VAlert
            type="warning"
            variant="tonal"
            class="mb-4"
          >
            Salin key ini sekarang. Setelah dialog ditutup, key lengkap tidak dapat ditampilkan lagi.
          </VAlert>
          <VTextField
            :model-value="generatedApiKey"
            readonly
            append-inner-icon="ri-file-copy-line"
            @click:append-inner="copyText(generatedApiKey, 'API key')"
          />
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn
            color="primary"
            @click="closeApiKeyDialog"
          >
            Sudah Disalin
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog
      v-model="credentialDialog"
      max-width="760"
      persistent
    >
      <VCard :title="credentialDialogTitle">
        <VCardText>
          <VAlert
            type="info"
            variant="tonal"
            class="mb-4"
          >
            Salin seluruh nilai berikut ke portal SmartBilling BSI. Nilainya juga tersimpan terenkripsi dan dapat disalin kembali dari menu Kredensial Host-to-Host.
          </VAlert>
          <VTextField
            v-for="credential in generatedCredentials"
            :key="credential.label"
            :model-value="credential.value"
            :label="credential.label"
            readonly
            append-inner-icon="ri-file-copy-line"
            @click:append-inner="copyText(credential.value, credential.label)"
          />
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn
            color="primary"
            @click="closeCredentialDialog"
          >
            Sudah Disalin
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.code-block {
  position: relative;
  overflow-x: auto;
  padding: 18px;
  border: 1px solid rgba(148, 163, 184, 32%);
  border-radius: 8px;
  background: #111827;
  color: #e5e7eb;
}

.code-block pre {
  margin: 0;
  color: inherit;
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 0.84rem;
  white-space: pre-wrap;
}

.copy-btn {
  position: absolute;
  z-index: 1;
  inset-block-start: 8px;
  inset-inline-end: 8px;
}

.admin-panel-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-stat-card {
  min-block-size: 130px;
}

.summary-stat-card :deep(.v-card-text) {
  display: flex;
  align-items: center;
  block-size: 100%;
}

.summary-stat-card :deep(.v-card-text > div) {
  inline-size: 100%;
}
</style>
