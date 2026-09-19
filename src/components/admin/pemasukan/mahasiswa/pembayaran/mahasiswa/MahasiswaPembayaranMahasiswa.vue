<script setup>
const emit = defineEmits(["refreshTagihan", "refreshDeposit"])

const mahasiswaList = ref([])

const search = ref("")
const searchNim = ref("")
const selectedMahasiswa = ref("")
const loadingDataMahasiswa = ref(false)
const loadingSearch = ref(false)
const isMenuOpen = ref(false)

const emptyMahasiswa = {
  nim: "",
  nama: "",
  namaAyah: "",
  prodi: "",
  prodiAlias: "",
  jenisKelamin: "",
  jkId: "",
  angkatan: "",
  kelas: "",
  semester: "",
  deposit: 0,
  dipakai: 0,
  tagihan: [],
  wisuda: null,
}

const mahasiswa = ref({ ...emptyMahasiswa })

let typingTimeout = null
let justSelected = false

watch(search, newVal => {
  clearTimeout(typingTimeout)

  // Jika baru saja memilih mahasiswa dari dropdown, jangan cari lagi dan pastikan menu tertutup
  if (justSelected) {
    isMenuOpen.value = false
    
    return
  }

  const query = String(newVal || "").trim()

  if (!query) {
    mahasiswaList.value = []
    loadingSearch.value = false
    isMenuOpen.value = false
    
    return
  }

  // Jika teks search sama persis dengan yang sedang dipilih (display), jangan cari lagi
  if (
    selectedMahasiswa.value &&
    typeof selectedMahasiswa.value === "object" &&
    query === selectedMahasiswa.value.display
  ) {
    isMenuOpen.value = false
    
    return
  }

  typingTimeout = setTimeout(async () => {
    try {
      loadingSearch.value = true

      const res = await $api(`/admin/mahasiswa/search/${encodeURIComponent(query)}`, {
        method: "GET",
      })

      // Jika user sudah memilih saat API baru selesai, batalkan buka menu
      if (justSelected) {
        isMenuOpen.value = false
        
        return
      }

      // ubah hasil API jadi format { nim, nama, display: "nama - nim" }
      mahasiswaList.value = (res || []).map(m => ({
        ...m,
        display: `${m.nim} - ${m.nama}`,
      }))

      await nextTick()
      if (mahasiswaList.value.length > 0 && !justSelected) {
        isMenuOpen.value = true
      } else {
        isMenuOpen.value = false
      }
    } catch (err) {
      showSnackbar({
        text: "Gagal mendapatkan list mahasiswa",
        color: "error",
      })
      mahasiswaList.value = []
      isMenuOpen.value = false
    } finally {
      loadingSearch.value = false
    }
  }, 300) // <-- debounce 300 mili detik
})

watch(selectedMahasiswa, newVal => {
  if (newVal && typeof newVal === "object" && !Array.isArray(newVal)) {
    // User memilih item dari dropdown list
    justSelected = true
    clearTimeout(typingTimeout)
    isMenuOpen.value = false
    mahasiswaList.value = []

    searchNim.value = newVal.nim
    searching()

    setTimeout(() => {
      justSelected = false
    }, 500)
  } else if (typeof newVal === "string") {
    // User sedang mengetik di field input
    searchNim.value = newVal
  } else if (!newVal) {
    searchNim.value = ""
    mahasiswaList.value = []
    isMenuOpen.value = false
  }
})

const onEnterKey = () => {
  clearTimeout(typingTimeout)
  isMenuOpen.value = false

  nextTick(() => {
    isMenuOpen.value = false
    if (!searchNim.value && search.value) {
      const parts = String(search.value).split("-")

      searchNim.value = parts[0].trim()
    }
    if (searchNim.value && searchNim.value !== mahasiswa.value.nim) {
      searching()
    }
  })
}

