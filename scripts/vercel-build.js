// This script is used by Vercel to build the application
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('🔥 Starting Vercel build process');

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure we're in the project root
process.chdir(path.resolve(__dirname, '..'));

// Log environment information
console.log(`Node version: ${process.version}`);
console.log(`Working directory: ${process.cwd()}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

// Check if we're in a CI environment (Vercel)
const isCI = process.env.CI === 'true' || process.env.VERCEL === '1';
console.log(`CI environment: ${isCI ? 'Yes' : 'No'}`);

// List available scripts for debugging
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('Available scripts:', Object.keys(packageJson.scripts).join(', '));
} catch (error) {
  console.error('Failed to read package.json:', error);
}

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
  
  // Explicitly set the output directory
  process.env.REMIX_DIST = path.join(process.cwd(), 'build/client');
  console.log(`Setting REMIX_DIST to: ${process.env.REMIX_DIST}`);
  
  // Try using a direct build command instead of npm run build
  console.log('Running build command: cross-env CI=false NODE_ENV=production remix vite:build');
  try {
    execSync('cross-env CI=false NODE_ENV=production remix vite:build', { 
      stdio: 'inherit',
      env: { ...process.env }
    });
  } catch (buildError) {
    console.error('❌ Build command failed. Trying fallback build...');
    console.error(buildError);
    
    // Try direct vite build as fallback
    console.log('Running fallback build: npx vite build');
    execSync('npx vite build --outDir build/client', { 
      stdio: 'inherit',
      env: { ...process.env }
    });
  }
  
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
  console.error('❌ Build failed with detailed error:');
  console.error(error.message || error);
  if (error.stdout) console.error('stdout:', error.stdout.toString());
  if (error.stderr) console.error('stderr:', error.stderr.toString());
  process.exit(1);
} 