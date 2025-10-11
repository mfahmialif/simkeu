<script setup>
import LaporanBulanan from "@/components/admin/pemasukan/mahasiswa/laporan/LaporanBulanan.vue";
import LaporanHarian from "@/components/admin/pemasukan/mahasiswa/laporan/LaporanHarian.vue";
import LaporanRekap from "@/components/admin/pemasukan/mahasiswa/laporan/LaporanRekap.vue";
import LaporanTahunan from "@/components/admin/pemasukan/mahasiswa/laporan/LaporanTahunan.vue";
import { ref } from "vue";
import { VCol } from "vuetify/components";

const prodi = ref([]);
const tahunAkademik = ref([]);
const jenisPembayaran = ref([]);

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

onMounted(() => {
  // title
  document.title = "Laporan Pembayaran Mahasiswa";

  fetchProdi();
  fetchTahunAkademik();
  fetchJenisPembayaran();
});
</script>

<template>
  <div>
    <VCardTitle>Laporan Pembayaran Mahasiswa</VCardTitle>

    <LaporanHarian
      :prodi="prodi"
      :tahunAkademik="tahunAkademik"
      :jenisPembayaran="jenisPembayaran"
      :isLoadingProdi="isLoadingProdi"
      :isLoadingTahunAkademik="isLoadingTahunAkademik"
      :isLoadingJenisPembayaran="isLoadingJenisPembayaran"
    />

    <LaporanBulanan
      :prodi="prodi"
      :tahunAkademik="tahunAkademik"
      :jenisPembayaran="jenisPembayaran"
      :isLoadingProdi="isLoadingProdi"
      :isLoadingTahunAkademik="isLoadingTahunAkademik"
      :isLoadingJenisPembayaran="isLoadingJenisPembayaran"
    />

    <LaporanTahunan
      :prodi="prodi"
      :tahunAkademik="tahunAkademik"
      :jenisPembayaran="jenisPembayaran"
      :isLoadingProdi="isLoadingProdi"
      :isLoadingTahunAkademik="isLoadingTahunAkademik"
      :isLoadingJenisPembayaran="isLoadingJenisPembayaran"
    />

    <LaporanRekap />

    <VCard class="mt-4">
      <VCardItem class="pb-4">
        <VCardTitle>Rekap Khusus Tahun</VCardTitle>
      </VCardItem>

      <VDivider />

      <VRow class="pa-4">
        <!-- Combobox Kategori -->
        <VCol cols="12" md="12">
          <VCombobox
            v-model="tahunRekap"
            :items="tahunList"
            label="Tahun"
            variant="outlined"
          />
        </VCol>
        <VCol cols="12" md="12">
          <VBtn block color="success">
            Download Excel
            <VIcon end icon="ri-arrow-down-circle-line" />
          </VBtn>
        </VCol>
      </VRow>
    </VCard>
    <VCard class="mt-4">
      <VCardItem class="pb-4">
        <VCardTitle>Jumlah Mahasiswa yang Belum dan Sudah Membayar</VCardTitle>
      </VCardItem>

      <VDivider />

      <VRow class="pa-4">
        <!-- Input Tanggal -->
        <!-- Combobox Kategori -->
        <VCol cols="12" md="12">
          <VCombobox
            v-model="selectedTahunAkademik"
            :items="tahunAkademik"
            label="Tahun Akademik"
            variant="outlined"
          />
        </VCol>
        <VCol cols="12" md="12">
          <VCombobox
            v-model="selectedProdi"
            :items="prodi"
            label="Prodi"
            variant="outlined"
          />
        </VCol>
        <VCol cols="12" md="12">
          <VCombobox
            v-model="selectedJenisKelamin"
            :items="jenisKelamin"
            label="Jenis Kelamin"
            variant="outlined"
          />
        </VCol>
        <VCol cols="12" md="12">
          <VBtn block color="success">
            Download Excel
            <VIcon end icon="ri-arrow-down-circle-line" />
          </VBtn>
        </VCol>
        <VCol cols="12" md="12">
          <VBtn block color="primary">
            Download PDF
            <VIcon end icon="ri-arrow-down-circle-line" />
          </VBtn>
        </VCol>
      </VRow>
    </VCard>
  </div>
</template>
