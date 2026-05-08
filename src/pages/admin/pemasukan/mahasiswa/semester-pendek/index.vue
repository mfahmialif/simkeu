<script setup>
import { ref, onMounted, watch } from "vue";
import WidgetSemesterPendek from "@/components/admin/pemasukan/mahasiswa/SemesterPendek/WidgetSemesterPendek.vue";
import { openFileExport } from "@/composables/exportFile";

const page = ref(1);
const itemsPerPage = ref(10);
const sortBy = ref({ key: "id", order: "desc" });
const search = ref("");
const dataTable = ref([]);
const totalItems = ref(0);
const loading = ref(true);
const initialLoading = ref(true);
let isFetching = ref(false);

const filterPeriode = ref(null);
const filterJenisPembayaran = ref(null);
const filterPetugas = ref(null);
const filterTanggalMulai = ref("");
const filterTanggalAkhir = ref("");

const listPeriode = ref([]);
const listJenisPembayaran = ref([]);
const listPetugas = ref([]);

const widgetRef = ref(null);

const fetchSemesterPendek = async () => {
  if (isFetching.value) return;
  isFetching.value = true;
  loading.value = true;

  try {
    const response = await $api(
      "/admin/pemasukan/mahasiswa/semester-pendek",
      {
        method: "GET",
        params: {
          page: page.value,
          limit: itemsPerPage.value,
          sort_key: sortBy.value?.key,
          sort_order: sortBy.value?.order,
          search: search.value,
          ...(filterPeriode.value && { periode_id: filterPeriode.value }),
          ...(filterJenisPembayaran.value && { jenis_pembayaran_id: filterJenisPembayaran.value }),
          ...(filterPetugas.value && { user_id: filterPetugas.value }),
          ...(filterTanggalMulai.value && { tanggal_mulai: filterTanggalMulai.value }),
          ...(filterTanggalAkhir.value && { tanggal_akhir: filterTanggalAkhir.value }),
        },
      }
    );

    const result = response.data?.data ?? response.data;
    dataTable.value = result.data ?? result;
    totalItems.value = result.total ?? (result.data ? result.data.length : 0);

    // Fetch KRS detail from SIAKAD
    if (dataTable.value.length > 0) {
      fetchDetailData();
    }
  } catch (err) {
    console.error("Gagal fetch data semester pendek:", err);
  } finally {
    isFetching.value = false;
    loading.value = false;
    if (initialLoading.value) initialLoading.value = false;
  }
};

const fetchDetailData = async () => {
  try {
    const krsIdList = dataTable.value.map((item) => item.krs_id);
    const res = await $api("/admin/pemasukan/mahasiswa/semester-pendek/search-krs-data", {
      method: "GET",
      params: {
        krs_id: JSON.stringify(krsIdList),
      },
    });

    const krsItems = Array.isArray(res) ? res : (res?.data ?? []);
    dataTable.value = dataTable.value.map((item) => {
      const krs = krsItems.find((k) => k.id === item.krs_id);
      return {
        ...item,
        krs_detail: krs ? krs : false,
      };
    });
  } catch (err) {
    console.error("Gagal fetch KRS detail data:", err);
  }
};

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb, search: s }) => {
  page.value = p;
  itemsPerPage.value = ipp;
  if (sb && sb.length) sortBy.value = sb[0];
  fetchSemesterPendek();
};

const isDialogDeleteVisible = ref(false);
const deleteData = ref({});

const showDialogDelete = (id, nomor) => {
  deleteData.value = { id, nomor };
  isDialogDeleteVisible.value = true;
};

const deleteDataSubmit = async (id) => {
  try {
    const response = await $api(`/admin/pemasukan/mahasiswa/semester-pendek/${id}`, {
      method: "DELETE",
    });

    if (response.status === "true") {
      showSnackbar({ text: response.message, color: "success" });
      fetchSemesterPendek();
    } else {
      showSnackbar({ text: response.message, color: "error" });
    }
  } catch (err) {
    const message = Array.isArray(err.data?.message)
      ? err.data.message.join("; ")
      : err.data?.message || "Terjadi kesalahan.";
    showSnackbar({ text: message, color: "error" });
  } finally {
    isDialogDeleteVisible.value = false;
  }
};

