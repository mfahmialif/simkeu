<script setup>
import { formatRupiah } from "@/composables/formatRupiah"
import { showSnackbar } from "@/composables/snackbar"
import { computed, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const saving = ref(false)
const detail = ref(null)
const form = ref({
  module_key: null,
  tanggal: new Date().toISOString().slice(0, 10),
  nominal: null,
  keterangan: "",
})

const modules = computed(() => detail.value?.modules || [])
const summary = computed(() => detail.value?.summary || {})
const adjustments = computed(() => detail.value?.adjustments || [])

const moduleRows = computed(() => {
  const moduleMap = summary.value?.modules || {}

  return modules.value.map(mod => ({
    ...mod,
    ...(moduleMap[mod.key] || {}),
  }))
})

const saldoColor = value => {
  if (value > 0) return "success"
  if (value < 0) return "error"

  return "secondary"
}

const fetchDetail = async () => {
  loading.value = true
  try {
    const response = await $api(`/admin/saldo/${route.params.id}`)

    detail.value = response.data
    if (!form.value.module_key && modules.value.length) {
      form.value.module_key = modules.value[0].key
    }
  } catch (error) {
    console.error(error)
    showSnackbar({ color: "error", text: "Gagal memuat detail saldo." })
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    module_key: form.value.module_key || modules.value[0]?.key || null,
    tanggal: new Date().toISOString().slice(0, 10),
    nominal: null,
    keterangan: "",
  }
}

const submitAdjustment = async () => {
  if (!form.value.module_key || !form.value.tanggal || !form.value.nominal || !form.value.keterangan) {
    showSnackbar({ color: "error", text: "Kategori, tanggal, nominal, dan keterangan wajib diisi." })

    return
  }

  saving.value = true
  try {
    await $api(`/admin/saldo/${route.params.id}/tambahan`, {
      method: "POST",
      body: {
        module_key: form.value.module_key,
        tanggal: form.value.tanggal,
        nominal: Number(form.value.nominal),
        keterangan: form.value.keterangan,
      },
    })

    showSnackbar({ color: "success", text: "Saldo tambahan berhasil ditambahkan." })
    resetForm()
    await fetchDetail()
  } catch (error) {
    console.error(error)
    showSnackbar({ color: "error", text: "Gagal menambahkan saldo." })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  document.title = "Detail Saldo Pengeluaran - SIMKEU"
  fetchDetail()
})
</script>

<template>
  <div>
    <div class="d-flex flex-wrap align-center justify-space-between gap-4 mb-6">
      <div>
        <VBtn
          variant="text"
          color="secondary"
          prepend-icon="ri-arrow-left-line"
          class="px-0 mb-2"
          @click="router.push('/admin/saldo')"
        >
          Kembali
        </VBtn>
        <h4 class="text-h4 font-weight-medium">Detail Saldo {{ summary.petugas_name || "-" }}</h4>
        <div class="text-body-1 text-medium-emphasis mt-1">Sumber saldo, tambahan saldo, dan total saldo akhir.</div>
      </div>

      <VBtn
        color="primary"
        prepend-icon="ri-refresh-line"
        :loading="loading"
        @click="fetchDetail"
      >
        Refresh
      </VBtn>
    </div>

    <div v-if="loading && !detail" class="text-center pa-10">
      <VProgressCircular indeterminate color="primary" class="mb-4" />
      <div class="text-body-1 text-medium-emphasis">Memuat detail saldo...</div>
    </div>

    <template v-else>
      <VRow class="mb-4">
        <VCol cols="12" md="4">
          <VCard>
            <VCardText>
              <div class="text-body-2 text-medium-emphasis mb-1">Saldo dari RAB - LPJ</div>
              <div class="text-h5 font-weight-medium">
                {{ formatRupiah((summary.total_saldo || 0) - (summary.total_tambahan || 0)) }}
              </div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="12" md="4">
          <VCard>
            <VCardText>
              <div class="text-body-2 text-medium-emphasis mb-1">Saldo Tambahan</div>
              <div class="text-h5 font-weight-medium text-success">
                {{ formatRupiah(summary.total_tambahan || 0) }}
              </div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="12" md="4">
          <VCard>
            <VCardText>
              <div class="text-body-2 text-medium-emphasis mb-1">Total Saldo</div>
              <div
                class="text-h5 font-weight-medium"
                :class="`text-${saldoColor(summary.total_saldo || 0)}`"
              >
                {{ formatRupiah(summary.total_saldo || 0) }}
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <VRow>
        <VCol cols="12" lg="8">
          <VCard class="mb-4">
            <VCardTitle>Sumber Saldo</VCardTitle>
            <VCardText>
              <VTable density="comfortable">
                <thead>
                  <tr>
                    <th>Kategori</th>
                    <th class="text-end">RAB</th>
                    <th class="text-end">LPJ</th>
                    <th class="text-end">Tambahan</th>
                    <th class="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in moduleRows" :key="row.key">
                    <td>{{ row.name }}</td>
                    <td class="text-end">{{ formatRupiah(row.total_rab || 0) }}</td>
                    <td class="text-end">{{ formatRupiah(row.total_lpj || 0) }}</td>
                    <td class="text-end text-success">{{ formatRupiah(row.tambahan || 0) }}</td>
                    <td
                      class="text-end font-weight-medium"
                      :class="`text-${saldoColor(row.saldo || 0)}`"
                    >
                      {{ formatRupiah(row.saldo || 0) }}
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </VCardText>
          </VCard>

          <VCard>
            <VCardTitle>Riwayat Saldo Tambahan</VCardTitle>
            <VCardText>
              <div v-if="adjustments.length === 0" class="text-body-2 text-medium-emphasis py-4">
                Belum ada saldo tambahan.
              </div>
              <VTable v-else density="comfortable">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Kategori</th>
                    <th>Keterangan</th>
                    <th class="text-end">Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in adjustments" :key="item.id">
                    <td>{{ item.tanggal }}</td>
                    <td>{{ item.module_name }}</td>
                    <td>{{ item.keterangan }}</td>
                    <td class="text-end text-success">{{ formatRupiah(item.nominal || 0) }}</td>
                  </tr>
                </tbody>
              </VTable>
            </VCardText>
          </VCard>
        </VCol>

        <VCol cols="12" lg="4">
          <VCard>
            <VCardTitle>Tambah Saldo</VCardTitle>
            <VCardText>
              <VForm @submit.prevent="submitAdjustment">
                <VSelect
                  v-model="form.module_key"
                  :items="modules"
                  item-title="name"
                  item-value="key"
                  label="Kategori"
                  class="mb-4"
                />
                <VTextField
                  v-model="form.tanggal"
                  type="date"
                  label="Tanggal"
                  class="mb-4"
                />
                <VTextField
                  v-model="form.nominal"
                  type="number"
                  min="1"
                  label="Nominal Tambahan"
                  prefix="Rp"
                  class="mb-4"
                />
                <VTextarea
                  v-model="form.keterangan"
                  label="Keterangan"
                  placeholder="Saldo awal, koreksi saldo, hibah, dll."
                  rows="4"
                  class="mb-4"
                />
                <VBtn
                  type="submit"
                  color="primary"
                  block
                  prepend-icon="ri-add-line"
                  :loading="saving"
                >
                  Tambah Saldo
                </VBtn>
              </VForm>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </template>
  </div>
</template>
