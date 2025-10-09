
/** Formatter Rupiah sederhana */
function formatRupiah(num) {
  const n = Number(num) || 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export { formatRupiah };