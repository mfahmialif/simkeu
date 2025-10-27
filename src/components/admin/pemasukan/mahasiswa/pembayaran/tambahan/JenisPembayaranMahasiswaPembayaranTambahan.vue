<script setup>
const props = defineProps({
  typeForm: {
    type: String,
    required: false,
    default: null,
  },
  dataForm: {
    type: Object,
    required: false,
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
        limit: 0,
      },
    });

    jenisPembayaran.value = res.data.data.map((item) => ({
      display: `${item.nama} - ${item.kategori}`,
      value: item.nama,
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

defineExpose({ selectedJenisPembayaran });

onMounted(async () => {
  await fetchJenisPembayaran();
  if (props.typeForm === 'edit') {
    selectedJenisPembayaran.value = jenisPembayaran.value.find(
      (item) => item.value === props.dataForm.jenis_pembayaran
    );
  }
});

// watch(
//   () => props.dataForm,
//   (newVal) => {
//     if (props.typeForm === "edit" && newVal) {
//       console.log(newVal);
//       selectedJenisPembayaran.value = newVal.jenis_pembayaran;
//     }
//   }
// );
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
