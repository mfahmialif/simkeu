import dashboard from "./dashboard";
import mahasiswa from "./mahasiswa";
import pemasukan from "./pemasukan";
import pengeluaran from "./pengeluaran";
import pengeluaranDosen from "./pengeluaran-dosen";
import pengeluaranHeading from "./pengeluaran-heading";
import pemasukanRumahTangga from "./rumahtangga/pemasukanRumahTangga";
import pengeluaranRumahTangga from "./rumahtangga/pengeluaranRumahTangga";
import saldo from "./saldo";
import setting from "./setting";
import dashboardStaff from "./staff/dashboardStaff";
import pemasukanStaff from "./staff/pemasukanStaff";
import user from "./user";
import laporan from "./laporan";

const userData = useCookie("userData").value ?? {};
const role = userData.role?.name;

const routesByRole = {
  admin: [
    ...dashboard,
    ...mahasiswa,
    ...saldo,
    ...pemasukan,
    ...pengeluaranHeading,
    ...pengeluaran,
    ...pengeluaranDosen,
    ...laporan,
    ...user,
    ...setting,
  ],

  pimpinan: [
    ...dashboard,
    ...mahasiswa,
    ...saldo,
    ...pemasukan,
    ...pengeluaranHeading,
    ...pengeluaran,
    ...pengeluaranDosen,
    ...laporan,
    ...user,
    ...setting,
  ],

  keuangan: [
    ...dashboard,
    ...mahasiswa,
    ...saldo,
    ...pemasukan,
    ...pengeluaranHeading,
    ...pengeluaran,
    ...laporan,
    ...user,
    ...setting,
  ],

  staff: [...dashboardStaff, ...mahasiswa, ...pemasukanStaff, ...laporan, ...setting],
  kabag: [...dashboardStaff, ...mahasiswa, ...pemasukanStaff, ...laporan, ...setting],

  rumahtangga: [
    ...dashboard,
    ...mahasiswa,
    ...pemasukanRumahTangga,
    ...pengeluaranRumahTangga,
    ...setting,
  ],

  barokahdosen: [
    ...dashboard,
    ...mahasiswa,
    ...pengeluaranHeading,
    ...pengeluaranDosen,
    ...setting,
  ],
};

export default routesByRole[role] ?? [];
