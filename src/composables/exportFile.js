function downloadFileExport(blob, fileName) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")

  a.href = url
  a.download = (fileName === "Template Batch Payment.txt" && blob.name) ? blob.name : (fileName || blob.name)
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function openFileExport(blob) {
  const url = URL.createObjectURL(blob)

  window.open(url, "_blank", "noopener")
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

export { downloadFileExport, openFileExport }
