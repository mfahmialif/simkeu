<script setup>
import FormProdi from '@/components/admin/prodi/FormProdi.vue';
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()

const id = route.params.id

const prodi = ref({})
const isLoading = ref(false)

// Get user role for conditional rendering
const userData = useCookie("userData").value ?? {};
const isAdmin = computed(() => userData.role?.name === "admin");

const fetchProdi = async () => {
  try {
    isLoading.value = true

    const response = await $api('/admin/prodi/' + id, {
      method: "GET",
    })
    prodi.value = response.data;
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
    clickHandler: () => router.push('/admin/setting/prodi'),
  },
]

onMounted(() => {
  document.title = isAdmin.value ? 'Prodi Edit - SIMKEU' : 'Prodi View - SIMKEU'
  fetchProdi()
})

</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard :title="isAdmin ? 'Edit Data Prodi' : 'Detail Prodi'">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <div v-if="isLoading" class="text-center">
            <VProgressLinear indeterminate />
          </div>
          <FormProdi 
            v-else 
            typeForm="edit" 
            :dataForm="prodi" 
            :url="'/admin/prodi/' + id" 
            :readOnly="!isAdmin"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
