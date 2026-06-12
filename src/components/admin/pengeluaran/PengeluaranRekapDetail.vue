<script setup>
import { formatRupiah } from "@/composables/formatRupiah"
import { notifyPengeluaranRekapUpdated } from "@/composables/pengeluaranRekap"
import { showSnackbar } from "@/composables/snackbar"
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect/index.js"
import "flatpickr/dist/plugins/monthSelect/style.css"

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  basePath: {
    type: String,
    required: true,
  },
  moduleType: {
    type: String,
    required: true,
  },
  allowCreate: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()
const router = useRouter()
const rekapId = computed(() => route.params.id)

const returnPath = computed(() => {
  const path = route.query.return_to

  if (
    typeof path === "string"
    && (path === "/admin/laporan/rab" || path.startsWith("/admin/laporan/rab?"))
  ) {
    return path
  }

  return props.basePath
})

const rekap = ref(null)
const page = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref({ key: "id", order: "desc" })
const dataTable = ref([])
const totalItems = ref(0)
const loading = ref(true)
const activeDataTab = ref("rab")
const dialog = ref(false)
const saving = ref(false)
const actionDialog = ref(false)
const actionLoading = ref(false)
const lpjDialog = ref(false)
const lpjLoading = ref(false)
const lpj = ref(null)
const lpjRows = ref([])
const namaInput = ref(null)
const nama = ref("")
const keterangan = ref("")
const jumlahSementara = ref(0)
const tanggalRekap = ref("")
const bulanTahun = ref("")

const selectedRabIds = ref([])
const selectedLpjIds = ref([])
const deleteItemsDialog = ref(false)
const deletingItems = ref(false)
const itemsToDelete = ref([])
const selectedIds = computed(() => activeDataTab.value === "rab" ? selectedRabIds.value : selectedLpjIds.value)

const tableHeaders = computed(() => {
  const headers = [
    { title: "No", key: "id" },
    { title: "Tanggal", key: "tanggal" },
  ]

  if (props.moduleType === "kegiatan") {
    headers.push({ title: "Kategori", key: "kategori_detail" })
  }

  if (!["rumah-tangga", "sarana-prasarana", "transportasi"].includes(props.moduleType)) {
    headers.push({ title: "Pegawai", key: "pegawai", sortable: false })
  }

  const detailHeaders = [
  ]

  if (["rumah-tangga", "sarana-prasarana"].includes(props.moduleType)) {
    detailHeaders.push(
      { title: "Kelompok Anggaran", key: "kelompok_anggaran" },
      { title: "Uraian", key: "uraian", sortable: false },
      { title: "Volume", key: "volume" },
      { title: "Satuan", key: "satuan" },
      { title: "Harga Satuan", key: "nominal" },
    )
  } else if (props.moduleType === "transportasi") {
    detailHeaders.push(
      { title: "Uraian", key: "uraian", sortable: false },
      { title: "Volume", key: "volume" },
      { title: "Satuan", key: "satuan" },
      { title: "Harga Satuan", key: "nominal" },
      { title: "Prioritas", key: "prioritas" },
    )
  } else {
    detailHeaders.push({ title: "Uraian", key: "uraian", sortable: false })
  }

  return [
    ...headers,
    ...detailHeaders,
    { title: "Jenis Pembayaran", key: "jenis_pembayaran" },
    { title: "Total", key: "total" },
    { title: "Keterangan", key: "keterangan" },
    { title: "Actions", key: "actions", sortable: false },
  ]
})

const lpjTableHeaders = computed(() => tableHeaders.value)
const editingHasDetails = computed(() => Number(rekap.value?.jumlah_data || 0) > 0)
const canDeleteRekapWithDetails = computed(() => ["kegiatan", "rumah-tangga", "sarana-prasarana", "transportasi"].includes(props.moduleType))

const deleteRekapMessage = computed(() => {
  if (canDeleteRekapWithDetails.value && Number(rekap.value?.jumlah_data || 0) > 0) {
    return `Rekap "${rekap.value?.nama || ""}" beserta ${rekap.value?.jumlah_data || 0} data pengeluaran di dalamnya akan dihapus permanen.`
  }

  return `Rekap "${rekap.value?.nama || ""}" akan dihapus permanen.`
})

