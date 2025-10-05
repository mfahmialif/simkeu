<script setup>
import FormTagihan from '@/components/admin/pemasukan/mahasiswa/master/tagihan/FormTagihan.vue';
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
    clickHandler: () => router.push('/admin/pemasukan/master/tagihan'),
  },
]

onMounted(() => {
  document.title = 'Tagihan Add - SIMKEU'
})

onMounted(() => {
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Tambah Data Tagihan">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <FormTagihan typeForm="add" :url="'/admin/pemasukan/mahasiswa/tagihan'" />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
