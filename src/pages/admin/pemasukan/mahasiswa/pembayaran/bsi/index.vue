<script setup>
const page = ref(1)
const itemsPerPage = ref(10)
const search = ref('')
const selectedStatus = ref('all')
const dataTable = ref([])
const totalItems = ref(0)
const loading = ref(false)
const initialLoading = ref(true)

const detailDialog = ref(false)
const selectedPayment = ref(null)
const detailLoading = ref(false)

const actionLoading = ref(false)
const reconciliationStatsLoading = ref(false)
const reconciliationStats = ref(null)
const reconciliationDateStart = ref('')
const reconciliationDateEnd = ref('')
const router = useRouter()

const rejectDialog = ref(false)
const rejectTarget = ref(null)
const rejectionReason = ref('')

const userData = useCookie('userData').value ?? {}
const currentRole = computed(() => String(userData?.role?.name ?? '').toLowerCase())
const canProcess = computed(() => ['admin', 'keuangan'].includes(currentRole.value))

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

const headers = [
  { title: 'No', key: 'row_number', sortable: false, width: 70 },
  { title: 'Transaksi', key: 'transaction', sortable: false },
  { title: 'Mahasiswa', key: 'student', sortable: false },
  { title: 'Virtual Account', key: 'va_number', sortable: false },
  { title: 'Total', key: 'total', sortable: false, align: 'end' },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Sinkronisasi', key: 'transferred', sortable: false },
  { title: 'Waktu', key: 'created_at', sortable: false },
  { title: 'Aksi', key: 'actions', sortable: false, align: 'center' },
]

const statusMeta = {
  pending: { label: 'Menunggu', color: 'warning' },
  paid: { label: 'Dibayar', color: 'success' },
  'needs_review': { label: 'Perlu Ditinjau', color: 'error' },
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
  if (!value)
    return '-'

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

const fetchData = async () => {
  loading.value = true

  try {
    const response = await $api('/admin/pemasukan/mahasiswa/pembayaran-bsi', {
      method: 'GET',
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        search: search.value,
        status: selectedStatus.value,
      },
    })

    dataTable.value = response.data.data
    totalItems.value = response.data.total
  } catch (error) {
    showSnackbar({
      text: errorMessage(error),
      color: 'error',
    })
  } finally {
    loading.value = false
    initialLoading.value = false
  }
}

const fetchReconciliationStats = async () => {
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

const refreshAll = () => Promise.all([fetchData(), fetchReconciliationStats()])

const loadItems = ({ page: nextPage, itemsPerPage: nextItemsPerPage }) => {
  page.value = nextPage
  itemsPerPage.value = nextItemsPerPage
  fetchData()
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
    await fetchData()
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

watch([search, selectedStatus], () => {
  page.value = 1
})

onMounted(() => {
  document.title = 'Pembayaran VA BSI - SIMKEU'
  refreshAll()
})
</script>

<template>
  <VCard class="mb-4">
    <VCardText>
      <VRow align="center">
        <VCol
          cols="12"
          md="4"
        >
          <div class="text-h6">
            Statistik Rekonsiliasi
          </div>
          <div class="text-caption text-medium-emphasis">
            Filter berdasarkan waktu rekonsiliasi BSI.
          </div>
        </VCol>
        <VCol
          cols="12"
          md="3"
        >
          <VTextField
            v-model="reconciliationDateStart"
            type="date"
            label="Tanggal mulai"
            density="compact"
            hide-details
          />
        </VCol>
        <VCol
          cols="12"
          md="3"
        >
          <VTextField
            v-model="reconciliationDateEnd"
            type="date"
            label="Tanggal akhir"
            density="compact"
            hide-details
          />
        </VCol>
        <VCol
          cols="12"
          md="2"
        >
          <VBtn
            block
            variant="tonal"
            :loading="reconciliationStatsLoading"
            @click="fetchReconciliationStats"
          >
            Terapkan
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

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
              {{ formatCurrency(reconciliationStats?.[card.key]?.amount || 0) }}
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <VCard>
    <VCardItem class="pb-4">
      <div class="d-flex flex-wrap align-center gap-3">
        <div>
          <VCardTitle>Pembayaran VA BSI</VCardTitle>
          <VCardSubtitle>
            Monitoring payment order, transaksi BI-SNAP, dan rekonsiliasi BSI.
          </VCardSubtitle>
        </div>

        <VSpacer />

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

    <VCardText>
      <VRow>
        <VCol
          cols="12"
          md="8"
        >
          <VTextField
            v-model="search"
            label="Cari nomor, NIM, nama, VA, atau referensi bank"
            prepend-inner-icon="ri-search-line"
            clearable
            density="compact"
            @keyup.enter="fetchData"
            @click:clear="fetchData"
          />
        </VCol>

        <VCol
          cols="12"
          md="4"
        >
          <VSelect
            v-model="selectedStatus"
            :items="statusOptions"
            label="Status"
            density="compact"
            @update:model-value="fetchData"
          />
        </VCol>
      </VRow>
    </VCardText>

    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :headers="headers"
      :items="dataTable"
      :items-length="totalItems"
      :loading="loading"
      @update:options="loadItems"
    >
      <template
        v-if="initialLoading"
        #loading
      >
        <div class="text-center pa-6">
          <VProgressCircular
            indeterminate
            color="primary"
            class="mb-3"
          />
          <div>Memuat transaksi VA BSI...</div>
        </div>
      </template>

      <template #no-data>
        <div class="text-center pa-6">
          Tidak ada transaksi VA BSI.
        </div>
      </template>

      <template #item.row_number="{ index }">
        {{ itemsPerPage * (page - 1) + index + 1 }}
      </template>

      <template #item.transaction="{ item }">
        <div class="py-3">
          <div class="font-weight-medium">
            {{ item.nomor }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ item.request_id }}
          </div>
          <div
            v-if="item.bank_reference"
            class="text-caption"
          >
            Ref: {{ item.bank_reference }}
          </div>
        </div>
      </template>

      <template #item.student="{ item }">
        <div>
          <div class="font-weight-medium">
            {{ item.nim }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ item.nama_mahasiswa || '-' }}
          </div>
        </div>
      </template>

      <template #item.va_number="{ item }">
        <span class="font-weight-medium">{{ item.va_number }}</span>
      </template>

      <template #item.total="{ item }">
        <span class="font-weight-bold">{{ formatCurrency(item.total) }}</span>
      </template>

      <template #item.status="{ item }">
        <VChip
          :color="getStatusMeta(item.status).color"
          size="small"
          label
        >
          {{ getStatusMeta(item.status).label }}
        </VChip>
      </template>

      <template #item.transferred="{ item }">
        <VChip
          :color="item.transferred ? 'success' : 'warning'"
          size="small"
          label
        >
          {{ item.transferred ? 'Sudah' : 'Belum' }}
        </VChip>
      </template>

      <template #item.created_at="{ item }">
        <div class="text-caption">
          Dibuat: {{ formatDateTime(item.created_at) }}
        </div>
        <div
          v-if="item.paid_at"
          class="text-caption text-success"
        >
          Dibayar: {{ formatDateTime(item.paid_at) }}
        </div>
        <div
          v-else
          class="text-caption text-medium-emphasis"
        >
          Exp: {{ formatDateTime(item.expired_at) }}
        </div>
      </template>

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
            <div>{{ selectedPayment.va_number }}</div>
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
            >
              {{ selectedPayment.production ? 'PRODUCTION' : 'SANDBOX' }}
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
