<script setup>
import { formatMoney } from "@/composables/formatRupiah"
import { showSnackbar } from "@/composables/snackbar"
import { computed, onMounted, ref, watch } from "vue"

const route = useRoute()
const router = useRouter()

// Params dari query string
const category = computed(() => route.query.category || "SPP")

// ===== FILTER =====
const thAkademikList = ref([])
const prodiList = ref([])
const mataUangList = ref([])

const selectedThAkademik = ref(route.query.th_akademik_id ? Number(route.query.th_akademik_id) : null)
const selectedProdi = ref(route.query.prodi_id ? Number(route.query.prodi_id) : null)
const selectedJk = ref(route.query.jk_id ? Number(route.query.jk_id) : null)
const selectedCurrency = ref(String(route.query.mata_uang_kode || "IDR").toUpperCase())

const activeMataUang = ref({
  kode: selectedCurrency.value,
  simbol: selectedCurrency.value === "IDR" ? "Rp" : selectedCurrency.value,
})

const fetchThAkademik = async () => {
  try {
    const { data } = await $api("/admin/th-akademik", {
      method: "GET",
      body: { limit: 0, sort_key: "kode", sort_order: "desc" },
    })

    thAkademikList.value = (data.data || []).map(i => ({
      title: `${i.nama} - ${i.semester}`,
      value: i.id,
    }))
  } catch (e) {
    console.error(e)
  }
}

const fetchProdi = async () => {
  try {
    const { data } = await $api("/admin/prodi", {
      method: "GET",
      body: { limit: 0, sort_key: "kode", sort_order: "desc" },
    })

    prodiList.value = (data.data || []).map(i => ({
      title: i.nama,
      value: i.id,
    }))
  } catch (e) {
    console.error(e)
  }
}

const fetchMataUang = async () => {
  try {
    const response = await $api("/admin/mata-uang?limit=0&aktif=1&sort_key=kode&sort_order=asc")
    const items = response.data?.data || []

    mataUangList.value = items.map(item => ({
      title: `${item.kode} - ${item.nama}`,
      value: String(item.kode).toUpperCase(),
    }))
  } catch (e) {
    console.error(e)
  }
}

const jkList = [
  { title: "Laki-laki", value: 8 },
  { title: "Perempuan", value: 9 },
]

// Watch filter changes -> refetch
watch([selectedThAkademik, selectedProdi, selectedJk, selectedCurrency], () => {
  fetchDetail()
})

// Tabs
const tabs = [
  { value: "detail", label: "Per Tagihan" },
  { value: "semester", label: "Per Semester" },
  { value: "prodi", label: "Per Prodi" },
  { value: "bulan", label: "Per Bulan" },
  { value: "tahun", label: "Per Tahun" },
]

const activeTab = ref("detail")

// Data
const isLoading = ref(false)
const detailData = ref([])
const totalAmount = ref(0)
const totalLakiLaki = ref(0)
const totalPerempuan = ref(0)

const money = amount => formatMoney(amount, activeMataUang.value)

const paymentMethodColor = jenisKelamin => {
  const value = String(jenisKelamin || "").toLowerCase()
  if (value.includes("putra") || value.includes("laki")) return "primary"
  if (value.includes("putri") || value.includes("perempuan")) return "error"
  
  return "secondary"
}

const fetchDetail = async () => {
  isLoading.value = true

  const params = {
    category: category.value,
    group_by: activeTab.value,
    mata_uang_kode: selectedCurrency.value,
  }

  if (selectedThAkademik.value) params.th_akademik_id = selectedThAkademik.value
  if (selectedProdi.value) params.prodi_id = selectedProdi.value
  if (selectedJk.value) params.jk_id = selectedJk.value

  const queryString = new URLSearchParams(params).toString()
  const url = `/admin/dashboard/finance-overview-detail?${queryString}`

  try {
    const response = await $api(url)

    isLoading.value = false

    if (!response.status) {
      showSnackbar({ text: response.message, color: "error" })
      
      return
    }

    detailData.value = (response.data || []).map(row => ({
      ...row,
      amount: Number(row.amount || 0),
      laki_laki: Number(row.laki_laki || 0),
      perempuan: Number(row.perempuan || 0),
      payment_methods: (row.payment_methods || []).map(method => ({
        ...method,
        amount: Number(method.amount || 0),
        laki_laki: Number(method.laki_laki || 0),
        perempuan: Number(method.perempuan || 0),
      })),
    }))
    totalAmount.value = Number(response.total || 0)
    totalLakiLaki.value = Number(response.total_laki_laki || 0)
    totalPerempuan.value = Number(response.total_perempuan || 0)
    activeMataUang.value = response.mata_uang || activeMataUang.value
  } catch (err) {
    isLoading.value = false
    showSnackbar({ text: "Gagal memuat data", color: "error" })
  }
}