const searching = async () => {
  isMenuOpen.value = false
  clearTimeout(typingTimeout)
  mahasiswaList.value = []

  if (!searchNim.value && search.value) {
    const parts = String(search.value).split("-")

    searchNim.value = parts[0].trim()
  }

  if (!searchNim.value) {
    showSnackbar({
      text: "NIM harus diisi",
      color: "error",
    })
    
    return
  }

  try {
    loadingDataMahasiswa.value = true

    const res = await $api(`/admin/mahasiswa/nim`, {
      method: "GET",
      body: {
        nim: searchNim.value,
      },
    })

    if (!res || res.length < 1) {
      showSnackbar({
        text: "Data mahasiswa tidak ditemukan",
        color: "error",
      })
      
      return
    }

    mahasiswa.value.nim = res.nim
    mahasiswa.value.nama = res.nama
    mahasiswa.value.namaAyah = res.nama_ayah ?? res.ayah ?? res.mhs_ayah ?? "-"
    mahasiswa.value.prodi = res.prodi?.nama
    mahasiswa.value.prodiAlias = res.prodi?.alias ?? res.prodi_alias ?? res.alias ?? res.prodi?.nama
    mahasiswa.value.jenisKelamin = res.jk?.nama
    mahasiswa.value.jkId = res.jk?.id
    mahasiswa.value.angkatan = res.th_akademik?.kode
    mahasiswa.value.kelas = res.kelas?.nama
    mahasiswa.value.semester = res.semester

    emit("refreshTagihan", mahasiswa.value.nim)
    emit("refreshDeposit")
  } catch (error) {
    showSnackbar({
      text: error,
      color: "error",
    })
  } finally {
    loadingDataMahasiswa.value = false
    isMenuOpen.value = false
  }
}

const refSearch = ref(null)

const nimFocus = async () => {
  await nextTick()
  refSearch.value?.focus?.()
}

const selectAll = async () => {
  // tunggu sampai elemen input benar-benar ter-render
  await nextTick()

  // akses input dalam VCombobox
  const input = refSearch.value?.$el?.querySelector("input")
  if (input) {
    input.select() // ✨ menyorot seluruh teks di dalam field
  }
}

onMounted(async () => {
  nimFocus()
})

defineExpose({
  mahasiswa,
  searching,
  nimFocus,
})
</script>

<template>
  <!-- 👉 Mahasiswa -->
  <VCard
    class="mb-6"
    title="Mahasiswa"
  >
    <VCardText>
      <VRow>
        <VCol cols="12">
          <VCombobox
            ref="refSearch"
            v-model="selectedMahasiswa"
            v-model:search="search"
            v-model:menu="isMenuOpen"
            :items="mahasiswaList"
            item-title="display"
            item-value="nim"
            :no-filter="true"
            :menu-props="{ closeOnContentClick: true }"
            return-object
            label="NIM"
            clearable
            :loading="loadingSearch"
            autocomplete="off"
            @focus="selectAll"
            @click="selectAll"
            @keydown.enter="onEnterKey"
          >
            <template #append-inner>
              <VProgressCircular
                v-if="loadingSearch"
                indeterminate
                size="16"
                width="2"
              />
            </template>

            <!-- Append -->
            <template #append>
              <VBtn
                :size="$vuetify.display.smAndDown ? 'small' : 'large'"
                :icon="$vuetify.display.smAndDown"
                @click="searching"
              >
                <VIcon icon="ri-search-line" />
                <span
                  v-if="$vuetify.display.mdAndUp"
                  class="ms-3"
                >Search</span>
              </VBtn>
            </template>
          </VCombobox>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="mahasiswa.nim"
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
            v-model="mahasiswa.nama"
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
            v-model="mahasiswa.prodi"
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
            v-model="mahasiswa.jenisKelamin"
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
            v-model="mahasiswa.angkatan"
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
            v-model="mahasiswa.kelas"
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
            v-model="mahasiswa.semester"
            label="Semester"
            placeholder="Semester"
            readonly
            :loading="loadingDataMahasiswa"
          />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
