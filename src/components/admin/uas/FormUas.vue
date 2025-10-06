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

const nim = ref("");
const prodi = ref("");
const tahun = ref("");
const kelas = ref("");
const semester = ref("");
const tanggal = ref("");
const keterangan = ref("");
const name = ref("");
const angkatan = ref("");
const disabled = ref(false);
const jenisKelamin = ref([]);
const jk = ref("");
const mataKuliah = ref("");
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
    tangg.value = props.dataForm.tanggal;
    name.value = props.dataForm.name;
    angkatan.value = props.dataForm.angkatan;
    prodi.value = props.dataForm.prodi;
    kelas.value = props.dataForm.kelas;
    semester.value = props.dataForm.semester;
    mataKuliah.value = props.dataForm.mataKuliah;
    keterangan.value = props.dataForm.keterangan;
    jk.value = props.dataForm.jk;
  }
});

const onSubmit = async () => {
  const valid = await refForm.value.validate();
  if (!valid.valid) return;

  const method = props.typeForm === "edit" ? "PUT" : "POST";

  disabled.value = true;

  const formData = new FormData();
  formData.append("nim", nim.value);
  formData.append("tanggal", tanggal.value);
  formData.append("mataKuliah", mataKuliah.value);
  formData.append("name", name.value);
  formData.append("prodi", prodi.value);
  formData.append("angkatan", angkatan.value);
  formData.append("kelas", kelas.value);
  formData.append("semester", semester.value);
  formData.append("jumlah", jumlah.value);
  formData.append("keterangan", keterangan.value);
  formData.append("jenis_kelamin", jk.value);
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

      router.push("/admin/pemasukan/mahasiswa/uas-susulan");
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
          placeholder="Fulan Fulanah"
        />
      </VCol>
      <VCol cols="12">
        <VCombobox
          v-model="Tahun"
          :items="tahunList"
          :rules="[requiredValidator]"
          label="Tahun Akademik"
        />
      </VCol>
      <VCol cols="12">
        <div class="d-flex align-items-center">
          <VTextField
            v-model="nim"
            :rules="[requiredValidator, noSpaceValidator]"
            label="Nim"
            placeholder="fulanah123"
          />
          <VBtn type="submit" :disabled class="ms-2" height="45px">
            <VIcon icon="ri-search-line"></VIcon>
          </VBtn>
        </div>
      </VCol>
      <VCol cols="12">
        <VTextField
          v-model="name"
          :rules="[requiredValidator]"
          disabled="true"
          label="Nama"
          placeholder="Fulan Fulanah"
        />
      </VCol>
      <VCol cols="12" md="6">
        <VTextField
          v-model="prodi"
          :rules="[requiredValidator]"
          disabled="true"
          label="Program Studi"
        />
      </VCol>
      <VCol cols="12" md="6">
        <VTextField
          v-model="jk"
          :rules="[requiredValidator]"
          disabled="true"
          label="Jenis Kelamin"
        />
      </VCol>
      <VCol cols="12" md="4">
        <VTextField
          v-model="angkatan"
          :rules="[requiredValidator]"
          disabled="true"
          label="Angkatan"
        />
      </VCol>
      <VCol cols="12" md="4">
        <VTextField
          v-model="kelas"
          :rules="[requiredValidator]"
          disabled="true"
          isabled
          label="Kelas"
        />
      </VCol>
      <VCol cols="12" md="4">
        <VTextField
          v-model="semester"
          :rules="[requiredValidator]"
          disabled="true"
          label="Semester"
        />
      </VCol>
      <VCol cols="12">
        <VTextField
          v-model="mataKuliah"
          :rules="[requiredValidator]"
          label="mataKuliah"
        />
      </VCol>
      <VCol cols="12">
        <VTextField
          v-model="keterangan"
          :rules="[requiredValidator]"
          label="keterangan"
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
