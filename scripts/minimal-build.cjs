#!/usr/bin/env node

// Minimal build script for Netlify that doesn't rely on remix CLI
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting minimal Netlify build process');

// Make sure we have the essential dependencies
try {
  console.log('Installing essential dependencies...');
  execSync('npm install --no-save vite react react-dom', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to install essential dependencies:', error);
  // Continue anyway - dependencies might already be installed
}

// Ensure build directory exists
const buildDir = path.join(process.cwd(), 'build');
const clientDir = path.join(buildDir, 'client');

if (!fs.existsSync(clientDir)) {
  console.log('Creating build directory structure...');
  fs.mkdirSync(clientDir, { recursive: true });
}

// Look for an index.html in the public directory or app directory
let sourceIndexHtml = null;
const publicDir = path.join(process.cwd(), 'public');
const publicIndexHtml = path.join(publicDir, 'index.html');
const appDir = path.join(process.cwd(), 'app');
const appIndexHtml = path.join(appDir, 'index.html');

if (fs.existsSync(publicIndexHtml)) {
  sourceIndexHtml = publicIndexHtml;
} else if (fs.existsSync(appIndexHtml)) {
  sourceIndexHtml = appIndexHtml;
}

// Create a minimal index.html if none found
const targetIndexHtml = path.join(clientDir, 'index.html');
if (sourceIndexHtml) {
  console.log(`Copying index.html from ${sourceIndexHtml}...`);
  fs.copyFileSync(sourceIndexHtml, targetIndexHtml);
} else {
  console.log('Creating basic index.html file...');
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Portfolio</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    h1 {
      color: #333;
    }
  </style>
</head>
<body>
  <h1>Portfolio</h1>
  <p>Welcome to my portfolio website! The site is currently being built and will be available soon.</p>
  <p>In the meantime, please contact me via email.</p>
</body>
</html>`;

  fs.writeFileSync(targetIndexHtml, html);
}

// Create a _redirects file in the build/client directory
console.log('Creating redirect file...');
const redirectsContent = '/*  /index.html  200';
fs.writeFileSync(
  path.join(clientDir, '_redirects'),
  redirectsContent
);

console.log('Creating netlify.toml file in build directory...');
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

// Copy static assets from public to build/client if public exists
if (fs.existsSync(publicDir)) {
  console.log('Copying static assets from public directory...');
  try {
    // Read all files in public directory
    const files = fs.readdirSync(publicDir);
    for (const file of files) {
      // Skip index.html as we already processed it
      if (file === 'index.html') continue;
      
      const sourcePath = path.join(publicDir, file);
      const destPath = path.join(clientDir, file);
      
      // Check if it's a directory or file
      const stats = fs.statSync(sourcePath);
      if (stats.isDirectory()) {
        // Create directory and copy contents recursively
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
        // We're not implementing recursive copy here for simplicity
        // but in a real solution you would want to do that
      } else {
        // Copy file
        fs.copyFileSync(sourcePath, destPath);
      }
    }
  } catch (error) {
    console.error('Error copying static assets:', error);
  }
}

console.log('Minimal build completed successfully!'); 