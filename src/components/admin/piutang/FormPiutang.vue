<script setup>
/* eslint-disable camelcase */
import { formatRupiah } from "@/composables/formatRupiah"
import { showSnackbar } from "@/composables/snackbar"

const props = defineProps({
  typeForm: {
    type: String,
    default: "add",
  },
  dataForm: {
    type: Object,
    default: () => ({}),
  },
})

const route = useRoute()
const router = useRouter()
const refForm = ref(null)
const saving = ref(false)
const pegawaiOptions = ref([])
const loadingPegawai = ref(false)
const cicilanMode = ref("pisah")
const piutangPreview = ref(null)
const loadingPreview = ref(false)
const previewLoaded = ref(false)
let previewWatchReady = false

const CICILAN_MODE_STORAGE_KEY = "simkeu.piutang.cicilanMode"

const form = ref({
  pegawai_id: null,
  tanggal: new Date().toISOString().slice(0, 10),
  nominal: null,
  default_cicilan: null,
  keterangan: "",
})

const formTitle = computed(() =>
  props.typeForm === "edit" ? "Edit Piutang Pegawai" : "Tambah Piutang Pegawai",
)

const normalizeCicilanMode = value => value === "gabung" ? "gabung" : "pisah"

const loadCicilanMode = () => {
  if (typeof window === "undefined") return

  cicilanMode.value = normalizeCicilanMode(window.localStorage.getItem(CICILAN_MODE_STORAGE_KEY))
}

const initialPegawaiId = computed(() => {
  const pegawaiId = Number(route.query.pegawai_id || 0)

  return pegawaiId > 0 ? pegawaiId : null
})

const resolvePegawaiId = selected => {
  if (typeof selected === "object" && selected !== null) {
    return selected.value ?? selected.id ?? null
  }

  if (Number.isInteger(Number(selected))) {
    const selectedId = Number(selected)
    const exists = pegawaiOptions.value.some(item => Number(item.value) === selectedId)

    return exists ? selectedId : null
  }

  const matched = pegawaiOptions.value.find(item =>
    String(item.title).toLowerCase() === String(selected || "").toLowerCase(),
  )

  return matched?.value ?? null
}

const selectedPegawaiId = () => resolvePegawaiId(form.value.pegawai_id)
const selectedPegawaiIdValue = computed(() => selectedPegawaiId())
const previewPiutangRows = computed(() => piutangPreview.value?.piutang || [])
const statusColor = status => String(status).toLowerCase() === "lunas" ? "success" : "warning"

const pegawaiRules = [
  requiredValidator,
  value => resolvePegawaiId(value) ? true : "Pilih pegawai dari daftar.",
]

const isNotFoundError = err => {
  const status = err?.statusCode
    || err?.response?.status
    || err?.response?.statusCode
    || err?.response?._data?.statusCode
    || err?.response?._data?.status
    || err?.data?.statusCode
    || err?.data?.status

  const message = String(errorMessage(err) || "").toLowerCase()

  return Number(status) === 404 || message.includes("piutang pegawai tidak ditemukan")
}

const applyPreviewDefaultCicilan = () => {
  if (props.typeForm === "edit") return

  if (cicilanMode.value !== "gabung") {
    form.value.default_cicilan = null

    return
  }

  const defaultCicilan = Number(piutangPreview.value?.default_cicilan || 0)

  form.value.default_cicilan = defaultCicilan > 0 ? defaultCicilan : null
}

