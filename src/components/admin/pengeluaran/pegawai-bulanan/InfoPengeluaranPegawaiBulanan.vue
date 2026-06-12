<script setup>
import InfoAbsensiPengeluaranPegawaiBulanan from "./info/InfoAbsensiPengeluaranPegawaiBulanan.vue"
import InfoHistoryPengeluaranPegawaiBulanan from "./info/InfoHistoryPengeluaranPegawaiBulanan.vue"

const props = defineProps({
  refDataPegawai: {
    type: Object,
    default: () => ({}),
  },
  endpoint: {
    type: String,
    required: true,
  },
  basePath: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})

const currentTab = ref(0)
const refInfoHistory = ref(null)
const refInfoAbsensi = ref(null)

const fetchDataHistory = kode => {
  refInfoHistory.value?.fetchData(kode)
}

const fetchDataAbsensi = kode => {
  refInfoAbsensi.value?.fetchData(kode)
}

defineExpose({
  fetchDataHistory,
  fetchDataAbsensi,
})
</script>

<template>
  <VTabs v-model="currentTab">
    <VTab>Riwayat</VTab>
    <VTab>Absensi Fingerprint</VTab>
  </VTabs>

  <VWindow
    v-model="currentTab"
    class="mt-5"
  >
    <VWindowItem key="riwayat">
      <InfoHistoryPengeluaranPegawaiBulanan
        ref="refInfoHistory"
        :ref-data-pegawai="props.refDataPegawai"
        :endpoint="endpoint"
        :base-path="basePath"
        :title="title"
      />
    </VWindowItem>

    <VWindowItem key="absensi">
      <InfoAbsensiPengeluaranPegawaiBulanan
        ref="refInfoAbsensi"
        :ref-data-pegawai="props.refDataPegawai"
      />
    </VWindowItem>
  </VWindow>
</template>
