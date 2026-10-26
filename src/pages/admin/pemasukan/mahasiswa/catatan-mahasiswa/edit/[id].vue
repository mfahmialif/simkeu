<script setup>
import FormCatatanMahasiswa from "@/components/admin/catatan-mahasiswa/FormCatatanMahasiswa.vue"
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()

const id = route.params.id

const catatanData = ref(null)
const isLoading = ref(false)

const fetchCatatan = async () => {
  try {
    isLoading.value = true

    const response = await $api(`/admin/pemasukan/mahasiswa/catatan-mahasiswa/${id}`, {
      method: "GET",
    })

    catatanData.value = response?.data || response
  } catch (err) {
    console.error("Gagal mengambil data catatan:", err)
    if (err?.status === 404) {
      router.replace("/admin/pemasukan/mahasiswa/catatan-mahasiswa")
    }
  } finally {
    isLoading.value = false
  }
}

const menuList = [
  {
    title: "Kembali",
    value: "back",
    icon: "ri-arrow-left-line",
    clickHandler: () => router.back(),
  },
  {
    title: "Lihat Data",
    value: "lihat-data",
    icon: "ri-eye-line",
    clickHandler: () => router.push("/admin/pemasukan/mahasiswa/catatan-mahasiswa"),
  },
]

onMounted(() => {
  document.title = "Edit Catatan Mahasiswa - SIMKEU"
  fetchCatatan()
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Edit Catatan Mahasiswa">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <div
            v-if="isLoading"
            class="text-center pa-6"
          >
            <VProgressCircular
              indeterminate
              color="primary"
            />
          </div>
          <FormCatatanMahasiswa
            v-else-if="catatanData"
            type-form="edit"
            :data-form="catatanData"
            :url="`/admin/pemasukan/mahasiswa/catatan-mahasiswa/${id}`"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
