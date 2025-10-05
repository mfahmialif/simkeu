<script setup>
const nim = ref("");
const listTagihan = ref([]);
const total = ref("");
const mahasiswa = reactive({});

const searchTagihan = () => {
  fetchTagihan();
};

const fetchTagihan = async () => {
  try {
    const response = await $api("/admin/pemasukan/mahasiswa/cek-tagihan", {
      method: "GET",
      body: {
        nim: nim.value,
      },
    });

    mahasiswa.nim = nim.value;
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
        <VTextField
          v-model="nim"
          density="compact"
          clearable
          clear-icon="ri-close-line"
          label="NIM"
          placeholder="Hey!!"
          type="text"
        >
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
        </VTextField>
      </VCol>
    </VRow>

    <VCard class="mb-2">
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
            <td>Deposit</td>
            <td>:</td>
            <td>asd</td>
          </tr>
        </tbody>
      </VTable>

      <VCardText class="d-flex flex-wrap gap-4"> </VCardText>
    </VCard>

    <VCard class="mb-2">
      <VTable>
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
              {{ item.sisa }}
            </td>
            <td>
              {{ item.jumlah }}
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
            <td>Total</td>
            <td>{{ total }}</td>
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
