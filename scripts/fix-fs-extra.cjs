#!/usr/bin/env node

// Script to fix fs-extra version issues
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Fixing fs-extra dependency issues...');

// Read package.json
let packageJson;
try {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Check if fs-extra is in dependencies
  if (packageJson.dependencies['fs-extra']) {
    console.log(`Current fs-extra version in package.json: ${packageJson.dependencies['fs-extra']}`);
  } else {
    console.log('fs-extra not found in dependencies, adding it');
    packageJson.dependencies['fs-extra'] = '^11.2.0';
  }
  
  // Update package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Updated package.json with fs-extra version');
  
} catch (error) {
  console.error('Error reading/writing package.json:', error);
}

// Remove package-lock.json to ensure a clean install
try {
  if (fs.existsSync('package-lock.json')) {
    console.log('Removing package-lock.json to ensure clean install');
    fs.unlinkSync('package-lock.json');
  }
} catch (error) {
  console.warn('Warning: Could not remove package-lock.json:', error.message);
}

// Reinstall fs-extra explicitly 
console.log('Installing fs-extra package...');
try {
  execSync('npm install --no-save fs-extra@11.2.0', { stdio: 'inherit' });
  console.log('Successfully installed fs-extra@11.2.0');
} catch (error) {
  console.error('Failed to install fs-extra:', error.message);
}

console.log('fs-extra fix completed!'); 