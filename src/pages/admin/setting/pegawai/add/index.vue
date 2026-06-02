<script setup>
import FormPegawai from "@/components/admin/pegawai/FormPegawai.vue";

const router = useRouter();
const userData = useCookie("userData").value ?? {};
const isAdmin = computed(
  () => String(userData.role?.name || "").toLowerCase() === "admin"
);

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
    clickHandler: () => router.push("/admin/pegawai"),
  },
];

onMounted(() => {
  document.title = "Pegawai Add - SIMKEU";

  if (!isAdmin.value) {
    router.replace({ name: "not-authorized" });
  }
});
</script>

<template>
  <VRow v-if="isAdmin">
    <VCol cols="12">
      <VCard title="Tambah Data Pegawai">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <FormPegawai typeForm="add" :url="'/admin/pegawai'" />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
