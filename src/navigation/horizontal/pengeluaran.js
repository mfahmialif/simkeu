export default [
  {
    title: "Pengeluaran Umum",
    icon: { icon: "ri-exchange-funds-line" },
    to: "admin-pengeluaran-umum",
  },
  {
    title: "Barokah Dosen",
    icon: { icon: "ri-hand-heart-line" },
    children: [
      { title: "Tatapmuka", to: "admin-pengeluaran-dosen-tatapmuka" },
      { title: "Kegiatan", to: "admin-pengeluaran-dosen-kegiatan" },
      { title: "Bulanan", to: "admin-pengeluaran-dosen-bulanan" },
      { title: "Staff Bulanan", to: "admin-pengeluaran-staff-bulanan" },
    ],
  },
];
