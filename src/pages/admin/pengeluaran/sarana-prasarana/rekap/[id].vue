<script setup>
import PengeluaranRekapDetail from "@/components/admin/pengeluaran/PengeluaranRekapDetail.vue"
</script>

<template>
  <PengeluaranRekapDetail
    title="Sarana Prasarana"
    endpoint="/admin/pengeluaran/sarana-prasarana"
    base-path="/admin/pengeluaran/sarana-prasarana"
    module-type="sarana-prasarana"
    allow-create
    enable-excel-export
  />
</template>
