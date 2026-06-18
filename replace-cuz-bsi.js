const fs = require('fs')
const path = require('path')

function replaceInFiles(dir, searchValue, replaceValue) {
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) throw err
        
    files.forEach(file => {
      const filePath = path.join(dir, file.name)
      if (file.isDirectory()) {
        replaceInFiles(filePath, searchValue, replaceValue)
      } else if (file.isFile() && (file.name.endsWith('.vue') || file.name.endsWith('.js') || file.name.endsWith('.ts'))) {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) throw err
                    
          if (data.includes(searchValue)) {
            const result = data.replace(new RegExp(searchValue, 'g'), replaceValue)

            fs.writeFile(filePath, result, 'utf8', err => {
              if (err) throw err
              console.log(`Updated ${filePath}`)
            })
          }
        })
      }
    })
  })
}

replaceInFiles(path.join(__dirname, 'src'), 'CUS BSI', 'CUZ BSI')
