<script setup>
const inStock = ref(true);
const isTaxable = ref(true);

const thAkademik = ref([]);
const selectedThAkademik = ref();
const loadingThAkademik = ref(false);

const tanggal = ref("");

const fetchThAkademik = async () => {
  try {
    loadingThAkademik.value = true;
    const { data } = await $api("/admin/th-akademik", {
      method: "GET",
      body: {
        aktif: "Y",
      },
    });

    thAkademik.value = data.data.map((thAkademik) => {
      return {
        title: `${thAkademik.nama} - ${thAkademik.semester}`,
        value: thAkademik.id,
      };
    });

    selectedThAkademik.value = thAkademik.value[0]?.value;
  } catch (err) {
    console.error(err);
  } finally {
    loadingThAkademik.value = false;
  }
};

const mahasiswaList = ref([]);

const search = ref("");
const selectedMahasiswa = ref("");
const loadingDataMahasiswa = ref(false);
const loadingSearch = ref(false);

const nim = ref("");
const nama = ref("");
const prodi = ref("");
const jenisKelamin = ref("");
const angkatan = ref("");
const kelas = ref("");
const semester = ref("");

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
    nim.value = newVal.nim;
    searching();
  } else if (typeof newVal === "string") {
    nim.value = newVal;
  } else if (!newVal) {
    nim.value = "";
  }
});

const searching = async () => {
  if (!nim.value) {
    showSnackbar({
      text: "NIM harus diisi",
      color: "error",
    });
    return;
  }

  try {
    loadingDataMahasiswa.value = true;
    const res = await $api(`/admin/mahasiswa/nim/${nim.value}`, {
      method: "GET",
    });

    if (res.length < 1) {
      showSnackbar({
        text: "Data mahasiswa tidak ditemukan",
        color: "error",
      });
      return;
    }

    nama.value = res.nama;
    prodi.value = res.prodi?.nama;
    jenisKelamin.value = res.jk?.nama;
    angkatan.value = res.th_akademik?.kode;
    kelas.value = res.kelas?.nama;
    semester.value = res.semester;
  } catch (error) {
    showSnackbar({
      text: error,
      color: "error",
    });
  } finally {
    loadingDataMahasiswa.value = false;
  }
};

