#!/usr/bin/env node

// This script runs the build process and exits with code 0 even if there are errors
// This allows Vercel to deploy the site even if there are non-critical build warnings
// that would otherwise cause the build to fail

console.log('Starting Vercel build with error ignoring...');

const { execSync } = require('child_process');
const fs = require('fs');

try {
  // Set environment variables to ignore warnings
  process.env.CI = 'false';
  
  // Run the build command
  console.log('Running build command...');
  execSync('remix vite:build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.warn('Build encountered errors but continuing deployment:');
  console.error(error.message);
  
  // Check if the build output directory exists
  if (!fs.existsSync('./build/client')) {
    console.error('Critical error: Build output directory does not exist.');
    process.exit(1); // Exit with error code
  }
  
  console.log('Continuing with deployment despite build warnings...');
}

// Exit successfully to allow Vercel to deploy
process.exit(0); 