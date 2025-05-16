// Special build script for Netlify deployment
console.log('Starting Netlify build process...');

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure environment variables are set
process.env.CI = 'false';

try {
  // Ensure all dependencies are installed properly
  console.log('Checking and installing dependencies...');
  
  // Force install of necessary peer dependencies
  console.log('Installing React JSX Runtime dependencies...');
  execSync('npm install --no-save react@18.2.0 react-dom@18.2.0', { stdio: 'inherit' });
  
  // Create a temporary .npmrc file to force legacy peer deps
  fs.writeFileSync('.npmrc.temp', 'legacy-peer-deps=true\n');
  
  // Run the build command with the temporary .npmrc
  console.log('Building Remix application...');
  execSync('NODE_ENV=production remix vite:build', { 
    stdio: 'inherit',
    env: { 
      ...process.env,
      NODE_OPTIONS: '--max-old-space-size=4096'
    }
  });
  
  // Remove temporary .npmrc file
  if (fs.existsSync('.npmrc.temp')) {
    fs.unlinkSync('.npmrc.temp');
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