<script setup>
import DataDosenPengeluaranDosen from "@/components/admin/pengeluaran/dosen-tatapmuka/DataDosenPengeluaranDosen.vue"
import FormPengeluaranDosen from "@/components/admin/pengeluaran/dosen-tatapmuka/FormPengeluaranDosen.vue"
import InfoPengeluaranDosen from "@/components/admin/pengeluaran/dosen-tatapmuka/InfoPengeluaranDosen.vue"
import { useRouter } from "vue-router"

const router = useRouter()
const refDataDosen = ref(null)
const refInfo = ref(null)
const refForm = ref(null)

onMounted(() => {
  document.title = "Tambah Barokah Dosen Tatapmuka - SIMKEU"
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
        @click="router.push('/admin/pengeluaran/dosen-tatapmuka')"
      >
        Kembali
      </VBtn>
    </VCol>

    <VCol cols="12">
      <DataDosenPengeluaranDosen
        ref="refDataDosen"
        class="pb-3"
        :ref-info="refInfo"
        :ref-form="refForm"
      />
    </VCol>
    <VCol cols="12">
      <FormPengeluaranDosen
        ref="refForm"
        class="pb-3"
        :ref-data-dosen="refDataDosen"
      />
    </VCol>
    <VCol cols="12">
      <InfoPengeluaranDosen
        ref="refInfo"
        :ref-data-dosen="refDataDosen"
      />
    </VCol>
  </VRow>
</template>
