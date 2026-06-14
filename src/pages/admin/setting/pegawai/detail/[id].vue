<script setup>
import { formatRupiah } from "@/composables/formatRupiah"
import { showSnackbar } from "@/composables/snackbar"
import { computed, onMounted, ref, watch } from "vue"
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect/index.js"
import "flatpickr/dist/plugins/monthSelect/style.css"

const router = useRouter()
const route = useRoute()

const id = route.params.id
const pegawai = ref({})
const barokah = ref({
  filters: {},
  stats: {},
  modules: [],
  charts: {
    monthly: { categories: [], series: [] },
    distribution: { labels: [], series: [] },
  },
  recent: [],
})

const isLoading = ref(false)
const isBarokahLoading = ref(false)
const filterMode = ref("bulan")

const today = new Date()
const selectedMonth = ref(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`)
const dateRange = ref({
  start: `${selectedMonth.value}-01`,
  end: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
})

const monthPickerConfig = {
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

const datePickerConfig = {
  altInput: true,
  altFormat: "d F Y",
  dateFormat: "Y-m-d",
  disableMobile: true,
}

const userData = useCookie("userData").value ?? {}

const isAdmin = computed(
  () => String(userData.role?.name || "").toLowerCase() === "admin",
)

const errorMessage = error => {
  const message = error?.data?.message || error?.message || "Terjadi kesalahan."

  if (typeof message === "object") {
    return Object.values(message).flat().join("; ")
  }

  return message
}

const formatDate = value => {
  if (!value) return "-"

  const date = new Date(String(value).includes("T") ? value : `${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) return "-"

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

const compactCurrency = value =>
  new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value || 0))

const employee = computed(() => barokah.value?.pegawai || pegawai.value || {})
const detail = computed(() => employee.value?.tipe === "dosen" ? employee.value?.dosen : employee.value?.staff)

const employeeInitials = computed(() => {
  const words = String(employee.value?.nama || "?").trim().split(/\s+/).slice(0, 2)

  return words.map(word => word.charAt(0).toUpperCase()).join("") || "?"
})

const employeeTypeLabel = computed(() => {
  const tipe = String(employee.value?.tipe || "-")

  return tipe ? tipe.charAt(0).toUpperCase() + tipe.slice(1) : "-"
})

const statusColor = computed(() => {
  const status = String(employee.value?.status || "").toLowerCase()

  if (status === "aktif") return "success"
  if (status.includes("tidak")) return "error"

  return "warning"
})

const roleSummary = computed(() => {
  if (employee.value?.tipe === "dosen") {
    const prodi = detail.value?.prodi?.nama || detail.value?.prodi?.alias

    return prodi ? `Dosen ${prodi}` : "Dosen"
  }

  return detail.value?.jabatan || "Staff"
})

const fullNameWithTitle = computed(() => {
  const prefix = detail.value?.gelar_depan ? `${detail.value.gelar_depan} ` : ""
  const suffix = detail.value?.gelar_belakang ? `, ${detail.value.gelar_belakang}` : ""

  return `${prefix}${employee.value?.nama || "-"}${suffix}`
})

const contactItems = computed(() => [
  { label: "Email", value: employee.value?.email || "-", icon: "ri-mail-line" },
  { label: "No. HP", value: employee.value?.hp || "-", icon: "ri-phone-line" },
  { label: "Alamat", value: employee.value?.alamat || "-", icon: "ri-map-pin-line" },
])

const identityItems = computed(() => [
  { label: "Kode Pegawai", value: employee.value?.kode || "-", icon: "ri-hashtag" },
  { label: "Jenis Kelamin", value: employee.value?.jenis_kelamin || "-", icon: "ri-user-heart-line" },
  { label: "Tempat Lahir", value: employee.value?.tempat_lahir || "-", icon: "ri-building-2-line" },
  { label: "Tanggal Lahir", value: formatDate(employee.value?.tanggal_lahir), icon: "ri-calendar-line" },
])

const detailItems = computed(() => {
  if (employee.value?.tipe === "dosen") {
    return [
      { label: "Kode Dosen", value: detail.value?.kode || employee.value?.kode || "-", icon: "ri-id-card-line" },
      { label: "NIDN", value: detail.value?.nidn || "-", icon: "ri-bank-card-line" },
      { label: "Program Studi", value: detail.value?.prodi?.nama || detail.value?.prodi?.alias || "-", icon: "ri-graduation-cap-line" },
    ]
  }

  return [
    { label: "Jabatan", value: detail.value?.jabatan || "-", icon: "ri-briefcase-line" },
  ]
})

