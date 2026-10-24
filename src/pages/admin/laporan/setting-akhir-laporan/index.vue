<script setup>
import { computed, onMounted, ref } from "vue"
import { showSnackbar } from "@/composables/snackbar"

const loading = ref(false)
const isSubmitting = ref(false)
const settingsList = ref([])
const optionsData = ref({
  jenis_pembayaran: [],
  bulan: [],
})

const selectedTahun = ref(new Date().getFullYear().toString())

const tahunOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear + 1; i >= 2020; i--) {
    years.push(i.toString())
  }
  
  return years
})

const namaBulanMap = {
  1: "Januari",
  2: "Februari",
  3: "Maret",
  4: "April",
  5: "Mei",
  6: "Juni",
  7: "Juli",
  8: "Agustus",
  9: "September",
  10: "Oktober",
  11: "November",
  12: "Desember",
}

// Dialog Add/Edit State
const isDialogOpen = ref(false)
const isEditMode = ref(false)
const editId = ref(null)

const defaultFormData = () => ({
  tahun: parseInt(selectedTahun.value) || new Date().getFullYear(),
  bulan: new Date().getMonth() + 1,
  tanggal_akhir: 29,
  jenis_pembayaran_key: "cash",
  keterangan: "",
})

const formData = ref(defaultFormData())

// Dialog Delete State
const isDeleteOpen = ref(false)
const deleteTarget = ref(null)

const fetchOptions = async () => {
  try {
    const res = await $api("/admin/pemasukan/mahasiswa/laporan/setting-akhir-laporan/options", {
      method: "GET",
    })

    if (res?.status && res?.data) {
      optionsData.value = res.data
    }
  } catch (err) {
    console.error("Gagal mengambil options:", err)
  }
}

const fetchSettings = async () => {
  try {
    loading.value = true

    const res = await $api("/admin/pemasukan/mahasiswa/laporan/setting-akhir-laporan", {
      method: "GET",
      query: {
        tahun: selectedTahun.value,
      },
    })

    if (res?.status && Array.isArray(res?.data)) {
      settingsList.value = res.data
    } else {
      settingsList.value = []
    }
  } catch (err) {
    showSnackbar({
      text: "Gagal mengambil data setting: " + (err.data?.message || err.message),
      color: "error",
    })
  } finally {
    loading.value = false
  }
}

const openAddDialog = () => {
  isEditMode.value = false
  editId.value = null
  formData.value = defaultFormData()
  isDialogOpen.value = true
}

const openEditDialog = item => {
  isEditMode.value = true
  editId.value = item.id
  formData.value = {
    tahun: item.tahun,
    bulan: item.bulan,
    tanggal_akhir: item.tanggal_akhir,
    jenis_pembayaran_key: item.jenis_pembayaran_key || "all",
    keterangan: item.keterangan || "",
  }
  isDialogOpen.value = true
}

