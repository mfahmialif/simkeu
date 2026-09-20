<script setup>
import AkademikPembayaranMahasiswa from "@/components/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/AkademikPembayaranMahasiswa.vue"
import DepositPembayaranMahasiswa from "@/components/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/DepositPembayaranMahasiswa.vue"
import JenisPembayaranMahasiswaPembayaran from "@/components/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/JenisPembayaranMahasiswaPembayaran.vue"
import MahasiswaPembayaranMahasiswa from "@/components/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/MahasiswaPembayaranMahasiswa.vue"
import TagihanPembayaranMahasiswa from "@/components/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/TagihanPembayaranMahasiswa.vue"
import UasSusulanPembayaranMahasiswa from "@/components/admin/pemasukan/mahasiswa/pembayaran/mahasiswa/UasSusulanPembayaranMahasiswa.vue"

const router = useRouter()

const disabled = ref(false)
const isAdmin = ref(false)

function resolveJenisPembayaranValue(jenisPembayaran) {
  if (jenisPembayaran && typeof jenisPembayaran === "object") {
    return jenisPembayaran.value ?? ""
  }

  return jenisPembayaran ?? ""
}

const submitData = async () => {
  const formData = buildPembayaranFormData()
  if (!formData) {
    return
  }

  try {
    disabled.value = true

    const response = await $api("/admin/pemasukan/mahasiswa/pembayaran", {
      method: "POST",
      body: formData,
      onResponseError({ response }) {
        console.error(response)
      },
    })

    console.log(response)
    if (response.status === true) {
      // Simpan catatan deposit jika ada kelebihan nominal
      const excessDeposit = Number(mahasiswaRef.value?.mahasiswa?.autoSimpanDeposit) || 0
      if (excessDeposit > 0) {
        try {
          await $api("/admin/pemasukan/mahasiswa/catatan-deposit", {
            method: "POST",
            body: {
              nim: mahasiswaRef.value.mahasiswa.nim,
              jumlah: excessDeposit,
            },
          })
        } catch (e) {
          console.error("Gagal simpan catatan deposit:", e)
        }
      }

      showSnackbar({
        text: response.message,
        color: "success",
      })

      if (redirectKwitansi.value && response.id) {
        await kwitansi(response.id)

        tagihanRef.value.clearTagihan()
        depositRef.value.clearDeposit()
        uasSusulanRef.value?.resetUasSusulan()
        mahasiswaRef.value.searching()
        mahasiswaRef.value.nimFocus()
      } else if (redirectKwitansi.value) {
        tagihanRef.value.clearTagihan()
        depositRef.value.clearDeposit()
        uasSusulanRef.value?.resetUasSusulan()
        mahasiswaRef.value.searching()
        mahasiswaRef.value.nimFocus()
      } else {
        router.push("/admin/pemasukan/mahasiswa/pembayaran/mahasiswa")
      }
    } else {
      showSnackbar({
        text: response.message,
        color: "error",
      })
    }
  } catch (err) {
    console.log(err)
  } finally {
    disabled.value = false
  }
}

