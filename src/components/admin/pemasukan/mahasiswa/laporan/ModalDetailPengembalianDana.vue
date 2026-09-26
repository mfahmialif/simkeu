<script setup>
/* eslint-disable camelcase */
import { ref, watch } from "vue"
import { formatRupiah } from "@/composables/formatRupiah"
import { openFileExport } from "@/composables/exportFile"

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Detail Pengembalian Dana",
  },
  subtitle: {
    type: String,
    default: "",
  },
  filterParams: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(["update:modelValue"])

const isVisible = ref(props.modelValue)

watch(
  () => props.modelValue,
  val => {
    isVisible.value = val
    if (val) {
      page.value = 1
      search.value = ""
      fetchData()
      fetchStats()
    }
  },
)

watch(
  () => isVisible.value,
  val => {
    emit("update:modelValue", val)
  },
)

const loading = ref(false)
const loadingStats = ref(false)
const downloadingPdfId = ref(null)
const downloadingBundlingPdf = ref(false)

const items = ref([])
const totalItems = ref(0)
const page = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref({ key: "id", order: "desc" })
const search = ref("")

const stats = ref({
  total_nominal: 0,
  total_transaksi: 0,
})

// Modal Preview Lampiran
const isPreviewModalVisible = ref(false)

const previewData = ref({
  title: "",
  url: "",
  name: "",
  isImage: false,
  isPdf: false,
})

const resolveFileUrl = (item, type) => {
  if (!item) return ""
  const path = type === "masuk" ? item.file_bukti_masuk : item.file_bukti_keluar
  if (!path) return ""

  const apiBase = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/+$/, "")

  return `${apiBase}/admin/pemasukan/mahasiswa/pengembalian/file/${item.id}/${type}`
}

const openPreviewFile = (url, title, rawFilePath = "") => {
  if (!url) return

  const target = (rawFilePath || url).toLowerCase()
  const isPdf = target.includes(".pdf")
  const isImg = !isPdf

  previewData.value = {
    title: title || "Pratinjau Berkas",
    url,
    name: title,
    isImage: isImg,
    isPdf: isPdf,
  }
  isPreviewModalVisible.value = true
}

const headers = [
  { title: "NO", key: "no", sortable: false, width: "55px", align: "center" },
  { title: "NO. TRANSAKSI", key: "no_transaksi", sortable: true, width: "165px" },
  { title: "TANGGAL & WAKTU", key: "tanggal", sortable: true, width: "160px" },
  { title: "METODE", key: "jenis_pembayaran_id", sortable: false, width: "110px", align: "center" },
  { title: "REK. TUJUAN", key: "no_rek_tujuan", sortable: false, width: "140px" },
  { title: "NOMINAL", key: "nominal", sortable: true, width: "150px", align: "end" },
  { title: "KETERANGAN", key: "keterangan", sortable: false },
  { title: "PETUGAS", key: "petugas_id", sortable: false, width: "140px" },
  { title: "BUKTI MASUK", key: "file_bukti_masuk", sortable: false, width: "115px", align: "center" },
  { title: "BUKTI KELUAR", key: "file_bukti_keluar", sortable: false, width: "115px", align: "center" },
  { title: "AKSI", key: "actions", sortable: false, width: "70px", align: "center" },
]

const getMetodeColor = (nama = "") => {
  const n = String(nama).toLowerCase()
  if (n.includes("cash") || n.includes("tunai")) return "success"
  if (n.includes("transfer") || n.includes("tf")) return "primary"
  if (n.includes("yayasan") || n.includes("yys")) return "warning"
  
  return "info"
}

const formatDateTime = value => {
  if (!value) return "-"
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

const fetchData = async () => {
  try {
    loading.value = true

    const params = {
      page: page.value,
      limit: itemsPerPage.value,
      sort_key: sortBy.value.key,
      sort_order: sortBy.value.order,
      ...props.filterParams,
    }

    if (search.value && search.value.trim() !== "") {
      params.search = search.value.trim()
    }

    const response = await $api("/admin/pemasukan/mahasiswa/pengembalian", {
      method: "GET",
      params,
    })

    if (response?.data) {
      items.value = response.data.data || []
      totalItems.value = response.data.total || 0
    }
  } catch (err) {
    console.error("Gagal memuat detail pengembalian dana:", err)
    showSnackbar({
      text: err?.data?.message || "Gagal memuat data detail pengembalian dana.",
      color: "error",
    })
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    loadingStats.value = true

    const params = {
      ...props.filterParams,
    }

    if (search.value && search.value.trim() !== "") {
      params.search = search.value.trim()
    }

    const response = await $api("/admin/pemasukan/mahasiswa/pengembalian/stats", {
      method: "GET",
      params,
    })

    if (response?.data) {
      stats.value = response.data
    }
  } catch (err) {
    console.error("Gagal memuat stats detail pengembalian dana:", err)
  } finally {
    loadingStats.value = false
  }
}

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb }) => {
  page.value = p
  itemsPerPage.value = ipp
  if (sb?.length) {
    sortBy.value = sb[0]
  }
  fetchData()
}

