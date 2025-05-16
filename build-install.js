#!/usr/bin/env node

// Ultra-minimal build script for Cloudflare
const fs = require('fs');
const { execSync } = require('child_process');

console.log('Starting simplified build process...');

// Create minimal package.json
const minimalPackage = {
  "name": "portfolio",
  "type": "module",
  "dependencies": {
    "@remix-run/cloudflare": "2.7.1",
    "@remix-run/cloudflare-pages": "2.7.1",
    "@remix-run/react": "2.7.1",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "fs-extra": "11.2.0"
  },
  "devDependencies": {
    "@remix-run/dev": "2.7.1",
    "cross-env": "7.0.3"
  },
  "scripts": {
    "build": "cross-env CI=false NODE_ENV=production remix vite:build"
  }
};

// Delete package-lock.json
if (fs.existsSync('package-lock.json')) {
  fs.unlinkSync('package-lock.json');
  console.log('Removed package-lock.json');
}

// Backup original package.json
if (fs.existsSync('package.json')) {
  fs.copyFileSync('package.json', 'package.json.bak');
  console.log('Backed up package.json');
}

// Write minimal package.json
fs.writeFileSync('package.json', JSON.stringify(minimalPackage, null, 2));
console.log('Created minimal package.json');

// Install dependencies
console.log('Installing dependencies...');
try {
  execSync('npm install --no-fund --no-audit', { stdio: 'inherit' });
  console.log('Dependencies installed');
  
  // Run build
  console.log('Running build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Error during build:', error);
  process.exit(1);
} finally {
  // Restore original package.json
  if (fs.existsSync('package.json.bak')) {
    fs.copyFileSync('package.json.bak', 'package.json');
    fs.unlinkSync('package.json.bak');
    console.log('Restored original package.json');
  }
} 