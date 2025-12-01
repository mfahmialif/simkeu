<script setup>
import DataDosenPengeluaranDosen from "@/components/admin/pengeluaran/dosen/DataDosenPengeluaranDosen.vue";
import FormPengeluaranDosen from "@/components/admin/pengeluaran/dosen/FormPengeluaranDosen.vue";
import InfoPengeluaranDosen from "@/components/admin/pengeluaran/dosen/InfoPengeluaranDosen.vue";

const refDataDosen = ref(null);
const refInfo = ref(null);
const refForm = ref(null);

onMounted(() => {
  document.title = "Tambah Data Pengeluaran Dosen - SIMKEU";
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <DataDosenPengeluaranDosen class="pb-3" ref="refDataDosen" :refInfo="refInfo" :refForm="refForm" />
    </VCol>
    <VCol cols="12">
      <FormPengeluaranDosen class="pb-3" ref="refForm" :refDataDosen="refDataDosen" />
    </VCol>
    <VCol cols="12">
      <InfoPengeluaranDosen ref="refInfo" :refDataDosen="refDataDosen"/>
    </VCol>
  </VRow>
</template>
