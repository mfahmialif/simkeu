<script setup>
import FormThAkademik from "@/components/admin/th-akademik/FormThAkademik.vue";
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
    clickHandler: () => router.push("/admin/setting/th-akademik"),
  },
];

onMounted(() => {
  document.title = "Tahun Akademik Add - SIMKEU";
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Tambah Tahun Akademik">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <FormThAkademik
            typeForm="add"
            :url="'/admin/th-akademik'"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
