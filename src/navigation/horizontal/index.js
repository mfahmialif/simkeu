import { computed } from "vue";
import dashboard from "./dashboard";
import mahasiswa from "./mahasiswa";
import pemasukan from "./pemasukan";
import pengeluaran from "./pengeluaran";
import pegawai from "./pegawai";
import saldo from "./saldo";
import { settingItemsForRole } from "./setting";
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
import rab from "./rab";

const userData = useCookie("userData");

const currentRole = computed(() =>
  String(userData.value?.role?.name || "").toLowerCase(),
);

const routesByRole = roleName => {
  const setting = settingItemsForRole(roleName);

  return {
    admin: [
      ...dashboard,
      ...saldo,
      ...pemasukan,
      ...pengeluaran,
      ...pegawai,
      ...rab,
      ...laporan,
      ...user,
      ...setting,
    ],

    pimpinan: [
      ...dashboard,
      ...saldo,
      ...pemasukan,
      ...pengeluaran,
      ...rab,
      ...laporan,
      ...user,
      ...setting,
    ],

    keuangan: [
      ...dashboard,
      ...saldo,
      ...pemasukan,
      ...pengeluaran,
      ...rab,
      ...laporan,
      ...user,
      ...setting,
    ],

    staff: [...dashboardStaff, ...pemasukanStaff, ...setting],
    kabag: [...dashboardStaff, ...pemasukanStaff, ...rab, ...setting],

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
};

export default computed(() => routesByRole(currentRole.value)[currentRole.value] ?? []);
