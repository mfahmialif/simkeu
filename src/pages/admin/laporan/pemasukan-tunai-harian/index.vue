<script setup>
import { ref, computed, onMounted } from "vue"
import { useTheme } from "vuetify"
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect/index.js'
import 'flatpickr/dist/plugins/monthSelect/style.css'
import { downloadFileExport } from "@/composables/exportFile"
import { formatCurrencyTotals } from "@/composables/formatRupiah"
import ModalDetailPemasukanUmum from "@/components/admin/pemasukan/mahasiswa/laporan/ModalDetailPemasukanUmum.vue"
import ModalDetailPengembalianDana from "@/components/admin/pemasukan/mahasiswa/laporan/ModalDetailPengembalianDana.vue"

const theme = useTheme()

const selectedMode = ref("bulanan")

const modeOptions = [
  { title: "Mode Bulanan", value: "bulanan" },
  { title: "Mode Tahunan", value: "tahunan" },
]

const selectedJenjang = ref("sarjana")

const jenjangOptions = [
  { title: "Sarjana", value: "sarjana" },
  { title: "Pascasarjana", value: "pascasarjana" },
]

const selectedJenisPembayaran = ref(null)
const jenisPembayaranList = ref([])
const selectedUser = ref(null)
const userList = ref([])

const selectedTahun = ref(new Date().getFullYear().toString())

const tahunOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for(let i = currentYear; i >= 2020; i--) {
    years.push(i.toString())
  }
  
  return years
})

const monthPickerConfig = computed(() => ({
  disableMobile: true,
  plugins: [
    new monthSelectPlugin({
      shorthand: true,
      dateFormat: 'Y-m',
      altFormat: 'F Y',
      theme: theme.global.name.value === 'dark' ? 'dark' : 'light',
    }),
  ],
  altInput: true,
}))

const selectedBulan = ref("")
const isLoading = ref(false)
const reportTitle = ref("")
const columns = ref([])
const tableData = ref([])
const allData = ref({})
const totals = ref({})
const hasData = ref(false)
const jkInfo = ref("")
const rincianJenisPembayaran = ref([])
const cutOffInfo = ref(null)

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

// Detail Modal Pemasukan Umum State
const isDetailModalOpen = ref(false)
const detailModalTitle = ref("Detail Pemasukan Umum")
const detailModalSubtitle = ref("")
const detailModalFilter = ref({})

const openDetailPemasukanUmum = (row, colKey = "pemasukan_umum", monthContext = null) => {
  let startDate = ""
  let endDate = ""
  let subtitle = ""

  if (row?.tanggal) {
    startDate = row.tanggal
    endDate = row.tanggal
    subtitle = `Tanggal: ${formatTanggal(row.tanggal)}`
  } else if (monthContext) {
    const year = selectedTahun.value
    const m = String(monthContext.month || 1).padStart(2, "0")
    const days = new Date(year, parseInt(m), 0).getDate()

    startDate = `${year}-${m}-01`
    endDate = `${year}-${m}-${days}`
    subtitle = `${monthContext.title || `Bulan ${m}/${year}`}`
  } else if (selectedMode.value === "bulanan" && selectedBulan.value) {
    const [y, m] = selectedBulan.value.split("-")
    const days = new Date(y, parseInt(m), 0).getDate()

    startDate = `${y}-${m}-01`
    endDate = `${y}-${m}-${days}`
    subtitle = `Rekap Total Bulan: ${selectedBulan.value}`
  } else if (selectedMode.value === "tahunan" && selectedTahun.value) {
    startDate = `${selectedTahun.value}-01-01`
    endDate = `${selectedTahun.value}-12-31`
    subtitle = `Rekap Total Tahun: ${selectedTahun.value}`
  }

  detailModalTitle.value = "Detail Pemasukan Umum"
  detailModalSubtitle.value = subtitle

  const selectedUserObj = userList.value.find(u => u.value === selectedUser.value)

  /* eslint-disable camelcase */
  detailModalFilter.value = {
    start_date: startDate,
    end_date: endDate,
    ...(selectedJenisPembayaran.value && { jenis_pembayaran_id: selectedJenisPembayaran.value }),
    ...(selectedUser.value && {
      user_id: selectedUser.value,
      username: selectedUserObj?.username,
    }),
  }
  /* eslint-enable camelcase */

  isDetailModalOpen.value = true
}

// Detail Modal Pengembalian Dana State
const isDetailPengembalianOpen = ref(false)
const detailPengembalianTitle = ref("Detail Pengembalian Dana")
const detailPengembalianSubtitle = ref("")
const detailPengembalianFilter = ref({})

