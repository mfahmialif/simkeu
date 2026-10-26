<script setup>
import { showSnackbar } from "@/composables/snackbar"
import { useRouter } from "vue-router"

const props = defineProps({
  typeForm: {
    type: String,
    default: "add",
  },
  dataForm: {
    type: Object,
    default: () => ({}),
  },
  url: {
    type: String,
    default: "/admin/pemasukan/mahasiswa/catatan-mahasiswa",
  },
})

const router = useRouter()
const refForm = ref(null)

const nim = ref("")
const thAkademikId = ref(null)
const tanggal = ref(new Date().toISOString().slice(0, 10))
const catatan = ref("")

const thAkademikList = ref([])
const isLoadingThAkademik = ref(false)

const searchMahasiswa = ref("")
const mahasiswaList = ref([])
const loadingSearch = ref(false)
const selectedMahasiswaObj = ref(null)
const isSubmitting = ref(false)

let typingTimeout = null

watch(searchMahasiswa, val => {
  clearTimeout(typingTimeout)
  if (!val || typeof val !== "string" || !val.trim()) {
    mahasiswaList.value = []
    loadingSearch.value = false
    return
  }

  typingTimeout = setTimeout(async () => {
    try {
      loadingSearch.value = true
      const res = await $api(`/admin/mahasiswa/search/${val.trim()}`, {
        method: "GET",
      })

      mahasiswaList.value = (res || []).map(m => ({
        ...m,
        display: `${m.nim} - ${m.nama} (${m.prodi?.alias || m.prodi?.nama || "-"})`,
      }))
    } catch (err) {
      console.error(err)
      mahasiswaList.value = []
    } finally {
      loadingSearch.value = false
    }
  }, 400)
})

const onSelectMahasiswa = item => {
  if (!item) {
    selectedMahasiswaObj.value = null
    nim.value = ""
    return
  }

  if (typeof item === "object") {
    selectedMahasiswaObj.value = item
    nim.value = item.nim
  } else {
    nim.value = item
    fetchMahasiswaByNim(item)
  }
}

const fetchMahasiswaByNim = async targetNim => {
  if (!targetNim) return
  try {
    const res = await $api(`/admin/mahasiswa/nim/${targetNim}`, {
      method: "GET",
    })
    if (res && res.nim) {
      selectedMahasiswaObj.value = res
    }
  } catch (err) {
    console.error("Gagal mengambil data mahasiswa:", err)
  }
}

const fetchThAkademik = async () => {
  try {
    isLoadingThAkademik.value = true
    const { data } = await $api("/admin/th-akademik", {
      method: "GET",
      params: { limit: 0 },
    })

    thAkademikList.value = (data?.data || []).map(th => ({
      title: `${th.nama} - ${th.semester}`,
      value: Number(th.id),
    }))

    if (!thAkademikId.value && thAkademikList.value.length > 0) {
      thAkademikId.value = thAkademikList.value[0].value
    }
  } catch (err) {
    console.error("Gagal mengambil tahun akademik:", err)
  } finally {
    isLoadingThAkademik.value = false
  }
}

onMounted(async () => {
  await fetchThAkademik()

  if (props.typeForm === "edit" && props.dataForm?.id) {
    nim.value = props.dataForm.nim || ""
    thAkademikId.value = props.dataForm.th_akademik_id ? Number(props.dataForm.th_akademik_id) : null
    tanggal.value = props.dataForm.tanggal || new Date().toISOString().slice(0, 10)
    catatan.value = props.dataForm.catatan || ""

    if (props.dataForm.mahasiswa) {
      selectedMahasiswaObj.value = props.dataForm.mahasiswa
    } else if (nim.value) {
      await fetchMahasiswaByNim(nim.value)
    }
  }
})

