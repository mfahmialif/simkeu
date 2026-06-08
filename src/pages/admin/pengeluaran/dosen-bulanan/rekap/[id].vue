<script setup>
import PengeluaranRekapDetail from "@/components/admin/pengeluaran/PengeluaranRekapDetail.vue";
</script>

<template>
  <PengeluaranRekapDetail
    title="Barokah Dosen Bulanan"
    endpoint="/admin/pengeluaran/dosen-bulanan"
    base-path="/admin/pengeluaran/dosen-bulanan"
    module-type="bulanan"
  />
</template>