const cetakKwitansi = async (id) => {
  try {
    showSnackbar({ text: "Loading cetak kwitansi...", color: "info" });
    const blob = await $api(
      "/admin/pemasukan/mahasiswa/semester-pendek/kwitansi/" + id,
      {
        method: "GET",
        headers: { Accept: "application/pdf" },
      }
    );
    openFileExport(blob);
  } catch (err) {
    console.info(err);
    showSnackbar({ text: "Gagal cetak kwitansi.", color: "error" });
  }
};

const fetchOptions = async () => {
  try {
    const [resPeriode, resJp, resPetugas] = await Promise.all([
      $api("/admin/pemasukan/mahasiswa/semester-pendek/get-periode", { method: "GET" }),
      $api("/admin/pemasukan/mahasiswa/jenis-pembayaran", { method: "GET", body: { limit: 100 } }),
      $api("/helper/petugas-pembayaran", { method: "GET" }),
    ]);
    
    const periodeItems = resPeriode?.data?.data ?? resPeriode?.data ?? [];
    listPeriode.value = periodeItems.map(p => ({
      title: p.periode,
      value: p.id
    }));

    const jpItems = resJp?.data?.data ?? resJp?.data ?? [];
    listJenisPembayaran.value = jpItems.map(jp => ({
      title: jp.nama + " - " + jp.kategori,
      value: jp.id
    }));

    const petugasItems = resPetugas?.data?.data ?? resPetugas?.data ?? [];
    listPetugas.value = petugasItems.map(u => ({
      title: `${u.name} (${u.jenis_kelamin})`,
      value: u.id
    }));
  } catch (err) {
    console.error("Gagal fetch options filter", err);
  }
};

watch(
  [filterPeriode, filterJenisPembayaran, filterPetugas, filterTanggalMulai, filterTanggalAkhir],
  () => {
    fetchSemesterPendek();
    widgetRef.value?.fetchStatistics();
  }
);

onMounted(() => {
  document.title = "Semester Pendek - SIMKEU";
  fetchOptions();
  fetchSemesterPendek();
});
</script>

