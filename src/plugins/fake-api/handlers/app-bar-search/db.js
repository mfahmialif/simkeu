export const db = {
  searchItems: [
    {
      title: "Mahasiswa",
      icon: "ri-user-3-line",
      children: [
        {
          url: { name: "admin-pemasukan-mahasiswa-master-data-mahasiswa" },
          title: "Mahasiswa",
        },
        {
          url: { name: "admin-pemasukan-mahasiswa-master-jenis-pembayaran" },
          title: "Jenis Pembayaran",
        },
        {
          title: "Tagihan",
          children: [
            {
              url: { name: "admin-pemasukan-mahasiswa-master-tagihan" },
              title: "Tagihan",
            },
            {
              url: { name: "admin-pemasukan-mahasiswa-tagihan-perorangan" },
              title: "Tagihan Perorangan",
            },
            {
              url: { name: "admin-pemasukan-mahasiswa-cek-tagihan" },
              title: "Cek Tagihan",
            },
          ],
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
}
