<script setup>
import FormPengeluaranDosen from "@/components/admin/pengeluaran/dosen/FormPengeluaranDosen.vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const id = route.params.id;

const dataForm = ref(null);
const fetchDataForm = async () => {
  isLoading.value = true;
  try {
    const { data } = await $api(`/admin/pengeluaran/dosen/` + id, {
      method: "GET",
    });

    dataForm.value = data;
    // console.log(dataForm.value);
  } catch (err) {
    console.log(err);
    if (err.status === 404) {
      router.replace("/not-found");
    }
  } finally {
    isLoading.value = false;
  }
};

const isLoading = ref(false);

onMounted(() => {
  document.title = "Edit Data Pengeluaran Dosen - SIMKEU";
  fetchDataForm();
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <div v-if="isLoading" class="text-center">
        <VProgressLinear indeterminate />
      </div>
      <FormPengeluaranDosen
        v-else
        class="pb-3"
        ref="refForm"
        :dataForm="dataForm"
        :typeForm="'edit'"
      />
    </VCol>
  </VRow>
</template>
