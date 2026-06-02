<script setup>
import { showSnackbar } from "@/composables/snackbar";

const props = defineProps({
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
  {
    title: "Lihat Data",
    value: "lihat-data",
    icon: "ri-eye-line",
    clickHandler: () => router.push("/admin/pengeluaran/dosen-kegiatan"),
  },
];

const refForm = ref(null);
const namaKegiatan = ref("");
const transport = ref(null);
const barokah = ref(null);
const jenisPembayaran = ref("CUS BSI");
const buktiTransfer = ref(null);
const existingBuktiTransferUrl = ref(null);
const keterangan = ref("");
const disabled = ref(false);

const jenisPembayaranList = ["CUS BSI", "Transfer"];

const total = computed(() => {
  return Math.round(Number(transport.value || 0) + Number(barokah.value || 0));
});

const selectedBuktiTransferFile = computed(() => {
  if (Array.isArray(buktiTransfer.value)) return buktiTransfer.value[0] ?? null;
  return buktiTransfer.value;
});

const buktiTransferRules = computed(() => {
  if (jenisPembayaran.value !== "Transfer" || existingBuktiTransferUrl.value) {
    return [];
  }

  return [requiredValidator];
});

watch(jenisPembayaran, (newValue) => {
  if (newValue !== "Transfer") {
    buktiTransfer.value = null;
  }
});

watch(
  () => props.dataForm,
  () => {
    if (props.typeForm === "edit" && props.dataForm) {
      namaKegiatan.value = props.dataForm.nama_kegiatan ?? "";
      transport.value = props.dataForm.transport ?? 0;
      barokah.value = props.dataForm.barokah ?? 0;
      jenisPembayaran.value = props.dataForm.jenis_pembayaran ?? "CUS BSI";
      existingBuktiTransferUrl.value = props.dataForm.bukti_transfer_url ?? null;
      keterangan.value = props.dataForm.keterangan ?? "";
    }
  },
  { deep: true, immediate: true }
);

const onSubmit = async () => {
  const valid = await refForm.value.validate();
  if (!valid.valid) return;

  if (
    jenisPembayaran.value === "Transfer"
    && !selectedBuktiTransferFile.value
    && !existingBuktiTransferUrl.value
  ) {
    showSnackbar({
      text: "Bukti transfer wajib diupload.",
      color: "warning",
    });
    return;
  }

  disabled.value = true;
  const method = props.typeForm === "edit" ? "PUT" : "POST";
  const url = props.typeForm === "edit"
    ? "/admin/pengeluaran/dosen-kegiatan/" + props.dataForm.id
    : "/admin/pengeluaran/dosen-kegiatan";

  const formData = new FormData();
  formData.append("nama_kegiatan", namaKegiatan.value);
  formData.append("transport", transport.value ?? 0);
  formData.append("barokah", barokah.value ?? 0);
  formData.append("total", total.value);
  formData.append("jenis_pembayaran", jenisPembayaran.value);
  formData.append("keterangan", keterangan.value ?? "");
  formData.append("_method", method);

  if (selectedBuktiTransferFile.value instanceof File) {
    formData.append("bukti_transfer", selectedBuktiTransferFile.value);
  }

  try {
    const response = await $api(url, {
      method: "POST",
      body: formData,
    });

    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: "success",
      });
      router.push("/admin/pengeluaran/dosen-kegiatan");
    } else {
      showSnackbar({
        text: response.message,
        color: "error",
      });
    }
  } catch (err) {
    const message = Array.isArray(err.data?.message)
      ? err.data.message.join("; ")
      : typeof err.data?.message === "object"
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
  <VCard class="mb-6" :title="typeForm === 'edit' ? 'Edit Barokah Dosen Kegiatan' : 'Tambah Barokah Dosen Kegiatan'">
    <template #append>
      <MoreBtnAction :menu-list="menuList" />
    </template>

    <VCardText>
      <VForm ref="refForm" @submit.prevent="onSubmit">
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="namaKegiatan"
              label="Nama Kegiatan"
              :rules="[requiredValidator]"
            />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField
              v-model="transport"
              type="number"
              label="Transport"
              :rules="[requiredValidator]"
              :hint="formatRupiah(transport)"
              persistent-hint
            />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField
              v-model="barokah"
              type="number"
              label="Barokah"
              :rules="[requiredValidator]"
              :hint="formatRupiah(barokah)"
              persistent-hint
            />
          </VCol>

          <VCol cols="12" md="6">
            <VSelect
              v-model="jenisPembayaran"
              label="Jenis Pembayaran"
              :items="jenisPembayaranList"
              :rules="[requiredValidator]"
            />
          </VCol>

          <VCol v-if="jenisPembayaran === 'Transfer'" cols="12" md="6">
            <VFileInput
              v-model="buktiTransfer"
              :prepend-icon="null"
              label="Bukti Transfer"
              accept="image/png, image/jpeg, application/pdf"
              :rules="buktiTransferRules"
            />
          </VCol>

          <VCol v-if="existingBuktiTransferUrl && jenisPembayaran === 'Transfer'" cols="12" md="6">
            <VBtn
              variant="outlined"
              color="primary"
              prepend-icon="ri-file-paper-2-line"
              :href="existingBuktiTransferUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="w-100"
            >
              Lihat Bukti Transfer
            </VBtn>
          </VCol>

          <VCol cols="12">
            <VTextarea
              v-model="keterangan"
              label="Keterangan"
              auto-grow
            />
          </VCol>

          <VCol cols="12">
            <VTextField
              :model-value="formatRupiah(total)"
              label="Total"
              readonly
            />
          </VCol>

          <VCol cols="12" class="d-flex gap-4">
            <VBtn type="submit" :disabled="disabled" :loading="disabled" class="w-100">
              Simpan
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>
