import { computed } from "vue"
import dashboard from "./dashboard"
import mahasiswa from "./mahasiswa"
import pemasukan from "./pemasukan"
import pengeluaran from "./pengeluaran"
import pengeluaranDosen, {
  pengeluaranDosenBulanan,
  pengeluaranDosenKegiatan,
  pengeluaranDosenTatapmuka,
} from "./pengeluaran-dosen"
import pengeluaranHeading from "./pengeluaran-heading"
import pemasukanRumahTangga from "./rumahtangga/pemasukanRumahTangga"
import pegawai from "./pegawai"
import { settingItemsForRole } from "./setting"
import settingHeading from "./setting-heading"
import dashboardStaff from "./staff/dashboardStaff"
import pemasukanStaff from "./staff/pemasukanStaff"
import user from "./user"
import laporan from "./laporan"
import rab from "./rab"
import hutang from "./hutang"
import rumahTangga from "./rumah-tangga"
import saranaPrasarana from "./sarana-prasarana"
import transportasi from "./transportasi"

const userData = useCookie("userData")

const currentRole = computed(() =>
  String(userData.value?.role?.name || "").toLowerCase(),
)

const routesByRole = roleName => {
  const setting = settingItemsForRole(roleName)

  return {
    admin: [
      ...dashboard,
      ...pemasukan,
      ...pengeluaranHeading,
      ...pegawai,
      ...hutang,
      ...pengeluaran,
      ...pengeluaranDosen,
      ...rumahTangga,
      ...saranaPrasarana,
      ...transportasi,
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
      ...hutang,
      ...pengeluaranDosen,
      ...rumahTangga,
      ...saranaPrasarana,
      ...transportasi,
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
      ...hutang,
      ...rab,
      ...laporan,
      ...user,
      ...setting,
    ],

    staff: [...dashboardStaff, ...pemasukanStaff, ...hutang, ...laporan, ...setting],
    kabag: [...dashboardStaff, ...pemasukanStaff, ...hutang, ...rab, ...laporan, ...setting],

    rumahtangga: [
      ...dashboard,
      ...mahasiswa,
      ...pemasukanRumahTangga,
      ...hutang,
      ...rumahTangga,
      ...setting,
    ],

    sarpras: [
      ...dashboard,
      ...hutang,
      ...saranaPrasarana,
      ...setting,
    ],

    transportasi: [
      ...dashboard,
      ...hutang,
      ...transportasi,
      ...setting,
    ],

    barokahdosen_tatapmuka: [
      ...dashboard,
      ...mahasiswa,
      ...pengeluaranHeading,
      ...pengeluaranDosenTatapmuka,
      ...hutang,
      ...rab,
      ...settingHeading,
      ...setting,
    ],

    barokahdosen_kegiatan: [
      ...dashboard,
      ...mahasiswa,
      ...pengeluaranHeading,
      ...pengeluaranDosenKegiatan,
      ...hutang,
      ...rab,
      ...settingHeading,
      ...setting,
    ],

    barokahdosen_bulanan: [
      ...dashboard,
      ...mahasiswa,
      ...pengeluaranHeading,
      ...pengeluaranDosenBulanan,
      ...hutang,
      ...rab,
      ...settingHeading,
      ...setting,
    ],
  }
}

export default computed(() => routesByRole(currentRole.value)[currentRole.value] ?? [])
