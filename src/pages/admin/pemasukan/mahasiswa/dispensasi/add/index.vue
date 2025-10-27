<script setup>
import FormDispensasi from "@/components/admin/pemasukan/mahasiswa/dispensasi/FormDispensasi.vue";
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
    clickHandler: () => router.push("/admin/pemasukan/mahasiswa/dispensasi"),
  },
];

onMounted(() => {
  document.title = "Catatan Dispensasi Add - SIMKEU";
});

</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Tambah Catatan Dispensasi">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <FormDispensasi typeForm="add" :url="'/admin/pemasukan/mahasiswa/dispensasi'" :isRoleVisible="true" />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
