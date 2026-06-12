<script setup>
import PegawaiBulananTable from "@/components/admin/pengeluaran/pegawai-bulanan/PegawaiBulananTable.vue"
</script>

<template>
  <PegawaiBulananTable
    title="Barokah Staff Bulanan"
    endpoint="/admin/pengeluaran/staff-bulanan"
    base-path="/admin/pengeluaran/staff-bulanan"
    show-period
  />
</template>
