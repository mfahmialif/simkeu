<script setup>
import { formatRupiah } from "@/composables/formatRupiah";
import { showSnackbar } from "@/composables/snackbar";
import { ref, watch } from "vue";

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
const edit = ref(true);
const refForm = ref(null);
const DispensasiList = ["Non Beasiswa", "Beasiswa"];
const jenisDispensasi = ref("");
const jenisTagihan = ref("");
const tagihan = ref([]);
const tahunList = ref([]);
const tahun = ref(null);
const selectedTagihan = ref();
const loadingTagihan = ref(false);
const batas = ref(null);
const keterangan = ref("");
const disabled = ref(false);
const array = ref([]);
const loading = ref(false);
const search = ref("");
const loadingSearch = ref(false);
const selectedMahasiswa = ref("");
const searchNim = ref("");
const mahasiswa = ref(emptyMahasiswa);
const loadingDataMahasiswa = ref(false);
const mahasiswaList = ref([]);
onMounted(async () => {
  await fetchAllTahun();
  batas.value = "9999-12-31";
  if (props.typeForm === "edit") {
    array.value = [];
    edit.value = false;
    console.log(edit.value);
    await nimMahasiswa(props.dataForm.nim);
    mahasiswa.value.nama = array.value[0].nama;
    mahasiswa.value.prodi = array.value[0].prodi;
    mahasiswa.value.jenisKelamin = array.value[0].jk;
    mahasiswa.value.angkatan = array.value[0].angkatan;
    mahasiswa.value.kelas = array.value[0].kelas;
    mahasiswa.value.semester = array.value[0].semester;
    mahasiswa.value.nim = props.dataForm.nim;
    tahun.value = props.dataForm.th_akademik_id;
    keterangan.value = props.dataForm.keterangan;
    jenisDispensasi.value = props.dataForm.jenis;
    jenisTagihan.value = props.dataForm.jenis_tagihan_id;
    batas.value = props.dataForm.batas;
    if (props.dataForm.jenis_tagihan_id) {
      rows.value = [];
      await fetchTagihanId(props.dataForm.id, props.dataForm.jenis_tagihan_id);
    }
  }
});

const onSubmit = async () => {
  const valid = await refForm.value.validate();
  if (!valid.valid) return;

  const method = props.typeForm === "edit" ? "PUT" : "POST";
  console.log("tahun", tahun.value);

  console.log("jenisTagihan", jenisTagihan.value);
  console.log("isi dari array rows", JSON.stringify(rows.value, null, 2));

  const formData = new FormData();
  formData.append("nim", mahasiswa.value.nim);
  formData.append("batas", batas.value);
  formData.append("jenis", jenisDispensasi.value);
  console.log(props.typeForm);
  if (props.typeForm === "edit") {
    formData.append("jenis_tagihan_id", rows.value[0].id);
    formData.append("jumlah", rows.value[0].jumlah_dispensasi);
  } else {
    for (let index = 0; index < rows.value.length; index++) {
      const element = rows.value[index];

      formData.append("jenis_tagihan_id[]", element.id);
      formData.append("jumlah[]", element.jumlah_dispensasi);
    }
    // formData.append("jenis_tagihan_id", jenisTagihan.value.value);
  }
  formData.append("th_akademik_id", tahun.value);
  formData.append("keterangan", keterangan.value);
  //formData.append("jumlah", jumlah.value);
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

      router.push("/admin/pemasukan/mahasiswa/dispensasi-tagihan");
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
    edit.value = true;
  }
};

