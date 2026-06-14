export const laporanPemasukan = [
  {
    title: "Pemasukan",
    icon: { icon: "ri-file-chart-line" },
    children: [
      { title: "Laporan Harian", to: "admin-laporan-laporan-harian" },
      { title: "Pemasukan Tunai Harian", to: "admin-laporan-pemasukan-tunai-harian" },
      { title: "Pemasukan UII Dalwa", to: "admin-laporan-pemasukan-uii-dalwa" },
    ],
  },
]

export const laporanPengeluaran = [
  {
    title: "Pengeluaran",
    icon: { icon: "ri-bar-chart-box-line" },
    children: [
      { title: "Pengeluaran Harian", to: "admin-laporan-pengeluaran-pengeluaran-harian" },
      { title: "Barokah Pegawai", to: "admin-laporan-pengeluaran-barokah-pegawai" },
    ],
  },
]

export default [...laporanPemasukan, ...laporanPengeluaran]
