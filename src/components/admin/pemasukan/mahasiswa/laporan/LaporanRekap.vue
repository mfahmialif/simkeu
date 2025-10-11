<script setup>
const tahun = ref("");
const bulan = ref([
  { value: "JANUARI;FEBRUARI;MARET-1", title: "Januari - Maret" },
  { value: "APRIL;MEI;JUNI-4", title: "April - Juni" },
  { value: "JULI;AGUSTUS;SEPTEMBER-7", title: "Juli - September" },
  { value: "OKTOBER;NOVEMBER;DESEMBER-10", title: "Oktober - Desember" },
]);
const selectedBulan = ref(null);

const downloadExcel = async () => {
  download(
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Laporan Rekap.xlsx"
  );
};

const downloadPdf = async () => {
  download("application/pdf", "Laporan Rekap.pdf");
};

const isLoading = ref(false);

const download = async (accept, filename) => {
  try {
    isLoading.value = true;
    showSnackbar({
      text: "Loading...",
      color: "info",
    });
    const response = await $api("/admin/pemasukan/mahasiswa/laporan/rekap", {
      method: "GET",
      headers: {
        Accept: accept,
      },
      body: {
        tahun_rekap: tahun.value,
        bulan_rekap: selectedBulan.value.value,
      },
    });

    downloadFileExport(response, filename);
    showSnackbar({
      text: "Laporan berhasil di download.",
      color: "success",
    });
  } catch (err) {
    showSnackbar({
      text: err.message,
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  // date now
  tahun.value = new Date().getFullYear();
});
</script>

<template>
  <VCard class="mt-4">
    <VCardItem class="pb-4">
      <VCardTitle>Rekap</VCardTitle>
    </VCardItem>

    <VDivider />

    <VRow class="pa-4">
      <!-- Combobox Tahun -->
      <VCol cols="12" md="12">
        <VTextField
          v-model="tahun"
          label="Tahun"
          min="1999"
          max="2099"
          type="number"
          variant="outlined"
        />
      </VCol>
      <!-- Combobox Bulan -->
      <VCol cols="12" md="12">
        <VCombobox
          v-model="selectedBulan"
          :items="bulan"
          label="Bulan"
          variant="outlined"
        />
      </VCol>
      <VCol cols="12" md="12">
        <VBtn block color="success" @click="downloadExcel" :loading="isLoading">
          Download Excel
          <VIcon end icon="ri-arrow-down-circle-line" />
        </VBtn>
      </VCol>
      <VCol cols="12" md="12">
        <VBtn block color="primary" @click="downloadPdf" :loading="isLoading">
          Download PDF
          <VIcon end icon="ri-arrow-down-circle-line" />
        </VBtn>
      </VCol>
    </VRow>
  </VCard>
</template>
