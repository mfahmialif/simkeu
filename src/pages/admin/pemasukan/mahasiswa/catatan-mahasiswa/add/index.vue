<script setup>
import FormCatatanMahasiswa from "@/components/admin/catatan-mahasiswa/FormCatatanMahasiswa.vue"
import { useRouter } from "vue-router"

const router = useRouter()

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
    clickHandler: () =>
      router.push("/admin/pemasukan/mahasiswa/catatan-mahasiswa"),
  },
]

onMounted(() => {
  document.title = "Tambah Catatan Mahasiswa - SIMKEU"
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Tambah Catatan Mahasiswa">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <FormCatatanMahasiswa
            type-form="add"
            url="/admin/pemasukan/mahasiswa/catatan-mahasiswa"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
