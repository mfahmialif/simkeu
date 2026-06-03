<script setup>
import DataPegawaiPengeluaranBulanan from "@/components/admin/pengeluaran/pegawai-bulanan/DataPegawaiPengeluaranBulanan.vue";
import FormPengeluaranPegawaiBulanan from "@/components/admin/pengeluaran/pegawai-bulanan/FormPengeluaranPegawaiBulanan.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const refDataPegawai = ref(null);
const refForm = ref(null);

onMounted(() => {
  document.title = "Tambah Barokah Dosen Bulanan - SIMKEU";
});
</script>

<template>
  <VRow>
    <VCol cols="12" class="pb-0">
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
      <DataPegawaiPengeluaranBulanan
        ref="refDataPegawai"
        tipe="dosen"
        base-path="/admin/pengeluaran/dosen-bulanan"
        :ref-form="refForm"
      />
    </VCol>

    <VCol cols="12">
      <FormPengeluaranPegawaiBulanan
        ref="refForm"
        title="Barokah Dosen Bulanan"
        pegawai-title="Dosen"
        endpoint="/admin/pengeluaran/dosen-bulanan"
        base-path="/admin/pengeluaran/dosen-bulanan"
        :ref-data-pegawai="refDataPegawai"
      />
    </VCol>
  </VRow>
</template>
