// Script to fix package-lock.json issues
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting package-lock.json fix...');

// Root directory
const rootDir = path.resolve(__dirname, '..');

// Check if package-lock exists
const packageLockPath = path.join(rootDir, 'package-lock.json');
if (!fs.existsSync(packageLockPath)) {
  console.log('No package-lock.json found. Nothing to do.');
  process.exit(0);
}

try {
  // Read package.json
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Read package-lock.json
  const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
  
  // Fix fs-extra version in package-lock
  const fsExtraVersion = packageJson.dependencies['fs-extra'];
  console.log(`fs-extra version in package.json: ${fsExtraVersion}`);
  
  if (packageLock.packages && packageLock.packages['node_modules/fs-extra']) {
    console.log('Updating fs-extra in package-lock.json...');
    packageLock.packages['node_modules/fs-extra'].version = fsExtraVersion.replace(/^\^/, '');
  }
  
  if (packageLock.dependencies && packageLock.dependencies['fs-extra']) {
    console.log('Updating fs-extra in package-lock.json dependencies...');
    packageLock.dependencies['fs-extra'].version = fsExtraVersion.replace(/^\^/, '');
    packageLock.dependencies['fs-extra'].resolved = `https://registry.npmjs.org/fs-extra/-/fs-extra-${fsExtraVersion.replace(/^\^/, '')}.tgz`;
  }
  
  // Write the fixed package-lock back
  fs.writeFileSync(packageLockPath, JSON.stringify(packageLock, null, 2));
  console.log('Successfully fixed package-lock.json');
  
} catch (error) {
  console.error('Error fixing package-lock.json:', error);
  
  // If anything goes wrong, delete the package-lock file
  try {
    fs.unlinkSync(packageLockPath);
    console.log('Removed potentially corrupted package-lock.json');
  } catch (deleteError) {
    console.error('Failed to remove package-lock.json:', deleteError);
  }
}

console.log('Package-lock fix completed'); 