<script setup>
import sectionTitleIcon from '@images/pages/section-title-icon.png'
import frontPageVectorImg from '@images/svg/front-page-vector.svg'

const name = ref('')
const email = ref('')
const message = ref('')
</script>

<template>
  <VContainer id="contact-us">
    <!-- 👉 Headers  -->
    <div class="contact-us-section">
      <div class="headers d-flex justify-center flex-column align-center pb-15">
        <Component :is="frontPageVectorImg" class="front-page-vector" />
        <div class="d-flex gap-x-3 mb-6">
          <img :src="sectionTitleIcon" alt="section title icon" height="24" width="25">
          <div class="text-body-1 text-high-emphasis font-weight-medium">
            CONTACT US
          </div>
        </div>

        <div class="mb-2 text-center">
          <span class="text-h4 d-inline-block font-weight-bold" style="line-height: 2rem;">
            Apa bila ada kendala maupun pertanyaan seputar SIMKEU, silahkan hubungi kami
          </span>
        </div>

        <p class="text-body-1 font-weight-medium text-center mb-0">
          08xxxxxxxxxxxxx
        </p>
        <p class="text-body-1 font-weight-medium text-center mb-0">
          email@gmail.com
        </p>
      </div>

    </div>
  </VContainer>
</template>

<style lang="scss" scoped>
.contact-us-section {
  position: relative;
  margin-block: 5.25rem;
}

.front-page-vector {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
}
</style>
