<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const pageTitle = "Edit Pembayaran Semester Pendek";

const loading = ref(true);
const isSubmitting = ref(false);

// Data from API
const pembayaran = ref(null);
const krsData = ref(null);

// Editable fields
const jumlah = ref(0);
const tanggal = ref("");
const jenisPembayaranId = ref(null);

// Options
const listJenisPembayaran = ref([]);

const fetchJenisPembayaran = async () => {
  try {
    const res = await $api("/admin/pemasukan/mahasiswa/jenis-pembayaran", { method: "GET" });
    const items = res?.data?.data ?? res?.data ?? [];
    listJenisPembayaran.value = items.map((jp) => ({
      title: jp.nama + " - " + jp.kategori,
      value: jp.id,
    }));
  } catch (e) {
    console.error("Gagal load jenis pembayaran", e);
  }
};

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await $api(`/admin/pemasukan/mahasiswa/semester-pendek/${route.params.id}`, {
      method: "GET",
    });

    if (res.status === "true" && res.data) {
      pembayaran.value = res.data.pembayaran;
      krsData.value = res.data.krs;

      // Set editable fields
      jumlah.value = pembayaran.value.jumlah;
      jenisPembayaranId.value = pembayaran.value.jenis_pembayaran_id;
      // Format tanggal for date input (yyyy-MM-dd)
      if (pembayaran.value.tanggal) {
        tanggal.value = pembayaran.value.tanggal.substring(0, 10);
      }
    }
  } catch (error) {
    console.error("Gagal mengambil data detail", error);
  } finally {
    loading.value = false;
  }
};

const submitEdit = async () => {
  if (!jumlah.value || jumlah.value <= 0) {
    showSnackbar({ text: "Nominal pembayaran harus lebih dari 0.", color: "warning" });
    return;
  }
  if (!jenisPembayaranId.value) {
    showSnackbar({ text: "Silakan pilih Jenis Pembayaran.", color: "warning" });
    return;
  }

  isSubmitting.value = true;
  try {
    const res = await $api(`/admin/pemasukan/mahasiswa/semester-pendek/${route.params.id}`, {
      method: "PUT",
      body: {
        jumlah: jumlah.value,
        jenis_pembayaran_id: jenisPembayaranId.value,
        ...(tanggal.value && { tanggal: tanggal.value }),
      },
    });

    if (res.status === "true") {
      showSnackbar({ text: res.message, color: "success" });
      router.push("/admin/pemasukan/mahasiswa/semester-pendek");
    } else {
      showSnackbar({ text: res.message || "Gagal memperbarui.", color: "error" });
    }
  } catch (err) {
    const msg = err.data?.message || "Terjadi kesalahan pada server.";
    showSnackbar({ text: msg, color: "error" });
  } finally {
    isSubmitting.value = false;
  }
};

// Helpers
const formatRupiah = (val) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(val || 0);

