<script setup>
const currentTab = ref('New')

const tabsData = [
  'Kelas X',
  'Kelas XI',
  'Kelas XII',
]

const moreList = [
  {
    title: 'Refresh',
    value: 'refresh',
  },
  {
    title: 'Update',
    value: 'update',
  },
  {
    title: 'Share',
    value: 'share',
  },
]
</script>

<template>
  <VCard>
    <VCardItem
      title="Asal Daerah Siswa"
      subtitle="Statistik persebaran siswa Madrasah Aliyah"
    >
      <template #append>
        <MoreBtn
          class="mt-n5"
          :menu-list="moreList"
        />
      </template>
    </VCardItem>

    <VTabs
      v-model="currentTab"
      grow
      class="disable-tab-transition"
    >
      <VTab
        v-for="(tab, index) in tabsData"
        :key="index"
      >
        {{ tab }}
      </VTab>
    </VTabs>

    <VCardText>
      <VWindow v-model="currentTab">
        <VWindowItem>
          <div>
            <VTimeline
              align="start"
              truncate-line="both"
              side="end"
              density="compact"
              line-thickness="1"
              class="v-timeline--variant-outlined"
            >
              <VTimelineItem
                icon="ri-checkbox-circle-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="success"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-uppercase text-success">
                  Siswa
                </div>
                <div class="app-timeline-title">
                  Ahmad Fauzi
                </div>
                <div class="text-body-2 mb-1">
                  Kab. Sidoarjo, Jawa Timur
                </div>
              </VTimelineItem>

              <VTimelineItem
                icon="ri-map-pin-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="primary"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-primary text-uppercase">
                  Siswa
                </div>
                <div class="app-timeline-title">
                  Siti Rahmawati
                </div>
                <div class="text-body-2">
                  Kab. Gresik, Jawa Timur
                </div>
              </VTimelineItem>
            </VTimeline>

            <VDivider
              class="my-4"
              style="border-style: dashed;"
            />

            <VTimeline
              align="start"
              truncate-line="both"
              side="end"
              density="compact"
              line-thickness="1"
              class="v-timeline--variant-outlined"
            >
              <VTimelineItem
                icon="ri-checkbox-circle-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="success"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-uppercase text-success">
                  Siswa
                </div>
                <div class="app-timeline-title">
                  Muhammad Iqbal
                </div>
                <div class="text-body-2 mb-1">
                  Kab. Pasuruan, Jawa Timur
                </div>
              </VTimelineItem>

              <VTimelineItem
                icon="ri-map-pin-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="primary"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-primary text-uppercase">
                  Siswa
                </div>
                <div class="app-timeline-title">
                  Dewi Lestari
                </div>
                <div class="text-body-2">
                  Kab. Probolinggo, Jawa Timur
                </div>
              </VTimelineItem>
            </VTimeline>
          </div>
        </VWindowItem>

        <VWindowItem>
          <div>
            <VTimeline
              align="start"
              truncate-line="both"
              side="end"
              density="compact"
              line-thickness="1"
              class="v-timeline--variant-outlined"
            >
              <VTimelineItem
                icon="ri-checkbox-circle-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="success"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-uppercase text-success">
                  Sender
                </div>
                <div class="app-timeline-title">
                  Barry Schowalter
                </div>
                <div class="text-body-2">
                  939 Orange, California(CA), 92118
                </div>
              </VTimelineItem>

              <VTimelineItem
                icon="ri-map-pin-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="primary"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-primary text-uppercase">
                  Receiver
                </div>
                <div class="app-timeline-title">
                  Myrtle Ullrich
                </div>
                <div class="text-body-2">
                  101 Boulder, California(CA), 95959
                </div>
              </VTimelineItem>
            </VTimeline>

            <VDivider
              class="my-4"
              style="border-style: dashed;"
            />

            <VTimeline
              align="start"
              truncate-line="both"
              side="end"
              density="compact"
              line-thickness="1"
              class="v-timeline--variant-outlined"
            >
              <VTimelineItem
                icon="ri-checkbox-circle-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="success"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-uppercase text-success">
                  Sender
                </div>
                <div class="app-timeline-title">
                  Veronica Herman
                </div>
                <div class="text-body-2">
                  162  Windsor, California(CA), 95492
                </div>
              </VTimelineItem>

              <VTimelineItem
                icon="ri-map-pin-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="primary"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-primary text-uppercase">
                  Receiver
                </div>
                <div class="app-timeline-title">
                  Helen Jacobs
                </div>
                <div class="text-body-2">
                  487 Sunset, California(CA), 94043
                </div>
              </VTimelineItem>
            </VTimeline>
          </div>
        </VWindowItem>

        <VWindowItem>
          <div>
            <VTimeline
              align="start"
              truncate-line="both"
              side="end"
              density="compact"
              line-thickness="1"
              class="v-timeline--variant-outlined"
            >
              <VTimelineItem
                icon="ri-checkbox-circle-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="success"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-uppercase text-success">
                  Sender
                </div>
                <div class="app-timeline-title">
                  Myrtle Ullrich
                </div>
                <div class="text-body-2">
                  101 Boulder, California(CA), 95959
                </div>
              </VTimelineItem>
              <VTimelineItem
                icon="ri-map-pin-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="primary"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-primary text-uppercase">
                  Receiver
                </div>
                <div class="app-timeline-title">
                  Barry Schowalter
                </div>
                <div class="text-body-2">
                  939 Orange, California(CA), 92118
                </div>
              </VTimelineItem>
            </VTimeline>

            <VDivider
              class="my-4"
              style="border-style: dashed;"
            />

            <VTimeline
              align="start"
              truncate-line="both"
              side="end"
              density="compact"
              line-thickness="1"
              class="v-timeline--variant-outlined"
            >
              <VTimelineItem
                icon="ri-checkbox-circle-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="success"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-uppercase text-success">
                  Sender
                </div>
                <div class="app-timeline-title">
                  Veronica Herman
                </div>
                <div class="text-body-2">
                  162  Windsor, California(CA), 95492
                </div>
              </VTimelineItem>

              <VTimelineItem
                icon="ri-map-pin-line"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="primary"
                fill-dot
                size="20"
                :elevation="0"
              >
                <div class="text-caption text-primary text-uppercase">
                  Receiver
                </div>
                <div class="app-timeline-title">
                  Helen Jacobs
                </div>
                <div class="text-body-2">
                  487 Sunset, California(CA), 94043
                </div>
              </VTimelineItem>
            </VTimeline>
          </div>
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
</template>
