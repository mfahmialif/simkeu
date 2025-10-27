<script setup>
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import authV2LoginMaskDark from '@images/pages/auth-v2-login-mask-dark.png'
import authV2LoginMaskLight from '@images/pages/auth-v2-login-mask-light.png'
import authV2LoginIllustrationBorderedDark from '@images/pages/login/auth-v2-login-illustration-bordered-dark1.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/login/auth-v2-login-illustration-bordered-light1.png'
import authV2LoginIllustrationDark from '@images/pages/login/auth-v2-login-illustration-dark1.png'
import authV2LoginIllustrationLight from '@images/pages/login/auth-v2-login-illustration-light1.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

const route = useRoute()
const router = useRouter()
const ability = useAbility()

const errors = ref({
  username: undefined,
  password: undefined,
})

const refVForm = ref()

const credentials = ref({
  username: '',
  password: '',
})

const isPasswordVisible = ref(false)
const isDisabled = ref(false)

const authV2LoginMask = useGenerateImageVariant(authV2LoginMaskLight, authV2LoginMaskDark)

const authV2LoginIllustration = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)
const login = async () => {
  try {
    isDisabled.value = true
    const res = await $api('/auth/login', {
      method: 'POST',
      body: {
        username: credentials.value.username,
        password: credentials.value.password,
      },
    })

    const { token, user, abilities } = res

    const userAbilityRules = abilities.map(str => {
      const [action, subject] = str.split(':')
      return { action, subject }
    })

    useCookie('userAbilityRules').value = userAbilityRules
    ability.update(userAbilityRules)
    
    user.avatar = import.meta.env.VITE_BASE_URL + '/avatar/' + user.avatar
    useCookie('userData').value = user
    useCookie('accessToken').value = token

    showSnackbar({
      text: 'Login successful',
      color: 'success',
    });
    // Redirect to `to` query if exist or redirect to index route

    // ❗ nextTick is required to wait for DOM updates and later redirect
    await nextTick(() => {
      router.replace(route.query.to ? String(route.query.to) : '/home')
    })
  }
  catch (err) {
    const message = Array.isArray(err.data.message)
      ? err.data.message.join('; ')
      : err.data.message;
    showSnackbar({
      text: message,
      color: 'error',
    });
  }
  finally {
    isDisabled.value = false
  }
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      login()
  })
}
</script>

<template>
  <RouterLink to="/">
    <div class="app-logo auth-logo">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="app-logo-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </RouterLink>

  <VRow no-gutters class="auth-wrapper">
    <VCol md="8" class="d-none d-md-flex align-center justify-center position-relative">
      <div class="d-flex align-center justify-center pa-10">
        <img :src="authV2LoginIllustration" class="auth-illustration w-100" alt="auth-illustration">
      </div>
      <VImg :src="authV2LoginMask" class="d-none d-md-flex auth-footer-mask" alt="auth-mask" />
    </VCol>
    <VCol cols="12" md="4" class="auth-card-v2 d-flex align-center justify-center"
      style="background-color: rgb(var(--v-theme-surface));">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-5 pa-lg-7">
        <VCardText>
          <h4 class="text-h4 mb-1">
            Welcome to <span class="text-capitalize">{{ themeConfig.app.title }}! 👋🏻</span>
          </h4>

          <p class="mb-0">
            Please sign-in to your account and start the adventure.
          </p>
        </VCardText>

        <VCardText>
          <VForm ref="refVForm" @submit.prevent="onSubmit">
            <VRow>
              <!-- username -->
              <VCol cols="12">
                <VTextField v-model="credentials.username" autofocus label="Username" type="text"
                  placeholder="type here..." :rules="[requiredValidator]" :error-messages="errors.username" />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField v-model="credentials.password" label="Password" placeholder="············"
                  :rules="[requiredValidator]" :type="isPasswordVisible ? 'text' : 'password'" autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" />
                <!-- login button -->
                <VBtn block type="submit" :disabled="isDisabled" class="mt-5">
                  {{ isDisabled ? 'Please wait...' : 'Login' }}
                </VBtn>
              </VCol>

            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
