import sys

with open('src/components/admin/pengeluaran/PengeluaranLpjDetail.vue', 'r', encoding='utf-8') as f:
    content = f.read()

with open('new_lpj_template.vue', 'r', encoding='utf-8') as f:
    new_template = f.read()

start = content.find('<div class="lpj-list">')
end = content.find('</VCardText>', start)

if start != -1 and end != -1:
    # Look for the ending </div> of lpj-list which should be right before </VCardText>
    # In Vue, usually there are some spaces. We can just replace from start to end-1 (leaving some space).
    # But new_template has <div class="lpj-list"> inside it.
    new_content = content[:start] + new_template + '\n        ' + content[end:]
    with open('src/components/admin/pengeluaran/PengeluaranLpjDetail.vue', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully replaced template!")
else:
    print("Could not find boundaries!")
