<script setup>
import FormAbsensi from "@/components/admin/pengeluaran/absensi/FormAbsensi.vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const id = route.params.id

const dataForm = ref(null)
const isLoading = ref(true)

const returnPath = computed(() => {
  const value = Array.isArray(route.query.return_to)
    ? route.query.return_to[0]
    : route.query.return_to

  return typeof value === "string" && value.startsWith("/admin/pengeluaran/absensi")
    ? value
    : "/admin/pengeluaran/absensi"
})

const fetchDataForm = async () => {
  isLoading.value = true
  try {
    const { data } = await $api("/admin/pengeluaran/absensi/" + id, {
      method: "GET",
    })

    dataForm.value = data
  } catch (err) {
    console.log(err)
    if (err.status === 404) {
      router.replace("/not-found")
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  document.title = "Edit Barokah Absensi - SIMKEU"
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
      <FormAbsensi
        v-else
        :data-form="dataForm"
        type-form="edit"
        title="Barokah Absensi"
        pegawai-title="Pegawai"
        endpoint="/admin/pengeluaran/absensi"
        base-path="/admin/pengeluaran/absensi"
      />
    </VCol>
  </VRow>
</template>
