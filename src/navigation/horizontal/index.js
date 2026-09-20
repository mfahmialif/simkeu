/* eslint-disable camelcase */
import { computed } from "vue"
import dashboard from "./dashboard"
import pemasukan, { pemasukanItemsForRole } from "./pemasukan"
import pengeluaran from "./pengeluaran"
import pegawai from "./pegawai"
import { settingItemsForRole } from "./setting"
import dashboardStaff from "./staff/dashboardStaff"
import pemasukanStaff, { pemasukanStaffItemsForRole } from "./staff/pemasukanStaff"
import user from "./user"
import { hutangItemsForRole } from "./hutang"
import {
  pengeluaranDosenBulanan,
  pengeluaranDosenKegiatan,
  pengeluaranDosenTatapmuka,
} from "./barokahdosen/pengeluaranBarokahDosen"
import laporan, { laporanPengeluaran } from "./laporan"
import rab from "./rab"
import rumahTangga from "./rumah-tangga"
import saranaPrasarana from "./sarana-prasarana"
import transportasi from "./transportasi"
import umum from "./umum"

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
      ...pemasukanRole,
      ...pengeluaran,
      ...rumahTangga,
      ...saranaPrasarana,
      ...transportasi,
      ...umum,
      ...pegawai,
      ...hutang,
      ...rab,
      ...laporan,
      ...user,
      ...setting,
    ],

    pimpinan: [
      ...dashboard,
      ...pemasukanRole,
      ...pengeluaran,
      ...rumahTangga,
      ...saranaPrasarana,
      ...transportasi,
      ...umum,
      ...pegawai,
      ...hutang,
      ...rab,
      ...laporan,
      ...user,
      ...setting,
    ],

    keuangan: [
      ...dashboard,
      ...pemasukanRole,
      ...pengeluaran,
      ...hutang,
      ...rab,
      ...laporan,
      ...user,
      ...setting,
    ],

    staff: [...dashboardStaff, ...pemasukanStaffRole, ...hutang, ...setting],
    kabag: [...dashboardStaff, ...pemasukanStaffRole, ...hutang, ...rab, ...setting],
    kabag_pemasukan: [...dashboardStaff, ...pemasukanRole, ...hutang, ...laporan, ...setting],
    kabag_pengeluaran: [
      ...dashboard,
      ...pegawai,
      ...hutang,
      ...pengeluaran,
      ...rumahTangga,
      ...saranaPrasarana,
      ...transportasi,
      ...umum,
      ...rab,
      ...laporanPengeluaran,
      ...setting,
    ],

    rumahtangga: [
      ...dashboard,
      ...pegawai,
      ...hutang,
      ...rumahTangga,
      ...umum,
      ...setting,
    ],

    sarpras: [
      ...dashboard,
      ...pegawai,
      ...hutang,
      ...saranaPrasarana,
      ...umum,
      ...setting,
    ],

    transportasi: [
      ...dashboard,
      ...pegawai,
      ...hutang,
      ...transportasi,
      ...umum,
      ...setting,
    ],

    barokahdosen_tatapmuka: [
      ...dashboard,
      ...pegawai,
      ...hutang,
      ...pengeluaranDosenTatapmuka,
      ...umum,
      ...laporanPengeluaran,
      ...setting,
    ],

    barokahdosen_kegiatan: [...dashboard, ...pegawai, ...hutang, ...pengeluaranDosenKegiatan, ...umum, ...laporanPengeluaran, ...setting],
    barokahdosen_bulanan: [...dashboard, ...pegawai, ...hutang, ...pengeluaranDosenBulanan, ...umum, ...rab, ...laporanPengeluaran, ...setting],
  }
}

export default computed(() => routesByRole(currentRole.value)[currentRole.value] ?? [])
