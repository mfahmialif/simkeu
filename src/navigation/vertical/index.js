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
import { settingItemsForRole } from "./setting";
import settingHeading from "./setting-heading";
import dashboardStaff from "./staff/dashboardStaff";
import pemasukanStaff from "./staff/pemasukanStaff";
import user from "./user";
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
      ...pemasukan,
      ...pengeluaranHeading,
      ...pegawai,
      ...pengeluaran,
      ...pengeluaranDosen,
      ...rab,
      ...laporan,
      ...user,
      ...setting,
    ],

    pimpinan: [
      ...dashboard,
      ...pemasukan,
      ...pengeluaranHeading,
      ...pengeluaran,
      ...pengeluaranDosen,
      ...rab,
      ...laporan,
      ...user,
      ...setting,
    ],

    keuangan: [
      ...dashboard,
      ...pemasukan,
      ...pengeluaranHeading,
      ...pengeluaran,
      ...rab,
      ...laporan,
      ...user,
      ...setting,
    ],

    staff: [...dashboardStaff, ...pemasukanStaff, ...laporan, ...setting],
    kabag: [...dashboardStaff, ...pemasukanStaff, ...rab, ...laporan, ...setting],

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
      ...rab,
      ...settingHeading,
      ...setting,
    ],

    barokahdosen_kegiatan: [
      ...dashboard,
      ...mahasiswa,
      ...pengeluaranHeading,
      ...pengeluaranDosenKegiatan,
      ...pengeluaranStaffBulanan,
      ...rab,
      ...settingHeading,
      ...setting,
    ],

    barokahdosen_bulanan: [
      ...dashboard,
      ...mahasiswa,
      ...pengeluaranHeading,
      ...pengeluaranDosenBulanan,
      ...rab,
      ...settingHeading,
      ...setting,
    ],
  };
};

export default computed(() => routesByRole(currentRole.value)[currentRole.value] ?? []);
