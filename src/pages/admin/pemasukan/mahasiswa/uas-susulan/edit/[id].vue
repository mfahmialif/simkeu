<script setup>
import FormUasSusulan from "@/components/admin/uas-susulan/FormUasSusulan.vue"
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()

const id = route.params.id

const data = ref({})
const isLoading = ref(true)

const fetchData = async () => {
  try {
    isLoading.value = true

    const response = await $api(
      "/admin/pemasukan/mahasiswa/uas-susulan/" + id,
      {
        method: "GET",
      },
    )

    data.value = response
  } catch (err) {
    console.error(err)
    if (err.status === 404) {
      router.replace("/not-found")
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
    title: "Lihat Detail",
    value: "detail",
    icon: "ri-file-list-3-line",
    clickHandler: () => router.push(`/admin/pemasukan/mahasiswa/uas-susulan/detail/${id}`),
  },
  {
    title: "Lihat Data",
    value: "lihat-data",
    icon: "ri-eye-line",
    clickHandler: () => router.push("/admin/pemasukan/mahasiswa/uas-susulan"),
  },
]

onMounted(() => {
  document.title = "Edit Data UAS Susulan - SIMKEU"
  fetchData()
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Edit Data UAS Susulan">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <div
            v-if="isLoading"
            class="text-center pa-4"
          >
            <VProgressLinear indeterminate />
          </div>
          <FormUasSusulan
            v-else
            type-form="edit"
            :data-form="data"
            :url="'/admin/pemasukan/mahasiswa/uas-susulan/full/' + id"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
