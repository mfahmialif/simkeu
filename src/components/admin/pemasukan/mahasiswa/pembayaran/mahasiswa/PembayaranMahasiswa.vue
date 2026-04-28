<script setup>
import { watch } from "vue";

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
});

/** ──── Payment Mode Toggle ──── */
const paymentMode = ref("nominal"); // 'nominal' | 'tagihan'
const nominalInput = ref(0);

const rows = ref([]);

watch(
  () => props.dataForm,
  (newVal) => {
    if (props.typeForm === "edit" && newVal) {
      rows.value.push({
        id: newVal.id,
        display: `${newVal.tagihan.nama}`,
        nominal: newVal.jumlah ?? 0,
        dibayar: newVal.jumlah ?? 0, // default isi penuh
      });

      // Pre-fill nominal input with current value
      nominalInput.value = newVal.jumlah ?? 0;
    }
  }
);

/** Mode nominal: sync input ke dibayar */
function applyNominal() {
  if (rows.value.length > 0) {
    const nominal = Number(nominalInput.value) || 0;
    rows.value[0].dibayar = Math.min(nominal, rows.value[0].nominal);
  }
}

/** Clear saat mode berubah — reset dibayar ke original */
watch(paymentMode, (mode) => {
  if (rows.value.length > 0) {
    if (mode === "tagihan") {
      // Reset ke nominal asli saat switch ke mode tagihan
      rows.value[0].dibayar = rows.value[0].nominal;
    }
    nominalInput.value = rows.value[0].dibayar;
  }
});

defineExpose({
  rows,
  paymentMode,
});
</script>

<template>
  <!-- Pembayaran -->
  <VCard class="mt-4" title="Pembayaran">
    <!-- Toggle Mode -->
    <VCardText class="pb-0">
      <VRow class="mb-4" dense>
        <VCol cols="6">
          <VBtn
            block
            :color="paymentMode === 'nominal' ? 'primary' : 'default'"
            :variant="paymentMode === 'nominal' ? 'elevated' : 'outlined'"
            @click="paymentMode = 'nominal'"
          >
            <VIcon icon="ri-money-dollar-circle-line" class="me-2" />
            Bayar Nominal
          </VBtn>
        </VCol>
        <VCol cols="6">
          <VBtn
            block
            :color="paymentMode === 'tagihan' ? 'primary' : 'default'"
            :variant="paymentMode === 'tagihan' ? 'elevated' : 'outlined'"
            @click="paymentMode = 'tagihan'"
          >
            <VIcon icon="ri-list-check-2" class="me-2" />
            Pilih Tagihan
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>

    <VCardText>
      <!-- ═══ MODE NOMINAL ═══ -->
      <template v-if="paymentMode === 'nominal'">
        <VRow class="align-center mb-4">
          <VCol cols="12" md="8">
            <VTextField
              v-model.number="nominalInput"
              label="Nominal Pembayaran (Rp)"
              type="number"
              min="0"
              variant="outlined"
              density="comfortable"
              :hint="formatRupiah(nominalInput)"
              persistent-hint
              placeholder="Masukkan nominal yang dibayarkan"
              @keyup.enter="applyNominal"
            />
          </VCol>
          <VCol cols="12" md="4">
            <VBtn
              color="primary"
              variant="elevated"
              class="w-100"
              :disabled="nominalInput <= 0"
              @click="applyNominal"
            >
              <VIcon icon="ri-arrow-right-line" class="me-2" />
              Terapkan
            </VBtn>
          </VCol>
        </VRow>
      </template>

      <!-- ═══ PREVIEW ROWS (Kedua mode) ═══ -->
      <VRow v-for="(row, idx) in rows" :key="row.id" class="align-center">
        <VCol cols="12" md="6">
          <VTextField
            :model-value="row.display"
            label="Tagihan"
            variant="outlined"
            density="comfortable"
            readonly
            hint="Tagihan yang dipilih"
            persistent-hint
          />
        </VCol>

        <VCol cols="12" md="6">
          <VTextField
            v-model.number="row.dibayar"
            label="Dibayar"
            type="number"
            min="0"
            variant="outlined"
            density="comfortable"
            :hint="formatRupiah(row.dibayar)"
            persistent-hint
            :readonly="paymentMode === 'nominal'"
          />
        </VCol>
      </VRow>

      <div
        v-if="rows.length === 0"
        class="text-medium-emphasis text-center py-6"
      >
        Belum ada tagihan yang dipilih.
      </div>
    </VCardText>
  </VCard>

</template>
