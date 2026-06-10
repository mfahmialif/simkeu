export const appendLampiranFormData = (formData, files, removedPaths = []) => {
  const normalizedFiles = Array.isArray(files)
    ? files
    : files
      ? [files]
      : []

  normalizedFiles.forEach(file => {
    if (file instanceof File) {
      formData.append("lampiran[]", file)
    }
  })

  removedPaths.forEach(path => {
    formData.append("hapus_lampiran[]", path)
  })
}
