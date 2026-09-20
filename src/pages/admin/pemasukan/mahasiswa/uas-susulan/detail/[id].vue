<script setup>
import { onMounted, ref, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { showSnackbar } from "@/composables/snackbar"

const router = useRouter()
const route = useRoute()
const id = route.params.id

const data = ref(null)
const isLoading = ref(true)

const fetchData = async () => {
  try {
    isLoading.value = true

    const response = await $api(`/admin/pemasukan/mahasiswa/uas-susulan/${id}`, {
      method: "GET",
    })

    data.value = response
  } catch (err) {
    console.error("Gagal memuat detail UAS Susulan:", err)
    showSnackbar({
      text: err?.data?.message || err?.message || "Data UAS Susulan tidak ditemukan",
      color: "error",
    })
    router.replace("/admin/pemasukan/mahasiswa/uas-susulan")
  } finally {
    isLoading.value = false
  }
}

const mahasiswa = computed(() => data.value?.mahasiswa || {})
const uasSusulanMkList = computed(() => {
  const mkList = data.value?.uas_susulan_mk || data.value?.uasSusulanMk || []
  const krsList = data.value?.krs_detail || []
  const krsMap = new Map(krsList.map(k => [k.jadwal_kuliah_id, k]))

  return mkList.map(item => {
    const krs = krsMap.get(item.jadwal_kuliah_id) || item.mk_detail || {}
    return {
      id: item.id,
      jadwal_kuliah_id: item.jadwal_kuliah_id,
      kode_mk: krs.kode_mk || krs.jadwal_kuliah?.kurikulum_matakuliah?.matakuliah?.kode || item.mk_detail?.kode_mk || item.kode_mk || "-",
      nama_mk: krs.nama_mk || krs.jadwal_kuliah?.kurikulum_matakuliah?.matakuliah?.nama || item.mk_detail?.nama_mk || item.nama_mk || `Mata Kuliah #${item.jadwal_kuliah_id}`,
      sks_mk: krs.sks_mk || krs.jadwal_kuliah?.kurikulum_matakuliah?.matakuliah?.sks || item.mk_detail?.sks_mk || item.sks_mk || "-",
      smt_mk: krs.smt_mk || krs.jadwal_kuliah?.smt || item.mk_detail?.smt_mk || item.smt_mk || "-",
      dosen_nama: krs.dosen_nama || item.mk_detail?.dosen_nama || item.dosen_nama || "-",
      nilai_akhir: krs.nilai_akhir ?? item.mk_detail?.nilai_akhir ?? null,
      nilai_huruf: krs.nilai_huruf || item.mk_detail?.nilai_huruf || "",
      kelompok: krs.kelompok || krs.jadwal_kuliah?.kelompok?.kode || item.mk_detail?.kelompok || item.kelompok || "-",
    }
  })
})

const totalSks = computed(() => {
  return uasSusulanMkList.value.reduce((acc, curr) => {
    const sks = Number(curr.sks_mk)
    return isNaN(sks) ? acc : acc + sks
  }, 0)
})

const getNilaiColor = item => {
  const huruf = String(item.nilai_huruf || "").trim().toUpperCase()
  if (huruf === "A" || huruf === "A-") return "success"
  if (huruf === "B" || huruf === "B+") return "info"
  if (huruf === "C" || huruf === "C+") return "warning"
  if (huruf === "D" || huruf === "E" || huruf === "F") return "error"
  return "secondary"
}

onMounted(() => {
  document.title = "Detail UAS Susulan - SIMKEU"
  fetchData()
})
</script>

<template>
  <div>
    <!-- Loading bar -->
    <VProgressLinear
      v-if="isLoading"
      indeterminate
      color="primary"
      class="mb-4"
    />

    <template v-else-if="data">
      <!-- Header Actions -->
      <div class="d-flex flex-wrap align-center justify-space-between gap-4 mb-6">
        <div>
          <h4 class="text-h4 font-weight-medium">
            Detail Data UAS Susulan
          </h4>
          <div class="text-body-1 text-medium-emphasis mt-1">
            {{ mahasiswa.nim || data.nim }} - {{ mahasiswa.nama || "Mahasiswa" }}
          </div>
        </div>

        <div class="d-flex flex-wrap gap-3">
          <VBtn
            variant="outlined"
            color="secondary"
            prepend-icon="ri-arrow-left-line"
            @click="router.push('/admin/pemasukan/mahasiswa/uas-susulan')"
          >
            Kembali
          </VBtn>

          <VBtn
            color="primary"
            prepend-icon="ri-edit-box-line"
            @click="router.push(`/admin/pemasukan/mahasiswa/uas-susulan/edit/${data.id}`)"
          >
            Edit UAS Susulan
          </VBtn>
        </div>
      </div>

      <!-- Info Cards Row -->
      <VRow class="mb-4">
        <!-- Informasi Mahasiswa -->
        <VCol
          cols="12"
          md="6"
        >
          <VCard
            title="Informasi Mahasiswa"
            class="h-100"
          >
            <VCardText>
              <VTable density="compact" class="text-no-wrap">
                <tbody>
                  <tr>
                    <td class="font-weight-medium text-medium-emphasis" style="inline-size: 140px;">
                      NIM
                    </td>
                    <td>
                      <VChip
                        color="primary"
                        size="small"
                        label
                      >
                        {{ mahasiswa.nim || data.nim }}
                      </VChip>
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-medium text-medium-emphasis">
                      Nama Mahasiswa
                    </td>
                    <td class="font-weight-bold">
                      {{ mahasiswa.nama || "-" }}
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-medium text-medium-emphasis">
                      Program Studi
                    </td>
                    <td>
                      {{ mahasiswa.prodi?.nama || mahasiswa.prodi?.alias || "-" }}
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-medium text-medium-emphasis">
                      Jenis Kelamin
                    </td>
                    <td>
                      {{ mahasiswa.jk?.nama || "-" }}
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-medium text-medium-emphasis">
                      Angkatan
                    </td>
                    <td>
                      {{ mahasiswa.th_akademik?.kode || "-" }}
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-medium text-medium-emphasis">
                      Kelas
                    </td>
                    <td>
                      {{ mahasiswa.kelas?.nama || "-" }}
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-medium text-medium-emphasis">
                      Semester
                    </td>
                    <td>
                      {{ mahasiswa.semester || "-" }}
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </VCardText>
          </VCard>
        </VCol>

        <!-- Informasi UAS Susulan -->
        <VCol
          cols="12"
          md="6"
        >
          <VCard
            title="Informasi UAS Susulan"
            class="h-100"
          >
            <VCardText>
              <VTable density="compact" class="text-no-wrap">
                <tbody>
                  <tr>
                    <td class="font-weight-medium text-medium-emphasis" style="inline-size: 150px;">
                      Tahun Akademik
                    </td>
                    <td class="font-weight-bold">
                      {{ data.th_akademik?.nama }} - {{ data.th_akademik?.semester }} ({{ data.th_akademik?.kode }})
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-medium text-medium-emphasis">
                      Tanggal
                    </td>
                    <td>
                      <VChip
                        color="info"
                        size="small"
                        label
                      >
                        {{ data.tanggal }}
                      </VChip>
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-medium text-medium-emphasis">
                      Jumlah Mata Kuliah
                    </td>
                    <td>
                      <VChip
                        color="primary"
                        size="small"
                        label
                      >
                        {{ uasSusulanMkList.length }} Mata Kuliah ({{ totalSks }} SKS)
                      </VChip>
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-medium text-medium-emphasis">
                      Keterangan / Alasan
                    </td>
                    <td>
                      {{ data.keterangan || "-" }}
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-medium text-medium-emphasis">
                      Waktu Dibuat
                    </td>
                    <td class="text-caption">
                      {{ data.created_at || "-" }}
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Daftar Mata Kuliah UAS Susulan -->
      <VCard title="Daftar Mata Kuliah UAS Susulan">
        <template #append>
          <VChip
            color="primary"
            size="small"
            label
          >
            Total: {{ uasSusulanMkList.length }} MK | {{ totalSks }} SKS
          </VChip>
        </template>

        <VCardText>
          <div
            v-if="uasSusulanMkList.length === 0"
            class="text-center pa-6 text-medium-emphasis"
          >
            <VIcon
              icon="ri-information-line"
              size="32"
              class="mb-2 text-secondary"
            />
            <div>Tidak ada mata kuliah yang terdaftar pada UAS Susulan ini.</div>
          </div>

          <VTable
            v-else
            density="compact"
            class="border rounded text-no-wrap"
          >
            <thead>
              <tr>
                <th style="inline-size: 50px;">
                  No
                </th>
                <th>Kode MK</th>
                <th>Nama Mata Kuliah</th>
                <th class="text-center">
                  SKS
                </th>
                <th class="text-center">
                  Semester
                </th>
                <th>Dosen Pengampu</th>
                <th class="text-center">
                  Nilai
                </th>
                <th>Kelompok</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in uasSusulanMkList"
                :key="item.id || item.jadwal_kuliah_id"
              >
                <td>{{ index + 1 }}</td>
                <td class="font-weight-medium">
                  {{ item.kode_mk }}
                </td>
                <td>
                  <span class="font-weight-bold">{{ item.nama_mk }}</span>
                </td>
                <td class="text-center">
                  {{ item.sks_mk }}
                </td>
                <td class="text-center">
                  {{ item.smt_mk }}
                </td>
                <td>
                  {{ item.dosen_nama }}
                </td>
                <td class="text-center">
                  <VChip
                    v-if="item.nilai_akhir != null || item.nilai_huruf"
                    size="x-small"
                    :color="getNilaiColor(item)"
                    label
                  >
                    {{ item.nilai_akhir != null ? item.nilai_akhir : '-' }}
                    <span v-if="item.nilai_huruf"> ({{ item.nilai_huruf }})</span>
                  </VChip>
                  <span
                    v-else
                    class="text-medium-emphasis"
                  >-</span>
                </td>
                <td>
                  <span class="text-caption">{{ item.kelompok }}</span>
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>
      </VCard>
    </template>
  </div>
</template>