function buildPembayaranFormData() {
  const mahasiswa = mahasiswaRef.value?.mahasiswa
  const thAkademik = akademikRef.value?.selectedThAkademik ?? null
  const tanggal = akademikRef.value?.tanggal ?? null

  const jenisPembayaran =
        jenisPembayaranRef.value?.selectedJenisPembayaran ?? null

  const jenisPembayaranValue = resolveJenisPembayaranValue(jenisPembayaran)

  if (thAkademik === null || tanggal === null || !jenisPembayaranValue) {
    showSnackbar({
      text: "Harap memilih tahun akademik, tanggal, dan jenis pembayaran",
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
  fd.append("tahun_akademik", thAkademik?.value ?? "")
  fd.append("nim", m.nim ?? "")
  fd.append("jenis_pembayaran", jenisPembayaranValue)
  fd.append("jk_id", m.jkId ?? "")

  // Nullable
  if (m.semester != null) fd.append("semester", m.semester)
  fd.append("dipakai_deposit_mhs", m.dipakai ?? 0) // total deposit yang dipakai
  if (m.kamarId != null) fd.append("kamar_id", m.kamarId)
  if (m.wisuda != null) fd.append("wisuda", JSON.stringify(m.wisuda))

  // Array list_tagihan_*
  for (const r of rows) {
    const keringananJenis = normalizeKeringananJenis(r.keringanan_jenis)
    const keringananJumlah = Number(r.keringanan_jumlah) || 0

    const keringananBatas = keringananJenis
      ? (r.keringanan_batas || "9999-12-31")
      : ""

    if (keringananJenis === "samahah" && (keringananJumlah <= 0 || !keringananBatas)) {
      showSnackbar({
        text: "Harap isi jumlah keringanan Samahah",
        color: "error",
      })
      
      return false
    }

    fd.append("list_tagihan_id[]", r.id ?? "")
    fd.append("list_tagihan[]", r.display ?? r.nama ?? r.judul ?? "") // nama tagihan
    fd.append("list_dibayar[]", r.dibayar ?? 0)
    fd.append("list_deposit[]", r.deposit ?? 0)
    fd.append("list_keringanan_jenis[]", keringananJenis)
    fd.append("list_keringanan_jumlah[]", keringananJumlah)
    fd.append("list_keringanan_batas[]", keringananBatas)
  }

  // UAS Susulan extra data if active
  if (uasSusulanData.value?.active) {
    if (uasSusulanData.value?.isAlreadyRegistered) {
      showSnackbar({
        text: "Mahasiswa sudah terdaftar UAS Susulan pada tahun akademik ini",
        color: "error",
      })

      return false
    }

    if (!uasSusulanData.value?.selectedMk?.length) {
      showSnackbar({
        text: "Harap centang mata kuliah untuk UAS Susulan terlebih dahulu",
        color: "warning",
      })
      
      return false
    }

    if (uasSusulanData.value?.tambahTagihan) {
      const uasRow = rows.find(r => r.id === "uas_susulan")
      const keringananJenis = normalizeKeringananJenis(uasRow?.keringanan_jenis)
      const uasTotal = (Number(uasRow?.dibayar) || 0) + (Number(uasRow?.deposit) || 0)
      if (!keringananJenis && uasTotal <= 0) {
        showSnackbar({
          text: "Harap isi nominal tagihan UAS Susulan yang harus dibayar",
          color: "error",
        })
        
        return false
      }
    } else {
      // Tambah Tagihan = OFF: Cek apakah UAS reguler belum lunas
      if (!uasSusulanData.value?.isUasRegulerLunas) {
        const regUasId = uasSusulanData.value?.uasRegulerTagihan?.id
        const regRow = rows.find(r => String(r.id) === String(regUasId))
        if (!regRow) {
          showSnackbar({
            text: "Tagihan UAS semester susulan belum lunas dan wajib dipilih untuk pembayaran",
            color: "error",
          })
          
          return false
        }

        const regKeringanan = normalizeKeringananJenis(regRow?.keringanan_jenis)
        const regPaid = (Number(regRow?.dibayar) || 0) + (Number(regRow?.deposit) || 0)
        if (!regKeringanan && regPaid < 1) {
          showSnackbar({
            text: "Nominal pembayaran tagihan UAS semester susulan minimal Rp 1 (atau pilih keringanan Samahah/Dhomin)",
            color: "error",
          })
          
          return false
        }
      }
    }

    fd.append("is_uas_susulan", "1")
    fd.append("uas_susulan_th_akademik_id", uasSusulanData.value.thAkademikSusulanId ?? "")
    fd.append("uas_susulan_semester_mhs", uasSusulanData.value.semesterMhs ?? "")
    uasSusulanData.value.selectedMk.forEach(id => {
      fd.append("uas_susulan_jadwal_kuliah_id[]", id)
    })
    if (uasSusulanData.value.keterangan) {
      fd.append("uas_susulan_keterangan", uasSusulanData.value.keterangan)
    }
  }

  return fd
}

function normalizeKeringananJenis(value) {
  const jenis = String(value || "").toLowerCase()
  
  return ["samahah", "dhomin"].includes(jenis) ? jenis : ""
}

const tagihanRef = ref(null)
const tagihanList = ref([])
const paymentRows = ref([])

function onUpdateTagihanList(list) {
  tagihanList.value = list || []
}

function onUpdateRows(list) {
  paymentRows.value = list || []
}

const submitDisabledReason = computed(() => {
  if (disabled.value) return "Sedang memproses..."

  const m = mahasiswaRef.value?.mahasiswa
  if (!m?.nim) return "Pilih mahasiswa terlebih dahulu"

  const thAkademik = akademikRef.value?.selectedThAkademik
  const tanggal = akademikRef.value?.tanggal
  const jenisPembayaran = jenisPembayaranRef.value?.selectedJenisPembayaran
  const jenisPembayaranValue = resolveJenisPembayaranValue(jenisPembayaran)

  if (!thAkademik) return "Pilih tahun akademik"
  if (!tanggal) return "Pilih tanggal transaksi"
  if (!jenisPembayaranValue) return "Pilih jenis pembayaran"

  const rows = paymentRows.value?.length ? paymentRows.value : (unref(m.tagihan) || [])
  if (!rows.length) return "List tagihan pembayaran masih kosong"

  // Validasi Samahah
  for (const r of rows) {
    const kJenis = normalizeKeringananJenis(r.keringanan_jenis)
    if (kJenis === "samahah") {
      const kJumlah = Number(r.keringanan_jumlah) || 0
      if (kJumlah <= 0) {
        return `Harap isi jumlah keringanan Samahah untuk ${r.display || r.nama || 'tagihan'}`
      }
    }
  }

  // Validasi khusus UAS Susulan jika aktif
  if (uasSusulanData.value?.active) {
    if (uasSusulanData.value?.isAlreadyRegistered) {
      return "Mahasiswa sudah terdaftar UAS Susulan pada tahun akademik ini"
    }

    if (!uasSusulanData.value?.selectedMk?.length) {
      return "Pilih minimal 1 mata kuliah untuk UAS Susulan"
    }

    if (uasSusulanData.value?.tambahTagihan) {
      const uasRow = rows.find(r => r.id === "uas_susulan")
      if (!uasRow) {
        return "Tagihan UAS Susulan belum ada di daftar tagihan"
      }
      const keringanan = normalizeKeringananJenis(uasRow.keringanan_jenis)
      const paid = (Number(uasRow.dibayar) || 0) + (Number(uasRow.deposit) || 0)
      if (!keringanan && paid < 1) {
        return "Nominal tagihan UAS Susulan minimal Rp 1 (atau pilih keringanan)"
      }
    } else {
      if (!uasSusulanData.value?.isUasRegulerLunas) {
        const regUasId = uasSusulanData.value?.uasRegulerTagihan?.id
        if (!regUasId) {
          return "Tagihan UAS reguler belum ditemukan"
        }
        const regRow = rows.find(r => String(r.id) === String(regUasId))
        if (!regRow) {
          return "Tagihan UAS reguler semester ini wajib ada di daftar pembayaran"
        }
        const keringanan = normalizeKeringananJenis(regRow.keringanan_jenis)
        const paid = (Number(regRow.dibayar) || 0) + (Number(regRow.deposit) || 0)
        if (!keringanan && paid < 1) {
          return "Tagihan UAS reguler semester ini wajib dibayar minimal Rp 1 (atau pilih Samahah/Dhomin)"
        }
      }
    }
  }

  return ""
})

const isSubmitPembayaranDisabled = computed(() => {
  return Boolean(submitDisabledReason.value)
})

function onRefreshTagihan(nim) {
  tagihanRef.value?.fetchTagihan(nim)
  uasSusulanRef.value?.onMahasiswaChanged?.(nim)
}

const mahasiswaRef = ref(null)

const depositRef = ref(null)
function onRefreshDeposit() {
  depositRef.value?.fetchDeposit()
}

const uasSusulanRef = ref(null)
const uasSusulanData = ref({ active: false, selectedMk: [] })

function onUpdateUasSusulan(data) {
  uasSusulanData.value = data
}

function onRemoveUasSusulan() {
  uasSusulanRef.value?.resetUasSusulan()
}

const submitHanyaUasSusulan = async () => {
  const m = mahasiswaRef.value?.mahasiswa
  const nim = m?.nim
  const thAkademik = akademikRef.value?.selectedThAkademik
  const thAkademikSectionId = typeof thAkademik === "object" ? thAkademik?.value : thAkademik
  const thAkademikSusulanId = uasSusulanData.value?.thAkademikSusulanId || thAkademikSectionId
  const tanggal = akademikRef.value?.tanggal || new Date().toISOString().slice(0, 10)
  const selectedMk = uasSusulanData.value?.selectedMk || []
  const keterangan = uasSusulanData.value?.keterangan || ""

  if (!nim) {
    showSnackbar({
      text: "Silakan pilih mahasiswa terlebih dahulu",
      color: "error",
    })
    
    return
  }

  if (!thAkademikSusulanId) {
    showSnackbar({
      text: "Tahun akademik UAS Susulan belum dipilih",
      color: "error",
    })
    
    return
  }

  if (uasSusulanData.value?.isAlreadyRegistered) {
    showSnackbar({
      text: "Mahasiswa sudah terdaftar UAS Susulan pada tahun akademik ini",
      color: "error",
    })
    
    return
  }

  if (!selectedMk.length) {
    showSnackbar({
      text: "Harap centang mata kuliah untuk UAS Susulan terlebih dahulu",
      color: "warning",
    })
    
    return
  }

  try {
    disabled.value = true

    const response = await $api("/admin/pemasukan/mahasiswa/uas-susulan/full", {
      method: "POST",
      body: {
        tanggal,
        nim,
        "th_akademik_id": Number(thAkademikSusulanId),
        keterangan,
        "jadwal_kuliah_id": selectedMk,
      },
      onResponseError({ response }) {
        console.error(response)
      },
    })

    if (response.status === true) {
      showSnackbar({
        text: response.message || "Data UAS Susulan berhasil disimpan",
        color: "success",
      })

      uasSusulanRef.value?.resetUasSusulan()
      tagihanRef.value?.clearTagihan()
      depositRef.value?.clearDeposit()
      mahasiswaRef.value?.searching()
      mahasiswaRef.value?.nimFocus()
    } else {
      showSnackbar({
        text: response.message || "Gagal menyimpan UAS Susulan",
        color: "error",
      })
    }
  } catch (err) {
    console.error("Gagal simpan UAS Susulan:", err)
    showSnackbar({
      text: err?.data?.message || err?.message || "Terjadi kesalahan saat menyimpan UAS Susulan",
      color: "error",
    })
  } finally {
    disabled.value = false
  }
}

const akademikRef = ref(null)
const jenisPembayaranRef = ref(null)

const redirectKwitansi = ref(false)

const kwitansi = async id => {
  try {
    showSnackbar({
      text: "Loading cetak kwitansi...",
      color: "info",
    })

    const blob = await $api(
      "/admin/pemasukan/mahasiswa/pembayaran/kwitansi/" + id + "/view",
      {
        method: "GET",
        headers: { Accept: "application/pdf" },
      },
    )

    openFileExport(blob)
  } catch (err) {
    console.info(err)
    showSnackbar({
      text: err,
      color: "error",
    })
  }
}

onMounted(() => {
  document.title = "Tambah Data Pembayaran Mahasiswa - SIMKEU"

  const userData = useCookie("userData").value ?? {}
  const role = userData.role?.name
  const jenisKelamin = userData.jenis_kelamin

  isAdmin.value = role === "admin"

  if ((role == "staff" || role == "kabag" || role == "kabag_pemasukan") && jenisKelamin == "Laki-laki") {
    redirectKwitansi.value = true
  }
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
            $router.push(
              '/admin/pemasukan/mahasiswa/pembayaran/mahasiswa',
            )
          "
        >
          Batalkan
        </VBtn>
      </div>
    </div>

    <div class="payment-grid">
      <!-- Akademik + Mahasiswa + Deposit -->
      <div class="grid-main">
        <AkademikPembayaranMahasiswa ref="akademikRef" />

        <MahasiswaPembayaranMahasiswa
          ref="mahasiswaRef"
          @refresh-tagihan="onRefreshTagihan"
          @refresh-deposit="onRefreshDeposit"
        />

        <DepositPembayaranMahasiswa
          ref="depositRef"
          :mahasiswa="mahasiswaRef?.mahasiswa"
          :is-admin="isAdmin"
          class="mt-4"
        />

        <UasSusulanPembayaranMahasiswa
          ref="uasSusulanRef"
          :mahasiswa="mahasiswaRef?.mahasiswa"
          :selected-th-akademik="akademikRef?.selectedThAkademik"
          :tagihan-list="tagihanList"
          class="mt-4"
          @update:uas-susulan="onUpdateUasSusulan"
        />
      </div>

      <!-- Pembayaran -->
      <div
        v-show="!uasSusulanData?.hanyaUasSusulan"
        class="grid-pembayaran"
      >
        <TagihanPembayaranMahasiswa
          ref="tagihanRef"
          :mahasiswa="mahasiswaRef?.mahasiswa"
          :uas-susulan="uasSusulanData"
          @remove-uas-susulan="onRemoveUasSusulan"
          @update:tagihan-list="onUpdateTagihanList"
          @update:rows="onUpdateRows"
        />
      </div>

      <!-- Metode + Print + Simpan (mobile: paling bawah, desktop: sidebar bawah) -->
      <div class="grid-actions">
        <template v-if="uasSusulanData?.hanyaUasSusulan">
          <VCard
            variant="tonal"
            color="primary"
            class="mb-4"
          >
            <VCardText class="d-flex align-center gap-3">
              <VIcon
                icon="ri-information-line"
                size="28"
                color="primary"
              />
              <div>
                <div class="text-subtitle-1 font-weight-bold">
                  Mode Hanya Simpan UAS Susulan
                </div>
                <div class="text-body-2">
                  Form tagihan & pembayaran di-hide. Tombol di bawah akan langsung menyimpan pendaftaran mata kuliah UAS Susulan mahasiswa tanpa transaksi pembayaran kas/bank.
                </div>
              </div>
            </VCardText>
          </VCard>

          <VBtn
            color="primary"
            :disabled="disabled || !uasSusulanData?.selectedMk?.length"
            class="w-100"
            size="large"
            @click="submitHanyaUasSusulan"
          >
            <VIcon
              icon="ri-save-line"
              class="me-2"
            />
            Simpan UAS Susulan Saja
          </VBtn>
        </template>

        <template v-else>
          <JenisPembayaranMahasiswaPembayaran ref="jenisPembayaranRef" />

          <VCard class="mt-4">
            <VCardText>
              <VSwitch
                v-model="redirectKwitansi"
                label="Otomatis Print Kwitansi ?"
                hide-details
                color="primary"
              />
            </VCardText>
          </VCard>

          <VBtn
            color="primary"
            :disabled="isSubmitPembayaranDisabled"
            class="w-100 mt-4"
            size="large"
            @click="submitData"
          >
            <VIcon
              icon="ri-save-line"
              class="me-2"
            />
            Simpan Pembayaran
          </VBtn>

          <div
            v-if="isSubmitPembayaranDisabled && submitDisabledReason && !disabled"
            class="text-caption text-error text-center mt-2 d-flex align-center justify-center gap-1"
          >
            <VIcon
              icon="ri-alert-line"
              size="16"
              color="error"
            />
            <span>{{ submitDisabledReason }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Mobile: single column */
.payment-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.grid-main       { order: 1; }
.grid-pembayaran { order: 2; }
.grid-actions    { order: 3; }

/* Desktop: full width, actions tetap di bawah area pembayaran */
@media (min-width: 960px) {
    .payment-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: auto;
    }

    .grid-main {
        grid-column: 1;
        grid-row: 1;
        align-self: start;
    }

    .grid-pembayaran {
        grid-column: 1;
        grid-row: 2;
        align-self: start;
    }

    .grid-actions {
        grid-column: 1;
        grid-row: 3;
        align-self: start;
    }
}
</style>
