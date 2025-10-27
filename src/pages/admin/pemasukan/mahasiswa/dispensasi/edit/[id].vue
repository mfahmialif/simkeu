<script setup>
import FormDispensasi from "@/components/admin/pemasukan/mahasiswa/dispensasi/FormDispensasi.vue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const id = route.params.id;

const user = ref({});
const isLoading = ref(false);

const fetchUser = async () => {
  try {
    isLoading.value = true;

    const response = await $api("/admin/pemasukan/mahasiswa/dispensasi/" + id, {
      method: "GET",
    });
    user.value = response.data;
    console.log(user.value);

  } catch (err) {
    console.log(err);
    if (err.status === 404) {
      router.replace("/not-found");
    }
  } finally {
    isLoading.value = false;
  }
};
watch(user, (newVal) => {
  console.log("User dari parent:", newVal);
});

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
    clickHandler: () => router.push("/admin/pemasukan/mahasiswa/dispensasi"),
  },
];

onMounted(() => {
  document.title = "Catatan Dispensasi Edit - SIMKEU";
  console.log("edit Catatan Dispensasi  id", id);
  fetchUser();
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Edit Data Catatan Disposisi">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <div v-if="isLoading" class="text-center">
            <VProgressLinear indeterminate />
          </div>
          <FormDispensasi v-else typeForm="edit" :dataForm="user" :url="'/admin/pemasukan/mahasiswa/dispensasi/' + id"
            :is-role-visible="true" />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
