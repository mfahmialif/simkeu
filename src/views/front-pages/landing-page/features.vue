<script setup>
import sectionTitleIcon from '@images/pages/section-title-icon.png'
import PemasukanIcon from '@images/svg/7.svg'
import SaldoKeuanganIcon from '@images/svg/9.svg'
import PengeluaranIcon from '@images/svg/pengeluaran.svg'

const featuresData = [
  {
    title: 'Pemasukan Keuangan',
    desc: 'Fitur ini dibuat untuk memudahkan dalam mencatat pemasukan keuangan yang ada di Universitas Islam Internasional Darullughah Wadda\'wah.',
    img: PemasukanIcon,
  },
  {
    title: 'Pengeluaran Keuangan',
    desc: 'Fitur ini dibuat untuk memudahkan dalam mencatat pengeluaran keuangan yang ada di Universitas Islam Internasional Darullughah Wadda\'wah.',
    img: PengeluaranIcon,
  },
  {
    title: 'Saldo Keuangan',
    desc: 'Fitur ini dibuat untuk memudahkan dalam memantau saldo keuangan yang ada di Universitas Islam Internasional Darullughah Wadda\'wah.',
    img: SaldoKeuanganIcon,
  },

]
</script>

<template>
  <VContainer id="features">
    <div class="feature-cards">
      <div class="headers d-flex justify-center flex-column align-center mb-6">
        <div class="d-flex gap-x-3 mb-6">
          <img :src="sectionTitleIcon" alt="section title icon" height="24" width="25">
          <div class="text-body-1 text-high-emphasis font-weight-medium">
            FEATURES on SIMKEU UII DALWA
          </div>
        </div>

        <div class="mb-2 text-center">
          <span class="text-h4 d-inline-block font-weight-bold" style="line-height: 2rem;">
            Fitur yang dibutuhkan
          </span> <span class="text-h5 d-inline-block">untuk mengatur keuangan</span>
        </div>

        <p class="text-body-1 font-weight-medium text-center">
          Fitur yang ada pada aplikasi SIMKEU UII DALWA dirancang untuk memudahkan dalam mengatur keuangan di
          Universitas
          Islam Internasional Darullughah Wadda'wah.
        </p>
      </div>

      <VRow>
        <VCol v-for="(data, index) in featuresData" :key="index" cols="12" sm="6" md="4">
          <div class="feature d-flex flex-column gap-y-2 align-center justify-center mt-2">
            <VAvatar variant="outlined" size="82" color="primary" class="mb-2">
              <Component :is="data.img" />
            </VAvatar>

            <h5 class="text-h5">
              {{ data.title }}
            </h5>
            <p class="text-center text-medium-emphasis" style="max-inline-size: 360px;">
              {{ data.desc }}
            </p>
          </div>
        </VCol>
      </VRow>
    </div>
  </VContainer>
</template>

<style lang="scss" scoped>
.feature-cards {
  margin-block-end: 4.25rem;
}

#features {
  padding-block-start: 13rem;
}

@media (max-width: 960px) {
  #features {
    padding-block-start: 6rem;
  }
}

@media (max-width: 600px) {
  #features {
    padding-block-start: 2rem;
  }
}
</style>

<style lang="scss" scoped>
.feature {
  .v-avatar {
    &.v-avatar--variant-outlined {
      border: 2px solid rgba(var(--v-theme-primary), 0.32);

      &:hover {
        background: rgba(var(--v-theme-primary), 0.16);
        cursor: pointer;
      }
    }
  }
}
</style>
