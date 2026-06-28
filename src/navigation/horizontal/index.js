/* eslint-disable camelcase */
import { computed } from "vue"
import dashboard from "./dashboard"
import pemasukan from "./pemasukan"
import pengeluaran from "./pengeluaran"
import pegawai from "./pegawai"
import { settingItemsForRole } from "./setting"
import dashboardStaff from "./staff/dashboardStaff"
import pemasukanStaff from "./staff/pemasukanStaff"
import user from "./user"
import hutang from "./hutang"
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
      ...pemasukan,
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
    kabag_pemasukan: [...dashboardStaff, ...pemasukan, ...hutang, ...laporan, ...setting],
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
