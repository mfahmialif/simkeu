<script setup>
import FormDeposit from "@/components/admin/deposit/FormDeposit.vue";
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
      router.push("/admin/pemasukan/mahasiswa/catatan-deposit"),
  },
];

onMounted(() => {
  document.title = "Catatan Deposit Add - SIMKEU";
});

onMounted(() => {});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Tambah Catatan Deposit">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <FormDeposit
            typeForm="add"
            :url="'/admin/pemasukan/mahasiswa/catatan-deposit'"
            :isRoleVisible="true"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
