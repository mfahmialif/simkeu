<script setup>
import { showSnackbar } from "@/composables/snackbar";
import { watch } from "vue";

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

const nim = ref("");
const prodi = ref("");
const tahun = ref("");
const tahunList = ref([]);
const kelas = ref("");
const semester = ref("");
const keterangan = ref("");
const name = ref("");
const angkatan = ref("");
const disabled = ref(false);
const jk = ref("");
const array = ref([]);
const loading = ref(false);
const isSelecting = ref(false);
const showList = computed(() => nim.value && !selected.value && array.value.length > 0)
const selected = ref(false);

onMounted(async () => {
  // fetchJenisKelamin();
  await fetchAllTahun();
  if (props.typeForm === "edit") {
    console.log("dataForm", props.dataForm.th_akademik_id);
    array.value = []
    await nimMahasiswa(props.dataForm.nim);
    name.value = array.value[0].nama;
    prodi.value = array.value[0].prodi;
    jk.value = array.value[0].jk;
    angkatan.value = array.value[0].angkatan;
    kelas.value = array.value[0].kelas;
    semester.value = array.value[0].semester;
    nim.value = props.dataForm.nim;
    tahun.value = props.dataForm.th_akademik_id;
    keterangan.value = props.dataForm.keterangan;
  }
});

const onSubmit = async () => {
  const valid = await refForm.value.validate();
  if (!valid.valid) return;

  const method = props.typeForm === "edit" ? "PUT" : "POST";

  disabled.value = true;
  console.log('tahun', tahun.value);

  const formData = new FormData();
  formData.append("nim", nim.value);
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

const nimMahasiswa = async (nim) => {
  console.log("search", nim);
  if (nim == "" || nim == null) {
    return;
  } else {
    console.log("nim", nim);
    loading.value = true;  // mulai loading
    try {
      const mahasiswa = await $api(`/admin/mahasiswa/nim`, {
        method: "GET",
        params: { nim: nim },
      });

      array.value = mahasiswa
        ? [{
          id: mahasiswa.id,
          nim: mahasiswa.nim,
          nama: mahasiswa.nama,
          prodi: mahasiswa.prodi?.alias || "",
          jk: mahasiswa.jk?.nama || "",
          angkatan: mahasiswa.th_akademik?.kode.slice(0, -1) || "",
          kelas: mahasiswa.kelas?.nama || "",
          semester: mahasiswa.semester || "",
        }]
        : [];

    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;  // selesai loading
    }

  }

};

watch(nim, async (newNim) => {
  await nimMahasiswa(newNim);
});

const selectItem = (item) => {
  name.value = item.nama;
  nim.value = item.nim;
  prodi.value = item.prodi;
  jk.value = item.jk;
  angkatan.value = item.angkatan;
  kelas.value = item.kelas;
  semester.value = item.semester;
  array.value = []
}

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


// const onSearch = async () => {
//   selected.value = false // reset status terpilih
//   if (!nim.value) {
//     array.value = []
//     return
//   }
//   console.log('Searching for:', nim.value);
//   // await nimMahasiswa(search);

// };

const selectTahun = (value) => {
  isSelecting.value = true
  console.log("Selected tahun ID:", value);
  tahun.value = value;
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
        <div class="d-flex align-items-center">
          <VTextField v-model="nim" :rules="[requiredValidator, noSpaceValidator]" label="Nim"
            placeholder="fulanah123" />
          <!-- <VBtn type="submit" @click="nimMahasiswa(nim)" :disabled class="ms-2" height="45px">
            <VIcon icon="ri-search-line"></VIcon>
          </VBtn> -->
        </div>
        <Vcol cols="10">
          <VList class="autocomplete-list" elevation="4" v-if="showList">
            <VListItem v-if="loading">
              <VListItemTitle>
                <VProgressCircular indeterminate size="20" width="2" class="me-2" />
                Sedang mencari...
              </VListItemTitle>
            </VListItem>
            <VListItem v-for="item in array" :key="item.id" @click="selectItem(item)" v-else>
              <VListItemTitle>{{ item.nim }}</VListItemTitle>
              <VListItemSubtitle>{{ item.nama }}</VListItemSubtitle>
            </VListItem>
          </VList>
        </Vcol>

      </VCol>
      <VCol cols="12">
        <VTextField v-model="name" :rules="[requiredValidator]" :disabled="true" label="Nama"
          placeholder="Fulan Fulanah" />
      </VCol>
      <VCol cols="12" md="6">
        <VTextField v-model="prodi" :rules="[requiredValidator]" :disabled="true" label="Program Studi" />
      </VCol>
      <VCol cols="12" md="6">
        <VTextField v-model="jk" :rules="[requiredValidator]" :disabled="true" label="Jenis Kelamin" />
      </VCol>
      <VCol cols="12" md="4">
        <VTextField v-model="angkatan" :rules="[requiredValidator]" :disabled="true" label="Angkatan" />
      </VCol>
      <VCol cols="12" md="4">
        <VTextField v-model="kelas" :rules="[requiredValidator]" :disabled="true" isabled label="Kelas" />
      </VCol>
      <VCol cols="12" md="4">
        <VTextField v-model="semester" :rules="[requiredValidator]" :disabled="true" label="Semester" />
      </VCol>
      <VCol cols="12">
        <VTextField v-model="keterangan" :rules="[requiredValidator]" label="keterangan" />
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