const paymentItems = computed(() => [
  { label: "Bank", value: employee.value?.bank || "-", icon: "ri-bank-line" },
  { label: "No. Rekening", value: employee.value?.nomer_rekening || "-", icon: "ri-bank-card-2-line" },
  { label: "Pemilik Rekening", value: employee.value?.nama_pemilik_rekening || "-", icon: "ri-user-received-line" },
])

const modules = computed(() => barokah.value?.modules || [])
const recentRows = computed(() => barokah.value?.recent || [])
const stats = computed(() => barokah.value?.stats || {})
const hasBarokahData = computed(() => Number(stats.value?.total || 0) > 0 || modules.value.some(item => Number(item.jumlah || 0) > 0))

const statCards = computed(() => [
  {
    title: "Total Barokah",
    value: formatRupiah(stats.value?.total || 0),
    subtitle: barokah.value?.filters?.label || "-",
    icon: "ri-funds-line",
    color: "primary",
  },
  {
    title: "Jumlah Data",
    value: `${stats.value?.jumlah || 0}`,
    subtitle: "Transaksi tercatat",
    icon: "ri-file-list-3-line",
    color: "success",
  },
  {
    title: "Rata-rata",
    value: formatRupiah(stats.value?.rata_rata || 0),
    subtitle: "Per transaksi",
    icon: "ri-line-chart-line",
    color: "info",
  },
  {
    title: "Periode Terbesar",
    value: formatRupiah(stats.value?.periode_terbesar?.total || 0),
    subtitle: stats.value?.periode_terbesar?.label || "-",
    icon: "ri-calendar-check-line",
    color: "warning",
  },
])

const chartColors = ["#666CFF", "#28C76F", "#16B1FF"]

const monthlyChartSeries = computed(() => barokah.value?.charts?.monthly?.series || [])

const monthlyChartOptions = computed(() => ({
  chart: {
    parentHeightOffset: 0,
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  colors: chartColors,
  dataLabels: { enabled: false },
  grid: {
    borderColor: "rgba(var(--v-border-color), var(--v-border-opacity))",
    strokeDashArray: 8,
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    markers: { radius: 8 },
  },
  plotOptions: {
    bar: {
      borderRadius: 5,
      borderRadiusApplication: "end",
      columnWidth: "42%",
    },
  },
  stroke: {
    curve: "smooth",
    width: 3,
  },
  xaxis: {
    categories: barokah.value?.charts?.monthly?.categories || [],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: {
        colors: "rgba(var(--v-theme-on-background), var(--v-disabled-opacity))",
        fontSize: "12px",
      },
    },
  },
  yaxis: {
    labels: {
      formatter: value => compactCurrency(value),
      style: {
        colors: "rgba(var(--v-theme-on-background), var(--v-disabled-opacity))",
        fontSize: "12px",
      },
    },
  },
  tooltip: {
    y: {
      formatter: value => formatRupiah(value),
    },
  },
}))

const distributionSeries = computed(() => {
  const values = barokah.value?.charts?.distribution?.series || []

  return values.some(value => Number(value) > 0) ? values : []
})

const distributionChartOptions = computed(() => ({
  labels: barokah.value?.charts?.distribution?.labels || [],
  colors: chartColors,
  chart: {
    parentHeightOffset: 0,
    toolbar: { show: false },
  },
  dataLabels: { enabled: false },
  legend: {
    position: "bottom",
    markers: { radius: 8 },
  },
  stroke: { width: 0 },
  plotOptions: {
    pie: {
      donut: {
        size: "72%",
        labels: {
          show: true,
          total: {
            show: true,
            label: "Total",
            formatter: () => compactCurrency(stats.value?.total || 0),
          },
        },
      },
    },
  },
  tooltip: {
    y: {
      formatter: value => formatRupiah(value),
    },
  },
}))

const barokahParams = computed(() => {
  if (filterMode.value === "rentang") {
    return {
      mode: "rentang",
      tanggal_mulai: dateRange.value.start,
      tanggal_akhir: dateRange.value.end,
    }
  }

  return {
    mode: "bulan",
    bulan: selectedMonth.value,
  }
})

