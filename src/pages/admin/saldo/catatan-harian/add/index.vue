<script setup>
import FormCatatanHarian from '@/components/admin/saldo/catatan-harian/FormCatatanHarian.vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const menuList = [
  {
    title: 'Kembali',
    value: 'back',
    icon: 'ri-arrow-left-line',
    clickHandler: () => router.back(),
  },
  {
    title: 'Lihat Data',
    value: 'lihat-data',
    icon: 'ri-eye-line',
    clickHandler: () => router.push('/admin/saldo/catatan-harian'),
  },
]

onMounted(() => {
  document.title = 'Tambah Catatan Harian - SIMKEU'
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Tambah Catatan Harian">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <FormCatatanHarian typeForm="add" :url="'/admin/saldo/catatan-harian'" />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
