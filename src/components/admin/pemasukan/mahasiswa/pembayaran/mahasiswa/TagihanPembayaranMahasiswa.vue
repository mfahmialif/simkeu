<script setup>
const props = defineProps({
  mahasiswa: { type: Object, required: true, default: () => ({}) },
});

const tagihan = ref([]);
const selectedTagihan = ref([]); // <-- array untuk multiple
const loadingTagihan = ref(false);

/** ──── Payment Mode Toggle ──── */
const paymentMode = ref("tagihan"); // 'nominal' | 'tagihan'
const nominalInput = ref(0);
const sisaNominal = ref(0);
const showDetailTagihan = ref(false);
const useDeposit = ref(false);
const depositUsed = ref(0);
const lastPaymentScope = ref("semua");

const mahasiswaSemester = computed(() => {
  const semester = Number(props.mahasiswa?.semester);
  return Number.isFinite(semester) && semester > 0 ? semester : null;
});

const angkatanTahun = computed(() => {
  const kode = String(props.mahasiswa?.angkatan || "");
  const tahun = Number(kode.slice(0, 4));
  return Number.isFinite(tahun) && tahun > 0 ? tahun : null;
});

const calculateSemesterMahasiswa = (tahunTagihan, semesterKode) => {
  if (!angkatanTahun.value) return null;
  if (!Number.isFinite(tahunTagihan) || ![1, 2].includes(semesterKode)) return null;

  return (tahunTagihan - angkatanTahun.value) * 2 + semesterKode;
};

const getTagihanSemester = (item) => {
  const kodeTahunAkademik = String(item?.th_akademik_kode || item?.th_akademik?.kode || "");
  if (angkatanTahun.value && /^\d{5}$/.test(kodeTahunAkademik)) {
    const tahunTagihan = Number(kodeTahunAkademik.slice(0, 4));
    const semesterKode = Number(kodeTahunAkademik.slice(4, 5));
    const semesterMahasiswa = calculateSemesterMahasiswa(tahunTagihan, semesterKode);
    if (semesterMahasiswa) return semesterMahasiswa;
  }

  return null;
};

const isSkripsiBlocked = (item) =>
  !cekNilai.value && String(item?.nama || "").toLowerCase() === "skripsi";

const scopedTagihan = computed(() => {
  return tagihan.value;
});

const semesterIniTagihan = computed(() => {
  if (!mahasiswaSemester.value) return scopedTagihan.value;

  return scopedTagihan.value.filter((item) => {
    const semester = getTagihanSemester(item);
    return !semester || semester <= mahasiswaSemester.value;
  });
});

const semesterDepanTagihan = computed(() => {
  if (!mahasiswaSemester.value) return [];

  return scopedTagihan.value.filter(
    (item) => {
      const semester = getTagihanSemester(item);
      return semester && semester > mahasiswaSemester.value;
    }
  );
});

const groupedTagihanItems = computed(() => {
  if (!mahasiswaSemester.value) return scopedTagihan.value;

  const groups = [];

  if (semesterIniTagihan.value.length) {
    groups.push({
      id: "__group_semester_ini",
      display: `Semester ini (s/d semester ${mahasiswaSemester.value})`,
      itemProps: { disabled: true },
    });
    groups.push(...semesterIniTagihan.value);
  }

  if (semesterDepanTagihan.value.length) {
    groups.push({
      id: "__group_semester_depan",
      display: `Semester depan (> semester ${mahasiswaSemester.value})`,
      itemProps: { disabled: true },
    });
    groups.push(...semesterDepanTagihan.value);
  }

  return groups;
});

const detailTagihanGroups = computed(() => {
  if (!mahasiswaSemester.value) {
    return [{ key: "semua", label: "Semua Tagihan", items: scopedTagihan.value }];
  }

  return [
    {
      key: "semester_ini",
      label: `Semester ini (s/d semester ${mahasiswaSemester.value})`,
      items: semesterIniTagihan.value,
    },
    {
      key: "semester_depan",
      label: `Semester depan (> semester ${mahasiswaSemester.value})`,
      items: semesterDepanTagihan.value,
    },
  ].filter((group) => group.items.length);
});

