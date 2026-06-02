<script setup>
import { showSnackbar } from "@/composables/snackbar";

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
  {
    title: "Lihat Data",
    value: "lihat-data",
    icon: "ri-eye-line",
    clickHandler: () => router.push("/admin/pengeluaran/dosen-tatapmuka"),
  },
];

const refForm = ref(null);

const tanggal = ref(null);
const jam = ref(0);
const jamMengajarDoubleDegree = ref(0);
const hariTransportMotor = ref(0);
const hariTransportMobilTol = ref(0);
const hariTransportMobilTanpaTol = ref(0);
const transportMotor = ref(0);
const transportMobilTol = ref(0);
const transportMobilTanpaTol = ref(0);
const barokahMengajarBiasa = ref(0);
const barokahMengajarDoubleDegree = ref(0);
const barokahUas = ref(0);
const jumlahMahasiswaUas = ref(0);
const barokahSempro = ref(0);
const jenisPembayaran = ref("CUS BSI");
const buktiTransfer = ref(null);
const existingBuktiTransferUrl = ref(null);
const keterangan = ref("");
const existingPengeluaran = ref(null);

const jenisPembayaranList = ["CUS BSI", "Transfer"];

const refJam = ref(null);
const jamFocus = async () => {
  await nextTick();
  refJam.value?.focus();
};

const title = ref("Silahkan diisi:");
const isEditMode = computed(() => props.typeForm === "edit" || !!existingPengeluaran.value?.id);
const isAddPageEditing = computed(() => props.typeForm === "add" && !!existingPengeluaran.value?.id);
const showTanggalInForm = computed(() => props.typeForm === "edit");
const sectionNumber = (number) => number + (showTanggalInForm.value ? 1 : 0);
const refFormCard = ref(null);
const refInlineFooter = ref(null);
const showFloatingFooter = ref(false);
const mobileSummaryHidden = ref(false);
let floatingFooterFrame = null;

const numberValue = (value) => Number(value || 0);
const selectInput = (event) => event?.target?.select?.();
const dayPresets = Array.from({ length: 7 }, (_, index) => index + 1);
const jamPresets = Array.from({ length: 12 }, (_, index) => index + 1);
const transportMotorPresets = [25000, 50000, 75000, 100000];
const transportMobilPresets = [100000, 125000, 150000, 175000, 200000, 225000];
const barokahMengajarPresets = [50000, 75000, 100000, 125000, 150000];
const formatPresetNominal = (value) => new Intl.NumberFormat("id-ID").format(value);

const totalNominalMobil = computed(() => numberValue(transportMobilTol.value) + numberValue(transportMobilTanpaTol.value));
const totalHariTransportMobil = computed(() => numberValue(hariTransportMobilTol.value) + numberValue(hariTransportMobilTanpaTol.value));
const totalNominalTransport = computed(() => numberValue(transportMotor.value) + totalNominalMobil.value);
const totalHariTransport = computed(() => numberValue(hariTransportMotor.value) + totalHariTransportMobil.value);
const subtotalTransportMotor = computed(() => numberValue(transportMotor.value) * numberValue(hariTransportMotor.value));
const subtotalTransportMobilTol = computed(() => numberValue(transportMobilTol.value) * numberValue(hariTransportMobilTol.value));
const subtotalTransportMobilTanpaTol = computed(() => numberValue(transportMobilTanpaTol.value) * numberValue(hariTransportMobilTanpaTol.value));
const subtotalTransport = computed(() => (
  subtotalTransportMotor.value
    + subtotalTransportMobilTol.value
    + subtotalTransportMobilTanpaTol.value
));
const subtotalMengajarBiasa = computed(() => numberValue(barokahMengajarBiasa.value) * numberValue(jam.value));
const subtotalMengajarDoubleDegree = computed(() => (
  numberValue(barokahMengajarDoubleDegree.value) * numberValue(jamMengajarDoubleDegree.value) * 1.5
));
const subtotalMengajar = computed(() => subtotalMengajarBiasa.value + subtotalMengajarDoubleDegree.value);
const subtotalSempro = computed(() => numberValue(barokahSempro.value));
const subtotalUas = computed(() => numberValue(barokahUas.value) * numberValue(jumlahMahasiswaUas.value));

const total = computed(() => {
  return Math.round(
    subtotalTransport.value
      + subtotalMengajar.value
      + subtotalUas.value
      + subtotalSempro.value
  );
});
const summaryItems = computed(() => [
  { label: "Transport", value: subtotalTransport.value },
  { label: "Mengajar", value: subtotalMengajar.value },
  { label: "Sempro", value: subtotalSempro.value },
  { label: "UAS", value: subtotalUas.value },
  { label: "Total", value: total.value, total: true },
]);

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

