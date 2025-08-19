const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const clientBuild = path.join(__dirname, 'client', 'build');
const rootBuild = path.join(__dirname, 'build');

if (fs.existsSync(clientBuild)) {
  console.log('Copying build files to root...');
  copyDir(clientBuild, rootBuild);
  console.log('Build files copied successfully!');
} else {
  console.error('Client build directory not found!');
  process.exit(1);
}