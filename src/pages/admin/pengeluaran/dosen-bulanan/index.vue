<script setup>
import PegawaiBulananTable from "@/components/admin/pengeluaran/pegawai-bulanan/PegawaiBulananTable.vue"
</script>

<template>
  <PegawaiBulananTable
    title="Barokah Dosen Bulanan"
    endpoint="/admin/pengeluaran/dosen-bulanan"
    base-path="/admin/pengeluaran/dosen-bulanan"
  />
</template>
