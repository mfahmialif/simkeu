<script setup>
const props = defineProps({
  typeForm: {
    type: String,
    required: false,
    default: null,
  },
  dataForm: {
    type: Object,
    required: false,
  },
})

const jenisPembayaran = ref([])
const selectedJenisPembayaran = ref()
const loadingJenisPembayaran = ref(false)

const getJenisPembayaranId = data => data?.jenis_pembayaran_detail?.jenis_pembayaran_id
  ?? data?.jenis_pembayaran_detail?.jenis_pembayaran?.id
  ?? null

const syncSelectedJenisPembayaran = data => {
  if (props.typeForm !== "edit" || !data) return

  const jenisPembayaranId = getJenisPembayaranId(data)

  selectedJenisPembayaran.value = jenisPembayaran.value.find(
    item => String(item.value) === String(jenisPembayaranId),
  ) ?? jenisPembayaranId
}

const fetchJenisPembayaran = async () => {
  try {
    loadingJenisPembayaran.value = true
    jenisPembayaran.value = []

    const res = await $api(`/admin/pemasukan/mahasiswa/jenis-pembayaran`, {
      method: "GET",
      body: {
        limit: 0,
        manual_only: 1,
      },
    })

    jenisPembayaran.value = res.data.data.map(item => ({
      display: `${item.nama} - ${item.kategori}`,
      value: item.id,
    }))

    syncSelectedJenisPembayaran(props.dataForm)
  } catch (error) {
    showSnackbar({
      text: error,
      color: "error",
    })
  } finally {
    loadingJenisPembayaran.value = false
  }
}

defineExpose({ selectedJenisPembayaran })

onMounted(() => {
  fetchJenisPembayaran()
})

watch(
  () => props.dataForm,
  newVal => {
    syncSelectedJenisPembayaran(newVal)
  },
)
</script>

<template>
  <VCard
    class="mt-4"
    title="Metode Pembayaran"
  >
    <VCardText>
      <VRow>
        <VCol cols="12">
          <VCombobox
            v-model="selectedJenisPembayaran"
            :items="jenisPembayaran"
            label="Metode Pembayaran"
            item-title="display"
            item-value="value"
            return-object
            clearable
            :loading="loadingJenisPembayaran"
          />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
