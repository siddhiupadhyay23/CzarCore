const { execSync } = require('child_process');
const path = require('path');

console.log('Building React client...');

try {
  // Change to client directory
  process.chdir(path.join(__dirname, 'client'));
  
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Build the app
  console.log('Building app...');
  execSync('npx react-scripts build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}