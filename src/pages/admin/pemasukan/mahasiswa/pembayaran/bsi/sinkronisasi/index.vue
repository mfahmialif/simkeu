<script setup>
const router = useRouter()
const page = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const items = ref([])
const loading = ref(false)
const syncing = ref(false)
const search = ref('')
const dateStart = ref('')
const dateEnd = ref('')
const selectedIds = ref([])
const selectAllAcrossPages = ref(false)
const excludedIds = ref([])
const confirmDialog = ref(false)
const resultDialog = ref(false)
const syncResult = ref(null)

const headers = [
  { title: '', key: 'select', sortable: false, width: 54 },
  { title: 'Transaksi', key: 'transaction', sortable: false },
  { title: 'Mahasiswa', key: 'student', sortable: false },
  { title: 'Virtual Account', key: 'va_number', sortable: false },
  { title: 'Jumlah Detail', key: 'details', sortable: false, align: 'center' },
  { title: 'Total', key: 'total', sortable: false, align: 'end' },
  { title: 'Dibayar', key: 'paid_at', sortable: false },
]

const selectedCount = computed(() => selectAllAcrossPages.value
  ? Math.max(0, totalItems.value - excludedIds.value.length)
  : selectedIds.value.length)

const headerChecked = computed(() => totalItems.value > 0 && selectedCount.value === totalItems.value)
const headerIndeterminate = computed(() => selectedCount.value > 0 && selectedCount.value < totalItems.value)

const formatCurrency = value => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
}).format(Number(value || 0))

const formatDateTime = value => value
  ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
  : '-'

const errorMessage = error => {
  const errors = error?.data?.errors
  if (errors && typeof errors === 'object')
    return Object.values(errors).flat().join(' ')

  return error?.data?.message || error?.message || 'Terjadi kesalahan.'
}

const filters = () => ({
  ...(String(search.value || '').trim() ? { search: String(search.value).trim() } : {}),
  ...(dateStart.value ? { 'tanggal_mulai': dateStart.value } : {}),
  ...(dateEnd.value ? { 'tanggal_akhir': dateEnd.value } : {}),
})

const resetSelection = () => {
  selectedIds.value = []
  excludedIds.value = []
  selectAllAcrossPages.value = false
}

