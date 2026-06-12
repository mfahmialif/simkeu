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
const selectedRekap = ref(null)
const loadingBatch = ref(false)
const originalRowIds = ref([])
const removedRowIds = ref([])
const mobileSummaryHidden = ref(false)

const queryRekapId = computed(() => {
  const value = route.query.rekap_id
  
  return Array.isArray(value) ? value[0] : value
})

const isBatchEdit = computed(() => route.query.edit_batch === "1")
const rekapId = ref(queryRekapId.value || null)

const returnPath = computed(() => {
  const value = route.query.return_to
  const path = Array.isArray(value) ? value[0] : value
  if (typeof path === "string" && path.startsWith("/admin/pengeluaran/rumah-tangga")) {
    return path
  }
  
  return "/admin/pengeluaran/rumah-tangga"
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

const newSubItem = () => ({
  key: `${Date.now()}-${Math.random()}`,
  tanggal: defaultRowDate(),
  nama_kegiatan: "",
  nominal: 0,
  volume: null,
  satuan: null,
  jenis_pembayaran: "Tunai",
  bukti_transfer: null,
  existing_bukti_transfer_url: null,
  lampiran: [],
  existing_lampiran: [],
  removed_lampiran: [],
  keterangan: "",
})

const newItem = () => ({
  key: `item-${Date.now()}-${Math.random()}`,
  kelompok_anggaran: "",
  subItems: [newSubItem()],
})

const items = ref([newItem()])
const paymentItems = ["Tunai", "Transfer"]
const factorValue = value => (value === null || value === "" || value === undefined ? 1 : Number(value || 0))

const flatRows = computed(() => {
  const flat = []

  items.value.forEach(item => {
    item.subItems.forEach(sub => {
      flat.push({ ...sub, kelompok_anggaran: item.kelompok_anggaran })
    })
  })
  
  return flat
})

const kelompokAnggaranItems = computed(() => Array.from(new Set(
  flatRows.value
    .map(row => String(row.kelompok_anggaran || "").trim())
    .filter(Boolean),
)).sort((a, b) => a.localeCompare(b, "id-ID")))

const rowTotal = row => Math.round(Number(row.nominal || 0) * factorValue(row.volume))
const grandTotal = computed(() => flatRows.value.reduce((total, row) => total + rowTotal(row), 0))

const summaryItems = computed(() => [
  { label: "Jumlah Uraian", value: items.value.length, plain: true },
  { label: "Jumlah Sub Item", value: flatRows.value.length, plain: true },
  { label: "Total Keseluruhan", value: grandTotal.value, total: true },
])

const selectedFile = value => {
  if (Array.isArray(value)) return value[0] || null
  
  return value || null
}

const formatMonthYear = value => {
  const match = String(value || "").match(/^(\d{4})-(\d{2})/)
  if (!match) return "-"
  
  return new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date(Number(match[1]), Number(match[2]) - 1, 1))
}

const formatDate = value => {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return "-"
  
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
}

const errorMessage = err => {
  const message = err?.data?.message || err?.response?._data?.message || err?.response?.data?.message || err?.message
  if (typeof message === "object") return Object.values(message).flat().join("; ")
  
  return message || "Terjadi kesalahan."
}

const detailToRow = item => ({
  key: `existing-${item.id}`,
  id: item.id,
  tanggal: item.tanggal || defaultRowDate(),
  nama_kegiatan: item.nama_kegiatan || "",
  nominal: Number(item.nominal || item.total || 0),
  volume: item.volume ?? null,
  satuan: item.satuan ?? null,
  jenis_pembayaran: item.jenis_pembayaran || "Tunai",
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

    const response = await $api("/admin/pengeluaran/rumah-tangga", {
      method: "GET",
      body: { rekap_id: rekapId.value, limit: 1000, sort_key: "id", sort_order: "asc" },
    })

    const fetchedRows = response.data?.data || []

    originalRowIds.value = fetchedRows.map(row => row.id).filter(Boolean)
    removedRowIds.value = []
    
    const grouped = {}

    fetchedRows.forEach(detail => {
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
    
    items.value = newItems.length ? newItems : [newItem()]
  } catch (err) {
    showSnackbar({ text: errorMessage(err), color: "error" })
  } finally {
    loadingBatch.value = false
  }
}

const onRekapSelected = rekap => {
  const previousDefaultDate = defaultRowDate()

  selectedRekap.value = rekap
  if (!rekap?.tanggal_rekap) return
  items.value.forEach(item => {
    item.subItems.forEach(row => {
      if (!row.tanggal || row.tanggal === previousDefaultDate) {
        row.tanggal = rekap.tanggal_rekap
      }
    })
  })
}

const addItem = () => {
  items.value.push(newItem())
}

const removeItem = index => {
  const item = items.value[index]

  item.subItems.forEach(sub => {
    if (sub.id) removedRowIds.value.push(sub.id)
  })
  if (items.value.length === 1) {
    items.value[0] = newItem()
    
    return
  }
  items.value.splice(index, 1)
}

const addSubItem = (item, index = item.subItems.length - 1) => {
  item.subItems.splice(index + 1, 0, newSubItem())
}

const duplicateSubItem = (item, index) => {
  const source = item.subItems[index] || newSubItem()

  const duplicated = {
    ...newSubItem(),
    tanggal: source.tanggal || defaultRowDate(),
    nama_kegiatan: source.nama_kegiatan || "",
    nominal: source.nominal ?? 0,
    volume: source.volume ?? null,
    satuan: source.satuan ?? null,
    jenis_pembayaran: source.jenis_pembayaran || "Tunai",
    keterangan: source.keterangan || "",
  }

  item.subItems.splice(index + 1, 0, duplicated)
}

const removeSubItem = (item, index) => {
  const removed = item.subItems[index]
  if (removed?.id) removedRowIds.value.push(removed.id)
  if (item.subItems.length === 1) {
    item.subItems[0] = newSubItem()
    
    return
  }
  item.subItems.splice(index, 1)
}

const validateRows = () => {
  if (!rekapId.value) return "Rekap harus dipilih."
  for (let i = 0; i < items.value.length; i++) {
    const item = items.value[i]
    if (!String(item.kelompok_anggaran || "").trim()) return `Item Kelompok Anggaran ke-${i + 1} harus diisi.`
    for (let j = 0; j < item.subItems.length; j++) {
      const row = item.subItems[j]
      const label = `Item ke-${i + 1} Sub-item ${j + 1}`
      if (!row.tanggal) return `${label}: tanggal harus diisi.`
      if (!String(row.nama_kegiatan || "").trim()) return `${label}: uraian harus diisi.`
      if (rowTotal(row) < 0) return `${label}: harga satuan atau volume tidak valid.`
    }
  }
  
  return null
}

const appendRowFormData = (formData, row, prefix = null) => {
  const key = name => (prefix ? `${prefix}[${name}]` : name)
  const kelompokAnggaranValue = String(row.kelompok_anggaran || "").trim()

  formData.append(key("tanggal"), row.tanggal)
  formData.append(key("kelompok_anggaran"), kelompokAnggaranValue)
  formData.append(key("nama_kegiatan"), row.nama_kegiatan || "")
  formData.append(key("nominal"), Number(row.nominal || 0))
  if (row.volume !== null && row.volume !== "") formData.append(key("volume"), row.volume)
  if (row.satuan !== null && row.satuan !== "") formData.append(key("satuan"), row.satuan)
  formData.append(key("jenis_pembayaran"), row.jenis_pembayaran)
  formData.append(key("keterangan"), row.keterangan || "")

  const file = selectedFile(row.bukti_transfer)
  if (file instanceof File) formData.append(key("bukti_transfer"), file)
  appendLampiranFormData(formData, row.lampiran, row.removed_lampiran, prefix || "")
}

const submitBatchEdit = async () => {
  const formData = new FormData()

  formData.append("rekap_id", rekapId.value)
  removedRowIds.value.forEach((id, index) => {
    formData.append(`deleted_ids[${index}]`, id)
  })
  let flatIndex = 0
  items.value.forEach(item => {
    item.subItems.forEach(sub => {
      const prefix = `items[${flatIndex}]`
      if (sub.id) formData.append(`${prefix}[id]`, sub.id)
      appendRowFormData(formData, { ...sub, kelompok_anggaran: item.kelompok_anggaran }, prefix)
      flatIndex++
    })
  })
  
  return $api("/admin/pengeluaran/rumah-tangga/batch-update", { method: "POST", body: formData })
}

const submit = async () => {
  if (saving.value) return
  const formValidation = await formRef.value?.validate()
  if (formValidation && !formValidation.valid) return
  const validationMessage = validateRows()
  if (validationMessage) {
    showSnackbar({ text: validationMessage, color: "warning" })
    
    return
  }
  const formData = new FormData()

  formData.append("rekap_id", rekapId.value)
  let flatIndex = 0
  items.value.forEach(item => {
    item.subItems.forEach(sub => {
      const prefix = `items[${flatIndex}]`

      appendRowFormData(formData, { ...sub, kelompok_anggaran: item.kelompok_anggaran }, prefix)
      flatIndex++
    })
  })
  try {
    saving.value = true

    const response = isBatchEdit.value
      ? await submitBatchEdit()
      : await $api("/admin/pengeluaran/rumah-tangga/batch-store", { method: "POST", body: formData })

    showSnackbar({ text: response.message, color: "success" })
    router.push(returnPath.value)
  } catch (err) {
    showSnackbar({ text: errorMessage(err), color: "error" })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  document.title = `${isBatchEdit.value ? "Edit" : "Tambah"} Pengeluaran Rumah Tangga - SIMKEU`
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
          <VCardTitle>{{ isBatchEdit ? "Edit" : "Tambah" }} Pengeluaran Rumah Tangga</VCardTitle>
          <VCardSubtitle>{{ isBatchEdit ? "Edit beberapa data dalam satu rekap." : "Tambahkan beberapa data sekaligus ke dalam satu rekap." }}</VCardSubtitle>
        </VCardItem>
        <VCardText>
          <PengeluaranRekapSelect
            v-show="!queryRekapId"
            v-model="rekapId"
            endpoint="/admin/pengeluaran/rumah-tangga"
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
              </div><div class="font-weight-medium">
                {{ selectedRekap.nama || "-" }}
              </div>
            </div>
            <div>
              <div class="text-caption text-medium-emphasis">
                Bulan
              </div><div class="font-weight-medium">
                {{ formatMonthYear(selectedRekap.bulan_tahun) }}
              </div>
            </div>
            <div>
              <div class="text-caption text-medium-emphasis">
                Tanggal Rekap
              </div><div class="font-weight-medium">
                {{ formatDate(selectedRekap.tanggal_rekap) }}
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>

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
          v-for="(item, itemIndex) in items"
          :key="item.key"
          class="mb-5"
        >
          <VCard class="item-card">
            <VCardItem class="bg-primary-lighten-4 pt-4 pb-2">
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
            <VDivider />
            <VCardText class="pa-0">
              <div
                v-for="(row, rowIndex) in item.subItems"
                :key="row.key"
                class="expense-row"
              >
                <div class="expense-row-number">
                  {{ rowIndex + 1 }}
                </div>
                <div class="expense-row-content">
                  <VRow>
                    <VCol
                      cols="12"
                      md="2"
                    >
                      <AppDateTimePicker
                        v-model="row.tanggal"
                        label="Tanggal *"
                        density="compact"
                        hide-details
                        :rules="[requiredValidator]"
                        :config="{ altInput: true, altFormat: 'd F Y', dateFormat: 'Y-m-d' }"
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
                        :rules="[requiredValidator]"
                      />
                    </VCol>
                    <VCol
                      cols="12"
                      md="2"
                    >
                      <VSelect
                        v-model="row.jenis_pembayaran"
                        label="Pembayaran *"
                        :items="paymentItems"
                        density="compact"
                        hide-details
                        :rules="[requiredValidator]"
                        @update:model-value="row.bukti_transfer = null"
                      />
                    </VCol>
                    <VCol
                      v-if="row.jenis_pembayaran === 'Transfer'"
                      cols="12"
                      md="2"
                    >
                      <VFileInput
                        v-model="row.bukti_transfer"
                        label="Bukti Transfer"
                        accept="image/png, image/jpeg, application/pdf"
                        :prepend-icon="null"
                        density="compact"
                        hide-details
                      />
                    </VCol>
                    <VCol
                      v-if="row.existing_bukti_transfer_url && row.jenis_pembayaran === 'Transfer'"
                      cols="12"
                      md="2"
                    >
                      <VBtn
                        variant="outlined"
                        color="primary"
                        prepend-icon="ri-file-paper-2-line"
                        :href="row.existing_bukti_transfer_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="w-100"
                        style="height: 40px;"
                      >
                        Bukti Lama
                      </VBtn>
                    </VCol>
                    
                    <VCol
                      cols="12"
                      :md="row.jenis_pembayaran === 'Transfer' ? (row.existing_bukti_transfer_url ? 3 : 4) : 5"
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
                      :md="row.jenis_pembayaran === 'Transfer' ? (row.existing_bukti_transfer_url ? 3 : 4) : 5"
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
                        density="compact"
                        hide-details
                        readonly
                      />
                    </VCol>
                  </VRow>
                </div>
                <div class="expense-row-actions">
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
            v-for="summary in summaryItems"
            :key="summary.label"
            class="summary-item"
            :class="{ 'summary-item-total': summary.total }"
          >
            <span>{{ summary.label }}</span>
            <strong>{{ summary.plain ? summary.value : formatRupiah(summary.value) }}</strong>
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
            {{ isBatchEdit ? "Update" : "Simpan" }} {{ flatRows.length }} Data
          </VBtn>
        </div>
      </div>
    </VForm>
  </div>
</template>

<style scoped>
.item-card {
  border: 1px solid rgba(var(--v-theme-primary), 0.16);
  box-shadow: 0 4px 18px rgba(var(--v-shadow-key-umbra-color), 0.08) !important;
}

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
  grid-template-columns: repeat(3, minmax(110px, 1fr));
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
  .page-with-floating-footer { padding-block-end: 224px; }
  .page-with-floating-footer.is-summary-hidden { padding-block-end: 132px; }
  .expense-row { padding: 16px 12px; gap: 10px; }
  .rekap-info { grid-template-columns: 1fr; }
  .floating-footer { grid-template-columns: 1fr; inset-block-end: 8px; inset-inline: 8px; padding: 10px; }
  .summary-toggle { position: absolute; z-index: 1; inset-block-start: -13px; inset-inline-start: 50%; border: 1px solid rgba(var(--v-theme-primary), 0.28); border-radius: 999px; background: rgb(var(--v-theme-surface)); box-shadow: 0 6px 16px rgba(var(--v-shadow-key-umbra-color), 0.16); color: rgb(var(--v-theme-primary)); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; inline-size: 46px; min-block-size: 26px; padding: 0; transform: translateX(-50%); }
  .floating-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); max-block-size: 156px; opacity: 1; transform: translateY(0); transition: max-block-size 220ms ease, opacity 180ms ease, transform 220ms ease, border-color 180ms ease; }
  .floating-footer.summary-hidden { gap: 0; }
  .floating-footer.summary-hidden .floating-summary { max-block-size: 0; border-color: transparent; opacity: 0; pointer-events: none; transform: translateY(10px); }
  .summary-item { min-block-size: 42px; border-block-end: 1px solid rgba(var(--v-border-color), 0.12); padding: 6px 10px; }
  .summary-item:nth-child(even) { border-inline-end: 0; }
  .summary-item-total { grid-column: 1 / -1; border-block-end: 0; }
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
