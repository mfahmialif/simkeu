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
  !cekNilai.value && String(item?.nama || "").toLowerCase().includes("skripsi");

const hasDispensasiTagihan = (item) =>
  Boolean(item?.status_dispensasi) && Number(item?.jumlah_dispensasi || 0) > 0;

const formatTagihanRupiah = (value) =>
  `Rp.${Number(value || 0).toLocaleString("id-ID")}`;

const formatBatasDispensasi = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getTagihanDisplay = (item) => {
  const dibayarText = Number(item?.dibayar || 0) > 0
    ? ` (Dibayar: ${formatTagihanRupiah(item.dibayar)})`
    : "";
  const dispensasiText = hasDispensasiTagihan(item)
    ? ` (Dispensasi: ${formatTagihanRupiah(item.jumlah_dispensasi)}, Batas: ${formatBatasDispensasi(item.batas_dispensasi)})`
    : "";

  return `${item.nama} - ${formatTagihanRupiah(item.sisa)}${dibayarText}${dispensasiText}`;
};

const getRawTagihanItem = (item) => item?.raw || item;

const isGroupTagihanItem = (item) =>
  String(getRawTagihanItem(item)?.id || "").startsWith("__group_");

const getTagihanItemProps = (item) => {
  const rawItem = getRawTagihanItem(item);

  return {
    ...(rawItem?.itemProps || {}),
    disabled: isGroupTagihanItem(rawItem),
  };
};

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
      display: getTagihanDisplay(item),
      itemProps: {},
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
  selectedTagihan.value = eligibleTagihan.value;
};

const hasScopedTagihan = computed(() => scopedTagihan.value.length > 0);