const lpjSelisihColor = computed(() => {
  const value = Number(lpj.value?.selisih || 0)

  if (value === 0) return "success"

  return value > 0 ? "warning" : "error"
})

const monthYearPickerConfig = {
  altInput: true,
  altFormat: "F Y",
  dateFormat: "Y-m",
  disableMobile: true,
  plugins: [
    monthSelectPlugin({
      shorthand: false,
      dateFormat: "Y-m",
      altFormat: "F Y",
    }),
  ],
}

const datePickerConfig = {
  altInput: true,
  altFormat: "d F Y",
  dateFormat: "Y-m-d",
  disableMobile: true,
}

const numberValue = value => Number(value ?? 0)
const amountValue = (value, fallback = 0) => value ?? fallback ?? 0

const formatMonthYear = value => {
  const match = String(value || "").match(/^(\d{4})-(\d{2})/)

  if (!match) return ""

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(Number(match[1]), Number(match[2]) - 1, 1))
}

const formatDate = value => {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})/)

  if (!match) return ""

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
}

const subtotalTransport = item => {
  const transportMotor = numberValue(amountValue(item.transport_motor, item.transport))
  const hariMotor = numberValue(amountValue(item.hari_transport_motor, item.hari))
  const transportMobil = numberValue(amountValue(item.transport_mobil, item.transport_mobil_tanpa_tol))
  const hariMobil = numberValue(amountValue(item.hari_transport_mobil, item.hari_transport_mobil_tanpa_tol))

  return transportMotor * hariMotor + transportMobil * hariMobil
}

const subtotalMengajar = item => {
  const barokahBiasa = numberValue(amountValue(item.barokah_mengajar_biasa, item.barokah))
  const jamBiasa = numberValue(item.jam)
  const barokahDoubleDegree = numberValue(item.barokah_mengajar_double_degree)
  const jamDoubleDegree = numberValue(amountValue(item.jam_mengajar_double_degree, item.jam))

  return Math.round((barokahBiasa * jamBiasa) + (barokahDoubleDegree * jamDoubleDegree))
}

const subtotalSempro = item => numberValue(item.barokah_sempro) * numberValue(amountValue(item.jam_sempro, item.barokah_sempro ? 1 : 0))
const subtotalUas = item => numberValue(item.barokah_uas) * numberValue(item.jumlah_mahasiswa_uas)

const errorMessage = err => {
  const message =
    err?.data?.message ||
    err?.response?._data?.message ||
    err?.response?.data?.message ||
    err?.message

  if (typeof message === "object") {
    return Object.values(message).flat().join("; ")
  }

  return message || "Terjadi kesalahan."
}

const fetchRekap = async () => {
  const response = await $api(`${props.endpoint}/rekap/${rekapId.value}`, {
    method: "GET",
  })

  rekap.value = response.data
}

const fetchLpj = async () => {
  try {
    const response = await $api(`${props.endpoint}/rekap/${rekapId.value}/lpj`, {
      method: "GET",
    })

    lpj.value = response.data?.lpj || null
    lpjRows.value = response.data?.details || []
  } catch {
    lpj.value = null
    lpjRows.value = []
  }
}

const fetchData = async () => {
  try {
    loading.value = true

    const response = await $api(props.endpoint, {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        rekap_id: rekapId.value,
      },
    })

    dataTable.value = response.data.data
    totalItems.value = response.data.total
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    loading.value = false
  }
}

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb }) => {
  page.value = p
  itemsPerPage.value = ipp
  if (sb.length) sortBy.value = sb[0]
  fetchData()
}

const isNonPegawai = item => item.kategori_detail === "non_pegawai"
const isRumahTangga = computed(() => ["rumah-tangga", "sarana-prasarana"].includes(props.moduleType))

const pegawaiLabel = item => isNonPegawai(item)
  ? "Nonpegawai"
  : item.nama_pegawai || item.nama_dosen || "-"

