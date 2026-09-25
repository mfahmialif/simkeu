<script setup>
import { showSnackbar } from "@/composables/snackbar"

const router = useRouter()

const page = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref({ key: "id", order: "desc" })
const search = ref("")
const selectedStatus = ref("all")
const dataTable = ref([])
const totalItems = ref(0)
const loading = ref(true)
const initialLoading = ref(true)

const statusOptions = [
  { title: "Semua Status", value: "all" },
  { title: "Aktif", value: "1" },
  { title: "Nonaktif", value: "0" },
]

// Filter Jenis Prasyarat (Ada Syarat vs Tanpa Syarat / Bebas)
const selectedPrereqFilter = ref("all")
const summaryStats = ref({
  total: 0,
  with_prereq: 0,
  without_prereq: 0,
})

const prereqOptions = computed(() => [
  { title: summaryStats.value.total ? `Semua Aturan (${summaryStats.value.total})` : "Semua Aturan", value: "all" },
  { title: summaryStats.value.with_prereq ? `Ada Prasyarat (${summaryStats.value.with_prereq})` : "Ada Prasyarat", value: "with_prereq" },
  { title: summaryStats.value.without_prereq ? `Tanpa Prasyarat (${summaryStats.value.without_prereq})` : "Tanpa Prasyarat (Bebas)", value: "without_prereq" },
])

// Master tagihan names for dropdowns
const tagihanNames = ref([])
const loadingNames = ref(false)

const fetchTagihanNames = async () => {
  try {
    loadingNames.value = true
    const res = await $api("/admin/pemasukan/mahasiswa/syarat-tagihan/tagihan-names", {
      method: "GET",
    })

    if (res?.data) {
      tagihanNames.value = res.data
    }
  } catch (err) {
    console.error("Gagal mengambil nama tagihan:", err)
  } finally {
    loadingNames.value = false
  }
}

// Tagihan belum terregistrasi (unregistered)
const unregisteredData = ref({
  total_unregistered: 0,
  master_count: 0,
  perorangan_count: 0,
  items: [],
  master_items: [],
  perorangan_items: [],
  regular_count: 0,
  sp_count: 0,
  regular_items: [],
  sp_items: [],
})
const loadingUnregistered = ref(false)
const searchUnregistered = ref("")
const hidePerorangan = ref(true)
const isUnregisteredExpanded = ref(true)

const fetchUnregistered = async () => {
  try {
    loadingUnregistered.value = true
    const res = await $api("/admin/pemasukan/mahasiswa/syarat-tagihan/unregistered", {
      method: "GET",
    })

    if (res?.data) {
      unregisteredData.value = res.data
    }
  } catch (err) {
    console.error("Gagal mengambil data tagihan belum terregistrasi:", err)
  } finally {
    loadingUnregistered.value = false
  }
}

const filteredUnregisteredList = computed(() => {
  const baseList = hidePerorangan.value
    ? (unregisteredData.value.master_items || [])
    : (unregisteredData.value.items || [])

  if (!searchUnregistered.value) return baseList

  const query = searchUnregistered.value.toLowerCase().trim()
  return baseList.filter(item => item.toLowerCase().includes(query))
})

const quickAddRule = tagihanNama => {
  isEditMode.value = false
  onlyUnregisteredInModal.value = true
  formData.value = {
    id: null,
    tagihan_nama: tagihanNama,
    syarat_nama: [],
    is_active: true,
    keterangan: "",
  }
  isDialogFormVisible.value = true
}

const fetchData = async () => {
  try {
    loading.value = true

    const params = {
      page: page.value,
      limit: itemsPerPage.value,
      sort_key: sortBy.value.key,
      sort_order: sortBy.value.order,
      search: search.value,
    }

    if (selectedStatus.value !== "all") {
      params.is_active = selectedStatus.value
    }

    if (selectedPrereqFilter.value !== "all") {
      params.tipe_syarat = selectedPrereqFilter.value
    }

    const res = await $api("/admin/pemasukan/mahasiswa/syarat-tagihan", {
      method: "GET",
      body: params,
    })

    dataTable.value = res?.data?.data || []
    totalItems.value = res?.data?.total || 0
    if (res?.stats) {
      summaryStats.value = res.stats
    }
  } catch (err) {
    console.error("Gagal mengambil data syarat tagihan:", err)
    showSnackbar({
      text: err?.data?.message || err?.message || "Gagal memuat data syarat tagihan",
      color: "error",
    })
  } finally {
    loading.value = false
    if (initialLoading.value) initialLoading.value = false
  }
}

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb }) => {
  page.value = p
  itemsPerPage.value = ipp
  if (sb?.length) sortBy.value = sb[0]
  fetchData()
}

// Dialog Form (Add / Edit)
const isDialogFormVisible = ref(false)
const isEditMode = ref(false)
const formSubmitting = ref(false)
const formData = ref({
  id: null,
  tagihan_nama: "",
  syarat_nama: [], // array for add, string for edit
  is_active: true,
  keterangan: "",
})

