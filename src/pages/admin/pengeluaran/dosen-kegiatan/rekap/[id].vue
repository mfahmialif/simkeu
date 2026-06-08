<script setup>
import PengeluaranRekapDetail from "@/components/admin/pengeluaran/PengeluaranRekapDetail.vue";
</script>

<template>
  <PengeluaranRekapDetail
    title="Barokah Pegawai Kegiatan"
    endpoint="/admin/pengeluaran/dosen-kegiatan"
    base-path="/admin/pengeluaran/dosen-kegiatan"
    module-type="kegiatan"
  />
</template>
