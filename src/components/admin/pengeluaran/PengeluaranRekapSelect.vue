<script setup>
/* eslint-disable camelcase, import/extensions */
import { formatRupiah } from "@/composables/formatRupiah"
import {
  defaultPetugasPengeluaranId,
  fetchPetugasPengeluaranOptions,
  moduleKeyFromPengeluaranEndpoint,
} from "@/composables/petugasPengeluaran"
import { showSnackbar } from "@/composables/snackbar"
import {
  listenPengeluaranRekapUpdated,
  notifyPengeluaranRekapUpdated,
} from "@/composables/pengeluaranRekap"
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect/index.js"
import "flatpickr/dist/plugins/monthSelect/style.css"

const props = defineProps({
  modelValue: {
    type: [Number, String, null],
    default: null,
  },
  endpoint: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: "Rekap",
  },
  rules: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  allowCreate: {
    type: Boolean,
    default: true,
  },
  filters: {
    type: Object,
    default: () => ({}),
  },
  moduleKey: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(["update:modelValue", "created", "selected"])

const items = ref([])
const loading = ref(false)
const searchText = ref("")
const dialog = ref(false)
const saving = ref(false)
const petugasLoading = ref(false)
const petugasList = ref([])
const petugasId = ref(null)
const namaInput = ref(null)
const nama = ref("")
const keterangan = ref("")
const jumlahSementara = ref(0)
const useJumlahSementara = ref(false)

const currentDateValue = () => {
  const date = new Date()

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

const tanggalRekap = ref(currentDateValue())
const tanggalPencairan = ref(null)

const currentMonthValue = () => {
  const date = new Date()

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

const bulanTahun = ref(currentMonthValue())
let stopListeningRekapUpdates = null
let searchTimer = null

const petugasModuleKey = computed(() =>
  props.moduleKey || moduleKeyFromPengeluaranEndpoint(props.endpoint),
)

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

const formatMonthYear = value => {
  const match = String(value || "").match(/^(\d{4})-(\d{2})/)

  if (!match) return "Periode belum diisi"

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(Number(match[1]), Number(match[2]) - 1, 1))
}

const formatDate = value => {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})/)

  if (!match) return null

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
}

const rekapSubtitle = item => [
  formatMonthYear(item.bulan_tahun),
  item.tanggal_rekap ? `Tanggal ${formatDate(item.tanggal_rekap)}` : null,
  item.tanggal_pencairan ? `Cair ${formatDate(item.tanggal_pencairan)}` : "Belum cair",
  `${item.is_jumlah_sementara ? "Sementara" : "Detail"} ${formatRupiah(item.jumlah || 0)}`,
  item.jumlah_sementara !== null && Number(item.jumlah_data || 0) > 0
    ? `Target ${formatRupiah(item.jumlah_sementara)}`
    : null,
  item.keterangan,
].filter(Boolean).join(" · ")

const selectedValue = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value || null),
})

const selectedItem = computed(() =>
  items.value.find(item => String(item.id) === String(selectedValue.value)) || null,
)

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

const fetchRekap = async (search = searchText.value) => {
  try {
    loading.value = true

    const response = await $api(`${props.endpoint}/rekap`, {
      method: "GET",
      body: {
        mode: "simple",
        limit: 20,
        sort_key: "id",
        sort_order: "desc",
        ...(search && { search }),
        ...props.filters,
      },
    })

    items.value = response.data?.data || []
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    loading.value = false
  }
}

const fetchPetugas = async () => {
  try {
    petugasLoading.value = true

    const items = await fetchPetugasPengeluaranOptions(petugasModuleKey.value)

    petugasList.value = items

    const selectedFromFilter = props.filters?.petugas_id

    const hasCurrent = petugasId.value
      && items.some(item => String(item.value) === String(petugasId.value))

    if (hasCurrent) {
      return
    }

    if (selectedFromFilter && items.some(item => String(item.value) === String(selectedFromFilter))) {
      petugasId.value = selectedFromFilter

      return
    }

    petugasId.value = defaultPetugasPengeluaranId(items) || items[0]?.value || null
  } catch (err) {
    petugasList.value = []
    petugasId.value = null
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    petugasLoading.value = false
  }
}

const resetForm = () => {
  nama.value = ""
  keterangan.value = ""
  jumlahSementara.value = 0
  useJumlahSementara.value = false
  tanggalRekap.value = currentDateValue()
  tanggalPencairan.value = null
  bulanTahun.value = currentMonthValue()
  petugasId.value = props.filters?.petugas_id || null
}

const openCreateDialog = async () => {
  resetForm()
  dialog.value = true
  await fetchPetugas()
}

