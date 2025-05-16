// Alternative Netlify force build script that doesn't depend on fs-extra
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting alternative Netlify build process...');

// Attempt to install fs-extra if needed
try {
  console.log('Installing fs-extra...');
  execSync('npm install --no-save fs-extra', { stdio: 'inherit' });
  console.log('fs-extra installed successfully');
} catch (error) {
  console.warn('Could not install fs-extra, continuing without it:', error.message);
}

// Clean build directory if it exists
const buildDir = path.join(process.cwd(), 'build');
if (fs.existsSync(buildDir)) {
  console.log('Cleaning existing build directory...');
  try {
    // Use recursive directory removal (Node.js 14.14.0+)
    fs.rmSync(buildDir, { recursive: true, force: true });
    console.log('Build directory successfully cleaned.');
  } catch (error) {
    console.error('Failed to clean build directory:', error);
    // Fallback for older Node.js versions
    try {
      if (process.platform === 'win32') {
        execSync('rmdir /s /q "' + buildDir + '"', { stdio: 'inherit' });
      } else {
        execSync('rm -rf "' + buildDir + '"', { stdio: 'inherit' });
      }
    } catch (fallbackError) {
      console.error('Fallback directory removal also failed:', fallbackError);
    }
  }
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
  execSync('npm install --no-save @remix-run/dev vite @remix-run/react fs-extra', { stdio: 'inherit' });
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

// Ensure the build directory exists
const clientDir = path.join(buildDir, 'client');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}
if (!fs.existsSync(clientDir)) {
  fs.mkdirSync(clientDir, { recursive: true });
}

// Check build output
const indexPath = path.join(clientDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('Build failed: No index.html was created');
  // Try to run the minimal build script instead
  try {
    console.log('Attempting to run minimal build script as fallback...');
    execSync('node ./scripts/minimal-build.cjs', { stdio: 'inherit' });
  } catch (minimalBuildError) {
    console.error('Minimal build also failed:', minimalBuildError);
    process.exit(1);
  }
} else {
  console.log('Build appears successful - index.html exists');
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

console.log('Netlify alternative build completed successfully!'); 