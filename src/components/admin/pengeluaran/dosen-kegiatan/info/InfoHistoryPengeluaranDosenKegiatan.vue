<script setup>
const page = ref(1)
const itemsPerPage = ref(5)
const sortBy = ref({ key: "tanggal", order: "desc" })
const search = ref("")
const selectedRows = ref([])
const dataTable = ref([])
const totalItems = ref(0)
const loading = ref(false)
const currentPegawaiId = ref(null)

const noDataText = computed(() => currentPegawaiId.value
  ? "Tidak ada riwayat kegiatan."
  : "Pilih pegawai terlebih dahulu.")

const fetchData = async (pegawaiId = currentPegawaiId.value) => {
  currentPegawaiId.value = pegawaiId

  if (!currentPegawaiId.value) {
    dataTable.value = []
    totalItems.value = 0
    
    return
  }

  try {
    loading.value = true

    const { data } = await $api("/admin/pengeluaran/dosen-kegiatan", {
      method: "GET",
      body: {
        page: page.value,
        limit: itemsPerPage.value,
        sort_key: sortBy.value.key,
        sort_order: sortBy.value.order,
        search: search.value,
        pegawai_id: currentPegawaiId.value,
      },
    })

    dataTable.value = data.data
    totalItems.value = data.total
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const loadItems = ({ page: p, itemsPerPage: ipp, sortBy: sb }) => {
  page.value = p
  itemsPerPage.value = ipp
  if (sb.length) sortBy.value = sb[0]
  fetchData()
}

const isDialogDeleteVisible = ref(false)
const deleteData = ref({})

const showDialogDelete = (id, name) => {
  deleteData.value = {
    id,
    name,
  }
  isDialogDeleteVisible.value = true
}

const deleteDataSubmit = async id => {
  try {
    const response = await $api("/admin/pengeluaran/dosen-kegiatan/" + id, {
      method: "DELETE",
    })

    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: "success",
      })

      fetchData()
    } else {
      showSnackbar({
        text: response.message,
        color: "error",
      })
    }
  } catch (err) {
    const message = Array.isArray(err.data?.message)
      ? err.data.message.join("; ")
      : err.data?.message || "Terjadi kesalahan."

    showSnackbar({
      text: message,
      color: "error",
    })
  } finally {
    isDialogDeleteVisible.value = false
  }
}

defineExpose({
  fetchData,
})
</script>

<template>
  <div>
    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Riwayat Barokah Pegawai Kegiatan</VCardTitle>
      </VCardItem>

      <VDivider />

      <VCardText class="d-flex flex-wrap gap-4 w-100">
        <div class="d-flex align-center w-100">
          <VTextField
            v-model="search"
            placeholder="Search Data"
            density="compact"
            class="me-3"
          />
        </div>
      </VCardText>

      <VDataTableServer
        v-model:model-value="selectedRows"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :headers="[
          { title: 'No', key: 'id' },
          { title: 'Tanggal', key: 'tanggal' },
          { title: 'Transport', key: 'transport' },
          { title: 'Barokah', key: 'barokah' },
          { title: 'Total', key: 'total' },
          { title: 'Jenis Pembayaran', key: 'jenis_pembayaran' },
          { title: 'Bukti', key: 'bukti_transfer', sortable: false },
          { title: 'Keterangan', key: 'keterangan' },
          { title: 'Actions', key: 'actions', sortable: false },
        ]"
        :items="dataTable"
        :items-length="totalItems"
        :loading="loading"
        :search="search"
        item-value="id"
        @update:options="loadItems"
      >
        <template #no-data>
          <div class="text-center pa-4">
            {{ noDataText }}
          </div>
        </template>

        <template #item.id="{ index }">
          {{ itemsPerPage * (page - 1) + index + 1 }}
        </template>

        <template #item.tanggal="{ item }">
          {{ item.tanggal || "-" }}
        </template>

        <template #item.transport="{ item }">
          {{ formatRupiah(item.transport) }}
        </template>

        <template #item.barokah="{ item }">
          {{ formatRupiah(item.barokah) }}
        </template>

        <template #item.total="{ item }">
          {{ formatRupiah(item.total) }}
        </template>

        <template #item.jenis_pembayaran="{ item }">
          <VChip
            :color="item.jenis_pembayaran === 'Transfer' ? 'info' : 'success'"
            size="small"
            label
          >
            {{ item.jenis_pembayaran }}
          </VChip>
        </template>

        <template #item.bukti_transfer="{ item }">
          <VBtn
            v-if="item.bukti_transfer_url"
            icon
            size="small"
            variant="text"
            color="primary"
            :href="item.bukti_transfer_url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <VIcon icon="ri-file-paper-2-line" />
          </VBtn>
          <span v-else>-</span>
        </template>

        <template #item.keterangan="{ item }">
          {{ item.keterangan || "-" }}
        </template>

        <template #item.actions="{ item }">
          <IconBtn size="small">
            <VIcon icon="ri-more-2-fill" />

            <VMenu activator="parent">
              <VList>
                <VListItem
                  value="edit"
                  prepend-icon="ri-edit-box-line"
                  @click="
                    $router.push(`/admin/pengeluaran/dosen-kegiatan/edit/${item.id}`)
                  "
                >
                  Edit
                </VListItem>

                <VListItem
                  value="delete"
                  prepend-icon="ri-delete-bin-line"
                  @click="showDialogDelete(item.id, item.tanggal)"
                >
                  Delete
                </VListItem>
              </VList>
            </VMenu>
          </IconBtn>
        </template>
      </VDataTableServer>
    </VCard>

    <VDialog
      v-model="isDialogDeleteVisible"
      width="500"
    >
      <VCard :title="'Hapus Data: ' + deleteData.name">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogDeleteVisible = false"
        />

        <VCardText class="d-flex align-center">
          <VIcon
            icon="ri-alert-line"
            size="32"
            class="me-2"
          />
          <span>
            Anda yakin ingin menghapus data ini? Penghapusan data tidak dapat
            dibatalkan.
          </span>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="isDialogDeleteVisible = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="error"
            @click="deleteDataSubmit(deleteData.id)"
          >
            <VIcon
              icon="ri-delete-bin-line"
              class="me-1"
            />
            Hapus
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
