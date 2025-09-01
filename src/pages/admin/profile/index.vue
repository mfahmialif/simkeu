<script setup>
import FormProfile from '@/components/admin/profile/FormProfile.vue';
import UserProfileheader from '@/components/admin/profile/UserProfileHeader.vue';
import { onMounted } from 'vue';

const user = ref({})
const isLoading = ref(false)
const isEditable = ref(false)

const avatar = ref(null)

const fetchUser = async () => {
  try {
    isLoading.value = true
    const response = await $api('/profil/', {
      method: "GET",
    })
    if (response.user.avatar) {
      response.user.avatar = import.meta.env.VITE_BASE_URL + "/avatar/" + response.user.avatar
    } else {
      response.user.avatar = '/images/avatars/avatar-1.png'
    }

    avatar.value = response.user.avatar

    user.value = response.user
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  document.title = 'Profile - SIMKEU'
  fetchUser()
})

</script>

<template>
  <div>
    <UserProfileheader class="mb-6" v-model:isEditable="isEditable" :user="user" :avatar="avatar"  />

    <VCard>
      <VCardText>
        <div v-if="isLoading" class="text-center">
          <VProgressLinear indeterminate />
        </div>
        <FormProfile :dataForm="user" :isEditable="isEditable" v-model:avatar="avatar" />
      </VCardText>
    </VCard>
  </div>
</template>
