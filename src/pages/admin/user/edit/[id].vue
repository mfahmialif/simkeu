<script setup>
import FormUser from '@/components/admin/user/FormUser.vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()

const id = route.params.id

const user = ref({})
const isLoading = ref(false)

const fetchUser = async () => {
  try {
    isLoading.value = true

    const response = await $api('/admin/users/' + id, {
      method: "GET",
    })
    user.value = response;
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
    clickHandler: () => router.push('/admin/user'),
  },
]

onMounted(() => {
  document.title = 'Users Edit - SIMKEU'
  console.log('edit user id', id);
  fetchUser()
})

</script>

<template>
  <VAlert type="info" class="mb-3">
    Kosongkan <strong>password</strong> jika tidak ingin merubahnya!
  </VAlert>
  <VRow>
    <VCol cols="12">
      <VCard title="Edit Data User">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <div v-if="isLoading" class="text-center">
            <VProgressLinear indeterminate />
          </div>
          <FormUser v-else typeForm="edit" :dataForm="user" :url="'/users/' + id" />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
