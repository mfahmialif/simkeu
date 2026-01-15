<script setup>
import FormFormSchadule from "@/components/admin/form-schadule/FormFormSchadule.vue";
import { useRouter } from "vue-router";

const router = useRouter();

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
    clickHandler: () => router.push("/admin/setting/form-schadule"),
  },
];

onMounted(() => {
  document.title = "Form Schedule Add - SIMKEU";
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Tambah Form Schedule">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <FormFormSchadule
            typeForm="add"
            :url="'/admin/form-schadule'"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
