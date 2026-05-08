<script setup>
import { useRouter } from "vue-router";
import { openFileExport } from "@/composables/exportFile";

const router = useRouter();

const props = defineProps({
  typeForm: {
    type: String,
    default: "add",
  },
  dataForm: {
    type: Object,
    default: () => ({}),
  },
});

// ─── State Pencarian KRS ───────────────────────────────────────────────────
const krsList       = ref([]);
const search        = ref("");
const selectedKrs   = ref(null);
const loadingSearch = ref(false);

// ─── State Data Detail ─────────────────────────────────────────────────────
const loadingDetail = ref(false);
const isSubmitting  = ref(false);
const krsDetails    = ref([]);

// Edit/Delete riwayat state
const editDialog    = ref(false);
const editItem      = ref(null);
const editJumlah    = ref(0);
const editTanggal   = ref("");
const editJenisPembayaranId = ref(null);
const deleteDialog  = ref(false);
const deleteItem    = ref(null);
const isProcessing  = ref(false);

// Deposit state
const saldoDeposit  = ref(0);
const loadingDeposit = ref(false);
const depositPakai  = ref(0);

const emptyKrs = {
  id:                null,
  nim:               "",
  th_akademik_id:    null,
  periode_id:        null,
  periode_nama:      "",
  mhs_jk_id:         null,
  th_akademik_nama:  "",
  mhs_nama:          "",
  prodi_nama:        "",
  prodi_alias:       "",
  jk_nama:           "",
  tanggal:           "",
  total_pembayaran:  0,
  biaya_per_mk:      0,
  status:            "",
};

const krs     = ref({ ...emptyKrs });
const riwayat = ref([]);
const jumlah  = ref(0);
const jenisPembayaranId = ref(null);

const listJenisPembayaran = ref([]);

const fetchJenisPembayaran = async () => {
  try {
    const res = await $api("/admin/pemasukan/mahasiswa/jenis-pembayaran", { method: "GET" });
    const items = res?.data?.data ?? res?.data ?? [];
    listJenisPembayaran.value = items.map((jp) => ({
      title: jp.nama + " - " + jp.kategori,
      value: jp.id,
    }));
  } catch (e) {
    console.error("Gagal load jenis pembayaran", e);
  }
};

// ─── Debounce search ───────────────────────────────────────────────────────
let typingTimeout = null;

watch(search, (newVal) => {
  clearTimeout(typingTimeout);
  if (!newVal || !newVal.trim()) {
    krsList.value       = [];
    loadingSearch.value = false;
    return;
  }

  typingTimeout = setTimeout(async () => {
    loadingSearch.value = true;
    try {
      const res = await $api("/admin/pemasukan/mahasiswa/semester-pendek/search-krs", {
        method: "GET",
        params: { search: newVal },
      });
      const items = res?.data?.data ?? res?.data ?? [];
      krsList.value = items.map((k) => ({
        ...k,
        display: `${k.nim} - ${k.mhs_nama}` + (k.periode_semester_pendek?.periode ? ` (${k.periode_semester_pendek.periode})` : ''),
      }));
    } catch {
      krsList.value = [];
    } finally {
      loadingSearch.value = false;
    }
  }, 300);
});

