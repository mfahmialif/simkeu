<script setup>
const widgetData = ref([
  {
    title: "In-Store Sales",
    value: "$5,345",
    icon: "ri-home-6-line",
    desc: "5k orders",
    change: 5.7,
  },
  {
    title: "Website Sales",
    value: "$74,347",
    icon: "ri-computer-line",
    desc: "21k orders",
    change: 12.4,
  },
  {
    title: "Discount",
    value: "$14,235",
    icon: "ri-gift-line",
    desc: "6k orders",
  },
  {
    title: "Affiliate",
    value: "$8,345",
    icon: "ri-money-dollar-circle-line",
    desc: "150 orders",
    change: -3.5,
  },
]);

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

const fetchUsers = async () => {
  try {
    const { data } = await $api("/admin/users", {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        search: search.value,
        ...(selectedRole.value && { role_id: selectedRole.value }),
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
  fetchUsers();
};

const fetchRole = async () => {
  try {
    const { data } = await $api("/admin/role", {
      method: "GET",
    });

    role.value = data.data.map((role) => {
      return {
        title: role.name,
        value: role.id,
      };
    });
  } catch (err) {
    console.error(err);
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
    const response = await $api("/admin/users/" + id, {
      method: "DELETE",
    });

    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: "success",
      });

      fetchUsers();
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
  document.title = "Users - SIMKEU";
  fetchRole();
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
    <VRow class="mb-2">
      <!-- 👉 Select Role -->
      <VCol cols="12" sm="12">
        <VSelect
          v-model="selectedRole"
          label="Select Role"
          placeholder="Select Role"
          :items="role"
          clearable
          clear-icon="ri-close-line"
          class="custom-bg-select"
        />
      </VCol>
    </VRow>

    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Users</VCardTitle>
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
            @click="$router.push('/admin/user/add')"
          >
            Add Data
          </VBtn>
        </div>
      </VCardText>

      <!-- 👉 Datatable  -->
      <VDataTableServer
        :headers="[
          { title: 'No', key: 'id' },
          { title: 'Username', key: 'username' },
          { title: 'Email', key: 'email' },
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
            <div>Memuat data pengguna...</div>
          </div>
        </template>

        <template v-else #no-data>
          <div class="text-center pa-4">Tidak ada data pengguna.</div>
        </template>

        <template #item.id="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
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
                  @click="$router.push(`/admin/user/edit/${item.id}`)"
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
