<script setup>
import FormAbsensiBatch from "@/components/admin/pengeluaran/absensi/FormAbsensiBatch.vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()

const returnPath = computed(() => {
  const value = Array.isArray(route.query.return_to)
    ? route.query.return_to[0]
    : route.query.return_to

  return typeof value === "string" && value.startsWith("/admin/pengeluaran/absensi")
    ? value
    : "/admin/pengeluaran/absensi"
})

onMounted(() => {
  document.title = "Tambah Barokah Absensi - SIMKEU"
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
      <FormAbsensiBatch
        endpoint="/admin/pengeluaran/absensi"
        base-path="/admin/pengeluaran/absensi"
        title="Barokah Absensi"
        pegawai-title="Pegawai"
      />
    </VCol>
  </VRow>
</template>
