<script setup>
import FormPembayaranTagihan from "@/components/admin/pemasukan/mahasiswa/pembayaran/FormPembayaranTagihan.vue";
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
      router.push("/admin/pemasukan/mahasiswa/pembayaran/tambahan"),
  },
];

onMounted(() => {
  document.title = "Catatan Pembayaran  Tambahan Add - SIMKEU";
});

onMounted(() => {});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Tambah Catatan Pembayaran Tambahan">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>
        <VCardText>
          <FormPembayaranTagihan
            typeForm="add"
            :url="'/admin/pemasukan/mahasiswa/pembayaran/tambahan'"
            :isRoleVisible="true"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
