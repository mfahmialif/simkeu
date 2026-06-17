<script setup>
import PengeluaranRekapDetail from "@/components/admin/pengeluaran/PengeluaranRekapDetail.vue"
</script>

<template>
  <PengeluaranRekapDetail
    title="Transportasi"
    endpoint="/admin/pengeluaran/transportasi"
    base-path="/admin/pengeluaran/transportasi"
    module-type="transportasi"
    allow-create
    enable-excel-export
  />
</template>
