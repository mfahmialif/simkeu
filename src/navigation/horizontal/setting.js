export default [
  {
    title: "Pengaturan",
    icon: { icon: "ri-settings-3-line" },
    children: [
      { title: "Prodi", to: "admin-setting-prodi" },
      { title: "Tahun Akademik", to: "admin-setting-th-akademik" },
      { title: "Form Schedule", to: "admin-setting-form-schadule" },
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
