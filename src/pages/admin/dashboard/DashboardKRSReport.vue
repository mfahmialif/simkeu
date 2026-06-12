<script setup>
import { showSnackbar } from "@/composables/snackbar"
import { ref, watch, onMounted, computed } from "vue"

// ===== FILTER =====
const thAkademikList = ref([])
const prodiList = ref([])

const selectedThAkademik = ref(null)
const selectedProdi = ref(null)
const selectedThAngkatan = ref(null)

const fetchThAkademik = async () => {
  try {
    const response = await $api("/admin/th-akademik?limit=0&sort_key=kode&sort_order=desc")
    const items = response.data?.data || response.data || []

    thAkademikList.value = items.map(i => ({
      title: `${i.nama} - ${i.semester}`,
      value: i.id,
      aktif: i.aktif,
    }))

    // Set default ke th akademik yang aktif
    const aktif = thAkademikList.value.find(i => i.aktif === "Y")
    if (aktif) {
      selectedThAkademik.value = aktif.value
    }
  } catch (e) {
    console.error(e)
  }
}

const fetchProdi = async () => {
  try {
    const response = await $api("/admin/prodi?limit=0&sort_key=kode&sort_order=desc")
    const items = response.data?.data || response.data || []

    prodiList.value = items.map(i => ({
      title: i.nama,
      value: i.id,
    }))
  } catch (e) {
    console.error(e)
  }
}


// ===== SUMMARY DATA (Info Cards) =====
const isLoading = ref(false)

const summaryData = ref({
  sudah_krs: 0,
  belum_krs: 0,
  sudah_validasi_pa: 0,
  belum_validasi_pa: 0,
})

const totalMahasiswa = computed(
  () => summaryData.value.sudah_krs + summaryData.value.belum_krs,
)

const fetchSummary = async () => {
  if (!selectedThAkademik.value) return

  isLoading.value = true
  try {
    const params = {}

    params.th_akademik_id = selectedThAkademik.value
    if (selectedProdi.value) params.prodi_id = selectedProdi.value
    if (selectedThAngkatan.value) params.th_angkatan_id = selectedThAngkatan.value

    const queryString = new URLSearchParams(params).toString()
    const url = `/admin/dashboard/krs-report${queryString ? '?' + queryString : ''}`
    const response = await $api(url)

    if (response.status === false) {
      showSnackbar({ text: response.message, color: "error" })
      
      return
    }

    const d = response.data ?? response

    summaryData.value = {
      sudah_krs: d.sudah_krs ?? 0,
      belum_krs: d.belum_krs ?? 0,
      sudah_validasi_pa: d.sudah_validasi_pa ?? 0,
      belum_validasi_pa: d.belum_validasi_pa ?? 0,
    }
  } catch (e) {
    console.error(e)
    showSnackbar({ text: "Gagal memuat info KRS", color: "error" })
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
const activeStatusFilter = ref("semua")

const statusFilters = [
  { title: "Semua", value: "semua" },
  { title: "Sudah Validasi PA", value: "sudah_validasi" },
  { title: "Belum Validasi PA", value: "belum_validasi" },
  { title: "Belum KRS", value: "belum_krs" },
]

const fetchDetail = async () => {
  if (!selectedThAkademik.value) return

  isLoadingDetail.value = true
  try {
    const params = {}

    params.th_akademik_id = selectedThAkademik.value
    params.limit = detailPagination.value.per_page
    params.page = currentPage.value
    if (selectedProdi.value) params.prodi_id = selectedProdi.value
    if (selectedThAngkatan.value) params.th_angkatan_id = selectedThAngkatan.value
    if (searchQuery.value) params.search = searchQuery.value
    if (activeStatusFilter.value !== "semua") params.status_filter = activeStatusFilter.value

    const queryString = new URLSearchParams(params).toString()
    const url = `/admin/dashboard/krs-report-detail${queryString ? '?' + queryString : ''}`
    const response = await $api(url)

    if (!response.status) {
      showSnackbar({ text: response.message, color: "error" })
      
      return
    }

    const paginatedData = response.data

    detailData.value = paginatedData.data || []
    detailPagination.value = {
      current_page: paginatedData.current_page,
      last_page: paginatedData.last_page,
      total: paginatedData.total,
      per_page: paginatedData.per_page,
    }
  } catch (e) {
    console.error(e)
    showSnackbar({ text: "Gagal memuat detail KRS", color: "error" })
  } finally {
    isLoadingDetail.value = false
  }
}

const openDetail = (statusFilter = "semua") => {
  activeStatusFilter.value = statusFilter
  showDetailDialog.value = true
  currentPage.value = 1
  searchQuery.value = ""
  fetchDetail()
}

// Watch search with debounce
let searchTimeout = null
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchDetail()
  }, 400)
})

