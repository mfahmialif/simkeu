<script setup>
import { showSnackbar } from "@/composables/snackbar"
import { computed, onMounted, ref } from "vue"

const router = useRouter()

const summary = ref({
  modules: [],
  stats: {},
  charts: {},
  top_pegawai: [],
})

const isLoading = ref(false)

const currency = value => formatRupiah(Number(value || 0))

const compactCurrency = value =>
  new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value || 0))

const fetchData = async () => {
  isLoading.value = true
  try {
    const response = await $api("/admin/dashboard/barokah-summary")

    if (!response?.status) {
      showSnackbar({
        text: response?.message || "Gagal mengambil ringkasan barokah",
        color: "error",
      })
      
      return
    }

    summary.value = response.data || summary.value
  } catch (error) {
    console.error(error)
    showSnackbar({
      text: "Terjadi kesalahan saat mengambil ringkasan barokah",
      color: "error",
    })
  } finally {
    isLoading.value = false
  }
}

const statCards = computed(() => {
  const stats = summary.value.stats || {}

  const items = [
    {
      key: "hari_ini",
      title: "Hari Ini",
      icon: "ri-calendar-check-line",
      color: "primary",
      subtitle: "Pengeluaran hari ini",
    },
    {
      key: "bulan_ini",
      title: "Bulan Ini",
      icon: "ri-calendar-2-line",
      color: "info",
      subtitle: "Pengeluaran bulan berjalan",
    },
    {
      key: "tahun_ini",
      title: "Tahun Ini",
      icon: "ri-calendar-line",
      color: "warning",
      subtitle: "Pengeluaran tahun berjalan",
    },
    {
      key: "keseluruhan",
      title: "Keseluruhan",
      icon: "ri-funds-line",
      color: "success",
      subtitle: "Akumulasi seluruh data",
    },
  ]

  return items.map(item => ({
    ...item,
    value: currency(stats[item.key]?.total),
    count: stats[item.key]?.jumlah || 0,
  }))
})

const chartTheme = {
  danger: "#FF4C51",
  info: "#16B1FF",
  primary: "#666CFF",
}

const makeChartOptions = (categories, color) => ({
  chart: {
    parentHeightOffset: 0,
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  colors: [color],
  dataLabels: { enabled: false },
  grid: {
    borderColor: "rgba(var(--v-border-color), var(--v-border-opacity))",
    strokeDashArray: 8,
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      borderRadiusApplication: "end",
      columnWidth: "42%",
    },
  },
  stroke: {
    curve: "smooth",
    width: 3,
  },
  xaxis: {
    categories,
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
      formatter: value => currency(value),
      title: { formatter: () => "Pengeluaran" },
    },
  },
})

const chartCards = computed(() => {
  const charts = summary.value.charts || {}

  return [
    {
      key: "harian",
      title: "Pengeluaran Harian",
      subtitle: "Per hari pada bulan berjalan",
      type: "area",
      color: chartTheme.danger,
    },
    {
      key: "bulanan",
      title: "Pengeluaran Bulanan",
      subtitle: "Per bulan pada tahun berjalan",
      type: "bar",
      color: chartTheme.info,
    },
    {
      key: "tahunan",
      title: "Pengeluaran Tahunan",
      subtitle: "Lima tahun terakhir",
      type: "bar",
      color: chartTheme.primary,
    },
  ].map(item => ({
    ...item,
    categories: charts[item.key]?.categories || [],
    series: charts[item.key]?.series || [{ name: "Pengeluaran", data: [] }],
    options: makeChartOptions(charts[item.key]?.categories || [], item.color),
  }))
})

const topPegawai = computed(() => summary.value.top_pegawai || [])
const modules = computed(() => summary.value.modules || [])
const primaryModulePath = computed(() => modules.value[0]?.path || null)

const goToPath = path => {
  if (path) {
    router.push(path)
  }
}

onMounted(fetchData)
</script>

