<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const shortcuts = [
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

const goTo = (path) => router.push(path);
</script>

<template>
  <VRow dense>
    <VCol v-for="item in shortcuts" :key="item.title" cols="12" sm="6" md="3">
      <VBtn
        block
        color="primary"
        size="small"
        variant="flat"
        class="d-flex align-center justify-center"
        @click="goTo(item.route)"
      >
        <VIcon :icon="item.icon" />
        <span class="ml-2">{{ item.title }}</span>
      </VBtn>
    </VCol>
  </VRow>
</template>
