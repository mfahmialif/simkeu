<script setup>
/* eslint-disable camelcase */
import { formatRupiah } from "@/composables/formatRupiah"
import { showSnackbar } from "@/composables/snackbar"

definePage({ meta: { navActiveLink: "admin-piutang" } })

const route = useRoute()
const router = useRouter()
const data = ref(null)
const loading = ref(true)
const saving = ref(false)
const bayarDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const selectedPiutang = ref(null)
const deleteData = ref({})
const paymentFormRef = ref(null)
const cicilanMode = ref("pisah")

const CICILAN_MODE_STORAGE_KEY = "simkeu.piutang.cicilanMode"

const normalizeCicilanMode = value => value === "gabung" ? "gabung" : "pisah"

const loadCicilanMode = () => {
  if (typeof window === "undefined") return

  cicilanMode.value = normalizeCicilanMode(window.localStorage.getItem(CICILAN_MODE_STORAGE_KEY))
}

const paymentForm = ref({
  tanggal: new Date().toISOString().slice(0, 10),
  nominal: null,
  keterangan: "",
})

const paymentNominalHint = computed(() => {
  const nominal = Number(paymentForm.value.nominal || 0)
  const sisa = Number(selectedPiutang.value?.sisa || 0)

  return `${formatRupiah(nominal)} - Sisa ${formatRupiah(sisa)}`
})

const allPembayaran = computed(() => (data.value?.piutang || []).flatMap(item =>
  (item.pembayaran || []).map(pembayaran => ({
    ...pembayaran,
    piutang_tanggal: item.tanggal,
    piutang_keterangan: item.keterangan,
  })),
))

const errorMessage = err => {
  const message = err?.data?.message || err?.message

  if (typeof message === "object") {
    return Object.values(message).flat().join("; ")
  }

  return message || "Terjadi kesalahan."
}

const fetchData = async () => {
  try {
    loading.value = true

    const response = await $api(`/admin/piutang/pegawai/${route.params.id}`, {
      method: "GET",
      body: {
        cicilan_mode: cicilanMode.value,
      },
    })

    data.value = response.data
  } catch (err) {
    showSnackbar({ color: "error", text: errorMessage(err) })
    router.replace("/admin/piutang")
  } finally {
    loading.value = false
  }
}

const statusColor = status => String(status).toLowerCase() === "lunas" ? "success" : "warning"
const paymentTypeLabel = jenis => jenis === "potong_gaji" ? "Potong Gaji" : "Bayar Langsung"
const paymentTypeColor = jenis => jenis === "potong_gaji" ? "warning" : "success"

const openBayarDialog = item => {
  selectedPiutang.value = item
  paymentForm.value = {
    tanggal: new Date().toISOString().slice(0, 10),
    nominal: Math.max(0, Number(item?.sisa || 0)),
    keterangan: "",
  }
  bayarDialogVisible.value = true
}

const submitPayment = async () => {
  const validation = await paymentFormRef.value?.validate()
  if (!validation?.valid || saving.value || !selectedPiutang.value?.id) return

  saving.value = true
  try {
    const response = await $api(`/admin/piutang/${selectedPiutang.value.id}/pembayaran`, {
      method: "POST",
      body: {
        tanggal: paymentForm.value.tanggal,
        nominal: Number(paymentForm.value.nominal || 0),
        keterangan: paymentForm.value.keterangan,
      },
    })

    showSnackbar({
      color: "success",
      text: response.message || "Pembayaran piutang berhasil disimpan.",
    })
    bayarDialogVisible.value = false
    selectedPiutang.value = null
    fetchData()
  } catch (err) {
    showSnackbar({ color: "error", text: errorMessage(err) })
  } finally {
    saving.value = false
  }
}

const showDeleteDialog = item => {
  deleteData.value = item
  deleteDialogVisible.value = true
}

const deleteSubmit = async () => {
  if (!deleteData.value?.id) return

  try {
    const response = await $api(`/admin/piutang/${deleteData.value.id}`, {
      method: "DELETE",
    })

    showSnackbar({ color: "success", text: response.message || "Piutang berhasil dihapus." })
    fetchData()
  } catch (err) {
    showSnackbar({ color: "error", text: errorMessage(err) })
  } finally {
    deleteDialogVisible.value = false
    deleteData.value = {}
  }
}

onMounted(() => {
  document.title = "Detail Piutang Pegawai - SIMKEU"
  loadCicilanMode()
  fetchData()
})
</script>