const openDetailPengembalianDana = (row = null, monthContext = null) => {
  let startDate = ""
  let endDate = ""
  let subtitle = ""

  if (row?.tanggal) {
    startDate = row.tanggal
    endDate = row.tanggal
    subtitle = `Tanggal: ${formatTanggal(row.tanggal)} (Pengembalian Dana)`
  } else if (monthContext) {
    const year = selectedTahun.value
    const m = String(monthContext.month || 1).padStart(2, "0")
    const days = new Date(year, parseInt(m), 0).getDate()

    startDate = `${year}-${m}-01`
    endDate = `${year}-${m}-${days}`
    subtitle = `${monthContext.title || `Bulan ${m}/${year}`} (Pengembalian Dana)`
  } else if (selectedMode.value === "bulanan" && selectedBulan.value) {
    const [y, m] = selectedBulan.value.split("-")
    const days = new Date(y, parseInt(m), 0).getDate()

    startDate = `${y}-${m}-01`
    endDate = `${y}-${m}-${days}`
    subtitle = `Rekap Total Bulan: ${selectedBulan.value} (Pengembalian Dana)`
  } else if (selectedMode.value === "tahunan" && selectedTahun.value) {
    startDate = `${selectedTahun.value}-01-01`
    endDate = `${selectedTahun.value}-12-31`
    subtitle = `Rekap Total Tahun: ${selectedTahun.value} (Pengembalian Dana)`
  }

  detailPengembalianTitle.value = "Detail Pengembalian Dana"
  detailPengembalianSubtitle.value = subtitle

  const selectedUserObj = userList.value.find(u => u.value === selectedUser.value)

  /* eslint-disable camelcase */
  detailPengembalianFilter.value = {
    start_date: startDate,
    end_date: endDate,
    ...(selectedJenisPembayaran.value && { jenis_pembayaran_id: selectedJenisPembayaran.value }),
    ...(selectedUser.value && {
      user_id: selectedUser.value,
      username: selectedUserObj?.username,
    }),
  }
  /* eslint-enable camelcase */

  isDetailPengembalianOpen.value = true
}

const formatTanggal = dateStr => {
  const d = new Date(dateStr)
  
  return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear()
}

const normalizeTagihanText = value => String(value || "")
  .toUpperCase()
  .replace(/[^A-Z0-9]+/g, " ")
  .trim()

const REPORT_COLUMN_GROUPS = [
  {
    key: "uas",
    label: "UAS",
    match: ({ normalizedLabel, compactLabel, normalizedKey }) =>
      normalizedKey === "UAS"
      || /\bUAS\b/.test(normalizedLabel)
      || compactLabel.includes("UASSEMESTER")
      || compactLabel.includes("UJIANAKHIRSEMESTER"),
  },
  {
    key: "uts",
    label: "UTS",
    match: ({ normalizedLabel, compactLabel, normalizedKey }) =>
      normalizedKey === "UTS"
      || /\bUTS\b/.test(normalizedLabel)
      || compactLabel.includes("UTSSEMESTER")
      || compactLabel.includes("UJIANTENGAHSEMESTER"),
  },
]

const getReportColumnGroup = column => {
  const normalizedLabel = normalizeTagihanText(column?.label)
  const compactLabel = normalizedLabel.replace(/\s+/g, "")
  const normalizedKey = normalizeTagihanText(column?.key)

  return REPORT_COLUMN_GROUPS.find(group =>
    group.match({ normalizedLabel, compactLabel, normalizedKey }),
  )
}

const toNumber = value => Number(value) || 0

const mergeCurrencyTotals = (...groups) => {
  const totals = new Map()

  groups.flat().forEach(group => {
    const mataUang = group?.mata_uang || {}
    const kode = String(mataUang.kode || "IDR").toUpperCase()
    const key = `kode:${kode}`

    const current = totals.get(key) || {
      key,
      mata_uang: {
        id: mataUang.id ?? null,
        kode,
        nama: mataUang.nama || kode,
        simbol: mataUang.simbol || (kode === "IDR" ? "Rp" : kode),
      },
      total: 0,
    }

    current.total += toNumber(group?.total)
    totals.set(key, current)
  })

  return [...totals.values()]
}

const groupReportColumns = (rawColumns = []) => {
  const groupedKeys = Object.fromEntries(
    REPORT_COLUMN_GROUPS.map(group => [group.key, []]),
  )

  const hasGroupColumn = new Set()
  const groupedColumns = []

  rawColumns.forEach(column => {
    const group = getReportColumnGroup(column)

    if (group) {
      groupedKeys[group.key].push(column.key)

      if (!hasGroupColumn.has(group.key)) {
        groupedColumns.push({
          ...column,
          key: group.key,
          label: group.label,
        })
        hasGroupColumn.add(group.key)
      }

      return
    }

    groupedColumns.push(column)
  })

  return { columns: groupedColumns, groupedKeys }
}

const groupReportRow = (row = {}, groupedKeys = {}) => {
  const groupedRow = { ...row }

  Object.entries(groupedKeys).forEach(([groupKey, keys]) => {
    if (!keys.length) return

    groupedRow[groupKey] = keys.reduce((sum, key) => sum + toNumber(row[key]), 0)
    groupedRow[`${groupKey}_by_currency`] = mergeCurrencyTotals(
      keys.flatMap(key => row[`${key}_by_currency`] || []),
    )

    keys
      .filter(key => key !== groupKey)
      .forEach(key => {
        delete groupedRow[key]
        delete groupedRow[`${key}_by_currency`]
      })
  })

  return groupedRow
}

const groupReportRows = (rows = [], groupedKeys = {}) => rows.map(row => groupReportRow(row, groupedKeys))

const groupReportTotals = (rawTotals = {}, groupedKeys = {}) => {
  const groupedTotals = { ...rawTotals }

  Object.entries(groupedKeys).forEach(([groupKey, keys]) => {
    if (!keys.length) return

    groupedTotals[groupKey] = keys.reduce((sum, key) => sum + toNumber(rawTotals[key]), 0)
    groupedTotals[`${groupKey}_by_currency`] = mergeCurrencyTotals(
      keys.flatMap(key => rawTotals[`${key}_by_currency`] || []),
    )

    keys
      .filter(key => key !== groupKey)
      .forEach(key => {
        delete groupedTotals[key]
        delete groupedTotals[`${key}_by_currency`]
      })
  })

  return groupedTotals
}

