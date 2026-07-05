<script setup>
/* eslint-disable camelcase */
import { formatRupiah } from "@/composables/formatRupiah"
import { showSnackbar } from "@/composables/snackbar"

definePage({
  meta: {
    roles: ["admin", "pimpinan", "kabag_pengeluaran", "barokahdosen_bulanan"],
  },
})

const page = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref({ key: "tanggal", order: "desc" })
const search = ref("")
const selectedStatus = ref(null)
const tanggalMulai = ref(null)
const tanggalSelesai = ref(null)
const dataTable = ref([])
const totalItems = ref(0)
const summary = ref({ jumlah: 0, total_piutang: 0, total_terbayar: 0, sisa: 0 })
const loading = ref(true)
const initialLoading = ref(true)
const cicilanMode = ref("pisah")
const deleteDialog = ref(false)
const deleteData = ref(null)
const deleting = ref(false)
let filterTimer = null
let filtersReady = false

const CICILAN_MODE_STORAGE_KEY = "simkeu.piutang.cicilanMode"

const statusOptions = [
  { title: "Semua Status", value: null },
  { title: "Aktif", value: "aktif" },
  { title: "Lunas", value: "lunas" },
]

const cicilanModeOptions = [
  { title: "Gabung", value: "gabung" },
  { title: "Pisah", value: "pisah" },
]

const setCicilanMode = mode => {
  cicilanMode.value = normalizeCicilanMode(mode)
}

const normalizeCicilanMode = value => value === "gabung" ? "gabung" : "pisah"

const loadCicilanMode = () => {
  if (typeof window === "undefined") return

  cicilanMode.value = normalizeCicilanMode(window.localStorage.getItem(CICILAN_MODE_STORAGE_KEY))
}

const requestParams = computed(() => ({
  group_by: "pegawai",
  cicilan_mode: cicilanMode.value,
  page: page.value,
  limit: itemsPerPage.value,
  sort_key: sortBy.value.key,
  sort_order: sortBy.value.order,
  search: search.value,
  ...(selectedStatus.value && { status: selectedStatus.value }),
  ...(tanggalMulai.value && { tanggal_mulai: tanggalMulai.value }),
  ...(tanggalSelesai.value && { tanggal_selesai: tanggalSelesai.value }),
}))

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

const fetchData = async () => {
  try {
    loading.value = true

    const response = await $api("/admin/piutang", {
      method: "GET",
      body: requestParams.value,
    })

    dataTable.value = response.data?.data || []
    totalItems.value = response.data?.total || dataTable.value.length
    summary.value = response.summary || summary.value
  } catch (err) {
    showSnackbar({ color: "error", text: errorMessage(err) })
  } finally {
    loading.value = false
    if (initialLoading.value) initialLoading.value = false
  }
}

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb }) => {
  page.value = p
  itemsPerPage.value = ipp
  if (sb.length) sortBy.value = sb[0]
  fetchData()
}

const resetFilters = () => {
  search.value = ""
  selectedStatus.value = null
  tanggalMulai.value = null
  tanggalSelesai.value = null
  page.value = 1
  fetchData()
}

const statusColor = status => String(status).toLowerCase() === "lunas" ? "success" : "warning"

const openDeleteDialog = item => {
  deleteData.value = item
  deleteDialog.value = true
}

const closeDeleteDialog = () => {
  if (deleting.value) return

  deleteDialog.value = false
  deleteData.value = null
}

const deletePiutang = async () => {
  if (!deleteData.value?.pegawai_id || deleting.value) return

  try {
    deleting.value = true

    const response = await $api(`/admin/piutang/pegawai/${deleteData.value.pegawai_id}`, {
      method: "DELETE",
    })

    showSnackbar({
      color: "success",
      text: response.message || "Piutang berhasil dihapus.",
    })
    deleteDialog.value = false
    deleteData.value = null
    fetchData()
  } catch (err) {
    showSnackbar({ color: "error", text: errorMessage(err) })
  } finally {
    deleting.value = false
  }
}

watch([search, selectedStatus, tanggalMulai, tanggalSelesai, cicilanMode], () => {
  if (!filtersReady) return

  page.value = 1
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CICILAN_MODE_STORAGE_KEY, cicilanMode.value)
  }
  clearTimeout(filterTimer)
  filterTimer = setTimeout(fetchData, 300)
})

