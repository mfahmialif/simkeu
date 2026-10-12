<script setup>
const shortcuts = [
  {
    icon: 'ri-home-smile-line',
    title: 'Dashboard',
    subtitle: 'Ringkasan Keuangan',
    to: { name: 'admin-dashboard' },
  },
  {
    icon: 'ri-money-dollar-circle-fill',
    title: 'Pembayaran',
    subtitle: 'Pembayaran Mahasiswa',
    to: { name: 'admin-pemasukan-mahasiswa-pembayaran-mahasiswa' },
  },
  {
    icon: 'ri-user-settings-line',
    title: 'User',
    subtitle: 'Kelola Pengguna',
    to: { name: 'admin-user' },
  },
  {
    icon: 'ri-user-line',
    title: 'Profile',
    subtitle: 'Pengaturan Profil',
    to: { name: 'admin-profile' },
  },
]
</script>

<template>
  <Shortcuts :shortcuts="shortcuts" />
</template>
