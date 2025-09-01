<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  menuList: {
    type: Array,
    required: false,
  },
  itemProps: {
    type: Boolean,
    required: false,
    default: false,
  },
  iconSize: {
    type: String,
    required: false,
    default: '20',
  },
  class: {
    type: String,
    required: false,
    default: 'text-disabled',
  },
})
</script>

<template>
  <IconBtn size="small" :class="props.class">
    <VIcon :size="iconSize" icon="ri-more-2-line" />

    <VMenu v-if="props.menuList" activator="parent">
      <VList>
        <template v-for="(item, index) in props.menuList" :key="index">
          <VDivider v-if="item.value === 'hr'" />
          <VListItem v-else :title="item.title" :prepend-icon="item.icon" @click="item.clickHandler" />
        </template>
      </VList>
    </VMenu>
  </IconBtn>
</template>