const handleSearch = () => {
  page.value = 1
  fetchData()
  fetchStats()
}

// Download Single PDF
const handleCetakSinglePdf = async item => {
  try {
    downloadingPdfId.value = item.id
    showSnackbar({
      text: `Menyiapkan PDF Bukti ${item.no_transaksi}...`,
      color: "info",
    })

    const blob = await $api(`/admin/pemasukan/mahasiswa/pengembalian/${item.id}/pdf`, {
      method: "GET",
      headers: { Accept: "application/pdf" },
    })

    openFileExport(blob)
  } catch (err) {
    console.error("Gagal mencetak PDF bukti pengembalian dana:", err)
    showSnackbar({
      text: err?.data?.message || err?.message || "Gagal mencetak PDF bukti pengembalian dana.",
      color: "error",
    })
  } finally {
    downloadingPdfId.value = null
  }
}

// Download Bundling PDF
const handleDownloadBundling = async () => {
  try {
    downloadingBundlingPdf.value = true
    showSnackbar({
      text: "Menyiapkan PDF Rekap Detail Pengembalian Dana...",
      color: "info",
    })

    const params = {
      ...props.filterParams,
    }

    if (search.value && search.value.trim() !== "") {
      params.search = search.value.trim()
    }

    const blob = await $api("/admin/pemasukan/mahasiswa/pengembalian/pdf-bundling", {
      method: "GET",
      params,
      headers: { Accept: "application/pdf" },
    })

    openFileExport(blob)
  } catch (err) {
    console.error("Gagal mengunduh PDF rekap detail pengembalian:", err)
    showSnackbar({
      text: err?.data?.message || "Gagal mengunduh PDF rekap detail pengembalian dana.",
      color: "error",
    })
  } finally {
    downloadingBundlingPdf.value = false
  }
}
</script>

