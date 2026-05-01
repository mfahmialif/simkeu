<script setup>
import { formatDate } from "@vueuse/core";

const selectedThAkademik = ref();
const thAkademik = ref([]);
const selectedProdi = ref(null);
const prodiList = ref([]);
const selectedJenisPembayaran = ref(null);
const jenisPembayaranList = ref([]);
const selectedUser = ref(null);
const userList = ref([]);
const tanggalMulai = ref(null);
const tanggalAkhir = ref(null);

const widgetRef = ref(null);

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
        ...(selectedProdi.value && {
          prodi_id: selectedProdi.value,
        }),
        ...(selectedJenisPembayaran.value && {
          jenis_pembayaran_id: selectedJenisPembayaran.value,
        }),
        ...(selectedUser.value && {
          user_id: selectedUser.value,
        }),
        ...(tanggalMulai.value && { tanggal_mulai: tanggalMulai.value }),
        ...(tanggalAkhir.value && { tanggal_akhir: tanggalAkhir.value }),
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
      mahasiswa: mhs ? mhs : false, // tambahkan objek mahasiswa (atau false kalau tidak ditemukan)
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

const fetchProdi = async () => {
  try {
    const response = await $api("/admin/prodi", {
      method: "GET",
      body: { limit: 100, sort_key: 'nama', sort_order: 'asc' },
    });
    if (response && response.data) {
      const items = response.data.data || response.data;
      prodiList.value = [
        { title: '📚 Semua Prodi Sarjana', value: 'sarjana' },
        { title: '🎓 Semua Prodi Pasca', value: 'pasca' },
        ...items
          .filter(p => p.jenjang !== '---')
          .map(p => ({
            title: `${p.alias} - ${p.nama} (${p.jenjang})`,
            value: p.id,
          })),
      ];
    }
  } catch (err) {
    console.error('Failed to fetch prodi:', err);
  }
};

const fetchJenisPembayaran = async () => {
  try {
    const response = await $api("/admin/pemasukan/mahasiswa/jenis-pembayaran", {
      method: "GET",
      body: { limit: 100 },
    });
    if (response && response.data) {
      const items = response.data.data || response.data;
      jenisPembayaranList.value = items.map(jp => ({
        title: jp.nama+" - "+jp.kategori,
        value: jp.id,
      }));
    }
  } catch (err) {
    console.error('Failed to fetch jenis pembayaran:', err);
  }
};

