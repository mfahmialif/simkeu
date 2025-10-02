<script setup>
import FormJenisPembayaran from '@/components/admin/pemasukan/mahasiswa/master/jenis-pembayaran/FormJenisPembayaran.vue';
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

    const response = await $api('/admin/pemasukan/mahasiswa/jenis-pembayaran/' + id, {
      method: "GET",
    })
    console.log(response)
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
    clickHandler: () => router.push('/admin/pemasukan/mahasiswa/master/jenis-pembayaran'),
  },
]

onMounted(() => {
  document.title = 'Jenis Pembayaran Edit - SIMKEU'
  fetchData()
})

</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Edit Data Jenis Pembayaran">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <div v-if="isLoading" class="text-center">
            <VProgressLinear indeterminate />
          </div>
          <FormJenisPembayaran v-else typeForm="edit" :dataForm="data"
            :url="'/admin/pemasukan/mahasiswa/jenis-pembayaran/' + id" :is-role-visible="true" />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