watch(activeTab, () => fetchDetail())

onMounted(() => {
  document.title = `Detail ${category.value} - SIMKEU`
  fetchThAkademik()
  fetchProdi()
  fetchMataUang()
  fetchDetail()
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <template #prepend>
            <VBtn
              icon
              variant="text"
              size="small"
              @click="router.push('/admin/dashboard')"
            >
              <VIcon icon="ri-arrow-left-line" />
            </VBtn>
          </template>

          <VCardTitle class="text-h5">
            Detail Pemasukan: {{ category }}
          </VCardTitle>
          <VCardSubtitle>
            {{ selectedCurrency }}:
            Total {{ money(totalAmount) }} |
            Laki-laki {{ money(totalLakiLaki) }} |
            Perempuan {{ money(totalPerempuan) }}
          </VCardSubtitle>
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
                :items="mataUangList"
                label="Mata Uang"
                density="compact"
                hide-details
              />
            </VCol>
          </VRow>

          <!-- Tabs -->
          <VTabs
            v-model="activeTab"
            class="mb-6"
          >
            <VTab
              v-for="tab in tabs"
              :key="tab.value"
              :value="tab.value"
            >
              {{ tab.label }}
            </VTab>
          </VTabs>

          <!-- Loading -->
          <VSkeletonLoader
            v-if="isLoading"
            type="table-heading, table-tbody"
          />

          <!-- Data Table -->
          <VTable
            v-else
            class="text-no-wrap"
          >
            <thead>
              <tr>
                <th>No</th>
                <th>{{ activeTab === 'detail' ? 'Nama Tagihan' : activeTab === 'semester' ? 'Semester' : activeTab === 'prodi' ? 'Prodi' : activeTab === 'bulan' ? 'Bulan' : 'Tahun' }}</th>
                <th>Laki-laki</th>
                <th>Perempuan</th>
                <th>Jenis Pembayaran</th>
                <th>Jumlah</th>
                <th>Persentase</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="detailData.length === 0">
                <td
                  colspan="7"
                  class="text-center text-disabled py-8"
                >
                  Tidak ada data
                </td>
              </tr>
              <tr
                v-for="(row, idx) in detailData"
                :key="idx"
              >
                <td>{{ idx + 1 }}</td>
                <td>
                  <span class="font-weight-medium">{{ row.label }}</span>
                </td>
                <td>
                  <span class="font-weight-medium">{{ money(row.laki_laki || 0) }}</span>
                </td>
                <td>
                  <span class="font-weight-medium">{{ money(row.perempuan || 0) }}</span>
                </td>
                <td style="min-inline-size: 280px;">
                  <div
                    v-if="row.payment_methods?.length"
                    class="d-flex flex-column gap-y-1"
                  >
                    <div
                      v-for="(method, methodIdx) in row.payment_methods"
                      :key="methodIdx"
                      class="payment-method-row"
                    >
                      <div
                        class="d-flex align-center gap-x-2"
                        style="min-inline-size: 0;"
                      >
                        <VChip
                          size="x-small"
                          label
                          :color="paymentMethodColor(method.jenis_kelamin)"
                        >
                          {{ method.jenis_kelamin || 'Semua' }}
                        </VChip>
                        <span class="text-body-2 text-truncate">
                          {{ method.nama || 'Lainnya' }}
                        </span>
                      </div>
                      <span class="text-body-2 font-weight-medium">
                        {{ money(method.amount || 0) }}
                      </span>
                    </div>
                  </div>
                  <span
                    v-else
                    class="text-disabled"
                  >-</span>
                </td>
                <td>
                  <span class="font-weight-medium">{{ money(row.amount) }}</span>
                </td>
                <td>
                  <div class="d-flex align-center gap-2">
                    <VProgressLinear
                      :model-value="row.percent"
                      :color="row.percent > 50 ? 'primary' : row.percent > 20 ? 'info' : 'warning'"
                      height="6"
                      rounded
                      style="max-inline-size: 80px;"
                    />
                    <span class="text-body-2">{{ row.percent }}%</span>
                  </div>
                </td>
              </tr>

              <!-- Total -->
              <tr v-if="detailData.length > 0">
                <td />
                <td><strong>Total</strong></td>
                <td><strong>{{ money(totalLakiLaki) }}</strong></td>
                <td><strong>{{ money(totalPerempuan) }}</strong></td>
                <td />
                <td><strong>{{ money(totalAmount) }}</strong></td>
                <td><strong>100%</strong></td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.payment-method-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-inline-size: 0;
}
</style>
