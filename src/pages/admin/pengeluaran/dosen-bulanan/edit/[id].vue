<script setup>
import FormPengeluaranPegawaiBulanan from "@/components/admin/pengeluaran/pegawai-bulanan/FormPengeluaranPegawaiBulanan.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const dataForm = ref(null);
const isLoading = ref(true);

const fetchDataForm = async () => {
  isLoading.value = true;
  try {
    const { data } = await $api("/admin/pengeluaran/dosen-bulanan/" + id, {
      method: "GET",
    });

    dataForm.value = data;
  } catch (err) {
    console.log(err);
    if (err.status === 404) {
      router.replace("/not-found");
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  document.title = "Edit Barokah Dosen Bulanan - SIMKEU";
  fetchDataForm();
});
</script>

<template>
  <VRow>
    <VCol cols="12" class="pb-0">
      <VBtn
        variant="outlined"
        color="secondary"
        prepend-icon="ri-arrow-left-line"
        @click="router.push('/admin/pengeluaran/dosen-bulanan')"
      >
        Kembali
      </VBtn>
    </VCol>

    <VCol cols="12">
      <div v-if="isLoading" class="text-center">
        <VProgressLinear indeterminate />
      </div>
      <FormPengeluaranPegawaiBulanan
        v-else
        :data-form="dataForm"
        type-form="edit"
        title="Barokah Dosen Bulanan"
        pegawai-title="Dosen"
        endpoint="/admin/pengeluaran/dosen-bulanan"
        base-path="/admin/pengeluaran/dosen-bulanan"
      />
    </VCol>
  </VRow>
</template>
