<script setup>
import Shepherd from "shepherd.js";
import { withQuery } from "ufo";
import { useConfigStore } from "@core/stores/config";

defineOptions({
  inheritAttrs: false,
});

const configStore = useConfigStore();
const isAppSearchBarVisible = ref(false);

// 👉 Default suggestions
const suggestionGroups = [
  {
    title: "Mahasiswa",
    content: [
      {
        icon: "ri-user-3-line",
        title: "Data Mahasiswa",
        url: { name: "admin-pemasukan-mahasiswa-master-data-mahasiswa" },
      },
      {
        icon: "ri-file-list-line",
        title: "Jenis Pembayaran",
        url: { name: "admin-pemasukan-mahasiswa-master-jenis-pembayaran" },
      },
      {
        icon: "ri-money-dollar-circle-line",
        title: "Tagihan",
        url: { name: "admin-pemasukan-mahasiswa-master-tagihan" },
      },
      {
        icon: "ri-search-line",
        title: "Cek Tagihan",
        url: { name: "admin-pemasukan-mahasiswa-cek-tagihan" },
      },
    ],
  },
  {
    title: "Pembayaran",
    content: [
      {
        icon: "ri-money-dollar-circle-fill",
        title: "Pembayaran Mahasiswa",
        url: { name: "admin-pemasukan-mahasiswa-pembayaran-mahasiswa" },
      },
      {
        icon: "ri-bank-card-line",
        title: "Pembayaran IDN",
        url: { name: "admin-pemasukan-mahasiswa-pembayaran-idn" },
      },
      {
        icon: "ri-add-circle-line",
        title: "Pembayaran Tambahan",
        url: { name: "admin-pemasukan-mahasiswa-pembayaran-tambahan" },
      },
    ],
  },
  {
    title: "Lainnya",
    content: [
      {
        icon: "ri-time-line",
        title: "Dispensasi",
        url: { name: "admin-pemasukan-mahasiswa-dispensasi" },
      },
      {
        icon: "ri-arrow-down-line",
        title: "Pengeluaran",
        url: { name: "admin-pengeluaran" },
      },
      {
        icon: "ri-wallet-line",
        title: "Kategori Saldo",
        url: { name: "admin-saldo-kategori" },
      },
      {
        icon: "ri-user-line",
        title: "Profil",
        url: { name: "admin-profile" },
      },
    ],
  },
];

// 👉 No Data suggestion
const noDataSuggestions = [
  {
    title: "Mahasiswa",
    icon: "ri-bar-chart-line",
    url: { name: "admin-pemasukan-mahasiswa-master-data-mahasiswa" },
  },
  {
    title: "Pemasukan",
    icon: "ri-pie-chart-2-line",
    url: { name: "admin-pemasukan-pemasukan-tambah" },
  },
  {
    title: "Pengeluaran",
    icon: "ri-shopping-bag-3-line",
    url: { name: "admin-pengeluaran" },
  },
];

const searchQuery = ref("");
const router = useRouter();
const searchResult = ref([]);
const isLoading = ref(false);

const fetchResults = async () => {
  isLoading.value = true;

  const { data } = await useApi(
    withQuery("/app-bar/search", { q: searchQuery.value })
  );

  searchResult.value = data.value;

  // ℹ️ simulate loading: we have used setTimeout for better user experience your can remove it
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
};

watch(searchQuery, fetchResults);

const redirectToSuggestedOrSearchedPage = (selected) => {
  router.push(selected.url);
  isAppSearchBarVisible.value = false;
  searchQuery.value = "";
};

const LazyAppBarSearch = defineAsyncComponent(() =>
  import("@core/components/AppBarSearch.vue")
);
</script>

<template>
  <div
    class="d-flex align-center cursor-pointer gap-x-2"
    v-bind="$attrs"
    style="user-select: none"
    @click="isAppSearchBarVisible = !isAppSearchBarVisible"
  >
    <!-- 👉 Search Trigger button -->
    <!-- close active tour while opening search bar using icon -->
    <IconBtn @click="Shepherd.activeTour?.cancel()">
      <VIcon icon="ri-search-line" />
    </IconBtn>

    <div
      v-if="configStore.appContentLayoutNav === 'vertical'"
      class="d-none d-md-flex text-disabled text-body-1 gap-x-2"
      @click="Shepherd.activeTour?.cancel()"
    >
      <div>Search</div>
      <div class="meta-key">&#8984;K</div>
    </div>
  </div>

  <!-- 👉 App Bar Search -->
  <LazyAppBarSearch
    v-model:is-dialog-visible="isAppSearchBarVisible"
    :search-results="searchResult"
    :is-loading="isLoading"
    @search="searchQuery = $event"
  >
    <!-- suggestion -->
    <template #suggestions>
      <VCardText class="app-bar-search-suggestions pa-12">
        <VRow v-if="suggestionGroups">
          <VCol
            v-for="suggestion in suggestionGroups"
            :key="suggestion.title"
            cols="12"
            sm="6"
          >
            <p
              class="custom-letter-spacing text-xs text-disabled text-uppercase py-2 px-4 mb-0"
            >
              {{ suggestion.title }}
            </p>
            <VList class="card-list">
              <VListItem
                v-for="item in suggestion.content"
                :key="item.title"
                link
                class="app-bar-search-suggestion mx-4 mt-2"
                @click="redirectToSuggestedOrSearchedPage(item)"
              >
                <VListItemTitle>{{ item.title }}</VListItemTitle>
                <template #prepend>
                  <VIcon :icon="item.icon" size="20" class="me-n1" />
                </template>
              </VListItem>
            </VList>
          </VCol>
        </VRow>
      </VCardText>
    </template>

    <!-- no data suggestion -->
    <template #noDataSuggestion>
      <div class="mt-6">
        <div class="text-center text-disabled py-2">Try searching for</div>
        <h6
          v-for="suggestion in noDataSuggestions"
          :key="suggestion.title"
          class="app-bar-search-suggestion text-h6 font-weight-regular cursor-pointer py-2 px-4"
          @click="redirectToSuggestedOrSearchedPage(suggestion)"
        >
          <VIcon size="20" :icon="suggestion.icon" class="me-2" />
          <span class="d-inline-block">{{ suggestion.title }}</span>
        </h6>
      </div>
    </template>

    <!-- search result -->
    <template #searchResult="{ item }">
      <VListSubheader
        class="text-disabled custom-letter-spacing font-weight-regular ps-4"
      >
        {{ item.title }}
      </VListSubheader>
      <VListItem
        v-for="list in item.children"
        :key="list.title"
        @click="redirectToSuggestedOrSearchedPage(list)"
      >
        <template #prepend>
          <VIcon size="20" :icon="list.icon" class="me-n1" />
        </template>
        <template #append>
          <VIcon
            size="20"
            icon="ri-corner-down-left-line"
            class="enter-icon text-medium-emphasis"
          />
        </template>
        <VListItemTitle>
          {{ list.title }}
        </VListItemTitle>
      </VListItem>
    </template>
  </LazyAppBarSearch>
</template>

<style lang="scss">
@use "@styles/variables/vuetify.scss";

.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  padding-block: 0.1rem;
  padding-inline: 0.25rem;
}

.app-bar-search-dialog {
  .custom-letter-spacing {
    letter-spacing: 0.8px;
  }

  .card-list {
    --v-card-list-gap: 8px;
  }
}
</style>
