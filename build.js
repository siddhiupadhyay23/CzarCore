const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build process...');

try {
  // Change to client directory and build
  process.chdir(path.join(__dirname, 'client'));
  console.log('Installing client dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Building React app...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Copy build to root for Vercel
  const buildPath = path.join(__dirname, 'client', 'build');
  const rootBuildPath = path.join(__dirname, 'build');
  
  if (fs.existsSync(buildPath)) {
    console.log('Copying build to root...');
    execSync(`cp -r ${buildPath}/* ${rootBuildPath}/`, { stdio: 'inherit' });
  }
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}