<script setup>
import PengeluaranLampiranInput from "@/components/admin/pengeluaran/PengeluaranLampiranInput.vue";
import PengeluaranRekapSelect from "@/components/admin/pengeluaran/PengeluaranRekapSelect.vue";
import { showSnackbar } from "@/composables/snackbar";
import { appendLampiranFormData } from "@/utils/lampiran";

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
    title: "Batalkan",
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
const title = ref("Tambah Barokah Pegawai Kegiatan");
const tanggal = ref(null);
const pegawaiId = ref(null);
const kodeDosen = ref("");
const namaKegiatan = ref("");
const transport = ref(null);
const barokah = ref(null);
const jenisPembayaran = ref("CUS BSI");
const rekapId = ref(null);
const buktiTransfer = ref(null);
const existingBuktiTransferUrl = ref(null);
const lampiran = ref([]);
const existingLampiran = ref([]);
const removedLampiran = ref([]);
const keterangan = ref("");
const disabled = ref(false);

const jenisPembayaranList = ["CUS BSI", "Transfer"];
const showMainDataInForm = computed(() => props.typeForm === "edit");

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

const fillFormFromData = (data) => {
  tanggal.value = data.tanggal ?? tanggal.value;
  pegawaiId.value = data.pegawai_id ?? pegawaiId.value;
  kodeDosen.value = data.kode_pegawai ?? data.kode_dosen ?? kodeDosen.value;
  namaKegiatan.value = data.nama_kegiatan ?? "";
  transport.value = data.transport ?? 0;
  barokah.value = data.barokah ?? 0;
  jenisPembayaran.value = data.jenis_pembayaran ?? "CUS BSI";
  rekapId.value = data.rekap_id ?? null;
  buktiTransfer.value = null;
  existingBuktiTransferUrl.value = data.bukti_transfer_url ?? null;
  lampiran.value = [];
  existingLampiran.value = data.lampiran ?? [];
  removedLampiran.value = [];
  keterangan.value = data.keterangan ?? "";
};

const setTanggal = (value) => {
  tanggal.value = value;
};

const onSubmit = async () => {
  const valid = await refForm.value.validate();
  if (!valid.valid) return;

  if (props.typeForm === "add" && !props.refDataDosen?.dosen?.id) {
    showSnackbar({
      text: "Silakan pilih pegawai terlebih dahulu.",
      color: "warning",
    });
    return;
  }

  if (!tanggal.value) {
    showSnackbar({
      text: "Tanggal harus diisi.",
      color: "warning",
    });
    return;
  }

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

  const editId = props.typeForm === "edit"
    ? props.dataForm.id
    : null;
  const method = editId ? "PUT" : "POST";
  const url = editId
    ? "/admin/pengeluaran/dosen-kegiatan/" + editId
    : "/admin/pengeluaran/dosen-kegiatan";

  disabled.value = true;

  const formData = new FormData();
  formData.append("tanggal", tanggal.value);

  if (props.typeForm === "add") {
    formData.append("pegawai_id", props.refDataDosen.dosen.id);
  } else if (pegawaiId.value || props.dataForm?.pegawai_id) {
    formData.append("pegawai_id", pegawaiId.value || props.dataForm.pegawai_id);
  }

  formData.append("nama_kegiatan", namaKegiatan.value);
  formData.append("transport", transport.value ?? 0);
  formData.append("barokah", barokah.value ?? 0);
  formData.append("total", total.value);
  formData.append("jenis_pembayaran", jenisPembayaran.value);
  formData.append("rekap_id", rekapId.value ?? "");
  formData.append("keterangan", keterangan.value ?? "");
  formData.append("_method", method);

  if (selectedBuktiTransferFile.value instanceof File) {
    formData.append("bukti_transfer", selectedBuktiTransferFile.value);
  }
  appendLampiranFormData(formData, lampiran.value, removedLampiran.value);

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

watch(
  () => props.dataForm,
  () => {
    if (props.typeForm === "edit" && props.dataForm) {
      title.value = "Update Barokah Pegawai Kegiatan: " + (props.dataForm.kode_pegawai || props.dataForm.kode_dosen || "");
      fillFormFromData(props.dataForm);
    }
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  if (props.typeForm !== "edit") {
    tanggal.value = fDate(new Date());
  }
});

defineExpose({
  setTanggal,
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
          <VCol cols="12">
            <PengeluaranRekapSelect
              v-model="rekapId"
              endpoint="/admin/pengeluaran/dosen-kegiatan"
              label="Rekap"
            />
          </VCol>

          <VCol v-if="showMainDataInForm" cols="12" md="6">
            <AppDateTimePicker
              v-model="tanggal"
              label="Tanggal"
              placeholder="Select date"
              :rules="[requiredValidator]"
              :config="{
                altInput: true,
                altFormat: 'F j, Y',
                dateFormat: 'Y-m-d',
              }"
            />
          </VCol>

          <VCol v-if="showMainDataInForm" cols="12" md="6">
            <VTextField
              v-model="kodeDosen"
              label="NIY Pegawai"
              :rules="[requiredValidator]"
              readonly
            />
          </VCol>

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
            <PengeluaranLampiranInput
              v-model="lampiran"
              v-model:removed-lampiran="removedLampiran"
              :existing-lampiran="existingLampiran"
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
