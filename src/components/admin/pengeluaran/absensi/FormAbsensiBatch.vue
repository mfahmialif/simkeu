<script setup>
/* eslint-disable camelcase, import/extensions */
import PengeluaranLampiranInput from "@/components/admin/pengeluaran/PengeluaranLampiranInput.vue"
import PengeluaranRekapSelect from "@/components/admin/pengeluaran/PengeluaranRekapSelect.vue"
import { formatRupiah } from "@/composables/formatRupiah"
import { showSnackbar } from "@/composables/snackbar"
import { appendLampiranFormData } from "@/utils/lampiran"
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect/index.js"
import "flatpickr/dist/plugins/monthSelect/style.css"

const props = defineProps({
  endpoint: {
    type: String,
    required: true,
  },
  basePath: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "Barokah Bulanan",
  },
  pegawaiTitle: {
    type: String,
    default: "Pegawai",
  },
  showPeriod: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()
const route = useRoute()
const refForm = ref(null)
const rekapId = ref(null)
const copyRekapId = ref(null)
const tanggal = ref(fDate(new Date()))
const periode = ref(null)
const bulan = ref(null)
const tahun = ref(null)
const jenisPembayaran = ref("CUZ BSI")
const jenisPembayaranList = ["CUZ BSI", "Transfer"]
const search = ref("")
const rows = ref([])
const currentPage = ref(1)
const rowsPerPage = ref(15)
const loading = ref(false)
const saving = ref(false)
const rowsPerPageOptions = [15, 30, 50]
const isBatchEdit = computed(() => route.query.edit_batch === "1")

const returnPath = computed(() => {
  const value = Array.isArray(route.query.return_to)
    ? route.query.return_to[0]
    : route.query.return_to

  return typeof value === "string" && value.startsWith(props.basePath)
    ? value
    : props.basePath
})

const normalizedSearch = computed(() => search.value.trim().toLowerCase())

const formTitle = computed(() => {
  const prefix = isBatchEdit.value ? "Edit Data" : "Tambah"

  return `${prefix} ${props.title}`
})

const periodeConfig = {
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

const filteredRows = computed(() => {
  if (!normalizedSearch.value) return rows.value

  return rows.value.filter(item => [
    item.kode,
    item.nama,
    item.prodi,
    item.status,
  ].some(value => String(value || "").toLowerCase().includes(normalizedSearch.value)))
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredRows.value.length / rowsPerPage.value)),
)

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value

  return filteredRows.value.slice(start, start + rowsPerPage.value)
})

const visibleRange = computed(() => {
  if (filteredRows.value.length === 0) return { start: 0, end: 0 }

  const start = ((currentPage.value - 1) * rowsPerPage.value) + 1

  return {
    start,
    end: Math.min(start + rowsPerPage.value - 1, filteredRows.value.length),
  }
})

const totalPegawai = computed(() => rows.value.filter(item =>
  rowGross(item) > 0,
).length)

const totalBarokah = computed(() => rows.value.reduce((total, item) =>
  total + rowTotal(item), 0,
))

const copiedRowsCount = computed(() => copyRekapId.value
  ? rows.value.filter(item => rowTotal(item) > 0).length
  : 0)

const emptyCopiedRowsCount = computed(() => copyRekapId.value
  ? rows.value.length - copiedRowsCount.value
  : 0)

const rowGross = item => Math.max(0, Number(item.total_barokah || 0))
const rowTotal = item => rowGross(item)

const selectedBuktiTransferFile = item => {
  if (Array.isArray(item.bukti_transfer)) return item.bukti_transfer[0] ?? null

  return item.bukti_transfer ?? null
}

const periodValue = (month, year) => month && year
  ? `${year}-${String(month).padStart(2, "0")}`
  : null

const syncPeriodParts = value => {
  if (!value) {
    bulan.value = null
    tahun.value = null

    return
  }

  const match = String(value).match(/^(\d{4})-(\d{1,2})/)
  if (match) {
    tahun.value = Number(match[1])
    bulan.value = Number(match[2])
  }
}

