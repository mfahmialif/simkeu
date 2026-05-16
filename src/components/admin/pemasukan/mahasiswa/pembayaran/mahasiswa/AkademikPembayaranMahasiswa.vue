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
const tanggalReadonly = ref(false);

const selectThAkademikFromDataForm = () => {
  if (props.typeForm !== "edit" || !props.dataForm?.th_akademik_id) return;

  const selectedId = Number(props.dataForm.th_akademik_id);

  selectedThAkademik.value = thAkademik.value.find(
    (item) => Number(item.value) === selectedId
  );
};

const fetchThAkademik = async () => {
  try {
    loadingThAkademik.value = true;
    const { data } = await $api("/admin/th-akademik", {
      method: "GET",
      params:
        props.typeForm !== "edit"
          ? { aktif: "y", limit: 0 }
          : { limit: 0 },
    });

    thAkademik.value = data.data.map((thAkademik) => {
      return {
        title: `${thAkademik.nama} - ${thAkademik.semester}`,
        value: thAkademik.id,
      };
    });

    if (props.typeForm === "edit") {
      selectThAkademikFromDataForm();
    } else {
      selectedThAkademik.value = thAkademik.value[0];
    }
  } catch (err) {
    console.error(err);
  } finally {
    loadingThAkademik.value = false;
  }
};

defineExpose({ selectedThAkademik, tanggal });

onMounted(() => {
  fetchThAkademik();
  tanggal.value = fDate(new Date());
});

watch(
  () => props.dataForm,
  (newVal) => {
    if (props.typeForm === "edit" && newVal) {
      const d = new Date(newVal.tanggal);

      // paksa ke GMT+7
      d.setHours(d.getHours() + 7);

      tanggal.value = d.toISOString().slice(0, 10);

      selectedThAkademik.value = thAkademik.value.find(
        (item) => Number(item.value) === Number(newVal.th_akademik_id)
      );

      tanggalReadonly.value = false;
    }
  }
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
            :readonly="tanggalReadonly"
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
