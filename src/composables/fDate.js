function fDate(date) {
  const tanggalLengkap = new Date(date);

  const tahun = tanggalLengkap.getFullYear();
  const bulan = String(tanggalLengkap.getMonth() + 1).padStart(2, "0");
  const tanggal = String(tanggalLengkap.getDate()).padStart(2, "0");

  const tanggalJakarta = `${tahun}-${bulan}-${tanggal}`;
  return tanggalJakarta;
}

export { fDate };