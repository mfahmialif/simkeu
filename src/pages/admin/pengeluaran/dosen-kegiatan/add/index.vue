<script setup>
import PengeluaranLampiranInput from "@/components/admin/pengeluaran/PengeluaranLampiranInput.vue"
import PengeluaranRekapSelect from "@/components/admin/pengeluaran/PengeluaranRekapSelect.vue"
import { formatRupiah } from "@/composables/formatRupiah"
import { showSnackbar } from "@/composables/snackbar"
import { appendLampiranFormData } from "@/utils/lampiran"

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const saving = ref(false)
const pegawaiItems = ref([])
const loadingPegawai = ref(false)
const selectedRekap = ref(null)
const loadingBatch = ref(false)
const originalRowIds = ref([])
const removedRowIds = ref([])
const mobileSummaryHidden = ref(false)

// Infinite scroll state
const SCROLL_BATCH = 25
const scrollSentinel = ref(null)
const batchNextPage = ref(1)

const queryRekapId = computed(() => {
  const value = route.query.rekap_id

  return Array.isArray(value) ? value[0] : value
})

const isBatchEdit = computed(() => route.query.edit_batch === "1")
const rekapId = ref(queryRekapId.value || null)

const returnPath = computed(() => {
  const value = route.query.return_to
  const path = Array.isArray(value) ? value[0] : value

  if (
    typeof path === "string"
    && path.startsWith("/admin/pengeluaran/dosen-kegiatan")
  ) {
    return path
  }

  return "/admin/pengeluaran/dosen-kegiatan"
})

const currentDateValue = () => {
  const date = new Date()

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

const defaultRowDate = () => selectedRekap.value?.tanggal_rekap || currentDateValue()

const newRow = () => ({
  key: `${Date.now()}-${Math.random()}`,
  kategori_detail: "pegawai",
  tanggal: defaultRowDate(),
  pegawai_id: null,
  nama_kegiatan: "",
  transport: 0,
  barokah: 0,
  nominal: 0,
  jenis_pembayaran: "CUZ BSI",
  bukti_transfer: null,
  existing_bukti_transfer_url: null,
  lampiran: [],
  existing_lampiran: [],
  removed_lampiran: [],
  keterangan: "",
})

const rows = ref([newRow()])

const kategoriItems = [
  { title: "Pegawai", value: "pegawai" },
  { title: "Nonpegawai", value: "non_pegawai" },
]

const isPegawai = row => row.kategori_detail === "pegawai"

const paymentItems = row => (
  isPegawai(row)
    ? ["CUZ BSI", "Transfer"]
    : ["Tunai", "CUZ BSI", "Transfer"]
)

const rowTotal = row => Math.round(
  isPegawai(row)
    ? Number(row.transport || 0) + Number(row.barokah || 0)
    : Number(row.nominal || 0),
)

const grandTotal = computed(() => rows.value.reduce((total, row) => total + rowTotal(row), 0))

const totalPegawai = computed(() =>
  rows.value
    .filter(row => isPegawai(row))
    .reduce((total, row) => total + rowTotal(row), 0),
)

const totalNonPegawai = computed(() =>
  rows.value
    .filter(row => !isPegawai(row))
    .reduce((total, row) => total + rowTotal(row), 0),
)

const displayRows = computed(() => rows.value.slice(0, batchNextPage.value * SCROLL_BATCH))
const batchHasMore = computed(() => batchNextPage.value * SCROLL_BATCH < rows.value.length)

const summaryItems = computed(() => [
  { label: "Pegawai", value: totalPegawai.value },
  { label: "Nonpegawai", value: totalNonPegawai.value },
  {
    label: isBatchEdit.value ? `Total Keseluruhan (${rows.value.length} baris)` : "Total Keseluruhan",
    value: grandTotal.value,
    total: true,
  },
])

const selectedFile = value => {
  if (Array.isArray(value)) return value[0] || null

  return value || null
}

const transferFileRules = () => []

const formatMonthYear = value => {
  const match = String(value || "").match(/^(\d{4})-(\d{2})/)

  if (!match) return "-"

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(Number(match[1]), Number(match[2]) - 1, 1))
}

const formatDate = value => {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})/)

  if (!match) return "-"

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
}

