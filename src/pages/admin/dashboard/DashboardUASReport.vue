<script setup>
import { useDashboardFilters } from "@/composables/dashboardFilters"
import { formatCurrencyTotals, formatMoney } from "@/composables/formatRupiah"
import { showSnackbar } from "@/composables/snackbar"
import { ref, watch, onMounted, computed } from "vue"

// ===== FILTER =====
const {
  thAkademikList,
  prodiList,
  loadDashboardFilters,
} = useDashboardFilters()

const selectedThAkademik = ref(null)
const selectedProdi = ref(null)
const selectedJk = ref(null)

const jkList = [
  { title: "Laki-laki", value: 8 },
  { title: "Perempuan", value: 9 },
]

// ===== SUMMARY DATA =====
const isLoading = ref(false)

const summaryData = ref({
  total_mahasiswa_bayar: 0,
  total_amount: 0,
  total_amount_by_currency: [],
  total_lunas: 0,
  total_belum_lunas: 0,
})

const fetchSummary = async () => {
  if (!selectedThAkademik.value) return

  isLoading.value = true
  try {
    const params = {}

    params.th_akademik_id = selectedThAkademik.value
    if (selectedProdi.value) params.prodi_id = selectedProdi.value
    if (selectedJk.value) params.jk_id = selectedJk.value

    const queryString = new URLSearchParams(params).toString()
    const url = `/admin/dashboard/uas-report${queryString ? '?' + queryString : ''}`
    const response = await $api(url)

    if (response.status === false) {
      showSnackbar({ text: response.message, color: "error" })
      
      return
    }

    summaryData.value = response.data ?? {
      total_mahasiswa_bayar: 0,
      total_amount: 0,
      total_amount_by_currency: [],
      total_lunas: 0,
      total_belum_lunas: 0,
    }
  } catch (e) {
    console.error(e)
    showSnackbar({ text: "Gagal memuat data UAS", color: "error" })
  } finally {
    isLoading.value = false
  }
}

// ===== DETAIL DIALOG =====
const showDetailDialog = ref(false)
const isLoadingDetail = ref(false)
const detailData = ref([])

const detailPagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 15,
})

const searchQuery = ref("")
const currentPage = ref(1)

const fetchDetail = async () => {
  if (!selectedThAkademik.value) return

  isLoadingDetail.value = true
  try {
    const params = {}

    params.th_akademik_id = selectedThAkademik.value
    params.per_page = detailPagination.value.per_page
    params.page = currentPage.value
    if (selectedProdi.value) params.prodi_id = selectedProdi.value
    if (selectedJk.value) params.jk_id = selectedJk.value
    if (searchQuery.value) params.search = searchQuery.value

    const queryString = new URLSearchParams(params).toString()
    const url = `/admin/dashboard/uas-report-detail${queryString ? '?' + queryString : ''}`
    const response = await $api(url)

    if (!response.status) {
      showSnackbar({ text: response.message, color: "error" })
      
      return
    }

    const d = response.data

    detailData.value = d.data || []
    detailPagination.value = {
      current_page: d.current_page,
      last_page: d.last_page,
      total: d.total,
      per_page: d.per_page,
    }

    // Fetch mahasiswa detail dari siakad
    fetchMahasiswaDetail()
  } catch (e) {
    console.error(e)
    showSnackbar({ text: "Gagal memuat detail UAS", color: "error" })
  } finally {
    isLoadingDetail.value = false
  }
}

const fetchMahasiswaDetail = async () => {
  if (!detailData.value.length) return
  try {
    const nimList = detailData.value.map(item => item.nim)

    const res = await $api("/admin/mahasiswa/nim", {
      method: "GET",
      body: {
        nim: JSON.stringify(nimList),
        whereIn: true,
      },
    })

    detailData.value = detailData.value.map(item => {
      const mhs = res.find(m => m.nim === item.nim)
      
      return {
        ...item,
        mahasiswa: mhs ? mhs : false,
      }
    })
  } catch (e) {
    console.error(e)
  }
}

const openDetail = () => {
  showDetailDialog.value = true
  currentPage.value = 1
  searchQuery.value = ""
  fetchDetail()
}

let searchTimeout = null
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchDetail()
  }, 400)
})

watch(currentPage, () => fetchDetail())

// Watch filters
const filtersInitialized = ref(false)

