// Helper script to create patches for deployment
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('Creating deployment patches...');

// Create patch directory
const patchDir = path.join(projectRoot, 'patches');
if (!fs.existsSync(patchDir)) {
  fs.mkdirSync(patchDir, { recursive: true });
}

// Create JSX runtime patches
const jsxRuntimePath = path.join(patchDir, 'jsx-runtime.js');
fs.writeFileSync(jsxRuntimePath, `
// JSX Runtime shim for deployment
import * as React from 'react';
export const jsx = React.jsx;
export const jsxs = React.jsxs;
export const Fragment = React.Fragment;
`);

console.log('JSX runtime patch created at: ' + jsxRuntimePath);

// Create JSX dev runtime patches
const jsxDevRuntimePath = path.join(patchDir, 'jsx-dev-runtime.js');
fs.writeFileSync(jsxDevRuntimePath, `
// JSX Dev Runtime shim for deployment
import * as React from 'react';
export const jsxDEV = React.jsxDEV || React.jsx;
export const Fragment = React.Fragment;
`);

console.log('JSX dev runtime patch created at: ' + jsxDevRuntimePath);

// Create empty module for any problematic imports
const createEmptyModule = (moduleName) => {
  const emptyModulePath = path.join(patchDir, `${moduleName.replace(/\//g, '-')}.js`);
  fs.writeFileSync(emptyModulePath, `
// Empty module shim for "${moduleName}"
export default {};
`);
  console.log(`Empty module created for "${moduleName}" at: ${emptyModulePath}`);
};

// List of problematic modules that might need empty shims
const problematicModules = [
  'react/jsx-runtime',
  'react/jsx-dev-runtime'
];

problematicModules.forEach(createEmptyModule);

console.log('All deployment patches created successfully!'); 