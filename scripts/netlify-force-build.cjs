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

// Create a clean npmrc with specific settings needed for Netlify
console.log('Creating .npmrc with specific settings...');
fs.writeFileSync('.npmrc', `legacy-peer-deps=true
auto-install-peers=true
fund=false
strict-peer-dependencies=false
`);

// Install dependencies with force
console.log('Installing dependencies...');
try {
  execSync('npm install --force --no-audit --no-fund', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to install dependencies:', error);
  process.exit(1);
}

// Explicitly install critical build tools to ensure they're available
console.log('Ensuring build tools are available...');
try {
  execSync('npm install --no-save @remix-run/dev vite @remix-run/react', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to install build tools:', error);
  process.exit(1);
}

// Verify remix CLI is available
const remixPath = path.join(process.cwd(), 'node_modules', '.bin', 'remix');
if (!fs.existsSync(remixPath)) {
  console.error('Remix CLI not found after installation! Creating direct build command...');
  // Create a direct build script that bypasses remix CLI
  try {
    execSync('npx vite build', { 
      stdio: 'inherit',
      env: { 
        ...process.env,
        CI: 'false',
        NODE_ENV: 'production',
        NODE_OPTIONS: '--max-old-space-size=4096'
      }
    });
  } catch (error) {
    console.error('Fallback build command failed:', error);
    process.exit(1);
  }
} else {
  // Run build with verbose logging using direct path to remix executable
  console.log('Running build with verbose logging...');
  try {
    // Set environment variables for Windows compatibility
    process.env.CI = 'false';
    process.env.NODE_ENV = 'production';
    process.env.NODE_OPTIONS = '--max-old-space-size=4096';
    
    execSync(`"${remixPath}" vite:build`, { 
      stdio: 'inherit',
      env: { ...process.env }
    });
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed with error:', error);
    process.exit(1);
  }
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