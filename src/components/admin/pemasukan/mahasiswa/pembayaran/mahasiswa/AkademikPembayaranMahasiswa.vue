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

const thAkademik = ref([]);
const selectedThAkademik = ref();
const loadingThAkademik = ref(false);

const tanggal = ref("");

const fetchThAkademik = async () => {
  try {
    loadingThAkademik.value = true;
    const { data } = await $api("/admin/th-akademik", {
      method: "GET",
      body: props.typeForm !== "edit" ? { aktif: "y" } : {},
    });

    thAkademik.value = data.data.map((thAkademik) => {
      return {
        title: `${thAkademik.nama} - ${thAkademik.semester}`,
        value: thAkademik.id,
      };
    });

    selectedThAkademik.value = thAkademik.value[0];
  } catch (err) {
    console.error(err);
  } finally {
    loadingThAkademik.value = false;
  }
};

defineExpose({ selectedThAkademik, tanggal });

onMounted(() => {
  fetchThAkademik();
  tanggal.value = new Date().toISOString().split("T")[0];
});

watch(
  () => props.dataForm,
  (newVal) => {
    if (props.typeForm === "edit" && newVal) {
      const date = new Date(newVal.tanggal).toISOString().slice(0, 10);
      tanggal.value = date;
      selectedThAkademik.value = thAkademik.value.find(
        (item) => item.value === newVal.th_akademik_id
      );
    }
  },
);
</script>

<template>
  <!-- 👉 Akademik -->
  <VCard title="Akademik" class="mb-6">
    <VCardText>
      <VRow>
        <VCol cols="12">
          <VTextField
            v-model="tanggal"
            label="Tanggal"
            placeholder="Tanggal"
            type="date"
          />
        </VCol>
        <VCol cols="12">
          <VCombobox
            v-model="selectedThAkademik"
            :items="thAkademik"
            label="Tahun Akademik"
            clearable
          >
            <template #append-inner>
              <VProgressCircular
                v-if="loadingThAkademik"
                indeterminate
                size="16"
                width="2"
              />
            </template>
          </VCombobox>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
