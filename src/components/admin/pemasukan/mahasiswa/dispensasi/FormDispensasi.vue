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

const passwordValidator = (value) => {
  if (value.length < 6) return "Password must be at least 6 characters";
  return true;
};

const noSpaceValidator = (value) => {
  if (/\s/.test(value))
    return "Username cannot contain spaces, example: fulanah123";
  return true;
};

const refForm = ref(null);
const tahun = ref("");
const tahunList = ref([]);
const keterangan = ref("");
const disabled = ref(false);
const loading = ref(false);
const isSelecting = ref(false);
const mahasiswaList = ref([]);
const search = ref("");
const searchNim = ref("");
const selectedMahasiswa = ref("");
const loadingDataMahasiswa = ref(false);
const loadingSearch = ref(false);

const mahasiswa = ref(emptyMahasiswa);
onMounted(async () => {
  await fetchAllTahun();


});
const Mahasiswanim = async (nim) => {
  loadingDataMahasiswa.value = true;
  console.log(nim);

  try {
    const response = await $api("/admin/mahasiswa/nim", {
      method: "GET",
      params: {
        nim: nim
      }
    });

    const data = response.data ? response.data : response;

    mahasiswa.value.prodi = data.prodi?.nama;
    mahasiswa.value.nama = data.nama;
    mahasiswa.value.jenisKelamin = data.jk?.nama;
    mahasiswa.value.angkatan = data.th_akademik?.kode?.slice(0, -1) ?? "-";
    mahasiswa.value.kelas = data.kelas?.nama;
    mahasiswa.value.semester = data.semester;

    console.log("mahasiswa", mahasiswa.value.nim);
  } catch (err) {
    console.error(err);
    mahasiswa.value = emptyMahasiswa;
  } finally {
    loadingDataMahasiswa.value = false;
  }
};

watch(
  () => props.dataForm,
  async (newVal) => {
    if (props.typeForm === "edit" && newVal) {
      mahasiswa.value.nim = newVal.nim;
      await Mahasiswanim(newVal.nim);
      mahasiswa.value.nama = mahasiswa.value.nama;
      mahasiswa.value.prodi = mahasiswa.value.prodi;
      mahasiswa.value.jenisKelamin = mahasiswa.value.jenisKelamin;
      mahasiswa.value.angkatan = mahasiswa.value.angkatan.slice(0, -1);
      mahasiswa.value.kelas = mahasiswa.value.kelas;
      mahasiswa.value.semester = mahasiswa.value.semester;
      tahun.value = newVal.th_akademik_id;
      keterangan.value = newVal.keterangan;
    }
  },
  { immediate: true } // langsung jalan kalau dataForm sudah dikirim dari parent
);

