<script setup>
const deliveryData = [
  {
    title: 'Jumlah Siswa Aktif',
    value: '1200',
    change: 2.5,
    icon: 'ri-user-3-line',
    color: 'primary',
  },
  {
    title: 'Siswa Baru Tahun Ini',
    value: '350',
    change: 1.2,
    icon: 'ri-user-add-line',
    color: 'info',
  },
  {
    title: 'Siswa Lulus',
    value: '300',
    change: 0.8,
    icon: 'ri-graduation-cap-line',
    color: 'success',
  },
  {
    title: 'Persentase Kelulusan',
    value: '98%',
    change: 0.5,
    icon: 'ri-bar-chart-grouped-line',
    color: 'warning',
  },
  {
    title: 'Rata-rata Nilai Ujian',
    value: '82.5',
    change: 0.3,
    icon: 'ri-file-list-3-line',
    color: 'secondary',
  },
  {
    title: 'Siswa Berprestasi',
    value: '45',
    change: 0.7,
    icon: 'ri-medal-line',
    color: 'error',
  },
]

const moreList = [
  {
    title: 'Last 28 Days',
    value: 'Last 28 Days',
  },
  {
    title: 'Last Month',
    value: 'Last Month',
  },
  {
    title: 'Last Year',
    value: 'Last Year',
  },
]
</script>

<template>
  <VCard>
    <VCardItem
      title="Statistik Siswa Madrasah Aliyah"
      subtitle="Update data siswa bulan ini"
    >
      <template #append>
        <MoreBtn
          class="mt-n5"
          :menu-list="moreList"
        />
      </template>
    </VCardItem>

    <VCardText>
      <VList class="card-list">
        <VListItem
          v-for="(data, index) in deliveryData"
          :key="index"
        >
          <template #prepend>
            <VAvatar
              :color="data.color"
              variant="tonal"
              rounded="lg"
              size="40"
            >
              <VIcon
                :icon="data.icon"
                size="24"
              />
            </VAvatar>
          </template>
          <VListItemTitle>{{ data.title }}</VListItemTitle>
          <VListItemSubtitle>
            <div
              :class="data.change > 0 ? 'text-success' : 'text-error'"
              class="d-flex align-center"
            >
              <VIcon
                :icon="data.change > 0 ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"
                size="24"
                class="me-1"
              />
              <span>{{ data.change }}%</span>
            </div>
          </VListItemSubtitle>
          <template #append>
            <span class="text-high-emphasis text-body-1 font-weight-medium">
              {{ data.value }}
            </span>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>
