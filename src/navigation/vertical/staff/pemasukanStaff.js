export default [
  { heading: "Pemasukan" },
  {
    title: "Mahasiswa",
    icon: { icon: "ri-group-line" },
    children: [
      {
        title: "Master Data",
        icon: { icon: "ri-database-2-line" },
        children: [
          {
            title: "Data Mahasiswa",
            to: "admin-pemasukan-mahasiswa-master-data-mahasiswa",
          },
          {
            title: "Jenis Pembayaran",
            to: "admin-pemasukan-mahasiswa-master-jenis-pembayaran",
          },
          { title: "Tagihan", to: "admin-pemasukan-mahasiswa-master-tagihan" },
        ],
      },
      { title: "Cek Tagihan", to: "admin-pemasukan-mahasiswa-cek-tagihan" },
      {
        title: "Pembayaran",
        icon: { icon: "ri-bank-card-line" },
        children: [
          {
            title: "Mahasiswa",
            to: "admin-pemasukan-mahasiswa-pembayaran-mahasiswa",
          },
          { title: "IDN", to: "admin-pemasukan-mahasiswa-pembayaran-idn" },
          {
            title: "Tambahan",
            to: "admin-pemasukan-mahasiswa-pembayaran-tambahan",
          },
        ],
      },
      {
        title: "Dispensasi",
        icon: { icon: "ri-file-shield-2-line" },
        children: [
          { title: "Dispensasi", to: "admin-pemasukan-mahasiswa-dispensasi" },
          {
            title: "Tagihan",
            to: "admin-pemasukan-mahasiswa-dispensasi-tagihan",
          },
        ],
      },
      {
        title: "Semester Pendek",
        to: "admin-pemasukan-mahasiswa-semester-pendek",
      },
      { title: "UAS Susulan", to: "admin-pemasukan-mahasiswa-uas-susulan" },
      { title: "Setoran", to: "admin-pemasukan-mahasiswa-setoran" },
      {
        title: "Catatan Deposit",
        to: "admin-pemasukan-mahasiswa-catatan-deposit",
      },
      {
        title: "Pemasukan Pengeluaran",
        to: "admin-pemasukan-mahasiswa-pemasukan-pengeluaran",
      },
      { title: "Laporan", to: "admin-pemasukan-mahasiswa-laporan" },
    ],
  },
];
