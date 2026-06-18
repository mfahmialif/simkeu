<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

defineOptions({ inheritAttrs: false })

const internalValue = ref(props.modelValue)

// Sinkronisasi jika parent mengubah value dari luar
watch(() => props.modelValue, newVal => {
  if (internalValue.value !== newVal) {
    internalValue.value = newVal
  }
})

// Emit ke parent hanya saat blur atau enter
const commitValue = () => {
  let finalValue = internalValue.value
  if (typeof props.modelValue === 'number' && typeof finalValue === 'string') {
    finalValue = finalValue === '' ? 0 : Number(finalValue)
  }
  
  if (props.modelValue !== finalValue) {
    emit('update:modelValue', finalValue)
  }
}
</script>

<template>
  <VTextField
    v-bind="$attrs"
    v-model="internalValue"
    @blur="commitValue"
    @keydown.enter="commitValue"
  >
    <template
      v-for="(_, name) in $slots"
      #[name]="slotProps"
    >
      <slot
        :name="name"
        v-bind="slotProps || {}"
      />
    </template>
  </VTextField>
</template>
