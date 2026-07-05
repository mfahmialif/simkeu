const PIUTANG_ACCESS_ROLES = new Set([
  "admin",
  "pimpinan",
  "kabag_pengeluaran",
  "barokahdosen_bulanan",
])

const hutangMenu = {
  title: "Hutang",
  to: "admin-hutang",
}

const piutangMenu = {
  title: "Piutang",
  to: "admin-piutang",
}

export const hutangItemsForRole = roleName => [
  {
    title: "Hutang & Piutang",
    icon: { icon: "ri-hand-coin-line" },
    children: [
      hutangMenu,
      ...(PIUTANG_ACCESS_ROLES.has(String(roleName || "").toLowerCase()) ? [piutangMenu] : []),
    ],
  },
]

export default hutangItemsForRole()
