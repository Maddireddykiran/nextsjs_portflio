// Netlify deployment diagnostic script
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('==========================================');
console.log('Netlify Deployment Diagnostic Tool');
console.log('==========================================\n');

// Check if build directory exists
const buildDir = path.join(process.cwd(), 'build');
const clientDir = path.join(buildDir, 'client');
const indexPath = path.join(clientDir, 'index.html');

function checkPath(p, name) {
  const exists = fs.existsSync(p);
  console.log(`${name}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
  return exists;
}

// Check build structure
console.log('\n📂 Checking build directory structure...');
const buildExists = checkPath(buildDir, 'build/ directory');
const clientExists = checkPath(clientDir, 'build/client/ directory');
const indexExists = checkPath(indexPath, 'build/client/index.html');

if (indexExists) {
  // Check index.html content
  console.log('\n📄 Examining index.html file...');
  try {
    const content = fs.readFileSync(indexPath, 'utf8');
    const isRealPage = content.includes('<script') && content.length > 500;
    console.log(`index.html content check: ${isRealPage ? '✅ VALID' : '❌ SUSPICIOUS'} (${content.length} bytes)`);
    
    if (!isRealPage) {
      console.log('\nWARNING: index.html appears to be a fallback page, not a real build!\n');
      console.log('Content preview:');
      console.log('-----------------------------------');
      console.log(content.substring(0, 300) + '...');
      console.log('-----------------------------------');
    }
  } catch (error) {
    console.log(`Error reading index.html: ${error.message}`);
  }
}

// Check Netlify config
console.log('\n⚙️ Checking Netlify configuration...');
const netlifyToml = path.join(process.cwd(), 'netlify.toml');
checkPath(netlifyToml, 'netlify.toml file');

if (fs.existsSync(netlifyToml)) {
  try {
    const content = fs.readFileSync(netlifyToml, 'utf8');
    console.log('Found publish directory config:', content.match(/publish\s*=\s*"([^"]+)"/)?.[1] || 'Not found');
    console.log('Found build command config:', content.match(/command\s*=\s*"([^"]+)"/)?.[1] || 'Not found');
  } catch (error) {
    console.log(`Error reading netlify.toml: ${error.message}`);
  }
}

// Check _redirects file
console.log('\n🔄 Checking redirect configuration...');
const redirectsPath = path.join(clientDir, '_redirects');
const redirectsExist = checkPath(redirectsPath, '_redirects file');

if (redirectsExist) {
  try {
    const content = fs.readFileSync(redirectsPath, 'utf8');
    console.log(`_redirects content: "${content.trim()}"`); 
  } catch (error) {
    console.log(`Error reading _redirects: ${error.message}`);
  }
}

// Reporting all client files
if (clientExists) {
  console.log('\n📋 Files in build/client directory:');
  try {
    const files = fs.readdirSync(clientDir);
    console.log(`Found ${files.length} files/directories:`);
    files.forEach(file => {
      const stats = fs.statSync(path.join(clientDir, file));
      console.log(`- ${file} ${stats.isDirectory() ? '(directory)' : `(${stats.size} bytes)`}`);
    });
  } catch (error) {
    console.log(`Error listing client directory: ${error.message}`);
  }
}

console.log('\n✅ Diagnostic completed');
console.log('=========================================='); 