/** Total sisa seluruh tagihan yang eligible */
const eligibleTagihan = computed(() =>
  scopedTagihan.value
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

const keringananOptions = [
  { title: "Tanpa Keringanan", value: "" },
  { title: "Samahah", value: "samahah" },
  { title: "Dhomin", value: "dhomin" },
];
const DEFAULT_KERINGANAN_BATAS = "9999-12-31";

const normalizeKeringananJenis = (value) => {
  const jenis = String(value || "").toLowerCase();
  return ["samahah", "dhomin"].includes(jenis) ? jenis : "";
};

const createPaymentRow = (item, dibayar, deposit = 0) => ({
  id: item.id,
  display: item.display,
  nominal: Number(item.sisa) || 0,
  dibayar: Number(dibayar) || 0,
  deposit: Number(deposit) || 0,
  keringanan_jenis: "",
  keringanan_jumlah: 0,
  keringanan_batas: null,
});

const isDhominRow = (row) => normalizeKeringananJenis(row?.keringanan_jenis) === "dhomin";
const isSamahahRow = (row) => normalizeKeringananJenis(row?.keringanan_jenis) === "samahah";

const getSisaSetelahPembayaran = (row) => Math.max(
  0,
  (Number(row?.nominal) || 0) - (Number(row?.dibayar) || 0) - (Number(row?.deposit) || 0)
);

function syncDhominKeringanan(row) {
  row.dibayar = Math.max(0, Number(row.dibayar || 0));
  row.dibayar = Math.min(row.dibayar, Number(row.nominal) || 0);
  row.deposit = Math.max(0, Number(row.deposit || 0));
  row.deposit = Math.min(row.deposit, Math.max(0, (Number(row.nominal) || 0) - row.dibayar));
  row.keringanan_jumlah = getSisaSetelahPembayaran(row);
  row.keringanan_batas = DEFAULT_KERINGANAN_BATAS;
}

function syncPaymentTotalsState() {
  const totalDepositRows = rows.value.reduce(
    (sum, row) => sum + (Number(row.deposit) || 0),
    0
  );

  props.mahasiswa.dipakai = totalDepositRows;

  if (paymentMode.value === "nominal") {
    depositUsed.value = totalDepositRows;
    const totalCashRows = rows.value.reduce(
      (sum, row) => sum + (Number(row.dibayar) || 0),
      0
    );
    sisaNominal.value = Math.max(0, (Number(nominalInput.value) || 0) - totalCashRows);
    props.mahasiswa.autoSimpanDeposit = sisaNominal.value;
  } else {
    props.mahasiswa.autoSimpanDeposit = 0;
  }
}

const semesterPendekKrsDetails = ref({});
const semesterPendekKrsLoading = ref({});
const semesterPendekKrsErrors = ref({});
const semesterPendekKeringananKeys = ref({});

const parseSemesterPendekTagihanName = (nama) => {
  const parts = String(nama || "")
    .split(" - ")
    .map((part) => part.trim());

  if (parts.length < 3 || parts[0].toUpperCase() !== "SEMESTER PENDEK") {
    return null;
  }

  const krsId = Number(parts[parts.length - 1]);
  if (!Number.isFinite(krsId) || krsId <= 0) {
    return null;
  }

  return {
    krsId,
    periode: parts.slice(1, -1).join(" - "),
  };
};

const getTagihanByRow = (row) =>
  tagihan.value.find((item) => String(item.id) === String(row.id));

const semesterPendekKrsRows = computed(() => {
  const seenKrsIds = new Set();

  return rows.value
    .map((row) => {
      const tagihanItem = getTagihanByRow(row);
      const parsed = parseSemesterPendekTagihanName(tagihanItem?.nama);

      if (!parsed || seenKrsIds.has(parsed.krsId)) {
        return null;
      }

      seenKrsIds.add(parsed.krsId);

      return {
        krsId: parsed.krsId,
        tagihanId: row.id,
        periode: parsed.periode,
        tagihanNama: tagihanItem.nama,
      };
    })
    .filter(Boolean);
});

const fetchSemesterPendekKrsDetail = async (krsId) => {
  const key = String(krsId);

  if (semesterPendekKrsDetails.value[key] || semesterPendekKrsLoading.value[key]) {
    return;
  }

  semesterPendekKrsLoading.value = {
    ...semesterPendekKrsLoading.value,
    [key]: true,
  };
  semesterPendekKrsErrors.value = {
    ...semesterPendekKrsErrors.value,
    [key]: null,
  };

  try {
    const res = await $api(`/admin/pemasukan/mahasiswa/semester-pendek/krs-detail/${krsId}`, {
      method: "GET",
    });

    if (res?.status === false) {
      throw new Error(res.message || "Gagal memuat detail KRS Semester Pendek.");
    }

    semesterPendekKrsDetails.value = {
      ...semesterPendekKrsDetails.value,
      [key]: res?.data ?? res,
    };
  } catch (error) {
    semesterPendekKrsErrors.value = {
      ...semesterPendekKrsErrors.value,
      [key]: error?.data?.message || error?.message || "Gagal memuat detail KRS Semester Pendek.",
    };
  } finally {
    semesterPendekKrsLoading.value = {
      ...semesterPendekKrsLoading.value,
      [key]: false,
    };
  }
};

watch(
  semesterPendekKrsRows,
  (items) => {
    const allowedKrsIds = new Set(items.map((item) => String(item.krsId)));
    const activeKeys = Object.fromEntries(
      Object.entries(semesterPendekKeringananKeys.value).filter(([krsId]) =>
        allowedKrsIds.has(krsId)
      )
    );
    if (Object.keys(activeKeys).length !== Object.keys(semesterPendekKeringananKeys.value).length) {
      semesterPendekKeringananKeys.value = activeKeys;
    }

    items.forEach((item) => fetchSemesterPendekKrsDetail(item.krsId));
  },
  { deep: true }
);

const getSemesterPendekDetails = (krsData) => {
  const details = krsData?.details ?? krsData?.krs_detail ?? krsData?.detail ?? [];
  return Array.isArray(details) ? details : [];
};

const getMataKuliah = (detail) =>
  detail?.mata_kuliah ?? detail?.matakuliah ?? detail?.mk ?? {};

const getMkNama = (detail) => {
  const mataKuliah = getMataKuliah(detail);

  return mataKuliah?.nama
    ?? detail?.nama_mk
    ?? detail?.nama_matakuliah
    ?? detail?.nama
    ?? "-";
};

const getMkSks = (detail) => {
  const mataKuliah = getMataKuliah(detail);

  return mataKuliah?.sks
    ?? detail?.sks
    ?? "-";
};

const getMkSemester = (detail) => {
  const mataKuliah = getMataKuliah(detail);

  return mataKuliah?.smt
    ?? mataKuliah?.semester
    ?? detail?.smt
    ?? detail?.semester
    ?? "-";
};

const getBiayaPerMk = (krsData) => {
  const value = krsData?.biaya_per_mk
    ?? krsData?.periode_semester_pendek?.biaya_per_mk
    ?? krsData?.search_krs?.biaya_per_mk
    ?? krsData?.search_krs?.periode_semester_pendek?.biaya_per_mk
    ?? 0;

  const biaya = Number(value);
  return Number.isFinite(biaya) ? biaya : 0;
};

const getSemesterPendekKeringananKey = (detail, idx) =>
  String(detail?.id ?? detail?.krs_detail_id ?? detail?.matakuliah_id ?? detail?.mata_kuliah_id ?? `${getMkNama(detail)}-${idx}`);

const getSemesterPendekKeringananKeys = (krsId) =>
  semesterPendekKeringananKeys.value[String(krsId)] ?? [];

const isSemesterPendekKeringananSelected = (card, detail, idx) =>
  getSemesterPendekKeringananKeys(card.krsId).includes(getSemesterPendekKeringananKey(detail, idx));

function applySemesterPendekKeringanan(card) {
  const rowIndex = rows.value.findIndex((row) => String(row.id) === String(card.tagihanId));
  if (rowIndex < 0) return;

  const row = rows.value[rowIndex];
  const selectedCount = getSemesterPendekKeringananKeys(card.krsId).length;
  const biayaPerMk = getBiayaPerMk(card.krsData);

  if (selectedCount <= 0) {
    if (isSamahahRow(row)) {
      row.keringanan_jenis = "";
      row.keringanan_jumlah = 0;
      row.keringanan_batas = null;
      if (paymentMode.value === "tagihan") {
        row.deposit = 0;
        row.dibayar = Number(row.nominal) || 0;
      }
    }
    syncPaymentTotalsState();
    return;
  }

  row.keringanan_jenis = "samahah";
  row.keringanan_jumlah = selectedCount * biayaPerMk;
  if (!row.keringanan_batas) {
    row.keringanan_batas = DEFAULT_KERINGANAN_BATAS;
  }
  recalcKeringanan(rowIndex);
}

function toggleSemesterPendekKeringanan(card, detail, idx) {
  if (!card.biayaPerMk) {
    showSnackbar({ text: "Biaya per MK Semester Pendek tidak tersedia", color: "warning" });
    return;
  }

  const key = getSemesterPendekKeringananKey(detail, idx);
  const currentKeys = getSemesterPendekKeringananKeys(card.krsId);
  const nextKeys = currentKeys.includes(key)
    ? currentKeys.filter((item) => item !== key)
    : [...currentKeys, key];

  semesterPendekKeringananKeys.value = {
    ...semesterPendekKeringananKeys.value,
    [String(card.krsId)]: nextKeys,
  };

  applySemesterPendekKeringanan(card);
}

const semesterPendekKrsCards = computed(() =>
  semesterPendekKrsRows.value.map((item) => {
    const key = String(item.krsId);
    const krsData = semesterPendekKrsDetails.value[key] ?? null;
    const details = getSemesterPendekDetails(krsData);
    const biayaPerMk = getBiayaPerMk(krsData);
    const keringananCount = getSemesterPendekKeringananKeys(item.krsId).length;

    return {
      ...item,
      krsData,
      details,
      biayaPerMk,
      keringananCount,
      keringananTotal: keringananCount * biayaPerMk,
      loading: Boolean(semesterPendekKrsLoading.value[key]),
      error: semesterPendekKrsErrors.value[key],
      totalSks: details.reduce((sum, detail) => {
        const sks = Number(getMkSks(detail));
        return sum + (Number.isFinite(sks) ? sks : 0);
      }, 0),
    };
  })
);

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

    rows.value.push(createPaymentRow(item, fromCash, fromDepo));

    depoRemaining -= fromDepo;
    cashRemaining -= fromCash;
  }

  syncPaymentTotalsState();

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
  syncPaymentTotalsState();
});

