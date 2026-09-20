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
    default: () => ({}),
  },
  url: {
    type: String,
    required: false,
    default: "",
  },
})

const router = useRouter()
const refForm = ref(null)

const emptyMahasiswa = {
  nim: "",
  nama: "",
  prodi: "",
  jenisKelamin: "",
  jkId: "",
  angkatan: "",
  kelas: "",
  semester: "",
  deposit: 0,
  dipakai: 0,
  tagihan: [],
}

const mahasiswaList = ref([])
const search = ref("")
const searchNim = ref("")
const selectedMahasiswa = ref(null)

const loadingDataMahasiswa = ref(false)
const loadingSearch = ref(false)

watch(selectedMahasiswa, newVal => {
  if (newVal && typeof newVal === "object" && !Array.isArray(newVal)) {
    searchNim.value = newVal.nim
    searching()
  } else if (typeof newVal === "string") {
    searchNim.value = newVal
  } else if (!newVal) {
    searchNim.value = ""
  }
})

let typingTimeout = null
const mahasiswa = ref(emptyMahasiswa)
const keterangan = ref("")
const disabledSusulan = ref(true)
const disabled = ref(false)
const disabledSearch = ref(false)

watch(search, newVal => {
  clearTimeout(typingTimeout)

  if (!newVal.trim()) {
    mahasiswaList.value = []
    loadingSearch.value = false
    return
  }

  typingTimeout = setTimeout(async () => {
    try {
      loadingSearch.value = true

      const res = await $api(`/admin/mahasiswa/search/${newVal}`, {
        method: "GET",
      })

      mahasiswaList.value = (res || []).map(m => ({
        ...m,
        display: `${m.nim} - ${m.nama}`,
      }))
    } catch (err) {
      showSnackbar({
        text: "Gagal mendapatkan list mahasiswa",
        color: "error",
      })
      mahasiswaList.value = []
    } finally {
      loadingSearch.value = false
    }
  }, 1000)
})

const searching = async () => {
  if (!searchNim.value) {
    showSnackbar({
      text: "NIM harus diisi",
      color: "error",
    })
    return
  }

  try {
    loadingDataMahasiswa.value = true
    disabledSusulan.value = true

    const res = await $api(`/admin/mahasiswa/nim`, {
      method: "GET",
      params: {
        nim: searchNim.value,
      },
    })

    if (!res || !res.nim) {
      showSnackbar({
        text: "Data mahasiswa tidak ditemukan",
        color: "error",
      })
      return
    }

    mahasiswa.value.nim = res.nim
    mahasiswa.value.nama = res.nama
    mahasiswa.value.prodi = res.prodi?.nama || res.prodi?.alias || ""
    mahasiswa.value.jenisKelamin = res.jk?.nama || ""
    mahasiswa.value.jkId = res.jk?.id || ""
    mahasiswa.value.angkatan = res.th_akademik?.kode || ""
    mahasiswa.value.kelas = res.kelas?.nama || ""
    mahasiswa.value.semester = res.semester || ""

    disabledSusulan.value = false
  } catch (error) {
    disabledSusulan.value = true
    showSnackbar({
      text: typeof error === "string" ? error : "Gagal memuat data mahasiswa",
      color: "error",
    })
  } finally {
    loadingDataMahasiswa.value = false
  }
}

const selectedThAkademik = ref(null)
const thAkademik = ref([])
const isLoadingThAkademik = ref(false)
const tanggal = ref("")

const thAkademikDisplay = computed(() => {
  if (props.dataForm?.th_akademik) {
    const { nama, semester } = props.dataForm.th_akademik
    return [nama, semester].filter(Boolean).join(" - ")
  }
  const found = thAkademik.value.find(th => Number(th.value) === Number(selectedThAkademik.value))
  if (found) {
    return found.title
  }
  return ""
})