watch(currentPage, () => {
  fetchDetail()
})

watch(activeStatusFilter, () => {
  currentPage.value = 1
  fetchDetail()
})

// Watch filters -> refetch summary
const filtersInitialized = ref(false)

watch([selectedThAkademik, selectedProdi, selectedThAngkatan], () => {
  if (filtersInitialized.value) {
    fetchSummary()

    // Also refetch detail if dialog is open
    if (showDetailDialog.value) {
      currentPage.value = 1
      fetchDetail()
    }
  }
})

// Summary stats cards
const statCards = computed(() => [
  {
    title: "Sudah KRS",
    value: summaryData.value.sudah_krs,
    icon: "ri-checkbox-circle-line",
    color: "success",
    subtitle: "Mahasiswa",
    filterKey: "semua",
  },
  {
    title: "Belum KRS",
    value: summaryData.value.belum_krs,
    icon: "ri-close-circle-line",
    color: "error",
    subtitle: "Mahasiswa",
    filterKey: "belum_krs",
  },
  {
    title: "Sudah Validasi PA",
    value: summaryData.value.sudah_validasi_pa,
    icon: "ri-shield-check-line",
    color: "info",
    subtitle: "Mahasiswa",
    filterKey: "sudah_validasi",
  },
  {
    title: "Belum Validasi PA",
    value: summaryData.value.belum_validasi_pa,
    icon: "ri-time-line",
    color: "warning",
    subtitle: "Mahasiswa",
    filterKey: "belum_validasi",
  },
])

onMounted(async () => {
  await Promise.all([fetchThAkademik(), fetchProdi()])
  filtersInitialized.value = true
  fetchSummary()
})
</script>

