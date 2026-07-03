<script setup>
import FormPiutang from "@/components/admin/piutang/FormPiutang.vue"
import { showSnackbar } from "@/composables/snackbar"

definePage({ meta: { navActiveLink: "admin-piutang" } })

const route = useRoute()
const router = useRouter()
const dataForm = ref({})
const loading = ref(true)

const errorMessage = err => {
  const message = err?.data?.message || err?.message

  if (typeof message === "object") {
    return Object.values(message).flat().join("; ")
  }

  return message || "Gagal memuat data piutang."
}

const fetchData = async () => {
  try {
    loading.value = true

    const response = await $api(`/admin/piutang/${route.params.id}`, {
      method: "GET",
    })

    dataForm.value = response.data || {}
  } catch (err) {
    showSnackbar({ color: "error", text: errorMessage(err) })
    router.replace("/admin/piutang")
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  document.title = "Edit Piutang Pegawai - SIMKEU"
  fetchData()
})
</script>

<template>
  <div>
    <VProgressLinear
      v-if="loading"
      indeterminate
      color="primary"
    />
    <FormPiutang
      v-else
      type-form="edit"
      :data-form="dataForm"
    />
  </div>
</template>
