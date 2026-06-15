<script setup>
import { formatCurrencyTotals, formatMoney } from "@/composables/formatRupiah"
import { showSnackbar } from "@/composables/snackbar"
import { useDashboardFilters } from "@/composables/dashboardFilters"
import { computed, onMounted, ref, watch } from "vue"

// Palette warna dan ikon untuk kategori dinamis
const colorPalette = [
  { bg: "rgb(var(--v-theme-primary))", text: "rgb(var(--v-theme-on-primary))" },
  { bg: "rgb(var(--v-theme-info))", text: "rgb(var(--v-theme-on-primary))" },
  { bg: "rgba(var(--v-theme-on-surface), var(--v-hover-opacity))", text: "rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))" },
]

const iconPalette = [
  "ri-wallet-3-line",
  "ri-cash-line",
  "ri-hand-coin-line",
  "ri-bank-card-line",
  "ri-money-dollar-circle-line",
  "ri-coins-line",
  "ri-exchange-funds-line",
  "ri-gift-line",
  "ri-file-list-3-line",
]

const rawFinanceData = ref([])
const totalsByCurrency = ref([])
const selectedCurrency = ref("IDR")

// ===== FILTER =====
const {
  thAkademikList,
  prodiList,
  loadDashboardFilters,
} = useDashboardFilters()

const selectedThAkademik = ref(null)
const selectedProdi = ref(null)
const selectedJk = ref(null)

const currencyOptions = computed(() =>
  totalsByCurrency.value.map(item => ({
    title: `${item.mata_uang?.kode || "IDR"} - ${item.mata_uang?.nama || "Rupiah"}`,
    value: String(item.mata_uang?.kode || "IDR").toUpperCase(),
  })),
)

const selectedCurrencyTotal = computed(() =>
  totalsByCurrency.value.find(
    item =>
      String(item.mata_uang?.kode || "IDR").toUpperCase() === selectedCurrency.value,
  ),
)

const selectedMataUang = computed(
  () => selectedCurrencyTotal.value?.mata_uang || {
    kode: selectedCurrency.value,
    simbol: selectedCurrency.value === "IDR" ? "Rp" : selectedCurrency.value,
  },
)

const jkList = [
  { title: "Laki-laki", value: 8 },
  { title: "Perempuan", value: 9 },
]

// Watch filter changes -> refetch
watch([selectedThAkademik, selectedProdi, selectedJk], () => {
  fetchData()
})

// ===== DATA =====
const totalAmount = computed(() => Number(selectedCurrencyTotal.value?.total || 0))
const totalLakiLaki = computed(() => Number(selectedCurrencyTotal.value?.laki_laki || 0))
const totalPerempuan = computed(() => Number(selectedCurrencyTotal.value?.perempuan || 0))
const totalSummary = computed(() => formatCurrencyTotals(totalsByCurrency.value))
const money = amount => formatMoney(amount, selectedMataUang.value)

const allFinanceData = computed(() => {
  const total = totalAmount.value || 1
  
  return rawFinanceData.value
    .map(item => {
      const currency = item.by_currency.find(
        row =>
          String(row.mata_uang?.kode || "IDR").toUpperCase() === selectedCurrency.value,
      )

      return {
        name: item.name,
        amount: Number(currency?.amount || 0),
        laki_laki: Number(currency?.laki_laki || 0),
        perempuan: Number(currency?.perempuan || 0),
        percentage: Number(currency?.percent ?? 0),
      }
    })
    .filter(item => item.amount > 0)
    .sort((left, right) => right.amount - left.amount)
    .map((item, index) => ({
      ...item,
      icon: iconPalette[index % iconPalette.length],
      color: colorPalette[Math.min(index, colorPalette.length - 1)],
      percentage: item.percentage || +((item.amount / total) * 100).toFixed(1),
    }))
})

