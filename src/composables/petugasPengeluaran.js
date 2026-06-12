import { $api } from "@/utils/api"

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
