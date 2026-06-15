export const settingMenu = {
  title: "Pengaturan",
  icon: { icon: "ri-settings-3-line" },
  children: [
    { title: "Prodi", icon: { icon: "ri-graduation-cap-line" }, to: "admin-setting-prodi" },
    { title: "Tahun Akademik", icon: { icon: "ri-calendar-line" }, to: "admin-setting-th-akademik" },
    { title: "Mata Uang", icon: { icon: "ri-money-dollar-circle-line" }, to: "admin-setting-mata-uang" },
    { title: "Pimpinan", icon: { icon: "ri-user-star-line" }, to: "admin-setting-pimpinan" },
    { title: "Form Schedule", icon: { icon: "ri-time-line" }, to: "admin-setting-form-schadule" },
    {
      title: "Aktifkan Mahasiswa",
      icon: { icon: "ri-user-follow-line" },
      to: "admin-setting-aktifkan-mahasiswa",
    },
  ],
}

export const accountMenu = [
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
]

export const settingItemsForRole = roleName => [
  ...(String(roleName || "").toLowerCase() === "admin" ? [settingMenu] : []),
  ...accountMenu,
]

export default settingItemsForRole()