watch(scopedTagihan, (newArr) => {
  const allowedIds = new Set(newArr.map((item) => item.id));
  selectedTagihan.value = selectedTagihan.value.filter((item) =>
    allowedIds.has(item.id)
  );
  rows.value = rows.value.filter((row) => allowedIds.has(row.id));
  syncPaymentTotalsState();
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
        rows.value.push(createPaymentRow(item, item.sisa ?? 0));
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
      syncPaymentTotalsState();
    }
  },
  { deep: true }
);

/** Hapus baris (sekalian sync ke combobox) */
function removeRow(id) {
  rows.value = rows.value.filter((r) => r.id !== id);
  selectedTagihan.value = selectedTagihan.value.filter((s) => s.id !== id);
  syncPaymentTotalsState();
}

/** Recalc per-baris */
/** Recalc saat admin ubah field DIBAYAR */
function recalcDibayar(idx) {
  const r = rows.value[idx];
  if (isDhominRow(r)) {
    syncDhominKeringanan(r);
    syncPaymentTotalsState();
    return;
  }

  const keringanan = isSamahahRow(r) ? Number(r.keringanan_jumlah || 0) : 0;
  r.dibayar = Math.max(0, Number(r.dibayar || 0));
  r.dibayar = Math.min(r.dibayar, Math.max(0, r.nominal - keringanan));

  // Limit deposit agar dibayar + deposit + keringanan tidak melebihi nominal
  const sisaNominal = Math.max(0, r.nominal - r.dibayar - keringanan);
  r.deposit = Math.min(r.deposit, sisaNominal);

  syncPaymentTotalsState();
}

