<script setup>
import { showSnackbar } from "@/composables/snackbar";

const logisticData = ref([
  {
    icon: "ri-money-dollar-box-line",
    color: "primary",
    title: "Saldo",
    value: 0,
    change: 0,
    isHover: false,
  },
  {
    icon: "ri-arrow-left-down-line",
    color: "success",
    title: "Pemasukan",
    value: 0,
    change: 0,
    isHover: false,
  },
  {
    icon: "ri-arrow-right-up-line",
    color: "error",
    title: "Pengeluaran",
    value: 0,
    change: 0,
    isHover: false,
  },
  {
    icon: "ri-user-line",
    color: "info",
    title: "User",
    value: 0,
    change: 0,
    isHover: false,
  },
]);

const isLoading = ref(false);
const fetchData = async () => {
  isLoading.value = true;
  const response = await $api("/admin/dashboard/widget");
  isLoading.value = false;
  if (response.status) {
    logisticData.value = [
      {
        icon: "ri-money-dollar-box-line",
        color: "primary",
        title: "Saldo",
        value: formatRupiah(response.data.saldo),
        change: response.data.jumlahSaldo,
        isHover: false,
      },
      {
        icon: "ri-arrow-left-down-line",
        color: "success",
        title: "Pemasukan",
        value: formatRupiah(response.data.pemasukanHarian || 0),
        change: response.data.jumlahPemasukanHarian || 0,
        isHover: false,
        isPemasukan: true,
        breakdown: (() => {
          const breakdown = {};
          if (response.data.pemasukanBreakdown) {
            for (const [period, genders] of Object.entries(response.data.pemasukanBreakdown)) {
              breakdown[period] = {};
              for (const [gender, item] of Object.entries(genders)) {
                breakdown[period][gender] = {
                  value: formatRupiah(item.value || 0),
                  change: item.change || 0,
                  hideIfZero: item.hideIfZero || false
                };
              }
            }
          }
          return breakdown;
        })(),
      },
      {
        icon: "ri-arrow-right-up-line",
        color: "error",
        title: "Pengeluaran",
        value: formatRupiah(response.data.pengeluaran),
        change: response.data.jumlahPengeluaran,
        isHover: false,
      },
      {
        icon: "ri-user-line",
        color: "info",
        title: "User",
        value: response.data.jumlahUser,
        change: response.data.jumlahUser,
        isHover: false,
      },
    ];
  } else {
    showSnackbar({
      text: response.message,
      color: "error",
    });
  }
};

const isModalOpen = ref(false);
const selectedData = ref(null);

const openDetailModal = (data) => {
  selectedData.value = data;
  isModalOpen.value = true;
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <VRow>
    <VCol
      v-for="(data, index) in logisticData"
      :key="index"
      cols="12"
      md="3"
      sm="6"
    >
      <div>
        <VCard
          class="logistics-card-statistics cursor-pointer"
          :style="
            data.isHover
              ? `border-block-end-color: rgb(var(--v-theme-${data.color}))`
              : `border-block-end-color: rgba(var(--v-theme-${data.color}),0.38)`
          "
          @mouseenter="data.isHover = true"
          @mouseleave="data.isHover = false"
          @click="openDetailModal(data)"
        >
          <VCardText>
            <VSkeletonLoader v-if="isLoading" type="paragraph"></VSkeletonLoader>
            <template v-else>
              <div class="d-flex align-center gap-x-4 mb-2">
                <VAvatar variant="tonal" :color="data.color" rounded="lg">
                  <VIcon :icon="data.icon" size="24" />
                </VAvatar>
                <div style="min-width: 0;">
                  <h4 class="text-h4 text-truncate" :title="data.value">
                    {{ data.value }}
                  </h4>
                </div>
              </div>
              <h6 class="text-h6 font-weight-regular">
                {{ data.title }}
              </h6>
              <div class="d-flex align-center">
                <div class="text-body-1 font-weight-medium me-2">
                  {{ data.change }}
                </div>
                <span class="text-sm text-disabled">Total Data</span>
              </div>
            </template>
          </VCardText>
        </VCard>
      </div>
    </VCol>
  </VRow>

  <VDialog v-model="isModalOpen" max-width="550" scrollable>
    <VCard>
      <VCardItem class="pb-2">
        <VCardTitle class="text-h5">
          Detail {{ selectedData?.title }}
        </VCardTitle>
      </VCardItem>
      <VCardText style="max-height: 600px; overflow-y: auto;">
        <template v-if="selectedData?.isPemasukan">
          <div class="d-flex flex-column gap-y-6">
            <template v-for="(genders, period) in selectedData.breakdown" :key="period">
              <VCard variant="outlined" class="pa-4">
                <h5 class="text-h5 mb-4 text-primary">Pemasukan {{ period }}</h5>
                <div class="d-flex flex-column gap-y-4">
                  <template v-for="(item, gender) in genders" :key="gender">
                    <template v-if="!(item.hideIfZero && item.change === 0)">
                      <div class="d-flex align-center gap-x-3">
                        <VAvatar :color="selectedData?.color" variant="tonal" rounded>
                          <VIcon :icon="selectedData?.icon" size="24" />
                        </VAvatar>
                        <div class="flex-grow-1">
                          <div class="text-body-1 font-weight-medium">{{ gender }}</div>
                          <h4 class="text-h4">{{ item.value }}</h4>
                        </div>
                        <div class="text-right">
                          <span class="text-body-2 text-disabled">Total Data</span>
                          <div class="text-h6">{{ item.change }}</div>
                        </div>
                      </div>
                      <VDivider v-if="gender !== 'Keseluruhan'" />
                    </template>
                  </template>
                </div>
              </VCard>
            </template>
          </div>
        </template>
        <template v-else>
          <div class="d-flex flex-column gap-y-3">
            <div class="d-flex align-center gap-x-3">
              <VAvatar :color="selectedData?.color" variant="tonal" rounded>
                <VIcon :icon="selectedData?.icon" size="24" />
              </VAvatar>
              <div>
                <div class="text-body-1 font-weight-medium">Total Nilai</div>
                <h4 class="text-h4">{{ selectedData?.value }}</h4>
              </div>
            </div>
            <VDivider />
            <div class="d-flex justify-space-between align-center">
              <span class="text-body-1">Total Data</span>
              <span class="text-h6">{{ selectedData?.change }} Data</span>
            </div>
          </div>
        </template>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn variant="tonal" color="secondary" @click="isModalOpen = false">
          Tutup
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
@use "@core/scss/base/mixins" as mixins;

.logistics-card-statistics {
  border-block-end-style: solid;
  border-block-end-width: 2px;

  &:hover {
    border-block-end-width: 3px;
    margin-block-end: -1px;

    @include mixins.elevation(10);

    transition: all 0.1s ease-out;
  }
}

.skin--bordered {
  .logistics-card-statistics {
    &:hover {
      margin-block-end: -2px;
    }
  }
}
</style>
