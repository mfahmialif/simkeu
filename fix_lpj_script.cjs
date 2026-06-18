const fs = require('fs')
const path = require('path')

const filepath = path.join(__dirname, 'src/components/admin/pengeluaran/PengeluaranLpjDetail.vue')
let content = fs.readFileSync(filepath, 'utf-8')

// 1. ADD IMPORTS
if (!content.includes('import PengeluaranLampiranInput')) {
  content = content.replace(
    'import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue"',
    `import PengeluaranLampiranInput from "@/components/admin/pengeluaran/PengeluaranLampiranInput.vue"
import { appendLampiranFormData } from "@/utils/lampiran"
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue"`
  )
}

// 2. ADD LAMPIRAN TO newRow
content = content.replace(
  'lampiran: [],',
  `lampiran: [],
    existing_lampiran: [],
    removed_lampiran: [],`
)

// 3. ADD LAMPIRAN TO duplicateRow
content = content.replace(
  /rab_detail_id: null,\s*lampiran: \[\],/g,
  `rab_detail_id: null,
    lampiran: [],
    existing_lampiran: [],
    removed_lampiran: [],`
)

// 4. ADD LAMPIRAN TO detailToRow
content = content.replace(
  'lampiran: selectedFileSafeArray(item.lampiran),',
  `lampiran: [],
  existing_lampiran: selectedFileSafeArray(item.lampiran),
  removed_lampiran: [],`
)

// 5. UPDATE submit payload to FormData
const oldSubmit = `    const response = await $api(\`\${props.endpoint}/rekap/\${rekapId.value}/lpj\`, {
      method: "PUT",
      body: {
        items: flatRows.value,
      },
    })`

const newSubmit = `    const formData = new FormData()
    formData.append("_method", "PUT")
    
    flatRows.value.forEach((row, index) => {
      const prefix = \`items[\${index}]\`
      Object.entries(row).forEach(([key, value]) => {
        if (["lampiran", "existing_lampiran", "removed_lampiran", "subItems", "key"].includes(key)) return
        if (value !== null && value !== undefined) {
          formData.append(\`\${prefix}[\${key}]\`, value)
        }
      })
      
      appendLampiranFormData(formData, row.lampiran, row.removed_lampiran, prefix)
    })

    const response = await $api(\`\${props.endpoint}/rekap/\${rekapId.value}/lpj\`, {
      method: "POST",
      body: formData,
    })`

content = content.replace(oldSubmit, newSubmit)

fs.writeFileSync(filepath, content, 'utf-8')
console.log('Script updated basic forms and payload!')
