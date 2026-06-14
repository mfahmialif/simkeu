<script setup>
import { formatRupiah } from "@/composables/formatRupiah"
import { computed, onMounted, ref, watch } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const loading = ref(true)
const items = ref([])
const search = ref("")
const page = ref(1)
const itemsPerPage = 12

const modulesList = [
  { key: "tatap_muka", name: "Tatap Muka" },
  { key: "kegiatan", name: "Kegiatan" },
  { key: "rumah_tangga", name: "Rumah Tangga" },
  { key: "sarana_prasarana", name: "Sarana Prasarana" },
  { key: "transportasi", name: "Transportasi" },
  { key: "dosen_bulanan", name: "Bulanan" },
  { key: "hutang", name: "Hutang" },
]

const getSaldo = (item, key) => {
  return (item?.raw?.modules?.[key]?.saldo ?? item?.modules?.[key]?.saldo) || 0
}

const getTotalSaldo = item => {
  return (item?.raw?.total_saldo ?? item?.total_saldo) || 0
}

const getTambahan = (item, key) => {
  return (item?.raw?.modules?.[key]?.tambahan ?? item?.modules?.[key]?.tambahan) || 0
}

const getTotalTambahan = item => {
  return (item?.raw?.total_tambahan ?? item?.total_tambahan) || 0
}

const hasNonZeroSaldo = (item, key) => {
  return getSaldo(item, key) !== 0
}

const hasAnySaldo = item => {
  return modulesList.some(mod => hasNonZeroSaldo(item, mod.key))
}

const saldoColor = value => {
  if (value > 0) return "success"
  if (value < 0) return "error"

  return "secondary"
}

const fetchData = async () => {
  loading.value = true
  try {
    const response = await $api("/admin/saldo")

    items.value = response.data || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  document.title = "Rekap Saldo Pengeluaran - SIMKEU"
  fetchData()
})

const filteredItems = computed(() => {
  let data = items.value.filter(item => hasAnySaldo(item))

  if (search.value) {
    const query = search.value.toLowerCase()
    
    data = data.filter(item => item.petugas_name?.toLowerCase().includes(query))
  }

  return data
})

const pageCount = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage))

const paginatedItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  
  return filteredItems.value.slice(start, end)
})

watch(search, () => {
  page.value = 1
})

const openDetail = item => {
  router.push(`/admin/saldo/${item.petugas_id}`)
}
</script>

<template>
  <div>
    <div class="d-flex flex-wrap align-center justify-space-between gap-4 mb-6">
      <div>
        <h4 class="text-h4 font-weight-medium">Rekap Saldo Pegawai</h4>
        <div class="text-body-1 text-medium-emphasis mt-1">Daftar saldo aktif dari seluruh modul saldo</div>
      </div>
      
      <div class="d-flex gap-4 align-center">
        <VTextField
          v-model="search"
          prepend-inner-icon="ri-search-line"
          placeholder="Cari Pegawai..."
          density="compact"
          hide-details
          bg-color="surface"
          style="width: 250px; border-radius: 8px;"
        />
        <VBtn
          color="primary"
          prepend-icon="ri-refresh-line"
          :loading="loading"
          @click="fetchData"
        >
          Refresh
        </VBtn>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && items.length === 0" class="text-center pa-10">
      <VProgressCircular indeterminate color="primary" class="mb-4" />
      <div class="text-body-1 text-medium-emphasis">Memuat data saldo...</div>
    </div>

    <!-- Empty State -->
    <VCard v-else-if="filteredItems.length === 0" class="text-center pa-10">
      <VIcon icon="ri-wallet-3-line" size="48" color="secondary" class="mb-4 opacity-50" />
      <div class="text-h6 text-medium-emphasis">Tidak ada data saldo aktif</div>
      <div class="text-body-2 text-disabled mt-2">Semua saldo saat ini kosong atau telah di-filter.</div>
    </VCard>

    <!-- List Layout -->
    <template v-else>
      <VRow>
        <VCol
          v-for="item in paginatedItems"
          :key="item.petugas_id"
          cols="12"
          md="6"
          lg="4"
        >
          <VCard
            class="h-100 modern-saldo-card border"
            variant="flat"
            role="button"
            tabindex="0"
            @click="openDetail(item)"
            @keyup.enter="openDetail(item)"
          >
            <VCardItem class="pb-3">
              <template #prepend>
                <VAvatar
                  color="primary"
                  variant="tonal"
                  rounded
                  size="48"
                  class="me-3"
                >
                  <span class="text-h6 font-weight-medium">
                    {{ item.petugas_name?.charAt(0)?.toUpperCase() }}
                  </span>
                </VAvatar>
              </template>
              
              <VCardTitle class="text-h6">{{ item.petugas_name }}</VCardTitle>
              <VCardSubtitle>Klik untuk detail saldo</VCardSubtitle>
            </VCardItem>
            
            <VDivider class="mx-4 mb-3" />
            
            <VCardText class="pt-0">
              <div class="d-flex flex-column gap-2">
                <template
                  v-for="mod in modulesList"
                  :key="mod.key"
                >
                  <div
                    v-if="hasNonZeroSaldo(item, mod.key)"
                    class="d-flex justify-space-between align-center"
                  >
                    <span class="text-body-2 text-medium-emphasis d-flex align-center gap-2">
                      <VIcon icon="ri-money-dollar-circle-line" size="16" />
                      {{ mod.name }}
                    </span>
                    <div class="text-end">
                      <span
                        class="text-body-2 font-weight-medium"
                        :class="`text-${saldoColor(getSaldo(item, mod.key))}`"
                      >
                        {{ formatRupiah(getSaldo(item, mod.key)) }}
                      </span>
                      <div
                        v-if="getTambahan(item, mod.key)"
                        class="text-caption text-success"
                      >
                        Tambahan {{ formatRupiah(getTambahan(item, mod.key)) }}
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </VCardText>

            <VCardText class="bg-var-theme-background pa-4 mt-auto rounded-b-md border-t">
              <div
                v-if="getTotalTambahan(item)"
                class="d-flex justify-space-between align-center mb-2"
              >
                <span class="text-body-2 text-medium-emphasis">Total Tambahan</span>
                <span class="text-body-2 font-weight-medium text-success">
                  {{ formatRupiah(getTotalTambahan(item)) }}
                </span>
              </div>
              <div class="d-flex justify-space-between align-center">
                <span class="font-weight-medium">Total Saldo</span>
                <VChip
                  :color="saldoColor(getTotalSaldo(item))"
                  size="small"
                  class="font-weight-bold"
                  variant="elevated"
                >
                  {{ formatRupiah(getTotalSaldo(item)) }}
                </VChip>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Pagination -->
      <div v-if="pageCount > 1" class="d-flex justify-end mt-6">
        <VPagination
          v-model="page"
          :length="pageCount"
          total-visible="5"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.modern-saldo-card {
  cursor: pointer;
  transition: all 0.3s ease;
}
.modern-saldo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 18px -4px rgba(var(--v-theme-primary), 0.1) !important;
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
}
</style>
