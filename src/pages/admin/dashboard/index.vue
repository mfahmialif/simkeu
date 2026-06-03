<script setup>
import DashboardBarokahRole from "./DashboardBarokahRole.vue";
import DashboardCardStatistics from "./DashboardCardStatistics.vue";
import DashboardFinanceOverview from "./DashboardFinanceOverview.vue";
import DashboardFinanceStatistics from "./DashboardFinanceStatistics.vue";
import DashboardKRSReport from "./DashboardKRSReport.vue";
import DashboardKRSReportLocal from "./DashboardKRSReportLocal.vue";
import DashboardMenu from "./DashboardMenu.vue";
import DashboardUASReport from "./DashboardUASReport.vue";

const userData = useCookie("userData").value ?? {};
const role = computed(() => String(userData.role?.name || "").toLowerCase());

const allAccessRoles = ["admin", "pimpinan", "keuangan", "kabag"];
const staffRoles = ["staff"];
const barokahRoles = [
  "barokahdosen_tatapmuka",
  "barokahdosen_kegiatan",
  "barokahdosen_bulanan",
];

const canSeeAllDashboard = computed(() => allAccessRoles.includes(role.value));
const isStaffDashboard = computed(() => staffRoles.includes(role.value));
const isBarokahDashboard = computed(() => barokahRoles.includes(role.value));
const shouldShowEmptyDashboard = computed(
  () =>
    !canSeeAllDashboard.value &&
    !isStaffDashboard.value &&
    !isBarokahDashboard.value,
);

const displayName = computed(
  () => userData.nama || userData.name || userData.username || "Pengguna",
);
const roleLabel = computed(() =>
  role.value ? role.value.replaceAll("_", " ") : "tanpa role",
);

const baseShortcuts = [
  { title: "Saldo", icon: "ri-wallet-3-line", route: "/admin/saldo/kategori" },
  {
    title: "Pembayaran",
    icon: "ri-hand-coin-line",
    route: "/admin/pemasukan/mahasiswa/pembayaran/mahasiswa",
  },
  {
    title: "Pengeluaran",
    icon: "ri-money-dollar-circle-line",
    route: "/admin/pengeluaran/umum",
  },
  {
    title: "Laporan",
    icon: "ri-file-chart-line",
    route: "/admin/pemasukan/mahasiswa/laporan",
  },
  {
    title: "UAS Susulan",
    icon: "ri-file-list-3-line",
    route: "/admin/pemasukan/mahasiswa/uas-susulan",
  },
];

const userShortcut = {
  title: "User",
  icon: "ri-user-settings-line",
  route: "/admin/user",
};

const pegawaiShortcut = {
  title: "Pegawai",
  icon: "ri-team-line",
  route: "/admin/pegawai",
};

const staffShortcuts = [
  {
    title: "Pembayaran",
    icon: "ri-hand-coin-line",
    route: "/admin/pemasukan/mahasiswa/pembayaran/mahasiswa",
  },
  {
    title: "Laporan",
    icon: "ri-file-chart-line",
    route: "/admin/pemasukan/mahasiswa/laporan",
  },
  {
    title: "UAS Susulan",
    icon: "ri-file-list-3-line",
    route: "/admin/pemasukan/mahasiswa/uas-susulan",
  },
];

const barokahShortcutMap = {
  barokahdosen_tatapmuka: [
    {
      title: "Tatapmuka",
      icon: "ri-user-voice-line",
      route: "/admin/pengeluaran/dosen-tatapmuka",
    },
  ],
  barokahdosen_kegiatan: [
    {
      title: "Kegiatan",
      icon: "ri-calendar-event-line",
      route: "/admin/pengeluaran/dosen-kegiatan",
    },
    {
      title: "Staff Bulanan",
      icon: "ri-team-line",
      route: "/admin/pengeluaran/staff-bulanan",
    },
  ],
  barokahdosen_bulanan: [
    {
      title: "Dosen Bulanan",
      icon: "ri-calendar-check-line",
      route: "/admin/pengeluaran/dosen-bulanan",
    },
  ],
};

const allBarokahShortcuts = [
  ...barokahShortcutMap.barokahdosen_tatapmuka,
  ...barokahShortcutMap.barokahdosen_kegiatan,
  ...barokahShortcutMap.barokahdosen_bulanan,
];

const shortcutItems = computed(() => {
  if (role.value === "admin") {
    return [...baseShortcuts, pegawaiShortcut, ...allBarokahShortcuts, userShortcut];
  }

  if (role.value === "pimpinan") {
    return [...baseShortcuts, ...allBarokahShortcuts, userShortcut];
  }

  if (role.value === "keuangan") {
    return [...baseShortcuts, userShortcut];
  }

  if (role.value === "kabag") {
    return staffShortcuts;
  }

  if (isStaffDashboard.value) {
    return staffShortcuts;
  }

  if (isBarokahDashboard.value) {
    return barokahShortcutMap[role.value] || [];
  }

  return [];
});

const emptyDashboardMessage = computed(() => {
  if (role.value === "rumahtangga") {
    return "Dashboard rumah tangga belum memiliki ringkasan khusus, jadi seluruh card disembunyikan.";
  }

  if (role.value === "user") {
    return "Role user belum memiliki akses dashboard operasional.";
  }

  return "Role ini belum memiliki ringkasan dashboard.";
});
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
            <VChip color="primary" variant="tonal" class="text-capitalize">
              {{ roleLabel }}
            </VChip>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol v-if="shortcutItems.length" cols="12">
      <DashboardMenu :items="shortcutItems" />
    </VCol>

    <template v-if="canSeeAllDashboard">
      <VCol cols="12">
        <DashboardCardStatistics />
      </VCol>

      <VCol cols="12">
        <DashboardBarokahRole />
      </VCol>

      <VCol cols="12" md="6">
        <DashboardFinanceOverview />
      </VCol>

      <VCol cols="12" md="6">
        <DashboardFinanceStatistics />
      </VCol>

      <VCol cols="12" md="6">
        <DashboardKRSReportLocal />
      </VCol>

      <VCol cols="12" md="6">
        <DashboardKRSReport />
      </VCol>

      <VCol cols="12" md="6">
        <DashboardUASReport />
      </VCol>
    </template>

    <template v-else-if="isStaffDashboard">
      <VCol cols="12">
        <DashboardCardStatistics :visible-cards="['pemasukan']" />
      </VCol>

      <VCol cols="12" md="6">
        <DashboardFinanceOverview />
      </VCol>

      <VCol cols="12" md="6">
        <DashboardKRSReportLocal />
      </VCol>

      <VCol cols="12" md="6">
        <DashboardKRSReport />
      </VCol>

      <VCol cols="12" md="6">
        <DashboardUASReport />
      </VCol>
    </template>

    <template v-else-if="isBarokahDashboard">
      <VCol cols="12">
        <DashboardBarokahRole />
      </VCol>
    </template>

    <VCol v-else-if="shouldShowEmptyDashboard" cols="12">
      <VAlert color="secondary" variant="tonal">
        {{ emptyDashboardMessage }}
      </VAlert>
    </VCol>
  </VRow>
</template>