const hasGroupedKeys = (groupedKeys = {}) =>
  Object.values(groupedKeys).some(keys => keys.length)

const groupReportMonthlyData = (monthData = {}, groupedKeys = {}) => ({
  ...monthData,
  data: groupReportRows(monthData.data || [], groupedKeys),
  totals: groupReportTotals(monthData.totals || {}, groupedKeys),
})

const normalizeReportData = (response = {}) => {
  const { columns: groupedColumns, groupedKeys } = groupReportColumns(response.columns || [])

  if (!hasGroupedKeys(groupedKeys)) {
    return {
      ...response,
      columns: groupedColumns,
    }
  }

  return {
    ...response,
    columns: groupedColumns,
    data: response.data ? groupReportRows(response.data, groupedKeys) : response.data,
    totals: response.totals ? groupReportTotals(response.totals, groupedKeys) : response.totals,
    all_data: response.all_data
      ? Object.fromEntries(
        Object.entries(response.all_data).map(([month, monthData]) => [
          month,
          groupReportMonthlyData(monthData, groupedKeys),
        ]),
      )
      : response.all_data,
  }
}

const fetchData = async () => {
  if (selectedMode.value === 'bulanan' && !selectedBulan.value) return
  if (selectedMode.value === 'tahunan' && !selectedTahun.value) return
  
  try {
    isLoading.value = true

    const selectedUserObj = userList.value.find(u => u.value === selectedUser.value)
    const activeScope = useCookie('simkeuJkScope').value

    const filterData = {
      jenjang: selectedJenjang.value,
      ...(activeScope && { jenis_kelamin: activeScope }),
      ...(selectedJenisPembayaran.value && { jenis_pembayaran_id: selectedJenisPembayaran.value }),
      ...(selectedUser.value && {
        user_id: selectedUser.value,
        username: selectedUserObj?.username,
      }),
    }

    const bodyData = selectedMode.value === 'tahunan' 
      ? { mode: 'tahunan', tahun: selectedTahun.value, ...filterData }
      : { mode: 'bulanan', bulan: selectedBulan.value, ...filterData }

    const response = await $api("/admin/pemasukan/mahasiswa/laporan/pemasukan-tunai-harian", {
      method: "GET",
      body: bodyData,
    })

    if (response.status) {
      const normalizedResponse = normalizeReportData(response)

      rincianJenisPembayaran.value = Object.freeze(normalizedResponse.rincian_jenis_pembayaran || [])
      cutOffInfo.value = normalizedResponse.cut_off_info || null

      if (selectedMode.value === 'tahunan') {
        reportTitle.value = "PEMASUKAN TUNAI TAHUN " + selectedTahun.value
        columns.value = Object.freeze(normalizedResponse.columns)
        allData.value = Object.freeze(normalizedResponse.all_data)
        jkInfo.value = normalizedResponse.jenis_kelamin == '%' ? 'Semua' : normalizedResponse.jenis_kelamin
        hasData.value = true
      } else {
        reportTitle.value = normalizedResponse.title
        columns.value = Object.freeze(normalizedResponse.columns)
        tableData.value = Object.freeze(normalizedResponse.data)
        totals.value = Object.freeze(normalizedResponse.totals)
        jkInfo.value = normalizedResponse.jenis_kelamin == '%' ? 'Semua' : normalizedResponse.jenis_kelamin
        hasData.value = true
      }
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
    
    const selectedUserObj = userList.value.find(u => u.value === selectedUser.value)
    const activeScope = useCookie('simkeuJkScope').value

    const filterData = {
      action: 'excel',
      jenjang: selectedJenjang.value,
      ...(activeScope && { jenis_kelamin: activeScope }),
      ...(selectedJenisPembayaran.value && { jenis_pembayaran_id: selectedJenisPembayaran.value }),
      ...(selectedUser.value && {
        user_id: selectedUser.value,
        username: selectedUserObj?.username,
      }),
    }

    const bodyData = selectedMode.value === 'tahunan' 
      ? { mode: 'tahunan', tahun: selectedTahun.value, ...filterData }
      : { mode: 'bulanan', bulan: selectedBulan.value, ...filterData }
      
    const filename = selectedMode.value === 'tahunan' 
      ? `Pemasukan_Tunai_Harian_Tahun_${selectedTahun.value}.xlsx`
      : `Pemasukan_Tunai_Harian_${selectedBulan.value}.xlsx`

    const response = await $api("/admin/pemasukan/mahasiswa/laporan/pemasukan-tunai-harian", {
      method: "GET",
      headers: { Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
      body: bodyData,
    })

    downloadFileExport(response, filename)
    showSnackbar({ text: "Excel berhasil diunduh.", color: "success" })
  } catch (err) {
    showSnackbar({ text: err.message, color: "error" })
  } finally {
    isLoading.value = false
  }
}

const printTable = () => {
  const printContent = document.getElementById("report-table-container")
  const rincianContent = document.getElementById("rincian-pembayaran-print")
  const win = window.open("", "_blank")

  win.document.write(`
    <html>
    <head>
      <title>${reportTitle.value}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; }
        h2 { text-align: center; color: #1a237e; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th { background: #1a237e; color: white; padding: 8px 6px; text-align: center; border: 1px solid #ccc; }
        td { padding: 6px; border: 1px solid #ddd; text-align: right; }
        td:first-child, td:nth-child(2) { text-align: center; }
        tr:nth-child(even) { background: #f5f7ff; }
        .print-card-content {
          background-color: transparent !important;
        }
        .total-row { background: #1a237e !important; color: white; font-weight: bold; }
        .total-row td { border-color: #283593; }
        .rincian-print-table { margin-top: 24px; width: 100%; border-collapse: collapse; }
        .rincian-print-table th { background: #102a43; color: white; padding: 6px 10px; font-size: 11px; text-align: left; }
        .rincian-print-table td { padding: 6px 10px; font-size: 11px; border: 1px solid #ccc; }
        .rincian-print-table .total-item { font-weight: bold; background: #e8eaf6; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style>
    </head>
    <body>
      <h2>${reportTitle.value}</h2>
      ${printContent ? printContent.innerHTML : ''}
      ${rincianContent ? rincianContent.innerHTML : ''}
    </body>
    </html>
  `)
  win.document.close()
  setTimeout(() => { win.print() }, 500)
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
      
      const role = (userData?.role?.name || '').toLowerCase()
      const roleId = Number(userData?.role_id || 0)
      const jk = (userData?.jenis_kelamin || '').toLowerCase()
      const activeScope = String(useCookie('simkeuJkScope').value || '').toLowerCase()
      
      let userCategory = '%'
      const hasFullCategoryAccess = ['admin', 'kabag', 'kabag_pemasukan', 'kabag_pengeluaran', 'pimpinan', 'keuangan'].includes(role) || roleId === 1

      if (activeScope === 'putra' || activeScope.includes('laki') || activeScope === '8') {
        userCategory = 'Putra'
      } else if (activeScope === 'putri' || activeScope.includes('perempuan') || activeScope === '9') {
        userCategory = 'Putri'
      } else if (items.length > 0 && items.every(jp => String(jp.kategori || '').toLowerCase().includes('putra'))) {
        userCategory = 'Putra'
      } else if (items.length > 0 && items.every(jp => String(jp.kategori || '').toLowerCase().includes('putri'))) {
        userCategory = 'Putri'
      } else if (!hasFullCategoryAccess) {
        if (jk.includes('laki')) userCategory = 'Putra'
        if (jk.includes('perempuan')) userCategory = 'Putri'
      }

      const mappedList = items.filter(jp => {
        if (userCategory === '%') return true
        if (jp.kategori && jp.kategori.toLowerCase().includes(userCategory.toLowerCase())) return true
        if (jp.kategori === 'Semua' || jp.kategori === '%') return true 
        
        return false
      }).map(jp => {
        const hasCategoryInName = String(jp.nama || '').toLowerCase().includes('putra') || String(jp.nama || '').toLowerCase().includes('putri')
        const categorySuffix = userCategory === '%' && !hasCategoryInName && jp.kategori ? ` (${jp.kategori})` : ''

        return {
          title: `${jp.nama}${categorySuffix}`,
          value: jp.id,
        }
      })

      const topItems = []
      if (userCategory === '%') {
        topItems.push({
          title: 'Cash + Transfer (Semua)',
          value: 'cash_transfer',
        })
        topItems.push({
          title: 'Cash + Transfer (Putra)',
          value: 'cash_transfer_putra',
        })
        topItems.push({
          title: 'Cash + Transfer (Putri)',
          value: 'cash_transfer_putri',
        })
      } else if (userCategory === 'Putra') {
        topItems.push({
          title: 'Cash + Transfer',
          value: 'cash_transfer_putra',
        })
      } else if (userCategory === 'Putri') {
        topItems.push({
          title: 'Cash + Transfer',
          value: 'cash_transfer_putri',
        })
      }
      mappedList.unshift(...topItems)

      if (userCategory === '%') {
        mappedList.push({
          title: 'VA Pondok (Putra)',
          value: 'va_pondok_putra',
        })
        mappedList.push({
          title: 'VA + Transfer (Putra)',
          value: 'va_transfer_putra',
        })
        mappedList.push({
          title: 'VA Pondok (Putri)',
          value: 'va_pondok_putri',
        })
        mappedList.push({
          title: 'VA + Transfer (Putri)',
          value: 'va_transfer_putri',
        })
      } else if (userCategory === 'Putra') {
        mappedList.push({
          title: 'VA Pondok',
          value: 'va_pondok_putra',
        })
        mappedList.push({
          title: 'VA + Transfer',
          value: 'va_transfer_putra',
        })
      } else if (userCategory === 'Putri') {
        mappedList.push({
          title: 'VA Pondok',
          value: 'va_pondok_putri',
        })
        mappedList.push({
          title: 'VA + Transfer',
          value: 'va_transfer_putri',
        })
      }

      jenisPembayaranList.value = mappedList
    }
  } catch (err) {
    console.error('Failed to fetch jenis pembayaran:', err)
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
    console.error('Failed to fetch petugas:', err)
  }
}

