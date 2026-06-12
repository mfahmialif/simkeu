<script setup>
import FormPengeluaranRumahTangga from "@/components/admin/pengeluaran/rumah-tangga/FormPengeluaranRumahTangga.vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const id = route.params.id

const returnPath = computed(() => {
  const value = route.query.return_to
  const path = Array.isArray(value) ? value[0] : value

  if (
    typeof path === "string"
    && path.startsWith("/admin/pengeluaran/rumah-tangga")
  ) {
    return path
  }

  return "/admin/pengeluaran/rumah-tangga"
})

const dataForm = ref(null)
const isLoading = ref(false)

const fetchDataForm = async () => {
  isLoading.value = true
  try {
    const { data } = await $api("/admin/pengeluaran/rumah-tangga/" + id, {
      method: "GET",
    })

    dataForm.value = data
  } catch (err) {
    if (err.status === 404) router.replace("/not-found")
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  document.title = "Edit Pengeluaran Rumah Tangga - SIMKEU"
  fetchDataForm()
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
      <div
        v-if="isLoading"
        class="text-center"
      >
        <VProgressLinear indeterminate />
      </div>
      <FormPengeluaranRumahTangga
        v-else
        :data-form="dataForm"
        type-form="edit"
        :return-path="returnPath"
      />
    </VCol>
  </VRow>
</template>