const fetchThAkademik = async () => {
  try {
    isLoadingThAkademik.value = true

    const { data } = await $api("/admin/th-akademik", {
      method: "GET",
      params: { limit: 0 },
    })

    const fetchedList = (data.data || []).map(th => ({
      title: `${th.nama} - ${th.semester}`,
      value: Number(th.id),
      nama: th.nama,
      semester: th.semester,
    }))

    if (props.dataForm?.th_akademik) {
      const th = props.dataForm.th_akademik
      const thId = Number(th.id)
      if (!fetchedList.some(t => Number(t.value) === thId)) {
        fetchedList.unshift({
          title: `${th.nama} - ${th.semester}`,
          value: thId,
          nama: th.nama,
          semester: th.semester,
        })
      }
    }

    thAkademik.value = fetchedList
  } catch (err) {
    console.error(err)
  } finally {
    isLoadingThAkademik.value = false
  }
}

const krsDetailList = ref([])
const selectedJadwal = ref([])
const isLoadingJadwal = ref(false)

const fetchJadwal = async () => {
  if (!mahasiswa.value.nim || !selectedThAkademik.value) return

  try {
    isLoadingJadwal.value = true

    const response = await $api(
      "/admin/pemasukan/mahasiswa/uas-susulan/jadwal-kuliah",
      {
        method: "GET",
        params: {
          nim: mahasiswa.value.nim,
          th_akademik_id: selectedThAkademik.value,
        },
      },
    )

    if (!response || !response.status) {
      showSnackbar({
        text: response?.message || "Gagal mengambil jadwal kuliah",
        color: "error",
      })
      krsDetailList.value = []
      return
    }

    const data = response.data
    krsDetailList.value = data.krs_detail || []

    // Jika mode edit dan ada MK yang sebelumnya terdaftar tapi tidak ada di krs_detail, tambahkan sebagai fallback
    if (props.typeForm === "edit") {
      const uasMkList = props.dataForm?.uas_susulan_mk || props.dataForm?.uasSusulanMk || []
      
      if (krsDetailList.value.length === 0 && props.dataForm?.krs_detail?.length) {
        krsDetailList.value = props.dataForm.krs_detail
      }

      const existingIds = new Set(krsDetailList.value.map(x => x.jadwal_kuliah_id))
      uasMkList.forEach(mk => {
        if (!existingIds.has(mk.jadwal_kuliah_id)) {
          krsDetailList.value.push({
            jadwal_kuliah_id: mk.jadwal_kuliah_id,
            kode_mk: mk.mk_detail?.kode_mk || mk.kode_mk || "-",
            nama_mk: mk.mk_detail?.nama_mk || mk.nama_mk || `Mata Kuliah #${mk.jadwal_kuliah_id}`,
            sks_mk: mk.mk_detail?.sks_mk || mk.sks_mk || "-",
            smt_mk: mk.mk_detail?.smt_mk || mk.smt_mk || "-",
            dosen_nama: mk.mk_detail?.dosen_nama || mk.dosen_nama || "-",
            nilai_akhir: mk.mk_detail?.nilai_akhir ?? mk.nilai_akhir ?? null,
            nilai_huruf: mk.mk_detail?.nilai_huruf || mk.nilai_huruf || "",
            jadwal_kuliah: { kelompok: { kode: mk.mk_detail?.kelompok || mk.kelompok || "-" } },
          })
        }
      })
    }
  } catch (err) {
    console.error("Gagal mengambil data jadwal:", err)
    showSnackbar({
      text: "Gagal mengambil data jadwal kuliah mahasiswa",
      color: "error",
    })
  } finally {
    isLoadingJadwal.value = false
  }
}

const isAllSelected = computed({
  get: () => krsDetailList.value.length > 0 && selectedJadwal.value.length === krsDetailList.value.length,
  set: val => {
    if (val) {
      selectedJadwal.value = krsDetailList.value.map(mk => mk.jadwal_kuliah_id)
    } else {
      selectedJadwal.value = []
    }
  },
})

const isIndeterminate = computed(() => {
  return selectedJadwal.value.length > 0 && selectedJadwal.value.length < krsDetailList.value.length
})

