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

const bulan = ref("");

const selectedProdi = ref(null);
const selectedTahunAkademik = ref(null);
const selectedJenisPembayaran = ref(null);

const downloadExcel = async () => {
  download(
    "excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Laporan Bulanan.xlsx"
  );
};

const downloadPdf = async () => {
  download("pdf", "application/pdf", "Laporan Bulanan.pdf");
};

const isLoading = ref(false);
const download = async (type, accept, filename) => {
  try {
    isLoading.value = true;
    showSnackbar({
      text: "Loading...",
      color: "info",
    });
    const response = await $api("/admin/pemasukan/mahasiswa/laporan/bulanan", {
      method: "GET",
      headers: {
        Accept: accept,
      },
      body: {
        bulan: formatBulan(bulan.value),
        action: type,
        kategori: "Bulanan",
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

const formatBulan = (val) => {
  const [year, month] = val.split("-");
  return `${month}-${year}`;
};

onMounted(() => {
  // month now
  bulan.value = new Date().toISOString().slice(0, 7);
});
</script>

<template>
  <VCard class="mt-4">
    <VCardItem class="pb-4">
      <VCardTitle>Bulanan</VCardTitle>
    </VCardItem>

    <VDivider />

    <VRow class="pa-4">
      <!-- Input Bulan -->
      <VCol cols="12" md="12">
        <AppDateTimePicker
          v-model="bulan"
          label="Bulan"
          placeholder="Pilih bulan"
          :config="{
            plugins: [
              new monthSelectPlugin({
                shorthand: true, // Jan, Feb, dst.
                dateFormat: 'Y-m',
                altFormat: 'F Y',
                theme: 'dark', // Sesuaikan dengan tema kamu
              }),
            ],
            altInput: true,
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