const fetchPegawai = async () => {
  const response = await $api("/admin/pegawai/" + id, {
    method: "GET",
  })

  pegawai.value = response.data
}

const fetchBarokah = async () => {
  try {
    isBarokahLoading.value = true

    const response = await $api(`/admin/pegawai/${id}/barokah`, {
      method: "GET",
      params: barokahParams.value,
    })

    if (!response?.status) {
      showSnackbar({
        text: response?.message || "Gagal mengambil ringkasan barokah.",
        color: "error",
      })

      return
    }

    barokah.value = response.data || barokah.value
    if (response.data?.pegawai) {
      pegawai.value = response.data.pegawai
    }
  } catch (error) {
    console.error(error)
    showSnackbar({
      text: errorMessage(error),
      color: "error",
    })
  } finally {
    isBarokahLoading.value = false
  }
}

const fetchPageData = async () => {
  try {
    isLoading.value = true
    await Promise.all([fetchPegawai(), fetchBarokah()])
  } catch (err) {
    console.error(err)
    if (err.status === 404) {
      router.replace("/not-found")

      return
    }

    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    isLoading.value = false
  }
}

const goTo = path => {
  if (path) router.push(path)
}

const menuList = computed(() => [
  {
    title: "Kembali",
    value: "back",
    icon: "ri-arrow-left-line",
    clickHandler: () => router.back(),
  },
  ...(isAdmin.value
    ? [
      {
        title: "Edit",
        value: "edit",
        icon: "ri-edit-box-line",
        clickHandler: () => router.push(`/admin/setting/pegawai/edit/${id}`),
      },
    ]
    : []),
  {
    title: "Lihat Data",
    value: "lihat-data",
    icon: "ri-list-check",
    clickHandler: () => router.push("/admin/pegawai"),
  },
])

watch(filterMode, value => {
  if (value === "rentang" && (!dateRange.value.start || !dateRange.value.end)) {
    dateRange.value = {
      start: `${selectedMonth.value}-01`,
      end: `${selectedMonth.value}-28`,
    }
  }
})

onMounted(() => {
  document.title = "Pegawai Detail - SIMKEU"
  fetchPageData()
})
</script>

