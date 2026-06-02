const userData = useCookie("userData").value ?? {};
const isAdmin = String(userData.role?.name || "").toLowerCase() === "admin";

const pegawaiMenu = {
  title: "PEGAWAI",
  icon: { icon: "ri-team-line" },
  children: [
    { title: "Pegawai", to: "admin-pegawai" },
    { title: "Dosen", to: "admin-pegawai-dosen" },
    { title: "Staff", to: "admin-pegawai-staff" },
  ],
};

export default isAdmin ? [pegawaiMenu] : [];
