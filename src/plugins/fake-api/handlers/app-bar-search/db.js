export const db = {
  searchItems: [
    {
      title: "Mahasiswa",
      icon: "ri-user-3-line",
      children: [
        {
          title: "Master",
          children: [
            {
              url: { name: "admin-pemasukan-mahasiswa-master-data-mahasiswa" },
              title: "Data Mahasiswa",
            },
            {
              url: { name: "admin-pemasukan-mahasiswa-master-jenis-pembayaran" },
              title: "Jenis Pembayaran",
            },
            {
              url: { name: "admin-pemasukan-mahasiswa-master-tagihan" },
              title: "Tagihan",
            },
          ],
        },
        {
          url: { name: "admin-pemasukan-mahasiswa-cek-tagihan" },
          title: "Cek Tagihan",
        },
        {
          title: "Pembayaran",
          children: [
            {
              url: { name: "admin-pemasukan-mahasiswa-pembayaran-mahasiswa" },
              title: "Mahasiswa",
            },
            {
              url: { name: "admin-pemasukan-mahasiswa-pembayaran-idn" },
              title: "IDN",
            },
            {
              url: { name: "admin-pemasukan-mahasiswa-pembayaran-tambahan" },
              title: "Tambahan",
            },
          ],
        },
        {
          title: "Dispensasi",
          children: [
            {
              url: { name: "admin-pemasukan-mahasiswa-dispensasi" },
              title: "Dispensasi",
            },
            {
              url: { name: "admin-pemasukan-mahasiswa-dispensasi-tagihan" },
              title: "Tagihan",
            },
          ],
        },
        {
          url: { name: "admin-pemasukan-mahasiswa-uas-susulan" },
          title: "UAS Susulan",
        },
        {
          url: { name: "admin-pemasukan-mahasiswa-setoran" },
          title: "Setoran",
        },
        {
          url: { name: "admin-pemasukan-mahasiswa-catatan-deposit" },
          title: "Catatan Deposit",
        },
        {
          url: { name: "admin-pemasukan-mahasiswa-pemasukan-pengeluaran" },
          title: "Pemasukan Pengeluaran",
        },
        {
          url: { name: "admin-pemasukan-mahasiswa-laporan" },
          title: "Laporan",
        },
      ],
    },
    {
      title: "Pemasukan",
      icon: "ri-money-dollar-circle-line",
      children: [
        {
          url: { name: "admin-pemasukan-pemasukan-tambah" },
          title: "Tambah Data",
        },
      ],
    },
    {
      title: "Pengeluaran",
      category: "pengeluaran",
      children: [
        {
          url: { name: "admin-pengeluaran" },
          icon: "ri-arrow-down-line",
          title: "Pengeluaran",
        },
      ],
    },
    {
      title: "Saldo",
      category: "saldo",
      children: [
        {
          url: { name: "admin-saldo-kategori" },
          icon: "ri-wallet-line",
          title: "Kategori",
        },
      ],
    },
    {
      title: "User",
      category: "user",
      children: [
        {
          url: { name: "admin-user" },
          icon: "ri-user-3-line",
          title: "User",
        },
      ],
    },
    {
      title: "Setting",
      category: "setting",
      children: [
        {
          url: { name: "admin-profile" },
          icon: "ri-user-line",
          title: "Profile",
        },
        {
          url: { name: "logout" },
          icon: "ri-logout-box-line",
          title: "Logout",
        },
      ],
    },
  ],
};
