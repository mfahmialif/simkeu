const userData = useCookie("userData").value ?? {};
const isAdmin = String(userData.role?.name || "").toLowerCase() === "admin";

const pegawaiMenu = [
  { heading: "PEGAWAI" },
  { title: "Pegawai", icon: { icon: "ri-team-line" }, to: "admin-pegawai" },
  { title: "Dosen", icon: { icon: "ri-graduation-cap-line" }, to: "admin-pegawai-dosen" },
  { title: "Staff", icon: { icon: "ri-briefcase-line" }, to: "admin-pegawai-staff" },
];

export default isAdmin ? pegawaiMenu : [];
