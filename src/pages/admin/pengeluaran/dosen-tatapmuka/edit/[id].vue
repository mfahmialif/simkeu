<script setup>
import FormPengeluaranDosen from "@/components/admin/pengeluaran/dosen-tatapmuka/FormPengeluaranDosen.vue"
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()

const id = route.params.id

const dataForm = ref(null)

const fetchDataForm = async () => {
  isLoading.value = true
  try {
    const { data } = await $api(`/admin/pengeluaran/dosen/` + id, {
      method: "GET",
    })

    dataForm.value = data

    // console.log(dataForm.value);
  } catch (err) {
    console.log(err)
    if (err.status === 404) {
      router.replace("/not-found")
    }
  } finally {
    isLoading.value = false
  }
}

const isLoading = ref(false)

onMounted(() => {
  document.title = "Edit Barokah Dosen Tatapmuka - SIMKEU"
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
        @click="router.push('/admin/pengeluaran/dosen-tatapmuka')"
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
      <FormPengeluaranDosen
        v-else
        ref="refForm"
        class="pb-3"
        :data-form="dataForm"
        type-form="edit"
      />
    </VCol>
  </VRow>
</template>
