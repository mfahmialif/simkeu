export default [
  { heading: "PEMASUKAN" },
  {
    title: "Mahasiswa",
    icon: { icon: "ri-store-2-line" },
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
        to: "apps-ecommerce-product-list",
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
        to: "apps-ecommerce-product-list",
      },
      {
        title: "Piutang",
        to: "apps-ecommerce-product-list",
      },
      {
        title: "Setoran",
        to: "apps-ecommerce-product-list",
      },
      {
        title: "Catatan Deposit",
        to: "apps-ecommerce-product-list",
      },
      {
        title: "Pemasukan Pengeluaran",
        to: "apps-ecommerce-product-list",
      },
      {
        title: "Laporan",
        to: "apps-ecommerce-product-list",
      },
    ],
  },
  {
    title: "Pemasukan",
    icon: { icon: "ri-store-2-line" },
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
