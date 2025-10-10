<script setup>
import WidgetPembayaranMahasiswa from '@/components/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/WidgetPembayaranMahasiswa.vue';


const selectedThAkademik = ref();
const thAkademik = ref([]);

const page = ref(1);
const itemsPerPage = ref(10);
const sortBy = ref({ key: "id", order: "desc" });
const search = ref("");
const selectedRows = ref([]);
const dataTable = ref([]);
const totalItems = ref(0);
const loading = ref(true);
const initialLoading = ref(true);

const fetchData = async () => {
  loading.value = true;
  try {
    const { data } = await $api("/admin/pemasukan/mahasiswa/pembayaran", {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        search: search.value,
        ...(selectedThAkademik.value && {
          th_akademik_id: selectedThAkademik.value,
        }),
      },
    });

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
  const nimList = dataTable.value.map((item) => item.nim);
  const res = await $api("/admin/mahasiswa/nim", {
    method: "GET",
    body: {
      nim: JSON.stringify(nimList),
      whereIn: true,
    },
  });
  dataTable.value = dataTable.value.map((item) => {
    const mhs = res.find((m) => m.nim === item.nim);
    return {
      ...item,
      mahasiswa: mhs ? mhs : null, // tambahkan objek mahasiswa (atau null kalau tidak ditemukan)
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
  fetchData();
};

const fetchThAkademik = async () => {
  try {
    const { data } = await $api("/admin/th-akademik", {
      method: "GET",
    });

    thAkademik.value = data.data.map((thAkademik) => {
      return {
        title: `${thAkademik.nama} - ${thAkademik.semester}`,
        value: thAkademik.id,
      };
    });
  } catch (err) {
    console.error(err);
  }
};

const isDialogDeleteVisible = ref(false);
const deleteData = ref({});
const disabledDelete = ref(false);

const showDialogDelete = (id, name) => {
  deleteData.value = {
    id: id,
    name: name,
  };
  isDialogDeleteVisible.value = true;
};

const deleteDataSubmit = async (id) => {
  try {
    disabledDelete.value = true;
    const response = await $api("/admin/pemasukan/mahasiswa/pembayaran/" + id, {
      method: "DELETE",
    });

    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: "success",
      });

      fetchData();
    } else {
      showSnackbar({
        text: response.message,
        color: "error",
      });
    }
  } catch (err) {
    showSnackbar({
      text: err,
      color: "error",
    });
  } finally {
    isDialogDeleteVisible.value = false;
    disabledDelete.value = false;
  }
};

onMounted(() => {
  document.title = "Pembayaran Mahasiswa - SIMKEU";
  fetchThAkademik();
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

watch(selectedThAkademik, () => {
  console.log("value from wathc", selectedThAkademik.value);
  fetchData();
});
</script>

<template>
  <div>
    <!-- <WidgetPembayaranMahasiswa /> -->

    <VRow class="mb-2">
      <!-- 👉 Select ThAkademik -->
      <VCol cols="12" sm="12">
        <VSelect
          v-model="selectedThAkademik"
          label="Select Th Akademik"
          placeholder="Select Th Akademik"
          :items="thAkademik"
          clearable
          clear-icon="ri-close-line"
          class="custom-bg-select"
        />
      </VCol>
    </VRow>

    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Pembayaran Mahasiswa</VCardTitle>
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

        <div class="d-flex gap-x-4 align-center">
          <!-- 👉 Export button -->
          <VBtn
            variant="outlined"
            color="secondary"
            prepend-icon="ri-upload-2-line"
          >
            Export
          </VBtn>

          <VBtn
            color="primary"
            prepend-icon="ri-add-line"
            @click="
              $router.push(
                '/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/add'
              )
            "
          >
            Add Data
          </VBtn>
        </div>
      </VCardText>

      <!-- 👉 Datatable  -->
      <VDataTableServer
        :headers="[
          { title: 'No', key: 'id' },
          { title: 'Pembayaran', key: 'keuangan_tagihan_nama' },
          { title: 'Jumlah', key: 'jumlah' },
          { title: 'Tahun', key: 'th_akademik_kode' },
          { title: 'Tanggal', key: 'tanggal' },
          { title: 'Actions', key: 'actions', sortable: false },
        ]"
        v-model:model-value="selectedRows"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
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
            <div>Memuat data...</div>
          </div>
        </template>

        <template v-else #no-data>
          <div class="text-center pa-4">Tidak ada data.</div>
        </template>

        <template #item.id="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </template>

        <template #item.keuangan_tagihan_nama="{ item }">
          <div style="margin: 15px 0">
            <VChip color="primary" size="x-small" label>
              {{ item.nota ?? item.nomor }}
            </VChip>
            <div>
              <b>{{ item.keuangan_tagihan_nama }}</b>
            </div>
            <div>
              {{ item.nim }} -
              <template v-if="item.mahasiswa">
                {{ item.mahasiswa.nama }} - {{ item.mahasiswa.prodi?.alias }} -
                {{ item.mahasiswa.jk?.kode }}
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

        <template #item.username="{ item }">
          <div class="d-flex align-center">
            <VAvatar size="32" :color="item.avatar ? '' : 'primary'">
              <VImg v-if="item.avatar" :src="item.avatar_url" />
              <span v-else>{{ item.username[0] }}</span>
            </VAvatar>
            <div class="d-flex flex-column ms-3">
              <span class="font-weight-medium">{{ item.username }}</span>
              <small>{{ item.post }}</small>
            </div>
          </div>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn size="small">
            <VIcon icon="ri-more-2-fill" />

            <VMenu activator="parent">
              <VList>
                <VListItem
                  value="download"
                  prepend-icon="ri-edit-box-line"
                  @click="$router.push(`/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/edit/${item.id}`)"
                >
                  Edit
                </VListItem>

                <VListItem
                  value="delete"
                  prepend-icon="ri-delete-bin-line"
                  @click="
                    showDialogDelete(
                      item.id,
                      `${item.keuangan_tagihan_nama}`
                    )
                  "
                >
                  Delete
                </VListItem>
              </VList>
            </VMenu>
          </IconBtn>
        </template>
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
            Anda yakin ingin menghapus data ini? Penghapusan data tidak dapat
            dibatalkan.
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
          <VBtn color="error" :disabled="disabledDelete" @click="deleteDataSubmit(deleteData.id)">
            <VIcon icon="ri-delete-bin-line" class="me-1" />
            Delete
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
