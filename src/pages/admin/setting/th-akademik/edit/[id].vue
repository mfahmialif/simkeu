<script setup>
import FormThAkademik from '@/components/admin/th-akademik/FormThAkademik.vue';
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()

const id = route.params.id

const thAkademik = ref({})
const isLoading = ref(false)

// Get user role for conditional rendering
const userData = useCookie("userData").value ?? {};
const isAdmin = computed(() => userData.role?.name === "admin");

const fetchThAkademik = async () => {
  try {
    isLoading.value = true

    const response = await $api('/admin/th-akademik/' + id, {
      method: "GET",
    })
    thAkademik.value = response;
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
    clickHandler: () => router.push('/admin/setting/th-akademik'),
  },
]

onMounted(() => {
  document.title = isAdmin.value ? 'Tahun Akademik Edit - SIMKEU' : 'Tahun Akademik View - SIMKEU'
  fetchThAkademik()
})

</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard :title="isAdmin ? 'Edit Tahun Akademik' : 'Detail Tahun Akademik'">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <div v-if="isLoading" class="text-center">
            <VProgressLinear indeterminate />
          </div>
          <FormThAkademik 
            v-else 
            typeForm="edit" 
            :dataForm="thAkademik" 
            :url="'/admin/th-akademik/' + id" 
            :readOnly="!isAdmin"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
