<script setup>
import DataPegawaiPengeluaranBulanan from "@/components/admin/pengeluaran/pegawai-bulanan/DataPegawaiPengeluaranBulanan.vue"
import FormPengeluaranPegawaiBulanan from "@/components/admin/pengeluaran/pegawai-bulanan/FormPengeluaranPegawaiBulanan.vue"
import InfoPengeluaranPegawaiBulanan from "@/components/admin/pengeluaran/pegawai-bulanan/InfoPengeluaranPegawaiBulanan.vue"
import { useRouter } from "vue-router"

const router = useRouter()
const refDataPegawai = ref(null)
const refInfo = ref(null)
const refForm = ref(null)

onMounted(() => {
  document.title = "Tambah Barokah Staff Bulanan - SIMKEU"
})
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      class="pb-0"
    >
      <VBtn
        variant="outlined"
        color="secondary"
        prepend-icon="ri-arrow-left-line"
        @click="router.push('/admin/pengeluaran/staff-bulanan')"
      >
        Kembali
      </VBtn>
    </VCol>

    <VCol cols="12">
      <DataPegawaiPengeluaranBulanan
        ref="refDataPegawai"
        tipe="staff"
        base-path="/admin/pengeluaran/staff-bulanan"
        :ref-info="refInfo"
        :ref-form="refForm"
      />
    </VCol>

    <VCol cols="12">
      <FormPengeluaranPegawaiBulanan
        ref="refForm"
        title="Barokah Staff Bulanan"
        pegawai-title="Staff"
        endpoint="/admin/pengeluaran/staff-bulanan"
        base-path="/admin/pengeluaran/staff-bulanan"
        :ref-data-pegawai="refDataPegawai"
        show-period
      />
    </VCol>

    <VCol cols="12">
      <InfoPengeluaranPegawaiBulanan
        ref="refInfo"
        :ref-data-pegawai="refDataPegawai"
        title="Barokah Staff Bulanan"
        endpoint="/admin/pengeluaran/staff-bulanan"
        base-path="/admin/pengeluaran/staff-bulanan"
      />
    </VCol>
  </VRow>
</template>
