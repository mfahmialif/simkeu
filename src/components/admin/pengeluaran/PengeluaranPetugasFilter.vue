<script setup>
defineProps({
  modelValue: {
    type: [Number, String, null],
    default: null,
  },
  items: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="pengeluaran-petugas-filter mb-4">
    <VSelect
      :model-value="modelValue"
      :items="items"
      label="Filter Petugas"
      placeholder="Semua Petugas"
      prepend-inner-icon="ri-user-search-line"
      clearable
      hide-details
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<style scoped>
.pengeluaran-petugas-filter {
  inline-size: 100%;
}
</style>
