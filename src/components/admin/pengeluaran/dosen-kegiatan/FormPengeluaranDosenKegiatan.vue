<script setup>
import PengeluaranLampiranInput from "@/components/admin/pengeluaran/PengeluaranLampiranInput.vue"
import PengeluaranRekapSelect from "@/components/admin/pengeluaran/PengeluaranRekapSelect.vue"
import { showSnackbar } from "@/composables/snackbar"
import { appendLampiranFormData } from "@/utils/lampiran"

const props = defineProps({
  refDataDosen: {
    type: Object,
    default: () => ({}),
  },
  typeForm: {
    type: String,
    default: "add",
  },
  dataForm: {
    type: Object,
    default: () => ({}),
  },
  initialRekapId: {
    type: [Number, String, null],
    default: null,
  },
  lockRekap: {
    type: Boolean,
    default: false,
  },
  returnPath: {
    type: String,
    default: "/admin/pengeluaran/dosen-kegiatan",
  },
})

const emit = defineEmits(["category-change"])
const router = useRouter()

const menuList = computed(() => [
  {
    title: "Batalkan",
    value: "back",
    icon: "ri-arrow-left-line",
    clickHandler: () => router.push(props.returnPath),
  },
  {
    title: "Lihat Data",
    value: "lihat-data",
    icon: "ri-eye-line",
    clickHandler: () => router.push("/admin/pengeluaran/dosen-kegiatan"),
  },
])

const refForm = ref(null)
const title = ref("Tambah Pengeluaran Kegiatan")
const kategoriDetail = ref("pegawai")
const tanggal = ref(null)
const pegawaiId = ref(null)
const pegawaiItems = ref([])
const pegawaiSearch = ref("")
const loadingPegawai = ref(false)
const namaKegiatan = ref("")
const transport = ref(null)
const barokah = ref(null)
const nominal = ref(null)
const jenisPembayaran = ref("CUZ BSI")
const rekapId = ref(props.initialRekapId)
const selectedRekap = ref(null)
const buktiTransfer = ref(null)
const existingBuktiTransferUrl = ref(null)
const lampiran = ref([])
const existingLampiran = ref([])
const removedLampiran = ref([])
const keterangan = ref("")
const disabled = ref(false)
let pegawaiSearchTimer = null

const kategoriDetailList = [
  { title: "Pegawai", value: "pegawai" },
  { title: "Nonpegawai", value: "non_pegawai" },
]

const isPegawai = computed(() => kategoriDetail.value === "pegawai")
const keteranganLabel = computed(() => "Keterangan")
const showDateInForm = computed(() => props.typeForm === "edit" || !isPegawai.value)

const jenisPembayaranList = computed(() => (
  isPegawai.value
    ? ["CUZ BSI", "Transfer"]
    : ["Tunai", "Transfer"]
))

const total = computed(() => {
  if (!isPegawai.value) {
    return Math.round(Number(nominal.value || 0))
  }

  return Math.round(Number(transport.value || 0) + Number(barokah.value || 0))
})

const rekapNamaKegiatan = computed(() =>
  selectedRekap.value?.nama
  || props.dataForm?.nama_rekap
  || namaKegiatan.value
  || (rekapId.value ? `Rekap ${rekapId.value}` : ""),
)

const selectedBuktiTransferFile = computed(() => {
  if (Array.isArray(buktiTransfer.value)) return buktiTransfer.value[0] ?? null
  
  return buktiTransfer.value
})

const buktiTransferRules = computed(() => [])

const pegawaiDisplay = item => [
  item.kode,
  item.nama,
  item.dosen?.prodi?.nama || item.dosen?.prodi?.alias || item.staff?.jabatan,
].filter(Boolean).join(" - ")

const initialPegawaiItem = data => ({
  id: data.pegawai_id,
  kode: data.kode_pegawai || data.kode_dosen,
  nama: data.nama_pegawai || data.nama_dosen,
  display: [
    data.kode_pegawai || data.kode_dosen,
    data.nama_pegawai || data.nama_dosen,
    data.jabatan_staff || data.nama_prodi_dosen,
  ].filter(Boolean).join(" - "),
})

