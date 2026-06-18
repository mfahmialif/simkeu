import os
import re

directory = 'c:/laragon/www/simkeuv2/frontend/src/pages/admin/pengeluaran'

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

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.vue'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            original_content = content
            
            for field in fields_to_update:
                # Pattern 1: has hide-details
                pattern1 = r'(<LazyTextField\b[^>]*v-model="' + re.escape(field) + r'"[^>]*)hide-details([^>]*>)'
                def replacer1(m):
                    if 'formatRupiah' in m.group(0):
                        return m.group(0)
                    base = m.group(1).replace('<LazyTextField', '<VTextField')
                    return base + 'hide-details="auto" :hint="formatRupiah(' + field + ' || 0)" persistent-hint' + m.group(2)
                content = re.sub(pattern1, replacer1, content)
                
                # Pattern 2: does not have hide-details
                pattern2 = r'(<LazyTextField\b[^>]*v-model="' + re.escape(field) + r'"[^>]*?)(/?>)'
                def replacer2(m):
                    if 'formatRupiah' in m.group(0):
                        return m.group(0)
                    if 'hide-details' in m.group(0):
                        return m.group(0)
                    base = m.group(1).replace('<LazyTextField', '<VTextField')
                    return base + ' hide-details="auto" :hint="formatRupiah(' + field + ' || 0)" persistent-hint ' + m.group(2)
                content = re.sub(pattern2, replacer2, content)
                
            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {filepath}")
