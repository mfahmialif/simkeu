<script setup>
import FormSyaratTagihan from '@/components/admin/syarat-tagihan/FormSyaratTagihan.vue';
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()

const id = route.params.id

const syaratTagihan = ref({})
const isLoading = ref(false)

// Get user role for conditional rendering
const userData = useCookie("userData").value ?? {};
const isAdmin = computed(() => userData.role?.name === "admin");

const fetchSyaratTagihan = async () => {
  try {
    isLoading.value = true

    const response = await $api('/admin/syarat-tagihan/' + id, {
      method: "GET",
    })
    syaratTagihan.value = response.data;
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
    clickHandler: () => router.push('/admin/setting/syarat-tagihan'),
  },
]

onMounted(() => {
  document.title = isAdmin.value ? 'Syarat Tagihan Edit - SIMKEU' : 'Syarat Tagihan View - SIMKEU'
  fetchSyaratTagihan()
})

</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard :title="isAdmin ? 'Edit Syarat Tagihan' : 'Detail Syarat Tagihan'">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <div v-if="isLoading" class="text-center">
            <VProgressLinear indeterminate />
          </div>
          <FormSyaratTagihan 
            v-else 
            typeForm="edit" 
            :dataForm="syaratTagihan" 
            :url="'/admin/syarat-tagihan/' + id" 
            :readOnly="!isAdmin"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
