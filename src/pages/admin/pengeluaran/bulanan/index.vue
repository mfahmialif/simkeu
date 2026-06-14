<script setup>
import PegawaiBulananTable from "@/components/admin/pengeluaran/pegawai-bulanan/PegawaiBulananTable.vue"
</script>

<template>
  <PegawaiBulananTable
    title="Barokah Bulanan"
    endpoint="/admin/pengeluaran/bulanan"
    base-path="/admin/pengeluaran/bulanan"
  />
</template>
