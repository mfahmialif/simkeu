<script setup>
import FormUasSusulan from "@/components/admin/uas-susulan/FormUasSusulan.vue";
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
          <FormUasSusulan
            typeForm="add"
            :url="'/admin/pemasukan/mahasiswa/uas-susulan/full'"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
