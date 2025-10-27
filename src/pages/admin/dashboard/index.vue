<script setup>
import DashboardCardStatistics from './DashboardCardStatistics.vue';
import DashboardDeliveryExceptions from './DashboardDeliveryExceptions.vue';
import DashboardDeliveryPerformance from './DashboardDeliveryPerformance.vue';
import DashboardOrderByCountries from './DashboardOrderByCountries.vue';
import DashboardOverviewTable from './DashboardOverviewTable.vue';
import DashboardFinanceStatistics from './DashboardFinanceStatistics.vue';
import DashboardFinanceOverview from './DashboardFinanceOverview.vue';
import DashboardMenu from './DashboardMenu.vue';

</script>

<template>
  <VRow class="match-height">
    <VCol cols="12">
      <DashboardCardStatistics />
    </VCol>

    <VCol cols="12">
      <DashboardMenu />
    </VCol>
    
    <VCol
      cols="12"
      md="6"
    >
      <DashboardFinanceOverview />
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
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