const formatTanggal = (val) => {
  if (!val) return "-";
  return new Date(val).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

onMounted(() => {
  document.title = `${pageTitle} - SIMKEU`;
  fetchJenisPembayaran();
  fetchData();
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h4 class="text-h4 mb-1">{{ pageTitle }}</h4>
          <p class="text-body-1 text-medium-emphasis mb-0">
            Edit nominal, tanggal, dan jenis pembayaran.
          </p>
        </div>
        <VBtn
          color="secondary"
          variant="outlined"
          @click="router.push('/admin/pemasukan/mahasiswa/semester-pendek')"
        >
          <VIcon icon="ri-arrow-left-line" class="me-2" />
          Kembali
        </VBtn>
      </div>
    </VCol>

    <!-- Loading -->
    <VCol v-if="loading" cols="12">
      <div class="d-flex justify-center pa-10">
        <VProgressCircular indeterminate color="primary" />
      </div>
    </VCol>

    <template v-else-if="pembayaran">
      <VCol cols="12" md="7">
        <!-- Akademik Card -->
        <VCard class="mb-4">
          <VCardItem>
            <template #prepend>
              <VAvatar color="primary" variant="tonal" rounded="lg" size="38">
                <VIcon icon="ri-calendar-2-line" size="20" />
              </VAvatar>
            </template>
            <VCardTitle class="text-base">Akademik</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardText class="pa-0">
            <VList lines="one" density="compact">
              <VListItem>
                <template #title>
                  <span class="text-xs text-medium-emphasis">Periode</span>
                </template>
                <template #subtitle>
                  <span class="text-sm font-weight-semibold text-high-emphasis">
                    {{ krsData?.periode_semester_pendek?.periode ?? "-" }}
                  </span>
                </template>
              </VListItem>
              <VDivider />
              <VListItem>
                <template #title>
                  <span class="text-xs text-medium-emphasis">Tanggal Daftar KRS</span>
                </template>
                <template #subtitle>
                  <span class="text-sm font-weight-semibold text-high-emphasis">
                    {{ formatTanggal(krsData?.created_at) }}
                  </span>
                </template>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>

        <!-- Mahasiswa Card -->
        <VCard class="mb-4">
          <VCardItem>
            <template #prepend>
              <VAvatar color="info" variant="tonal" rounded="lg" size="38">
                <VIcon icon="ri-user-3-line" size="20" />
              </VAvatar>
            </template>
            <VCardTitle class="text-base">Mahasiswa</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardText class="pa-0">
            <VList lines="one" density="compact">
              <VListItem>
                <template #title>
                  <span class="text-xs text-medium-emphasis">NIM</span>
                </template>
                <template #subtitle>
                  <span class="text-sm font-weight-semibold text-high-emphasis">
                    {{ krsData?.nim ?? "-" }}
                  </span>
                </template>
              </VListItem>
              <VDivider />
              <VListItem>
                <template #title>
                  <span class="text-xs text-medium-emphasis">Nama</span>
                </template>
                <template #subtitle>
                  <span class="text-sm font-weight-semibold text-high-emphasis">
                    {{ krsData?.mhs_nama ?? "-" }}
                  </span>
                </template>
              </VListItem>
              <VDivider />
              <VListItem>
                <template #title>
                  <span class="text-xs text-medium-emphasis">Program Studi</span>
                </template>
                <template #subtitle>
                  <span class="text-sm font-weight-semibold text-high-emphasis">
                    {{ krsData?.prodi_nama ?? "-" }}
                    <span v-if="krsData?.prodi_alias" class="text-medium-emphasis">
                      ({{ krsData.prodi_alias }})
                    </span>
                  </span>
                </template>
              </VListItem>
              <VDivider />
              <VListItem>
                <template #title>
                  <span class="text-xs text-medium-emphasis">Jenis Kelamin</span>
                </template>
                <template #subtitle>
                  <span class="text-sm font-weight-semibold text-high-emphasis">
                    {{ krsData?.jk_nama ?? "-" }}
                  </span>
                </template>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Pembayaran (Editable) -->
      <VCol cols="12" md="5">
        <VCard>
          <VCardItem>
            <template #prepend>
              <VAvatar color="warning" variant="tonal" rounded="lg" size="38">
                <VIcon icon="ri-money-dollar-circle-line" size="20" />
              </VAvatar>
            </template>
            <VCardTitle class="text-base">Pembayaran</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardText>
            <!-- Nomor Transaksi (Read-only) -->
            <VTextField
              :model-value="pembayaran.nomor"
              label="Nomor Transaksi"
              variant="outlined"
              readonly
              disabled
              class="mb-4"
            />

            <!-- Tanggal (Editable) -->
            <VTextField
              v-model="tanggal"
              type="date"
              label="Tanggal"
              variant="outlined"
              class="mb-4"
            />

            <!-- Jenis Pembayaran (Editable) -->
            <VSelect
              v-model="jenisPembayaranId"
              :items="listJenisPembayaran"
              label="Jenis Pembayaran"
              variant="outlined"
              class="mb-4"
            />

            <!-- Nominal (Editable) -->
            <VTextField
              v-model.number="jumlah"
              type="number"
              label="Nominal Pembayaran (Rp)"
              variant="outlined"
              prefix="Rp"
              class="mb-4"
            />

            <VBtn
              color="primary"
              block
              size="large"
              :loading="isSubmitting"
              :disabled="isSubmitting"
              @click="submitEdit"
            >
              <VIcon icon="ri-save-line" class="me-2" />
              Simpan Perubahan
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </template>

    <!-- Error / Not Found -->
    <VCol v-else cols="12">
      <VAlert type="error" variant="tonal">
        Data pembayaran tidak ditemukan.
      </VAlert>
    </VCol>
  </VRow>
</template>
