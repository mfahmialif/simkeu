export default [
  {
    title: "Pengaturan",
    icon: { icon: "ri-settings-3-line" },
    children: [
      { title: "Prodi", icon: { icon: "ri-graduation-cap-line" }, to: "admin-setting-prodi" },
      { title: "Tahun Akademik", icon: { icon: "ri-calendar-line" }, to: "admin-setting-th-akademik" },
      { title: "Form Schedule", icon: { icon: "ri-time-line" }, to: "admin-setting-form-schadule" },
      { title: "Syarat Tagihan", icon: { icon: "ri-price-tag-3-line" }, to: "admin-setting-syarat-tagihan" },
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