// Data untuk card: top 2 + Lainnya
const financeData = computed(() => {
  const total = totalAmount.value || 1
  const all = allFinanceData.value

  if (all.length <= 3) return all

  const top2 = all.slice(0, 2)

  const lainnyaAmount = all.slice(2).reduce((s, i) => s + i.amount, 0)
  const lainnyaLakiLaki = all.slice(2).reduce((s, i) => s + (i.laki_laki || 0), 0)
  const lainnyaPerempuan = all.slice(2).reduce((s, i) => s + (i.perempuan || 0), 0)

  const lainnya = {
    icon: "ri-more-line",
    name: "Lainnya",
    amount: lainnyaAmount,
    laki_laki: lainnyaLakiLaki,
    perempuan: lainnyaPerempuan,
    color: colorPalette[2],
    percentage: +((lainnyaAmount / total) * 100).toFixed(1),
    isLainnya: true,
  }

  return [...top2, lainnya]
})

const lainnyaDetails = computed(() => allFinanceData.value.slice(2))

// Modal state
const showLainnyaModal = ref(false)

// Router untuk navigasi ke detail
const router = useRouter()

const goToDetail = (category = null) => {
  const query = {}
  if (category) query.category = category
  if (selectedThAkademik.value) query.th_akademik_id = selectedThAkademik.value
  if (selectedProdi.value) query.prodi_id = selectedProdi.value
  if (selectedJk.value) query.jk_id = selectedJk.value
  query.mata_uang_kode = selectedCurrency.value
  router.push({ path: '/admin/dashboard/finance-detail', query })
}

const handleRowAction = row => {
  if (row.isLainnya) {
    showLainnyaModal.value = true
  } else {
    goToDetail(row.name)
  }
}

const openModalRowDetail = row => {
  showLainnyaModal.value = false
  goToDetail(row.name)
}

const isLoading = ref(false)

const fetchData = async () => {
  isLoading.value = true

  // Build query params
  const params = {}
  if (selectedThAkademik.value) params.th_akademik_id = selectedThAkademik.value
  if (selectedProdi.value) params.prodi_id = selectedProdi.value
  if (selectedJk.value) params.jk_id = selectedJk.value

  const queryString = new URLSearchParams(params).toString()
  const url = `/admin/dashboard/finance-overview${queryString ? '?' + queryString : ''}`

  const response = await $api(url)

  isLoading.value = false
  if (!response.status) {
    showSnackbar({
      text: response.message,
      color: "error",
    })
    
    return
  }

  totalsByCurrency.value = (response.totals_by_currency || []).map(item => ({
    ...item,
    total: Number(item.total || 0),
    laki_laki: Number(item.laki_laki || 0),
    perempuan: Number(item.perempuan || 0),
  }))
  rawFinanceData.value = (response.data || []).map(item => ({
    name: item.name,
    by_currency: (item.by_currency || []).map(currency => ({
      ...currency,
      amount: Number(currency.amount || 0),
      laki_laki: Number(currency.laki_laki || 0),
      perempuan: Number(currency.perempuan || 0),
      percent: Number(currency.percent || 0),
    })),
  }))

  if (!currencyOptions.value.some(item => item.value === selectedCurrency.value)) {
    selectedCurrency.value =
      currencyOptions.value.find(item => item.value === "IDR")?.value
      || currencyOptions.value[0]?.value
      || "IDR"
  }
}

onMounted(() => {
  loadDashboardFilters()
  fetchData()
})
</script>

