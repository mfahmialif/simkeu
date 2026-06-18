          <div class="lpj-list">
            <template v-if="isRumahTangga">
              <div
                v-for="(item, index) in displayItems"
                :key="item.key"
                class="lpj-item-group"
              >
                <div class="lpj-group-header">
                  <div class="expense-row-number">
                    {{ index + 1 }}
                  </div>
                  <div class="lpj-group-content">
                    <VRow>
                      <VCol cols="12" md="10">
                        <LazyTextField
                          v-model="item.kelompok_anggaran"
                          label="Kelompok Anggaran"
                          density="compact"
                          hide-details
                        />
                      </VCol>
                    </VRow>
                  </div>
                  <div class="lpj-group-actions">
                    <VTooltip text="Hapus kelompok">
                      <template #activator="{ props: tooltipProps }">
                        <VBtn
                          v-bind="tooltipProps"
                          icon="ri-delete-bin-line"
                          size="small"
                          variant="tonal"
                          color="error"
                          @click="removeGroup(index)"
                        />
                      </template>
                    </VTooltip>
                  </div>
                </div>

                <div class="lpj-group-items">
                  <div
                    v-for="(sub, subIndex) in item.subItems"
                    :key="sub.key"
                    class="lpj-row"
                  >
                    <div class="lpj-row-number">
                      {{ index + 1 }}.{{ subIndex + 1 }}
                    </div>
                    <div class="lpj-row-content">
                      <VRow>
                        <VCol cols="12" md="4">
                          <LazyTextField v-model="sub.nama_kegiatan" label="Uraian" density="compact" hide-details class="mb-3" />
                        </VCol>
                        <VCol cols="12" md="2">
                          <LazyTextField v-model="sub.tanggal" type="date" label="Tanggal" density="compact" hide-details class="mb-3" />
                        </VCol>
                        <VCol cols="12" md="2">
                          <VTextField v-model="sub.volume" type="number" min="0" label="Volume" density="compact" hide-details="auto" class="mb-3" />
                        </VCol>
                        <VCol cols="12" md="2">
                          <LazyTextField v-model="sub.satuan" label="Satuan" density="compact" hide-details class="mb-3" />
                        </VCol>
                        <VCol cols="12" md="2">
                          <VTextField v-model="sub.nominal" type="number" min="0" label="Harga Satuan" density="compact" hide-details="auto" :hint="formatRupiah(sub.nominal)" persistent-hint class="mb-3" />
                        </VCol>
                        <VCol cols="12" md="2" class="d-none">
                          <VTextField v-model="sub.jumlah" type="number" min="0" label="Kali" density="compact" hide-details="auto" class="mb-3" />
                        </VCol>
                        <VCol cols="12" md="2">
                          <VSelect v-model="sub.jenis_pembayaran" label="Pembayaran" :items="paymentItems(sub)" density="compact" hide-details />
                        </VCol>
                        <VCol cols="12" md="4">
                          <LazyTextField v-model="sub.keterangan" label="Keterangan" density="compact" hide-details class="mb-3" />
                        </VCol>
                        <VCol cols="12" md="6">
                          <PengeluaranLampiranInput v-model="sub.lampiran" v-model:removed="sub.removed_lampiran" :existing="sub.existing_lampiran" />
                        </VCol>
                      </VRow>
                    </div>
                    <div class="lpj-row-actions">
                      <VTooltip text="Tambah baris">
                        <template #activator="{ props: tooltipProps }">
                          <VBtn v-bind="tooltipProps" icon="ri-add-line" size="small" variant="tonal" color="primary" @click="addSubItem(index, subIndex)" />
                        </template>
                      </VTooltip>
                      <VTooltip text="Duplikat baris">
                        <template #activator="{ props: tooltipProps }">
                          <VBtn v-bind="tooltipProps" icon="ri-file-copy-line" size="small" variant="tonal" color="info" @click="duplicateSubItem(index, subIndex)" />
                        </template>
                      </VTooltip>
                      <VTooltip text="Hapus baris">
                        <template #activator="{ props: tooltipProps }">
                          <VBtn v-bind="tooltipProps" icon="ri-delete-bin-line" size="small" variant="tonal" color="error" @click="removeSubItem(index, subIndex)" />
                        </template>
                      </VTooltip>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template v-else>
              <div
                v-for="(row, index) in displayRows"
                :key="row.key"
                class="lpj-row"
              >
                <div class="lpj-row-number">
                  {{ index + 1 }}
                </div>
                <div class="lpj-row-content">
                  <VRow v-if="isKegiatan">
                    <VCol cols="12" md="2">
                      <VSelect v-model="row.kategori_detail" label="Kategori" :items="[{ title: 'Pegawai', value: 'pegawai' }, { title: 'Non Pegawai', value: 'non_pegawai' }, { title: 'Mahasiswa', value: 'mahasiswa' }]" density="compact" hide-details class="mb-3" @update:model-value="row.pegawai_id = null" />
                    </VCol>
                    <VCol cols="12" md="2">
                      <LazyTextField v-model="row.tanggal" type="date" label="Tanggal" density="compact" hide-details class="mb-3" />
                    </VCol>
                    <VCol cols="12" md="8" v-if="isPegawaiKegiatan(row)">
                      <VAutocomplete v-model="row.pegawai_id" label="Pegawai" :items="pegawaiItems" item-title="display" item-value="id" density="compact" hide-details class="mb-3" clearable />
                    </VCol>
                    
                    <template v-if="isPegawaiKegiatan(row)">
                      <VCol cols="12" md="3">
                        <VTextField v-model="row.transport" type="number" min="0" label="Transport" density="compact" hide-details="auto" :hint="formatRupiah(row.transport)" persistent-hint class="mb-3" />
                      </VCol>
                      <VCol cols="12" md="3">
                        <VTextField v-model="row.barokah" type="number" min="0" label="Barokah" density="compact" hide-details="auto" :hint="formatRupiah(row.barokah)" persistent-hint class="mb-3" />
                      </VCol>
                    </template>
                    <template v-else>
                      <VCol cols="12" md="3">
                        <VTextField v-model="row.nominal" type="number" min="0" label="Nominal" density="compact" hide-details="auto" :hint="formatRupiah(row.nominal)" persistent-hint class="mb-3" />
                      </VCol>
                      <VCol cols="12" md="3">
                        <LazyTextField v-model="row.nama_kegiatan" label="Uraian Pengeluaran" density="compact" hide-details class="mb-3" />
                      </VCol>
                      <VCol cols="12" md="2">
                        <LazyTextField v-model="row.keterangan" label="Keterangan" density="compact" hide-details class="mb-3" />
                      </VCol>
                    </template>

                    <VCol cols="12" md="2" v-if="isPegawaiKegiatan(row)">
                      <VSelect v-model="row.jenis_pembayaran" label="Pembayaran" :items="paymentItems(row)" density="compact" hide-details />
                    </VCol>
                    
                    <VCol cols="12" md="4" v-if="isPegawaiKegiatan(row)">
                      <LazyTextField v-model="row.keterangan" label="Keterangan" density="compact" hide-details class="mb-3" />
                    </VCol>

                    <VCol cols="12" md="6">
                      <PengeluaranLampiranInput v-model="row.lampiran" v-model:removed="row.removed_lampiran" :existing="row.existing_lampiran" />
                    </VCol>
                  </VRow>

                  <VRow v-else-if="isTatapmuka">
                    <VCol cols="12" md="2">
                      <LazyTextField v-model="row.tanggal" type="date" label="Tanggal" density="compact" hide-details class="mb-3" />
                    </VCol>
                    <VCol cols="12" md="10">
                      <VAutocomplete v-model="row.pegawai_id" label="Pegawai" :items="pegawaiItems" item-title="display" item-value="id" density="compact" hide-details class="mb-3" clearable />
                    </VCol>

                    <VCol cols="12" md="2">
                      <LazyTextField v-model="row.hari_transport_motor" type="number" min="0" label="Hari Motor" density="compact" hide-details class="mb-3" />
                    </VCol>
                    <VCol cols="12" md="2">
                      <VTextField v-model="row.transport_motor" type="number" min="0" label="Transport Motor" density="compact" hide-details="auto" :hint="formatRupiah(row.transport_motor)" persistent-hint class="mb-3" />
                    </VCol>

                    <VCol cols="12" md="2">
                      <LazyTextField v-model="row.hari_transport_mobil" type="number" min="0" label="Hari Mobil" density="compact" hide-details class="mb-3" />
                    </VCol>
                    <VCol cols="12" md="2">
                      <VTextField v-model="row.transport_mobil" type="number" min="0" label="Transport Mobil" density="compact" hide-details="auto" :hint="formatRupiah(row.transport_mobil)" persistent-hint class="mb-3" />
                    </VCol>
                    
                    <VCol cols="12" md="2">
                      <LazyTextField v-model="row.jam" type="number" min="0" label="Jam" density="compact" hide-details class="mb-3" />
                    </VCol>
                    <VCol cols="12" md="2">
                      <VTextField v-model="row.barokah_mengajar_biasa" type="number" min="0" label="Barokah Mengajar" density="compact" hide-details="auto" :hint="formatRupiah(row.barokah_mengajar_biasa)" persistent-hint class="mb-3" />
                    </VCol>

                    <VCol cols="12" md="2">
                      <LazyTextField v-model="row.jam_mengajar_double_degree" type="number" min="0" label="Jam DD" density="compact" hide-details class="mb-3" />
                    </VCol>
                    <VCol cols="12" md="2">
                      <VTextField v-model="row.barokah_mengajar_double_degree" type="number" min="0" label="Barokah DD" density="compact" hide-details="auto" :hint="formatRupiah(row.barokah_mengajar_double_degree)" persistent-hint class="mb-3" />
                    </VCol>

                    <VCol cols="12" md="2">
                      <LazyTextField v-model="row.jumlah_kegiatan_uas" type="number" min="0" label="Jml UAS" density="compact" hide-details class="mb-3" />
                    </VCol>
                    <VCol cols="12" md="2">
                      <VTextField v-model="row.barokah_uas" type="number" min="0" label="Barokah UAS" density="compact" hide-details="auto" :hint="formatRupiah(row.barokah_uas)" persistent-hint class="mb-3" />
                    </VCol>

                    <VCol cols="12" md="2">
                      <LazyTextField v-model="row.jumlah_kegiatan_sempro" type="number" min="0" label="Jml Sempro" density="compact" hide-details class="mb-3" />
                    </VCol>
                    <VCol cols="12" md="2">
                      <VTextField v-model="row.barokah_sempro" type="number" min="0" label="Barokah Sempro" density="compact" hide-details="auto" :hint="formatRupiah(row.barokah_sempro)" persistent-hint class="mb-3" />
                    </VCol>
                    
                    <VCol cols="12" md="2">
                      <VSelect v-model="row.jenis_pembayaran" label="Pembayaran" :items="paymentItems(row)" density="compact" hide-details />
                    </VCol>
                    <VCol cols="12" md="4">
                      <LazyTextField v-model="row.keterangan" label="Keterangan" density="compact" hide-details class="mb-3" />
                    </VCol>
                    <VCol cols="12" md="6">
                      <PengeluaranLampiranInput v-model="row.lampiran" v-model:removed="row.removed_lampiran" :existing="row.existing_lampiran" />
                    </VCol>
                  </VRow>

                  <VRow v-else-if="isTransportasi">
                    <VCol cols="12" md="2">
                      <LazyTextField v-model="row.tanggal" type="date" label="Tanggal" density="compact" hide-details class="mb-3" />
                    </VCol>
                    <VCol cols="12" md="5">
                      <LazyTextField v-model="row.nama_kegiatan" label="Uraian" density="compact" hide-details class="mb-3" />
                    </VCol>
                    <VCol cols="12" md="5">
                      <LazyTextField v-model="row.tujuan" label="Tujuan" density="compact" hide-details class="mb-3" />
                    </VCol>

                    <VCol cols="12" md="2">
                      <VTextField v-model="row.volume" type="number" min="0" label="Volume" density="compact" hide-details="auto" class="mb-3" />
                    </VCol>
                    <VCol cols="12" md="2">
                      <LazyTextField v-model="row.satuan" label="Satuan" density="compact" hide-details class="mb-3" />
                    </VCol>
                    <VCol cols="12" md="3">
                      <VTextField v-model="row.nominal" type="number" min="0" label="Harga Satuan" density="compact" hide-details="auto" :hint="formatRupiah(row.nominal)" persistent-hint class="mb-3" />
                    </VCol>
                    
                    <VCol cols="12" md="2" class="d-none">
                      <VTextField v-model="row.jumlah" type="number" min="0" label="Kali" density="compact" hide-details="auto" class="mb-3" />
                    </VCol>
                    
                    <VCol cols="12" md="3">
                      <VSelect v-model="row.prioritas" label="Prioritas" :items="['Rutin', 'Sedang', 'Mendesak']" density="compact" hide-details class="mb-3" />
                    </VCol>

                    <VCol cols="12" md="2">
                      <VSelect v-model="row.jenis_pembayaran" label="Pembayaran" :items="paymentItems(row)" density="compact" hide-details />
                    </VCol>
                    <VCol cols="12" md="4">
                      <LazyTextField v-model="row.keterangan" label="Keterangan" density="compact" hide-details class="mb-3" />
                    </VCol>
                    <VCol cols="12" md="6">
                      <PengeluaranLampiranInput v-model="row.lampiran" v-model:removed="row.removed_lampiran" :existing="row.existing_lampiran" />
                    </VCol>
                  </VRow>

                  <VRow v-else-if="isDosenBulanan">
                    <VCol cols="12" md="2">
                      <LazyTextField v-model="row.tanggal" type="date" label="Tanggal" density="compact" hide-details class="mb-3" />
                    </VCol>
                    <VCol cols="12" md="10">
                      <VAutocomplete v-model="row.pegawai_id" label="Pegawai" :items="pegawaiItems" item-title="display" item-value="id" density="compact" hide-details class="mb-3" clearable />
                    </VCol>

                    <VCol cols="12" md="4">
                      <VTextField v-model="row.nominal" type="number" min="0" label="Nominal Barokah" density="compact" hide-details="auto" :hint="formatRupiah(row.nominal)" persistent-hint class="mb-3" />
                    </VCol>
                    <VCol cols="12" md="2">
                      <VSelect v-model="row.jenis_pembayaran" label="Pembayaran" :items="paymentItems(row)" density="compact" hide-details />
                    </VCol>
                    <VCol cols="12" md="6">
                      <LazyTextField v-model="row.keterangan" label="Keterangan" density="compact" hide-details class="mb-3" />
                    </VCol>

                    <VCol cols="12" md="12">
                      <PengeluaranLampiranInput v-model="row.lampiran" v-model:removed="row.removed_lampiran" :existing="row.existing_lampiran" />
                    </VCol>
                  </VRow>
                  
                  <VRow v-else>
                    <VCol cols="12" md="2">
                      <LazyTextField v-model="row.tanggal" type="date" label="Tanggal" density="compact" hide-details class="mb-3" />
                    </VCol>
                    <VCol cols="12" md="10">
                      <LazyTextField v-model="row.nama_kegiatan" label="Uraian" density="compact" hide-details class="mb-3" />
                    </VCol>
                    
                    <VCol cols="12" md="4">
                      <VTextField v-model="row.nominal" type="number" min="0" label="Harga Satuan" density="compact" hide-details="auto" :hint="formatRupiah(row.nominal)" persistent-hint class="mb-3" />
                    </VCol>
                    <VCol cols="12" md="2">
                      <VSelect v-model="row.jenis_pembayaran" label="Pembayaran" :items="paymentItems(row)" density="compact" hide-details />
                    </VCol>
                    <VCol cols="12" md="6">
                      <LazyTextField v-model="row.keterangan" label="Keterangan" density="compact" hide-details class="mb-3" />
                    </VCol>

                    <VCol cols="12" md="12">
                      <PengeluaranLampiranInput v-model="row.lampiran" v-model:removed="row.removed_lampiran" :existing="row.existing_lampiran" />
                    </VCol>
                  </VRow>
                </div>

                <div class="lpj-row-actions">
                  <VTooltip text="Tambah baris">
                    <template #activator="{ props: tooltipProps }">
                      <VBtn v-bind="tooltipProps" icon="ri-add-line" size="small" variant="tonal" color="primary" @click="addRow(index)" />
                    </template>
                  </VTooltip>
                  <VTooltip text="Duplikat baris">
                    <template #activator="{ props: tooltipProps }">
                      <VBtn v-bind="tooltipProps" icon="ri-file-copy-line" size="small" variant="tonal" color="info" @click="duplicateRow(index)" />
                    </template>
                  </VTooltip>
                  <VTooltip text="Hapus baris">
                    <template #activator="{ props: tooltipProps }">
                      <VBtn v-bind="tooltipProps" icon="ri-delete-bin-line" size="small" variant="tonal" color="error" @click="removeRow(index)" />
                    </template>
                  </VTooltip>
                </div>
              </div>
            </template>
          </div>
