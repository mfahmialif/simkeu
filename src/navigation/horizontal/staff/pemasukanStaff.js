const PENGEMBALIAN_ACCESS_ROLES = new Set([
  "admin",
  "kabag",
  "kabag_pemasukan",
  "staff",
  "keuangan",
])

export const pemasukanStaffItems = [
  { title: "Data Mahasiswa", to: "admin-pemasukan-mahasiswa-master-data-mahasiswa" },
  { title: "Jenis Pembayaran", to: "admin-pemasukan-mahasiswa-master-jenis-pembayaran" },
  {
    title: "Tagihan",
    children: [
      { title: "Tagihan", to: "admin-pemasukan-mahasiswa-master-tagihan" },
      { title: "Tagihan Perorangan", to: "admin-pemasukan-mahasiswa-tagihan-perorangan" },
      { title: "Cek Tagihan", to: "admin-pemasukan-mahasiswa-cek-tagihan" },
    ],
  },
  {
    title: "Pembayaran",
    children: [
      { title: "Mahasiswa", to: "admin-pemasukan-mahasiswa-pembayaran-mahasiswa" },
      { title: "IDN", to: "admin-pemasukan-mahasiswa-pembayaran-idn" },
      { title: "Tambahan", to: "admin-pemasukan-mahasiswa-pembayaran-tambahan" },
    ],
  },
  {
    title: "Dispensasi",
    children: [
      { title: "Dispensasi", to: "admin-pemasukan-mahasiswa-dispensasi" },
      { title: "Tagihan", to: "admin-pemasukan-mahasiswa-dispensasi-tagihan" },
    ],
  },
  { title: "UAS Susulan", to: "admin-pemasukan-mahasiswa-uas-susulan" },
  { title: "Setoran", to: "admin-pemasukan-mahasiswa-setoran" },
  { title: "Catatan Deposit", to: "admin-pemasukan-mahasiswa-catatan-deposit" },
  { title: "Pengembalian", to: "admin-pemasukan-mahasiswa-pengembalian" },
  { title: "Umum", to: "admin-pemasukan-mahasiswa-umum" },
  { title: "Pemasukan Pengeluaran", to: "admin-pemasukan-mahasiswa-pemasukan-pengeluaran" },
  { title: "Laporan", to: "admin-pemasukan-mahasiswa-laporan" },
]

export const pemasukanStaffItemsForRole = roleName => {
  const role = String(roleName || "").toLowerCase()
  const canAccessPengembalian = PENGEMBALIAN_ACCESS_ROLES.has(role)

  return pemasukanStaffItems.filter(item => {
    if (item.to === "admin-pemasukan-mahasiswa-pengembalian") {
      return canAccessPengembalian
    }
    
    return true
  })
}

export default pemasukanStaffItems
