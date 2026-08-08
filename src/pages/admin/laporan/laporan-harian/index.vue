<script setup>
import { computed, onMounted, ref } from "vue"
import { downloadFileExport, openFileExport } from "@/composables/exportFile"
import { formatCurrencyTotals, formatMoney } from "@/composables/formatRupiah"

const selectedJenjang = ref("sarjana")

const jenjangOptions = [
  { title: "Sarjana", value: "sarjana" },
  { title: "Pascasarjana", value: "pascasarjana" },
]

const today = new Date()

const selectedTanggal = ref(
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
)

const selectedJenisPembayaran = ref(null)
const jenisPembayaranList = ref([])
const selectedUser = ref(null)
const userList = ref([])
const isLoading = ref(false)
const hasData = ref(false)
const reportRows = ref([])
const total = ref(0)
const totalByCurrency = ref([])
const jkInfo = ref("")
const kategori = ref("")

const headers = [
  { title: "No", key: "no", sortable: false, width: 70 },
  { title: "Tanggal Pelayanan", key: "tanggal_input" },
  { title: "Tgl.Trans", key: "tanggal_transaksi" },
  { title: "Kwitansi", key: "kwitansi" },
  { title: "NIM/NoDaftar", key: "nim" },
  { title: "Nama", key: "nama" },
  { title: "L/P", key: "jenis_kelamin", width: 80 },
  { title: "Prodi", key: "prodi" },
  { title: "Pembayaran", key: "pembayaran" },
  { title: "Nominal", key: "nominal", align: "end" },
  { title: "Metode", key: "metode" },
  { title: "Petugas", key: "petugas" },
]

const filterBody = computed(() => ({
  tanggal: selectedTanggal.value,
  jenjang: selectedJenjang.value,
  ...(selectedJenisPembayaran.value && {
    jenis_pembayaran_id: selectedJenisPembayaran.value,
  }),
  ...(selectedUser.value && { user_id: selectedUser.value }),
}))

const formatTanggal = value => {
  if (!value) return "-"
  const d = new Date(value)
  
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
}

const fetchData = async () => {
  if (!selectedTanggal.value) return

  try {
    isLoading.value = true

    const response = await $api("/admin/pemasukan/mahasiswa/laporan/laporan-harian", {
      method: "GET",
      body: filterBody.value,
    })

    if (response.status) {
      reportRows.value = Object.freeze(response.data || [])
      total.value = response.total || 0
      totalByCurrency.value = Object.freeze(response.total_by_currency || [])
      jkInfo.value = response.jenis_kelamin === "%" ? "Semua" : response.jenis_kelamin
      kategori.value = response.kategori || ""
      hasData.value = true
    } else {
      showSnackbar({ text: response.message, color: "error" })
    }
  } catch (err) {
    showSnackbar({ text: err.message, color: "error" })
  } finally {
    isLoading.value = false
  }
}

