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
})

const refForm = ref(null)

const nama = ref('')
const nomer_rekening = ref('')
const kategori = ref('')
const keterangan = ref('')

const disabled = ref(false)

onMounted(() => {
  if (props.typeForm === 'edit') {
    nama.value = props.dataForm.nama
    nomer_rekening.value = props.dataForm.nomer_rekening
    kategori.value = props.dataForm.kategori
    keterangan.value = props.dataForm.keterangan
  }
})

const onSubmit = async () => {
  const valid = await refForm.value.validate()
  if (!valid.valid) return

  const method = props.typeForm === 'edit' ? 'PUT' : 'POST'

  disabled.value = true

  const formData = new FormData()
  formData.append('nama', nama.value)
  formData.append('nomer_rekening', nomer_rekening.value)
  formData.append('kategori', kategori.value)
  formData.append('keterangan', keterangan.value)

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

      router.push('/admin/pemasukan/mahasiswa/master/jenis-pembayaran')
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
        <VTextField v-model="nama" :rules="[requiredValidator]" label="Nama" placeholder="Fulan Fulanah" />
      </VCol>
      <VCol cols="12">
        <VTextField v-model="nomer_rekening" :rules="[requiredValidator]" label="Nomer Rekening"
          placeholder="0000000000" />
      </VCol>
      <VCol cols="12">
        <VTextField v-model="kategori" :rules="[requiredValidator]" label="Kategori" placeholder="Putra / Putri" />
      </VCol>
      <VCol cols="12">
        <VTextarea v-model="keterangan" label="Keterangan" placeholder="Type here..." auto-grow />
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
