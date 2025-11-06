<script setup>
import FormTambahPemasukan from '@/components/admin/pemasukan/pemasukan/tambah/FormTambahPemasukan.vue';
import FormKategori from '@/components/admin/saldo/kategori/FormKategori.vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()

const id = route.params.id

const data = ref({})
const isLoading = ref(false)

const fetchData = async () => {
  try {
    isLoading.value = true

    const response = await $api('/admin/pemasukan/pemasukan/tambah/' + id, {
      method: "GET",
    })

    data.value = response;
  } catch (err) {
    console.log(err);
    if (err.status === 404) {
      router.replace("/not-found");
    }
  } finally {
    isLoading.value = false
  }
}

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
    clickHandler: () => router.push('/admin/pemasukan/pemasukan/tambah'),
  },
]

onMounted(() => {
  document.title = 'Pemasukan Edit - SIMKEU'
  fetchData()
})

</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Edit Data Pemasukan">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <div v-if="isLoading" class="text-center">
            <VProgressLinear indeterminate />
          </div>
          <FormTambahPemasukan v-else typeForm="edit" :dataForm="data" :url="'/admin/pemasukan/pemasukan/tambah/' + id" />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