const pegawaiMeta = item => isNonPegawai(item)
  ? "Tanpa pegawai"
  : [
    item.kode_pegawai || item.kode_dosen,
    item.tipe_pegawai === "staff" ? "Staff" : item.tipe_pegawai === "dosen" ? "Dosen" : null,
    item.jabatan_staff || item.nama_prodi_dosen,
  ].filter(Boolean).join(" - ")

const uraian = item => {
  if (isRumahTangga.value) {
    return item.nama_kegiatan || "-"
  }

  if (props.moduleType === "kegiatan") {
    return item.nama_kegiatan || "-"
  }

  if (props.moduleType === "transportasi") {
    return item.nama_kegiatan || "-"
  }

  if (props.moduleType === "bulanan") {
    return `${numberValue(item.hari)} hari, harian ${formatRupiah(item.barokah_harian)}, bulanan ${formatRupiah(item.barokah_bulanan)}`
  }

  if (props.moduleType === "dosen-bulanan") {
    return `Dosen Tetap ${formatRupiah(item.barokah_dosen_tetap)}, Struktural ${formatRupiah(item.barokah_struktural)}`
  }

  return `Transport ${formatRupiah(subtotalTransport(item))}, mengajar ${formatRupiah(subtotalMengajar(item))}, sempro ${formatRupiah(subtotalSempro(item))}, UAS ${formatRupiah(subtotalUas(item))}`
}

const currentDetailPath = computed(() => route.fullPath)

const createPath = () => ({
  path: `${props.basePath}/add`,
  query: {
    rekap_id: rekapId.value,
    return_to: currentDetailPath.value,
  },
})

const editBatchPath = () => ({
  path: `${props.basePath}/add`,
  query: {
    rekap_id: rekapId.value,
    return_to: currentDetailPath.value,
    edit_batch: "1",
  },
})

const addRabPath = () => (
  ["kegiatan", "rumah-tangga", "sarana-prasarana"].includes(props.moduleType)
    ? editBatchPath()
    : createPath()
)

const editPath = item => ({
  path: `${props.basePath}/edit/${item.id}`,
  query: {
    return_to: currentDetailPath.value,
  },
})

const lpjDetailPath = () => ({
  path: `${props.basePath}/rekap/${rekapId.value}/lpj`,
  query: {
    return_to: currentDetailPath.value,
  },
})

const paymentColor = value => {
  if (value === "Transfer") return "info"
  if (value === "Tunai") return "secondary"

  return "success"
}

const openEditRekapDialog = () => {
  nama.value = rekap.value?.nama || ""
  bulanTahun.value = String(rekap.value?.bulan_tahun || "").slice(0, 7)
  tanggalRekap.value = String(rekap.value?.tanggal_rekap || "").slice(0, 10)
  jumlahSementara.value = Number(rekap.value?.jumlah_data > 0 ? rekap.value?.jumlah : (rekap.value?.jumlah_sementara ?? rekap.value?.jumlah ?? 0))
  keterangan.value = rekap.value?.keterangan || ""
  dialog.value = true
}

const saveRekap = async () => {
  if (saving.value) return

  const trimmedNama = nama.value.trim()

  if (!trimmedNama) {
    showSnackbar({
      text: "Nama rekap harus diisi.",
      color: "warning",
    })
    namaInput.value?.focus()
    
    return
  }

  try {
    saving.value = true

    const response = await $api(`${props.endpoint}/rekap/${rekapId.value}`, {
      method: "PUT",
      body: {
        nama: trimmedNama,
        bulan_tahun: bulanTahun.value,
        tanggal_rekap: tanggalRekap.value,
        jumlah_sementara: editingHasDetails.value ? null : Number(jumlahSementara.value || 0),
        keterangan: keterangan.value,
      },
    })

    if (response.status === true) {
      dialog.value = false
      await fetchRekap()
      notifyPengeluaranRekapUpdated(props.endpoint)
      showSnackbar({
        text: response.message,
        color: "success",
      })
    }
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    saving.value = false
  }
}

const confirmDeleteRekap = async () => {
  if (actionLoading.value) return

  try {
    actionLoading.value = true

    const response = await $api(`${props.endpoint}/rekap/${rekapId.value}`, {
      method: "DELETE",
    })

    if (response.status === true) {
      actionDialog.value = false
      notifyPengeluaranRekapUpdated(props.endpoint)
      showSnackbar({
        text: response.message,
        color: "success",
      })
      router.push(returnPath.value)
    }
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    actionLoading.value = false
  }
}

