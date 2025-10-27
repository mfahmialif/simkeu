<script setup>
import FormPengeluaran from '@/components/admin/pengeluaran/FormPengeluaran.vue';
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
    clickHandler: () => router.push('/admin/pengeluaran'),
  },
]

onMounted(() => {
  document.title = 'Tambah Data Pengeluaran - SIMKEU'
})

onMounted(() => {
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Tambah Data Pengeluaran">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <FormPengeluaran typeForm="add" :url="'/admin/pengeluaran'" />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
