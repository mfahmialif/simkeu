const PENGEMBALIAN_ACCESS_ROLES = new Set([
  "admin",
  "kabag",
  "kabag_pemasukan",
  "staff",
  "keuangan",
])

export const pemasukanItems = [
  {
    title: "Data Mahasiswa",
    icon: { icon: "ri-group-line" },
    to: "admin-pemasukan-mahasiswa-master-data-mahasiswa",
  },
  {
    title: "Jenis Pembayaran",
    icon: { icon: "ri-price-tag-3-line" },
    to: "admin-pemasukan-mahasiswa-master-jenis-pembayaran",
  },
  {
    title: "Tagihan",
    icon: { icon: "ri-file-list-3-line" },
    children: [
      { title: "Tagihan", to: "admin-pemasukan-mahasiswa-master-tagihan" },
      { title: "Tagihan Perorangan", to: "admin-pemasukan-mahasiswa-tagihan-perorangan" },
      { title: "Cek Tagihan", to: "admin-pemasukan-mahasiswa-cek-tagihan" },
    ],
  },
  {
    title: "Pembayaran",
    icon: { icon: "ri-bank-card-line" },
    children: [
      { title: "Mahasiswa", to: "admin-pemasukan-mahasiswa-pembayaran-mahasiswa" },
      { title: "VA BSI", to: "admin-pemasukan-mahasiswa-pembayaran-bsi" },
      { title: "IDN", to: "admin-pemasukan-mahasiswa-pembayaran-idn" },
      { title: "Tambahan", to: "admin-pemasukan-mahasiswa-pembayaran-tambahan" },
    ],
  },
  {
    title: "Dispensasi",
    icon: { icon: "ri-file-shield-2-line" },
    children: [
      { title: "Dispensasi", to: "admin-pemasukan-mahasiswa-dispensasi" },
      { title: "Tagihan", to: "admin-pemasukan-mahasiswa-dispensasi-tagihan" },
    ],
  },
  {
    title: "UAS Susulan",
    icon: { icon: "ri-calendar-check-line" },
    to: "admin-pemasukan-mahasiswa-uas-susulan",
  },
  {
    title: "Setoran",
    icon: { icon: "ri-safe-2-line" },
    to: "admin-pemasukan-mahasiswa-setoran",
  },
  {
    title: "Catatan Deposit",
    icon: { icon: "ri-wallet-3-line" },
    to: "admin-pemasukan-mahasiswa-catatan-deposit",
  },
  {
    title: "Pengembalian",
    icon: { icon: "ri-arrow-go-back-line" },
    to: "admin-pemasukan-mahasiswa-pengembalian",
  },
  {
    title: "Umum",
    icon: { icon: "ri-funds-box-line" },
    to: "admin-pemasukan-mahasiswa-umum",
  },
  {
    title: "Pemasukan Pengeluaran",
    icon: { icon: "ri-exchange-funds-line" },
    to: "admin-pemasukan-mahasiswa-pemasukan-pengeluaran",
  },
  {
    title: "Laporan",
    icon: { icon: "ri-file-chart-line" },
    to: "admin-pemasukan-mahasiswa-laporan",
  },
]

export const pemasukanItemsForRole = roleName => {
  const role = String(roleName || "").toLowerCase()
  const canAccessPengembalian = PENGEMBALIAN_ACCESS_ROLES.has(role)

  return pemasukanItems.filter(item => {
    if (item.to === "admin-pemasukan-mahasiswa-pengembalian") {
      return canAccessPengembalian
    }
    
    return true
  })
}

export default pemasukanItems
