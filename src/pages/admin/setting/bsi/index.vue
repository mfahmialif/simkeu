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
const responseCodeTab = ref('auth')
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
  paymentExpiryMinutes: 1440,
  timestampTolerance: 300,
  allowedIpsText: '',
  enforceIpAllowlist: false,
  verifySignatures: true,
  logPayloads: true,
  serveTestVa: false,
  databaseFailureMode: 'none',
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
    paymentExpiryMinutes: Number(data.payment_expiry_minutes || 1440),
    timestampTolerance: Number(data.timestamp_tolerance ?? 300),
    allowedIpsText: (data.allowed_ips || []).join('\n'),
    enforceIpAllowlist: Boolean(data.enforce_ip_allowlist),
    verifySignatures: data.verify_signatures !== false,
    logPayloads: data.log_payloads !== false,
    serveTestVa: Boolean(data.serve_test_va),
    databaseFailureMode: data.database_failure_mode || 'none',
  })
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
        'payment_expiry_minutes': Number(form.paymentExpiryMinutes),
        'timestamp_tolerance': Number(form.timestampTolerance),
        'allowed_ips': allowedIps,
        'enforce_ip_allowlist': form.enforceIpAllowlist,
        'verify_signatures': form.verifySignatures,
        'log_payloads': form.logPayloads,
        'serve_test_va': form.serveTestVa,
        'database_failure_mode': form.databaseFailureMode,
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

const billsEndpoint = computed(() => endpoints.value.siakad_bills || '/api/v1/integrations/siakad/bsi/bills/{nim}')
const ordersEndpoint = computed(() => endpoints.value.siakad_payment_orders || '/api/v1/integrations/siakad/bsi/payment-orders')

const createOrderBody = `{
  "request_id": "SIAKAD-20260808-000001",
  "nim": "20240001",
  "items": [
    { "tagihan_id": 10, "jumlah": 250000 },
    { "tagihan_id": 12, "jumlah": 100000 }
  ]
}`

const curlBills = computed(() => `curl --request GET \\
  --url '${billsEndpoint.value.replace('{nim}', '20240001')}' \\
  --header 'Accept: application/json' \\
  --header 'X-SIAKAD-API-KEY: GANTI_DENGAN_API_KEY'`)

const curlCreate = computed(() => `curl --request POST \\
  --url '${ordersEndpoint.value}' \\
  --header 'Accept: application/json' \\
  --header 'Content-Type: application/json' \\
  --header 'X-SIAKAD-API-KEY: GANTI_DENGAN_API_KEY' \\
  --data '${createOrderBody.replaceAll("'", "'\\''")}'`)

const curlStatus = computed(() => `curl --request GET \\
  --url '${ordersEndpoint.value}/SIAKAD-20260808-000001' \\
  --header 'Accept: application/json' \\
  --header 'X-SIAKAD-API-KEY: GANTI_DENGAN_API_KEY'`)

const curlCancel = computed(() => `curl --request POST \\
  --url '${ordersEndpoint.value}/SIAKAD-20260808-000001/cancel' \\
  --header 'Accept: application/json' \\
  --header 'X-SIAKAD-API-KEY: GANTI_DENGAN_API_KEY'`)