const setPeriodFromDate = value => {
  if (!props.showPeriod || periode.value || !value) return

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return

  periode.value = periodValue(date.getMonth() + 1, date.getFullYear())
}

const isImportSectionOpen = ref(true)
const webAbsensiLoading = ref(false)
const webAbsensiRows = ref([])
const webAbsensiPeriode = ref(null)
const importMode = ref("bulan_tahun")
const importModeOptions = [
  { title: "Bulan & Tahun", value: "bulan_tahun" },
  { title: "Rentang Tanggal", value: "range" },
]
const importDept = ref(null)
const importDeptOptions = [
  { title: "Semua Departemen", value: null },
  { title: "Dosen", value: "Dosen" },
  { title: "Staff", value: "Staff" },
  { title: "Admin", value: "Admin" },
]
const importBulan = ref(new Date().getMonth() + 1)
const importTahun = ref(new Date().getFullYear())
const importStartDate = ref(fDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)))
const importEndDate = ref(fDate(new Date()))
const importOptionHariJam = ref(true)
const importOptionBarokah = ref(true)

const bulanOptions = [
  { title: "Januari", value: 1 },
  { title: "Februari", value: 2 },
  { title: "Maret", value: 3 },
  { title: "April", value: 4 },
  { title: "Mei", value: 5 },
  { title: "Juni", value: 6 },
  { title: "Juli", value: 7 },
  { title: "Agustus", value: 8 },
  { title: "September", value: 9 },
  { title: "Oktober", value: 10 },
  { title: "November", value: 11 },
  { title: "Desember", value: 12 },
]

const fetchWebAbsensi = async () => {
  try {
    webAbsensiLoading.value = true
    webAbsensiRows.value = []
    webAbsensiPeriode.value = null

    const params = {
      mode: importMode.value,
    }

    if (importMode.value === "bulan_tahun") {
      params.bulan = importBulan.value
      params.tahun = importTahun.value
    } else {
      params.start_date = importStartDate.value
      params.end_date = importEndDate.value
    }

    if (importDept.value) {
      params.departemen = importDept.value
    }

    const response = await $api(`${props.endpoint}/web-absensi/rekap`, {
      method: "GET",
      params,
    })

    webAbsensiRows.value = response.data || []
    webAbsensiPeriode.value = response.periode || null
    showSnackbar({
      text: response.message || "Data dari Web Absensi berhasil dimuat.",
      color: "success",
    })
  } catch (err) {
    webAbsensiRows.value = []
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    webAbsensiLoading.value = false
  }
}

const findSimkeuMatch = webItem => {
  const kode = String(
    webItem?.user?.kode
    || webItem?.kode
    || webItem?.user?.kode_pegawai
    || webItem?.user?.nip
    || webItem?.user?.nik
    || webItem?.user?.kode_dosen
    || "",
  ).trim().toLowerCase()

  const username = String(webItem?.user?.username || "").trim().toLowerCase()
  const name = String(webItem?.user?.name || "").trim().toLowerCase()

  if (!rows.value || rows.value.length === 0) return null

  if (kode) {
    const matchByKode = rows.value.find(item =>
      String(item.kode || "").trim().toLowerCase() === kode,
    )
    if (matchByKode) return matchByKode
  }

  if (username) {
    const matchByUsername = rows.value.find(item =>
      String(item.kode || "").trim().toLowerCase() === username,
    )
    if (matchByUsername) return matchByUsername
  }

  if (name) {
    const matchByName = rows.value.find(item =>
      String(item.nama || "").trim().toLowerCase() === name,
    )
    if (matchByName) return matchByName
  }

  return null
}

const matchedWebAbsensiCount = computed(() => {
  if (!webAbsensiRows.value || webAbsensiRows.value.length === 0) return 0
  
  return webAbsensiRows.value.filter(item => findSimkeuMatch(item) !== null).length
})