// Filter dropdown di dalam modal Tambah Aturan
const onlyUnregisteredInModal = ref(true)
const hidePeroranganInModal = ref(true)

const availableTargetTagihan = computed(() => {
  if (isEditMode.value) {
    return tagihanNames.value
  }

  if (onlyUnregisteredInModal.value) {
    const list = hidePeroranganInModal.value
      ? (unregisteredData.value.master_items || [])
      : (unregisteredData.value.items || [])

    // Jika tagihan_nama sudah terisi (misal lewat Quick Add), pastikan tetap ada dalam opsi
    if (formData.value.tagihan_nama && !list.includes(formData.value.tagihan_nama)) {
      return [formData.value.tagihan_nama, ...list]
    }
    return list
  }

  return tagihanNames.value
})

const availableSyaratTagihan = computed(() => {
  const currentTarget = formData.value.tagihan_nama
  if (!currentTarget) {
    return tagihanNames.value
  }
  // Tagihan target tidak boleh menjadi prasyarat untuk dirinya sendiri
  return tagihanNames.value.filter(name => name !== currentTarget)
})

const openAddDialog = () => {
  isEditMode.value = false
  onlyUnregisteredInModal.value = true
  hidePeroranganInModal.value = true
  formData.value = {
    id: null,
    tagihan_nama: "",
    syarat_nama: [],
    is_active: true,
    keterangan: "",
  }
  if (!unregisteredData.value.items || unregisteredData.value.items.length === 0) {
    fetchUnregistered()
  }
  isDialogFormVisible.value = true
}

const openEditDialog = item => {
  isEditMode.value = true
  formData.value = {
    id: item.id,
    tagihan_nama: item.tagihan_nama,
    syarat_nama: item.syarat_nama,
    is_active: Boolean(item.is_active),
    keterangan: item.keterangan || "",
  }
  isDialogFormVisible.value = true
}

const submitForm = async () => {
  if (!formData.value.tagihan_nama) {
    showSnackbar({ text: "Pilih tagihan target terlebih dahulu", color: "error" })
    return
  }

  try {
    formSubmitting.value = true

    const payloadSyarat = formData.value.syarat_nama && formData.value.syarat_nama.length > 0
      ? formData.value.syarat_nama
      : null

    if (isEditMode.value) {
      const res = await $api(`/admin/pemasukan/mahasiswa/syarat-tagihan/${formData.value.id}`, {
        method: "PUT",
        body: {
          tagihan_nama: formData.value.tagihan_nama,
          syarat_nama: payloadSyarat,
          is_active: formData.value.is_active,
          keterangan: formData.value.keterangan,
        },
      })

      if (res?.status) {
        showSnackbar({ text: res.message || "Aturan syarat berhasil diperbarui", color: "success" })
        isDialogFormVisible.value = false
        fetchData()
        fetchUnregistered()
      } else {
        showSnackbar({ text: res?.message || "Gagal memperbarui aturan", color: "error" })
      }
    } else {
      const res = await $api("/admin/pemasukan/mahasiswa/syarat-tagihan", {
        method: "POST",
        body: {
          tagihan_nama: formData.value.tagihan_nama,
          syarat_nama: payloadSyarat,
          is_active: formData.value.is_active,
          keterangan: formData.value.keterangan,
        },
      })

      if (res?.status) {
        showSnackbar({ text: res.message || "Aturan syarat berhasil disimpan", color: "success" })
        isDialogFormVisible.value = false
        fetchData()
        fetchUnregistered()
      } else {
        showSnackbar({ text: res?.message || "Gagal menyimpan aturan", color: "error" })
      }
    }
  } catch (err) {
    console.error("Gagal simpan aturan:", err)
    showSnackbar({
      text: err?.data?.message || err?.message || "Terjadi kesalahan saat menyimpan aturan",
      color: "error",
    })
  } finally {
    formSubmitting.value = false
  }
}

// Quick status toggle
const toggleLoading = ref({})

const toggleStatus = async item => {
  const newStatus = !item.is_active
  toggleLoading.value[item.id] = true

  try {
    const res = await $api(`/admin/pemasukan/mahasiswa/syarat-tagihan/${item.id}`, {
      method: "PUT",
      body: {
        is_active: newStatus,
      },
    })

    if (res?.status) {
      item.is_active = newStatus
      showSnackbar({
        text: `Status aturan berhasil diubah menjadi ${newStatus ? "Aktif" : "Nonaktif"}`,
        color: "success",
      })
    } else {
      showSnackbar({ text: res?.message || "Gagal mengubah status", color: "error" })
    }
  } catch (err) {
    console.error("Gagal ubah status:", err)
    showSnackbar({
      text: err?.data?.message || err?.message || "Gagal mengubah status aturan",
      color: "error",
    })
  } finally {
    toggleLoading.value[item.id] = false
  }
}

// Dialog Delete
const isDialogDeleteVisible = ref(false)
const itemToDelete = ref(null)
const deleteLoading = ref(false)

