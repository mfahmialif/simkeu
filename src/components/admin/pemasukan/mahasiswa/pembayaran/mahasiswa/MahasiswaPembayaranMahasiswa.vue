<script setup>
const emit = defineEmits(["refreshTagihan"]);

const mahasiswaList = ref([]);

const search = ref("");
const selectedMahasiswa = ref("");
const loadingDataMahasiswa = ref(false);
const loadingSearch = ref(false);

const emptyMahasiswa = {
  nim: "",
  nama: "",
  prodi: "",
  jenisKelamin: "",
  jkId:"",
  angkatan: "",
  kelas: "",
  semester: "",
  deposit: 0,
  dipakai: 0,
  tagihan: [],
};

const mahasiswa = ref(emptyMahasiswa);

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
    mahasiswa.value.nim = newVal.nim;
    searching();
  } else if (typeof newVal === "string") {
    mahasiswa.value.nim = newVal;
  } else if (!newVal) {
    mahasiswa.value.nim = "";
  }
});

const searching = async () => {
  if (!mahasiswa.value.nim) {
    showSnackbar({
      text: "NIM harus diisi",
      color: "error",
    });
    return;
  }

  try {
    loadingDataMahasiswa.value = true;
    // fetchTagihan();
    emit("refreshTagihan", mahasiswa.value.nim);
    emit("refreshDeposit");

    const res = await $api(`/admin/mahasiswa/nim`, {
      method: "GET",
      body: {
        nim: mahasiswa.value.nim
      }
    });

    if (res.length < 1) {
      showSnackbar({
        text: "Data mahasiswa tidak ditemukan",
        color: "error",
      });
      mahasiswa.value.nim = "";
      mahasiswa.value.nama = "";
      mahasiswa.value.prodi = "";
      mahasiswa.value.jenisKelamin = "";
      mahasiswa.value.jkId = "";
      mahasiswa.value.angkatan = "";
      mahasiswa.value.kelas = "";
      mahasiswa.value.semester = "";
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
    
  } catch (error) {
    showSnackbar({
      text: error,
      color: "error",
    });
  } finally {
    loadingDataMahasiswa.value = false;
  }
};

defineExpose({
  mahasiswa,
});
</script>

<template>
  <!-- 👉 Mahasiswa -->
  <VCard class="mb-6" title="Mahasiswa">
    <VCardText>
      <VRow>
        <VCol cols="12">
          <VCombobox
            v-model="selectedMahasiswa"
            v-model:search="search"
            :items="mahasiswaList"
            item-title="display"
            item-value="nim"
            label="NIM"
            clearable
            :loading="loadingSearch"
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
        <VCol cols="12" md="6">
          <VTextField
            v-model="mahasiswa.nim"
            label="NIM"
            placeholder="NIM"
            readonly
            :loading="loadingDataMahasiswa"
          >
          </VTextField>
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="mahasiswa.nama"
            label="Nama"
            placeholder="Nama"
            readonly
            :loading="loadingDataMahasiswa"
          >
          </VTextField>
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="mahasiswa.prodi"
            label="Prodi"
            placeholder="Prodi"
            readonly
            :loading="loadingDataMahasiswa"
          >
          </VTextField>
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="mahasiswa.jenisKelamin"
            label="Jenis Kelamin"
            placeholder="Jenis Kelamin"
            readonly
            :loading="loadingDataMahasiswa"
          >
          </VTextField>
        </VCol>
        <VCol cols="12" md="4">
          <VTextField
            v-model="mahasiswa.angkatan"
            label="Angkatan"
            placeholder="Angkatan"
            readonly
            :loading="loadingDataMahasiswa"
          >
          </VTextField>
        </VCol>
        <VCol cols="12" md="4">
          <VTextField
            v-model="mahasiswa.kelas"
            label="Kelas"
            placeholder="Kelas"
            readonly
            :loading="loadingDataMahasiswa"
          >
          </VTextField>
        </VCol>
        <VCol cols="12" md="4">
          <VTextField
            v-model="mahasiswa.semester"
            label="Semester"
            placeholder="Semester"
            readonly
            :loading="loadingDataMahasiswa"
          >
          </VTextField>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