const rekapNamaKegiatan = computed(() =>
  selectedRekap.value?.nama || (rekapId.value ? `Rekap ${rekapId.value}` : ""),
)

const pegawaiDisplay = item => [
  item.kode,
  item.nama,
  item.dosen?.prodi?.nama || item.dosen?.prodi?.alias || item.staff?.jabatan,
].filter(Boolean).join(" - ")

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

const detailToRow = item => ({
  key: `existing-${item.id}`,
  id: item.id,
  kategori_detail: item.kategori_detail || "pegawai",
  tanggal: item.tanggal || defaultRowDate(),
  pegawai_id: item.pegawai_id || null,
  nama_kegiatan: item.nama_kegiatan || "",
  transport: Number(item.transport || 0),
  barokah: Number(item.barokah || 0),
  nominal: Number(item.nominal || 0),
  jenis_pembayaran: item.jenis_pembayaran || (item.kategori_detail === "non_pegawai" ? "Tunai" : "CUZ BSI"),
  bukti_transfer: null,
  existing_bukti_transfer_url: item.bukti_transfer_url || null,
  lampiran: [],
  existing_lampiran: item.lampiran || [],
  removed_lampiran: [],
  keterangan: item.keterangan || "",
})

const fetchBatchRows = async () => {
  if (!isBatchEdit.value || !rekapId.value) return

  try {
    loadingBatch.value = true

    const response = await $api("/admin/pengeluaran/dosen-kegiatan", {
      method: "GET",
      body: {
        rekap_id: rekapId.value,
        limit: 999999,
        sort_key: "id",
        sort_order: "asc",
      },
    })

    const newRows = (response.data?.data || []).map(detailToRow)

    originalRowIds.value = newRows.map(r => r.id).filter(Boolean)
    rows.value = newRows.length ? newRows : [newRow()]
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    loadingBatch.value = false
  }
}

const onRekapSelected = rekap => {
  const previousDefaultDate = defaultRowDate()

  selectedRekap.value = rekap

  if (!rekap?.tanggal_rekap) return

  rows.value.forEach(row => {
    if (!row.tanggal || row.tanggal === previousDefaultDate) {
      row.tanggal = rekap.tanggal_rekap
    }
  })
}

const onCategoryChange = row => {
  row.pegawai_id = null
  row.bukti_transfer = null

  if (isPegawai(row)) {
    row.nominal = 0
    row.jenis_pembayaran = "CUZ BSI"
  } else {
    row.transport = 0
    row.barokah = 0
    row.jenis_pembayaran = "Tunai"
  }
}

const addRow = (index = rows.value.length - 1) => {
  rows.value.splice(index + 1, 0, newRow())
}

const removeRow = index => {
  const removed = rows.value[index]
  if (removed?.id) {
    removedRowIds.value.push(removed.id)
  }

  if (rows.value.length === 1) {
    rows.value[0] = newRow()
    
    return
  }

  rows.value.splice(index, 1)
}

const validateRows = () => {
  if (!rekapId.value) return "Rekap harus dipilih."

  for (let index = 0; index < rows.value.length; index += 1) {
    const row = rows.value[index]
    const label = `Baris ${index + 1}`

    if (!row.tanggal) return `${label}: tanggal harus diisi.`
    if (isPegawai(row) && !row.pegawai_id) return `${label}: pegawai harus dipilih.`
    if (rowTotal(row) < 0) return `${label}: nominal tidak valid.`
  }

  return null
}

const appendRowFormData = (formData, row, prefix = null) => {
  const key = name => (prefix ? `${prefix}[${name}]` : name)

  formData.append(key("tanggal"), row.tanggal)
  formData.append(key("kategori_detail"), row.kategori_detail)
  if (isPegawai(row)) {
    formData.append(key("pegawai_id"), row.pegawai_id)
  }
  formData.append(key("nama_kegiatan"), isPegawai(row) ? rekapNamaKegiatan.value : (row.nama_kegiatan || rekapNamaKegiatan.value))
  formData.append(key("transport"), isPegawai(row) ? Number(row.transport || 0) : 0)
  formData.append(key("barokah"), isPegawai(row) ? Number(row.barokah || 0) : 0)
  formData.append(key("nominal"), isPegawai(row) ? 0 : Number(row.nominal || 0))
  formData.append(key("jenis_pembayaran"), row.jenis_pembayaran)
  formData.append(key("keterangan"), row.keterangan || "")

  const file = selectedFile(row.bukti_transfer)
  if (file instanceof File) {
    formData.append(key("bukti_transfer"), file)
  }

  appendLampiranFormData(
    formData,
    row.lampiran,
    row.removed_lampiran,
    prefix || "",
  )
}

