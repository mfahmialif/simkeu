<script setup>
import FormKategori from '@/components/admin/saldo/kategori/FormKategori.vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const menuList = [
  {
    title: 'Kembali',
    value: 'back',
    icon: 'ri-arrow-left-line',
    clickHandler: () => router.back(),
  },
  // {
  //   value: 'hr', // untuk divider
  // },
  {
    title: 'Lihat Data',
    value: 'lihat-data',
    icon: 'ri-eye-line',
    clickHandler: () => router.push('/admin/saldo/kategori'),
  },
]

onMounted(() => {
  document.title = 'Kategori Saldo Add - SIMKEU'
})

onMounted(() => {
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Tambah Data Kategori Saldo">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <FormKategori typeForm="add" :url="'/admin/saldo/kategori'" />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
