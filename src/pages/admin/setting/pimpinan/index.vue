<script setup>
/* eslint-disable camelcase */
import { showSnackbar } from "@/composables/snackbar"
import SignaturePad from "@/components/admin/pimpinan/SignaturePad.vue"

const page = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref([{ key: "tanggal_awal_menjabat", order: "desc" }])
const search = ref("")
const dataTable = ref([])
const totalItems = ref(0)
const activePimpinanList = ref([])
const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const editingId = ref(null)
const deleteData = ref(null)
const uploadedPreviewUrl = ref("")
let searchTimer = null

const emptyForm = () => ({
  nama: "",
  jabatan: "",
  signature_input_mode: "upload",
  file_ttd: null,
  ttd_drawn: "",
  existingFileTtdUrl: null,
  tanggal_awal_menjabat: "",
  tanggal_akhir_menjabat: "",
  status: "aktif",
  hapus_file_ttd: false,
})

const form = ref(emptyForm())

const pickerConfig = {
  altInput: true,
  altFormat: "d F Y",
  dateFormat: "Y-m-d",
  disableMobile: true,
}

const statusOptions = [
  { title: "Aktif", value: "aktif" },
  { title: "Tidak Aktif", value: "tidak_aktif" },
]

const signatureInputModeOptions = [
  { title: "Upload", value: "upload", icon: "ri-upload-2-line" },
  { title: "Draw", value: "draw", icon: "ri-edit-line" },
]

let syncingForm = false

const dateInputValue = date => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const addYearsToDateInput = (value, years) => {
  const [year, month, day] = value.split("-").map(Number)

  if (!year || !month || !day) return ""

  return dateInputValue(new Date(year + years, month - 1, day))
}

const selectedFileTtd = computed(() => {
  const file = Array.isArray(form.value.file_ttd)
    ? form.value.file_ttd[0]
    : form.value.file_ttd

  return file instanceof File ? file : null
})

const hasNewSignatureInput = computed(() => {
  return Boolean(selectedFileTtd.value || form.value.ttd_drawn)
})

const currentPreviewUrl = computed(() => {
  if (form.value.signature_input_mode === "draw" && form.value.ttd_drawn) {
    return form.value.ttd_drawn
  }

  return uploadedPreviewUrl.value || form.value.existingFileTtdUrl
})