onMounted(() => {
  document.title = "Tambah Data Pembayaran Mahasiswa - SIMKEU";
  fetchThAkademik();
  tanggal.value = new Date().toISOString().split("T")[0];
});
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-space-between gap-4 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 mb-1">Tambah data pembayaran</h4>
        <p class="text-body-1 mb-0">Silahkan mengisi data yang diperlukan</p>
      </div>

      <div class="d-flex gap-4 align-center flex-wrap">
        <VBtn variant="outlined" color="secondary"> Batalkan </VBtn>
        <VBtn>Simpan</VBtn>
      </div>
    </div>

    <VRow>
      <VCol md="8">
        <!-- 👉 Akademik -->

        <VCard title="Akademik" class="mb-6">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="tanggal"
                  label="Tanggal"
                  placeholder="Tanggal"
                  type="date"
                />
              </VCol>
              <VCol cols="12">
                <VCombobox
                  v-model="selectedThAkademik"
                  :items="thAkademik"
                  label="Tahun Akademik"
                  clearable
                >
                  <template #append-inner>
                    <VProgressCircular
                      v-if="loadingThAkademik"
                      indeterminate
                      size="16"
                      width="2"
                    />
                  </template>
                </VCombobox>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

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
                      <span v-if="$vuetify.display.mdAndUp" class="ms-3"
                        >Search</span
                      >
                    </VBtn>
                  </template>
                </VCombobox>
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="nim"
                  label="NIM"
                  placeholder="NIM"
                  readonly
                >
                  <template #append-inner>
                    <VProgressCircular
                      v-if="loadingDataMahasiswa"
                      indeterminate
                      size="16"
                      width="2"
                    />
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="nama"
                  label="Nama"
                  placeholder="Nama"
                  readonly
                >
                  <template #append-inner>
                    <VProgressCircular
                      v-if="loadingDataMahasiswa"
                      indeterminate
                      size="16"
                      width="2"
                    />
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="prodi"
                  label="Prodi"
                  placeholder="Prodi"
                  readonly
                >
                  <template #append-inner>
                    <VProgressCircular
                      v-if="loadingDataMahasiswa"
                      indeterminate
                      size="16"
                      width="2"
                    />
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="jenisKelamin"
                  label="Jenis Kelamin"
                  placeholder="Jenis Kelamin"
                  readonly
                >
                  <template #append-inner>
                    <VProgressCircular
                      v-if="loadingDataMahasiswa"
                      indeterminate
                      size="16"
                      width="2"
                    />
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="4">
                <VTextField
                  v-model="angkatan"
                  label="Angkatan"
                  placeholder="Angkatan"
                  readonly
                >
                  <template #append-inner>
                    <VProgressCircular
                      v-if="loadingDataMahasiswa"
                      indeterminate
                      size="16"
                      width="2"
                    />
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="4">
                <VTextField
                  v-model="kelas"
                  label="Kelas"
                  placeholder="Kelas"
                  readonly
                >
                  <template #append-inner>
                    <VProgressCircular
                      v-if="loadingDataMahasiswa"
                      indeterminate
                      size="16"
                      width="2"
                    />
                  </template>
                </VTextField>
              </VCol>
              <VCol cols="12" md="4">
                <VTextField
                  v-model="semester"
                  label="Semester"
                  placeholder="Semester"
                  readonly
                >
                  <template #append-inner>
                    <VProgressCircular
                      v-if="loadingDataMahasiswa"
                      indeterminate
                      size="16"
                      width="2"
                    />
                  </template>
                </VTextField>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <!-- 👉 Pembayaran -->
        <VCard title="Pembayaran">
          <VCardText>
          </VCardText>
        </VCard>
      </VCol>

      <VCol md="4" cols="12">
        <!-- 👉 Pricing -->
        <VCard title="Pricing" class="mb-6">
          <VCardText>
            <VTextField
              label="Base Price"
              placeholder="iPhone 14"
              class="mb-6"
            />
            <VTextField
              label="Discounted Price"
              placeholder="$499"
              class="mb-6"
            />
            <VCheckbox v-model="isTaxable" label="Charge Tax on this product" />

            <VDivider class="my-2" />

            <div class="d-flex flex-raw align-center justify-space-between">
              <span>In stock</span>
              <VSwitch v-model="inStock" density="compact" />
            </div>
          </VCardText>
        </VCard>

        <!-- 👉 Organize -->
        <VCard title="Organize">
          <VCardText>
            <div class="d-flex flex-column gap-y-5">
              <VSelect
                placeholder="Select Vendor"
                label="Vendor"
                :items="[
                  'Men\'s Clothing',
                  'Women\'s Clothing',
                  'Kid\'s Clothing',
                ]"
              />
              <VSelect
                placeholder="Select Category"
                label="Category"
                :items="[
                  'Household',
                  'Office',
                  'Electronics',
                  'Management',
                  'Automotive',
                ]"
              >
                <template #append>
                  <IconBtn
                    size="large"
                    variant="outlined"
                    color="primary"
                    rounded
                  >
                    <VIcon size="28" icon="ri-add-line" />
                  </IconBtn>
                </template>
              </VSelect>
              <VSelect
                placeholder="Select Collection"
                label="Collection"
                :items="[
                  'Men\'s Clothing',
                  'Women\'s Clothing',
                  'Kid\'s Clothing',
                ]"
              />
              <VSelect
                placeholder="Select Status"
                label="Status"
                :items="['Published', 'Inactive', 'Scheduled']"
              />
              <VTextField
                label="Tags"
                placeholder="Fashion, Trending, Summer"
              />
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss" scoped>
.drop-zone {
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 8px;
}
</style>

<style lang="scss">
.ProseMirror {
  p {
    margin-block-end: 0;
  }

  padding: 0.5rem;
  outline: none;
}
</style>
