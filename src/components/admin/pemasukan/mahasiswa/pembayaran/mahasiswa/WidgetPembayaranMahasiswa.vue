<script setup>

const props = defineProps({
  widgetData: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <!-- 👉 widgets -->
  <VCard class="mb-6">
    <VCardText class="px-2">
      <VRow>
        <template v-for="(data, index) in widgetData" :key="index">
          <VCol cols="12" sm="6" md="3" class="px-6">
            <div class="d-flex justify-space-between" :class="$vuetify.display.xs
              ? index !== widgetData.length - 1
                ? 'border-b pb-4'
                : ''
              : $vuetify.display.sm
                ? index < widgetData.length / 2
                  ? 'border-b pb-4'
                  : ''
                : ''
              ">
              <div class="d-flex flex-column gap-y-1">
                <p class="text-capitalize mb-0">
                  {{ data.title }}
                </p>

                <h4 class="text-h4">
                  {{ data.value }}
                </h4>

                <div class="d-flex align-center">
                  <div class="text-no-wrap me-2">
                    {{ data.desc }}
                  </div>

                  <VChip v-if="data.change" size="small" :color="data.change > 0 ? 'success' : 'error'">
                    {{ prefixWithPlus(data.change) }}%
                  </VChip>
                </div>
              </div>

              <VAvatar variant="tonal" rounded="lg" size="44">
                <VIcon :icon="data.icon" size="28" color="high-emphasis" />
              </VAvatar>
            </div>
          </VCol>
          <VDivider v-if="
            $vuetify.display.mdAndUp
              ? index !== widgetData.length - 1
              : $vuetify.display.smAndUp
                ? index % 2 === 0
                : false
          " vertical inset length="92" />
        </template>
      </VRow>
    </VCardText>
  </VCard>
</template>
