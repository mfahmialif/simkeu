<script setup>
const router = useRouter();

const nim = ref("");
const listTagihan = ref([]);
const cekNilai = ref(true);
const mahasiswa = reactive({});

const mahasiswaList = ref([]);

const search = ref("");
const searchNim = ref("");
const selectedMahasiswa = ref("");
const loadingDataMahasiswa = ref(false);
const loadingSearch = ref(false);

const hasMahasiswa = computed(() => Boolean(mahasiswa.nim && mahasiswa.nama));

const selectedMahasiswaData = computed(() => {
  if (
    selectedMahasiswa.value
    && typeof selectedMahasiswa.value === "object"
    && !Array.isArray(selectedMahasiswa.value)
  ) {
    return selectedMahasiswa.value;
  }

  return {};
});

const resetMahasiswa = () => {
  listTagihan.value = [];
  cekNilai.value = true;

  Object.keys(mahasiswa).forEach((key) => {
    delete mahasiswa[key];
  });
};

const mahasiswaSemester = computed(() => {
  const semester = Number(mahasiswa.semester);

  return Number.isFinite(semester) && semester > 0 ? semester : null;
});

const angkatanTahun = computed(() => {
  const kode = String(mahasiswa.angkatan || "");
  const tahun = Number(kode.slice(0, 4));

  return Number.isFinite(tahun) && tahun > 0 ? tahun : null;
});

const calculateSemesterMahasiswa = (tahunTagihan, semesterKode) => {
  if (!angkatanTahun.value) return null;
  if (!Number.isFinite(tahunTagihan) || ![1, 2].includes(semesterKode)) return null;

  return (tahunTagihan - angkatanTahun.value) * 2 + semesterKode;
};

const getTagihanSemester = (item) => {
  const semesterTagihan = Number(item?.semester_tagihan);

  if (Number.isFinite(semesterTagihan) && semesterTagihan > 0)
    return semesterTagihan;

  const kodeTahunAkademik = String(item?.th_akademik_kode || item?.th_akademik?.kode || "");

  if (angkatanTahun.value && /^\d{5}$/.test(kodeTahunAkademik)) {
    const tahunTagihan = Number(kodeTahunAkademik.slice(0, 4));
    const semesterKode = Number(kodeTahunAkademik.slice(4, 5));
    const semesterMahasiswa = calculateSemesterMahasiswa(tahunTagihan, semesterKode);

    if (semesterMahasiswa) return semesterMahasiswa;
  }

  return null;
};

const tagihanSemesterIni = computed(() => {
  if (!mahasiswaSemester.value) return listTagihan.value;

  return listTagihan.value.filter((item) => {
    const semester = getTagihanSemester(item);

    return !semester || semester <= mahasiswaSemester.value;
  });
});

const tagihanSemesterDepan = computed(() => {
  if (!mahasiswaSemester.value) return [];

  return listTagihan.value.filter((item) => {
    const semester = getTagihanSemester(item);

    return semester && semester > mahasiswaSemester.value;
  });
});

const sumTagihan = (items) =>
  items.reduce((sum, item) => sum + Number(item.sisa || 0), 0);

const isSkripsiTagihan = (item) =>
  String(item?.nama || "").toLowerCase().includes("skripsi");

const isSkripsiTidakBisaDibayar = (item) =>
  !cekNilai.value && isSkripsiTagihan(item);

const isTagihanPerorangan = (item) => Boolean(item?.nim);

const formatBatasDispensasi = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const tagihanTableGroups = computed(() => [
  {
    key: "semester_ini",
    title: mahasiswaSemester.value
      ? `Tagihan Semester Ini (s/d semester ${mahasiswaSemester.value})`
      : "Tagihan Semester Ini",
    items: tagihanSemesterIni.value,
    total: sumTagihan(tagihanSemesterIni.value),
  },
  {
    key: "semester_depan",
    title: mahasiswaSemester.value
      ? `Tagihan Semester Depan (> semester ${mahasiswaSemester.value})`
      : "Tagihan Semester Depan",
    items: tagihanSemesterDepan.value,
    total: sumTagihan(tagihanSemesterDepan.value),
  },
]);

const searchTagihan = () => {
  fetchTagihan();
  fetchDeposit();
};

const goToTagihanPerorangan = () => {
  const selected = selectedMahasiswaData.value;
  const prodiDoubleDegreeId = Number(selected.prodi_double_degree_id) > 0
    ? selected.prodi_double_degree_id
    : null;
  const query = {
    nim: mahasiswa.nim,
    th_angkatan_id: selected.th_akademik_id || selected.th_angkatan_id,
    prodi_id: prodiDoubleDegreeId || selected.prodi_id,
    kelas_id: selected.kelas_id,
    double_degree: prodiDoubleDegreeId ? 1 : selected.double_degree,
  };

  router.push({
    path: "/admin/pemasukan/mahasiswa/tagihan-perorangan/add",
    query: Object.fromEntries(
      Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== "")
    ),
  });
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
        text: err.data.message,
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
    searchTagihan();
  } else if (typeof newVal === "string") {
    searchNim.value = newVal;
  } else if (!newVal) {
    searchNim.value = "";
    resetMahasiswa();
  }
});

