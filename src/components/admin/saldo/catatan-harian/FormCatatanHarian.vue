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

const saldo_id = ref('')
const tipe = ref('pemasukan')
const jumlah = ref('')
const tanggal = ref(new Date().toISOString().slice(0, 10))
const keterangan = ref('')

const saldoList = ref([])
const disabled = ref(false)

const tipeList = [
  { title: 'Pemasukan', value: 'pemasukan' },
  { title: 'Pengeluaran', value: 'pengeluaran' },
]

const fetchSaldoList = async () => {
  try {
    const { data } = await $api('/admin/saldo/kategori', {
      method: 'GET',
      body: { limit: 0, sort_key: 'nama', sort_order: 'asc' },
    })
    saldoList.value = (data.data || []).map(i => ({
      title: `${i.kode} - ${i.nama}`,
      value: i.id,
    }))
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchSaldoList()
  if (props.typeForm === 'edit' && props.dataForm) {
    saldo_id.value = props.dataForm.saldo_id
    tipe.value = props.dataForm.tipe
    jumlah.value = props.dataForm.jumlah
    tanggal.value = props.dataForm.tanggal
    keterangan.value = props.dataForm.keterangan
  }
})

const onSubmit = async () => {
  const valid = await refForm.value.validate()
  if (!valid.valid) return

  const method = props.typeForm === 'edit' ? 'PUT' : 'POST'

  disabled.value = true

  const formData = new FormData()
  formData.append('saldo_id', saldo_id.value)
  formData.append('tipe', tipe.value)
  formData.append('jumlah', jumlah.value)
  formData.append('tanggal', tanggal.value)
  formData.append('keterangan', keterangan.value || '')
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

      router.push('/admin/saldo/catatan-harian')
    } else {
      showSnackbar({
        text: response.message,
        color: 'error',
      })
    }

  } catch (err) {
    const message = Array.isArray(err.data?.message)
      ? err.data.message.join('; ')
      : err.data?.message || 'Terjadi kesalahan.';
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
      <VCol cols="12" md="6">
        <VSelect
          v-model="saldo_id"
          :items="saldoList"
          :rules="[requiredValidator]"
          label="Kategori Saldo"
          placeholder="Pilih Kategori Saldo"
        />
      </VCol>
      <VCol cols="12" md="6">
        <VSelect
          v-model="tipe"
          :items="tipeList"
          :rules="[requiredValidator]"
          label="Tipe"
          placeholder="Pilih Tipe"
        />
      </VCol>
      <VCol cols="12" md="6">
        <VTextField
          v-model="jumlah"
          :rules="[requiredValidator]"
          label="Jumlah"
          placeholder="1000000"
          type="number"
        />
      </VCol>
      <VCol cols="12" md="6">
        <VTextField
          v-model="tanggal"
          :rules="[requiredValidator]"
          label="Tanggal"
          type="date"
        />
      </VCol>
      <VCol cols="12">
        <VTextarea
          v-model="keterangan"
          label="Keterangan"
          placeholder="Catatan..."
          auto-grow
        />
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