<template>
  <VCard>
    <VSkeletonLoader
      v-if="isLoading && !filtersInitialized"
      type="card, list-item, paragraph, paragraph"
    />
    <template v-else>
      <VCardItem>
        <template #prepend>
          <VAvatar
            color="primary"
            variant="tonal"
            rounded="lg"
            class="me-2"
          >
            <VIcon
              icon="ri-file-list-3-line"
              size="24"
            />
          </VAvatar>
        </template>
        <VCardTitle>Laporan KRS SIAKAD</VCardTitle>
        <VCardSubtitle>
          Rekapitulasi pengisian KRS dan validasi PA mahasiswa
        </VCardSubtitle>
        <template #append>
          <VBtn
            icon
            variant="tonal"
            color="primary"
            size="small"
            aria-label="Lihat detail KRS SIAKAD"
            @click="openDetail('semua')"
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
              v-model="selectedThAngkatan"
              :items="thAkademikList"
              label="Angkatan"
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
              class="krs-stat-card"
            >
              <VCardText class="pa-3">
                <VSkeletonLoader
                  v-if="isLoading"
                  type="text, text"
                />
                <template v-else>
                  <div class="d-flex align-center justify-space-between gap-2 mb-1">
                    <div class="krs-stat-content d-flex align-center gap-2 min-w-0">
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
                      <div>
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
                      aria-label="Lihat detail status KRS"
                      class="krs-stat-link"
                      @click="openDetail(card.filterKey)"
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
                    {{ card.subtitle }}
                  </div>
                </template>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>

        <!-- KRS Progress -->
        <div
          v-if="!isLoading && totalMahasiswa > 0"
          class="mt-4"
        >
          <div class="d-flex justify-space-between mb-1">
            <span class="text-body-2 text-medium-emphasis">
              Progress Pengisian KRS
            </span>
            <span class="text-body-2 font-weight-medium">
              {{ summaryData.sudah_krs }} / {{ totalMahasiswa }}
              ({{ Math.round((summaryData.sudah_krs / totalMahasiswa) * 100) }}%)
            </span>
          </div>
          <VProgressLinear
            :model-value="(summaryData.sudah_krs / totalMahasiswa) * 100"
            color="success"
            height="10"
            rounded
          />

          <div class="d-flex justify-space-between mb-1 mt-3">
            <span class="text-body-2 text-medium-emphasis">
              Progress Validasi PA
            </span>
            <span class="text-body-2 font-weight-medium">
              {{ summaryData.sudah_validasi_pa }} / {{ summaryData.sudah_krs }}
              <template v-if="summaryData.sudah_krs > 0">
                ({{ Math.round((summaryData.sudah_validasi_pa / summaryData.sudah_krs) * 100) }}%)
              </template>
            </span>
          </div>
          <VProgressLinear
            :model-value="summaryData.sudah_krs > 0 ? (summaryData.sudah_validasi_pa / summaryData.sudah_krs) * 100 : 0"
            color="info"
            height="10"
            rounded
          />
        </div>
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
            icon="ri-file-list-3-line"
            size="22"
            color="primary"
          />
          <span>Detail KRS Mahasiswa</span>
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
        <!-- Search + Status Filter -->
        <VRow class="mb-4">
          <VCol
            cols="12"
            sm="6"
          >
            <VTextField
              v-model="searchQuery"
              label="Cari NIM / Nama / Kelompok"
              placeholder="Ketik untuk mencari..."
              prepend-inner-icon="ri-search-line"
              density="compact"
              hide-details
              clearable
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <VSelect
              v-model="activeStatusFilter"
              :items="statusFilters"
              item-title="title"
              item-value="value"
              label="Status"
              density="compact"
              hide-details
            />
          </VCol>
        </VRow>

        <!-- Loading -->
        <VSkeletonLoader
          v-if="isLoadingDetail"
          type="table-heading, table-tbody"
        />

        <!-- Data Table -->
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
                <th>Nama</th>
                <th>Prodi</th>
                <th>Kelas</th>
                <th>Kelompok</th>
                <th>Tanggal</th>
                <th>SKS</th>
                <th v-if="activeStatusFilter !== 'belum_krs'">
                  Status PA
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="detailData.length === 0">
                <td
                  :colspan="activeStatusFilter !== 'belum_krs' ? 9 : 8"
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
                  <span class="font-weight-medium">{{ row.nim }}</span>
                </td>
                <td>{{ row.nama_mhs || row.nama || '-' }}</td>
                <td>
                  <span class="text-caption">{{ row.prodi || '-' }}</span>
                </td>
                <td>{{ row.kelas || '-' }}</td>
                <td>{{ row.kelompok || '-' }}</td>
                <td>{{ row.tanggal || '-' }}</td>
                <td>{{ row.sks ?? '-' }}</td>
                <td v-if="activeStatusFilter !== 'belum_krs'">
                  <VChip
                    :color="row.acc_pa === 'Setujui' ? 'success' : 'warning'"
                    size="small"
                    variant="flat"
                    label
                  >
                    {{ row.acc_pa === 'Setujui' ? 'Disetujui' : 'Belum' }}
                  </VChip>
                </td>
              </tr>
            </tbody>
          </VTable>

          <!-- Pagination -->
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
.krs-stat-card {
  transition: all 0.2s ease;
}

.krs-stat-content {
  flex: 1 1 auto;
  min-inline-size: 0;
  overflow: hidden;
}

.krs-stat-content .v-avatar,
.krs-stat-link {
  flex: 0 0 auto;
}

.krs-stat-link {
  margin-inline-start: auto;
}
</style>