const openDeleteDialog = item => {
  itemToDelete.value = item
  isDialogDeleteVisible.value = true
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return

  try {
    deleteLoading.value = true
    const res = await $api(`/admin/pemasukan/mahasiswa/syarat-tagihan/${itemToDelete.value.id}`, {
      method: "DELETE",
    })

    if (res?.status) {
      showSnackbar({ text: res.message || "Aturan syarat berhasil dihapus", color: "success" })
      isDialogDeleteVisible.value = false
      itemToDelete.value = null
      fetchData()
      fetchUnregistered()
    } else {
      showSnackbar({ text: res?.message || "Gagal menghapus aturan", color: "error" })
    }
  } catch (err) {
    console.error("Gagal hapus aturan:", err)
    showSnackbar({
      text: err?.data?.message || err?.message || "Gagal menghapus aturan",
      color: "error",
    })
  } finally {
    deleteLoading.value = false
  }
}

// Dialog Reset All
const isDialogResetVisible = ref(false)
const resetLoading = ref(false)

const openResetDialog = () => {
  isDialogResetVisible.value = true
}

const confirmResetAll = async () => {
  try {
    resetLoading.value = true
    const res = await $api("/admin/pemasukan/mahasiswa/syarat-tagihan/reset-all", {
      method: "POST",
    })

    if (res?.status) {
      showSnackbar({
        text: res.message || "Seluruh aturan syarat tagihan berhasil dihapus!",
        color: "success",
      })
      isDialogResetVisible.value = false
      page.value = 1
      fetchData()
      fetchUnregistered()
      fetchTagihanNames()
    } else {
      showSnackbar({ text: res?.message || "Gagal menghapus semua aturan", color: "error" })
    }
  } catch (err) {
    console.error("Gagal reset aturan:", err)
    showSnackbar({
      text: err?.data?.message || err?.message || "Terjadi kesalahan saat menghapus semua aturan",
      color: "error",
    })
  } finally {
    resetLoading.value = false
  }
}

// Dialog Template Pengaturan
const isDialogTemplateVisible = ref(false)
const templateLoading = ref(false)
const templateSubmitting = ref(false)
const templateOptions = ref({
  alur_siklus: true,
  antar_semester: true,
  spp_bulanan: true,
  akhir_wisuda: true,
  replace_existing: false,
})
const templatePreviewData = ref({
  total_rules: 0,
  categories: [],
  rules: [],
})

const fetchTemplatePreview = async () => {
  try {
    templateLoading.value = true
    const res = await $api("/admin/pemasukan/mahasiswa/syarat-tagihan/template-preview", {
      method: "GET",
      body: {
        alur_siklus: templateOptions.value.alur_siklus,
        antar_semester: templateOptions.value.antar_semester,
        spp_bulanan: templateOptions.value.spp_bulanan,
        akhir_wisuda: templateOptions.value.akhir_wisuda,
      },
    })

    if (res?.data) {
      templatePreviewData.value = res.data
    }
  } catch (err) {
    console.error("Gagal preview template:", err)
    showSnackbar({
      text: err?.data?.message || err?.message || "Gagal memuat pratinjau template",
      color: "error",
    })
  } finally {
    templateLoading.value = false
  }
}

const openTemplateDialog = () => {
  isDialogTemplateVisible.value = true
  fetchTemplatePreview()
}

const applyTemplateSubmit = async () => {
  try {
    templateSubmitting.value = true
    const res = await $api("/admin/pemasukan/mahasiswa/syarat-tagihan/apply-template", {
      method: "POST",
      body: {
        alur_siklus: templateOptions.value.alur_siklus,
        antar_semester: templateOptions.value.antar_semester,
        spp_bulanan: templateOptions.value.spp_bulanan,
        akhir_wisuda: templateOptions.value.akhir_wisuda,
        replace_existing: templateOptions.value.replace_existing,
      },
    })

    if (res?.status) {
      showSnackbar({
        text: res.message || "Template aturan syarat tagihan berhasil diterapkan!",
        color: "success",
      })
      isDialogTemplateVisible.value = false
      fetchData()
      fetchUnregistered()
    } else {
      showSnackbar({
        text: res?.message || "Gagal menerapkan template aturan",
        color: "error",
      })
    }
  } catch (err) {
    console.error("Gagal menerapkan template:", err)
    showSnackbar({
      text: err?.data?.message || err?.message || "Terjadi kesalahan saat menerapkan template",
      color: "error",
    })
  } finally {
    templateSubmitting.value = false
  }
}

watch(
  () => [
    templateOptions.value.alur_siklus,
    templateOptions.value.antar_semester,
    templateOptions.value.spp_bulanan,
    templateOptions.value.akhir_wisuda,
  ],
  () => {
    if (isDialogTemplateVisible.value) {
      fetchTemplatePreview()
    }
  },
)

// Filter watch
watch([search, selectedStatus, selectedPrereqFilter], () => {
  page.value = 1
  fetchData()
})

onMounted(() => {
  document.title = "Pengaturan Syarat Tagihan SIAKAD - SIMKEU"
  fetchData()
  fetchTagihanNames()
  fetchUnregistered()
})
</script>