const setAddTitle = () => {
  title.value = "Tambah Barokah Dosen Tatapmuka";
};

const resetFormValues = () => {
  jam.value = 0;
  jamMengajarDoubleDegree.value = 0;
  hariTransportMotor.value = 0;
  hariTransportMobilTol.value = 0;
  hariTransportMobilTanpaTol.value = 0;
  transportMotor.value = 0;
  transportMobilTol.value = 0;
  transportMobilTanpaTol.value = 0;
  barokahMengajarBiasa.value = 0;
  barokahMengajarDoubleDegree.value = 0;
  barokahUas.value = 0;
  jumlahMahasiswaUas.value = 0;
  barokahSempro.value = 0;
  jenisPembayaran.value = "CUS BSI";
  buktiTransfer.value = null;
  existingBuktiTransferUrl.value = null;
  keterangan.value = "";
};

const fillFormFromData = (data) => {
  tanggal.value = data.tanggal ?? tanggal.value;
  jam.value = data.jam ?? 0;
  jamMengajarDoubleDegree.value = data.jam_mengajar_double_degree ?? data.jam ?? 0;
  hariTransportMotor.value = data.hari_transport_motor ?? data.hari ?? 0;
  hariTransportMobilTol.value = data.hari_transport_mobil_tol ?? 0;
  hariTransportMobilTanpaTol.value = data.hari_transport_mobil_tanpa_tol ?? data.hari_transport_mobil ?? 0;
  transportMotor.value = data.transport_motor ?? data.transport ?? 0;
  transportMobilTol.value = data.transport_mobil_tol ?? 0;
  transportMobilTanpaTol.value = data.transport_mobil_tanpa_tol ?? data.transport_mobil ?? 0;
  barokahMengajarBiasa.value = data.barokah_mengajar_biasa ?? data.barokah ?? 0;
  barokahMengajarDoubleDegree.value = data.barokah_mengajar_double_degree ?? 0;
  barokahUas.value = data.barokah_uas ?? 0;
  jumlahMahasiswaUas.value = data.jumlah_mahasiswa_uas ?? 0;
  barokahSempro.value = data.barokah_sempro ?? 0;
  jenisPembayaran.value = data.jenis_pembayaran ?? "CUS BSI";
  buktiTransfer.value = null;
  existingBuktiTransferUrl.value = data.bukti_transfer_url ?? null;
  keterangan.value = data.keterangan ?? "";
};

const setTanggal = (value) => {
  tanggal.value = value;
};

const resetExistingPengeluaran = () => {
  if (props.typeForm === "edit") return;

  existingPengeluaran.value = null;
  resetFormValues();
  setAddTitle();
};

const lookupExistingPengeluaran = async (dosenKode, selectedTanggal) => {
  if (props.typeForm === "edit") return;

  tanggal.value = selectedTanggal;

  if (!dosenKode || !selectedTanggal) {
    resetExistingPengeluaran();
    return;
  }

  try {
    const response = await $api("/admin/pengeluaran/dosen/by-date", {
      method: "GET",
      body: {
        dosen_kode: dosenKode,
        tanggal: selectedTanggal,
      },
    });

    if (response.status === true && response.data) {
      existingPengeluaran.value = response.data;
      fillFormFromData(response.data);
      title.value = "Update Barokah Dosen Tatapmuka: " + response.data.dosen_kode;
    } else {
      resetExistingPengeluaran();
      tanggal.value = selectedTanggal;
    }
  } catch (err) {
    resetExistingPengeluaran();
    tanggal.value = selectedTanggal;

    const message = Array.isArray(err.data?.message)
      ? err.data.message.join("; ")
      : typeof err.data?.message === "object"
        ? Object.values(err.data.message).flat().join("; ")
        : err.data?.message || "Gagal mengecek data barokah pada tanggal tersebut.";

    showSnackbar({
      text: message,
      color: "error",
    });
  }
};

const disabled = ref(false);

const elementFromRef = (target) => target?.$el ?? target;

