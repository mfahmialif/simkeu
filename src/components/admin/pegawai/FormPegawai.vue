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
    required: true,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const refForm = ref(null);
const disabled = ref(false);
const prodiOptions = ref([]);

const form = reactive({
  nama: "",
  jenis_kelamin: "Laki-laki",
  tipe: "dosen",
  kode: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  alamat: "",
  email: "",
  hp: "",
  nomer_rekening: "",
  bank: "",
  status: "aktif",
  dosen_kode: "",
  nidn: "",
  gelar_depan: "",
  gelar_belakang: "",
  prodi_id: null,
  jabatan: "",
});

const jenisKelaminOptions = [
  { title: "Laki-laki", value: "Laki-laki" },
  { title: "Perempuan", value: "Perempuan" },
];

const tipeOptions = [
  { title: "Dosen", value: "dosen" },
  { title: "Staff", value: "staff" },
];

const statusOptions = [
  { title: "Aktif", value: "aktif" },
  { title: "Tidak Aktif", value: "tidak aktif" },
];

const errorMessage = (err) => {
  const message =
    err?.data?.message ||
    err?.response?._data?.message ||
    err?.response?.data?.message ||
    err?.message;

  if (typeof message === "object") {
    return Object.values(message).flat().join("; ");
  }

  return message || "Terjadi kesalahan.";
};

const fetchProdi = async () => {
  try {
    const response = await $api("/admin/prodi", {
      method: "GET",
      body: {
        limit: 0,
        sort_key: "nama",
        sort_order: "asc",
      },
    });

    const rows = response?.data?.data || [];
    prodiOptions.value = rows.map((item) => ({
      title: `${item.kode} - ${item.nama}`,
      value: item.id,
    }));
  } catch (err) {
    console.error(err);
  }
};

const applyData = (data) => {
  form.nama = data?.nama || "";
  form.jenis_kelamin = data?.jenis_kelamin || "Laki-laki";
  form.tipe = data?.tipe || "dosen";
  form.kode = data?.kode || "";
  form.tempat_lahir = data?.tempat_lahir || "";
  form.tanggal_lahir = data?.tanggal_lahir || "";
  form.alamat = data?.alamat || "";
  form.email = data?.email || "";
  form.hp = data?.hp || "";
  form.nomer_rekening = data?.nomer_rekening || "";
  form.bank = data?.bank || "";
  form.status = data?.status || "aktif";
  form.dosen_kode = data?.dosen?.kode || data?.kode || "";
  form.nidn = data?.dosen?.nidn || "";
  form.gelar_depan = data?.dosen?.gelar_depan || "";
  form.gelar_belakang = data?.dosen?.gelar_belakang || "";
  form.prodi_id = data?.dosen?.prodi_id || null;
  form.jabatan = data?.staff?.jabatan || "";
};

watch(
  () => props.dataForm,
  (data) => {
    if (props.typeForm === "edit" && data) {
      applyData(data);
    }
  },
  { immediate: true }
);

watch(
  () => form.kode,
  (kode) => {
    if (form.tipe === "dosen" && !form.dosen_kode) {
      form.dosen_kode = kode;
    }
  }
);

watch(
  () => form.tipe,
  (tipe) => {
    if (tipe === "dosen" && !form.dosen_kode) {
      form.dosen_kode = form.kode;
    }
  }
);

const onSubmit = async () => {
  if (props.readOnly) return;

  const valid = await refForm.value.validate();
  if (!valid.valid) return;

  const method = props.typeForm === "edit" ? "PUT" : "POST";

  disabled.value = true;

  const body = {
    nama: form.nama,
    jenis_kelamin: form.jenis_kelamin,
    tipe: form.tipe,
    kode: form.kode,
    tempat_lahir: form.tempat_lahir || null,
    tanggal_lahir: form.tanggal_lahir || null,
    alamat: form.alamat || null,
    email: form.email || null,
    hp: form.hp || null,
    nomer_rekening: form.nomer_rekening || null,
    bank: form.bank || null,
    status: form.status,
    dosen_kode: form.tipe === "dosen" ? form.dosen_kode || form.kode : null,
    nidn: form.tipe === "dosen" ? form.nidn || null : null,
    gelar_depan: form.tipe === "dosen" ? form.gelar_depan || null : null,
    gelar_belakang: form.tipe === "dosen" ? form.gelar_belakang || null : null,
    prodi_id: form.tipe === "dosen" ? form.prodi_id || null : null,
    jabatan: form.tipe === "staff" ? form.jabatan : null,
  };

  try {
    const response = await $api(props.url, {
      method,
      body,
    });

    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: "success",
      });

      router.push("/admin/pegawai");
    } else {
      showSnackbar({
        text: errorMessage(response),
        color: "error",
      });
    }
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    });
  } finally {
    disabled.value = false;
  }
};

