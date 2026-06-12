<script setup>
import PengeluaranLampiranInput from "@/components/admin/pengeluaran/PengeluaranLampiranInput.vue"
import PengeluaranRekapSelect from "@/components/admin/pengeluaran/PengeluaranRekapSelect.vue"
import { formatRupiah } from "@/composables/formatRupiah"
import { showSnackbar } from "@/composables/snackbar"
import { appendLampiranFormData } from "@/utils/lampiran"
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect/index.js"
import "flatpickr/dist/plugins/monthSelect/style.css"

const props = defineProps({
  refDataPegawai: {
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
    required: true,
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

const menuList = [
  {
    title: "Kembali",
    value: "back",
    icon: "ri-arrow-left-line",
    clickHandler: () => router.back(),
  },
  {
    title: "Lihat Data",
    value: "lihat-data",
    icon: "ri-eye-line",
    clickHandler: () => router.push(props.basePath),
  },
]

const refForm = ref(null)
const tanggal = ref(null)
const pegawaiId = ref(null)
const kodePegawai = ref("")
const periode = ref(null)
const bulan = ref(null)
const tahun = ref(null)
const hari = ref(null)
const barokahHarian = ref(null)
const barokahBulanan = ref(null)
const barokahDosenTetap = ref(null)
const barokahStruktural = ref(null)
const jenisPembayaran = ref("CUS BSI")
const rekapId = ref(null)
const buktiTransfer = ref(null)
const existingBuktiTransferUrl = ref(null)
const lampiran = ref([])
const existingLampiran = ref([])
const removedLampiran = ref([])
const keterangan = ref("")
const disabled = ref(false)

const jenisPembayaranList = ["CUS BSI", "Transfer"]
const showMainDataInForm = computed(() => props.typeForm === "edit")
const isStaffForm = computed(() => props.pegawaiTitle.toLowerCase() === "staff")
const isDosenForm = computed(() => !isStaffForm.value)

const selectedBuktiTransferFile = computed(() => {
  if (Array.isArray(buktiTransfer.value)) return buktiTransfer.value[0] ?? null
  
  return buktiTransfer.value
})

const buktiTransferRules = computed(() => {
  if (
    !isStaffForm.value
    || jenisPembayaran.value !== "Transfer"
    || existingBuktiTransferUrl.value
  ) {
    return []
  }

  return [requiredValidator]
})

const identifierLabel = computed(() => isStaffForm.value ? "Kode Staff" : `NIY ${props.pegawaiTitle}`)
const dayLabel = computed(() => props.showPeriod ? "Total Hari" : "Hari")

const periodeConfig = {
  altInput: true,
  altFormat: "F Y",
  dateFormat: "Y-m",
  plugins: [
    monthSelectPlugin({
      shorthand: false,
      dateFormat: "Y-m",
      altFormat: "F Y",
    }),
  ],
}

const formTitle = computed(() => {
  if (props.typeForm !== "edit") {
    return `Tambah ${props.title}`
  }

  return `Update ${props.title}: ${kodePegawai.value || ""}`
})

const total = computed(() => {
  if (isDosenForm.value) {
    return Math.round(Number(barokahDosenTetap.value || 0) + Number(barokahStruktural.value || 0))
  }

  return Math.round((Number(barokahHarian.value || 0) * Number(hari.value || 0)) + Number(barokahBulanan.value || 0))
})

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
    
    return
  }

  const date = new Date(value)
  if (!Number.isNaN(date.getTime())) {
    tahun.value = date.getFullYear()
    bulan.value = date.getMonth() + 1
  }
}

const setPeriodFromDate = value => {
  if (!props.showPeriod || periode.value || !value) return

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return

  periode.value = periodValue(date.getMonth() + 1, date.getFullYear())
}

const fillFormFromData = data => {
  tanggal.value = data.tanggal ?? tanggal.value
  pegawaiId.value = data.pegawai_id ?? pegawaiId.value
  kodePegawai.value = data.kode_pegawai ?? kodePegawai.value
  bulan.value = data.bulan ?? bulan.value
  tahun.value = data.tahun ?? tahun.value
  periode.value = periodValue(bulan.value, tahun.value) ?? periode.value
  hari.value = data.hari ?? 0
  barokahHarian.value = data.barokah_harian ?? 0
  barokahBulanan.value = data.barokah_bulanan ?? 0
  barokahDosenTetap.value = data.barokah_dosen_tetap ?? data.total ?? 0
  barokahStruktural.value = data.barokah_struktural ?? 0
  jenisPembayaran.value = data.jenis_pembayaran ?? "CUS BSI"
  rekapId.value = data.rekap_id ?? null
  buktiTransfer.value = null
  existingBuktiTransferUrl.value = data.bukti_transfer_url ?? null
  lampiran.value = []
  existingLampiran.value = data.lampiran ?? []
  removedLampiran.value = []
  keterangan.value = data.keterangan ?? ""
}

const setTanggal = value => {
  tanggal.value = value
  setPeriodFromDate(value)
}

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

const onSubmit = async () => {
  const valid = await refForm.value.validate()
  if (!valid.valid) return

  if (props.typeForm === "add" && !props.refDataPegawai?.pegawai?.id) {
    showSnackbar({
      text: `Silakan pilih ${props.pegawaiTitle.toLowerCase()} terlebih dahulu.`,
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

  if (props.showPeriod && (!bulan.value || !tahun.value)) {
    showSnackbar({
      text: "Bulan dan tahun harus diisi.",
      color: "warning",
    })
    
    return
  }

  if (
    isStaffForm.value
    && jenisPembayaran.value === "Transfer"
    && !selectedBuktiTransferFile.value
    && !existingBuktiTransferUrl.value
  ) {
    showSnackbar({
      text: "Bukti transfer wajib diupload.",
      color: "warning",
    })
    
    return
  }

  const editId = props.typeForm === "edit"
    ? props.dataForm.id
    : null

  const method = editId ? "PUT" : "POST"

  const url = editId
    ? `${props.endpoint}/${editId}`
    : props.endpoint

  disabled.value = true

  const formData = new FormData()

  formData.append("tanggal", tanggal.value)
  if (props.showPeriod) {
    formData.append("bulan", bulan.value)
    formData.append("tahun", tahun.value)
  }

  if (props.typeForm === "add") {
    formData.append("pegawai_id", props.refDataPegawai.pegawai.id)
  } else if (pegawaiId.value || props.dataForm?.pegawai_id) {
    formData.append("pegawai_id", pegawaiId.value || props.dataForm.pegawai_id)
  }

  formData.append("hari", hari.value ?? 0)
  formData.append("barokah_harian", barokahHarian.value ?? 0)
  formData.append("barokah_bulanan", barokahBulanan.value ?? 0)
  formData.append("barokah_dosen_tetap", barokahDosenTetap.value ?? 0)
  formData.append("barokah_struktural", barokahStruktural.value ?? 0)
  formData.append("total", total.value)
  formData.append("jenis_pembayaran", jenisPembayaran.value)
  formData.append("rekap_id", rekapId.value ?? "")
  formData.append("keterangan", keterangan.value ?? "")
  formData.append("_method", method)

  if (isStaffForm.value && selectedBuktiTransferFile.value instanceof File) {
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
      router.push(props.basePath)
    } else {
      showSnackbar({
        text: response.message,
        color: "error",
      })
    }
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
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
      fillFormFromData(props.dataForm)
    }
  },
  { deep: true, immediate: true },
)

watch(periode, newVal => {
  syncPeriodParts(newVal)
})

watch(jenisPembayaran, newValue => {
  if (newValue !== "Transfer") {
    buktiTransfer.value = null
  }
})

onMounted(() => {
  if (props.typeForm !== "edit") {
    const today = new Date()

    tanggal.value = fDate(today)
    setPeriodFromDate(today)
  }
})

defineExpose({
  setTanggal,
})
</script>

<template>
  <VCard
    class="mb-6"
    :title="formTitle"
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
              :endpoint="endpoint"
              label="Rekap"
            />
          </VCol>

          <VCol
            v-if="showMainDataInForm"
            cols="12"
            :md="showPeriod ? 4 : 6"
          >
            <AppDateTimePicker
              v-model="tanggal"
              label="Tanggal"
              placeholder="Select date"
              :rules="[requiredValidator]"
              :config="{
                altInput: true,
                altFormat: 'F j, Y',
                dateFormat: 'Y-m-d',
              }"
            />
          </VCol>

          <VCol
            v-if="showMainDataInForm"
            cols="12"
            :md="showPeriod ? 4 : 6"
          >
            <VTextField
              v-model="kodePegawai"
              :label="identifierLabel"
              :rules="[requiredValidator]"
              readonly
            />
          </VCol>

          <VCol
            v-if="showPeriod"
            cols="12"
            :md="showMainDataInForm ? 4 : 12"
          >
            <AppDateTimePicker
              v-model="periode"
              label="Periode Bulan/Tahun"
              placeholder="Pilih bulan dan tahun"
              :rules="[requiredValidator]"
              :config="periodeConfig"
            />
          </VCol>

          <VCol
            v-if="!isDosenForm"
            cols="12"
            md="4"
          >
            <VTextField
              v-model="hari"
              type="number"
              :label="dayLabel"
              :rules="[requiredValidator]"
            />
          </VCol>

          <VCol
            v-if="!isDosenForm"
            cols="12"
            md="4"
          >
            <VTextField
              v-model="barokahHarian"
              type="number"
              label="Barokah Harian"
              :rules="[requiredValidator]"
              :hint="formatRupiah(barokahHarian)"
              persistent-hint
            />
          </VCol>

          <VCol
            v-if="!isDosenForm"
            cols="12"
            md="4"
          >
            <VTextField
              :model-value="formatRupiah(Number(barokahHarian || 0) * Number(hari || 0))"
              label="Subtotal Barokah Harian"
              readonly
            />
          </VCol>

          <VCol
            v-if="!isDosenForm"
            cols="12"
            :md="showPeriod ? 4 : 6"
          >
            <VTextField
              v-model="barokahBulanan"
              type="number"
              label="Barokah Bulanan"
              :rules="[requiredValidator]"
              :hint="formatRupiah(barokahBulanan)"
              persistent-hint
            />
          </VCol>

          <VCol
            v-if="isDosenForm"
            cols="12"
            md="6"
          >
            <VTextField
              v-model="barokahDosenTetap"
              type="number"
              label="Barokah Dosen Tetap"
              :rules="[requiredValidator]"
              :hint="formatRupiah(barokahDosenTetap)"
              persistent-hint
            />
          </VCol>

          <VCol
            v-if="isDosenForm"
            cols="12"
            md="6"
          >
            <VTextField
              v-model="barokahStruktural"
              type="number"
              label="Barokah Struktural"
              :rules="[requiredValidator]"
              :hint="formatRupiah(barokahStruktural)"
              persistent-hint
            />
          </VCol>

          <VCol
            cols="12"
            :md="showPeriod ? 4 : 6"
          >
            <VSelect
              v-model="jenisPembayaran"
              label="Jenis Pembayaran"
              :items="jenisPembayaranList"
              :rules="[requiredValidator]"
            />
          </VCol>

          <VCol
            v-if="isStaffForm && jenisPembayaran === 'Transfer'"
            cols="12"
            md="4"
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
            v-if="isStaffForm && existingBuktiTransferUrl && jenisPembayaran === 'Transfer'"
            cols="12"
            md="4"
          >
            <VBtn
              :href="existingBuktiTransferUrl"
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              color="primary"
              prepend-icon="ri-file-paper-2-line"
              class="w-100"
            >
              Lihat Bukti Transfer
            </VBtn>
          </VCol>

          <VCol
            cols="12"
            :md="isDosenForm ? 6 : (showPeriod ? 4 : 12)"
          >
            <VTextField
              :model-value="formatRupiah(total)"
              label="Total"
              readonly
            />
          </VCol>

          <VCol cols="12">
            <VTextarea
              v-model="keterangan"
              label="Keterangan"
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
