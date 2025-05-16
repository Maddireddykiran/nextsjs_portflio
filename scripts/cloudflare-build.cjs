#!/usr/bin/env node

// Custom build script for Cloudflare Pages that handles dependency issues
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Cloudflare Pages build process...');

// Function to run a command and log output
function runCommand(command) {
  console.log(`> ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Delete package-lock.json if it exists to avoid npm ci errors
try {
  if (fs.existsSync('package-lock.json')) {
    console.log('Removing package-lock.json to ensure clean install');
    fs.unlinkSync('package-lock.json');
  }
} catch (error) {
  console.warn('Warning: Could not remove package-lock.json:', error.message);
}

// Run the fs-extra fix script first
console.log('Running fs-extra fix script...');
if (!runCommand('node ./scripts/fix-fs-extra.cjs')) {
  console.warn('Warning: fs-extra fix script failed, continuing anyway');
}

// Install dependencies with npm install instead of npm ci
console.log('Installing dependencies with npm install...');
if (!runCommand('npm install --no-audit --no-fund')) {
  console.error('Failed to install dependencies with npm install');
  process.exit(1);
}

// Run package-lock fix script 
console.log('Running package-lock fix script...');
if (!runCommand('node ./scripts/package-lock-fix.js')) {
  console.warn('Warning: package-lock fix script failed, continuing anyway');
}

// Build the project
console.log('Building the project...');
if (!runCommand('npm run build')) {
  console.error('Build failed');
  process.exit(1);
}

console.log('Build completed successfully!'); 