<script setup>
import { showSnackbar } from "@/composables/snackbar"

const props = defineProps({
  mahasiswa: {
    type: Object,
    default: () => ({}),
  },
  selectedThAkademik: {
    type: [Object, Number, String],
    default: null,
  },
  tagihanList: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(["update:uas-susulan"])

const isUasSusulanActive = ref(false)
const isTambahTagihanActive = ref(false)
const isHanyaUasSusulan = ref(false)
const thAkademikList = ref([])
const selectedThAkademikSusulan = ref(null)
const loadingThAkademik = ref(false)
const loadingKrs = ref(false)
const krsData = ref(null)
const selectedMk = ref([])
const keterangan = ref("")

const krsDetailList = computed(() => {
  return krsData.value?.krs_detail || []
})

const semesterMhs = computed(() => {
  if (krsData.value?.smt) return krsData.value.smt
  if (krsDetailList.value.length > 0 && krsDetailList.value[0]?.smt_mk) {
    return krsDetailList.value[0].smt_mk
  }
  
  return props.mahasiswa?.semester || ""
})

const currentAkademikKode = computed(() => {
  const currentVal = typeof props.selectedThAkademik === "object"
    ? props.selectedThAkademik?.value
    : props.selectedThAkademik

  if (currentVal) {
    const found = thAkademikList.value.find(item => Number(item.value) === Number(currentVal))
    if (found?.kode) return found.kode
  }
  const activeTh = thAkademikList.value.find(item => String(item.aktif || "").toUpperCase() === "Y")
  
  return activeTh?.kode || ""
})

const selectedMkDetails = computed(() => {
  return krsDetailList.value.filter(mk => selectedMk.value.includes(mk.jadwal_kuliah_id))
})

const isAllSelected = computed({
  get: () => krsDetailList.value.length > 0 && selectedMk.value.length === krsDetailList.value.length,
  set: val => {
    if (val) {
      selectedMk.value = krsDetailList.value.map(mk => mk.jadwal_kuliah_id)
    } else {
      selectedMk.value = []
    }
  },
})

const isIndeterminate = computed(() => {
  return selectedMk.value.length > 0 && selectedMk.value.length < krsDetailList.value.length
})

const getNilaiColor = item => {
  const huruf = String(item.nilai_huruf || "").trim().toUpperCase()
  if (huruf === "A" || huruf === "A-") return "success"
  if (huruf === "B" || huruf === "B+") return "info"
  if (huruf === "C" || huruf === "C+") return "warning"
  
  return "error"
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

  selectedMk.value = redMks
  if (redMks.length === 0) {
    showSnackbar({
      text: "Tidak ada mata kuliah dengan nilai merah pada semester ini",
      color: "info",
    })
  }
}

const selectAll = () => {
  selectedMk.value = krsDetailList.value.map(mk => mk.jadwal_kuliah_id)
}

const unselectAll = () => {
  selectedMk.value = []
}

const fetchThAkademik = async () => {
  try {
    loadingThAkademik.value = true

    const { data } = await $api("/admin/th-akademik", {
      method: "GET",
      params: { limit: 0 },
    })

    const list = (data.data || []).map(th => ({
      title: `${th.nama} - ${th.semester}`,
      value: th.id,
      kode: th.kode,
      aktif: th.aktif,
    }))

    thAkademikList.value = list
    autoSelectPreviousThAkademik()
    if (isUasSusulanActive.value) {
      emitUpdate()
    }
  } catch (err) {
    console.error("Gagal mengambil data tahun akademik:", err)
  } finally {
    loadingThAkademik.value = false
  }
}

const autoSelectPreviousThAkademik = () => {
  if (!thAkademikList.value.length) return

  const currentVal = typeof props.selectedThAkademik === "object"
    ? props.selectedThAkademik?.value
    : props.selectedThAkademik

  // Urutkan tahun akademik berdasarkan ID ascending
  const sorted = [...thAkademikList.value].sort((a, b) => Number(a.value) - Number(b.value))

  let targetIndex = -1
  if (currentVal) {
    targetIndex = sorted.findIndex(item => Number(item.value) === Number(currentVal))
  } else {
    // cari yang aktif
    targetIndex = sorted.findIndex(item => String(item.aktif || "").toUpperCase() === "Y")
  }

  if (targetIndex > 0) {
    selectedThAkademikSusulan.value = sorted[targetIndex - 1].value
  } else if (sorted.length > 0) {
    selectedThAkademikSusulan.value = sorted[0].value
  }
}

const fetchKrsDetail = async (nimParam = null) => {
  const nim = nimParam || props.mahasiswa?.nim
  const thId = selectedThAkademikSusulan.value

  if (!isUasSusulanActive.value || !nim || !thId) {
    krsData.value = null
    selectedMk.value = []
    emitUpdate()
    
    return
  }

  try {
    loadingKrs.value = true
    selectedMk.value = []

    const response = await $api("/admin/pemasukan/mahasiswa/uas-susulan/jadwal-kuliah", {
      method: "GET",
      params: {
        nim,
        "th_akademik_id": thId,
      },
    })

    if (response?.data) {
      krsData.value = response.data

      // Otomatis centang semua mata kuliah yang bernilai merah
      const redMks = (response.data.krs_detail || [])
        .filter(item => isNilaiMerah(item))
        .map(item => item.jadwal_kuliah_id)

      selectedMk.value = redMks
    } else {
      krsData.value = null
      selectedMk.value = []
    }
  } catch (err) {
    console.error("Gagal mengambil KRS mahasiswa:", err)
    showSnackbar({
      text: "Gagal mengambil data KRS mahasiswa untuk UAS Susulan",
      color: "error",
    })
    krsData.value = null
  } finally {
    loadingKrs.value = false
    emitUpdate()
  }
}

const uasRegulerTagihan = computed(() => {
  if (!selectedThAkademikSusulan.value) return null
  const selectedTh = thAkademikList.value.find(item => Number(item.value) === Number(selectedThAkademikSusulan.value))
  const selectedKode = selectedTh?.kode

  return (props.tagihanList || []).find(t => {
    const namaUpper = String(t.nama || "").toUpperCase()
    const isUas = (namaUpper.includes("UAS") || namaUpper.includes("UJIAN AKHIR")) && !namaUpper.includes("SUSULAN")
    if (!isUas) return false

    const thId = t.th_akademik_id ?? t.th_akademik?.id
    if (thId != null && Number(thId) === Number(selectedThAkademikSusulan.value)) {
      return true
    }

    const thKode = t.th_akademik_kode ?? t.th_akademik?.kode

    return Boolean(thKode && selectedKode && String(thKode) === String(selectedKode))
  })
})

const isUasRegulerLunas = computed(() => {
  if (!props.mahasiswa?.nim) return true

  return !(uasRegulerTagihan.value && Number(uasRegulerTagihan.value.sisa || 0) > 0)
})

const isAlreadyRegistered = ref(false)
const registeredData = ref(null)
const checkingRegistered = ref(false)

const currentSectionThAkademikId = computed(() => {
  if (typeof props.selectedThAkademik === "object" && props.selectedThAkademik !== null) {
    return props.selectedThAkademik.value
  }
  
  return props.selectedThAkademik
})

const checkRegisteredStatus = async (nimParam = null) => {
  const nim = nimParam || props.mahasiswa?.nim
  const thId = selectedThAkademikSusulan.value || currentSectionThAkademikId.value

  if (!nim || !thId) {
    isAlreadyRegistered.value = false
    registeredData.value = null

    return
  }

  try {
    checkingRegistered.value = true

    const res = await $api("/admin/pemasukan/mahasiswa/uas-susulan/check-registered", {
      method: "GET",
      params: {
        nim,
        "th_akademik_id": thId,
      },
    })

    if (res?.is_registered) {
      isAlreadyRegistered.value = true
      registeredData.value = res.data
      isUasSusulanActive.value = false
    } else {
      isAlreadyRegistered.value = false
      registeredData.value = null
    }
  } catch (err) {
    console.error("Gagal mengecek status pendaftaran UAS Susulan:", err)
  } finally {
    checkingRegistered.value = false
    emitUpdate()
  }
}

const emitUpdate = () => {
  emit("update:uas-susulan", {
    active: isUasSusulanActive.value,
    isAlreadyRegistered: isAlreadyRegistered.value,
    registeredData: registeredData.value,
    tambahTagihan: isTambahTagihanActive.value,
    hanyaUasSusulan: isHanyaUasSusulan.value,
    uasRegulerTagihan: uasRegulerTagihan.value,
    isUasRegulerLunas: isUasRegulerLunas.value,
    selectedMk: selectedMk.value,
    selectedMkDetails: selectedMkDetails.value,
    thAkademikSusulanId: selectedThAkademikSusulan.value,
    semesterMhs: semesterMhs.value,
    akademikKode: currentAkademikKode.value,
    keterangan: keterangan.value,
  })
}

// Watchers
watch(
  () => props.selectedThAkademik,
  () => {
    if (!selectedThAkademikSusulan.value) {
      autoSelectPreviousThAkademik()
    }
    checkRegisteredStatus()
    emitUpdate()
  },
  { deep: true },
)

watch(
  () => props.mahasiswa?.nim,
  newNim => {
    if (newNim) {
      checkRegisteredStatus(newNim)
      if (isUasSusulanActive.value) {
        fetchKrsDetail(newNim)
      }
    } else {
      isAlreadyRegistered.value = false
      registeredData.value = null
      krsData.value = null
      selectedMk.value = []
      emitUpdate()
    }
  },
)

watch(isUasSusulanActive, active => {
  if (active) {
    if (isAlreadyRegistered.value) {
      isUasSusulanActive.value = false

      return
    }
    if (!selectedThAkademikSusulan.value) {
      autoSelectPreviousThAkademik()
    }
    fetchKrsDetail()
  } else {
    selectedMk.value = []
    isTambahTagihanActive.value = false
    isHanyaUasSusulan.value = false
  }
  emitUpdate()
})

watch(isTambahTagihanActive, val => {
  if (val) {
    isHanyaUasSusulan.value = false
  }
  emitUpdate()
})

watch(isHanyaUasSusulan, val => {
  if (val) {
    isTambahTagihanActive.value = false
  }
  emitUpdate()
})

watch(isUasRegulerLunas, lunas => {
  if (!lunas && isHanyaUasSusulan.value) {
    isHanyaUasSusulan.value = false
  }
  emitUpdate()
})

watch(
  () => props.tagihanList,
  () => {
    if (isUasSusulanActive.value) {
      emitUpdate()
    }
  },
  { deep: true },
)

watch(selectedThAkademikSusulan, () => {
  checkRegisteredStatus()
  if (isUasSusulanActive.value) {
    emitUpdate()
    if (props.mahasiswa?.nim) {
      fetchKrsDetail()
    }
  }
})

watch([selectedMk, keterangan], () => {
  emitUpdate()
}, { deep: true })

const onMahasiswaChanged = async nim => {
  await checkRegisteredStatus(nim)
  if (isUasSusulanActive.value) {
    await fetchKrsDetail(nim)
  }
}

const resetUasSusulan = () => {
  isUasSusulanActive.value = false
  isTambahTagihanActive.value = false
  isHanyaUasSusulan.value = false
  selectedMk.value = []
  keterangan.value = ""
  krsData.value = null
  emitUpdate()
}

defineExpose({
  resetUasSusulan,
  isUasSusulanActive,
  selectedMk,
  onMahasiswaChanged,
  checkRegisteredStatus,
  isAlreadyRegistered,
})

onMounted(() => {
  fetchThAkademik()
})
</script>

<template>
  <VCard class="uas-susulan-card mb-6">
    <VCardItem class="pb-2">
      <div class="d-flex align-center justify-space-between flex-wrap gap-2">
        <div class="d-flex align-center gap-2">
          <VIcon
            icon="ri-book-open-line"
            size="24"
            color="primary"
          />
          <VCardTitle class="text-h6 font-weight-bold">
            UAS Susulan
          </VCardTitle>
        </div>

        <div class="d-flex align-center gap-4">
          <span class="text-body-2 font-weight-medium">Aktifkan UAS Susulan:</span>
          <VRadioGroup
            v-model="isUasSusulanActive"
            inline
            hide-details
            density="compact"
            :disabled="isAlreadyRegistered || checkingRegistered"
          >
            <VRadio
              :value="false"
              label="OFF"
              color="secondary"
            />
            <VRadio
              :value="Boolean(true)"
              label="ON"
              color="primary"
            />
          </VRadioGroup>
        </div>
      </div>
    </VCardItem>

    <!-- Alert jika sudah pernah terdaftar UAS Susulan di tahun akademik ini -->
    <VAlert
      v-if="isAlreadyRegistered"
      type="error"
      variant="tonal"
      class="mx-4 mb-3"
      density="comfortable"
    >
      <div class="d-flex align-center gap-2 font-weight-bold">
        <VIcon
          icon="ri-error-warning-line"
          size="20"
        />
        Mahasiswa Sudah Terdaftar UAS Susulan pada Tahun Akademik Ini!
      </div>
      <div class="text-caption mt-1">
        Mahasiswa (NIM: <strong>{{ props.mahasiswa?.nim }}</strong>) sudah tercatat di sistem memiliki pendaftaran UAS Susulan pada tahun akademik <strong>{{ registeredData?.th_akademik?.nama }} {{ registeredData?.th_akademik?.semester }}</strong> (Tanggal: {{ registeredData?.tanggal || '-' }}).
        <br>
        Sesuai ketentuan, UAS Susulan hanya diperbolehkan 1 kali per mahasiswa dalam 1 tahun akademik.
      </div>
      <div
        class="mt-3"
        style="max-width: 320px;"
      >
        <VSelect
          v-model="selectedThAkademikSusulan"
          label="Pilih Tahun Akademik UAS Susulan Lain"
          :items="thAkademikList"
          item-title="title"
          item-value="value"
          density="compact"
          variant="outlined"
          bg-color="surface"
          hide-details
        />
      </div>
    </VAlert>

    <VDivider />

    <VCardText v-if="isUasSusulanActive">
      <!-- Opsi Tambah Tagihan & Hanya UAS Susulan Saja -->
      <VRow class="mb-2">
        <!-- Radio 1: Tambah Tagihan UAS Susulan -->
        <VCol
          cols="12"
          md="6"
        >
          <VCard
            variant="outlined"
            class="pa-3 h-100 d-flex flex-column justify-space-between"
            :class="{ 'opacity-60': isHanyaUasSusulan }"
          >
            <div class="d-flex align-start justify-space-between gap-2">
              <div>
                <div class="text-subtitle-2 font-weight-bold">
                  Tambah Tagihan UAS Susulan
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  <span v-if="isTambahTagihanActive">
                    <strong class="text-primary">ON</strong>: Menambah tagihan perorangan baru di baris No. 1 dengan input nominal.
                  </span>
                  <span v-else>
                    <strong>OFF</strong>: Tanpa tagihan baru. Auto-select tagihan UAS reguler (jika belum lunas).
                  </span>
                </div>
              </div>

              <VRadioGroup
                v-model="isTambahTagihanActive"
                inline
                hide-details
                density="compact"
                :disabled="isHanyaUasSusulan"
              >
                <VRadio
                  :value="false"
                  label="OFF"
                  color="secondary"
                />
                <VRadio
                  :value="Boolean(true)"
                  label="ON"
                  color="primary"
                />
              </VRadioGroup>
            </div>
          </VCard>
        </VCol>

        <!-- Radio 2: Hanya UAS Susulan Saja -->
        <VCol
          cols="12"
          md="6"
        >
          <VCard
            variant="outlined"
            class="pa-3 h-100 d-flex flex-column justify-space-between"
            :class="{
              'border-warning': !isUasRegulerLunas,
              'border-primary': isHanyaUasSusulan,
            }"
          >
            <div class="d-flex align-start justify-space-between gap-2">
              <div>
                <div class="d-flex align-center gap-2">
                  <span class="text-subtitle-2 font-weight-bold">Hanya UAS Susulan Saja</span>
                  <VChip
                    size="x-small"
                    :color="isUasRegulerLunas ? 'success' : 'error'"
                    label
                  >
                    {{ isUasRegulerLunas ? 'UAS Reguler Lunas' : 'UAS Reguler Belum Lunas' }}
                  </VChip>
                </div>
                <div class="text-caption mt-1">
                  <span
                    v-if="!isUasRegulerLunas"
                    class="text-error font-weight-medium"
                  >
                    Terkunci: Tagihan UAS reguler semester ini belum lunas. Wajib lakukan pembayaran terlebih dahulu.
                  </span>
                  <span
                    v-else-if="isHanyaUasSusulan"
                    class="text-primary font-weight-medium"
                  >
                    <strong>ON</strong>: Form pembayaran di-hide. Anda dapat langsung menyimpan pendaftaran UAS Susulan saja.
                  </span>
                  <span
                    v-else
                    class="text-medium-emphasis"
                  >
                    <strong>OFF</strong>: Form pembayaran tetap aktif normal.
                  </span>
                </div>
              </div>

              <VRadioGroup
                v-model="isHanyaUasSusulan"
                inline
                hide-details
                density="compact"
                :disabled="!isUasRegulerLunas"
              >
                <VRadio
                  :value="false"
                  label="OFF"
                  color="secondary"
                />
                <VRadio
                  :value="Boolean(true)"
                  label="ON"
                  color="primary"
                />
              </VRadioGroup>
            </div>
          </VCard>
        </VCol>
      </VRow>

      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VSelect
            v-model="selectedThAkademikSusulan"
            label="Tahun Akademik UAS Susulan"
            placeholder="Pilih Tahun Akademik"
            :items="thAkademikList"
            item-title="title"
            item-value="value"
            :loading="loadingThAkademik"
            variant="outlined"
            density="comfortable"
            hint="Otomatis memilih 1 semester sebelum tahun akademik aktif"
            persistent-hint
          />
        </VCol>

        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="keterangan"
            label="Keterangan / Alasan Susulan (Opsional)"
            placeholder="Contoh: Sakit saat jadwal UAS, dsb."
            variant="outlined"
            density="comfortable"
          />
        </VCol>
      </VRow>

      <!-- Alert if NIM is empty -->
      <VAlert
        v-if="!mahasiswa?.nim"
        type="info"
        variant="tonal"
        class="mt-4"
      >
        Silakan cari dan pilih mahasiswa terlebih dahulu pada section Mahasiswa untuk menampilkan daftar mata kuliah.
      </VAlert>

      <!-- Loading KRS -->
      <div
        v-else-if="loadingKrs"
        class="text-center pa-6"
      >
        <VProgressCircular
          indeterminate
          color="primary"
          class="mb-2"
        />
        <div class="text-body-2 text-medium-emphasis">
          Mengambil data KRS & nilai mahasiswa...
        </div>
      </div>

      <!-- KRS Details Table -->
      <div
        v-else-if="krsDetailList.length > 0"
        class="mt-4"
      >
        <div class="d-flex align-center justify-space-between flex-wrap gap-3 mb-3">
          <div class="d-flex align-center gap-3 flex-wrap">
            <div class="text-subtitle-1 font-weight-medium">
              Pilih Mata Kuliah untuk UAS Susulan
              <span class="text-primary font-weight-bold">
                ({{ selectedMk.length }} dipilih)
              </span>
            </div>

            <!-- Tombol Aksi Cepat (Sat-Set) -->
            <div class="d-flex align-center gap-2 flex-wrap">
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
                :disabled="selectedMk.length === 0"
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

          <VChip
            v-if="semesterMhs"
            color="info"
            size="small"
            label
          >
            Semester Mahasiswa: {{ semesterMhs }}
          </VChip>
        </div>

        <VTable
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
              :class="{ 'bg-primary-subtle': selectedMk.includes(item.jadwal_kuliah_id) }"
              class="cursor-pointer"
              @click="() => {
                const id = item.jadwal_kuliah_id
                if (selectedMk.includes(id)) {
                  selectedMk = selectedMk.filter(x => x !== id)
                } else {
                  selectedMk.push(id)
                }
              }"
            >
              <td
                class="text-center"
                @click.stop
              >
                <VCheckbox
                  v-model="selectedMk"
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

        <div
          v-if="selectedMk.length > 0"
          class="d-flex align-center gap-2 mt-3 pa-2 bg-var-theme-background rounded border"
        >
          <VIcon
            icon="ri-information-line"
            size="20"
            color="primary"
          />
          <span class="text-body-2">
            Mata kuliah yang dicentang akan otomatis membentuk baris tagihan <strong>UAS Susulan</strong> di tabel tagihan di bawah. Anda dapat mengatur jumlah tagihan yang harus dibayar pada kolom nominal tagihan tersebut.
          </span>
        </div>
      </div>

      <VAlert
        v-else
        type="warning"
        variant="tonal"
        class="mt-4"
      >
        Data KRS mahasiswa tidak ditemukan pada tahun akademik susulan ini. Pastikan mahasiswa sudah memprogram KRS pada semester yang dipilih.
      </VAlert>
    </VCardText>
  </VCard>
</template>

<style scoped>
.uas-susulan-card {
  transition: border-color 0.2s ease-in-out;
}
.bg-primary-subtle {
  background-color: rgba(var(--v-theme-primary), 0.08);
}
</style>
