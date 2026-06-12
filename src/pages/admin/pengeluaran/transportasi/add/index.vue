<script setup>
import FormPengeluaranTransportasi from "@/components/admin/pengeluaran/transportasi/FormPengeluaranTransportasi.vue"

const route = useRoute()
const router = useRouter()

const queryValue = value => (Array.isArray(value) ? value[0] : value)

const queryRekapId = computed(() => queryValue(route.query.rekap_id) || null)

const returnPath = computed(() => {
  const path = queryValue(route.query.return_to)

  if (
    typeof path === "string"
    && path.startsWith("/admin/pengeluaran/transportasi")
  ) {
    return path
  }

  return "/admin/pengeluaran/transportasi"
})

onMounted(() => {
  document.title = "Tambah Pengeluaran Transportasi - SIMKEU"
})
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      class="pb-0"
    >
      <VBtn
        variant="outlined"
        color="secondary"
        prepend-icon="ri-arrow-left-line"
        @click="router.push(returnPath)"
      >
        Kembali
      </VBtn>
    </VCol>

    <VCol cols="12">
      <FormPengeluaranTransportasi
        :initial-rekap-id="queryRekapId"
        :lock-rekap="!!queryRekapId"
        :return-path="returnPath"
      />
    </VCol>
  </VRow>
</template>
