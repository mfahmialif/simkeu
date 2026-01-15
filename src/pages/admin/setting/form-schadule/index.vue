<script setup>
import { formatDate } from "@vueuse/core";

const page = ref(1);
const itemsPerPage = ref(10);
const sortBy = ref({ key: "id", order: "desc" });
const search = ref("");
const selectedRows = ref([]);
const dataTable = ref([]);
const totalItems = ref(0);
const loading = ref(true);
const initialLoading = ref(true);

// Get user role for conditional rendering
const userData = useCookie("userData").value ?? {};
const isAdmin = computed(() => userData.role?.name === "admin");

const fetchData = async () => {
  try {
    loading.value = true;
    const { data } = await $api("/admin/form-schadule", {
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
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
    if (initialLoading.value) initialLoading.value = false;
  }
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
    const response = await $api("/admin/form-schadule/" + id, {
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
  document.title = "Form Schedule - SIMKEU";
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
        <VCardTitle>Form Schedule</VCardTitle>
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

        <div class="d-flex gap-x-4 align-center" v-if="isAdmin">
          <VBtn
            color="primary"
            prepend-icon="ri-add-line"
            @click="$router.push('/admin/setting/form-schadule/add')"
          >
            Add Data
          </VBtn>
        </div>
      </VCardText>

      <!-- 👉 Datatable  -->
      <VDataTableServer
        :headers="[
          { title: 'No', key: 'id', width: 60 },
          { title: 'Kode', key: 'kode' },
          { title: 'Nama', key: 'nama' },
          { title: 'Periode', key: 'tgl_mulai' },
          { title: 'Semester', key: 'semester' },
          { title: 'Status', key: 'aktif' },
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

        <template #item.tgl_mulai="{ item }">
          <div v-if="item.tgl_mulai || item.tgl_selesai">
            <div v-if="item.tgl_mulai">
              <small>Mulai:</small> {{ formatDate(new Date(item.tgl_mulai), "YYYY-MM-DD HH:mm") }}
            </div>
            <div v-if="item.tgl_selesai">
              <small>Selesai:</small> {{ formatDate(new Date(item.tgl_selesai), "YYYY-MM-DD HH:mm") }}
            </div>
          </div>
          <span v-else>-</span>
        </template>

        <template #item.aktif="{ item }">
          <VChip :color="item.aktif === 'Y' ? 'success' : 'error'" size="small" label>
            {{ item.aktif === 'Y' ? 'Aktif' : 'Tidak Aktif' }}
          </VChip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn size="small">
            <VIcon icon="ri-more-2-fill" />

            <VMenu activator="parent">
              <VList>
                <VListItem
                  v-if="isAdmin"
                  value="edit"
                  prepend-icon="ri-edit-box-line"
                  @click="$router.push(`/admin/setting/form-schadule/edit/${item.id}`)"
                >
                  Edit
                </VListItem>

                <VListItem
                  v-if="!isAdmin"
                  value="view"
                  prepend-icon="ri-eye-line"
                  @click="$router.push(`/admin/setting/form-schadule/edit/${item.id}`)"
                >
                  View
                </VListItem>

                <VListItem
                  v-if="isAdmin"
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
          <VBtn color="error" @click="deleteDataSubmit(deleteData.id)">
            <VIcon icon="ri-delete-bin-line" class="me-1" />
            Hapus
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
