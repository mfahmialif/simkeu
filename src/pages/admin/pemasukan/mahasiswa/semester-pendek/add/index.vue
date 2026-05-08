<script setup>
import FormSemesterPendek from "@/components/admin/pemasukan/mahasiswa/SemesterPendek/FormSemesterPendek.vue";

const pageTitle = "Tambah Pembayaran Semester Pendek";

onMounted(() => {
  document.title = `${pageTitle} - SIMKEU`;
});
</script>

<template>
  <VRow>
    <VCol cols="12" md="12">
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h4 class="text-h4 mb-1">{{ pageTitle }}</h4>
          <p class="text-body-1 text-medium-emphasis mb-0">
            Masukan NIM Mahasiswa untuk memulai proses penambahan pembayaran Semester Pendek.
          </p>
        </div>
        <VBtn
          color="secondary"
          variant="outlined"
          @click="$router.push('/admin/pemasukan/mahasiswa/semester-pendek')"
        >
          <VIcon icon="ri-arrow-left-line" class="me-2" />
          Kembali
        </VBtn>
      </div>
    </VCol>

    <VCol cols="12">
      <FormSemesterPendek />
    </VCol>
  </VRow>
</template>
