<script setup>
import PengeluaranLampiranInput from "@/components/admin/pengeluaran/PengeluaranLampiranInput.vue"
import { formatRupiah } from "@/composables/formatRupiah"
import { showSnackbar } from "@/composables/snackbar"

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
})

const route = useRoute()
const router = useRouter()
const rekapId = computed(() => route.params.id)
const rekap = ref(null)
const lpj = ref(null)
const rows = ref([])
const items = ref([]) // For rumah tangga

const flatRows = computed(() => {
  if (isRumahTangga.value) {
    const flat = []

    items.value.forEach(item => {
      item.subItems.forEach(sub => {
        flat.push({ ...sub, kelompok_anggaran: item.kelompok_anggaran })
      })
    })
    
    return flat
  }
  
  return rows.value
})

const pegawaiItems = ref([])
const loading = ref(true)
const loadingPegawai = ref(false)
const saving = ref(false)
const mobileSummaryHidden = ref(false)

const returnPath = computed(() => {
  const value = Array.isArray(route.query.return_to)
    ? route.query.return_to[0]
    : route.query.return_to

  if (
    typeof value === "string"
    && (value.startsWith(props.basePath) || value.startsWith("/admin/laporan/rab"))
  ) {
    return value
  }

  return `${props.basePath}/rekap/${rekapId.value}`
})

const detailRekapPath = computed(() => `${props.basePath}/rekap/${rekapId.value}`)

const isTatapmuka = computed(() => props.moduleType === "tatapmuka")
const isKegiatan = computed(() => props.moduleType === "kegiatan")
const isRumahTangga = computed(() => props.moduleType === "rumah-tangga")
const isDosenBulanan = computed(() => props.moduleType === "dosen-bulanan")
const isStaffBulanan = computed(() => props.moduleType === "bulanan")

const currentDateValue = () => {
  const date = new Date()

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

const defaultRowDate = () => rekap.value?.tanggal_rekap || currentDateValue()
const numberValue = value => Number(value || 0)
const factorValue = value => (value === null || value === "" || value === undefined ? 1 : Number(value || 0))
const selectedFileSafeArray = value => (Array.isArray(value) ? value : [])

const kelompokAnggaranItems = computed(() => Array.from(new Set(
  flatRows.value
    .map(row => String(row.kelompok_anggaran || "").trim())
    .filter(Boolean),
)).sort((a, b) => a.localeCompare(b, "id-ID")))

const newRow = () => {
  const base = {
    key: `${Date.now()}-${Math.random()}`,
    rab_detail_id: null,
    tanggal: defaultRowDate(),
    pegawai_id: null,
    jenis_pembayaran: "CUS BSI",
    keterangan: "",
    lampiran: [],
  }

  if (isTatapmuka.value) {
    return {
      ...base,
      hari_transport_motor: 0,
      hari_transport_mobil: 0,
      transport_motor: 0,
      transport_mobil: 0,
      jam: 0,
      jam_mengajar_double_degree: 0,
      barokah_mengajar_biasa: 0,
      barokah_mengajar_double_degree: 0,
      barokah_uas: 0,
      jumlah_mahasiswa_uas: 0,
      barokah_sempro: 0,
      jam_sempro: 0,
      keterangan_sempro: "",
    }
  }

  if (isKegiatan.value) {
    return {
      ...base,
      kategori_detail: "pegawai",
      nama_kegiatan: rekap.value?.nama || "",
      transport: 0,
      barokah: 0,
      nominal: 0,
    }
  }

  if (isRumahTangga.value) {
    return {
      ...base,
      nama_kegiatan: rekap.value?.nama || "",
      nominal: 0,
      jumlah: null,
      volume: null,
      jenis_pembayaran: "Tunai",
    }
  }

  if (isDosenBulanan.value) {
    return {
      ...base,
      barokah_dosen_tetap: 0,
      barokah_struktural: 0,
    }
  }

  return {
    ...base,
    hari: 0,
    barokah_harian: 0,
    barokah_bulanan: 0,
  }
}

const rowTotal = row => {
  if (isTatapmuka.value) {
    return Math.round(
      (numberValue(row.transport_motor) * numberValue(row.hari_transport_motor))
      + (numberValue(row.transport_mobil) * numberValue(row.hari_transport_mobil))
      + (numberValue(row.barokah_mengajar_biasa) * numberValue(row.jam))
      + (numberValue(row.barokah_mengajar_double_degree) * numberValue(row.jam_mengajar_double_degree || row.jam))
      + (numberValue(row.barokah_uas) * numberValue(row.jumlah_mahasiswa_uas))
      + (numberValue(row.barokah_sempro) * numberValue(row.jam_sempro || (row.barokah_sempro ? 1 : 0))),
    )
  }

  if (isKegiatan.value) {
    return row.kategori_detail === "non_pegawai"
      ? Math.round(numberValue(row.nominal))
      : Math.round(numberValue(row.transport) + numberValue(row.barokah))
  }

  if (isRumahTangga.value) {
    return Math.round(numberValue(row.nominal) * factorValue(row.jumlah) * factorValue(row.volume))
  }

  if (isDosenBulanan.value) {
    return Math.round(numberValue(row.barokah_dosen_tetap) + numberValue(row.barokah_struktural))
  }

  return Math.round((numberValue(row.barokah_harian) * numberValue(row.hari)) + numberValue(row.barokah_bulanan))
}

const rabTotal = computed(() => Number(rekap.value?.jumlah || 0))
const lpjTotal = computed(() => flatRows.value.reduce((sum, row) => sum + rowTotal(row), 0))
const selisih = computed(() => rabTotal.value - lpjTotal.value)

const summaryItems = computed(() => [
  { label: "Total RAB", value: rabTotal.value },
  { label: "Total LPJ", value: lpjTotal.value },
  { label: "Selisih RAB - LPJ", value: selisih.value, total: true },
])

const selisihColor = computed(() => {
  if (selisih.value === 0) return "success"

  return selisih.value > 0 ? "warning" : "error"
})

const formatDate = value => {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})/)

  if (!match) return "-"

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
}