const saveSetting = async () => {
  if (!formData.value.tahun || !formData.value.bulan || !formData.value.tanggal_akhir) {
    showSnackbar({
      text: "Tahun, Bulan, dan Tanggal Akhir harus diisi.",
      color: "warning",
    })
    
    return
  }

  try {
    isSubmitting.value = true
    if (isEditMode.value) {
      const res = await $api(`/admin/pemasukan/mahasiswa/laporan/setting-akhir-laporan/${editId.value}`, {
        method: "PUT",
        body: {
          tanggal_akhir: formData.value.tanggal_akhir,
          keterangan: formData.value.keterangan,
        },
      })

      if (res.status) {
        showSnackbar({ text: res.message || "Setting berhasil diperbarui", color: "success" })
        isDialogOpen.value = false
        fetchSettings()
      }
    } else {
      const res = await $api("/admin/pemasukan/mahasiswa/laporan/setting-akhir-laporan", {
        method: "POST",
        body: formData.value,
      })

      if (res.status) {
        showSnackbar({ text: res.message || "Setting berhasil ditambahkan", color: "success" })
        isDialogOpen.value = false
        fetchSettings()
      }
    }
  } catch (err) {
    const msg = err.data?.message || err.message || "Terjadi kesalahan"
    showSnackbar({ text: msg, color: "error" })
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = item => {
  deleteTarget.value = item
  isDeleteOpen.value = true
}

const executeDelete = async () => {
  if (!deleteTarget.value) return
  try {
    isSubmitting.value = true

    const res = await $api(`/admin/pemasukan/mahasiswa/laporan/setting-akhir-laporan/${deleteTarget.value.id}`, {
      method: "DELETE",
    })

    if (res.status) {
      showSnackbar({ text: res.message || "Setting berhasil dihapus", color: "success" })
      isDeleteOpen.value = false
      deleteTarget.value = null
      fetchSettings()
    }
  } catch (err) {
    showSnackbar({
      text: "Gagal menghapus: " + (err.data?.message || err.message),
      color: "error",
    })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  document.title = "Setting Akhir Laporan - SIMKEU"
  fetchOptions()
  fetchSettings()
})
</script>

<template>
  <div>
    <!-- Header Page -->
    <div class="d-flex flex-wrap justify-space-between align-center mb-4 gap-3">
      <div>
        <h2 class="text-h4 font-weight-bold mb-1">
          Setting Akhir Laporan
        </h2>
        <div class="text-body-1 text-medium-emphasis">
          Pengaturan tanggal cut-off akhir laporan keuangan bulanan (sinkronisasi setoran bank dan pembukuan).
        </div>
      </div>
      <div class="d-flex gap-3 align-center">
        <VSelect
          v-model="selectedTahun"
          :items="tahunOptions"
          label="Tahun"
          density="compact"
          style="inline-size: 130px"
          hide-details
          @update:model-value="fetchSettings"
        />
        <VBtn
          color="primary"
          prepend-icon="ri-add-line"
          @click="openAddDialog"
        >
          Tambah Setting
        </VBtn>
      </div>
    </div>

    <!-- Informasi / Petunjuk Alur -->
    <VAlert
      type="info"
      variant="tonal"
      class="mb-6"
      border="start"
    >
      <div class="font-weight-bold mb-1">
        Petunjuk Mekanisme Cut-Off Laporan:
      </div>
      <div class="text-body-2">
        Fitur ini berguna ketika jam operasional setoran bank tutup lebih awal dari aktivitas kasir keuangan (misal setoran BSI tutup jam 15.00 WIB).<br>
        • Transaksi pada tanggal <strong>setelah tanggal akhir</strong> otomatis <strong>dialihkan ke laporan bulan berikutnya</strong>.<br>
        • Contoh: Jika Januari di-set tanggal <strong>29</strong> untuk <strong>Cash / Tunai</strong>, maka transaksi Cash tanggal 30 & 31 Januari otomatis masuk ke laporan Februari.<br>
        • Setting dapat berlaku untuk <strong>Semua Jenis Pembayaran</strong> atau <strong>Satuan Jenis Pembayaran Tertentu</strong>.
      </div>
    </VAlert>

    <!-- Tabel Data Setting -->
    <VCard elevation="2">
      <VCardText class="pa-0">
        <VTable hover class="text-no-wrap">
          <thead>
            <tr>
              <th class="text-center font-weight-bold" style="inline-size: 60px">
                No
              </th>
              <th class="font-weight-bold">
                Bulan & Tahun
              </th>
              <th class="font-weight-bold text-center">
                Tanggal Akhir Cut-Off
              </th>
              <th class="font-weight-bold">
                Jenis Pembayaran
              </th>
              <th class="font-weight-bold">
                Keterangan
              </th>
              <th class="font-weight-bold">
                Dibuat Oleh
              </th>
              <th class="text-center font-weight-bold" style="inline-size: 110px">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="text-center py-6 text-medium-emphasis">
                <VProgressCircular indeterminate color="primary" class="me-2" />
                Memuat data setting akhir laporan...
              </td>
            </tr>
            <tr v-else-if="settingsList.length === 0">
              <td colspan="7" class="text-center py-6 text-medium-emphasis">
                Belum ada setting akhir laporan untuk tahun {{ selectedTahun }}. Silakan klik "Tambah Setting".
              </td>
            </tr>
            <tr v-for="(item, index) in settingsList" :key="item.id">
              <td class="text-center text-medium-emphasis">
                {{ index + 1 }}
              </td>
              <td>
                <div class="font-weight-bold text-primary">
                  {{ namaBulanMap[item.bulan] || `Bulan ${item.bulan}` }} {{ item.tahun }}
                </div>
              </td>
              <td class="text-center">
                <VChip
                  color="primary"
                  variant="elevated"
                  size="small"
                  class="font-weight-bold"
                >
                  Tanggal {{ item.tanggal_akhir }}
                </VChip>
              </td>
              <td>
                <VChip
                  :color="item.jenis_pembayaran_key === 'all' ? 'success' : 'info'"
                  variant="tonal"
                  size="small"
                  class="font-weight-medium"
                >
                  {{ item.jenis_pembayaran_nama || 'Semua Jenis Pembayaran' }}
                </VChip>
              </td>
              <td>
                <span class="text-body-2 text-medium-emphasis">
                  {{ item.keterangan || '-' }}
                </span>
              </td>
              <td>
                <span class="text-caption">
                  {{ item.user?.name || item.user?.username || '-' }}
                </span>
              </td>
              <td class="text-center">
                <div class="d-flex justify-center gap-1">
                  <VBtn
                    icon="ri-edit-line"
                    size="x-small"
                    variant="text"
                    color="primary"
                    @click="openEditDialog(item)"
                  />
                  <VBtn
                    icon="ri-delete-bin-line"
                    size="x-small"
                    variant="text"
                    color="error"
                    @click="confirmDelete(item)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>
    </VCard>

    <!-- Dialog Add / Edit -->
    <VDialog
      v-model="isDialogOpen"
      max-width="560px"
      persistent
    >
      <VCard>
        <VCardTitle class="pa-4 font-weight-bold d-flex justify-space-between align-center">
          <span>{{ isEditMode ? 'Edit Setting Akhir Laporan' : 'Tambah Setting Akhir Laporan' }}</span>
          <VBtn
            icon="ri-close-line"
            size="small"
            variant="text"
            @click="isDialogOpen = false"
          />
        </VCardTitle>
        <VDivider />

        <VCardText class="pa-4">
          <VRow>
            <VCol cols="12" md="6">
              <VSelect
                v-model="formData.tahun"
                :items="tahunOptions"
                label="Tahun"
                :disabled="isEditMode"
                density="compact"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VSelect
                v-model="formData.bulan"
                :items="optionsData.bulan.length ? optionsData.bulan : [
                  { value: 1, label: 'Januari' }, { value: 2, label: 'Februari' },
                  { value: 3, label: 'Maret' }, { value: 4, label: 'April' },
                  { value: 5, label: 'Mei' }, { value: 6, label: 'Juni' },
                  { value: 7, label: 'Juli' }, { value: 8, label: 'Agustus' },
                  { value: 9, label: 'September' }, { value: 10, label: 'Oktober' },
                  { value: 11, label: 'November' }, { value: 12, label: 'Desember' },
                ]"
                item-title="label"
                item-value="value"
                label="Bulan"
                :disabled="isEditMode"
                density="compact"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model.number="formData.tanggal_akhir"
                label="Tanggal Akhir Cut-Off (1 - 31)"
                type="number"
                min="1"
                max="31"
                density="compact"
                placeholder="Contoh: 29"
                hint="Transaksi setelah tanggal ini akan dialihkan ke bulan berikutnya"
                persistent-hint
              />
            </VCol>
            <VCol cols="12">
              <VSelect
                v-model="formData.jenis_pembayaran_key"
                :items="optionsData.jenis_pembayaran"
                item-title="label"
                item-value="value"
                label="Berlaku Untuk Jenis Pembayaran"
                :disabled="isEditMode"
                density="compact"
                hint="Pilih apakah berlaku untuk Semua atau spesifik satuan seperti Cash/Tunai saja"
                persistent-hint
              />
            </VCol>
            <VCol cols="12">
              <VTextarea
                v-model="formData.keterangan"
                label="Keterangan / Catatan (Opsional)"
                rows="2"
                density="compact"
                placeholder="Contoh: BSI tutup jam 15:00 WIB, setoran staff disetor keesokan harinya"
              />
            </VCol>
          </VRow>
        </VCardText>

        <VDivider />
        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn
            variant="tonal"
            color="secondary"
            @click="isDialogOpen = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="primary"
            :loading="isSubmitting"
            @click="saveSetting"
          >
            Simpan Setting
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Dialog Konfirmasi Hapus -->
    <VDialog
      v-model="isDeleteOpen"
      max-width="440px"
    >
      <VCard>
        <VCardTitle class="pa-4 font-weight-bold">
          Konfirmasi Hapus Setting
        </VCardTitle>
        <VCardText class="pa-4">
          Apakah Anda yakin ingin menghapus setting akhir laporan bulan <strong>{{ namaBulanMap[deleteTarget?.bulan] }} {{ deleteTarget?.tahun }}</strong>?
        </VCardText>
        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn
            variant="tonal"
            color="secondary"
            @click="isDeleteOpen = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="error"
            :loading="isSubmitting"
            @click="executeDelete"
          >
            Hapus
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
