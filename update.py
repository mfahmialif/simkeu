import re
import os

file_path = 'c:/laragon/www/simkeuv2/frontend/src/components/admin/pengeluaran/PengeluaranLpjDetail.vue'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# We want to replace LazyTextField with VTextField and add hint for fields matching nominal, transport*, barokah*
fields_to_update = [
    'row.nominal',
    'row.transport',
    'row.transport_motor',
    'row.transport_mobil',
    'row.barokah',
    'row.barokah_mengajar_biasa',
    'row.barokah_mengajar_double_degree',
    'row.barokah_uas',
    'row.barokah_sempro',
    'row.barokah_dosen_tetap',
    'row.barokah_struktural'
]

for field in fields_to_update:
    # Match <LazyTextField ... v-model="field" ... hide-details ... />
    # We replace <LazyTextField with <VTextField and replace hide-details with hide-details="auto" :hint="formatRupiah(field)" persistent-hint
    
    # Pattern 1: has hide-details
    pattern1 = r'(<LazyTextField\b[^>]*v-model="' + re.escape(field) + r'"[^>]*)hide-details([^>]*>)'
    
    def replacer1(m):
        if 'formatRupiah' in m.group(0):
            return m.group(0)
        # Replace LazyTextField with VTextField
        base = m.group(1).replace('<LazyTextField', '<VTextField')
        return base + 'hide-details="auto" :hint="formatRupiah(' + field + ')" persistent-hint' + m.group(2)
        
    content = re.sub(pattern1, replacer1, content)
    
    # Pattern 2: does not have hide-details but is a self-closing tag or not
    pattern2 = r'(<LazyTextField\b[^>]*v-model="' + re.escape(field) + r'"[^>]*?)(/?>)'
    def replacer2(m):
        if 'formatRupiah' in m.group(0):
            return m.group(0)
        if 'hide-details' in m.group(0):
            return m.group(0) # already handled or different
        base = m.group(1).replace('<LazyTextField', '<VTextField')
        return base + ' hide-details="auto" :hint="formatRupiah(' + field + ')" persistent-hint ' + m.group(2)
        
    content = re.sub(pattern2, replacer2, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Update complete")
