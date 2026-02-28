<script setup>
import { showSnackbar } from '@/composables/snackbar'

const page = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref({ key: 'tanggal', order: 'desc' })
const search = ref("")
const selectedRows = ref([])
const dataTable = ref([])
const totalItems = ref(0)
const loading = ref(true)
const initialLoading = ref(true)

// Summary
const summary = ref({
  total_pemasukan: 0,
  total_pengeluaran: 0,
  selisih: 0,
  total_saldo: 0,
  jumlah_catatan: 0,
  catatan_hari_ini: 0,
})

const fetchSummary = async () => {
  try {
    const response = await $api('/admin/saldo/catatan-harian/summary')
    if (response.status) {
      summary.value = response.data
    }
  } catch (e) {
    console.error(e)
  }
}

// Filter
const filterTipe = ref(null)
const filterSaldoId = ref(null)
const saldoList = ref([])

const tipeList = [
  { title: 'Pemasukan', value: 'pemasukan' },
  { title: 'Pengeluaran', value: 'pengeluaran' },
]

const toIDR = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n)

const summaryCards = computed(() => [
  {
    title: 'Total Saldo',
    value: toIDR(summary.value.total_saldo),
    icon: 'ri-wallet-3-line',
    color: 'primary',
  },
  {
    title: 'Total Pemasukan',
    value: toIDR(summary.value.total_pemasukan),
    icon: 'ri-arrow-down-circle-line',
    color: 'success',
  },
  {
    title: 'Total Pengeluaran',
    value: toIDR(summary.value.total_pengeluaran),
    icon: 'ri-arrow-up-circle-line',
    color: 'error',
  },
  {
    title: 'Catatan Hari Ini',
    value: summary.value.catatan_hari_ini + ' Transaksi',
    icon: 'ri-calendar-check-line',
    color: 'info',
  },
])

const fetchSaldoList = async () => {
  try {
    const { data } = await $api('/admin/saldo/kategori', {
      method: 'GET',
      body: { limit: 0, sort_key: 'nama', sort_order: 'asc' },
    })
    saldoList.value = (data.data || []).map(i => ({
      title: `${i.kode} - ${i.nama}`,
      value: i.id,
    }))
  } catch (e) {
    console.error(e)
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      page: page.value,
      limit: itemsPerPage.value,
      sort_key: sortBy.value.key,
      sort_order: sortBy.value.order,
      search: search.value,
    }
    if (filterTipe.value) params.tipe = filterTipe.value
    if (filterSaldoId.value) params.saldo_id = filterSaldoId.value

    const { data } = await $api('/admin/saldo/catatan-harian', {
      method: "GET",
      body: params,
    })

    dataTable.value = data.data
    totalItems.value = data.total
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
    if (initialLoading.value) initialLoading.value = false
  }
}

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb }) => {
  loading.value = true
  page.value = p
  itemsPerPage.value = ipp
  if (sb.length) sortBy.value = sb[0]
  fetchData()
}

watch([filterTipe, filterSaldoId], () => {
  page.value = 1
  fetchData()
})

const isDialogDeleteVisible = ref(false)
const deleteData = ref({})

const showDialogDelete = (id, keterangan) => {
  deleteData.value = { id, name: keterangan || `#${id}` }
  isDialogDeleteVisible.value = true
}

const deleteDataSubmit = async (id) => {
  try {
    const response = await $api("/admin/saldo/catatan-harian/" + id, {
      method: 'DELETE',
    })

    if (response.status === true) {
      showSnackbar({ text: response.message, color: 'success' })
      fetchData()
      fetchSummary()
    } else {
      showSnackbar({ text: response.message, color: 'error' })
    }
  } catch (err) {
    const message = Array.isArray(err.data?.message)
      ? err.data.message.join('; ')
      : err.data?.message || 'Terjadi kesalahan.'
    showSnackbar({ text: message, color: 'error' })
  } finally {
    isDialogDeleteVisible.value = false
  }
}

onMounted(() => {
  document.title = 'Catatan Harian - SIMKEU'
  fetchSaldoList()
  fetchSummary()
})
</script>

