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

const rows = ref([
  {
    id: 1,
    display: "Tagihan 1",
    dibayar: 0,
    jumlah: 0,
  },
]);

/** Hapus baris */
function removeRow(id) {
  rows.value = rows.value.filter((r) => r.id !== id);
}

/** Tambah baris */
function addRow() {
  rows.value.push({
    id: rows.value.length + 1,
    display: "Tagihan " + (rows.value.length + 1),
    dibayar: 0,
    jumlah: 0,
  });
}


watch(
  rows,
  () => {
    props.mahasiswa.tagihan = rows;
  },
  { deep: true }
);


const handleJumlahChange = (idx, field) => {
  const row = rows.value[idx];
  if (!row) return;

  if (field === "jumlah") {
    row.dibayar = row.jumlah; // jika jumlah berubah → update dibayar
  } else if (field === "dibayar") {
    row.jumlah = row.dibayar; // jika dibayar berubah → update jumlah
  }
};



</script>

<template>
  <!-- Pembayaran -->
  <VCard class="mt-4" title="Pembayaran">
    <VCardText>
      <VRow v-for="(row, idx) in rows" :key="row.id" class="align-center">
        <VCol cols="12" md="6">
          <VTextField
            v-model="row.display"
            label="Tagihan"
            variant="outlined"
            density="comfortable"
            hint="Silahkan isi nama tagihannya"
            persistent-hint
          />
        </VCol>

        <VCol cols="12" md="2">
          <VTextField
            v-model.number="row.jumlah"
            label="Jumlah"
            type="number"
            min="0"
            variant="outlined"
            density="comfortable"
            :hint="formatRupiah(row.jumlah)"
            persistent-hint
            @change="handleJumlahChange(idx, 'jumlah')"
          />
        </VCol>

        <VCol cols="12" md="3">
          <VTextField
            v-model.number="row.dibayar"
            label="Dibayar"
            type="number"
            min="0"
            variant="outlined"
            density="comfortable"
            :hint="formatRupiah(row.dibayar)"
            persistent-hint
            @change="handleJumlahChange(idx, 'bayar')"
          />
        </VCol>

        <VCol cols="12" md="1" class="d-flex justify-end align-center mb-5">
          <VBtnGroup divided density="comfortable">
            <VTooltip text="Hapus baris" location="top">
              <template #activator="{ props }">
                <VBtn
                  v-bind="props"
                  variant="tonal"
                  color="error"
                  icon="ri-delete-bin-line"
                  size="small"
                  @click="removeRow(row.id)"
                  :aria-label="`Hapus ${row.display}`"
                />
              </template>
            </VTooltip>

            <VTooltip text="Tambah baris" location="top">
              <template #activator="{ props }">
                <VBtn
                  v-bind="props"
                  variant="tonal"
                  color="primary"
                  icon="ri-add-line"
                  size="small"
                  @click="addRow"
                  :aria-label="`Tambah ${row.display}`"
                />
              </template>
            </VTooltip>
          </VBtnGroup>
        </VCol>
      </VRow>

      <div
        v-if="rows.length === 0"
        class="text-medium-emphasis text-center py-6"
      >
        Belum ada tagihan yang dipilih. <br>
        <VBtn
          class="mt-2"
          color="primary"
          @click="addRow"
          :aria-label="`Tambah Tagihan`"
        >
          Tambah Tagihan
        </VBtn>
      </div>
    </VCardText>
  </VCard>

</template>
