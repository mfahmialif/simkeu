<script setup>
const thAkademik = ref([]);
const selectedThAkademik = ref();
const loadingThAkademik = ref(false);

const tanggal = ref("");

const fetchThAkademik = async () => {
  try {
    loadingThAkademik.value = true;
    const { data } = await $api("/admin/th-akademik", {
      method: "GET",
      body: {
        aktif: "Y",
      },
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

defineExpose({selectedThAkademik});

onMounted(() => {
  fetchThAkademik();
  tanggal.value = new Date().toISOString().split("T")[0];
});
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
