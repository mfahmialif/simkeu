<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <VMenu v-if="items.length">
    <template #activator="{ props }">
      <VBtn
        v-bind="props"
        size="small"
        variant="text"
        color="primary"
        prepend-icon="ri-attachment-2"
        class="px-1"
      >
        {{ items.length }} File
      </VBtn>
    </template>

    <VList density="compact">
      <VListItem
        v-for="item in items"
        :key="item.path"
        :title="item.name"
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        prepend-icon="ri-file-line"
      />
    </VList>
  </VMenu>
  <span v-else>-</span>
</template>
