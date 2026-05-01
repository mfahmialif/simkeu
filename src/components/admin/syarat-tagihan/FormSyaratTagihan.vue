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

const nama = ref("");
const smt = ref(null);
const keterangan = ref("");
const disabled = ref(false);

onMounted(() => {
  if (props.typeForm === "edit" && props.dataForm) {
    nama.value = props.dataForm.nama || "";
    smt.value = props.dataForm.smt || null;
    keterangan.value = props.dataForm.keterangan || "";
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
        nama: nama.value,
        smt: smt.value,
        keterangan: keterangan.value,
      },
    });

    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: "success",
      });

      router.push("/admin/setting/syarat-tagihan");
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
          v-model="nama"
          :rules="[requiredValidator]"
          label="Nama Tagihan"
          placeholder="SPP Semester 1"
          :readonly="readOnly"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VTextField
          v-model="smt"
          label="Semester"
          placeholder="1"
          type="number"
          min="1"
          :readonly="readOnly"
          hint="Semester minimum agar tagihan ini muncul"
          persistent-hint
        />
      </VCol>

      <VCol cols="12">
        <VTextarea
          v-model="keterangan"
          label="Keterangan"
          placeholder="Catatan tambahan (opsional)"
          rows="3"
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