onMounted(() => {
  fetchProdi();
});
</script>

<template>
  <VForm ref="refForm" @submit.prevent="onSubmit">
    <VRow>
      <VCol cols="12" md="6">
        <VTextField
          v-model="form.nama"
          :rules="[requiredValidator]"
          label="Nama"
          placeholder="Nama pegawai"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="form.kode"
          :rules="[requiredValidator]"
          label="Kode Pegawai"
          placeholder="PGW001"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="4">
        <VSelect
          v-model="form.jenis_kelamin"
          :items="jenisKelaminOptions"
          :rules="[requiredValidator]"
          label="Jenis Kelamin"
          :readonly="readOnly"
          :disabled="readOnly"
        />
      </VCol>

      <VCol cols="12" md="4">
        <VSelect
          v-model="form.tipe"
          :items="tipeOptions"
          :rules="[requiredValidator]"
          label="Tipe"
          :readonly="readOnly"
          :disabled="readOnly"
        />
      </VCol>

      <VCol cols="12" md="4">
        <VSelect
          v-model="form.status"
          :items="statusOptions"
          :rules="[requiredValidator]"
          label="Status"
          :readonly="readOnly"
          :disabled="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="form.tempat_lahir"
          label="Tempat Lahir"
          placeholder="Kota lahir"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="form.tanggal_lahir"
          type="date"
          label="Tanggal Lahir"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12">
        <VTextarea
          v-model="form.alamat"
          label="Alamat"
          placeholder="Alamat lengkap"
          rows="3"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="form.email"
          :rules="[emailValidator]"
          label="Email"
          type="email"
          placeholder="pegawai@example.com"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="form.hp"
          label="HP"
          placeholder="08123456789"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="form.nomer_rekening"
          label="Nomer Rekening"
          placeholder="1234567890"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="form.bank"
          label="Bank"
          placeholder="Nama bank"
          :readonly="readOnly"
        />
      </VCol>

      <template v-if="form.tipe === 'dosen'">
        <VCol cols="12" md="6">
          <VTextField
            v-model="form.dosen_kode"
            label="Kode Dosen"
            placeholder="Kode dosen"
            :readonly="readOnly"
          />
        </VCol>

        <VCol cols="12" md="6">
          <VTextField
            v-model="form.nidn"
            label="NIDN"
            placeholder="NIDN"
            :readonly="readOnly"
          />
        </VCol>

        <VCol cols="12" md="6">
          <VTextField
            v-model="form.gelar_depan"
            label="Gelar Depan"
            placeholder="Dr."
            :readonly="readOnly"
          />
        </VCol>

        <VCol cols="12" md="6">
          <VTextField
            v-model="form.gelar_belakang"
            label="Gelar Belakang"
            placeholder="M.Pd"
            :readonly="readOnly"
          />
        </VCol>

        <VCol cols="12">
          <VSelect
            v-model="form.prodi_id"
            :items="prodiOptions"
            label="Prodi"
            placeholder="Pilih prodi"
            clearable
            clear-icon="ri-close-line"
            :readonly="readOnly"
            :disabled="readOnly"
          />
        </VCol>
      </template>

      <template v-if="form.tipe === 'staff'">
        <VCol cols="12">
          <VTextField
            v-model="form.jabatan"
            :rules="[requiredValidator]"
            label="Jabatan"
            placeholder="Jabatan staff"
            :readonly="readOnly"
          />
        </VCol>
      </template>

      <VCol cols="12" class="d-flex gap-4" v-if="!readOnly">
        <VBtn type="submit" :disabled="disabled">
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
