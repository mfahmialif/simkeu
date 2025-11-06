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

const thAkademik = ref({
  start: new Date().getFullYear(),
  end: new Date().getFullYear() + 1,
  smt: "Ganjil",
});
const semesterList = ref([
  { value: "Ganjil", text: "Ganjil" },
  { value: "Genap", text: "Genap" },
]);
const tanggal = ref("");

defineExpose({ thAkademik, semesterList, tanggal });

onMounted(() => {
  tanggal.value = fDate(new Date());
});

watch(
  () => props.dataForm,
  (newVal) => {
    if (props.typeForm === "edit" && newVal) {
      const date = new Date(newVal.tanggal).toISOString().slice(0, 10);
      tanggal.value = date;
      const getTanggal = newVal.th_akademik.split("-");
      thAkademik.value = {
        start: getTanggal[0],
        end: getTanggal[1],
        smt: newVal.smt,
      };
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
        <VCol cols="12" md="4">
          <VTextField
            v-model="thAkademik.start"
            label="Tahun Akademik"
            placeholder="Tahun Akademik"
            type="number"
          />
        </VCol>
        <VCol cols="12" md="4">
          <VTextField
            v-model="thAkademik.end"
            label="Tahun Akademik"
            placeholder="Tahun Akademik"
            type="number"
          />
        </VCol>
        <VCol cols="12" md="4">
          <VSelect
            v-model="thAkademik.smt"
            :items="semesterList"
            item-title="text"
            item-value="value"
            label="Semester"
            placeholder="Semester"
          />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