<template>
  <VRow class="match-height">
    <VCol
      v-for="card in statCards"
      :key="card.key"
      cols="12"
      sm="6"
      md="3"
    >
      <VCard
        class="barokah-stat-card"
        :class="{ 'cursor-pointer': primaryModulePath }"
        @click="goToPath(primaryModulePath)"
      >
        <VCardText>
          <VSkeletonLoader
            v-if="isLoading"
            type="paragraph"
          />
          <template v-else>
            <div class="barokah-stat-content d-flex align-center gap-x-4 mb-3 min-w-0">
              <VAvatar
                :color="card.color"
                variant="tonal"
                rounded="lg"
              >
                <VIcon
                  :icon="card.icon"
                  size="24"
                />
              </VAvatar>
              <div class="min-w-0">
                <div class="text-body-2 text-disabled">
                  {{ card.subtitle }}
                </div>
                <h4
                  class="text-h5 text-truncate"
                  :title="card.value"
                >
                  {{ card.value }}
                </h4>
              </div>
            </div>
            <div class="d-flex justify-space-between align-center">
              <span class="text-body-2">{{ card.title }}</span>
              <VChip
                :color="card.color"
                size="small"
                variant="tonal"
              >
                {{ card.count }} Data
              </VChip>
            </div>
          </template>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      v-for="chart in chartCards"
      :key="chart.key"
      cols="12"
      lg="4"
    >
      <VCard>
        <VSkeletonLoader
          v-if="isLoading"
          type="card, paragraph"
        />
        <template v-else>
          <VCardItem
            :title="chart.title"
            :subtitle="chart.subtitle"
          >
            <template
              v-if="primaryModulePath"
              #append
            >
              <VBtn
                icon
                size="small"
                variant="tonal"
                color="secondary"
                class="barokah-link-btn"
                @click="goToPath(primaryModulePath)"
              >
                <VIcon
                  icon="ri-arrow-right-up-line"
                  size="18"
                />
              </VBtn>
            </template>
          </VCardItem>
          <VCardText>
            <VueApexCharts
              :id="`barokah-${chart.key}`"
              :type="chart.type"
              height="260"
              :options="chart.options"
              :series="chart.series"
            />
          </VCardText>
        </template>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      lg="8"
    >
      <VCard>
        <VCardItem
          title="Pegawai dengan Pengeluaran Terbanyak"
          subtitle="Diurutkan dari total pengeluaran barokah terbesar"
        />
        <VCardText>
          <VSkeletonLoader
            v-if="isLoading"
            type="table"
          />
          <VAlert
            v-else-if="!topPegawai.length"
            color="secondary"
            variant="tonal"
          >
            Belum ada data pengeluaran barokah.
          </VAlert>
          <div
            v-else
            class="barokah-table-wrapper"
          >
            <VTable density="comfortable">
              <thead>
                <tr>
                  <th>Pegawai</th>
                  <th>Kode</th>
                  <th>Tipe</th>
                  <th>Modul</th>
                  <th class="text-end">
                    Total
                  </th>
                  <th class="text-end">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in topPegawai"
                  :key="`${item.pegawai_id}-${item.kode}`"
                >
                  <td>
                    <div class="font-weight-medium">
                      {{ item.nama }}
                    </div>
                  </td>
                  <td>{{ item.kode }}</td>
                  <td class="text-capitalize">
                    {{ item.tipe }}
                  </td>
                  <td>
                    <div class="d-flex flex-wrap gap-1">
                      <VChip
                        v-for="moduleName in item.modules"
                        :key="moduleName"
                        size="x-small"
                        variant="tonal"
                      >
                        {{ moduleName }}
                      </VChip>
                    </div>
                  </td>
                  <td class="text-end font-weight-medium">
                    {{ currency(item.total) }}
                  </td>
                  <td class="text-end">
                    {{ item.jumlah }}
                  </td>
                </tr>
              </tbody>
            </VTable>
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
          title="Ringkasan Modul Barokah"
          subtitle="Total pengeluaran per modul yang bisa diakses"
        />
        <VCardText>
          <VSkeletonLoader
            v-if="isLoading"
            type="list-item, list-item, list-item"
          />
          <VAlert
            v-else-if="!modules.length"
            color="secondary"
            variant="tonal"
          >
            Belum ada modul barokah untuk role ini.
          </VAlert>
          <div
            v-else
            class="d-flex flex-column gap-y-4"
          >
            <div
              v-for="module in modules"
              :key="module.key"
              class="barokah-module-item d-flex align-center gap-x-3"
            >
              <VAvatar
                :color="module.color"
                variant="tonal"
                rounded
              >
                <VIcon
                  :icon="module.icon"
                  size="22"
                />
              </VAvatar>
              <div class="flex-grow-1 min-w-0">
                <div class="font-weight-medium text-truncate">
                  {{ module.label }}
                </div>
                <div class="text-body-2 text-disabled">
                  {{ module.jumlah }} data
                </div>
              </div>
              <div class="barokah-module-total text-end font-weight-medium">
                {{ currency(module.total) }}
              </div>
              <VBtn
                icon
                size="small"
                variant="tonal"
                :color="module.color"
                class="barokah-link-btn"
                @click="goToPath(module.path)"
              >
                <VIcon
                  icon="ri-arrow-right-up-line"
                  size="18"
                />
              </VBtn>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart";

.barokah-table-wrapper {
  overflow-x: auto;
}

.barokah-stat-content {
  min-inline-size: 0;
  overflow: hidden;
}

.barokah-stat-content .v-avatar,
.barokah-link-btn {
  flex: 0 0 auto;
}

.barokah-link-btn {
  margin-inline-start: auto;
}

.barokah-module-item {
  border-radius: 8px;
  margin-inline: -8px;
  padding: 8px;
}

.barokah-module-total {
  flex: 0 1 auto;
  min-inline-size: 72px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