const pegawaiDisplay = item => [
  item.kode,
  item.nama,
  item.dosen?.prodi?.nama || item.dosen?.prodi?.alias || item.staff?.jabatan,
].filter(Boolean).join(" - ")

const pegawaiForRow = () => {
  if (isTatapmuka.value || isDosenBulanan.value) {
    return pegawaiItems.value.filter(item => item.tipe === "dosen")
  }

  if (isStaffBulanan.value) {
    return pegawaiItems.value.filter(item => item.tipe === "staff")
  }

  return pegawaiItems.value
}

const isPegawaiKegiatan = row => row.kategori_detail !== "non_pegawai"

const paymentItems = row => (
  isRumahTangga.value
    ? ["Tunai", "Transfer"]
    : isKegiatan.value && !isPegawaiKegiatan(row)
      ? ["Tunai", "CUS BSI", "Transfer"]
      : ["CUS BSI", "Transfer"]
)

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

const detailToRow = item => ({
  ...newRow(),
  ...item,
  key: `lpj-${item.id}`,
  pegawai_id: item.pegawai_id || null,
  kategori_detail: item.kategori_detail || "pegawai",
  jenis_pembayaran: item.jenis_pembayaran || (
    isRumahTangga.value || item.kategori_detail === "non_pegawai" ? "Tunai" : "CUS BSI"
  ),
  lampiran: selectedFileSafeArray(item.lampiran),
})

const fetchData = async () => {
  try {
    loading.value = true

    const response = await $api(`${props.endpoint}/rekap/${rekapId.value}/lpj`, {
      method: "GET",
    })

    rekap.value = response.data?.rekap || null
    lpj.value = response.data?.lpj || null

    const details = response.data?.details || []
    if (isRumahTangga.value) {
      const grouped = {}

      details.forEach(detail => {
        const key = detail.kelompok_anggaran || ""
        if (!grouped[key]) grouped[key] = []
        grouped[key].push(detailToRow(detail))
      })

      const newItems = []

      Object.keys(grouped).forEach(kegiatan => {
        newItems.push({
          key: `item-${Date.now()}-${Math.random()}`,
          kelompok_anggaran: kegiatan,
          subItems: grouped[kegiatan],
        })
      })
      items.value = newItems.length ? newItems : [{ key: `item-${Date.now()}-${Math.random()}`, kelompok_anggaran: "", subItems: [newRow()] }]
    } else {
      rows.value = details.length ? details.map(detailToRow) : [newRow()]
    }
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    loading.value = false
  }
}