<template>
  <div>
    <VProgressLinear
      v-if="loading"
      indeterminate
      color="primary"
    />

    <template v-else-if="data">
      <div class="d-flex flex-wrap align-center justify-space-between gap-4 mb-6">
        <div>
          <h4 class="text-h4 font-weight-medium">
            Detail Piutang Pegawai
          </h4>
          <div class="text-body-1 text-medium-emphasis mt-1">
            {{ data.nama_pegawai || "-" }} - {{ data.kode_pegawai || "-" }}
          </div>
        </div>

        <div class="d-flex flex-wrap gap-3">
          <VBtn
            variant="outlined"
            color="secondary"
            prepend-icon="ri-arrow-left-line"
            @click="router.push('/admin/piutang')"
          >
            Kembali
          </VBtn>
          <VBtn
            color="primary"
            prepend-icon="ri-add-line"
            @click="router.push(`/admin/piutang/add?pegawai_id=${data.pegawai_id}`)"
          >
            Tambah Piutang
          </VBtn>
        </div>
      </div>

      <VRow class="mb-4">
        <VCol
          cols="12"
          md="3"
        >
          <VCard>
            <VCardText>
              <div class="text-body-2 text-medium-emphasis mb-1">
                Total Piutang
              </div>
              <div class="text-h5 font-weight-medium">
                {{ formatRupiah(data.nominal) }}
              </div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol
          cols="12"
          md="3"
        >
          <VCard>
            <VCardText>
              <div class="text-body-2 text-medium-emphasis mb-1">
                Total Terbayar
              </div>
              <div class="text-h5 font-weight-medium text-success">
                {{ formatRupiah(data.total_terbayar) }}
              </div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol
          cols="12"
          md="3"
        >
          <VCard>
            <VCardText>
              <div class="text-body-2 text-medium-emphasis mb-1">
                Sisa Piutang
              </div>
              <div class="text-h5 font-weight-medium text-warning">
                {{ formatRupiah(data.sisa) }}
              </div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol
          cols="12"
          md="3"
        >
          <VCard>
            <VCardText>
              <div class="text-body-2 text-medium-emphasis mb-1">
                Piutang Aktif
              </div>
              <div class="text-h5 font-weight-medium">
                {{ data.jumlah_aktif || 0 }}/{{ data.jumlah_piutang || 0 }}
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <VRow>
        <VCol
          cols="12"
          md="4"
        >
          <VCard title="Informasi Pegawai">
            <VCardText>
              <div class="info-list">
                <div>
                  <span>Pegawai</span>
                  <strong>{{ data.nama_pegawai || "-" }}</strong>
                </div>
                <div>
                  <span>Kode</span>
                  <strong>{{ data.kode_pegawai || "-" }}</strong>
                </div>
                <div>
                  <span>Tipe Pegawai</span>
                  <strong>{{ data.tipe_pegawai || "-" }}</strong>
                </div>
                <div>
                  <span>Periode Piutang</span>
                  <strong>{{ data.tanggal_awal || "-" }} - {{ data.tanggal_terakhir || "-" }}</strong>
                </div>
                <div>
                  <span>Total Default Cicilan Aktif</span>
                  <strong>{{ formatRupiah(data.default_cicilan) }}</strong>
                </div>
                <div>
                  <span>Mode Cicilan</span>
                  <strong>{{ cicilanMode === "gabung" ? "Gabung" : "Pisah" }}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <VChip
                    :color="statusColor(data.status)"
                    size="small"
                    label
                  >
                    {{ data.status }}
                  </VChip>
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>

        <VCol
          cols="12"
          md="8"
        >
          <VCard title="Daftar Piutang">
            <VDataTable
              :headers="[
                { title: 'Tanggal', key: 'tanggal' },
                { title: 'Nominal', key: 'nominal', align: 'end' },
                { title: 'Terbayar', key: 'total_terbayar', align: 'end' },
                { title: 'Sisa', key: 'sisa', align: 'end' },
                { title: 'Default Cicilan', key: 'default_cicilan', align: 'end' },
                { title: 'Status', key: 'status' },
                { title: 'Keterangan', key: 'keterangan' },
                { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
              ]"
              :items="data.piutang || []"
              density="comfortable"
            >
              <template #item.nominal="{ item }">
                {{ formatRupiah(item.nominal) }}
              </template>

              <template #item.total_terbayar="{ item }">
                {{ formatRupiah(item.total_terbayar) }}
              </template>

              <template #item.sisa="{ item }">
                <span :class="item.sisa > 0 ? 'text-warning font-weight-medium' : 'text-success font-weight-medium'">
                  {{ formatRupiah(item.sisa) }}
                </span>
              </template>

              <template #item.default_cicilan="{ item }">
                {{ formatRupiah(item.default_cicilan) }}
              </template>

              <template #item.status="{ item }">
                <VChip
                  :color="statusColor(item.status)"
                  size="small"
                  label
                >
                  {{ item.status }}
                </VChip>
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
                        prepend-icon="ri-money-dollar-circle-line"
                        :disabled="Number(item.sisa || 0) <= 0"
                        @click="openBayarDialog(item)"
                      >
                        Bayar
                      </VListItem>
                      <VListItem
                        prepend-icon="ri-edit-box-line"
                        @click="router.push(`/admin/piutang/edit/${item.id}`)"
                      >
                        Edit
                      </VListItem>
                      <VListItem
                        prepend-icon="ri-delete-bin-line"
                        @click="showDeleteDialog(item)"
                      >
                        Hapus
                      </VListItem>
                    </VList>
                  </VMenu>
                </IconBtn>
              </template>

              <template #bottom />
            </VDataTable>
          </VCard>
        </VCol>
      </VRow>

      <VCard
        title="Riwayat Pembayaran"
        class="mt-4"
      >
        <VDataTable
          :headers="[
            { title: 'Tanggal', key: 'tanggal' },
            { title: 'Piutang', key: 'piutang_tanggal' },
            { title: 'Jenis', key: 'jenis' },
            { title: 'Nominal', key: 'nominal', align: 'end' },
            { title: 'Keterangan', key: 'keterangan' },
            { title: 'Input Oleh', key: 'created_by_name' },
          ]"
          :items="allPembayaran"
          density="comfortable"
        >
          <template #item.piutang_tanggal="{ item }">
            <div class="font-weight-medium">
              {{ item.piutang_tanggal || "-" }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ item.piutang_keterangan || "-" }}
            </div>
          </template>

          <template #item.jenis="{ item }">
            <VChip
              :color="paymentTypeColor(item.jenis)"
              size="small"
              label
            >
              {{ paymentTypeLabel(item.jenis) }}
            </VChip>
          </template>

          <template #item.nominal="{ item }">
            {{ formatRupiah(item.nominal) }}
          </template>

          <template #item.keterangan="{ item }">
            {{ item.keterangan || "-" }}
          </template>

          <template #no-data>
            <div class="text-center pa-4">
              Belum ada pembayaran.
            </div>
          </template>
        </VDataTable>
      </VCard>
    </template>

    <VDialog
      v-model="bayarDialogVisible"
      width="560"
    >
      <VCard title="Bayar Piutang">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="bayarDialogVisible = false"
        />

        <VCardText>
          <div class="text-body-2 text-medium-emphasis mb-4">
            {{ selectedPiutang?.tanggal || "-" }} - Sisa {{ formatRupiah(selectedPiutang?.sisa || 0) }}
          </div>

          <VForm
            ref="paymentFormRef"
            @submit.prevent="submitPayment"
          >
            <VTextField
              v-model="paymentForm.tanggal"
              type="date"
              label="Tanggal"
              :rules="[requiredValidator]"
              class="mb-4"
            />
            <VTextField
              v-model="paymentForm.nominal"
              type="number"
              min="1"
              :max="selectedPiutang?.sisa || 0"
              label="Nominal"
              :hint="paymentNominalHint"
              persistent-hint
              :rules="[requiredValidator]"
              class="mb-4"
            />
            <VTextarea
              v-model="paymentForm.keterangan"
              label="Keterangan"
              rows="3"
              class="mb-4"
            />

            <div class="d-flex justify-end gap-4">
              <VBtn
                variant="outlined"
                color="secondary"
                @click="bayarDialogVisible = false"
              >
                Batal
              </VBtn>
              <VBtn
                type="submit"
                color="success"
                prepend-icon="ri-save-line"
                :loading="saving"
              >
                Simpan Pembayaran
              </VBtn>
            </div>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>

    <VDialog
      v-model="deleteDialogVisible"
      width="500"
    >
      <VCard title="Hapus Piutang">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="deleteDialogVisible = false"
        />

        <VCardText>
          Anda yakin ingin menghapus piutang tanggal {{ deleteData.tanggal || '-' }} sebesar {{ formatRupiah(deleteData.nominal || 0) }}?
        </VCardText>

        <VCardText class="d-flex justify-end gap-4">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="deleteDialogVisible = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="error"
            prepend-icon="ri-delete-bin-line"
            @click="deleteSubmit"
          >
            Hapus
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.info-list {
  display: grid;
  gap: 14px;
}

.info-list span {
  display: block;
  color: rgba(var(--v-theme-on-surface), 0.62);
  font-size: 0.8125rem;
}

.info-list strong {
  display: block;
  overflow-wrap: anywhere;
}
</style>
