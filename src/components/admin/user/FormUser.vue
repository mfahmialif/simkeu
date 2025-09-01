<script setup>
import { showSnackbar } from '@/composables/snackbar'

const router = useRouter()

const props = defineProps({
  typeForm: {
    type: String,
    default: '',
  },
  dataForm: {
    type: Object,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
  isRoleVisible : {
    type: Boolean,
    required: false,
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
const previewUrl = ref('/images/avatars/avatar-1.png')

const selectedRole = ref();
const role = ref([]);
const fetchRole = async () => {
  try {
    const { data } = await $api('/role', {
      method: "GET",
    })

    role.value = data.data.map(role => {
      return {
        title: role.name,
        value: role.id,
      }
    })
  } catch (err) {
    console.error(err)
  }
}

const selectedJenisKelamin = ref();
const jenisKelamin = ref([]);
const fetchJenisKelamin = async () => {
  try {
    const response = await $api('/helper/get-enum-values', {
      method: "GET",
      body: {
        table: 'users',
        column: 'jenis_kelamin',
        'delete_column[]': ["*"]
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

const passwordRules = ref([requiredValidator, passwordValidator]);

onMounted(() => {
  fetchRole()
  fetchJenisKelamin()

  if (props.typeForm === 'edit') {
    username.value = props.dataForm.username
    name.value = props.dataForm.name
    email.value = props.dataForm.email
    selectedRole.value = props.dataForm.role_id
    selectedJenisKelamin.value = props.dataForm.jenis_kelamin
    previewUrl.value = import.meta.env.VITE_BASE_URL + "/avatar/" + props.dataForm.avatar

    passwordRules.value = []
  }
})

watch(avatar, (newFile) => {
  console.log(avatar, newFile);
  if (newFile instanceof File) {
    previewUrl.value = URL.createObjectURL(newFile)
  } else {
    console.log('else');
    previewUrl.value = null
  }
})

const onSubmit = async () => {
  const valid = await refForm.value.validate()
  if (!valid.valid) return

  const method = props.typeForm === 'edit' ? 'PUT' : 'POST'

  disabled.value = true

  const formData = new FormData()
  formData.append('username', username.value)
  formData.append('name', name.value)
  formData.append('email', email.value)
  if (typeof password.value !== 'undefined') {
    formData.append('password', password.value)
    formData.append('password_confirmation', passwordConfirmation.value)
  }
  formData.append('role_id', selectedRole.value)
  formData.append('jenis_kelamin', selectedJenisKelamin.value)
  formData.append('_method', method)

  if (avatar.value instanceof File) {
    formData.append('avatar', avatar.value)
  }

  try {
    const response = await $api(props.url, {
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

      router.push('/admin/user')
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
        <VTextField v-model="username" :rules="[requiredValidator, noSpaceValidator]" label="Username"
          placeholder="fulanah123" />
      </VCol>

      <VCol cols="12">
        <VTextField v-model="name" :rules="[requiredValidator]" label="Name" placeholder="Fulan Fulanah" />
      </VCol>

      <VCol cols="12">
        <VTextField v-model="email" :rules="[requiredValidator, emailValidator]" label="Email" type="email"
          placeholder="fulanah@example.com" />
      </VCol>

      <VCol cols="12">
        <VTextField v-model="password" :rules="passwordRules" :type="isPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'" label="Password" autocomplete="on"
          type="password" placeholder="············" @click:append-inner="isPasswordVisible = !isPasswordVisible" />
      </VCol>

      <VCol cols="12">
        <VTextField v-model="passwordConfirmation" :rules="[confirmedValidator(passwordConfirmation, password)]"
          :type="isConfirmPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isConfirmPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
          label="Password Confirmation" autocomplete="on" type="password" placeholder="············"
          @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible" />
      </VCol>

      <VCol cols="12" v-if="isRoleVisible">
        <VSelect v-model="selectedRole" label="Select Role" placeholder="Select Role" :items="role"
          :rules="[requiredValidator]" clearable clear-icon="ri-close-line" />
      </VCol>

      <VCol cols="12">
        <VSelect v-model="selectedJenisKelamin" label="Select Jenis Kelamin" placeholder="Select Role"
          :items="jenisKelamin" :rules="[requiredValidator]" clearable clear-icon="ri-close-line" />
      </VCol>

      <VCol cols="12" v-if="previewUrl">
        <img :src="previewUrl" alt="Preview" class="rounded photo" cover />
      </VCol>

      <VCol cols="12">
        <VFileInput v-model="avatar" :prepend-icon="null" label="Upload Photo" accept="image/png, image/jpeg" />
      </VCol>

      <VCol cols="12" class="d-flex gap-4">
        <VBtn type="submit" :disabled @click="refForm?.validate()">
          Submit
        </VBtn>

        <VBtn type="reset" v-if="typeForm !== 'edit'" color="secondary" variant="tonal">
          Reset
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
