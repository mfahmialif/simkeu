<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  refForm: {
    type: Object,
    default: () => ({}),
  },
});

const router = useRouter();

const menuList = [
  {
    title: "Kembali",
    value: "back",
    icon: "ri-arrow-left-line",
    clickHandler: () => router.back(),
  },
  {
    title: "Lihat Data",
    value: "lihat-data",
    icon: "ri-eye-line",
    clickHandler: () => router.push("/admin/pengeluaran/dosen-kegiatan"),
  },
];

const dataList = ref([]);
const tanggal = ref(fDate(new Date()));
const search = ref("");
const searchKode = ref("");
const selectedDosen = ref("");
const loadingData = ref(false);
const loadingSearch = ref(false);

const emptyData = {
  id: "",
  kode: "",
  nama: "",
  prodi: "",
  jenisKelamin: "",
  jkId: "",
};

const dosen = ref(emptyData);
let typingTimeout = null;

const prodiName = item => item?.dosen?.prodi?.nama || item?.dosen?.prodi?.alias || "-";
const jenisKelaminLabel = item => item?.jenis_kelamin === "L" ? "Laki-laki" : item?.jenis_kelamin === "P" ? "Perempuan" : item?.jenis_kelamin || "";

const syncTanggalToForm = () => {
  props.refForm?.setTanggal?.(tanggal.value);
};

const lookupPengeluaranByTanggal = async (pegawaiId = dosen.value.id) => {
  syncTanggalToForm();

  if (!pegawaiId || !tanggal.value) {
    props.refForm?.resetExistingPengeluaran?.();
    return;
  }

  await props.refForm?.lookupExistingPengeluaran?.(pegawaiId, tanggal.value);
};

watch(search, (newVal) => {
  clearTimeout(typingTimeout);

  if (!newVal.trim()) {
    dataList.value = [];
    loadingSearch.value = false;
    return;
  }

  typingTimeout = setTimeout(async () => {
    try {
      loadingSearch.value = true;
      const res = await $api("/admin/pegawai", {
        method: "GET",
        body: {
          search: newVal,
          tipe: "dosen",
          limit: 30,
          sort_key: "nama",
          sort_order: "asc",
        },
      });

      dataList.value = (res.data?.data || []).map((item) => ({
        ...item,
        display: `${item.kode} - ${item.nama} - ${prodiName(item)}`,
      }));
    } catch (err) {
      showSnackbar({
        text: "Gagal mendapatkan list dosen",
        color: "error",
      });
      dataList.value = [];
    } finally {
      loadingSearch.value = false;
    }
  }, 300);
});

watch(selectedDosen, (newVal) => {
  if (newVal && typeof newVal === "object" && !Array.isArray(newVal)) {
    searchKode.value = newVal.kode;
    searching();
  } else if (typeof newVal === "string") {
    searchKode.value = newVal;
  } else if (!newVal) {
    searchKode.value = "";
  }
});

watch(tanggal, () => {
  lookupPengeluaranByTanggal();
});

const searching = async () => {
  if (!searchKode.value) {
    showSnackbar({
      text: "Kode harus diisi",
      color: "error",
    });
    return;
  }

  if (!tanggal.value) {
    showSnackbar({
      text: "Tanggal harus diisi",
      color: "error",
    });
    return;
  }

  try {
    loadingData.value = true;

    let res = selectedDosen.value && typeof selectedDosen.value === "object" && !Array.isArray(selectedDosen.value)
      ? selectedDosen.value
      : null;

    if (!res) {
      const response = await $api("/admin/pegawai", {
        method: "GET",
        body: {
          search: searchKode.value,
          tipe: "dosen",
          limit: 10,
          sort_key: "nama",
          sort_order: "asc",
        },
      });

      const items = response.data?.data || [];
      res = items.find(item => String(item.kode) === String(searchKode.value)) || items[0];
    }

    if (!res || (Array.isArray(res) && res.length < 1)) {
      showSnackbar({
        text: "Data dosen tidak ditemukan",
        color: "error",
      });
      return;
    }

    dosen.value.id = res.id;
    dosen.value.kode = res.kode;
    dosen.value.nama = res.nama;
    dosen.value.prodi = prodiName(res);
    dosen.value.jenisKelamin = jenisKelaminLabel(res);
    dosen.value.jkId = res.jenis_kelamin;

    await lookupPengeluaranByTanggal(res.id);
  } catch (error) {
    showSnackbar({
      text: error,
      color: "error",
    });
  } finally {
    loadingData.value = false;
  }
};

const refSearch = ref(null);
const searchFocus = async () => {
  await nextTick();
  refSearch.value?.focus();
};

const selectAll = async () => {
  await nextTick();

  const input = refSearch.value?.$el?.querySelector("input");
  input?.select();
};

onMounted(() => {
  searchFocus();
  syncTanggalToForm();
});

defineExpose({
  dosen,
  tanggal,
  searching,
  searchFocus,
});
</script>

<template>
  <VCard class="mb-6" title="Pencarian Dosen :">
    <template #append>
      <MoreBtnAction :menu-list="menuList" />
    </template>

    <VCardText>
      <VRow>
        <VCol cols="12" md="4">
          <AppDateTimePicker
            v-model="tanggal"
            label="Tanggal"
            placeholder="Select date"
            :config="{
              altInput: true,
              altFormat: 'F j, Y',
              dateFormat: 'Y-m-d',
            }"
          />
        </VCol>

        <VCol cols="12" md="8">
          <VCombobox
            ref="refSearch"
            v-model="selectedDosen"
            v-model:search="search"
            :items="dataList"
            item-title="display"
            item-value="kode"
            label="NIY / Nama Dosen"
            clearable
            :loading="loadingSearch"
            autocomplete="off"
            @focus="selectAll"
            @click="selectAll"
          >
            <template #append-inner>
              <VProgressCircular
                v-if="loadingSearch"
                indeterminate
                size="16"
                width="2"
              />
            </template>

            <template #append>
              <VBtn
                :size="$vuetify.display.smAndDown ? 'small' : 'large'"
                :icon="$vuetify.display.smAndDown"
                @click="searching"
              >
                <VIcon icon="ri-search-line" />
                <span v-if="$vuetify.display.mdAndUp" class="ms-3">Search</span>
              </VBtn>
            </template>
          </VCombobox>
        </VCol>

        <VCol cols="12" md="6">
          <VTextField
            v-model="dosen.kode"
            label="NIY"
            placeholder="NIY"
            readonly
            :loading="loadingData"
          />
        </VCol>

        <VCol cols="12" md="6">
          <VTextField
            v-model="dosen.nama"
            label="Nama"
            placeholder="Nama"
            readonly
            :loading="loadingData"
          />
        </VCol>

        <VCol cols="12" md="6">
          <VTextField
            v-model="dosen.prodi"
            label="Prodi"
            placeholder="Prodi"
            readonly
            :loading="loadingData"
          />
        </VCol>

        <VCol cols="12" md="6">
          <VTextField
            v-model="dosen.jenisKelamin"
            label="Jenis Kelamin"
            placeholder="Jenis Kelamin"
            readonly
            :loading="loadingData"
          />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
