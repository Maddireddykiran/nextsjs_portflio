#!/usr/bin/env node

// Direct build script for Cloudflare Pages that bypasses npm ci
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting direct Cloudflare Pages build process...');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);

// Function to run a command with proper error handling
function runCommand(command) {
  console.log(`Running command: ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Remove package-lock.json to prevent npm ci
try {
  if (fs.existsSync('package-lock.json')) {
    console.log('Removing package-lock.json to prevent npm ci');
    fs.unlinkSync('package-lock.json');
  }
} catch (error) {
  console.warn('Failed to remove package-lock.json:', error.message);
}

// Install dependencies directly with npm install
console.log('Installing dependencies with npm install...');
if (!runCommand('npm install --no-audit --no-fund --legacy-peer-deps')) {
  console.error('Failed to install dependencies');
  process.exit(1);
}

// Install fs-extra explicitly to fix version issues
console.log('Installing fs-extra explicitly...');
if (!runCommand('npm install --no-save fs-extra@11.2.0')) {
  console.warn('Failed to install fs-extra@11.2.0, continuing anyway');
}

// Run the build
console.log('Building project...');
process.env.CI = 'false';
process.env.NODE_ENV = 'production';
if (!runCommand('npm run build')) {
  console.error('Build failed');
  process.exit(1);
}

console.log('Build completed successfully!'); 