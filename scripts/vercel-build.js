// This script is used by Vercel to build the application
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 Starting Vercel build process');

// Ensure we're in the project root
process.chdir(path.resolve(__dirname, '..'));

// Make sure we have the right Node.js version
console.log(`Node version: ${process.version}`);

// Check if we're in a CI environment (Vercel)
const isCI = process.env.CI === 'true' || process.env.VERCEL === '1';
console.log(`CI environment: ${isCI ? 'Yes' : 'No'}`);

try {
  // Ensure clean build
  if (fs.existsSync('build')) {
    console.log('Removing existing build directory...');
    fs.rmSync('build', { recursive: true, force: true });
  }

  // Run the actual build
  console.log('Building application...');
  
  // Set environment variables for the build
  process.env.NODE_ENV = 'production';
  process.env.CI = 'false'; // Prevent CI mode from failing on warnings
  process.env.REMIX_DIST = path.join(process.cwd(), 'build/client');
  
  // Run the build command
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully');
  
  // Check if the build directory exists
  if (fs.existsSync('build/client')) {
    console.log('Client build directory exists');
    
    // List files in build directory
    const files = fs.readdirSync('build/client');
    console.log(`Files in build/client (${files.length} files):`);
    files.forEach(file => console.log(` - ${file}`));
  } else {
    console.error('❌ Client build directory is missing!');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
} 