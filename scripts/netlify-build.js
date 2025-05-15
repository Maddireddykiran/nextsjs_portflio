// Special build script for Netlify deployment
console.log('Starting Netlify build process...');

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure environment variables are set
process.env.CI = 'false';

try {
  // Run the build command
  console.log('Building Remix application...');
  execSync('remix vite:build', { stdio: 'inherit' });
  
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