export default [
  { heading: "Keuangan" },
  {
    title: "Saldo",
    icon: { icon: "ri-wallet-line" },
    children: [
      { title: "Kategori", to: "admin-saldo-kategori" },
      { title: "Catatan Harian", to: "admin-saldo-catatan-harian" },
    ],
  },
];
