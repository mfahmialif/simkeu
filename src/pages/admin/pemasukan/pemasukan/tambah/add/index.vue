<script setup>
import FormTambahPemasukan from '@/components/admin/pemasukan/pemasukan/tambah/FormTambahPemasukan.vue';
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
          <FormTambahPemasukan typeForm="add" :url="'/admin/pemasukan/pemasukan/tambah'" />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
