<script setup>
import { showSnackbar } from "@/composables/snackbar";
import {
  listenPengeluaranRekapUpdated,
  notifyPengeluaranRekapUpdated,
} from "@/composables/pengeluaranRekap";

const props = defineProps({
  modelValue: {
    type: [Number, String, null],
    default: null,
  },
  endpoint: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: "Rekap",
  },
  rules: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  allowCreate: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue", "created"]);

const items = ref([]);
const loading = ref(false);
const dialog = ref(false);
const saving = ref(false);
const namaInput = ref(null);
const nama = ref("");
const keterangan = ref("");
let stopListeningRekapUpdates = null;

const selectedValue = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value || null),
});

const errorMessage = (err) => {
  const message =
    err?.data?.message ||
    err?.response?._data?.message ||
    err?.response?.data?.message ||
    err?.message;

  if (typeof message === "object") {
    return Object.values(message).flat().join("; ");
  }

  return message || "Terjadi kesalahan.";
};

const fetchRekap = async () => {
  try {
    loading.value = true;
    const response = await $api(`${props.endpoint}/rekap`, {
      method: "GET",
      body: {
        limit: 100,
        sort_key: "id",
        sort_order: "desc",
      },
    });

    items.value = response.data?.data || [];
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  nama.value = "";
  keterangan.value = "";
};

const createRekap = async () => {
  if (saving.value) return;

  const trimmedNama = nama.value.trim();

  if (!trimmedNama) {
    showSnackbar({
      text: "Nama rekap harus diisi.",
      color: "warning",
    });
    namaInput.value?.focus();
    return;
  }

  try {
    saving.value = true;
    const response = await $api(`${props.endpoint}/rekap`, {
      method: "POST",
      body: {
        nama: trimmedNama,
        keterangan: keterangan.value,
      },
    });

    if (response.status === true) {
      items.value = [response.data, ...items.value.filter(item => item.id !== response.data.id)];
      selectedValue.value = response.data.id;
      emit("created", response.data);
      dialog.value = false;
      resetForm();
      notifyPengeluaranRekapUpdated(props.endpoint);
      showSnackbar({
        text: response.message,
        color: "success",
      });
    }
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    });
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchRekap();
  stopListeningRekapUpdates = listenPengeluaranRekapUpdated(
    props.endpoint,
    fetchRekap,
  );
});

onBeforeUnmount(() => stopListeningRekapUpdates?.());
</script>

<template>
  <div class="rekap-select">
    <VAutocomplete
      v-model="selectedValue"
      :items="items"
      item-title="nama"
      item-value="id"
      :label="label"
      :rules="rules"
      :loading="loading"
      :disabled="disabled"
      clearable
    >
      <template #item="{ props: itemProps, item }">
        <VListItem v-bind="itemProps">
          <template v-if="item.raw.keterangan" #subtitle>
            {{ item.raw.keterangan }}
          </template>
        </VListItem>
      </template>

      <template v-if="allowCreate" #append>
        <VBtn
          icon
          size="small"
          variant="tonal"
          color="primary"
          :disabled="disabled"
          @click="dialog = true"
        >
          <VIcon icon="ri-add-line" />
        </VBtn>
      </template>
    </VAutocomplete>

    <VDialog
      v-model="dialog"
      width="560"
      @after-enter="namaInput?.focus()"
    >
      <VCard title="Tambah Rekap">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="dialog = false"
        />

        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField
                ref="namaInput"
                v-model="nama"
                label="Nama Rekap *"
                :rules="[requiredValidator]"
                autofocus
                hint="Wajib diisi"
                persistent-hint
                @keydown.enter.prevent="createRekap"
              />
            </VCol>

            <VCol cols="12">
              <VTextarea
                v-model="keterangan"
                label="Keterangan (Opsional)"
                hint="Tidak wajib diisi"
                persistent-hint
                auto-grow
              />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end gap-3">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="dialog = false"
          >
            Batal
          </VBtn>
          <VBtn
            color="primary"
            :loading="saving"
            :disabled="saving"
            @click="createRekap"
          >
            Simpan
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.rekap-select {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}
</style>
