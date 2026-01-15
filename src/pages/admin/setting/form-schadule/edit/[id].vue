<script setup>
import FormFormSchadule from '@/components/admin/form-schadule/FormFormSchadule.vue';
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()

const id = route.params.id

const formSchadule = ref({})
const isLoading = ref(false)

// Get user role for conditional rendering
const userData = useCookie("userData").value ?? {};
const isAdmin = computed(() => userData.role?.name === "admin");

const fetchFormSchadule = async () => {
  try {
    isLoading.value = true

    const response = await $api('/admin/form-schadule/' + id, {
      method: "GET",
    })
    formSchadule.value = response.data;
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
    clickHandler: () => router.push('/admin/setting/form-schadule'),
  },
]

onMounted(() => {
  document.title = isAdmin.value ? 'Form Schedule Edit - SIMKEU' : 'Form Schedule View - SIMKEU'
  fetchFormSchadule()
})

</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard :title="isAdmin ? 'Edit Form Schedule' : 'Detail Form Schedule'">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <div v-if="isLoading" class="text-center">
            <VProgressLinear indeterminate />
          </div>
          <FormFormSchadule 
            v-else 
            typeForm="edit" 
            :dataForm="formSchadule" 
            :url="'/admin/form-schadule/' + id" 
            :readOnly="!isAdmin"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