<template>
  <div class="employee-detail-page">
    <VProgressLinear
      v-if="isLoading"
      indeterminate
      color="primary"
      class="mb-4"
    />

    <VRow>
      <VCol cols="12">
        <VCard class="employee-hero">
          <VCardText>
            <div class="d-flex flex-column flex-md-row align-md-center justify-space-between gap-6">
              <div class="d-flex align-center gap-4 min-w-0">
                <VAvatar
                  color="primary"
                  variant="tonal"
                  size="72"
                  rounded="lg"
                  class="employee-avatar"
                >
                  <span class="text-h5 font-weight-bold">{{ employeeInitials }}</span>
                </VAvatar>

                <div class="min-w-0">
                  <div class="d-flex flex-wrap align-center gap-2 mb-2">
                    <VChip
                      :color="employee?.tipe === 'dosen' ? 'primary' : 'info'"
                      variant="tonal"
                      size="small"
                    >
                      {{ employeeTypeLabel }}
                    </VChip>
                    <VChip
                      :color="statusColor"
                      variant="tonal"
                      size="small"
                    >
                      {{ employee?.status || "-" }}
                    </VChip>
                  </div>

                  <h1 class="employee-title">
                    {{ fullNameWithTitle }}
                  </h1>
                  <div class="text-body-1 text-medium-emphasis">
                    {{ roleSummary }} · {{ employee?.kode || "-" }}
                  </div>
                </div>
              </div>

              <div class="d-flex flex-wrap align-center gap-2 employee-actions">
                <VBtn
                  variant="tonal"
                  color="secondary"
                  prepend-icon="ri-arrow-left-line"
                  @click="router.back()"
                >
                  Kembali
                </VBtn>
                <VBtn
                  v-if="isAdmin"
                  color="primary"
                  prepend-icon="ri-edit-box-line"
                  @click="router.push(`/admin/setting/pegawai/edit/${id}`)"
                >
                  Edit
                </VBtn>
                <MoreBtnAction :menu-list="menuList" />
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        v-for="card in statCards"
        :key="card.title"
        cols="12"
        sm="6"
        lg="3"
      >
        <VCard class="stat-card">
          <VCardText>
            <div class="d-flex align-start justify-space-between gap-3">
              <div class="min-w-0">
                <div class="text-body-2 text-medium-emphasis mb-1">
                  {{ card.title }}
                </div>
                <div
                  class="text-h5 font-weight-medium text-truncate"
                  :title="card.value"
                >
                  {{ card.value }}
                </div>
                <div class="text-caption text-disabled text-truncate mt-1">
                  {{ card.subtitle }}
                </div>
              </div>
              <VAvatar
                :color="card.color"
                variant="tonal"
                rounded
                size="42"
              >
                <VIcon
                  :icon="card.icon"
                  size="22"
                />
              </VAvatar>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        lg="4"
      >
        <VCard>
          <VCardItem
            title="Informasi Pegawai"
            subtitle="Identitas, kontak, dan rekening"
          />
          <VDivider />
          <VCardText>
            <div class="info-group">
              <div
                v-for="item in identityItems"
                :key="item.label"
                class="info-row"
              >
                <VIcon
                  :icon="item.icon"
                  size="20"
                  class="text-medium-emphasis"
                />
                <div class="min-w-0">
                  <div class="text-caption text-disabled">
                    {{ item.label }}
                  </div>
                  <div class="font-weight-medium text-wrap">
                    {{ item.value }}
                  </div>
                </div>
              </div>
            </div>

            <VDivider class="my-4" />

            <div class="info-group">
              <div
                v-for="item in detailItems"
                :key="item.label"
                class="info-row"
              >
                <VIcon
                  :icon="item.icon"
                  size="20"
                  class="text-medium-emphasis"
                />
                <div class="min-w-0">
                  <div class="text-caption text-disabled">
                    {{ item.label }}
                  </div>
                  <div class="font-weight-medium text-wrap">
                    {{ item.value }}
                  </div>
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        lg="8"
      >
        <VCard>
          <VCardItem
            title="Kontak & Pembayaran"
            subtitle="Data komunikasi dan rekening penerima"
          />
          <VDivider />
          <VCardText>
            <VRow>
              <VCol
                v-for="item in contactItems"
                :key="item.label"
                cols="12"
                md="4"
              >
                <div class="detail-tile">
                  <VIcon
                    :icon="item.icon"
                    size="22"
                    color="primary"
                  />
                  <div class="min-w-0">
                    <div class="text-caption text-disabled">
                      {{ item.label }}
                    </div>
                    <div class="font-weight-medium text-wrap">
                      {{ item.value }}
                    </div>
                  </div>
                </div>
              </VCol>
              <VCol
                v-for="item in paymentItems"
                :key="item.label"
                cols="12"
                md="4"
              >
                <div class="detail-tile">
                  <VIcon
                    :icon="item.icon"
                    size="22"
                    color="success"
                  />
                  <div class="min-w-0">
                    <div class="text-caption text-disabled">
                      {{ item.label }}
                    </div>
                    <div class="font-weight-medium text-wrap">
                      {{ item.value }}
                    </div>
                  </div>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12">
        <VCard class="barokah-card">
          <VCardItem
            title="Barokah Pegawai"
            subtitle="Rekap lintas modul berdasarkan bulan atau rentang tanggal"
          />

          <VDivider />

          <VCardText class="barokah-filter-shell">
            <div class="barokah-filter">
              <VBtnToggle
                v-model="filterMode"
                mandatory
                density="comfortable"
                variant="tonal"
                color="primary"
                class="barokah-mode-toggle"
              >
                <VBtn value="bulan">
                  <VIcon
                    icon="ri-calendar-2-line"
                    size="18"
                  />
                  <span class="ms-2">Bulan</span>
                </VBtn>
                <VBtn value="rentang">
                  <VIcon
                    icon="ri-calendar-event-line"
                    size="18"
                  />
                  <span class="ms-2">Rentang</span>
                </VBtn>
              </VBtnToggle>

              <AppDateTimePicker
                v-if="filterMode === 'bulan'"
                v-model="selectedMonth"
                density="compact"
                hide-details
                prepend-inner-icon="ri-calendar-2-line"
                :config="monthPickerConfig"
                class="filter-field"
              />
              <template v-else>
                <AppDateTimePicker
                  v-model="dateRange.start"
                  density="compact"
                  hide-details
                  prepend-inner-icon="ri-calendar-event-line"
                  :config="datePickerConfig"
                  class="filter-field"
                />
                <AppDateTimePicker
                  v-model="dateRange.end"
                  density="compact"
                  hide-details
                  prepend-inner-icon="ri-calendar-check-line"
                  :config="datePickerConfig"
                  class="filter-field"
                />
              </template>

              <VBtn
                icon
                color="primary"
                class="filter-refresh-btn"
                :loading="isBarokahLoading"
                @click="fetchBarokah"
              >
                <VIcon icon="ri-refresh-line" />
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <VCardText>
            <VProgressLinear
              v-if="isBarokahLoading"
              indeterminate
              color="primary"
              class="mb-4"
            />

            <VAlert
              v-if="!isBarokahLoading && !modules.length"
              color="secondary"
              variant="tonal"
              class="mb-4"
            >
              Tipe pegawai ini belum memiliki modul barokah.
            </VAlert>

            <VRow class="mb-2">
              <VCol
                v-for="module in modules"
                :key="module.key"
                cols="12"
                md="4"
              >
                <div
                  class="module-tile"
                  role="button"
                  tabindex="0"
                  @click="goTo(module.path)"
                  @keydown.enter.prevent="goTo(module.path)"
                  @keydown.space.prevent="goTo(module.path)"
                >
                  <div class="d-flex align-center gap-3 min-w-0">
                    <VAvatar
                      :color="module.color"
                      variant="tonal"
                      rounded
                      size="44"
                    >
                      <VIcon
                        :icon="module.icon"
                        size="22"
                      />
                    </VAvatar>
                    <div class="min-w-0">
                      <div class="font-weight-medium text-truncate">
                        {{ module.short_label }}
                      </div>
                      <div class="text-caption text-disabled">
                        {{ module.jumlah }} data
                      </div>
                    </div>
                  </div>
                  <div class="module-total">
                    {{ formatRupiah(module.total) }}
                  </div>
                </div>
              </VCol>
            </VRow>

            <VAlert
              v-if="!isBarokahLoading && !hasBarokahData"
              color="secondary"
              variant="tonal"
              class="mb-4"
            >
              Belum ada data barokah pada periode ini.
            </VAlert>

            <VRow>
              <VCol
                cols="12"
                lg="8"
              >
                <div class="chart-panel">
                  <div class="d-flex align-center justify-space-between gap-3 mb-3">
                    <div>
                      <div class="text-h6">
                        Tren Barokah
                      </div>
                      <div class="text-body-2 text-medium-emphasis">
                        Total per modul dalam periode terpilih
                      </div>
                    </div>
                    <VChip
                      color="primary"
                      variant="tonal"
                      size="small"
                    >
                      {{ barokah?.filters?.label || "-" }}
                    </VChip>
                  </div>

                  <VueApexCharts
                    type="bar"
                    height="310"
                    :options="monthlyChartOptions"
                    :series="monthlyChartSeries"
                  />
                </div>
              </VCol>

              <VCol
                cols="12"
                lg="4"
              >
                <div class="chart-panel">
                  <div class="mb-3">
                    <div class="text-h6">
                      Distribusi Modul
                    </div>
                    <div class="text-body-2 text-medium-emphasis">
                      Porsi total barokah
                    </div>
                  </div>

                  <div
                    v-if="distributionSeries.length"
                    class="distribution-chart"
                  >
                    <VueApexCharts
                      type="donut"
                      height="300"
                      :options="distributionChartOptions"
                      :series="distributionSeries"
                    />
                  </div>
                  <div
                    v-else
                    class="empty-chart"
                  >
                    <VIcon
                      icon="ri-pie-chart-2-line"
                      size="42"
                    />
                    <span>Belum ada distribusi</span>
                  </div>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12">
        <VCard>
          <VCardItem
            title="Aktivitas Barokah Terbaru"
            subtitle="Sepuluh transaksi terakhir pada periode terpilih"
          />
          <VDivider />
          <VCardText>
            <VAlert
              v-if="!recentRows.length"
              color="secondary"
              variant="tonal"
            >
              Belum ada aktivitas barokah pada periode ini.
            </VAlert>

            <div
              v-else
              class="recent-table"
            >
              <VTable density="comfortable">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Modul</th>
                    <th>Aktivitas</th>
                    <th>Detail</th>
                    <th class="text-end">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="row in recentRows"
                    :key="`${row.module_key}-${row.id}`"
                  >
                    <td class="text-no-wrap">
                      {{ row.tanggal_label }}
                    </td>
                    <td>
                      <VChip
                        :color="row.module_color"
                        variant="tonal"
                        size="small"
                      >
                        <VIcon
                          :icon="row.module_icon"
                          size="16"
                          class="me-1"
                        />
                        {{ row.module_label }}
                      </VChip>
                    </td>
                    <td>
                      <div class="font-weight-medium">
                        {{ row.deskripsi }}
                      </div>
                    </td>
                    <td>
                      <div class="d-flex flex-wrap gap-1">
                        <VChip
                          v-for="meta in row.meta"
                          :key="meta"
                          size="x-small"
                          variant="tonal"
                        >
                          {{ meta }}
                        </VChip>
                      </div>
                    </td>
                    <td class="text-end font-weight-medium text-no-wrap">
                      {{ formatRupiah(row.total) }}
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart";

