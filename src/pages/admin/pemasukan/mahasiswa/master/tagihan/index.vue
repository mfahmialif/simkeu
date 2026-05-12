<script setup>
const selectedThAkademik = ref();
const thAkademik = ref([]);
const selectedThAngkatan = ref();
const thAngkatan = ref([]);
const selectedProdi = ref();
const prodi = ref([]);
const selectedDoubleDegree = ref();
const doubleDegree = ref([
  {
    title: "Tidak",
    value: 0,
  },
  {
    title: "Ya",
    value: 1,
  },
]);

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
    loading.value = true;
    const { data } = await $api("/admin/pemasukan/mahasiswa/tagihan", {
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
        ...(selectedThAngkatan.value && {
          th_angkatan_id: selectedThAngkatan.value,
        }),
        ...(selectedProdi.value && { prodi_id: selectedProdi.value }),
        ...(selectedDoubleDegree.value && {
          double_degree: selectedDoubleDegree.value,
        }),
      },
    });

    dataTable.value = data.data;
    totalItems.value = data.total;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
    if (initialLoading.value) initialLoading.value = false;
  }
};

const fetchThAkademik = async () => {
  try {
    const { data } = await $api("/admin/th-akademik", {
      method: "GET",
      body: {
        limit: 0,
        sort_key: "kode",
        sort_order: "desc",
      },
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
const fetchThAngkatan = async () => {
  try {
    const { data } = await $api("/admin/th-akademik", {
      method: "GET",
      body: {
        limit: 0,
        sort_key: "kode",
        sort_order: "desc",
        search: "ganjil",
      },
    });

    thAngkatan.value = data.data.map((thAngkatan) => {
      return {
        title: thAngkatan.kode.slice(0, -1),
        value: thAngkatan.id,
      };
    });
  } catch (err) {
    console.error(err);
  }
};
const fetchProdi = async () => {
  try {
    const { data } = await $api("/admin/prodi", {
      method: "GET",
      body: {
        limit: 0,
        sort_key: "kode",
        sort_order: "desc",
      },
    });

    prodi.value = data.data.map((prodi) => {
      return {
        title: prodi.nama,
        value: prodi.id,
      };
    });
  } catch (err) {
    console.error(err);
  }
};

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb, search: s }) => {
  loading.value = true;
  page.value = p;
  itemsPerPage.value = ipp;
  if (sb.length) sortBy.value = sb[0];
  fetchData();
};

// Import dialog state
const isDialogImportVisible = ref(false);
const importFile = ref(null);
const updateExisting = ref(false);
const importLoading = ref(false);

const downloadTemplate = async () => {
  try {
    showSnackbar({
      text: "Downloading template...",
      color: "info",
    });
    const blob = await $api("/admin/pemasukan/mahasiswa/tagihan/template", {
      method: "GET",
      headers: {
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
    openFileExport(blob);
  } catch (err) {
    console.error(err);
    showSnackbar({
      text: "Gagal download template",
      color: "error",
    });
  }
};

const submitImport = async () => {
  if (!importFile.value) {
    showSnackbar({
      text: "Pilih file terlebih dahulu",
      color: "error",
    });
    return;
  }

  importLoading.value = true;
  try {
    const formData = new FormData();
    formData.append("file", importFile.value);
    formData.append("update_existing", updateExisting.value ? "1" : "0");

    const response = await $api("/admin/pemasukan/mahasiswa/tagihan/import", {
      method: "POST",
      body: formData,
    });

    console.log("Import response:", response);

    if (response.status === true) {
      let message = `Import selesai! ${response.success_count} data baru, ${
        response.update_count || 0
      } data diupdate, ${response.skip_count} dilewati.`;

      // Log skip reasons for debugging
      if (response.skip_reasons && response.skip_reasons.length > 0) {
        console.log("Skip reasons:", response.skip_reasons);
        message += ` Alasan skip: ${response.skip_reasons
          .slice(0, 3)
          .join(", ")}`;
        if (response.skip_reasons.length > 3) {
          message += ` dan ${
            response.skip_reasons.length - 3
          } lainnya. Lihat console untuk detail.`;
        }
      }

      showSnackbar({
        text: message,
        color:
          response.success_count > 0 || (response.update_count || 0) > 0
            ? "success"
            : "warning",
      });
      fetchData();
      isDialogImportVisible.value = false;
      importFile.value = null;
      updateExisting.value = false;
    } else {
      showSnackbar({
        text: response.message || "Gagal import data",
        color: "error",
      });
    }
  } catch (err) {
    const message =
      typeof err.data?.message === "object"
        ? Object.values(err.data.message).flat().join("; ")
        : err.data?.message || "Terjadi kesalahan saat import.";
    showSnackbar({
      text: message,
      color: "error",
    });
  } finally {
    importLoading.value = false;
  }
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
    const response = await $api("/admin/pemasukan/mahasiswa/tagihan/" + id, {
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
  document.title = "Tagihan - SIMKEU";
  fetchThAkademik();
  fetchThAngkatan();
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

watch([selectedThAkademik, selectedThAngkatan, selectedProdi, selectedDoubleDegree], () => {
  fetchData();
});
</script>

<template>
  <div>
    <VRow class="mb-2">
      <!-- 👉 Select Th Akademik -->
      <VCol cols="12" sm="6">
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
      <!-- 👉 Select Th Angkatan -->
      <VCol cols="12" sm="6">
        <VSelect
          v-model="selectedThAngkatan"
          label="Select Th Angkatan"
          placeholder="Select Th Angkatan"
          :items="thAngkatan"
          clearable
          clear-icon="ri-close-line"
          class="custom-bg-select"
        />
      </VCol>
      <!-- 👉 Select Prodi -->
      <VCol cols="12" sm="6">
        <VSelect
          v-model="selectedProdi"
          label="Select Prodi"
          placeholder="Select Prodi"
          :items="prodi"
          clearable
          clear-icon="ri-close-line"
          class="custom-bg-select"
        />
      </VCol>
      <!-- 👉 Select Double Degree -->
      <VCol cols="12" sm="6">
        <VSelect
          v-model="selectedDoubleDegree"
          label="Select Double Degree"
          placeholder="Select Double Degree"
          :items="doubleDegree"
          clearable
          clear-icon="ri-close-line"
          class="custom-bg-select"
        />
      </VCol>
    </VRow>

    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Tagihan</VCardTitle>
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

        <div class="d-flex gap-x-4 align-center flex-wrap">
          <!-- 👉 Export button -->
          <VBtn
            variant="outlined"
            color="secondary"
            prepend-icon="ri-upload-2-line"
          >
            Export
          </VBtn>

          <!-- 👉 Import button -->
          <VBtn
            variant="outlined"
            color="info"
            prepend-icon="ri-download-2-line"
            @click="isDialogImportVisible = true"
          >
            Import
          </VBtn>

          <VBtn
            color="primary"
            prepend-icon="ri-add-line"
            @click="
              $router.push('/admin/pemasukan/mahasiswa/master/tagihan/add')
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
          { title: 'Tahun Akademik', key: 'th_akademik_kode' },
          { title: 'Tahun Angkatan', key: 'th_angkatan_kode' },
          { title: 'Prodi', key: 'prodi_nama' },
          { title: 'Nama', key: 'nama' },
          { title: 'Jumlah', key: 'jumlah' },
          { title: 'Actions', key: 'actions', sortable: false },
        ]"
        v-model:model-value="selectedRows"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :items="dataTable"
        :items-length="totalItems"
        :loading="loading"
        :search="search"
        item-value="id"
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

        <template #item.nama="{ item }">
          <div style="margin: 15px 0">
            <VChip color="success" size="x-small" label>
              {{ item.kode }} {{ item.double_degree ? "(DoubleD)" : "" }}
            </VChip>
            
            <VChip v-if="item.double_degree == 1" color="primary" size="x-small" label>
              Double Degree
            </VChip>

            <div>
              <b>{{ item.nama }}</b>
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
                  value="edit"
                  prepend-icon="ri-edit-box-line"
                  @click="
                    $router.push(
                      `/admin/pemasukan/mahasiswa/master/tagihan/edit/${item.id}`
                    )
                  "
                >
                  Edit
                </VListItem>

                <VListItem
                  value="delete"
                  prepend-icon="ri-delete-bin-line"
                  @click="showDialogDelete(item.id, item.nama)"
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

    <!-- Import Dialog -->
    <VDialog v-model="isDialogImportVisible" width="500">
      <VCard title="Import Tagihan">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogImportVisible = false"
        />

        <VCardText>
          <p class="mb-4">
            Upload file Excel (.xlsx, .xls) atau CSV dengan format yang sesuai.
          </p>

          <VBtn
            variant="text"
            color="primary"
            prepend-icon="ri-file-download-line"
            class="mb-4"
            @click="downloadTemplate"
          >
            Download Template
          </VBtn>

          <VFileInput
            v-model="importFile"
            label="Pilih File"
            accept=".xlsx,.xls,.csv"
            prepend-icon="ri-file-excel-2-line"
            show-size
            :disabled="importLoading"
          />

          <VCheckbox
            v-model="updateExisting"
            label="Update data yang sudah ada (cek angkatan + prodi + nama tagihan)"
            density="compact"
            :disabled="importLoading"
            hide-details
            class="mt-2"
          />
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="isDialogImportVisible = false"
            :disabled="importLoading"
          >
            Batal
          </VBtn>
          <VBtn color="primary" @click="submitImport" :loading="importLoading">
            <VIcon icon="ri-upload-cloud-line" class="me-1" />
            Import
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