const fetchTagihan = async () => {
  if (!searchNim.value) {
    showSnackbar({
      text: "NIM harus diisi",
      color: "error",
    });
    return;
  }
  try {
    loadingDataMahasiswa.value = true;
    resetMahasiswa();
    const response = await $api("/admin/pemasukan/mahasiswa/cek-tagihan", {
      method: "GET",
      params: {
        nim: searchNim.value,
        cekNilai: 1,
      },
    });

    console.log(response);

    mahasiswa.nim = searchNim.value;
    mahasiswa.nama = response.data.nama_mhs;
    mahasiswa.angkatan = response.data.angkatan;
    mahasiswa.prodi = response.data.nama_prodi;
    mahasiswa.kelas = response.data.nama_kelas;
    mahasiswa.semester = response.data.semester ?? selectedMahasiswa.value?.semester ?? null;
    cekNilai.value = response.cekNilai ?? true;

    if (response.status) {
      const semesterIni = response.data.list_tagihan_semester_ini || [];
      const semesterDepan = response.data.list_tagihan_semester_depan || [];

      listTagihan.value = response.data.list_tagihan || [
        ...semesterIni,
        ...semesterDepan,
      ];
    }
  } catch (err) {
    console.error(err);
    showSnackbar({
      text: err.data.message,
      color: "error",
    });
  } finally {
    loadingDataMahasiswa.value = false;
  }
};

const loadingDeposit = ref(false);
const fetchDeposit = async () => {
  try {
    loadingDeposit.value = true;
    const res = await $api(
      `/admin/pemasukan/mahasiswa/catatan-deposit/nim/${searchNim.value}`,
      {
        method: "GET",
      }
    );
    mahasiswa.deposit = res.jumlah ?? 0;
  } catch (error) {
    showSnackbar({
      text: error,
      color: "error",
    });
  } finally {
    loadingDeposit.value = false;
  }
};

const isLoadingExcel = ref(false);
const downloadExcel = async () => {
  isLoadingExcel.value = true;
  await download(
    "excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    `Laporan Tagihan ${mahasiswa.nim}.xlsx`
  );
  isLoadingExcel.value = false;
};

const isLoadingPdf = ref(false);
const downloadPdf = async () => {
  isLoadingPdf.value = true;
  await download("pdf", "application/pdf", `Laporan Tagihan ${mahasiswa.nim}.pdf`);
  isLoadingPdf.value = false;
};


const isLoadingDownload = ref(false);
const download = async (type, accept, filename) => {
  if (!mahasiswa.nim) {
    showSnackbar({
      text: "NIM harus diisi",
      color: "error",
    });
    return;
  }
  try {
    isLoadingDownload.value = true;
    showSnackbar({
      text: "Loading...",
      color: "info",
    });
    const response = await $api(`/admin/pemasukan/mahasiswa/cek-tagihan/${type}`, {
      method: "GET",
      headers: {
        Accept: accept,
      },
      params: {
        nim: mahasiswa.nim,
        prodi: mahasiswa.prodi,
        tahun_akademik: mahasiswa.angkatan,
        deposit: mahasiswa.deposit,
        nama: mahasiswa.nama,
        scope: "semester_ini",
        cek_nilai: cekNilai.value ? 1 : 0,
      },
    });

    downloadFileExport(response, filename);
    showSnackbar({
      text: "Tagihan berhasil di download.",
      color: "success",
    });
  } catch (err) {
    showSnackbar({
      text: err.message,
      color: "error",
    });
  } finally {
    isLoadingDownload.value = false;
  }
};

onMounted(() => {
  document.title = "Tagihan - SIMKEU";
});
</script>

