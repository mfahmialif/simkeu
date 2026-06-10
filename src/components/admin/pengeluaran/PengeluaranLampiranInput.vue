<script setup>
const props = defineProps({
  modelValue: {
    type: [Array, Object],
    default: () => [],
  },
  existingLampiran: {
    type: Array,
    default: () => [],
  },
  removedLampiran: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits([
  "update:modelValue",
  "update:removedLampiran",
])

const selectedFiles = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value),
})

const visibleExistingLampiran = computed(() => props.existingLampiran.filter(
  item => !props.removedLampiran.includes(item.path),
))

const removeExistingLampiran = path => {
  emit("update:removedLampiran", [...props.removedLampiran, path])
}
</script>

<template>
  <div>
    <VFileInput
      v-model="selectedFiles"
      label="Lampiran"
      multiple
      chips
      show-size
      clearable
      :prepend-icon="null"
      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
      hint="Opsional, maksimal 10 file dan 10 MB per file."
      persistent-hint
    />

    <div
      v-if="visibleExistingLampiran.length"
      class="d-flex flex-wrap gap-2 mt-3"
    >
      <VChip
        v-for="item in visibleExistingLampiran"
        :key="item.path"
        color="primary"
        variant="tonal"
        closable
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        prepend-icon="ri-attachment-2"
        @click:close.prevent="removeExistingLampiran(item.path)"
      >
        {{ item.name }}
      </VChip>
    </div>
  </div>
</template>
