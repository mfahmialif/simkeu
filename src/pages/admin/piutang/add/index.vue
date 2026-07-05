<script setup>
import FormPiutang from "@/components/admin/piutang/FormPiutang.vue"

definePage({
  meta: {
    navActiveLink: "admin-piutang",
    roles: ["admin", "pimpinan", "kabag_pengeluaran", "barokahdosen_bulanan"],
  },
})

onMounted(() => {
  document.title = "Tambah Piutang Pegawai - SIMKEU"
})
</script>

<template>
  <FormPiutang />
</template>