const getNilaiColor = item => {
  if (!item) return "secondary"

  const huruf = String(item.nilai_huruf || "").trim().toUpperCase()
  const hasNilaiAkhir = item.nilai_akhir !== null && item.nilai_akhir !== undefined && String(item.nilai_akhir).trim() !== ""
  const nilaiAkhirNum = hasNilaiAkhir ? Number(item.nilai_akhir) : null

  // Khusus untuk yang nilainya 0 saja yang berwarna merah (error)
  const isZero = hasNilaiAkhir 
    ? (!isNaN(nilaiAkhirNum) && nilaiAkhirNum === 0)
    : (huruf === "E" || huruf === "0")

  if (isZero) return "error"
  if (huruf === "A" || huruf === "A-") return "success"
  if (huruf === "B" || huruf === "B+" || huruf === "B-") return "info"

  // Yang bukan 0 yang tadinya merah (seperti D, D+, C-, dsb) serta C/C+ diberi warna kuning (warning)
  return "warning"
}

const isNilaiMerah = item => {
  return getNilaiColor(item) === "error"
}

const redMksCount = computed(() => {
  return krsDetailList.value.filter(item => isNilaiMerah(item)).length
})

const selectRedMks = () => {
  const redMks = krsDetailList.value
    .filter(item => isNilaiMerah(item))
    .map(item => item.jadwal_kuliah_id)

  selectedJadwal.value = redMks
  if (redMks.length === 0) {
    showSnackbar({
      text: "Tidak ada mata kuliah dengan nilai merah pada semester ini",
      color: "info",
    })
  }
}

const selectAll = () => {
  selectedJadwal.value = krsDetailList.value.map(mk => mk.jadwal_kuliah_id)
}

const unselectAll = () => {
  selectedJadwal.value = []
}

const toggleSelectJadwal = id => {
  if (selectedJadwal.value.includes(id)) {
    selectedJadwal.value = selectedJadwal.value.filter(x => x !== id)
  } else {
    selectedJadwal.value.push(id)
  }
}

watch(
  [selectedThAkademik, mahasiswa],
  async ([th, mhs]) => {
    if (th && mhs.nim) {
      await fetchJadwal()

      const uasMkList = props.dataForm?.uas_susulan_mk || props.dataForm?.uasSusulanMk
      if (props.typeForm === "edit" && uasMkList) {
        selectedJadwal.value = uasMkList.map(item => item.jadwal_kuliah_id)
      }
    }
  },
  { deep: true },
)

const initEditData = async () => {
  if (props.typeForm !== "edit" || !props.dataForm || !props.dataForm.id) return

  disabledSearch.value = true
  selectedMahasiswa.value = props.dataForm.nim
  tanggal.value = props.dataForm.tanggal
  searchNim.value = props.dataForm.nim
  keterangan.value = props.dataForm.keterangan || ""

  const thId = props.dataForm.th_akademik_id
    ? Number(props.dataForm.th_akademik_id)
    : (props.dataForm.th_akademik?.id ? Number(props.dataForm.th_akademik.id) : null)

  selectedThAkademik.value = thId

  if (props.dataForm.th_akademik) {
    const th = props.dataForm.th_akademik
    const thIdNum = Number(th.id)
    if (!thAkademik.value.some(t => Number(t.value) === thIdNum)) {
      thAkademik.value.unshift({
        title: `${th.nama} - ${th.semester}`,
        value: thIdNum,
        nama: th.nama,
        semester: th.semester,
      })
    }
  }

  if (props.dataForm.mahasiswa) {
    const m = props.dataForm.mahasiswa
    mahasiswa.value.nim = m.nim
    mahasiswa.value.nama = m.nama
    mahasiswa.value.prodi = m.prodi?.nama || m.prodi?.alias || ""
    mahasiswa.value.jenisKelamin = m.jk?.nama || ""
    mahasiswa.value.jkId = m.jk?.id || ""
    mahasiswa.value.angkatan = m.th_akademik?.kode || ""
    mahasiswa.value.kelas = m.kelas?.nama || ""
    mahasiswa.value.semester = m.semester || ""
    disabledSusulan.value = false
  } else if (selectedMahasiswa.value) {
    await searching()
  }

  const uasMkList = props.dataForm?.uas_susulan_mk || props.dataForm?.uasSusulanMk
  if (uasMkList) {
    selectedJadwal.value = uasMkList.map(item => item.jadwal_kuliah_id)
  }

  if (mahasiswa.value.nim && selectedThAkademik.value) {
    await fetchJadwal()
    if (uasMkList) {
      selectedJadwal.value = uasMkList.map(item => item.jadwal_kuliah_id)
    }
  }
}

