import dashboard from "./dashboard";
import mahasiswa from "./mahasiswa";
import pemasukan from "./pemasukan";
import pengeluaran from "./pengeluaran";
import pegawai from "./pegawai";
import saldo from "./saldo";
import setting from "./setting";
import dashboardStaff from "./staff/dashboardStaff";
import pemasukanStaff from "./staff/pemasukanStaff";
import user from "./user";
import pemasukanRumahTangga from "./rumahtangga/pemasukanRumahTangga";
import pengeluaranRumahTangga from "./rumahtangga/pengeluaranRumahTangga";
import {
  pengeluaranDosenBulanan,
  pengeluaranDosenKegiatan,
  pengeluaranStaffBulanan,
  pengeluaranDosenTatapmuka,
} from "./barokahdosen/pengeluaranBarokahDosen";
import laporan from "./laporan";

const userData = useCookie("userData").value ?? {};
const role = String(userData.role?.name || "").toLowerCase();

const routesByRole = {
  admin: [
    ...dashboard,
    ...mahasiswa,
    ...pegawai,
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

  barokahdosen_tatapmuka: [...dashboard, ...mahasiswa, ...pengeluaranDosenTatapmuka, ...setting],
  barokahdosen_kegiatan: [...dashboard, ...mahasiswa, ...pengeluaranDosenKegiatan, ...pengeluaranStaffBulanan, ...setting],
  barokahdosen_bulanan: [...dashboard, ...mahasiswa, ...pengeluaranDosenBulanan, ...setting],
};

export default routesByRole[role] ?? [];