const fetchPegawai = async () => {
  try {
    loadingPegawai.value = true

    const response = await $api("/admin/pegawai", {
      method: "GET",
      body: {
        limit: 0,
        sort_key: "nama",
        sort_order: "asc",
      },
    })

    pegawaiItems.value = (response.data?.data || []).map(item => ({
      ...item,
      display: pegawaiDisplay(item),
    }))
  } catch {
    showSnackbar({
      text: "Gagal mendapatkan daftar pegawai.",
      color: "error",
    })
  } finally {
    loadingPegawai.value = false
  }
}

const addItem = () => {
  items.value.push({ key: `item-${Date.now()}-${Math.random()}`, kelompok_anggaran: "", subItems: [newRow()] })
}

const removeItem = index => {
  if (items.value.length === 1) {
    items.value[0] = { key: `item-${Date.now()}-${Math.random()}`, kelompok_anggaran: "", subItems: [newRow()] }
    
    return
  }
  items.value.splice(index, 1)
}

const addSubItem = (item, index = item.subItems.length - 1) => {
  item.subItems.splice(index + 1, 0, newRow())
}

const duplicateSubItem = (item, index) => {
  const source = item.subItems[index] || newRow()

  const duplicated = {
    ...newRow(),
    ...Object.fromEntries(Object.entries(source).filter(([key]) => !["id", "key", "rab_detail_id", "lampiran"].includes(key))),
    key: `${Date.now()}-${Math.random()}`,
    rab_detail_id: null,
    lampiran: [],
  }

  item.subItems.splice(index + 1, 0, duplicated)
}

const removeSubItem = (item, index) => {
  if (item.subItems.length === 1) {
    item.subItems[0] = newRow()
    
    return
  }
  item.subItems.splice(index, 1)
}

const addRow = (index = rows.value.length - 1) => {
  rows.value.splice(index + 1, 0, newRow())
}

const duplicateRow = index => {
  const source = rows.value[index] || newRow()

  const duplicated = {
    ...newRow(),
    ...Object.fromEntries(Object.entries(source).filter(([key]) => ![
      "id",
      "key",
      "rab_detail_id",
      "lampiran",
    ].includes(key))),
    key: `${Date.now()}-${Math.random()}`,
    rab_detail_id: null,
    lampiran: [],
  }

  rows.value.splice(index + 1, 0, duplicated)
}

const removeRow = index => {
  if (rows.value.length === 1) {
    rows.value[0] = newRow()
    
    return
  }

  rows.value.splice(index, 1)
}

const onKategoriChange = row => {
  if (row.kategori_detail === "non_pegawai") {
    row.pegawai_id = null
    row.transport = 0
    row.barokah = 0
    row.jenis_pembayaran = "Tunai"
    
    return
  }

  row.nominal = 0
  row.jenis_pembayaran = "CUS BSI"
}

const validateRows = () => {
  if (isRumahTangga.value) {
    for (let i = 0; i < items.value.length; i++) {
      const item = items.value[i]
      if (!String(item.kelompok_anggaran || "").trim()) return `Item Kelompok Anggaran ke-${i + 1} harus diisi.`
      for (let j = 0; j < item.subItems.length; j++) {
        const row = item.subItems[j]
        const label = `Item ke-${i + 1} Sub-item ${j + 1}`
        if (!row.tanggal) return `${label}: tanggal wajib diisi.`
        if (!String(row.nama_kegiatan || "").trim()) return `${label}: uraian wajib diisi.`
      }
    }
    
    return null
  }

  for (let index = 0; index < rows.value.length; index += 1) {
    const row = rows.value[index]
    const label = `Baris ${index + 1}`

    if (!row.tanggal) return `${label}: tanggal wajib diisi.`
    if (isRumahTangga.value && !String(row.nama_kegiatan || "").trim()) {
      return `${label}: uraian wajib diisi.`
    }
    if (!isKegiatan.value || isPegawaiKegiatan(row)) {
      if (isRumahTangga.value) continue
      if (!row.pegawai_id) return `${label}: pegawai wajib dipilih.`
    }
  }

  return null
}

const submit = async () => {
  if (saving.value) return

  const validationMessage = validateRows()
  if (validationMessage) {
    showSnackbar({
      text: validationMessage,
      color: "warning",
    })
    
    return
  }

  try {
    saving.value = true

    const response = await $api(`${props.endpoint}/rekap/${rekapId.value}/lpj`, {
      method: "PUT",
      body: {
        items: flatRows.value,
      },
    })

    showSnackbar({
      text: response.message,
      color: "success",
    })
    await fetchData()
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  document.title = `Detail LPJ ${props.title} - SIMKEU`
  if (!isRumahTangga.value) {
    fetchPegawai()
  }
  fetchData()
})
</script>

