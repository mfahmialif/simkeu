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
});

const refForm = ref(null);

const jumlah = ref(0);
const keterangan = ref("");
const tanggal = ref(new Date().toISOString().split("T")[0]);
const disabled = ref(false);

const saldo = ref([]);
const selectedSaldo = ref(null);
const isLoadingSaldo = ref(false);

const fetchSaldo = async () => {
  try {
    isLoadingSaldo.value = true;
    const { data } = await $api("/admin/saldo/kategori", {
      method: "GET",
      body: props.typeForm !== "edit" ? { aktif: "y" } : {},
    });

    saldo.value = data.data.map((saldo) => {
      return {
        title: `${saldo.nama} - ${saldo.kode}`,
        value: saldo.id,
      };
    });
  } catch (err) {
    console.error(err);
  } finally {
    isLoadingSaldo.value = false;
  }
};

onMounted(async () => {
  await fetchSaldo();
  if (props.typeForm === "edit") {
    selectedSaldo.value = saldo.value.find((saldo) => saldo.value === props.dataForm.saldo_id);
    jumlah.value = props.dataForm.jumlah;
    keterangan.value = props.dataForm.keterangan;
    tanggal.value = props.dataForm.tanggal;
  }
});

const onSubmit = async () => {
  const valid = await refForm.value.validate();
  if (!valid.valid) return;

  const method = props.typeForm === "edit" ? "PUT" : "POST";

  disabled.value = true;

  const formData = new FormData();
  formData.append("saldo_id", selectedSaldo.value.value);
  formData.append("jumlah", jumlah.value);
  formData.append("tanggal", tanggal.value);
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

      router.push("/admin/pemasukan/pemasukan/tambah");
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
      <VCol cols="12" md="12">
        <AppDateTimePicker
          v-model="tanggal"
          label="Tanggal"
          placeholder="Select date"
          :config="{
            altInput: true,
            altFormat: 'F j, Y',
            dateFormat: 'Y-m-d',
          }"
        />
      </VCol>
      <VCol cols="12">
        <VCombobox
          v-model="selectedSaldo"
          :items="saldo"
          item-title="title"
          item-value="value"
          label="Saldo"
          :loading="isLoadingSaldo"
          :disabled="disabled"
          :rules="[requiredValidator]"
        />
      </VCol>
      <VCol cols="12">
        <VTextField
          v-model="jumlah"
          type="number"
          :rules="[requiredValidator]"
          label="Jumlah"
          placeholder="1000000"
          :hint="formatRupiah(jumlah)"
          persistent-hint
        />
      </VCol>
      <VCol cols="12">
        <VTextarea
          v-model="keterangan"
          label="Keterangan"
          placeholder="Type here..."
          auto-grow
          :rules="[requiredValidator]"
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

<style lang="scss">
.photo {
  block-size: 100px;
}
</style>
