<script setup>
const page = ref(1);
const itemsPerPage = ref(5);
const sortBy = ref({ key: "id", order: "desc" });
const search = ref("");
const selectedRows = ref([]);
const dataTable = ref([]);
const totalItems = ref(0);
const loading = ref(true);
const initialLoading = ref(true);

const fetchUsers = async () => {
  try {
    const response = await $api("/admin/pemasukan/mahasiswa/pembayaran-idn", {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        search: search.value,
      },
    });
    const data = response.data;

    dataTable.value = data.data;
    totalItems.value = data.total;

    fetchDetailData();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
    if (initialLoading.value) initialLoading.value = false;
  }
};


const fetchDetailData = async () => {
  const nimList = dataTable.value.map((item) => item.bill_key);
  const res = await $api("/admin/mahasiswa/nim", {
    method: "GET",
    body: {
      nim: JSON.stringify(nimList),
      whereIn: true,
    },
  });
  dataTable.value = dataTable.value.map((item) => {
    const mhs = res.find((m) => m.nim === item.bill_key);
    return {
      ...item,
      mahasiswa: mhs ? mhs : false, // tambahkan objek mahasiswa (atau false kalau tidak ditemukan)
    };
  });
  // dataTable.value.forEach((item, index) => {
  //   $api(`/admin/mahasiswa/nim/${item.nim}`, { method: "GET" })
  //     .then((res) => {
  //       dataTable.value[index].mahasiswa = res;
  //     })
  //     .catch((err) => {
  //       console.error(`Error NIM ${item.nim}:`, err);
  //       dataTable.value[index].mahasiswa = "Error";
  //     });
  // });
};

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb, search: s }) => {
  loading.value = true;
  page.value = p;
  itemsPerPage.value = ipp;
  if (sb.length) sortBy.value = sb[0];
  fetchUsers();
};

onMounted(() => {
  document.title = "Catatan Pembayaran IDN - SIMKEU";
  fetchUsers();
});

watch(
  selectedRows,
  (newValue) => {
    newValue.forEach((row, index) => {
      console.log(`${index + 1}.`, row);
    });
  },
  { deep: true }
);

</script>

<template>
  <div>
    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Pembayaran IDN</VCardTitle>
      </VCardItem>

      <VDivider />

      <VCardText class="d-flex flex-wrap gap-4">
        <div class="d-flex align-center w-100 w-sm-auto">
          <!-- 👉 Search  -->
          <VTextField
            v-model="search"
            placeholder="Search Data"
            style="inline-size: 200px"
            density="compact"
            class="me-3"
          />
        </div>

        <VSpacer />
      </VCardText>

      <!-- 👉 Datatable  -->
      <VDataTableServer
        :headers="[
          { title: 'No', key: 'id' },
          { title: 'Pembayaran', key: 'keuangan_tagihan_nama' },
          { title: 'Jumlah', key: 'total_bill_amount' },
          { title: 'Tahun', key: 'th_akademik_kode' },
          { title: 'Tanggal', key: 'paid_date' },
        ]"
        v-model:model-value="selectedRows"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        show-select
        :items="dataTable"
        :items-length="totalItems"
        :loading="loading"
        :search="search"
        item-value="name"
        @update:options="loadItems"
      >
        <template v-if="initialLoading" #loading>
          <div class="text-center pa-4">
            <VProgressCircular indeterminate color="primary" class="mb-2" />
            <div>Memuat data pembayaran idn...</div>
          </div>
        </template>

        <template v-else #no-data>
          <div class="text-center pa-4">Tidak ada data pembayaran idn.</div>
        </template>

        <template #item.id="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </template>

          <template #item.keuangan_tagihan_nama="{ item }">
          <div style="margin: 15px 0">
            <VChip color="primary" size="x-small" label>
              {{ item.bill_id }}
            </VChip>
            <div>
              <b>{{ item.keuangan_tagihan_nama }}</b>
            </div>
            <div>
              {{ item.bill_key }} -
              <template v-if="item.mahasiswa">
                {{ item.mahasiswa.nama }} - {{ item.mahasiswa.prodi?.alias }} -
                {{ item.mahasiswa.jk?.kode }}
              </template>
              <template v-else-if="item.mahasiswa === false">
                Data tidak ditemukan di SIAKAD.<br>Silakan hapus atau periksa kembali di SIAKAD.
              </template>
              <template v-else>
                <VProgressCircular
                  indeterminate
                  color="primary"
                  size="16"
                  width="2"
                  style="vertical-align: middle"
                ></VProgressCircular>
              </template>
            </div>
          </div>
        </template>

        <template #item.tanggal="{ item }">
          <div>{{ new Date(item.tanggal).toISOString().split("T")[0] }}</div>
        </template>

        <!-- Actions -->
        <!-- <template #item.actions="{ item }">
          <IconBtn size="small">
            <VIcon icon="ri-more-2-fill" />

            <VMenu activator="parent">
              <VList>
                <VListItem
                  value="download"
                  prepend-icon="ri-edit-box-line"
                  @click="
                    $router.push(
                      `/admin/pemasukan/mahasiswa/prm/edit/${item.id}`
                    )
                  "
                >
                  Edit
                </VListItem>

                <VListItem
                  value="delete"
                  prepend-icon="ri-delete-bin-line"
                  @click="showDialogDelete(item.id, item.username)"
                >
                  Delete
                </VListItem>
              </VList>
            </VMenu>
          </IconBtn>
        </template> -->
      </VDataTableServer>
    </VCard>

    <VDialog v-model="isDialogDeleteVisible" width="500">
      <!-- Dialog Content -->
      <VCard :title="'Hapus Data: ' + deleteData.name">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogDeleteVisible = false"
        />

        <VCardText class="d-flex align-center">
          <VIcon icon="ri-alert-line" size="32" class="me-2" />
          <span>
            Anda yakin ingin menghapus data pembayaran idn ini? Penghapusan data
            pembayaran idn tidak dapat dibatalkan.
          </span>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="isDialogDeleteVisible = false"
          >
            Batal
          </VBtn>
          <VBtn color="error" @click="deleteDataSubmit(deleteData.id)">
            <VIcon icon="ri-delete-bin-line" class="me-1" />
            Hapus
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
