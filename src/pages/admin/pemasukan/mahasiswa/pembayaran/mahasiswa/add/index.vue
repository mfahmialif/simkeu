<script setup>
import AkademikPembayaranMahasiswa from "@/components/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/AkademikPembayaranMahasiswa.vue";
import DepositPembayaranMahasiswa from "@/components/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/DepositPembayaranMahasiswa.vue";
import JenisPembayaranMahasiswaPembayaran from "@/components/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/JenisPembayaranMahasiswaPembayaran.vue";
import MahasiswaPembayaranMahasiswa from "@/components/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/MahasiswaPembayaranMahasiswa.vue";
import TagihanPembayaranMahasiswa from "@/components/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/TagihanPembayaranMahasiswa.vue";

const router = useRouter();

const disabled = ref(false);

const submitData = async () => {
  const formData = buildPembayaranFormData();

  if (!formData) {
    return;
  }

  try {

    disabled.value = true;
    const response = await $api('/admin/pemasukan/mahasiswa/pembayaran', {
      method: "POST",
      body: formData,
      onResponseError({ response }) {
        console.error(response);
      },
    });

    console.log(response);
    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: "success",
      });

      router.push("/admin/pemasukan/mahasiswa/pembayaran/mahasiswa");
    } else {
      showSnackbar({
        text: response.message,
        color: "error",
      });
    }
  } catch (err) {
    console.log(err);
    // const message = Array.isArray(err.data.message)
    //   ? err.data.message.join("; ")
    //   : err.data.message;
    // showSnackbar({
    //   text: message,
    //   color: "error",
    // });
  } finally {
    disabled.value = false;
  }
};

function buildPembayaranFormData() {
  const mahasiswa = mahasiswaRef.value?.mahasiswa;
  const thAkademik = akademikRef.value?.selectedThAkademik ?? null;
  const tanggal = akademikRef.value?.tanggal ?? null;
  const jenisPembayaran =
    jenisPembayaranRef.value?.selectedJenisPembayaran ?? null;

  if (thAkademik === null || tanggal === null || jenisPembayaran === null) {
    showSnackbar({
      text: "Harap memilih tahun akademik, tanggal, dan jenis pembayaran",
      color: "error",
    });
    return false;
  }

  // Opsional: validasi minimal
  if (!unref(mahasiswaRef.value.mahasiswa.tagihan)?.length) {
    showSnackbar({ text: "List tagihan kosong", color: "error" });
    return false;
  }

  const m = mahasiswa ?? {};
  const rows = unref(m.tagihan) ?? []; // tagihan adalah Ref<Array>

  const fd = new FormData();

  // Wajib
  fd.append("tanggal", tanggal);
  fd.append("tahun_akademik", thAkademik?.value ?? "");
  fd.append("nim", m.nim ?? "");
  fd.append("jenis_pembayaran", jenisPembayaran?.value ?? "");
  fd.append("jk_id", m.jkId ?? "");

  // Nullable
  if (m.semester != null) fd.append("semester", m.semester);
  if (m.dipakai != null) fd.append("dipakai_deposit_mhs", m.dipakai); // total deposit yang dipakai
  if (m.kamarId != null) fd.append("kamar_id", m.kamarId);

  // Array list_tagihan_*
  rows.forEach((r) => {
    fd.append("list_tagihan_id[]", r.id ?? "");
    fd.append("list_tagihan[]", r.display ?? r.nama ?? r.judul ?? ""); // nama tagihan
    fd.append("list_dibayar[]", r.dibayar ?? 0);
    fd.append("list_deposit[]", r.deposit ?? 0);
  });

  return fd;
}

const tagihanRef = ref(null);
function onRefreshTagihan(nim) {
  tagihanRef.value?.fetchTagihan(nim);
}

const mahasiswaRef = ref(null);

const depositRef = ref(null);
function onRefreshDeposit() {
  depositRef.value?.fetchDeposit();
}

const akademikRef = ref(null);
const jenisPembayaranRef = ref(null);

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
        <VBtn color="primary" @click="submitData" :disabled>Simpan Pembayaran</VBtn>
      </div>
    </div>

    <VRow>
      <VCol md="8">
        <AkademikPembayaranMahasiswa ref="akademikRef" />

        <MahasiswaPembayaranMahasiswa
          ref="mahasiswaRef"
          @refreshTagihan="onRefreshTagihan"
          @refreshDeposit="onRefreshDeposit"
        />

        <TagihanPembayaranMahasiswa
          ref="tagihanRef"
          :mahasiswa="mahasiswaRef?.mahasiswa"
        />

        <JenisPembayaranMahasiswaPembayaran ref="jenisPembayaranRef" />
      </VCol>

      <VCol md="4" cols="12">
        <DepositPembayaranMahasiswa
          ref="depositRef"
          :mahasiswa="mahasiswaRef?.mahasiswa"
        />

        <VBtn color="primary" @click="submitData" :disabled class="w-100 mt-3">
          Simpan Pembayaran
        </VBtn>
      </VCol>
    </VRow>
  </div>
</template>
