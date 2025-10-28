<script setup>
const nim = ref("");
const listTagihan = ref([]);
const total = ref("");
const mahasiswa = reactive({});

const mahasiswaList = ref([]);

const search = ref("");
const searchNim = ref("");
const selectedMahasiswa = ref("");
const loadingDataMahasiswa = ref(false);
const loadingSearch = ref(false);

const searchTagihan = () => {
  fetchTagihan();
  fetchDeposit();
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
    const response = await $api("/admin/pemasukan/mahasiswa/cek-tagihan", {
      method: "GET",
      body: {
        nim: searchNim.value,
      },
    });

    console.log(response);

    mahasiswa.nim = searchNim.value;
    mahasiswa.nama = response.data.nama_mhs;
    mahasiswa.angkatan = response.data.angkatan;
    mahasiswa.prodi = response.data.nama_prodi;
    mahasiswa.kelas = response.data.nama_kelas;

    if (response.status) {
      listTagihan.value = response.data.list_tagihan;
      if (listTagihan.value && listTagihan.value.length > 0) {
        const totalSisa = listTagihan.value.reduce(
          (total, item) => total + Number(item.sisa || 0),
          0
        );
        total.value = totalSisa;
      } else {
        total.value = "LUNAS";
      }
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
    mahasiswa.deposit = res.jumlah;
  } catch (error) {
    showSnackbar({
      text: error,
      color: "error",
    });
  } finally {
    loadingDeposit.value = false;
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

    <VCard class="mb-2">
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
          <tr v-for="item in listTagihan" :key="item.id">
            <td>
              {{ item.nama }}
            </td>
            <td>
              {{ formatRupiah(item.sisa) }} {{ item.status_dispensasi ? '(Dispensasi: '+ formatRupiah(item.jumlah_dispensasi)+')': '' }}
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
              </span>
            </td>
          </tr>
          <tr>
            <td><b>Total</b></td>
            <td><b>{{ formatRupiah(total) }}</b></td>
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
