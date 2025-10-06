<script setup>
onMounted(() => {
  document.title = "Laporan - SIMKEU";
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
    <VCardTitle>Laporan Pembayaran Mahasiswa</VCardTitle>
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

        <!-- Combobox Kategori -->
        <!-- <VCol cols="12" md="12">
          <VCombobox
            v-model="kategori"
            :items="kategoriList"
            label="Kategori"
            variant="outlined"
          />
        </VCol> -->
        <VCol cols="12" md="6">
          <VBtn block color="success">
            Download Excel
            <VIcon end icon="ri-arrow-down-circle-line" />
          </VBtn>
        </VCol>
        <VCol cols="12" md="6">
          <VBtn block color="success">
            Download Totalan
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
    <VCard class="mt-4">
      <VCardItem class="pb-4">
        <VCardTitle>Bulanan</VCardTitle>
      </VCardItem>

      <VDivider />

      <VRow class="pa-4">
        <!-- Input Tanggal -->
        <!-- Combobox Kategori -->
        <VCol cols="12" md="12">
          <VCombobox
            v-model="bulanan"
            :items="bulanList"
            label="Bulanan"
            variant="outlined"
          />
        </VCol>
        <!-- <VCol cols="12" md="12">
          <VCombobox
            v-model="kategori"
            :items="kategoriList"
            label="Pilih Kategori"
            variant="outlined"
          />
        </VCol> -->
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
    <VCard class="mt-4">
      <VCardItem class="pb-4">
        <VCardTitle>Tahunan</VCardTitle>
      </VCardItem>

      <VDivider />

      <VRow class="pa-4">
        <!-- Input Tanggal -->
        <!-- Combobox Kategori -->
        <VCol cols="12" md="12">
          <VCombobox
            v-model="tahunan"
            :items="tahunList"
            label="Pilih Tahun"
            variant="outlined"
          />
        </VCol>
        <!-- <VCol cols="12" md="12">
          <VCombobox
            v-model="kategori"
            :items="kategoriList"
            label="Pilih Kategori"
            variant="outlined"
          />
        </VCol> -->
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
    <VCard class="mt-4">
      <VCardItem class="pb-4">
        <VCardTitle>Rekap</VCardTitle>
      </VCardItem>

      <VDivider />

      <VRow class="pa-4">
        <!-- Input Tanggal -->
        <!-- Combobox Kategori -->
        <VCol cols="12" md="12">
          <VCombobox
            v-model="tahunRkp"
            :items="tahunList"
            label="Tahun Rekap"
            variant="outlined"
          />
        </VCol>
        <VCol cols="12" md="12">
          <VCombobox
            v-model="bulan"
            :items="bulanList"
            label="Bulan"
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
            v-model="tahunAkademik"
            :items="tahunList"
            label="Tahun Akademik"
            variant="outlined"
          />
        </VCol>
        <VCol cols="12" md="12">
          <VCombobox
            v-model="prodi"
            :items="prodiList"
            label="Prodi"
            variant="outlined"
          />
        </VCol>
        <VCol cols="12" md="12">
          <VCombobox
            v-model="jenisKelamin"
            :items="kelaminList"
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