onMounted(() => {
  document.title = "Pemasukan Tunai Harian"

  const now = new Date()

  selectedBulan.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  fetchJenisPembayaran()
  fetchUser()
  fetchData()
})
</script>

<template>
  <div>
    <!-- Header Card -->
    <VCard class="report-header-card mb-6">
      <div class="header-gradient">
        <div class="header-content">
          <div class="header-icon-wrap">
            <VIcon
              icon="ri-money-dollar-circle-line"
              size="32"
              color="white"
            />
          </div>
          <div>
            <h1 class="header-title">
              Pemasukan Tunai Harian
            </h1>
            <p class="header-subtitle">
              Laporan pemasukan tunai harian per kategori tagihan
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

      <VCardText class="pt-6 pb-4">
        <VRow align="center">
          <VCol
            cols="12"
            md="2"
          >
            <VSelect
              v-model="selectedMode"
              :items="modeOptions"
              label="Mode Laporan"
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </VCol>
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
              v-if="selectedMode === 'bulanan'"
              :key="'month-'+theme.global.name.value"
              v-model="selectedBulan"
              label="Bulan"
              placeholder="Bulan laporan"
              :config="monthPickerConfig"
              prepend-inner-icon="ri-calendar-line"
              hide-details
            />
            <VSelect
              v-else
              v-model="selectedTahun"
              :items="tahunOptions"
              label="Tahun"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="ri-calendar-line"
              hide-details
            />
          </VCol>
          <VCol
            cols="12"
            md="2"
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
            md="2"
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
              :loading="isLoading"
              block
              class="fetch-btn"
              @click="fetchData"
            >
              <template #loader>
                <span class="custom-loader">
                  Loading<span class="loading-dots" />
                </span>
              </template>
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
              :loading="isLoading"
              :disabled="!hasData"
              block
              @click="downloadExcel"
            >
              <template #loader>
                <span class="custom-loader">
                  Loading<span class="loading-dots" />
                </span>
              </template>
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
              :disabled="!hasData || isLoading || selectedMode === 'tahunan'"
              block
              @click="printTable"
            >
              <VIcon
                start
                icon="ri-printer-line"
              />
              Print
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Loading -->
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
      <p
        class="mt-4 text-body-1"
        style="color: #64748b"
      >
        Memuat data laporan...
      </p>
    </VCard>

    <!-- No Data -->
    <VCard
      v-else-if="!hasData"
      class="pa-8 text-center"
    >
      <VIcon
        icon="ri-file-search-line"
        size="80"
        color="grey"
        class="mb-4"
      />
      <h3 style="color: #94a3b8">
        Pilih {{ selectedMode === 'bulanan' ? 'bulan' : 'tahun' }} untuk menampilkan laporan
      </h3>
    </VCard>

    <!-- Report Tables -->
    <template v-else-if="selectedMode === 'bulanan'">
      <VCard class="report-table-card">
        <VCardItem class="report-table-header">
          <VCardTitle class="text-center">
            <VIcon
              icon="ri-bar-chart-grouped-line"
              class="me-2"
            />
            {{ reportTitle }}
          </VCardTitle>
        </VCardItem>

        <VDivider />

        <!-- Alert Cut-Off Aktif -->
        <VAlert
          v-if="cutOffInfo?.has_carry_over"
          type="warning"
          variant="tonal"
          density="compact"
          class="ma-3"
          icon="ri-information-line"
        >
          <div class="d-flex flex-wrap align-center justify-space-between gap-2">
            <div>
              <strong>Setting Akhir Laporan Aktif:</strong>
              Menampilkan limpahan transaksi tanggal
              <strong>{{ cutOffInfo.carry_over_dates.map(d => d.split('-').reverse().slice(0, 2).join('/')).join(', ') }}</strong>
              dari bulan <strong>{{ cutOffInfo.prev_month_name }}</strong>.
            </div>
            <VChip size="small" color="warning" variant="elevated">
              Limpahan {{ cutOffInfo.prev_month_name }}
            </VChip>
          </div>
        </VAlert>

        <div
          id="report-table-container"
          class="table-scroll-container"
        >
          <table class="report-table">
            <thead>
              <tr>
                <th
                  class="sticky-col col-no"
                  rowspan="1"
                >
                  No
                </th>
                <th
                  class="sticky-col col-tanggal"
                  rowspan="1"
                >
                  Tanggal
                </th>
                <th
                  v-for="col in columns"
                  :key="col.key"
                  class="col-amount"
                >
                  {{ col.label }}
                </th>
                <th class="col-total">
                  Jumlah
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in tableData"
                :key="index"
                class="data-row"
                :class="{ 'even-row': index % 2 === 0, 'carry-over-row': row.is_carry_over }"
              >
                <td class="sticky-col col-no text-center">
                  {{ row.no }}
                </td>
                <td class="sticky-col col-tanggal text-center">
                  <div class="d-flex align-center justify-center gap-1">
                    <span>{{ formatTanggal(row.tanggal) }}</span>
                    <VChip
                      v-if="row.is_carry_over"
                      size="x-small"
                      color="warning"
                      variant="elevated"
                      class="px-1 font-weight-bold"
                      style="font-size: 10px; height: 18px;"
                    >
                      Limpahan {{ row.carry_over_from }}
                    </VChip>
                  </div>
                </td>
                <td
                  v-for="col in columns"
                  :key="col.key"
                  class="col-amount text-right"
                  :class="{
                    'has-value': row[col.key] !== 0,
                    'cell-clickable': (col.key === 'pemasukan_umum' && row[col.key] > 0) || (col.key === 'pengembalian_dana' && row[col.key] !== 0),
                  }"
                  @click="
                    col.key === 'pemasukan_umum' && row[col.key] > 0
                      ? openDetailPemasukanUmum(row, col.key)
                      : (col.key === 'pengembalian_dana' && row[col.key] !== 0 ? openDetailPengembalianDana(row) : null)
                  "
                >
                  <span
                    v-if="col.key === 'pemasukan_umum' && row[col.key] > 0"
                    class="clickable-nominal"
                    title="Klik untuk melihat rincian detail transaksi pemasukan umum"
                  >
                    {{ formatCurrencyTotals(row[`${col.key}_by_currency`], row[col.key]) }}
                  </span>
                  <span
                    v-else-if="col.key === 'pengembalian_dana' && row[col.key] !== 0"
                    class="clickable-nominal text-error"
                    title="Klik untuk melihat rincian detail transaksi pengembalian dana"
                  >
                    {{ formatCurrencyTotals(row[`${col.key}_by_currency`], row[col.key]) }}
                  </span>
                  <template v-else>
                    {{ formatCurrencyTotals(row[`${col.key}_by_currency`], row[col.key]) }}
                  </template>
                </td>
                <td
                  class="col-total text-right"
                  :class="{ 'has-value-total': row.jumlah > 0 }"
                >
                  {{ formatCurrencyTotals(row.jumlah_by_currency, row.jumlah) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td
                  class="sticky-col col-no text-center"
                  colspan="2"
                >
                  TOTAL
                </td>
                <td
                  v-for="col in columns"
                  :key="col.key"
                  class="col-amount text-right"
                  :class="{
                    'cell-clickable': (col.key === 'pemasukan_umum' && totals[col.key] > 0) || (col.key === 'pengembalian_dana' && totals[col.key] !== 0),
                  }"
                  @click="
                    col.key === 'pemasukan_umum' && totals[col.key] > 0
                      ? openDetailPemasukanUmum(null, col.key)
                      : (col.key === 'pengembalian_dana' && totals[col.key] !== 0 ? openDetailPengembalianDana(null) : null)
                  "
                >
                  <span
                    v-if="col.key === 'pemasukan_umum' && totals[col.key] > 0"
                    class="clickable-nominal"
                    title="Klik untuk melihat rincian detail transaksi pemasukan umum"
                  >
                    {{ formatCurrencyTotals(totals[`${col.key}_by_currency`], totals[col.key]) }}
                  </span>
                  <span
                    v-else-if="col.key === 'pengembalian_dana' && totals[col.key] !== 0"
                    class="clickable-nominal text-error"
                    title="Klik untuk melihat rincian detail transaksi pengembalian dana"
                  >
                    {{ formatCurrencyTotals(totals[`${col.key}_by_currency`], totals[col.key]) }}
                  </span>
                  <template v-else>
                    {{ formatCurrencyTotals(totals[`${col.key}_by_currency`], totals[col.key]) }}
                  </template>
                </td>
                <td class="col-total text-right">
                  {{ formatCurrencyTotals(totals.jumlah_by_currency, totals.jumlah) }}
                </td>
              </tr>
            </tfoot>
          </table>

          <!-- Print-only Rincian Section -->
          <div
            id="rincian-pembayaran-print"
            class="d-none"
          >
            <h3 style="margin-top: 24px; margin-bottom: 8px; font-size: 13px; color: #1a237e;">
              Rincian Jenis Pembayaran <span v-if="jkInfo">({{ jkInfo }})</span>
            </h3>
            <table class="rincian-print-table">
              <thead>
                <tr>
                  <th style="text-align: left;">Metode Pembayaran</th>
                  <th style="text-align: right;">Nominal</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, idx) in rincianJenisPembayaran"
                  :key="idx"
                  :class="{ 'total-item': item.is_total }"
                >
                  <td style="text-align: left;">{{ item.nama }}</td>
                  <td style="text-align: right;">{{ formatCurrencyTotals(item.total_by_currency, item.total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Summary Cards -->
        <VCardText class="pa-6">
          <VRow>
            <VCol
              cols="12"
              md="4"
            >
              <div class="summary-card summary-total">
                <div class="summary-icon">
                  <VIcon
                    icon="ri-funds-line"
                    size="28"
                  />
                </div>
                <div>
                  <span class="summary-label">Total Pemasukan</span>
                  <span class="summary-value">{{ formatCurrencyTotals(totals.jumlah_by_currency, totals.jumlah) }}</span>
                </div>
              </div>
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <div class="summary-card summary-days">
                <div class="summary-icon">
                  <VIcon
                    icon="ri-calendar-check-line"
                    size="28"
                  />
                </div>
                <div>
                  <span class="summary-label">Hari dengan Transaksi</span>
                  <span class="summary-value">{{ tableData.filter(r => r.jumlah > 0).length }} hari</span>
                </div>
              </div>
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <div class="summary-card summary-categories">
                <div class="summary-icon">
                  <VIcon
                    icon="ri-stack-line"
                    size="28"
                  />
                </div>
                <div>
                  <span class="summary-label">Kategori Tagihan</span>
                  <span class="summary-value">{{ columns.length }} kategori</span>
                </div>
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </template>

    <template v-else-if="selectedMode === 'tahunan'">
      <VCard
        v-for="(monthInfo, mIdx) in allData"
        :key="mIdx"
        class="report-table-card mb-6"
      >
        <VCardItem class="report-table-header">
          <VCardTitle class="text-center">
            <VIcon
              icon="ri-bar-chart-grouped-line"
              class="me-2"
            />
            {{ monthInfo.title }}
          </VCardTitle>
        </VCardItem>

        <VDivider />

        <div class="table-scroll-container">
          <table class="report-table">
            <thead>
              <tr>
                <th
                  class="sticky-col col-no"
                  rowspan="1"
                >
                  No
                </th>
                <th
                  class="sticky-col col-tanggal"
                  rowspan="1"
                >
                  Tanggal
                </th>
                <th
                  v-for="col in columns"
                  :key="col.key"
                  class="col-amount"
                >
                  {{ col.label }}
                </th>
                <th class="col-total">
                  Jumlah
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in monthInfo.data"
                :key="index"
                class="data-row"
                :class="{ 'even-row': index % 2 === 0 }"
              >
                <td class="sticky-col col-no text-center">
                  {{ row.no }}
                </td>
                <td class="sticky-col col-tanggal text-center">
                  {{ formatTanggal(row.tanggal) }}
                </td>
                <td
                  v-for="col in columns"
                  :key="col.key"
                  class="col-amount text-right"
                  :class="{
                    'has-value': row[col.key] !== 0,
                    'cell-clickable': (col.key === 'pemasukan_umum' && row[col.key] > 0) || (col.key === 'pengembalian_dana' && row[col.key] !== 0),
                  }"
                  @click="
                    col.key === 'pemasukan_umum' && row[col.key] > 0
                      ? openDetailPemasukanUmum(row, col.key)
                      : (col.key === 'pengembalian_dana' && row[col.key] !== 0 ? openDetailPengembalianDana(row) : null)
                  "
                >
                  <span
                    v-if="col.key === 'pemasukan_umum' && row[col.key] > 0"
                    class="clickable-nominal"
                    title="Klik untuk melihat rincian detail transaksi pemasukan umum"
                  >
                    {{ formatCurrencyTotals(row[`${col.key}_by_currency`], row[col.key]) }}
                  </span>
                  <span
                    v-else-if="col.key === 'pengembalian_dana' && row[col.key] !== 0"
                    class="clickable-nominal text-error"
                    title="Klik untuk melihat rincian detail transaksi pengembalian dana"
                  >
                    {{ formatCurrencyTotals(row[`${col.key}_by_currency`], row[col.key]) }}
                  </span>
                  <template v-else>
                    {{ formatCurrencyTotals(row[`${col.key}_by_currency`], row[col.key]) }}
                  </template>
                </td>
                <td
                  class="col-total text-right"
                  :class="{ 'has-value-total': row.jumlah > 0 }"
                >
                  {{ formatCurrencyTotals(row.jumlah_by_currency, row.jumlah) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td
                  class="sticky-col col-no text-center"
                  colspan="2"
                >
                  TOTAL
                </td>
                <td
                  v-for="col in columns"
                  :key="col.key"
                  class="col-amount text-right"
                  :class="{
                    'cell-clickable': (col.key === 'pemasukan_umum' && monthInfo.totals[col.key] > 0) || (col.key === 'pengembalian_dana' && monthInfo.totals[col.key] !== 0),
                  }"
                  @click="
                    col.key === 'pemasukan_umum' && monthInfo.totals[col.key] > 0
                      ? openDetailPemasukanUmum(null, col.key, { month: mIdx, title: monthInfo.title })
                      : (col.key === 'pengembalian_dana' && monthInfo.totals[col.key] !== 0 ? openDetailPengembalianDana(null, { month: mIdx, title: monthInfo.title }) : null)
                  "
                >
                  <span
                    v-if="col.key === 'pemasukan_umum' && monthInfo.totals[col.key] > 0"
                    class="clickable-nominal"
                    title="Klik untuk melihat rincian detail transaksi pemasukan umum"
                  >
                    {{ formatCurrencyTotals(monthInfo.totals[`${col.key}_by_currency`], monthInfo.totals[col.key]) }}
                  </span>
                  <span
                    v-else-if="col.key === 'pengembalian_dana' && monthInfo.totals[col.key] !== 0"
                    class="clickable-nominal text-error"
                    title="Klik untuk melihat rincian detail transaksi pengembalian dana"
                  >
                    {{ formatCurrencyTotals(monthInfo.totals[`${col.key}_by_currency`], monthInfo.totals[col.key]) }}
                  </span>
                  <template v-else>
                    {{ formatCurrencyTotals(monthInfo.totals[`${col.key}_by_currency`], monthInfo.totals[col.key]) }}
                  </template>
                </td>
                <td class="col-total text-right">
                  {{ formatCurrencyTotals(monthInfo.totals.jumlah_by_currency, monthInfo.totals.jumlah) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </VCard>
    </template>

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

    <!-- Modal Detail Pemasukan Umum -->
    <ModalDetailPemasukanUmum
      v-model="isDetailModalOpen"
      :title="detailModalTitle"
      :subtitle="detailModalSubtitle"
      :filter-params="detailModalFilter"
    />

    <!-- Modal Detail Pengembalian Dana -->
    <ModalDetailPengembalianDana
      v-model="isDetailPengembalianOpen"
      :title="detailPengembalianTitle"
      :subtitle="detailPengembalianSubtitle"
      :filter-params="detailPengembalianFilter"
    />
  </div>
</template>

<style scoped>
/* CLICKABLE NOMINAL PEMASUKAN */
.clickable-nominal {
  color: #1976d2 !important;
  font-weight: 700 !important;
  cursor: pointer;
  text-decoration: underline;
  transition: all 0.15s ease-in-out;
  display: inline-block;
}

.clickable-nominal:hover {
  color: #0d47a1 !important;
  text-decoration: underline;
  transform: scale(1.04);
}

.cell-clickable {
  cursor: pointer;
  background-color: rgba(25, 118, 210, 0.05);
}

.cell-clickable:hover {
  background-color: rgba(25, 118, 210, 0.12) !important;
}

/* ══════════════════════════════════════════════════════
   HEADER CARD
   ══════════════════════════════════════════════════════ */
.report-header-card {
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.header-gradient {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1a237e 100%);
  padding: 32px 28px;
  position: relative;
  overflow: hidden;
}

.header-gradient::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -20%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 70%);
  border-radius: 50%;
}

.header-gradient::after {
  content: "";
  position: absolute;
  bottom: -30%;
  left: 10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(99, 179, 237, 0.08) 0%, transparent 70%);
  border-radius: 50%;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.header-icon-wrap {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 14px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: -0.02em;
}

.header-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 4px 0 0;
}

.bulan-select :deep(.v-field) {
  border-radius: 12px;
}

.fetch-btn {
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: none;
}

/* ══════════════════════════════════════════════════════
   REPORT TABLE CARD
   ══════════════════════════════════════════════════════ */
.report-table-card {
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.report-table-header {
  background: linear-gradient(135deg, #f8faff 0%, #eef2ff 100%);
}

.report-table-header :deep(.v-card-title) {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a237e;
  letter-spacing: 0.04em;
}

/* ══════════════════════════════════════════════════════
   TABLE SCROLL
   ══════════════════════════════════════════════════════ */
.table-scroll-container {
  overflow-x: auto;
  overflow-y: visible;
  max-height: none;
  scrollbar-width: thin;
  scrollbar-color: #c7d2fe #f1f5f9;
}

.table-scroll-container::-webkit-scrollbar {
  height: 8px;
}

.table-scroll-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 8px;
}

.table-scroll-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #818cf8, #6366f1);
  border-radius: 8px;
}

/* ══════════════════════════════════════════════════════
   TABLE STYLES
   ══════════════════════════════════════════════════════ */
.report-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.8rem;
  min-width: max-content;
}

.report-table thead th {
  background: linear-gradient(180deg, #1a237e 0%, #283593 100%);
  color: white;
  padding: 12px 10px;
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 3px solid #3949ab;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
  text-align: center;
}

.report-table tbody td {
  padding: 8px 10px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  white-space: nowrap;
  transition: all 0.15s ease;
  font-variant-numeric: tabular-nums;
  color: inherit;
}

.report-table .data-row:hover td {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
}

.report-table .even-row td {
  background-color: rgba(var(--v-theme-on-surface), 0.02);
}

/* Sticky columns */
.sticky-col {
  position: sticky;
  z-index: 5;
  background-color: rgb(var(--v-theme-surface));
}

.col-no {
  left: 0;
  min-width: 50px;
  width: 50px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.col-tanggal {
  left: 50px;
  min-width: 110px;
  width: 110px;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.85);
}

.report-table thead .col-no,
.report-table thead .col-tanggal {
  z-index: 15;
}

.report-table .even-row .sticky-col {
  background-color: rgba(var(--v-theme-on-surface), 0.04);
}

.report-table .data-row:hover .sticky-col {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
}

.report-table tbody .sticky-col {
  background-color: rgb(var(--v-theme-surface));
}

.col-amount {
  min-width: 120px;
}

.col-total {
  min-width: 130px;
  font-weight: 700;
  background: rgba(var(--v-theme-on-surface), 0.04);
}

.report-table thead .col-total {
  background: linear-gradient(180deg, #0d1b6e 0%, #1a237e 100%);
}

/* Value styling */
.has-value {
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 500;
}

.has-value-total {
  color: rgb(var(--v-theme-success)) !important;
  font-weight: 700;
}

/* ══════════════════════════════════════════════════════
   TOTAL ROW
   ══════════════════════════════════════════════════════ */
.total-row td {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%) !important;
  color: white !important;
  font-weight: 700;
  padding: 14px 10px;
  border: none;
  font-size: 0.82rem;
  letter-spacing: 0.02em;
}

.total-row .sticky-col {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%) !important;
  color: white !important;
  z-index: 6;
}

/* ══════════════════════════════════════════════════════
   SUMMARY CARDS
   ══════════════════════════════════════════════════════ */
.summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 14px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.summary-total {
  background: rgba(var(--v-theme-success), 0.1);
  border: 1px solid rgba(var(--v-theme-success), 0.2);
}

.summary-total .summary-icon {
  background: rgb(var(--v-theme-success));
  color: white;
  border-radius: 12px;
  padding: 10px;
}

.summary-total .summary-value {
  color: rgb(var(--v-theme-success));
}

.summary-days {
  background: rgba(var(--v-theme-info), 0.1);
  border: 1px solid rgba(var(--v-theme-info), 0.2);
}

.summary-days .summary-icon {
  background: rgb(var(--v-theme-info));
  color: white;
  border-radius: 12px;
  padding: 10px;
}

.summary-days .summary-value {
  color: rgb(var(--v-theme-info));
}

.summary-categories {
  background: rgba(var(--v-theme-primary), 0.1);
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
}

.summary-categories .summary-icon {
  background: rgb(var(--v-theme-primary));
  color: white;
  border-radius: 12px;
  padding: 10px;
}

.summary-categories .summary-value {
  color: rgb(var(--v-theme-primary));
}

.summary-label {
  display: block;
  font-size: 0.78rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-weight: 500;
  margin-bottom: 2px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.summary-value {
  display: block;
  font-size: 1.15rem;
  font-weight: 700;
}

.custom-loader {
  display: flex;
  align-items: center;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.loading-dots::after {
  content: '.';
  animation: loading-dots 1.5s steps(4, end) infinite;
  display: inline-block;
  width: 1em;
  text-align: left;
}

@keyframes loading-dots {
  0%, 20% { content: ''; }
  40% { content: '.'; }
  60% { content: '..'; }
  80%, 100% { content: '...'; }
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

.carry-over-row {
  background-color: rgba(255, 152, 0, 0.08) !important;
}

.carry-over-row td {
  border-bottom: 1px dashed rgba(255, 152, 0, 0.4) !important;
}

.carry-over-row:hover {
  background-color: rgba(255, 152, 0, 0.16) !important;
}
</style>
