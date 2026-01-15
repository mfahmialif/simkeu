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
const konim = ref("");
const alias = ref("");
const nama = ref("");
const aktif = ref("Y");
const jenjang = ref("");
const nidnKepala = ref("");
const namaKepala = ref("");
const akreditasi = ref("");
const color = ref("");
const maxSksSkripsi = ref(0);
const disabled = ref(false);

const aktifOptions = [
  { title: "Aktif", value: "Y" },
  { title: "Tidak Aktif", value: "N" },
];

onMounted(() => {
  if (props.typeForm === "edit" && props.dataForm) {
    kode.value = props.dataForm.kode || "";
    konim.value = props.dataForm.konim || "";
    alias.value = props.dataForm.alias || "";
    nama.value = props.dataForm.nama || "";
    aktif.value = props.dataForm.aktif || "Y";
    jenjang.value = props.dataForm.jenjang || "";
    nidnKepala.value = props.dataForm.nidn_kepala || "";
    namaKepala.value = props.dataForm.nama_kepala || "";
    akreditasi.value = props.dataForm.akreditasi || "";
    color.value = props.dataForm.color || "";
    maxSksSkripsi.value = props.dataForm.max_sks_skripsi || 0;
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
        konim: konim.value,
        alias: alias.value,
        nama: nama.value,
        aktif: aktif.value,
        jenjang: jenjang.value,
        nidn_kepala: nidnKepala.value,
        nama_kepala: namaKepala.value,
        akreditasi: akreditasi.value,
        color: color.value,
        max_sks_skripsi: maxSksSkripsi.value,
      },
    });

    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: "success",
      });

      router.push("/admin/setting/prodi");
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
          placeholder="TI"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="konim"
          label="Kode NIM"
          placeholder="01"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="nama"
          :rules="[requiredValidator]"
          label="Nama Prodi"
          placeholder="Teknik Informatika"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="alias"
          label="Alias"
          placeholder="TI"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="jenjang"
          label="Jenjang"
          placeholder="S1"
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

      <VCol cols="12" md="6">
        <VTextField
          v-model="nidnKepala"
          label="NIDN Kepala Prodi"
          placeholder="0123456789"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="namaKepala"
          label="Nama Kepala Prodi"
          placeholder="Dr. Fulan, M.Kom"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="akreditasi"
          label="Akreditasi"
          placeholder="A"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="maxSksSkripsi"
          label="Max SKS Skripsi"
          type="number"
          placeholder="0"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="color"
          label="Color (Hex)"
          placeholder="#FF5733"
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