<template>
  <div>
    <WidgetSemesterPendek
      ref="widgetRef"
      :periode-id="filterPeriode"
      :jenis-pembayaran-id="filterJenisPembayaran"
      :user-id="filterPetugas"
      :tanggal-mulai="filterTanggalMulai"
      :tanggal-akhir="filterTanggalAkhir"
    />

    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Pembayaran Semester Pendek</VCardTitle>
      </VCardItem>

      <VDivider />

      <VCardText class="d-flex flex-column gap-4">
        <!-- Filter Panel -->
        <VRow>
          <VCol cols="12" md="2">
            <VSelect
              v-model="filterPeriode"
              :items="listPeriode"
              label="Periode"
              clearable
              density="compact"
              variant="outlined"
            />
          </VCol>
          <VCol cols="12" md="2">
            <VSelect
              v-model="filterJenisPembayaran"
              :items="listJenisPembayaran"
              label="Jenis Pembayaran"
              clearable
              density="compact"
              variant="outlined"
            />
          </VCol>
          <VCol cols="12" md="2">
            <VSelect
              v-model="filterPetugas"
              :items="listPetugas"
              label="Petugas"
              clearable
              density="compact"
              variant="outlined"
            />
          </VCol>
          <VCol cols="12" md="3">
            <VTextField
              v-model="filterTanggalMulai"
              type="date"
              label="Dari Tanggal"
              clearable
              density="compact"
              variant="outlined"
            />
          </VCol>
          <VCol cols="12" md="3">
            <VTextField
              v-model="filterTanggalAkhir"
              type="date"
              label="Sampai Tanggal"
              clearable
              density="compact"
              variant="outlined"
            />
          </VCol>
        </VRow>

        <VDivider />

        <div class="d-flex flex-wrap gap-4 align-center">
          <div class="d-flex align-center w-100 w-sm-auto">
            <VTextField
              v-model="search"
              placeholder="Cari Nomor Transaksi"
              style="inline-size: 200px"
              density="compact"
              class="me-3"
              @keyup.enter="fetchSemesterPendek"
            />
          </div>

          <VSpacer />

        <div class="d-flex gap-x-4 align-center">
          <VBtn
            color="primary"
            prepend-icon="ri-add-line"
            @click="$router.push('/admin/pemasukan/mahasiswa/semester-pendek/add')"
          >
            Add Data
          </VBtn>
        </div>
        </div>
      </VCardText>

      <VDataTableServer
        :headers="[
          { title: 'No', key: 'index', sortable: false },
          { title: 'Pembayaran', key: 'pembayaran', sortable: false },
          { title: 'Jumlah', key: 'jumlah' },
          { title: 'Tanggal', key: 'tanggal' },
          { title: 'Jenis Pembayaran', key: 'jenis_pembayaran_id', sortable: false },
          { title: 'Petugas', key: 'user_id', sortable: false },
          { title: 'Aksi', key: 'actions', sortable: false },
        ]"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :items="dataTable"
        :items-length="totalItems"
        :loading="loading"
        :search="search"
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

        <template #item.index="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </template>

        <template #item.pembayaran="{ item }">
          <div style="margin: 10px 0">
            <VChip color="info" size="x-small" label class="me-1">
              {{ item.krs_detail?.periode_semester_pendek?.periode ?? '-' }}
            </VChip>
            <VChip color="primary" size="x-small" label>
              {{ item.nomor }}
            </VChip>
            <div class="mt-1">
              <template v-if="item.krs_detail">
                <b>{{ item.krs_detail.nim }} - {{ item.krs_detail.mhs_nama }}</b>
                <span class="text-medium-emphasis">
                  - {{ item.krs_detail.prodi_alias }} - {{ item.krs_detail.jk_nama }}
                </span>
              </template>
              <template v-else-if="item.krs_detail === false">
                <span class="text-error text-caption">Data KRS tidak ditemukan di SIAKAD.</span>
              </template>
              <template v-else>
                <VProgressCircular indeterminate color="primary" size="16" width="2" style="vertical-align: middle" />
              </template>
            </div>
          </div>
        </template>

        <template #item.jumlah="{ item }">
          Rp {{ item.jumlah ? item.jumlah.toLocaleString('id-ID') : 0 }}
        </template>

        <template #item.tanggal="{ item }">
          {{ new Date(item.tanggal).toLocaleDateString('id-ID') }}
        </template>

        <template #item.jenis_pembayaran_id="{ item }">
          {{ item.jenis_pembayaran?.nama ?? '-' }}
        </template>

        <template #item.user_id="{ item }">
          {{ item.user?.name ?? '-' }}
        </template>

        <template #item.actions="{ item }">
          <IconBtn size="small">
            <VIcon icon="ri-more-2-fill" />
            <VMenu activator="parent">
              <VList>
                <VListItem
                  value="kwitansi"
                  prepend-icon="ri-printer-line"
                  @click="cetakKwitansi(item.id)"
                >
                  Kwitansi
                </VListItem>
                <VListItem
                  value="edit"
                  prepend-icon="ri-pencil-line"
                  @click="$router.push(`/admin/pemasukan/mahasiswa/semester-pendek/edit/${item.id}`)"
                >
                  Edit
                </VListItem>
                <VListItem
                  value="delete"
                  prepend-icon="ri-delete-bin-line"
                  @click="showDialogDelete(item.id, item.nomor)"
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
      <VCard :title="'Hapus Data: ' + deleteData.nomor">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogDeleteVisible = false"
        />

        <VCardText class="d-flex align-center">
          <VIcon icon="ri-alert-line" size="32" class="me-2" />
          <span>
            Anda yakin ingin menghapus data pembayaran semester pendek ini? Penghapusan
            ini juga akan mengurangi total pembayaran di SIAKAD.
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
