<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  items: {
    type: Array,
    default: null,
  },
});

const defaultShortcuts = [
  { title: "Saldo", icon: 'ri-wallet-3-line', route: "/admin/saldo/kategori" },
  {
    title: "Pembayaran",
    icon: 'ri-hand-coin-line',
    route: "/admin/pemasukan/mahasiswa/pembayaran/mahasiswa",
  },
  {
    title: "Pengeluaran",
    icon: 'ri-money-dollar-circle-line',
    route: "/admin/pengeluaran",
  },
  {
    title: "Laporan",
    icon: 'ri-file-chart-line',
    route: "/admin/pemasukan/mahasiswa/laporan",
  },
];

const shortcuts = computed(() =>
  props.items?.length ? props.items : defaultShortcuts,
);

const shortcutColumn = computed(() => {
  const count = shortcuts.value.length;

  if (count <= 1) return 12;
  if (count === 2) return 6;
  if (count === 3) return 4;

  return 3;
});

const goTo = (path) => router.push(path);
</script>

<template>
  <VRow dense>
    <VCol
      v-for="item in shortcuts"
      :key="item.title"
      cols="12"
      sm="6"
      :md="shortcutColumn"
    >
      <VBtn
        block
        color="primary"
        size="default"
        variant="flat"
        height="44"
        class="d-flex align-center justify-center dashboard-shortcut-btn"
        @click="goTo(item.route)"
      >
        <VIcon :icon="item.icon" />
        <span class="ml-2">{{ item.title }}</span>
      </VBtn>
    </VCol>
  </VRow>
</template>

<style scoped>
.dashboard-shortcut-btn {
  letter-spacing: 0;
}
</style>
