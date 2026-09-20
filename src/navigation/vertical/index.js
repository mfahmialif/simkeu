/* eslint-disable camelcase */
import { computed } from "vue"
import dashboard from "./dashboard"
import pemasukan, { pemasukanItemsForRole } from "./pemasukan"
import pengeluaran from "./pengeluaran"
import pengeluaranDosen, {
  pengeluaranDosenBulanan,
  pengeluaranDosenKegiatan,
  pengeluaranDosenTatapmuka,
} from "./pengeluaran-dosen"
import pegawai from "./pegawai"
import { settingItemsForRole } from "./setting"
import dashboardStaff from "./staff/dashboardStaff"
import pemasukanStaff, { pemasukanStaffItemsForRole } from "./staff/pemasukanStaff"
import user from "./user"
import laporan, { laporanPengeluaran } from "./laporan"
import rab from "./rab"
import { hutangItemsForRole } from "./hutang"
import rumahTangga from "./rumah-tangga"
import saranaPrasarana from "./sarana-prasarana"
import transportasi from "./transportasi"
import umum from "./umum"

const kelolaHeading = [{ heading: "Kelola" }]
const pemasukanHeading = [{ heading: "Pemasukan" }]
const laporanHeading = [{ heading: "Laporan" }]
const pengeluaranHeading = [{ heading: "Pengeluaran" }]

const userData = useCookie("userData")

const roleMap = {
  1: "admin",
  2: "pimpinan",
  3: "keuangan",
  4: "kabag",
  5: "staff",
  13: "kabag_pemasukan",
  14: "kabag_pengeluaran",
}

const currentRole = computed(() => {
  const roleName = String(userData.value?.role?.name || "").toLowerCase().trim()
  if (roleName) return roleName
  return roleMap[userData.value?.role_id] || ""
})

const routesByRole = roleName => {
  const setting = settingItemsForRole(roleName)
  const hutang = hutangItemsForRole(roleName)
  const pemasukanRole = pemasukanItemsForRole(roleName)
  const pemasukanStaffRole = pemasukanStaffItemsForRole(roleName)

  return {
    admin: [
      ...dashboard,
      ...pemasukanHeading,
      ...pemasukanRole,
      ...pengeluaranHeading,
      ...pegawai,
      ...hutang,
      ...pengeluaran,
      ...pengeluaranDosen,
      ...rumahTangga,
      ...saranaPrasarana,
      ...transportasi,
      ...umum,
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
      ...pemasukanRole,
      ...pengeluaranHeading,
      ...pegawai,
      ...pengeluaran,
      ...hutang,
      ...pengeluaranDosen,
      ...rumahTangga,
      ...saranaPrasarana,
      ...transportasi,
      ...umum,
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
      ...pemasukanRole,
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

    staff: [...dashboardStaff, ...pemasukanHeading, ...pemasukanStaffRole, ...hutang, ...laporanHeading, ...laporan, ...kelolaHeading, ...setting],
    kabag: [...dashboardStaff, ...pemasukanHeading, ...pemasukanStaffRole, ...hutang, ...rab, ...laporanHeading, ...laporan, ...kelolaHeading, ...setting],
    kabag_pemasukan: [...dashboardStaff, ...pemasukanHeading, ...pemasukanRole, ...hutang, ...laporanHeading, ...laporan, ...kelolaHeading, ...setting],
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
      ...umum,
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
      ...umum,
      ...kelolaHeading,
      ...setting,
    ],

    sarpras: [
      ...dashboard,
      ...pengeluaranHeading,
      ...pegawai,
      ...hutang,
      ...saranaPrasarana,
      ...umum,
      ...kelolaHeading,
      ...setting,
    ],

    transportasi: [
      ...dashboard,
      ...pengeluaranHeading,
      ...pegawai,
      ...hutang,
      ...transportasi,
      ...umum,
      ...kelolaHeading,
      ...setting,
    ],

    barokahdosen_tatapmuka: [
      ...dashboard,
      ...pengeluaranHeading,
      ...pegawai,
      ...hutang,
      ...pengeluaranDosenTatapmuka,
      ...umum,
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
      ...umum,
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
      ...umum,
      ...rab,
      ...laporanHeading,
      ...laporanPengeluaran,
      ...kelolaHeading,
      ...setting,
    ],
  }
}

export default computed(() => routesByRole(currentRole.value)[currentRole.value] ?? [])