const fetchPiutangPreview = async pegawaiId => {
  if (!pegawaiId) {
    piutangPreview.value = null
    previewLoaded.value = false
    applyPreviewDefaultCicilan()

    return
  }

  try {
    loadingPreview.value = true
    previewLoaded.value = false

    const response = await $api(`/admin/piutang/pegawai/${pegawaiId}`, {
      method: "GET",
      body: {
        cicilan_mode: cicilanMode.value,
      },
    })

    piutangPreview.value = response.data || null
    previewLoaded.value = true
    applyPreviewDefaultCicilan()
  } catch (err) {
    piutangPreview.value = null
    previewLoaded.value = true
    applyPreviewDefaultCicilan()

    if (!isNotFoundError(err)) {
      showSnackbar({ color: "error", text: errorMessage(err) })
    }
  } finally {
    loadingPreview.value = false
  }
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

const fillForm = data => {
  if (!data?.id && props.typeForm === "edit") return

  form.value = {
    pegawai_id: data.pegawai_id ?? initialPegawaiId.value,
    tanggal: data.tanggal ?? new Date().toISOString().slice(0, 10),
    nominal: data.nominal ?? null,
    default_cicilan: data.default_cicilan ?? (props.typeForm === "edit" ? 0 : null),
    keterangan: data.keterangan ?? "",
  }
}

const fetchPegawaiOptions = async () => {
  try {
    loadingPegawai.value = true

    const response = await $api("/admin/pegawai", {
      method: "GET",
      body: {
        limit: 0,
        status: "aktif",
        sort_key: "nama",
        sort_order: "asc",
      },
    })

    const rows = response.data?.data || []

    pegawaiOptions.value = rows.map(item => ({
      title: `${item.nama || "-"} (${item.kode || "-"}) - ${item.tipe || "pegawai"}`,
      value: item.id,
    }))
  } catch (err) {
    showSnackbar({ color: "error", text: errorMessage(err) })
  } finally {
    loadingPegawai.value = false
  }
}

const submitForm = async () => {
  const validation = await refForm.value?.validate()
  if (!validation?.valid || saving.value) return

  saving.value = true
  try {
    const isEdit = props.typeForm === "edit"
    const url = isEdit ? `/admin/piutang/${props.dataForm.id}` : "/admin/piutang"
    const method = isEdit ? "PUT" : "POST"

    const response = await $api(url, {
      method,
      body: {
        pegawai_id: selectedPegawaiId(),
        tanggal: form.value.tanggal,
        nominal: Number(form.value.nominal || 0),
        default_cicilan: Number(form.value.default_cicilan || 0),
        keterangan: form.value.keterangan,
      },
    })

    showSnackbar({
      color: "success",
      text: response.message || "Piutang berhasil disimpan.",
    })

    const pegawaiId = selectedPegawaiId() || props.dataForm.pegawai_id

    router.push(pegawaiId ? `/admin/piutang/detail/${pegawaiId}` : "/admin/piutang")
  } catch (err) {
    showSnackbar({ color: "error", text: errorMessage(err) })
  } finally {
    saving.value = false
  }
}

watch(
  () => props.dataForm,
  value => fillForm(value),
  { immediate: true, deep: true },
)

watch([selectedPegawaiIdValue, cicilanMode], ([pegawaiId]) => {
  if (!previewWatchReady) return

  fetchPiutangPreview(pegawaiId)
})

onMounted(() => {
  loadCicilanMode()
  previewWatchReady = true
  fetchPegawaiOptions()
  fetchPiutangPreview(selectedPegawaiIdValue.value)
})
</script>

<template>
  <VCard :title="formTitle">
    <VCardText>
      <VForm
        ref="refForm"
        @submit.prevent="submitForm"
      >
        <VRow>
          <VCol cols="12">
            <VCombobox
              v-model="form.pegawai_id"
              :items="pegawaiOptions"
              item-title="title"
              item-value="value"
              :loading="loadingPegawai"
              label="Pegawai"
              placeholder="Ketik nama atau NIY pegawai"
              clearable
              auto-select-first
              :rules="pegawaiRules"
            />
          </VCol>

          <VCol
            v-if="selectedPegawaiIdValue"
            cols="12"
          >
            <div class="piutang-preview">
              <div class="d-flex flex-wrap align-center justify-space-between gap-3 mb-3">
                <div>
                  <div class="text-subtitle-2 font-weight-medium">
                    Piutang Pegawai Terpilih
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    Ringkasan piutang dan pembayaran pegawai.
                  </div>
                </div>

                <VChip
                  color="primary"
                  variant="tonal"
                  size="small"
                  label
                >
                  Mode {{ cicilanMode === "gabung" ? "Gabung" : "Pisah" }}
                </VChip>
              </div>

              <VProgressLinear
                v-if="loadingPreview"
                indeterminate
                color="primary"
                class="mb-3"
              />

              <template v-else-if="piutangPreview">
                <div class="piutang-preview-summary mb-3">
                  <div>
                    <span>Total Piutang</span>
                    <strong>{{ formatRupiah(piutangPreview.nominal || 0) }}</strong>
                  </div>
                  <div>
                    <span>Total Terbayar</span>
                    <strong class="text-success">{{ formatRupiah(piutangPreview.total_terbayar || 0) }}</strong>
                  </div>
                  <div>
                    <span>Sisa Piutang</span>
                    <strong class="text-warning">{{ formatRupiah(piutangPreview.sisa || 0) }}</strong>
                  </div>
                  <div>
                    <span>Default Cicilan</span>
                    <strong>{{ formatRupiah(piutangPreview.default_cicilan || 0) }}</strong>
                  </div>
                </div>

                <VDataTable
                  :headers="[
                    { title: 'Tanggal', key: 'tanggal' },
                    { title: 'Nominal', key: 'nominal', align: 'end' },
                    { title: 'Terbayar', key: 'total_terbayar', align: 'end' },
                    { title: 'Sisa', key: 'sisa', align: 'end' },
                    { title: 'Default Cicilan', key: 'default_cicilan', align: 'end' },
                    { title: 'Status', key: 'status' },
                    { title: 'Keterangan', key: 'keterangan' },
                  ]"
                  :items="previewPiutangRows"
                  density="compact"
                  class="piutang-preview-table"
                >
                  <template #item.nominal="{ item }">
                    {{ formatRupiah(item.nominal) }}
                  </template>

                  <template #item.total_terbayar="{ item }">
                    {{ formatRupiah(item.total_terbayar) }}
                  </template>

                  <template #item.sisa="{ item }">
                    <span :class="item.sisa > 0 ? 'text-warning font-weight-medium' : 'text-success font-weight-medium'">
                      {{ formatRupiah(item.sisa) }}
                    </span>
                  </template>

                  <template #item.default_cicilan="{ item }">
                    {{ formatRupiah(item.default_cicilan) }}
                  </template>

                  <template #item.status="{ item }">
                    <VChip
                      :color="statusColor(item.status)"
                      size="small"
                      label
                    >
                      {{ item.status }}
                    </VChip>
                  </template>

                  <template #item.keterangan="{ item }">
                    {{ item.keterangan || "-" }}
                  </template>

                  <template #bottom />
                </VDataTable>
              </template>

              <div
                v-else-if="previewLoaded"
                class="text-body-2 text-medium-emphasis"
              >
                Belum ada data piutang sebelumnya.
              </div>
            </div>
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <VTextField
              v-model="form.tanggal"
              type="date"
              label="Tanggal"
              :rules="[requiredValidator]"
            />
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <VTextField
              v-model="form.nominal"
              type="number"
              min="1"
              label="Nominal"
              :hint="formatRupiah(form.nominal)"
              persistent-hint
              :rules="[requiredValidator]"
            />
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <VTextField
              v-model="form.default_cicilan"
              type="number"
              min="0"
              label="Default Cicilan"
              :hint="formatRupiah(form.default_cicilan)"
              persistent-hint
            />
          </VCol>

          <VCol cols="12">
            <VTextarea
              v-model="form.keterangan"
              label="Keterangan"
              rows="3"
              auto-grow
            />
          </VCol>

          <VCol
            cols="12"
            class="d-flex flex-wrap gap-4"
          >
            <VBtn
              variant="outlined"
              color="secondary"
              prepend-icon="ri-arrow-left-line"
              @click="router.push('/admin/piutang')"
            >
              Kembali
            </VBtn>

            <VSpacer />

            <VBtn
              type="submit"
              color="primary"
              prepend-icon="ri-save-line"
              :loading="saving"
            >
              Simpan
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>

<style scoped>
.piutang-preview {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  padding: 16px;
}

.piutang-preview-summary {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.piutang-preview-summary div {
  min-inline-size: 0;
}

.piutang-preview-summary span {
  display: block;
  color: rgba(var(--v-theme-on-surface), 0.62);
  font-size: 0.8125rem;
}

.piutang-preview-summary strong {
  display: block;
  overflow-wrap: anywhere;
}

.piutang-preview-table {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
}

@media (max-width: 960px) {
  .piutang-preview-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .piutang-preview-summary {
    grid-template-columns: 1fr;
  }
}
</style>
