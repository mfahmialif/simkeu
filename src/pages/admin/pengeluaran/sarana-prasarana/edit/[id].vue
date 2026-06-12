<script setup>
import FormPengeluaranSaranaPrasarana from "@/components/admin/pengeluaran/sarana-prasarana/FormPengeluaranSaranaPrasarana.vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const id = route.params.id

const returnPath = computed(() => {
  const value = route.query.return_to
  const path = Array.isArray(value) ? value[0] : value

  if (
    typeof path === "string"
    && path.startsWith("/admin/pengeluaran/sarana-prasarana")
  ) {
    return path
  }

  return "/admin/pengeluaran/sarana-prasarana"
})

const dataForm = ref(null)
const isLoading = ref(false)

const fetchDataForm = async () => {
  isLoading.value = true
  try {
    const { data } = await $api("/admin/pengeluaran/sarana-prasarana/" + id, {
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
  document.title = "Edit Pengeluaran Sarana Prasarana - SIMKEU"
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
      <FormPengeluaranSaranaPrasarana
        v-else
        :data-form="dataForm"
        type-form="edit"
        :return-path="returnPath"
      />
    </VCol>
  </VRow>
</template>
