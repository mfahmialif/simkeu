<script setup>
import FormPengeluaranDosenBulananBatch from "@/components/admin/pengeluaran/pegawai-bulanan/FormPengeluaranDosenBulananBatch.vue"
import { useRouter } from "vue-router"

const router = useRouter()

onMounted(() => {
  document.title = "Tambah Barokah Dosen Bulanan - SIMKEU"
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
        @click="router.push('/admin/pengeluaran/dosen-bulanan')"
      >
        Kembali
      </VBtn>
    </VCol>

    <VCol cols="12">
      <FormPengeluaranDosenBulananBatch
        endpoint="/admin/pengeluaran/dosen-bulanan"
        base-path="/admin/pengeluaran/dosen-bulanan"
      />
    </VCol>
  </VRow>
</template>
