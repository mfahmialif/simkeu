<script setup>
import WebAbsensiData from "@/components/admin/pengeluaran/absensi/WebAbsensiData.vue"
import { useRouter } from "vue-router"
import { onMounted } from "vue"

const router = useRouter()

onMounted(() => {
  document.title = "Data & Rekap Web Absensi - SIMKEU"
})
</script>

<template>
  <VRow>
    <!-- Header & Navigation -->
    <VCol cols="12" class="pb-1">
      <VBtn
        variant="outlined"
        color="secondary"
        prepend-icon="ri-arrow-left-line"
        class="mb-4"
        @click="router.push('/admin/pengeluaran/absensi')"
      >
        Kembali
      </VBtn>

      <div>
        <h4 class="text-h4 font-weight-bold mb-1">
          Data dari Web Absensi
        </h4>
        <span class="text-body-2 text-medium-emphasis">
          Kelola dan pantau data log serta rekap langsung dari server Web Absensi
        </span>
      </div>
    </VCol>

    <!-- ==========================================
         SECTION 1: DETAIL LOG WEB ABSENSI
         ========================================== -->
    <VCol cols="12">
      <WebAbsensiData />
    </VCol>

    <!-- ==========================================
         SECTION 2: (Tempat untuk section baru)
         Silakan tambahkan komponen / section baru di bawah ini
         ========================================== -->
    <!-- <VCol cols="12"> ... </VCol> -->

  </VRow>
</template>
