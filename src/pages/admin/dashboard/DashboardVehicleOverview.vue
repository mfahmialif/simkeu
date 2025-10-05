<script setup>
import { computed, ref } from 'vue'

/**
 * Data contoh: kategori penerimaan
 * - name: nama kategori
 * - amount: nominal (dalam rupiah)
 * - color: warna batang (pakai token Vuetify)
 * - icon: ikon finansial (Remix Icon)
 */
const rawFinanceData = ref([
  { icon: 'ri-wallet-3-line', name: 'SPP', amount: 125_000_000, color: { bg: 'rgb(var(--v-theme-primary))', text: 'rgb(var(--v-theme-on-primary))' } },
  { icon: 'ri-cash-line', name: 'Registrasi', amount: 80_000_000, color: { bg: 'rgb(var(--v-theme-info))', text: 'rgb(var(--v-theme-on-primary))' } },
  { icon: 'ri-hand-coin-line', name: 'Donasi', amount: 45_000_000, color: { bg: 'rgba(var(--v-theme-on-surface), var(--v-hover-opacity))', text: 'rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))' } },
])

// Hitung total & persentase
const totalAmount = computed(() => rawFinanceData.value.reduce((s, i) => s + i.amount, 0))

const financeData = computed(() => {
  const total = totalAmount.value || 1
  return rawFinanceData.value.map((i) => ({
    ...i,
    percentage: +((i.amount / total) * 100).toFixed(1),
  }))
})

// Format Rupiah sederhana
const toIDR = n =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const moreList = [
  { title: 'Bulan Ini', value: 'this-month' },
  { title: 'Triwulan Ini', value: 'this-quarter' },
  { title: 'Tahun Berjalan', value: 'ytd' },
]
</script>

<template>
  <VCard>
    <VCardItem :title="`Distribusi Penerimaan per Kategori`" :subtitle="`Total: ${toIDR(totalAmount)}`">
      <template #append>
        <MoreBtn :menu-list="moreList" />
      </template>
    </VCardItem>

    <VCardText>
      <!-- Progress gabungan per kategori -->
      <div class="d-flex mb-6">
        <div v-for="(item, index) in financeData" :key="item.name" :style="`inline-size: ${item.percentage}%;`">
          <div class="vehicle-progress-label position-relative mb-5 text-body-1 d-none d-sm-block">
            {{ item.name }}
          </div>

          <VProgressLinear :color="item.color.bg" model-value="100" height="46" :rounded-bar="false" :rounded="false"
            :class="index === 0 ? 'rounded-s-lg' : index === financeData.length - 1 ? 'rounded-e-lg' : ''">
            <p class="text-sm font-weight-medium mb-0" :style="`color: ${item.color.text}`">
              {{ item.percentage }}%
            </p>
          </VProgressLinear>
        </div>
      </div>

      <!-- Tabel rincian -->
      <VTable class="text-no-wrap">
        <tbody>
          <tr v-for="(row, idx) in financeData" :key="idx">
            <td width="50%" class="ps-0" style="block-size: 48px;">
              <div class="d-flex align-center text-high-emphasis">
                <VIcon :icon="row.icon" size="24" class="me-2" />
                <h6 class="text-h6 font-weight-regular">{{ row.name }}</h6>
              </div>
            </td>
            <td width="30%">
              <h6 class="text-h6">{{ toIDR(row.amount) }}</h6>
            </td>
            <td width="20%">
              <span class="text-body-1">{{ row.percentage }}%</span>
            </td>
          </tr>

          <!-- Baris total -->
          <tr>
            <td class="ps-0">
              <strong>Total</strong>
            </td>
            <td>
              <strong>{{ toIDR(totalAmount) }}</strong>
            </td>
            <td>
              <strong>100%</strong>
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.vehicle-progress-label {
  padding-block-end: 0.875rem;

  &::after {
    position: absolute;
    display: inline-block;
    background-color: rgba(var(--v-theme-on-surface), var(--v-border-opacity));
    block-size: 10px;
    content: "";
    inline-size: 2px;
    inset-block-end: 0;
    inset-inline-start: 0;

    [dir="rtl"] & {
      inset-inline: unset 0;
    }
  }
}
</style>

<style lang="scss">
.v-progress-linear__content {
  justify-content: start;
  padding-inline-start: 1rem;
}

@media (max-width: 1080px) {
  .v-progress-linear__content {
    padding-inline-start: 0.75rem !important;
  }
}

@media (max-width: 576px) {
  .v-progress-linear__content {
    padding-inline-start: 0.3rem !important;
  }
}
</style>
