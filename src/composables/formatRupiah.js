
/** Formatter Rupiah sederhana */
function formatRupiah(num) {
  const n = Number(num) || 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatMoney(num, mataUang = {}) {
  const n = Number(num) || 0;
  const kode = String(mataUang?.kode || mataUang?.mata_uang_kode || "IDR").toUpperCase();
  const simbol = String(mataUang?.simbol || mataUang?.mata_uang_simbol || (kode === "IDR" ? "Rp" : kode));

  if (kode === "IDR") {
    return formatRupiah(n);
  }

  return `${simbol} ${n.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;
}

function formatCurrencyTotals(groups = [], fallbackValue = null) {
  if (Array.isArray(groups) && groups.length) {
    return [...groups]
      .sort((left, right) => {
        const leftCode = String(left?.mata_uang?.kode || "IDR").toUpperCase();
        const rightCode = String(right?.mata_uang?.kode || "IDR").toUpperCase();

        if (leftCode === rightCode) return 0;
        if (leftCode === "IDR") return -1;
        if (rightCode === "IDR") return 1;

        return leftCode.localeCompare(rightCode);
      })
      .map(group => formatMoney(group?.total, group?.mata_uang))
      .join(" / ");
  }

  if (fallbackValue !== null && Number(fallbackValue) !== 0) {
    return formatRupiah(fallbackValue);
  }

  return "-";
}

export { formatRupiah, formatMoney, formatCurrencyTotals };
