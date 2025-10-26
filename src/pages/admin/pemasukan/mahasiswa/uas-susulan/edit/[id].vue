<script setup>
import FormUasSusulan from "@/components/admin/uas-susulan/FormUasSusulan.vue";
import { onMounted, ref } from "vue";
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
      "/admin/pemasukan/mahasiswa/uas-susulan/" + id,
      {
        method: "GET",
      }
    );
    data.value = response;
    console.log(response);
  } catch (err) {
    console.log(err);
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
  // {
  //   value: 'hr', // untuk divider
  // },
  {
    title: "Lihat Data",
    value: "lihat-data",
    icon: "ri-eye-line",
    clickHandler: () => router.push("/admin/pemasukan/mahasiswa/uas-susulan"),
  },
];

onMounted(() => {
  document.title = "Cat Edit - SIMKEU";
  console.log("edit UAS Susulan id", id);
  fetchData();
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Edit Data UAS Susulan">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <div v-if="isLoading" class="text-center">
            <VProgressLinear indeterminate />
          </div>
          <FormUasSusulan
            v-else
            typeForm="edit"
            :dataForm="data"
            :url="'/admin/pemasukan/mahasiswa/uas-susulan/full/' + id"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
