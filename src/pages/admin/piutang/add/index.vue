<script setup>
import FormPiutang from "@/components/admin/piutang/FormPiutang.vue"

definePage({ meta: { navActiveLink: "admin-piutang" } })

onMounted(() => {
  document.title = "Tambah Piutang Pegawai - SIMKEU"
})
</script>

<template>
  <FormPiutang />
</template>
