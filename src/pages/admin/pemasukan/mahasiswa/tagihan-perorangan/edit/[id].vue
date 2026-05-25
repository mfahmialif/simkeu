<script setup>
import FormTagihan from "@/components/admin/pemasukan/mahasiswa/master/tagihan/FormTagihan.vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const id = route.params.id;

const data = ref({});
const isLoading = ref(false);

const fetchData = async () => {
  try {
    isLoading.value = true;

    const response = await $api(
      "/admin/pemasukan/mahasiswa/tagihan-perorangan/" + id,
      {
        method: "GET",
      }
    );

    data.value = response;
  } catch (err) {
    console.error(err);
    if (err.status === 404) {
      router.replace("/not-found");
    }
  } finally {
    isLoading.value = false;
  }
};

const menuList = [
  {
    title: "Kembali",
    value: "back",
    icon: "ri-arrow-left-line",
    clickHandler: () => router.back(),
  },
  {
    title: "Lihat Data",
    value: "lihat-data",
    icon: "ri-eye-line",
    clickHandler: () =>
      router.push("/admin/pemasukan/mahasiswa/tagihan-perorangan"),
  },
];

onMounted(() => {
  document.title = "Tagihan Perorangan Edit - SIMKEU";
  fetchData();
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Edit Tagihan Perorangan">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <div v-if="isLoading" class="text-center">
            <VProgressLinear indeterminate />
          </div>
          <FormTagihan
            v-else
            type-form="edit"
            :data-form="data"
            :url="'/admin/pemasukan/mahasiswa/tagihan-perorangan/' + id"
            show-nim
            search-nim
            submit-redirect="/admin/pemasukan/mahasiswa/tagihan-perorangan"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