<template>
  <VCard>
    <VSkeletonLoader
      v-if="isLoading"
      type="card, list-item, paragraph, paragraph"
    />
    <template v-else>
      <VCardItem
        title="Distribusi Pemasukan Keuangan UII Dalwa"
        :subtitle="`Total semua mata uang: ${totalSummary}`"
      >
        <template #append>
          <VBtn
            icon
            size="small"
            variant="tonal"
            color="primary"
            aria-label="Lihat detail distribusi pemasukan"
            @click="goToDetail"
          >
            <VIcon
              icon="ri-arrow-right-up-line"
              size="18"
            />
          </VBtn>
        </template>
      </VCardItem>

      <VCardText>
        <!-- Filter -->
        <VRow class="mb-4">
          <VCol
            cols="12"
            sm="6"
            lg="3"
          >
            <VSelect
              v-model="selectedThAkademik"
              :items="thAkademikList"
              label="Tahun Akademik"
              placeholder="Semua"
              clearable
              density="compact"
              hide-details
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            lg="3"
          >
            <VSelect
              v-model="selectedProdi"
              :items="prodiList"
              label="Prodi"
              placeholder="Semua"
              clearable
              density="compact"
              hide-details
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            lg="3"
          >
            <VSelect
              v-model="selectedJk"
              :items="jkList"
              label="Jenis Kelamin"
              placeholder="Semua"
              clearable
              density="compact"
              hide-details
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            lg="3"
          >
            <VSelect
              v-model="selectedCurrency"
              :items="currencyOptions"
              label="Mata Uang"
              density="compact"
              hide-details
              :disabled="currencyOptions.length <= 1"
            />
          </VCol>
        </VRow>

        <div class="text-body-2 text-medium-emphasis mb-4">
          Perhitungan {{ selectedCurrency }}:
          Laki-laki <strong>{{ money(totalLakiLaki) }}</strong>,
          Perempuan <strong>{{ money(totalPerempuan) }}</strong>
        </div>

        <!-- Progress gabungan per kategori -->
        <div class="finance-progress-wrapper mb-6">
          <!-- Labels di atas bar -->
          <div class="d-flex mb-2">
            <div
              v-for="item in financeData"
              :key="'label-' + item.name"
              :style="`flex: ${Math.max(item.percentage, 8)} 0 0%;`"
              class="d-none d-sm-block"
            >
              <span
                v-if="item.percentage >= 15"
                class="text-body-2 text-medium-emphasis"
              >
                {{ item.name }}
              </span>
            </div>
          </div>

          <!-- Bar gabungan -->
          <div
            class="finance-progress-bar d-flex rounded-lg overflow-hidden"
            style="block-size: 46px;"
          >
            <div
              v-for="(item, index) in financeData"
              :key="'bar-' + item.name"
              class="finance-progress-segment d-flex align-center"
              :style="{
                backgroundColor: item.color.bg,
                flex: `${Math.max(item.percentage, 8)} 0 0%`,
                paddingInlineStart: '12px',
              }"
            >
              <span
                v-if="item.percentage >= 10"
                class="text-sm font-weight-medium"
                :style="`color: ${item.color.text}; white-space: nowrap;`"
              >
                {{ item.percentage }}%
              </span>
            </div>
          </div>

          <!-- Legend di bawah bar pada mobile -->
          <div class="d-flex d-sm-none flex-wrap gap-3 mt-3">
            <div
              v-for="item in financeData"
              :key="'legend-' + item.name"
              class="d-flex align-center gap-2"
            >
              <div
                class="rounded-circle"
                :style="`background-color: ${item.color.bg}; block-size: 10px; inline-size: 10px;`"
              />
              <span class="text-caption text-medium-emphasis">
                {{ item.name }} ({{ item.percentage }}%)
              </span>
            </div>
          </div>
        </div>

        <!-- Tabel rincian -->
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th class="ps-0">
                Jenis Tagihan
              </th>
              <th>Laki-laki</th>
              <th>Perempuan</th>
              <th>Jumlah</th>
              <th>Persentase</th>
              <th class="text-end">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, idx) in financeData"
              :key="idx"
            >
              <td
                width="40%"
                class="ps-0"
                style="block-size: 48px"
              >
                <div class="d-flex align-center text-high-emphasis">
                  <VIcon
                    :icon="row.icon"
                    size="24"
                    class="me-2"
                  />
                  <h6 class="text-h6 font-weight-regular">
                    {{ row.name }}
                  </h6>
                </div>
              </td>
              <td width="15%">
                <span class="text-body-2">{{ money(row.laki_laki || 0) }}</span>
              </td>
              <td width="15%">
                <span class="text-body-2">{{ money(row.perempuan || 0) }}</span>
              </td>
              <td width="20%">
                <h6 class="text-h6">
                  {{ money(row.amount) }}
                </h6>
              </td>
              <td width="10%">
                <span class="text-body-1">{{ row.percentage }}%</span>
              </td>
              <td class="text-end">
                <VBtn
                  icon
                  size="small"
                  variant="tonal"
                  :color="row.isLainnya ? 'secondary' : 'primary'"
                  aria-label="Lihat detail jenis tagihan"
                  @click="handleRowAction(row)"
                >
                  <VIcon
                    :icon="row.isLainnya ? 'ri-eye-line' : 'ri-arrow-right-up-line'"
                    size="18"
                  />
                </VBtn>
              </td>
            </tr>

            <!-- Baris total -->
            <tr>
              <td class="ps-0">
                <strong>Total</strong>
              </td>
              <td>
                <strong>{{ money(totalLakiLaki) }}</strong>
              </td>
              <td>
                <strong>{{ money(totalPerempuan) }}</strong>
              </td>
              <td>
                <strong>{{ money(totalAmount) }}</strong>
              </td>
              <td>
                <strong>100%</strong>
              </td>
              <td />
            </tr>
          </tbody>
        </VTable>
      </VCardText>
    </template>
  </VCard>

  <!-- Modal detail Lainnya -->
  <VDialog
    v-model="showLainnyaModal"
    max-width="900"
  >
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between pa-4">
        <span>Detail Pemasukan Lainnya</span>
        <VBtn
          icon
          variant="text"
          size="small"
          @click="showLainnyaModal = false"
        >
          <VIcon icon="ri-close-line" />
        </VBtn>
      </VCardTitle>
      <VDivider />
      <VCardText>
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th class="ps-0">
                Jenis Tagihan
              </th>
              <th>Laki-laki</th>
              <th>Perempuan</th>
              <th>Jumlah</th>
              <th>Persentase</th>
              <th class="text-end">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, idx) in lainnyaDetails"
              :key="idx"
            >
              <td
                class="ps-0"
                style="block-size: 48px"
              >
                <div class="d-flex align-center text-high-emphasis">
                  <VIcon
                    :icon="row.icon"
                    size="24"
                    class="me-2"
                  />
                  <span class="text-body-1 font-weight-medium">
                    {{ row.name }}
                  </span>
                </div>
              </td>
              <td>
                <span class="text-body-1 font-weight-medium">{{ money(row.laki_laki || 0) }}</span>
              </td>
              <td>
                <span class="text-body-1 font-weight-medium">{{ money(row.perempuan || 0) }}</span>
              </td>
              <td>
                <span class="text-body-1 font-weight-medium">{{ money(row.amount) }}</span>
              </td>
              <td>
                <span class="text-body-1">{{ row.percentage }}%</span>
              </td>
              <td class="text-end">
                <VBtn
                  icon
                  size="small"
                  variant="tonal"
                  color="primary"
                  aria-label="Lihat detail jenis tagihan"
                  @click="openModalRowDetail(row)"
                >
                  <VIcon
                    icon="ri-arrow-right-up-line"
                    size="18"
                  />
                </VBtn>
              </td>
            </tr>

            <!-- Total Lainnya -->
            <tr>
              <td class="ps-0">
                <strong>Total Lainnya</strong>
              </td>
              <td>
                <strong>{{ money(lainnyaDetails.reduce((s, i) => s + (i.laki_laki || 0), 0)) }}</strong>
              </td>
              <td>
                <strong>{{ money(lainnyaDetails.reduce((s, i) => s + (i.perempuan || 0), 0)) }}</strong>
              </td>
              <td>
                <strong>{{ money(lainnyaDetails.reduce((s, i) => s + i.amount, 0)) }}</strong>
              </td>
              <td>
                <strong>{{ lainnyaDetails.reduce((s, i) => s + i.percentage, 0).toFixed(1) }}%</strong>
              </td>
              <td />
            </tr>
          </tbody>
        </VTable>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.finance-progress-segment {
  transition: opacity 0.2s ease;

  &:not(:last-child) {
    border-inline-end: 2px solid rgba(var(--v-theme-surface), 0.8);
  }
}
</style>
