<script setup>
import PengeluaranLampiranInput from "@/components/admin/pengeluaran/PengeluaranLampiranInput.vue"
import PengeluaranRekapSelect from "@/components/admin/pengeluaran/PengeluaranRekapSelect.vue"
import { formatRupiah } from "@/composables/formatRupiah"
import { showSnackbar } from "@/composables/snackbar"
import { appendLampiranFormData } from "@/utils/lampiran"

const props = defineProps({
  endpoint: {
    type: String,
    required: true,
  },
  basePath: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const refForm = ref(null)
const rekapId = ref(null)
const tanggal = ref(fDate(new Date()))
const jenisPembayaran = ref("CUS BSI")
const lampiran = ref([])
const search = ref("")
const rows = ref([])
const loading = ref(false)
const saving = ref(false)

const jenisPembayaranList = ["CUS BSI", "Transfer"]
const normalizedSearch = computed(() => search.value.trim().toLowerCase())

const filteredRows = computed(() => {
  if (!normalizedSearch.value) return rows.value

  return rows.value.filter(item => [
    item.kode,
    item.nama,
    item.prodi,
    item.status,
  ].some(value => String(value || "").toLowerCase().includes(normalizedSearch.value)))
})

const totalDosen = computed(() => rows.value.filter(item =>
  Number(item.barokah_dosen_tetap || 0) > 0
  || Number(item.barokah_struktural || 0) > 0,
).length)

const totalBarokah = computed(() => rows.value.reduce((total, item) =>
  total
  + Number(item.barokah_dosen_tetap || 0)
  + Number(item.barokah_struktural || 0), 0,
))

const errorMessage = err => {
  const message =
    err?.data?.message
    || err?.response?._data?.message
    || err?.response?.data?.message
    || err?.message

  if (typeof message === "object") {
    return Object.values(message).flat().join("; ")
  }

  return message || "Terjadi kesalahan."
}

const fetchRows = async () => {
  if (!rekapId.value) {
    rows.value = []
    
    return
  }

  try {
    loading.value = true

    const response = await $api(`${props.endpoint}/form-data`, {
      method: "GET",
      body: {
        rekap_id: rekapId.value,
      },
    })

    rows.value = (response.data || []).map(item => ({
      ...item,
      barokah_dosen_tetap: Number(item.barokah_dosen_tetap || 0),
      barokah_struktural: Number(item.barokah_struktural || 0),
    }))
  } catch (err) {
    rows.value = []
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  const validation = await refForm.value?.validate()
  if (!validation?.valid || saving.value) return

  try {
    saving.value = true

    const formData = new FormData()

    formData.append("rekap_id", rekapId.value)
    formData.append("tanggal", tanggal.value)
    formData.append("jenis_pembayaran", jenisPembayaran.value)
    rows.value.forEach((item, index) => {
      formData.append(`items[${index}][pegawai_id]`, item.pegawai_id)
      formData.append(
        `items[${index}][barokah_dosen_tetap]`,
        Number(item.barokah_dosen_tetap || 0),
      )
      formData.append(
        `items[${index}][barokah_struktural]`,
        Number(item.barokah_struktural || 0),
      )
    })
    appendLampiranFormData(formData, lampiran.value)

    const response = await $api(`${props.endpoint}/batch-store`, {
      method: "POST",
      body: formData,
    })

    showSnackbar({
      text: response.message,
      color: "success",
    })
    router.push(props.basePath)
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    })
  } finally {
    saving.value = false
  }
}

watch(rekapId, () => {
  search.value = ""
  fetchRows()
})
</script>

<template>
  <VForm
    ref="refForm"
    @submit.prevent="onSubmit"
  >
    <VCard class="mb-6">
      <VCardItem>
        <VCardTitle>Tambah Barokah Dosen Bulanan</VCardTitle>
      </VCardItem>

      <VDivider />

      <VCardText>
        <VRow>
          <VCol cols="12">
            <PengeluaranRekapSelect
              v-model="rekapId"
              :endpoint="endpoint"
              label="Rekap Tujuan *"
              :rules="[requiredValidator]"
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <AppDateTimePicker
              v-model="tanggal"
              label="Tanggal *"
              :rules="[requiredValidator]"
              :config="{
                altInput: true,
                altFormat: 'F j, Y',
                dateFormat: 'Y-m-d',
              }"
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <VSelect
              v-model="jenisPembayaran"
              label="Jenis Pembayaran *"
              :items="jenisPembayaranList"
              :rules="[requiredValidator]"
            />
          </VCol>

          <VCol cols="12">
            <PengeluaranLampiranInput v-model="lampiran" />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VCard>
      <VCardItem>
        <div class="d-flex flex-wrap align-center gap-3">
          <div>
            <VCardTitle>Daftar Dosen</VCardTitle>
            <VCardSubtitle v-if="rekapId">
              {{ totalDosen }} dosen diisi, total {{ formatRupiah(totalBarokah) }}
            </VCardSubtitle>
          </div>

          <VSpacer />

          <VTextField
            v-if="rekapId"
            v-model="search"
            prepend-inner-icon="ri-search-line"
            placeholder="Cari NIY, nama, atau prodi"
            clearable
            hide-details
            class="dosen-search"
          />
        </div>
      </VCardItem>

      <VDivider />

      <div
        v-if="!rekapId"
        class="empty-state"
      >
        <VIcon
          icon="ri-folder-open-line"
          size="36"
        />
        <span>Pilih rekap tujuan untuk menampilkan semua dosen.</span>
      </div>

      <div
        v-else-if="loading"
        class="empty-state"
      >
        <VProgressCircular
          indeterminate
          color="primary"
        />
        <span>Memuat daftar dosen...</span>
      </div>

      <div
        v-else
        class="dosen-list"
      >
        <div class="dosen-list-header">
          <span>Dosen</span>
          <span>Dosen Tetap</span>
          <span>Struktural</span>
          <span>Total</span>
        </div>

        <div
          v-for="item in filteredRows"
          :key="item.pegawai_id"
          class="dosen-row"
        >
          <div class="dosen-identity">
            <div class="font-weight-medium">
              {{ item.nama }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ item.kode || "-" }}<span v-if="item.prodi"> · {{ item.prodi }}</span>
            </div>
            <VChip
              v-if="item.status && item.status !== 'aktif'"
              color="warning"
              size="x-small"
              label
              class="mt-1"
            >
              {{ item.status }}
            </VChip>
          </div>

          <VTextField
            v-model.number="item.barokah_dosen_tetap"
            type="number"
            min="0"
            label="Dosen Tetap"
            :hint="formatRupiah(item.barokah_dosen_tetap)"
            persistent-hint
          />

          <VTextField
            v-model.number="item.barokah_struktural"
            type="number"
            min="0"
            label="Struktural"
            :hint="formatRupiah(item.barokah_struktural)"
            persistent-hint
          />

          <div class="dosen-total">
            <span class="text-caption text-medium-emphasis">Total</span>
            <strong>
              {{ formatRupiah(Number(item.barokah_dosen_tetap || 0) + Number(item.barokah_struktural || 0)) }}
            </strong>
          </div>
        </div>

        <div
          v-if="filteredRows.length === 0"
          class="empty-state"
        >
          <VIcon
            icon="ri-search-line"
            size="32"
          />
          <span>Dosen tidak ditemukan.</span>
        </div>
      </div>

      <VDivider v-if="rekapId && !loading" />

      <VCardActions
        v-if="rekapId && !loading"
        class="pa-5"
      >
        <VBtn
          variant="outlined"
          color="secondary"
          prepend-icon="ri-arrow-left-line"
          @click="router.push(basePath)"
        >
          Batal
        </VBtn>
        <VSpacer />
        <VBtn
          type="submit"
          color="primary"
          prepend-icon="ri-save-line"
          :loading="saving"
          :disabled="saving || rows.length === 0"
        >
          Simpan {{ totalDosen }} Dosen
        </VBtn>
      </VCardActions>
    </VCard>
  </VForm>
