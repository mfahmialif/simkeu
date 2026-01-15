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
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const refForm = ref(null);

const kode = ref("");
const nama = ref("");
const semester = ref("Ganjil");
const aktif = ref("Y");
const disabled = ref(false);

const semesterOptions = [
  { title: "Ganjil", value: "Ganjil" },
  { title: "Genap", value: "Genap" },
];

const aktifOptions = [
  { title: "Aktif", value: "Y" },
  { title: "Tidak Aktif", value: "T" },
];

onMounted(() => {
  if (props.typeForm === "edit" && props.dataForm) {
    kode.value = props.dataForm.kode || "";
    nama.value = props.dataForm.nama || "";
    semester.value = props.dataForm.semester || "Ganjil";
    aktif.value = props.dataForm.aktif || "Y";
  }
});

const onSubmit = async () => {
  const valid = await refForm.value.validate();
  if (!valid.valid) return;

  const method = props.typeForm === "edit" ? "PUT" : "POST";

  disabled.value = true;

  try {
    const response = await $api(props.url, {
      method: method,
      body: {
        kode: kode.value,
        nama: nama.value,
        semester: semester.value,
        aktif: aktif.value,
      },
    });

    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: "success",
      });

      router.push("/admin/setting/th-akademik");
    } else {
      showSnackbar({
        text: response.message,
        color: "error",
      });
    }
  } catch (err) {
    const message = typeof err.data?.message === 'object'
      ? Object.values(err.data.message).flat().join("; ")
      : err.data?.message || "Terjadi kesalahan.";
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
      <VCol cols="12" md="6">
        <VTextField
          v-model="kode"
          :rules="[requiredValidator]"
          label="Kode"
          placeholder="20241"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="nama"
          :rules="[requiredValidator]"
          label="Nama"
          placeholder="2024/2025"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VSelect
          v-model="semester"
          :rules="[requiredValidator]"
          label="Semester"
          :items="semesterOptions"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VSelect
          v-model="aktif"
          label="Status"
          :items="aktifOptions"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" class="d-flex gap-4" v-if="!readOnly">
        <VBtn type="submit" :disabled>
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
