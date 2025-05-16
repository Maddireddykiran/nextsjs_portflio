// Netlify force build script - prevents fallback page from being used
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting Netlify forced build process...');

// Clean build directory if it exists
const buildDir = path.join(process.cwd(), 'build');
if (fs.existsSync(buildDir)) {
  console.log('Cleaning existing build directory...');
  try {
    fs.rmSync(buildDir, { recursive: true, force: true });
    console.log('Build directory successfully cleaned.');
  } catch (error) {
    console.error('Failed to clean build directory:', error);
  }
}

// Ensure clean node_modules
console.log('Cleaning node_modules directory...');
try {
  execSync('npm run cleanup-deps', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to clean dependencies:', error);
}

// Install dependencies with force
console.log('Installing dependencies...');
try {
  execSync('npm install --force --no-audit --no-fund', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to install dependencies:', error);
  process.exit(1);
}

// Run build with verbose logging
console.log('Running build with verbose logging...');
try {
  // Set environment variables for Windows compatibility
  process.env.CI = 'false';
  process.env.NODE_ENV = 'production';
  process.env.NODE_OPTIONS = '--max-old-space-size=4096';
  
  execSync('npx remix vite:build', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed with error:', error);
  process.exit(1);
}

// Check build output
const clientDir = path.join(buildDir, 'client');
const indexPath = path.join(clientDir, 'index.html');

if (!fs.existsSync(clientDir)) {
  console.error('Build failed: No client directory was created');
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  console.error('Build failed: No index.html was created');
  process.exit(1);
}

// Create netlify.toml in the build/client directory
console.log('Creating Netlify configuration in build directory...');
const netlifyToml = `
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = true
`;

fs.writeFileSync(
  path.join(clientDir, 'netlify.toml'),
  netlifyToml
);

// Create _redirects file in the build/client directory
const redirectsContent = '/*  /index.html  200';
fs.writeFileSync(
  path.join(clientDir, '_redirects'),
  redirectsContent
);

console.log('Netlify force build completed successfully!'); 