watch(
  () => props.dataForm,
  () => {
    initEditData()
  },
  { deep: true },
)

onMounted(async () => {
  tanggal.value = fDate(new Date())

  if (props.typeForm === "edit" && props.dataForm?.th_akademik) {
    const th = props.dataForm.th_akademik
    const thIdNum = Number(th.id)
    thAkademik.value = [
      {
        title: `${th.nama} - ${th.semester}`,
        value: thIdNum,
        nama: th.nama,
        semester: th.semester,
      },
    ]
    selectedThAkademik.value = thIdNum
  }

  await fetchThAkademik()
  await initEditData()
})

const onSubmit = async () => {
  const valid = await refForm.value.validate()
  if (!valid.valid) return

  if (selectedJadwal.value.length === 0) {
    showSnackbar({
      text: "Harap pilih/centang minimal 1 mata kuliah untuk UAS Susulan",
      color: "warning",
    })
    return
  }

  const method = props.typeForm === "edit" ? "PUT" : "POST"

  disabled.value = true

  const formData = new FormData()

  formData.append("nim", mahasiswa.value.nim)
  formData.append("tanggal", tanggal.value)
  formData.append("th_akademik_id", selectedThAkademik.value)
  formData.append("keterangan", keterangan.value || "")
  selectedJadwal.value.forEach(jadwal => {
    formData.append("jadwal_kuliah_id[]", jadwal)
  })
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
        text: response.message || "Data UAS Susulan berhasil disimpan",
        color: "success",
      })

      router.push("/admin/pemasukan/mahasiswa/uas-susulan")
    } else {
      showSnackbar({
        text: response.message || "Gagal menyimpan data UAS Susulan",
        color: "error",
      })
    }
  } catch (err) {
    const message = Array.isArray(err.data?.message)
      ? err.data.message.join("; ")
      : err.data?.message || err.message || "Terjadi kesalahan saat menyimpan data."

    showSnackbar({
      text: message,
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
      <!-- Input Tanggal -->
      <VCol
        cols="12"
        md="6"
      >
        <AppDateTimePicker
          v-model="tanggal"
          label="Tanggal"
          placeholder="Select date"
          :rules="[requiredValidator]"
          :config="{
            altInput: true,
            altFormat: 'F j, Y',
            dateFormat: 'Y-m-d',
          }"
        />
      </VCol>

      <!-- Select Th Akademik -->
      <VCol
        cols="12"
        md="6"
      >
        <VSelect
          v-model="selectedThAkademik"
          label="Tahun Akademik"
          placeholder="Pilih Tahun Akademik"
          :items="thAkademik"
          item-title="title"
          item-value="value"
          clear-icon="ri-close-line"
          class="custom-bg-select"
          :loading="isLoadingThAkademik"
          :disabled="typeForm === 'edit'"
          :rules="[requiredValidator]"
        >
          <template #selection="{ item }">
            <span>{{ item?.raw?.title || item?.title || thAkademikDisplay }}</span>
          </template>
        </VSelect>
      </VCol>

      <!-- Search Mahasiswa -->
      <VCol cols="12">
        <VCombobox
          v-model="selectedMahasiswa"
          v-model:search="search"
          :items="mahasiswaList"
          item-title="display"
          item-value="nim"
          label="Cari Mahasiswa (NIM / Nama)"
          autocomplete="off"
          placeholder="Ketik NIM atau Nama Mahasiswa..."
          clearable
          :loading="loadingSearch"
          :disabled="disabledSearch"
        >
          <template #append-inner>
            <VProgressCircular
              v-if="loadingSearch"
              indeterminate
              size="16"
              width="2"
            />
          </template>

          <template #append>
            <VBtn
              :size="$vuetify.display.smAndDown ? 'small' : 'large'"
              :icon="$vuetify.display.smAndDown"
              @click="searching"
            >
              <VIcon icon="ri-search-line" />
              <span
                v-if="$vuetify.display.mdAndUp"
                class="ms-2"
              >Cari</span>
            </VBtn>
          </template>
        </VCombobox>
      </VCol>

      <!-- Detail Info Mahasiswa -->
      <VCol
        cols="12"
        md="4"
      >
        <VTextField
          v-model="mahasiswa.nim"
          :rules="[requiredValidator]"
          disabled
          label="NIM"
          placeholder="2020xxxx"
          :loading="loadingDataMahasiswa"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
      >
        <VTextField
          v-model="mahasiswa.nama"
          disabled
          label="Nama Mahasiswa"
          placeholder="Nama Mahasiswa"
          :loading="loadingDataMahasiswa"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
      >
        <VTextField
          v-model="mahasiswa.prodi"
          disabled
          label="Program Studi"
          :loading="loadingDataMahasiswa"
        />
      </VCol>
      <VCol
        cols="12"
        md="3"
      >
        <VTextField
          v-model="mahasiswa.jenisKelamin"
          disabled
          label="Jenis Kelamin"
          :loading="loadingDataMahasiswa"
        />
      </VCol>
      <VCol
        cols="12"
        md="3"
      >
        <VTextField
          v-model="mahasiswa.angkatan"
          disabled
          label="Angkatan"
          :loading="loadingDataMahasiswa"
        />
      </VCol>
      <VCol
        cols="12"
        md="3"
      >
        <VTextField
          v-model="mahasiswa.kelas"
          disabled
          label="Kelas"
          :loading="loadingDataMahasiswa"
        />
      </VCol>
      <VCol
        cols="12"
        md="3"
      >
        <VTextField
          v-model="mahasiswa.semester"
          disabled
          label="Semester Mahasiswa"
          :loading="loadingDataMahasiswa"
        />
      </VCol>

      <!-- Section Table Mata Kuliah dengan Checkbox -->
      <VCol cols="12">
        <VCard
          variant="outlined"
          class="pa-4"
        >
          <div class="d-flex align-center justify-space-between flex-wrap gap-3 mb-3">
            <div class="d-flex align-center gap-3 flex-wrap">
              <div class="text-subtitle-1 font-weight-bold">
                Pilih Mata Kuliah UAS Susulan
                <span class="text-primary font-weight-bold ms-1">
                  ({{ selectedJadwal.length }} dipilih)
                </span>
              </div>

              <!-- Tombol Aksi Cepat (Sat-Set) -->
              <div
                v-if="krsDetailList.length > 0"
                class="d-flex align-center gap-2 flex-wrap"
              >
                <VBtn
                  size="small"
                  color="error"
                  variant="tonal"
                  @click="selectRedMks"
                >
                  <VIcon
                    icon="ri-checkbox-multiple-line"
                    start
                    size="16"
                  />
                  Pilih Nilai Merah
                  <span
                    v-if="redMksCount > 0"
                    class="ms-1 font-weight-bold"
                  >({{ redMksCount }})</span>
                </VBtn>

                <VBtn
                  size="small"
                  color="primary"
                  variant="tonal"
                  @click="selectAll"
                >
                  <VIcon
                    icon="ri-checkbox-line"
                    start
                    size="16"
                  />
                  Pilih Semua
                </VBtn>

                <VBtn
                  size="small"
                  color="secondary"
                  variant="outlined"
                  :disabled="selectedJadwal.length === 0"
                  @click="unselectAll"
                >
                  <VIcon
                    icon="ri-close-circle-line"
                    start
                    size="16"
                  />
                  Hapus Centang Semua
                </VBtn>
              </div>
            </div>
          </div>

          <!-- Loading state -->
          <div
            v-if="isLoadingJadwal"
            class="text-center pa-6"
          >
            <VProgressCircular
              indeterminate
              color="primary"
              class="mb-2"
            />
            <div class="text-body-2 text-medium-emphasis">
              Mengambil data KRS & jadwal mahasiswa dari SIAKAD...
            </div>
          </div>

          <!-- Empty state -->
          <div
            v-else-if="krsDetailList.length === 0"
            class="text-center pa-6 text-medium-emphasis"
          >
            <VIcon
              icon="ri-information-line"
              size="28"
              class="mb-2 text-secondary"
            />
            <div>
              Belum ada daftar mata kuliah. Pastikan Mahasiswa dan Tahun Akademik telah dipilih.
            </div>
          </div>

          <!-- KRS Table -->
          <VTable
            v-else
            density="compact"
            class="border rounded text-no-wrap"
          >
            <thead>
              <tr>
                <th
                  class="text-center"
                  style="inline-size: 50px;"
                >
                  <VCheckbox
                    v-model="isAllSelected"
                    :indeterminate="isIndeterminate"
                    hide-details
                    density="compact"
                  />
                </th>
                <th style="inline-size: 50px;">
                  No
                </th>
                <th>Kode MK</th>
                <th>Nama Mata Kuliah</th>
                <th class="text-center">
                  SKS
                </th>
                <th class="text-center">
                  Smt
                </th>
                <th>Dosen Pengampu</th>
                <th class="text-center">
                  Nilai
                </th>
                <th>Kelompok</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in krsDetailList"
                :key="item.jadwal_kuliah_id"
                :class="{ 'bg-primary-subtle': selectedJadwal.includes(item.jadwal_kuliah_id) }"
                class="cursor-pointer"
                @click="toggleSelectJadwal(item.jadwal_kuliah_id)"
              >
                <td
                  class="text-center"
                  @click.stop
                >
                  <VCheckbox
                    v-model="selectedJadwal"
                    :value="item.jadwal_kuliah_id"
                    hide-details
                    density="compact"
                  />
                </td>
                <td>{{ index + 1 }}</td>
                <td class="font-weight-medium">
                  {{ item.kode_mk || item.jadwal_kuliah?.kurikulum_matakuliah?.matakuliah?.kode || '-' }}
                </td>
                <td>
                  <span class="font-weight-bold">
                    {{ item.nama_mk || item.jadwal_kuliah?.kurikulum_matakuliah?.matakuliah?.nama || '-' }}
                  </span>
                </td>
                <td class="text-center">
                  {{ item.sks_mk || item.jadwal_kuliah?.kurikulum_matakuliah?.matakuliah?.sks || '-' }}
                </td>
                <td class="text-center">
                  {{ item.smt_mk || item.jadwal_kuliah?.smt || '-' }}
                </td>
                <td>
                  <span class="text-body-2">
                    {{ item.dosen_nama || '-' }}
                  </span>
                </td>
                <td class="text-center">
                  <VChip
                    size="x-small"
                    :color="getNilaiColor(item)"
                    label
                  >
                    {{ item.nilai_akhir != null ? item.nilai_akhir : '-' }}
                    <span v-if="item.nilai_huruf"> ({{ item.nilai_huruf }})</span>
                  </VChip>
                </td>
                <td>
                  <span class="text-caption">
                    {{ item.jadwal_kuliah?.kelompok?.kode || '-' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </VTable>

          <!-- Selected Summary -->
          <div
            v-if="selectedJadwal.length > 0"
            class="d-flex align-center gap-2 mt-3 pa-2 rounded border text-caption bg-var-theme-background"
          >
            <VIcon
              icon="ri-checkbox-circle-fill"
              color="success"
              size="18"
            />
            <span>
              <strong>{{ selectedJadwal.length }}</strong> mata kuliah dipilih untuk didaftarkan ke UAS Susulan.
            </span>
          </div>
        </VCard>
      </VCol>

      <!-- Keterangan -->
      <VCol cols="12">
        <VTextarea
          v-model="keterangan"
          label="Keterangan / Alasan Susulan (Opsional)"
          placeholder="Contoh: Sakit saat jadwal UAS, izin dispensasi, dsb."
          rows="3"
        />
      </VCol>

      <!-- Submit buttons -->
      <VCol
        cols="12"
        class="d-flex gap-4"
      >
        <VBtn
          type="submit"
          :disabled="disabled"
          prepend-icon="ri-save-line"
        >
          Simpan Perubahan
        </VBtn>
        <VBtn
          v-if="typeForm !== 'edit'"
          type="reset"
          color="secondary"
          variant="tonal"
        >
          Reset
        </VBtn>
        <VBtn
          v-else
          variant="outlined"
          color="secondary"
          @click="router.push('/admin/pemasukan/mahasiswa/uas-susulan')"
        >
          Batal
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.bg-primary-subtle {
  background-color: rgba(var(--v-theme-primary), 0.08);
}
</style>