const confirmDeleteItems = (items = null) => {
  if (items) {
    itemsToDelete.value = Array.isArray(items) ? items : [items]
  } else {
    itemsToDelete.value = selectedIds.value
  }
  deleteItemsDialog.value = true
}

const submitDeleteItems = async () => {
  if (deletingItems.value || itemsToDelete.value.length === 0) return

  try {
    deletingItems.value = true
    const promises = itemsToDelete.value.map(id => $api(`${props.endpoint}/${id}`, { method: "DELETE" }))
    await Promise.all(promises)
    
    deleteItemsDialog.value = false
    selectedRabIds.value = []
    selectedLpjIds.value = []
    
    showSnackbar({
      text: `${itemsToDelete.value.length} data berhasil dihapus.`,
      color: "success",
    })
    
    await fetchRekap()
    await fetchData()
    await fetchLpj()
    notifyPengeluaranRekapUpdated(props.endpoint)
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    deletingItems.value = false
  }
}

const openLpjDialog = () => {
  lpjDialog.value = true
}

const submitLpj = async sameAsRab => {
  if (lpjLoading.value) return

  try {
    lpjLoading.value = true

    const response = await $api(`${props.endpoint}/rekap/${rekapId.value}/lpj/copy`, {
      method: "POST",
      body: {
        sama_dengan_rab: sameAsRab,
      },
    })

    if (response.status === true) {
      lpjDialog.value = false
      await fetchLpj()
      notifyPengeluaranRekapUpdated(props.endpoint)
      showSnackbar({
        text: response.message,
        color: "success",
      })

      if (!sameAsRab) {
        router.push(lpjDetailPath())
      }
    }
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    lpjLoading.value = false
  }
}

onMounted(async () => {
  document.title = `Detail Rekap ${props.title} - SIMKEU`

  try {
    await fetchRekap()
    await fetchLpj()
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  }
})
</script>

