<script setup>
import PengeluaranLampiranInput from "@/components/admin/pengeluaran/PengeluaranLampiranInput.vue"
import PengeluaranRekapSelect from "@/components/admin/pengeluaran/PengeluaranRekapSelect.vue"
import { showSnackbar } from "@/composables/snackbar"
import { appendLampiranFormData } from "@/utils/lampiran"
import { formatRupiah } from "@/composables/formatRupiah"

const props = defineProps({
  typeForm: {
    type: String,
    default: "add",
  },
  dataForm: {
    type: Object,
    default: () => ({}),
  },
  returnPath: {
    type: String,
    default: "/admin/pengeluaran/sarana-prasarana",
  },
})

const router = useRouter()
const refForm = ref(null)
const disabled = ref(false)
const title = ref("Tambah Pengeluaran Sarana Prasarana")
const tanggal = ref(null)
const rekapId = ref(null)
const selectedRekap = ref(null)
const kelompokAnggaran = ref("")
const namaKegiatan = ref("")
const nominal = ref(null)
const volume = ref(null)
const satuan = ref(null)
const jenisPembayaran = ref("Tunai")
const buktiTransfer = ref(null)
const existingBuktiTransferUrl = ref(null)
const lampiran = ref([])
const existingLampiran = ref([])
const removedLampiran = ref([])
const keterangan = ref("")

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
    clickHandler: () => router.push("/admin/pengeluaran/sarana-prasarana"),
  },
])

const jenisPembayaranList = ["Tunai", "Transfer"]
const factorValue = value => (value === null || value === "" || value === undefined ? 1 : Number(value || 0))

const total = computed(() => Math.round(
  Number(nominal.value || 0) * factorValue(volume.value),
))

const selectedBuktiTransferFile = computed(() => {
  if (Array.isArray(buktiTransfer.value)) return buktiTransfer.value[0] ?? null

  return buktiTransfer.value
})

const rekapNama = computed(() =>
  selectedRekap.value?.nama || props.dataForm?.nama_rekap || "",
)

const kelompokAnggaranItems = computed(() => {
  const value = String(kelompokAnggaran.value || "").trim()

  return value ? [value] : []
})

const fillFormFromData = data => {
  tanggal.value = data.tanggal ?? tanggal.value
  rekapId.value = data.rekap_id ?? null
  kelompokAnggaran.value = data.kelompok_anggaran ?? ""
  namaKegiatan.value = data.nama_kegiatan ?? ""
  nominal.value = data.nominal ?? data.total ?? 0
  volume.value = data.volume ?? null
  satuan.value = data.satuan ?? null
  jenisPembayaran.value = data.jenis_pembayaran ?? "Tunai"
  buktiTransfer.value = null
  existingBuktiTransferUrl.value = data.bukti_transfer_url ?? null
  lampiran.value = []
  existingLampiran.value = data.lampiran ?? []
  removedLampiran.value = []
  keterangan.value = data.keterangan ?? ""
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

const onSubmit = async () => {
  const valid = await refForm.value.validate()
  if (!valid.valid) return

  const kelompokAnggaranValue = String(kelompokAnggaran.value || "").trim()
  if (!kelompokAnggaranValue) {
    showSnackbar({
      text: "Kelompok Anggaran harus diisi.",
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
    ? `/admin/pengeluaran/sarana-prasarana/${editId}`
    : "/admin/pengeluaran/sarana-prasarana"

  disabled.value = true

  const formData = new FormData()

  formData.append("tanggal", tanggal.value)
  formData.append("rekap_id", rekapId.value)
  formData.append("kelompok_anggaran", kelompokAnggaranValue)
  formData.append("nama_kegiatan", namaKegiatan.value || rekapNama.value)
  formData.append("nominal", nominal.value ?? 0)
  if (volume.value !== null && volume.value !== "") formData.append("volume", volume.value)
  if (satuan.value !== null && satuan.value !== "") formData.append("satuan", satuan.value)
  formData.append("total", total.value)
  formData.append("jenis_pembayaran", jenisPembayaran.value)
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

    showSnackbar({
      text: response.message,
      color: "success",
    })
    router.push(props.returnPath)
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    disabled.value = false
  }
}

watch(jenisPembayaran, value => {
  if (value !== "Transfer") buktiTransfer.value = null
})

watch(
  () => props.dataForm,
  () => {
    if (props.typeForm === "edit" && props.dataForm) {
      title.value = `Update Pengeluaran Sarana Prasarana: ${props.dataForm.nama_kegiatan || props.dataForm.tanggal || ""}`
      fillFormFromData(props.dataForm)
    }
  },
  { deep: true, immediate: true },
)

onMounted(() => {
  if (props.typeForm !== "edit") tanggal.value = fDate(new Date())
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
              endpoint="/admin/pengeluaran/sarana-prasarana"
              label="Rekap *"
              :rules="[requiredValidator]"
              @selected="selectedRekap = $event"
            />
          </VCol>

          <VCol cols="12">
            <AppDateTimePicker
              v-model="tanggal"
              label="Tanggal *"
              placeholder="Pilih tanggal"
              density="compact"
              hide-details
              :rules="[requiredValidator]"
              :config="{
                altInput: true,
                altFormat: 'F j, Y',
                dateFormat: 'Y-m-d',
              }"
            />
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <VCombobox
              v-model="kelompokAnggaran"
              :items="kelompokAnggaranItems"
              label="Kelompok Anggaran *"
              density="compact"
              hide-details
              :rules="[requiredValidator]"
              clearable
            />
          </VCol>

          <VCol
            cols="12"
            md="8"
          >
            <VTextField
              v-model="namaKegiatan"
              label="Uraian Pengeluaran *"
              density="compact"
              hide-details
              :rules="[requiredValidator]"
            />
          </VCol>

          <VCol
            cols="12"
            md="3"
          >
            <VTextField
              v-model="volume"
              type="number"
              min="0"
              label="Volume"
              density="compact"
              hide-details
            />
          </VCol>

          <VCol
            cols="12"
            md="3"
          >
            <VTextField
              v-model="satuan"
              label="Satuan"
              density="compact"
              hide-details
            />
          </VCol>

          <VCol
            cols="12"
            md="3"
          >
            <VTextField
              v-model="nominal"
              type="number"
              min="0"
              label="Harga Satuan *"
              density="compact"
              hide-details="auto"
              :hint="formatRupiah(nominal)"
              persistent-hint
              :rules="[requiredValidator]"
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
              density="compact"
              hide-details
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
              density="compact"
              hide-details
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
              label="Keterangan"
              density="compact"
              hide-details
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
              density="compact"
              hide-details
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
