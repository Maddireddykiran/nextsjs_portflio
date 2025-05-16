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

// Helper function to recursively copy a directory
function copyDirRecursive(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  // Read all files/folders in the source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      copyDirRecursive(srcPath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(srcPath, destPath);
    }
  }
  
  console.log(`Copied directory ${src} to ${dest}`);
}

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

// If all build attempts failed, copy the static portfolio files or create a minimal build
if (!buildSuccess) {
  console.error('❌ All build attempts failed! Creating minimal static site...');
  
  // Try to use app/routes/index.jsx or similar if it exists (for Remix apps)
  try {
    const appRoutesPath = path.join(rootDir, 'app', 'routes');
    if (fs.existsSync(appRoutesPath)) {
      console.log('Attempting to generate static site from Remix routes...');
      
      // Look for index.jsx or _index.jsx in routes
      const indexFile = fs.readdirSync(appRoutesPath).find(file => 
        /^(_)?index\.(jsx|tsx|js|ts)$/.test(file)
      );
      
      if (indexFile) {
        console.log(`Found index route: ${indexFile}`);
        
        // Try to build just this file with a simple approach
        try {
          execSync('npx remix-static-export', { 
            stdio: 'inherit',
            env: { ...process.env, NODE_ENV: 'production' }
          });
          
          // If we get here, the static export worked
          buildSuccess = true;
          console.log('✅ Static export succeeded');
        } catch (err) {
          console.error('Static export failed:', err.message);
        }
      }
    }
  } catch (err) {
    console.error('Error checking for Remix routes:', err);
  }
  
  // If we still don't have a build, try to use the static portfolio
  if (!buildSuccess) {
    const staticPortfolioPath = path.join(rootDir, 'portfolio-static');
    
    if (fs.existsSync(staticPortfolioPath) && fs.existsSync(path.join(staticPortfolioPath, 'index.html'))) {
      // Copy the entire static portfolio folder to the build directory
      console.log('Using existing static portfolio content...');
      
      try {
        // Copy index.html
        fs.copyFileSync(
          path.join(staticPortfolioPath, 'index.html'), 
          path.join(buildDir, 'index.html')
        );
        console.log('Copied static portfolio index.html');
        
        // Copy other static files if they exist
        const staticFiles = ['css', 'js', 'img', 'assets'].filter(dir => 
          fs.existsSync(path.join(rootDir, dir))
        );
        
        for (const dir of staticFiles) {
          try {
            const srcDir = path.join(rootDir, dir);
            const destDir = path.join(buildDir, dir);
            
            if (fs.existsSync(srcDir) && fs.statSync(srcDir).isDirectory()) {
              console.log(`Copying ${dir} directory...`);
              copyDirRecursive(srcDir, destDir);
            }
          } catch (error) {
            console.error(`Error copying ${dir} directory:`, error);
          }
        }
        
        buildSuccess = true;
      } catch (error) {
        console.error('Error copying static portfolio:', error);
      }
    } else if (fs.existsSync(path.join(rootDir, 'index.html'))) {
      // Use the root index.html if available
      try {
        console.log('Using root index.html...');
        fs.copyFileSync(
          path.join(rootDir, 'index.html'), 
          path.join(buildDir, 'index.html')
        );
        
        // Copy any static asset folders that exist
        ['css', 'js', 'img'].forEach(dir => {
          const srcDir = path.join(rootDir, dir);
          if (fs.existsSync(srcDir) && fs.statSync(srcDir).isDirectory()) {
            console.log(`Copying ${dir} directory...`);
            copyDirRecursive(srcDir, path.join(buildDir, dir));
          }
        });
        
        buildSuccess = true;
      } catch (error) {
        console.error('Error copying root index.html:', error);
      }
    }
    
    // If all else fails, create a custom portfolio HTML
    if (!buildSuccess) {
      // Create a custom portfolio index.html with your info
      console.log('Creating custom portfolio page...');
      const indexPath = path.join(buildDir, 'index.html');
      const portfolioHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Portfolio</title>
  <style>
    :root {
      --color-background: #0e0e10;
      --color-surface: #161618;
      --color-primary: #007bff;
      --color-primary-hover: #0069d9;
      --color-text: #f8f9fa;
      --color-text-secondary: #a0a0a6;
      --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes gradientBG {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
      font-family: var(--font-sans);
      background-color: var(--color-background);
      color: var(--color-text);
      line-height: 1.6;
    }
    
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 16px;
      background: linear-gradient(135deg, rgba(14,14,16,1) 0%, rgba(22,22,24,1) 100%);
      background-size: 200% 200%;
      animation: gradientBG 15s ease infinite;
    }
    
    .container {
      max-width: 800px;
      width: 100%;
      text-align: center;
      animation: fadeIn 0.8s var(--ease-out-expo) forwards;
    }
    
    .card {
      background-color: var(--color-surface);
      border-radius: 8px;
      padding: 32px;
      margin-bottom: 24px;
      box-shadow: var(--shadow-lg);
    }
    
    h1 {
      font-size: 42px;
      margin-bottom: 16px;
      background: linear-gradient(90deg, #007bff, #00bcd4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }
    
    p {
      margin-bottom: 24px;
      color: var(--color-text-secondary);
      font-size: 18px;
    }
    
    .btn {
      display: inline-block;
      background-color: var(--color-primary);
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s ease;
      margin: 8px;
    }
    
    .btn:hover {
      background-color: var(--color-primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 7px 14px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.1);
    }
    
    .footer {
      margin-top: 48px;
      font-size: 14px;
      color: var(--color-text-secondary);
    }
    
    @media (max-width: 768px) {
      h1 {
        font-size: 32px;
      }
      
      p {
        font-size: 16px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>My Portfolio</h1>
      <p>Welcome to my portfolio website. I'm a full-stack developer specializing in modern web technologies.</p>
      <p>This site showcases my projects, skills, and experience in web development.</p>
      <a href="https://github.com/Maddireddykiran" class="btn">View My GitHub</a>
      <a href="mailto:contact@example.com" class="btn">Contact Me</a>
    </div>
    <div class="footer">
      &copy; 2023 · Built with Remix
    </div>
  </div>
</body>
</html>`;

      try {
        fs.writeFileSync(indexPath, portfolioHtml);
        console.log('Created custom portfolio index.html');
        buildSuccess = true;
      } catch (error) {
        console.error('Error creating custom portfolio HTML:', error);
      }
    }
  }
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