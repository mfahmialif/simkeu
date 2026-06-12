<script setup>
import { showSnackbar } from "@/composables/snackbar"

const props = defineProps({
  typeForm: {
    type: String,
    default: "",
  },
  dataForm: {
    type: Object,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
  nim: {
    type: String,
    default: "",
  },
  showNim: {
    type: Boolean,
    default: false,
  },
  searchNim: {
    type: Boolean,
    default: false,
  },
  submitRedirect: {
    type: String,
    default: "/admin/pemasukan/mahasiswa/master/tagihan",
  },
  defaultThAkademikId: {
    type: [Number, String],
    default: null,
  },
  defaultThAngkatanId: {
    type: [Number, String],
    default: null,
  },
  defaultProdiId: {
    type: [Number, String],
    default: null,
  },
  defaultDoubleDegree: {
    type: [Number, String],
    default: null,
  },
  defaultKelasId: {
    type: [Number, String],
    default: 6,
  },
  useActiveThAkademik: {
    type: Boolean,
    default: false,
  },
  multipleTagihan: {
    type: Boolean,
    default: false,
  },
  isRoleVisible: {
    type: Boolean,
    required: false,
  },
})

const router = useRouter()

const passwordValidator = value => {
  if (value.length < 6) return "Password must be at least 6 characters"
  
  return true
}

const noSpaceValidator = value => {
  if (/\s/.test(value))
    return "Username cannot contain spaces, example: fulanah123"
  
  return true
}

const refForm = ref(null)

const selectedThAkademik = ref()
const thAkademik = ref([])
const selectedThAngkatan = ref()
const thAngkatan = ref([])
const selectedProdi = ref()
const prodi = ref([])
const selectedFormSchadule = ref()
const formSchadule = ref([])
const selectedMataUangId = ref()
const mataUang = ref([])

const isMultipleTagihan = computed(
  () => props.multipleTagihan && props.typeForm !== "edit",
)

const createEmptyTagihanItem = () => ({
  nama: "",
  mata_uang_id: selectedMataUangId.value,
  jumlah: "",
})

const tagihanItems = ref([createEmptyTagihanItem()])

const doubleDegree = ref([
  {
    title: "Tidak",
    value: 0,
  },
  {
    title: "Ya",
    value: 1,
  },
])

const selectedDoubleDegree = ref()
const selectedKelasId = ref(6)

const nim = ref("")
const mahasiswaList = ref([])
const selectedMahasiswa = ref(null)
const searchMahasiswa = ref("")
const loadingSearchMahasiswa = ref(false)
const loadingDataMahasiswa = ref(false)

const createEmptyMahasiswaDetail = () => ({
  nim: "",
  nama: "",
  prodi: "",
  jenisKelamin: "",
  angkatan: "",
  kelas: "",
  semester: "",
})

const mahasiswaDetail = ref(createEmptyMahasiswaDetail())
const hasMahasiswaDetail = computed(() => Boolean(mahasiswaDetail.value.nim))
const nama = ref("")
const jumlah = ref("")

const disabled = ref(false)

const submitButtonText = computed(() => {
  if (!isMultipleTagihan.value) return "Submit"

  return `Simpan ${tagihanItems.value.length} Tagihan`
})

const passwordRules = ref([requiredValidator, passwordValidator])

const normalizeSelectValue = value => {
  if (value === null || value === undefined || value === "") return undefined

  const numericValue = Number(value)
  
  return Number.isNaN(numericValue) ? value : numericValue
}

const makeMahasiswaOption = mahasiswa => ({
  ...mahasiswa,
  display: mahasiswa.display || `${mahasiswa.nim}${mahasiswa.nama ? ` - ${mahasiswa.nama}` : ""}`,
})

const setMahasiswaDetail = (mahasiswa = {}) => {
  mahasiswaDetail.value = {
    nim: mahasiswa.nim || "",
    nama: mahasiswa.nama || "",
    prodi: mahasiswa.prodi?.nama || mahasiswa.prodi_nama || mahasiswa.nama_prodi || "",
    jenisKelamin: mahasiswa.jk?.nama || mahasiswa.jenis_kelamin || mahasiswa.jenisKelamin || "",
    angkatan: mahasiswa.th_akademik?.kode || mahasiswa.angkatan || mahasiswa.th_angkatan_kode || "",
    kelas: mahasiswa.kelas?.nama || mahasiswa.kelas_nama || mahasiswa.nama_kelas || "",
    semester: mahasiswa.semester || "",
  }
}

const resetMahasiswaDetail = () => {
  mahasiswaDetail.value = createEmptyMahasiswaDetail()
}

const setSelectedMahasiswaFromNim = value => {
  if (!value || !props.searchNim) return

  const mahasiswa = makeMahasiswaOption({
    nim: value,
    nama: "",
  })

  selectedMahasiswa.value = mahasiswa
  searchMahasiswa.value = mahasiswa.display
}

const applyMahasiswaDefaults = mahasiswa => {
  if (!mahasiswa || typeof mahasiswa !== "object" || Array.isArray(mahasiswa))
    return

  const prodiDoubleDegreeId = Number(mahasiswa.prodi_double_degree_id) > 0
    ? mahasiswa.prodi_double_degree_id
    : null

  const thAngkatanId = normalizeSelectValue(
    mahasiswa.th_akademik_id || mahasiswa.th_angkatan_id,
  )

  const prodiId = normalizeSelectValue(prodiDoubleDegreeId || mahasiswa.prodi_id)
  const kelasId = normalizeSelectValue(mahasiswa.kelas_id)

  const doubleDegreeValue = normalizeSelectValue(
    prodiDoubleDegreeId ? 1 : mahasiswa.double_degree,
  )

  if (thAngkatanId !== undefined) selectedThAngkatan.value = thAngkatanId
  if (prodiId !== undefined) selectedProdi.value = prodiId
  if (kelasId !== undefined) selectedKelasId.value = kelasId
  selectedDoubleDegree.value = doubleDegreeValue ?? 0
}

const fetchMahasiswaDetail = async nimValue => {
  if (!nimValue || !props.searchNim) return null

  try {
    loadingDataMahasiswa.value = true

    const mahasiswa = await $api("/admin/mahasiswa/nim", {
      method: "GET",
      body: {
        nim: nimValue,
      },
    })

    if (!mahasiswa || (Array.isArray(mahasiswa) && mahasiswa.length < 1)) {
      resetMahasiswaDetail()
      showSnackbar({
        text: "Data mahasiswa tidak ditemukan",
        color: "error",
      })
      
      return null
    }

    setMahasiswaDetail(mahasiswa)
    applyMahasiswaDefaults(mahasiswa)

    return mahasiswa
  } catch (err) {
    resetMahasiswaDetail()
    showSnackbar({
      text: err.data?.message || "Gagal mendapatkan detail mahasiswa",
      color: "error",
    })
    
    return null
  } finally {
    loadingDataMahasiswa.value = false
  }
}

const fetchThAkademik = async () => {
  try {
    const params = {
      limit: 0,
      sort_key: "kode",
      sort_order: "desc",
    }

    if (props.useActiveThAkademik) params.aktif = "Y"

    const { data } = await $api("/admin/th-akademik", {
      method: "GET",
      params,
    })

    thAkademik.value = data.data.map(thAkademik => {
      return {
        title: `${thAkademik.nama} - ${thAkademik.semester}`,
        value: thAkademik.id,
      }
    })

    if (props.useActiveThAkademik && thAkademik.value.length > 0) {
      selectedThAkademik.value = thAkademik.value[0].value
    }
  } catch (err) {
    console.error(err)
  }
}

const fetchThAngkatan = async () => {
  try {
    const { data } = await $api("/admin/th-akademik", {
      method: "GET",
      body: {
        limit: 0,
        sort_key: "kode",
        sort_order: "desc",
        search: "ganjil",
      },
    })

    thAngkatan.value = data.data.map(thAngkatan => {
      return {
        title: thAngkatan.kode.slice(0, -1),
        value: thAngkatan.id,
      }
    })
  } catch (err) {
    console.error(err)
  }
}

const fetchProdi = async () => {
  try {
    const { data } = await $api("/admin/prodi", {
      method: "GET",
      params: {
        limit: 0,
        sort_key: "kode",
        sort_order: "desc",
      },
    })

    prodi.value = data.data.map(prodi => {
      return {
        title: prodi.nama,
        value: prodi.id,
      }
    })
  } catch (err) {
    console.error(err)
  }
}

const fetchFormSchadule = async () => {
  try {
    const { data } = await $api("/admin/form-schadule", {
      method: "GET",
      body: {
        limit: 0,
      },
    })

    formSchadule.value = data.data.map(formSchadule => {
      return {
        title: formSchadule.nama,
        value: formSchadule.id,
      }
    })
  } catch (err) {
    console.error(err)
  }
}

const fetchMataUang = async () => {
  try {
    const { data } = await $api("/admin/mata-uang", {
      method: "GET",
      params: {
        limit: 0,
        sort_key: "kode",
        sort_order: "asc",
      },
    })

    mataUang.value = data.data.map(item => {
      return {
        title: `${item.kode} - ${item.nama}${item.simbol ? ` (${item.simbol})` : ""}`,
        value: item.id,
      }
    })

    if (!selectedMataUangId.value && mataUang.value.length > 0) {
      selectedMataUangId.value =
        data.data.find(item => item.kode === "IDR")?.id ??
        mataUang.value[0].value
    }

    tagihanItems.value = tagihanItems.value.map(item => ({
      ...item,
      mata_uang_id: item.mata_uang_id || selectedMataUangId.value,
    }))
  } catch (err) {
    console.error(err)
  }
}

onMounted(async () => {
  await fetchThAkademik()
  fetchThAngkatan()
  fetchProdi()
  fetchFormSchadule()
  fetchMataUang()

  nim.value = props.nim || ""
  setSelectedMahasiswaFromNim(nim.value)
  selectedKelasId.value = normalizeSelectValue(props.defaultKelasId) ?? 6

  if (props.typeForm === "edit") {
    selectedThAkademik.value = props.dataForm.th_akademik_id
    selectedThAngkatan.value = props.dataForm.th_angkatan_id
    selectedFormSchadule.value = props.dataForm.form_schadule_id
    selectedProdi.value = props.dataForm.prodi_id
    selectedDoubleDegree.value = props.dataForm.double_degree
    selectedKelasId.value = props.dataForm.kelas_id ?? selectedKelasId.value
    selectedMataUangId.value =
      props.dataForm.mata_uang_id || props.dataForm.mata_uang?.id || selectedMataUangId.value
    nim.value = props.dataForm.nim ?? nim.value
    setSelectedMahasiswaFromNim(nim.value)
    nama.value = props.dataForm.nama
    jumlah.value = props.dataForm.jumlah
  } else {
    selectedThAkademik.value = normalizeSelectValue(props.defaultThAkademikId) ?? selectedThAkademik.value
    selectedThAngkatan.value = normalizeSelectValue(props.defaultThAngkatanId)
    selectedProdi.value = normalizeSelectValue(props.defaultProdiId)
    selectedDoubleDegree.value = normalizeSelectValue(props.defaultDoubleDegree)
  }
})

let typingMahasiswaTimeout = null

watch(searchMahasiswa, newVal => {
  if (!props.showNim || !props.searchNim) return

  clearTimeout(typingMahasiswaTimeout)

  const keyword = String(newVal || "").trim()
  if (!keyword || keyword === selectedMahasiswa.value?.display) {
    mahasiswaList.value = []
    loadingSearchMahasiswa.value = false
    
    return
  }

  typingMahasiswaTimeout = setTimeout(async () => {
    try {
      loadingSearchMahasiswa.value = true

      const res = await $api(`/admin/mahasiswa/search/${keyword}`, {
        method: "GET",
      })

      mahasiswaList.value = res.map(mahasiswa =>
        makeMahasiswaOption(mahasiswa),
      )
    } catch (err) {
      showSnackbar({
        text: err.data?.message || "Gagal mencari mahasiswa",
        color: "error",
      })
      mahasiswaList.value = []
    } finally {
      loadingSearchMahasiswa.value = false
    }
  }, 1000)
})

watch(selectedMahasiswa, newVal => {
  if (!props.showNim || !props.searchNim) return

  if (newVal && typeof newVal === "object" && !Array.isArray(newVal)) {
    nim.value = newVal.nim
    applyMahasiswaDefaults(newVal)
    setMahasiswaDetail(newVal)
    fetchMahasiswaDetail(newVal.nim)
  } else if (typeof newVal === "string") {
    nim.value = newVal
    resetMahasiswaDetail()
  } else if (!newVal) {
    nim.value = ""
    resetMahasiswaDetail()
  }
})

onBeforeUnmount(() => {
  clearTimeout(typingMahasiswaTimeout)
})

const addTagihanItem = () => {
  if (tagihanItems.value.length >= 50) {
    showSnackbar({
      text: "Maksimal 50 tagihan dalam satu kali simpan",
      color: "error",
    })
    
    return
  }

  tagihanItems.value.push(createEmptyTagihanItem())
}

const removeTagihanItem = index => {
  if (tagihanItems.value.length === 1) return

  tagihanItems.value.splice(index, 1)
}

const resetTagihanItems = () => {
  if (isMultipleTagihan.value) {
    tagihanItems.value = [createEmptyTagihanItem()]
    
    return
  }

  nama.value = ""
  jumlah.value = ""
}

const getApiErrorMessage = err => {
  const message = err.data?.message

  if (Array.isArray(message)) return message.join("; ")
  if (message && typeof message === "object")
    return Object.values(message).flat().join("; ")

  return message || "Gagal menyimpan tagihan"
}

const onSubmit = async () => {
  const valid = await refForm.value.validate()
  if (!valid.valid) return

  if (props.showNim && props.searchNim && !selectedMahasiswa.value?.nim) {
    showSnackbar({
      text: "Pilih mahasiswa dari hasil pencarian",
      color: "error",
    })
    
    return
  }

  if (props.showNim && !nim.value) {
    showSnackbar({
      text: "NIM harus diisi",
      color: "error",
    })
    
    return
  }

  const method = props.typeForm === "edit" ? "PUT" : "POST"

  disabled.value = true

  const formData = new FormData()

  formData.append("th_akademik_id", selectedThAkademik.value)
  formData.append("th_angkatan_id", selectedThAngkatan.value)
  formData.append("prodi_id", selectedProdi.value)
  formData.append("double_degree", selectedDoubleDegree.value)
  formData.append("form_schadule_id", selectedFormSchadule.value)
  formData.append("kelas_id", selectedKelasId.value)
  if (props.showNim) formData.append("nim", nim.value)

  if (isMultipleTagihan.value) {
    tagihanItems.value.forEach((item, index) => {
      formData.append(`tagihan[${index}][nama]`, item.nama.trim())
      formData.append(
        `tagihan[${index}][mata_uang_id]`,
        item.mata_uang_id,
      )
      formData.append(`tagihan[${index}][jumlah]`, item.jumlah)
    })
  } else {
    formData.append("mata_uang_id", selectedMataUangId.value)
    formData.append("nama", nama.value)
    formData.append("jumlah", jumlah.value)
  }

  formData.append("_method", method)

  try {
    const response = await $api(props.url, {
      method: "POST",
      body: formData,
      onResponseError({ response }) {
        console.error(response)
      },
    })

    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: "success",
      })

      router.push(props.submitRedirect)
    } else {
      showSnackbar({
        text: response.message,
        color: "error",
      })
    }
  } catch (err) {
    showSnackbar({
      text: getApiErrorMessage(err),
      color: "error",
    })
  } finally {
    disabled.value = false
  }
}
</script>

