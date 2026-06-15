export const settingMenu = {
  title: "Pengaturan",
  icon: { icon: "ri-settings-3-line" },
  children: [
    { title: "Prodi", to: "admin-setting-prodi" },
    { title: "Tahun Akademik", to: "admin-setting-th-akademik" },
    { title: "Mata Uang", to: "admin-setting-mata-uang" },
    { title: "Pimpinan", to: "admin-setting-pimpinan" },
    { title: "Form Schedule", to: "admin-setting-form-schadule" },
    { title: "Aktifkan Mahasiswa", to: "admin-setting-aktifkan-mahasiswa" },
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
