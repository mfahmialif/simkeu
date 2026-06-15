<script setup>
import PengeluaranRekapDetail from "@/components/admin/pengeluaran/PengeluaranRekapDetail.vue"
</script>

<template>
  <PengeluaranRekapDetail
    title="Barokah Bulanan"
    endpoint="/admin/pengeluaran/bulanan"
    base-path="/admin/pengeluaran/bulanan"
    module-type="dosen-bulanan"
    allow-create
    enable-excel-export
  />
</template>
