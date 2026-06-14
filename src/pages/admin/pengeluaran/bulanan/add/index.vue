<script setup>
import FormPengeluaranDosenBulananBatch from "@/components/admin/pengeluaran/pegawai-bulanan/FormPengeluaranDosenBulananBatch.vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()

const returnPath = computed(() => {
  const value = Array.isArray(route.query.return_to)
    ? route.query.return_to[0]
    : route.query.return_to

  return typeof value === "string" && value.startsWith("/admin/pengeluaran/bulanan")
    ? value
    : "/admin/pengeluaran/bulanan"
})

onMounted(() => {
  document.title = "Tambah Barokah Bulanan - SIMKEU"
})
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      class="pb-0"
    >
      <VBtn
        variant="outlined"
        color="secondary"
        prepend-icon="ri-arrow-left-line"
        @click="router.push(returnPath)"
      >
        Kembali
      </VBtn>
    </VCol>

    <VCol cols="12">
      <FormPengeluaranDosenBulananBatch
        endpoint="/admin/pengeluaran/bulanan"
        base-path="/admin/pengeluaran/bulanan"
        title="Barokah Bulanan"
        pegawai-title="Pegawai"
      />
    </VCol>
  </VRow>
</template>
