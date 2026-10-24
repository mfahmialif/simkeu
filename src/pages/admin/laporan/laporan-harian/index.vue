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
const rincianJenisPembayaran = ref([])
const jkInfo = ref("")
const kategori = ref("")
const isPastCutOff = ref(false)
const shiftedMonth = ref(null)

const getPaymentItemIcon = item => {
  const key = String(item.key || "").toLowerCase()
  const nama = String(item.nama || "").toLowerCase()

  if (item.is_total || key === "total" || nama.includes("total")) return "ri-calculator-line"
  if (key === "cash" || key === "tunai" || nama.includes("cash") || nama.includes("tunai")) return "ri-cash-line"
  if (key === "transfer" || nama.includes("transfer")) return "ri-bank-line"
  if (key === "va_pondok" || key === "va" || nama.includes("pondok") || nama.includes("va")) return "ri-qr-code-line"
  if (key === "yayasan" || nama.includes("yayasan")) return "ri-community-line"
  if (key === "deposit" || nama.includes("deposit")) return "ri-safe-2-line"
  if (key === "va_bsi" || nama.includes("bsi")) return "ri-bank-card-2-line"

  return "ri-money-cny-circle-line"
}

const rincianColWidth = computed(() => {
  const len = rincianJenisPembayaran.value.length
  if (len === 1 || len === 2) return 6
  if (len === 3) return 4

  return 3
})

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