const nimMahasiswa = async (nim) => {
  console.log("search", nim);
  if (nim == "" || nim == null) {
    return;
  } else {
    console.log("nim", nim);
    loading.value = true; // mulai loading
    try {
      const mahasiswa = await $api(`/admin/mahasiswa/nim`, {
        method: "GET",
        params: { nim: nim },
      });

      array.value = mahasiswa
        ? [
            {
              id: mahasiswa.id,
              nim: mahasiswa.nim,
              nama: mahasiswa.nama,
              prodi: mahasiswa.prodi?.alias || "",
              jk: mahasiswa.jk?.nama || "",
              angkatan: mahasiswa.th_akademik?.kode.slice(0, -1) || "",
              kelas: mahasiswa.kelas?.nama || "",
              semester: mahasiswa.semester || "",
            },
          ]
        : [];
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false; // selesai loading
    }
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
    tahunList.value = response.data.data.map((t) => ({
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

const fetchTagihan = async (nim) => {
  try {
    loadingTagihan.value = true;
    tagihan.value = [];
    const res = await $api(`/admin/pemasukan/mahasiswa/cek-tagihan`, {
      method: "GET",
      body: {
        nim: nim,
      },
    });

    console.log("res", res);

    tagihan.value = res.data.list_tagihan.map((item) => ({
      ...item,
      display: `${item.nama} - Rp.${item.sisa}${
        item.dibayar > 0 ? " (Dibayar: Rp." + item.dibayar + ")" : ""
      }`,
    }));
  } catch (error) {
    showSnackbar({
      text: error,
      color: "error",
    });
  } finally {
    loadingTagihan.value = false;
  }
};

const fetchTagihanId = async (id, jenis_tagihan_id) => {
  try {
    loadingTagihan.value = true;
    rows.value = [];
    console.log("hasil dari id", id);
    console.log("hasil dari jenis_tagihan_id", jenis_tagihan_id);

    const res = await $api(
      `/admin/pemasukan/mahasiswa/dispensasi-tagihan/join`,
      {
        method: "POST",
        body: {
          id: id,
          jenis_tagihan_id: jenis_tagihan_id,
        },
      }
    );

    console.log("data hasil req fetchTagihanId", JSON.stringify(res, null, 2));

    const data = res.data ? res.data : res;
    rows.value = data.map((item) => ({
      id: item.id,
      display: item.nama_tagihan,
      jumlah: item.jumlah ?? 0,
      jumlah_dispensasi: item.jumlah_dispensasi ?? 0, // default isi penuh
      deposit: 0,
    }));

    // rows.value = res.data.list_tagihan.map((item) => ({
    //   ...item,
    //   display: `${item.nama} - Rp.${item.sisa}${
    //     item.dibayar > 0 ? " (Dibayar: Rp." + item.dibayar + ")" : ""
    //   }`,
    // }));
  } catch (error) {
    showSnackbar({
      text: error,
      color: "error",
    });
  } finally {
    loadingTagihan.value = false;
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
    mahasiswa.value.angkatan = res.th_akademik?.kode.slice(0, -1) ?? "-";
    mahasiswa.value.kelas = res.kelas?.nama;
    mahasiswa.value.semester = res.semester;

    if (mahasiswa.value.nim) {
      await fetchTagihan(mahasiswa.value.nim);
    } else {
      showSnackbar({
        text: "tolong pilih mahasiswa terlebih dahulu",
        color: "error",
      });
    }
  } catch (error) {
    showSnackbar({
      text: error,
      color: "error",
    });
  } finally {
    loadingDataMahasiswa.value = false;
  }
};

const rows = ref([]);
function onSelectTagihan(val) {
  console.log("isi dari val", JSON.stringify(val, null, 2));

  if (!val) return;

  const item =
    typeof val === "object" ? val : tagihan.value.find((t) => t.id === val);

  if (!item) return;

  // Cegah duplikat
  if (rows.value.some((r) => r.id === item.id)) {
    selectedTagihan.value = null;
    return;
  }

  rows.value.push({
    id: item.id,
    display: item.display,
    jumlah: item.sisa ?? 0,
    jumlah_dispensasi: item.jumlah_dispensasi ?? 0, // default isi penuh
    deposit: 0,
  });

  // kosongkan combobox setelah tambah
  selectedTagihan.value = null;
}
function removeRow(id) {
  rows.value = rows.value.filter((r) => r.id !== id);
}
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
        <VSelect
          v-model="tahun"
          label="Select Th Akademik"
          placeholder="Select Th Akademik"
          :items="tahunList"
          :rules="[requiredValidator]"
          clear-icon="ri-close-line"
        />
      </VCol>
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
      <VCol cols="12" md="12">
        <VSelect
          v-model="jenisDispensasi"
          label="Jenis Dispensasi"
          placeholder="Select Jenis Dispensasi"
          :items="DispensasiList"
          :rules="[requiredValidator]"
          clear-icon="ri-close-line"
        />
      </VCol>
      <VCol cols="12" v-show="edit">
        <VCombobox
          v-model="selectedTagihan"
          :items="tagihan"
          label="Tagihan"
          item-title="display"
          clearable
          :loading="loadingTagihan"
          @update:modelValue="onSelectTagihan"
        />
      </VCol>

      <VRow
        v-for="(row, idx) in rows"
        :key="row.id"
        class="align-center mt-2 ms-1 me-4"
      >
        <VCol cols="12" md="6">
          <VTextField
            :model-value="row.display"
            label="Tagihan"
            variant="outlined"
            density="comfortable"
            readonly
            hint="Tagihan yang dipilih"
            persistent-hint
          />
        </VCol>
        <VCol cols="12" md="3">
          <VTextField
            v-model.number="row.jumlah"
            label="Total Tagihan"
            type="number"
            min="0"
            variant="outlined"
            readonly
            density="comfortable"
            :hint="formatRupiah(row.jumlah)"
            persistent-hint
          />
        </VCol>
        <VCol cols="12" md="2">
          <VTextField
            v-model.number="row.jumlah_dispensasi"
            label="Jumlah Dispensasi"
            type="number"
            min="0"
            variant="outlined"
            density="comfortable"
            :hint="formatRupiah(row.jumlah_dispensasi)"
            persistent-hint
          />
        </VCol>
        <VCol cols="12" md="1" class="d-flex mb-5">
          <VBtn
            color="error"
            icon="ri-delete-bin-line"
            variant="elevated"
            class="ml-auto"
            @click="removeRow(row.id)"
            :aria-label="`Hapus ${row.jumlah}`"
            hint="delete"
            persistent-hint
          />
        </VCol>
      </VRow>
      <VCol cols="12">
        <AppDateTimePicker
          v-model="batas"
          label="Batas"
          placeholder="Select date"
        />
      </VCol>
      <VCol cols="12">
        <VTextarea
          label="Keterangan"
          v-model="keterangan"
          placeholder="Placeholder Text"
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
