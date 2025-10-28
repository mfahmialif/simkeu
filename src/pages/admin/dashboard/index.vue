<script setup>
import DashboardCardStatistics from "./DashboardCardStatistics.vue";
import DashboardDeliveryExceptions from "./DashboardDeliveryExceptions.vue";
import DashboardDeliveryPerformance from "./DashboardDeliveryPerformance.vue";
import DashboardOrderByCountries from "./DashboardOrderByCountries.vue";
import DashboardOverviewTable from "./DashboardOverviewTable.vue";
import DashboardFinanceStatistics from "./DashboardFinanceStatistics.vue";
import DashboardFinanceOverview from "./DashboardFinanceOverview.vue";
import DashboardMenu from "./DashboardMenu.vue";

const userData = useCookie("userData").value ?? {};
const role = userData.role?.name;
</script>

<template>
  <VRow class="match-height">
    <VCol cols="12">
      <DashboardCardStatistics />
    </VCol>

    <VCol
      cols="12"
      v-if="role == 'admin' || role == 'pimpinan' || role == 'keuangan'"
    >
      <DashboardMenu />
    </VCol>

    <VCol cols="12" md="6">
      <DashboardFinanceOverview />
    </VCol>

    <VCol cols="12" md="6">
      <DashboardFinanceStatistics />
    </VCol>

    <!-- <VCol
      cols="12"
      md="4"
    >
      <DashboardDeliveryPerformance />
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <DashboardDeliveryExceptions />
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <DashboardOrderByCountries />
    </VCol> -->

    <!-- <VCol cols="12">
      <DashboardOverviewTable />
    </VCol> -->
  </VRow>
</template>
