#!/usr/bin/env node

// Script to clean up dependencies for clean install
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Cleaning up dependency files...');

// Remove package-lock.json if it exists
if (fs.existsSync('package-lock.json')) {
  console.log('Removing package-lock.json');
  fs.unlinkSync('package-lock.json');
}

// Remove node_modules if it exists
if (fs.existsSync('node_modules')) {
  console.log('Removing node_modules directory');
  try {
    if (process.platform === 'win32') {
      // On Windows, use rimraf or similar
      execSync('rmdir /s /q node_modules', { stdio: 'inherit' });
    } else {
      // On Unix systems
      execSync('rm -rf node_modules', { stdio: 'inherit' });
    }
  } catch (error) {
    console.warn('Warning: Could not completely remove node_modules:', error.message);
  }
}

// Create a fresh .npmrc file
console.log('Creating .npmrc file with safe settings');
const npmrcContent = `legacy-peer-deps=true
auto-install-peers=true
fund=false
strict-peer-dependencies=false
ignore-scripts=true
update-notifier=false
`;

fs.writeFileSync('.npmrc', npmrcContent);

console.log('Dependency cleanup complete!'); 