<template>
  <div
    class="page-with-floating-footer"
    :class="{ 'is-summary-hidden': mobileSummaryHidden }"
  >
    <div class="lpj-page-actions mb-5">
      <VBtn
        variant="outlined"
        color="secondary"
        prepend-icon="ri-arrow-left-line"
        @click="router.push(returnPath)"
      >
        Kembali
      </VBtn>

      <VBtn
        variant="tonal"
        color="primary"
        prepend-icon="ri-file-list-3-line"
        @click="router.push(detailRekapPath)"
      >
        Detail Rekap
      </VBtn>
    </div>

    <VCard class="mb-5">
      <VCardText>
        <div class="lpj-header">
          <div class="min-w-0">
            <div class="text-h5 font-weight-semibold">
              LPJ {{ rekap?.nama || title }}
            </div>
            <div class="text-body-2 text-medium-emphasis mt-1">
              Tanggal rekap {{ formatDate(rekap?.tanggal_rekap) }}
            </div>
            <div
              v-if="lpj?.sama_dengan_rab"
              class="text-success text-caption font-weight-medium mt-1"
            >
              LPJ ditandai sama dengan RAB.
            </div>
          </div>

          <div class="lpj-summary-cards">
            <div class="lpj-summary-card">
              <span>Total RAB</span>
              <strong>{{ formatRupiah(rabTotal) }}</strong>
            </div>
            <div class="lpj-summary-card">
              <span>Total LPJ</span>
              <strong>{{ formatRupiah(lpjTotal) }}</strong>
            </div>
            <div class="lpj-summary-card">
              <span>Selisih</span>
              <strong :class="`text-${selisihColor}`">{{ formatRupiah(selisih) }}</strong>
            </div>
          </div>
        </div>
      </VCardText>
    </VCard>

    <VCard>
      <VCardItem>
        <VCardTitle>Detail LPJ</VCardTitle>
        <VCardSubtitle>
          {{ loading ? "Memuat data..." : `${flatRows.length} sub-item, total ${formatRupiah(lpjTotal)}` }}
        </VCardSubtitle>

        <template #append>
          <VBtn
            color="primary"
            prepend-icon="ri-add-line"
            @click="addRow"
          >
            Tambah Baris
          </VBtn>
        </template>
      </VCardItem>

      <VDivider />

      <VCardText
        v-if="loading"
        class="text-center pa-8"
      >
        <VProgressCircular
          indeterminate
          color="primary"
          class="mb-3"
        />
        <div>Memuat detail LPJ...</div>
      </VCardText>

      <VCardText
        v-else
        class="pa-0"
      >
        <template v-if="isRumahTangga">
          <div
            v-for="(item, itemIndex) in items"
            :key="item.key"
            class="mb-5"
          >
            <VCard
              class="item-card border-none"
              elevation="0"
              rounded="0"
              style="border: 1px solid rgba(var(--v-theme-primary), 0.16);"
            >
              <VCardItem class="bg-primary-lighten-4 pt-4 pb-2 border-b">
                <VRow align="center">
                  <VCol cols="auto">
                    <div class="uraian-letter">{{ String.fromCharCode(65 + itemIndex) }}</div>
                  </VCol>
                  <VCol>
                    <VCombobox
                      v-model="item.kelompok_anggaran"
                      :items="kelompokAnggaranItems"
                      class="mt-1"
                      label="Kelompok Anggaran *"
                      density="compact"
                      hide-details
                      :rules="[requiredValidator]"
                      clearable
                    />
                  </VCol>
                  <VCol
                    cols="auto"
                    class="ml-auto text-right"
                  >
                    <VTooltip
                      text="Hapus Uraian"
                      location="top"
                    >
                      <template #activator="{ props: tooltipProps }">
                        <VBtn
                          v-bind="tooltipProps"
                          icon="ri-delete-bin-line"
                          color="error"
                          variant="text"
                          size="small"
                          @click="removeItem(itemIndex)"
                        />
                      </template>
                    </VTooltip>
                  </VCol>
                </VRow>
              </VCardItem>
              <VCardText class="pa-0">
                <div
                  v-for="(row, rowIndex) in item.subItems"
                  :key="row.key"
                  class="lpj-row"
                >
                  <div class="lpj-row-number">
                    {{ rowIndex + 1 }}
                  </div>
                  <div class="lpj-row-content">
                    <VRow>
                      <VCol
                        cols="12"
                        md="2"
                      >
                        <AppDateTimePicker
                          v-model="row.tanggal"
                          label="Tanggal *"
                          :config="{ altInput: true, altFormat: 'd F Y', dateFormat: 'Y-m-d' }"
                          density="compact"
                          hide-details
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        md="3"
                      >
                        <VTextField
                          v-model="row.nama_kegiatan"
                          label="Input Uraian (Pengeluaran) *"
                          density="compact"
                          hide-details
                          :rules="[requiredValidator]"
                          placeholder="Contoh: Pembelian Alat Kebersihan"
                        />
                      </VCol>
                      <VCol cols="12" md="3">
                        <div class="d-flex" style="gap: 12px;">
                          <VTextField v-model="row.volume" type="number" min="0" label="Volume" density="compact" hide-details style="flex: 1; min-width: 0;" />
                          <VTextField v-model="row.satuan" label="Satuan" density="compact" hide-details style="flex: 1; min-width: 0;" />
                        </div>
                      </VCol>
                      <VCol
                        cols="12"
                        md="2"
                      >
                        <VTextField
                          v-model="row.nominal"
                          type="number"
                          min="0"
                          label="Harga Satuan *"
                          density="compact"
                          hide-details
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        md="2"
                      >
                        <VSelect
                          v-model="row.jenis_pembayaran"
                          label="Pembayaran"
                          :items="paymentItems(row)"
                          density="compact"
                          hide-details
                        />
                      </VCol>
                      
                      <VCol
                        cols="12"
                        md="10"
                      >
                        <VTextField
                          v-model="row.keterangan"
                          label="Keterangan"
                          density="compact"
                          hide-details
                        />
                      </VCol>
                      <VCol
                        cols="12"
                        md="2"
                      >
                        <VTextField
                          :model-value="formatRupiah(rowTotal(row))"
                          label="Total LPJ"
                          readonly
                          density="compact"
                          hide-details
                        />
                      </VCol>
                    </VRow>
                  </div>
                  <div class="lpj-row-actions">
                    <VTooltip
                      text="Tambah sub-item setelah ini"
                      location="top"
                    >
                      <template #activator="{ props: tooltipProps }">
                        <VBtn
                          v-bind="tooltipProps"
                          icon="ri-add-line"
                          size="small"
                          variant="tonal"
                          color="primary"
                          @click="addSubItem(item, rowIndex)"
                        />
                      </template>
                    </VTooltip>
                    <VTooltip
                      text="Duplikasi sub-item"
                      location="top"
                    >
                      <template #activator="{ props: tooltipProps }">
                        <VBtn
                          v-bind="tooltipProps"
                          icon="ri-file-copy-line"
                          size="small"
                          variant="tonal"
                          color="info"
                          @click="duplicateSubItem(item, rowIndex)"
                        />
                      </template>
                    </VTooltip>
                    <VTooltip
                      text="Hapus sub-item"
                      location="top"
                    >
                      <template #activator="{ props: tooltipProps }">
                        <VBtn
                          v-bind="tooltipProps"
                          icon="ri-subtract-line"
                          size="small"
                          variant="tonal"
                          color="error"
                          @click="removeSubItem(item, rowIndex)"
                        />
                      </template>
                    </VTooltip>
                  </div>
                </div>
              </VCardText>
            </VCard>
          </div>
          <div class="mb-5 mt-2">
            <VBtn
              color="primary"
              variant="outlined"
              block
              prepend-icon="ri-add-line"
              @click="addItem"
            >
              Tambah Uraian Baru
            </VBtn>
          </div>
        </template>

        <template v-else>
          <div
            v-for="(row, index) in rows"
            :key="row.key"
            class="lpj-row"
          >
            <div class="lpj-row-number">
              {{ index + 1 }}
            </div>

            <div class="lpj-row-content">
              <VRow>
                <VCol
                  v-if="isKegiatan"
                  cols="12"
                  md="2"
                >
                  <VSelect
                    v-model="row.kategori_detail"
                    label="Kategori"
                    :items="[
                      { title: 'Pegawai', value: 'pegawai' },
                      { title: 'Nonpegawai', value: 'non_pegawai' },
                    ]"
                    @update:model-value="onKategoriChange(row)"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="2"
                >
                  <AppDateTimePicker
                    v-model="row.tanggal"
                    label="Tanggal *"
                    :config="{
                      altInput: true,
                      altFormat: 'd F Y',
                      dateFormat: 'Y-m-d',
                    }"
                  />
                </VCol>

                <VCol
                  v-if="!isRumahTangga && (!isKegiatan || isPegawaiKegiatan(row))"
                  cols="12"
                  :md="isKegiatan ? 4 : 5"
                >
                  <VAutocomplete
                    v-model="row.pegawai_id"
                    :items="pegawaiForRow(row)"
                    item-title="display"
                    item-value="id"
                    label="Pegawai *"
                    :loading="loadingPegawai"
                    clearable
                  />
                </VCol>

                <template v-if="isTatapmuka">
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <VTextField
                      v-model="row.transport_motor"
                      type="number"
                      min="0"
                      label="Transport Motor"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <VTextField
                      v-model="row.hari_transport_motor"
                      type="number"
                      min="0"
                      label="Hari Motor"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <VTextField
                      v-model="row.transport_mobil"
                      type="number"
                      min="0"
                      label="Transport Mobil"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <VTextField
                      v-model="row.hari_transport_mobil"
                      type="number"
                      min="0"
                      label="Hari Mobil"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <VTextField
                      v-model="row.barokah_mengajar_biasa"
                      type="number"
                      min="0"
                      label="Barokah Mengajar"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <VTextField
                      v-model="row.jam"
                      type="number"
                      min="0"
                      label="Jam"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <VTextField
                      v-model="row.barokah_mengajar_double_degree"
                      type="number"
                      min="0"
                      label="Barokah DD"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <VTextField
                      v-model="row.jam_mengajar_double_degree"
                      type="number"
                      min="0"
                      label="Jam DD"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <VTextField
                      v-model="row.barokah_uas"
                      type="number"
                      min="0"
                      label="Barokah UAS"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <VTextField
                      v-model="row.jumlah_mahasiswa_uas"
                      type="number"
                      min="0"
                      label="Mhs UAS"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <VTextField
                      v-model="row.barokah_sempro"
                      type="number"
                      min="0"
                      label="Barokah Sempro"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <VTextField
                      v-model="row.jam_sempro"
                      type="number"
                      min="0"
                      label="Jam Sempro"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="4"
                  >
                    <VTextField
                      v-model="row.keterangan_sempro"
                      label="Keterangan Sempro"
                    />
                  </VCol>
                </template>

                <template v-if="isKegiatan">
                  <VCol
                    cols="12"
                    :md="isPegawaiKegiatan(row) ? 4 : 5"
                  >
                    <VTextField
                      v-model="row.nama_kegiatan"
                      :label="isPegawaiKegiatan(row) ? 'Nama Kegiatan' : 'Uraian Pengeluaran'"
                    />
                  </VCol>
                  <template v-if="isPegawaiKegiatan(row)">
                    <VCol
                      cols="12"
                      md="2"
                    >
                      <VTextField
                        v-model="row.transport"
                        type="number"
                        min="0"
                        label="Transport"
                      />
                    </VCol>
                    <VCol
                      cols="12"
                      md="2"
                    >
                      <VTextField
                        v-model="row.barokah"
                        type="number"
                        min="0"
                        label="Barokah"
                      />
                    </VCol>
                  </template>
                  <VCol
                    v-else
                    cols="12"
                    md="3"
                  >
                    <VTextField
                      v-model="row.nominal"
                      type="number"
                      min="0"
                      label="Nominal"
                    />
                  </VCol>
                </template>



                <template v-if="isDosenBulanan">
                  <VCol
                    cols="12"
                    md="3"
                  >
                    <VTextField
                      v-model="row.barokah_dosen_tetap"
                      type="number"
                      min="0"
                      label="Barokah Dosen Tetap"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="3"
                  >
                    <VTextField
                      v-model="row.barokah_struktural"
                      type="number"
                      min="0"
                      label="Barokah Struktural"
                    />
                  </VCol>
                </template>

                <template v-if="isStaffBulanan">
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <VTextField
                      v-model="row.hari"
                      type="number"
                      min="0"
                      label="Hari"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="3"
                  >
                    <VTextField
                      v-model="row.barokah_harian"
                      type="number"
                      min="0"
                      label="Barokah Harian"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="3"
                  >
                    <VTextField
                      v-model="row.barokah_bulanan"
                      type="number"
                      min="0"
                      label="Barokah Bulanan"
                    />
                  </VCol>
                </template>

                <VCol
                  cols="12"
                  md="2"
                >
                  <VSelect
                    v-model="row.jenis_pembayaran"
                    label="Pembayaran"
                    :items="paymentItems(row)"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="4"
                >
                  <VTextField
                    v-model="row.keterangan"
                    label="Keterangan"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="2"
                >
                  <VTextField
                    :model-value="formatRupiah(rowTotal(row))"
                    label="Total LPJ"
                    readonly
                  />
                </VCol>
              </VRow>
            </div>

            <div class="lpj-row-actions">
              <VTooltip
                text="Tambah baris setelah ini"
                location="top"
              >
                <template #activator="{ props: tooltipProps }">
                  <VBtn
                    v-bind="tooltipProps"
                    icon="ri-add-line"
                    size="small"
                    variant="tonal"
                    color="primary"
                    @click="addRow(index)"
                  />
                </template>
              </VTooltip>

              <VTooltip
                v-if="isRumahTangga"
                text="Duplikasi baris"
                location="top"
              >
                <template #activator="{ props: tooltipProps }">
                  <VBtn
                    v-bind="tooltipProps"
                    icon="ri-file-copy-line"
                    size="small"
                    variant="tonal"
                    color="info"
                    @click="duplicateRow(index)"
                  />
                </template>
              </VTooltip>

              <VTooltip
                text="Hapus baris"
                location="top"
              >
                <template #activator="{ props: tooltipProps }">
                  <VBtn
                    v-bind="tooltipProps"
                    icon="ri-subtract-line"
                    size="small"
                    variant="tonal"
                    color="error"
                    @click="removeRow(index)"
                  />
                </template>
              </VTooltip>
            </div>
          </div>
        </template>
      </VCardText>
    </VCard>

    <div
      class="floating-footer"
      :class="{ 'summary-hidden': mobileSummaryHidden }"
    >
      <button
        type="button"
        class="summary-toggle"
        @click="mobileSummaryHidden = !mobileSummaryHidden"
      >
        {{ mobileSummaryHidden ? "Show" : "Hide" }}
      </button>

      <div class="floating-summary">
        <div
          v-for="item in summaryItems"
          :key="item.label"
          class="summary-item"
          :class="{ 'summary-item-total': item.total }"
        >
          <span>{{ item.label }}</span>
          <strong :class="item.total ? `text-${selisihColor}` : ''">{{ formatRupiah(item.value) }}</strong>
        </div>
      </div>

      <div class="floating-actions">
        <VBtn
          variant="outlined"
          color="secondary"
          :disabled="saving"
          @click="router.push(returnPath)"
        >
          Batal
        </VBtn>
        <VBtn
          color="primary"
          prepend-icon="ri-save-line"
          :loading="saving"
          :disabled="saving"
          @click="submit"
        >
          Simpan LPJ
        </VBtn>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-with-floating-footer {
  padding-block-end: 98px;
}

