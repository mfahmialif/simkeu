<script setup>
import FormPengeluaranDosenKegiatan from "@/components/admin/pengeluaran/dosen-kegiatan/FormPengeluaranDosenKegiatan.vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  document.title = "Tambah Barokah Dosen Kegiatan - SIMKEU";
});
</script>

<template>
  <VRow>
    <VCol cols="12" class="pb-0">
      <VBtn
        variant="outlined"
        color="secondary"
        prepend-icon="ri-arrow-left-line"
        @click="router.push('/admin/pengeluaran/dosen-kegiatan')"
      >
        Kembali
      </VBtn>
    </VCol>

    <VCol cols="12">
      <FormPengeluaranDosenKegiatan />
    </VCol>
  </VRow>
</template>
