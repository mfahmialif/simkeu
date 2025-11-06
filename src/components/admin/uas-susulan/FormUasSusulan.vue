<script setup>
import { showSnackbar } from "@/composables/snackbar";
import { consoleError } from "vuetify/lib/util/console.mjs";

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
const selectedMahasiswa = ref(null);

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
const keterangan = ref("");
const disabledSusulan = ref(true);
const disabled = ref(false);
const disabledSearch = ref(false);

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
    disabledSusulan.value = true;

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

    disabledSusulan.value = false;
  } catch (error) {
    disabledSusulan.value = true;
    showSnackbar({
      text: error,
      color: "error",
    });
  } finally {
    loadingDataMahasiswa.value = false;
  }
};

const selectedThAkademik = ref(null);
const thAkademik = ref([]);
const isLoadingThAkademik = ref(false);
const tanggal = ref("");

const fetchThAkademik = async () => {
  try {
    isLoadingThAkademik.value = true;
    const { data } = await $api("/admin/th-akademik", {
      method: "GET",
    });

    thAkademik.value = data.data.map((thAkademik) => {
      return {
        title: `${thAkademik.nama} - ${thAkademik.semester}`,
        value: thAkademik.id,
      };
    });
  } catch (err) {
    console.error(err);
  } finally {
    isLoadingThAkademik.value = false;
  }
};

const jadwal = ref([]);
const selectedJadwal = ref([]);
const isLoadingJadwal = ref(false);

const fetchJadwal = async () => {
  try {
    isLoadingJadwal.value = true;
    const response = await $api(
      "/admin/pemasukan/mahasiswa/uas-susulan/jadwal-kuliah",
      {
        method: "GET",
        body: {
          nim: mahasiswa.value.nim,
          th_akademik_id: selectedThAkademik.value,
        },
      }
    );

    if (!response.status) {
      showSnackbar({
        text: response.message,
        color: "error",
      });
      return;
    }

    const data = response.data;

    const prodi = data.prodi.alias;

    jadwal.value = data.krs_detail.map((krsDetail) => {
      return {
        title: `${prodi} - ${krsDetail.jadwal_kuliah.kurikulum_matakuliah.matakuliah.nama} - ${krsDetail.jadwal_kuliah.kelompok.kode}`,
        value: krsDetail.jadwal_kuliah_id,
      };
    });
  } catch (err) {
    console.error(err);
  } finally {
    isLoadingJadwal.value = false;
  }
};

watch(selectedJadwal, (newValue) => {
console.log(newValue);
});

watch(
  [selectedThAkademik, mahasiswa],
  async ([th, mhs]) => {
    if (th && mhs.nim) {
      await fetchJadwal();

      if (props.typeForm === "edit") {
        selectedJadwal.value = props.dataForm.uas_susulan_mk.map((item) => item.jadwal_kuliah_id);
      }
    } else {
      // showSnackbar({
      //   text: "NIM dan Th Akademik harus diisi",
      //   color: "error",
      // });
    }
  },
  { deep: true }
);

onMounted(async () => {
  tanggal.value = fDate(new Date());
  await fetchThAkademik();

  if (props.typeForm === "edit") {
    disabledSearch.value = true;
    selectedMahasiswa.value = props.dataForm.nim;
    tanggal.value = props.dataForm.tanggal;
    selectedThAkademik.value = props.dataForm.th_akademik_id;
    searchNim.value = props.dataForm.nim;
    if (selectedMahasiswa.value) {
      await searching();
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
  formData.append("tanggal", tanggal.value);
  formData.append("th_akademik_id", selectedThAkademik.value);
  formData.append("keterangan", keterangan.value);
  selectedJadwal.value.forEach((jadwal) => {
    formData.append("jadwal_kuliah_id[]", jadwal);
  });
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

      router.push("/admin/pemasukan/mahasiswa/uas-susulan");
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
      <!-- Input Tanggal -->
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
      <VCol cols="12" sm="12">
        <VSelect
          v-model="selectedThAkademik"
          label="Select Th Akademik"
          placeholder="Select Th Akademik"
          :items="thAkademik"
          clear-icon="ri-close-line"
          class="custom-bg-select"
          :loading="isLoadingThAkademik"
          :disabled="true"
        />
      </VCol>

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
          :disabled="true"
          label="NIM"
          placeholder="2020xxxx"
          :loading="loadingDataMahasiswa"
        />
      </VCol>
      <VCol cols="12">
        <VTextField
          v-model="mahasiswa.nama"
          :disabled="true"
          label="Nama"
          placeholder="Fulan Fulanah"
          :loading="loadingDataMahasiswa"
        />
      </VCol>
      <VCol cols="12">
        <VTextField
          v-model="mahasiswa.prodi"
          :disabled="true"
          label="Program Studi"
          :loading="loadingDataMahasiswa"
        />
      </VCol>
      <VCol cols="12">
        <VTextField
          v-model="mahasiswa.jenisKelamin"
          :disabled="true"
          label="Jenis Kelamin"
          :loading="loadingDataMahasiswa"
        />
      </VCol>
      <VCol cols="12">
        <VTextField
          v-model="mahasiswa.angkatan"
          :disabled="true"
          label="Angkatan"
          :loading="loadingDataMahasiswa"
        />
      </VCol>
      <VCol cols="12">
        <VTextField
          v-model="mahasiswa.kelas"
          :disabled="true"
          isabled
          label="Kelas"
          :loading="loadingDataMahasiswa"
        />
      </VCol>
      <VCol cols="12">
        <VTextField
          v-model="mahasiswa.semester"
          :disabled="true"
          label="Semester"
          :loading="loadingDataMahasiswa"
        />
      </VCol>
      <VCol cols="12" sm="12">
        <VSelect
          v-model="selectedJadwal"
          label="Select Jadwal"
          chips
          multiple
          placeholder="Select Jadwal"
          :items="jadwal"
          clear-icon="ri-close-line"
          class="custom-bg-select"
          :loading="isLoadingJadwal"
          :disabled="disabledSusulan"
        />
      </VCol>
      <VCol cols="12">
        <VTextarea
          v-model="keterangan"
          label="keterangan"
          :disabled="disabledSusulan"
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
