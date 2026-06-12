export const appendLampiranFormData = (
  formData,
  files,
  removedPaths = [],
  prefix = "",
) => {
  const field = name => (prefix ? `${prefix}[${name}][]` : `${name}[]`)

  const normalizedFiles = Array.isArray(files)
    ? files
    : files
      ? [files]
      : []

  normalizedFiles.forEach(file => {
    if (file instanceof File) {
      formData.append(field("lampiran"), file)
    }
  })

  removedPaths.forEach(path => {
    formData.append(field("hapus_lampiran"), path)
  })
}
