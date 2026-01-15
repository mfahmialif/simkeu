<script setup>
import FormProdi from "@/components/admin/prodi/FormProdi.vue";
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
    clickHandler: () => router.push("/admin/setting/prodi"),
  },
];

onMounted(() => {
  document.title = "Prodi Add - SIMKEU";
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Tambah Data Prodi">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <FormProdi
            typeForm="add"
            :url="'/admin/prodi'"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