<template>
  <div>
    <VBtn
      variant="text"
      color="secondary"
      prepend-icon="ri-arrow-left-line"
      class="mb-4"
      @click="router.push(returnPath)"
    >
      Kembali
    </VBtn>

    <VCard class="mb-6">
      <VCardText>
        <div class="detail-summary">
          <div class="detail-main min-w-0">
            <div class="detail-title text-h5 font-weight-semibold">
              {{ rekap?.nama || "Detail Rekap" }}
            </div>
            <div
              v-if="rekap?.keterangan"
              class="text-body-2 mt-1"
            >
              {{ rekap.keterangan }}
            </div>
            <div
              v-if="rekap?.bulan_tahun"
              class="text-caption text-medium-emphasis mt-1"
            >
              Periode {{ formatMonthYear(rekap.bulan_tahun) }}
            </div>
            <div
              v-if="rekap?.tanggal_rekap"
              class="text-caption text-medium-emphasis mt-1"
            >
              Tanggal rekap {{ formatDate(rekap.tanggal_rekap) }}
            </div>
          </div>

          <div class="detail-side">
            <div class="detail-stats">
              <div class="detail-stat">
                <span>Jumlah Data</span>
                <strong>{{ rekap?.jumlah_data || 0 }}</strong>
              </div>

              <div class="detail-stat">
                <span>Jumlah RAB</span>
                <strong>{{ formatRupiah(rekap?.jumlah || 0) }}</strong>
                <small>
                  {{ rekap?.is_jumlah_sementara ? "Jumlah sementara" : "Total detail aktual" }}
                </small>
              </div>

              <div class="detail-stat">
                <span>Total LPJ</span>
                <strong>{{ formatRupiah(lpj?.total_lpj || 0) }}</strong>
                <small>{{ lpj?.sama_dengan_rab ? "Sama dengan RAB" : `${lpj?.jumlah_data || 0} data LPJ` }}</small>
              </div>

              <div class="detail-stat">
                <span>Selisih</span>
                <strong :class="`text-${lpjSelisihColor}`">
                  {{ formatRupiah(lpj?.selisih || 0) }}
                </strong>
                <small>RAB dikurangi LPJ</small>
              </div>
            </div>

            <div class="detail-actions">
              <VBtn
                variant="outlined"
                color="primary"
                prepend-icon="ri-edit-line"
                @click="openEditRekapDialog"
              >
                Edit
              </VBtn>
              <VBtn
                variant="outlined"
                color="error"
                prepend-icon="ri-delete-bin-line"
                :disabled="!canDeleteRekapWithDetails && Number(rekap?.jumlah_data || 0) > 0"
                @click="actionDialog = true"
              >
                Delete
              </VBtn>
            </div>
          </div>
        </div>

        <VAlert
          v-if="rekap?.jumlah_sementara !== null && Number(rekap?.jumlah_data || 0) > 0"
          type="warning"
          variant="tonal"
          density="compact"
          class="mt-4"
        >
          Total detail masih kurang {{ formatRupiah(rekap?.selisih_sementara || 0) }}
          dari target sementara {{ formatRupiah(rekap?.jumlah_sementara || 0) }}.
          Target akan dikosongkan otomatis setelah total detail sama.
        </VAlert>
      </VCardText>
    </VCard>

    <VCard>
      <VCardItem class="detail-data-header pb-4">
        <VCardTitle>Data {{ title }}</VCardTitle>
        <VCardSubtitle>
          <template v-if="activeDataTab === 'rab'">
            {{ loading ? "Memuat data RAB..." : `${totalItems} data RAB, total ${formatRupiah(rekap?.jumlah || 0)}` }}
          </template>
          <template v-else>
            {{ `${lpjRows.length} data LPJ, total ${formatRupiah(lpj?.total_lpj || 0)}` }}
          </template>
        </VCardSubtitle>

        <template
          v-if="allowCreate || activeDataTab === 'lpj' || selectedIds.length > 0"
          #append
        >
          <div class="detail-data-actions">
            <VBtn
              v-if="selectedIds.length > 0"
              color="error"
              prepend-icon="ri-delete-bin-line"
              class="mr-3"
              @click="confirmDeleteItems(null)"
            >
              Hapus ({{ selectedIds.length }})
            </VBtn>
            <template v-if="activeDataTab === 'rab' && allowCreate">
              <VBtn
                color="primary"
                prepend-icon="ri-add-line"
                @click="router.push(addRabPath())"
              >
                Tambah Data
              </VBtn>
            </template>
            <VBtn
              v-else-if="activeDataTab === 'lpj'"
              color="success"
              prepend-icon="ri-file-edit-line"
              @click="router.push(lpjDetailPath())"
            >
              Edit Detail LPJ
            </VBtn>
          </div>
        </template>
      </VCardItem>

      <VDivider />

      <VTabs
        v-model="activeDataTab"
        class="detail-tabs px-4"
        color="primary"
      >
        <VTab
          value="rab"
          prepend-icon="ri-file-list-3-line"
        >
          RAB
        </VTab>
        <VTab
          value="lpj"
          prepend-icon="ri-file-check-line"
        >
          LPJ
        </VTab>
      </VTabs>

      <VDivider />

      <VWindow v-model="activeDataTab">
        <VWindowItem value="rab">
          <VDataTableServer
            v-model:items-per-page="itemsPerPage"
            v-model:page="page"
            v-model="selectedRabIds"
            show-select
            :headers="tableHeaders"
            :items="dataTable"
            :items-length="totalItems"
            :loading="loading"
            item-value="id"
            @update:options="loadItems"
          >
            <template #no-data>
              <div class="text-center pa-4">
                Tidak ada data RAB.
              </div>
            </template>

            <template #item.id="{ index }">
              {{ itemsPerPage * (page - 1) + index + 1 }}
            </template>

            <template #item.pegawai="{ item }">
              <div class="font-weight-medium">
                {{ pegawaiLabel(item) }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ pegawaiMeta(item) || "-" }}
              </div>
            </template>

            <template #item.kategori_detail="{ item }">
              <VChip
                :color="isNonPegawai(item) ? 'secondary' : 'primary'"
                size="small"
                label
              >
                {{ isNonPegawai(item) ? "Nonpegawai" : "Pegawai" }}
              </VChip>
            </template>

            <template #item.uraian="{ item }">
              {{ uraian(item) }}
            </template>

            <template #item.kelompok_anggaran="{ item }">
              {{ item.kelompok_anggaran || "-" }}
            </template>

            <template #item.nominal="{ item }">
              {{ formatRupiah(item.nominal) }}
            </template>

            <template #item.jumlah="{ item }">
              {{ item.jumlah ?? "-" }}
            </template>

            <template #item.volume="{ item }">
              {{ item.volume ?? "-" }}
            </template>

            <template #item.prioritas="{ item }">
              <VChip
                v-if="item.prioritas"
                :color="item.prioritas === 'Tinggi' ? 'error' : item.prioritas === 'Sedang' ? 'warning' : 'success'"
                size="small"
                label
              >
                {{ item.prioritas }}
              </VChip>
              <span v-else>-</span>
            </template>

            <template #item.jenis_pembayaran="{ item }">
              <VChip
                v-if="item.jenis_pembayaran"
                :color="paymentColor(item.jenis_pembayaran)"
                size="small"
                label
              >
                {{ item.jenis_pembayaran }}
              </VChip>
              <span v-else>-</span>
            </template>

            <template #item.total="{ item }">
              {{ formatRupiah(item.total) }}
            </template>

            <template #item.keterangan="{ item }">
              {{ item.keterangan || "-" }}
            </template>

            <template #item.actions="{ item }">
              <VBtn
                variant="text"
                size="small"
                color="primary"
                prepend-icon="ri-edit-box-line"
                @click="router.push(editPath(item))"
              >
                Edit
              </VBtn>
              <VBtn
                variant="text"
                size="small"
                color="error"
                icon="ri-delete-bin-line"
                @click="confirmDeleteItems(item.id)"
              />
            </template>
          </VDataTableServer>
        </VWindowItem>

        <VWindowItem value="lpj">
          <VDataTable
            v-model="selectedLpjIds"
            show-select
            :headers="lpjTableHeaders"
            :items="lpjRows"
            :items-per-page="itemsPerPage"
            item-value="id"
          >
            <template #no-data>
              <div class="text-center pa-6">
                <div class="text-body-2 text-medium-emphasis mb-3">
                  Belum ada data LPJ.
                </div>
                <VBtn
                  color="success"
                  prepend-icon="ri-file-check-line"
                  @click="openLpjDialog"
                >
                  Input LPJ
                </VBtn>
              </div>
            </template>

            <template #item.id="{ index }">
              {{ index + 1 }}
            </template>

            <template #item.pegawai="{ item }">
              <div class="font-weight-medium">
                {{ pegawaiLabel(item) }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ pegawaiMeta(item) || "-" }}
              </div>
            </template>

            <template #item.kategori_detail="{ item }">
              <VChip
                :color="isNonPegawai(item) ? 'secondary' : 'primary'"
                size="small"
                label
              >
                {{ isNonPegawai(item) ? "Nonpegawai" : "Pegawai" }}
              </VChip>
            </template>

            <template #item.uraian="{ item }">
              {{ uraian(item) }}
            </template>

            <template #item.kelompok_anggaran="{ item }">
              {{ item.kelompok_anggaran || "-" }}
            </template>

            <template #item.nominal="{ item }">
              {{ formatRupiah(item.nominal) }}
            </template>

            <template #item.jumlah="{ item }">
              {{ item.jumlah ?? "-" }}
            </template>

            <template #item.volume="{ item }">
              {{ item.volume ?? "-" }}
            </template>

            <template #item.prioritas="{ item }">
              <VChip
                v-if="item.prioritas"
                :color="item.prioritas === 'Tinggi' ? 'error' : item.prioritas === 'Sedang' ? 'warning' : 'success'"
                size="small"
                label
              >
                {{ item.prioritas }}
              </VChip>
              <span v-else>-</span>
            </template>

            <template #item.jenis_pembayaran="{ item }">
              <VChip
                v-if="item.jenis_pembayaran"
                :color="paymentColor(item.jenis_pembayaran)"
                size="small"
                label
              >
                {{ item.jenis_pembayaran }}
              </VChip>
              <span v-else>-</span>
            </template>

            <template #item.total="{ item }">
              {{ formatRupiah(item.total) }}
            </template>

            <template #item.keterangan="{ item }">
              {{ item.keterangan || "-" }}
            </template>

            <template #item.actions="{ item }">
              <VBtn
                variant="text"
                size="small"
                color="error"
                icon="ri-delete-bin-line"
                @click="confirmDeleteItems(item.id)"
              />
            </template>
          </VDataTable>
        </VWindowItem>
      </VWindow>
    </VCard>

    <VDialog
      v-model="deleteItemsDialog"
      max-width="500"
    >
      <VCard>
        <VCardItem class="text-center pb-6">
          <div class="delete-icon-wrapper mb-4">
            <VIcon
              icon="ri-error-warning-line"
              color="error"
              size="48"
            />
          </div>
          <VCardTitle class="text-h5 font-weight-bold mb-2">
            Hapus Data
          </VCardTitle>
          <div class="text-body-1 text-medium-emphasis">
            Anda yakin ingin menghapus {{ itemsToDelete.length }} data yang dipilih? Data yang dihapus tidak dapat dikembalikan.
          </div>
        </VCardItem>

        <VCardText class="d-flex justify-center gap-3 pt-0 pb-6">
          <VBtn
            variant="tonal"
            color="secondary"
            :disabled="deletingItems"
            @click="deleteItemsDialog = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="error"
            :loading="deletingItems"
            @click="submitDeleteItems"
          >
            Hapus
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <VDialog
      v-model="dialog"
      width="640"
      @after-enter="namaInput?.focus()"
    >
      <VCard title="Edit Rekap">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="dialog = false"
        />

        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField
                ref="namaInput"
                v-model="nama"
                label="Nama Rekap *"
                :rules="[requiredValidator]"
                @keydown.enter.prevent="saveRekap"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <AppDateTimePicker
                v-model="tanggalRekap"
                label="Tanggal Rekap *"
                prepend-inner-icon="ri-calendar-event-line"
                :config="datePickerConfig"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="jumlahSementara"
                :label="editingHasDetails ? 'Jumlah RAB dari Detail' : 'Jumlah Sementara *'"
                type="number"
                min="0"
                prefix="Rp"
                :disabled="editingHasDetails"
                :hint="editingHasDetails
                  ? 'Jumlah dihitung otomatis dari total data pengeluaran.'
                  : `${formatRupiah(jumlahSementara)} - dipakai sampai detail tersedia`"
                persistent-hint
                :rules="editingHasDetails ? [] : [requiredValidator]"
              />
            </VCol>

            <VCol cols="12">
              <AppDateTimePicker
                v-model="bulanTahun"
                label="Bulan dan Tahun *"
                prepend-inner-icon="ri-calendar-line"
                :config="monthYearPickerConfig"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol cols="12">
              <VTextarea
                v-model="keterangan"
                label="Keterangan (Opsional)"
                auto-grow
              />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end gap-3">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="dialog = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="primary"
            :loading="saving"
            :disabled="saving"
            @click="saveRekap"
          >
            Simpan Perubahan
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <VDialog
      v-model="actionDialog"
      width="500"
    >
      <VCard title="Hapus Rekap">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="actionDialog = false"
        />

        <VCardText>
          {{ deleteRekapMessage }}
        </VCardText>

        <VCardText class="d-flex justify-end gap-3">
          <VBtn
            variant="outlined"
            color="secondary"
            :disabled="actionLoading"
            @click="actionDialog = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="error"
            prepend-icon="ri-delete-bin-line"
            :loading="actionLoading"
            :disabled="actionLoading"
            @click="confirmDeleteRekap"
          >
            Hapus Rekap
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <VDialog
      v-model="lpjDialog"
      width="560"
    >
      <VCard title="Input LPJ">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="lpjDialog = false"
        />

        <VCardText>
          <div class="text-body-1 font-weight-medium mb-2">
            Apakah dana LPJ sama dengan RAB?
          </div>
          <div class="text-body-2 text-medium-emphasis">
            Detail LPJ akan disalin penuh dari RAB. Pilih edit detail jika nominal LPJ perlu disesuaikan.
          </div>
        </VCardText>

        <VCardText class="lpj-dialog-actions">
          <VBtn
            variant="outlined"
            color="secondary"
            :disabled="lpjLoading"
            @click="lpjDialog = false"
          >
            Batal
          </VBtn>
          <VBtn
            variant="tonal"
            color="warning"
            prepend-icon="ri-edit-box-line"
            :loading="lpjLoading"
            :disabled="lpjLoading"
            @click="submitLpj(false)"
          >
            Tidak, Edit Detail
          </VBtn>
          <VBtn
            color="success"
            prepend-icon="ri-check-line"
            :loading="lpjLoading"
            :disabled="lpjLoading"
            @click="submitLpj(true)"
          >
            Ya, Sama
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.detail-summary {
  display: grid;
  align-items: start;
  gap: 18px 22px;
  grid-template-areas:
    "main actions"
    "stats actions";
  grid-template-columns: minmax(0, 1fr) max-content;
}