const createRekap = async () => {
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

  if (!tanggalRekap.value) {
    showSnackbar({
      text: "Tanggal rekap harus diisi.",
      color: "warning",
    })
    
    return
  }

  if (!petugasId.value) {
    showSnackbar({
      text: "Petugas harus dipilih.",
      color: "warning",
    })

    return
  }

  const temporaryAmount = useJumlahSementara.value
    ? Number(jumlahSementara.value)
    : null

  if (
    useJumlahSementara.value
    && (
      jumlahSementara.value === ""
      || jumlahSementara.value === null
      || !Number.isFinite(temporaryAmount)
      || temporaryAmount < 0
    )
  ) {
    showSnackbar({
      text: "Jumlah sementara harus diisi dengan nilai yang valid.",
      color: "warning",
    })
    
    return
  }

  try {
    saving.value = true

    const response = await $api(`${props.endpoint}/rekap`, {
      method: "POST",
      body: {
        petugas_id: petugasId.value,
        nama: trimmedNama,
        bulan_tahun: bulanTahun.value,
        tanggal_rekap: tanggalRekap.value,
        tanggal_pencairan: tanggalPencairan.value || null,
        jumlah_sementara: temporaryAmount,
        keterangan: keterangan.value,
      },
    })

    if (response.status === true) {
      items.value = [response.data, ...items.value.filter(item => item.id !== response.data.id)]
      selectedValue.value = response.data.id
      emit("created", response.data)
      dialog.value = false
      resetForm()
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

onMounted(() => {
  fetchRekap()
  stopListeningRekapUpdates = listenPengeluaranRekapUpdated(
    props.endpoint,
    fetchRekap,
  )
})

watch(selectedItem, item => emit("selected", item), { immediate: true })

watch(() => props.filters, () => fetchRekap(), { deep: true })

watch(searchText, value => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => fetchRekap(value), 250)
})

onBeforeUnmount(() => {
  clearTimeout(searchTimer)
  stopListeningRekapUpdates?.()
})
</script>

<template>
  <div class="rekap-select">
    <VAutocomplete
      v-model="selectedValue"
      v-model:search="searchText"
      :items="items"
      item-title="nama"
      item-value="id"
      :label="label"
      :rules="rules"
      :loading="loading"
      :disabled="disabled"
      no-filter
      clearable
    >
      <template #item="{ props: itemProps, item }">
        <VListItem v-bind="itemProps">
          <template #subtitle>
            {{ rekapSubtitle(item.raw) }}
          </template>
        </VListItem>
      </template>

      <template
        v-if="allowCreate"
        #append
      >
        <VBtn
          icon
          size="small"
          variant="tonal"
          color="primary"
          :disabled="disabled"
          @click="openCreateDialog"
        >
          <VIcon icon="ri-add-line" />
        </VBtn>
      </template>
    </VAutocomplete>

    <VDialog
      v-model="dialog"
      width="640"
      @after-enter="namaInput?.focus()"
    >
      <VCard title="Tambah Rekap">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="dialog = false"
        />

        <VCardText>
          <VRow>
            <VCol cols="12">
              <VAutocomplete
                v-model="petugasId"
                :items="petugasList"
                :loading="petugasLoading"
                label="Petugas *"
                placeholder="Pilih petugas pengeluaran"
                prepend-inner-icon="ri-user-settings-line"
                :rules="[requiredValidator]"
                :disabled="saving"
              />
            </VCol>

            <VCol cols="12">
              <VTextField
                ref="namaInput"
                v-model="nama"
                label="Nama Rekap *"
                :rules="[requiredValidator]"
                autofocus
                hint="Wajib diisi"
                persistent-hint
                @keydown.enter.prevent="createRekap"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <AppDateTimePicker
                v-model="tanggalRekap"
                label="Tanggal Rekap *"
                placeholder="Pilih tanggal rekap"
                prepend-inner-icon="ri-calendar-event-line"
                :config="datePickerConfig"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <AppDateTimePicker
                v-model="tanggalPencairan"
                label="Tanggal Pencairan (Opsional)"
                placeholder="Belum ditentukan"
                prepend-inner-icon="ri-calendar-check-line"
                clearable
                :config="datePickerConfig"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="jumlahSementara"
                label="Jumlah Sementara *"
                type="number"
                min="0"
                prefix="Rp"
                :hint="`${formatRupiah(jumlahSementara)} - dipakai sampai detail tersedia`"
                persistent-hint
                :rules="[requiredValidator]"
                :disabled="!useJumlahSementara"
              />
            </VCol>

            <VCol cols="12">
              <VCheckbox
                v-model="useJumlahSementara"
                label="Gunakan jumlah sementara sebagai batas RAB"
                hint="Matikan agar nominal detail RAB dapat diisi bebas."
                persistent-hint
                hide-details="auto"
              />
            </VCol>

            <VCol cols="12">
              <AppDateTimePicker
                v-model="bulanTahun"
                label="Bulan dan Tahun *"
                placeholder="Pilih bulan dan tahun"
                prepend-inner-icon="ri-calendar-line"
                :config="monthYearPickerConfig"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol cols="12">
              <VTextarea
                v-model="keterangan"
                label="Keterangan (Opsional)"
                hint="Tidak wajib diisi"
                persistent-hint
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
            :disabled="saving || petugasLoading"
            @click="createRekap"
          >
            Simpan
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.rekap-select {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}
</style>
