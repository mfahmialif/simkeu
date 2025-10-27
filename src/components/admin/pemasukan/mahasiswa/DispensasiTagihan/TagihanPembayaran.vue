<script setup>
import { watch } from 'vue';

const props = defineProps({
    mahasiswa: {
        type: Object,
        required: true,
        default: () => ({}),
    },
});

const tagihan = ref([]);
const selectedTagihan = ref();
const loadingTagihan = ref(false);

const fetchTagihan = async (nim) => {
    try {
        loadingTagihan.value = true;
        tagihan.value = [];
        const res = await $api(`/admin/pemasukan/mahasiswa/cek-tagihan`, {
            method: "GET",
            body: {
                nim: nim,
            },
        });

        tagihan.value = res.data.list_tagihan.map((item) => ({
            ...item,
            display: `${item.nama} - Rp.${item.sisa}${item.dibayar > 0 ? " (Dibayar: Rp." + item.dibayar + ")" : ""
                }`,
        }));
    } catch (error) {
        showSnackbar({
            text: error,
            color: "error",
        });
    } finally {
        loadingTagihan.value = false;
    }
};

defineExpose({ fetchTagihan })

/** Daftar baris yang dipilih */

const rows = ref([]);

/** Saat memilih dari combobox, tambahkan ke daftar bila belum ada */
function onSelectTagihan(val) {
    // Jika combobox dikosongkan
    if (!val) return;

    // Temukan objek lengkap (kalau yang terisi hanya id)
    const item =
        typeof val === "object" ? val : tagihan.value.find((t) => t.id === val);

    if (!item) return;

    // Cegah duplikat
    if (rows.value.some((r) => r.id === item.id)) {
        selectedTagihan.value = null;
        return;
    }

    rows.value.push({
        id: item.id,
        display: item.display,
        nominal: item.sisa ?? 0,
        dibayar: item.sisa ?? 0, // default isi penuh
        deposit: 0,
    });

    // kosongkan combobox setelah tambah
    selectedTagihan.value = null;
}

/** Hapus baris */
function removeRow(id) {
    rows.value = rows.value.filter((r) => r.id !== id);
}

/** Recalc per-baris (jika ingin batasan tidak melewati nominal bisa diaktifkan) */
function recalc(idx) {
    const r = rows.value[idx]
    r.dibayar = Math.max(0, Number(r.dibayar || 0))
    r.deposit = Math.max(0, Number(r.deposit || 0))
    r.dibayar = Math.min(r.dibayar, r.nominal)
    const dipakai = Number(props.mahasiswa?.dipakai || 0)
    const totalDepositLain = rows.value.reduce((sum, row, i) => {
        return i === idx ? sum : sum + (Number(row.deposit) || 0)
    }, 0)
    const sisaPlafon = Math.max(0, dipakai - totalDepositLain)
    r.deposit = Math.min(r.deposit, sisaPlafon)
    const sisaNominal = Math.max(0, r.nominal - r.dibayar)
    r.deposit = Math.min(r.deposit, sisaNominal)
}

/** Ringkasan */
const totalDibayar = computed(() =>
    rows.value.reduce((sum, r) => sum + (Number(r.dibayar) || 0), 0)
);
const totalDeposit = computed(() =>
    rows.value.reduce((sum, r) => sum + (Number(r.deposit) || 0), 0)
);
const totalSemua = computed(() => totalDibayar.value + totalDeposit.value);

watch(rows, () => {
    props.mahasiswa.tagihan = rows;
}, { deep: true });
</script>

<template>
    <!-- Pembayaran -->
    <VCard class="mt-4" title="Pembayaran">
        <VCardText>
            <VRow>
                <VCol cols="12">
                    <VCombobox v-model="selectedTagihan" :items="tagihan" label="Tagihan" item-title="display" clearable
                        :loading="loadingTagihan" @update:modelValue="onSelectTagihan" />
                </VCol>
            </VRow>
        </VCardText>
        <VCardText>
            <VRow v-for="(row, idx) in rows" :key="row.id" class="align-center">
                <VCol cols="12" md="6">
                    <VTextField :model-value="row.display" label="Tagihan" variant="outlined" density="comfortable"
                        readonly hint="Tagihan yang dipilih" persistent-hint />
                </VCol>

                <VCol cols="12" md="3">
                    <VTextField v-model.number="row.dibayar" label="Dibayar" type="number" min="0" variant="outlined"
                        density="comfortable" :hint="formatRupiah(row.dibayar)" persistent-hint
                        @update:modelValue="recalc(idx)" />
                </VCol>

                <VCol cols="12" md="2">
                    <VTextField v-model.number="row.deposit" label="Deposit" type="number" min="0" variant="outlined"
                        density="comfortable" :hint="formatRupiah(row.deposit)" persistent-hint
                        @update:modelValue="recalc(idx)" />
                </VCol>

                <VCol cols="12" md="1" class="d-flex mb-5">
                    <VBtn color="error" icon="ri-delete-bin-line" variant="elevated" class="ml-auto"
                        @click="removeRow(row.id)" :aria-label="`Hapus ${row.display}`" hint="delete" persistent-hint />
                </VCol>
            </VRow>

            <div v-if="rows.length === 0" class="text-medium-emphasis text-center py-6">
                Belum ada tagihan yang dipilih.
            </div>
        </VCardText>
    </VCard>

    <!-- Total -->
    <VCard class="mt-4" title="Total">
        <VCardText>
            <VRow>
                <VCol cols="12" md="6">
                    <VTextField :model-value="formatRupiah(totalDibayar)" label="Total Dibayar" variant="outlined"
                        readonly />
                </VCol>
                <VCol cols="12" md="6">
                    <VTextField :model-value="formatRupiah(totalDeposit)" label="Total Deposit" variant="outlined"
                        readonly />
                </VCol>
                <VCol cols="12">
                    <VTextField :model-value="formatRupiah(totalSemua)" label="Total Dibayar + Deposit"
                        variant="outlined" readonly />
                </VCol>
            </VRow>
        </VCardText>
    </VCard>
</template>
