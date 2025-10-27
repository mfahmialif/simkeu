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
const kelasList = ["Reguler Pagi", "Reguler Sore", "Karyawan"];
const semester = ref("");
const semesterList = ["Ganjil", "Genap"];
const namaTagihan = ref("");
const jumlah = ref("");
const bayar = ref("");
const name = ref("");
const angkatan = ref("");
const disabled = ref(false);
const jk = ref("");
const jenisKelaminList = ["Laki-laki", "Perempuan"];
const jenisPembayaran = ref("");
const jenisPembayaranList = ["Cast", "TF"];
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
    tahun.value = props.dataForm.tahun;
    name.value = props.dataForm.name;
    angkatan.value = props.dataForm.angkatan;
    prodi.value = props.dataForm.prodi;
    kelas.value = props.dataForm.kelas;
    semester.value = props.dataForm.semester;
    bayar.value = props.dataForm.bayar;
    jumlah.value = props.dataForm.jumlah;
    namaTagihan.value = props.dataForm.nama_tagihan;
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
  formData.append("tahun", tahun.value);
  formData.append("name", name.value);
  formData.append("prodi", prodi.value);
  formData.append("angkatan", angkatan.value);
  formData.append("kelas", kelas.value);
  formData.append("semester", semester.value);
  formData.append("nama_tagihan", namaTagihan.value);
  formData.append("jumlah", jumlah.value);
  formData.append("bayar", bayar.value);
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

      router.push("/admin/pemasukan/mahasiswa/pembayaran/tambahan");
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
        <VTextField v-model="tanggal" :rules="[requiredValidator]" label="Tanggal" type="date" />
      </VCol>
      <VCol cols="12" md="4">
        <VTextField v-model="Tahun" :rules="[requiredValidator]" label="Tahun Akademik" type="month" placeholder="YYYY"
          :formatter="(date) => date.toLocaleString('default', { year: 'numeric' })
            " />
      </VCol>
      <VCol cols="12" md="4">
        <VTextField v-model="Tahun" :rules="[requiredValidator]" label="Tahun Akademik" type="month" :formatter="(date) => date.toLocaleString('default', { year: 'numeric' })
          " placeholder="MM/YYYY" />
      </VCol>
      <VCol cols="12" md="4">
        <VCombobox v-model="semester" :items="semesterList" :rules="[requiredValidator]" label="Semester" />
      </VCol>
      <VCol cols="12">
        <div class="d-flex align-items-center">
          <VTextField v-model="nim" :rules="[requiredValidator, noSpaceValidator]" label="Nim" placeholder="202185.." />
        </div>
      </VCol>
      <VCol cols="12">
        <VTextField v-model="name" :rules="[requiredValidator]" label="Nama" placeholder="Fulan Fulanah" />
      </VCol>
      <VCol cols="12" md="6">
        <VTextField v-model="prodi" :rules="[requiredValidator]" label="Program Studi" />
      </VCol>
      <VCol cols="12" md="6">
        <VCombobox v-model="jk" :items="jenisKelaminList" :rules="[requiredValidator]" label="Jenis Kelamin" />
      </VCol>
      <VCol cols="12" md="6">
        <VTextField v-model="Tahun" :rules="[requiredValidator]" label="Angkatan" type="date" placeholder="YYYY"
          :formatter="(date) => date.toLocaleString('default', { year: 'numeric' })
            " />
      </VCol>
      <VCol cols="12" md="6">
        <VCombobox v-model="kelas" :items="kelasList" :rules="[requiredValidator]" label="Kelas" />
      </VCol>
      <VCol cols="12" md="3">
        <VTextField v-model="namaTagihan" :rules="[requiredValidator]" label="Nama Tagihan" />
      </VCol>
      <VCol cols="12" md="3">
        <VTextField v-model="jumlah" :rules="[requiredValidator]" label="jumlah(Rp)" />
      </VCol>
      <VCol cols="12" md="3">
        <VTextField v-model="bayar" :rules="[requiredValidator]" label="dibayar(Rp)" />
      </VCol>
      <VCol cols="12" md="3" class="d-flex align-items-center">
        <VBtn color="primary" height="45"> + </VBtn>
      </VCol>
      <VCol cols="12">
        <VCombobox v-model="jenisPembayaran" :items="jenisPembayaranList" :rules="[requiredValidator]"
          label="Jenis Pembayaran" />
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
