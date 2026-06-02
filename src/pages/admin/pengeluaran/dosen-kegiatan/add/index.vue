<script setup>
import DataDosenPengeluaranDosenKegiatan from "@/components/admin/pengeluaran/dosen-kegiatan/DataDosenPengeluaranDosenKegiatan.vue";
import FormPengeluaranDosenKegiatan from "@/components/admin/pengeluaran/dosen-kegiatan/FormPengeluaranDosenKegiatan.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const refDataDosen = ref(null);
const refForm = ref(null);

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
      <DataDosenPengeluaranDosenKegiatan
        ref="refDataDosen"
        class="pb-3"
        :ref-form="refForm"
      />
    </VCol>

    <VCol cols="12">
      <FormPengeluaranDosenKegiatan
        ref="refForm"
        :ref-data-dosen="refDataDosen"
      />
    </VCol>
  </VRow>
</template>
