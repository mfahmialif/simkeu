import dashboard from "./dashboard";
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

const userData = useCookie("userData").value ?? {};
const role = userData.role?.name;

const routesByRole = {
  admin: [
    ...dashboard,
    ...saldo,
    ...pemasukan,
    ...pengeluaranHeading,
    ...pengeluaran,
    ...pengeluaranDosen,
    ...user,
    ...setting,
  ],

  pimpinan: [
    ...dashboard,
    ...saldo,
    ...pemasukan,
    ...pengeluaranHeading,
    ...pengeluaran,
    ...pengeluaranDosen,
    ...user,
    ...setting,
  ],

  keuangan: [
    ...dashboard,
    ...saldo,
    ...pemasukan,
    ...pengeluaranHeading,
    ...pengeluaran,
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

  barokahdosen: [
    ...dashboard,
    ...pengeluaranHeading,
    ...pengeluaranDosen,
    ...setting,
  ],
};

export default routesByRole[role] ?? [];
