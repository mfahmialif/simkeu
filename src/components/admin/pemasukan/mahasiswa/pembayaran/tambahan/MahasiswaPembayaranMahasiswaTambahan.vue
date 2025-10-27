<script setup>

const props = defineProps({
  typeForm: {
    type: String,
    required: true,
  },
  dataForm: {
    type: Object,
    required: true,
  },
});

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

const jenisKelaminList = [
  { value: "L", text: "Laki-laki" },
  { value: "P", text: "Perempuan" },
];

const kelasList = [
  { value: "Reguler", text: "Reguler" },
  { value: "Non Reguler", text: "Non Reguler" },
  { value: "Karyawan", text: "Karyawan" },
];

const prodi = ref([]);
const loadingProdi = ref(false);

const fetchProdi = async () => {
  try {
    loadingProdi.value = true;
    const { data } = await $api('/admin/prodi', {
      method: "GET",
      body: {
        limit: 0,
        sort_key: 'kode',
        sort_order: 'desc',
      }
    })

    prodi.value = data.data.map(prodi => {
      return {
        title: prodi.nama,
        value: prodi.nama,
      }
    })
  } catch (err) {
    console.error(err)
  } finally {
    loadingProdi.value = false;
  }
}

onMounted(() => {
  fetchProdi()
})


watch(
  () => props.dataForm,
  (newVal) => {
    if (props.typeForm === "edit" && newVal) {
      mahasiswa.value = {
        nim: newVal.nim,
        nama: newVal.nama,
        prodi: newVal.prodi,
        jenisKelamin: newVal.jenis_kelamin,
        angkatan: newVal.th_angkatan,
        kelas: newVal.kelas,
        semester: newVal.smt,
      };
    }
  },
);

defineExpose({
  mahasiswa,
});
</script>

<template>
  <!-- 👉 Mahasiswa -->
  <VCard class="mb-6" title="Mahasiswa">
    <VCardText>
      <VRow>
        <VCol cols="12" md="6">
          <VTextField
            v-model="mahasiswa.nim"
            label="NIM"
            placeholder="NIM"
          >
          </VTextField>
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="mahasiswa.nama"
            label="Nama"
            placeholder="Nama"
          >
          </VTextField>
        </VCol>
        <VCol cols="12" md="6">
          <VSelect
            v-model="mahasiswa.prodi"
            :items="prodi"
            item-title="title"
            item-value="value"
            label="Prodi"
            placeholder="Prodi"
            :loading="loadingProdi"
          >
          </VSelect>
        </VCol>
        <VCol cols="12" md="6">
          <VSelect
            v-model="mahasiswa.jenisKelamin"
            :items="jenisKelaminList"
            item-title="text"
            item-value="value"
            label="Jenis Kelamin"
            placeholder="Jenis Kelamin"
          >
          </VSelect>
        </VCol>
        <VCol cols="12" md="4">
          <VTextField
            v-model="mahasiswa.angkatan"
            label="Angkatan"
            placeholder="Angkatan"
          >
          </VTextField>
        </VCol>
        <VCol cols="12" md="4">
          <VSelect
            v-model="mahasiswa.kelas"
            :items="kelasList"
            item-title="text"
            item-value="value"
            label="Kelas"
            placeholder="Kelas"
          >
          </VSelect>
        </VCol>
        <VCol cols="12" md="4">
          <VTextField
            v-model="mahasiswa.semester"
            label="Semester"
            placeholder="Semester"
          >
          </VTextField>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