/** Recalc saat admin ubah field DEPOSIT */
function recalcDeposit(idx) {
  const r = rows.value[idx];
  if (isDhominRow(r)) {
    syncDhominKeringanan(r);
    syncPaymentTotalsState();
    return;
  }

  const keringanan = isSamahahRow(r) ? Number(r.keringanan_jumlah || 0) : 0;
  r.deposit = Math.max(0, Number(r.deposit || 0));

  // Limit deposit: tidak melebihi saldo catatan deposit dikurangi deposit baris lain
  const saldoDeposit = Number(props.mahasiswa?.deposit || 0);
  const totalDepositLain = rows.value.reduce((sum, row, i) => {
    return i === idx ? sum : sum + (Number(row.deposit) || 0);
  }, 0);

  const sisaPlafon = Math.max(0, saldoDeposit - totalDepositLain);
  r.deposit = Math.min(r.deposit, sisaPlafon);
  r.deposit = Math.min(r.deposit, Math.max(0, r.nominal - keringanan));

  // Dibayar = sisa nominal setelah deposit dan keringanan
  r.dibayar = Math.max(0, r.nominal - r.deposit - keringanan);

  syncPaymentTotalsState();
}

function recalcKeringanan(idx) {
  const r = rows.value[idx];
  if (!r) return;

  if (isDhominRow(r)) {
    syncDhominKeringanan(r);
    syncPaymentTotalsState();
    return;
  }

  if (!isSamahahRow(r)) {
    r.keringanan_jumlah = 0;
    r.keringanan_batas = null;
    syncPaymentTotalsState();
    return;
  }

  r.keringanan_jumlah = Math.max(0, Number(r.keringanan_jumlah || 0));
  r.keringanan_jumlah = Math.min(r.keringanan_jumlah, Number(r.nominal) || 0);
  if (!r.keringanan_batas) {
    r.keringanan_batas = DEFAULT_KERINGANAN_BATAS;
  }
  r.deposit = Math.min(Number(r.deposit) || 0, Math.max(0, r.nominal - r.keringanan_jumlah));
  r.dibayar = Math.max(0, r.nominal - r.deposit - r.keringanan_jumlah);

  syncPaymentTotalsState();
}