</template>

<style scoped>
.dosen-search {
  max-inline-size: 420px;
  min-inline-size: min(100%, 280px);
}

.dosen-list-header,
.dosen-row {
  display: grid;
  grid-template-columns: minmax(240px, 1.35fr) minmax(190px, 1fr) minmax(190px, 1fr) minmax(150px, 0.75fr);
  gap: 16px;
  align-items: center;
}

.dosen-list-header {
  padding: 12px 24px;
  background: rgba(var(--v-theme-on-surface), 0.04);
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-size: 0.8125rem;
  font-weight: 600;
}

.dosen-row {
  min-block-size: 104px;
  padding: 16px 24px;
  border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.dosen-row:last-child {
  border-block-end: 0;
}

.dosen-identity {
  min-inline-size: 0;
}

.dosen-total {
  display: flex;
  min-block-size: 56px;
  flex-direction: column;
  justify-content: center;
}

.dosen-total strong {
  overflow-wrap: anywhere;
}

.empty-state {
  display: flex;
  min-block-size: 180px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

@media (max-width: 959px) {
  .dosen-list-header {
    display: none;
  }

  .dosen-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dosen-identity,
  .dosen-total {
    grid-column: 1 / -1;
  }
}

@media (max-width: 599px) {
  .dosen-search {
    max-inline-size: none;
    inline-size: 100%;
  }

  .dosen-row {
    grid-template-columns: minmax(0, 1fr);
    padding: 16px;
  }

  .dosen-identity,
  .dosen-total {
    grid-column: auto;
  }
}
</style>
