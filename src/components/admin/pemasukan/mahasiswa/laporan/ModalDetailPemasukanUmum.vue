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
    default: "Detail Pemasukan Umum",
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

const openPreviewFile = (fileItem, title = "Pratinjau Berkas") => {
  if (!fileItem?.url) return
  const ext = String(fileItem.name || fileItem.path || "").split(".").pop().toLowerCase()
  const isImg = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext)
  const isPdf = ext === "pdf"

  previewData.value = {
    title: title || fileItem.name,
    url: fileItem.url,
    name: fileItem.name,
    isImage: isImg,
    isPdf: isPdf,
  }
  isPreviewModalVisible.value = true
}

const headers = [
  { title: "NO", key: "no", sortable: false, width: "55px", align: "center" },
  { title: "NO. TRANSAKSI", key: "no_transaksi", sortable: true, width: "165px" },
  { title: "TANGGAL & WAKTU", key: "tanggal", sortable: true, width: "160px" },
  { title: "METODE", key: "jenis_pembayaran", sortable: false, width: "130px" },
  { title: "NOMINAL", key: "nominal", sortable: true, width: "150px", align: "end" },
  { title: "KETERANGAN", key: "keterangan", sortable: false },
  { title: "PETUGAS", key: "petugas_id", sortable: false, width: "140px" },
  { title: "LAMPIRAN", key: "lampiran", sortable: false, width: "110px", align: "center" },
  { title: "AKSI", key: "actions", sortable: false, width: "70px", align: "center" },
]

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

