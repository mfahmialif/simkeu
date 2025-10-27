<script setup>
import FormSetoran from "@/components/admin/setoran/FormSetoran.vue";
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
    clickHandler: () =>
      router.push("/admin/pemasukan/mahasiswa/setoran"),
  },
];

onMounted(() => {
  document.title = "Setoran Add - SIMKEU";
});

onMounted(() => {});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Tambah Setoran">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <FormSetoran
            typeForm="add"
            :url="'/admin/pemasukan/mahasiswa/setoran'"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