const submitBatchEdit = async () => {
  const formData = new FormData()

  formData.append("rekap_id", rekapId.value)

  removedRowIds.value.forEach((id, index) => {
    formData.append(`deleted_ids[${index}]`, id)
  })

  rows.value.forEach((row, index) => {
    const prefix = `items[${index}]`
    if (row.id) {
      formData.append(`${prefix}[id]`, row.id)
    }

    appendRowFormData(formData, row, prefix)
  })

  return $api("/admin/pengeluaran/dosen-kegiatan/batch-update", {
    method: "POST",
    body: formData,
  })
}

const submit = async () => {
  if (saving.value) return

  const formValidation = await formRef.value?.validate()
  if (formValidation && !formValidation.valid) return

  const validationMessage = validateRows()
  if (validationMessage) {
    showSnackbar({
      text: validationMessage,
      color: "warning",
    })
    
    return
  }

  const formData = new FormData()

  formData.append("rekap_id", rekapId.value)

  rows.value.forEach((row, index) => {
    const prefix = `items[${index}]`

    appendRowFormData(formData, row, prefix)
  })

  try {
    saving.value = true
    let response

    if (isBatchEdit.value) {
      response = await submitBatchEdit()
    } else {
      response = await $api("/admin/pengeluaran/dosen-kegiatan/batch-store", {
        method: "POST",
        body: formData,
      })
    }

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

let scrollObserver = null

watch(scrollSentinel, el => {
  scrollObserver?.disconnect()
  if (el) scrollObserver?.observe(el)
})

onBeforeUnmount(() => scrollObserver?.disconnect())

onMounted(() => {
  document.title = `${isBatchEdit.value ? "Edit" : "Tambah"} Pengeluaran Kegiatan - SIMKEU`
  fetchPegawai()

  scrollObserver = new IntersectionObserver(entries => {
    if (entries[0]?.isIntersecting && batchHasMore.value) {
      batchNextPage.value += 1
    }
  }, { rootMargin: '400px' })

  fetchBatchRows()
})
</script>

<template>
  <div
    class="page-with-floating-footer"
    :class="{ 'is-summary-hidden': mobileSummaryHidden }"
  >
    <VBtn
      variant="outlined"
      color="secondary"
      prepend-icon="ri-arrow-left-line"
      class="mb-5"
      @click="router.push(returnPath)"
    >
      Kembali
    </VBtn>

    <VForm
      ref="formRef"
      @submit.prevent="submit"
    >
      <VCard class="mb-5">
        <VCardItem>
          <VCardTitle>{{ isBatchEdit ? "Edit" : "Tambah" }} Pengeluaran Kegiatan</VCardTitle>
          <VCardSubtitle>
            {{ isBatchEdit ? "Edit beberapa data dalam satu rekap." : "Tambahkan beberapa data sekaligus ke dalam satu rekap." }}
          </VCardSubtitle>
        </VCardItem>

        <VCardText>
          <PengeluaranRekapSelect
            v-show="!queryRekapId"
            v-model="rekapId"
            endpoint="/admin/pengeluaran/dosen-kegiatan"
            label="Rekap Pengeluaran *"
            :rules="[requiredValidator]"
            :disabled="!!queryRekapId"
            :allow-create="!queryRekapId"
            @selected="onRekapSelected"
          />

          <div
            v-if="selectedRekap"
            class="rekap-info"
            :class="{ 'mt-4': !queryRekapId }"
          >
            <div>
              <div class="text-caption text-medium-emphasis">
                Nama Rekap
              </div>
              <div class="font-weight-medium">
                {{ selectedRekap.nama || "-" }}
              </div>
            </div>
            <div>
              <div class="text-caption text-medium-emphasis">
                Bulan
              </div>
              <div class="font-weight-medium">
                {{ formatMonthYear(selectedRekap.bulan_tahun) }}
              </div>
            </div>
            <div>
              <div class="text-caption text-medium-emphasis">
                Tanggal Rekap
              </div>
              <div class="font-weight-medium">
                {{ formatDate(selectedRekap.tanggal_rekap) }}
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>

      <VCard>
        <VCardItem>
          <VCardTitle>Pengeluaran Kegiatan</VCardTitle>
          <VCardSubtitle>
            {{ loadingBatch ? "Memuat data..." : `${rows.length} baris, total ${formatRupiah(grandTotal)}` }}
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

        <VCardText class="pa-0">
          <div
            v-if="loadingBatch"
            class="text-center pa-6"
          >
            <VProgressCircular
              indeterminate
              color="primary"
              class="mb-2"
            />
            <div>Memuat data pengeluaran...</div>
          </div>

          <template v-else>
            <div
              v-for="(row, index) in displayRows"
              :key="row.key"
              class="expense-row"
            >
              <div class="expense-row-number">
                {{ index + 1 }}
              </div>

              <div class="expense-row-content">
                <VRow>
                  <VCol
                    cols="12"
                    md="2"
                  >
                    <VSelect
                      v-model="row.kategori_detail"
                      label="Kategori *"
                      :items="kategoriItems"
                      :rules="[requiredValidator]"
                      @update:model-value="onCategoryChange(row)"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="2"
                  >
                    <AppDateTimePicker
                      v-model="row.tanggal"
                      label="Tanggal *"
                      :rules="[requiredValidator]"
                      :config="{
                        altInput: true,
                        altFormat: 'd F Y',
                        dateFormat: 'Y-m-d',
                      }"
                    />
                  </VCol>

                  <VCol
                    v-if="isPegawai(row)"
                    cols="12"
                    md="8"
                  >
                    <VAutocomplete
                      v-model="row.pegawai_id"
                      :items="pegawaiItems"
                      item-title="display"
                      item-value="id"
                      label="Pegawai *"
                      :loading="loadingPegawai"
                      :rules="[requiredValidator]"
                      auto-select-first
                      clearable
                    />
                  </VCol>

                  <template v-if="isPegawai(row)">
                    <VCol
                      cols="12"
                      md="2"
                    >
                      <LazyTextField v-model="row.transport"
                        type="number"
                        min="0"
                        label="Transport"
                        :hint="formatRupiah(row.transport)"
                        persistent-hint
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="2"
                    >
                      <LazyTextField v-model="row.barokah"
                        type="number"
                        min="0"
                        label="Barokah"
                        :hint="formatRupiah(row.barokah)"
                        persistent-hint
                      />
                    </VCol>
                  </template>

                  <VCol
                    v-else
                    cols="12"
                    md="3"
                  >
                    <LazyTextField v-model="row.nominal"
                      type="number"
                      min="0"
                      label="Nominal *"
                      :rules="[requiredValidator]"
                      :hint="formatRupiah(row.nominal)"
                      persistent-hint
                    />
                  </VCol>

                  <VCol
                    v-if="!isPegawai(row)"
                    cols="12"
                    md="3"
                  >
                    <VTextField
                      v-model="row.nama_kegiatan"
                      label="Uraian Pengeluaran"
                    />
                  </VCol>

                  <VCol
                    v-if="!isPegawai(row)"
                    cols="12"
                    md="2"
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
                    <VSelect
                      v-model="row.jenis_pembayaran"
                      label="Pembayaran *"
                      :items="paymentItems(row)"
                      :rules="[requiredValidator]"
                      @update:model-value="row.bukti_transfer = null"
                    />
                  </VCol>

                  <VCol
                    v-if="row.jenis_pembayaran === 'Transfer'"
                    cols="12"
                    md="3"
                  >
                    <VFileInput
                      v-model="row.bukti_transfer"
                      label="Bukti Transfer"
                      accept="image/png, image/jpeg, application/pdf"
                      :prepend-icon="null"
                      :rules="transferFileRules(row)"
                    />
                  </VCol>

                  <VCol
                    v-if="row.existing_bukti_transfer_url && row.jenis_pembayaran === 'Transfer'"
                    cols="12"
                    md="3"
                  >
                    <VBtn
                      variant="outlined"
                      color="primary"
                      prepend-icon="ri-file-paper-2-line"
                      :href="row.existing_bukti_transfer_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="w-100"
                    >
                      Bukti Lama
                    </VBtn>
                  </VCol>

                  <VCol
                    v-if="isPegawai(row)"
                    cols="12"
                    :md="row.jenis_pembayaran === 'Transfer' ? 3 : 6"
                  >
                    <VTextField
                      v-model="row.keterangan"
                      label="Keterangan"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="10"
                  >
                    <PengeluaranLampiranInput
                      v-model="row.lampiran"
                      v-model:removed-lampiran="row.removed_lampiran"
                      :existing-lampiran="row.existing_lampiran"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="2"
                  >
                    <VTextField
                      :model-value="formatRupiah(rowTotal(row))"
                      label="Total"
                      readonly
                    />
                  </VCol>
                </VRow>
              </div>

              <div class="expense-row-actions">
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

          <div
            v-if="isBatchEdit && batchHasMore"
            ref="scrollSentinel"
            class="scroll-sentinel"
          >
            <VProgressCircular
              indeterminate
              size="20"
              width="2"
            />
            <span class="text-body-2 text-medium-emphasis">
              Memuat data lagi... ({{ displayRows.length }}/{{ rows.length }})
            </span>
          </div>

          <div
            v-else-if="isBatchEdit && rows.length > SCROLL_BATCH && !batchHasMore"
            class="scroll-sentinel"
          >
            <span class="text-body-2 text-medium-emphasis">
              Semua {{ rows.length }} data sudah dimuat.
            </span>
          </div>
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
            <strong>{{ formatRupiah(item.value) }}</strong>
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
            type="submit"
            color="primary"
            prepend-icon="ri-save-line"
            :loading="saving"
            :disabled="saving"
          >
            {{ isBatchEdit ? "Update" : "Simpan" }} {{ rows.length }} Data
          </VBtn>
        </div>
      </div>
    </VForm>
  </div>
</template>

<style scoped>
.expense-row {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) 40px;
  align-items: start;
  border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding: 20px;
  gap: 14px;
}

