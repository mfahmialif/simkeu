import { computed } from "vue";
import dashboard from "./dashboard";
import mahasiswa from "./mahasiswa";
import pemasukan from "./pemasukan";
import pengeluaran from "./pengeluaran";
import pengeluaranDosen, {
  pengeluaranDosenBulanan,
  pengeluaranDosenKegiatan,
  pengeluaranStaffBulanan,
  pengeluaranDosenTatapmuka,
} from "./pengeluaran-dosen";
import pengeluaranHeading from "./pengeluaran-heading";
import pemasukanRumahTangga from "./rumahtangga/pemasukanRumahTangga";
import pengeluaranRumahTangga from "./rumahtangga/pengeluaranRumahTangga";
import pegawai from "./pegawai";
import saldo from "./saldo";
import { settingItemsForRole } from "./setting";
import settingHeading from "./setting-heading";
import dashboardStaff from "./staff/dashboardStaff";
import pemasukanStaff from "./staff/pemasukanStaff";
import user from "./user";
import laporan from "./laporan";

const userData = useCookie("userData");

const currentRole = computed(() =>
  String(userData.value?.role?.name || "").toLowerCase(),
);

const routesByRole = roleName => {
  const setting = settingItemsForRole(roleName);

  return {
    admin: [
      ...dashboard,
      ...mahasiswa,
      ...pegawai,
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

    barokahdosen_tatapmuka: [
      ...dashboard,
      ...mahasiswa,
      ...pengeluaranHeading,
      ...pengeluaranDosenTatapmuka,
      ...settingHeading,
      ...setting,
    ],

    barokahdosen_kegiatan: [
      ...dashboard,
      ...mahasiswa,
      ...pengeluaranHeading,
      ...pengeluaranDosenKegiatan,
      ...pengeluaranStaffBulanan,
      ...settingHeading,
      ...setting,
    ],

    barokahdosen_bulanan: [
      ...dashboard,
      ...mahasiswa,
      ...pengeluaranHeading,
      ...pengeluaranDosenBulanan,
      ...settingHeading,
      ...setting,
    ],
  };
};

export default computed(() => routesByRole(currentRole.value)[currentRole.value] ?? []);
