<script setup>
const tahun = ref("");

const downloadExcel = async () => {
  download(
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Laporan Rekap.xlsx"
  );
};


const isLoading = ref(false);

const download = async (accept, filename) => {
  try {
    isLoading.value = true;
    showSnackbar({
      text: "Loading...",
      color: "info",
    });
    const response = await $api("/admin/pemasukan/mahasiswa/laporan/rekap-tahunan", {
      method: "GET",
      headers: {
        Accept: accept,
      },
      body: {
        tahun_rekap: tahun.value,
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
      <VCol cols="12" md="12">
        <VBtn block color="success" @click="downloadExcel" :loading="isLoading">
          Download Excel
          <VIcon end icon="ri-arrow-down-circle-line" />
        </VBtn>
      </VCol>
    </VRow>
  </VCard>
</template>