<template>
  <VDialog
    v-model="isVisible"
    max-width="1280px"
    scrollable
    persistent
  >
    <VCard class="detail-pengembalian-card">
      <!-- Modal Header -->
      <VCardTitle class="pa-4 bg-error text-white d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <VIcon
            icon="ri-arrow-go-back-line"
            size="26"
            class="me-3"
          />
          <div>
            <div class="text-h6 font-weight-bold text-white leading-tight">
              {{ title }}
            </div>
            <div
              v-if="subtitle"
              class="text-caption text-white opacity-90 mt-1 font-weight-regular"
            >
              {{ subtitle }}
            </div>
          </div>
        </div>

        <div class="d-flex align-center gap-2">
          <VBtn
            color="white"
            variant="flat"
            size="small"
            class="text-error font-weight-bold"
            prepend-icon="ri-file-pdf-2-line"
            :loading="downloadingBundlingPdf"
            @click="handleDownloadBundling"
          >
            Unduh Rekap PDF
          </VBtn>
          <VBtn
            icon
            variant="text"
            color="white"
            size="small"
            @click="isVisible = false"
          >
            <VIcon icon="ri-close-line" />
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText class="pa-4">
        <!-- Summary Stats Cards -->
        <VRow
          dense
          class="mb-4"
        >
          <VCol
            cols="12"
            sm="6"
            md="6"
          >
            <VCard
              variant="tonal"
              color="error"
              class="pa-3"
            >
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="text-caption text-medium-emphasis">
                    TOTAL PENGEMBALIAN DANA (PENGURANG)
                  </div>
                  <div class="text-h5 font-weight-bold text-error mt-1">
                    -{{ formatRupiah(stats.total_nominal || 0) }}
                  </div>
                </div>
                <VAvatar
                  color="error"
                  variant="flat"
                  size="44"
                >
                  <VIcon
                    icon="ri-money-dollar-circle-line"
                    size="26"
                    color="white"
                  />
                </VAvatar>
              </div>
            </VCard>
          </VCol>

          <VCol
            cols="12"
            sm="6"
            md="6"
          >
            <VCard
              variant="tonal"
              color="warning"
              class="pa-3"
            >
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="text-caption text-medium-emphasis">
                    TOTAL TRANSAKSI PENGEMBALIAN
                  </div>
                  <div class="text-h5 font-weight-bold text-warning mt-1">
                    {{ stats.total_transaksi || 0 }} Transaksi
                  </div>
                </div>
                <VAvatar
                  color="warning"
                  variant="flat"
                  size="44"
                >
                  <VIcon
                    icon="ri-file-list-3-line"
                    size="26"
                    color="white"
                  />
                </VAvatar>
              </div>
            </VCard>
          </VCol>
        </VRow>

        <!-- Search Bar -->
        <div class="d-flex align-center justify-space-between flex-wrap gap-3 mb-4">
          <div style="width: 320px; max-width: 100%;">
            <VTextField
              v-model="search"
              density="compact"
              placeholder="Cari No. Transaksi, Keterangan..."
              prepend-inner-icon="ri-search-line"
              clearable
              variant="outlined"
              hide-details
              @keydown.enter="handleSearch"
              @click:clear="handleSearch"
            />
          </div>
          <VBtn
            color="primary"
            variant="outlined"
            density="compact"
            prepend-icon="ri-search-line"
            @click="handleSearch"
          >
            Cari
          </VBtn>
        </div>

        <!-- Data Table Server -->
        <VDataTableServer
          v-model:items-per-page="itemsPerPage"
          v-model:page="page"
          :headers="headers"
          :items="items"
          :items-length="totalItems"
          :loading="loading"
          class="elevation-1 rounded border table-detail"
          density="comfortable"
          :items-per-page-options="[
            { value: 5, title: '5' },
            { value: 10, title: '10' },
            { value: 25, title: '25' },
            { value: 50, title: '50' },
          ]"
          @update:options="loadItems"
        >
          <!-- Column NO -->
          <template #item.no="{ index }">
            <span class="text-caption text-medium-emphasis">
              {{ (page - 1) * itemsPerPage + index + 1 }}
            </span>
          </template>

          <!-- Column NO. TRANSAKSI -->
          <template #item.no_transaksi="{ item }">
            <VChip
              size="small"
              variant="outlined"
              color="error"
              class="font-weight-bold"
            >
              {{ item.no_transaksi }}
            </VChip>
          </template>

          <!-- Column TANGGAL -->
          <template #item.tanggal="{ item }">
            <div class="d-flex align-center text-caption">
              <VIcon
                icon="ri-calendar-line"
                size="14"
                class="me-1 text-disabled"
              />
              {{ formatDateTime(item.tanggal) }}
            </div>
          </template>

          <!-- Column METODE -->
          <template #item.jenis_pembayaran_id="{ item }">
            <VChip
              size="x-small"
              :color="getMetodeColor(item.jenis_pembayaran?.nama)"
              variant="tonal"
              class="font-weight-medium"
            >
              {{ item.jenis_pembayaran?.nama || 'Tunai' }}
            </VChip>
          </template>

          <!-- Column REK TUJUAN -->
          <template #item.no_rek_tujuan="{ item }">
            <div v-if="item.nama_bank || item.no_rek_tujuan">
              <div
                v-if="item.nama_bank"
                class="font-weight-medium text-caption"
              >
                {{ item.nama_bank }}
              </div>
              <div
                v-if="item.no_rek_tujuan"
                class="text-caption text-medium-emphasis"
              >
                {{ item.no_rek_tujuan }}
              </div>
            </div>
            <span
              v-else
              class="text-disabled text-caption"
            >-</span>
          </template>

          <!-- Column NOMINAL -->
          <template #item.nominal="{ item }">
            <span class="font-weight-bold text-error">
              -{{ formatRupiah(item.nominal) }}
            </span>
          </template>

          <!-- Column KETERANGAN -->
          <template #item.keterangan="{ item }">
            <div
              class="text-caption text-truncate"
              style="max-width: 250px;"
              :title="item.keterangan || '-'"
            >
              {{ item.keterangan || '-' }}
            </div>
          </template>

          <!-- Column PETUGAS -->
          <template #item.petugas_id="{ item }">
            <div class="text-caption font-weight-medium">
              {{ item.petugas?.name || '-' }}
            </div>
          </template>

          <!-- Column BUKTI MASUK -->
          <template #item.file_bukti_masuk="{ item }">
            <VBtn
              v-if="item.file_bukti_masuk"
              size="x-small"
              variant="tonal"
              color="success"
              prepend-icon="ri-attachment-line"
              @click="openPreviewFile(resolveFileUrl(item, 'masuk'), 'Bukti Dana Masuk', item.file_bukti_masuk)"
            >
              Lihat
            </VBtn>
            <span
              v-else
              class="text-disabled text-caption"
            >-</span>
          </template>

          <!-- Column BUKTI KELUAR -->
          <template #item.file_bukti_keluar="{ item }">
            <VBtn
              v-if="item.file_bukti_keluar"
              size="x-small"
              variant="tonal"
              color="info"
              prepend-icon="ri-attachment-line"
              @click="openPreviewFile(resolveFileUrl(item, 'keluar'), 'Bukti Dana Keluar', item.file_bukti_keluar)"
            >
              Lihat
            </VBtn>
            <span
              v-else
              class="text-disabled text-caption"
            >-</span>
          </template>

          <!-- Column ACTIONS -->
          <template #item.actions="{ item }">
            <VBtn
              icon
              variant="text"
              color="error"
              size="small"
              title="Cetak Bukti PDF"
              :loading="downloadingPdfId === item.id"
              @click="handleCetakSinglePdf(item)"
            >
              <VIcon icon="ri-printer-line" />
            </VBtn>
          </template>

          <!-- No Data State -->
          <template #no-data>
            <div class="text-center pa-6">
              <VIcon
                icon="ri-inbox-line"
                size="40"
                color="grey"
                class="mb-2"
              />
              <div class="text-body-2 text-medium-emphasis">
                Tidak ada data transaksi pengembalian dana yang sesuai.
              </div>
            </div>
          </template>
        </VDataTableServer>
      </VCardText>

      <VDivider />

      <VCardActions class="pa-3 justify-end bg-grey-lighten-4">
        <VBtn
          color="secondary"
          variant="outlined"
          @click="isVisible = false"
        >
          Tutup
        </VBtn>
      </VCardActions>
    </VCard>

    <!-- Dialog Preview Berkas -->
    <VDialog
      v-model="isPreviewModalVisible"
      max-width="850px"
      scrollable
    >
      <VCard>
        <VCardTitle class="pa-4 bg-grey-lighten-3 d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <VIcon
              :icon="previewData.isPdf ? 'ri-file-pdf-line' : 'ri-image-line'"
              class="me-2"
              color="primary"
            />
            <span class="text-subtitle-1 font-weight-bold">{{ previewData.title }}</span>
          </div>
          <VBtn
            icon
            variant="text"
            size="small"
            @click="isPreviewModalVisible = false"
          >
            <VIcon icon="ri-close-line" />
          </VBtn>
        </VCardTitle>

        <VCardText class="pa-4 text-center">
          <div
            v-if="previewData.isImage"
            class="d-flex justify-center"
          >
            <img
              :src="previewData.url"
              :alt="previewData.name"
              class="rounded border"
              style="max-width: 100%; max-height: 550px; object-fit: contain;"
            >
          </div>

          <div
            v-else-if="previewData.isPdf"
            style="height: 550px;"
          >
            <iframe
              :src="previewData.url"
              width="100%"
              height="100%"
              style="border: none;"
            />
          </div>

          <div
            v-else
            class="pa-6"
          >
            <VIcon
              icon="ri-file-text-line"
              size="48"
              color="primary"
              class="mb-3"
            />
            <div class="text-body-1 mb-4">
              {{ previewData.name }}
            </div>
            <VBtn
              color="primary"
              prepend-icon="ri-download-line"
              :href="previewData.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unduh Berkas
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </VDialog>
  </VDialog>
</template>

<style scoped>
.detail-pengembalian-card {
  border-radius: 12px;
  overflow: hidden;
}

.table-detail :deep(th) {
  background-color: #f8fafc !important;
  color: #334155 !important;
  font-weight: 700 !important;
  font-size: 0.78rem !important;
  text-transform: uppercase;
}

.table-detail :deep(td) {
  font-size: 0.82rem !important;
}
</style>