<template>
  <VForm
    ref="refForm"
    @submit.prevent="onSubmit"
  >
    <VRow>
      <VCol
        v-if="showNim && searchNim"
        cols="12"
      >
        <VCombobox
          v-model="selectedMahasiswa"
          v-model:search="searchMahasiswa"
          :items="mahasiswaList"
          item-title="display"
          item-value="nim"
          label="NIM"
          placeholder="Cari NIM / nama mahasiswa"
          :rules="[requiredValidator]"
          :loading="loadingSearchMahasiswa"
          :readonly="Boolean(props.nim)"
          :clearable="!Boolean(props.nim)"
          return-object
        >
          <template #append-inner>
            <VProgressCircular
              v-if="loadingSearchMahasiswa"
              indeterminate
              size="16"
              width="2"
            />
          </template>
        </VCombobox>
      </VCol>
      <template v-if="showNim && searchNim && (hasMahasiswaDetail || loadingDataMahasiswa)">
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="mahasiswaDetail.nim"
            label="NIM"
            placeholder="NIM"
            readonly
            :loading="loadingDataMahasiswa"
          />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="mahasiswaDetail.nama"
            label="Nama"
            placeholder="Nama"
            readonly
            :loading="loadingDataMahasiswa"
          />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="mahasiswaDetail.prodi"
            label="Prodi"
            placeholder="Prodi"
            readonly
            :loading="loadingDataMahasiswa"
          />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="mahasiswaDetail.jenisKelamin"
            label="Jenis Kelamin"
            placeholder="Jenis Kelamin"
            readonly
            :loading="loadingDataMahasiswa"
          />
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <VTextField
            v-model="mahasiswaDetail.angkatan"
            label="Angkatan"
            placeholder="Angkatan"
            readonly
            :loading="loadingDataMahasiswa"
          />
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <VTextField
            v-model="mahasiswaDetail.kelas"
            label="Kelas"
            placeholder="Kelas"
            readonly
            :loading="loadingDataMahasiswa"
          />
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <VTextField
            v-model="mahasiswaDetail.semester"
            label="Semester"
            placeholder="Semester"
            readonly
            :loading="loadingDataMahasiswa"
          />
        </VCol>
      </template>
      <VCol
        v-else-if="showNim"
        cols="12"
      >
        <VTextField
          v-model="nim"
          :rules="[requiredValidator]"
          label="NIM"
          placeholder="NIM Mahasiswa"
          :readonly="Boolean(props.nim)"
        />
      </VCol>
      <VCol cols="12">
        <VSelect
          v-model="selectedThAkademik"
          label="Select Th Akademik"
          placeholder="Select Th Akademik"
          :items="thAkademik"
          :rules="[requiredValidator]"
          clear-icon="ri-close-line"
        />
      </VCol>
      <VCol cols="12">
        <VSelect
          v-model="selectedThAngkatan"
          label="Select Th Angkatan"
          placeholder="Select Th Angkatan"
          :items="thAngkatan"
          :rules="[requiredValidator]"
          clear-icon="ri-close-line"
        />
      </VCol>
      <VCol cols="12">
        <VSelect
          v-model="selectedProdi"
          label="Select Prodi"
          placeholder="Select Prodi"
          :items="prodi"
          :rules="[requiredValidator]"
          clear-icon="ri-close-line"
        />
      </VCol>
      <VCol cols="12">
        <VSelect
          v-model="selectedDoubleDegree"
          label="Select Double Degree"
          placeholder="Select Double Degree"
          :items="doubleDegree"
          :rules="[requiredValidator]"
          clear-icon="ri-close-line"
        />
      </VCol>
      <VCol cols="12">
        <VSelect
          v-model="selectedFormSchadule"
          label="Select Formulir"
          placeholder="Select Formulir"
          :items="formSchadule"
          :rules="[requiredValidator]"
          clear-icon="ri-close-line"
        />
      </VCol>

      <VCol
        v-if="isMultipleTagihan"
        cols="12"
      >
        <VCard variant="outlined">
          <VCardText class="d-flex align-center justify-space-between flex-wrap gap-3">
            <div>
              <div class="text-h6">
                Daftar Tagihan
              </div>
              <div class="text-body-2 text-medium-emphasis">
                Tambahkan beberapa tagihan untuk mahasiswa yang sama.
              </div>
            </div>
            <VBtn
              color="primary"
              variant="tonal"
              prepend-icon="ri-add-line"
              :disabled="tagihanItems.length >= 50"
              @click="addTagihanItem"
            >
              Tambah Tagihan
            </VBtn>
          </VCardText>

          <VDivider />

          <VCardText>
            <VRow
              v-for="(item, index) in tagihanItems"
              :key="index"
              align="center"
            >
              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="item.nama"
                  :rules="[requiredValidator]"
                  :label="`Nama Tagihan ${index + 1}`"
                  placeholder="KRS ...."
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VSelect
                  v-model="item.mata_uang_id"
                  label="Mata Uang"
                  placeholder="Pilih Mata Uang"
                  :items="mataUang"
                  :rules="[requiredValidator]"
                  clear-icon="ri-close-line"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="item.jumlah"
                  :rules="[requiredValidator]"
                  label="Jumlah"
                  placeholder="10000..."
                  type="number"
                  min="0"
                />
              </VCol>
              <VCol
                cols="12"
                md="1"
                class="d-flex justify-end"
              >
                <VBtn
                  icon
                  color="error"
                  variant="text"
                  :disabled="tagihanItems.length === 1"
                  aria-label="Hapus tagihan"
                  @click="removeTagihanItem(index)"
                >
                  <VIcon icon="ri-delete-bin-line" />
                </VBtn>
              </VCol>
              <VCol
                v-if="index < tagihanItems.length - 1"
                cols="12"
                class="py-0"
              >
                <VDivider />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
      <template v-else>
        <VCol cols="12">
          <VTextField
            v-model="nama"
            :rules="[requiredValidator]"
            label="Nama"
            placeholder="KRS ...."
          />
        </VCol>
        <VCol cols="12">
          <VSelect
            v-model="selectedMataUangId"
            label="Mata Uang"
            placeholder="Select Mata Uang"
            :items="mataUang"
            :rules="[requiredValidator]"
            clear-icon="ri-close-line"
          />
        </VCol>
        <VCol cols="12">
          <VTextField
            v-model="jumlah"
            :rules="[requiredValidator, noSpaceValidator]"
            label="Jumlah"
            placeholder="10000..."
            type="number"
          />
        </VCol>
      </template>
      <VCol
        cols="12"
        class="d-flex gap-4"
      >
        <VBtn
          type="submit"
          :disabled
          :loading="disabled"
          @click="refForm?.validate()"
        >
          {{ submitButtonText }}
        </VBtn>

        <VBtn
          v-if="typeForm !== 'edit'"
          type="reset"
          color="secondary"
          variant="tonal"
          @click="resetTagihanItems"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>

<style lang="scss">
.photo {
  block-size: 100px;
}
</style>
