<script setup>
import FormMataUang from "@/components/admin/mata-uang/FormMataUang.vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const id = route.params.id;
const data = ref({});
const isLoading = ref(false);

const userData = useCookie("userData").value ?? {};
const isAdmin = computed(() => userData.role?.name === "admin");

const fetchData = async () => {
  try {
    isLoading.value = true;
    const response = await $api("/admin/mata-uang/" + id, {
      method: "GET",
    });

    data.value = response.data;
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
    clickHandler: () => router.push("/admin/setting/mata-uang"),
  },
];

onMounted(() => {
  document.title = isAdmin.value
    ? "Mata Uang Edit - SIMKEU"
    : "Mata Uang View - SIMKEU";
  fetchData();
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard :title="isAdmin ? 'Edit Data Mata Uang' : 'Detail Mata Uang'">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <div v-if="isLoading" class="text-center">
            <VProgressLinear indeterminate />
          </div>
          <FormMataUang
            v-else
            type-form="edit"
            :data-form="data"
            :url="'/admin/mata-uang/' + id"
            :read-only="!isAdmin"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