const updateFloatingFooter = () => {
  const formEl = elementFromRef(refFormCard.value);
  const footerEl = elementFromRef(refInlineFooter.value);

  if (!formEl || !footerEl) {
    showFloatingFooter.value = false;
    return;
  }

  const formRect = formEl.getBoundingClientRect();
  const footerRect = footerEl.getBoundingClientRect();
  const formIsVisible = formRect.top < window.innerHeight && formRect.bottom > 0;
  const inlineFooterIsVisible = footerRect.top < window.innerHeight && footerRect.bottom > 0;

  showFloatingFooter.value = formIsVisible && !inlineFooterIsVisible && footerRect.top > window.innerHeight;
};

const queueFloatingFooterUpdate = () => {
  if (floatingFooterFrame) return;

  floatingFooterFrame = window.requestAnimationFrame(() => {
    floatingFooterFrame = null;
    updateFloatingFooter();
  });
};

const onSubmit = async () => {
  const valid = await refForm.value.validate();
  if (!valid.valid) return;

  if (props.typeForm === "add" && !props.refDataDosen?.dosen?.kode) {
    showSnackbar({
      text: "Silakan pilih dosen terlebih dahulu.",
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
    : existingPengeluaran.value?.id;
  const method = editId ? "PUT" : "POST";
  disabled.value = true;

  const formData = new FormData();
  const url = editId
    ? "/admin/pengeluaran/dosen/" + editId
    : "/admin/pengeluaran/dosen";

  formData.append("tanggal", tanggal.value);
  if (props.typeForm === "add") {
    formData.append("dosen_kode", props.refDataDosen.dosen.kode);
  } else if (props.dataForm?.dosen_kode) {
    formData.append("dosen_kode", props.dataForm.dosen_kode);
  }

  formData.append("jam", jam.value);
  formData.append("jam_mengajar_double_degree", jamMengajarDoubleDegree.value ?? 0);
  formData.append("hari", totalHariTransport.value);
  formData.append("hari_transport_motor", hariTransportMotor.value ?? 0);
  formData.append("hari_transport_mobil", totalHariTransportMobil.value);
  formData.append("hari_transport_mobil_tol", hariTransportMobilTol.value ?? 0);
  formData.append("hari_transport_mobil_tanpa_tol", hariTransportMobilTanpaTol.value ?? 0);
  formData.append("transport_motor", transportMotor.value ?? 0);
  formData.append("transport_mobil", totalNominalMobil.value);
  formData.append("transport_mobil_tol", transportMobilTol.value ?? 0);
  formData.append("transport_mobil_tanpa_tol", transportMobilTanpaTol.value ?? 0);
  formData.append("transport", totalNominalTransport.value);
  formData.append("barokah_mengajar_biasa", barokahMengajarBiasa.value ?? 0);
  formData.append("barokah_mengajar_double_degree", barokahMengajarDoubleDegree.value ?? 0);
  formData.append("barokah_uas", barokahUas.value ?? 0);
  formData.append("jumlah_mahasiswa_uas", jumlahMahasiswaUas.value ?? 0);
  formData.append("barokah_sempro", barokahSempro.value ?? 0);
  formData.append("jenis_pembayaran", jenisPembayaran.value);
  formData.append("keterangan", keterangan.value ?? "");
  formData.append("total", total.value);
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
      router.push("/admin/pengeluaran/dosen-tatapmuka");
    } else {
      showSnackbar({ text: response.message, color: "error" });
    }
  } catch (err) {
    const message = Array.isArray(err.data?.message)
      ? err.data.message.join("; ")
      : typeof err.data?.message === "object"
        ? Object.values(err.data.message).flat().join("; ")
        : err.data?.message || "Terjadi kesalahan";

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
      existingPengeluaran.value = props.dataForm;
      title.value = "Update Barokah Dosen Tatapmuka: " + props.dataForm.dosen_kode;
      fillFormFromData(props.dataForm);
    }
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  if (props.typeForm !== "edit") {
    tanggal.value = fDate(new Date());
  }

  nextTick(updateFloatingFooter);
  window.addEventListener("scroll", queueFloatingFooterUpdate, { passive: true });
  window.addEventListener("resize", queueFloatingFooterUpdate);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", queueFloatingFooterUpdate);
  window.removeEventListener("resize", queueFloatingFooterUpdate);

  if (floatingFooterFrame) {
    window.cancelAnimationFrame(floatingFooterFrame);
  }
});

watch([jenisPembayaran, existingBuktiTransferUrl, mobileSummaryHidden], () => {
  nextTick(queueFloatingFooterUpdate);
});

defineExpose({
  jamFocus,
  refJam,
  lookupExistingPengeluaran,
  resetExistingPengeluaran,
  setTanggal,
});
</script>

