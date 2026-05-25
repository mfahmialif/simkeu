<script setup>
import FormTagihan from '@/components/admin/pemasukan/mahasiswa/master/tagihan/FormTagihan.vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const nim = computed(() => String(route.query.nim || ""));

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
    clickHandler: () => router.push('/admin/pemasukan/mahasiswa/tagihan-perorangan'),
  },
];

onMounted(() => {
  document.title = 'Tagihan Perorangan Add - SIMKEU';
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Tambah Tagihan Perorangan">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <FormTagihan
            type-form="add"
            url="/admin/pemasukan/mahasiswa/tagihan-perorangan"
            show-nim
            search-nim
            :nim="nim"
            :default-th-angkatan-id="route.query.th_angkatan_id"
            :default-prodi-id="route.query.prodi_id"
            :default-double-degree="route.query.double_degree"
            :default-kelas-id="route.query.kelas_id"
            use-active-th-akademik
            submit-redirect="/admin/pemasukan/mahasiswa/tagihan-perorangan"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
