<script setup>
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';


</script>

<template>
  <div class="footer">
    <!-- Bagian atas full width -->
    <VSheet class="footer-top pt-8 pb-4" theme="dark">
      <VContainer>
        <VRow justify="center">
          <VCol cols="2" md="8" class="d-flex flex-column align-center text-center">
            <div class="footer-form">
              <div class="d-flex align-center justify-center py-1 mb-3">
                <VNodeRenderer :nodes="themeConfig.app.logo" />
                <h1 class="footer-title ml-2">
                  {{ themeConfig.app.title }}
                </h1>
              </div>
              <div class="text-body-1 footer-text mb-3">
                SIMKEU is the best way to manage your finances and accounting.
              </div>
              <div class="text-body-1 footer-text mb-3">
                Start working with SIMKEU that can provide everything you need
                to generate awareness, drive traffic, connect.
              </div>
            </div>
          </VCol>
        </VRow>
      </VContainer>
    </VSheet>

    <!-- Garis bawah -->
    <div class="footer-line w-100">
      <VContainer>
        <VRow justify="center">
          <VCol cols="12" md="8" class="d-flex justify-center text-center">
            <span class="d-flex align-center text-body-2 footer-heading font-weight-regular">
              &copy; Tim IT Universitas Islam Internasional Darullughah Wadda'wah
              {{ new Date().getFullYear() }},
              Made with
              <VIcon icon="ri-heart-fill" color="#FF4D49" class="ml-1" />
            </span>
          </VCol>
        </VRow>
      </VContainer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer-top {
  background: url("@images/front-pages/backgrounds/footer-bg.png") lightgray 50% / cover no-repeat;
}

.footer-heading {
  color: rgba(255, 255, 255, var(--v-high-emphasis-opacity));
  font-weight: 500;
  line-height: 22px;
}

.footer-text {
  color: rgba(255, 255, 255, var(--v-medium-emphasis-opacity));
}

.footer-title {
  color: rgba(255, 255, 255, var(--v-high-emphasis-opacity));
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.27px;
  line-height: 1.5rem;
  text-transform: capitalize;
}

.footer-line {
  background: #211b2c;
  color: rgba(255, 255, 255, var(--v-medium-emphasis-opacity));
  font-size: 13px;
  line-height: 20px;
}

.footer {
  color: rgba(255, 255, 255, 70%);
}

.footer-links {
  .footer-text:hover {
    color: #fff;
  }
}
</style>

<style lang="scss">
.footer {
  @media (min-width: 600px) and (max-width: 960px) {
    .v-container {
      padding-inline: 2rem !important;
    }

    .footer-logo-buttons {
      gap: 0.5rem;
    }
  }
}

.footer-form {
  @media (min-width: 1280px) {
    max-inline-size: 400px;
  }
}
</style>