const applyWebAbsensiToTable = () => {
  if (!webAbsensiRows.value || webAbsensiRows.value.length === 0) return
  if (!rows.value || rows.value.length === 0) {
    showSnackbar({
      text: "Pilih rekap tujuan terlebih dahulu untuk memuat daftar pegawai.",
      color: "warning",
    })
    
    return
  }

  let countApplied = 0
  webAbsensiRows.value.forEach(webItem => {
    const simkeuItem = findSimkeuMatch(webItem)
    if (simkeuItem) {
      if (importOptionHariJam.value) {
        const totalHari = Array.isArray(webItem?.rekap_per_kategori)
          ? webItem.rekap_per_kategori.reduce((acc, kat) => acc + Number(kat?.jumlah || 0), 0)
          : 0
        const totalJam = Number(webItem?.total_jam_keseluruhan?.total_jam || 0)

        simkeuItem.total_hari = totalHari
        simkeuItem.total_jam = totalJam
      }

      if (importOptionBarokah.value) {
        const totalDana = Number(webItem?.total_perolehan_dana || 0)
        simkeuItem.total_barokah = totalDana
      }

      countApplied++
    }
  })

  showSnackbar({
    text: `Berhasil menerapkan data dari Web Absensi ke ${countApplied} pegawai.`,
    color: "success",
  })
}

const errorMessage = err => {
  const message =
    err?.data?.message
    || err?.response?._data?.message
    || err?.response?.data?.message
    || err?.message

  if (typeof message === "object") {
    return Object.values(message).flat().join("; ")
  }

  return message || "Terjadi kesalahan."
}

