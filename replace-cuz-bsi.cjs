const fs = require('fs');
const path = require('path');

function replaceInFiles(dir, searchValue, replaceValue) {
    const files = fs.readdirSync(dir, { withFileTypes: true, recursive: true });
    
    files.forEach(file => {
        if (file.isFile() && (file.name.endsWith('.vue') || file.name.endsWith('.js') || file.name.endsWith('.ts'))) {
            const filePath = path.join(file.parentPath || file.path, file.name);
            const data = fs.readFileSync(filePath, 'utf8');
                
            if (data.includes(searchValue)) {
                const result = data.replace(new RegExp(searchValue, 'g'), replaceValue);
                fs.writeFileSync(filePath, result, 'utf8');
                console.log(`Updated ${filePath}`);
            }
        }
    });
}

replaceInFiles(path.join(__dirname, 'src'), 'CUS BSI', 'CUZ BSI');