<template>
  <VCard ref="refFormCard" class="mb-6 elder-form" :title="title">
    <template #append>
      <MoreBtnAction :menu-list="menuList" />
    </template>
    <VCardText>
      <VForm ref="refForm" @submit.prevent="onSubmit">
        <div
          class="form-layout"
          :class="{
            'has-floating-footer': showFloatingFooter,
            'is-summary-hidden': mobileSummaryHidden,
          }"
        >
          <VAlert
            v-if="isAddPageEditing"
            type="info"
            variant="tonal"
            density="comfortable"
          >
            Data sudah pernah diinputkan, silahkan mengisi untuk memperbarui data.
          </VAlert>

          <section v-if="showTanggalInForm" class="form-section">
            <div class="section-heading">
              <span class="section-number">1</span>
              <div class="section-title">Data Utama</div>
            </div>
            <div class="section-content">
              <VRow>
                <VCol cols="12" md="6">
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
              </VRow>
            </div>
          </section>

          <section class="form-section">
            <div class="section-heading">
              <span class="section-number">{{ sectionNumber(1) }}</span>
              <div class="section-title">Transport Motor</div>
            </div>
            <div class="section-content">
              <VRow>
                <VCol cols="12" md="4">
                  <VTextField
                    v-model="hariTransportMotor"
                    type="number"
                    label="Hari Motor"
                    :rules="[requiredValidator]"
                    placeholder="1"
                    autocomplete="off"
                    @focus="selectInput"
                    @click="selectInput"
                  />
                  <div class="preset-badges">
                    <span
                      v-for="value in dayPresets"
                      :key="'hari-motor-' + value"
                      class="preset-badge"
                      role="button"
                      tabindex="0"
                      @click="hariTransportMotor = value"
                      @keydown.enter.prevent="hariTransportMotor = value"
                      @keydown.space.prevent="hariTransportMotor = value"
                    >
                      {{ value }}
                    </span>
                  </div>
                </VCol>

                <VCol cols="12" md="4">
                  <VTextField
                    v-model="transportMotor"
                    type="number"
                    label="Transport Motor"
                    placeholder="20000"
                    autocomplete="off"
                    :hint="formatRupiah(transportMotor)"
                    persistent-hint
                    @focus="selectInput"
                    @click="selectInput"
                  />
                  <div class="preset-badges">
                    <span
                      v-for="value in transportMotorPresets"
                      :key="'transport-motor-' + value"
                      class="preset-badge"
                      role="button"
                      tabindex="0"
                      @click="transportMotor = value"
                      @keydown.enter.prevent="transportMotor = value"
                      @keydown.space.prevent="transportMotor = value"
                    >
                      {{ formatPresetNominal(value) }}
                    </span>
                  </div>
                </VCol>

                <VCol cols="12" md="4">
                  <VTextField
                    :model-value="formatRupiah(subtotalTransportMotor)"
                    label="Subtotal Motor"
                    readonly
                  />
                </VCol>
              </VRow>
            </div>
          </section>

          <section class="form-section">
            <div class="section-heading">
              <span class="section-number">{{ sectionNumber(2) }}</span>
              <div class="section-title">Mobil Pakai Tol</div>
            </div>
            <div class="section-content">
              <VRow>
                <VCol cols="12" md="4">
                  <VTextField
                    v-model="hariTransportMobilTol"
                    type="number"
                    label="Hari Mobil Pakai Tol"
                    placeholder="0"
                    autocomplete="off"
                    @focus="selectInput"
                    @click="selectInput"
                  />
                  <div class="preset-badges">
                    <span
                      v-for="value in dayPresets"
                      :key="'hari-mobil-tol-' + value"
                      class="preset-badge"
                      role="button"
                      tabindex="0"
                      @click="hariTransportMobilTol = value"
                      @keydown.enter.prevent="hariTransportMobilTol = value"
                      @keydown.space.prevent="hariTransportMobilTol = value"
                    >
                      {{ value }}
                    </span>
                  </div>
                </VCol>

                <VCol cols="12" md="4">
                  <VTextField
                    v-model="transportMobilTol"
                    type="number"
                    label="Transport Mobil Pakai Tol"
                    placeholder="0"
                    autocomplete="off"
                    :hint="formatRupiah(transportMobilTol)"
                    persistent-hint
                    @focus="selectInput"
                    @click="selectInput"
                  />
                  <div class="preset-badges">
                    <span
                      v-for="value in transportMobilPresets"
                      :key="'transport-mobil-tol-' + value"
                      class="preset-badge"
                      role="button"
                      tabindex="0"
                      @click="transportMobilTol = value"
                      @keydown.enter.prevent="transportMobilTol = value"
                      @keydown.space.prevent="transportMobilTol = value"
                    >
                      {{ formatPresetNominal(value) }}
                    </span>
                  </div>
                </VCol>

                <VCol cols="12" md="4">
                  <VTextField
                    :model-value="formatRupiah(subtotalTransportMobilTol)"
                    label="Subtotal Mobil Pakai Tol"
                    readonly
                  />
                </VCol>
              </VRow>
            </div>
          </section>

          <section class="form-section">
            <div class="section-heading">
              <span class="section-number">{{ sectionNumber(3) }}</span>
              <div class="section-title">Mobil Tanpa Tol</div>
            </div>
            <div class="section-content">
              <VRow>
                <VCol cols="12" md="4">
                  <VTextField
                    v-model="hariTransportMobilTanpaTol"
                    type="number"
                    label="Hari Mobil Tanpa Tol"
                    placeholder="0"
                    autocomplete="off"
                    @focus="selectInput"
                    @click="selectInput"
                  />
                  <div class="preset-badges">
                    <span
                      v-for="value in dayPresets"
                      :key="'hari-mobil-tanpa-tol-' + value"
                      class="preset-badge"
                      role="button"
                      tabindex="0"
                      @click="hariTransportMobilTanpaTol = value"
                      @keydown.enter.prevent="hariTransportMobilTanpaTol = value"
                      @keydown.space.prevent="hariTransportMobilTanpaTol = value"
                    >
                      {{ value }}
                    </span>
                  </div>
                </VCol>

                <VCol cols="12" md="4">
                  <VTextField
                    v-model="transportMobilTanpaTol"
                    type="number"
                    label="Transport Mobil Tanpa Tol"
                    placeholder="0"
                    autocomplete="off"
                    :hint="formatRupiah(transportMobilTanpaTol)"
                    persistent-hint
                    @focus="selectInput"
                    @click="selectInput"
                  />
                  <div class="preset-badges">
                    <span
                      v-for="value in transportMobilPresets"
                      :key="'transport-mobil-tanpa-tol-' + value"
                      class="preset-badge"
                      role="button"
                      tabindex="0"
                      @click="transportMobilTanpaTol = value"
                      @keydown.enter.prevent="transportMobilTanpaTol = value"
                      @keydown.space.prevent="transportMobilTanpaTol = value"
                    >
                      {{ formatPresetNominal(value) }}
                    </span>
                  </div>
                </VCol>

                <VCol cols="12" md="4">
                  <VTextField
                    :model-value="formatRupiah(subtotalTransportMobilTanpaTol)"
                    label="Subtotal Mobil Tanpa Tol"
                    readonly
                  />
                </VCol>
              </VRow>
            </div>
          </section>

          <section class="form-section">
            <div class="section-heading">
              <span class="section-number">{{ sectionNumber(4) }}</span>
              <div class="section-title">Mengajar</div>
            </div>
            <div class="section-content">
              <VRow>
                <VCol cols="12" md="4">
                  <VTextField
                    ref="refJam"
                    v-model="jam"
                    type="number"
                    label="Jam Mengajar"
                    :rules="[requiredValidator]"
                    placeholder="2"
                    autocomplete="off"
                    @focus="selectInput"
                    @click="selectInput"
                  />
                  <div class="preset-badges">
                    <span
                      v-for="value in jamPresets"
                      :key="'jam-' + value"
                      class="preset-badge"
                      role="button"
                      tabindex="0"
                      @click="jam = value"
                      @keydown.enter.prevent="jam = value"
                      @keydown.space.prevent="jam = value"
                    >
                      {{ value }}
                    </span>
                  </div>
                </VCol>

                <VCol cols="12" md="4">
                  <VTextField
                    v-model="barokahMengajarBiasa"
                    type="number"
                    label="Barokah Mengajar Biasa"
                    placeholder="50000"
                    autocomplete="off"
                    :hint="formatRupiah(barokahMengajarBiasa)"
                    persistent-hint
                    @focus="selectInput"
                    @click="selectInput"
                  />
                  <div class="preset-badges">
                    <span
                      v-for="value in barokahMengajarPresets"
                      :key="'barokah-mengajar-biasa-' + value"
                      class="preset-badge"
                      role="button"
                      tabindex="0"
                      @click="barokahMengajarBiasa = value"
                      @keydown.enter.prevent="barokahMengajarBiasa = value"
                      @keydown.space.prevent="barokahMengajarBiasa = value"
                    >
                      {{ formatPresetNominal(value) }}
                    </span>
                  </div>
                </VCol>

                <VCol cols="12" md="4">
                  <VTextField
                    :model-value="formatRupiah(subtotalMengajarBiasa)"
                    label="Subtotal Mengajar Biasa"
                    readonly
                  />
                </VCol>

                <VCol cols="12" md="4">
                  <VTextField
                    v-model="jamMengajarDoubleDegree"
                    type="number"
                    label="Jam Mengajar Double Degree"
                    placeholder="2"
                    autocomplete="off"
                    @focus="selectInput"
                    @click="selectInput"
                  />
                  <div class="preset-badges">
                    <span
                      v-for="value in jamPresets"
                      :key="'jam-dd-' + value"
                      class="preset-badge"
                      role="button"
                      tabindex="0"
                      @click="jamMengajarDoubleDegree = value"
                      @keydown.enter.prevent="jamMengajarDoubleDegree = value"
                      @keydown.space.prevent="jamMengajarDoubleDegree = value"
                    >
                      {{ value }}
                    </span>
                  </div>
                </VCol>

                <VCol cols="12" md="4">
                  <VTextField
                    v-model="barokahMengajarDoubleDegree"
                    type="number"
                    label="Barokah Mengajar Double Degree"
                    placeholder="50000"
                    autocomplete="off"
                    :hint="formatRupiah(barokahMengajarDoubleDegree)"
                    persistent-hint
                    @focus="selectInput"
                    @click="selectInput"
                  />
                  <div class="preset-badges">
                    <span
                      v-for="value in barokahMengajarPresets"
                      :key="'barokah-mengajar-dd-' + value"
                      class="preset-badge"
                      role="button"
                      tabindex="0"
                      @click="barokahMengajarDoubleDegree = value"
                      @keydown.enter.prevent="barokahMengajarDoubleDegree = value"
                      @keydown.space.prevent="barokahMengajarDoubleDegree = value"
                    >
                      {{ formatPresetNominal(value) }}
                    </span>
                  </div>
                </VCol>

                <VCol cols="12" md="4">
                  <VTextField
                    :model-value="formatRupiah(subtotalMengajarDoubleDegree)"
                    label="Subtotal Mengajar Double Degree"
                    readonly
                  />
                </VCol>
              </VRow>
            </div>
          </section>

          <section class="form-section">
            <div class="section-heading">
              <span class="section-number">{{ sectionNumber(5) }}</span>
              <div class="section-title">Sempro</div>
            </div>
            <div class="section-content">
              <VRow>
                <VCol cols="12" md="6">
                  <VTextField
                    v-model="barokahSempro"
                    type="number"
                    label="Barokah Sempro"
                    placeholder="0"
                    autocomplete="off"
                    :hint="formatRupiah(barokahSempro)"
                    persistent-hint
                    @focus="selectInput"
                    @click="selectInput"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VTextField
                    :model-value="formatRupiah(subtotalSempro)"
                    label="Subtotal Sempro"
                    readonly
                  />
                </VCol>
              </VRow>
            </div>
          </section>

          <section class="form-section">
            <div class="section-heading">
              <span class="section-number">{{ sectionNumber(6) }}</span>
              <div class="section-title">UAS</div>
            </div>
            <div class="section-content">
              <VRow>
                <VCol cols="12" md="4">
                  <VTextField
                    v-model="barokahUas"
                    type="number"
                    label="Barokah UAS / Mahasiswa"
                    placeholder="0"
                    autocomplete="off"
                    :hint="formatRupiah(barokahUas)"
                    persistent-hint
                    @focus="selectInput"
                    @click="selectInput"
                  />
                </VCol>

                <VCol cols="12" md="4">
                  <VTextField
                    v-model="jumlahMahasiswaUas"
                    type="number"
                    label="Jumlah Mahasiswa UAS"
                    placeholder="0"
                    autocomplete="off"
                    @focus="selectInput"
                    @click="selectInput"
                  />
                </VCol>

                <VCol cols="12" md="4">
                  <VTextField
                    :model-value="formatRupiah(subtotalUas)"
                    label="Subtotal UAS"
                    readonly
                  />
                </VCol>
              </VRow>
            </div>
          </section>

          <section class="form-section">
            <div class="section-heading">
              <span class="section-number">{{ sectionNumber(7) }}</span>
              <div class="section-title">Keterangan dan Total</div>
            </div>
            <div class="section-content">
              <VRow>
                <VCol cols="12" md="6">
                  <VTextField
                    :model-value="formatRupiah(subtotalTransport)"
                    label="Subtotal Transport"
                    readonly
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VTextField
                    :model-value="formatRupiah(subtotalMengajar)"
                    label="Subtotal Mengajar"
                    readonly
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VTextField
                    :model-value="formatRupiah(subtotalSempro)"
                    label="Subtotal Sempro"
                    readonly
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VTextField
                    :model-value="formatRupiah(subtotalUas)"
                    label="Subtotal UAS"
                    readonly
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VTextField
                    :model-value="formatRupiah(total)"
                    label="Total"
                    readonly
                    class="total-field"
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
                    class="w-100 evidence-button"
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
              </VRow>
            </div>
          </section>

          <div
            ref="refInlineFooter"
            class="submit-row submit-row-inline"
            :class="{ 'summary-hidden': mobileSummaryHidden }"
          >
            <button
              type="button"
              class="summary-toggle"
              @click="mobileSummaryHidden = !mobileSummaryHidden"
            >
              {{ mobileSummaryHidden ? "Show" : "Hide" }}
            </button>
            <div class="floating-summary">
              <div
                v-for="item in summaryItems"
                :key="'inline-' + item.label"
                class="summary-item"
                :class="{ 'summary-item-total': item.total }"
              >
                <span>{{ item.label }}</span>
                <strong>{{ formatRupiah(item.value) }}</strong>
              </div>
            </div>
            <VBtn type="submit" :disabled="disabled" :loading="disabled" size="large" class="submit-button">
              {{ isEditMode ? "Update" : "Simpan" }}
            </VBtn>
          </div>

          <div
            v-show="showFloatingFooter"
            class="submit-row submit-row-floating"
            :class="{ 'summary-hidden': mobileSummaryHidden }"
          >
            <button
              type="button"
              class="summary-toggle"
              @click="mobileSummaryHidden = !mobileSummaryHidden"
            >
              {{ mobileSummaryHidden ? "Show" : "Hide" }}
            </button>
            <div class="floating-summary">
              <div
                v-for="item in summaryItems"
                :key="'floating-' + item.label"
                class="summary-item"
                :class="{ 'summary-item-total': item.total }"
              >
                <span>{{ item.label }}</span>
                <strong>{{ formatRupiah(item.value) }}</strong>
              </div>
            </div>
            <VBtn
              type="button"
              :disabled="disabled"
              :loading="disabled"
              size="large"
              class="submit-button"
              @click="onSubmit"
            >
              {{ isEditMode ? "Update" : "Simpan" }}
            </VBtn>
          </div>
        </div>
      </VForm>
    </VCardText>
  </VCard>
