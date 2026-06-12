<script setup>
import PengeluaranRekapDetail from "@/components/admin/pengeluaran/PengeluaranRekapDetail.vue"
</script>

<template>
  <PengeluaranRekapDetail
    title="Rumah Tangga"
    endpoint="/admin/pengeluaran/rumah-tangga"
    base-path="/admin/pengeluaran/rumah-tangga"
    module-type="rumah-tangga"
    allow-create
  />
</template>
