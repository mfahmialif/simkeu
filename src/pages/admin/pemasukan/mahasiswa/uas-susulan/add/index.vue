<script setup>
import FormUas from "@/components/admin/uas/FormUas.vue";
import { useRouter } from "vue-router";

const router = useRouter();

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
  document.title = "UAS Susulan Add - SIMKEU";
});

onMounted(() => {});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Tambah Data UAS Susulan">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>
        <VCardText>
          <FormUas
            typeForm="add"
            :url="'/admin/pemasukan/mahasiswa/uas-susulan'"
            :isRoleVisible="true"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
