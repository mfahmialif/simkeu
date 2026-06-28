import { $api } from "@/utils/api"

export const moduleKeyFromPengeluaranEndpoint = endpoint => {
  const key = String(endpoint || "")
    .split("?")[0]
    .replace(/\/+$/, "")
    .split("/")
    .pop()
    ?.replace(/-/g, "_")

  const aliases = {
    "dosen_tatapmuka": "dosen_tatapmuka",
    "dosen_tatap_muka": "dosen_tatapmuka",
    "dosen_kegiatan": "dosen_kegiatan",
    "dosen_bulanan": "dosen_bulanan",
    bulanan: "bulanan",
    "rumah_tangga": "rumah_tangga",
    "sarana_prasarana": "sarana_prasarana",
    transportasi: "transportasi",
    umum: "umum",
  }

  return aliases[key] || key || "rab"
}

export const fetchPetugasPengeluaranOptions = async (module = null) => {
  const response = await $api("/helper/petugas-pengeluaran", {
    method: "GET",
    body: {
      ...(module && { module }),
    },
  })

  const items = response?.data?.data || response?.data || []

  return items.map(user => ({
    title: [
      user.name,
      user.jenis_kelamin ? `(${user.jenis_kelamin})` : null,
      user.role_name ? `- ${user.role_name}` : null,
    ].filter(Boolean).join(" "),
    value: user.id,
  }))
}

export const defaultPetugasPengeluaranId = (items = []) => {
  const userData = useCookie("userData").value ?? {}
  const userId = userData?.id

  if (!userId) return null

  return items.find(item => String(item.value) === String(userId))?.value ?? null
}