</template>

<style scoped>
.elder-form :deep(.v-card-title) {
  font-size: 1.08rem;
  font-weight: 600;
}

.elder-form :deep(.v-label) {
  font-size: 0.9rem;
  font-weight: 500;
}

.elder-form :deep(.v-field__input) {
  min-block-size: 48px;
  font-size: 0.95rem;
}

.elder-form :deep(.v-field__input input) {
  font-size: 0.95rem;
}

.form-layout {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-layout.has-floating-footer {
  padding-block-end: 82px;
}

.form-section {
  overflow: hidden;
  border: 1px solid rgba(var(--v-border-color), 0.18);
  border-radius: 8px;
  background: rgb(var(--v-theme-surface));
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  border-block-end: 1px solid rgba(var(--v-border-color), 0.14);
  background: rgba(var(--v-theme-primary), 0.06);
  padding: 14px 16px;
}

.section-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 30px;
  block-size: 30px;
  border-radius: 8px;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  font-size: 0.9rem;
  font-weight: 650;
}

.section-title {
  color: rgba(var(--v-theme-on-surface), 0.92);
  font-size: 1rem;
  font-weight: 600;
}

.section-content {
  padding: 18px 16px 20px;
}

.preset-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-block-start: 8px;
}

.preset-badge {
  border: 1px solid rgba(var(--v-theme-primary), 0.28);
  border-radius: 8px;
  background: rgba(var(--v-theme-primary), 0.08);
  color: rgb(var(--v-theme-primary));
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.1;
  min-block-size: 30px;
  padding: 6px 9px;
  user-select: none;
}

