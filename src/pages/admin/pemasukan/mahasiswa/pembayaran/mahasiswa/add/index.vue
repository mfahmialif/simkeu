<script setup>
import AkademikPembayaranMahasiswa from "@/components/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/AkademikPembayaranMahasiswa.vue";
import DepositPembayaranMahasiswa from "@/components/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/DepositPembayaranMahasiswa.vue";
import JenisPembayaranMahasiswaPembayaran from "@/components/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/JenisPembayaranMahasiswaPembayaran.vue";
import MahasiswaPembayaranMahasiswa from "@/components/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/MahasiswaPembayaranMahasiswa.vue";
import TagihanPembayaranMahasiswa from "@/components/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/TagihanPembayaranMahasiswa.vue";

const submitData = () => {
  console.log(mahasiswaRef.value?.mahasiswa);
};

const tagihanRef = ref(null);

function onRefreshTagihan(nim) {
  tagihanRef.value?.fetchTagihan(nim); // ⬅️ panggil fungsi child 2
}

const akademikRef = ref(null);
const mahasiswaRef = ref(null);
const depositRef = ref(null);

function onRefreshDeposit(){
  depositRef.value?.fetchDeposit();
}

onMounted(() => {
  document.title = "Tambah Data Pembayaran Mahasiswa - SIMKEU";
});
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-space-between gap-4 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 mb-1">Tambah data pembayaran</h4>
        <p class="text-body-1 mb-0">Silahkan mengisi data yang diperlukan</p>
      </div>

      <div class="d-flex gap-4 align-center flex-wrap">
        <VBtn
          variant="outlined"
          color="secondary"
          @click="
            $router.push('/admin/pemasukan/mahasiswa/pembayaran/mahasiswa')
          "
          >Batalkan</VBtn
        >
        <VBtn color="primary" @click="submitData">Simpan Pembayaran</VBtn>
      </div>
    </div>

    <VRow>
      <VCol md="8">
        <AkademikPembayaranMahasiswa ref="akademikRef" />

        <MahasiswaPembayaranMahasiswa @refreshTagihan="onRefreshTagihan" ref="mahasiswaRef" @refreshDeposit="onRefreshDeposit" />

        <TagihanPembayaranMahasiswa :mahasiswa="mahasiswaRef?.mahasiswa" ref="tagihanRef" />

        <JenisPembayaranMahasiswaPembayaran :mahasiswa="mahasiswaRef?.mahasiswa" />
      </VCol>

      <VCol md="4" cols="12">
        <DepositPembayaranMahasiswa :mahasiswa="mahasiswaRef?.mahasiswa" ref="depositRef" />

        <VBtn color="primary" @click="submitData" class="w-100 mt-3">
          Simpan Pembayaran
        </VBtn>
      </VCol>
    </VRow>
  </div>
</template>
