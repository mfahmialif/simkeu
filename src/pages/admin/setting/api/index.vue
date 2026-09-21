<script setup>
import { showSnackbar } from "@/composables/snackbar"

const loading = ref(true)
const rotatingKey = ref(false)
const apiKeyDialog = ref(false)
const generatedApiKey = ref("")
const apiData = ref(null)

// Live tester state
const testEndpoint = ref("peserta")
const testNim = ref("")
const testThAkademikKode = ref("")
const testJadwalKuliahId = ref("")
const testOnlyIds = ref(false)
const testLimit = ref(10)
const testLoading = ref(false)
const testResult = ref(null)

// Tabs state
const activeEndpointTab = ref("peserta")
const activeSnippetTabPeserta = ref("curl")
const activeSnippetTabDetail = ref("curl")
const activeSnippetTabJadwal = ref("curl")
const activeSnippetTabUas = ref("curl")

const fetchApiSettings = async () => {
  try {
    loading.value = true

    const response = await $api("/admin/setting/api", {
      method: "GET",
    })

    if (response?.data) {
      apiData.value = response.data
    }
  } catch (err) {
    console.error("Gagal mengambil data API:", err)
    showSnackbar({
      text: "Gagal memuat pengaturan API",
      color: "error",
    })
  } finally {
    loading.value = false
  }
}

const rotateApiKey = async () => {
  try {
    rotatingKey.value = true

    const response = await $api("/admin/setting/api/siakad-key/rotate", {
      method: "POST",
    })

    if (response?.data?.api_key) {
      generatedApiKey.value = response.data.api_key
      apiKeyDialog.value = true
      await fetchApiSettings()
      showSnackbar({
        text: "API key SIAKAD berhasil dibuat/dirotasi",
        color: "success",
      })
    }
  } catch (err) {
    console.error("Gagal merotasi API key:", err)
    showSnackbar({
      text: err?.data?.message || "Gagal merotasi API key SIAKAD",
      color: "error",
    })
  } finally {
    rotatingKey.value = false
  }
}

const copyToClipboard = async (text, label = "Teks") => {
  if (!text) return

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const el = document.createElement("textarea")

      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }
    showSnackbar({
      text: `${label} berhasil disalin ke clipboard`,
      color: "success",
    })
  } catch (err) {
    console.error("Gagal menyalin teks:", err)
    showSnackbar({
      text: "Gagal menyalin teks",
      color: "error",
    })
  }
}

const runLiveTest = async () => {
  try {
    testLoading.value = true
    testResult.value = null

    let url = "/admin/setting/api/peserta-preview"
    const params = {}

    if (testEndpoint.value === "peserta-detail") {
      const targetNim = testNim.value?.trim() || "202585010009"
      url = `/admin/setting/api/peserta-detail-preview/${targetNim}`
      if (testThAkademikKode.value) params.th_akademik_kode = testThAkademikKode.value.trim()
    } else if (testEndpoint.value === "jadwal-kuliah") {
      url = "/admin/setting/api/jadwal-kuliah-preview"
      params.limit = testLimit.value
      if (testNim.value) params.nim = testNim.value.trim()
      if (testThAkademikKode.value) params.th_akademik_kode = testThAkademikKode.value.trim()
      if (testJadwalKuliahId.value) params.jadwal_kuliah_id = Number(testJadwalKuliahId.value)
      if (testOnlyIds.value) params.only_ids = 1
    } else if (testEndpoint.value === "uas-susulan") {
      url = "/admin/setting/api/uas-susulan-preview"
      params.limit = testLimit.value
      if (testNim.value) params.nim = testNim.value.trim()
      if (testThAkademikKode.value) params.th_akademik_kode = testThAkademikKode.value.trim()
      if (testJadwalKuliahId.value) params.jadwal_kuliah_id = Number(testJadwalKuliahId.value)
    } else {
      // peserta
      url = "/admin/setting/api/peserta-preview"
      params.limit = testLimit.value
      if (testNim.value) params.nim = testNim.value.trim()
      if (testThAkademikKode.value) params.th_akademik_kode = testThAkademikKode.value.trim()
      if (testJadwalKuliahId.value) params.jadwal_kuliah_id = Number(testJadwalKuliahId.value)
    }

    const res = await $api(url, {
      method: "GET",
      params,
    })

    testResult.value = res
    showSnackbar({
      text: "Uji coba request berhasil dieksekusi",
      color: "success",
    })
  } catch (err) {
    console.error("Gagal menjalankan uji coba API:", err)
    testResult.value = err?.data || { status: false, message: "Terjadi kesalahan saat memanggil API." }
    showSnackbar({
      text: "Uji coba request gagal",
      color: "error",
    })
  } finally {
    testLoading.value = false
  }
}

const baseUrl = computed(() => {
  return apiData.value?.base_url || `${window.location.origin}/api/v1/integrations/siakad`
})

// === Snippets GET /uas-susulan/peserta ===
const pesertaCurlExample = computed(() => {
  const url = `${baseUrl.value}/uas-susulan/peserta?th_akademik_kode=20251&limit=20`

  return `curl --location '${url}' \\
  --header 'X-SIAKAD-API-KEY: ${apiData.value?.siakad_api_key_configured ? 'YOUR_API_KEY_HERE' : 'GENERATE_KEY_FIRST'}' \\
  --header 'Accept: application/json'`
})

const pesertaPhpLaravelExample = computed(() => {
  return `<?php
use Illuminate\\Support\\Facades\\Http;

$response = Http::withHeaders([
    'X-SIAKAD-API-KEY' => config('services.simkeu.api_key'),
    'Accept'           => 'application/json',
])->get('${baseUrl.value}/uas-susulan/peserta', [
    'th_akademik_kode' => '20251',
    'limit'            => 20,
]);

if ($response->successful()) {
    $pesertaList = $response->json('data');
    foreach ($pesertaList as $mhs) {
        // Mendapatkan NIM, Nama, dan Jumlah MK yang disusulkan:
        echo "{$mhs['nim']} - {$mhs['nama']} : {$mhs['jumlah_mk']} MK disusulkan\\n";
    }
}`
})

const pesertaPhpGuzzleExample = computed(() => {
  return `<?php
use GuzzleHttp\\Client;

$client = new Client();
$response = $client->request('GET', '${baseUrl.value}/uas-susulan/peserta', [
    'headers' => [
        'X-SIAKAD-API-KEY' => 'YOUR_API_KEY_HERE',
        'Accept'           => 'application/json',
    ],
    'query' => [
        'th_akademik_kode' => '20251',
        'limit'            => 20,
    ],
]);

$result = json_decode($response->getBody()->getContents(), true);
$data = $result['data'] ?? [];`
})

const pesertaJsExample = computed(() => {
  return `const response = await fetch('${baseUrl.value}/uas-susulan/peserta?th_akademik_kode=20251&limit=20', {
  method: 'GET',
  headers: {
    'X-SIAKAD-API-KEY': 'YOUR_API_KEY_HERE',
    'Accept': 'application/json',
  },
});

const result = await response.json();
console.log(result.data);`
})