<template>
  <div>
    <!-- 👉 Navigation & Header Card -->
    <div class="d-flex align-center gap-3 mb-4">
      <VBtn
        variant="tonal"
        color="secondary"
        size="small"
        prepend-icon="ri-arrow-left-line"
        @click="router.push('/admin/pemasukan/mahasiswa/master/tagihan')"
      >
        Kembali ke Master Tagihan
      </VBtn>
    </div>

    <!-- 👉 Alert Informasi Khusus SIAKAD -->
    <VAlert
      type="info"
      variant="tonal"
      class="mb-4"
      closable
    >
      <div class="font-weight-medium mb-1">
        Pengaturan Prasyarat Tagihan API SIAKAD / Virtual Account
      </div>
      <div class="text-body-2">
        Aturan di halaman ini menentukan tagihan mana yang <strong>diizinkan muncul dan dibayar</strong> oleh mahasiswa saat bertransaksi mandiri via SIAKAD / Virtual Account.
        <br>
        <em>Contoh:</em> Jika tagihan <strong>SPP SEMESTER 2</strong> mensyaratkan <strong>SPP SEMESTER 1</strong> lunas, maka SPP SEMESTER 2 tidak akan muncul di SIAKAD selama SPP SEMESTER 1 masih memiliki sisa tunggakan.
        <br>
        <span class="text-warning font-weight-bold">Catatan:</span> Pengaturan ini <strong>tidak mempengaruhi modul kasir internal Web SIMKEU</strong>. Petugas kasir tetap memiliki visibilitas normal untuk seluruh tagihan mahasiswa.
      </div>
    </VAlert>

    <!-- 👉 Card Tagihan Belum Terregistrasi -->
    <VCard
      class="mb-6"
      variant="outlined"
    >
      <VCardItem class="pb-3">
        <template #prepend>
          <VAvatar
            color="warning"
            variant="tonal"
            rounded
            size="40"
            class="me-3"
          >
            <VIcon
              icon="ri-alert-line"
              size="22"
            />
          </VAvatar>
        </template>

        <VCardTitle class="d-flex align-center flex-wrap gap-2 text-h6 font-weight-bold">
          <span>Tagihan Belum Memiliki Aturan Prasyarat</span>
          <VChip
            size="small"
            color="warning"
            variant="tonal"
            class="font-weight-bold"
          >
            {{ hidePerorangan ? (unregisteredData.master_count || 0) : (unregisteredData.total_unregistered || 0) }} Tagihan Bebas
          </VChip>
        </VCardTitle>

        <VCardSubtitle class="text-body-2 mt-1">
          Tagihan di bawah ini saat ini <strong>bebas muncul di SIAKAD tanpa syarat lunas tagihan lain</strong>. Klik pada nama tagihan untuk langsung membuatkan aturan prasyarat.
        </VCardSubtitle>

        <template #append>
          <div class="d-flex align-center gap-1">
            <VBtn
              icon="ri-refresh-line"
              variant="text"
              color="secondary"
              size="small"
              :loading="loadingUnregistered"
              @click="fetchUnregistered"
            />
            <VBtn
              :icon="isUnregisteredExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"
              variant="text"
              color="secondary"
              size="small"
              @click="isUnregisteredExpanded = !isUnregisteredExpanded"
            />
          </div>
        </template>
      </VCardItem>

      <VExpandTransition>
        <div v-show="isUnregisteredExpanded">
          <VDivider />

          <VCardText class="pb-2 pt-4">
            <!-- Filter Bar for Unregistered -->
            <div class="d-flex flex-wrap align-center justify-space-between gap-3 mb-3">
              <div class="d-flex align-center flex-wrap gap-3">
                <VTextField
                  v-model="searchUnregistered"
                  placeholder="Cari tagihan belum terdaftar (cth: Almamater, KKN)..."
                  prepend-inner-icon="ri-search-line"
                  density="compact"
                  style="inline-size: 320px;"
                  clearable
                  hide-details
                  autocomplete="off"
                  name="search_unregistered"
                />

                <VSwitch
                  v-model="hidePerorangan"
                  density="compact"
                  color="warning"
                  hide-details
                  :label="`Sembunyikan Tagihan Perorangan (${unregisteredData.perorangan_count || 0})`"
                />
              </div>

              <div class="text-caption text-medium-emphasis">
                Menampilkan <strong>{{ filteredUnregisteredList.length }}</strong> dari {{ hidePerorangan ? unregisteredData.master_count : unregisteredData.total_unregistered }} tagihan
              </div>
            </div>

            <!-- Loading State -->
            <div
              v-if="loadingUnregistered"
              class="d-flex align-center justify-center py-6 gap-2"
            >
              <VProgressCircular
                indeterminate
                size="24"
                color="warning"
              />
              <span class="text-body-2 text-medium-emphasis">Memuat daftar tagihan belum terdaftar...</span>
            </div>

            <!-- Empty State -->
            <div
              v-else-if="filteredUnregisteredList.length === 0"
              class="text-center py-4"
            >
              <VAlert
                type="success"
                variant="tonal"
                density="compact"
                class="d-inline-flex align-center"
              >
                {{ searchUnregistered ? 'Tidak ditemukan tagihan yang cocok dengan kata kunci pencarian.' : (hidePerorangan ? 'Seluruh tagihan master sudah memiliki aturan prasyarat!' : 'Seluruh tagihan sudah memiliki aturan prasyarat!') }}
              </VAlert>
            </div>

            <!-- Chips Container -->
            <div
              v-else
              class="d-flex flex-wrap gap-2 py-1"
              style="max-block-size: 200px; overflow-y: auto;"
            >
              <VChip
                v-for="name in filteredUnregisteredList"
                :key="name"
                color="warning"
                variant="outlined"
                size="small"
                class="cursor-pointer text-body-2 font-weight-medium"
                prepend-icon="ri-add-circle-line"
                @click="quickAddRule(name)"
              >
                {{ name }}
                <VTooltip
                  activator="parent"
                  location="top"
                >
                  Klik untuk buat aturan prasyarat: {{ name }}
                </VTooltip>
              </VChip>
            </div>
          </VCardText>

          <VCardActions class="pt-0 px-4 pb-3">
            <span class="text-caption text-medium-emphasis d-flex align-center">
              <VIcon
                icon="ri-information-line"
                size="14"
                class="me-1 text-warning"
              />
              <span>
                <strong>Tips:</strong> Klik salah satu tagihan di atas (misal <em>Almamater</em>, <em>KKN /PPL/PKL</em>) untuk langsung membuka form penambahan aturan dengan tagihan target yang sudah terisi otomatis.
              </span>
            </span>
          </VCardActions>
        </div>
      </VExpandTransition>
    </VCard>

    <!-- 👉 Table Card -->
    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Daftar Aturan Syarat Tagihan (SIAKAD)</VCardTitle>
        <VCardSubtitle>Kelola ketergantungan urutan pembayaran tagihan mahasiswa</VCardSubtitle>
      </VCardItem>

      <VDivider />

      <VCardText class="d-flex flex-wrap gap-4 align-center">
        <!-- Search -->
        <VTextField
          v-model="search"
          placeholder="Cari tagihan atau syarat..."
          prepend-inner-icon="ri-search-line"
          density="compact"
          style="inline-size: 260px;"
          clearable
          autocomplete="off"
          name="search_filter"
        />

        <!-- Filter Jenis Prasyarat (Ada / Tanpa Syarat) -->
        <VSelect
          v-model="selectedPrereqFilter"
          :items="prereqOptions"
          density="compact"
          prepend-inner-icon="ri-filter-3-line"
          style="inline-size: 250px;"
        />

        <!-- Filter Status -->
        <VSelect
          v-model="selectedStatus"
          :items="statusOptions"
          density="compact"
          style="inline-size: 160px;"
        />

        <VBtn
          icon="ri-refresh-line"
          variant="tonal"
          color="secondary"
          size="small"
          :loading="loading"
          @click="fetchData"
        />

        <VSpacer />

        <!-- Tombol Hapus Semua -->
        <VBtn
          color="error"
          variant="tonal"
          prepend-icon="ri-delete-bin-7-line"
          class="me-2"
          :disabled="totalItems === 0 || loading"
          @click="openResetDialog"
        >
          Hapus Semua
        </VBtn>

        <!-- Template Button -->
        <VBtn
          color="success"
          variant="tonal"
          prepend-icon="ri-magic-line"
          class="me-2"
          @click="openTemplateDialog"
        >
          Template Pengaturan
        </VBtn>

        <!-- Add Button -->
        <VBtn
          color="primary"
          prepend-icon="ri-add-line"
          @click="openAddDialog"
        >
          Tambah Aturan
        </VBtn>
      </VCardText>

      <!-- Datatable -->
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :headers="[
          { title: 'No', key: 'id', width: '60px', sortable: false },
          { title: 'Tagihan Target (Yang Ditahan)', key: 'tagihan_nama' },
          { title: 'Tagihan Prasyarat (Wajib Lunas)', key: 'syarat_nama' },
          { title: 'Keterangan', key: 'keterangan' },
          { title: 'Status', key: 'is_active', width: '120px', align: 'center' },
          { title: 'Aksi', key: 'actions', width: '110px', sortable: false, align: 'center' },
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
          <div class="text-center pa-6">
            <VProgressCircular
              indeterminate
              color="primary"
              class="mb-2"
            />
            <div>Memuat data syarat tagihan...</div>
          </div>
        </template>

        <template
          v-else
          #no-data
        >
          <div class="text-center pa-6 text-disabled">
            <VIcon
              icon="ri-file-list-3-line"
              size="40"
              class="mb-2"
            />
            <div>Belum ada aturan syarat tagihan yang ditambahkan.</div>
          </div>
        </template>

        <!-- No column -->
        <template #item.id="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </template>

        <!-- Tagihan Target -->
        <template #item.tagihan_nama="{ item }">
          <div class="d-flex align-center gap-2">
            <VChip
              color="primary"
              size="small"
              label
              class="font-weight-medium"
            >
              {{ item.tagihan_nama }}
            </VChip>
          </div>
        </template>

        <!-- Tagihan Prasyarat -->
        <template #item.syarat_nama="{ item }">
          <div
            v-if="item.syarat_nama"
            class="d-flex align-center gap-2"
          >
            <VIcon
              icon="ri-lock-line"
              size="16"
              color="warning"
            />
            <span class="font-weight-semibold text-high-emphasis">
              {{ item.syarat_nama }}
            </span>
          </div>
          <div
            v-else
            class="d-flex align-center gap-1"
          >
            <VChip
              color="success"
              variant="tonal"
              size="small"
              class="font-weight-medium"
            >
              <VIcon
                icon="ri-checkbox-circle-line"
                size="14"
                class="me-1"
              />
              Tanpa Syarat (Bebas)
            </VChip>
          </div>
        </template>

        <!-- Keterangan -->
        <template #item.keterangan="{ item }">
          <span class="text-body-2 text-medium-emphasis">
            {{ item.keterangan || '-' }}
          </span>
        </template>

        <!-- Status Toggle Switch -->
        <template #item.is_active="{ item }">
          <VSwitch
            :model-value="Boolean(item.is_active)"
            :loading="toggleLoading[item.id] || false"
            color="success"
            density="compact"
            hide-details
            class="d-inline-flex"
            @click.stop="toggleStatus(item)"
          />
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="d-flex justify-center gap-1">
            <IconBtn
              size="small"
              color="info"
              @click="openEditDialog(item)"
            >
              <VIcon icon="ri-edit-line" />
              <VTooltip activator="parent">Edit Aturan</VTooltip>
            </IconBtn>

            <IconBtn
              size="small"
              color="error"
              @click="openDeleteDialog(item)"
            >
              <VIcon icon="ri-delete-bin-line" />
              <VTooltip activator="parent">Hapus Aturan</VTooltip>
            </IconBtn>
          </div>
        </template>
      </VDataTableServer>
    </VCard>

    <!-- 👉 Dialog Tambah / Edit Aturan -->
    <VDialog
      v-model="isDialogFormVisible"
      max-width="600"
      persistent
    >
      <VCard>
        <VCardTitle class="d-flex align-center justify-space-between pa-4">
          <span>{{ isEditMode ? 'Edit Aturan Syarat Tagihan' : 'Tambah Aturan Syarat Tagihan' }}</span>
          <IconBtn
            size="small"
            @click="isDialogFormVisible = false"
          >
            <VIcon icon="ri-close-line" />
          </IconBtn>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-4">
          <VForm
            autocomplete="off"
            @submit.prevent="submitForm"
          >
            <VRow>
              <!-- Tagihan Target -->
              <VCol cols="12">
                <VAutocomplete
                  v-model="formData.tagihan_nama"
                  :items="availableTargetTagihan"
                  :loading="loadingNames || loadingUnregistered"
                  label="Tagihan Target (Yang Ditahan) *"
                  placeholder="Pilih atau cari nama tagihan target"
                  :hint="onlyUnregisteredInModal && !isEditMode ? 'Hanya menampilkan tagihan yang belum memiliki aturan prasyarat' : 'Tagihan ini tidak akan bisa dibayar di SIAKAD jika prasyarat di bawah belum lunas'"
                  persistent-hint
                  clearable
                  autocomplete="off"
                  role="presentation"
                  name="tagihan_target_select"
                />

                <div
                  v-if="!isEditMode"
                  class="d-flex align-center justify-space-between flex-wrap gap-2 mt-2 px-1"
                >
                  <VCheckbox
                    v-model="onlyUnregisteredInModal"
                    density="compact"
                    hide-details
                    label="Hanya tampilkan tagihan belum terdaftar"
                  />

                  <VCheckbox
                    v-if="onlyUnregisteredInModal"
                    v-model="hidePeroranganInModal"
                    density="compact"
                    hide-details
                    label="Sembunyikan Tagihan Perorangan"
                  />
                </div>
              </VCol>

              <!-- Tagihan Prasyarat -->
              <VCol cols="12">
                <!-- When Adding: Multi-select with chips -->
                <VAutocomplete
                  v-if="!isEditMode"
                  v-model="formData.syarat_nama"
                  :items="availableSyaratTagihan"
                  :loading="loadingNames"
                  multiple
                  chips
                  closable-chips
                  label="Tagihan Prasyarat (Wajib Lunas - Opsional)"
                  placeholder="Pilih satu atau beberapa tagihan prasyarat (atau kosongkan jika bebas)"
                  hint="Kosongkan jika tagihan ini bebas tanpa prasyarat (langsung dapat dibayar di SIAKAD)"
                  persistent-hint
                  clearable
                  autocomplete="off"
                  role="presentation"
                  name="syarat_nama_multi_select"
                />

                <!-- When Editing: Single select -->
                <VAutocomplete
                  v-else
                  v-model="formData.syarat_nama"
                  :items="availableSyaratTagihan"
                  :loading="loadingNames"
                  label="Tagihan Prasyarat (Wajib Lunas - Opsional)"
                  placeholder="Pilih nama tagihan prasyarat (atau kosongkan jika bebas)"
                  hint="Kosongkan jika tagihan ini bebas tanpa prasyarat"
                  persistent-hint
                  clearable
                  autocomplete="off"
                  role="presentation"
                  name="syarat_nama_single_select"
                />
              </VCol>

              <!-- Keterangan -->
              <VCol cols="12">
                <VTextarea
                  v-model="formData.keterangan"
                  label="Keterangan / Catatan (Opsional)"
                  placeholder="Contoh: Tagihan SPP semester genap wajib melunasi semester ganjil sebelumnya"
                  rows="2"
                  auto-grow
                  autocomplete="off"
                />
              </VCol>

              <!-- Status Aktif -->
              <VCol cols="12">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-body-1 font-weight-medium">Status Aturan</div>
                    <div class="text-caption text-medium-emphasis">
                      {{ formData.is_active ? 'Aturan aktif dan diterapkan pada API SIAKAD' : 'Aturan dinonaktifkan' }}
                    </div>
                  </div>
                  <VSwitch
                    v-model="formData.is_active"
                    color="success"
                    density="compact"
                    hide-details
                  />
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn
            variant="outlined"
            color="secondary"
            :disabled="formSubmitting"
            @click="isDialogFormVisible = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="primary"
            :loading="formSubmitting"
            @click="submitForm"
          >
            {{ isEditMode ? 'Simpan Perubahan' : 'Simpan Aturan' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- 👉 Dialog Konfirmasi Hapus -->
    <VDialog
      v-model="isDialogDeleteVisible"
      max-width="480"
    >
      <VCard>
        <VCardTitle class="pa-4">
          Konfirmasi Hapus Aturan
        </VCardTitle>
        <VCardText class="pa-4 pt-0">
          Apakah Anda yakin ingin menghapus aturan prasyarat ini?
          <div
            v-if="itemToDelete"
            class="pa-3 mt-3 bg-var-theme-background rounded border text-body-2"
          >
            <div><strong>Tagihan Target:</strong> {{ itemToDelete.tagihan_nama }}</div>
            <div><strong>Prasyarat:</strong> {{ itemToDelete.syarat_nama }}</div>
          </div>
        </VCardText>
        <VCardActions class="pa-4 pt-0">
          <VSpacer />
          <VBtn
            variant="outlined"
            color="secondary"
            :disabled="deleteLoading"
            @click="isDialogDeleteVisible = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="error"
            :loading="deleteLoading"
            @click="confirmDelete"
          >
            Hapus
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- 👉 Dialog Konfirmasi Hapus Semua -->
    <VDialog
      v-model="isDialogResetVisible"
      max-width="500"
    >
      <VCard>
        <VCardTitle class="pa-4 d-flex align-center gap-2 text-error">
          <VIcon
            icon="ri-error-warning-line"
            size="24"
            color="error"
          />
          <span>Hapus Semua Aturan Syarat Tagihan?</span>
        </VCardTitle>

        <VCardText class="pa-4 pt-0">
          <p class="mb-3 text-body-1">
            Apakah Anda yakin ingin <strong>menghapus seluruh aturan syarat tagihan</strong> (total {{ totalItems }} aturan)?
          </p>

          <VAlert
            type="warning"
            variant="tonal"
            density="compact"
            class="mb-0"
          >
            <div class="text-caption">
              Setelah dihapus, <strong>seluruh tagihan mahasiswa akan menjadi bebas</strong> dan dapat dibayarkan langsung via SIAKAD/Virtual Account tanpa prasyarat apapun. Tindakan ini tidak dapat dibatalkan.
            </div>
          </VAlert>
        </VCardText>

        <VCardActions class="pa-4 pt-0">
          <VSpacer />
          <VBtn
            variant="outlined"
            color="secondary"
            :disabled="resetLoading"
            @click="isDialogResetVisible = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="error"
            :loading="resetLoading"
            @click="confirmResetAll"
          >
            Ya, Hapus Semua Aturan
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- 👉 Dialog Template Pengaturan -->
    <VDialog
      v-model="isDialogTemplateVisible"
      max-width="820"
      persistent
    >
      <VCard>
        <VCardTitle class="d-flex align-center justify-space-between pa-4">
          <div class="d-flex align-center gap-2">
            <VIcon
              icon="ri-magic-line"
              color="success"
            />
            <span>Template Standar Syarat Tagihan SIAKAD</span>
          </div>
          <IconBtn
            size="small"
            @click="isDialogTemplateVisible = false"
          >
            <VIcon icon="ri-close-line" />
          </IconBtn>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-4">
          <!-- Information Banner -->
          <VAlert
            type="info"
            variant="tonal"
            class="mb-4"
          >
            <div class="font-weight-medium mb-1">
              Otomatisasi Ketergantungan Siklus Akademik & Kelulusan
            </div>
            <div class="text-body-2">
              Template ini memindai seluruh master tagihan (mengecualikan tagihan perorangan) dan secara otomatis membentuk aturan:
              <ul class="ps-4 mt-1 mb-1">
                <li><strong>Dalam Semester:</strong> Registrasi / Daftar Ulang &rarr; SPP &rarr; UTS &rarr; UAS.</li>
                <li><strong>Antar Semester:</strong> Semester berikutnya ($S+1$) wajib menyelesaikan semester sebelumnya ($S$).</li>
                <li><strong>SPP Bulanan:</strong> Bulan ke-$N$ wajib menyelesaikan bulan sebelumnya ($N-1$).</li>
                <li><strong>Tagihan Akhir / Wisuda:</strong> Sumbangan Pendidikan, Sumbangan Perpus, dan Skripsi ditahan di akhir masa studi, serta Wisuda wajib menyelesaikan seluruhnya.</li>
              </ul>
            </div>
          </VAlert>

          <!-- Checkboxes Kategori Template -->
          <div class="text-subtitle-2 font-weight-bold mb-2">
            Pilih Kategori Aturan Template:
          </div>

          <VRow class="mb-3">
            <VCol
              cols="12"
              sm="6"
              class="py-1"
            >
              <VCheckbox
                v-model="templateOptions.alur_siklus"
                label="Alur Siklus Semester (Registrasi → SPP → UTS → UAS)"
                density="compact"
                hide-details
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
              class="py-1"
            >
              <VCheckbox
                v-model="templateOptions.antar_semester"
                label="Urutan Antar Semester (Semester N+1 mensyaratkan Semester N)"
                density="compact"
                hide-details
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
              class="py-1"
            >
              <VCheckbox
                v-model="templateOptions.spp_bulanan"
                label="Urutan SPP Bulanan (Bulan N mensyaratkan Bulan N-1)"
                density="compact"
                hide-details
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
              class="py-1"
            >
              <VCheckbox
                v-model="templateOptions.akhir_wisuda"
                label="Tagihan Akhir (Sumbangan Pendidikan, Perpus, Skripsi, Wisuda)"
                density="compact"
                hide-details
              />
            </VCol>
          </VRow>

          <VDivider class="my-3" />

          <!-- Summary & Preview Breakdown -->
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="text-subtitle-2 font-weight-bold">
              Ringkasan Aturan yang Dihasilkan
            </div>
            <VChip
              color="primary"
              variant="elevated"
              size="small"
              class="font-weight-bold"
            >
              Total: {{ templatePreviewData.total_rules }} Aturan
            </VChip>
          </div>

          <!-- Progress / Loading -->
          <div
            v-if="templateLoading"
            class="text-center pa-4"
          >
            <VProgressCircular
              indeterminate
              color="primary"
              size="24"
              class="me-2"
            />
            <span class="text-body-2">Menganalisis nama tagihan dan menyiapkan template...</span>
          </div>

          <!-- Category Breakdown Cards -->
          <div
            v-else
            class="d-flex flex-column gap-2"
          >
            <VCard
              v-for="cat in templatePreviewData.categories"
              :key="cat.kategori"
              variant="outlined"
              density="compact"
              class="pa-3"
            >
              <div class="d-flex align-center justify-space-between">
                <span class="font-weight-medium text-body-2">
                  <VIcon
                    icon="ri-arrow-right-s-line"
                    size="16"
                    class="me-1"
                  />
                  {{ cat.kategori }}
                </span>
                <VChip
                  size="x-small"
                  color="info"
                  variant="tonal"
                >
                  {{ cat.count }} aturan
                </VChip>
              </div>

              <!-- Samples -->
              <div class="mt-2 text-caption text-medium-emphasis ps-4">
                <em>Contoh:</em>
                <span
                  v-for="(s, sIdx) in cat.samples.slice(0, 2)"
                  :key="sIdx"
                  class="d-block"
                >
                  • [{{ s.tagihan_nama }}] wajib lunas [{{ s.syarat_nama }}]
                </span>
              </div>
            </VCard>
          </div>

          <!-- Opsi Timpa / Mode -->
          <div class="mt-4 pa-3 bg-var-theme-background rounded border">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-body-2 font-weight-medium">
                  Mode Penggabungan
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ templateOptions.replace_existing
                    ? 'PERINGATAN: Semua aturan lama akan dihapus dan digantikan seluruhnya oleh template ini'
                    : 'Rekomendasi: Aturan lama dipertahankan, hanya menambahkan aturan baru atau memperbarui status' }}
                </div>
              </div>
              <VSwitch
                v-model="templateOptions.replace_existing"
                :color="templateOptions.replace_existing ? 'error' : 'primary'"
                density="compact"
                hide-details
                label="Timpa Semua (Reset)"
              />
            </div>
          </div>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn
            variant="outlined"
            color="secondary"
            :disabled="templateSubmitting"
            @click="isDialogTemplateVisible = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="success"
            prepend-icon="ri-magic-line"
            :loading="templateSubmitting"
            :disabled="templateLoading || templatePreviewData.total_rules === 0"
            @click="applyTemplateSubmit"
          >
            Terapkan Template Ini ({{ templatePreviewData.total_rules }} Aturan)
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