const formatDate = value => {
  if (!value) return "-"

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`))
}

const errorMessage = err => {
  const message = err.data?.message

  if (message && typeof message === "object") {
    return Object.values(message).flat().join("; ")
  }

  return message || err.message || "Terjadi kesalahan."
}

const revokeUploadedPreview = () => {
  if (uploadedPreviewUrl.value) {
    URL.revokeObjectURL(uploadedPreviewUrl.value)
    uploadedPreviewUrl.value = ""
  }
}

watch(
  () => form.value.file_ttd,
  value => {
    revokeUploadedPreview()

    const file = Array.isArray(value) ? value[0] : value
    if (file instanceof File) uploadedPreviewUrl.value = URL.createObjectURL(file)
  },
)

watch(
  () => form.value.signature_input_mode,
  value => {
    if (value === "upload") {
      form.value.ttd_drawn = ""

      return
    }

    form.value.file_ttd = null
    revokeUploadedPreview()
  },
)

watch(
  () => form.value.tanggal_awal_menjabat,
  value => {
    if (syncingForm || !value) return

    form.value.tanggal_akhir_menjabat = addYearsToDateInput(value, 5)
  },
)

watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    page.value = 1
    fetchData()
  }, 350)
})

const fetchData = async () => {
  try {
    loading.value = true

    const currentSort = sortBy.value[0] || {
      key: "tanggal_awal_menjabat",
      order: "desc",
    }

    const [response, activeResponse] = await Promise.all([
      $api("/admin/pimpinan", {
        method: "GET",
        params: {
          page: page.value,
          limit: itemsPerPage.value,
          search: search.value,
          sort_key: currentSort.key,
          sort_order: currentSort.order,
        },
      }),
      $api("/admin/pimpinan/aktif", {
        method: "GET",
      }),
    ])

    dataTable.value = response.data.data
    totalItems.value = response.data.total

    activePimpinanList.value = Array.isArray(activeResponse.data)
      ? activeResponse.data
      : []
  } catch (err) {
    showSnackbar({ text: errorMessage(err), color: "error" })
  } finally {
    loading.value = false
  }
}

const loadItems = options => {
  page.value = options.page
  itemsPerPage.value = options.itemsPerPage
  sortBy.value = options.sortBy
  fetchData()
}

const resetForm = () => {
  revokeUploadedPreview()
  editingId.value = null
  form.value = emptyForm()
}

const openCreate = () => {
  resetForm()
  dialogVisible.value = true
}

const openEdit = item => {
  resetForm()
  editingId.value = item.id

  syncingForm = true
  form.value = {
    nama: item.nama,
    jabatan: item.jabatan,
    signature_input_mode: "upload",
    file_ttd: null,
    ttd_drawn: "",
    existingFileTtdUrl: item.file_ttd_url,
    tanggal_awal_menjabat: item.tanggal_awal_menjabat,
    tanggal_akhir_menjabat: item.tanggal_akhir_menjabat || "",
    status: item.status,
    hapus_file_ttd: false,
  }

  nextTick(() => {
    syncingForm = false
  })

  dialogVisible.value = true
}

const save = async () => {
  if (saving.value) return

  if (!form.value.nama || !form.value.jabatan || !form.value.tanggal_awal_menjabat) {
    showSnackbar({
      text: "Nama, jabatan, dan tanggal awal menjabat wajib diisi.",
      color: "warning",
    })

    return
  }

  try {
    saving.value = true

    const body = new FormData()

    body.append("nama", form.value.nama)
    body.append("jabatan", form.value.jabatan)
    body.append("mode_ttd", "file")
    body.append("tanggal_awal_menjabat", form.value.tanggal_awal_menjabat)
    body.append("tanggal_akhir_menjabat", form.value.tanggal_akhir_menjabat || "")
    body.append("status", form.value.status)
    body.append("hapus_file_ttd", form.value.hapus_file_ttd ? "1" : "0")

    if (form.value.signature_input_mode === "upload" && selectedFileTtd.value) {
      body.append("file_ttd", selectedFileTtd.value)
    }

    if (form.value.signature_input_mode === "draw" && form.value.ttd_drawn) {
      body.append("ttd_drawn", form.value.ttd_drawn)
    }

    let url = "/admin/pimpinan"
    if (editingId.value) {
      url += `/${editingId.value}`

      body.append("_method", "PUT")
    }

    const response = await $api(url, {
      method: "POST",
      body,
    })

    showSnackbar({ text: response.message, color: "success" })
    dialogVisible.value = false
    resetForm()
    fetchData()
  } catch (err) {
    showSnackbar({ text: errorMessage(err), color: "error" })
  } finally {
    saving.value = false
  }
}

const confirmDelete = item => {
  deleteData.value = item
  deleteDialogVisible.value = true
}

const destroy = async () => {
  if (!deleteData.value) return

  try {
    const response = await $api(`/admin/pimpinan/${deleteData.value.id}`, {
      method: "DELETE",
    })

    showSnackbar({ text: response.message, color: "success" })
    deleteDialogVisible.value = false
    deleteData.value = null
    fetchData()
  } catch (err) {
    showSnackbar({ text: errorMessage(err), color: "error" })
  }
}

onMounted(() => {
  document.title = "Pimpinan - SIMKEU"
})

onBeforeUnmount(() => {
  clearTimeout(searchTimer)
  revokeUploadedPreview()
})
</script>

<template>
  <div>
    <VAlert
      v-if="activePimpinanList.length"
      color="success"
      variant="tonal"
      icon="ri-user-star-line"
      class="mb-4"
    >
      <div class="font-weight-semibold">
        Pimpinan aktif: {{ activePimpinanList.length }} orang
      </div>
      <div class="d-flex flex-wrap gap-2 mt-2">
        <VChip
          v-for="item in activePimpinanList"
          :key="item.id"
          color="success"
          variant="tonal"
          size="small"
          label
        >
          {{ item.nama }} - {{ item.jabatan }}
        </VChip>
      </div>
    </VAlert>

    <VCard>
      <VCardItem>
        <VCardTitle>Data Pimpinan</VCardTitle>
        <VCardSubtitle>
          Status aktif menandai pimpinan yang sedang menjabat.
        </VCardSubtitle>

        <template #append>
          <VBtn
            prepend-icon="ri-add-line"
            @click="openCreate"
          >
            Tambah Pimpinan
          </VBtn>
        </template>
      </VCardItem>

      <VDivider />

      <VCardText>
        <VTextField
          v-model="search"
          placeholder="Cari nama atau jabatan"
          prepend-inner-icon="ri-search-line"
          density="compact"
          clearable
          hide-details
          class="pimpinan-search"
        />
      </VCardText>

      <VDataTableServer
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        v-model:sort-by="sortBy"
        :headers="[
          { title: 'Nama', key: 'nama' },
          { title: 'Jabatan', key: 'jabatan' },
          { title: 'Periode Menjabat', key: 'tanggal_awal_menjabat' },
          { title: 'Tanda Tangan', key: 'file_ttd_url', sortable: false },
          { title: 'Status', key: 'status' },
          { title: '', key: 'actions', sortable: false, align: 'end' },
        ]"
        :items="dataTable"
        :items-length="totalItems"
        :loading
        item-value="id"
        @update:options="loadItems"
      >
        <template #item.tanggal_awal_menjabat="{ item }">
          <div>{{ formatDate(item.tanggal_awal_menjabat) }}</div>
          <div class="text-caption text-medium-emphasis">
            s.d. {{ formatDate(item.tanggal_akhir_menjabat) }}
          </div>
        </template>

        <template #item.file_ttd_url="{ item }">
          <div class="d-flex align-center gap-3">
            <VImg
              v-if="item.file_ttd_url"
              :src="item.file_ttd_url"
              width="64"
              height="44"
              contain
              class="pimpinan-signature-thumb"
            />
            <VChip
              :color="item.file_ttd_url ? 'primary' : 'secondary'"
              size="small"
              variant="tonal"
              label
            >
              {{ item.file_ttd_url ? "File TTD" : "Tanpa TTD" }}
            </VChip>
          </div>
        </template>

        <template #item.status="{ item }">
          <VChip
            :color="item.status === 'aktif' ? 'success' : 'secondary'"
            size="small"
            variant="tonal"
            label
          >
            {{ item.status === "aktif" ? "Aktif" : "Tidak Aktif" }}
          </VChip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex justify-end gap-1">
            <IconBtn
              size="small"
              @click="openEdit(item)"
            >
              <VIcon icon="ri-edit-line" />
            </IconBtn>
            <IconBtn
              size="small"
              color="error"
              @click="confirmDelete(item)"
            >
              <VIcon icon="ri-delete-bin-line" />
            </IconBtn>
          </div>
        </template>
      </VDataTableServer>
    </VCard>

    <VDialog
      v-model="dialogVisible"
      width="920"
      persistent
    >
      <VCard :title="editingId ? 'Edit Pimpinan' : 'Tambah Pimpinan'">
        <DialogCloseBtn @click="dialogVisible = false" />

        <VCardText>
          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="form.nama"
                label="Nama *"
                placeholder="Nama lengkap pimpinan"
                :disabled="saving"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="form.jabatan"
                label="Jabatan *"
                placeholder="Contoh: Rektor"
                :disabled="saving"
              />
            </VCol>

            <VCol
              cols="12"
              md="4"
            >
              <AppDateTimePicker
                v-model="form.tanggal_awal_menjabat"
                label="Tanggal Awal Menjabat *"
                :config="pickerConfig"
                :disabled="saving"
              />
            </VCol>

            <VCol
              cols="12"
              md="4"
            >
              <AppDateTimePicker
                v-model="form.tanggal_akhir_menjabat"
                label="Tanggal Akhir Menjabat"
                :config="pickerConfig"
                clearable
                :disabled="saving"
              />
            </VCol>

            <VCol
              cols="12"
              md="4"
            >
              <VSelect
                v-model="form.status"
                label="Status *"
                :items="statusOptions"
                :disabled="saving"
              />
            </VCol>

            <VCol
              cols="12"
              md="7"
            >
              <VBtnToggle
                v-model="form.signature_input_mode"
                mandatory
                density="comfortable"
                class="signature-mode-toggle mb-4"
              >
                <VBtn
                  v-for="option in signatureInputModeOptions"
                  :key="option.value"
                  :value="option.value"
                  :disabled="saving"
                  class="signature-mode-toggle__button"
                >
                  <VIcon
                    :icon="option.icon"
                    size="18"
                  />
                  <span>{{ option.title }}</span>
                </VBtn>
              </VBtnToggle>

              <VFileInput
                v-if="form.signature_input_mode === 'upload'"
                v-model="form.file_ttd"
                label="File TTD (opsional)"
                accept="image/png,image/jpeg"
                prepend-icon="ri-upload-2-line"
                show-size
                clearable
                :disabled="saving"
              />

              <SignaturePad
                v-else
                v-model="form.ttd_drawn"
                :disabled="saving"
              />
            </VCol>

            <VCol
              cols="12"
              md="5"
            >
              <div class="text-subtitle-2 mb-2">
                Preview yang dipakai dokumen
              </div>
              <div class="pimpinan-preview">
                <VImg
                  v-if="currentPreviewUrl"
                  :src="currentPreviewUrl"
                  max-width="220"
                  height="150"
                  contain
                />
                <div
                  v-else
                  class="text-center text-medium-emphasis"
                >
                  Belum ada tanda tangan.
                </div>
              </div>

              <VCheckbox
                v-if="editingId && form.existingFileTtdUrl && !hasNewSignatureInput"
                v-model="form.hapus_file_ttd"
                label="Hapus file lama"
                density="compact"
                hide-details
                class="mt-2"
              />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end gap-3">
          <VBtn
            variant="outlined"
            color="secondary"
            :disabled="saving"
            @click="dialogVisible = false"
          >
            Batal
          </VBtn>
          <VBtn
            :loading="saving"
            @click="save"
          >
            Simpan
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <VDialog
      v-model="deleteDialogVisible"
      width="480"
    >
      <VCard title="Hapus Pimpinan">
        <DialogCloseBtn @click="deleteDialogVisible = false" />
        <VCardText>
          Hapus data <strong>{{ deleteData?.nama }}</strong>? File tanda tangan terkait juga akan dihapus.
        </VCardText>
        <VCardText class="d-flex justify-end gap-3">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="deleteDialogVisible = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="error"
            @click="destroy"
          >
            Hapus
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.pimpinan-search {
  max-width: 320px;
}

.signature-mode-toggle {
  display: inline-flex;
  inline-size: 100%;
  max-inline-size: 320px;
  gap: 4px;
  padding: 4px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  background: rgba(var(--v-theme-surface), 0.64);
}

.signature-mode-toggle :deep(.v-btn) {
  flex: 1 1 0;
  min-inline-size: 0;
  block-size: 40px;
  border-radius: 6px !important;
  padding-inline: 14px;
}

.signature-mode-toggle :deep(.v-btn__content) {
  inline-size: 100%;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  letter-spacing: 0;
  white-space: nowrap;
}

.signature-mode-toggle :deep(.v-btn--active) {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.signature-mode-toggle :deep(.v-btn:not(.v-btn--active)) {
  color: rgba(var(--v-theme-on-surface), 0.78);
}

.pimpinan-signature-thumb,
.pimpinan-preview {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  background: #fff;
}

.pimpinan-preview {
  display: flex;
  min-height: 170px;
  align-items: center;
  justify-content: center;
  padding: 10px;
}
</style>