<template>
  <div>
    <!-- Summary Cards -->
    <VRow class="mb-2">
      <VCol
        v-for="(card, idx) in summaryCards"
        :key="idx"
        cols="12"
        sm="6"
        md="3"
      >
        <VCard>
          <VCardText class="d-flex align-center gap-4">
            <VAvatar
              :color="card.color"
              variant="tonal"
              size="48"
              rounded
            >
              <VIcon :icon="card.icon" size="28" />
            </VAvatar>
            <div>
              <div class="text-body-2 text-medium-emphasis mb-1">{{ card.title }}</div>
              <h5 class="text-h5 font-weight-bold">{{ card.value }}</h5>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Catatan Harian</VCardTitle>
      </VCardItem>

      <VDivider />

      <VCardText class="d-flex flex-wrap gap-4">
        <div class="d-flex align-center gap-3 flex-wrap">
          <VTextField
            v-model="search"
            placeholder="Cari..."
            style="inline-size: 200px;"
            density="compact"
          />
          <VSelect
            v-model="filterTipe"
            :items="tipeList"
            label="Tipe"
            placeholder="Semua"
            clearable
            density="compact"
            hide-details
            style="inline-size: 180px;"
          />
          <VSelect
            v-model="filterSaldoId"
            :items="saldoList"
            label="Kategori Saldo"
            placeholder="Semua"
            clearable
            density="compact"
            hide-details
            style="inline-size: 220px;"
          />
        </div>

        <VSpacer />

        <div class="d-flex gap-x-4 align-center">
          <VBtn
            color="primary"
            prepend-icon="ri-add-line"
            @click="$router.push('/admin/saldo/catatan-harian/add')"
          >
            Tambah Data
          </VBtn>
        </div>
      </VCardText>

      <VDataTableServer
        :headers="[
          { title: 'No', key: 'id', width: '60px' },
          { title: 'Tanggal', key: 'tanggal' },
          { title: 'Kategori Saldo', key: 'saldo.nama' },
          { title: 'Tipe', key: 'tipe' },
          { title: 'Jumlah', key: 'jumlah' },
          { title: 'Keterangan', key: 'keterangan' },
          { title: 'Actions', key: 'actions', sortable: false },
        ]"
        v-model:model-value="selectedRows"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :items="dataTable"
        :items-length="totalItems"
        :loading="loading"
        :search="search"
        item-value="id"
        @update:options="loadItems"
      >
        <template v-if="initialLoading" #loading>
          <div class="text-center pa-4">
            <VProgressCircular indeterminate color="primary" class="mb-2" />
            <div>Memuat data...</div>
          </div>
        </template>

        <template v-else #no-data>
          <div class="text-center pa-4">Tidak ada data.</div>
        </template>

        <template #item.id="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </template>

        <template #item.tipe="{ item }">
          <VChip
            :color="item.tipe === 'pemasukan' ? 'success' : 'error'"
            size="small"
            label
          >
            {{ item.tipe === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran' }}
          </VChip>
        </template>

        <template #item.jumlah="{ item }">
          <span :class="item.tipe === 'pemasukan' ? 'text-success' : 'text-error'">
            {{ item.tipe === 'pemasukan' ? '+' : '-' }}{{ toIDR(item.jumlah) }}
          </span>
        </template>

        <template #item.saldo.nama="{ item }">
          {{ item.saldo?.nama || '-' }}
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn size="small">
            <VIcon icon="ri-more-2-fill" />

            <VMenu activator="parent">
              <VList>
                <VListItem
                  value="edit"
                  prepend-icon="ri-edit-box-line"
                  @click="$router.push(`/admin/saldo/catatan-harian/edit/${item.id}`)"
                >
                  Edit
                </VListItem>

                <VListItem
                  value="delete"
                  prepend-icon="ri-delete-bin-line"
                  @click="showDialogDelete(item.id, item.keterangan)"
                >
                  Delete
                </VListItem>
              </VList>
            </VMenu>
          </IconBtn>
        </template>
      </VDataTableServer>
    </VCard>

    <VDialog v-model="isDialogDeleteVisible" width="500">
      <VCard :title="'Hapus Data: ' + deleteData.name">
        <DialogCloseBtn variant="text" size="default" @click="isDialogDeleteVisible = false" />

        <VCardText class="d-flex align-center">
          <VIcon icon="ri-alert-line" size="32" class="me-2" />
          <span>
            Anda yakin ingin menghapus data ini? Penghapusan data tidak dapat
            dibatalkan.
          </span>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn variant="outlined" color="secondary" @click="isDialogDeleteVisible = false">
            Batal
          </VBtn>
          <VBtn color="error" @click="deleteDataSubmit(deleteData.id)">
            <VIcon icon="ri-delete-bin-line" class="me-1" />
            Hapus
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
