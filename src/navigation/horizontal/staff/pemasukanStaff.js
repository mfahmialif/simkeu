export default [
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
            to: "admin-pemasukan-mahasiswa-pembayaran-mahasiswa",
          },
          {
            title: "IDN",
            to: "admin-pemasukan-mahasiswa-pembayaran-idn",
          },
          {
            title: "Tambahan",
            to: "admin-pemasukan-mahasiswa-pembayaran-tambahan",
          },
        ],
      },
      {
        title: "Dispensasi",
        children: [
          {
            title: "Dispensasi",
            to: "admin-pemasukan-mahasiswa-dispensasi",
          },
          {
            title: "Tagihan",
            to: "admin-pemasukan-mahasiswa-dispensasi-tagihan",
          },
        ],
      },
      {
        title: "UAS Susulan",
        to: "admin-pemasukan-mahasiswa-uas-susulan",
      },
      // {
      //   title: "Piutang",
      //   to: "admin-pemasukan-mahasiswa-piutang",
      // },
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
];
