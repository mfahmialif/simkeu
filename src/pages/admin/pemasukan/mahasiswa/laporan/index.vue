<script setup>
import LaporanBayarMahasiswa from "@/components/admin/pemasukan/mahasiswa/laporan/LaporanBayarMahasiswa.vue";
import LaporanBulanan from "@/components/admin/pemasukan/mahasiswa/laporan/LaporanBulanan.vue";
import LaporanHarian from "@/components/admin/pemasukan/mahasiswa/laporan/LaporanHarian.vue";
import LaporanRekap from "@/components/admin/pemasukan/mahasiswa/laporan/LaporanRekap.vue";
import LaporanRekapTahun from "@/components/admin/pemasukan/mahasiswa/laporan/LaporanRekapTahun.vue";
import LaporanTahunan from "@/components/admin/pemasukan/mahasiswa/laporan/LaporanTahunan.vue";
import { ref } from "vue";
import { VCol } from "vuetify/components";

const prodi = ref([]);
const tahunAkademik = ref([]);
const jenisPembayaran = ref([]);
const jenisKelamin = ref([
  {
    title: "Laki-laki",
    value: 8,
  },
  {
    title: "Perempuan",
    value: 9,
  },
]);

const isLoadingProdi = ref(false);
const isLoadingTahunAkademik = ref(false);
const isLoadingJenisPembayaran = ref(false);
const isLoadingJenisKelamin = ref(false);

const fetchProdi = async () => {
  try {
    isLoadingProdi.value = true;
    const { data } = await $api("/admin/prodi", {
      method: "GET",
      body: {
        limit: 0,
        sort_key: 'strata',
        sort_order: 'asc'
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

    <LaporanRekapTahun />

    <LaporanBayarMahasiswa
      :prodi="prodi"
      :tahunAkademik="tahunAkademik"
      :jenisKelamin="jenisKelamin"
      :isLoadingProdi="isLoadingProdi"
      :isLoadingTahunAkademik="isLoadingTahunAkademik"
      :isLoadingJenisKelamin="isLoadingJenisKelamin"
    />

  </div>
</template>
