<script setup>
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect/index.js'
import 'flatpickr/dist/plugins/monthSelect/style.css'

const props = defineProps({
  prodi: {
    type: Array,
    required: true,
  },
  tahunAkademik: {
    type: Array,
    required: true,
  },
  jenisKelamin: {
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
  isLoadingJenisKelamin: {
    type: Boolean,
    required: true,
  },
});

const selectedProdi = ref(null);
const selectedTahunAkademik = ref(null);
const selectedJenisKelamin = ref(null);

const downloadExcel = async () => {
  download(
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Laporan Jumlah Mahasiswa yang Belum dan Sudah Membayar.xlsx"
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
    const response = await $api("/admin/pemasukan/mahasiswa/laporan/jumlah-mahasiswa-bayar", {
      method: "GET",
      headers: {
        Accept: accept,
      },
      body: {
        ...(selectedProdi.value && { prodi: selectedProdi.value.value }),
        ...(selectedTahunAkademik.value && {
          tahun_akademik: selectedTahunAkademik.value.value,
        }),
        ...(selectedJenisKelamin.value && {
          jenis_kelamin: selectedJenisKelamin.value.value,
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

</script>

<template>
  <VCard class="mt-4">
    <VCardItem class="pb-4">
      <VCardTitle>Jumlah Mahasiswa yang Belum dan Sudah Membayar</VCardTitle>
    </VCardItem>

    <VDivider />

    <VRow class="pa-4">

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
      <!-- Combobox Jenis Kelamin -->
      <VCol cols="12" md="12">
        <VCombobox
          v-model="selectedJenisKelamin"
          :items="props.jenisKelamin"
          label="Jenis Kelamin"
          variant="outlined"
          clearable
          :loading="props.isLoadingJenisKelamin"
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
