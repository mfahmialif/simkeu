<script setup>
import { showSnackbar } from "@/composables/snackbar";

const props = defineProps({
  mahasiswa: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const form = ref({
  simpan: 0,
});

const editMode = ref(false);
const loadingSimpan = ref(false);
const loadingCurrent = ref(false);

const fetchDeposit = async () => {
  try {
    loadingCurrent.value = true;
    const res = await $api(
      `/admin/pemasukan/mahasiswa/catatan-deposit/nim/${props.mahasiswa.nim}`,
      { method: "GET" }
    );
    props.mahasiswa.deposit = res.jumlah;
    // Auto-set dipakai plafon = full balance (agar mode tagihan bisa pakai deposit)
    props.mahasiswa.dipakai = res.jumlah;
  } catch (error) {
    showSnackbar({ text: error, color: "error" });
  } finally {
    loadingCurrent.value = false;
  }
};

const clearDeposit = () => {
  props.mahasiswa.deposit = 0;
  props.mahasiswa.dipakai = 0;
  props.mahasiswa.autoSimpanDeposit = 0;
  form.value.simpan = 0;
  editMode.value = false;
};

/** Auto-fill simpan deposit dari kelebihan nominal pembayaran */
watch(
  () => props.mahasiswa?.autoSimpanDeposit,
  (val) => {
    form.value.simpan = Number(val) || 0;
  }
);

defineExpose({
  fetchDeposit,
  clearDeposit,
});

async function onSimpan() {
  if ((form.value.simpan ?? 0) <= 0) return;
  try {
    loadingSimpan.value = true;
    const res = await $api(`/admin/pemasukan/mahasiswa/catatan-deposit`, {
      method: "POST",
      body: {
        nim: props.mahasiswa.nim,
        jumlah: form.value.simpan,
      },
    });

    props.mahasiswa.deposit = Number(res.data.jumlah);
    props.mahasiswa.dipakai = Number(res.data.jumlah);
    form.value.simpan = 0;
    editMode.value = false;

    showSnackbar({ text: "Deposit berhasil disimpan.", color: "success" });
  } catch (error) {
    showSnackbar({ text: error, color: "error" });
  } finally {
    loadingSimpan.value = false;
  }
}
</script>

<template>
  <VCard title="Catatan Deposit">
    <VCardText>
      <!-- Saldo Deposit -->
      <div class="d-flex align-center justify-space-between mb-2">
        <span class="text-body-2 text-medium-emphasis">Saldo Deposit</span>
        <VChip
          :color="props.mahasiswa?.deposit > 0 ? 'success' : 'default'"
          variant="tonal"
          size="small"
          :loading="loadingCurrent"
        >
          {{ formatRupiah(props.mahasiswa?.deposit || 0) }}
        </VChip>
      </div>

      <!-- Info auto-simpan dari kelebihan -->
      <VAlert
        v-if="form.simpan > 0"
        type="info"
        variant="tonal"
        density="compact"
        class="mb-3"
      >
        Kelebihan pembayaran <strong>{{ formatRupiah(form.simpan) }}</strong> akan otomatis disimpan ke deposit saat pembayaran disimpan.
      </VAlert>

      <!-- Simpan Deposit (Admin only) -->
      <template v-if="isAdmin">
        <VBtn
          v-if="!editMode"
          variant="outlined"
          color="primary"
          size="small"
          block
          @click="editMode = true"
        >
          <VIcon icon="ri-add-line" class="me-1" />
          Tambah Deposit Manual
        </VBtn>

        <template v-if="editMode">
          <VTextField
            v-model.number="form.simpan"
            label="Jumlah Deposit (Rp)"
            type="number"
            min="0"
            variant="outlined"
            density="compact"
            :hint="formatRupiah(form.simpan)"
            persistent-hint
            class="mb-3"
          />
          <div class="d-flex gap-2">
            <VBtn
              color="primary"
              size="small"
              :loading="loadingSimpan"
              @click="onSimpan"
            >
              Simpan
            </VBtn>
            <VBtn
              variant="outlined"
              size="small"
              @click="editMode = false; form.simpan = 0"
            >
              Batal
            </VBtn>
          </div>
        </template>
      </template>
    </VCardText>
  </VCard>
</template>
