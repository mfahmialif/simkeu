<script setup>
import ScrollToTop from '@core/components/ScrollToTop.vue'
import initCore from '@core/initCore'
import {
  initConfigStore,
  useConfigStore,
} from '@core/stores/config'
import { hexToRgb } from '@core/utils/colorConverter'
import { useTheme } from 'vuetify'
import { snackbarData } from './composables/snackbar'

const { global } = useTheme()

// ℹ️ Sync current theme with initial loader theme
initCore()
initConfigStore()

const configStore = useConfigStore()
</script>

<template>
  <VSnackbar
    v-model="snackbarData.visible"
    location="top end"
    variant="flat"
    :color="snackbarData.color"
  >
    {{ snackbarData.text }}
  </VSnackbar>

  <VLocaleProvider :rtl="configStore.isAppRTL">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView />
      <ScrollToTop />
    </VApp>
  </VLocaleProvider>
</template>

<style>
/* NProgress YouTube Style Override */
#nprogress .bar {
  background: rgb(var(--v-theme-primary)) !important;
  height: 3px !important;
}

#nprogress .peg {
  box-shadow: 0 0 10px rgb(var(--v-theme-primary)), 0 0 5px rgb(var(--v-theme-primary)) !important;
}
</style>
