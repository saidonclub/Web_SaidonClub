const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
                        path.join(dest, childItemName));
    });
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

const src = path.join(process.cwd(), 'src', 'generated', 'client_v3');
const dest = path.join(process.cwd(), 'dist', 'generated', 'client_v3');

if (fs.existsSync(src)) {
  console.log(`Copying from ${src} to ${dest}...`);
  copyRecursiveSync(src, dest);
  console.log('Done!');
} else {
  console.log(`Source directory ${src} does not exist. Skipping copy.`);
}