.lpj-page-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.lpj-header {
  display: grid;
  align-items: center;
  gap: 18px;
  grid-template-columns: minmax(0, 1fr) minmax(420px, auto);
}

.lpj-summary-cards {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, minmax(130px, 1fr));
}

.lpj-summary-card {
  display: grid;
  min-block-size: 76px;
  align-content: center;
  border: 1px solid rgba(var(--v-border-color), 0.16);
  border-radius: 8px;
  padding: 10px 14px;
}

.lpj-summary-card span,
.summary-item span {
  color: rgba(var(--v-theme-on-surface), 0.68);
  font-size: 0.76rem;
  font-weight: 600;
}

.lpj-summary-card strong,
.summary-item strong {
  color: rgba(var(--v-theme-on-surface), 0.92);
  font-size: 0.95rem;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.lpj-row {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) 40px;
  align-items: start;
  border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding: 20px;
  gap: 14px;
}

.lpj-row:last-child {
  border-block-end: 0;
}

.lpj-row-number {
  display: grid;
  inline-size: 32px;
  block-size: 32px;
  border-radius: 8px;
  background: rgba(var(--v-theme-success), 0.1);
  color: rgb(var(--v-theme-success));
  font-weight: 700;
  place-items: center;
}

.lpj-row-content {
  min-inline-size: 0;
}

