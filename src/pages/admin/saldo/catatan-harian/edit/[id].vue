<script setup>
import FormCatatanHarian from '@/components/admin/saldo/catatan-harian/FormCatatanHarian.vue';
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

    const response = await $api('/admin/saldo/catatan-harian/' + id, {
      method: "GET",
    })

    data.value = response.data;
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
  {
    title: 'Lihat Data',
    value: 'lihat-data',
    icon: 'ri-eye-line',
    clickHandler: () => router.push('/admin/saldo/catatan-harian'),
  },
]

onMounted(() => {
  document.title = 'Edit Catatan Harian - SIMKEU'
  fetchData()
})

</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Edit Catatan Harian">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <div v-if="isLoading" class="text-center">
            <VProgressLinear indeterminate />
          </div>
          <FormCatatanHarian v-else typeForm="edit" :dataForm="data" :url="'/admin/saldo/catatan-harian/' + id" />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
