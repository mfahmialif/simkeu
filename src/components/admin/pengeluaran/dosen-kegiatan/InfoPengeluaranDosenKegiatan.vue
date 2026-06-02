<script setup>
import InfoHistoryPengeluaranDosenKegiatan from "./info/InfoHistoryPengeluaranDosenKegiatan.vue";

const refInfoHistory = ref(null);

const fetchDataHistory = pegawaiId => {
  refInfoHistory.value?.fetchData(pegawaiId);
};

defineExpose({
  fetchDataHistory,
});
</script>

<template>
  <InfoHistoryPengeluaranDosenKegiatan ref="refInfoHistory" />
</template>
