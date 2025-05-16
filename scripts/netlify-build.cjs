// Special build script for Netlify deployment (CommonJS version)
console.log('Starting Netlify build process...');

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Handle mise warnings by setting environment variable
process.env.MISE_DISABLE_IDIOMATIC_VERSION_FILES = '1';

// Check Node.js version
const nodeVersion = process.version;
console.log(`Using Node.js version: ${nodeVersion}`);

const requiredNodeVersion = 'v20.10.0';
const requiredNodeMajor = 20;

if (parseInt(nodeVersion.substring(1).split('.')[0], 10) < requiredNodeMajor) {
  console.warn(`⚠️ Warning: Using Node.js ${nodeVersion} but >= ${requiredNodeVersion} is recommended.`);
  console.log('Continuing build process anyway...');
}

// Ensure environment variables are set
process.env.CI = 'false';
process.env.NODE_ENV = 'production';

// Create an .nvmrc file which is more standard than .node-version
console.log('Creating .nvmrc file to ensure correct Node.js version...');
fs.writeFileSync('.nvmrc', '20.10.0\n');

try {
  // Create a special build patch file for Remix
  console.log('Creating temporary build patch for Netlify...');
  
  // Create a temporary directory for patched modules
  const patchDir = path.join(process.cwd(), 'netlify-patches');
  if (!fs.existsSync(patchDir)) {
    fs.mkdirSync(patchDir, { recursive: true });
  }
  
  // Create explicit JSX runtime shim files in CommonJS format
  const jsxRuntimeContent = `
// JSX Runtime shim - CommonJS version
'use strict';
const React = require('react');
module.exports = React.jsx;
module.exports.jsx = React.jsx;
module.exports.jsxs = React.jsxs;
module.exports.Fragment = React.Fragment;
`;
  fs.writeFileSync(path.join(patchDir, 'jsx-runtime.js'), jsxRuntimeContent);
  
  const jsxDevRuntimeContent = `
// JSX Dev Runtime shim - CommonJS version
'use strict';
const React = require('react');
module.exports = React.jsxDEV || React.jsx;
module.exports.jsxDEV = React.jsxDEV || React.jsx;
module.exports.Fragment = React.Fragment;
`;
  fs.writeFileSync(path.join(patchDir, 'jsx-dev-runtime.js'), jsxDevRuntimeContent);
  
  // Update node_modules temporarily to ensure JSX runtime is available
  const nodeModulesJSXPath = path.join(process.cwd(), 'node_modules', 'react', 'jsx-runtime.js');
  if (!fs.existsSync(path.dirname(nodeModulesJSXPath))) {
    fs.mkdirSync(path.dirname(nodeModulesJSXPath), { recursive: true });
    
    // If file doesn't exist, create a simple shim
    if (!fs.existsSync(nodeModulesJSXPath)) {
      fs.writeFileSync(nodeModulesJSXPath, "module.exports = require('./jsx-runtime');");
    }
  }
  
  // Make file to explicitly disable mise idiomatic version files
  fs.writeFileSync('.mise.toml', 'idiomatic_version_files = false\n');
  
  // Force install of necessary dependencies
  console.log('Installing required dependencies...');
  execSync('npm install --no-save react@18.2.0 react-dom@18.2.0 @remix-run/react@2.7.1', { stdio: 'inherit' });
  
  // Create an explicit .npmrc file to handle peer dependencies
  console.log('Setting up build configuration...');
  fs.writeFileSync('.npmrc', 'legacy-peer-deps=true\n');
  
  // Run the build command with increased memory
  console.log('Building Remix application...');
  execSync('NODE_ENV=production NODE_OPTIONS="--max-old-space-size=4096" remix vite:build', { 
    stdio: 'inherit',
    env: { 
      ...process.env,
      NETLIFY_PATCH_DIR: patchDir,
      MISE_DISABLE_IDIOMATIC_VERSION_FILES: '1'
    }
  });
  
  // Clean up patch directory
  console.log('Cleaning up temporary files...');
  if (fs.existsSync(patchDir)) {
    fs.rmSync(patchDir, { recursive: true, force: true });
  }
  
  // Remove temporary .npmrc file
  if (fs.existsSync('.npmrc')) {
    fs.unlinkSync('.npmrc');
  }
  
  console.log('Build completed, creating redirect file...');
  
  // Ensure the build/client directory exists
  if (!fs.existsSync(path.join(process.cwd(), 'build', 'client'))) {
    throw new Error('Build directory not found. Build may have failed.');
  }
  
  // Create a _redirects file in the build/client directory
  const redirectsContent = '/*  /index.html  200';
  fs.writeFileSync(
    path.join(process.cwd(), 'build', 'client', '_redirects'),
    redirectsContent
  );
  
  console.log('_redirects file created in build/client directory');
  
  // Create a netlify.toml file in the build/client directory
  const netlifyToml = `
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = true
`;
  
  fs.writeFileSync(
    path.join(process.cwd(), 'build', 'client', 'netlify.toml'),
    netlifyToml
  );
  
  console.log('netlify.toml created in build/client directory');
  console.log('Build process completed successfully!');
  
} catch (error) {
  console.error('Error during build process:', error);
  process.exit(1);
} 