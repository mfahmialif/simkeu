<script setup>
import { showSnackbar } from "@/composables/snackbar";
import { onMounted, computed } from "vue";

const props = defineProps({
  refDataDosen: {
    type: Object,
    default: () => ({}),
  },
  typeForm: {
    type: String,
    default: "add",
  },
  dataForm: {
    type: Object,
    default: () => ({}),
  },
});

const router = useRouter();


const menuList = [
  {
    title: "Kembali",
    value: "back",
    icon: "ri-arrow-left-line",
    clickHandler: () => router.back(),
  },
  // {
  //   value: 'hr', // untuk divider
  // },
  {
    title: "Lihat Data",
    value: "lihat-data",
    icon: "ri-eye-line",
    clickHandler: () => router.push("/admin/pengeluaran/dosen"),
  },
];

const refForm = ref(null);

const tanggal = ref(null);
const jam = ref(null);
const hari = ref(null);
const barokah = ref(null);
const transport = ref(null);

const refJam = ref(null);
const jamFocus = async () => {
  await nextTick();
  refJam.value.focus();
};

const title = ref('Silahkan diisi : ');

// total otomatis
const total = computed(() => {
  return Number(barokah.value || 0) + Number(transport.value || 0);
});

const disabled = ref(false);

// SUBMIT
const onSubmit = async () => {
  const valid = await refForm.value.validate();
  if (!valid.valid) return;

  const method = props.typeForm === "edit" ? "PUT" : "POST";
  disabled.value = true;

  const formData = new FormData();
  let url = "/admin/pengeluaran/dosen";

  formData.append("tanggal", tanggal.value);
  if (props.typeForm === "add") {
    formData.append("dosen_kode", props.refDataDosen.dosen.kode);
  }
  if (props.typeForm === "edit") {
    url = "/admin/pengeluaran/dosen/" + props.dataForm.id;
  }
  formData.append("jam", jam.value);
  formData.append("hari", hari.value);
  formData.append("barokah", barokah.value);
  formData.append("transport", transport.value);
  formData.append("total", total.value);
  formData.append("_method", method);

  try {
    const response = await $api(url, {
      method: "POST",
      body: formData,
    });
    console.log(response);

    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: "success",
      });
      router.push("/admin/pengeluaran/dosen");
    } else {
      showSnackbar({ text: response.message, color: "error" });
    }
  } catch (err) {
    showSnackbar({
      text: err?.data?.message || "Terjadi kesalahan",
      color: "error",
    });
  } finally {
    disabled.value = false;
  }
};

watch(
  () => props.dataForm,
  () => {
    if (props.typeForm === "edit" && props.dataForm) {
      title.value = "Update Data Dosen: " + props.dataForm.dosen_kode;
      tanggal.value = props.dataForm.tanggal;
      jam.value = props.dataForm.jam;
      hari.value = props.dataForm.hari;
      barokah.value = props.dataForm.barokah;
      transport.value = props.dataForm.transport;
    }
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  tanggal.value = fDate(new Date());
});

defineExpose({
  jamFocus,
  refJam,
});
</script>

<template>
  <VCard class="mb-6" :title="title">
    <template #append>
      <MoreBtnAction :menu-list="menuList" />
    </template>
    <VCardText>
      <VForm ref="refForm" @submit.prevent="onSubmit">
        <VRow>
          <!-- Tanggal -->
          <VCol cols="12">
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

          <!-- JAM -->
          <VCol cols="12" md="6">
            <VTextField
              ref="refJam"
              v-model="jam"
              type="number"
              label="Jam"
              :rules="[requiredValidator]"
              placeholder="2"
              autocomplete="off"
            />
          </VCol>

          <!-- HARI -->
          <VCol cols="12" md="6">
            <VTextField
              v-model="hari"
              type="number"
              label="Hari"
              :rules="[requiredValidator]"
              placeholder="1"
              autocomplete="off"
            />
          </VCol>

          <!-- Barokah -->
          <VCol cols="12" md="6">
            <VTextField
              v-model="barokah"
              type="number"
              label="Barokah"
              placeholder="50000"
              autocomplete="off"
              :rules="[requiredValidator]"
              :hint="formatRupiah(barokah)"
              persistent-hint
            />
          </VCol>

          <!-- Transport -->
          <VCol cols="12" md="6">
            <VTextField
              v-model="transport"
              type="number"
              label="Transport"
              placeholder="20000"
              autocomplete="off"
              :rules="[requiredValidator]"
              :hint="formatRupiah(transport)"
              persistent-hint
            />
          </VCol>

          <!-- TOTAL (readonly) -->
          <VCol cols="12">
            <VTextField
              :model-value="formatRupiah(total)"
              label="Total"
              readonly
            />
          </VCol>

          <!-- Submit -->
          <VCol cols="12" class="d-flex gap-4">
            <VBtn type="submit" :disabled="disabled" class="w-100"
              >Simpan
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>
