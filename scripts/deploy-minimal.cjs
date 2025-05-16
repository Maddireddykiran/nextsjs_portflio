#!/usr/bin/env node

// Minimal deployment script for Netlify - will deploy a simple fallback page no matter what
const fs = require('fs');
const path = require('path');

console.log('Creating minimal deployment for Netlify...');

// Create the build directory structure
const buildPath = path.join(process.cwd(), 'build');
const clientPath = path.join(buildPath, 'client');

if (!fs.existsSync(buildPath)) {
  fs.mkdirSync(buildPath, { recursive: true });
}

if (!fs.existsSync(clientPath)) {
  fs.mkdirSync(clientPath, { recursive: true });
}

// Copy the fallback HTML to index.html
const fallbackPath = path.join(process.cwd(), 'fallback.html');
const indexPath = path.join(clientPath, 'index.html');

if (fs.existsSync(fallbackPath)) {
  fs.copyFileSync(fallbackPath, indexPath);
  console.log('Copied fallback.html to build/client/index.html');
} else {
  // Create a minimal index.html if fallback doesn't exist
  fs.writeFileSync(indexPath, `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Portfolio</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>Website under construction</h1>
  <p>We're working on bringing the site up. Please check back later.</p>
</body>
</html>
`);
}

// Create necessary redirect files for Netlify
const redirectsContent = '/*  /index.html  200';
fs.writeFileSync(
  path.join(clientPath, '_redirects'),
  redirectsContent
);

// Create a netlify.toml in the client directory
const netlifyToml = `
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = true
`;

fs.writeFileSync(
  path.join(clientPath, 'netlify.toml'),
  netlifyToml
);

console.log('Minimal deployment created successfully!');
process.exit(0); 