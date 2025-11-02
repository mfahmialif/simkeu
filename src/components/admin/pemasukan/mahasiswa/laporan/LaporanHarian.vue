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

const tanggal = ref("");

const selectedProdi = ref(null);
const selectedTahunAkademik = ref(null);
const selectedJenisPembayaran = ref(null);

const downloadExcel = async () => {
  download(
    "excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Laporan Harian.xlsx"
  );
};

const downloadExcelTotalan = async () => {
  download(
    "excelTotalan",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Laporan Harian Totalan.xlsx"
  );
};

const downloadExcelTotalanStaff = async () => {
  download(
    "excelTotalanStaff",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Laporan Harian Totalan Staff.xlsx"
  );
};

const downloadPdf = async () => {
  download("pdf", "application/pdf", "Laporan Harian.pdf");
};

const isLoading = ref(false);
const download = async (type, accept, filename) => {
  try {
    isLoading.value = true;
    showSnackbar({
      text: "Loading...",
      color: "info",
    });
    const response = await $api("/admin/pemasukan/mahasiswa/laporan/harian", {
      method: "GET",
      headers: {
        Accept: accept,
      },
      body: {
        tanggal: tanggal.value,
        action: type,
        kategori: "Harian",
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
  // date now
  tanggal.value = fDate(new Date());
});
</script>

<template>
  <VCard class="mt-4">
    <VCardItem class="pb-4">
      <VCardTitle>Harian</VCardTitle>
    </VCardItem>

    <VDivider />

    <VRow class="pa-4">
      <!-- Input Tanggal -->
      <VCol cols="12" md="12">
        <AppDateTimePicker
          v-model="tanggal"
          label="Tanggal"
          placeholder="Select date"
          :config="{
            altInput: true,
            altFormat: 'F j, Y',
            dateFormat: 'Y-m-d',
          }"
        />
      </VCol>

      <!-- Combobox Prodi -->
      <VCol cols="12" md="12">
        <VCombobox
          v-model="selectedProdi"
          :items="props.prodi"
          label="Prodi"
          variant="outlined"
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
          :loading="props.isLoadingJenisPembayaran"
        />
      </VCol>
      <VCol cols="12" md="12">
        <VBtn block color="success" @click="downloadExcel" :loading="isLoading">
          Download Excel
          <VIcon end icon="ri-arrow-down-circle-line" />
        </VBtn>
      </VCol>
      <VCol cols="12" md="6">
        <VBtn
          block
          color="success"
          @click="downloadExcelTotalanStaff"
          :loading="isLoading"
        >
          Download Totalan Sesuai Staff
          <VIcon end icon="ri-arrow-down-circle-line" />
        </VBtn>
      </VCol>
      <VCol cols="12" md="6">
        <VBtn
          block
          color="success"
          @click="downloadExcelTotalan"
          :loading="isLoading"
        >
          Download Totalan
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