const sampleResponsePesertaJson = `{
  "status": true,
  "message": "Data peserta ujian susulan berhasil diambil.",
  "data": [
    {
      "id": 103,
      "nim": "202585010009",
      "nama": "AGUS SAPUTRA",
      "prodi": {
        "id": 8,
        "kode": "86208",
        "alias": "PAI",
        "nama": "Pendidikan Agama Islam",
        "jenjang": "S1"
      },
      "kelas": "Reguler",
      "th_akademik_id": 24,
      "th_akademik_kode": "20251",
      "th_akademik_nama": "2025/2026",
      "th_akademik_semester": "Ganjil",
      "tanggal": "2026-09-20",
      "keterangan": "Pendaftaran UAS Susulan",
      "jumlah_mk": 7,
      "total_mk": 7,
      "jadwal_kuliah_ids": [6920, 6921, 6922, 6923, 6925, 6926, 6927],
      "created_at": "2026-09-20T14:15:00.000000Z",
      "updated_at": "2026-09-20T14:15:00.000000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "per_page": 20,
    "current_page": 1,
    "last_page": 1,
    "from": 1,
    "to": 1
  }
}`

// === Snippets GET /uas-susulan/peserta/{nim}/detail ===
const detailCurlExample = computed(() => {
  const url = `${baseUrl.value}/uas-susulan/peserta/202585010009/detail`

  return `curl --location '${url}' \\
  --header 'X-SIAKAD-API-KEY: ${apiData.value?.siakad_api_key_configured ? 'YOUR_API_KEY_HERE' : 'GENERATE_KEY_FIRST'}' \\
  --header 'Accept: application/json'`
})

const detailPhpLaravelExample = computed(() => {
  return `<?php
use Illuminate\\Support\\Facades\\Http;

$nim = '202585010009';
$response = Http::withHeaders([
    'X-SIAKAD-API-KEY' => config('services.simkeu.api_key'),
    'Accept'           => 'application/json',
])->get("${baseUrl.value}/uas-susulan/peserta/{$nim}/detail");

if ($response->successful()) {
    $detail = $response->json('data');
    echo "Peserta: {$detail['nama']} ({$detail['nim']})\\n";
    echo "Jumlah MK: {$detail['jumlah_mk']}\\n";
    foreach ($detail['mata_kuliah'] as $mk) {
        echo "- [{$mk['kode_mk']}] {$mk['nama_mk']} ({$mk['sks']} SKS) | Dosen: {$mk['dosen_nama']} | Ruang: {$mk['ruang']}\\n";
    }
}`
})

const detailPhpGuzzleExample = computed(() => {
  return `<?php
use GuzzleHttp\\Client;

$nim = '202585010009';
$client = new Client();
$response = $client->request('GET', "${baseUrl.value}/uas-susulan/peserta/{$nim}/detail", [
    'headers' => [
        'X-SIAKAD-API-KEY' => 'YOUR_API_KEY_HERE',
        'Accept'           => 'application/json',
    ],
]);

$result = json_decode($response->getBody()->getContents(), true);
$detail = $result['data'] ?? [];`
})

const detailJsExample = computed(() => {
  return `const nim = '202585010009';
const response = await fetch(\`${baseUrl.value}/uas-susulan/peserta/\${nim}/detail\`, {
  method: 'GET',
  headers: {
    'X-SIAKAD-API-KEY': 'YOUR_API_KEY_HERE',
    'Accept': 'application/json',
  },
});

const result = await response.json();
console.log(result.data);`
})

const sampleResponseDetailJson = `{
  "status": true,
  "message": "Detail mata kuliah ujian susulan berhasil diambil.",
  "data": {
    "nim": "202585010009",
    "nama": "AGUS SAPUTRA",
    "prodi": {
      "id": 8,
      "kode": "86208",
      "alias": "PAI",
      "nama": "Pendidikan Agama Islam",
      "jenjang": "S1"
    },
    "kelas": "Reguler",
    "semester_mahasiswa": 3,
    "id": 103,
    "th_akademik_id": 24,
    "th_akademik_kode": "20251",
    "th_akademik_nama": "2025/2026",
    "th_akademik_semester": "Ganjil",
    "tanggal": "2026-09-20",
    "keterangan": "Pendaftaran UAS Susulan",
    "jumlah_mk": 7,
    "total_mk": 7,
    "mata_kuliah": [
      {
        "id": 1,
        "uas_susulan_id": 103,
        "jadwal_kuliah_id": 6920,
        "kode_mk": "DL 852402",
        "nama_mk": "FIQH (IBADAH)",
        "sks": 2,
        "sks_mk": 2,
        "smt": 1,
        "smt_mk": 1,
        "dosen_nama": "SAPARWADI, M.Pd",
        "kelompok": "PAI ANGKATAN 2025 PUTRA A",
        "ruang": "RUANG PAI 1A PUTRA",
        "hari": "Ahad",
        "jam": "14.00-15.30",
        "nilai_akhir": null,
        "nilai_huruf": "",
        "created_at": "2026-09-20T14:15:00.000000Z"
      }
    ],
    "riwayat_pendaftaran": [
      {
        "id": 103,
        "nim": "202585010009",
        "tanggal": "2026-09-20",
        "keterangan": "Pendaftaran UAS Susulan",
        "th_akademik_id": 24,
        "th_akademik_kode": "20251",
        "th_akademik_nama": "2025/2026",
        "th_akademik_semester": "Ganjil",
        "jumlah_mk": 7,
        "total_mk": 7,
        "mata_kuliah": []
      }
    ]
  }
}`

// === Snippets GET /uas-susulan/jadwal-kuliah ===
const jadwalCurlExample = computed(() => {
  const url = `${baseUrl.value}/uas-susulan/jadwal-kuliah?th_akademik_kode=20251`

  return `curl --location '${url}' \\
  --header 'X-SIAKAD-API-KEY: ${apiData.value?.siakad_api_key_configured ? 'YOUR_API_KEY_HERE' : 'GENERATE_KEY_FIRST'}' \\
  --header 'Accept: application/json'`
})

const jadwalPhpLaravelExample = computed(() => {
  return `<?php
use Illuminate\\Support\\Facades\\Http;

$response = Http::withHeaders([
    'X-SIAKAD-API-KEY' => config('services.simkeu.api_key'),
    'Accept'           => 'application/json',
])->get('${baseUrl.value}/uas-susulan/jadwal-kuliah', [
    'th_akademik_kode' => '20251',
]);

if ($response->successful()) {
    // Array ID jadwal kuliah:
    $jadwalIds = $response->json('jadwal_kuliah_ids');

    // List detail per mata kuliah:
    $jadwalList = $response->json('data');
    foreach ($jadwalList as $j) {
        echo "Jadwal #{$j['jadwal_kuliah_id']}: {$j['nama_mk']} ({$j['total_peserta']} peserta susulan)\\n";
    }
}`
})

const jadwalPhpGuzzleExample = computed(() => {
  return `<?php
use GuzzleHttp\\Client;

$client = new Client();
$response = $client->request('GET', '${baseUrl.value}/uas-susulan/jadwal-kuliah', [
    'headers' => [
        'X-SIAKAD-API-KEY' => 'YOUR_API_KEY_HERE',
        'Accept'           => 'application/json',
    ],
    'query' => [
        'th_akademik_kode' => '20251',
    ],
]);

$result = json_decode($response->getBody()->getContents(), true);
$jadwalIds = $result['jadwal_kuliah_ids'] ?? [];`
})

const jadwalJsExample = computed(() => {
  return `const response = await fetch('${baseUrl.value}/uas-susulan/jadwal-kuliah?th_akademik_kode=20251', {
  method: 'GET',
  headers: {
    'X-SIAKAD-API-KEY': 'YOUR_API_KEY_HERE',
    'Accept': 'application/json',
  },
});

const result = await response.json();
console.log("Daftar ID Jadwal:", result.jadwal_kuliah_ids);
console.log("Detail Jadwal & Peserta:", result.data);`
})

