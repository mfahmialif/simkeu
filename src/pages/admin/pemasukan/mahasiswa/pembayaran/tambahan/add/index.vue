<script setup>
import AkademikPembayaranMahasiswaTambahan from "@/components/admin/pemasukan/mahasiswa/pembayaran/tambahan/AkademikPembayaranMahasiswaTambahan.vue"
import JenisPembayaranMahasiswaPembayaranTambahan from "@/components/admin/pemasukan/mahasiswa/pembayaran/tambahan/JenisPembayaranMahasiswaPembayaranTambahan.vue"
import MahasiswaPembayaranMahasiswaTambahan from "@/components/admin/pemasukan/mahasiswa/pembayaran/tambahan/MahasiswaPembayaranMahasiswaTambahan.vue"
import TagihanPembayaranMahasiswaTambahan from "@/components/admin/pemasukan/mahasiswa/pembayaran/tambahan/TagihanPembayaranMahasiswaTambahan.vue"
import { consoleError } from "vuetify/lib/util/console.mjs"

const router = useRouter()

const disabled = ref(false)

const submitData = async () => {
  const formData = buildPembayaranFormData()

  if (!formData) {
    return
  }

  try {
    disabled.value = true

    const response = await $api("/admin/pemasukan/mahasiswa/pembayaran-tambahan", {
      method: "POST",
      body: formData,
      onResponseError({ response }) {
        console.error(response)
      },
    })

    console.log(response)
    if (response.status === true) {
      showSnackbar({
        text: response.message,
        color: "success",
      })

      router.push("/admin/pemasukan/mahasiswa/pembayaran/tambahan")
    } else {
      showSnackbar({
        text: response.message,
        color: "error",
      })
    }
  } catch (err) {
    console.log(err)

    // const message = Array.isArray(err.data.message)
    //   ? err.data.message.join("; ")
    //   : err.data.message;
    // showSnackbar({
    //   text: message,
    //   color: "error",
    // });
  } finally {
    disabled.value = false
  }
}

function buildPembayaranFormData() {
  const mahasiswa = mahasiswaRef.value?.mahasiswa
  const thAkademik = akademikRef.value?.thAkademik ?? null
  const tanggal = akademikRef.value?.tanggal ?? null

  const jenisPembayaran =
    jenisPembayaranRef.value?.selectedJenisPembayaran ?? null

  if (jenisPembayaran === null) {
    showSnackbar({
      text: "Harap memilih jenis pembayaran",
      color: "error",
    })
    
    return false
  }

  // Opsional: validasi minimal
  if (!unref(mahasiswaRef.value.mahasiswa.tagihan)?.length) {
    showSnackbar({ text: "List tagihan kosong", color: "error" })
    
    return false
  }

  const m = mahasiswa ?? {}
  const rows = unref(m.tagihan) ?? [] // tagihan adalah Ref<Array>

  const fd = new FormData()

  // Wajib
  fd.append("tanggal", tanggal)
  fd.append("th_akademik_1", thAkademik?.start ?? "")
  fd.append("th_akademik_2", thAkademik?.end ?? "")
  fd.append("smt", thAkademik?.smt ?? "")
  fd.append("nim", m.nim ?? "")
  fd.append("nama", m.nama ?? "")
  fd.append("jenis_kelamin", m.jenisKelamin ?? "")
  fd.append("prodi", m.prodi ?? "")
  fd.append("kelas", m.kelas ?? "")
  fd.append("th_angkatan", m.angkatan ?? "")
  fd.append("jenis_pembayaran", jenisPembayaran?.value ?? "")

  rows.forEach(r => {
    fd.append("list_tagihan[]", r.display) // nama tagihan
    fd.append("list_dibayar[]", r.dibayar ?? 0)
    fd.append("list_jumlah[]", r.jumlah ?? 0)
  })

  return fd
}

const tagihanRef = ref(null)
const mahasiswaRef = ref(null)
const akademikRef = ref(null)
const jenisPembayaranRef = ref(null)

onMounted(() => {
  document.title = "Tambah Data Pembayaran Mahasiswa - SIMKEU"
})
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-space-between gap-4 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 mb-1">
          Tambah data pembayaran
        </h4>
        <p class="text-body-1 mb-0">
          Silahkan mengisi data yang diperlukan
        </p>
      </div>

      <div class="d-flex gap-4 align-center flex-wrap">
        <VBtn
          variant="outlined"
          color="secondary"
          @click="
            $router.push('/admin/pemasukan/mahasiswa/pembayaran/tambahan')
          "
        >
          Batalkan
        </VBtn>
        <VBtn
          color="primary"
          :disabled
          @click="submitData"
        >
          Simpan Pembayaran
        </VBtn>
      </div>
    </div>

    <VRow>
      <VCol md="12">
        <AkademikPembayaranMahasiswaTambahan ref="akademikRef" />

        <MahasiswaPembayaranMahasiswaTambahan ref="mahasiswaRef" />

        <TagihanPembayaranMahasiswaTambahan
          ref="tagihanRef"
          :mahasiswa="mahasiswaRef?.mahasiswa"
        />

        <JenisPembayaranMahasiswaPembayaranTambahan ref="jenisPembayaranRef" />
        <VBtn
          color="primary"
          :disabled
          class="w-100 mt-3"
          @click="submitData"
        >
          Simpan Pembayaran
        </VBtn>
      </VCol>
    </VRow>
  </div>
</template>
