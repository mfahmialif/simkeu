<script setup>
import PengeluaranRekapDetail from "@/components/admin/pengeluaran/PengeluaranRekapDetail.vue"
</script>

<template>
  <PengeluaranRekapDetail
    title="Barokah Dosen Tatapmuka"
    endpoint="/admin/pengeluaran/dosen"
    base-path="/admin/pengeluaran/dosen-tatapmuka"
    module-type="tatapmuka"
    enable-excel-export
  />
</template>
