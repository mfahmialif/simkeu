<script setup>
onMounted(() => {
  document.title = "Laporan - SIMKEU";
});
import { ref } from "vue";
import { VCol } from "vuetify/components";

const tanggal = ref("");
const kategori = ref("");
const kategoriList = ["Kehadiran", "Lembur", "Cuti", "Sakit"];
</script>

<template>
  <div>
    <VCardTitle>Laporan Pembayaran Mahasiswa</VCardTitle>
    <VCard class="mt-4">
      <VCardItem class="pb-4">
        <VCardTitle>Harian</VCardTitle>
      </VCardItem>

      <VDivider />

      <VRow class="pa-4">
        <!-- Input Tanggal -->
        <VCol cols="12" md="12">
          <VTextField
            v-model="tanggal"
            label="Pilih Tanggal"
            type="date"
            variant="outlined"
          />
        </VCol>

        <!-- Combobox Kategori -->
        <VCol cols="12" md="12">
          <VCombobox
            v-model="kategori"
            :items="kategoriList"
            label="Pilih Kategori"
            variant="outlined"
          />
        </VCol>
        <VCol cols="12" md="12">
          <VBtn color="success">
            Upload
            <VIcon end icon="ri-upload-cloud-line" />
          </VBtn>
        </VCol>
      </VRow>
    </VCard>
  </div>
</template>
