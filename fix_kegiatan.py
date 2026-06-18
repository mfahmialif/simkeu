import sys

with open('src/components/admin/pengeluaran/PengeluaranLpjDetail.vue', 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find('<VRow v-if="isKegiatan">')
end = content.find('<VRow v-else-if="isTatapmuka">')

if start == -1 or end == -1:
    print("Could not find start or end tags")
    sys.exit(1)

new_block = """<VRow v-if="isKegiatan">
                    <VCol cols="12" md="2">
                      <VSelect v-model="row.kategori_detail" label="Kategori *" :items="[{ title: 'Pegawai', value: 'pegawai' }, { title: 'Non Pegawai', value: 'non_pegawai' }, { title: 'Mahasiswa', value: 'mahasiswa' }]" density="compact" hide-details class="mb-3" @update:model-value="row.pegawai_id = null" />
                    </VCol>

                    <VCol cols="12" md="2">
                      <AppDateTimePicker v-model="row.tanggal" label="Tanggal *" :config="{ altInput: true, altFormat: 'd F Y', dateFormat: 'Y-m-d' }" density="compact" hide-details class="mb-3" />
                    </VCol>

                    <VCol v-if="isPegawaiKegiatan(row)" cols="12" md="8">
                      <VAutocomplete v-model="row.pegawai_id" :items="pegawaiItems" item-title="display" item-value="id" label="Pegawai *" auto-select-first clearable density="compact" hide-details class="mb-3" />
                    </VCol>

                    <template v-if="isPegawaiKegiatan(row)">
                      <VCol cols="12" md="2">
                        <VTextField v-model="row.transport" type="number" min="0" label="Transport" density="compact" hide-details="auto" :hint="formatRupiah(row.transport || 0)" persistent-hint class="mb-3" />
                      </VCol>

                      <VCol cols="12" md="2">
                        <VTextField v-model="row.barokah" type="number" min="0" label="Barokah" density="compact" hide-details="auto" :hint="formatRupiah(row.barokah || 0)" persistent-hint class="mb-3" />
                      </VCol>
                    </template>

                    <VCol v-else cols="12" md="3">
                      <VTextField v-model="row.nominal" type="number" min="0" label="Nominal *" density="compact" hide-details="auto" :hint="formatRupiah(row.nominal || 0)" persistent-hint class="mb-3" />
                    </VCol>

                    <VCol v-if="!isPegawaiKegiatan(row)" cols="12" md="3">
                      <LazyTextField v-model="row.nama_kegiatan" label="Uraian Pengeluaran" density="compact" hide-details class="mb-3" />
                    </VCol>

                    <VCol v-if="!isPegawaiKegiatan(row)" cols="12" md="2">
                      <LazyTextField v-model="row.keterangan" label="Keterangan" density="compact" hide-details class="mb-3" />
                    </VCol>

                    <VCol cols="12" md="2">
                      <VSelect v-model="row.jenis_pembayaran" label="Pembayaran *" :items="paymentItems(row)" density="compact" hide-details class="mb-3" @update:model-value="row.bukti_transfer = null" />
                    </VCol>

                    <VCol v-if="row.jenis_pembayaran === 'Transfer'" cols="12" md="3">
                      <VFileInput v-model="row.bukti_transfer" label="Bukti Transfer" accept="image/png, image/jpeg, application/pdf" :prepend-icon="null" density="compact" hide-details class="mb-3" />
                    </VCol>

                    <VCol v-if="row.existing_bukti_transfer_url && row.jenis_pembayaran === 'Transfer'" cols="12" md="3">
                      <VBtn variant="outlined" color="primary" prepend-icon="ri-file-paper-2-line" :href="row.existing_bukti_transfer_url" target="_blank" rel="noopener noreferrer" class="w-100 mb-3" density="compact">
                        Bukti Lama
                      </VBtn>
                    </VCol>

                    <VCol v-if="isPegawaiKegiatan(row)" cols="12" :md="row.jenis_pembayaran === 'Transfer' ? 3 : 6">
                      <LazyTextField v-model="row.keterangan" label="Keterangan" density="compact" hide-details class="mb-3" />
                    </VCol>

                    <VCol cols="12" md="10">
                      <PengeluaranLampiranInput v-model="row.lampiran" v-model:removed-lampiran="row.removed_lampiran" :existing-lampiran="row.existing_lampiran" />
                    </VCol>

                    <VCol cols="12" md="2">
                      <VTextField :model-value="formatRupiah(rowTotal(row))" label="Total" readonly variant="plain" class="text-right font-weight-bold" density="compact" hide-details />
                    </VCol>
                  </VRow>

                  """

new_content = content[:start] + new_block + content[end:]

with open('src/components/admin/pengeluaran/PengeluaranLpjDetail.vue', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Replacement successful")