.preset-badge:hover,
.preset-badge:focus-visible {
  background: rgba(var(--v-theme-primary), 0.16);
  outline: none;
}

.evidence-button {
  min-block-size: 48px;
}

.total-field :deep(.v-field__input) {
  color: rgb(var(--v-theme-primary));
  font-size: 1.04rem;
  font-weight: 650;
}

.submit-row {
  position: relative;
  border: 1px solid rgba(var(--v-border-color), 0.2);
  border-radius: 12px;
  background: rgba(var(--v-theme-surface), 0.98);
  backdrop-filter: blur(12px);
  box-shadow: 0 14px 40px rgba(var(--v-shadow-key-umbra-color), 0.16);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(150px, 190px);
  gap: 12px;
  padding: 8px;
}

.summary-toggle {
  display: none;
}

.submit-row-inline {
  position: relative;
}

.submit-row-floating {
  position: fixed;
  z-index: 1007;
  inset-block-end: 16px;
  inset-inline-start: 276px;
  inset-inline-end: 16px;
}

.submit-row-floating .submit-button {
  margin-inline-end: 70px;
}

:global(.layout-wrapper.layout-nav-type-horizontal) .submit-row-floating,
:global(.layout-wrapper.layout-overlay-nav) .submit-row-floating {
  inset-inline-start: 16px;
}

