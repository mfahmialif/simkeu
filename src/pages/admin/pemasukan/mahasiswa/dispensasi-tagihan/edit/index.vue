<script setup>
import FormDeposit from "@/components/admin/deposit/FormDeposit.vue";
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
    user.value = response;
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
      <VCard title="Edit Data Disposisi Tagihan">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <div v-if="isLoading" class="text-center">
            <VProgressLinear indeterminate />
          </div>
          <FormDeposit
            v-else
            typeForm="edit"
            :dataForm="user"
            :url="'/admin/pemasukan/mahasiswa/dispensasi-tagihan/' + id"
            :is-role-visible="true"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