const fetchUser = async () => {
  try {
    const response = await $api("/helper/petugas-pembayaran", {
      method: "GET",
    });
    if (response && response.data) {
      const items = response.data.data || response.data;
      userList.value = items.map(u => ({
        title: `${u.name} (${u.jenis_kelamin})`,
        value: u.id,
      }));
    }
  } catch (err) {
    console.error('Failed to fetch petugas:', err);
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

const kwitansi = async (id) => {
  try {
    showSnackbar({
      text: "Loading...",
      color: "info",
    });
    const blob = await $api(
      "/admin/pemasukan/mahasiswa/pembayaran/kwitansi/" + id + "/view",
      {
        method: "GET",
        headers: { Accept: "application/pdf" },
      }
    );

    openFileExport(blob);
  } catch (err) {
    console.info(err);
    showSnackbar({
      text: err,
      color: "error",
    });
  }
};

const userData = useCookie("userData").value ?? {};

onMounted(() => {
  document.title = "Pembayaran Mahasiswa - SIMKEU";
  console.log(userData);
  fetchThAkademik();
  fetchProdi();
  fetchJenisPembayaran();
  fetchUser();
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
  page.value = 1;
  fetchData();
});

watch(selectedProdi, () => {
  page.value = 1;
  fetchData();
});

watch(selectedJenisPembayaran, () => {
  page.value = 1;
  fetchData();
});

watch(selectedUser, () => {
  page.value = 1;
  fetchData();
});

watch(
  [tanggalMulai, tanggalAkhir],
  () => {
    page.value = 1;
    fetchData();
  },
  { deep: true }
);

const clearDateFilter = () => {
  tanggalMulai.value = null;
  tanggalAkhir.value = null;
};

const refreshData = () => {
  fetchData();
  if (widgetRef.value) {
    widgetRef.value.fetchStatistics();
  }
};
</script>

<template>
  <div>
    <div class="d-flex justify-end mb-4">
      <VBtn color="primary" prepend-icon="ri-refresh-line" @click="refreshData">
        Refresh Data
      </VBtn>
    </div>

    <WidgetPembayaranMahasiswa
      ref="widgetRef"
      :th-akademik-id="selectedThAkademik"
      :prodi-id="selectedProdi"
      :jenis-pembayaran-id="selectedJenisPembayaran"
      :tanggal-mulai="tanggalMulai"
      :tanggal-akhir="tanggalAkhir"
      :user-id="selectedUser"
    />

    <VRow>
      <!-- 👉 Select ThAkademik -->
      <VCol cols="12" sm="3">
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
      <!-- 👉 Select Prodi -->
      <VCol cols="12" sm="3">
        <VSelect
          v-model="selectedProdi"
          label="Filter Prodi"
          placeholder="Semua Prodi"
          :items="prodiList"
          clearable
          clear-icon="ri-close-line"
          class="custom-bg-select"
        />
      </VCol>
      <!-- 👉 Select Jenis Pembayaran -->
      <VCol cols="12" sm="3">
        <VSelect
          v-model="selectedJenisPembayaran"
          label="Filter Jenis Pembayaran"
          placeholder="Semua Jenis"
          :items="jenisPembayaranList"
          clearable
          clear-icon="ri-close-line"
          class="custom-bg-select"
        />
      </VCol>
      <!-- 👉 Select User/Petugas -->
      <VCol cols="12" sm="3">
        <VSelect
          v-model="selectedUser"
          label="Filter Petugas"
          placeholder="Semua Petugas"
          :items="userList"
          clearable
          clear-icon="ri-close-line"
          class="custom-bg-select"
        />
      </VCol>
    </VRow>

    <VRow class="mb-2">
      <!-- 👉 Dari Tanggal -->
      <VCol cols="12" sm="5">
        <AppDateTimePicker
          v-model="tanggalMulai"
          label="Dari Tanggal"
          placeholder="Pilih tanggal"
          :config="{
            altInput: true,
            altFormat: 'F j, Y',
            dateFormat: 'Y-m-d',
          }"
        />
      </VCol>
      <!-- 👉 Sampai Tanggal -->
      <VCol cols="12" sm="5">
        <AppDateTimePicker
          v-model="tanggalAkhir"
          label="Sampai Tanggal"
          placeholder="Pilih tanggal"
          :config="{
            altInput: true,
            altFormat: 'F j, Y',
            dateFormat: 'Y-m-d',
          }"
        />
      </VCol>
      <!-- 👉 Reset -->
      <VCol cols="12" sm="2" class="d-flex align-end">
        <VBtn
          color="secondary"
          variant="outlined"
          class="w-100"
          height="48"
          prepend-icon="ri-refresh-line"
          @click="clearDateFilter"
        >
          Reset
        </VBtn>
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
            <VChip
              class="ms-2"
              color="success"
              size="x-small"
              label
              v-if="item.keuangan_tagihan_double_degree == 1"
            >
              (Double Degree)
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
                >
                </VProgressCircular>
              </template>
            </div>
          </div>
        </template>
        <template #item.tanggal="{ item }">
          <div class="text-caption font-weight-bold text-primary mb-1">
            <VIcon icon="ri-user-line" size="14" class="me-1" />
            {{ item.petugas_nama || '-' }}
          </div>
          <div>
            <VIcon icon="ri-calendar-line" size="14" class="me-1" />
            {{ formatDate(new Date(item.tanggal), "YYYY-MM-DD") }}
          </div>
        </template>
        <template #item.jumlah="{ item }">
          <div>
            <VChip color="primary" size="x-small" label>
              {{ item.keuangan_jenis_pembayaran_nama }}
            </VChip>
          </div>
          <div>{{ formatRupiah(item.jumlah) }}</div>
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
                  prepend-icon="ri-download-cloud-2-line"
                  @click="kwitansi(item.id)"
                >
                  Kwitansi
                </VListItem>
                <VListItem
                  value="download"
                  prepend-icon="ri-edit-box-line"
                  @click="
                    $router.push(
                      `/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/edit/${item.id}`
                    )
                  "
                >
                  Edit
                </VListItem>
                <VListItem
                  v-if="
                    ['admin', 'kabag'].includes(
                      (userData?.role?.name || '').toLowerCase()
                    ) ||
                    ((userData?.role?.name || '').toLowerCase() === 'staff' &&
                      (userData?.jenis_kelamin || '').toLowerCase() ===
                        'perempuan')
                  "
                  value="delete"
                  prepend-icon="ri-delete-bin-line"
                  @click="showDialogDelete(item.id, item.keuangan_tagihan_nama)"
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
          <VBtn
            color="error"
            :disabled="disabledDelete"
            @click="deleteDataSubmit(deleteData.id)"
          >
            <VIcon icon="ri-delete-bin-line" class="me-1" />
            Delete
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
