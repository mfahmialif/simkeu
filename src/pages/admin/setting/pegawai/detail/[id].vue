<script setup>
import FormPegawai from "@/components/admin/pegawai/FormPegawai.vue"

const router = useRouter()
const route = useRoute()

const id = route.params.id
const pegawai = ref({})
const isLoading = ref(false)

const userData = useCookie("userData").value ?? {}

const isAdmin = computed(
  () => String(userData.role?.name || "").toLowerCase() === "admin",
)

const fetchPegawai = async () => {
  try {
    isLoading.value = true

    const response = await $api("/admin/pegawai/" + id, {
      method: "GET",
    })

    pegawai.value = response.data
  } catch (err) {
    console.error(err)
    if (err.status === 404) {
      router.replace("/not-found")
    }
  } finally {
    isLoading.value = false
  }
}

const menuList = computed(() => [
  {
    title: "Kembali",
    value: "back",
    icon: "ri-arrow-left-line",
    clickHandler: () => router.back(),
  },
  ...(isAdmin.value
    ? [
      {
        title: "Edit",
        value: "edit",
        icon: "ri-edit-box-line",
        clickHandler: () => router.push(`/admin/setting/pegawai/edit/${id}`),
      },
    ]
    : []),
  {
    title: "Lihat Data",
    value: "lihat-data",
    icon: "ri-list-check",
    clickHandler: () => router.push("/admin/pegawai"),
  },
])

onMounted(() => {
  document.title = "Pegawai Detail - SIMKEU"

  fetchPegawai()
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Detail Pegawai">
        <template #append>
          <MoreBtnAction :menu-list="menuList" />
        </template>

        <VCardText>
          <div
            v-if="isLoading"
            class="text-center"
          >
            <VProgressLinear indeterminate />
          </div>
          <FormPegawai
            v-else
            type-form="edit"
            :data-form="pegawai"
            :url="'/admin/pegawai/' + id"
            :read-only="true"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