const downloadExcel = async () => {
  try {
    isLoading.value = true
    showSnackbar({ text: "Loading Excel...", color: "info" })

    const response = await $api("/admin/pemasukan/mahasiswa/laporan/laporan-harian", {
      method: "GET",
      headers: {
        Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      body: {
        ...filterBody.value,
        action: "excel",
      },
    })

    downloadFileExport(response, `Laporan_Harian_${selectedTanggal.value}.xlsx`)
    showSnackbar({ text: "Excel berhasil diunduh.", color: "success" })
  } catch (err) {
    showSnackbar({ text: err.message, color: "error" })
  } finally {
    isLoading.value = false
  }
}

const downloadPdf = async () => {
  try {
    isLoading.value = true
    showSnackbar({ text: "Loading PDF...", color: "info" })

    const response = await $api("/admin/pemasukan/mahasiswa/laporan/laporan-harian", {
      method: "GET",
      headers: { Accept: "application/pdf" },
      body: {
        ...filterBody.value,
        action: "pdf",
      },
    })

    openFileExport(response)
    showSnackbar({ text: "PDF berhasil dibuka.", color: "success" })
  } catch (err) {
    showSnackbar({ text: err.message, color: "error" })
  } finally {
    isLoading.value = false
  }
}

const fetchJenisPembayaran = async () => {
  try {
    const userData = useCookie("userData").value ?? {}

    const response = await $api("/admin/pemasukan/mahasiswa/jenis-pembayaran", {
      method: "GET",
      body: { limit: 100 },
    })

    if (response && response.data) {
      const items = response.data.data || response.data
      const role = (userData?.role?.name || "").toLowerCase()
      const jk = (userData?.jenis_kelamin || "").toLowerCase()
      let userCategory = "%"

      if (!["admin", "kabag", "kabag_pemasukan"].includes(role)) {
        if (jk === "laki-laki") userCategory = "Putra"
        if (jk === "perempuan") userCategory = "Putri"
      }

      jenisPembayaranList.value = items
        .filter(jp => {
          if (userCategory === "%") return true
          if (jp.kategori && jp.kategori.toLowerCase().includes(userCategory.toLowerCase())) return true
          if (jp.kategori === "Semua" || jp.kategori === "%") return true
          
          return false
        })
        .map(jp => ({
          title: `${jp.nama} (${jp.kategori})`,
          value: jp.id,
        }))
    }
  } catch (err) {
    console.error("Failed to fetch jenis pembayaran:", err)
  }
}

const fetchUser = async () => {
  try {
    const response = await $api("/helper/petugas-pembayaran", {
      method: "GET",
    })

    if (response && response.data) {
      const items = response.data.data || response.data

      userList.value = items.map(u => ({
        title: `${u.name} (${u.jenis_kelamin})`,
        value: u.id,
      }))
    }
  } catch (err) {
    console.error("Failed to fetch petugas:", err)
  }
}

onMounted(() => {
  document.title = "Laporan Harian"
  fetchJenisPembayaran()
  fetchUser()
  fetchData()
})
</script>

<template>
  <div>
    <VCard class="report-header-card mb-6">
      <div class="header-band">
        <div class="d-flex align-center ga-4">
          <div class="header-icon">
            <VIcon
              icon="ri-file-list-3-line"
              size="30"
            />
          </div>
          <div>
            <h1 class="text-h5 mb-1 text-white">
              Laporan Harian
            </h1>
            <p class="mb-0 text-white opacity-70">
              Detail transaksi harian
              <span
                v-if="jkInfo"
                class="ml-2 px-2 py-1 bg-white text-primary rounded-pill font-weight-bold"
                style="font-size: 0.85rem;"
              >
                <VIcon
                  start
                  icon="ri-user-line"
                  size="14"
                  class="mr-1"
                />
                {{ jkInfo }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <VCardText class="pt-6">
        <VRow align="center">
          <VCol
            cols="12"
            md="2"
          >
            <VSelect
              v-model="selectedJenjang"
              :items="jenjangOptions"
              label="Jenjang"
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </VCol>
          <VCol
            cols="12"
            md="2"
          >
            <AppDateTimePicker
              v-model="selectedTanggal"
              label="Tanggal"
              placeholder="Pilih tanggal"
              :config="{
                altInput: true,
                altFormat: 'F j, Y',
                dateFormat: 'Y-m-d',
              }"
              prepend-inner-icon="ri-calendar-line"
              hide-details
            />
          </VCol>
          <VCol
            cols="12"
            md="3"
          >
            <VSelect
              v-model="selectedJenisPembayaran"
              :items="jenisPembayaranList"
              label="Jenis Pembayaran"
              placeholder="Semua"
              variant="outlined"
              density="comfortable"
              clearable
              hide-details
            />
          </VCol>
          <VCol
            cols="12"
            md="3"
          >
            <VSelect
              v-model="selectedUser"
              :items="userList"
              label="Filter Petugas"
              placeholder="Semua Petugas"
              variant="outlined"
              density="comfortable"
              clearable
              hide-details
            />
          </VCol>
          <VCol
            cols="12"
            md="2"
          >
            <VBtn
              color="primary"
              size="large"
              block
              :loading="isLoading"
              @click="fetchData"
            >
              <VIcon
                start
                icon="ri-search-line"
              />
              Tampilkan
            </VBtn>
          </VCol>
          <VCol
            cols="12"
            md="2"
          >
            <VBtn
              color="success"
              size="large"
              block
              :loading="isLoading"
              :disabled="!hasData"
              @click="downloadExcel"
            >
              <VIcon
                start
                icon="ri-file-excel-2-line"
              />
              Excel
            </VBtn>
          </VCol>
          <VCol
            cols="12"
            md="2"
          >
            <VBtn
              variant="outlined"
              color="secondary"
              size="large"
              block
              :loading="isLoading"
              :disabled="!hasData"
              @click="downloadPdf"
            >
              <VIcon
                start
                icon="ri-file-pdf-2-line"
              />
              PDF
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VCard
      v-if="isLoading"
      class="pa-8 text-center"
    >
      <VProgressCircular
        indeterminate
        color="primary"
        size="64"
        width="6"
      />
      <p class="mt-4 mb-0 text-body-1">
        Memuat data laporan...
      </p>
    </VCard>

    <VCard v-else>
      <VCardItem>
        <VCardTitle class="text-center">
          LAPORAN HARIAN
        </VCardTitle>
        <VCardSubtitle class="text-center">
          Tanggal Pelayanan: {{ formatTanggal(selectedTanggal) }}
          <span v-if="kategori"> | {{ kategori }}</span>
        </VCardSubtitle>
      </VCardItem>

      <VDivider />

      <VDataTable
        :headers="headers"
        :items="reportRows"
        :items-per-page="-1"
        hide-default-footer
        class="report-table"
      >
        <template #item.tanggal_input="{ item }">
          {{ formatTanggal(item.tanggal_input) }}
        </template>
        <template #item.tanggal_transaksi="{ item }">
          {{ formatTanggal(item.tanggal_transaksi) }}
        </template>
        <template #item.nominal="{ item }">
          <span class="font-weight-bold">{{ formatMoney(item.nominal, item.mata_uang) }}</span>
        </template>
        <template #bottom>
          <VDivider />
          <div class="d-flex justify-end pa-4 text-h6">
            TOTAL: {{ formatCurrencyTotals(totalByCurrency, total) }}
          </div>
        </template>
        <template #no-data>
          <div class="text-center pa-8">
            Tidak ada data pada tanggal ini.
          </div>
        </template>
      </VDataTable>
    </VCard>
  </div>
</template>

<style scoped>
.report-header-card {
  overflow: hidden;
  border-radius: 12px;
}

.header-band {
  background: linear-gradient(135deg, #102a43 0%, #1a237e 100%);
  padding: 28px;
}

.header-icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  color: white;
  background: rgba(255, 255, 255, 0.12);
}

.report-table :deep(th) {
  white-space: nowrap;
}

.report-table :deep(td) {
  white-space: nowrap;
}
</style>