.lpj-row-actions {
  display: grid;
  gap: 8px;
}

.floating-footer {
  position: fixed;
  z-index: 1007;
  display: grid;
  align-items: center;
  border: 1px solid rgba(var(--v-border-color), 0.14);
  border-radius: 14px;
  backdrop-filter: blur(12px);
  background: rgba(var(--v-theme-surface), 0.9);
  box-shadow: 0 8px 24px rgba(var(--v-shadow-key-umbra-color), 0.16);
  gap: 14px;
  grid-template-columns: minmax(0, 1fr) auto;
  inset-block-end: 16px;
  inset-inline-end: 16px;
  inset-inline-start: 276px;
  padding: 12px 16px;
}

:global(.layout-wrapper.layout-nav-type-horizontal) .floating-footer,
:global(.layout-wrapper.layout-overlay-nav) .floating-footer {
  inset-inline-start: 16px;
}

.floating-summary {
  display: grid;
  min-inline-size: 0;
  overflow: hidden;
  border: 1px solid rgba(var(--v-border-color), 0.14);
  border-radius: 10px;
  background: rgba(var(--v-theme-surface), 0.72);
  grid-template-columns: repeat(3, minmax(140px, 1fr));
}

.summary-item {
  display: flex;
  justify-content: center;
  flex-direction: column;
  min-block-size: 48px;
  min-inline-size: 0;
  border-inline-end: 1px solid rgba(var(--v-border-color), 0.12);
  padding: 7px 12px;
}

