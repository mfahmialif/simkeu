<script setup>
import { showSnackbar } from '@/composables/snackbar'

const router = useRouter()

const props = defineProps({
  dataForm: {
    type: Object,
    required: true,
  },
  isEditable: {
    type: Boolean,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  }
})

const passwordValidator = value => {
  if (value.length < 6) return 'Password must be at least 6 characters'
  return true
}

const noSpaceValidator = value => {
  if (/\s/.test(value)) return 'Username cannot contain spaces, example: fulanah123'
  return true
}
const refForm = ref(null)

const username = ref('')
const name = ref('')
const email = ref('')
const password = ref()
const passwordConfirmation = ref()
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const avatar = ref(null)
const disabled = ref(false)

const selectedJenisKelamin = ref();
const jenisKelamin = ref([]);
const fetchJenisKelamin = async () => {
  try {
    const response = await $api('/helper/get-enum-values', {
      method: "GET",
      body: {
        table: 'users',
        column: 'jenis_kelamin',
        // 'delete_column[]': ["*"]
      }
    })

    jenisKelamin.value = response.map(jenisKelamin => {
      return {
        title: jenisKelamin,
        value: jenisKelamin,
      }
    })
  } catch (err) {
    console.error(err)
  }
}

const emit = defineEmits(['update:avatar'])

watch(avatar, (newFile) => {
  let url = null

  if (newFile instanceof File) {
    url = URL.createObjectURL(newFile)
  } else {
    url = null
  }
  
  emit('update:avatar', url)
})

onMounted(() => {
  fetchJenisKelamin()
})

watch(() => props.dataForm, () => {
  username.value = props.dataForm.username
  name.value = props.dataForm.name
  email.value = props.dataForm.email
  selectedJenisKelamin.value = props.dataForm.jenis_kelamin
})


const onSubmit = async () => {
  const valid = await refForm.value.validate()
  if (!valid.valid) return

  disabled.value = true

  const formData = new FormData()
  formData.append('username', username.value)
  formData.append('name', name.value)
  formData.append('email', email.value)
  formData.append('role_id', props.dataForm.role_id)
  if (typeof password.value !== 'undefined') {
    formData.append('password', password.value)
    formData.append('password_confirmation', passwordConfirmation.value)
  }
  formData.append('jenis_kelamin', selectedJenisKelamin.value)
  formData.append('_method', 'PUT')

  if (avatar.value instanceof File) {
    formData.append('avatar', avatar.value)
  }

  try {
    const response = await $api('/admin/profil', {
      method: 'POST',
      body: formData,
      onResponseError({ response }) {
        console.error(response)
      },
    })

    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: 'success',
      })
    } else {
      showSnackbar({
        text: response.message,
        color: 'error',
      })

    }

  } catch (err) {
    const message = Array.isArray(err.data.message)
      ? err.data.message.join('; ')
      : err.data.message;
    showSnackbar({
      text: message,
      color: 'error',
    })
  } finally {
    disabled.value = false
  }
}
</script>

<template>
  <VForm ref="refForm" @submit.prevent="onSubmit">
    <VRow>
      <VCol cols="12">
        <VTextField v-model="username" :readonly="!isEditable" :rules="[requiredValidator, noSpaceValidator]"
          label="Username" placeholder="fulanah123" />
      </VCol>

      <VCol cols="12">
        <VTextField v-model="name" :readonly="!isEditable" :rules="[requiredValidator]" label="Name"
          placeholder="Fulan Fulanah" />
      </VCol>

      <VCol cols="12">
        <VTextField v-model="email" :readonly="!isEditable" :rules="[requiredValidator, emailValidator]" label="Email"
          type="email" placeholder="fulanah@example.com" />
      </VCol>

      <VCol cols="12">
        <VSelect v-model="selectedJenisKelamin" :readonly="!isEditable" label="Select Jenis Kelamin"
          placeholder="Select Role" :items="jenisKelamin" :rules="[requiredValidator]" clearable
          clear-icon="ri-close-line" />
      </VCol>

      <VCol cols="12">
        <VFileInput v-model="avatar" :readonly="!isEditable" :prepend-icon="null" label="Upload Photo"
          accept="image/png, image/jpeg" />
      </VCol>

      <VCol cols="12" sm="6">
        <VTextField v-model="password" :readonly="!isEditable" :type="isPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'" label="Password" autocomplete="on"
          type="password" placeholder="············" @click:append-inner="isPasswordVisible = !isPasswordVisible" />
      </VCol>

      <VCol cols="12" sm="6">
        <VTextField v-model="passwordConfirmation" :readonly="!isEditable"
          :rules="[confirmedValidator(passwordConfirmation, password)]"
          :type="isConfirmPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isConfirmPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
          label="Password Confirmation" autocomplete="on" type="password" placeholder="············"
          @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible" />
      </VCol>

      <VCol cols="12" class="d-flex gap-4" v-if="!!isEditable">
        <VBtn type="submit" :disabled @click="refForm?.validate()">
          Submit
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>

<style lang="scss">
.photo {
  block-size: 100px;
}
</style>
