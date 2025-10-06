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

const passwordValidator = (value) => {
  if (value.length < 6) return "Password must be at least 6 characters";
  return true;
};

const noSpaceValidator = (value) => {
  if (/\s/.test(value))
    return "Username cannot contain spaces, example: fulanah123";
  return true;
};

const refForm = ref(null);

const tgl = ref("");
const jumlah = ref("");
const kategori = ref("");
const keterangan = ref("");
const disabled = ref(false);
const KategoriList = ["SPP", "Registrasi", "Donasi", "Lainnya"];

const fetchJenisKelamin = async () => {
  try {
    const response = await $api("/helper/get-enum-values", {
      method: "GET",
      body: {
        table: "users",
        column: "jenis_kelamin",
        "delete_column[]": ["*"],
      },
    });

    jenisKelamin.value = response.map((jenisKelamin) => {
      return {
        title: jenisKelamin,
        value: jenisKelamin,
      };
    });
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  // fetchJenisKelamin();
  if (props.typeForm === "edit") {
    nim.value = props.dataForm.nim;
    tgl.value = props.dataForm.tgl;
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
  formData.append("nim", nim.value);
  formData.append("tgl", tgl.value);
  formData.append("kategori", kategori.value);
  formData.append("jumlah", jumlah.value);
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
          v-model="tgl"
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
        />
      </VCol>
      <VCol cols="12">
        <VTextField
          v-model="jk"
          :items="KategoriList"
          :rules="[requiredValidator]"
          label="Kategori"
        />
      </VCol>
      <VCol cols="12">
        <VTextarea
          v-model="jk"
          :rules="[requiredValidator]"
          label="Jenis Kelamin"
        />
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