const getJenisPembayaranColor = (nama = "") => {
  const n = String(nama).toLowerCase()
  if (n.includes("cash") || n.includes("tunai")) return "success"
  if (n.includes("transfer") || n.includes("tf")) return "primary"
  if (n.includes("yayasan") || n.includes("yys")) return "warning"

  return "info"
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

    const response = await $api("/admin/pemasukan/mahasiswa/pemasukan-umum", {
      method: "GET",
      params,
    })

    if (response?.data) {
      items.value = response.data.data || []
      totalItems.value = response.data.total || 0
    }
  } catch (err) {
    console.error("Gagal memuat detail pemasukan umum:", err)
    showSnackbar({
      text: err?.data?.message || "Gagal memuat data detail pemasukan umum.",
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

    const response = await $api("/admin/pemasukan/mahasiswa/pemasukan-umum/stats", {
      method: "GET",
      params,
    })

    if (response?.data) {
      stats.value = response.data
    }
  } catch (err) {
    console.error("Gagal memuat stats detail pemasukan umum:", err)
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

    const blob = await $api(`/admin/pemasukan/mahasiswa/pemasukan-umum/${item.id}/pdf`, {
      method: "GET",
      headers: { Accept: "application/pdf" },
    })

    openFileExport(blob)
  } catch (err) {
    console.error("Gagal mencetak PDF bukti pemasukan umum:", err)
    showSnackbar({
      text: err?.data?.message || err?.message || "Gagal mencetak PDF bukti pemasukan umum.",
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
      text: "Menyiapkan PDF Rekap Detail Pemasukan Umum...",
      color: "info",
    })

    const params = {
      ...props.filterParams,
    }

    if (search.value && search.value.trim() !== "") {
      params.search = search.value.trim()
    }

    const blob = await $api("/admin/pemasukan/mahasiswa/pemasukan-umum/pdf-bundling", {
      method: "GET",
      params,
      headers: { Accept: "application/pdf" },
    })

    openFileExport(blob)
  } catch (err) {
    console.error("Gagal mengunduh PDF rekap detail:", err)
    showSnackbar({
      text: err?.data?.message || err?.message || "Gagal mendownload PDF rekap.",
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
    max-width="1100px"
    scrollable
  >
    <VCard class="detail-pemasukan-card">
      <!-- Modal Header -->
      <VCardTitle class="d-flex align-center justify-space-between pa-4 bg-primary text-white">
        <div class="d-flex align-center gap-2">
          <VIcon
            icon="ri-file-list-3-line"
            size="24"
            color="white"
          />
          <div>
            <div class="text-h6 font-weight-bold text-white mb-0">
              {{ title }}
            </div>
            <div
              v-if="subtitle"
              class="text-caption text-white text-medium-emphasis"
              style="opacity: 0.9;"
            >
              {{ subtitle }}
            </div>
          </div>
        </div>

        <VBtn
          icon
          variant="text"
          size="small"
          color="white"
          @click="isVisible = false"
        >
          <VIcon icon="ri-close-line" />
        </VBtn>
      </VCardTitle>

      <VDivider />

      <!-- Summary & Filter Header -->
      <VCardText class="pa-4 pb-2 bg-light">
        <div class="d-flex align-center justify-space-between flex-wrap gap-3">
          <!-- Summary Cards -->
          <div class="d-flex align-center gap-3 flex-wrap">
            <div class="d-flex align-center gap-2 pa-2 px-3 rounded border bg-surface">
              <VAvatar
                size="32"
                color="success"
                variant="tonal"
              >
                <VIcon
                  icon="ri-money-dollar-circle-line"
                  size="18"
                />
              </VAvatar>
              <div>
                <div class="text-caption text-medium-emphasis">
                  Total Nominal
                </div>
                <div class="text-subtitle-2 font-weight-bold text-success">
                  {{ formatRupiah(stats.total_nominal) }}
                </div>
              </div>
            </div>

            <div class="d-flex align-center gap-2 pa-2 px-3 rounded border bg-surface">
              <VAvatar
                size="32"
                color="info"
                variant="tonal"
              >
                <VIcon
                  icon="ri-receipt-line"
                  size="18"
                />
              </VAvatar>
              <div>
                <div class="text-caption text-medium-emphasis">
                  Jumlah Transaksi
                </div>
                <div class="text-subtitle-2 font-weight-bold text-info">
                  {{ stats.total_transaksi }} Transaksi
                </div>
              </div>
            </div>
          </div>

          <!-- Search & Export Action -->
          <div class="d-flex align-center gap-2 flex-grow-1 flex-md-grow-0">
            <VTextField
              v-model="search"
              placeholder="Cari transaksi / keterangan..."
              density="compact"
              style="min-width: 220px;"
              clearable
              prepend-inner-icon="ri-search-line"
              @keyup.enter="handleSearch"
              @click:clear="handleSearch"
            />

            <VBtn
              color="error"
              variant="tonal"
              density="compact"
              prepend-icon="ri-file-pdf-2-line"
              :loading="downloadingBundlingPdf"
              @click="handleDownloadBundling"
            >
              PDF
            </VBtn>
          </div>
        </div>
      </VCardText>

      <VDivider />

      <!-- Data Table -->
      <VCardText class="pa-0">
        <VDataTableServer
          v-model:items-per-page="itemsPerPage"
          v-model:page="page"
          :items="items"
          :items-length="totalItems"
          :headers="headers"
          :loading="loading"
          density="compact"
          class="text-no-wrap"
          :items-per-page-options="[5, 10, 25, 50]"
          @update:options="loadItems"
        >
          <!-- No Urut -->
          <template #item.no="{ index }">
            <span class="text-medium-emphasis">{{ (page - 1) * itemsPerPage + index + 1 }}</span>
          </template>

          <!-- No Transaksi -->
          <template #item.no_transaksi="{ item }">
            <VChip
              size="small"
              color="primary"
              variant="tonal"
              class="font-weight-medium"
            >
              {{ item.no_transaksi }}
            </VChip>
          </template>

          <!-- Tanggal & Waktu -->
          <template #item.tanggal="{ item }">
            <div class="text-body-2 font-weight-medium">
              {{ formatDateTime(item.tanggal) }}
            </div>
          </template>

          <!-- Metode Pembayaran -->
          <template #item.jenis_pembayaran="{ item }">
            <VChip
              size="small"
              :color="getJenisPembayaranColor(item.jenis_pembayaran?.nama)"
              variant="tonal"
              class="font-weight-medium"
            >
              {{ item.jenis_pembayaran?.nama || '-' }}
            </VChip>
          </template>

          <!-- Nominal -->
          <template #item.nominal="{ item }">
            <div class="font-weight-bold text-success">
              {{ formatRupiah(item.nominal) }}
            </div>
          </template>

          <!-- Keterangan -->
          <template #item.keterangan="{ item }">
            <div
              class="text-body-2 text-truncate"
              style="max-width: 250px;"
              :title="item.keterangan"
            >
              {{ item.keterangan || '-' }}
            </div>
          </template>

          <!-- Petugas -->
          <template #item.petugas_id="{ item }">
            <div class="d-flex align-center gap-1">
              <VIcon
                icon="ri-user-line"
                size="14"
                color="secondary"
              />
              <span class="text-body-2">{{ item.petugas?.name || item.petugas?.username || '-' }}</span>
            </div>
          </template>

          <!-- Lampiran -->
          <template #item.lampiran="{ item }">
            <div v-if="item.lampiran_list && item.lampiran_list.length > 0">
              <VBtn
                size="x-small"
                variant="tonal"
                color="primary"
                prepend-icon="ri-attachment-2"
                @click="openPreviewFile(item.lampiran_list[0], item.lampiran_list[0].name)"
              >
                {{ item.lampiran_list.length }} Berkas
              </VBtn>
            </div>
            <span
              v-else
              class="text-medium-emphasis text-caption"
            >
              -
            </span>
          </template>

          <!-- Aksi -->
          <template #item.actions="{ item }">
            <VBtn
              icon
              size="x-small"
              variant="text"
              color="error"
              :loading="downloadingPdfId === item.id"
              title="Cetak Kwitansi PDF"
              @click="handleCetakSinglePdf(item)"
            >
              <VIcon
                icon="ri-printer-line"
                size="18"
              />
            </VBtn>
          </template>

          <!-- No Data State -->
          <template #no-data>
            <div class="text-center py-6">
              <VIcon
                icon="ri-inbox-line"
                size="42"
                class="text-medium-emphasis mb-2"
              />
              <div class="text-body-2 font-weight-medium">
                Tidak ada data pemasukan umum untuk filter ini
              </div>
            </div>
          </template>
        </VDataTableServer>
      </VCardText>

      <VDivider />

      <VCardActions class="pa-3 px-4 d-flex justify-end">
        <VBtn
          variant="outlined"
          color="secondary"
          density="compact"
          @click="isVisible = false"
        >
          Tutup
        </VBtn>
      </VCardActions>
    </VCard>

    <!-- Modal Pratinjau File Lampiran -->
    <VDialog
      v-model="isPreviewModalVisible"
      max-width="850px"
      scrollable
    >
      <VCard>
        <VCardTitle class="d-flex align-center justify-space-between pa-4 bg-primary text-white">
          <div class="text-subtitle-1 font-weight-bold text-white text-truncate">
            {{ previewData.title }}
          </div>
          <VBtn
            icon
            variant="text"
            size="small"
            color="white"
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
.detail-pemasukan-card {
  overflow: hidden;
}
</style>
