import{d as V,ac as P,a2 as x,a3 as o,m as e,cz as W,j as I,u as l,ab as c,U as C,W as B,bj as w,bm as K,cx as z,bn as M,bs as N,aK as H,ch as J}from"./app-core-BBiCCfYH.js";import{x as A,k as j,au as T,a8 as R,a9 as y,p as S,q as i,R as m,ad as L,V as v,a as F,w as q}from"./vuetify-BC4vKTOI.js";const O={ts:`<script setup lang="ts">
const numberedSteps = [
  {
    title: 'Account Details',
    subtitle: 'Setup Account Details',
  },
  {
    title: 'Personal Info',
    subtitle: 'Add personal info',
  },
  {
    title: 'Social Links',
    subtitle: 'Add social links',
  },
]

const currentStep = ref(0)
const isPasswordVisible = ref(false)
const isCPasswordVisible = ref(false)

const formData = ref({
  username: '',
  email: '',
  password: '',
  cPassword: '',
  firstName: '',
  lastName: '',
  country: undefined,
  language: undefined,
  twitter: '',
  facebook: '',
  googlePlus: '',
  LinkedIn: '',

})

const onSubmit = () => {
  console.log(formData.value)
}
<\/script>

<template>
  <VCard>
    <VCardText>
      <!-- 👉 Stepper -->
      <AppStepper
        v-model:current-step="currentStep"
        :items="numberedSteps"
      />
    </VCardText>

    <VDivider />

    <VCardText>
      <!-- 👉 stepper content -->
      <VForm>
        <VWindow
          v-model="currentStep"
          class="disable-tab-transition"
        >
          <VWindowItem>
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6">
                  Account Details
                </h6>
                <p class="text-sm mb-0">
                  Enter your Account Details
                </p>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.username"
                  placeholder="CarterLeonardo"
                  label="Username"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.email"
                  placeholder="carterleonardo@gmail.com"
                  label="Email"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.cPassword"
                  label="Confirm Password"
                  autocomplete="confirm-password"
                  placeholder="············"
                  :type="isCPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isCPasswordVisible = !isCPasswordVisible"
                />
              </VCol>
            </VRow>
          </VWindowItem>

          <VWindowItem>
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6">
                  Personal Info
                </h6>
                <p class="text-sm mb-0">
                  Setup Information
                </p>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.firstName"
                  label="First Name"
                  placeholder="Leonard"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.lastName"
                  label="Last Name"
                  placeholder="Carter"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="formData.country"
                  label="Country"
                  placeholder="Select Country"
                  :items="['UK', 'USA', 'Canada', 'Australia', 'Germany']"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="formData.language"
                  label="Language"
                  placeholder="Select Language"
                  :items="['English', 'Spanish', 'French', 'Russian', 'German']"
                />
              </VCol>
            </VRow>
          </VWindowItem>

          <VWindowItem>
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6">
                  Social Links
                </h6>
                <p class="text-sm mb-0">
                  Add Social Links
                </p>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.twitter"
                  placeholder="https://twitter.com/abc"
                  label="Twitter"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.facebook"
                  placeholder="https://facebook.com/abc"
                  label="Facebook"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.googlePlus"
                  placeholder="https://plus.google.com/abc"
                  label="Google+"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.LinkedIn"
                  placeholder="https://linkedin.com/abc"
                  label="LinkedIn"
                />
              </VCol>
            </VRow>
          </VWindowItem>
        </VWindow>

        <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
          <VBtn
            color="secondary"
            variant="outlined"
            :disabled="currentStep === 0"
            @click="currentStep--"
          >
            <VIcon
              icon="ri-arrow-left-line"
              start
              class="flip-in-rtl"
            />
            Previous
          </VBtn>

          <VBtn
            v-if="numberedSteps.length - 1 === currentStep"
            color="success"
            append-icon="ri-check-line"
            @click="onSubmit"
          >
            submit
          </VBtn>

          <VBtn
            v-else
            @click="currentStep++"
          >
            Next

            <VIcon
              icon="ri-arrow-right-line"
              end
              class="flip-in-rtl"
            />
          </VBtn>
        </div>
      </VForm>
    </VCardText>
  </VCard>
</template>
`,js:`<script setup>
const numberedSteps = [
  {
    title: 'Account Details',
    subtitle: 'Setup Account Details',
  },
  {
    title: 'Personal Info',
    subtitle: 'Add personal info',
  },
  {
    title: 'Social Links',
    subtitle: 'Add social links',
  },
]

const currentStep = ref(0)
const isPasswordVisible = ref(false)
const isCPasswordVisible = ref(false)

const formData = ref({
  username: '',
  email: '',
  password: '',
  cPassword: '',
  firstName: '',
  lastName: '',
  country: undefined,
  language: undefined,
  twitter: '',
  facebook: '',
  googlePlus: '',
  LinkedIn: '',
})

const onSubmit = () => {
  console.log(formData.value)
}
<\/script>

<template>
  <VCard>
    <VCardText>
      <!-- 👉 Stepper -->
      <AppStepper
        v-model:current-step="currentStep"
        :items="numberedSteps"
      />
    </VCardText>

    <VDivider />

    <VCardText>
      <!-- 👉 stepper content -->
      <VForm>
        <VWindow
          v-model="currentStep"
          class="disable-tab-transition"
        >
          <VWindowItem>
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6">
                  Account Details
                </h6>
                <p class="text-sm mb-0">
                  Enter your Account Details
                </p>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.username"
                  placeholder="CarterLeonardo"
                  label="Username"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.email"
                  placeholder="carterleonardo@gmail.com"
                  label="Email"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.cPassword"
                  label="Confirm Password"
                  autocomplete="confirm-password"
                  placeholder="············"
                  :type="isCPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isCPasswordVisible = !isCPasswordVisible"
                />
              </VCol>
            </VRow>
          </VWindowItem>

          <VWindowItem>
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6">
                  Personal Info
                </h6>
                <p class="text-sm mb-0">
                  Setup Information
                </p>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.firstName"
                  label="First Name"
                  placeholder="Leonard"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.lastName"
                  label="Last Name"
                  placeholder="Carter"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="formData.country"
                  label="Country"
                  placeholder="Select Country"
                  :items="['UK', 'USA', 'Canada', 'Australia', 'Germany']"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="formData.language"
                  label="Language"
                  placeholder="Select Language"
                  :items="['English', 'Spanish', 'French', 'Russian', 'German']"
                />
              </VCol>
            </VRow>
          </VWindowItem>

          <VWindowItem>
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6">
                  Social Links
                </h6>
                <p class="text-sm mb-0">
                  Add Social Links
                </p>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.twitter"
                  placeholder="https://twitter.com/abc"
                  label="Twitter"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.facebook"
                  placeholder="https://facebook.com/abc"
                  label="Facebook"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.googlePlus"
                  placeholder="https://plus.google.com/abc"
                  label="Google+"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.LinkedIn"
                  placeholder="https://linkedin.com/abc"
                  label="LinkedIn"
                />
              </VCol>
            </VRow>
          </VWindowItem>
        </VWindow>

        <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
          <VBtn
            color="secondary"
            variant="outlined"
            :disabled="currentStep === 0"
            @click="currentStep--"
          >
            <VIcon
              icon="ri-arrow-left-line"
              start
              class="flip-in-rtl"
            />
            Previous
          </VBtn>

          <VBtn
            v-if="numberedSteps.length - 1 === currentStep"
            color="success"
            append-icon="ri-check-line"
            @click="onSubmit"
          >
            submit
          </VBtn>

          <VBtn
            v-else
            @click="currentStep++"
          >
            Next

            <VIcon
              icon="ri-arrow-right-line"
              end
              class="flip-in-rtl"
            />
          </VBtn>
        </div>
      </VForm>
    </VCardText>
  </VCard>
</template>
`},Q={ts:`<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm'

const numberedSteps = [
  {
    title: 'Account Details',
    subtitle: 'Setup Account Details',
  },
  {
    title: 'Personal Info',
    subtitle: 'Add personal info',
  },
  {
    title: 'Social Links',
    subtitle: 'Add social links',
  },
]

const currentStep = ref(0)
const isPasswordVisible = ref(false)
const isCPasswordVisible = ref(false)
const isCurrentStepValid = ref(true)
const refAccountForm = ref<VForm>()
const refPersonalForm = ref<VForm>()
const refSocialLinkForm = ref<VForm>()

const accountForm = ref({
  username: '',
  email: '',
  password: '',
  cPassword: '',
})

const personalForm = ref({
  firstName: '',
  lastName: '',
  country: undefined,
  language: undefined,
})

const socialForm = ref({
  twitter: '',
  facebook: '',
  googlePlus: '',
  LinkedIn: '',

})

const validateAccountForm = () => {
  refAccountForm.value?.validate().then(valid => {
    if (valid.valid) {
      currentStep.value++
      isCurrentStepValid.value = true
    }
    else { isCurrentStepValid.value = false }
  })
}

const validatePersonalForm = () => {
  refPersonalForm.value?.validate().then(valid => {
    if (valid.valid) {
      currentStep.value++
      isCurrentStepValid.value = true
    }
    else { isCurrentStepValid.value = false }
  })
}

const validateSocialLinkForm = () => {
  refSocialLinkForm.value?.validate().then(valid => {
    if (valid.valid) {
      isCurrentStepValid.value = true

      console.log({
        ...accountForm.value,
        ...personalForm.value,
        ...socialForm.value,
      })
    }
    else { isCurrentStepValid.value = false }
  })
}
<\/script>

<template>
  <VCard>
    <VCardText>
      <!-- 👉 Stepper -->
      <AppStepper
        v-model:current-step="currentStep"
        :items="numberedSteps"
        :is-active-step-valid="isCurrentStepValid"
      />
    </VCardText>

    <VDivider />

    <VCardText>
      <!-- 👉 stepper content -->

      <VWindow
        v-model="currentStep"
        class="disable-tab-transition"
      >
        <VWindowItem>
          <VForm
            ref="refAccountForm"
            @submit.prevent="validateAccountForm"
          >
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6">
                  Account Details
                </h6>
                <p class="text-sm mb-0">
                  Enter your Account Details
                </p>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountForm.username"
                  placeholder="CarterLeonardo"
                  :rules="[requiredValidator]"
                  label="Username"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountForm.email"
                  placeholder="carterleonardo@gmail.com"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountForm.password"
                  label="Password"
                  placeholder="············"
                  :rules="[requiredValidator, passwordValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountForm.cPassword"
                  label="Confirm Password"
                  autocomplete="confirm-password"
                  placeholder="············"
                  :rules="[requiredValidator, confirmedValidator(accountForm.cPassword, accountForm.password)]"
                  :type="isCPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isCPasswordVisible = !isCPasswordVisible"
                />
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn
                    color="secondary"
                    variant="outlined"
                    disabled
                  >
                    <VIcon
                      icon="ri-arrow-left-line"
                      start
                      class="flip-in-rtl"
                    />
                    Previous
                  </VBtn>

                  <VBtn type="submit">
                    Next
                    <VIcon
                      icon="ri-arrow-right-line"
                      end
                      class="flip-in-rtl"
                    />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem>
          <VForm
            ref="refPersonalForm"
            @submit.prevent="validatePersonalForm"
          >
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6">
                  Personal Info
                </h6>
                <p class="text-sm mb-0">
                  Setup Information
                </p>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="personalForm.firstName"
                  label="First Name"
                  :rules="[requiredValidator]"
                  placeholder="Leonard"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="personalForm.lastName"
                  label="Last Name"
                  :rules="[requiredValidator]"
                  placeholder="Carter"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="personalForm.country"
                  label="Country"
                  :rules="[requiredValidator]"
                  placeholder="Select Country"
                  :items="['UK', 'USA', 'Canada', 'Australia', 'Germany']"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="personalForm.language"
                  label="Language"
                  :rules="[requiredValidator]"
                  placeholder="Select Language"
                  :items="['English', 'Spanish', 'French', 'Russian', 'German']"
                />
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn
                    color="secondary"
                    variant="tonal"
                    @click="currentStep--"
                  >
                    <VIcon
                      icon="ri-arrow-left-line"
                      start
                      class="flip-in-rtl"
                    />
                    Previous
                  </VBtn>

                  <VBtn type="submit">
                    Next
                    <VIcon
                      icon="ri-arrow-right-line"
                      end
                      class="flip-in-rtl"
                    />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem>
          <VForm
            ref="refSocialLinkForm"
            @submit.prevent="validateSocialLinkForm"
          >
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6">
                  Social Links
                </h6>
                <p class="text-sm mb-0">
                  Add Social Links
                </p>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="socialForm.twitter"
                  placeholder="https://twitter.com/abc"
                  :rules="[requiredValidator, urlValidator]"
                  label="Twitter"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="socialForm.facebook"
                  placeholder="https://facebook.com/abc"
                  :rules="[requiredValidator, urlValidator]"
                  label="Facebook"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="socialForm.googlePlus"
                  placeholder="https://plus.google.com/abc"
                  :rules="[requiredValidator, urlValidator]"
                  label="Google+"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="socialForm.LinkedIn"
                  placeholder="https://likedin.com/abc"
                  :rules="[requiredValidator, urlValidator]"
                  label="LinkedIn"
                />
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn
                    color="secondary"
                    variant="tonal"
                    @click="currentStep--"
                  >
                    <VIcon
                      icon="ri-arrow-left-line"
                      start
                      class="flip-in-rtl"
                    />
                    Previous
                  </VBtn>

                  <VBtn
                    color="success"
                    type="submit"
                  >
                    submit
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
</template>
`,js:`<script setup>
import { VForm } from 'vuetify/components/VForm'

const numberedSteps = [
  {
    title: 'Account Details',
    subtitle: 'Setup Account Details',
  },
  {
    title: 'Personal Info',
    subtitle: 'Add personal info',
  },
  {
    title: 'Social Links',
    subtitle: 'Add social links',
  },
]

const currentStep = ref(0)
const isPasswordVisible = ref(false)
const isCPasswordVisible = ref(false)
const isCurrentStepValid = ref(true)
const refAccountForm = ref()
const refPersonalForm = ref()
const refSocialLinkForm = ref()

const accountForm = ref({
  username: '',
  email: '',
  password: '',
  cPassword: '',
})

const personalForm = ref({
  firstName: '',
  lastName: '',
  country: undefined,
  language: undefined,
})

const socialForm = ref({
  twitter: '',
  facebook: '',
  googlePlus: '',
  LinkedIn: '',
})

const validateAccountForm = () => {
  refAccountForm.value?.validate().then(valid => {
    if (valid.valid) {
      currentStep.value++
      isCurrentStepValid.value = true
    } else {
      isCurrentStepValid.value = false
    }
  })
}

const validatePersonalForm = () => {
  refPersonalForm.value?.validate().then(valid => {
    if (valid.valid) {
      currentStep.value++
      isCurrentStepValid.value = true
    } else {
      isCurrentStepValid.value = false
    }
  })
}

const validateSocialLinkForm = () => {
  refSocialLinkForm.value?.validate().then(valid => {
    if (valid.valid) {
      isCurrentStepValid.value = true
      console.log({
        ...accountForm.value,
        ...personalForm.value,
        ...socialForm.value,
      })
    } else {
      isCurrentStepValid.value = false
    }
  })
}
<\/script>

<template>
  <VCard>
    <VCardText>
      <!-- 👉 Stepper -->
      <AppStepper
        v-model:current-step="currentStep"
        :items="numberedSteps"
        :is-active-step-valid="isCurrentStepValid"
      />
    </VCardText>

    <VDivider />

    <VCardText>
      <!-- 👉 stepper content -->

      <VWindow
        v-model="currentStep"
        class="disable-tab-transition"
      >
        <VWindowItem>
          <VForm
            ref="refAccountForm"
            @submit.prevent="validateAccountForm"
          >
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6">
                  Account Details
                </h6>
                <p class="text-sm mb-0">
                  Enter your Account Details
                </p>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountForm.username"
                  placeholder="CarterLeonardo"
                  :rules="[requiredValidator]"
                  label="Username"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountForm.email"
                  placeholder="carterleonardo@gmail.com"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountForm.password"
                  label="Password"
                  placeholder="············"
                  :rules="[requiredValidator, passwordValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountForm.cPassword"
                  label="Confirm Password"
                  autocomplete="confirm-password"
                  placeholder="············"
                  :rules="[requiredValidator, confirmedValidator(accountForm.cPassword, accountForm.password)]"
                  :type="isCPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isCPasswordVisible = !isCPasswordVisible"
                />
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn
                    color="secondary"
                    variant="outlined"
                    disabled
                  >
                    <VIcon
                      icon="ri-arrow-left-line"
                      start
                      class="flip-in-rtl"
                    />
                    Previous
                  </VBtn>

                  <VBtn type="submit">
                    Next
                    <VIcon
                      icon="ri-arrow-right-line"
                      end
                      class="flip-in-rtl"
                    />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem>
          <VForm
            ref="refPersonalForm"
            @submit.prevent="validatePersonalForm"
          >
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6">
                  Personal Info
                </h6>
                <p class="text-sm mb-0">
                  Setup Information
                </p>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="personalForm.firstName"
                  label="First Name"
                  :rules="[requiredValidator]"
                  placeholder="Leonard"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="personalForm.lastName"
                  label="Last Name"
                  :rules="[requiredValidator]"
                  placeholder="Carter"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="personalForm.country"
                  label="Country"
                  :rules="[requiredValidator]"
                  placeholder="Select Country"
                  :items="['UK', 'USA', 'Canada', 'Australia', 'Germany']"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="personalForm.language"
                  label="Language"
                  :rules="[requiredValidator]"
                  placeholder="Select Language"
                  :items="['English', 'Spanish', 'French', 'Russian', 'German']"
                />
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn
                    color="secondary"
                    variant="tonal"
                    @click="currentStep--"
                  >
                    <VIcon
                      icon="ri-arrow-left-line"
                      start
                      class="flip-in-rtl"
                    />
                    Previous
                  </VBtn>

                  <VBtn type="submit">
                    Next
                    <VIcon
                      icon="ri-arrow-right-line"
                      end
                      class="flip-in-rtl"
                    />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem>
          <VForm
            ref="refSocialLinkForm"
            @submit.prevent="validateSocialLinkForm"
          >
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6">
                  Social Links
                </h6>
                <p class="text-sm mb-0">
                  Add Social Links
                </p>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="socialForm.twitter"
                  placeholder="https://twitter.com/abc"
                  :rules="[requiredValidator, urlValidator]"
                  label="Twitter"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="socialForm.facebook"
                  placeholder="https://facebook.com/abc"
                  :rules="[requiredValidator, urlValidator]"
                  label="Facebook"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="socialForm.googlePlus"
                  placeholder="https://plus.google.com/abc"
                  :rules="[requiredValidator, urlValidator]"
                  label="Google+"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="socialForm.LinkedIn"
                  placeholder="https://likedin.com/abc"
                  :rules="[requiredValidator, urlValidator]"
                  label="LinkedIn"
                />
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn
                    color="secondary"
                    variant="tonal"
                    @click="currentStep--"
                  >
                    <VIcon
                      icon="ri-arrow-left-line"
                      start
                      class="flip-in-rtl"
                    />
                    Previous
                  </VBtn>

                  <VBtn
                    color="success"
                    type="submit"
                  >
                    submit
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
</template>
`},X={ts:`<script setup lang="ts">
const numberedSteps = [
  {
    title: 'Account Details',
    subtitle: 'Setup Account Details',
  },
  {
    title: 'Personal Info',
    subtitle: 'Add personal info',
  },
  {
    title: 'Social Links',
    subtitle: 'Add social links',
  },
]

const currentStep = ref(0)
const isPasswordVisible = ref(false)
const isCPasswordVisible = ref(false)

const formData = ref({
  username: '',
  email: '',
  password: '',
  cPassword: '',
  firstName: '',
  lastName: '',
  country: undefined,
  language: undefined,
  twitter: '',
  facebook: '',
  googlePlus: '',
  LinkedIn: '',

})

const onSubmit = () => {
  console.log(formData.value)
}
<\/script>

<template>
  <VCard>
    <VRow>
      <VCol
        cols="12"
        md="4"
        :class="$vuetify.display.smAndDown ? 'border-b' : 'border-e'"
      >
        <VCardText>
          <!-- 👉 Stepper -->
          <AppStepper
            v-model:current-step="currentStep"
            direction="vertical"
            :items="numberedSteps"
          />
        </VCardText>
      </VCol>
      <!-- 👉 stepper content -->
      <VCol
        cols="12"
        md="8"
      >
        <VCardText>
          <VForm>
            <VWindow
              v-model="currentStep"
              class="disable-tab-transition"
            >
              <VWindowItem>
                <VRow>
                  <VCol cols="12">
                    <h6 class="text-h6">
                      Account Details
                    </h6>
                    <p class="text-sm mb-0">
                      Enter your Account Details
                    </p>
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="formData.username"
                      placeholder="CarterLeonardo"
                      label="Username"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="formData.email"
                      placeholder="carterleonardo@gmail.com"
                      label="Email"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="formData.password"
                      placeholder="············"
                      label="Password"
                      :type="isPasswordVisible ? 'text' : 'password'"
                      autocomplete="password"
                      :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                      @click:append-inner="isPasswordVisible = !isPasswordVisible"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="formData.cPassword"
                      placeholder="············"
                      label="Confirm Password"
                      autocomplete="confirm-password"
                      :type="isCPasswordVisible ? 'text' : 'password'"
                      :append-inner-icon="isCPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                      @click:append-inner="isCPasswordVisible = !isCPasswordVisible"
                    />
                  </VCol>
                </VRow>
              </VWindowItem>

              <VWindowItem>
                <VRow>
                  <VCol cols="12">
                    <h6 class="text-h6">
                      Personal Info
                    </h6>
                    <p class="text-sm mb-0">
                      Setup Information
                    </p>
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="formData.firstName"
                      label="First Name"
                      placeholder="Leonard"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="formData.lastName"
                      label="Last Name"
                      placeholder="Carter"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VSelect
                      v-model="formData.country"
                      label="Country"
                      placeholder="Select Country"
                      :items="['UK', 'USA', 'Canada', 'Australia', 'Germany']"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VSelect
                      v-model="formData.language"
                      label="Language"
                      placeholder="Select Language"
                      :items="['English', 'Spanish', 'French', 'Russian', 'German']"
                    />
                  </VCol>
                </VRow>
              </VWindowItem>

              <VWindowItem>
                <VRow>
                  <VCol cols="12">
                    <h6 class="text-h6">
                      Social Links
                    </h6>
                    <p class="text-sm mb-0">
                      Add Social Links
                    </p>
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="formData.twitter"
                      placeholder="https://twitter.com/abc"
                      label="Twitter"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="formData.facebook"
                      placeholder="https://facebook.com/abc"
                      label="Facebook"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="formData.googlePlus"
                      placeholder="https://plus.google.com/abc"
                      label="Google+"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="formData.LinkedIn"
                      placeholder="https://linkedin.com/abc"
                      label="LinkedIn"
                    />
                  </VCol>
                </VRow>
              </VWindowItem>
            </VWindow>

            <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
              <VBtn
                color="secondary"
                variant="outlined"
                :disabled="currentStep === 0"
                @click="currentStep--"
              >
                <VIcon
                  icon="ri-arrow-left-line"
                  start
                  class="flip-in-rtl"
                />
                Previous
              </VBtn>

              <VBtn
                v-if="numberedSteps.length - 1 === currentStep"
                color="success"
                append-icon="ri-check-line"
                @click="onSubmit"
              >
                submit
              </VBtn>

              <VBtn
                v-else
                @click="currentStep++"
              >
                Next

                <VIcon
                  icon="ri-arrow-right-line"
                  end
                  class="flip-in-rtl"
                />
              </VBtn>
            </div>
          </VForm>
        </VCardText>
      </VCol>
    </VRow>
  </VCard>
</template>
`,js:`<script setup>
const numberedSteps = [
  {
    title: 'Account Details',
    subtitle: 'Setup Account Details',
  },
  {
    title: 'Personal Info',
    subtitle: 'Add personal info',
  },
  {
    title: 'Social Links',
    subtitle: 'Add social links',
  },
]

const currentStep = ref(0)
const isPasswordVisible = ref(false)
const isCPasswordVisible = ref(false)

const formData = ref({
  username: '',
  email: '',
  password: '',
  cPassword: '',
  firstName: '',
  lastName: '',
  country: undefined,
  language: undefined,
  twitter: '',
  facebook: '',
  googlePlus: '',
  LinkedIn: '',
})

const onSubmit = () => {
  console.log(formData.value)
}
<\/script>

<template>
  <VCard>
    <VRow>
      <VCol
        cols="12"
        md="4"
        :class="$vuetify.display.smAndDown ? 'border-b' : 'border-e'"
      >
        <VCardText>
          <!-- 👉 Stepper -->
          <AppStepper
            v-model:current-step="currentStep"
            direction="vertical"
            :items="numberedSteps"
          />
        </VCardText>
      </VCol>
      <!-- 👉 stepper content -->
      <VCol
        cols="12"
        md="8"
      >
        <VCardText>
          <VForm>
            <VWindow
              v-model="currentStep"
              class="disable-tab-transition"
            >
              <VWindowItem>
                <VRow>
                  <VCol cols="12">
                    <h6 class="text-h6">
                      Account Details
                    </h6>
                    <p class="text-sm mb-0">
                      Enter your Account Details
                    </p>
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="formData.username"
                      placeholder="CarterLeonardo"
                      label="Username"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="formData.email"
                      placeholder="carterleonardo@gmail.com"
                      label="Email"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="formData.password"
                      placeholder="············"
                      label="Password"
                      :type="isPasswordVisible ? 'text' : 'password'"
                      autocomplete="password"
                      :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                      @click:append-inner="isPasswordVisible = !isPasswordVisible"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="formData.cPassword"
                      placeholder="············"
                      label="Confirm Password"
                      autocomplete="confirm-password"
                      :type="isCPasswordVisible ? 'text' : 'password'"
                      :append-inner-icon="isCPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                      @click:append-inner="isCPasswordVisible = !isCPasswordVisible"
                    />
                  </VCol>
                </VRow>
              </VWindowItem>

              <VWindowItem>
                <VRow>
                  <VCol cols="12">
                    <h6 class="text-h6">
                      Personal Info
                    </h6>
                    <p class="text-sm mb-0">
                      Setup Information
                    </p>
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="formData.firstName"
                      label="First Name"
                      placeholder="Leonard"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="formData.lastName"
                      label="Last Name"
                      placeholder="Carter"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VSelect
                      v-model="formData.country"
                      label="Country"
                      placeholder="Select Country"
                      :items="['UK', 'USA', 'Canada', 'Australia', 'Germany']"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VSelect
                      v-model="formData.language"
                      label="Language"
                      placeholder="Select Language"
                      :items="['English', 'Spanish', 'French', 'Russian', 'German']"
                    />
                  </VCol>
                </VRow>
              </VWindowItem>

              <VWindowItem>
                <VRow>
                  <VCol cols="12">
                    <h6 class="text-h6">
                      Social Links
                    </h6>
                    <p class="text-sm mb-0">
                      Add Social Links
                    </p>
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="formData.twitter"
                      placeholder="https://twitter.com/abc"
                      label="Twitter"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="formData.facebook"
                      placeholder="https://facebook.com/abc"
                      label="Facebook"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="formData.googlePlus"
                      placeholder="https://plus.google.com/abc"
                      label="Google+"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="formData.LinkedIn"
                      placeholder="https://linkedin.com/abc"
                      label="LinkedIn"
                    />
                  </VCol>
                </VRow>
              </VWindowItem>
            </VWindow>

            <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
              <VBtn
                color="secondary"
                variant="outlined"
                :disabled="currentStep === 0"
                @click="currentStep--"
              >
                <VIcon
                  icon="ri-arrow-left-line"
                  start
                  class="flip-in-rtl"
                />
                Previous
              </VBtn>

              <VBtn
                v-if="numberedSteps.length - 1 === currentStep"
                color="success"
                append-icon="ri-check-line"
                @click="onSubmit"
              >
                submit
              </VBtn>

              <VBtn
                v-else
                @click="currentStep++"
              >
                Next

                <VIcon
                  icon="ri-arrow-right-line"
                  end
                  class="flip-in-rtl"
                />
              </VBtn>
            </div>
          </VForm>
        </VCardText>
      </VCol>
    </VRow>
  </VCard>
</template>
`},Y={class:"d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8"},Z={__name:"DemoFormWizardNumberedBasic",setup(U){const k=[{title:"Account Details",subtitle:"Setup Account Details"},{title:"Personal Info",subtitle:"Add personal info"},{title:"Social Links",subtitle:"Add social links"}],d=V(0),p=V(!1),b=V(!1),r=V({username:"",email:"",password:"",cPassword:"",firstName:"",lastName:"",country:void 0,language:void 0,twitter:"",facebook:"",googlePlus:"",linkedIn:""}),h=()=>{console.log(r.value)};return(D,a)=>{const f=W;return x(),P(q,null,{default:o(()=>[e(A,null,{default:o(()=>[e(f,{"current-step":l(d),"onUpdate:currentStep":a[0]||(a[0]=t=>I(d)?d.value=t:null),items:k},null,8,["current-step"])]),_:1}),e(j),e(A,null,{default:o(()=>[e(T,null,{default:o(()=>[e(R,{modelValue:l(d),"onUpdate:modelValue":a[15]||(a[15]=t=>I(d)?d.value=t:null),class:"disable-tab-transition"},{default:o(()=>[e(y,null,{default:o(()=>[e(S,null,{default:o(()=>[e(i,{cols:"12"},{default:o(()=>a[18]||(a[18]=[c("h6",{class:"text-h6"}," Account Details ",-1),c("p",{class:"text-sm mb-0"}," Enter your Account Details ",-1)])),_:1,__:[18]}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(r).username,"onUpdate:modelValue":a[1]||(a[1]=t=>l(r).username=t),placeholder:"CarterLeonardo",label:"Username"},null,8,["modelValue"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(r).email,"onUpdate:modelValue":a[2]||(a[2]=t=>l(r).email=t),placeholder:"carterleonardo@gmail.com",label:"Email"},null,8,["modelValue"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(r).password,"onUpdate:modelValue":a[3]||(a[3]=t=>l(r).password=t),label:"Password",placeholder:"············",type:l(p)?"text":"password",autocomplete:"password","append-inner-icon":l(p)?"ri-eye-off-line":"ri-eye-line","onClick:appendInner":a[4]||(a[4]=t=>p.value=!l(p))},null,8,["modelValue","type","append-inner-icon"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(r).cPassword,"onUpdate:modelValue":a[5]||(a[5]=t=>l(r).cPassword=t),label:"Confirm Password",autocomplete:"confirm-password",placeholder:"············",type:l(b)?"text":"password","append-inner-icon":l(b)?"ri-eye-off-line":"ri-eye-line","onClick:appendInner":a[6]||(a[6]=t=>b.value=!l(b))},null,8,["modelValue","type","append-inner-icon"])]),_:1})]),_:1})]),_:1}),e(y,null,{default:o(()=>[e(S,null,{default:o(()=>[e(i,{cols:"12"},{default:o(()=>a[19]||(a[19]=[c("h6",{class:"text-h6"}," Personal Info ",-1),c("p",{class:"text-sm mb-0"}," Setup Information ",-1)])),_:1,__:[19]}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(r).firstName,"onUpdate:modelValue":a[7]||(a[7]=t=>l(r).firstName=t),label:"First Name",placeholder:"Leonard"},null,8,["modelValue"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(r).lastName,"onUpdate:modelValue":a[8]||(a[8]=t=>l(r).lastName=t),label:"Last Name",placeholder:"Carter"},null,8,["modelValue"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(L,{modelValue:l(r).country,"onUpdate:modelValue":a[9]||(a[9]=t=>l(r).country=t),label:"Country",placeholder:"Select Country",items:["UK","USA","Canada","Australia","Germany"]},null,8,["modelValue"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(L,{modelValue:l(r).language,"onUpdate:modelValue":a[10]||(a[10]=t=>l(r).language=t),label:"Language",placeholder:"Select Language",items:["English","Spanish","French","Russian","German"]},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),e(y,null,{default:o(()=>[e(S,null,{default:o(()=>[e(i,{cols:"12"},{default:o(()=>a[20]||(a[20]=[c("h6",{class:"text-h6"}," Social Links ",-1),c("p",{class:"text-sm mb-0"}," Add Social Links ",-1)])),_:1,__:[20]}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(r).twitter,"onUpdate:modelValue":a[11]||(a[11]=t=>l(r).twitter=t),placeholder:"https://twitter.com/abc",label:"Twitter"},null,8,["modelValue"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(r).facebook,"onUpdate:modelValue":a[12]||(a[12]=t=>l(r).facebook=t),placeholder:"https://facebook.com/abc",label:"Facebook"},null,8,["modelValue"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(r).googlePlus,"onUpdate:modelValue":a[13]||(a[13]=t=>l(r).googlePlus=t),placeholder:"https://plus.google.com/abc",label:"Google+"},null,8,["modelValue"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(r).linkedIn,"onUpdate:modelValue":a[14]||(a[14]=t=>l(r).linkedIn=t),placeholder:"https://linkedin.com/abc",label:"LinkedIn"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"]),c("div",Y,[e(v,{color:"secondary",variant:"outlined",disabled:l(d)===0,onClick:a[16]||(a[16]=t=>d.value--)},{default:o(()=>[e(F,{icon:"ri-arrow-left-line",start:"",class:"flip-in-rtl"}),a[21]||(a[21]=C(" Previous "))]),_:1,__:[21]},8,["disabled"]),k.length-1===l(d)?(x(),P(v,{key:0,color:"success","append-icon":"ri-check-line",onClick:h},{default:o(()=>a[22]||(a[22]=[C(" submit ")])),_:1,__:[22]})):(x(),P(v,{key:1,onClick:a[17]||(a[17]=t=>d.value++)},{default:o(()=>[a[23]||(a[23]=C(" Next ")),e(F,{icon:"ri-arrow-right-line",end:"",class:"flip-in-rtl"})]),_:1,__:[23]}))])]),_:1})]),_:1})]),_:1})}}},ee={class:"d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8"},le={class:"d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8"},oe={class:"d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8"},ae={__name:"DemoFormWizardNumberedValidation",setup(U){const k=[{title:"Account Details",subtitle:"Setup Account Details"},{title:"Personal Info",subtitle:"Add personal info"},{title:"Social Links",subtitle:"Add social links"}],d=V(0),p=V(!1),b=V(!1),r=V(!0),h=V(),D=V(),a=V(),f=V({username:"",email:"",password:"",cPassword:""}),t=V({firstName:"",lastName:"",country:void 0,language:void 0}),g=V({twitter:"",facebook:"",googlePlus:"",linkedIn:""}),E=()=>{var n;(n=h.value)==null||n.validate().then(s=>{s.valid?(d.value++,r.value=!0):r.value=!1})},G=()=>{var n;(n=D.value)==null||n.validate().then(s=>{s.valid?(d.value++,r.value=!0):r.value=!1})},$=()=>{var n;(n=a.value)==null||n.validate().then(s=>{s.valid?(r.value=!0,console.log({...f.value,...t.value,...g.value})):r.value=!1})};return(n,s)=>{const _=W;return x(),P(q,null,{default:o(()=>[e(A,null,{default:o(()=>[e(_,{"current-step":l(d),"onUpdate:currentStep":s[0]||(s[0]=u=>I(d)?d.value=u:null),items:k,"is-active-step-valid":l(r)},null,8,["current-step","is-active-step-valid"])]),_:1}),e(j),e(A,null,{default:o(()=>[e(R,{modelValue:l(d),"onUpdate:modelValue":s[17]||(s[17]=u=>I(d)?d.value=u:null),class:"disable-tab-transition"},{default:o(()=>[e(y,null,{default:o(()=>[e(l(T),{ref_key:"refAccountForm",ref:h,onSubmit:B(E,["prevent"])},{default:o(()=>[e(S,null,{default:o(()=>[e(i,{cols:"12"},{default:o(()=>s[18]||(s[18]=[c("h6",{class:"text-h6"}," Account Details ",-1),c("p",{class:"text-sm mb-0"}," Enter your Account Details ",-1)])),_:1,__:[18]}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(f).username,"onUpdate:modelValue":s[1]||(s[1]=u=>l(f).username=u),placeholder:"CarterLeonardo",rules:["requiredValidator"in n?n.requiredValidator:l(w)],label:"Username"},null,8,["modelValue","rules"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(f).email,"onUpdate:modelValue":s[2]||(s[2]=u=>l(f).email=u),placeholder:"carterleonardo@gmail.com",rules:["requiredValidator"in n?n.requiredValidator:l(w),"emailValidator"in n?n.emailValidator:l(K)],label:"Email"},null,8,["modelValue","rules"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(f).password,"onUpdate:modelValue":s[3]||(s[3]=u=>l(f).password=u),label:"Password",placeholder:"············",rules:["requiredValidator"in n?n.requiredValidator:l(w),"passwordValidator"in n?n.passwordValidator:l(z)],type:l(p)?"text":"password",autocomplete:"password","append-inner-icon":l(p)?"ri-eye-off-line":"ri-eye-line","onClick:appendInner":s[4]||(s[4]=u=>p.value=!l(p))},null,8,["modelValue","rules","type","append-inner-icon"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(f).cPassword,"onUpdate:modelValue":s[5]||(s[5]=u=>l(f).cPassword=u),label:"Confirm Password",autocomplete:"confirm-password",placeholder:"············",rules:["requiredValidator"in n?n.requiredValidator:l(w),("confirmedValidator"in n?n.confirmedValidator:l(M))(l(f).cPassword,l(f).password)],type:l(b)?"text":"password","append-inner-icon":l(b)?"ri-eye-off-line":"ri-eye-line","onClick:appendInner":s[6]||(s[6]=u=>b.value=!l(b))},null,8,["modelValue","rules","type","append-inner-icon"])]),_:1}),e(i,{cols:"12"},{default:o(()=>[c("div",ee,[e(v,{color:"secondary",variant:"outlined",disabled:""},{default:o(()=>[e(F,{icon:"ri-arrow-left-line",start:"",class:"flip-in-rtl"}),s[19]||(s[19]=C(" Previous "))]),_:1,__:[19]}),e(v,{type:"submit"},{default:o(()=>[s[20]||(s[20]=C(" Next ")),e(F,{icon:"ri-arrow-right-line",end:"",class:"flip-in-rtl"})]),_:1,__:[20]})])]),_:1})]),_:1})]),_:1},512)]),_:1}),e(y,null,{default:o(()=>[e(l(T),{ref_key:"refPersonalForm",ref:D,onSubmit:B(G,["prevent"])},{default:o(()=>[e(S,null,{default:o(()=>[e(i,{cols:"12"},{default:o(()=>s[21]||(s[21]=[c("h6",{class:"text-h6"}," Personal Info ",-1),c("p",{class:"text-sm mb-0"}," Setup Information ",-1)])),_:1,__:[21]}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(t).firstName,"onUpdate:modelValue":s[7]||(s[7]=u=>l(t).firstName=u),label:"First Name",rules:["requiredValidator"in n?n.requiredValidator:l(w)],placeholder:"Leonard"},null,8,["modelValue","rules"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(t).lastName,"onUpdate:modelValue":s[8]||(s[8]=u=>l(t).lastName=u),label:"Last Name",rules:["requiredValidator"in n?n.requiredValidator:l(w)],placeholder:"Carter"},null,8,["modelValue","rules"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(L,{modelValue:l(t).country,"onUpdate:modelValue":s[9]||(s[9]=u=>l(t).country=u),label:"Country",rules:["requiredValidator"in n?n.requiredValidator:l(w)],placeholder:"Select Country",items:["UK","USA","Canada","Australia","Germany"]},null,8,["modelValue","rules"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(L,{modelValue:l(t).language,"onUpdate:modelValue":s[10]||(s[10]=u=>l(t).language=u),label:"Language",rules:["requiredValidator"in n?n.requiredValidator:l(w)],placeholder:"Select Language",items:["English","Spanish","French","Russian","German"]},null,8,["modelValue","rules"])]),_:1}),e(i,{cols:"12"},{default:o(()=>[c("div",le,[e(v,{color:"secondary",variant:"tonal",onClick:s[11]||(s[11]=u=>d.value--)},{default:o(()=>[e(F,{icon:"ri-arrow-left-line",start:"",class:"flip-in-rtl"}),s[22]||(s[22]=C(" Previous "))]),_:1,__:[22]}),e(v,{type:"submit"},{default:o(()=>[s[23]||(s[23]=C(" Next ")),e(F,{icon:"ri-arrow-right-line",end:"",class:"flip-in-rtl"})]),_:1,__:[23]})])]),_:1})]),_:1})]),_:1},512)]),_:1}),e(y,null,{default:o(()=>[e(l(T),{ref_key:"refSocialLinkForm",ref:a,onSubmit:B($,["prevent"])},{default:o(()=>[e(S,null,{default:o(()=>[e(i,{cols:"12"},{default:o(()=>s[24]||(s[24]=[c("h6",{class:"text-h6"}," Social Links ",-1),c("p",{class:"text-sm mb-0"}," Add Social Links ",-1)])),_:1,__:[24]}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(g).twitter,"onUpdate:modelValue":s[12]||(s[12]=u=>l(g).twitter=u),placeholder:"https://twitter.com/abc",rules:["requiredValidator"in n?n.requiredValidator:l(w),"urlValidator"in n?n.urlValidator:l(N)],label:"Twitter"},null,8,["modelValue","rules"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(g).facebook,"onUpdate:modelValue":s[13]||(s[13]=u=>l(g).facebook=u),placeholder:"https://facebook.com/abc",rules:["requiredValidator"in n?n.requiredValidator:l(w),"urlValidator"in n?n.urlValidator:l(N)],label:"Facebook"},null,8,["modelValue","rules"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(g).googlePlus,"onUpdate:modelValue":s[14]||(s[14]=u=>l(g).googlePlus=u),placeholder:"https://plus.google.com/abc",rules:["requiredValidator"in n?n.requiredValidator:l(w),"urlValidator"in n?n.urlValidator:l(N)],label:"Google+"},null,8,["modelValue","rules"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(g).linkedIn,"onUpdate:modelValue":s[15]||(s[15]=u=>l(g).linkedIn=u),placeholder:"https://likedin.com/abc",rules:["requiredValidator"in n?n.requiredValidator:l(w),"urlValidator"in n?n.urlValidator:l(N)],label:"LinkedIn"},null,8,["modelValue","rules"])]),_:1}),e(i,{cols:"12"},{default:o(()=>[c("div",oe,[e(v,{color:"secondary",variant:"tonal",onClick:s[16]||(s[16]=u=>d.value--)},{default:o(()=>[e(F,{icon:"ri-arrow-left-line",start:"",class:"flip-in-rtl"}),s[25]||(s[25]=C(" Previous "))]),_:1,__:[25]}),e(v,{color:"success",type:"submit"},{default:o(()=>s[26]||(s[26]=[C(" submit ")])),_:1,__:[26]})])]),_:1})]),_:1})]),_:1},512)]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})}}},te={class:"d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8"},se={__name:"DemoFormWizardNumberedVertical",setup(U){const k=[{title:"Account Details",subtitle:"Setup Account Details"},{title:"Personal Info",subtitle:"Add personal info"},{title:"Social Links",subtitle:"Add social links"}],d=V(0),p=V(!1),b=V(!1),r=V({username:"",email:"",password:"",cPassword:"",firstName:"",lastName:"",country:void 0,language:void 0,twitter:"",facebook:"",googlePlus:"",linkedIn:""}),h=()=>{console.log(r.value)};return(D,a)=>{const f=W;return x(),P(q,null,{default:o(()=>[e(S,null,{default:o(()=>[e(i,{cols:"12",md:"4",class:H(D.$vuetify.display.smAndDown?"border-b":"border-e")},{default:o(()=>[e(A,null,{default:o(()=>[e(f,{"current-step":l(d),"onUpdate:currentStep":a[0]||(a[0]=t=>I(d)?d.value=t:null),direction:"vertical",items:k},null,8,["current-step"])]),_:1})]),_:1},8,["class"]),e(i,{cols:"12",md:"8"},{default:o(()=>[e(A,null,{default:o(()=>[e(T,null,{default:o(()=>[e(R,{modelValue:l(d),"onUpdate:modelValue":a[15]||(a[15]=t=>I(d)?d.value=t:null),class:"disable-tab-transition"},{default:o(()=>[e(y,null,{default:o(()=>[e(S,null,{default:o(()=>[e(i,{cols:"12"},{default:o(()=>a[18]||(a[18]=[c("h6",{class:"text-h6"}," Account Details ",-1),c("p",{class:"text-sm mb-0"}," Enter your Account Details ",-1)])),_:1,__:[18]}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(r).username,"onUpdate:modelValue":a[1]||(a[1]=t=>l(r).username=t),placeholder:"CarterLeonardo",label:"Username"},null,8,["modelValue"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(r).email,"onUpdate:modelValue":a[2]||(a[2]=t=>l(r).email=t),placeholder:"carterleonardo@gmail.com",label:"Email"},null,8,["modelValue"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(r).password,"onUpdate:modelValue":a[3]||(a[3]=t=>l(r).password=t),placeholder:"············",label:"Password",type:l(p)?"text":"password",autocomplete:"password","append-inner-icon":l(p)?"ri-eye-off-line":"ri-eye-line","onClick:appendInner":a[4]||(a[4]=t=>p.value=!l(p))},null,8,["modelValue","type","append-inner-icon"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(r).cPassword,"onUpdate:modelValue":a[5]||(a[5]=t=>l(r).cPassword=t),placeholder:"············",label:"Confirm Password",autocomplete:"confirm-password",type:l(b)?"text":"password","append-inner-icon":l(b)?"ri-eye-off-line":"ri-eye-line","onClick:appendInner":a[6]||(a[6]=t=>b.value=!l(b))},null,8,["modelValue","type","append-inner-icon"])]),_:1})]),_:1})]),_:1}),e(y,null,{default:o(()=>[e(S,null,{default:o(()=>[e(i,{cols:"12"},{default:o(()=>a[19]||(a[19]=[c("h6",{class:"text-h6"}," Personal Info ",-1),c("p",{class:"text-sm mb-0"}," Setup Information ",-1)])),_:1,__:[19]}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(r).firstName,"onUpdate:modelValue":a[7]||(a[7]=t=>l(r).firstName=t),label:"First Name",placeholder:"Leonard"},null,8,["modelValue"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(r).lastName,"onUpdate:modelValue":a[8]||(a[8]=t=>l(r).lastName=t),label:"Last Name",placeholder:"Carter"},null,8,["modelValue"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(L,{modelValue:l(r).country,"onUpdate:modelValue":a[9]||(a[9]=t=>l(r).country=t),label:"Country",placeholder:"Select Country",items:["UK","USA","Canada","Australia","Germany"]},null,8,["modelValue"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(L,{modelValue:l(r).language,"onUpdate:modelValue":a[10]||(a[10]=t=>l(r).language=t),label:"Language",placeholder:"Select Language",items:["English","Spanish","French","Russian","German"]},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),e(y,null,{default:o(()=>[e(S,null,{default:o(()=>[e(i,{cols:"12"},{default:o(()=>a[20]||(a[20]=[c("h6",{class:"text-h6"}," Social Links ",-1),c("p",{class:"text-sm mb-0"}," Add Social Links ",-1)])),_:1,__:[20]}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(r).twitter,"onUpdate:modelValue":a[11]||(a[11]=t=>l(r).twitter=t),placeholder:"https://twitter.com/abc",label:"Twitter"},null,8,["modelValue"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(r).facebook,"onUpdate:modelValue":a[12]||(a[12]=t=>l(r).facebook=t),placeholder:"https://facebook.com/abc",label:"Facebook"},null,8,["modelValue"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(r).googlePlus,"onUpdate:modelValue":a[13]||(a[13]=t=>l(r).googlePlus=t),placeholder:"https://plus.google.com/abc",label:"Google+"},null,8,["modelValue"])]),_:1}),e(i,{cols:"12",md:"6"},{default:o(()=>[e(m,{modelValue:l(r).linkedIn,"onUpdate:modelValue":a[14]||(a[14]=t=>l(r).linkedIn=t),placeholder:"https://linkedin.com/abc",label:"LinkedIn"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"]),c("div",te,[e(v,{color:"secondary",variant:"outlined",disabled:l(d)===0,onClick:a[16]||(a[16]=t=>d.value--)},{default:o(()=>[e(F,{icon:"ri-arrow-left-line",start:"",class:"flip-in-rtl"}),a[21]||(a[21]=C(" Previous "))]),_:1,__:[21]},8,["disabled"]),k.length-1===l(d)?(x(),P(v,{key:0,color:"success","append-icon":"ri-check-line",onClick:h},{default:o(()=>a[22]||(a[22]=[C(" submit ")])),_:1,__:[22]})):(x(),P(v,{key:1,onClick:a[17]||(a[17]=t=>d.value++)},{default:o(()=>[a[23]||(a[23]=C(" Next ")),e(F,{icon:"ri-arrow-right-line",end:"",class:"flip-in-rtl"})]),_:1,__:[23]}))])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}}},ne={__name:"form-wizard-numbered",setup(U){return(k,d)=>{const p=J;return x(),P(S,null,{default:o(()=>[e(i,{cols:"12"},{default:o(()=>[e(p,{variant:"outlined",title:"Basic",code:l(O)},{default:o(()=>[e(Z)]),_:1},8,["code"])]),_:1}),e(i,{cols:"12"},{default:o(()=>[e(p,{variant:"outlined",title:"Validation",code:l(Q)},{default:o(()=>[e(ae)]),_:1},8,["code"])]),_:1}),e(i,{cols:"12"},{default:o(()=>[e(p,{variant:"outlined",title:"Vertical",code:l(X)},{default:o(()=>[e(se)]),_:1},8,["code"])]),_:1})]),_:1})}}};export{ne as default};
