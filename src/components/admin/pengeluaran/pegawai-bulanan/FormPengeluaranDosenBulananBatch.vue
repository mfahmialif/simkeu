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
const jenisPembayaran = ref("CUS BSI")
const search = ref("")
const rows = ref([])
const currentPage = ref(1)
const rowsPerPage = ref(15)
const loading = ref(false)
const saving = ref(false)

const jenisPembayaranList = ["CUS BSI", "Transfer"]
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
  rowTotal(item) > 0,
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

const rowTotal = item =>
  Math.round(Number(item.barokah_dosen_tetap || 0) + Number(item.barokah_struktural || 0))

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
      barokah_dosen_tetap: Number(item.barokah_dosen_tetap || 0),
      barokah_struktural: Number(item.barokah_struktural || 0),
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
      rowTotal(item) > 0 || item.pengeluaran_id,
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
      barokah_dosen_tetap: Number(item.barokah_dosen_tetap || 0),
      barokah_struktural: Number(item.barokah_struktural || 0),
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

    <VCard>
      <VCardItem>
        <div class="d-flex flex-wrap align-center gap-3">
          <div>
            <VCardTitle>Daftar {{ pegawaiTitle }}</VCardTitle>
            <VCardSubtitle v-if="rekapId">
              {{ totalPegawai }} {{ pegawaiTitle.toLowerCase() }} diisi, total {{ formatRupiah(totalBarokah) }}
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
          <span>Barokah Tetap</span>
          <span>Struktural</span>
          <span>Total</span>
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
            v-model.number="item.barokah_dosen_tetap"
            type="number"
            min="0"
            label="Barokah Tetap"
            :hint="formatRupiah(item.barokah_dosen_tetap)"
            persistent-hint
            density="compact"
          />

          <VTextField
            v-model.number="item.barokah_struktural"
            type="number"
            min="0"
            label="Struktural"
            :hint="formatRupiah(item.barokah_struktural)"
            persistent-hint
            density="compact"
          />

          <div class="dosen-total">
            <span class="text-caption text-medium-emphasis">Total</span>
            <strong>
              {{ formatRupiah(rowTotal(item)) }}
            </strong>
          </div>

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
  grid-template-columns: minmax(190px, 1.1fr) minmax(125px, 0.65fr) minmax(125px, 0.65fr) minmax(110px, 0.55fr) minmax(135px, 0.65fr) minmax(280px, 1.35fr);
  gap: 12px;
  align-items: center;
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

.dosen-total {
  display: flex;
  min-block-size: 56px;
  flex-direction: column;
  justify-content: center;
}

.dosen-total strong {
  overflow-wrap: anywhere;
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

  .dosen-identity,
  .dosen-total {
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

  .dosen-identity,
  .dosen-total {
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
