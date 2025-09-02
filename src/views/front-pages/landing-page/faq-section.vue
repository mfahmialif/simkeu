<script setup>
import sittingBoyWithLaptop from '@images/front-pages/landing-page/sittingBoyWithLaptop.png'
import sectionTitleIcon from '@images/pages/section-title-icon.png'
import frontPageElement from '@images/svg/front-page-element.svg'

const faqData = [
  {
    question: 'Siapa yang berhak mengakses SIMKEU?',
    answer: 'SIMKEU dapat diakses oleh Pimpinan Keuangan dan staf administrasi di Universitas Islam Internasional Darullughah Wadda\'wah yang memiliki kredensial akses yang sah.',
  },
  {
    question: 'Apakah SIMKEU dapat diakses diluar Universitas?',
    answer: 'SIMKEU dapat diakses diluar Universitas dengan syarat memiliki koneksi internet yang stabil dan kredensial akses yang sah.',
  },
  {
    question: 'Apa yang harus dilakukan jika lupa password?',
    answer: 'Jika lupa password, pengguna dapat menghubungi administrator sistem di Universitas Islam Internasional Darullughah Wadda\'wah untuk mendapatkan bantuan dalam mereset password mereka.',
  },
  {
    question: 'Bagaimana cara melakukan pembayaran dan cek status pembayaranmelalui SIMKEU?',
    answer: 'Tutorial akan disampaikan pada bagian dashboard setelah login.',
  },
  {
    question: 'Apa yang harus dilakukan jika SIMKEU tidak bisa diakses?',
    answer: 'Jika SIMKEU tidak bisa diakses, pengguna dapat mencoba beberapa langkah berikut: Periksa koneksi internet, Bersihkan cache dan cookies pada browser, Coba akses menggunakan browser lain, Hubungi administrator sistem di Universitas Islam Internasional Darullughah Wadda\'wah jika masalah tetap berlanjut.',
  },
  {
    question: 'Bagaimana cara menghubungi tim dukungan teknis jika mengalami masalah dengan SIMKEU?',
    answer: 'Pengguna dapat menghubungi tim dukungan teknis melalui email administrasi di Universitas Islam Internasional Darullughah Wadda\'wah.',
  },
]
</script>

<template>
  <VContainer id="faq">
    <!-- 👉 Header  -->
    <div class="faq-section">
      <div class="headers d-flex justify-center flex-column align-center mt-12 mb-16">
        <Component :is="frontPageElement" class="front-page-element" />
        <div class="d-flex gap-x-3 mb-6">
          <img :src="sectionTitleIcon" alt="section title icon" height="24" width="25">
          <div class="text-body-1 text-high-emphasis font-weight-medium" style="letter-spacing: 0.15px !important;">
            FAQ
          </div>
        </div>

        <div class="mb-2 text-center">
          <span class="text-h5 d-inline-block">Frequently Asked</span> <span
            class="text-h4 d-inline-block font-weight-bold" style="line-height: 2rem;">
            questions
          </span>
        </div>

        <p class="text-body-1 font-weight-medium text-center mb-0">
          Berikut beberapa pertanyaan yang sering diajukan terkait SIMKEU.
        </p>
      </div>

      <div class="d-flex align-center justify-space-between flex-wrap flex-md-nowrap pb-4" style="gap: 6.25rem;">
        <VImg :src="sittingBoyWithLaptop" height="340" width="320" class="flip-in-rtl" />

        <div>
          <VExpansionPanels class="py-4">
            <VExpansionPanel v-for="faq in faqData" :key="faq.question">
              <VExpansionPanelTitle>
                {{ faq.question }}
              </VExpansionPanelTitle>
              <VExpansionPanelText>
                {{ faq.answer }}
              </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>
        </div>
      </div>
    </div>
  </VContainer>
</template>

<style lang="scss" scoped>
.faq-section {
  position: relative;
  margin-block: 5.25rem 4.25rem;
}

.front-page-element {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;
}
</style>
