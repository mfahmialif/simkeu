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
});

const router = useRouter();

const menuList = [
  {
    title: "Kembali",
    value: "back",
    icon: "ri-arrow-left-line",
    clickHandler: () => router.back(),
  },
  // {
  //   value: 'hr', // untuk divider
  // },
  {
    title: "Lihat Data",
    value: "lihat-data",
    icon: "ri-eye-line",
    clickHandler: () => router.push("/admin/pengeluaran/dosen"),
  },
];

const dataList = ref([]);

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
      const res = await $api(`/admin/dosen/search/${newVal}`, {
        method: "GET",
      });
      // ubah hasil API jadi format { kode, nama, display: "nama - kode" }
      dataList.value = res.map((m) => ({
        ...m,
        display: `${m.kode} - ${m.nama} - ${m.nama_prodi}`,
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
  }, 300); // <-- debounce 300 mili detik
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

const searching = async () => {
  if (!searchKode.value) {
    showSnackbar({
      text: "Kode harus diisi",
      color: "error",
    });
    return;
  }

  try {
    loadingData.value = true;

    const res = await $api(`/admin/dosen/kode`, {
      method: "GET",
      body: {
        kode: searchKode.value,
      },
    });

    if (res.length < 1) {
      showSnackbar({
        text: "Data dosen tidak ditemukan",
        color: "error",
      });
      return;
    }

    (dosen.value.id = res.id), (dosen.value.kode = res.kode);
    dosen.value.nama = res.nama;
    dosen.value.prodi = res.prodi?.nama;
    dosen.value.jenisKelamin = res.jk?.nama;
    dosen.value.jkId = res.jk?.id;

    props.refInfo.fetchDataHistory(res.kode);
    props.refInfo.fetchDataJadwal();
    props.refInfo.fetchDataAbsensi();
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
const nimFocus = async () => {
  await nextTick();
  refSearch.value.focus();
};

const selectAll = async () => {
  // tunggu sampai elemen input benar-benar ter-render
  await nextTick();

  // akses input dalam VCombobox
  const input = refSearch.value?.$el?.querySelector("input");
  if (input) {
    input.select(); // ✨ menyorot seluruh teks di dalam field
  }
};

onMounted(async () => {
  nimFocus();
});

defineExpose({
  dosen,
  searching,
  nimFocus,
});
</script>

<template>
  <!-- 👉 Dosen -->
  <VCard class="mb-6" title="Pencarian Dosen :">
    <template #append>
      <MoreBtnAction :menu-list="menuList" />
    </template>
    <VCardText>
      <VRow>
        
        <VCol cols="12">
          <VCombobox
            ref="refSearch"
            v-model="selectedDosen"
            v-model:search="search"
            :items="dataList"
            item-title="display"
            item-value="kode"
            label="NIY"
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

            <!-- Append -->
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
          >
          </VTextField>
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="dosen.nama"
            label="Nama"
            placeholder="Nama"
            readonly
            :loading="loadingData"
          >
          </VTextField>
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="dosen.prodi"
            label="Prodi"
            placeholder="Prodi"
            readonly
            :loading="loadingData"
          >
          </VTextField>
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="dosen.jenisKelamin"
            label="Jenis Kelamin"
            placeholder="Jenis Kelamin"
            readonly
            :loading="loadingData"
          >
          </VTextField>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