.detail-main {
  grid-area: main;
  max-inline-size: 720px;
  min-inline-size: 0;
}

.detail-title {
  line-height: 1.24;
  overflow-wrap: anywhere;
}

.detail-side {
  display: contents;
}

.detail-stats {
  display: grid;
  grid-area: stats;
  align-items: stretch;
  gap: 12px;
  grid-template-columns: repeat(4, minmax(150px, 1fr));
  min-inline-size: 0;
}

.detail-stat {
  display: grid;
  min-block-size: 96px;
  min-inline-size: 0;
  align-content: center;
  border: 1px solid rgba(var(--v-border-color), 0.16);
  border-radius: 8px;
  padding: 10px 14px;
}

.detail-stat span {
  color: rgba(var(--v-theme-on-surface), 0.68);
  font-size: 0.78rem;
  font-weight: 600;
}

.detail-stat strong {
  color: rgba(var(--v-theme-on-surface), 0.92);
  font-size: 1rem;
}

.detail-stat small {
  color: rgba(var(--v-theme-on-surface), 0.58);
  font-size: 0.7rem;
}

.detail-actions {
  display: grid;
  grid-area: actions;
  grid-auto-columns: max-content;
  grid-auto-flow: column;
  justify-content: end;
  gap: 10px;
  padding-block-start: 20px;
}

