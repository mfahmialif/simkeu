<script setup>
onMounted(() => {
  document.title = "Pemasukan-Pengeluaran - SIMKEU";
});
import { ref } from "vue";
import { VCol } from "vuetify/components";

const tanggal = ref("");
const kategori = ref("");
const jenisKelamin = ref("");
const prodi = ref("");
const tahunAkademik = ref("");
const tahunRekap = ref("");
const tahunRkp = ref("");
const tahunan = ref("");
const bulan = ref("");
const bulanan = ref("");

const tahunList = ["2020/2021", "2021/2022", "2022/2023", "2023/2024"];
const bulanList = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const kelaminList = ["Laki-laki", "Perempuan"];
const prodiList = ["TI", "SI", "BD", "DKV", "MI"];
const kategoriList = ["Kehadiran", "Lembur", "Cuti", "Sakit"];
</script>

<template>
  <div>
    <VCardTitle>Pemasukan Dan Pengeluaran Mahasiswa</VCardTitle>
    <VCard class="mt-4">
      <VCardItem class="pb-4">
        <VCardTitle>Pemasukan</VCardTitle>
      </VCardItem>

      <VDivider />

      <VRow class="pa-4">
        <!-- Input Tanggal -->
        <VCol cols="12" md="12">
          <p class="text-h5 text-no-wrap">
            Pemasukan &nbsp;&nbsp;: Rp 200.000.0000
          </p>
        </VCol>
        <!-- Combobox Kategori -->
      </VRow>
    </VCard>
    <VCard class="mt-4">
      <VCardItem class="pb-4">
        <VCardTitle>Pengeluaran</VCardTitle>
      </VCardItem>

      <VDivider />

      <VRow class="pa-4">
        <VCol cols="12" md="12">
          <h2 class="text-h5 text-no-wrap">Pengeluaran : Rp 200.000.0000</h2>
          <p class="text-h5 text-no-wrap">
            Pending &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Rp 0
          </p>
        </VCol>
      </VRow>
    </VCard>
    <VCard class="mt-4">
      <VCardItem class="pb-4">
        <VCardTitle>Saldo</VCardTitle>
      </VCardItem>
      <VDivider />
      <VRow class="pa-4">
        <!-- Input Tanggal -->
        <VCol cols="12" md="12">
          <p class="text-h5 text-no-wrap">
            Saldo
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            : Rp 200.000.0000
          </p>
        </VCol>
        <!-- Combobox Kategori -->
      </VRow>
    </VCard>
  </div>
</template>