.employee-detail-page {
  .v-card {
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    border-radius: 8px;
  }
}

.employee-hero {
  overflow: hidden;

  &::before {
    display: block;
    block-size: 4px;
    background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-success)), rgb(var(--v-theme-info)));
    content: "";
  }
}

.employee-avatar {
  flex: 0 0 auto;
}

.employee-title {
  overflow-wrap: anywhere;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
}

.employee-actions {
  flex: 0 0 auto;
}

.stat-card {
  block-size: 100%;
}

.info-group {
  display: grid;
  gap: 14px;
}

.info-row,
.detail-tile {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-inline-size: 0;
}

.detail-tile {
  block-size: 100%;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  padding: 14px;
}

.barokah-filter-shell {
  padding-block: 14px;
}

.barokah-filter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
}

.barokah-mode-toggle {
  flex: 0 0 auto;
  gap: 8px;
  padding: 4px;

  .v-btn {
    border-radius: 6px !important;
    min-inline-size: 108px;
    padding-inline: 14px;
  }
}

.filter-field {
  flex: 0 0 auto;
  inline-size: 210px;
  min-inline-size: 210px;

  .v-field__prepend-inner {
    padding-inline-end: 8px;
  }

  .v-field__input {
    padding-inline-start: 4px;
    padding-inline-end: 14px;
  }
}

