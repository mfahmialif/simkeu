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
const tglMulai = ref(null);
const tglSelesai = ref(null);
const semester = ref("");
const aktif = ref("Y");
const disabled = ref(false);

const aktifOptions = [
  { title: "Aktif", value: "Y" },
  { title: "Tidak Aktif", value: "T" },
];

onMounted(() => {
  if (props.typeForm === "edit" && props.dataForm) {
    kode.value = props.dataForm.kode || "";
    nama.value = props.dataForm.nama || "";
    tglMulai.value = props.dataForm.tgl_mulai ? props.dataForm.tgl_mulai.slice(0, 16) : null;
    tglSelesai.value = props.dataForm.tgl_selesai ? props.dataForm.tgl_selesai.slice(0, 16) : null;
    semester.value = props.dataForm.semester || "";
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
        tgl_mulai: tglMulai.value,
        tgl_selesai: tglSelesai.value,
        semester: semester.value,
        aktif: aktif.value,
      },
    });

    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: "success",
      });

      router.push("/admin/setting/form-schadule");
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
          placeholder="REG"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="nama"
          :rules="[requiredValidator]"
          label="Nama"
          placeholder="Reguler"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="tglMulai"
          label="Tanggal Mulai"
          type="datetime-local"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="tglSelesai"
          label="Tanggal Selesai"
          type="datetime-local"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="semester"
          label="Semester"
          placeholder="Ganjil"
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