const fetchPegawai = async search => {
  try {
    loadingPegawai.value = true

    const response = await $api("/admin/pegawai", {
      method: "GET",
      body: {
        search,
        limit: 30,
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
      text: "Gagal mendapatkan list pegawai.",
      color: "error",
    })
  } finally {
    loadingPegawai.value = false
  }
}

watch(pegawaiSearch, value => {
  if (props.typeForm !== "edit" || !isPegawai.value) return

  clearTimeout(pegawaiSearchTimer)
  if (!String(value || "").trim()) return

  const selectedItem = pegawaiItems.value.find(
    item => String(item.id) === String(pegawaiId.value),
  )

  if (selectedItem?.display === value) return

  pegawaiSearchTimer = setTimeout(() => fetchPegawai(value), 300)
})

watch(kategoriDetail, newValue => {
  emit("category-change", newValue)

  if (newValue === "non_pegawai") {
    pegawaiId.value = null
    transport.value = 0
    barokah.value = 0
    if (!["Tunai", "Transfer"].includes(jenisPembayaran.value)) {
      jenisPembayaran.value = "Tunai"
    }
    
    return
  }

  nominal.value = null
  if (!["CUZ BSI", "Transfer"].includes(jenisPembayaran.value)) {
    jenisPembayaran.value = "CUZ BSI"
  }
}, { immediate: true })

watch(jenisPembayaran, newValue => {
  if (newValue !== "Transfer") {
    buktiTransfer.value = null
  }
})

watch(
  () => props.initialRekapId,
  value => {
    if (value) rekapId.value = value
  },
  { immediate: true },
)

const fillFormFromData = data => {
  kategoriDetail.value = data.kategori_detail || "pegawai"
  tanggal.value = data.tanggal ?? tanggal.value
  pegawaiId.value = data.pegawai_id ?? null
  namaKegiatan.value = data.nama_kegiatan ?? ""
  transport.value = data.transport ?? 0
  barokah.value = data.barokah ?? 0
  nominal.value = data.nominal ?? null
  jenisPembayaran.value = data.jenis_pembayaran
    ?? (data.kategori_detail === "non_pegawai" ? "Tunai" : "CUZ BSI")
  rekapId.value = data.rekap_id ?? props.initialRekapId ?? null
  buktiTransfer.value = null
  existingBuktiTransferUrl.value = data.bukti_transfer_url ?? null
  lampiran.value = []
  existingLampiran.value = data.lampiran ?? []
  removedLampiran.value = []
  keterangan.value = data.keterangan ?? ""

  if (data.pegawai_id) {
    pegawaiItems.value = [initialPegawaiItem(data)]
  }
}

const setTanggal = value => {
  tanggal.value = value
}

const onSubmit = async () => {
  const valid = await refForm.value.validate()
  if (!valid.valid) return

  const selectedPegawaiId = props.typeForm === "add"
    ? props.refDataDosen?.dosen?.id
    : pegawaiId.value

  if (isPegawai.value && !selectedPegawaiId) {
    showSnackbar({
      text: "Silakan pilih pegawai terlebih dahulu.",
      color: "warning",
    })
    
    return
  }

  if (!tanggal.value) {
    showSnackbar({
      text: "Tanggal harus diisi.",
      color: "warning",
    })
    
    return
  }

  if (!rekapId.value) {
    showSnackbar({
      text: "Rekap harus dipilih.",
      color: "warning",
    })
    
    return
  }

  const editId = props.typeForm === "edit" ? props.dataForm.id : null

  const url = editId
    ? `/admin/pengeluaran/dosen-kegiatan/${editId}`
    : "/admin/pengeluaran/dosen-kegiatan"

  disabled.value = true

  const formData = new FormData()

  formData.append("tanggal", tanggal.value)
  formData.append("kategori_detail", kategoriDetail.value)
  if (isPegawai.value) {
    formData.append("pegawai_id", selectedPegawaiId)
  }
  formData.append("nama_kegiatan", isPegawai.value ? rekapNamaKegiatan.value : (namaKegiatan.value || rekapNamaKegiatan.value))
  formData.append("transport", isPegawai.value ? (transport.value ?? 0) : 0)
  formData.append("barokah", isPegawai.value ? (barokah.value ?? 0) : 0)
  if (!isPegawai.value) {
    formData.append("nominal", nominal.value ?? 0)
  }
  formData.append("total", total.value)
  formData.append("jenis_pembayaran", jenisPembayaran.value)
  formData.append("rekap_id", rekapId.value)
  formData.append("keterangan", keterangan.value ?? "")
  if (editId) formData.append("_method", "PUT")

  if (selectedBuktiTransferFile.value instanceof File) {
    formData.append("bukti_transfer", selectedBuktiTransferFile.value)
  }
  appendLampiranFormData(formData, lampiran.value, removedLampiran.value)

  try {
    const response = await $api(url, {
      method: "POST",
      body: formData,
    })

    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: "success",
      })
      router.push(props.returnPath)
    } else {
      showSnackbar({
        text: response.message,
        color: "error",
      })
    }
  } catch (err) {
    const message = Array.isArray(err.data?.message)
      ? err.data.message.join("; ")
      : typeof err.data?.message === "object"
        ? Object.values(err.data.message).flat().join("; ")
        : err.data?.message || "Terjadi kesalahan."

    showSnackbar({
      text: message,
      color: "error",
    })
  } finally {
    disabled.value = false
  }
}

