import { computed } from "vue"
import dashboard from "./dashboard"
import pemasukan from "./pemasukan"
import pengeluaran from "./pengeluaran"
import pengeluaranDosen, {
  pengeluaranDosenBulanan,
  pengeluaranDosenKegiatan,
  pengeluaranDosenTatapmuka,
} from "./pengeluaran-dosen"
import pegawai from "./pegawai"
import { settingItemsForRole } from "./setting"
import dashboardStaff from "./staff/dashboardStaff"
import pemasukanStaff from "./staff/pemasukanStaff"
import user from "./user"
import laporan, { laporanPengeluaran } from "./laporan"
import rab from "./rab"
import hutang from "./hutang"
import rumahTangga from "./rumah-tangga"
import saranaPrasarana from "./sarana-prasarana"
import transportasi from "./transportasi"

const kelolaHeading = [{ heading: "Kelola" }]
const pemasukanHeading = [{ heading: "Pemasukan" }]
const laporanHeading = [{ heading: "Laporan" }]
const pengeluaranHeading = [{ heading: "Pengeluaran" }]

const userData = useCookie("userData")

const currentRole = computed(() =>
  String(userData.value?.role?.name || "").toLowerCase(),
)

const routesByRole = roleName => {
  const setting = settingItemsForRole(roleName)

  return {
    admin: [
      ...dashboard,
      ...pemasukanHeading,
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
      ...laporanHeading,
      ...laporan,
      ...kelolaHeading,
      ...user,
      ...setting,
    ],

    pimpinan: [
      ...dashboard,
      ...pemasukanHeading,
      ...pemasukan,
      ...pengeluaranHeading,
      ...pegawai,
      ...pengeluaran,
      ...hutang,
      ...pengeluaranDosen,
      ...rumahTangga,
      ...saranaPrasarana,
      ...transportasi,
      ...rab,
      ...laporanHeading,
      ...laporan,
      ...kelolaHeading,
      ...user,
      ...setting,
    ],

    keuangan: [
      ...dashboard,
      ...pemasukanHeading,
      ...pemasukan,
      ...pengeluaranHeading,
      ...pengeluaran,
      ...hutang,
      ...rab,
      ...laporanHeading,
      ...laporan,
      ...kelolaHeading,
      ...user,
      ...setting,
    ],

    staff: [...dashboardStaff, ...pemasukanHeading, ...pemasukanStaff, ...hutang, ...laporanHeading, ...laporan, ...kelolaHeading, ...setting],
    kabag: [...dashboardStaff, ...pemasukanHeading, ...pemasukanStaff, ...hutang, ...rab, ...laporanHeading, ...laporan, ...kelolaHeading, ...setting],
    kabag_pemasukan: [...dashboardStaff, ...pemasukanHeading, ...pemasukan, ...hutang, ...laporanHeading, ...laporan, ...kelolaHeading, ...setting],
    kabag_pengeluaran: [
      ...dashboard,
      ...pengeluaranHeading,
      ...pegawai,
      ...hutang,
      ...pengeluaran,
      ...pengeluaranDosen,
      ...rumahTangga,
      ...saranaPrasarana,
      ...transportasi,
      ...rab,
      ...laporanHeading,
      ...laporanPengeluaran,
      ...kelolaHeading,
      ...setting,
    ],

    rumahtangga: [
      ...dashboard,
      ...pengeluaranHeading,
      ...pegawai,
      ...hutang,
      ...rumahTangga,
      ...kelolaHeading,
      ...setting,
    ],

    sarpras: [
      ...dashboard,
      ...pengeluaranHeading,
      ...pegawai,
      ...hutang,
      ...saranaPrasarana,
      ...kelolaHeading,
      ...setting,
    ],

    transportasi: [
      ...dashboard,
      ...pengeluaranHeading,
      ...pegawai,
      ...hutang,
      ...transportasi,
      ...kelolaHeading,
      ...setting,
    ],

    barokahdosen_tatapmuka: [
      ...dashboard,
      ...pengeluaranHeading,
      ...pegawai,
      ...hutang,
      ...pengeluaranDosenTatapmuka,
      ...laporanHeading,
      ...laporanPengeluaran,
      ...kelolaHeading,
      ...setting,
    ],

    barokahdosen_kegiatan: [
      ...dashboard,
      ...pengeluaranHeading,
      ...pegawai,
      ...hutang,
      ...pengeluaranDosenKegiatan,
      ...laporanHeading,
      ...laporanPengeluaran,
      ...kelolaHeading,
      ...setting,
    ],

    barokahdosen_bulanan: [
      ...dashboard,
      ...pengeluaranHeading,
      ...pegawai,
      ...hutang,
      ...pengeluaranDosenBulanan,
      ...rab,
      ...laporanHeading,
      ...laporanPengeluaran,
      ...kelolaHeading,
      ...setting,
    ],
  }
}

export default computed(() => routesByRole(currentRole.value)[currentRole.value] ?? [])