.detail-actions :deep(.v-btn) {
  min-inline-size: 118px;
}

.detail-data-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
}

.lpj-dialog-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 1199px) {
  .detail-summary {
    grid-template-areas:
      "main actions"
      "stats stats";
    grid-template-columns: minmax(0, 1fr) max-content;
  }

  .detail-actions {
    padding-block-start: 0;
  }

  .detail-stats {
    grid-template-columns: repeat(4, minmax(120px, 1fr));
  }
}

@media (max-width: 959px) {
  .detail-summary {
    align-items: stretch;
    grid-template-areas:
      "main"
      "stats"
      "actions";
    grid-template-columns: 1fr;
  }

  .detail-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    justify-content: stretch;
    padding-block-start: 0;
  }

  .detail-actions :deep(.v-btn) {
    inline-size: 100%;
    min-inline-size: 0;
  }
}

@media (max-width: 599px) {
  .detail-data-header {
    display: grid;
    align-items: stretch;
    gap: 12px;
    grid-template-areas:
      "content"
      "append";
    grid-template-columns: 1fr;
  }

  .detail-data-header :deep(.v-card-item__content) {
    min-inline-size: 0;
  }

  .detail-data-header :deep(.v-card-title) {
    overflow: visible;
    white-space: normal;
  }

  .detail-data-header :deep(.v-card-item__append) {
    margin-inline-start: 0;
    padding-inline-start: 0;
  }

  .detail-data-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    inline-size: 100%;
  }

  .detail-data-actions :deep(.v-btn) {
    inline-size: 100%;
  }

  .detail-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .detail-stat {
    min-inline-size: 0;
    padding: 12px;
  }

  .detail-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lpj-dialog-actions :deep(.v-btn) {
    flex: 1 1 100%;
  }
}
</style>
