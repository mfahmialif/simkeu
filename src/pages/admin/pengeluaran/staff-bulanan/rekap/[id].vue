<script setup>
import PengeluaranRekapDetail from "@/components/admin/pengeluaran/PengeluaranRekapDetail.vue"
</script>

<template>
  <PengeluaranRekapDetail
    title="Barokah Staff Bulanan"
    endpoint="/admin/pengeluaran/staff-bulanan"
    base-path="/admin/pengeluaran/staff-bulanan"
    module-type="bulanan"
  />
</template>
