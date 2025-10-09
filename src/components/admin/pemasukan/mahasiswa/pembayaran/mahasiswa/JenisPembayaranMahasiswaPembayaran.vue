<script setup>
import Combobox from '@/pages/forms/combobox.vue';
import { watch } from 'vue';

const props = defineProps({
  mahasiswa: {
    type: Object,
    required: true,
    default: () => ({
      nim: "",
      nama: "",
      prodi: "",
      jenisKelamin: "",
      angkatan: "",
      kelas: "",
      semester: "",
      deposit: 0,
      dipakai: 0,
      tagihan: [],
      jenisPembayaran: {}
    }),
  },
});

const jenisPembayaran = ref([]);
const selectedJenisPembayaran = ref();
const loadingJenisPembayaran = ref(false);

const fetchJenisPembayaran = async () => {
  try {
    loadingJenisPembayaran.value = true;
    jenisPembayaran.value = [];
    const res = await $api(`/admin/pemasukan/mahasiswa/jenis-pembayaran`, {
      method: "GET",
      body: {
        limit: 0
      }
    });

    jenisPembayaran.value = res.data.data.map((item) => ({
      ...item,
      display: `${item.nama} - ${item.kategori}`,
    }));
  } catch (error) {
    showSnackbar({
      text: error,
      color: "error",
    });
  } finally {
    loadingJenisPembayaran.value = false;
  }
};

watch(selectedJenisPembayaran, () => {
  props.mahasiswa.jenisPembayaran = selectedJenisPembayaran.value;
}, { deep: true });

onMounted(() => {
  fetchJenisPembayaran();
});
</script>

<template>

  <VCard class="mt-4" title="Metode Pembayaran">
    <VCardText>
      <VRow>
        <VCol cols="12">
          <VCombobox
            v-model="selectedJenisPembayaran"
            :items="jenisPembayaran"
            label="Metode Pembayaran"
            item-title="display"
            clearable
            :loading="loadingJenisPembayaran"
          />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
