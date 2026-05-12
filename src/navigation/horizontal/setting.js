const userData = useCookie("userData").value ?? {};
const isAdmin = userData.role?.name === "admin";

export default [
  {
    title: "Pengaturan",
    icon: { icon: "ri-settings-3-line" },
    children: [
      { title: "Prodi", to: "admin-setting-prodi" },
      { title: "Tahun Akademik", to: "admin-setting-th-akademik" },
      { title: "Form Schedule", to: "admin-setting-form-schadule" },
      ...(isAdmin
        ? [{ title: "Aktifkan Mahasiswa", to: "admin-setting-aktifkan-mahasiswa" }]
        : []),
    ],
  },
  {
    title: "Profile",
    icon: { icon: "ri-user-line" },
    to: "admin-profile",
  },
  {
    title: "Logout",
    icon: { icon: "ri-logout-box-r-line" },
    to: "logout",
  },
];