/* eslint-disable case-police/string-check */
const phpExample = computed(() => `<?php
$response = Http::withHeaders([
    'X-SIAKAD-API-KEY' => env('SIMKEU_BSI_API_KEY'),
    'Accept' => 'application/json',
])->post('${ordersEndpoint.value}', [
    'request_id' => 'SIAKAD-20260808-000001',
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
    request_id: 'SIAKAD-20260808-000001',
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
          value="docs"
          prepend-icon="ri-code-box-line"
        >
          Docs API
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
                      kode BPI ({{ form.kodeBpi || '0000' }}) + customer number maksimal 12 digit
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
                      900 + kode BPI + customer number, maksimal 19 digit
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
                    md="3"
                  >
                    <VTextField
                      v-model.number="form.paymentExpiryMinutes"
                      type="number"
                      label="Expiry (menit)"
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

      <VWindowItem value="simulation">
        <VCard>
          <VCardItem>
            <VCardTitle>Simulasi Pembayaran BSI</VCardTitle>
            <VCardSubtitle>
              Cari mahasiswa, pilih tagihan, lalu tentukan nominal pembayaran maksimal sebesar sisa yang tersedia.
            </VCardSubtitle>
          </VCardItem>

          <VCardText>
            <VAlert
              type="info"
              variant="tonal"
              class="mb-6"
            >
              Simulasi ini membuat payment order BSI berstatus <code>pending</code>. Pembayaran baru masuk ledger setelah endpoint Payment dipanggil BSI.
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
                    <strong>Total:</strong> {{ rupiah(simulationResult.total) }}
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
                      Nominal
                    </th>
                    <th>Status</th>
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
                      {{ rupiah(payment.total) }}
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
                  </tr>
                </tbody>
              </VTable>
            </VCard>
          </VCardText>
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
                  API key dipakai SIAKAD pada header <code>X-SIAKAD-API-KEY</code>.
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
                  v-for="(url, name) in endpoints"
                  :key="name"
                  :title="name.replaceAll('_', ' ').toUpperCase()"
                  :subtitle="url"
                >
                  <template #append>
                    <IconBtn
                      size="small"
                      @click="copyText(url, `URL ${name}`)"
                    >
                      <VIcon icon="ri-file-copy-line" />
                    </IconBtn>
                  </template>
                </VListItem>
              </VList>
            </VCard>
          </VCol>
        </VRow>

        <VCard>
          <VCardText>
            <VAlert
              type="info"
              variant="tonal"
              class="mb-6"
            >
              SIAKAD bertanggung jawab atas login mahasiswa dan UI pemilihan tagihan. Semua request server-to-server wajib menyertakan <code>X-SIAKAD-API-KEY</code>.
            </VAlert>

            <h3 class="text-h5 mb-3">
              1. Ambil Tagihan Mahasiswa
            </h3>
            <p class="mb-3">
              <code>GET {{ billsEndpoint }}</code>
            </p>
            <div class="code-block mb-6">
              <IconBtn
                class="copy-btn"
                @click="copyText(curlBills, 'Contoh curl')"
              >
                <VIcon icon="ri-file-copy-line" />
              </IconBtn><pre>{{ curlBills }}</pre>
            </div>

            <h3 class="text-h5 mb-3">
              2. Buat Payment Order
            </h3>
            <p class="mb-3">
              <code>POST {{ ordersEndpoint }}</code>
            </p>
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

            <h3 class="text-h5 mb-3">
              3. Cek Status Payment Order
            </h3>
            <p class="mb-3">
              <code>GET {{ ordersEndpoint }}/{request_id}</code>
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
              4. Batalkan Payment Order
            </h3>
            <p class="mb-3">
              Hanya payment order berstatus <code>pending</code> yang dapat dibatalkan.
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
              5. Contoh Integrasi Laravel/PHP
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
              6. Contoh Integrasi JavaScript
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
              Status Payment Order
            </h3>
            <VTable density="compact">
              <thead><tr><th>Status</th><th>Arti</th></tr></thead>
              <tbody>
                <tr><td><code>pending</code></td><td>Menunggu pembayaran mahasiswa.</td></tr>
                <tr><td><code>success</code></td><td>Pembayaran BSI telah diposting ke ledger SIMKEU.</td></tr>
                <tr><td><code>expired</code></td><td>Masa berlaku nomor pembayaran habis.</td></tr>
                <tr><td><code>cancelled</code></td><td>Dibatalkan oleh SIAKAD/admin sebelum dibayar.</td></tr>
                <tr><td><code>needs_review</code></td><td>Memerlukan pemeriksaan staf keuangan.</td></tr>
              </tbody>
            </VTable>

            <VDivider class="my-8" />

            <h3 class="text-h5 mb-2">
              Kode Respons BI-SNAP v3.5
            </h3>
            <p class="mb-4">
              Daftar berikut mengikuti tabel Auth, Inquiry, dan Payment pada Specification Host to Host BI-SNAP Smart Billing BPI v3.5.
            </p>

            <VTabs v-model="responseCodeTab">
              <VTab value="auth">
                Auth
              </VTab>
              <VTab value="inquiry">
                Inquiry
              </VTab>
              <VTab value="payment">
                Payment & Advice
              </VTab>
            </VTabs>

            <VTable class="mt-4">
              <thead>
                <tr>
                  <th>HTTP</th>
                  <th>Kode Respons</th>
                  <th>Pesan</th>
                  <th>Kondisi</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in settingsData?.response_codes?.[responseCodeTab] || []"
                  :key="`${responseCodeTab}-${item.code}`"
                >
                  <td>{{ item.http_status }}</td>
                  <td><code>{{ item.code }}</code></td>
                  <td>{{ item.message }}</td>
                  <td>{{ item.description }}</td>
                </tr>
              </tbody>
            </VTable>

            <VAlert
              type="warning"
              variant="tonal"
              class="mt-4"
            >
              Kode timeout adalah hasil batas waktu layanan/SmartBilling. Untuk Payment, timeout dapat membuat dana ditangguhkan sehingga pengecekan Advice dan rekonsiliasi wajib tersedia.
            </VAlert>
          </VCardText>
        </VCard>
      </VWindowItem>
    </VWindow>

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
            type="warning"
            variant="tonal"
            class="mb-4"
          >
            Salin seluruh nilai berikut ke portal SmartBilling BSI sekarang. Secret lengkap tidak akan dikirim kembali setelah dialog ditutup.
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
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  background: rgb(var(--v-theme-surface-variant));
}

.code-block pre {
  margin: 0;
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
