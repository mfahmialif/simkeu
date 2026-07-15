<script setup>
import PengeluaranRekapDetail from "@/components/admin/pengeluaran/PengeluaranRekapDetail.vue"
</script>

<template>
  <PengeluaranRekapDetail
    title="Barokah Absensi"
    endpoint="/admin/pengeluaran/absensi"
    base-path="/admin/pengeluaran/absensi"
    module-type="absensi"
    allow-create
    enable-excel-export
  />
</template>
