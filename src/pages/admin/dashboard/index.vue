<script setup>
import DashboardBarokahRole from "./DashboardBarokahRole.vue"
import DashboardCardStatistics from "./DashboardCardStatistics.vue"
import DashboardFinanceOverview from "./DashboardFinanceOverview.vue"
import DashboardFinanceStatistics from "./DashboardFinanceStatistics.vue"
import DashboardKRSReport from "./DashboardKRSReport.vue"
import DashboardKRSReportLocal from "./DashboardKRSReportLocal.vue"
import DashboardUASReport from "./DashboardUASReport.vue"

const userData = useCookie("userData").value ?? {}
const role = computed(() => String(userData.role?.name || "").toLowerCase())

const allAccessRoles = ["admin", "pimpinan", "keuangan", "kabag", "kabag_pemasukan"]
const staffRoles = ["staff"]

const pengeluaranRoles = [
  "barokahdosen_tatapmuka",
  "barokahdosen_kegiatan",
  "barokahdosen_bulanan",
  "sarpras",
  "rumahtangga",
  "transportasi",
  "kabag_pengeluaran"
]

const canSeeAllDashboard = computed(() => allAccessRoles.includes(role.value))
const isStaffDashboard = computed(() => staffRoles.includes(role.value))
const isPengeluaranDashboard = computed(() => pengeluaranRoles.includes(role.value))

const shouldShowEmptyDashboard = computed(
  () =>
    !canSeeAllDashboard.value &&
    !isStaffDashboard.value &&
    !isPengeluaranDashboard.value,
)

const displayName = computed(
  () => userData.nama || userData.name || userData.username || "Pengguna",
)

const roleLabel = computed(() =>
  role.value ? role.value.replaceAll("_", " ") : "tanpa role",
)

const emptyDashboardMessage = computed(() => {
  if (role.value === "user") {
    return "Role user belum memiliki akses dashboard operasional."
  }

  return "Role ini belum memiliki ringkasan dashboard."
})
</script>

<template>
  <VRow class="match-height">
    <VCol cols="12">
      <VCard>
        <VCardText>
          <div class="d-flex flex-wrap align-center justify-space-between gap-4">
            <div>
              <div class="text-body-2 text-disabled mb-1">
                Assalamu'alaikum warahmatullah
              </div>
              <h4 class="text-h4 mb-1">
                Selamat datang, {{ displayName }}
              </h4>
              <div class="text-body-1">
                Semoga Allah mudahkan amanah pengelolaan keuangan hari ini.
              </div>
            </div>
            <VChip
              color="primary"
              variant="tonal"
              class="text-capitalize"
            >
              {{ roleLabel }}
            </VChip>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <template v-if="canSeeAllDashboard">
      <VCol cols="12">
        <DashboardCardStatistics />
      </VCol>

      <VCol cols="12">
        <DashboardBarokahRole />
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

      <VCol
        cols="12"
        md="6"
      >
        <DashboardKRSReportLocal />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <DashboardKRSReport />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <DashboardUASReport />
      </VCol>
    </template>

    <template v-else-if="isStaffDashboard">
      <VCol cols="12">
        <DashboardCardStatistics :visible-cards="['pemasukan']" />
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
        <DashboardKRSReportLocal />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <DashboardKRSReport />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <DashboardUASReport />
      </VCol>
    </template>

    <template v-else-if="isPengeluaranDashboard">
      <VCol cols="12">
        <DashboardBarokahRole />
      </VCol>
    </template>

    <VCol
      v-else-if="shouldShowEmptyDashboard"
      cols="12"
    >
      <VAlert
        color="secondary"
        variant="tonal"
      >
        {{ emptyDashboardMessage }}
      </VAlert>
    </VCol>
  </VRow>
</template>