.summary-item:last-child {
  border-inline-end: 0;
}

.summary-item-total {
  background: rgba(var(--v-theme-primary), 0.1);
}

.floating-actions {
  display: flex;
  gap: 12px;
}

.summary-toggle {
  display: none;
}

@media (max-width: 1199px) {
  .lpj-header {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 959px) {
  .lpj-row {
    grid-template-columns: 32px minmax(0, 1fr);
  }

  .lpj-row-actions {
    grid-column: 2;
    display: flex;
    justify-content: flex-end;
  }
}

@media (max-width: 599px) {
  .page-with-floating-footer {
    padding-block-end: 224px;
  }

  .lpj-page-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lpj-page-actions :deep(.v-btn) {
    inline-size: 100%;
  }

  .page-with-floating-footer.is-summary-hidden {
    padding-block-end: 132px;
  }

  .lpj-summary-cards {
    grid-template-columns: 1fr;
  }

  .lpj-row {
    padding: 16px 12px;
    gap: 10px;
  }

  .floating-footer {
    grid-template-columns: 1fr;
    inset-block-end: 8px;
    inset-inline: 8px;
    padding: 10px;
  }

  .summary-toggle {
    position: absolute;
    z-index: 1;
    inset-block-start: -13px;
    inset-inline-start: 50%;
    border: 1px solid rgba(var(--v-theme-primary), 0.28);
    border-radius: 999px;
    background: rgb(var(--v-theme-surface));
    box-shadow: 0 6px 16px rgba(var(--v-shadow-key-umbra-color), 0.16);
    color: rgb(var(--v-theme-primary));
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    font-weight: 700;
    inline-size: 46px;
    min-block-size: 26px;
    padding: 0;
    transform: translateX(-50%);
  }

  .floating-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-block-size: 156px;
    opacity: 1;
    transform: translateY(0);
    transition:
      max-block-size 220ms ease,
      opacity 180ms ease,
      transform 220ms ease,
      border-color 180ms ease;
  }

  .floating-footer.summary-hidden {
    gap: 0;
  }

  .floating-footer.summary-hidden .floating-summary {
    max-block-size: 0;
    border-color: transparent;
    opacity: 0;
    pointer-events: none;
    transform: translateY(10px);
  }

  .summary-item {
    min-block-size: 42px;
    border-block-end: 1px solid rgba(var(--v-border-color), 0.12);
    padding: 6px 10px;
  }

  .summary-item:nth-child(even) {
    border-inline-end: 0;
  }

  .summary-item-total {
    grid-column: 1 / -1;
    border-block-end: 0;
  }

  .floating-actions {
    flex-direction: column-reverse;
  }
}

.uraian-letter {
  display: grid;
  inline-size: 32px;
  block-size: 32px;
  border-radius: 8px;
  background: rgba(var(--v-theme-primary), 0.2);
  color: rgb(var(--v-theme-primary));
  font-weight: 700;
  font-size: 1.1rem;
  place-items: center;
}
</style>
