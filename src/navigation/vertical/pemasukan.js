export default [
  { heading: "PEMASUKAN" },
  {
    title: "Mahasiswa",
    icon: { icon: "ri-user-3-line" },
    children: [
      {
        title: "Master",
        children: [
          {
            title: "Data Mahasiswa",
            to: "admin-pemasukan-mahasiswa-master-data-mahasiswa",
          },
          {
            title: "Jenis Pembayaran",
            to: "admin-pemasukan-mahasiswa-master-jenis-pembayaran",
          },
          {
            title: "Tagihan",
            to: "admin-pemasukan-mahasiswa-master-tagihan",
          },
        ],
      },
      {
        title: "Cek Tagihan",
        to: "admin-pemasukan-mahasiswa-cek-tagihan",
      },
      {
        title: "Pembayaran",
        children: [
          {
            title: "Mahasiswa",
            to: "apps-ecommerce-product-list",
          },
          {
            title: "IDN",
            to: "apps-ecommerce-product-list",
          },
          {
            title: "Tambahan",
            to: "apps-ecommerce-product-list",
          },
        ],
      },
      {
        title: "Dispensasi",
        children: [
          {
            title: "Dispensasi",
            to: "apps-ecommerce-product-list",
          },
          {
            title: "Tagihan",
            to: "apps-ecommerce-product-list",
          },
        ],
      },
      {
        title: "UAS Susulan",
        to: "admin-pemasukan-mahasiswa-uas-susulan",
      },
      {
        title: "Piutang",
        to: "admin-pemasukan-mahasiswa-piutang",
      },
      {
        title: "Setoran",
        to: "admin-pemasukan-mahasiswa-setoran",
      },
      {
        title: "Catatan Deposit",
        to: "admin-pemasukan-mahasiswa-catatan-deposit",
      },
      {
        title: "Pemasukan Pengeluaran",
        to: "admin-pemasukan-mahasiswa-pemasukan-pengeluaran",
      },
      {
        title: "Laporan",
        to: "admin-pemasukan-mahasiswa-laporan",
      },
    ],
  },
  {
    title: "Pemasukan",
    icon: { icon: "ri-money-dollar-circle-line" },
    children: [
      {
        title: "Jenis Saldo",
        to: "apps-ecommerce-product-list",
      },
      {
        title: "Saldo",
        to: "apps-ecommerce-product-list",
      },
    ],
  },
];