// ─── Saat KRS dipilih ──────────────────────────────────────────────────────
watch(selectedKrs, async (newVal) => {
  riwayat.value = [];
  jumlah.value  = 0;

  if (!newVal || typeof newVal !== "object") {
    krs.value = { ...emptyKrs };
    krsDetails.value = [];
    saldoDeposit.value = 0;
    depositPakai.value = 0;
    return;
  }

  // Store KRS details (mata kuliah)
  krsDetails.value = newVal.details ?? [];

  krs.value = {
    id:                newVal.id,
    nim:               newVal.nim,
    th_akademik_id:    newVal.th_akademik_id,
    periode_id:        newVal.periode_id ?? newVal.periode_semester_pendek?.id ?? null,
    periode_nama:      newVal.periode_semester_pendek?.periode ?? "",
    mhs_jk_id:         newVal.mhs_jk_id,
    th_akademik_nama:  newVal.th_akademik_nama ?? "",
    mhs_nama:          newVal.mhs_nama ?? "",
    prodi_nama:        newVal.prodi_nama ?? "",
    prodi_alias:       newVal.prodi_alias ?? "",
    jk_nama:           newVal.jk_nama ?? "",
    tanggal:           newVal.created_at ?? newVal.tanggal ?? "",
    total_pembayaran:  newVal.total_pembayaran ?? 0,
    biaya_per_mk:      newVal.periode_semester_pendek?.biaya_per_mk ?? 0,
    status:            newVal.status ?? "",
  };

  loadingDetail.value = true;
  try {
    const res = await $api(`/admin/pemasukan/mahasiswa/semester-pendek/riwayat/${newVal.id}`, {
      method: "GET",
    });
    riwayat.value = res?.riwayat ?? [];
  } catch {
    riwayat.value = [];
  } finally {
    loadingDetail.value = false;
    await nextTick();
    refJumlah.value?.$el?.querySelector("input")?.focus();
  }

  // Fetch deposit saldo
  if (krs.value.nim) {
    loadingDeposit.value = true;
    try {
      const resDeposit = await $api(`/admin/pemasukan/mahasiswa/catatan-deposit/nim/${krs.value.nim}`, {
        method: "GET",
      });
      saldoDeposit.value = resDeposit?.jumlah ?? 0;
    } catch {
      saldoDeposit.value = 0;
    } finally {
      loadingDeposit.value = false;
    }
  }
});

// ─── Clamp deposit agar tidak melebihi saldo ───────────────────────────────
watch(depositPakai, (val) => {
  if (val > saldoDeposit.value) depositPakai.value = saldoDeposit.value;
  if (val < 0) depositPakai.value = 0;
});

// ─── Refresh riwayat setelah edit/delete ───────────────────────────────────
const refreshRiwayat = async () => {
  if (!krs.value.id) return;
  try {
    const res = await $api(`/admin/pemasukan/mahasiswa/semester-pendek/riwayat/${krs.value.id}`, {
      method: "GET",
    });
    riwayat.value = res?.riwayat ?? [];
  } catch {
    riwayat.value = [];
  }
};

// ─── Edit Riwayat ──────────────────────────────────────────────────────────
const openEditDialog = (item) => {
  editItem.value = item;
  editJumlah.value = item.jumlah;
  editTanggal.value = item.tanggal ? item.tanggal.substring(0, 10) : "";
  editJenisPembayaranId.value = item.jenis_pembayaran_id;
  editDialog.value = true;
};

const submitEditRiwayat = async () => {
  if (!editJumlah.value || editJumlah.value <= 0) {
    showSnackbar({ text: "Nominal harus lebih dari 0.", color: "warning" });
    return;
  }
  isProcessing.value = true;
  try {
    const res = await $api(`/admin/pemasukan/mahasiswa/semester-pendek/${editItem.value.id}`, {
      method: "PUT",
      body: {
        jumlah: editJumlah.value,
        jenis_pembayaran_id: editJenisPembayaranId.value,
        ...(editTanggal.value && { tanggal: editTanggal.value }),
      },
    });
    if (res.status === "true") {
      showSnackbar({ text: "Pembayaran berhasil diperbarui.", color: "success" });
      editDialog.value = false;
      await refreshRiwayat();
    } else {
      showSnackbar({ text: res.message || "Gagal memperbarui.", color: "error" });
    }
  } catch (err) {
    showSnackbar({ text: err.data?.message || "Terjadi kesalahan.", color: "error" });
  } finally {
    isProcessing.value = false;
  }
};

// ─── Delete Riwayat ────────────────────────────────────────────────────────
const openDeleteDialog = (item) => {
  deleteItem.value = item;
  deleteDialog.value = true;
};

const submitDeleteRiwayat = async () => {
  isProcessing.value = true;
  try {
    const res = await $api(`/admin/pemasukan/mahasiswa/semester-pendek/${deleteItem.value.id}`, {
      method: "DELETE",
    });
    if (res.status === "true") {
      showSnackbar({ text: "Pembayaran berhasil dihapus.", color: "success" });
      deleteDialog.value = false;
      await refreshRiwayat();
    } else {
      showSnackbar({ text: res.message || "Gagal menghapus.", color: "error" });
    }
  } catch (err) {
    showSnackbar({ text: err.data?.message || "Terjadi kesalahan.", color: "error" });
  } finally {
    isProcessing.value = false;
  }
};
// ─── Cetak Kwitansi ────────────────────────────────────────────────────────
const cetakKwitansi = async (id) => {
  try {
    showSnackbar({ text: "Loading cetak kwitansi...", color: "info" });
    const blob = await $api(
      "/admin/pemasukan/mahasiswa/semester-pendek/kwitansi/" + id,
      {
        method: "GET",
        headers: { Accept: "application/pdf" },
      }
    );
    openFileExport(blob);
  } catch (err) {
    console.info(err);
    showSnackbar({ text: "Gagal cetak kwitansi.", color: "error" });
  }
};

