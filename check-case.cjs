const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const filePaths = new Set();
walkDir(srcDir, (filePath) => {
  filePaths.add(filePath.replace(/\\/g, '/').toLowerCase());
});

const getActualCase = (filePath) => {
  let parts = filePath.split('/');
  let currentPath = parts[0]; // C:
  for (let i = 1; i < parts.length; i++) {
    const parentPath = currentPath;
    const items = fs.readdirSync(currentPath + '/');
    const match = items.find(item => item.toLowerCase() === parts[i].toLowerCase());
    if (match) {
      currentPath = currentPath + '/' + match;
    } else {
      return null; // Not found
    }
  }
  return currentPath;
};

let hasErrors = false;
walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (importPath.startsWith('.')) {
        const resolvedPath = path.resolve(path.dirname(filePath), importPath);
        // Try with and without extension
        const possibleExtensions = ['', '.js', '.jsx', '.css'];
        let found = false;
        let actualPathOnDisk = null;
        for (const ext of possibleExtensions) {
          const testPath = resolvedPath + ext;
          if (fs.existsSync(testPath)) {
            actualPathOnDisk = getActualCase(testPath.replace(/\\/g, '/'));
            if (actualPathOnDisk) {
               // Check if the cased path matches the testPath
               // On Windows, actualPathOnDisk will be exactly what the file system has
               // Let's compare the last part
               const expectedBasename = path.basename(testPath);
               const actualBasename = path.basename(actualPathOnDisk);
               if (expectedBasename !== actualBasename) {
                 console.error(`Case mismatch in ${filePath}:\n  Imported: ${importPath}\n  Actual file: ${actualBasename}`);
                 hasErrors = true;
               }
               
               // Let's also check parent directories
               const expectedDirname = path.dirname(testPath).replace(/\\/g, '/');
               const actualDirname = path.dirname(actualPathOnDisk);
               if (expectedDirname !== actualDirname) {
                 // But wait, the parent path might be different if the workspace path itself has uppercase/lowercase mismatch.
                 // Just check the relative part
                 const relExpected = path.relative(srcDir, expectedDirname);
                 const relActual = path.relative(srcDir, actualDirname);
                 if (relExpected !== relActual) {
                   console.error(`Directory case mismatch in ${filePath}:\n  Imported: ${importPath}\n  Expected rel: ${relExpected}\n  Actual rel: ${relActual}`);
                   hasErrors = true;
                 }
               }
            }
            found = true;
            break;
          }
        }
      }
    }
  }
});

if (!hasErrors) {
  console.log('No case mismatches found.');
}
