#!/usr/bin/env node

// Simple script that Cloudflare Pages can run directly from the UI
const fs = require('fs');
const { execSync } = require('child_process');

// Log environment info
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Working directory:', process.cwd());

// Function to run commands
function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

// Step 1: Remove package-lock.json and package.json
console.log('Removing package files...');
try {
  if (fs.existsSync('package-lock.json')) {
    fs.unlinkSync('package-lock.json');
  }
  
  if (fs.existsSync('package.json')) {
    fs.renameSync('package.json', 'package.json.original');
  }
} catch (err) {
  console.error('Error removing files:', err);
}

// Step 2: Copy the simplified package.json
console.log('Setting up simplified package.json...');
try {
  if (fs.existsSync('cloudflare-package.json')) {
    fs.copyFileSync('cloudflare-package.json', 'package.json');
  } else {
    console.error('cloudflare-package.json not found!');
    process.exit(1);
  }
} catch (err) {
  console.error('Error setting up package.json:', err);
  process.exit(1);
}

try {
  // Step 3: Install dependencies
  console.log('Installing dependencies...');
  run('npm install --no-fund --no-audit --legacy-peer-deps');
  
  // Step 4: Build the project
  console.log('Building the project...');
  run('npm run build');
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} finally {
  // Restore original package.json
  try {
    if (fs.existsSync('package.json.original')) {
      if (fs.existsSync('package.json')) {
        fs.unlinkSync('package.json');
      }
      fs.renameSync('package.json.original', 'package.json');
    }
  } catch (err) {
    console.error('Error restoring package.json:', err);
  }
} 