import { ref } from "vue"

const thAkademikList = ref([])
const prodiList = ref([])
let loadingPromise = null
let filtersLoaded = false

const responseRows = response => {
  const payload = response?.data

  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data

  return []
}

const loadDashboardFilters = async () => {
  if (filtersLoaded) return
  if (loadingPromise) return loadingPromise

  loadingPromise = Promise.all([
    $api("/admin/th-akademik?limit=0&sort_key=kode&sort_order=desc"),
    $api("/admin/prodi?limit=0&sort_key=kode&sort_order=asc"),
  ])
    .then(([thResponse, prodiResponse]) => {
      thAkademikList.value = responseRows(thResponse).map(item => ({
        title: `${item.nama} - ${item.semester}`,
        value: item.id,
        aktif: item.aktif,
      }))
      prodiList.value = responseRows(prodiResponse).map(item => ({
        title: item.nama,
        value: item.id,
      }))
      filtersLoaded = true
    })
    .finally(() => {
      loadingPromise = null
    })

  return loadingPromise
}

export const useDashboardFilters = () => ({
  thAkademikList,
  prodiList,
  loadDashboardFilters,
})