const onSubmit = async () => {
  const valid = await refForm.value.validate();
  if (!valid.valid) return;

  const method = props.typeForm === "edit" ? "PUT" : "POST";

  disabled.value = true;
  console.log('tahun', tahun.value);

  const formData = new FormData();
  formData.append("nim", mahasiswa.value.nim);
  formData.append("th_akademik_id", tahun.value);
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

    if (response.status === "true") {
      showSnackbar({
        text: response.message,
        color: "success",
      });

      router.push("/admin/pemasukan/mahasiswa/dispensasi");
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

let typingTimeout = null;

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

watch(selectedMahasiswa, (newVal) => {
  if (newVal && typeof newVal === "object" && !Array.isArray(newVal)) {
    searchNim.value = newVal.nim;
    searching();
  } else if (typeof newVal === "string") {
    searchNim.value = newVal;
  } else if (!newVal) {
    searchNim.value = "";
  }
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

    const res = await $api(`/admin/mahasiswa/nim`, {
      method: "GET",
      body: {
        nim: searchNim.value
      }
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
    mahasiswa.value.angkatan = res.th_akademik?.kode.slice(0, -1) ?? "-";
    mahasiswa.value.kelas = res.kelas?.nama;
    mahasiswa.value.semester = res.semester;

  } catch (error) {
    showSnackbar({
      text: error,
      color: "error",
    });
  } finally {
    loadingDataMahasiswa.value = false;
  }
};

const fetchAllTahun = async (search) => {
  loading.value = true;
  try {
    const response = await $api("/admin/th-akademik", {
      method: "GET",
      params: {
        // id: search || "",
        search: search || "",
      },
    });
    console.log("response", response.data.data);
    tahunList.value = response.data.data.map(t => ({
      value: t.id,
      title: `${t.nama} - ${t.semester}`,
    }));

    console.log("tahunList", tahun.value);

  } catch (err) {
    console.error(err);
    tahunList.value = [];
  } finally {
    loading.value = false;
  }
};

</script>
<style scoped>
.autocomplete-list {
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
  border-radius: 4px;
}

.cursor-pointer {
  cursor: pointer;
}
</style>

<template>
  <VForm ref="refForm" @submit.prevent="onSubmit">
    <VRow>
      <VCol cols="12">
        <VSelect v-model="tahun" label="Select Th Akademik" placeholder="Select Th Akademik" :items="tahunList"
          :rules="[requiredValidator]" clear-icon="ri-close-line" />
      </VCol>
      <VCol cols="12">
        <VCombobox v-model="selectedMahasiswa" v-model:search="search" :items="mahasiswaList" item-title="display"
          item-value="nim" label="NIM" clearable :loading="loadingSearch">
          <template #append-inner>
            <VProgressCircular v-if="loadingSearch" indeterminate size="16" width="2" />
          </template>
          <!-- Append -->
          <template #append>
            <VBtn :size="$vuetify.display.smAndDown ? 'small' : 'large'" :icon="$vuetify.display.smAndDown"
              @click="searching">
              <VIcon icon="ri-search-line" />
              <span v-if="$vuetify.display.mdAndUp" class="ms-3">Search</span>
            </VBtn>
          </template>
        </VCombobox>
      </VCol>
      <VCol cols="12" md="6">
        <VTextField v-model="mahasiswa.nim" label="NIM" placeholder="NIM" readonly :loading="loadingDataMahasiswa">
        </VTextField>
      </VCol>
      <VCol cols="12" md="6">
        <VTextField v-model="mahasiswa.nama" label="Nama" placeholder="Nama" readonly :loading="loadingDataMahasiswa">
        </VTextField>
      </VCol>
      <VCol cols="12" md="6">
        <VTextField v-model="mahasiswa.prodi" label="Prodi" placeholder="Prodi" readonly
          :loading="loadingDataMahasiswa">
        </VTextField>
      </VCol>
      <VCol cols="12" md="6">
        <VTextField v-model="mahasiswa.jenisKelamin" label="Jenis Kelamin" placeholder="Jenis Kelamin" readonly
          :loading="loadingDataMahasiswa">
        </VTextField>
      </VCol>
      <VCol cols="12" md="4">
        <VTextField v-model="mahasiswa.angkatan" label="Angkatan" placeholder="Angkatan" readonly
          :loading="loadingDataMahasiswa">
        </VTextField>
      </VCol>
      <VCol cols="12" md="4">
        <VTextField v-model="mahasiswa.kelas" label="Kelas" placeholder="Kelas" readonly
          :loading="loadingDataMahasiswa">
        </VTextField>
      </VCol>
      <VCol cols="12" md="4">
        <VTextField v-model="mahasiswa.semester" label="Semester" placeholder="Semester" readonly
          :loading="loadingDataMahasiswa">
        </VTextField>
      </VCol>
      <VCol cols="12">
        <VTextarea label="Keterangan" v-model="keterangan" placeholder="Placeholder Text" />
      </VCol>
      <VCol cols="12" class="d-flex gap-4">
        <VBtn type="submit" :disabled @click="refForm?.validate()">
          Submit
        </VBtn>
        <VBtn type="reset" v-if="typeForm !== 'edit'" color="secondary" variant="tonal">
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
