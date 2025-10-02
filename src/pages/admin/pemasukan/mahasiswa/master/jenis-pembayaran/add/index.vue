<script setup>
import FormJenisPembayaran from '@/components/admin/pemasukan/mahasiswa/master/jenis-pembayaran/FormJenisPembayaran.vue';
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
    clickHandler: () => router.push('/admin/pemasukan/master/jenis-pembayaran'),
  },
]

onMounted(() => {
  document.title = 'Jenis Pembayaran Add - SIMKEU'
})

onMounted(() => {
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Tambah Data Jenis Pembayaran">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <FormJenisPembayaran typeForm="add" :url="'/admin/pemasukan/mahasiswa/jenis-pembayaran'" />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