// ─── Submit Pembayaran ─────────────────────────────────────────────────────
const submitPembayaran = async () => {
  if (!krs.value.id) {
    showSnackbar({ text: "Silakan pilih data KRS terlebih dahulu.", color: "error" });
    return;
  }
  if (!jenisPembayaranId.value) {
    showSnackbar({ text: "Silakan pilih Jenis Pembayaran.", color: "warning" });
    return;
  }

  const depositAktual = Math.min(depositPakai.value || 0, saldoDeposit.value);
  const totalBayar = (jumlah.value || 0) + depositAktual;

  if (totalBayar <= 0) {
    showSnackbar({ text: "Total pembayaran harus lebih dari 0.", color: "warning" });
    return;
  }

  isSubmitting.value = true;
  try {
    let res;
    if (props.typeForm === "edit") {
      res = await $api(`/admin/pemasukan/mahasiswa/semester-pendek/${props.dataForm.id}`, {
        method: "PUT",
        body: {
          jumlah: jumlah.value || 0,
          jenis_pembayaran_id: jenisPembayaranId.value,
        },
      });
    } else {
      res = await $api("/admin/pemasukan/mahasiswa/semester-pendek", {
        method: "POST",
        body: {
          krs_id:         krs.value.id,
          th_akademik_id: krs.value.th_akademik_id,
          periode_id:     krs.value.periode_id,
          jk_id:          krs.value.mhs_jk_id,
          jumlah:         jumlah.value || 0,
          deposit:        depositAktual,
          jenis_pembayaran_id: jenisPembayaranId.value,
        },
      });
    }

    if (res.status === "true") {
      showSnackbar({ text: res.message, color: "success" });
      router.push("/admin/pemasukan/mahasiswa/semester-pendek");
    } else {
      showSnackbar({ text: res.message || "Gagal menyimpan pembayaran.", color: "error" });
    }
  } catch (err) {
    const msg = err.data?.message || "Terjadi kesalahan pada server.";
    showSnackbar({ text: msg, color: "error" });
  } finally {
    isSubmitting.value = false;
  }
};

// ─── Helpers ───────────────────────────────────────────────────────────────
const formatRupiah = (val) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(val || 0);

const formatTanggal = (val) => {
  if (!val) return "-";
  return new Date(val).toLocaleDateString("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
  });
};

const totalTerbayar = computed(() =>
  riwayat.value.reduce((sum, r) => sum + (r.jumlah ?? 0), 0)
);

// ─── Ref & Focus ───────────────────────────────────────────────────────────
const refSearch = ref(null);
const refJumlah = ref(null);

onMounted(() => {
  fetchJenisPembayaran();
  if (props.typeForm === "add") {
    nextTick(() => refSearch.value?.focus?.());
  }
});

watch(
  () => props.dataForm,
  (newVal) => {
    if (props.typeForm === "edit" && newVal && Object.keys(newVal).length > 0) {
      // Set KRS info directly
      selectedKrs.value = {
        id: newVal.krs_id,
        nim: newVal.nim,
        th_akademik_id: newVal.th_akademik_id,
        mhs_jk_id: newVal.mhs_jk_id,
        th_akademik_nama: newVal.th_akademik_nama,
        mhs_nama: newVal.mhs_nama,
        prodi_nama: newVal.prodi_nama,
        prodi_alias: newVal.prodi_alias,
        jk_nama: newVal.jk_nama,
        tanggal: newVal.tanggal,
        display: `${newVal.nim} - ${newVal.mhs_nama}`
      };
      
      jumlah.value = newVal.jumlah;
      jenisPembayaranId.value = newVal.jenis_pembayaran_id;
    }
  },
  { immediate: true, deep: true }
);

