<script setup>
import { formatCurrencyTotals, formatMoney } from "@/composables/formatRupiah"
import { showSnackbar } from "@/composables/snackbar"

const props = defineProps({
  visibleCards: {
    type: Array,
    default: () => ["saldo", "pemasukan", "pengeluaran", "user"],
  },
})

const router = useRouter()

const currencyRows = (groups = [], fallbackValue = null) => {
  if (Array.isArray(groups) && groups.length) {
    return groups.map(group => ({
      key: group.key || `kode:${group.mata_uang?.kode || "IDR"}`,
      kode: String(group.mata_uang?.kode || "IDR").toUpperCase(),
      amount: formatMoney(group.total, group.mata_uang),
    }))
  }

  if (fallbackValue !== null) {
    return [{
      key: "kode:IDR",
      kode: "IDR",
      amount: formatMoney(fallbackValue),
    }]
  }

  return []
}

const detailRoutes = {
  saldo: { name: "admin-saldo" },
  pemasukan: { path: "/admin/pemasukan/mahasiswa/laporan" },
  pengeluaran: { name: "admin-laporan-pengeluaran-pengeluaran-harian" },
  user: { path: "/admin/user" },
}

const logisticData = ref([
  {
    key: "saldo",
    icon: "ri-money-dollar-box-line",
    color: "primary",
    title: "Saldo",
    value: 0,
    currencies: [],
    change: 0,
    isHover: false,
  },
  {
    key: "pemasukan",
    icon: "ri-arrow-left-down-line",
    color: "success",
    title: "Pemasukan",
    value: 0,
    currencies: [],
    change: 0,
    isHover: false,
  },
  {
    key: "pengeluaran",
    icon: "ri-arrow-right-up-line",
    color: "error",
    title: "Pengeluaran",
    value: 0,
    currencies: [],
    change: 0,
    isHover: false,
  },
  {
    key: "user",
    icon: "ri-user-line",
    color: "info",
    title: "User",
    value: 0,
    change: 0,
    isHover: false,
  },
])

const filteredLogisticData = computed(() =>
  logisticData.value.filter(item => props.visibleCards.includes(item.key)),
)

const isLoading = ref(false)

const fetchData = async () => {
  isLoading.value = true

  const response = await $api("/admin/dashboard/widget")

  isLoading.value = false
  if (response.status) {
    logisticData.value = [
      {
        key: "saldo",
        icon: "ri-money-dollar-box-line",
        color: "primary",
        title: "Saldo",
        value: formatCurrencyTotals(response.data.saldoByCurrency, response.data.saldo),
        currencies: currencyRows(response.data.saldoByCurrency, response.data.saldo),
        change: response.data.jumlahSaldo,
        isHover: false,
      },
      {
        key: "pemasukan",
        icon: "ri-arrow-left-down-line",
        color: "success",
        title: "Pemasukan",
        value: formatCurrencyTotals(
          response.data.pemasukanHarianByCurrency,
          response.data.pemasukanHarian || 0,
        ),
        currencies: currencyRows(
          response.data.pemasukanHarianByCurrency,
          response.data.pemasukanHarian || 0,
        ),
        change: response.data.jumlahPemasukanHarian || 0,
        isHover: false,
        isPemasukan: true,
        breakdown: (() => {
          const breakdown = {}
          if (response.data.pemasukanBreakdown) {
            for (const [period, genders] of Object.entries(response.data.pemasukanBreakdown)) {
              breakdown[period] = {}
              for (const [gender, item] of Object.entries(genders)) {
                breakdown[period][gender] = {
                  value: formatCurrencyTotals(item.by_currency, item.value || 0),
                  change: item.change || 0,
                  hideIfZero: item.hideIfZero || false,
                }
              }
            }
          }
          
          return breakdown
        })(),
      },
      {
        key: "pengeluaran",
        icon: "ri-arrow-right-up-line",
        color: "error",
        title: "Pengeluaran",
        value: formatCurrencyTotals(
          response.data.pengeluaranByCurrency,
          response.data.pengeluaran,
        ),
        currencies: currencyRows(
          response.data.pengeluaranByCurrency,
          response.data.pengeluaran,
        ),
        change: response.data.jumlahPengeluaran,
        isHover: false,
      },
      {
        key: "user",
        icon: "ri-user-line",
        color: "info",
        title: "User",
        value: response.data.jumlahUser,
        change: response.data.jumlahUser,
        isHover: false,
      },
    ]
  } else {
    showSnackbar({
      text: response.message,
      color: "error",
    })
  }
}

