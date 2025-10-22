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

const refForm = ref(null);

const emptyMahasiswa = {
  nim: "",
  nama: "",
  prodi: "",
  jenisKelamin: "",
  jkId: "",
  angkatan: "",
  kelas: "",
  semester: "",
  deposit: 0,
  dipakai: 0,
  tagihan: [],
};

const mahasiswaList = ref([]);

const search = ref("");
const searchNim = ref("");
const selectedMahasiswa = ref("");

const loadingDataMahasiswa = ref(false);
const loadingSearch = ref(false);

watch(selectedMahasiswa, (newVal) => {
  if (newVal && typeof newVal === "object" && !Array.isArray(newVal)) {
    // mahasiswa.value.nim = newVal.nim;
    searchNim.value = newVal.nim;
    searching();
  } else if (typeof newVal === "string") {
    // mahasiswa.value.nim = newVal;
    searchNim.value = newVal;
  } else if (!newVal) {
    // mahasiswa.value.nim = "";
    searchNim.value = "";
  }
});

let typingTimeout = null;
const mahasiswa = ref(emptyMahasiswa);
const jumlah = ref(0);
const keterangan = ref("");
const disabledDeposit = ref(true);
const disabled = ref(false);
const disabledSearch = ref(false);
const refJumlah = ref(null);

watch(search, (newVal) => {
  clearTimeout(typingTimeout);

  if (!newVal.trim()) {
    mahasiswaList.value = [];
    loadingSearch.value = false;
    return;
  }

  typingTimeout = setTimeout(async () => {
    try {
      loadingSearch.value = true;
      const res = await $api(`/admin/mahasiswa/search/${newVal}`, {
        method: "GET",
      });
      // ubah hasil API jadi format { nim, nama, display: "nama - nim" }
      mahasiswaList.value = res.map((m) => ({
        ...m,
        display: `${m.nim} - ${m.nama}`,
      }));
    } catch (err) {
      showSnackbar({
        text: "Gagal mendapatkan list mahasiswa",
        color: "error",
      });
      mahasiswaList.value = [];
    } finally {
      loadingSearch.value = false;
    }
  }, 1000); // <-- debounce 2 detik
});

const searching = async () => {
  if (!searchNim.value) {
    showSnackbar({
      text: "NIM harus diisi",
      color: "error",
    });
    return;
  }

  try {
    loadingDataMahasiswa.value = true;
    disabledDeposit.value = true;

    const res = await $api(`/admin/mahasiswa/nim`, {
      method: "GET",
      body: {
        nim: searchNim.value,
      },
    });

    if (res.length < 1) {
      showSnackbar({
        text: "Data mahasiswa tidak ditemukan",
        color: "error",
      });
      return;
    }

    mahasiswa.value.nim = res.nim;
    mahasiswa.value.nama = res.nama;
    mahasiswa.value.prodi = res.prodi?.nama;
    mahasiswa.value.jenisKelamin = res.jk?.nama;
    mahasiswa.value.jkId = res.jk?.id;
    mahasiswa.value.angkatan = res.th_akademik?.kode;
    mahasiswa.value.kelas = res.kelas?.nama;
    mahasiswa.value.semester = res.semester;

    disabledDeposit.value = false;
    await nextTick();
    refJumlah.value.focus();
  } catch (error) {
    disabledDeposit.value = true;
    showSnackbar({
      text: error,
      color: "error",
    });
  } finally {
    loadingDataMahasiswa.value = false;
  }
};

onMounted(() => {
  if (props.typeForm === "edit") {
    disabledSearch.value = true;
    selectedMahasiswa.value = props.dataForm.nim;
    searchNim.value = props.dataForm.nim;
    if (selectedMahasiswa.value) {
      searching();
      jumlah.value = props.dataForm.jumlah;
      keterangan.value = props.dataForm.keterangan;
    }
  }
});

const onSubmit = async () => {
  const valid = await refForm.value.validate();
  if (!valid.valid) return;

  const method = props.typeForm === "edit" ? "PUT" : "POST";

  disabled.value = true;

  const formData = new FormData();
  formData.append("nim", mahasiswa.value.nim);
  formData.append("jumlah", jumlah.value);
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

      router.push("/admin/pemasukan/mahasiswa/catatan-deposit");
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
        <VCombobox
          v-model="selectedMahasiswa"
          v-model:search="search"
          :items="mahasiswaList"
          item-title="display"
          item-value="nim"
          label="Searching"
          autocomplete="off"
          placeholder="NIM / Nama mahasiswa"
          clearable
          :loading="loadingSearch"
          :disabled="disabledSearch"
        >
          <template #append-inner>
            <VProgressCircular
              v-if="loadingSearch"
              indeterminate
              size="16"
              width="2"
            />
          </template>

          <!-- Append -->
          <template #append>
            <VBtn
              :size="$vuetify.display.smAndDown ? 'small' : 'large'"
              :icon="$vuetify.display.smAndDown"
              @click="searching"
            >
              <VIcon icon="ri-search-line" />
              <span v-if="$vuetify.display.mdAndUp" class="ms-3">Search</span>
            </VBtn>
          </template>
        </VCombobox>
      </VCol>
      <VCol cols="12">
        <VTextField
          v-model="mahasiswa.nim"
          :rules="[requiredValidator]"
          disabled="true"
          label="NIM"
          placeholder="2020xxxx"
          :loading="loadingDataMahasiswa"
        />
      </VCol>
      <VCol cols="12">
        <VTextField
          v-model="mahasiswa.nama"
          disabled="true"
          label="Nama"
          placeholder="Fulan Fulanah"
          :loading="loadingDataMahasiswa"
        />
      </VCol>
      <VCol cols="12">
        <VTextField
          v-model="mahasiswa.prodi"
          disabled="true"
          label="Program Studi"
          :loading="loadingDataMahasiswa"
        />
      </VCol>
      <VCol cols="12">
        <VTextField
          v-model="mahasiswa.jenisKelamin"
          disabled="true"
          label="Jenis Kelamin"
          :loading="loadingDataMahasiswa"
        />
      </VCol>
      <VCol cols="12">
        <VTextField
          v-model="mahasiswa.angkatan"
          disabled="true"
          label="Angkatan"
          :loading="loadingDataMahasiswa"
        />
      </VCol>
      <VCol cols="12">
        <VTextField
          v-model="mahasiswa.kelas"
          disabled="true"
          isabled
          label="Kelas"
          :loading="loadingDataMahasiswa"
        />
      </VCol>
      <VCol cols="12">
        <VTextField
          v-model="mahasiswa.semester"
          disabled="true"
          label="Semester"
          :loading="loadingDataMahasiswa"
        />
      </VCol>
      <VCol cols="12">
        <VTextField
          ref="refJumlah"
          v-model="jumlah"
          :rules="[requiredValidator]"
          label="Jumlah"
          type="number"
          min="0"
          :hint="formatRupiah(jumlah)"
          persistent-hint
          :disabled="disabledDeposit"
        />
      </VCol>
      <VCol cols="12">
        <VTextarea
          v-model="keterangan"
          label="keterangan"
          :disabled="disabledDeposit"
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
