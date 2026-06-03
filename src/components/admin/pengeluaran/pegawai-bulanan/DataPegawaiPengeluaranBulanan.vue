<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  refInfo: {
    type: Object,
    default: () => ({}),
  },
  refForm: {
    type: Object,
    default: () => ({}),
  },
  tipe: {
    type: String,
    default: "staff",
    validator: value => ["dosen", "staff"].includes(value),
  },
  basePath: {
    type: String,
    required: true,
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
    clickHandler: () => router.push(props.basePath),
  },
];

const dataList = ref([]);
const tanggal = ref(fDate(new Date()));
const search = ref("");
const searchKode = ref("");
const selectedPegawai = ref("");
const loadingData = ref(false);
const loadingSearch = ref(false);

const emptyData = {
  id: "",
  kode: "",
  nama: "",
  unit: "",
  jenisKelamin: "",
};

const pegawai = ref({ ...emptyData });
let typingTimeout = null;

const tipeTitle = computed(() => props.tipe === "staff" ? "Staff" : "Dosen");
const identifierLabel = computed(() => props.tipe === "staff" ? "Kode Staff" : "NIY");
const searchLabel = computed(() => `${identifierLabel.value} / Nama ${tipeTitle.value}`);
const tipeLabel = item => item?.tipe === "staff" ? "Staff" : item?.tipe === "dosen" ? "Dosen" : "";
const unitName = item => item?.dosen?.prodi?.nama || item?.dosen?.prodi?.alias || item?.staff?.jabatan || "-";
const unitDescription = item => [tipeLabel(item), unitName(item)].filter(value => value && value !== "-").join(" - ") || "-";
const unitLabel = computed(() => props.tipe === "staff" ? "Jabatan" : "Prodi");
const jenisKelaminLabel = item => item?.jenis_kelamin === "L" ? "Laki-laki" : item?.jenis_kelamin === "P" ? "Perempuan" : item?.jenis_kelamin || "";

const syncToForm = () => {
  props.refForm?.setTanggal?.(tanggal.value);
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
          tipe: props.tipe,
          limit: 30,
          sort_key: "nama",
          sort_order: "asc",
        },
      });

      dataList.value = (res.data?.data || []).map((item) => ({
        ...item,
        display: `${item.kode} - ${item.nama} - ${unitDescription(item)}`,
      }));
    } catch (err) {
      showSnackbar({
        text: `Gagal mendapatkan list ${tipeTitle.value.toLowerCase()}`,
        color: "error",
      });
      dataList.value = [];
    } finally {
      loadingSearch.value = false;
    }
  }, 300);
});

watch(selectedPegawai, (newVal) => {
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
  syncToForm();
});

const searching = async () => {
  if (!searchKode.value) {
    showSnackbar({
      text: `${identifierLabel.value} harus diisi`,
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

    let res = selectedPegawai.value && typeof selectedPegawai.value === "object" && !Array.isArray(selectedPegawai.value)
      ? selectedPegawai.value
      : null;

    if (!res) {
      const response = await $api("/admin/pegawai", {
        method: "GET",
        body: {
          search: searchKode.value,
          tipe: props.tipe,
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
        text: `Data ${tipeTitle.value.toLowerCase()} tidak ditemukan`,
        color: "error",
      });
      return;
    }

    pegawai.value.id = res.id;
    pegawai.value.kode = res.kode;
    pegawai.value.nama = res.nama;
    pegawai.value.unit = unitDescription(res);
    pegawai.value.jenisKelamin = jenisKelaminLabel(res);
    syncToForm();
    props.refInfo?.fetchDataHistory?.(res.kode);
    props.refInfo?.fetchDataAbsensi?.(res.kode);
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
  syncToForm();
});

defineExpose({
  pegawai,
  tanggal,
  searching,
  searchFocus,
});
</script>

<template>
  <VCard class="mb-6" :title="`Pencarian ${tipeTitle} :`">
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
            v-model="selectedPegawai"
            v-model:search="search"
            :items="dataList"
            item-title="display"
            item-value="kode"
            :label="searchLabel"
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
            v-model="pegawai.kode"
            :label="identifierLabel"
            :placeholder="identifierLabel"
            readonly
            :loading="loadingData"
          />
        </VCol>

        <VCol cols="12" md="6">
          <VTextField
            v-model="pegawai.nama"
            label="Nama"
            placeholder="Nama"
            readonly
            :loading="loadingData"
          />
        </VCol>

        <VCol cols="12" md="6">
          <VTextField
            v-model="pegawai.unit"
            :label="unitLabel"
            :placeholder="unitLabel"
            readonly
            :loading="loadingData"
          />
        </VCol>

        <VCol cols="12" md="6">
          <VTextField
            v-model="pegawai.jenisKelamin"
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
