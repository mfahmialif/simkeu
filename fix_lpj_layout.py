import os

filepath = 'c:/laragon/www/simkeuv2/frontend/src/components/admin/pengeluaran/PengeluaranLpjDetail.vue'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the desktop grid definition
content = content.replace(
    'grid-template-columns: 38px minmax(0, 1fr) 40px;',
    'grid-template-columns: minmax(0, 1fr) auto;\n    gap: 16px;'
)

# Replace the mobile grid definition
content = content.replace(
    'grid-template-columns: 32px minmax(0, 1fr);',
    'grid-template-columns: minmax(0, 1fr);'
)

# Fix the grid-column: 2 in mobile actions
content = content.replace(
    """    .lpj-row-actions {
      grid-column: 2;
    }""",
    """    .lpj-row-actions {
      grid-column: 1;
      justify-self: end;
    }"""
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed CSS layout for lpj-row in PengeluaranLpjDetail.vue")