const fetchRows = async () => {
  if (!rekapId.value) {
    rows.value = []
    currentPage.value = 1
    
    return
  }

  try {
    loading.value = true

    const response = await $api(`${props.endpoint}/form-data`, {
      method: "GET",
      body: {
        rekap_id: rekapId.value,
        ...(copyRekapId.value && { copy_rekap_id: copyRekapId.value }),
      },
    })

    rows.value = (response.data || []).map(item => ({
      ...item,
      total_hari: Number(item.total_hari || 0),
      total_jam: Number(item.total_jam || 0),
      total_barokah: Number(item.total_barokah || 0),
      jenis_pembayaran: isBatchEdit.value && item.pengeluaran_id
        ? item.jenis_pembayaran || jenisPembayaran.value
        : jenisPembayaran.value,
      bukti_transfer: null,
      existing_bukti_transfer_url: item.bukti_transfer_url || null,
      lampiran: [],
      existing_lampiran: item.lampiran || [],
      removed_lampiran: [],
    }))
    currentPage.value = 1
  } catch (err) {
    rows.value = []
    currentPage.value = 1
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  const validation = await refForm.value?.validate()
  if (!validation?.valid || saving.value) return

  try {
    saving.value = true

    const formData = new FormData()

    const submitRows = rows.value.filter(item =>
      rowGross(item) > 0 || item.pengeluaran_id,
    )

    if (submitRows.length === 0) {
      showSnackbar({
        text: "Isi minimal satu nominal sebelum menyimpan.",
        color: "warning",
      })

      return
    }

    formData.append("rekap_id", rekapId.value)
    formData.append("tanggal", tanggal.value)
    formData.append("jenis_pembayaran", jenisPembayaran.value)
    if (props.showPeriod) {
      formData.append("bulan", bulan.value)
      formData.append("tahun", tahun.value)
    }

    formData.append("items_json", JSON.stringify(submitRows.map(item => ({
      pegawai_id: item.pegawai_id,
      total_hari: Number(item.total_hari || 0),
      total_jam: Number(item.total_jam || 0),
      total_barokah: Number(item.total_barokah || 0),
      jenis_pembayaran: item.jenis_pembayaran || jenisPembayaran.value,
      hapus_lampiran: item.removed_lampiran || [],
    }))))

    submitRows.forEach((item, index) => {
      const prefix = `items[${index}]`

      const buktiTransferFile = selectedBuktiTransferFile(item)
      if (buktiTransferFile instanceof File) {
        formData.append(`${prefix}[bukti_transfer]`, buktiTransferFile)
      }
      appendLampiranFormData(
        formData,
        item.lampiran,
        [],
        prefix,
      )
    })

    const response = await $api(`${props.endpoint}/batch-store`, {
      method: "POST",
      body: formData,
    })

    showSnackbar({
      text: response.message,
      color: "success",
    })
    router.push(returnPath.value)
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    saving.value = false
  }
}

watch(rekapId, () => {
  search.value = ""
  if (String(copyRekapId.value) === String(rekapId.value)) {
    copyRekapId.value = null
  }
  fetchRows()
})

watch(copyRekapId, value => {
  if (value && String(value) === String(rekapId.value)) {
    copyRekapId.value = null
    showSnackbar({
      text: "Rekap sumber harus berbeda dari rekap tujuan.",
      color: "warning",
    })

    return
  }

  fetchRows()
})

watch(periode, newVal => {
  syncPeriodParts(newVal)
})

watch(tanggal, value => {
  setPeriodFromDate(value)
  if (value) {
    const d = new Date(value)
    if (!Number.isNaN(d.getTime())) {
      importBulan.value = d.getMonth() + 1
      importTahun.value = d.getFullYear()
      const firstDay = new Date(d.getFullYear(), d.getMonth(), 1)
      importStartDate.value = fDate(firstDay)
      importEndDate.value = fDate(d)
    }
  }
})

watch(jenisPembayaran, value => {
  if (rows.value.length === 0) return

  rows.value.forEach(item => {
    item.jenis_pembayaran = value
    if (value !== "Transfer") item.bukti_transfer = null
  })
})

watch(search, () => {
  currentPage.value = 1
})

watch(rowsPerPage, () => {
  currentPage.value = 1
})

watch(() => filteredRows.value.length, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

onMounted(() => {
  const queryRekapId = Array.isArray(route.query.rekap_id)
    ? route.query.rekap_id[0]
    : route.query.rekap_id

  if (queryRekapId) rekapId.value = Number(queryRekapId)
  setPeriodFromDate(tanggal.value)
  if (tanggal.value) {
    const d = new Date(tanggal.value)
    if (!Number.isNaN(d.getTime())) {
      importBulan.value = d.getMonth() + 1
      importTahun.value = d.getFullYear()
      const firstDay = new Date(d.getFullYear(), d.getMonth(), 1)
      importStartDate.value = fDate(firstDay)
      importEndDate.value = fDate(d)
    }
  }
})
</script>

<template>
  <VForm
    ref="refForm"
    @submit.prevent="onSubmit"
  >
    <VCard class="mb-6">
      <VCardItem>
        <VCardTitle>{{ formTitle }}</VCardTitle>
      </VCardItem>

      <VDivider />

      <VCardText>
        <VRow>
          <VCol cols="12">
            <PengeluaranRekapSelect
              v-model="rekapId"
              :endpoint="endpoint"
              label="Rekap Tujuan *"
              :rules="[requiredValidator]"
            />
          </VCol>

          <VCol cols="12">
            <PengeluaranRekapSelect
              v-model="copyRekapId"
              :endpoint="endpoint"
              label="Salin Nominal dari Rekap"
              :allow-create="false"
            />
            <div
              v-if="copyRekapId"
              class="text-caption text-medium-emphasis mt-1"
            >
              {{ copiedRowsCount }} pegawai memakai nominal rekap sumber, {{ emptyCopiedRowsCount }} pegawai lainnya tetap Rp 0.
            </div>
          </VCol>

          <VCol
            cols="12"
            :md="showPeriod ? 4 : 6"
          >
            <AppDateTimePicker
              v-model="tanggal"
              label="Tanggal *"
              :rules="[requiredValidator]"
              :config="{
                altInput: true,
                altFormat: 'F j, Y',
                dateFormat: 'Y-m-d',
              }"
            />
          </VCol>

          <VCol
            v-if="showPeriod"
            cols="12"
            md="4"
          >
            <AppDateTimePicker
              v-model="periode"
              label="Periode Bulan/Tahun *"
              placeholder="Pilih bulan dan tahun"
              :rules="[requiredValidator]"
              :config="periodeConfig"
            />
          </VCol>

          <VCol
            cols="12"
            :md="showPeriod ? 4 : 6"
          >
            <VSelect
              v-model="jenisPembayaran"
              label="Default Jenis Pembayaran *"
              :items="jenisPembayaranList"
              :rules="[requiredValidator]"
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Section Import Web Absensi -->
    <VCard class="mb-6">
      <VCardItem class="pb-3">
        <template #append>
          <VBtn
            variant="text"
            color="secondary"
            :icon="isImportSectionOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"
            @click="isImportSectionOpen = !isImportSectionOpen"
          />
        </template>
        <VCardTitle
          class="d-flex align-center gap-2 text-wrap"
          style="white-space: normal; line-height: 1.4;"
        >
          <VIcon
            icon="ri-download-cloud-2-line"
            color="primary"
            size="24"
            class="flex-shrink-0"
          />
          <span class="font-weight-bold">IMPORT DATA DARI WEB ABSENSI</span>
        </VCardTitle>
        <VCardSubtitle
          class="text-wrap mt-1"
          style="white-space: normal;"
        >
          Ambil data rekap kehadiran dari web absensi dan terapkan otomatis ke daftar pegawai di bawah.
        </VCardSubtitle>
      </VCardItem>

      <VExpandTransition>
        <div v-show="isImportSectionOpen">
          <VDivider />

          <VCardText>
            <VRow class="align-center">
              <VCol
                cols="12"
                sm="6"
                md="3"
              >
                <VSelect
                  v-model="importMode"
                  :items="importModeOptions"
                  label="Mode *"
                  density="compact"
                  hide-details
                />
              </VCol>

              <template v-if="importMode === 'bulan_tahun'">
                <VCol
                  cols="12"
                  sm="6"
                  md="3"
                >
                  <VSelect
                    v-model="importBulan"
                    :items="bulanOptions"
                    label="Bulan *"
                    density="compact"
                    hide-details
                  />
                </VCol>

                <VCol
                  cols="12"
                  sm="6"
                  md="3"
                >
                  <VTextField
                    v-model.number="importTahun"
                    label="Tahun *"
                    type="number"
                    density="compact"
                    hide-details
                  />
                </VCol>
              </template>

              <template v-else>
                <VCol
                  cols="12"
                  sm="6"
                  md="3"
                >
                  <AppDateTimePicker
                    v-model="importStartDate"
                    label="Tanggal Mulai *"
                    density="compact"
                    hide-details
                    :config="{
                      altInput: true,
                      altFormat: 'j F Y',
                      dateFormat: 'Y-m-d',
                    }"
                  />
                </VCol>

                <VCol
                  cols="12"
                  sm="6"
                  md="3"
                >
                  <AppDateTimePicker
                    v-model="importEndDate"
                    label="Tanggal Selesai *"
                    density="compact"
                    hide-details
                    :config="{
                      altInput: true,
                      altFormat: 'j F Y',
                      dateFormat: 'Y-m-d',
                    }"
                  />
                </VCol>
              </template>

              <VCol
                cols="12"
                sm="6"
                md="3"
              >
                <VSelect
                  v-model="importDept"
                  :items="importDeptOptions"
                  label="Departemen"
                  density="compact"
                  clearable
                  hide-details
                />
              </VCol>

              <VCol
                cols="12"
                class="d-flex justify-end mt-2"
              >
                <VBtn
                  color="primary"
                  prepend-icon="ri-download-cloud-2-line"
                  :loading="webAbsensiLoading"
                  :disabled="webAbsensiLoading"
                  @click="fetchWebAbsensi"
                >
                  Ambil Data dari Web Absensi
                </VBtn>
              </VCol>
            </VRow>
          </VCardText>

          <template v-if="webAbsensiRows.length > 0">
            <VDivider />

            <div class="pa-4 d-flex flex-wrap align-center justify-space-between gap-4">
              <div>
                <div class="font-weight-medium text-body-1">
                  Hasil Rekap: {{ webAbsensiRows.length }} Data Pegawai Ditemukan
                </div>
                <div
                  v-if="webAbsensiPeriode"
                  class="text-caption text-medium-emphasis"
                >
                  Periode: {{ webAbsensiPeriode.start_date }} s/d {{ webAbsensiPeriode.end_date }}
                </div>
              </div>

              <div class="d-flex flex-wrap align-center gap-4">
                <VCheckbox
                  v-model="importOptionHariJam"
                  label="Isi Total Hari & Jam"
                  density="compact"
                  hide-details
                />
                <VCheckbox
                  v-model="importOptionBarokah"
                  label="Isi Total Barokah (Nominal)"
                  density="compact"
                  hide-details
                />
                <VBtn
                  color="success"
                  prepend-icon="ri-check-double-line"
                  :disabled="matchedWebAbsensiCount === 0 || (!importOptionHariJam && !importOptionBarokah)"
                  @click="applyWebAbsensiToTable"
                >
                  Terapkan ke Daftar Pegawai ({{ matchedWebAbsensiCount }} Cocok)
                </VBtn>
              </div>
            </div>

            <VDivider />

            <div
              class="table-responsive"
              style="max-block-size: 380px; overflow-y: auto;"
            >
              <VTable
                density="compact"
                class="text-no-wrap"
              >
                <thead>
                  <tr>
                    <th>NO</th>
                    <th>PEGAWAI WEB ABSENSI</th>
                    <th>KATEGORI / RINCIAN</th>
                    <th class="text-center">TOTAL HARI</th>
                    <th class="text-center">TOTAL JAM</th>
                    <th class="text-end">NOMINAL DANA</th>
                    <th>STATUS DI SIMKEU</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(webItem, index) in webAbsensiRows"
                    :key="webItem.user?.id || index"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>
                      <div class="font-weight-medium">{{ webItem.user?.name || '-' }}</div>
                      <div class="text-caption text-medium-emphasis">
                        <strong
                          v-if="webItem.user?.kode || webItem.kode"
                          class="text-primary mr-1"
                        >
                          {{ webItem.user?.kode || webItem.kode }}
                        </strong>
                        <span v-if="webItem.user?.username && webItem.user.username !== (webItem.user?.kode || webItem.kode)">
                          ({{ webItem.user.username }})
                        </span>
                        <span v-else-if="!(webItem.user?.kode || webItem.kode) && webItem.user?.username">
                          {{ webItem.user.username }}
                        </span>
                        <span v-if="webItem.user?.departemen"> · {{ webItem.user?.departemen }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex flex-column gap-1 py-1">
                        <template v-if="webItem.rekap_per_kategori && webItem.rekap_per_kategori.length">
                          <span
                            v-for="kat in webItem.rekap_per_kategori.filter(k => k.jumlah > 0)"
                            :key="kat.kategori_id"
                            class="text-caption"
                          >
                            • {{ kat.nama }}: <strong>{{ kat.jumlah }}x</strong> ({{ formatRupiah(kat.perolehan_dana) }})
                          </span>
                        </template>
                        <span
                          v-else
                          class="text-caption text-disabled"
                        >-</span>
                      </div>
                    </td>
                    <td class="text-center font-weight-medium">
                      {{
                        Array.isArray(webItem.rekap_per_kategori)
                          ? webItem.rekap_per_kategori.reduce((acc, k) => acc + Number(k.jumlah || 0), 0)
                          : 0
                      }} hari
                    </td>
                    <td class="text-center font-weight-medium">
                      {{ webItem.total_jam_keseluruhan?.format_teks || `${webItem.total_jam_keseluruhan?.total_jam || 0} jam` }}
                    </td>
                    <td class="text-end font-weight-medium text-primary">
                      {{ formatRupiah(webItem.total_perolehan_dana || 0) }}
                    </td>
                    <td>
                      <VChip
                        v-if="findSimkeuMatch(webItem)"
                        color="success"
                        size="small"
                        label
                      >
                        <VIcon
                          icon="ri-check-line"
                          start
                          size="14"
                        />
                        Cocok: {{ findSimkeuMatch(webItem).nama }}
                      </VChip>
                      <VChip
                        v-else
                        color="warning"
                        size="small"
                        label
                      >
                        <VIcon
                          icon="ri-error-warning-line"
                          start
                          size="14"
                        />
                        Tidak Ditemukan
                      </VChip>
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </div>
          </template>

          <div
            v-else-if="!webAbsensiLoading"
            class="text-center pa-6 text-medium-emphasis text-body-2"
          >
            Klik <strong>"Ambil Data dari Web Absensi"</strong> untuk memuat rekap kehadiran pegawai.
          </div>
        </div>
      </VExpandTransition>
    </VCard>

    <VCard>
      <VCardItem>
        <div class="d-flex flex-wrap align-center gap-3">
          <div>
            <VCardTitle>Daftar {{ pegawaiTitle }}</VCardTitle>
            <VCardSubtitle v-if="rekapId">
              {{ totalPegawai }} {{ pegawaiTitle.toLowerCase() }} diisi, dibayarkan {{ formatRupiah(totalBarokah) }}
              <span v-if="totalPotonganPiutang > 0">
                , potongan piutang {{ formatRupiah(totalPotonganPiutang) }}
              </span>
            </VCardSubtitle>
          </div>

          <VSpacer />

          <VTextField
            v-if="rekapId"
            v-model="search"
            prepend-inner-icon="ri-search-line"
            placeholder="Cari NIY, nama, atau prodi"
            clearable
            hide-details
            class="dosen-search"
          />
        </div>
      </VCardItem>

      <VDivider />

      <div
        v-if="!rekapId"
        class="empty-state"
      >
        <VIcon
          icon="ri-folder-open-line"
          size="36"
        />
        <span>Pilih rekap tujuan untuk menampilkan semua dosen.</span>
      </div>

      <div
        v-else-if="loading"
        class="empty-state"
      >
        <VProgressCircular
          indeterminate
          color="primary"
        />
        <span>Memuat daftar pegawai...</span>
      </div>

      <div
        v-else
        class="dosen-list"
      >
        <div class="dosen-list-header">
          <span>{{ pegawaiTitle }}</span>
          <span>Total Hari</span>
          <span>Total Jam</span>
          <span>Total Barokah</span>
          <span>Jenis Pembayaran</span>
          <span>Berkas</span>
        </div>

        <div
          v-for="item in paginatedRows"
          :key="item.pegawai_id"
          class="dosen-row has-bukti-transfer"
        >
          <div class="dosen-identity">
            <div class="font-weight-medium">
              {{ item.nama }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ item.kode || "-" }}<span v-if="item.prodi"> · {{ item.prodi }}</span>
            </div>
            <VChip
              v-if="item.status && item.status !== 'aktif'"
              color="warning"
              size="x-small"
              label
              class="mt-1"
            >
              {{ item.status }}
            </VChip>
          </div>

          <VTextField
            v-model.number="item.total_hari"
            type="number"
            min="0"
            label="Total Hari"
            hint="Hari"
            persistent-hint
            density="compact"
          />

          <VTextField
            v-model.number="item.total_jam"
            type="number"
            step="0.01"
            min="0"
            label="Total Jam"
            hint="Jam"
            persistent-hint
            density="compact"
          />

          <VTextField
            v-model.number="item.total_barokah"
            type="number"
            min="0"
            label="Total Barokah"
            :hint="formatRupiah(item.total_barokah)"
            persistent-hint
            density="compact"
          />


          <VSelect
            v-model="item.jenis_pembayaran"
            :items="jenisPembayaranList"
            label="Jenis"
            density="compact"
            hide-details
          />

          <div
            class="row-files-cell"
            :class="{ 'is-transfer': item.jenis_pembayaran === 'Transfer' }"
          >
            <div
              v-if="item.jenis_pembayaran === 'Transfer'"
              class="transfer-file-cell"
            >
              <VFileInput
                v-model="item.bukti_transfer"
                :prepend-icon="null"
                label="Bukti transfer"
                accept="image/png, image/jpeg, application/pdf"
                density="compact"
                hide-details
              />
              <VTooltip
                v-if="item.existing_bukti_transfer_url"
                text="Lihat bukti transfer"
                location="top"
              >
                <template #activator="{ props: tooltipProps }">
                  <VBtn
                    v-bind="tooltipProps"
                    :href="item.existing_bukti_transfer_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="tonal"
                    color="primary"
                    icon="ri-file-paper-2-line"
                    size="small"
                  />
                </template>
              </VTooltip>
            </div>

            <div class="row-lampiran-cell">
              <PengeluaranLampiranInput
                v-model="item.lampiran"
                v-model:removed-lampiran="item.removed_lampiran"
                :existing-lampiran="item.existing_lampiran"
                compact
              />
            </div>
          </div>

        </div>

        <div
          v-if="filteredRows.length === 0"
          class="empty-state"
        >
          <VIcon
            icon="ri-search-line"
            size="32"
          />
          <span>{{ pegawaiTitle }} tidak ditemukan.</span>
        </div>

        <div
          v-if="filteredRows.length > 0"
          class="dosen-pagination"
        >
          <div class="text-body-2 text-medium-emphasis">
            Menampilkan {{ visibleRange.start }}-{{ visibleRange.end }} dari {{ filteredRows.length }}
          </div>

          <div class="dosen-pagination-controls">
            <VSelect
              v-model="rowsPerPage"
              :items="rowsPerPageOptions"
              label="Baris"
              density="compact"
              hide-details
              class="rows-per-page"
            />
            <VPagination
              v-if="totalPages > 1"
              v-model="currentPage"
              :length="totalPages"
              :total-visible="5"
              density="compact"
            />
          </div>
        </div>
      </div>

      <VDivider v-if="rekapId && !loading" />

      <VCardActions
        v-if="rekapId && !loading"
        class="pa-5"
      >
        <VBtn
          variant="outlined"
          color="secondary"
          prepend-icon="ri-arrow-left-line"
          @click="router.push(returnPath)"
        >
          Batal
        </VBtn>
        <VSpacer />
        <VBtn
          type="submit"
          color="primary"
          prepend-icon="ri-save-line"
          :loading="saving"
          :disabled="saving || rows.length === 0"
        >
          Simpan {{ totalPegawai }} {{ pegawaiTitle }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VForm>
</template>

<style scoped>
.dosen-search {
  max-inline-size: 420px;
  min-inline-size: min(100%, 280px);
}

.dosen-list-header,
.dosen-row {
  display: grid;
  grid-template-columns: minmax(190px, 1.1fr) minmax(90px, 0.45fr) minmax(90px, 0.45fr) minmax(125px, 0.65fr) minmax(135px, 0.65fr) minmax(280px, 1.35fr);
  gap: 12px;
  align-items: start;
}

.dosen-list-header {
  padding: 12px 24px;
  background: rgba(var(--v-theme-on-surface), 0.04);
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-size: 0.8125rem;
  font-weight: 600;
}

.dosen-row {
  min-block-size: 104px;
  padding: 16px 24px;
  border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.dosen-row:last-child {
  border-block-end: 0;
}

.dosen-identity {
  min-inline-size: 0;
}


.row-files-cell {
  display: grid;
  min-inline-size: 0;
}

.row-files-cell.is-transfer {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 8px;
}

.transfer-file-cell {
  display: grid;
  align-items: center;
  gap: 4px;
  grid-template-columns: minmax(0, 1fr) max-content;
}

.row-lampiran-cell {
  min-inline-size: 0;
}


.dosen-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
}

.dosen-pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rows-per-page {
  inline-size: 100px;
}

.empty-state {
  display: flex;
  min-block-size: 180px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

@media (max-width: 959px) {
  .dosen-list-header {
    display: none;
  }

  .dosen-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dosen-identity {
    grid-column: 1 / -1;
  }
}

@media (max-width: 599px) {
  .dosen-search {
    max-inline-size: none;
    inline-size: 100%;
  }

  .dosen-row {
    grid-template-columns: minmax(0, 1fr);
    padding: 16px;
  }

  .dosen-identity {
    grid-column: auto;
  }


  .dosen-pagination,
  .dosen-pagination-controls {
    align-items: stretch;
    flex-direction: column;
  }

  .rows-per-page {
    inline-size: 100%;
  }
}
</style>
