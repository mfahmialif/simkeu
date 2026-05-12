const userData = useCookie("userData").value ?? {};
const isAdmin = userData.role?.name === "admin";

export default [
  {
    title: "Pengaturan",
    icon: { icon: "ri-settings-3-line" },
    children: [
      { title: "Prodi", icon: { icon: "ri-graduation-cap-line" }, to: "admin-setting-prodi" },
      { title: "Tahun Akademik", icon: { icon: "ri-calendar-line" }, to: "admin-setting-th-akademik" },
      { title: "Form Schedule", icon: { icon: "ri-time-line" }, to: "admin-setting-form-schadule" },
      ...(isAdmin
        ? [
            {
              title: "Aktifkan Mahasiswa",
              icon: { icon: "ri-user-follow-line" },
              to: "admin-setting-aktifkan-mahasiswa",
            },
          ]
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