const cekPelanggaran = ref(false);
const fetchCekPelanggaran = async (nim) => {
  try {
    cekPelanggaran.value = false;
    loadingTagihan.value = true;
    tagihan.value = [];
    const res = await $api(`/admin/mahasiswa/cek-pelanggaran/${nim}`, {
      method: "GET",
    });

    if (!res.status) {
      showSnackbar({ text: res.message, color: "error" });
      cekPelanggaran.value = true;
      return;
    }
  } catch (error) {
    showSnackbar({ text: error, color: "error" });
  } finally {
    loadingTagihan.value = false;
  }
};

const cekNilai = ref(true);
const fetchTagihan = async (nim) => {
  clearTagihan();
  try {
    await fetchCekPelanggaran(nim);

    if (cekPelanggaran.value) {
      return;
    }
    loadingTagihan.value = true;
    tagihan.value = [];
    const res = await $api(`/admin/pemasukan/mahasiswa/cek-tagihan`, {
      method: "GET",
      body: {
        nim: nim,
        cekNilai: 1,
      },
    });

    if (!res.status) {
      showSnackbar({ text: res.message, color: "error" });
      return;
    }

    cekNilai.value = res.cekNilai;

    tagihan.value = res.data.list_tagihan.map((item) => ({
      ...item,
      display: `${item.nama} - Rp.${item.sisa}${
        item.dibayar > 0 ? " (Dibayar: Rp." + item.dibayar + ")" : ""
      }`,
      itemProps: {
        disabled: !res.cekNilai && item.nama.toLowerCase() === "skripsi",
      },
    }));
  } catch (error) {
    showSnackbar({ text: error, color: "error" });
  } finally {
    loadingTagihan.value = false;
  }
};

const clearTagihan = () => {
  rows.value = [];
  selectedTagihan.value = [];
  nominalInput.value = 0;
  sisaNominal.value = 0;
  depositUsed.value = 0;
  lastPaymentScope.value = "semua";
  props.mahasiswa.dipakai = 0;
  props.mahasiswa.autoSimpanDeposit = 0;
};

const selectAllTagihan = () => {
  console.log("cek nilai:", cekNilai.value);
  selectedTagihan.value = eligibleTagihan.value;
};

const hasScopedTagihan = computed(() => scopedTagihan.value.length > 0);

/** Total sisa seluruh tagihan yang eligible */
const eligibleTagihan = computed(() =>
  cekNilai.value
    ? scopedTagihan.value
    : scopedTagihan.value.filter((i) => !isSkripsiBlocked(i))
);

const eligibleSemesterIniTagihan = computed(() => {
  const semesterIniIds = new Set(semesterIniTagihan.value.map((item) => item.id));

  return eligibleTagihan.value.filter((item) => semesterIniIds.has(item.id));
});

const totalSisaTagihan = computed(() =>
  eligibleTagihan.value.reduce((sum, t) => sum + (Number(t.sisa) || 0), 0)
);

const totalSisaSemesterIni = computed(() =>
  eligibleSemesterIniTagihan.value.reduce((sum, t) => sum + (Number(t.sisa) || 0), 0)
);

const hasEligibleSemesterIniTagihan = computed(() =>
  eligibleSemesterIniTagihan.value.length > 0
);

const canBayarLunasSemesterIni = computed(() =>
  Boolean(mahasiswaSemester.value)
    && hasEligibleSemesterIniTagihan.value
    && totalSisaSemesterIni.value > 0
);

const canBayarLunasSemua = computed(() =>
  totalSisaTagihan.value > 0
);

defineExpose({ fetchTagihan, clearTagihan, paymentMode });

/** Daftar baris yang dipilih */
const rows = ref([]);

const normalizePaymentScope = (scope) =>
  scope === "semester_ini" ? "semester_ini" : "semua";

const getPaymentTargetItems = (scope = "semua") =>
  scope === "semester_ini" ? eligibleSemesterIniTagihan.value : eligibleTagihan.value;

