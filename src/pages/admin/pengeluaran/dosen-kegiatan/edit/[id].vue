<script setup>
import FormPengeluaranDosenKegiatan from "@/components/admin/pengeluaran/dosen-kegiatan/FormPengeluaranDosenKegiatan.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const dataForm = ref(null);
const isLoading = ref(false);

const fetchDataForm = async () => {
  isLoading.value = true;
  try {
    const { data } = await $api("/admin/pengeluaran/dosen-kegiatan/" + id, {
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
  document.title = "Edit Barokah Dosen Kegiatan - SIMKEU";
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
        @click="router.push('/admin/pengeluaran/dosen-kegiatan')"
      >
        Kembali
      </VBtn>
    </VCol>

    <VCol cols="12">
      <div v-if="isLoading" class="text-center">
        <VProgressLinear indeterminate />
      </div>
      <FormPengeluaranDosenKegiatan
        v-else
        :data-form="dataForm"
        type-form="edit"
      />
    </VCol>
  </VRow>
</template>