const sampleResponseJadwalJson = `{
  "status": true,
  "message": "Data jadwal kuliah terdaftar ujian susulan berhasil diambil.",
  "total_jadwal": 338,
  "total_pendaftaran": 731,
  "jadwal_kuliah_ids": [6927, 6926, 6925, 6923, 6922, 6921, 6920],
  "data": [
    {
      "jadwal_kuliah_id": 6927,
      "kode_mk": "P 852434",
      "nama_mk": "ISLAM DAN BUDAYA LOKAL",
      "sks": 2,
      "sks_mk": 2,
      "smt": 1,
      "smt_mk": 1,
      "dosen_nama": "DR. JUNAIDI, M.Pd.I, M.Pd I",
      "kelompok": "PAI ANGKATAN 2025 PUTRA A",
      "ruang": "RUANG PAI 1A PUTRA",
      "hari": "Ahad",
      "jam": "14.00-15.30",
      "th_akademik_id": 24,
      "th_akademik_kode": "20251",
      "th_akademik_nama": "2025/2026",
      "th_akademik_semester": "Ganjil",
      "total_peserta": 1,
      "peserta_nims": ["202585010009"],
      "peserta": [
        {
          "nim": "202585010009",
          "uas_susulan_id": 103,
          "tanggal": "2026-09-20"
        }
      ]
    }
  ]
}`

// === Snippets GET /uas-susulan (Legacy) ===
const curlExample = computed(() => {
  const url = `${baseUrl.value}/uas-susulan?th_akademik_kode=20252&nim=210101001`

  return `curl --location '${url}' \\
  --header 'X-SIAKAD-API-KEY: ${apiData.value?.siakad_api_key_configured ? 'YOUR_API_KEY_HERE' : 'GENERATE_KEY_FIRST'}' \\
  --header 'Accept: application/json'`
})

const phpLaravelExample = computed(() => {
  return `<?php
use Illuminate\\Support\\Facades\\Http;

$response = Http::withHeaders([
    'X-SIAKAD-API-KEY' => config('services.simkeu.api_key'),
    'Accept'           => 'application/json',
])->get('${baseUrl.value}/uas-susulan', [
    'th_akademik_kode' => '20252',
    'nim'              => $nim,
]);

if ($response->successful()) {
    $data = $response->json('data');
    // Contoh cek apakah mahasiswa berhak ikut jadwal_kuliah_id tertentu:
    // $berhak = in_array($jadwalKuliahId, $data[0]['jadwal_kuliah_ids'] ?? []);
}`
})

const phpGuzzleExample = computed(() => {
  return `<?php
use GuzzleHttp\\Client;

$client = new Client();
$response = $client->request('GET', '${baseUrl.value}/uas-susulan', [
    'headers' => [
        'X-SIAKAD-API-KEY' => 'YOUR_API_KEY_HERE',
        'Accept'           => 'application/json',
    ],
    'query' => [
        'th_akademik_kode' => '20252',
        'nim'              => '210101001',
    ],
]);

$result = json_decode($response->getBody()->getContents(), true);`
})

const jsExample = computed(() => {
  return `const response = await fetch('${baseUrl.value}/uas-susulan?th_akademik_kode=20252&nim=210101001', {
  method: 'GET',
  headers: {
    'X-SIAKAD-API-KEY': 'YOUR_API_KEY_HERE',
    'Accept': 'application/json',
  },
});

const result = await response.json();
console.log(result.data);`
})

const sampleResponseJson = `{
  "status": true,
  "message": "Data UAS Susulan berhasil diambil.",
  "data": [
    {
      "id": 12,
      "nim": "210101001",
      "tanggal": "2026-09-19",
      "keterangan": "Sakit rawat inap",
      "th_akademik_id": 25,
      "th_akademik_kode": "20252",
      "th_akademik_nama": "2025/2026",
      "th_akademik_semester": "Genap",
      "jadwal_kuliah_ids": [1042, 1045, 1088],
      "total_mk": 3,
      "mata_kuliah": [
        {
          "id": 24,
          "uas_susulan_id": 12,
          "jadwal_kuliah_id": 1042,
          "created_at": "2026-09-19T10:30:00.000000Z"
        }
      ],
      "created_at": "2026-09-19T10:30:00.000000Z",
      "updated_at": "2026-09-19T10:30:00.000000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "per_page": 20,
    "current_page": 1,
    "last_page": 1,
    "from": 1,
    "to": 1
  }
}`

