import sys

with open('src/components/admin/pengeluaran/PengeluaranLpjDetail.vue', 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find('<VRow v-if="isKegiatan">')
end = content.find('<VRow v-else-if="isTatapmuka">')

if start != -1 and end != -1:
    print(content[start:end])
else:
    print('Not found')
