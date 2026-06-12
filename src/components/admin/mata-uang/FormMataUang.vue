<script setup>
import { showSnackbar } from "@/composables/snackbar"

const props = defineProps({
  typeForm: {
    type: String,
    default: "",
  },
  dataForm: {
    type: Object,
    required: false,
  },
  url: {
    type: String,
    required: true,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()

const refForm = ref(null)
const kode = ref("")
const nama = ref("")
const simbol = ref("")
const aktif = ref(true)
const disabled = ref(false)

onMounted(() => {
  if (props.typeForm === "edit" && props.dataForm) {
    kode.value = props.dataForm.kode || ""
    nama.value = props.dataForm.nama || ""
    simbol.value = props.dataForm.simbol || ""
    aktif.value = Boolean(props.dataForm.aktif)
  }
})

const onSubmit = async () => {
  const valid = await refForm.value.validate()
  if (!valid.valid) return

  const method = props.typeForm === "edit" ? "PUT" : "POST"

  disabled.value = true

  try {
    const response = await $api(props.url, {
      method,
      body: {
        kode: kode.value,
        nama: nama.value,
        simbol: simbol.value,
        aktif: aktif.value ? 1 : 0,
      },
    })

    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: "success",
      })

      router.push("/admin/setting/mata-uang")
    } else {
      showSnackbar({
        text: response.message,
        color: "error",
      })
    }
  } catch (err) {
    const message =
      typeof err.data?.message === "object"
        ? Object.values(err.data.message).flat().join("; ")
        : err.data?.message || "Terjadi kesalahan."

    showSnackbar({
      text: message,
      color: "error",
    })
  } finally {
    disabled.value = false
  }
}
</script>

<template>
  <VForm
    ref="refForm"
    @submit.prevent="onSubmit"
  >
    <VRow>
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="kode"
          :rules="[requiredValidator]"
          label="Kode"
          placeholder="IDR"
          :readonly="readOnly"
          maxlength="10"
          @update:model-value="kode = String($event || '').toUpperCase()"
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="simbol"
          label="Simbol"
          placeholder="Rp"
          :readonly="readOnly"
          maxlength="10"
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="nama"
          :rules="[requiredValidator]"
          label="Nama Mata Uang"
          placeholder="Rupiah"
          :readonly="readOnly"
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VSwitch
          v-model="aktif"
          :label="aktif ? 'Aktif' : 'Tidak Aktif'"
          color="success"
          :readonly="readOnly"
          hide-details
        />
      </VCol>

      <VCol
        v-if="!readOnly"
        cols="12"
        class="d-flex gap-4"
      >
        <VBtn
          type="submit"
          :disabled
        >
          Submit
        </VBtn>

        <VBtn
          v-if="typeForm !== 'edit'"
          type="reset"
          color="secondary"
          variant="tonal"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
