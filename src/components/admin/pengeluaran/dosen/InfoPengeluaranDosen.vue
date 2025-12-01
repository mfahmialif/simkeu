<script setup>
const props = defineProps({
  refDataDosen: {
    type: Object,
    default: () => ({}),
  },
});

import InfoAbsensiPengeluaranDosen from "./info/InfoAbsensiPengeluaranDosen.vue";
import InfoHistoryPengeluaranDosen from "./info/InfoHistoryPengeluaranDosen.vue";
import InfoJadwalPengeluaranDosen from "./info/InfoJadwalPengeluaranDosen.vue";

const currentTab = ref(0);
const refInfoHistory = ref(null);
const refInfoJadwal = ref(null);
const refInfoAbsensi = ref(null);

const fetchDataHistory = (kode) => {
  refInfoHistory.value?.fetchData(kode);
};

const fetchDataJadwal = () => {
  refInfoJadwal.value?.fetchData();
};

const fetchDataAbsensi = () => {
  refInfoAbsensi.value?.fetchData();
};

defineExpose({
  fetchDataHistory,
  fetchDataJadwal,
  fetchDataAbsensi
});
</script>

<template>
  <VTabs v-model="currentTab">
    <VTab>Catatan</VTab>
    <VTab>Jadwal</VTab>
    <VTab>Absensi</VTab>
  </VTabs>

  <VWindow v-model="currentTab" class="mt-5">
    <VWindowItem key="1">
      <InfoHistoryPengeluaranDosen
        ref="refInfoHistory"
        :refDataDosen="props.refDataDosen"
      />
    </VWindowItem>
    <VWindowItem key="2">
      <InfoJadwalPengeluaranDosen
        ref="refInfoJadwal"
        :refDataDosen="props.refDataDosen"
      />
    </VWindowItem>
    <VWindowItem key="3">
      <InfoAbsensiPengeluaranDosen
        ref="refInfoAbsensi"
        :refDataDosen="props.refDataDosen"
      />
    </VWindowItem>
  </VWindow>
</template>
