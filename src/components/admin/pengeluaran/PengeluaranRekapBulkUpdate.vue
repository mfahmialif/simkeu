<script setup>
import PengeluaranRekapSelect from "@/components/admin/pengeluaran/PengeluaranRekapSelect.vue";
import { showSnackbar } from "@/composables/snackbar";

const props = defineProps({
  endpoint: {
    type: String,
    required: true,
  },
  selectedIds: {
    type: Array,
    default: () => [],
  },
  totalItems: {
    type: Number,
    default: 0,
  },
  filters: {
    type: Object,
    default: () => ({}),
  },
  allPages: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:allPages", "updated"]);

const targetRekapId = ref(null);
const loading = ref(false);

const allPagesModel = computed({
  get: () => props.allPages,
  set: value => emit("update:allPages", value),
});

const selectedCount = computed(() => (
  allPagesModel.value
    ? Number(props.totalItems || 0)
    : props.selectedIds.length
));

const canSubmit = computed(() => !!targetRekapId.value && selectedCount.value > 0);

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

const updateRekap = async () => {
  if (!targetRekapId.value) {
    showSnackbar({
      text: "Pilih rekap tujuan terlebih dahulu.",
      color: "warning",
    });
    return;
  }

  if (selectedCount.value === 0) {
    showSnackbar({
      text: "Pilih data pengeluaran terlebih dahulu.",
      color: "warning",
    });
    return;
  }

  try {
    loading.value = true;
    const response = await $api(`${props.endpoint}/rekap/bulk-update`, {
      method: "POST",
      body: {
        rekap_id: targetRekapId.value,
        all_pages: allPagesModel.value,
        ids: props.selectedIds,
        filters: props.filters,
      },
    });

    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: "success",
      });
      targetRekapId.value = null;
      emit("updated");
    }
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <VCard class="mb-4">
    <VCardText>
      <VRow class="align-center">
        <VCol cols="12" md="4">
          <VCheckbox
            v-model="allPagesModel"
            :label="`Centang semua data sesuai filter (${totalItems} data, semua halaman)`"
            :disabled="totalItems === 0"
            hide-details
          />
        </VCol>

        <VCol cols="12" md="4">
          <PengeluaranRekapSelect
            v-model="targetRekapId"
            :endpoint="endpoint"
            label="Rekap Tujuan"
          />
        </VCol>

        <VCol cols="12" md="2">
          <VTextField
            :model-value="selectedCount"
            label="Data Dipilih"
            readonly
            hide-details
          />
        </VCol>

        <VCol cols="12" md="2">
          <VBtn
            color="primary"
            class="w-100"
            height="48"
            prepend-icon="ri-check-double-line"
            :loading="loading"
            :disabled="!canSubmit || loading"
            @click="updateRekap"
          >
            Update Rekap
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