/** ──── MODE NOMINAL: Distribusi otomatis FIFO ──── */
function distributePayment(scope = "semua") {
  const paymentScope = normalizePaymentScope(scope);
  rows.value = [];
  depositUsed.value = 0;
  lastPaymentScope.value = paymentScope;

  let cashRemaining = Number(nominalInput.value) || 0;
  let depoRemaining = useDeposit.value ? Number(props.mahasiswa?.deposit || 0) : 0;

  const totalAvailable = cashRemaining + depoRemaining;

  if (totalAvailable <= 0) {
    showSnackbar({ text: "Nominal harus lebih dari 0", color: "error" });
    return;
  }

  for (const item of getPaymentTargetItems(paymentScope)) {
    if (cashRemaining <= 0 && depoRemaining <= 0) break;

    const sisa = Number(item.sisa) || 0;
    if (sisa <= 0) continue;

    // Alokasi: deposit dulu, sisanya cash
    const fromDepo = Math.min(depoRemaining, sisa);
    const sisaAfterDepo = sisa - fromDepo;
    const fromCash = Math.min(cashRemaining, sisaAfterDepo);

    if (fromCash + fromDepo <= 0) continue;

    rows.value.push({
      id: item.id,
      display: item.display,
      nominal: sisa,
      dibayar: fromCash,
      deposit: fromDepo,
    });

    depoRemaining -= fromDepo;
    cashRemaining -= fromCash;
  }

  // Total deposit yang dipakai
  depositUsed.value = useDeposit.value
    ? Number(props.mahasiswa?.deposit || 0) - depoRemaining
    : 0;
  props.mahasiswa.dipakai = depositUsed.value;

  // Kelebihan cash → masukkan ke catatan deposit mahasiswa
  sisaNominal.value = cashRemaining;
  props.mahasiswa.autoSimpanDeposit = cashRemaining;

  if (rows.value.length === 0) {
    showSnackbar({ text: "Tidak ada tagihan yang bisa dibayarkan", color: "warning" });
  }
}

/** Bayar lunas: hitung nominal yang diperlukan (dikurangi deposit jika aktif) */
function bayarLunas(scope = "semua") {
  const paymentScope = normalizePaymentScope(scope);
  const depositBalance = useDeposit.value ? Number(props.mahasiswa?.deposit || 0) : 0;
  const totalSisa = paymentScope === "semester_ini"
    ? totalSisaSemesterIni.value
    : totalSisaTagihan.value;
  const needed = Math.max(0, totalSisa - depositBalance);
  nominalInput.value = needed;
  distributePayment(paymentScope);
}

/** Clear distribusi saat mode berubah */
watch(paymentMode, () => {
  rows.value = [];
  selectedTagihan.value = [];
  nominalInput.value = 0;
  sisaNominal.value = 0;
});

watch(scopedTagihan, (newArr) => {
  const allowedIds = new Set(newArr.map((item) => item.id));
  selectedTagihan.value = selectedTagihan.value.filter((item) =>
    allowedIds.has(item.id)
  );
  rows.value = rows.value.filter((row) => allowedIds.has(row.id));
});

/** Auto re-distribute saat toggle deposit berubah */
watch(useDeposit, (enabled) => {
  if (paymentMode.value === "nominal" && rows.value.length > 0) {
    const depositBalance = Number(props.mahasiswa?.deposit || 0);
    if (enabled) {
      // Kurangi nominal karena deposit membantu
      nominalInput.value = Math.max(0, nominalInput.value - depositBalance);
    } else {
      // Kembalikan nominal karena deposit tidak dipakai
      nominalInput.value = nominalInput.value + depositUsed.value;
    }
    distributePayment(lastPaymentScope.value);
  }
});

/** ──── MODE TAGIHAN: Sinkronkan rows dengan selectedTagihan (multiple) ──── */
watch(
  selectedTagihan,
  (newArr, oldArr) => {
    if (paymentMode.value !== "tagihan") return;

    // Tambahkan baris utk item yang baru dipilih
    const added = newArr.filter((n) => !oldArr?.some((o) => o.id === n.id));
    for (const item of added) {
      if (!rows.value.some((r) => r.id === item.id)) {
        rows.value.push({
          id: item.id,
          display: item.display,
          nominal: item.sisa ?? 0,
          dibayar: item.sisa ?? 0, // default isi penuh
          deposit: 0,
        });
      }
    }

    // Hapus baris utk item yang dihapus dari pilihan
    const removed = (oldArr || []).filter(
      (o) => !newArr.some((n) => n.id === o.id)
    );
    if (removed.length) {
      rows.value = rows.value.filter(
        (r) => !removed.some((rem) => rem.id === r.id)
      );
    }
  },
  { deep: true }
);

/** Hapus baris (sekalian sync ke combobox) */
function removeRow(id) {
  rows.value = rows.value.filter((r) => r.id !== id);
  selectedTagihan.value = selectedTagihan.value.filter((s) => s.id !== id);
}

