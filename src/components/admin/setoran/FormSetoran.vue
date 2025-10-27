<script setup>
import { showSnackbar } from "@/composables/snackbar";

const router = useRouter();

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
    required: false,
  },
  isRoleVisible: {
    type: Boolean,
    required: false,
  },
});

const refForm = ref(null);

const tanggal = ref("");
const jumlah = ref("");
const kategori = ref("");
const keterangan = ref("");

const disabled = ref(false);
const KategoriList = ["Putra", "Putri"];

onMounted(() => {
  tanggal.value = new Date().toISOString().split("T")[0];
  
  if (props.typeForm === "edit") {
    tanggal.value = props.dataForm.tanggal;
    kategori.value = props.dataForm.kategori;
    jumlah.value = props.dataForm.jumlah;
    keterangan.value = props.dataForm.keterangan;
  }
});

const onSubmit = async () => {
  const valid = await refForm.value.validate();
  if (!valid.valid) return;

  const method = props.typeForm === "edit" ? "PUT" : "POST";

  disabled.value = true;

  const formData = new FormData();
  formData.append("tanggal", tanggal.value);
  formData.append("jumlah", jumlah.value);
  formData.append("kategori", kategori.value);
  formData.append("keterangan", keterangan.value);
  formData.append("_method", method);

  try {
    const response = await $api(props.url, {
      method: "POST",
      body: formData,
      onResponseError({ response }) {
        console.error(response);
      },
    });

    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: "success",
      });

      router.push("/admin/pemasukan/mahasiswa/setoran");
    } else {
      showSnackbar({
        text: response.message,
        color: "error",
      });
    }
  } catch (err) {
    const message = Array.isArray(err.data.message)
      ? err.data.message.join("; ")
      : err.data.message;
    showSnackbar({
      text: message,
      color: "error",
    });
  } finally {
    disabled.value = false;
  }
};
</script>

<template>
  <VForm ref="refForm" @submit.prevent="onSubmit">
    <VRow>
      <VCol cols="12">
        <VTextField
          v-model="tanggal"
          :rules="[requiredValidator]"
          type="date"
          label="Tanggal"
        />
      </VCol>
      <VCol cols="12">
        <VTextField
          v-model="jumlah"
          :rules="[requiredValidator]"
          label="Jumlah"
          type="number"
          :hint="formatRupiah(jumlah)"
          :persistent-hint="true"
        />
      </VCol>
      <VCol cols="12">
        <VCombobox
          v-model="kategori"
          :items="KategoriList"
          :rules="[requiredValidator]"
          label="Kategori"
          autocomplete="off"
        />
      </VCol>
      <VCol cols="12">
        <VTextarea v-model="keterangan" label="Keterangan" />
      </VCol>
      <VCol cols="12" class="d-flex gap-4">
        <VBtn type="submit" :disabled @click="refForm?.validate()">
          Submit
        </VBtn>
        <VBtn
          type="reset"
          v-if="typeForm !== 'edit'"
          color="secondary"
          variant="tonal"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
