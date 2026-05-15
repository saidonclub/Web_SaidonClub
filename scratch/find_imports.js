const fs = require('fs');
const path = require('path');

function getFiles(dir, allFiles) {
  const files = fs.readdirSync(dir);
  allFiles = allFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== 'artifacts') {
        allFiles = getFiles(dir + '/' + file, allFiles);
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        allFiles.push(path.join(dir, file));
      }
    }
  });
  return allFiles;
}

const webDir = 'c:\\Users\\Gatita\\OneDrive\\Desktop\\Web_SaidonClub\\apps\\web';
const files = getFiles(webDir);
const imports = new Set();

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.matchAll(/from\s+['"]([^@\.\/][^'"]+)['"]/g);
  for (const match of matches) {
    let pkg = match[1];
    // Handle scoped packages
    if (pkg.startsWith('@')) {
      const parts = pkg.split('/');
      pkg = parts[0] + '/' + parts[1];
    } else {
      pkg = pkg.split('/')[0];
    }
    imports.add(pkg);
  }
});

console.log(Array.from(imports).sort().join('\n'));
