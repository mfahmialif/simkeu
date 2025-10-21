<script setup>
import FormDispensasiTagihan from "@/components/admin/pemasukan/mahasiswa/DispensasiTagihan/FormDispensasiTagihan.vue";
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
      router.push("/admin/pemasukan/mahasiswa/dispensasi-tagihan"),
  },
];

onMounted(() => {
  document.title = "Catatan Dispensasi Tagihan Add - SIMKEU";
});

onMounted(() => { });
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Tambah Catatan Dispensasi Tagihan">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <FormDispensasiTagihan typeForm="add" :url="'/admin/pemasukan/mahasiswa/dispensasi-tagihan'"
            :isRoleVisible="true" />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
