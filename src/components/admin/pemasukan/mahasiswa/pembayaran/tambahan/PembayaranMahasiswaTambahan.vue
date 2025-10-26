<script setup>
import { watch } from "vue";

const props = defineProps({
  mahasiswa: {
    type: Object,
    required: true,
    default: () => ({}),
  },
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

const rows = ref([]);

watch(
  () => props.dataForm,
  (newVal) => {
    if (props.typeForm === "edit" && newVal) {
      rows.value.push({
        id: newVal.id,
        display: `${newVal.tagihan}`,
        jumlah: newVal.jumlah ?? 0,
        dibayar: newVal.bayar ?? 0, // default isi penuh
      });
    }
  },
  { deep: true }
);

defineExpose({
  rows,
});
</script>

<template>
  <!-- Pembayaran -->
  <VCard class="mt-4" title="Pembayaran">
    <VCardText>
      <VRow v-for="(row, idx) in rows" :key="row.id" class="align-center">
        <VCol cols="12" md="4">
          <VTextField
            :model-value="row.display"
            label="Tagihan"
            variant="outlined"
            density="comfortable"
            hint="Tagihan yang dipilih"
            persistent-hint
          />
        </VCol>

        <VCol cols="12" md="4">
          <VTextField
            v-model.number="row.jumlah"
            label="Jumlah"
            type="number"
            min="0"
            variant="outlined"
            density="comfortable"
            :hint="formatRupiah(row.jumlah)"
            persistent-hint
          />
        </VCol>
        
        <VCol cols="12" md="4">
          <VTextField
            v-model.number="row.dibayar"
            label="Dibayar"
            type="number"
            min="0"
            variant="outlined"
            density="comfortable"
            :hint="formatRupiah(row.dibayar)"
            persistent-hint
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
