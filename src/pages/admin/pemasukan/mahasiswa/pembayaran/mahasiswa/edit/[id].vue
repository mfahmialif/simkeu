<script setup>
import AkademikPembayaranMahasiswa from "@/components/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/AkademikPembayaranMahasiswa.vue";
import JenisPembayaranMahasiswaPembayaran from "@/components/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/JenisPembayaranMahasiswaPembayaran.vue";
import PembayaranMahasiswa from "@/components/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/PembayaranMahasiswa.vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const id = route.params.id;

const disabled = ref(false);
const submitData = async () => {
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

  const fd = new FormData();

  fd.append("tanggal", akademikRef.value.tanggal);
  fd.append("th_akademik_id", akademikRef.value.selectedThAkademik.value);
  fd.append("jumlah", pembayaranRef.value.rows[0].dibayar);
  fd.append("jenis_pembayaran", jenisPembayaran?.value ?? "");

  fd.append("_method", "PUT");

  try {
    disabled.value = true;
    const res = await $api(`/admin/pemasukan/mahasiswa/pembayaran/` + id, {
      method: "POST",
      body: fd,
    });

    router.push("/admin/pemasukan/mahasiswa/pembayaran/mahasiswa");

    showSnackbar({
      text: res.message,
      color: "success",
    });
  } catch (err) {
    if (err.status === 422 && err.data?.message) {
      const allErrors = Object.values(err.data.message)
        .flat() // kalau setiap field punya array pesan
        .join("\n"); // pisahkan dengan baris baru atau koma

      showSnackbar({
        text: allErrors,
        color: "error",
      });
    } else {
      showSnackbar({
        text: err.message || "Terjadi kesalahan",
        color: "error",
      });
    }
  } finally {
    disabled.value = false;
  }
};

const pembayaranRef = ref(null);
const akademikRef = ref(null);
const jenisPembayaranRef = ref(null);
const dataForm = ref({});

const fetchDataForm = async () => {
  try {
    const { data } = await $api(`/admin/pemasukan/mahasiswa/pembayaran/` + id, {
      method: "GET",
    });

    dataForm.value = data;
  } catch (err) {
    console.log(err);
    if (err.status === 404) {
      router.replace("/not-found");
    }
  }
};

onMounted(async () => {
  document.title = "Edit Data Pembayaran Mahasiswa - SIMKEU";
  await fetchDataForm();
});
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-space-between gap-4 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 mb-1">Edit data pembayaran</h4>
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
        <VBtn color="primary" @click="submitData" :disabled="disabled"
          >Simpan Pembayaran</VBtn
        >
      </div>
    </div>

    <VRow>
      <VCol md="12">
        <AkademikPembayaranMahasiswa
          ref="akademikRef"
          typeForm="edit"
          :dataForm="dataForm"
        />

        <PembayaranMahasiswa
          ref="pembayaranRef"
          typeForm="edit"
          :dataForm="dataForm"
        />

        <JenisPembayaranMahasiswaPembayaran
          ref="jenisPembayaranRef"
          typeForm="edit"
          :dataForm="dataForm"
        />

        <VBtn
          color="primary"
          @click="submitData"
          :disabled="disabled"
          class="w-100 mt-3"
        >
          Simpan Pembayaran
        </VBtn>
      </VCol>
    </VRow>
  </div>
</template>
