const barokahDosenMenu = (children) => [
  {
    title: "Barokah Dosen",
    icon: { icon: "ri-hand-heart-line" },
    children,
  },
];

const barokahDosenSingleMenu = (title, to) => [
  {
    title,
    icon: { icon: "ri-hand-heart-line" },
    to,
  },
];

export const pengeluaranDosenTatapmuka = barokahDosenSingleMenu(
  "Dosen Tatapmuka",
  "admin-pengeluaran-dosen-tatapmuka",
);

export const pengeluaranDosenKegiatan = barokahDosenSingleMenu(
  "Pegawai Kegiatan",
  "admin-pengeluaran-dosen-kegiatan",
);

export const pengeluaranDosenBulanan = barokahDosenSingleMenu(
  "Dosen Bulanan",
  "admin-pengeluaran-dosen-bulanan",
);

export const pengeluaranStaffBulanan = barokahDosenSingleMenu(
  "Staff Bulanan",
  "admin-pengeluaran-staff-bulanan",
);

export default barokahDosenMenu([
  { title: "Tatapmuka", to: "admin-pengeluaran-dosen-tatapmuka" },
  { title: "Kegiatan", to: "admin-pengeluaran-dosen-kegiatan" },
  { title: "Bulanan", to: "admin-pengeluaran-dosen-bulanan" },
  { title: "Staff Bulanan", to: "admin-pengeluaran-staff-bulanan" },
]);