.filter-refresh-btn {
  flex: 0 0 auto;
}

.module-tile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-block-size: 86px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  cursor: pointer;
  gap: 16px;
  padding: 16px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

  &:hover,
  &:focus-visible {
    border-color: rgba(var(--v-theme-primary), 0.45);
    box-shadow: 0 8px 24px rgba(var(--v-theme-on-background), 0.08);
    outline: none;
    transform: translateY(-1px);
  }
}

.module-total {
  flex: 0 1 auto;
  min-inline-size: 116px;
  overflow: hidden;
  font-weight: 700;
  text-align: end;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chart-panel {
  block-size: 100%;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  padding: 18px;
}

.distribution-chart,
.empty-chart {
  display: grid;
  min-block-size: 300px;
  place-items: center;
}

.empty-chart {
  color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity));
  gap: 8px;
}

.recent-table {
  overflow-x: auto;
}

.flatpickr-calendar {
  .flatpickr-monthSelect-month {
    border-radius: 6px;
    color: rgba(var(--v-theme-on-surface), 0.82);

    &:hover,
    &:focus {
      background: rgba(var(--v-theme-primary), 0.14);
      color: rgb(var(--v-theme-on-surface));
    }

    &.selected,
    &.startRange,
    &.endRange {
      background: rgb(var(--v-theme-primary));
      color: rgb(var(--v-theme-on-primary));
      font-weight: 600;
    }
  }

  .flatpickr-current-month,
  .flatpickr-current-month input.cur-year,
  .flatpickr-months .flatpickr-prev-month,
  .flatpickr-months .flatpickr-next-month {
    color: rgb(var(--v-theme-on-surface));
    fill: rgb(var(--v-theme-on-surface));
  }
}

@media (max-width: 960px) {
  .barokah-filter {
    justify-content: flex-start;
    inline-size: 100%;
  }

  .filter-field {
    flex: 1 1 160px;
  }

  .employee-actions {
    inline-size: 100%;
  }
}

@media (max-width: 600px) {
  .barokah-mode-toggle {
    inline-size: 100%;

    .v-btn {
      flex: 1 1 50%;
      min-inline-size: 0;
    }
  }

  .filter-field {
    flex: 1 1 100%;
    inline-size: 100%;
  }
}
</style>