.expense-row:last-child {
  border-block-end: 0;
}

.expense-row-number {
  display: grid;
  inline-size: 32px;
  block-size: 32px;
  border-radius: 8px;
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
  font-weight: 700;
  place-items: center;
}

.expense-row-content {
  min-inline-size: 0;
}

.expense-row-actions {
  display: grid;
  gap: 8px;
}

.batch-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
}

.batch-pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.batch-page-size {
  max-inline-size: 120px;
}

.page-with-floating-footer {
  padding-block-end: 98px;
}

.rekap-info {
  display: grid;
  padding: 14px 16px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 10px;
  background: rgba(var(--v-theme-primary), 0.04);
  gap: 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
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
  grid-template-columns: repeat(2, minmax(120px, 1fr)) minmax(160px, 1.2fr);
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

.summary-item span {
  color: rgba(var(--v-theme-on-surface), 0.72);
  font-size: 0.76rem;
  font-weight: 600;
  line-height: 1.2;
}

.summary-item strong {
  color: rgba(var(--v-theme-on-surface), 0.9);
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.summary-item-total {
  background: rgba(var(--v-theme-primary), 0.1);
}

.summary-item-total span,
.summary-item-total strong {
  color: rgb(var(--v-theme-primary));
}

.floating-actions {
  display: flex;
  gap: 12px;
}

.summary-toggle {
  display: none;
}

@media (max-width: 959px) {
  .expense-row {
    grid-template-columns: 32px minmax(0, 1fr);
  }

  .expense-row-actions {
    grid-column: 2;
    display: flex;
    justify-content: flex-end;
  }
}

@media (max-width: 599px) {
  .page-with-floating-footer {
    padding-block-end: 224px;
  }

  .page-with-floating-footer.is-summary-hidden {
    padding-block-end: 132px;
  }

  .expense-row {
    padding: 16px 12px;
    gap: 10px;
  }

  .rekap-info {
    grid-template-columns: 1fr;
  }

  .floating-footer {
    position: fixed;
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
</style>