const filterBody = computed(() => {
  const selectedUserObj = userList.value.find(u => u.value === selectedUser.value)
  const activeScope = useCookie("simkeuJkScope").value

  return {
    tanggal: selectedTanggal.value,
    jenjang: selectedJenjang.value,
    ...(activeScope && { jenis_kelamin: activeScope }),
    ...(selectedJenisPembayaran.value && {
      jenis_pembayaran_id: selectedJenisPembayaran.value,
    }),
    ...(selectedUser.value && {
      user_id: selectedUser.value,
      username: selectedUserObj?.username,
    }),
  }
})

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
      rincianJenisPembayaran.value = Object.freeze(response.rincian_jenis_pembayaran || [])
      jkInfo.value = response.jenis_kelamin === "%" ? "Semua" : response.jenis_kelamin
      kategori.value = response.kategori || ""
      isPastCutOff.value = response.is_past_cut_off || false
      shiftedMonth.value = response.shifted_month || null
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
      const roleId = Number(userData?.role_id || 0)
      const jk = (userData?.jenis_kelamin || "").toLowerCase()
      const activeScope = String(useCookie("simkeuJkScope").value || "").toLowerCase()

      let userCategory = "%"
      const hasFullCategoryAccess = ["admin", "kabag", "kabag_pemasukan", "kabag_pengeluaran", "pimpinan", "keuangan"].includes(role) || roleId === 1

      if (activeScope === "putra" || activeScope.includes("laki") || activeScope === "8") {
        userCategory = "Putra"
      } else if (activeScope === "putri" || activeScope.includes("perempuan") || activeScope === "9") {
        userCategory = "Putri"
      } else if (items.length > 0 && items.every(jp => String(jp.kategori || "").toLowerCase().includes("putra"))) {
        userCategory = "Putra"
      } else if (items.length > 0 && items.every(jp => String(jp.kategori || "").toLowerCase().includes("putri"))) {
        userCategory = "Putri"
      } else if (!hasFullCategoryAccess) {
        if (jk.includes("laki")) userCategory = "Putra"
        if (jk.includes("perempuan")) userCategory = "Putri"
      }

      const mappedList = items
        .filter(jp => {
          if (userCategory === "%") return true
          if (jp.kategori && jp.kategori.toLowerCase().includes(userCategory.toLowerCase())) return true
          if (jp.kategori === "Semua" || jp.kategori === "%") return true
          
          return false
        })
        .map(jp => {
          const hasCategoryInName = String(jp.nama || "").toLowerCase().includes("putra") || String(jp.nama || "").toLowerCase().includes("putri")
          const categorySuffix = userCategory === "%" && !hasCategoryInName && jp.kategori ? ` (${jp.kategori})` : ""

          return {
            title: `${jp.nama}${categorySuffix}`,
            value: jp.id,
          }
        })

      const topItems = []
      if (userCategory === "%") {
        topItems.push({
          title: "Cash + Transfer (Semua)",
          value: "cash_transfer",
        })
        topItems.push({
          title: "Cash + Transfer (Putra)",
          value: "cash_transfer_putra",
        })
        topItems.push({
          title: "Cash + Transfer (Putri)",
          value: "cash_transfer_putri",
        })
      } else if (userCategory === "Putra") {
        topItems.push({
          title: "Cash + Transfer",
          value: "cash_transfer_putra",
        })
      } else if (userCategory === "Putri") {
        topItems.push({
          title: "Cash + Transfer",
          value: "cash_transfer_putri",
        })
      }
      mappedList.unshift(...topItems)

      if (userCategory === "%") {
        mappedList.push({
          title: "VA Pondok (Putra)",
          value: "va_pondok_putra",
        })
        mappedList.push({
          title: "VA + Transfer (Putra)",
          value: "va_transfer_putra",
        })
        mappedList.push({
          title: "VA Pondok (Putri)",
          value: "va_pondok_putri",
        })
        mappedList.push({
          title: "VA + Transfer (Putri)",
          value: "va_transfer_putri",
        })
      } else if (userCategory === "Putra") {
        mappedList.push({
          title: "VA Pondok",
          value: "va_pondok_putra",
        })
        mappedList.push({
          title: "VA + Transfer",
          value: "va_transfer_putra",
        })
      } else if (userCategory === "Putri") {
        mappedList.push({
          title: "VA Pondok",
          value: "va_pondok_putri",
        })
        mappedList.push({
          title: "VA + Transfer",
          value: "va_transfer_putri",
        })
      }

      jenisPembayaranList.value = mappedList
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
        username: u.username,
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

    <div v-else>
      <!-- Alert Cut-Off Aktif -->
      <VAlert
        v-if="isPastCutOff"
        type="warning"
        variant="tonal"
        density="compact"
        class="mb-4"
        icon="ri-information-line"
      >
        <div class="d-flex flex-wrap align-center justify-space-between gap-2">
          <div>
            <strong>Setting Akhir Laporan Aktif:</strong>
            Tanggal ini melewati batas cut-off bulan ini (Cut-off: Tanggal {{ shiftedMonth?.cut_off_day }}).
            Transaksi pada tanggal ini dialihkan masuk ke pembukuan <strong>{{ shiftedMonth?.label }}</strong>.
          </div>
          <VChip size="small" color="warning" variant="elevated">
            Masuk Buku {{ shiftedMonth?.label }}
          </VChip>
        </div>
      </VAlert>

      <VCard>
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
            <span
              class="font-weight-bold"
              :class="{ 'text-error': Number(item.nominal) < 0 }"
            >{{ formatMoney(item.nominal, item.mata_uang) }}</span>
          </template>
          <template #item.metode="{ item }">
            <div class="d-flex align-center gap-1">
              <span>{{ item.metode }}</span>
              <VChip
                v-if="item.is_carry_over"
                size="x-small"
                color="warning"
                variant="tonal"
                class="font-weight-medium"
              >
                Masuk {{ item.accounting_period }}
              </VChip>
            </div>
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

    <!-- Rincian Jenis Pembayaran -->
    <VCard
      v-if="hasData && rincianJenisPembayaran && rincianJenisPembayaran.length > 0"
      class="mt-6 rincian-card"
    >
      <VCardItem class="pb-2">
        <div class="d-flex align-center justify-space-between flex-wrap ga-2">
          <div class="d-flex align-center ga-3">
            <div class="rincian-header-icon">
              <VIcon
                icon="ri-wallet-3-line"
                size="24"
                color="primary"
              />
            </div>
            <div>
              <VCardTitle class="text-h6 font-weight-bold mb-0">
                Rincian Jenis Pembayaran
              </VCardTitle>
              <VCardSubtitle class="text-caption mb-0">
                Rekapitulasi nominal per metode pembayaran
              </VCardSubtitle>
            </div>
          </div>
          <VChip
            v-if="jkInfo"
            color="primary"
            variant="tonal"
            size="small"
            class="font-weight-medium"
          >
            <VIcon
              start
              icon="ri-user-line"
              size="14"
            />
            Kategori: {{ jkInfo }}
          </VChip>
        </div>
      </VCardItem>

      <VDivider />

      <VCardText class="pa-4">
        <VRow>
          <VCol
            v-for="(item, idx) in rincianJenisPembayaran"
            :key="idx"
            cols="12"
            sm="6"
            :md="rincianColWidth"
          >
            <div
              class="rincian-item"
              :class="{ 'rincian-item-total': item.is_total }"
            >
              <div class="d-flex align-center justify-space-between mb-2">
                <span class="rincian-label">{{ item.nama }}</span>
                <div
                  class="rincian-icon-badge"
                  :class="{ 'is-total': item.is_total }"
                >
                  <VIcon
                    :icon="getPaymentItemIcon(item)"
                    size="18"
                  />
                </div>
              </div>
              <div class="rincian-amount">
                {{ formatCurrencyTotals(item.total_by_currency, item.total) }}
              </div>
            </div>
          </VCol>
        </VRow>
      </VCardText>
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

.rincian-card {
  border-radius: 12px;
  overflow: hidden;
}

.rincian-header-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(var(--v-theme-primary), 0.12);
}

.rincian-item {
  padding: 16px;
  border-radius: 10px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgba(var(--v-theme-surface), 1);
  transition: all 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.rincian-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.rincian-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.78);
}

.rincian-amount {
  font-size: 1.15rem;
  font-weight: 700;
  color: rgba(var(--v-theme-on-surface), 0.95);
  word-break: break-word;
}

.rincian-icon-badge {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
}

.rincian-item-total {
  background: linear-gradient(135deg, #102a43 0%, #1a237e 100%) !important;
  border-color: #1a237e !important;
  color: white !important;
}

.rincian-item-total .rincian-label {
  color: rgba(255, 255, 255, 0.85) !important;
}

.rincian-item-total .rincian-amount {
  color: #ffffff !important;
}

.rincian-icon-badge.is-total {
  background: rgba(255, 255, 255, 0.2) !important;
  color: #ffffff !important;
}
</style>
