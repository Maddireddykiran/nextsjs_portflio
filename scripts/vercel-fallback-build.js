// Minimal fallback build script for Vercel deployments
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Set up ESM directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔧 Starting minimal Vercel fallback build...');
console.log(`Node version: ${process.version}`);

// Ensure we're in project root
process.chdir(rootDir);

// Ensure build directory exists
const buildDir = path.join(rootDir, 'build', 'client');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
  console.log(`Created build directory: ${buildDir}`);
}

// Try various build approaches
const buildCommands = [
  'npx vite build --outDir build/client',
  'remix vite:build',
  'cross-env CI=false NODE_ENV=production remix vite:build',
  'npx vite build'
];

let buildSuccess = false;

for (const command of buildCommands) {
  try {
    console.log(`Attempting build with: ${command}`);
    execSync(command, { 
      stdio: 'inherit', 
      env: { 
        ...process.env, 
        NODE_ENV: 'production', 
        CI: 'false' 
      }
    });
    buildSuccess = true;
    console.log(`✅ Build succeeded with command: ${command}`);
    break;
  } catch (error) {
    console.error(`Failed with command: ${command}`);
    console.error(error.message || error);
  }
}

if (!buildSuccess) {
  console.error('❌ All build attempts failed!');
  
  // Create a minimal index.html as last resort
  const indexPath = path.join(buildDir, 'index.html');
  const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio</title>
  <style>
    body { font-family: system-ui, sans-serif; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 2rem; }
    h1 { color: #333; }
  </style>
</head>
<body>
  <h1>Welcome to my Portfolio</h1>
  <p>This is a fallback page. The main site is currently being updated.</p>
  <p>Please check back soon!</p>
</body>
</html>`;

  fs.writeFileSync(indexPath, fallbackHtml);
  console.log('Created fallback index.html');
}

// Check build output
if (fs.existsSync(buildDir)) {
  const files = fs.readdirSync(buildDir);
  console.log(`Build directory contents (${files.length} files):`);
  files.forEach(file => console.log(` - ${file}`));
} else {
  console.error('Build directory does not exist after build process!');
}

console.log('Fallback build process complete.'); 