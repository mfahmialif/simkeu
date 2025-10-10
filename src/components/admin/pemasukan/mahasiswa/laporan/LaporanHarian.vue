<script setup>
const tanggal = ref("");
const prodi = ref([]);
const tahunAkademik = ref([]);
const jenisPembayaran = ref([]);

const selectedProdi = ref([]);
const selectedTahunAkademik = ref([]);
const selectedJenisPembayaran = ref([]);

const isLoadingProdi = ref(false);
const isLoadingTahunAkademik = ref(false);
const isLoadingJenisPembayaran = ref(false);

const fetchProdi = async () => {
  try {
    isLoadingProdi.value = true;
    const { data } = await $api("/admin/prodi", {
      method: "GET",
      body: {
        limit: 0,
      },
    });

    prodi.value = data.data.map((prodi) => {
      return {
        title: `${prodi.nama}`,
        value: prodi.id,
      };
    });
  } catch (err) {
    showSnackbar({
      text: err.message,
      color: "error",
    });
  } finally {
    isLoadingProdi.value = false;
  }
};

const fetchTahunAkademik = async () => {
  try {
    isLoadingTahunAkademik.value = true;
    const { data } = await $api("/admin/th-akademik", {
      method: "GET",
      body: {
        limit: 0,
      },
    });

    tahunAkademik.value = data.data.map((tahunAkademik) => {
      return {
        title: `${tahunAkademik.nama} - ${tahunAkademik.semester}`,
        value: tahunAkademik.id,
      };
    });
  } catch (err) {
    showSnackbar({
      text: err.message,
      color: "error",
    });
  } finally {
    isLoadingTahunAkademik.value = false;
  }
};

const fetchJenisPembayaran = async () => {
  try {
    isLoadingJenisPembayaran.value = true;
    const { data } = await $api("/admin/pemasukan/mahasiswa/jenis-pembayaran", {
      method: "GET",
      body: {
        limit: 0,
      },
    });

    jenisPembayaran.value = data.data.map((jenisPembayaran) => {
      return {
        title: `${jenisPembayaran.nama} - ${jenisPembayaran.kategori}`,
        value: jenisPembayaran.id,
      };
    });
  } catch (err) {
    console.log(err);
    showSnackbar({
      text: err.message,
      color: "error",
    });
  } finally {
    isLoadingJenisPembayaran.value = false;
  }
};

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

const downloadPdf = async () => {
  download("pdf", "application/pdf", "Laporan Harian.pdf");
};

const download = async (type, accept, filename) => {
  try {
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
        ...(selectedProdi.value && { prodi: selectedProdi.value }),
        ...(selectedTahunAkademik.value && {
          tahun_akademik: selectedTahunAkademik.value,
        }),
        ...(selectedJenisPembayaran.value && {
          jenis_pembayaran: selectedJenisPembayaran.value,
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
  }
};

onMounted(() => {
  fetchProdi();
  fetchTahunAkademik();
  fetchJenisPembayaran();

  // date now
  tanggal.value = new Date().toISOString().split("T")[0];
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
        <VTextField
          v-model="tanggal"
          label="Tanggal"
          type="date"
          variant="outlined"
        />
      </VCol>

      <!-- Combobox Prodi -->
      <VCol cols="12" md="12">
        <VCombobox
          v-model="selectedProdi"
          :items="prodi"
          label="Prodi"
          variant="outlined"
          :loading="isLoadingProdi"
        />
      </VCol>
      <!-- Combobox Tahun Akademik -->
      <VCol cols="12" md="12">
        <VCombobox
          v-model="selectedTahunAkademik"
          :items="tahunAkademik"
          label="Tahun Akademik"
          variant="outlined"
          :loading="isLoadingTahunAkademik"
        />
      </VCol>
      <!-- Combobox Jenis Pembayaran -->
      <VCol cols="12" md="12">
        <VCombobox
          v-model="selectedJenisPembayaran"
          :items="jenisPembayaran"
          label="Jenis Pembayaran"
          variant="outlined"
          :loading="isLoadingJenisPembayaran"
        />
      </VCol>
      <VCol cols="12" md="6">
        <VBtn block color="success" @click="downloadExcel">
          Download Excel
          <VIcon end icon="ri-arrow-down-circle-line" />
        </VBtn>
      </VCol>
      <VCol cols="12" md="6">
        <VBtn block color="success" @click="downloadExcelTotalan">
          Download Totalan
          <VIcon end icon="ri-arrow-down-circle-line" />
        </VBtn>
      </VCol>
      <VCol cols="12" md="12" @click="downloadPdf">
        <VBtn block color="primary">
          Download PDF
          <VIcon end icon="ri-arrow-down-circle-line" />
        </VBtn>
      </VCol>
    </VRow>
  </VCard>
</template>