/** Recalc per-baris */
/** Recalc saat admin ubah field DIBAYAR */
function recalcDibayar(idx) {
  const r = rows.value[idx];
  r.dibayar = Math.max(0, Number(r.dibayar || 0));
  r.dibayar = Math.min(r.dibayar, r.nominal);

  // Limit deposit agar dibayar + deposit tidak melebihi nominal
  const sisaNominal = Math.max(0, r.nominal - r.dibayar);
  r.deposit = Math.min(r.deposit, sisaNominal);

  // Auto-update total deposit yang dipakai
  props.mahasiswa.dipakai = rows.value.reduce(
    (sum, row) => sum + (Number(row.deposit) || 0), 0
  );
}

/** Recalc saat admin ubah field DEPOSIT */
function recalcDeposit(idx) {
  const r = rows.value[idx];
  r.deposit = Math.max(0, Number(r.deposit || 0));

  // Limit deposit: tidak melebihi saldo catatan deposit dikurangi deposit baris lain
  const saldoDeposit = Number(props.mahasiswa?.deposit || 0);
  const totalDepositLain = rows.value.reduce((sum, row, i) => {
    return i === idx ? sum : sum + (Number(row.deposit) || 0);
  }, 0);

  const sisaPlafon = Math.max(0, saldoDeposit - totalDepositLain);
  r.deposit = Math.min(r.deposit, sisaPlafon);
  r.deposit = Math.min(r.deposit, r.nominal);

  // Dibayar = sisa nominal setelah deposit
  r.dibayar = Math.max(0, r.nominal - r.deposit);

  // Auto-update total deposit yang dipakai
  props.mahasiswa.dipakai = rows.value.reduce(
    (sum, row) => sum + (Number(row.deposit) || 0), 0
  );
}

/** Ringkasan */
const totalDibayar = computed(() =>
  rows.value.reduce((sum, r) => sum + (Number(r.dibayar) || 0), 0)
);
const totalDeposit = computed(() =>
  rows.value.reduce((sum, r) => sum + (Number(r.deposit) || 0), 0)
);
const totalSemua = computed(() => totalDibayar.value + totalDeposit.value);

/** Propagate ke parent */
watch(
  rows,
  () => {
    props.mahasiswa.tagihan = rows;
  },
  { deep: true }
);

// formatRupiah asumsi sudah ada di scope-mu
</script>

