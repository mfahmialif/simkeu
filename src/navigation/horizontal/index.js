import dashboard from "./dashboard";
import mahasiswa from "./mahasiswa";
import pemasukan from "./pemasukan";
import pengeluaran from "./pengeluaran";
import saldo from "./saldo";
import setting from "./setting";
import dashboardStaff from "./staff/dashboardStaff";
import pemasukanStaff from "./staff/pemasukanStaff";
import user from "./user";
import pemasukanRumahTangga from "./rumahtangga/pemasukanRumahTangga";
import pengeluaranRumahTangga from "./rumahtangga/pengeluaranRumahTangga";
import pengeluaranBarokahDosen from "./barokahdosen/pengeluaranBarokahDosen";
import laporan from "./laporan";

const userData = useCookie("userData").value ?? {};
const role = userData.role?.name;

const routesByRole = {
  admin: [
    ...dashboard,
    ...mahasiswa,
    ...saldo,
    ...pemasukan,
    ...pengeluaran,
    ...laporan,
    ...user,
    ...setting,
  ],

  pimpinan: [
    ...dashboard,
    ...mahasiswa,
    ...saldo,
    ...pemasukan,
    ...pengeluaran,
    ...laporan,
    ...user,
    ...setting,
  ],

  keuangan: [
    ...dashboard,
    ...mahasiswa,
    ...saldo,
    ...pemasukan,
    ...pengeluaran,
    ...laporan,
    ...user,
    ...setting,
  ],

  staff: [...dashboardStaff, ...mahasiswa, ...pemasukanStaff, ...setting],
  kabag: [...dashboardStaff, ...mahasiswa, ...pemasukanStaff, ...setting],

  rumahtangga: [
    ...dashboard,
    ...mahasiswa,
    ...pemasukanRumahTangga,
    ...pengeluaranRumahTangga,
    ...setting,
  ],

  barokahdosen: [...dashboard, ...mahasiswa, ...pengeluaranBarokahDosen, ...setting],
};

export default routesByRole[role] ?? [];