onMounted(() => {
  fetchApiSettings()
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between flex-wrap gap-3 mb-6">
      <div>
        <h2 class="text-h4 font-weight-bold mb-1">
          Dokumentasi Integrasi API SIAKAD
        </h2>
        <p class="text-body-1 text-medium-emphasis mb-0">
          Kelola API Key terpadu dan dokumentasi endpoint pertukaran data antara SIMKEU dan SIAKAD.
        </p>
      </div>

      <div class="d-flex align-center gap-2">
        <VBtn
          color="primary"
          variant="tonal"
          prepend-icon="ri-refresh-line"
          :loading="loading"
          @click="fetchApiSettings"
        >
          Refresh
        </VBtn>
      </div>
    </div>

    <!-- Alert Satu API Key Terpadu -->
    <VAlert
      type="info"
      variant="tonal"
      density="comfortable"
      class="mb-6"
    >
      <div class="d-flex align-start gap-2">
        <VIcon
          icon="ri-shield-keyhole-line"
          size="22"
          class="mt-1"
        />
        <div>
          <div class="font-weight-bold">
            Satu API Key Terpadu untuk Semua Integrasi SIAKAD
          </div>
          <div class="text-body-2 mt-1">
            API key yang digunakan pada endpoint ini tersinkronisasi langsung dengan konfigurasi integrasi BSI SIMKEU (sehingga tidak ada duplikasi API key).
            SIAKAD cukup menggunakan satu key ini pada header <code>X-SIAKAD-API-KEY</code> atau <code>apikey</code> untuk mengakses data Ujian Susulan (Peserta, Detail MK, Jadwal Kuliah) maupun integrasi transaksi perbankan.
          </div>
        </div>
      </div>
    </VAlert>

    <!-- Top Grid: API Key Card & Base URL Card -->
    <VRow class="mb-6">
      <!-- Card API Key -->
      <VCol
        cols="12"
        md="5"
      >
        <VCard class="h-100 d-flex flex-column justify-space-between">
          <VCardItem>
            <template #prepend>
              <VAvatar
                color="primary"
                variant="tonal"
                class="me-2"
              >
                <VIcon icon="ri-key-2-line" />
              </VAvatar>
            </template>
            <VCardTitle>API Key SIAKAD</VCardTitle>
            <VCardSubtitle>Kredensial Otentikasi Header</VCardSubtitle>
          </VCardItem>

          <VCardText class="pb-2">
            <div class="d-flex align-center justify-space-between mb-3">
              <span class="text-body-2 font-weight-medium">Status Kunci:</span>
              <VChip
                :color="apiData?.siakad_api_key_configured ? 'success' : 'warning'"
                label
                size="small"
              >
                {{ apiData?.siakad_api_key_configured ? 'Kunci Aktif' : 'Belum Dibuat' }}
              </VChip>
            </div>

            <div class="bg-var-theme-background pa-3 rounded-lg border mb-3">
              <div class="text-caption text-medium-emphasis mb-1">
                Token Hint:
              </div>
              <div class="d-flex align-center justify-space-between">
                <code class="text-body-1 font-weight-bold">
                  {{ apiData?.siakad_api_key_configured ? `••••••••••••${apiData?.siakad_api_key_hint}` : 'Belum ada API key aktif' }}
                </code>
                <VChip
                  v-if="apiData?.siakad_api_key_configured"
                  size="x-small"
                  color="info"
                  variant="outlined"
                >
                  SHA-256 Hashed
                </VChip>
              </div>
            </div>

            <p class="text-caption text-medium-emphasis mb-0">
              Header: <code>X-SIAKAD-API-KEY: &lt;API_KEY&gt;</code> atau <code>apikey: &lt;API_KEY&gt;</code>.
              <br>
              Nilai plain API key hanya ditampilkan satu kali pada dialog saat dibuat demi keamanan.
            </p>
          </VCardText>

          <VCardActions class="pt-0 pa-4">
            <VBtn
              block
              :color="apiData?.siakad_api_key_configured ? 'warning' : 'primary'"
              variant="elevated"
              :loading="rotatingKey"
              prepend-icon="ri-refresh-line"
              @click="rotateApiKey"
            >
              {{ apiData?.siakad_api_key_configured ? 'Rotasi API Key Baru' : 'Buat API Key Sekarang' }}
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>

      <!-- Card Base URL & Headers -->
      <VCol
        cols="12"
        md="7"
      >
        <VCard class="h-100">
          <VCardItem>
            <template #prepend>
              <VAvatar
                color="info"
                variant="tonal"
                class="me-2"
              >
                <VIcon icon="ri-global-line" />
              </VAvatar>
            </template>
            <VCardTitle>Base URL & Header Request</VCardTitle>
            <VCardSubtitle>Standar Pemanggilan API dari Server SIAKAD</VCardSubtitle>
          </VCardItem>

          <VCardText>
            <div class="mb-4">
              <div class="text-caption font-weight-medium text-medium-emphasis mb-1">
                BASE URL INTEGRASI:
              </div>
              <div class="d-flex align-center gap-2">
                <VTextField
                  :model-value="baseUrl"
                  readonly
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="font-monospace"
                />
                <VBtn
                  color="secondary"
                  variant="tonal"
                  icon="ri-file-copy-line"
                  @click="copyToClipboard(baseUrl, 'Base URL')"
                />
              </div>
            </div>

            <div class="text-caption font-weight-medium text-medium-emphasis mb-2">
              HEADER WAJIB:
            </div>
            <VTable
              density="compact"
              class="border rounded-lg"
            >
              <thead>
                <tr>
                  <th class="text-left">
                    Header Key
                  </th>
                  <th class="text-left">
                    Nilai / Format
                  </th>
                  <th class="text-left">
                    Keterangan
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>X-SIAKAD-API-KEY</code></td>
                  <td><code>&lt;API_KEY_SIAKAD&gt;</code></td>
                  <td>Header utama otentikasi (atau gunakan <code>apikey</code>)</td>
                </tr>
                <tr>
                  <td><code>Accept</code></td>
                  <td><code>application/json</code></td>
                  <td>Format respon wajib JSON</td>
                </tr>
              </tbody>
            </VTable>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Main Content: Documentation & Testing -->
    <VCard class="mb-6">
      <VTabs
        v-model="activeEndpointTab"
        class="border-b"
      >
        <VTab value="peserta">
          <VIcon
            icon="ri-user-star-line"
            class="me-2"
          />
          GET /uas-susulan/peserta
        </VTab>
        <VTab value="peserta-detail">
          <VIcon
            icon="ri-book-read-line"
            class="me-2"
          />
          GET /uas-susulan/peserta/{nim}/detail
        </VTab>
        <VTab value="jadwal-kuliah">
          <VIcon
            icon="ri-calendar-check-line"
            class="me-2"
          />
          GET /uas-susulan/jadwal-kuliah
        </VTab>
        <VTab value="uas-susulan">
          <VIcon
            icon="ri-file-list-3-line"
            class="me-2"
          />
          GET /uas-susulan (Legacy)
        </VTab>
        <VTab value="live-test">
          <VIcon
            icon="ri-play-circle-line"
            class="me-2"
          />
          Live API Tester / Simulator
        </VTab>
        <VTab value="bsi-reference">
          <VIcon
            icon="ri-bank-card-line"
            class="me-2"
          />
          Katalog Endpoint BSI
        </VTab>
      </VTabs>

      <VCardText>
        <!-- Tab 1: GET /uas-susulan/peserta -->
        <div v-if="activeEndpointTab === 'peserta'">
          <div class="d-flex align-center justify-space-between flex-wrap gap-2 mb-4">
            <div class="d-flex align-center gap-2">
              <VChip
                color="success"
                label
                class="font-weight-bold"
              >
                GET
              </VChip>
              <code class="text-h6 font-weight-bold">/api/v1/integrations/siakad/uas-susulan/peserta</code>
              <VChip
                size="x-small"
                color="primary"
                variant="outlined"
              >
                Alias: /api/siakad/uas-susulan/peserta
              </VChip>
            </div>

            <VBtn
              size="small"
              variant="outlined"
              color="primary"
              prepend-icon="ri-file-copy-line"
              @click="copyToClipboard(`${baseUrl}/uas-susulan/peserta`, 'URL Endpoint Peserta')"
            >
              Salin URL
            </VBtn>
          </div>

          <p class="text-body-1 mb-4">
            Endpoint ini digunakan oleh SIAKAD untuk mengambil <strong>daftar seluruh mahasiswa peserta ujian susulan</strong> lengkap dengan profil nama, program studi, tanggal pendaftaran, serta <strong>jumlah total mata kuliah (<code>jumlah_mk</code>)</strong> yang disusulkan.
          </p>

          <!-- Parameter Query Table -->
          <h4 class="text-h6 font-weight-bold mb-3">
            Parameter Query (GET Request)
          </h4>
          <VTable
            density="comfortable"
            class="border rounded-lg mb-6"
          >
            <thead>
              <tr>
                <th style="width: 180px;">
                  Parameter
                </th>
                <th style="width: 100px;">
                  Tipe
                </th>
                <th style="width: 100px;">
                  Wajib
                </th>
                <th>Deskripsi &amp; Contoh</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>nim</code></td>
                <td>String</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  Filter spesifik satu NIM (<code>202585010009</code>) atau beberapa NIM dipisah koma (<code>202585010009,210101002</code>).
                </td>
              </tr>
              <tr>
                <td><code>th_akademik_kode</code></td>
                <td>String</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  Filter kode tahun akademik SIMKEU (contoh: <code>20251</code> untuk ganjil 2025/2026).
                </td>
              </tr>
              <tr>
                <td><code>th_akademik_id</code></td>
                <td>Integer</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  Filter ID database tahun akademik SIMKEU (contoh: <code>24</code>).
                </td>
              </tr>
              <tr>
                <td><code>jadwal_kuliah_id</code></td>
                <td>Integer</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  Filter peserta yang mengambil ID jadwal kuliah tertentu.
                </td>
              </tr>
              <tr>
                <td><code>tanggal</code></td>
                <td>Date (YYYY-MM-DD)</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  Filter tanggal pendaftaran ujian susulan (contoh: <code>2026-09-20</code>).
                </td>
              </tr>
              <tr>
                <td><code>search</code></td>
                <td>String</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  Pencarian umum kata kunci pada NIM, keterangan, atau tahun akademik.
                </td>
              </tr>
              <tr>
                <td><code>limit</code></td>
                <td>Integer</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  Jumlah data per halaman (default <code>20</code>, kirim <code>0</code> atau <code>all</code> untuk seluruh data).
                </td>
              </tr>
              <tr>
                <td><code>page</code></td>
                <td>Integer</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  Nomor halaman data pagination (default <code>1</code>).
                </td>
              </tr>
            </tbody>
          </VTable>

          <!-- Code Snippets Tab -->
          <h4 class="text-h6 font-weight-bold mb-3">
            Contoh Implementasi Kode
          </h4>
          <VCard
            variant="outlined"
            class="mb-6"
          >
            <VTabs
              v-model="activeSnippetTabPeserta"
              density="compact"
              class="border-b"
            >
              <VTab value="curl">
                cURL
              </VTab>
              <VTab value="php-laravel">
                PHP (Laravel HTTP)
              </VTab>
              <VTab value="php-guzzle">
                PHP (Guzzle)
              </VTab>
              <VTab value="js">
                JavaScript / Node.js
              </VTab>
            </VTabs>

            <VCardText class="bg-var-theme-background pa-4">
              <div class="d-flex justify-end mb-2">
                <VBtn
                  size="x-small"
                  variant="text"
                  prepend-icon="ri-file-copy-line"
                  @click="copyToClipboard(
                    activeSnippetTabPeserta === 'curl' ? pesertaCurlExample :
                    activeSnippetTabPeserta === 'php-laravel' ? pesertaPhpLaravelExample :
                    activeSnippetTabPeserta === 'php-guzzle' ? pesertaPhpGuzzleExample : pesertaJsExample,
                    'Contoh Kode'
                  )"
                >
                  Salin Kode
                </VBtn>
              </div>
              <pre
                class="text-body-2 font-monospace mb-0"
                style="overflow-x: auto; white-space: pre-wrap;"
              ><code>{{
                activeSnippetTabPeserta === 'curl' ? pesertaCurlExample :
                activeSnippetTabPeserta === 'php-laravel' ? pesertaPhpLaravelExample :
                activeSnippetTabPeserta === 'php-guzzle' ? pesertaPhpGuzzleExample : pesertaJsExample
              }}</code></pre>
            </VCardText>
          </VCard>

          <!-- Response Example -->
          <h4 class="text-h6 font-weight-bold mb-3">
            Struktur Respon JSON (HTTP 200 OK)
          </h4>
          <VCard
            variant="outlined"
            class="mb-4"
          >
            <VCardText class="bg-var-theme-background pa-4">
              <div class="d-flex justify-end mb-2">
                <VBtn
                  size="x-small"
                  variant="text"
                  prepend-icon="ri-file-copy-line"
                  @click="copyToClipboard(sampleResponsePesertaJson, 'Respon JSON')"
                >
                  Salin JSON
                </VBtn>
              </div>
              <pre
                class="text-body-2 font-monospace mb-0"
                style="max-height: 400px; overflow-y: auto; overflow-x: auto; white-space: pre-wrap;"
              ><code>{{ sampleResponsePesertaJson }}</code></pre>
            </VCardText>
          </VCard>

          <VAlert
            type="success"
            variant="tonal"
            density="compact"
          >
            <strong>Highlight Peserta:</strong> Setiap row data telah menyertakan properti <code>jumlah_mk</code> (dan <code>total_mk</code>) serta array <code>jadwal_kuliah_ids</code> untuk efisiensi verifikasi hak ujian mahasiswa.
          </VAlert>
        </div>

        <!-- Tab 2: GET /uas-susulan/peserta/{nim}/detail -->
        <div v-else-if="activeEndpointTab === 'peserta-detail'">
          <div class="d-flex align-center justify-space-between flex-wrap gap-2 mb-4">
            <div class="d-flex align-center gap-2">
              <VChip
                color="success"
                label
                class="font-weight-bold"
              >
                GET
              </VChip>
              <code class="text-h6 font-weight-bold">/api/v1/integrations/siakad/uas-susulan/peserta/{nim}/detail</code>
              <VChip
                size="x-small"
                color="primary"
                variant="outlined"
              >
                Alias: /api/siakad/uas-susulan/peserta/{nim}/detail
              </VChip>
            </div>

            <VBtn
              size="small"
              variant="outlined"
              color="primary"
              prepend-icon="ri-file-copy-line"
              @click="copyToClipboard(`${baseUrl}/uas-susulan/peserta/{nim}/detail`, 'URL Endpoint Detail MK')"
            >
              Salin URL
            </VBtn>
          </div>

          <p class="text-body-1 mb-4">
            Endpoint ini mengambil <strong>detail lengkap mata kuliah yang disusulkan oleh mahasiswa</strong> berdasarkan parameter NIM di URL path.
            Mengembalikan metadata lengkap: <strong>Nama MK, Kode MK, SKS, Semester MK, Nama Dosen Pengampu, Kelompok Kelas, Ruang, Hari, Jam Kuliah</strong>, serta nilai akhir jika tersedia.
          </p>

          <!-- Parameter URL Table -->
          <h4 class="text-h6 font-weight-bold mb-3">
            Parameter Request
          </h4>
          <VTable
            density="comfortable"
            class="border rounded-lg mb-6"
          >
            <thead>
              <tr>
                <th style="width: 180px;">
                  Parameter
                </th>
                <th style="width: 140px;">
                  Lokasi
                </th>
                <th style="width: 100px;">
                  Wajib
                </th>
                <th>Deskripsi &amp; Contoh</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>nim</code></td>
                <td>URL Path</td>
                <td>
                  <VChip
                    size="x-small"
                    color="error"
                    label
                  >
                    Wajib
                  </VChip>
                </td>
                <td>
                  NIM mahasiswa yang ingin dicek detail mata kuliahnya (contoh: <code>202585010009</code>).
                </td>
              </tr>
              <tr>
                <td><code>th_akademik_kode</code></td>
                <td>Query String</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  Filter kode tahun akademik tertentu jika mahasiswa memiliki pendaftaran di beberapa semester (contoh: <code>20251</code>).
                </td>
              </tr>
              <tr>
                <td><code>th_akademik_id</code></td>
                <td>Query String</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  Filter ID tahun akademik database SIMKEU (contoh: <code>24</code>).
                </td>
              </tr>
            </tbody>
          </VTable>

          <!-- Code Snippets Tab -->
          <h4 class="text-h6 font-weight-bold mb-3">
            Contoh Implementasi Kode
          </h4>
          <VCard
            variant="outlined"
            class="mb-6"
          >
            <VTabs
              v-model="activeSnippetTabDetail"
              density="compact"
              class="border-b"
            >
              <VTab value="curl">
                cURL
              </VTab>
              <VTab value="php-laravel">
                PHP (Laravel HTTP)
              </VTab>
              <VTab value="php-guzzle">
                PHP (Guzzle)
              </VTab>
              <VTab value="js">
                JavaScript / Node.js
              </VTab>
            </VTabs>

            <VCardText class="bg-var-theme-background pa-4">
              <div class="d-flex justify-end mb-2">
                <VBtn
                  size="x-small"
                  variant="text"
                  prepend-icon="ri-file-copy-line"
                  @click="copyToClipboard(
                    activeSnippetTabDetail === 'curl' ? detailCurlExample :
                    activeSnippetTabDetail === 'php-laravel' ? detailPhpLaravelExample :
                    activeSnippetTabDetail === 'php-guzzle' ? detailPhpGuzzleExample : detailJsExample,
                    'Contoh Kode'
                  )"
                >
                  Salin Kode
                </VBtn>
              </div>
              <pre
                class="text-body-2 font-monospace mb-0"
                style="overflow-x: auto; white-space: pre-wrap;"
              ><code>{{
                activeSnippetTabDetail === 'curl' ? detailCurlExample :
                activeSnippetTabDetail === 'php-laravel' ? detailPhpLaravelExample :
                activeSnippetTabDetail === 'php-guzzle' ? detailPhpGuzzleExample : detailJsExample
              }}</code></pre>
            </VCardText>
          </VCard>

          <!-- Response Example -->
          <h4 class="text-h6 font-weight-bold mb-3">
            Struktur Respon JSON (HTTP 200 OK)
          </h4>
          <VCard
            variant="outlined"
            class="mb-4"
          >
            <VCardText class="bg-var-theme-background pa-4">
              <div class="d-flex justify-end mb-2">
                <VBtn
                  size="x-small"
                  variant="text"
                  prepend-icon="ri-file-copy-line"
                  @click="copyToClipboard(sampleResponseDetailJson, 'Respon JSON')"
                >
                  Salin JSON
                </VBtn>
              </div>
              <pre
                class="text-body-2 font-monospace mb-0"
                style="max-height: 420px; overflow-y: auto; overflow-x: auto; white-space: pre-wrap;"
              ><code>{{ sampleResponseDetailJson }}</code></pre>
            </VCardText>
          </VCard>

          <VAlert
            type="info"
            variant="tonal"
            density="compact"
          >
            <strong>Informasi Lengkap MK:</strong> Array <code>data.mata_kuliah</code> menyajikan detail instan tanpa perlu lookup lanjutan: kode MK, nama MK, SKS, semester, nama dosen pengampu bergelar, ruang ujian/kelas, hari, dan jam kuliah.
          </VAlert>
        </div>

        <!-- Tab 3: GET /uas-susulan/jadwal-kuliah -->
        <div v-else-if="activeEndpointTab === 'jadwal-kuliah'">
          <div class="d-flex align-center justify-space-between flex-wrap gap-2 mb-4">
            <div class="d-flex align-center gap-2">
              <VChip
                color="success"
                label
                class="font-weight-bold"
              >
                GET
              </VChip>
              <code class="text-h6 font-weight-bold">/api/v1/integrations/siakad/uas-susulan/jadwal-kuliah</code>
              <VChip
                size="x-small"
                color="primary"
                variant="outlined"
              >
                Alias: /api/siakad/uas-susulan/jadwal-kuliah
              </VChip>
            </div>

            <VBtn
              size="small"
              variant="outlined"
              color="primary"
              prepend-icon="ri-file-copy-line"
              @click="copyToClipboard(`${baseUrl}/uas-susulan/jadwal-kuliah`, 'URL Endpoint Jadwal Kuliah')"
            >
              Salin URL
            </VBtn>
          </div>

          <p class="text-body-1 mb-4">
            Endpoint ini digunakan oleh SIAKAD untuk mengambil <strong>seluruh ID jadwal kuliah (<code>jadwal_kuliah_id</code>)</strong> yang saat ini terdaftar pada pendaftaran UAS Susulan di SIMKEU.
            Dilengkapi daftar array integer ID cepat (<code>jadwal_kuliah_ids</code>) serta objek detail tiap jadwal kuliah beserta nama mata kuliah, dosen, ruang, dan jumlah mahasiswa peserta.
          </p>

          <!-- Parameter Query Table -->
          <h4 class="text-h6 font-weight-bold mb-3">
            Parameter Query (GET Request)
          </h4>
          <VTable
            density="comfortable"
            class="border rounded-lg mb-6"
          >
            <thead>
              <tr>
                <th style="width: 180px;">
                  Parameter
                </th>
                <th style="width: 100px;">
                  Tipe
                </th>
                <th style="width: 100px;">
                  Wajib
                </th>
                <th>Deskripsi &amp; Contoh</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>only_ids</code></td>
                <td>Boolean</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  Kirim <code>1</code> atau <code>true</code> untuk respon kilat yang hanya berisi array integer <code>jadwal_kuliah_ids</code> tanpa detail mata kuliah.
                </td>
              </tr>
              <tr>
                <td><code>th_akademik_kode</code></td>
                <td>String</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  Filter kode tahun akademik SIMKEU (contoh: <code>20251</code>).
                </td>
              </tr>
              <tr>
                <td><code>th_akademik_id</code></td>
                <td>Integer</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  Filter ID tahun akademik database SIMKEU (contoh: <code>24</code>).
                </td>
              </tr>
              <tr>
                <td><code>jadwal_kuliah_id</code></td>
                <td>Integer</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  Filter mengecek apakah satu ID jadwal kuliah tertentu terdaftar di ujian susulan.
                </td>
              </tr>
              <tr>
                <td><code>nim</code></td>
                <td>String</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  Filter jadwal kuliah yang diambil oleh NIM mahasiswa tertentu.
                </td>
              </tr>
              <tr>
                <td><code>limit</code></td>
                <td>Integer</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  Batas pagination per halaman (default <code>0</code> / semua data).
                </td>
              </tr>
            </tbody>
          </VTable>

          <!-- Code Snippets Tab -->
          <h4 class="text-h6 font-weight-bold mb-3">
            Contoh Implementasi Kode
          </h4>
          <VCard
            variant="outlined"
            class="mb-6"
          >
            <VTabs
              v-model="activeSnippetTabJadwal"
              density="compact"
              class="border-b"
            >
              <VTab value="curl">
                cURL
              </VTab>
              <VTab value="php-laravel">
                PHP (Laravel HTTP)
              </VTab>
              <VTab value="php-guzzle">
                PHP (Guzzle)
              </VTab>
              <VTab value="js">
                JavaScript / Node.js
              </VTab>
            </VTabs>

            <VCardText class="bg-var-theme-background pa-4">
              <div class="d-flex justify-end mb-2">
                <VBtn
                  size="x-small"
                  variant="text"
                  prepend-icon="ri-file-copy-line"
                  @click="copyToClipboard(
                    activeSnippetTabJadwal === 'curl' ? jadwalCurlExample :
                    activeSnippetTabJadwal === 'php-laravel' ? jadwalPhpLaravelExample :
                    activeSnippetTabJadwal === 'php-guzzle' ? jadwalPhpGuzzleExample : jadwalJsExample,
                    'Contoh Kode'
                  )"
                >
                  Salin Kode
                </VBtn>
              </div>
              <pre
                class="text-body-2 font-monospace mb-0"
                style="overflow-x: auto; white-space: pre-wrap;"
              ><code>{{
                activeSnippetTabJadwal === 'curl' ? jadwalCurlExample :
                activeSnippetTabJadwal === 'php-laravel' ? jadwalPhpLaravelExample :
                activeSnippetTabJadwal === 'php-guzzle' ? jadwalPhpGuzzleExample : jadwalJsExample
              }}</code></pre>
            </VCardText>
          </VCard>

          <!-- Response Example -->
          <h4 class="text-h6 font-weight-bold mb-3">
            Struktur Respon JSON (HTTP 200 OK)
          </h4>
          <VCard
            variant="outlined"
            class="mb-4"
          >
            <VCardText class="bg-var-theme-background pa-4">
              <div class="d-flex justify-end mb-2">
                <VBtn
                  size="x-small"
                  variant="text"
                  prepend-icon="ri-file-copy-line"
                  @click="copyToClipboard(sampleResponseJadwalJson, 'Respon JSON')"
                >
                  Salin JSON
                </VBtn>
              </div>
              <pre
                class="text-body-2 font-monospace mb-0"
                style="max-height: 420px; overflow-y: auto; overflow-x: auto; white-space: pre-wrap;"
              ><code>{{ sampleResponseJadwalJson }}</code></pre>
            </VCardText>
          </VCard>

          <VAlert
            type="success"
            variant="tonal"
            density="compact"
          >
            <strong>Tips Pengecekan Cepat:</strong> SIAKAD dapat langsung mengambil property root <code>response.jadwal_kuliah_ids</code> yang berisi array integer ID, sehingga validasi apakah suatu jadwal susulan aktif dapat dilakukan secara O(1) tanpa perlu mengurai objek dalam array data.
          </VAlert>
        </div>

        <!-- Tab 4: Dokumentasi UAS Susulan (Legacy) -->
        <div v-else-if="activeEndpointTab === 'uas-susulan'">
          <div class="d-flex align-center justify-space-between flex-wrap gap-2 mb-4">
            <div class="d-flex align-center gap-2">
              <VChip
                color="info"
                label
                class="font-weight-bold"
              >
                GET
              </VChip>
              <code class="text-h6 font-weight-bold">/api/v1/integrations/siakad/uas-susulan</code>
            </div>

            <VBtn
              size="small"
              variant="outlined"
              color="primary"
              prepend-icon="ri-file-copy-line"
              @click="copyToClipboard(`${baseUrl}/uas-susulan`, 'URL Endpoint UAS Susulan')"
            >
              Salin URL
            </VBtn>
          </div>

          <p class="text-body-1 mb-4">
            Endpoint ini digunakan oleh SIAKAD untuk mengambil daftar mahasiswa yang telah mendaftar UAS Susulan di SIMKEU, lengkap dengan seluruh daftar ID mata kuliah (<code>jadwal_kuliah_id</code>) yang disusulkan.
            Bisa difilter berdasarkan <strong>NIM</strong>, <strong>Kode Tahun Akademik</strong>, <strong>ID Tahun Akademik</strong>, atau <strong>ID Jadwal Kuliah</strong>.
          </p>

          <!-- Parameter Query Table -->
          <h4 class="text-h6 font-weight-bold mb-3">
            Parameter Query (GET Request)
          </h4>
          <VTable
            density="comfortable"
            class="border rounded-lg mb-6"
          >
            <thead>
              <tr>
                <th style="width: 180px;">
                  Parameter
                </th>
                <th style="width: 100px;">
                  Tipe
                </th>
                <th style="width: 100px;">
                  Wajib
                </th>
                <th>Deskripsi &amp; Contoh</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>nim</code></td>
                <td>String</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  NIM mahasiswa yang ingin dicek. Bisa berupa satu NIM (<code>210101001</code>) atau beberapa NIM dipisah koma (<code>210101001,210101002</code>).
                </td>
              </tr>
              <tr>
                <td><code>th_akademik_kode</code></td>
                <td>String</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  Kode tahun akademik SIMKEU saat pendaftaran UAS Susulan (contoh: <code>20252</code> untuk semester genap 2025/2026).
                </td>
              </tr>
              <tr>
                <td><code>th_akademik_id</code></td>
                <td>Integer</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  ID internal tahun akademik di tabel SIMKEU (contoh: <code>25</code>).
                </td>
              </tr>
              <tr>
                <td><code>jadwal_kuliah_id</code></td>
                <td>Integer</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  Filter spesifik untuk mengecek apakah suatu jadwal kuliah tertentu didaftarkan pada UAS susulan.
                </td>
              </tr>
              <tr>
                <td><code>limit</code></td>
                <td>Integer</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  Jumlah data per halaman (default <code>20</code>). Kirim <code>0</code> atau <code>all</code> untuk seluruh data tanpa batas pagination.
                </td>
              </tr>
              <tr>
                <td><code>page</code></td>
                <td>Integer</td>
                <td>
                  <VChip
                    size="x-small"
                    color="secondary"
                    label
                  >
                    Opsional
                  </VChip>
                </td>
                <td>
                  Nomor halaman data pagination (default <code>1</code>).
                </td>
              </tr>
            </tbody>
          </VTable>

          <!-- Code Snippets Tab -->
          <h4 class="text-h6 font-weight-bold mb-3">
            Contoh Implementasi Kode
          </h4>
          <VCard
            variant="outlined"
            class="mb-6"
          >
            <VTabs
              v-model="activeSnippetTabUas"
              density="compact"
              class="border-b"
            >
              <VTab value="curl">
                cURL
              </VTab>
              <VTab value="php-laravel">
                PHP (Laravel HTTP)
              </VTab>
              <VTab value="php-guzzle">
                PHP (Guzzle)
              </VTab>
              <VTab value="js">
                JavaScript / Node.js
              </VTab>
            </VTabs>

            <VCardText class="bg-var-theme-background pa-4">
              <div class="d-flex justify-end mb-2">
                <VBtn
                  size="x-small"
                  variant="text"
                  prepend-icon="ri-file-copy-line"
                  @click="copyToClipboard(
                    activeSnippetTabUas === 'curl' ? curlExample :
                    activeSnippetTabUas === 'php-laravel' ? phpLaravelExample :
                    activeSnippetTabUas === 'php-guzzle' ? phpGuzzleExample : jsExample,
                    'Contoh Kode'
                  )"
                >
                  Salin Kode
                </VBtn>
              </div>
              <pre
                class="text-body-2 font-monospace mb-0"
                style="overflow-x: auto; white-space: pre-wrap;"
              ><code>{{
                activeSnippetTabUas === 'curl' ? curlExample :
                activeSnippetTabUas === 'php-laravel' ? phpLaravelExample :
                activeSnippetTabUas === 'php-guzzle' ? phpGuzzleExample : jsExample
              }}</code></pre>
            </VCardText>
          </VCard>

          <!-- Response Example -->
          <h4 class="text-h6 font-weight-bold mb-3">
            Struktur Respon JSON (HTTP 200 OK)
          </h4>
          <VCard
            variant="outlined"
            class="mb-4"
          >
            <VCardText class="bg-var-theme-background pa-4">
              <div class="d-flex justify-end mb-2">
                <VBtn
                  size="x-small"
                  variant="text"
                  prepend-icon="ri-file-copy-line"
                  @click="copyToClipboard(sampleResponseJson, 'Respon JSON')"
                >
                  Salin JSON
                </VBtn>
              </div>
              <pre
                class="text-body-2 font-monospace mb-0"
                style="max-height: 400px; overflow-y: auto; overflow-x: auto; white-space: pre-wrap;"
              ><code>{{ sampleResponseJson }}</code></pre>
            </VCardText>
          </VCard>
        </div>

        <!-- Tab 5: Live API Tester -->
        <div v-else-if="activeEndpointTab === 'live-test'">
          <h4 class="text-h6 font-weight-bold mb-2">
            Uji Coba Langsung Endpoint Integrasi
          </h4>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Pilih endpoint yang ingin diuji coba langsung ke server SIMKEU secara real-time.
          </p>

          <!-- Endpoint selector radio -->
          <div class="d-flex flex-wrap gap-4 mb-4">
            <VRadioGroup
              v-model="testEndpoint"
              inline
            >
              <VRadio
                label="GET /uas-susulan/peserta"
                value="peserta"
              />
              <VRadio
                label="GET /uas-susulan/peserta/{nim}/detail"
                value="peserta-detail"
              />
              <VRadio
                label="GET /uas-susulan/jadwal-kuliah"
                value="jadwal-kuliah"
              />
              <VRadio
                label="GET /uas-susulan (Legacy)"
                value="uas-susulan"
              />
            </VRadioGroup>
          </div>

          <VRow class="mb-4">
            <VCol
              v-if="testEndpoint !== 'jadwal-kuliah'"
              cols="12"
              md="4"
            >
              <VTextField
                v-model="testNim"
                :label="testEndpoint === 'peserta-detail' ? 'NIM Mahasiswa (Wajib untuk detail)' : 'Filter NIM Mahasiswa (Opsional)'"
                placeholder="Misal: 202585010009"
                density="compact"
                variant="outlined"
                clearable
              />
            </VCol>

            <VCol
              v-if="testEndpoint === 'jadwal-kuliah'"
              cols="12"
              md="3"
            >
              <VTextField
                v-model="testNim"
                label="Filter NIM Mahasiswa (Opsional)"
                placeholder="Misal: 202585010009"
                density="compact"
                variant="outlined"
                clearable
              />
            </VCol>

            <VCol
              cols="12"
              :md="testEndpoint === 'jadwal-kuliah' ? 3 : 4"
            >
              <VTextField
                v-model="testThAkademikKode"
                label="Filter Kode Th Akademik (Opsional)"
                placeholder="Misal: 20251"
                density="compact"
                variant="outlined"
                clearable
              />
            </VCol>

            <VCol
              v-if="testEndpoint !== 'peserta-detail'"
              cols="12"
              :md="testEndpoint === 'jadwal-kuliah' ? 2 : 2"
            >
              <VTextField
                v-model="testJadwalKuliahId"
                label="ID Jadwal Kuliah"
                placeholder="Misal: 6920"
                density="compact"
                variant="outlined"
                type="number"
                clearable
              />
            </VCol>

            <VCol
              v-if="testEndpoint !== 'peserta-detail'"
              cols="12"
              :md="testEndpoint === 'jadwal-kuliah' ? 2 : 2"
            >
              <VTextField
                v-model="testLimit"
                label="Limit Data"
                density="compact"
                variant="outlined"
                type="number"
              />
            </VCol>

            <VCol
              v-if="testEndpoint === 'jadwal-kuliah'"
              cols="12"
              md="2"
              class="d-flex align-center"
            >
              <VCheckbox
                v-model="testOnlyIds"
                label="only_ids (Cepat)"
                density="compact"
                hide-details
              />
            </VCol>
          </VRow>

          <div class="d-flex align-center gap-3 mb-6">
            <VBtn
              color="primary"
              :loading="testLoading"
              prepend-icon="ri-send-plane-line"
              @click="runLiveTest"
            >
              Kirim Request Uji Coba
            </VBtn>

            <VBtn
              color="secondary"
              variant="tonal"
              @click="testNim = ''; testThAkademikKode = ''; testJadwalKuliahId = ''; testOnlyIds = false; testResult = null"
            >
              Reset Form
            </VBtn>
          </div>

          <!-- Result Area -->
          <div v-if="testResult">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-subtitle-2 font-weight-bold">Hasil Respon SIMKEU:</span>
              <VChip
                :color="testResult.status ? 'success' : 'error'"
                size="small"
                label
              >
                Status: {{ testResult.status ? '200 OK' : 'Error' }}
              </VChip>
            </div>

            <VCard variant="outlined">
              <VCardText class="bg-var-theme-background pa-4">
                <pre
                  class="text-body-2 font-monospace mb-0"
                  style="max-height: 450px; overflow-y: auto; overflow-x: auto; white-space: pre-wrap;"
                ><code>{{ JSON.stringify(testResult, null, 2) }}</code></pre>
              </VCardText>
            </VCard>
          </div>
        </div>

        <!-- Tab 6: Katalog Endpoint BSI -->
        <div v-else-if="activeEndpointTab === 'bsi-reference'">
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <h4 class="text-h6 font-weight-bold mb-1">
                Katalog Endpoint Layanan BSI Virtual Account
              </h4>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Endpoint berikut menggunakan <strong>API Key yang sama</strong> untuk integrasi transaksi perbankan BSI SIAKAD.
              </p>
            </div>

            <VBtn
              to="admin-setting-bsi"
              variant="tonal"
              color="primary"
              append-icon="ri-arrow-right-line"
            >
              Buka Konfig BSI
            </VBtn>
          </div>

          <VTable class="border rounded-lg">
            <thead>
              <tr>
                <th style="width: 100px;">
                  Method
                </th>
                <th>Endpoint Path</th>
                <th>Fungsi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <VChip
                    color="info"
                    size="small"
                    label
                  >
                    GET
                  </VChip>
                </td>
                <td><code>/api/v1/integrations/siakad/bsi/payment-methods</code></td>
                <td>Mengambil daftar saluran pembayaran Virtual Account BSI yang aktif</td>
              </tr>
              <tr>
                <td>
                  <VChip
                    color="info"
                    size="small"
                    label
                  >
                    GET
                  </VChip>
                </td>
                <td><code>/api/v1/integrations/siakad/bsi/bills/{nim}</code></td>
                <td>Mengambil daftar tagihan mahasiswa yang siap dibayar via BSI VA</td>
              </tr>
              <tr>
                <td>
                  <VChip
                    color="info"
                    size="small"
                    label
                  >
                    GET
                  </VChip>
                </td>
                <td><code>/api/v1/integrations/siakad/bsi/payment-history/{nim}</code></td>
                <td>Mengambil riwayat pembayaran transaksi BSI mahasiswa</td>
              </tr>
              <tr>
                <td>
                  <VChip
                    color="primary"
                    size="small"
                    label
                  >
                    POST
                  </VChip>
                </td>
                <td><code>/api/v1/integrations/siakad/bsi/payment-orders</code></td>
                <td>Menerbitkan nomor Virtual Account BSI baru untuk tagihan yang dipilih</td>
              </tr>
              <tr>
                <td>
                  <VChip
                    color="error"
                    size="small"
                    label
                  >
                    POST
                  </VChip>
                </td>
                <td><code>/api/v1/integrations/siakad/bsi/payment-orders/{requestId}/cancel</code></td>
                <td>Membatalkan order Virtual Account yang masih berstatus pending</td>
              </tr>
            </tbody>
          </VTable>
        </div>
      </VCardText>
    </VCard>

    <!-- Dialog API Key Baru Dibuat -->
    <VDialog
      v-model="apiKeyDialog"
      max-width="600"
      persistent
    >
      <VCard>
        <VCardItem>
          <template #prepend>
            <VAvatar
              color="warning"
              variant="tonal"
              class="me-2"
            >
              <VIcon icon="ri-key-fill" />
            </VAvatar>
          </template>
          <VCardTitle class="text-h6 font-weight-bold">
            API Key SIAKAD Berhasil Dibuat!
          </VCardTitle>
          <VCardSubtitle>Simpan dan salin API key ini sekarang</VCardSubtitle>
        </VCardItem>

        <VCardText>
          <VAlert
            type="warning"
            variant="tonal"
            class="mb-4"
          >
            <strong>Penting:</strong> API key ini hanya ditampilkan <strong>satu kali saja</strong> demi keamanan.
            Jika Anda merotasi key, seluruh sistem SIAKAD (baik modul Ujian Susulan maupun BSI VA) harus diperbarui dengan key yang sama.
          </VAlert>

          <div class="bg-var-theme-background pa-4 rounded-lg border mb-3">
            <div class="text-caption text-medium-emphasis mb-1">
              PLAIN API KEY:
            </div>
            <code class="text-body-1 font-weight-bold text-break">
              {{ generatedApiKey }}
            </code>
          </div>
        </VCardText>

        <VCardActions class="pa-4 pt-0 d-flex justify-end gap-2">
          <VBtn
            color="secondary"
            variant="tonal"
            @click="apiKeyDialog = false"
          >
            Tutup
          </VBtn>
          <VBtn
            color="primary"
            prepend-icon="ri-file-copy-line"
            @click="copyToClipboard(generatedApiKey, 'API Key')"
          >
            Salin API Key
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