<template>
  <div>
    <VRow class="mb-2">
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
              @click="searchTagihan"
            >
              <VIcon icon="ri-search-line" />
              <span v-if="$vuetify.display.mdAndUp" class="ms-3">Search</span>
            </VBtn>
          </template>
        </VCombobox>
      </VCol>
    </VRow>

    <!-- Btn download excel dan pdf -->
    <VRow class="mb-5">
      <VCol cols="12" sm="6" :md="hasMahasiswa ? 4 : 6">
        <VBtn
          class="w-100"
          block
          color="success"
          :disabled="isLoadingExcel"
          @click="downloadExcel()"
        >
          <VIcon icon="ri-file-pdf-line" />
          <span class="ms-3">Excel</span>
        </VBtn>
      </VCol>
      <VCol cols="12" sm="6" :md="hasMahasiswa ? 4 : 6">
        <VBtn
          class="w-100"
          color="error"
          block
          :disabled="isLoadingPdf"
          @click="downloadPdf()"
        >
          <VIcon icon="ri-file-pdf-line" />
          <span class="ms-3">PDF</span>
        </VBtn>
      </VCol>
      <VCol v-if="hasMahasiswa" cols="12" md="4">
        <VBtn
          class="w-100"
          color="primary"
          block
          @click="goToTagihanPerorangan"
        >
          <VIcon icon="ri-add-line" />
          <span class="ms-3">Tagihan Perorangan</span>
        </VBtn>
      </VCol>
    </VRow>

    <VCard class="mb-2">
      <VSkeletonLoader
        v-if="loadingDataMahasiswa"
        type="article, list-item, paragraph, paragraph"
      />
      <template v-else>
        <VCardItem class="pb-4">
          <VCardTitle class="text-center">Tagihan Mahasiswa</VCardTitle>
        </VCardItem>

        <VDivider />

        <VTable class="table-detail">
          <tbody>
            <tr>
              <td>NIM</td>
              <td>:</td>
              <td>{{ mahasiswa.nim }}</td>
            </tr>
            <tr>
              <td>Nama Mahasiswa</td>
              <td>:</td>
              <td>{{ mahasiswa.nama }}</td>
            </tr>
            <tr>
              <td>Program Studi</td>
              <td>:</td>
              <td>{{ mahasiswa.prodi }}</td>
            </tr>
            <tr>
              <td>Tahun Angkatan</td>
              <td>:</td>
              <td>{{ mahasiswa.angkatan }}</td>
            </tr>
            <tr>
              <td>Kelas</td>
              <td>:</td>
              <td>{{ mahasiswa.kelas }}</td>
            </tr>
            <tr>
              <td>Semester</td>
              <td>:</td>
              <td>{{ mahasiswa.semester }}</td>
            </tr>
            <VSkeletonLoader type="list-item" v-if="loadingDeposit" />
            <tr v-else>
              <td>Deposit</td>
              <td>:</td>
              <td>{{ formatRupiah(mahasiswa.deposit) }}</td>
            </tr>
          </tbody>
        </VTable>
      </template>

      <VCardText class="d-flex flex-wrap gap-4"> </VCardText>
    </VCard>

    <VCard
      v-for="group in tagihanTableGroups"
      :key="group.key"
      class="mb-2"
    >
      <VCardItem class="pb-2">
        <VCardTitle>{{ group.title }}</VCardTitle>
      </VCardItem>
      <VDivider />

      <VSkeletonLoader type="table" v-if="loadingDataMahasiswa"/>
      <VTable v-else>
        <thead>
          <tr>
            <th class="text-uppercase">Tagihan</th>
            <th class="text-uppercase">Perlu Dibayar</th>
            <th class="text-uppercase">Jumlah Tagihan</th>
            <th class="text-uppercase">Status</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in group.items"
            :key="item.id"
            :class="{ 'text-medium-emphasis': isSkripsiTidakBisaDibayar(item) }"
          >
            <td>
              {{ item.nama }}
              <VChip
                v-if="isTagihanPerorangan(item)"
                color="info"
                size="x-small"
                label
                class="ms-2"
              >
                Tagihan Perorangan
              </VChip>
            </td>
            <td>
              <div>{{ formatRupiah(item.sisa) }}</div>
              <div v-if="item.status_dispensasi" class="text-caption text-success">
                Dispensasi: {{ formatRupiah(item.jumlah_dispensasi) }}
              </div>
              <div v-if="item.status_dispensasi" class="text-caption text-medium-emphasis">
                Batas: {{ formatBatasDispensasi(item.batas_dispensasi) }}
              </div>
            </td>
            <td>
              {{ formatRupiah(item.jumlah) }}
            </td>
            <td>
              <span v-if="item.sisa <= 0">
                <VChip color="success" size="x-small" label> Lunas </VChip>
              </span>
              <span v-else>
                <VChip color="error" size="x-small" label> Belum Lunas </VChip>
                <VChip
                  v-if="isSkripsiTidakBisaDibayar(item)"
                  color="warning"
                  size="x-small"
                  label
                  class="ms-2"
                >
                  Tidak bisa dibayar
                </VChip>
              </span>
            </td>
          </tr>
          <tr v-if="group.items.length === 0">
            <td colspan="4" class="text-center text-medium-emphasis">
              Tidak ada tagihan.
            </td>
          </tr>
          <tr>
            <td><b>Total</b></td>
            <td><b>{{ formatRupiah(group.total) }}</b></td>
          </tr>
        </tbody>
      </VTable>

      <VCardText class="d-flex flex-wrap gap-4"> </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
.table-detail td:first-child {
  width: 1%;
  white-space: nowrap;
}
.table-detail td:nth-child(2) {
  width: 1%;
  white-space: nowrap;
}
.table-detail td:last-child {
  width: 100%;
}
</style>
