<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: "Satuan",
  },
  density: {
    type: String,
    default: "compact",
  },
  hideDetails: {
    type: [Boolean, String],
    default: true,
  },
})

const emit = defineEmits(["update:modelValue"])

const otherValue = "__lainnya__"

const satuanItems = [
  { title: "Unit", value: "unit" },
  { title: "Pcs", value: "pcs" },
  { title: "Buah", value: "buah" },
  { title: "Lainnya", value: otherValue },
]

const selectedSatuan = ref(null)
const customSatuan = ref("")
const noPendingValue = Symbol("no-pending-value")
let pendingValue = noPendingValue

const standardItem = value => {
  const normalizedValue = String(value || "").trim().toLocaleLowerCase("id-ID")

  return satuanItems.find(item => item.value !== otherValue && item.value === normalizedValue)
}

const syncFromModel = value => {
  const normalizedValue = String(value || "").trim()
  const matchedItem = standardItem(normalizedValue)

  if (!normalizedValue) {
    selectedSatuan.value = null
    customSatuan.value = ""
  } else if (matchedItem) {
    selectedSatuan.value = matchedItem.value
    customSatuan.value = ""
  } else {
    selectedSatuan.value = otherValue
    customSatuan.value = normalizedValue
  }
}

const updateModel = value => {
  pendingValue = value
  emit("update:modelValue", value)
  nextTick(() => {
    if (Object.is(pendingValue, value)) pendingValue = noPendingValue
  })
}

const onSatuanSelected = value => {
  selectedSatuan.value = value

  if (value === otherValue) {
    const currentValue = String(props.modelValue || "").trim()

    customSatuan.value = currentValue && !standardItem(currentValue) ? currentValue : ""
    updateModel(customSatuan.value || null)

    return
  }

  customSatuan.value = ""
  updateModel(value || null)
}

const onCustomSatuanUpdated = value => {
  customSatuan.value = value
  updateModel(value || null)
}

const customSatuanRequired = value => Boolean(String(value || "").trim()) || "Satuan lainnya harus diisi."

watch(
  () => props.modelValue,
  value => {
    if (pendingValue !== noPendingValue && Object.is(value, pendingValue)) {
      pendingValue = noPendingValue

      return
    }

    syncFromModel(value)
  },
  { immediate: true },
)
</script>

<template>
  <div class="satuan-input">
    <VSelect
      :model-value="selectedSatuan"
      :items="satuanItems"
      :label="label"
      :density="density"
      :hide-details="hideDetails"
      clearable
      @update:model-value="onSatuanSelected"
    />

    <VTextField
      v-if="selectedSatuan === otherValue"
      :model-value="customSatuan"
      label="Satuan Lainnya"
      placeholder="Masukkan satuan"
      :density="density"
      hide-details="auto"
      maxlength="255"
      :rules="[customSatuanRequired]"
      class="mt-2"
      @update:model-value="onCustomSatuanUpdated"
    />
  </div>
</template>