.floating-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(96px, 1fr)) minmax(118px, 1.2fr);
  min-inline-size: 0;
  overflow: hidden;
  border: 1px solid rgba(var(--v-border-color), 0.14);
  border-radius: 10px;
  background: rgba(var(--v-theme-surface), 0.72);
}

.summary-item {
  display: flex;
  justify-content: center;
  flex-direction: column;
  min-block-size: 48px;
  min-inline-size: 0;
  border-inline-end: 1px solid rgba(var(--v-border-color), 0.12);
  background: transparent;
  padding: 7px 12px;
}

.summary-item:last-child {
  border-inline-end: 0;
}

.summary-item span {
  color: rgba(var(--v-theme-on-surface), 0.72);
  font-size: 0.76rem;
  font-weight: 600;
  line-height: 1.2;
}

.summary-item strong {
  color: rgba(var(--v-theme-on-surface), 0.9);
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.summary-item-total {
  background: rgba(var(--v-theme-primary), 0.1);
}

.summary-item-total span,
.summary-item-total strong {
  color: rgb(var(--v-theme-primary));
}

.submit-button {
  min-block-size: 50px;
  border-radius: 10px;
}

@media (max-width: 600px) {
  .form-layout.has-floating-footer {
    padding-block-end: 220px;
  }

  .form-layout.has-floating-footer.is-summary-hidden {
    padding-block-end: 94px;
  }

  .section-heading {
    align-items: flex-start;
    padding: 12px;
  }

  .section-content {
    padding: 14px 12px 16px;
  }

  .preset-badge {
    min-block-size: 32px;
    padding-inline: 10px;
  }

  .submit-row {
    grid-template-columns: 1fr;
    gap: 8px;
    padding-block-start: 18px;
  }

  .submit-row-floating {
    inset-block-end: 8px;
    inset-inline: 8px;
  }

  .submit-row-floating .submit-button {
    margin-inline-end: 64px;
  }

  .summary-toggle {
    position: absolute;
    z-index: 1;
    inset-block-start: -13px;
    inset-inline-start: 50%;
    border: 1px solid rgba(var(--v-theme-primary), 0.28);
    border-radius: 999px;
    background: rgb(var(--v-theme-surface));
    box-shadow: 0 6px 16px rgba(var(--v-shadow-key-umbra-color), 0.16);
    color: rgb(var(--v-theme-primary));
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    font-weight: 700;
    inline-size: 46px;
    min-block-size: 26px;
    padding: 0;
    transform: translateX(-50%);
  }

  .floating-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-block-size: 156px;
    opacity: 1;
    transform: translateY(0);
    transition:
      max-block-size 220ms ease,
      opacity 180ms ease,
      transform 220ms ease,
      border-color 180ms ease;
  }

  .submit-row.summary-hidden {
    gap: 0;
  }

  .submit-row.summary-hidden .floating-summary {
    max-block-size: 0;
    border-color: transparent;
    opacity: 0;
    pointer-events: none;
    transform: translateY(10px);
  }

  .submit-row.summary-hidden .submit-button {
    margin-block-start: 0;
  }

  .summary-item {
    min-block-size: 42px;
    border-block-end: 1px solid rgba(var(--v-border-color), 0.12);
    padding: 6px 10px;
  }

  .summary-item:nth-child(even) {
    border-inline-end: 0;
  }

  .summary-item-total {
    grid-column: 1 / -1;
    border-block-end: 0;
  }
}
</style>
