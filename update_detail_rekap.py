import os

filepath = 'c:/laragon/www/simkeuv2/frontend/src/components/admin/pengeluaran/PengeluaranRekapDetail.vue'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
if 'PengeluaranLampiranList' not in content:
    content = content.replace(
        'import { formatRupiah } from "@/composables/formatRupiah"',
        'import { formatRupiah } from "@/composables/formatRupiah"\nimport PengeluaranLampiranList from "@/components/admin/pengeluaran/PengeluaranLampiranList.vue"'
    )

# 2. Add header
if '{ title: "Lampiran", key: "lampiran", sortable: false }' not in content:
    content = content.replace(
        '{ title: "Keterangan", key: "keterangan" },',
        '{ title: "Keterangan", key: "keterangan" },\n    { title: "Lampiran", key: "lampiran", sortable: false },'
    )

# 3. Add table slot
slot_addition = """
            <template #item.keterangan="{ item }">
              {{ item.keterangan || "-" }}
            </template>

            <template #item.lampiran="{ item }">
              <PengeluaranLampiranList :items="item.lampiran || []" />
            </template>"""

content = content.replace(
    """            <template #item.keterangan="{ item }">
              {{ item.keterangan || "-" }}
            </template>""",
    slot_addition
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated PengeluaranRekapDetail.vue")
