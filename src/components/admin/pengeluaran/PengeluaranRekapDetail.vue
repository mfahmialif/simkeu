<script setup>
import { formatRupiah } from "@/composables/formatRupiah";
import { showSnackbar } from "@/composables/snackbar";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  basePath: {
    type: String,
    required: true,
  },
  moduleType: {
    type: String,
    required: true,
  },
});

const route = useRoute();
const router = useRouter();
const rekapId = computed(() => route.params.id);
const rekap = ref(null);
const page = ref(1);
const itemsPerPage = ref(10);
const sortBy = ref({ key: "id", order: "desc" });
const dataTable = ref([]);
const totalItems = ref(0);
const loading = ref(true);

const numberValue = value => Number(value ?? 0);
const amountValue = (value, fallback = 0) => value ?? fallback ?? 0;
const subtotalTransport = (item) => {
  const transportMotor = numberValue(amountValue(item.transport_motor, item.transport));
  const hariMotor = numberValue(amountValue(item.hari_transport_motor, item.hari));
  const transportMobil = numberValue(amountValue(item.transport_mobil, item.transport_mobil_tanpa_tol));
  const hariMobil = numberValue(amountValue(item.hari_transport_mobil, item.hari_transport_mobil_tanpa_tol));

  return transportMotor * hariMotor + transportMobil * hariMobil;
};
const subtotalMengajar = (item) => {
  const barokahBiasa = numberValue(amountValue(item.barokah_mengajar_biasa, item.barokah));
  const jamBiasa = numberValue(item.jam);
  const barokahDoubleDegree = numberValue(item.barokah_mengajar_double_degree);
  const jamDoubleDegree = numberValue(amountValue(item.jam_mengajar_double_degree, item.jam));

  return Math.round((barokahBiasa * jamBiasa) + (barokahDoubleDegree * jamDoubleDegree));
};
const subtotalSempro = item => numberValue(item.barokah_sempro) * numberValue(amountValue(item.jam_sempro, item.barokah_sempro ? 1 : 0));
const subtotalUas = item => numberValue(item.barokah_uas) * numberValue(item.jumlah_mahasiswa_uas);

const errorMessage = (err) => {
  const message =
    err?.data?.message ||
    err?.response?._data?.message ||
    err?.response?.data?.message ||
    err?.message;

  if (typeof message === "object") {
    return Object.values(message).flat().join("; ");
  }

  return message || "Terjadi kesalahan.";
};

const fetchRekap = async () => {
  const response = await $api(`${props.endpoint}/rekap/${rekapId.value}`, {
    method: "GET",
  });

  rekap.value = response.data;
};

const fetchData = async () => {
  try {
    loading.value = true;
    const response = await $api(props.endpoint, {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        rekap_id: rekapId.value,
      },
    });

    dataTable.value = response.data.data;
    totalItems.value = response.data.total;
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb }) => {
  page.value = p;
  itemsPerPage.value = ipp;
  if (sb.length) sortBy.value = sb[0];
  fetchData();
};

const pegawaiLabel = item => item.nama_pegawai || item.nama_dosen || "-";
const pegawaiMeta = item => [
  item.kode_pegawai || item.kode_dosen,
  item.tipe_pegawai === "staff" ? "Staff" : item.tipe_pegawai === "dosen" ? "Dosen" : null,
  item.jabatan_staff || item.nama_prodi_dosen,
].filter(Boolean).join(" - ");

const uraian = (item) => {
  if (props.moduleType === "kegiatan") {
    return item.nama_kegiatan || "-";
  }

  if (props.moduleType === "bulanan") {
    return `${numberValue(item.hari)} hari, harian ${formatRupiah(item.barokah_harian)}, bulanan ${formatRupiah(item.barokah_bulanan)}`;
  }

  return `Transport ${formatRupiah(subtotalTransport(item))}, mengajar ${formatRupiah(subtotalMengajar(item))}, sempro ${formatRupiah(subtotalSempro(item))}, UAS ${formatRupiah(subtotalUas(item))}`;
};