const selectAll = async () => {
  await nextTick();
  const input = refSearch.value?.$el?.querySelector("input");
  if (input) input.select();
};
</script>

<template>
  <!-- ═══ Search Bar ═══ -->
  <VCard class="mb-6">
    <VCardText class="pa-4">
      <VCombobox
        v-if="typeForm === 'add'"
        ref="refSearch"
        v-model="selectedKrs"
        v-model:search="search"
        :items="krsList"
        item-title="display"
        return-object
        label="Cari KRS — ketik NIM atau Nama Mahasiswa"
        clearable
        :loading="loadingSearch"
        autocomplete="off"
        variant="outlined"
        prepend-inner-icon="ri-search-line"
        @focus="selectAll"
        @click="selectAll"
      >
        <template #append-inner>
          <VProgressCircular v-if="loadingSearch" indeterminate size="16" width="2" />
        </template>
      </VCombobox>
      <VTextField
        v-else
        :model-value="selectedKrs ? selectedKrs.display : ''"
        label="KRS Terpilih"
        variant="outlined"
        readonly
        disabled
        prepend-inner-icon="ri-user-line"
      />
    </VCardText>
  </VCard>

  <template v-if="krs.id">
    <VRow>
      <!-- Kolom kiri: Akademik + Mahasiswa -->
      <VCol cols="12" md="7">

        <!-- ═══ Card Akademik ═══ -->
        <VCard class="mb-4">
          <VCardItem>
            <template #prepend>
              <VAvatar color="primary" variant="tonal" rounded="lg" size="38">
                <VIcon icon="ri-calendar-2-line" size="20" />
              </VAvatar>
            </template>
            <VCardTitle class="text-base">Akademik</VCardTitle>
          </VCardItem>

          <VDivider />

          <VCardText class="pa-0">
            <VList lines="one" density="compact">
              <VListItem>
                <template #title>
                  <span class="text-xs text-medium-emphasis">Periode</span>
                </template>
                <template #subtitle>
                  <span class="text-sm font-weight-semibold text-high-emphasis">
                    {{ krs.periode_nama || "-" }}
                  </span>
                </template>
              </VListItem>
              <VDivider />
              <VListItem>
                <template #title>
                  <span class="text-xs text-medium-emphasis">Program Studi</span>
                </template>
                <template #subtitle>
                  <span class="text-sm font-weight-semibold text-high-emphasis">
                    {{ krs.prodi_nama || "-" }}
                    <VChip v-if="krs.prodi_alias" size="x-small" color="primary" variant="tonal" class="ms-1">
                      {{ krs.prodi_alias }}
                    </VChip>
                  </span>
                </template>
              </VListItem>
              <VDivider />
              <VListItem>
                <template #title>
                  <span class="text-xs text-medium-emphasis">Tanggal Daftar Semester Pendek</span>
                </template>
                <template #subtitle>
                  <span class="text-sm font-weight-semibold text-high-emphasis">
                    {{ formatTanggal(krs.tanggal) }}
                  </span>
                </template>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>

        <!-- ═══ Card Mahasiswa ═══ -->
        <VCard class="mb-4">
          <VCardItem>
            <template #prepend>
              <VAvatar color="success" variant="tonal" rounded="lg" size="38">
                <VIcon icon="ri-user-3-line" size="20" />
              </VAvatar>
            </template>
            <VCardTitle class="text-base">Mahasiswa</VCardTitle>
          </VCardItem>

          <VDivider />

          <VCardText class="pa-0">
            <VList lines="one" density="compact">
              <VListItem>
                <template #title>
                  <span class="text-xs text-medium-emphasis">NIM</span>
                </template>
                <template #subtitle>
                  <VChip size="small" color="success" label class="mt-1">
                    {{ krs.nim || "-" }}
                  </VChip>
                </template>
              </VListItem>
              <VDivider />
              <VListItem>
                <template #title>
                  <span class="text-xs text-medium-emphasis">Nama Lengkap</span>
                </template>
                <template #subtitle>
                  <span class="text-sm font-weight-semibold text-high-emphasis">
                    {{ krs.mhs_nama || "-" }}
                  </span>
                </template>
              </VListItem>
              <VDivider />
              <VListItem>
                <template #title>
                  <span class="text-xs text-medium-emphasis">Jenis Kelamin</span>
                </template>
                <template #subtitle>
                  <span class="text-sm font-weight-semibold text-high-emphasis">
                    {{ krs.jk_nama || "-" }}
                  </span>
                </template>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>

        <!-- ═══ Card Detail KRS (Mata Kuliah) ═══ -->
        <VCard v-if="krsDetails.length > 0" class="mb-4">
          <VCardItem>
            <template #prepend>
              <VAvatar color="success" variant="tonal" rounded="lg" size="38">
                <VIcon icon="ri-book-open-line" size="20" />
              </VAvatar>
            </template>
            <VCardTitle class="text-base">Detail KRS</VCardTitle>
            <template #append>
              <VChip color="primary" size="small" variant="tonal">
                {{ krsDetails.reduce((sum, d) => sum + (d.mata_kuliah?.sks ?? 0), 0) }} SKS
              </VChip>
            </template>
          </VCardItem>

          <VDivider />

          <VTable density="compact">
            <thead>
              <tr>
                <th class="text-left">No</th>
                <th class="text-left">Kode</th>
                <th class="text-left">Mata Kuliah</th>
                <th class="text-center">SKS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(detail, idx) in krsDetails" :key="detail.id">
                <td>{{ idx + 1 }}</td>
                <td>
                  <span class="text-caption font-weight-medium">{{ detail.mata_kuliah?.kode ?? '-' }}</span>
                </td>
                <td>{{ detail.mata_kuliah?.nama ?? '-' }}</td>
                <td class="text-center">{{ detail.mata_kuliah?.sks ?? '-' }}</td>
              </tr>
            </tbody>
          </VTable>
        </VCard>

        <!-- ═══ Card Catatan Deposit ═══ -->
        <VCard v-if="krs.nim" class="mb-4">
          <VCardItem>
            <template #prepend>
              <VAvatar color="warning" variant="tonal" rounded="lg" size="38">
                <VIcon icon="ri-wallet-3-line" size="20" />
              </VAvatar>
            </template>
            <VCardTitle class="text-base">Catatan Deposit</VCardTitle>
            <template #append>
              <VChip
                :color="saldoDeposit > 0 ? 'success' : 'default'"
                size="small"
                variant="tonal"
                :loading="loadingDeposit"
              >
                {{ formatRupiah(saldoDeposit) }}
              </VChip>
            </template>
          </VCardItem>
          <VDivider />
          <VCardText>
            <p class="text-sm text-medium-emphasis mb-0">
              Saldo deposit mahasiswa <b>{{ krs.nim }}</b> yang dapat digunakan untuk membayar tagihan.
            </p>
          </VCardText>
        </VCard>

      </VCol>

      <!-- Kolom kanan: Pembayaran + summary -->
      <VCol cols="12" md="5">
        <VCard class="mb-4" style="position: sticky; top: 80px;">
          <VCardItem>
            <template #prepend>
              <VAvatar color="warning" variant="tonal" rounded="lg" size="38">
                <VIcon icon="ri-money-dollar-circle-line" size="20" />
              </VAvatar>
            </template>
            <VCardTitle class="text-base">Pembayaran</VCardTitle>
            <template #append>
              <VChip
                v-if="krs.status"
                :color="krs.status === 'Lunas' ? 'success' : 'warning'"
                size="small"
                label
              >
                {{ krs.status }}
              </VChip>
            </template>
          </VCardItem>

          <VDivider />

          <VCardText>
            <!-- Summary: Biaya per MK, Total Harus Dibayar, Sudah Terbayar -->
            <div class="d-flex gap-3 mb-4 flex-wrap">
              <div class="flex-fill rounded-lg pa-3" style="background: rgba(var(--v-theme-info), 0.08); min-width: 120px;">
                <p class="text-xs text-medium-emphasis mb-1">Biaya / MK</p>
                <p class="text-subtitle-1 font-weight-bold text-info mb-0">
                  {{ formatRupiah(krs.biaya_per_mk) }}
                </p>
              </div>
              <div class="flex-fill rounded-lg pa-3" style="background: rgba(var(--v-theme-warning), 0.08); min-width: 120px;">
                <p class="text-xs text-medium-emphasis mb-1">Sisa Tagihan</p>
                <p class="text-subtitle-1 font-weight-bold text-warning mb-0">
                  {{ formatRupiah(Math.max(0, (krs.total_pembayaran || 0) - totalTerbayar)) }}
                </p>
                <p class="text-xs text-medium-emphasis mt-1">
                  dari {{ formatRupiah(krs.total_pembayaran) }}
                </p>
              </div>
              <div class="flex-fill rounded-lg pa-3" style="background: rgba(var(--v-theme-primary), 0.06); min-width: 120px;">
                <p class="text-xs text-medium-emphasis mb-1">Sudah Terbayar</p>
                <p class="text-subtitle-1 font-weight-bold text-primary mb-0">
                  {{ formatRupiah(totalTerbayar) }}
                </p>
                <p class="text-xs text-medium-emphasis mt-1">
                  dari {{ riwayat.length }} transaksi
                </p>
              </div>
            </div>

            <!-- Input Dibayar -->
            <VTextField
              ref="refJumlah"
              v-model.number="jumlah"
              label="Dibayar (Rp)"
              type="number"
              min="0"
              variant="outlined"
              density="comfortable"
              :hint="formatRupiah(jumlah)"
              persistent-hint
              placeholder="0"
              class="mb-2"
              @keyup.enter="submitPembayaran"
            />

            <!-- Input Deposit -->
            <VTextField
              v-model.number="depositPakai"
              label="Deposit (Rp)"
              type="number"
              min="0"
              :max="saldoDeposit"
              variant="outlined"
              density="comfortable"
              :hint="`Maks: ${formatRupiah(saldoDeposit)}`"
              persistent-hint
              placeholder="0"
              class="mb-2"
              :disabled="saldoDeposit <= 0"
            />

            <!-- Total Pembayaran -->
            <div class="rounded-lg pa-3 mb-4" style="background: rgba(var(--v-theme-success), 0.08);">
              <p class="text-xs text-medium-emphasis mb-1">Total Pembayaran</p>
              <p class="text-h6 font-weight-bold text-success mb-0">
                {{ formatRupiah((jumlah || 0) + Math.min(depositPakai || 0, saldoDeposit)) }}
              </p>
              <p v-if="depositPakai > 0" class="text-xs text-medium-emphasis mt-1">
                {{ formatRupiah(jumlah || 0) }} tunai + {{ formatRupiah(Math.min(depositPakai || 0, saldoDeposit)) }} deposit
              </p>
            </div>

            <!-- Input Jenis Pembayaran -->
            <VSelect
              v-model="jenisPembayaranId"
              :items="listJenisPembayaran"
              label="Jenis Pembayaran"
              variant="outlined"
              density="comfortable"
              class="mb-4"
            />

            <VBtn
              color="primary"
              block
              size="large"
              class="mt-4"
              :disabled="((jumlah || 0) + Math.min(depositPakai || 0, saldoDeposit)) <= 0 || isSubmitting"
              :loading="isSubmitting"
              @click="submitPembayaran"
            >
              <VIcon icon="ri-save-line" class="me-2" />
              Simpan Pembayaran
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- ═══ Riwayat Pembayaran ═══ -->
    <VCard>
      <VCardItem>
        <template #prepend>
          <VAvatar color="info" variant="tonal" rounded="lg" size="38">
            <VIcon icon="ri-history-line" size="20" />
          </VAvatar>
        </template>
        <VCardTitle class="text-base">Riwayat Pembayaran</VCardTitle>
        <template #append>
          <VChip v-if="riwayat.length > 0" color="info" size="small" variant="tonal">
            {{ riwayat.length }} transaksi
          </VChip>
        </template>
      </VCardItem>

      <VDivider />

      <VCardText class="pa-0">
        <div v-if="loadingDetail" class="text-center py-8">
          <VProgressCircular indeterminate color="primary" size="32" />
          <p class="text-sm text-medium-emphasis mt-3">Memuat riwayat...</p>
        </div>

        <template v-else>
          <div v-if="riwayat.length === 0" class="d-flex flex-column align-center justify-center py-8 text-medium-emphasis">
            <VIcon icon="ri-inbox-line" size="40" class="mb-2" />
            <span class="text-sm">Belum ada riwayat pembayaran untuk KRS ini.</span>
          </div>

          <VTable v-else class="text-no-wrap">
            <thead>
              <tr>
                <th class="text-uppercase text-xs">No</th>
                <th class="text-uppercase text-xs">Nomor Transaksi</th>
                <th class="text-uppercase text-xs">Tanggal</th>
                <th class="text-uppercase text-xs">Nominal</th>
                <th class="text-uppercase text-xs">Petugas</th>
                <th class="text-uppercase text-xs">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in riwayat" :key="item.id">
                <td class="text-medium-emphasis">{{ idx + 1 }}</td>
                <td>
                  <VChip color="primary" size="small" label>{{ item.nomor }}</VChip>
                </td>
                <td class="text-sm">{{ formatTanggal(item.tanggal) }}</td>
                <td class="font-weight-semibold">{{ formatRupiah(item.jumlah) }}</td>
                <td class="text-sm">{{ item.user?.name ?? "-" }}</td>
                <td>
                  <IconBtn size="small" color="info" @click="cetakKwitansi(item.id)">
                    <VIcon icon="ri-printer-line" size="16" />
                    <VTooltip activator="parent" location="top">Cetak Kwitansi</VTooltip>
                  </IconBtn>
                  <IconBtn size="small" color="primary" @click="openEditDialog(item)">
                    <VIcon icon="ri-pencil-line" size="16" />
                    <VTooltip activator="parent" location="top">Edit</VTooltip>
                  </IconBtn>
                  <IconBtn size="small" color="error" @click="openDeleteDialog(item)">
                    <VIcon icon="ri-delete-bin-line" size="16" />
                    <VTooltip activator="parent" location="top">Hapus</VTooltip>
                  </IconBtn>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="text-right font-weight-bold py-3 text-sm">
                  Total Terbayar
                </td>
                <td class="font-weight-bold text-success py-3" colspan="3">
                  {{ formatRupiah(totalTerbayar) }}
                </td>
              </tr>
            </tfoot>
          </VTable>
        </template>
      </VCardText>
    </VCard>

    <!-- ═══ Dialog Edit Riwayat ═══ -->
    <VDialog v-model="editDialog" max-width="450">
      <VCard title="Edit Pembayaran">
        <DialogCloseBtn variant="text" size="default" @click="editDialog = false" />
        <VCardText>
          <VTextField
            v-model="editTanggal"
            type="date"
            label="Tanggal"
            variant="outlined"
            class="mb-4"
          />
          <VTextField
            v-model.number="editJumlah"
            type="number"
            label="Nominal (Rp)"
            variant="outlined"
            prefix="Rp"
            :hint="formatRupiah(editJumlah)"
            persistent-hint
            class="mb-4"
          />
          <VSelect
            v-model="editJenisPembayaranId"
            :items="listJenisPembayaran"
            label="Jenis Pembayaran"
            variant="outlined"
          />
        </VCardText>
        <VCardText class="d-flex justify-end gap-3">
          <VBtn variant="outlined" color="secondary" @click="editDialog = false">Batal</VBtn>
          <VBtn color="primary" :loading="isProcessing" @click="submitEditRiwayat">
            <VIcon icon="ri-save-line" class="me-1" />
            Simpan
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- ═══ Dialog Delete Riwayat ═══ -->
    <VDialog v-model="deleteDialog" max-width="450">
      <VCard :title="'Hapus: ' + (deleteItem?.nomor ?? '')">
        <DialogCloseBtn variant="text" size="default" @click="deleteDialog = false" />
        <VCardText class="d-flex align-center">
          <VIcon icon="ri-alert-line" size="32" class="me-2" color="error" />
          <span>
            Anda yakin ingin menghapus pembayaran <b>{{ deleteItem?.nomor }}</b>
            senilai <b>{{ formatRupiah(deleteItem?.jumlah) }}</b>?
            Total pembayaran di SIAKAD akan dihitung ulang.
          </span>
        </VCardText>
        <VCardText class="d-flex justify-end gap-3">
          <VBtn variant="outlined" color="secondary" @click="deleteDialog = false">Batal</VBtn>
          <VBtn color="error" :loading="isProcessing" @click="submitDeleteRiwayat">
            <VIcon icon="ri-delete-bin-line" class="me-1" />
            Hapus
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </template>
</template>
