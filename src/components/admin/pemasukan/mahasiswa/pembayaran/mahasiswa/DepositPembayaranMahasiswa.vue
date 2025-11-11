<script setup>
import { showSnackbar } from "@/composables/snackbar";

const props = defineProps({
  mahasiswa: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const form = ref({
  simpan: 0,
});

const loadingSimpan = ref(false);
const loadingCurrent = ref(false);

const fetchDeposit = async () => {
  try {
    loadingCurrent.value = true;
    const res = await $api(
      `/admin/pemasukan/mahasiswa/catatan-deposit/nim/${props.mahasiswa.nim}`,
      {
        method: "GET",
      }
    );
    props.mahasiswa.deposit = res.jumlah;
  } catch (error) {
    showSnackbar({
      text: error,
      color: "error",
    });
  } finally {
    loadingCurrent.value = false;
  }
};

const clearDeposit = () => {
  props.mahasiswa.deposit = 0;
  props.mahasiswa.dipakai = 0;
}

defineExpose({
  fetchDeposit,
  clearDeposit,
});

async function onSimpan() {
  if ((form.value.simpan ?? 0) <= 0) return;
  try {
    const res = await $api(`/admin/pemasukan/mahasiswa/catatan-deposit`, {
      method: "POST",
      body: {
        nim: props.mahasiswa.nim,
        jumlah: form.value.simpan,
      },
    });
    
    props.mahasiswa.deposit = Number(res.data.jumlah);
    form.value.simpan = 0;

    showSnackbar({
      text: "Deposit berhasil disimpan.",
      color: "success",
    });
  } catch (error) {
    showSnackbar({
      text: error,
      color: "error",
    });
  }
}

async function onPakai() {
  const pakai = Number(props.mahasiswa.dipakai || 0);
  if (pakai > props.mahasiswa.deposit) {
    showSnackbar({
      text: "Deposit tidak boleh melebihi saldo",
      color: "error",
    });
    return;
  }

  props.mahasiswa.dipakai = props.mahasiswa.deposit;
}

function onHapus() {
  // hapus baris/entry pemakaian atau reset nilai input (sesuaikan kebutuhan)
  props.mahasiswa.dipakai = 0;
}
</script>

<template>
  <!-- SIMPAN DEPOSIT -->
  <VCard class="mb-6" flat>
    <VCardText>
      <div class="text-subtitle-1 font-weight-medium mb-2">
        Simpan Deposit Mahasiswa (Rp.)
      </div>

      <VRow class="align-center" no-gutters>
        <VCol cols="12" md="12" class="pr-md-4">
          <VTextField
            v-model.number="form.simpan"
            placeholder="Masukkan jumlah deposit"
            type="number"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :hint="formatRupiah(form.simpan)"
            persistent-hint
          />
        </VCol>
      </VRow>
      <VBtn
        class="mt-4"
        color="primary"
        :loading="loadingSimpan"
        @click="onSimpan"
      >
        Simpan
      </VBtn>
    </VCardText>
  </VCard>

  <!-- DEPOSIT & PAKAI -->
  <VCard flat>
    <VCardText>
      <VRow class="align-center">
        <VCol cols="12" md="12" class="pr-md-4">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            Deposit Mahasiswa (Rp.)
          </div>
          <VTextField
            :model-value="props.mahasiswa.deposit"
            variant="outlined"
            density="comfortable"
            readonly
            :hint="formatRupiah(props.mahasiswa.deposit)"
            persistent-hint
            :loading="loadingCurrent"
          />
        </VCol>

        <VCol cols="12" md="12">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            Dipakai (Rp.)
          </div>
          <VRow class="align-center" no-gutters>
            <VCol cols="12" class="pr-md-4">
              <VTextField
                v-model.number="props.mahasiswa.dipakai"
                type="number"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                :hint="formatRupiah(props.mahasiswa.dipakai)"
                persistent-hint
              />
            </VCol>
          </VRow>
        </VCol>
        <VCol cols="12" class="mt-3 mt-md-0 d-flex gap-2">
          <VBtn color="primary" class="mr-2" @click="onPakai"> Dipakai </VBtn>

          <VBtn color="error" variant="elevated" icon @click="onHapus">
            <VIcon icon="ri-delete-bin-line" />
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