const goToDetail = data => {
  const target = detailRoutes[data.key]

  if (target) {
    router.push(target)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <VRow>
    <VCol
      v-for="data in filteredLogisticData"
      :key="data.key"
      cols="12"
      md="3"
      sm="6"
    >
      <div>
        <VCard
          class="logistics-card-statistics cursor-pointer"
          :style="
            data.isHover
              ? `border-block-end-color: rgb(var(--v-theme-${data.color}))`
              : `border-block-end-color: rgba(var(--v-theme-${data.color}),0.38)`
          "
          @mouseenter="data.isHover = true"
          @mouseleave="data.isHover = false"
          @click="goToDetail(data)"
        >
          <VCardText>
            <VSkeletonLoader
              v-if="isLoading"
              type="paragraph"
            />
            <template v-else>
              <div class="dashboard-stat-content d-flex align-center gap-x-4 mb-2 min-w-0">
                <VAvatar
                  variant="tonal"
                  :color="data.color"
                  rounded="lg"
                >
                  <VIcon
                    :icon="data.icon"
                    size="24"
                  />
                </VAvatar>
                <div class="dashboard-stat-value">
                  <div
                    v-if="data.currencies?.length"
                    class="dashboard-currency-list"
                    :title="data.value"
                  >
                    <div
                      v-for="currency in data.currencies"
                      :key="currency.key"
                      class="dashboard-currency-row"
                    >
                      <span class="dashboard-currency-code">{{ currency.kode }}</span>
                      <strong class="dashboard-currency-amount">{{ currency.amount }}</strong>
                    </div>
                  </div>
                  <h4
                    v-else
                    class="text-h4 text-truncate"
                    :title="data.value"
                  >
                    {{ data.value }}
                  </h4>
                </div>
              </div>
              <h6 class="text-h6 font-weight-regular">
                {{ data.title }}
              </h6>
              <div class="d-flex align-center">
                <div class="text-body-1 font-weight-medium me-2">
                  {{ data.change }}
                </div>
                <span class="text-sm text-disabled">Total Data</span>
              </div>
            </template>
          </VCardText>
        </VCard>
      </div>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
@use "@core/scss/base/mixins" as mixins;

.logistics-card-statistics {
  border-block-end-style: solid;
  border-block-end-width: 2px;
  min-block-size: 154px;

  &:hover {
    border-block-end-width: 3px;
    margin-block-end: -1px;

    @include mixins.elevation(10);

    transition: all 0.1s ease-out;
  }
}

.dashboard-stat-content {
  min-inline-size: 0;
  overflow: hidden;
}

.dashboard-stat-content .v-avatar {
  flex: 0 0 auto;
}

.dashboard-stat-value {
  flex: 1 1 auto;
  min-inline-size: 0;
  overflow: hidden;
}

.dashboard-currency-list {
  display: grid;
  gap: 2px;
  min-inline-size: 0;
}

.dashboard-currency-row {
  display: grid;
  align-items: baseline;
  gap: 8px;
  grid-template-columns: 34px minmax(0, 1fr);
}

.dashboard-currency-code {
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  font-size: 0.7rem;
  font-weight: 700;
}

.dashboard-currency-amount {
  font-size: clamp(0.86rem, 1.12vw, 1.15rem);
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.skin--bordered {
  .logistics-card-statistics {
    &:hover {
      margin-block-end: -2px;
    }
  }
}
</style>
