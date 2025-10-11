<script setup>
const props = defineProps({
  prodi: {
    type: Array,
    required: true,
  },
  tahunAkademik: {
    type: Array,
    required: true,
  },
  jenisPembayaran: {
    type: Array,
    required: true,
  },
  isLoadingProdi: {
    type: Boolean,
    required: true,
  },
  isLoadingTahunAkademik: {
    type: Boolean,
    required: true,
  },
  isLoadingJenisPembayaran: {
    type: Boolean,
    required: true,
  },
});

const tahun = ref("");

const selectedProdi = ref(null);
const selectedTahunAkademik = ref(null);
const selectedJenisPembayaran = ref(null);

const downloadExcel = async () => {
  download(
    "excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Laporan Tahunan.xlsx"
  );
};

const downloadPdf = async () => {
  download("pdf", "application/pdf", "Laporan Tahunan.pdf");
};

const isLoading = ref(false);
const download = async (type, accept, filename) => {
  try {
    isLoading.value = true;
    showSnackbar({
      text: "Loading...",
      color: "info",
    });
    const response = await $api("/admin/pemasukan/mahasiswa/laporan/tahunan", {
      method: "GET",
      headers: {
        Accept: accept,
      },
      body: {
        tahun: tahun.value,
        action: type,
        kategori: "Tahunan",
        ...(selectedProdi.value && { prodi: selectedProdi.value.value }),
        ...(selectedTahunAkademik.value && {
          tahun_akademik: selectedTahunAkademik.value.value,
        }),
        ...(selectedJenisPembayaran.value && {
          jenis_pembayaran: selectedJenisPembayaran.value.value,
        }),
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
  // month now
  tahun.value = new Date().getFullYear();
});
</script>

<template>
  <VCard class="mt-4">
    <VCardItem class="pb-4">
      <VCardTitle>Tahunan</VCardTitle>
    </VCardItem>

    <VDivider />

    <VRow class="pa-4">
      <!-- Input Tahun -->
      <VCol cols="12" md="12">
        <VTextField
          v-model="tahun"
          label="Tahun"
          type="number"
          min="1999"
          variant="outlined"
        />
      </VCol>

      <!-- Combobox Prodi -->
      <VCol cols="12" md="12">
        <VCombobox
          v-model="selectedProdi"
          :items="props.prodi"
          label="Prodi"
          variant="outlined"
          clearable
          :loading="props.isLoadingProdi"
        />
      </VCol>
      <!-- Combobox Tahun Akademik -->
      <VCol cols="12" md="12">
        <VCombobox
          v-model="selectedTahunAkademik"
          :items="props.tahunAkademik"
          label="Tahun Akademik"
          variant="outlined"
          clearable
          :loading="props.isLoadingTahunAkademik"
        />
      </VCol>
      <!-- Combobox Jenis Pembayaran -->
      <VCol cols="12" md="12">
        <VCombobox
          v-model="selectedJenisPembayaran"
          :items="props.jenisPembayaran"
          label="Jenis Pembayaran"
          variant="outlined"
          clearable
          :loading="props.isLoadingJenisPembayaran"
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