const onSubmit = async () => {
  if (!nim.value) {
    showSnackbar({
      text: "Harap pilih atau isi NIM mahasiswa",
      color: "warning",
    })
    return
  }

  try {
    isSubmitting.value = true

    const payload = {
      nim: nim.value,
      th_akademik_id: thAkademikId.value,
      tanggal: tanggal.value,
      catatan: catatan.value,
    }

    const method = props.typeForm === "edit" ? "PUT" : "POST"
    const response = await $api(props.url, {
      method,
      body: payload,
    })

    if (response?.status === true) {
      showSnackbar({
        text: response.message || "Catatan mahasiswa berhasil disimpan",
        color: "success",
      })
      router.push("/admin/pemasukan/mahasiswa/catatan-mahasiswa")
    } else {
      showSnackbar({
        text: response?.message || "Gagal menyimpan catatan mahasiswa",
        color: "error",
      })
    }
  } catch (err) {
    const errorMsg = err?.data?.message || err?.message || "Terjadi kesalahan saat menyimpan catatan"
    showSnackbar({
      text: typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg),
      color: "error",
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <VForm
    ref="refForm"
    @submit.prevent="onSubmit"
  >
    <VRow>
      <!-- Cari Mahasiswa -->
      <VCol
        cols="12"
        md="6"
      >
        <VAutocomplete
          v-model="nim"
          v-model:search="searchMahasiswa"
          :items="mahasiswaList"
          item-title="display"
          item-value="nim"
          label="Pilih / Cari Mahasiswa (NIM / Nama)"
          placeholder="Ketik minimal 3 huruf NIM atau Nama"
          :loading="loadingSearch"
          variant="outlined"
          density="comfortable"
          clearable
          :disabled="typeForm === 'edit'"
          @update:model-value="onSelectMahasiswa"
        />
      </VCol>

      <!-- Tahun Akademik -->
      <VCol
        cols="12"
        md="3"
      >
        <VSelect
          v-model="thAkademikId"
          :items="thAkademikList"
          item-title="title"
          item-value="value"
          label="Tahun Akademik"
          :loading="isLoadingThAkademik"
          variant="outlined"
          density="comfortable"
          clearable
        />
      </VCol>

      <!-- Tanggal -->
      <VCol
        cols="12"
        md="3"
      >
        <VTextField
          v-model="tanggal"
          label="Tanggal"
          type="date"
          variant="outlined"
          density="comfortable"
        />
      </VCol>

      <!-- Detail Mahasiswa Preview -->
      <VCol
        v-if="selectedMahasiswaObj"
        cols="12"
      >
        <VCard
          variant="tonal"
          color="primary"
          class="mb-2"
        >
          <VCardText class="d-flex flex-wrap align-center gap-4 py-3">
            <div>
              <span class="text-caption text-medium-emphasis">NIM:</span>
              <strong class="ms-1">{{ selectedMahasiswaObj.nim }}</strong>
            </div>
            <div>
              <span class="text-caption text-medium-emphasis">Nama:</span>
              <strong class="ms-1">{{ selectedMahasiswaObj.nama }}</strong>
            </div>
            <div v-if="selectedMahasiswaObj.prodi">
              <span class="text-caption text-medium-emphasis">Prodi:</span>
              <strong class="ms-1">{{ selectedMahasiswaObj.prodi?.nama || selectedMahasiswaObj.prodi?.alias || selectedMahasiswaObj.prodi }}</strong>
            </div>
            <div v-if="selectedMahasiswaObj.semester">
              <span class="text-caption text-medium-emphasis">Semester:</span>
              <strong class="ms-1">{{ selectedMahasiswaObj.semester }}</strong>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Catatan Mahasiswa -->
      <VCol cols="12">
        <VTextarea
          v-model="catatan"
          label="Catatan Mahasiswa (Opsional di DB)"
          placeholder="Tuliskan catatan mahasiswa di sini..."
          rows="4"
          variant="outlined"
          density="comfortable"
        />
      </VCol>

      <!-- Actions -->
      <VCol
        cols="12"
        class="d-flex justify-end gap-3 mt-2"
      >
        <VBtn
          variant="outlined"
          color="secondary"
          @click="router.push('/admin/pemasukan/mahasiswa/catatan-mahasiswa')"
        >
          Batal
        </VBtn>
        <VBtn
          color="primary"
          type="submit"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          <VIcon
            icon="ri-save-line"
            class="me-1"
          />
          Simpan Catatan
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
