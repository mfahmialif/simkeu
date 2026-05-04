import dashboard from "./dashboard";
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
    ...saldo,
    ...pemasukan,
    ...pengeluaran,
    ...laporan,
    ...user,
    ...setting,
  ],

  pimpinan: [
    ...dashboard,
    ...saldo,
    ...pemasukan,
    ...pengeluaran,
    ...laporan,
    ...user,
    ...setting,
  ],

  keuangan: [
    ...dashboard,
    ...saldo,
    ...pemasukan,
    ...pengeluaran,
    ...laporan,
    ...user,
    ...setting,
  ],

  staff: [...dashboardStaff, ...pemasukanStaff, ...setting],
  kabag: [...dashboardStaff, ...pemasukanStaff, ...setting],

  rumahtangga: [
    ...dashboard,
    ...pemasukanRumahTangga,
    ...pengeluaranRumahTangga,
    ...setting,
  ],

  barokahdosen: [...dashboard, ...pengeluaranBarokahDosen, ...setting],
};

export default routesByRole[role] ?? [];
