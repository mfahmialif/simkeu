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
  isRoleVisible: {
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

const selectedThAkademik = ref();
const thAkademik = ref([]);
const selectedThAngkatan = ref();
const thAngkatan = ref([]);
const selectedProdi = ref();
const prodi = ref([]);
const selectedFormSchadule = ref();
const formSchadule = ref([]);

const nama = ref('')
const jumlah = ref('')

const disabled = ref(false)

const passwordRules = ref([requiredValidator, passwordValidator]);


const fetchThAkademik = async () => {
  try {
    const { data } = await $api('/admin/th-akademik', {
      method: "GET",
      body: {
        limit: 0,
        sort_key: 'kode',
        sort_order: 'desc',
      }
    })

    thAkademik.value = data.data.map(thAkademik => {
      return {
        title: `${thAkademik.nama} - ${thAkademik.semester}`,
        value: thAkademik.id,
      }
    })
  } catch (err) {
    console.error(err)
  }
}
const fetchThAngkatan = async () => {
  try {
    const { data } = await $api('/admin/th-akademik', {
      method: "GET",
      body: {
        limit: 0,
        sort_key: 'kode',
        sort_order: 'desc',
        search: 'ganjil',
      }
    })

    thAngkatan.value = data.data.map(thAngkatan => {
      return {
        title: thAngkatan.kode.slice(0, -1),
        value: thAngkatan.id,
      }
    })
  } catch (err) {
    console.error(err)
  }
}
const fetchProdi = async () => {
  try {
    const { data } = await $api('/admin/prodi', {
      method: "GET",
      body: {
        limit: 0,
        sort_key: 'kode',
        sort_order: 'desc',
      }
    })

    prodi.value = data.data.map(prodi => {
      return {
        title: prodi.nama,
        value: prodi.id,
      }
    })
  } catch (err) {
    console.error(err)
  }
}
const fetchFormSchadule = async () => {
  try {
    const { data } = await $api('/admin/form-schadule', {
      method: "GET",
      body: {
        limit: 0,
      }
    })

    formSchadule.value = data.data.map(formSchadule => {
      return {
        title: formSchadule.nama,
        value: formSchadule.id,
      }
    })
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchThAkademik()
  fetchThAngkatan()
  fetchProdi()
  fetchFormSchadule()

  if (props.typeForm === 'edit') {
    selectedThAkademik.value = props.dataForm.th_akademik_id
    selectedThAngkatan.value = props.dataForm.th_angkatan_id
    selectedFormSchadule.value = props.dataForm.form_schadule_id
    selectedProdi.value = props.dataForm.prodi_id
    nama.value = props.dataForm.nama
    jumlah.value = props.dataForm.jumlah
  }
})


const onSubmit = async () => {
  const valid = await refForm.value.validate()
  if (!valid.valid) return

  const method = props.typeForm === 'edit' ? 'PUT' : 'POST'

  disabled.value = true

  const formData = new FormData()
  formData.append('th_akademik_id', selectedThAkademik.value)
  formData.append('th_angkatan_id', selectedThAngkatan.value)
  formData.append('prodi_id', selectedProdi.value)
  formData.append('form_schadule_id', selectedFormSchadule.value)
  formData.append('kelas_id', 6)
  formData.append('nama', nama.value)
  formData.append('jumlah', jumlah.value)

  formData.append('_method', method)

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

      router.push('/admin/pemasukan/mahasiswa/master/tagihan')
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
        <VSelect v-model="selectedThAkademik" label="Select Th Akademik" placeholder="Select Th Akademik"
          :items="thAkademik" :rules="[requiredValidator]" clear-icon="ri-close-line" />
      </VCol>
      <VCol cols="12">
        <VSelect v-model="selectedThAngkatan" label="Select Th Angkatan" placeholder="Select Th Angkatan"
          :items="thAngkatan" :rules="[requiredValidator]" clear-icon="ri-close-line" />
      </VCol>
      <VCol cols="12">
        <VSelect v-model="selectedProdi" label="Select Prodi" placeholder="Select Prodi" :items="prodi"
          :rules="[requiredValidator]" clear-icon="ri-close-line" />
      </VCol>
      <VCol cols="12">
        <VSelect v-model="selectedFormSchadule" label="Select Formulir" placeholder="Select Formulir"
          :items="formSchadule" :rules="[requiredValidator]" clear-icon="ri-close-line" />
      </VCol>

      <VCol cols="12">
        <VTextField v-model="nama" :rules="[requiredValidator, noSpaceValidator]" label="Nama" placeholder="KRS ...." />
      </VCol>
      <VCol cols="12">
        <VTextField v-model="jumlah" :rules="[requiredValidator, noSpaceValidator]" label="Jumlah"
          placeholder="10000..." type="number" />
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
