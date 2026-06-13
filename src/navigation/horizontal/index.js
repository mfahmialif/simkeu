import { computed } from "vue"
import dashboard from "./dashboard"
import mahasiswa from "./mahasiswa"
import pemasukan from "./pemasukan"
import pengeluaran from "./pengeluaran"
import pegawai from "./pegawai"
import { settingItemsForRole } from "./setting"
import dashboardStaff from "./staff/dashboardStaff"
import pemasukanStaff from "./staff/pemasukanStaff"
import user from "./user"
import pemasukanRumahTangga from "./rumahtangga/pemasukanRumahTangga"
import hutang from "./hutang"
import {
  pengeluaranDosenBulanan,
  pengeluaranDosenKegiatan,
  pengeluaranDosenTatapmuka,
} from "./barokahdosen/pengeluaranBarokahDosen"
import laporan from "./laporan"
import rab from "./rab"
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
      ...pengeluaran,
      ...rumahTangga,
      ...saranaPrasarana,
      ...transportasi,
      ...pegawai,
      ...hutang,
      ...rab,
      ...laporan,
      ...user,
      ...setting,
    ],

    pimpinan: [
      ...dashboard,
      ...pemasukan,
      ...pengeluaran,
      ...rumahTangga,
      ...saranaPrasarana,
      ...transportasi,
      ...hutang,
      ...rab,
      ...laporan,
      ...user,
      ...setting,
    ],

    keuangan: [
      ...dashboard,
      ...pemasukan,
      ...pengeluaran,
      ...hutang,
      ...rab,
      ...laporan,
      ...user,
      ...setting,
    ],

    staff: [...dashboardStaff, ...pemasukanStaff, ...hutang, ...setting],
    kabag: [...dashboardStaff, ...pemasukanStaff, ...hutang, ...rab, ...setting],

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

    barokahdosen_tatapmuka: [...dashboard, ...mahasiswa, ...pengeluaranDosenTatapmuka, ...hutang, ...rab, ...setting],
    barokahdosen_kegiatan: [...dashboard, ...mahasiswa, ...pengeluaranDosenKegiatan, ...hutang, ...rab, ...setting],
    barokahdosen_bulanan: [...dashboard, ...mahasiswa, ...pengeluaranDosenBulanan, ...hutang, ...rab, ...setting],
  }
}

export default computed(() => routesByRole(currentRole.value)[currentRole.value] ?? [])