watch(
  () => props.dataForm,
  () => {
    if (props.typeForm === "edit" && props.dataForm) {
      title.value = `Update Pengeluaran Kegiatan: ${props.dataForm.nama_rekap || props.dataForm.tanggal || ""}`
      fillFormFromData(props.dataForm)
    }
  },
  { deep: true, immediate: true },
)

onMounted(() => {
  if (props.typeForm !== "edit") {
    tanggal.value = fDate(new Date())
  }
})

onBeforeUnmount(() => clearTimeout(pegawaiSearchTimer))

defineExpose({
  setTanggal,
})
</script>

<template>
  <VCard
    class="mb-6"
    :title="title"
  >
    <template #append>
      <MoreBtnAction :menu-list="menuList" />
    </template>

    <VCardText>
      <VForm
        ref="refForm"
        @submit.prevent="onSubmit"
      >
        <VRow>
          <VCol cols="12">
            <PengeluaranRekapSelect
              v-model="rekapId"
              endpoint="/admin/pengeluaran/dosen-kegiatan"
              label="Rekap *"
              :rules="[requiredValidator]"
              :disabled="lockRekap"
              :allow-create="!lockRekap"
              @selected="selectedRekap = $event"
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <VSelect
              v-model="kategoriDetail"
              label="Kategori Detail *"
              :items="kategoriDetailList"
              :rules="[requiredValidator]"
            />
          </VCol>

          <VCol
            v-if="showDateInForm"
            cols="12"
            md="6"
          >
            <AppDateTimePicker
              v-model="tanggal"
              label="Tanggal *"
              placeholder="Pilih tanggal"
              :rules="[requiredValidator]"
              :config="{
                altInput: true,
                altFormat: 'F j, Y',
                dateFormat: 'Y-m-d',
              }"
            />
          </VCol>

          <VCol
            v-if="typeForm === 'edit' && isPegawai"
            cols="12"
            md="6"
          >
            <VAutocomplete
              v-model="pegawaiId"
              v-model:search="pegawaiSearch"
              :items="pegawaiItems"
              item-title="display"
              item-value="id"
              label="Pegawai *"
              :loading="loadingPegawai"
              :rules="[requiredValidator]"
              clearable
              no-filter
            />
          </VCol>

          <template v-if="isPegawai">
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="transport"
                type="number"
                min="0"
                label="Transport *"
                :rules="[requiredValidator]"
                :hint="formatRupiah(transport)"
                persistent-hint
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="barokah"
                type="number"
                min="0"
                label="Barokah *"
                :rules="[requiredValidator]"
                :hint="formatRupiah(barokah)"
                persistent-hint
              />
            </VCol>
          </template>

          <VCol
            v-else
            cols="12"
            md="6"
          >
            <VTextField
              v-model="namaKegiatan"
              label="Uraian Pengeluaran"
            />
          </VCol>

          <VCol
            v-if="!isPegawai"
            cols="12"
            md="6"
          >
            <VTextField
              v-model="nominal"
              type="number"
              min="0"
              label="Nominal *"
              :rules="[requiredValidator]"
              :hint="formatRupiah(nominal)"
              persistent-hint
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <VSelect
              v-model="jenisPembayaran"
              label="Jenis Pembayaran *"
              :items="jenisPembayaranList"
              :rules="[requiredValidator]"
            />
          </VCol>

          <VCol
            v-if="jenisPembayaran === 'Transfer'"
            cols="12"
            md="6"
          >
            <VFileInput
              v-model="buktiTransfer"
              :prepend-icon="null"
              label="Bukti Transfer"
              accept="image/png, image/jpeg, application/pdf"
              :rules="buktiTransferRules"
            />
          </VCol>

          <VCol
            v-if="existingBuktiTransferUrl && jenisPembayaran === 'Transfer'"
            cols="12"
            md="6"
          >
            <VBtn
              variant="outlined"
              color="primary"
              prepend-icon="ri-file-paper-2-line"
              :href="existingBuktiTransferUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="w-100"
            >
              Lihat Bukti Transfer
            </VBtn>
          </VCol>

          <VCol cols="12">
            <VTextarea
              v-model="keterangan"
              :label="keteranganLabel"
              auto-grow
            />
          </VCol>

          <VCol cols="12">
            <PengeluaranLampiranInput
              v-model="lampiran"
              v-model:removed-lampiran="removedLampiran"
              :existing-lampiran="existingLampiran"
            />
          </VCol>

          <VCol cols="12">
            <VTextField
              :model-value="formatRupiah(total)"
              label="Total"
              readonly
            />
          </VCol>

          <VCol
            cols="12"
            class="d-flex gap-4"
          >
            <VBtn
              type="submit"
              :disabled="disabled"
              :loading="disabled"
              class="w-100"
            >
              Simpan
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>
