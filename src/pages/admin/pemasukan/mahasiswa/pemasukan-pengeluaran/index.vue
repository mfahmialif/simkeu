<script setup>

const isLoading = ref(false);
const data = ref();

const fetchPemasukan = async () => {
  isLoading.value = true;
  try {
    const response = await $api("/admin/pemasukan/mahasiswa/pemasukan-pengeluaran");
    data.value = response.data.semua;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  document.title = "Pemasukan-Pengeluaran - SIMKEU";
  fetchPemasukan();
});
</script>

<template>
  <div>
    <VCardTitle>Pemasukan Dan Pengeluaran Mahasiswa</VCardTitle>
    <VCard class="mt-4" :loading="isLoading">
      <VCardItem class="pb-4">
        <VCardTitle>Pemasukan</VCardTitle>
      </VCardItem>

      <VDivider />

      <VRow class="pa-4">
        <!-- Input Tanggal -->
        <VCol cols="12" md="12">
          <p class="text-h5 text-no-wrap" v-if="!isLoading">
            Pemasukan &nbsp;&nbsp;: {{ formatRupiah(data?.pemasukan) }}
          </p>
          <VProgressCircular v-else indeterminate color="primary" size="24" />
        </VCol>
        <!-- Combobox Kategori -->
      </VRow>
    </VCard>
    <VCard class="mt-4" :loading="isLoading">
      <VCardItem class="pb-4">
        <VCardTitle>Pengeluaran</VCardTitle>
      </VCardItem>

      <VDivider />

      <VRow class="pa-4">
        <VCol cols="12" md="12">
          <h2 class="text-h5 text-no-wrap" v-if="!isLoading">
            Pengeluaran : {{ formatRupiah(data?.pengeluaran) }}
          </h2>
          <VProgressCircular v-else indeterminate color="primary" size="24" />
          <p class="text-h5 text-no-wrap" v-if="!isLoading">
            Pending &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {{ formatRupiah(data?.pending) }}
          </p>
        </VCol>
      </VRow>
    </VCard>
    <VCard class="mt-4" :loading="isLoading">
      <VCardItem class="pb-4">
        <VCardTitle>Saldo</VCardTitle>
      </VCardItem>
      <VDivider />
      <VRow class="pa-4">
        <!-- Input Tanggal -->
        <VCol cols="12" md="12">
          <p class="text-h5 text-no-wrap" v-if="!isLoading">
            Saldo
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            : {{ formatRupiah(data?.saldo) }}
          </p>
          <VProgressCircular v-else indeterminate color="primary" size="24" />
        </VCol>
        <!-- Combobox Kategori -->
      </VRow>
    </VCard>
  </div>
</template>
