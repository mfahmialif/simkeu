<script setup>
import FormMataUang from "@/components/admin/mata-uang/FormMataUang.vue"
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
    clickHandler: () => router.push("/admin/setting/mata-uang"),
  },
]

onMounted(() => {
  document.title = "Mata Uang Add - SIMKEU"
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Tambah Data Mata Uang">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <FormMataUang
            type-form="add"
            url="/admin/mata-uang"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
