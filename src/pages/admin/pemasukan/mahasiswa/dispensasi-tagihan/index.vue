<script setup>
const selectedRole = ref();
const role = ref([]);

const page = ref(1);
const itemsPerPage = ref(5);
const sortBy = ref({ key: "id", order: "desc" });
const search = ref("");
const selectedRows = ref([]);
const dataTable = ref([]);
const totalItems = ref(0);
const loading = ref(true);
const initialLoading = ref(true);
let isFetching = ref(false);

const fetchDispensasiTagihan = async () => {
  if (isFetching.value) {
    return;
  }
  isFetching.value = true;
  try {
    loading.value = true;

    const response = await $api(
      "/admin/pemasukan/mahasiswa/dispensasi-tagihan",
      {
        method: "GET",
        params: {
          page: page.value,
          limit: itemsPerPage.value,
          sort_key: sortBy.value?.key,
          sort_order: sortBy.value?.order,
          search: search.value,
          ...(selectedRole.value && { role_id: selectedRole.value }),
        },
      }
    );
    const dispensasiTagihanList = response.data.data ?? response;

    dataTable.value = dispensasiTagihanList;
    totalItems.value = response.data.total ?? 0;

    fetchMahasiswa();
  } catch (err) {
    console.error("Gagal fetch dispensasi:", err);
  } finally {
    isFetching.value = false;
    loading.value = false;
    if (initialLoading.value) initialLoading.value = false;
  }
};
const fetchMahasiswa = async () => {
  try {
    const nimList = dataTable.value.map((item) => item.nim);
    console.log("NIM List:", nimList);
    const response = await $api("/admin/mahasiswa/nim", {
      method: "GET",
      params: {
        limit: 30,
        nim: JSON.stringify(nimList),
        whereIn: true,
      },
    });
    dataTable.value = dataTable.value.map((item) => {
      const mahasiswa = response.find((mhs) => mhs.nim === item.nim);

      return {
        ...item,
        nama_mahasiswa: mahasiswa ? mahasiswa.nama : "N/A",
        jenis_kelamin: mahasiswa ? mahasiswa.jk.kode : "N/A",
        prodi: mahasiswa ? mahasiswa.prodi.nama : "N/A",
      };
    });
  } catch (err) {
    console.error("Gagal fetch mahasiswa:", err);
  }
};

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb, search: s }) => {
  loading.value = true;
  page.value = p;
  itemsPerPage.value = ipp;
  if (sb.length) sortBy.value = sb[0];
  fetchDispensasiTagihan();
};

const isDialogDeleteVisible = ref(false);
const deleteData = ref({});

const showDialogDelete = (id, name) => {
  deleteData.value = {
    id: id,
    name: name,
  };
  isDialogDeleteVisible.value = true;
};

const deleteDataSubmit = async (id) => {
  try {
    const response = await $api(
      "/admin/pemasukan/mahasiswa/dispensasi-tagihan/" + id,
      {
        method: "DELETE",
      }
    );

    if (response.status === "true") {
      showSnackbar({
        text: response.message,
        color: "success",
      });

      fetchDispensasiTagihan();
    } else {
      showSnackbar({
        text: response.message,
        color: "error",
      });
    }
  } catch (err) {
    const message = Array.isArray(err.data?.message)
      ? err.data.message.join("; ")
      : err.data?.message || "Terjadi kesalahan.";

    showSnackbar({
      text: message,
      color: "error",
    });
  } finally {
    isDialogDeleteVisible.value = false;
  }
};

onMounted(() => {
  document.title = "Catatan Dispensasi - SIMKEU";
  fetchDispensasiTagihan();
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

watch(selectedRole, () => {
  console.log("value from wathc", selectedRole.value);
  fetchUsers();
});
</script>

<template>
  <div>
    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Dispensasi Tagihan</VCardTitle>
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
              $router.push('/admin/pemasukan/mahasiswa/dispensasi-tagihan/add')
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
          { title: 'Tahun Akademik', key: 'th_akademik' },
          { title: 'Nim', key: 'nim' },
          { title: 'L/P', key: 'jenis_kelamin' },
          { title: 'Prodi', key: 'prodi' },
          { title: 'keterangan', key: 'keterangan' },
          { title: 'Actions', key: 'actions', sortable: false },
        ]"
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
            <div>Memuat data disposisi...</div>
          </div>
        </template>

        <template v-else #no-data>
          <div class="text-center pa-4">Tidak ada data disposisi.</div>
        </template>
        <template #item.nim="{ item }">
          <div>
            <VChip color="success" size="x-small" label>
              {{ item.nim }}
            </VChip>
            <template v-if="item.nama_mahasiswa">
              - <b>{{ item.nama_mahasiswa }}</b>
            </template>
            <template v-else>
              <VProgressCircular
                indeterminate
                color="primary"
                size="16"
                width="2"
                style="vertical-align: middle"
              >
              </VProgressCircular>
            </template>
          </div>
        </template>
        <template #item.prodi="{ item }">
          <div>
            <template v-if="item.prodi">
              <b>{{ item.prodi }}</b>
            </template>
            <template v-else>
              <VProgressCircular
                indeterminate
                color="primary"
                size="16"
                width="2"
                style="vertical-align: middle"
              >
              </VProgressCircular>
            </template>
          </div>
        </template>
        <template #item.jenis_kelamin="{ item }">
          <div>
            <template v-if="item.jenis_kelamin">
              <b>{{ item.jenis_kelamin }}</b>
            </template>
            <template v-else>
              <VProgressCircular
                indeterminate
                color="primary"
                size="16"
                width="2"
                style="vertical-align: middle"
              >
              </VProgressCircular>
            </template>
          </div>
        </template>
        <template #item.id="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
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
                  @click="
                    $router.push(
                      `/admin/pemasukan/mahasiswa/dispensasi-tagihan/edit/${item.id}`
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
            Anda yakin ingin menghapus data dispensasi tagihan ini? Penghapusan
            data pengguna tidak dapat dibatalkan.
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
