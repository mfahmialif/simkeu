<script setup>
import PengeluaranRekapDetail from "@/components/admin/pengeluaran/PengeluaranRekapDetail.vue"
</script>

<template>
  <PengeluaranRekapDetail
    title="Umum"
    endpoint="/admin/pengeluaran/umum"
    base-path="/admin/pengeluaran/umum"
    module-type="umum"
    allow-create
    enable-excel-export
  />
</template>