watch([selectedThAkademik, selectedProdi, selectedJk], () => {
  if (filtersInitialized.value) {
    fetchSummary()
    if (showDetailDialog.value) {
      currentPage.value = 1
      fetchDetail()
    }
  }
})

const statCards = computed(() => [
  {
    title: "Sudah Bayar",
    value: summaryData.value.total_mahasiswa_bayar,
    icon: "ri-user-follow-line",
    color: "success",
  },
  {
    title: "Total Pembayaran",
    value: formatCurrencyTotals(
      summaryData.value.total_amount_by_currency,
      summaryData.value.total_amount,
    ),
    icon: "ri-money-dollar-circle-line",
    color: "primary",
    isAmount: true,
  },
  {
    title: "Lunas",
    value: summaryData.value.total_lunas,
    icon: "ri-checkbox-circle-line",
    color: "info",
  },
  {
    title: "Belum Lunas",
    value: summaryData.value.total_belum_lunas,
    icon: "ri-time-line",
    color: "warning",
  },
])

onMounted(async () => {
  await loadDashboardFilters()

  const aktif = thAkademikList.value.find(item => item.aktif === "Y")

  if (aktif) selectedThAkademik.value = aktif.value
  filtersInitialized.value = true
  fetchSummary()
})
</script>

<template>
  <VCard>
    <VSkeletonLoader
      v-if="isLoading && !filtersInitialized"
      type="card, list-item, paragraph"
    />
    <template v-else>
      <VCardItem>
        <template #prepend>
          <VAvatar
            color="error"
            variant="tonal"
            rounded="lg"
            class="me-2"
          >
            <VIcon
              icon="ri-file-text-line"
              size="24"
            />
          </VAvatar>
        </template>
        <VCardTitle>Laporan UAS</VCardTitle>
        <VCardSubtitle>
          Rekapitulasi pembayaran UAS mahasiswa
        </VCardSubtitle>
        <template #append>
          <VBtn
            icon
            variant="tonal"
            color="error"
            size="small"
            aria-label="Lihat detail pembayaran UAS"
            @click="openDetail"
          >
            <VIcon
              icon="ri-eye-line"
              size="18"
            />
          </VBtn>
        </template>
      </VCardItem>

      <VCardText>
        <!-- Filter -->
        <VRow class="mb-4">
          <VCol
            cols="12"
            sm="4"
          >
            <VSelect
              v-model="selectedThAkademik"
              :items="thAkademikList"
              label="Tahun Akademik"
              placeholder="Pilih"
              density="compact"
              hide-details
            />
          </VCol>
          <VCol
            cols="12"
            sm="4"
          >
            <VSelect
              v-model="selectedProdi"
              :items="prodiList"
              label="Prodi"
              placeholder="Semua"
              clearable
              density="compact"
              hide-details
            />
          </VCol>
          <VCol
            cols="12"
            sm="4"
          >
            <VSelect
              v-model="selectedJk"
              :items="jkList"
              label="Jenis Kelamin"
              placeholder="Semua"
              clearable
              density="compact"
              hide-details
            />
          </VCol>
        </VRow>

        <!-- Stats Cards -->
        <VRow>
          <VCol
            v-for="(card, index) in statCards"
            :key="index"
            cols="12"
            sm="6"
          >
            <VCard
              variant="tonal"
              :color="card.color"
              class="uas-stat-card"
            >
              <VCardText class="pa-3">
                <VSkeletonLoader
                  v-if="isLoading"
                  type="text, text"
                />
                <template v-else>
                  <div class="d-flex align-center justify-space-between gap-2 mb-1">
                    <div class="uas-stat-content d-flex align-center gap-2 min-w-0">
                      <VAvatar
                        :color="card.color"
                        variant="flat"
                        size="36"
                        rounded="lg"
                      >
                        <VIcon
                          :icon="card.icon"
                          size="20"
                          color="white"
                        />
                      </VAvatar>
                      <div class="stat-value-wrap">
                        <div class="text-subtitle-1 font-weight-bold">
                          {{ card.value }}
                        </div>
                      </div>
                    </div>
                    <VBtn
                      icon
                      size="small"
                      variant="tonal"
                      :color="card.color"
                      aria-label="Lihat detail pembayaran UAS"
                      class="uas-stat-link"
                      @click="openDetail"
                    >
                      <VIcon
                        icon="ri-arrow-right-up-line"
                        size="18"
                      />
                    </VBtn>
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    {{ card.title }}
                  </div>
                  <div class="text-caption text-disabled">
                    {{ card.isAmount ? '' : 'Mahasiswa' }}
                  </div>
                </template>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
    </template>
  </VCard>

  <!-- Detail Dialog -->
  <VDialog
    v-model="showDetailDialog"
    max-width="1080"
    scrollable
  >
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between pa-4 pb-2">
        <div class="d-flex align-center gap-2">
          <VIcon
            icon="ri-file-text-line"
            size="22"
            color="error"
          />
          <span>Detail Pembayaran UAS</span>
        </div>
        <VBtn
          icon
          variant="text"
          size="small"
          @click="showDetailDialog = false"
        >
          <VIcon icon="ri-close-line" />
        </VBtn>
      </VCardTitle>

      <VDivider />

      <VCardText class="pa-4">
        <VTextField
          v-model="searchQuery"
          label="Cari NIM"
          placeholder="Ketik untuk mencari..."
          prepend-inner-icon="ri-search-line"
          density="compact"
          hide-details
          clearable
          class="mb-4"
        />

        <VSkeletonLoader
          v-if="isLoadingDetail"
          type="table-heading, table-tbody"
        />

        <div v-else>
          <div class="text-body-2 text-disabled mb-2">
            Total: {{ detailPagination.total }} data
          </div>

          <VTable
            class="text-no-wrap"
            density="compact"
          >
            <thead>
              <tr>
                <th>No</th>
                <th>NIM</th>
                <th>Prodi</th>
                <th>Tagihan</th>
                <th>Jumlah Tagihan</th>
                <th>Total Bayar</th>
                <th>Sisa</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="detailData.length === 0">
                <td
                  colspan="8"
                  class="text-center text-disabled py-8"
                >
                  Tidak ada data
                </td>
              </tr>
              <tr
                v-for="(row, idx) in detailData"
                :key="idx"
              >
                <td>{{ (detailPagination.current_page - 1) * detailPagination.per_page + idx + 1 }}</td>
                <td>
                  <div>
                    <span class="font-weight-medium">{{ row.nim }}</span>
                  </div>
                  <div>
                    <template v-if="row.mahasiswa">
                      {{ row.mahasiswa.nama }} - {{ row.mahasiswa.prodi?.alias }} - {{ row.mahasiswa.jk?.kode }}
                    </template>
                    <template v-else-if="row.mahasiswa === false">
                      <span class="text-caption text-disabled">Data tidak ditemukan di SIAKAD</span>
                    </template>
                    <template v-else>
                      <VProgressCircular
                        indeterminate
                        color="primary"
                        size="14"
                        width="2"
                      />
                    </template>
                  </div>
                </td>
                <td><span class="text-caption">{{ row.prodi_nama }}</span></td>
                <td><span class="text-caption">{{ row.tagihan_nama }}</span></td>
                <td>{{ formatMoney(row.tagihan_amount, row.mata_uang) }}</td>
                <td>{{ formatMoney(row.total_paid, row.mata_uang) }}</td>
                <td>{{ formatMoney(row.sisa, row.mata_uang) }}</td>
                <td>
                  <VChip
                    :color="row.is_lunas ? 'success' : 'warning'"
                    size="small"
                    variant="flat"
                    label
                  >
                    {{ row.is_lunas ? 'Lunas' : 'Belum Lunas' }}
                  </VChip>
                </td>
              </tr>
            </tbody>
          </VTable>

          <div
            v-if="detailPagination.last_page > 1"
            class="d-flex align-center justify-space-between mt-4"
          >
            <span class="text-body-2 text-disabled">
              Menampilkan {{ detailData.length }} dari {{ detailPagination.total }} data
            </span>
            <VPagination
              v-model="currentPage"
              :length="detailPagination.last_page"
              :total-visible="5"
              density="compact"
              size="small"
            />
          </div>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.uas-stat-card {
  transition: all 0.2s ease;
}

.uas-stat-content {
  flex: 1 1 auto;
  min-inline-size: 0;
  overflow: hidden;
}

.uas-stat-content .v-avatar,
.uas-stat-link {
  flex: 0 0 auto;
}

.uas-stat-link {
  margin-inline-start: auto;
}

.stat-value-wrap {
  min-width: 0;
  overflow: hidden;

  .text-subtitle-1 {
    line-height: 1.35;
    overflow-wrap: anywhere;
  }
}
</style>
