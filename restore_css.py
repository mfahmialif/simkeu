import sys

filepath = 'src/components/admin/pengeluaran/PengeluaranLpjDetail.vue'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'grid-template-columns: minmax(0, 1fr) auto;',
    'grid-template-columns: 38px minmax(0, 1fr) auto;'
)

# And make sure .lpj-group-header is defined. It wasn't before.
if '.lpj-group-header' not in content:
    css_to_add = """
.lpj-group-header {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
  padding: 16px 20px;
  background: rgba(var(--v-theme-on-surface), 0.04);
  border-radius: 8px;
  margin-block-end: 16px;
}
.lpj-group-items {
  padding-inline-start: 16px;
  border-inline-start: 2px dashed rgba(var(--v-theme-on-surface), 0.12);
  margin-inline-start: 18px;
}
"""
    content = content.replace('</style>', css_to_add + '</style>')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("CSS restored.")
