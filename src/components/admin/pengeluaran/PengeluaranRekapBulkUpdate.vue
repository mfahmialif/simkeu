<script setup>
import PengeluaranRekapSelect from "@/components/admin/pengeluaran/PengeluaranRekapSelect.vue";
import { notifyPengeluaranRekapUpdated } from "@/composables/pengeluaranRekap";
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
  allowCancel: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:allPages", "updated"]);

const targetRekapId = ref(null);
const loadingAction = ref(null);

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
const canCancel = computed(() => selectedCount.value > 0);
const targetRekapFilters = computed(() => ({
  ...(props.filters?.petugas_id && { petugas_id: props.filters.petugas_id }),
}));

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

const submitRekap = async (rekapId) => {
  const isCancel = rekapId === null;

  if (!isCancel && !rekapId) {
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
    loadingAction.value = isCancel ? "cancel" : "update";
    const response = await $api(`${props.endpoint}/rekap/bulk-update`, {
      method: "POST",
      body: {
        rekap_id: rekapId,
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
      notifyPengeluaranRekapUpdated(props.endpoint);
      emit("updated");
    }
  } catch (err) {
    showSnackbar({
      text: errorMessage(err),
      color: "error",
    });
  } finally {
    loadingAction.value = null;
  }
};

const updateRekap = () => submitRekap(targetRekapId.value);
const cancelRekap = () => submitRekap(null);
</script>

<template>
  <VCard class="mb-4">
    <VCardText>
      <VRow class="align-center">
        <VCol cols="12" md="3">
          <VCheckbox
            v-model="allPagesModel"
            :label="`Centang semua data sesuai filter (${totalItems} data, semua halaman)`"
            :disabled="totalItems === 0"
            hide-details
          />
        </VCol>

        <VCol cols="12" md="3">
          <PengeluaranRekapSelect
            v-model="targetRekapId"
            :endpoint="endpoint"
            label="Rekap Tujuan"
            :filters="targetRekapFilters"
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

        <VCol cols="12" :md="allowCancel ? 2 : 4">
          <VBtn
            color="primary"
            class="w-100"
            height="48"
            prepend-icon="ri-check-double-line"
            :loading="loadingAction === 'update'"
            :disabled="!canSubmit || !!loadingAction"
            @click="updateRekap"
          >
            Update Rekap
          </VBtn>
        </VCol>

        <VCol v-if="allowCancel" cols="12" md="2">
          <VBtn
            color="warning"
            variant="outlined"
            class="w-100"
            height="48"
            prepend-icon="ri-link-unlink-m"
            :loading="loadingAction === 'cancel'"
            :disabled="!canCancel || !!loadingAction"
            @click="cancelRekap"
          >
            Batalkan Rekap
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
