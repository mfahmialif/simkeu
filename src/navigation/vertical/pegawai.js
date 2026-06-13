export const pegawaiMenu = [
  {
    title: "Pegawai",
    icon: { icon: "ri-team-line" },
    children: [
      { title: "Data Pegawai", to: "admin-pegawai" },
      { title: "Dosen", to: "admin-pegawai-dosen" },
      { title: "Staff", to: "admin-pegawai-staff" },
    ],
  },
  {
    title: "Saldo",
    icon: { icon: "ri-wallet-3-line" },
    to: "admin-saldo",
  },
]

export default pegawaiMenu