function onKeringananChange(idx) {
  const r = rows.value[idx];
  if (!r) return;

  r.keringanan_jenis = normalizeKeringananJenis(r.keringanan_jenis);

  if (isDhominRow(r)) {
    r.dibayar = 0;
    r.deposit = 0;
    syncDhominKeringanan(r);
  } else if (isSamahahRow(r)) {
    if (!r.keringanan_batas) {
      r.keringanan_batas = DEFAULT_KERINGANAN_BATAS;
    }
    recalcKeringanan(idx);
  } else {
    r.keringanan_jumlah = 0;
    r.keringanan_batas = null;
    if (paymentMode.value === "tagihan") {
      r.deposit = 0;
      r.dibayar = Number(r.nominal) || 0;
    }
  }

  syncPaymentTotalsState();
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
                    <td class="text-end font-weight-medium">
                      <div>{{ formatRupiah(t.sisa) }}</div>
                      <div
                        v-if="hasDispensasiTagihan(t)"
                        class="text-caption text-success"
                      >
                        Dispensasi: {{ formatRupiah(t.jumlah_dispensasi) }}
                      </div>
                      <div
                        v-if="hasDispensasiTagihan(t)"
                        class="text-caption text-medium-emphasis"
                      >
                        Batas: {{ formatBatasDispensasi(t.batas_dispensasi) }}
                      </div>
                    </td>
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
        *Tagihan Skripsi belum memenuhi syarat, tetapi tetap bisa dipilih oleh petugas.
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

        <VCol cols="12" :md="paymentMode === 'tagihan' ? 4 : 4">
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
            :item-props="getTagihanItemProps"
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

      <div v-for="(row, idx) in rows" :key="row.id" class="py-3">
        <div class="text-body-1 font-weight-medium mb-3">
          {{ idx + 1 }}. {{ row.display }}
        </div>

        <VRow class="align-center">
          <VCol cols="12" md="2">
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
              :readonly="paymentMode === 'nominal' || isDhominRow(row)"
              @update:modelValue="recalcDeposit(idx)"
            />
          </VCol>

          <VCol
            cols="12"
            :md="paymentMode === 'tagihan' ? 7 : row.deposit > 0 ? 8 : 10"
          >
            <VRow dense>
              <VCol cols="12" :md="isSamahahRow(row) ? 4 : isDhominRow(row) ? 6 : 12">
                <VSelect
                  v-model="row.keringanan_jenis"
                  :items="keringananOptions"
                  item-title="title"
                  item-value="value"
                  label="Keringanan"
                  variant="outlined"
                  density="comfortable"
                  hint="Dhomin/Samahah"
                  persistent-hint
                  @update:modelValue="onKeringananChange(idx)"
                />
              </VCol>

              <VCol v-if="isSamahahRow(row) || isDhominRow(row)" cols="12" :md="isSamahahRow(row) ? 4 : 6">
                <VTextField
                  v-model.number="row.keringanan_jumlah"
                  label="Jumlah Keringanan"
                  type="number"
                  min="0"
                  variant="outlined"
                  density="comfortable"
                  :hint="formatRupiah(row.keringanan_jumlah)"
                  persistent-hint
                  :readonly="isDhominRow(row)"
                  @update:modelValue="recalcKeringanan(idx)"
                />
              </VCol>

              <VCol v-if="isSamahahRow(row)" cols="12" md="4">
                <VTextField
                  v-model="row.keringanan_batas"
                  label="Batas Keringanan"
                  type="date"
                  variant="outlined"
                  density="comfortable"
                />
              </VCol>
            </VRow>
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

        <VDivider v-if="idx < rows.length - 1" class="mt-1" />
      </div>

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

      <div v-if="semesterPendekKrsCards.length" class="mt-4">
        <div
          v-for="card in semesterPendekKrsCards"
          :key="card.krsId"
          class="border rounded pa-4 mb-4"
        >
          <div class="d-flex flex-wrap align-center justify-space-between gap-3 mb-3">
            <div>
              <div class="text-subtitle-1 font-weight-medium">
                Detail KRS Semester Pendek
              </div>
              <div class="text-body-2 text-medium-emphasis">
                {{ card.periode || card.tagihanNama }}
              </div>
            </div>
            <div class="d-flex flex-wrap align-center gap-2">
              <VChip color="primary" variant="tonal" size="small">
                {{ card.totalSks }} SKS
              </VChip>
              <VChip color="success" variant="tonal" size="small">
                Biaya/MK {{ formatRupiah(card.biayaPerMk) }}
              </VChip>
              <VChip
                v-if="card.keringananCount > 0"
                color="warning"
                variant="tonal"
                size="small"
              >
                Keringanan {{ card.keringananCount }} MK = {{ formatRupiah(card.keringananTotal) }}
              </VChip>
            </div>
          </div>

          <div v-if="card.loading" class="d-flex align-center justify-center py-6">
            <VProgressCircular indeterminate color="primary" size="28" class="me-3" />
            <span class="text-medium-emphasis">Memuat detail KRS...</span>
          </div>

          <VAlert
            v-else-if="card.error"
            type="warning"
            variant="tonal"
            density="compact"
          >
            {{ card.error }}
          </VAlert>

          <VTable v-else-if="card.details.length" density="compact" class="border rounded">
            <thead>
              <tr>
                <th class="text-left">No</th>
                <th class="text-left">Nama MK</th>
                <th class="text-center">SKS</th>
                <th class="text-center">SMT MK</th>
                <th class="text-center">Keringanan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(detail, idx) in card.details" :key="detail.id ?? idx">
                <td>{{ idx + 1 }}</td>
                <td>{{ getMkNama(detail) }}</td>
                <td class="text-center">{{ getMkSks(detail) }}</td>
                <td class="text-center">{{ getMkSemester(detail) }}</td>
                <td class="text-center">
                  <VBtn
                    size="small"
                    :color="isSemesterPendekKeringananSelected(card, detail, idx) ? 'error' : 'primary'"
                    :variant="isSemesterPendekKeringananSelected(card, detail, idx) ? 'tonal' : 'outlined'"
                    :disabled="!card.biayaPerMk"
                    @click="toggleSemesterPendekKeringanan(card, detail, idx)"
                  >
                    {{ isSemesterPendekKeringananSelected(card, detail, idx) ? "Batalkan" : "Beri Keringanan" }}
                  </VBtn>
                </td>
              </tr>
            </tbody>
          </VTable>

          <div v-else class="text-medium-emphasis text-center py-6">
            Detail KRS Semester Pendek tidak tersedia.
          </div>
        </div>
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
