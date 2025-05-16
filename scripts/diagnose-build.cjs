#!/usr/bin/env node

// Script to diagnose and fix build issues
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build diagnosis...');

// Utility function for executing commands with output
function runCommand(command, ignoreErrors = false) {
  try {
    const output = execSync(command, { encoding: 'utf8' });
    console.log(output);
    return { success: true, output };
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    if (!ignoreErrors) {
      process.exit(1);
    }
    return { success: false, error: error.message };
  }
}

// Check Node.js version
console.log(`Node.js version: ${process.version}`);
console.log(`Platform: ${process.platform}`);

// Check for required files
const requiredModules = [
  'node_modules/react',
  'node_modules/react-dom',
  'node_modules/@remix-run/react'
];

let missingModules = [];
for (const mod of requiredModules) {
  if (!fs.existsSync(path.join(process.cwd(), mod))) {
    missingModules.push(mod);
  }
}

if (missingModules.length > 0) {
  console.log(`Missing modules: ${missingModules.join(', ')}`);
  console.log('Installing missing dependencies...');
  runCommand('npm install --force');
}

// Check for react-dom client.js and server.js
const reactDomDir = path.join(process.cwd(), 'node_modules/react-dom');
if (fs.existsSync(reactDomDir)) {
  // Check for client.js
  const clientPath = path.join(reactDomDir, 'client.js');
  if (!fs.existsSync(clientPath)) {
    console.log('Creating react-dom/client.js shim...');
    fs.writeFileSync(clientPath, `
'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react-dom-client.production.min.js');
} else {
  module.exports = require('./cjs/react-dom-client.development.js');
}
`);
  }
  
  // Check for server.js
  const serverPath = path.join(reactDomDir, 'server.js');
  if (!fs.existsSync(serverPath)) {
    console.log('Creating react-dom/server.js shim...');
    fs.writeFileSync(serverPath, `
'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react-dom-server.browser.production.min.js');
} else {
  module.exports = require('./cjs/react-dom-server.browser.development.js');
}
`);
  }
}

// Create a correct .npmrc
console.log('Creating proper .npmrc...');
fs.writeFileSync('.npmrc', `legacy-peer-deps=true
auto-install-peers=true
fund=false
strict-peer-dependencies=false
`);

// Try to build
console.log('Attempting to build...');
runCommand('npx cross-env CI=false NODE_ENV=production remix vite:build', true);

// Check if build succeeded
if (!fs.existsSync(path.join(process.cwd(), 'build', 'client', 'index.html'))) {
  console.error('Build failed to produce index.html');
} else {
  console.log('Build successful! index.html found in build/client directory.');
}

console.log('Diagnostic script completed'); 