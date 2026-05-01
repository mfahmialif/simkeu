<script setup>
import FormSyaratTagihan from "@/components/admin/syarat-tagihan/FormSyaratTagihan.vue";
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
    clickHandler: () => router.push("/admin/setting/syarat-tagihan"),
  },
];

onMounted(() => {
  document.title = "Syarat Tagihan Add - SIMKEU";
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Tambah Syarat Tagihan">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <FormSyaratTagihan
            typeForm="add"
            :url="'/admin/syarat-tagihan'"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
