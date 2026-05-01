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
        value: formatRupiah(response.data.pemasukan),
        change: response.data.jumlahPemasukan,
        isHover: false,
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

  <VDialog v-model="isModalOpen" max-width="400">
    <VCard>
      <VCardItem class="pb-2">
        <VCardTitle class="text-h5">
          Detail {{ selectedData?.title }}
        </VCardTitle>
      </VCardItem>
      <VCardText>
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
