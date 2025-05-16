#!/usr/bin/env node

// Simple script that Cloudflare Pages can use directly
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

console.log('Cloudflare Pages Build Script Starting');

// Function to run commands
function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

// Step 1: Remove package-lock.json
console.log('Removing package-lock.json...');
try {
  if (fs.existsSync('package-lock.json')) {
    fs.unlinkSync('package-lock.json');
  }
} catch (err) {
  console.error('Error removing package-lock.json:', err);
}

// Step 2: Create a simplified temporary package.json with exact versions
console.log('Creating simplified package.json for build...');
const pkg = require('../package.json');

// Create a simplified version for build
const simplifiedPkg = {
  name: pkg.name,
  type: pkg.type,
  dependencies: {
    // Core dependencies with exact versions
    "@remix-run/cloudflare": "2.7.1",
    "@remix-run/cloudflare-pages": "2.7.1",
    "@remix-run/react": "2.7.1",
    "fs-extra": "11.2.0", // Use exact version to avoid conflicts
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "framer-motion": "11.0.5",
    "three": "0.161.0"
  },
  devDependencies: {
    "@remix-run/dev": "2.7.1",
    "cross-env": "7.0.3"
  }
};

// Backup original package.json
if (fs.existsSync('package.json')) {
  fs.renameSync('package.json', 'package.json.backup');
}

// Write simplified package.json
fs.writeFileSync('package.json', JSON.stringify(simplifiedPkg, null, 2));

try {
  // Step 3: Install dependencies
  console.log('Installing dependencies...');
  run('npm install --no-fund --no-audit');

  // Step 4: Build the project
  console.log('Building the project...');
  run('npx cross-env CI=false NODE_ENV=production remix vite:build');

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} finally {
  // Restore original package.json
  if (fs.existsSync('package.json.backup')) {
    fs.renameSync('package.json.backup', 'package.json');
  }
} 