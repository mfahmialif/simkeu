<script setup>

const selectedProdi = ref();
const prodi = ref([]);

const page = ref(1)
const itemsPerPage = ref(5)
const sortBy = ref({ key: 'id', order: 'desc' })
const search = ref("");
const selectedRows = ref([])
const dataTable = ref([])
const totalItems = ref(0)
const loading = ref(true)
const initialLoading = ref(true)

const fetchUsers = async () => {
  try {
    const { data } = await $api('/admin/mahasiswa', {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        search: search.value,
        ...(selectedProdi.value && { prodi_id: selectedProdi.value }),
      },
    })

    dataTable.value = data.data
    totalItems.value = data.total
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
    if (initialLoading.value) initialLoading.value = false
  }
}

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb, search: s }) => {
  loading.value = true
  page.value = p
  itemsPerPage.value = ipp
  if (sb.length) sortBy.value = sb[0]
  fetchUsers()
}

const fetchProdi = async () => {
  try {
    const { data } = await $api('/admin/prodi', {
      method: "GET",
      body: {
        limit: 0
      }
    })

    prodi.value = data.data.map(prodi => {
      return {
        title: prodi.nama,
        value: prodi.id,
      }
    })
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  document.title = 'Data Mahasiswa - SIMKEU'
  fetchProdi()
})

watch(selectedRows, (newValue) => {
  newValue.forEach((row, index) => {
    console.log(`${index + 1}.`, row)
  })
}, { deep: true })

watch(selectedProdi, () => {
  fetchUsers()
})

</script>

<template>

  <div>

    <VRow class="mb-2">
      <!-- 👉 Select Prodi -->
      <VCol cols="12" sm="12">
        <VSelect v-model="selectedProdi" label="Select Prodi" placeholder="Select Prodi" :items="prodi" clearable
          clear-icon="ri-close-line" class="custom-bg-select" />
      </VCol>

    </VRow>

    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Data Mahasiswa</VCardTitle>
      </VCardItem>


      <VDivider />

      <VCardText class="d-flex flex-wrap gap-4">
        <div class="d-flex align-center w-100 w-sm-auto">
          <!-- 👉 Search  -->
          <VTextField v-model="search" placeholder="Search Data" style="inline-size: 200px;" density="compact"
            class="me-3" />
        </div>

        <VSpacer />

        <div class="d-flex gap-x-4 align-center">
          <!-- 👉 Export button -->
          <VBtn variant="outlined" color="secondary" prepend-icon="ri-upload-2-line">
            Export
          </VBtn>

          <VBtn color="primary" prepend-icon="ri-add-line" @click="$router.push('/admin/user/add')">
            Add Data
          </VBtn>
        </div>
      </VCardText>

      <!-- 👉 Datatable  -->
      <VDataTableServer :headers="[
        { title: 'No', key: 'id' },
        { title: 'NIM', key: 'nim' },
        { title: 'Nama', key: 'nama' },
        { title: 'Prodi', key: 'nama_prodi' },
        { title: 'Jenis Kelamin', key: 'jk_nama' },
        { title: 'Status', key: 'status_id' },
      ]" v-model:model-value="selectedRows" v-model:items-per-page="itemsPerPage" v-model:page="page"
        :items="dataTable" :items-length="totalItems" :loading="loading" :search="search" item-value="id"
        @update:options="loadItems">
        <template v-if="initialLoading" #loading>
          <div class="text-center pa-4">
            <VProgressCircular indeterminate color="primary" class="mb-2" />
            <div>Memuat data pengguna...</div>
          </div>
        </template>

        <template v-else #no-data>
          <div class="text-center pa-4">Tidak ada data pengguna.</div>
        </template>

        <template #item.id="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </template>

        <template #item.status_id="{ item }">
          <VChip :color="item.status_id === 18 ? 'success' : 'error'" class="text-white" small>
            {{ item.status_id === 18 ? 'Active' : 'Inactive' }}
          </VChip>
        </template>


      </VDataTableServer>
    </VCard>

  </div>
</template>