const fetchData = async () => {
  loading.value = true
  try {
    const response = await $api('/admin/pemasukan/mahasiswa/pembayaran-bsi/synchronization-candidates', {
      params: {
        page: page.value,
        limit: itemsPerPage.value,
        ...filters(),
      },
    })

    items.value = response.data?.data || []
    totalItems.value = Number(response.data?.total || 0)
  } catch (error) {
    showSnackbar({ text: errorMessage(error), color: 'error' })
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  page.value = 1
  resetSelection()
  fetchData()
}

const loadItems = ({ page: nextPage, itemsPerPage: nextItemsPerPage }) => {
  page.value = nextPage
  itemsPerPage.value = nextItemsPerPage
  fetchData()
}

const isSelected = id => selectAllAcrossPages.value
  ? !excludedIds.value.includes(id)
  : selectedIds.value.includes(id)

const toggleItem = (id, checked) => {
  if (selectAllAcrossPages.value) {
    excludedIds.value = checked
      ? excludedIds.value.filter(value => value !== id)
      : [...new Set([...excludedIds.value, id])]
  } else {
    selectedIds.value = checked
      ? [...new Set([...selectedIds.value, id])]
      : selectedIds.value.filter(value => value !== id)
  }
}

const toggleAll = checked => {
  selectAllAcrossPages.value = Boolean(checked)
  selectedIds.value = []
  excludedIds.value = []
}

const synchronize = async () => {
  syncing.value = true
  try {
    const response = await $api('/admin/pemasukan/mahasiswa/pembayaran-bsi/synchronize', {
      method: 'POST',
      body: selectAllAcrossPages.value
        ? {
          mode: 'all',
          filters: filters(),
          'excluded_ids': excludedIds.value,
        }
        : {
          mode: 'ids',
          ids: selectedIds.value,
        },
    })

    syncResult.value = response.data
    confirmDialog.value = false
    resultDialog.value = true
    showSnackbar({
      text: response.message,
      color: response.data?.failed_count ? 'warning' : 'success',
    })
    resetSelection()
    await fetchData()
  } catch (error) {
    showSnackbar({ text: errorMessage(error), color: 'error' })
  } finally {
    syncing.value = false
  }
}

onMounted(() => {
  document.title = 'Sinkronisasi Pembayaran BSI - SIMKEU'
  fetchData()
})
</script>

<template>
  <div class="d-flex flex-wrap align-center gap-3 mb-5">
    <VBtn
      variant="text"
      prepend-icon="ri-arrow-left-line"
      @click="router.push('/admin/pemasukan/mahasiswa/pembayaran/bsi')"
    >
      Kembali
    </VBtn>
    <div>
      <h1 class="text-h4">
        Sinkronisasi Pembayaran BSI
      </h1>
      <div class="text-body-2 text-medium-emphasis">
        Transaksi production berstatus success yang belum masuk pembukuan.
      </div>
    </div>
  </div>

  <VAlert
    type="info"
    variant="tonal"
    class="mb-5"
  >
    Checkbox pada kepala tabel memilih seluruh transaksi yang sesuai filter, termasuk data di halaman lain.
  </VAlert>

  <VCard>
    <VCardText>
      <VRow align="center">
        <VCol
          cols="12"
          md="5"
        >
          <VTextField
            v-model="search"
            label="Cari nomor, NIM, nama, VA, atau referensi"
            prepend-inner-icon="ri-search-line"
            clearable
            density="compact"
            hide-details
            @keyup.enter="applyFilters"
          />
        </VCol>
        <VCol
          cols="12"
          md="2"
        >
          <VTextField
            v-model="dateStart"
            type="date"
            label="Tanggal mulai"
            density="compact"
            hide-details
          />
        </VCol>
        <VCol
          cols="12"
          md="2"
        >
          <VTextField
            v-model="dateEnd"
            type="date"
            label="Tanggal akhir"
            density="compact"
            hide-details
          />
        </VCol>
        <VCol
          cols="12"
          md="3"
          class="d-flex gap-2"
        >
          <VBtn
            variant="tonal"
            :loading="loading"
            @click="applyFilters"
          >
            Terapkan
          </VBtn>
          <VBtn
            color="primary"
            :disabled="selectedCount === 0"
            @click="confirmDialog = true"
          >
            Sinkronkan ({{ selectedCount }})
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>

    <VDivider />

    <VAlert
      v-if="selectAllAcrossPages && selectedCount"
      type="success"
      variant="tonal"
      density="compact"
      class="ma-4"
    >
      {{ selectedCount }} dari {{ totalItems }} transaksi pada seluruh halaman dipilih.
    </VAlert>

    <VDataTableServer
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="loading"
      @update:options="loadItems"
    >
      <template #header.select>
        <VCheckboxBtn
          :model-value="headerChecked"
          :indeterminate="headerIndeterminate"
          aria-label="Pilih seluruh transaksi"
          @update:model-value="toggleAll"
        />
      </template>

      <template #item.select="{ item }">
        <VCheckboxBtn
          :model-value="isSelected(item.id)"
          :aria-label="`Pilih transaksi ${item.nomor}`"
          @update:model-value="checked => toggleItem(item.id, checked)"
        />
      </template>

      <template #item.transaction="{ item }">
        <div class="py-2">
          <div class="font-weight-medium">
            {{ item.nomor }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ item.request_id }}
          </div>
        </div>
      </template>

      <template #item.student="{ item }">
        <div>{{ item.nim }}</div>
        <div class="text-caption text-medium-emphasis">
          {{ item.nama_mahasiswa || '-' }}
        </div>
      </template>

      <template #item.details="{ item }">
        {{ item.details?.length || 0 }}
      </template>

      <template #item.total="{ item }">
        <span class="font-weight-bold">{{ formatCurrency(item.total) }}</span>
      </template>

      <template #item.paid_at="{ item }">
        {{ formatDateTime(item.paid_at) }}
      </template>

      <template #no-data>
        <div class="text-center pa-8">
          Tidak ada transaksi yang menunggu sinkronisasi.
        </div>
      </template>
    </VDataTableServer>
  </VCard>

  <VDialog
    v-model="confirmDialog"
    max-width="520"
  >
    <VCard title="Konfirmasi Sinkronisasi">
      <DialogCloseBtn @click="confirmDialog = false" />
      <VCardText>
        Sinkronkan <strong>{{ selectedCount }} transaksi</strong> ke pembukuan mahasiswa?
        Proses yang sudah berhasil bersifat permanen dan tidak akan dibuat dua kali saat dicoba ulang.
      </VCardText>
      <VCardActions class="justify-end">
        <VBtn
          variant="outlined"
          color="secondary"
          :disabled="syncing"
          @click="confirmDialog = false"
        >
          Batal
        </VBtn>
        <VBtn
          color="primary"
          :loading="syncing"
          @click="synchronize"
        >
          Sinkronkan
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog
    v-model="resultDialog"
    max-width="680"
  >
    <VCard title="Hasil Sinkronisasi">
      <DialogCloseBtn @click="resultDialog = false" />
      <VCardText>
        <VRow class="mb-3">
          <VCol cols="6">
            <VAlert
              type="success"
              variant="tonal"
            >
              Berhasil: {{ syncResult?.success_count || 0 }}
            </VAlert>
          </VCol>
          <VCol cols="6">
            <VAlert
              :type="syncResult?.failed_count ? 'error' : 'success'"
              variant="tonal"
            >
              Gagal: {{ syncResult?.failed_count || 0 }}
            </VAlert>
          </VCol>
        </VRow>

        <VTable
          v-if="syncResult?.failed_count"
          density="compact"
        >
          <thead>
            <tr>
              <th>ID Transaksi</th>
              <th>Pesan</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="result in syncResult.results.filter(item => item.status === 'failed')"
              :key="result.id"
            >
              <td>{{ result.id }}</td>
              <td>{{ result.message }}</td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>
      <VCardActions class="justify-end">
        <VBtn @click="resultDialog = false">
          Tutup
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