const editPath = item => `${props.basePath}/edit/${item.id}`;

onMounted(async () => {
  document.title = `Detail Rekap ${props.title} - SIMKEU`;

  try {
    await fetchRekap();
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    });
  }
});
</script>

<template>
  <div>
    <VBtn
      variant="text"
      color="secondary"
      prepend-icon="ri-arrow-left-line"
      class="mb-4"
      @click="router.push(basePath)"
    >
      Kembali
    </VBtn>

    <VCard class="mb-6">
      <VCardText>
        <div class="d-flex flex-wrap align-center gap-4">
          <div class="min-w-0">
            <div class="text-h5 font-weight-semibold">
              {{ rekap?.nama || "Detail Rekap" }}
            </div>
            <div v-if="rekap?.keterangan" class="text-body-2 mt-1">
              {{ rekap.keterangan }}
            </div>
          </div>

          <VSpacer />

          <div class="detail-stat">
            <span>Jumlah Data</span>
            <strong>{{ rekap?.jumlah_data || 0 }}</strong>
          </div>

          <div class="detail-stat">
            <span>Total</span>
            <strong>{{ formatRupiah(rekap?.total_pengeluaran || 0) }}</strong>
          </div>
        </div>
      </VCardText>
    </VCard>

    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Data {{ title }}</VCardTitle>
      </VCardItem>

      <VDivider />

      <VDataTableServer
        :headers="[
          { title: 'No', key: 'id' },
          { title: 'Tanggal', key: 'tanggal' },
          { title: 'Pegawai', key: 'pegawai', sortable: false },
          { title: 'Uraian', key: 'uraian', sortable: false },
          { title: 'Jenis Pembayaran', key: 'jenis_pembayaran' },
          { title: 'Total', key: 'total' },
          { title: 'Keterangan', key: 'keterangan' },
          { title: 'Actions', key: 'actions', sortable: false },
        ]"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :items="dataTable"
        :items-length="totalItems"
        :loading="loading"
        item-value="id"
        @update:options="loadItems"
      >
        <template #no-data>
          <div class="text-center pa-4">Tidak ada data.</div>
        </template>

        <template #item.id="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </template>

        <template #item.pegawai="{ item }">
          <div class="font-weight-medium">
            {{ pegawaiLabel(item) }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ pegawaiMeta(item) || "-" }}
          </div>
        </template>

        <template #item.uraian="{ item }">
          {{ uraian(item) }}
        </template>

        <template #item.jenis_pembayaran="{ item }">
          <VChip
            v-if="item.jenis_pembayaran"
            :color="item.jenis_pembayaran === 'Transfer' ? 'info' : 'success'"
            size="small"
            label
          >
            {{ item.jenis_pembayaran }}
          </VChip>
          <span v-else>-</span>
        </template>

        <template #item.total="{ item }">
          {{ formatRupiah(item.total) }}
        </template>

        <template #item.keterangan="{ item }">
          {{ item.keterangan || "-" }}
        </template>

        <template #item.actions="{ item }">
          <VBtn
            variant="text"
            size="small"
            color="primary"
            prepend-icon="ri-edit-box-line"
            @click="router.push(editPath(item))"
          >
            Edit
          </VBtn>
        </template>
      </VDataTableServer>
    </VCard>
  </div>
</template>

<style scoped>
.detail-stat {
  display: grid;
  min-inline-size: 150px;
  border: 1px solid rgba(var(--v-border-color), 0.16);
  border-radius: 8px;
  padding: 10px 14px;
}

.detail-stat span {
  color: rgba(var(--v-theme-on-surface), 0.68);
  font-size: 0.78rem;
  font-weight: 600;
}

.detail-stat strong {
  color: rgba(var(--v-theme-on-surface), 0.92);
  font-size: 1rem;
}
</style>
