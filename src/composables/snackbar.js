const snackbarData = reactive({
  color: "success",
  text: "",
  visible: false,
})

const parseSnackbarText = text => {
  if (text === null || text === undefined) {
    return "Terjadi kesalahan pada sistem."
  }
  if (typeof text === "string") {
    return text.trim() || "Terjadi kesalahan pada sistem."
  }
  if (text instanceof Error) {
    return text?.data?.message || text.message || "Terjadi kesalahan pada permintaan."
  }
  if (typeof text === "object") {
    if (typeof text.data?.message === "string") return text.data.message
    if (typeof text.message === "string") return text.message
    if (typeof text.error === "string") return text.error
    // Objek validasi Laravel: { nim: ["The nim field is required."] }
    try {
      const values = Object.values(text).flat()
      const strValues = values.filter(v => typeof v === "string")
      if (strValues.length > 0) return strValues.join(", ")
    } catch (_) {}
    try {
      return JSON.stringify(text)
    } catch (_) {
      return "Terjadi kesalahan."
    }
  }
  return String(text)
}

const showSnackbar = ({ color = "success", text = "" } = {}) => {
  snackbarData.color = color || "success"
  snackbarData.text = parseSnackbarText(text)
  snackbarData.visible = true
}

export { showSnackbar, snackbarData }
