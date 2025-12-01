import dashboard from "./dashboard";
import pemasukan from "./pemasukan";
import pengeluaran from "./pengeluaran";
import pemasukanRumahTangga from "./rumahtangga/pemasukanRumahTangga";
import pengeluaranRumahTangga from "./rumahtangga/pengeluaranRumahTangga";
import saldo from "./saldo";
import setting from "./setting";
import dashboardStaff from "./staff/dashboardStaff";
import pemasukanStaff from "./staff/pemasukanStaff";
import uiElements from "./ui-elements";
import user from "./user";

const userData = useCookie("userData").value ?? {};
const role = userData.role?.name;

let routes = [];
if (role) {
  if (role == "admin") {
    routes = [
      ...dashboard,
      ...saldo,
      ...pemasukan,
      ...pengeluaran,
      ...user,
      ...setting,
    ];
  }

  if (role == "staff") {
    routes = [...dashboardStaff, ...pemasukanStaff, ...setting];
  }

  if (role == "pimpinan") {
    routes = [
      ...dashboard,
      ...saldo,
      ...pemasukan,
      ...pengeluaran,
      ...user,
      ...setting,
    ];
  }

  if (role == "keuangan") {
    routes = [
      ...dashboard,
      ...saldo,
      ...pemasukan,
      ...pengeluaran,
      ...user,
      ...setting,
    ];
  }

  if (role == "kabag") {
    routes = [...dashboardStaff, ...pemasukanStaff, ...setting];
  }

  if (role == "rumahtangga") {
    routes = [
      ...dashboard,
      ...pemasukanRumahTangga,
      ...pengeluaranRumahTangga,
      ...setting,
    ];
  }
}

export default routes;