<template>
  <!-- Pembayaran -->
  <VCard class="mt-4" title="Pembayaran">
    <!-- Toggle Mode -->
    <VCardText class="pb-0">
      <VRow class="mb-4" dense>
        <VCol cols="6">
          <VBtn
            block
            :color="paymentMode === 'tagihan' ? 'primary' : 'default'"
            :variant="paymentMode === 'tagihan' ? 'elevated' : 'outlined'"
            @click="paymentMode = 'tagihan'"
          >
            <VIcon icon="ri-list-check-2" class="me-2" />
            Mode Tagihan
          </VBtn>
        </VCol>
        <VCol cols="6">
          <VBtn
            block
            :color="paymentMode === 'nominal' ? 'primary' : 'default'"
            :variant="paymentMode === 'nominal' ? 'elevated' : 'outlined'"
            @click="paymentMode = 'nominal'"
          >
            <VIcon icon="ri-money-dollar-circle-line" class="me-2" />
            Mode Bayar
          </VBtn>
        </VCol>
      </VRow>

      <!-- Info total sisa tagihan (expandable) -->
      <div v-if="hasScopedTagihan" class="mb-4">
        <VAlert
          type="info"
          variant="tonal"
          density="compact"
          style="cursor: pointer"
          @click="showDetailTagihan = !showDetailTagihan"
        >
          <div class="d-flex align-center justify-space-between w-100">
            <span>
              Total sisa tagihan: <strong>{{ formatRupiah(totalSisaTagihan) }}</strong>
              ({{ eligibleTagihan.length }} tagihan)
            </span>
            <VIcon
              :icon="showDetailTagihan ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"
              size="20"
            />
          </div>
        </VAlert>

        <!-- Detail tagihan -->
        <VExpandTransition>
          <div v-show="showDetailTagihan">
            <VTable density="compact" class="border rounded mt-1">
              <thead>
                <tr>
                  <th>Tagihan</th>
                  <th class="text-end">Jumlah</th>
                  <th class="text-end">Dibayar</th>
                  <th class="text-end">Sisa</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="group in detailTagihanGroups" :key="group.key">
                  <tr>
                    <td colspan="4" class="bg-grey-lighten-4 font-weight-medium">
                      {{ group.label }}
                    </td>
                  </tr>
                  <tr
                    v-for="t in group.items"
                    :key="t.id"
                    :class="{ 'text-medium-emphasis': isSkripsiBlocked(t) }"
                  >
                    <td>
                      {{ t.nama }}
                      <VChip v-if="isSkripsiBlocked(t)" size="x-small" color="warning" class="ms-2">Belum memenuhi syarat</VChip>
                    </td>
                    <td class="text-end">{{ formatRupiah(t.jumlah) }}</td>
                    <td class="text-end">{{ formatRupiah(t.dibayar) }}</td>
                    <td class="text-end font-weight-medium">{{ formatRupiah(t.sisa) }}</td>
                  </tr>
                </template>
              </tbody>
            </VTable>
          </div>
        </VExpandTransition>
      </div>

      <!-- Warning tagihan tidak eligible -->
      <VAlert
        v-if="hasScopedTagihan && !cekNilai"
        type="warning"
        variant="tonal"
        density="compact"
        class="mb-4"
      >
        *Beberapa tagihan tidak bisa dibayar karena belum memenuhi syarat (Skripsi).
      </VAlert>
    </VCardText>

    <!-- ═══ MODE NOMINAL ═══ -->
    <VCardText v-if="paymentMode === 'nominal'">
      <!-- Loading state -->
      <div v-if="loadingTagihan" class="text-center py-6">
        <VProgressCircular indeterminate color="primary" size="40" />
        <p class="text-medium-emphasis mt-3 mb-0">Memuat data tagihan...</p>
      </div>

      <VRow v-else class="align-center">
        <VCol cols="12">
          <VTextField
            v-model.number="nominalInput"
            label="Nominal Pembayaran (Rp)"
            type="number"
            min="0"
            variant="outlined"
            density="comfortable"
            :hint="formatRupiah(nominalInput)"
            persistent-hint
            placeholder="Masukkan nominal yang dibayarkan"
            @keyup.enter="distributePayment"
          />
        </VCol>

        <!-- Gunakan Deposit -->
        <VCol cols="12" v-if="props.mahasiswa?.deposit > 0">
          <VAlert type="success" variant="tonal" density="compact">
            <div class="d-flex align-center justify-space-between w-100">
              <span>
                Saldo deposit: <strong>{{ formatRupiah(props.mahasiswa.deposit) }}</strong>
              </span>
              <VSwitch
                v-model="useDeposit"
                label="Gunakan Deposit"
                hide-details
                density="compact"
                color="success"
                class="ms-4 flex-grow-0"
              />
            </div>
          </VAlert>
        </VCol>

        <VCol cols="12" md="4">
          <VBtn
            color="success"
            variant="elevated"
            class="w-100"
            :disabled="!canBayarLunasSemesterIni"
            @click="bayarLunas('semester_ini')"
          >
            <VIcon icon="ri-check-double-line" class="me-2" />
            Lunas Semester Ini
          </VBtn>
        </VCol>
        <VCol cols="12" md="4">
          <VBtn
            color="success"
            variant="outlined"
            class="w-100"
            :disabled="!canBayarLunasSemua"
            @click="bayarLunas('semua')"
          >
            <VIcon icon="ri-check-double-line" class="me-2" />
            Lunas Semua
          </VBtn>
        </VCol>
        <VCol cols="12" md="4">
          <VBtn
            color="primary"
            variant="elevated"
            class="w-100"
            :disabled="!hasScopedTagihan || nominalInput <= 0"
            @click="distributePayment"
          >
            <VIcon icon="ri-arrow-right-line" class="me-2" />
            Proses Pembayaran
          </VBtn>
        </VCol>
      </VRow>

      <!-- Info deposit yang digunakan -->
      <VAlert
        v-if="depositUsed > 0 && rows.length > 0"
        type="success"
        variant="tonal"
        density="compact"
        class="mt-4"
      >
        Deposit digunakan: <strong>{{ formatRupiah(depositUsed) }}</strong> dari saldo {{ formatRupiah(props.mahasiswa.deposit) }}.
      </VAlert>

      <!-- Info kelebihan nominal masuk catatan deposit -->
      <VAlert
        v-if="sisaNominal > 0 && rows.length > 0"
        type="info"
        variant="tonal"
        density="compact"
        class="mt-4"
      >
        Kelebihan nominal <strong>{{ formatRupiah(sisaNominal) }}</strong> akan otomatis masuk ke catatan deposit mahasiswa.
      </VAlert>
    </VCardText>

    <!-- ═══ MODE TAGIHAN (LAMA) ═══ -->
    <VCardText v-if="paymentMode === 'tagihan'">
      <VRow>
        <VCol cols="6" v-if="hasScopedTagihan">
          <VBtn
            class="w-100"
            color="primary"
            variant="elevated"
            @click="selectAllTagihan"
          >
            Bayar semua tagihan
          </VBtn>
        </VCol>
        <VCol cols="6" v-if="hasScopedTagihan">
          <VBtn
            class="w-100"
            color="error"
            variant="elevated"
            @click="clearTagihan"
          >
            Clear Tagihan
          </VBtn>
        </VCol>
        <VCol cols="12">
          <VCombobox
            v-model="selectedTagihan"
            :items="groupedTagihanItems"
            item-title="display"
            item-value="id"
            item-props="itemProps"
            label="Tagihan"
            multiple
            chips
            closable-chips
            return-object
            clearable
            :loading="loadingTagihan"
            autocomplete="off"
          />
        </VCol>
      </VRow>
    </VCardText>

    <!-- ═══ PREVIEW DISTRIBUSI (Kedua mode) ═══ -->
    <VCardText>
      <!-- Header distribusi untuk mode nominal -->
      <div
        v-if="paymentMode === 'nominal' && rows.length > 0"
        class="text-subtitle-1 font-weight-medium mb-3"
      >
        Preview Distribusi Pembayaran
      </div>

      <VRow v-for="(row, idx) in rows" :key="row.id" class="align-center">
        <VCol cols="12" md="6">
          <VTextField
            :model-value="row.display"
            label="Tagihan"
            variant="outlined"
            density="comfortable"
            readonly
            hint="Tagihan yang dipilih"
            persistent-hint
          />
        </VCol>

        <VCol cols="12" :md="row.deposit > 0 || paymentMode === 'tagihan' ? 3 : 6">
          <VTextField
            v-model.number="row.dibayar"
            label="Dibayar"
            type="number"
            min="0"
            variant="outlined"
            density="comfortable"
            :hint="formatRupiah(row.dibayar)"
            persistent-hint
            :readonly="paymentMode === 'nominal'"
            @update:modelValue="recalcDibayar(idx)"
          />
        </VCol>

        <VCol v-if="paymentMode === 'tagihan' || row.deposit > 0" cols="12" md="2">
          <VTextField
            v-model.number="row.deposit"
            label="Deposit"
            type="number"
            min="0"
            variant="outlined"
            density="comfortable"
            :hint="formatRupiah(row.deposit)"
            persistent-hint
            :readonly="paymentMode === 'nominal'"
            @update:modelValue="recalcDeposit(idx)"
          />
        </VCol>

        <VCol v-if="paymentMode === 'tagihan'" cols="12" md="1" class="d-flex mb-5">
          <VBtn
            color="error"
            icon="ri-delete-bin-line"
            variant="elevated"
            class="ml-auto"
            @click="removeRow(row.id)"
            :aria-label="`Hapus ${row.display}`"
            hint="delete"
            persistent-hint
          />
        </VCol>
      </VRow>

      <div
        v-if="rows.length === 0"
        class="text-medium-emphasis text-center py-6"
      >
        <template v-if="paymentMode === 'nominal'">
          <div>Masukkan nominal dan klik "Proses Pembayaran" untuk melihat tagihan yang akan dibayarkan.</div>
          <div>Pakai tombol lunas untuk membayar semester ini atau semua tagihan.</div>
        </template>
        <template v-else>
          Belum ada tagihan yang dipilih.
        </template>
      </div>
    </VCardText>
  </VCard>

  <!-- Total -->
  <VCard class="mt-4" title="Total">
    <VCardText>
      <VRow>
        <VCol cols="12" md="6">
          <VTextField
            :model-value="formatRupiah(totalDibayar)"
            label="Total Dibayar"
            variant="outlined"
            readonly
          />
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            :model-value="formatRupiah(totalDeposit)"
            label="Total Deposit"
            variant="outlined"
            readonly
          />
        </VCol>
        <VCol cols="12">
          <VTextField
            :model-value="formatRupiah(totalSemua)"
            label="Total Dibayar + Deposit"
            variant="outlined"
            readonly
          />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
