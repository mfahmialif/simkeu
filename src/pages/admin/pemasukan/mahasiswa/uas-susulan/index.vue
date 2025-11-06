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

const fetchData = async () => {
  try {
    const { data } = await $api("/admin/pemasukan/mahasiswa/uas-susulan", {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        search: search.value,
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
      mahasiswa: mhs ? mhs : false, // tambahkan objek mahasiswa (atau null kalau tidak ditemukan)
    };
  });

};

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb, search: s }) => {
  loading.value = true;
  page.value = p;
  itemsPerPage.value = ipp;
  if (sb.length) sortBy.value = sb[0];
  fetchData();
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
      "/admin/pemasukan/mahasiswa/uas-susulan/full/" + id,
      {
        method: "DELETE",
      }
    );

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

const tanggal = ref("");
const prodi = ref([]);
const selectedProdi = ref('*');
const isLoadingProdi = ref(false);
const fetchProdi = async () => {
  try {
    isLoadingProdi.value = true;
    const { data } = await $api("/admin/prodi", {
      method: "GET",
    });

    prodi.value.push({
      title: "Semua Prodi",
      value: "*",
    });

    prodi.value.push(
      ...data.data.map((prodi) => {
        return {
          title: `${prodi.nama}`,
          value: prodi.id,
        };
      })
    );
  } catch (err) {
    console.error(err);
  } finally {
    isLoadingProdi.value = false;
  }
};

const isLoadingExcel = ref(false);
const downloadExcel = async () => {
  const valid = await refForm.value.validate();
  if (!valid.valid) return;

  try {
    isLoadingExcel.value = true;
    showSnackbar({
      text: "Loading...",
      color: "info",
    });
    const response = await $api("/admin/pemasukan/mahasiswa/uas-susulan/excel", {
      method: "GET",
      headers: {
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      body: {
        tanggal_print: tanggal.value,
        ...(selectedProdi.value && {
          prodi_id_print: selectedProdi.value,
        }),
      },
    });

    const namaProdi = selectedProdi.value === "*" ? "Semua Prodi" : prodi.value.find((item) => item.value === selectedProdi.value)?.title;
    downloadFileExport(response, `Catatan UAS Susulan ${namaProdi}.xlsx`);
    showSnackbar({
      text: "Laporan berhasil di download.",
      color: "success",
    });
  } catch (err) {
    showSnackbar({
      text: err.message,
      color: "error",
    });
  } finally {
    isLoadingExcel.value = false;
  }
};

const refForm = ref(null);

onMounted(() => {
  document.title = "Catatan UAS Susulan - SIMKEU";
  tanggal.value = fDate(new Date());
  fetchData();
  fetchProdi();
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
    <VCard class="mb-4">
      <VCardItem class="pb-4">
        <VCardTitle>Print</VCardTitle>
      </VCardItem>
      <VDivider />
      <VCardText class="">
        <VForm ref="refForm" @submit.prevent="downloadExcel">
          <VRow class="mb-2">
            <!-- Input Tanggal -->
            <VCol cols="12" md="12">
              <AppDateTimePicker
                v-model="tanggal"
                label="Tanggal"
                placeholder="Select date"
                :rules="[requiredValidator]"
                :config="{
                  altInput: true,
                  altFormat: 'F j, Y',
                  dateFormat: 'Y-m-d',
                }"
              />
            </VCol>

            <!-- 👉 Select Prodi -->
            <VCol cols="12" sm="12">
              <VSelect
                v-model="selectedProdi"
                label="Select Prodi"
                placeholder="Select Prodi"
                :items="prodi"
                clearable
                clear-icon="ri-close-line"
                class="custom-bg-select"
                :rules="[requiredValidator]"
              />
            </VCol>
          </VRow>
          <VSpacer />
          <VBtn
            color="primary"
            prepend-icon="ri-printer-fill"
            @click="downloadExcel"
            :loading="isLoadingExcel"
          >
            Cetak
          </VBtn>
        </VForm>
      </VCardText>
    </VCard>

    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>UAS Susulan</VCardTitle>
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
            @click="$router.push('/admin/pemasukan/mahasiswa/uas-susulan/add')"
          >
            Add Data
          </VBtn>
        </div>
      </VCardText>

      <!-- 👉 Datatable  -->
      <VDataTableServer
        :headers="[
          { title: 'No', key: 'id' },
          { title: 'Tahun Akademik', key: 'th_akademik_kode' },
          { title: 'Tanggal', key: 'tanggal' },
          { title: 'Nim', key: 'nim' },
          { title: 'keterangan', key: 'keterangan' },
          { title: 'Actions', key: 'actions', sortable: false },
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
            <div>Memuat data uas susulan...</div>
          </div>
        </template>

        <template v-else #no-data>
          <div class="text-center pa-4">Tidak ada data uas susulan.</div>
        </template>

        <template #item.id="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </template>

        <template #item.nim="{ item }">
          <div style="margin: 15px 0">
            <VChip color="primary" size="x-small" label>
              {{ item.nim }}
            </VChip>
            <div>
              <template v-if="item.mahasiswa">
                {{ item.mahasiswa.nama }} - {{ item.mahasiswa.prodi?.alias }} -
                {{ item.mahasiswa.jk?.kode }}
              </template>
              <template v-else-if="item.mahasiswa === false">
                Data tidak ditemukan di SIAKAD.<br />Silakan hapus atau periksa
                kembali di SIAKAD.
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
                      `/admin/pemasukan/mahasiswa/uas-susulan/edit/${item.id}`
                    )
                  "
                >
                  Edit
                </VListItem>
                <VListItem
                  value="delete"
                  prepend-icon="ri-delete-bin-line"
                  @click="showDialogDelete(item.id, item.nim)"
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
            Anda yakin ingin menghapus data pengguna ini? Penghapusan data
            pengguna tidak dapat dibatalkan.
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
