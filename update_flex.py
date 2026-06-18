import os

files_to_update = [
    'c:/laragon/www/simkeuv2/frontend/src/pages/admin/pengeluaran/rumah-tangga/add/index.vue',
    'c:/laragon/www/simkeuv2/frontend/src/pages/admin/pengeluaran/sarana-prasarana/add/index.vue',
]

for filepath in files_to_update:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # The div wrapping volume and harga satuan
        # Before: <div class="d-flex gap-2">
        # After: <div class="d-flex gap-2 align-start">
        # Let's target the exact div that wraps volume and nominal
        
        # We can find `<div class="d-flex gap-2">` right before `<LazyTextField` or `<VTextField` for `row.volume`
        
        new_content = content.replace('<div class="d-flex gap-2">\n                        <LazyTextField\n                          v-model="row.volume"', '<div class="d-flex gap-2 align-start">\n                        <LazyTextField\n                          v-model="row.volume"')
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
        else:
            print(f"No changes needed for {filepath} or pattern not found")
