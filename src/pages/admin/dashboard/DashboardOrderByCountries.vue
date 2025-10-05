<script setup>
import { computed, ref } from 'vue'

const currentTab = ref(0)

const tabsData = ['Penerimaan', 'Pengeluaran', 'Piutang']

const moreList = [
  { title: 'Refresh', value: 'refresh' },
  { title: 'Update', value: 'update' },
  { title: 'Share', value: 'share' },
]

// formatter Rupiah
const toIDR = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

// ====== DATA CONTOH (gantikan dari API-mu) ======
const itemsByTab = [
  // Penerimaan
  [
    { type: 'Penerimaan', title: 'SPP - Gelombang 1', desc: 'Angkatan 2025/2026', date: '03 Okt 2025', amount: 75_000_000, icon: 'ri-wallet-3-line', color: 'success' },
    { type: 'Penerimaan', title: 'Registrasi Ulang', desc: 'Semester Ganjil', date: '02 Okt 2025', amount: 28_500_000, icon: 'ri-cash-line', color: 'primary' },
    { type: 'Penerimaan', title: 'Donasi Alumni', desc: 'Program Beasiswa', date: '01 Okt 2025', amount: 12_000_000, icon: 'ri-hand-coin-line', color: 'info' },
    { type: 'Penerimaan', title: 'Lainnya', desc: 'Denda keterlambatan', date: '30 Sep 2025', amount: 3_250_000, icon: 'ri-bank-card-line', color: 'secondary' },
  ],
  // Pengeluaran
  [
    { type: 'Pengeluaran', title: 'Belanja Operasional', desc: 'Listrik & Internet', date: '03 Okt 2025', amount: 14_750_000, icon: 'ri-exchange-dollar-line', color: 'error' },
    { type: 'Pengeluaran', title: 'Belanja Modal', desc: 'Perbaikan Lab', date: '02 Okt 2025', amount: 35_000_000, icon: 'ri-tools-line', color: 'error' },
    { type: 'Pengeluaran', title: 'Gaji & Honor', desc: 'Tenaga Pendidik', date: '30 Sep 2025', amount: 420_000_000, icon: 'ri-briefcase-4-line', color: 'error' },
    { type: 'Pengeluaran', title: 'Kegiatan Akademik', desc: 'Seminar & Workshop', date: '28 Sep 2025', amount: 9_800_000, icon: 'ri-calendar-event-line', color: 'warning' },
  ],
  // Piutang
  [
    { type: 'Piutang', title: 'SPP Tertunggak', desc: 'Angkatan 2024 (20 mhs)', date: 'Aging: 0–30 hari', amount: 62_000_000, icon: 'ri-notification-badge-line', color: 'warning' },
    { type: 'Piutang', title: 'SPP Tertunggak', desc: 'Angkatan 2023 (12 mhs)', date: 'Aging: 31–60 hari', amount: 38_500_000, icon: 'ri-notification-badge-line', color: 'warning' },
    { type: 'Piutang', title: 'Denda Belum Bayar', desc: 'Rekap September', date: 'Aging: 0–15 hari', amount: 4_200_000, icon: 'ri-error-warning-line', color: 'secondary' },
    { type: 'Piutang', title: 'Cicilan Registrasi', desc: 'Skema 3x cicilan', date: 'Jatuh tempo 10 Okt', amount: 21_750_000, icon: 'ri-timer-flash-line', color: 'info' },
  ],
]

// potong jadi dua kolom timeline (biar rapi seperti contohmu)
const splitForTwoColumns = arr => {
  const mid = Math.ceil(arr.length / 2)
  return [arr.slice(0, mid), arr.slice(mid)]
}

const columns = computed(() => splitForTwoColumns(itemsByTab[currentTab.value] || []))
</script>

<template>
  <VCard>
    <VCardItem title="Asal Transaksi Keuangan" subtitle="Aktivitas penerimaan, pengeluaran, dan piutang">
      <template #append>
        <MoreBtn class="mt-n5" :menu-list="moreList" />
      </template>
    </VCardItem>

    <VTabs v-model="currentTab" grow class="disable-tab-transition">
      <VTab v-for="(tab, index) in tabsData" :key="index">
        {{ tab }}
      </VTab>
    </VTabs>

    <VCardText>
      <VWindow v-model="currentTab">
        <!-- Satu VWindowItem per tab, dibangkitkan otomatis -->
        <VWindowItem v-for="(tab, tabIndex) in tabsData" :key="tabIndex" :value="tabIndex">
          <div>
            <!-- Kolom 1 -->
            <VTimeline align="start" truncate-line="both" side="end" density="compact" line-thickness="1"
              class="v-timeline--variant-outlined">
              <VTimelineItem v-for="(it, idx) in columns[0]" :key="`left-${idx}`"
                :icon="it.type === 'Pengeluaran' ? 'ri-arrow-down-circle-line' : 'ri-checkbox-circle-line'"
                dot-color="rgba(var(--v-theme-surface))" :icon-color="it.type === 'Pengeluaran' ? 'error' : it.color"
                fill-dot size="20" :elevation="0">
                <div class="text-caption text-uppercase" :class="[
                  it.type === 'Pengeluaran' ? 'text-error'
                    : it.type === 'Penerimaan' ? 'text-success'
                      : 'text-warning'
                ]">
                  {{ it.type }}
                </div>

                <div class="app-timeline-title d-flex justify-space-between">
                  <span>{{ it.title }}</span>
                  <strong>{{ toIDR(it.amount) }}</strong>
                </div>

                <div class="text-body-2 mb-1">
                  {{ it.desc }}
                </div>
                <div class="text-disabled text-caption">
                  <VIcon icon="ri-calendar-line" size="16" class="me-1" /> {{ it.date }}
                </div>
              </VTimelineItem>
            </VTimeline>

            <VDivider class="my-4" style="border-style: dashed;" />

            <!-- Kolom 2 -->
            <VTimeline align="start" truncate-line="both" side="end" density="compact" line-thickness="1"
              class="v-timeline--variant-outlined">
              <VTimelineItem v-for="(it, idx) in columns[1]" :key="`right-${idx}`"
                :icon="it.type === 'Pengeluaran' ? 'ri-arrow-down-circle-line' : 'ri-map-pin-line'"
                dot-color="rgba(var(--v-theme-surface))" :icon-color="it.type === 'Pengeluaran' ? 'error' : it.color"
                fill-dot size="20" :elevation="0">
                <div class="text-caption text-uppercase" :class="[
                  it.type === 'Pengeluaran' ? 'text-error'
                    : it.type === 'Penerimaan' ? 'text-success'
                      : 'text-warning'
                ]">
                  {{ it.type }}
                </div>

                <div class="app-timeline-title d-flex justify-space-between">
                  <span>{{ it.title }}</span>
                  <strong>{{ toIDR(it.amount) }}</strong>
                </div>

                <div class="text-body-2">
                  {{ it.desc }}
                </div>
                <div class="text-disabled text-caption">
                  <VIcon icon="ri-time-line" size="16" class="me-1" /> {{ it.date }}
                </div>
              </VTimelineItem>
            </VTimeline>
          </div>
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
</template>