onMounted(() => {
  document.title = "Piutang Pegawai - SIMKEU"
  loadCicilanMode()
  filtersReady = true
  fetchData()
})
</script>

<template>
  <div>
    <div class="page-heading mb-6">
      <div>
        <div class="cicilan-mode mb-4">
          <span class="cicilan-mode__label">Mode Cicilan</span>
          <div class="cicilan-mode__control">
            <button
              v-for="mode in cicilanModeOptions"
              :key="mode.value"
              type="button"
              class="cicilan-mode__button"
              :class="{ 'is-active': cicilanMode === mode.value }"
              @click="setCicilanMode(mode.value)"
            >
              {{ mode.title }}
            </button>
          </div>
        </div>

        <h4 class="text-h4 font-weight-medium">
          Piutang Pegawai
        </h4>
        <div class="text-body-1 text-medium-emphasis mt-1">
          Pinjaman lembaga kepada pegawai dan riwayat pembayarannya.
        </div>
      </div>

      <VBtn
        color="primary"
        prepend-icon="ri-add-line"
        @click="$router.push('/admin/piutang/add')"
      >
        Tambah Piutang
      </VBtn>
    </div>

    <VRow class="mb-4">
      <VCol
        cols="12"
        md="3"
      >
        <VCard>
          <VCardText>
            <div class="text-body-2 text-medium-emphasis mb-1">
              Total Piutang
            </div>
            <div class="text-h5 font-weight-medium">
              {{ formatRupiah(summary.total_piutang || 0) }}
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol
        cols="12"
        md="3"
      >
        <VCard>
          <VCardText>
            <div class="text-body-2 text-medium-emphasis mb-1">
              Total Terbayar
            </div>
            <div class="text-h5 font-weight-medium text-success">
              {{ formatRupiah(summary.total_terbayar || 0) }}
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol
        cols="12"
        md="3"
      >
        <VCard>
          <VCardText>
            <div class="text-body-2 text-medium-emphasis mb-1">
              Sisa Piutang
            </div>
            <div class="text-h5 font-weight-medium text-warning">
              {{ formatRupiah(summary.sisa || 0) }}
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol
        cols="12"
        md="3"
      >
        <VCard>
          <VCardText>
            <div class="text-body-2 text-medium-emphasis mb-1">
              Data
            </div>
            <div class="text-h5 font-weight-medium">
              {{ summary.jumlah || 0 }}
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VCard>
      <VCardText class="d-flex flex-wrap gap-4 align-center">
        <VTextField
          v-model="search"
          prepend-inner-icon="ri-search-line"
          placeholder="Cari pegawai atau keterangan..."
          density="compact"
          hide-details
          style="inline-size: 280px"
        />

        <VSelect
          v-model="selectedStatus"
          :items="statusOptions"
          label="Status"
          density="compact"
          clearable
          hide-details
          style="inline-size: 180px"
        />

        <VTextField
          v-model="tanggalMulai"
          type="date"
          label="Tanggal Mulai"
          density="compact"
          hide-details
          style="inline-size: 180px"
        />

        <VTextField
          v-model="tanggalSelesai"
          type="date"
          label="Tanggal Selesai"
          density="compact"
          hide-details
          style="inline-size: 180px"
        />

        <VSpacer />

        <VBtn
          color="secondary"
          variant="tonal"
          prepend-icon="ri-filter-off-line"
          @click="resetFilters"
        >
          Reset
        </VBtn>
      </VCardText>

      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :headers="[
          { title: 'No', key: 'no', width: 60, sortable: false },
          { title: 'Periode', key: 'tanggal' },
          { title: 'Pegawai', key: 'nama_pegawai' },
          { title: 'Piutang', key: 'jumlah_piutang', align: 'center' },
          { title: 'Nominal', key: 'nominal', align: 'end' },
          { title: 'Terbayar', key: 'total_terbayar', align: 'end' },
          { title: 'Sisa', key: 'sisa', align: 'end' },
          { title: 'Default Cicilan', key: 'default_cicilan', align: 'end' },
          { title: 'Status', key: 'status' },
          { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
        ]"
        :items="dataTable"
        :items-length="totalItems"
        :loading="loading"
        item-value="id"
        @update:options="loadItems"
      >
        <template
          v-if="initialLoading"
          #loading
        >
          <div class="text-center pa-4">
            <VProgressCircular
              indeterminate
              color="primary"
              class="mb-2"
            />
            <div>Memuat data...</div>
          </div>
        </template>

        <template #item.no="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </template>

        <template #item.tanggal="{ item }">
          <div class="font-weight-medium">
            {{ item.tanggal_terakhir || item.tanggal || "-" }}
          </div>
          <div
            v-if="item.tanggal_awal && item.tanggal_awal !== item.tanggal_terakhir"
            class="text-caption text-medium-emphasis"
          >
            dari {{ item.tanggal_awal }}
          </div>
        </template>

        <template #item.nama_pegawai="{ item }">
          <RouterLink
            v-if="item.pegawai_id"
            class="pegawai-name-link font-weight-medium"
            :to="`/admin/piutang/detail/${item.pegawai_id}`"
          >
            {{ item.nama_pegawai || "-" }}
          </RouterLink>
          <div
            v-else
            class="font-weight-medium"
          >
            {{ item.nama_pegawai || "-" }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ item.kode_pegawai || "-" }} - {{ item.tipe_pegawai || "pegawai" }}
          </div>
        </template>

        <template #item.jumlah_piutang="{ item }">
          <VChip
            size="small"
            color="primary"
            variant="tonal"
            label
          >
            {{ item.jumlah_aktif || 0 }}/{{ item.jumlah_piutang || 0 }}
          </VChip>
        </template>

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

        <template #item.actions="{ item }">
          <IconBtn size="small">
            <VIcon icon="ri-more-2-fill" />
            <VMenu activator="parent">
              <VList>
                <VListItem
                  prepend-icon="ri-eye-line"
                  @click="$router.push(`/admin/piutang/detail/${item.pegawai_id}`)"
                >
                  Detail
                </VListItem>
                <VListItem
                  prepend-icon="ri-delete-bin-line"
                  class="text-error"
                  @click="openDeleteDialog(item)"
                >
                  Hapus
                </VListItem>
              </VList>
            </VMenu>
          </IconBtn>
        </template>
      </VDataTableServer>
    </VCard>

    <VDialog
      v-model="deleteDialog"
      max-width="480"
    >
      <VCard title="Hapus Piutang">
        <DialogCloseBtn
          variant="text"
          size="default"
          :disabled="deleting"
          @click="closeDeleteDialog"
        />

        <VCardText>
          <div class="text-body-1 mb-2">
            Hapus piutang milik
            <strong>{{ deleteData?.nama_pegawai || "-" }}</strong>?
          </div>
          <div class="text-body-2 text-medium-emphasis">
            {{ deleteData?.jumlah_piutang || 0 }} data piutang akan dihapus. Data yang sudah memiliki pembayaran atau sudah masuk proses RAB tidak dapat dihapus.
          </div>
        </VCardText>

        <VCardText class="d-flex justify-end gap-3">
          <VBtn
            variant="outlined"
            color="secondary"
            :disabled="deleting"
            @click="closeDeleteDialog"
          >
            Batal
          </VBtn>
          <VBtn
            color="error"
            prepend-icon="ri-delete-bin-line"
            :loading="deleting"
            :disabled="deleting"
            @click="deletePiutang"
          >
            Hapus
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.page-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.cicilan-mode {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding-block-start: 2px;
}

.cicilan-mode__label {
  color: rgba(var(--v-theme-on-surface), 0.68);
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
}

.cicilan-mode__control {
  display: inline-grid;
  grid-template-columns: repeat(2, minmax(74px, 1fr));
  overflow: hidden;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  background: rgba(var(--v-theme-surface), 0.24);
  min-block-size: 36px;
}

.cicilan-mode__button {
  border: 0;
  background: transparent;
  color: rgba(var(--v-theme-on-surface), 0.78);
  cursor: pointer;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  inline-size: 100%;
  line-height: 1;
  min-inline-size: 74px;
  padding: 0 14px;
}

.cicilan-mode__button + .cicilan-mode__button {
  border-inline-start: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.cicilan-mode__button.is-active {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.pegawai-name-link {
  color: inherit;
  text-decoration: none;
}

.pegawai-name-link:focus-visible,
.pegawai-name-link:hover {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 720px) {
  .page-heading {
    align-items: stretch;
    flex-direction: column;
  }

  .cicilan-mode {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .cicilan-mode__control {
    inline-size: 100%;
  }
}
</style>
