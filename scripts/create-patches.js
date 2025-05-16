// Helper script to create patches for deployment
const fs = require('fs');
const path = require('path');

console.log('Creating deployment patches...');

// Create patch directory
const patchDir = path.join(process.cwd(), 'patches');
if (!fs.existsSync(patchDir)) {
  fs.mkdirSync(patchDir, { recursive: true });
}

// Create JSX runtime patches
const jsxRuntimePath = path.join(patchDir, 'jsx-runtime.js');
fs.writeFileSync(jsxRuntimePath, `
// JSX Runtime shim for deployment
const React = require('react');
module.exports = React.jsx;
module.exports.jsx = React.jsx;
module.exports.jsxs = React.jsxs;
module.exports.Fragment = React.Fragment;
`);

console.log('JSX runtime patch created at: ' + jsxRuntimePath);

// Create JSX dev runtime patches
const jsxDevRuntimePath = path.join(patchDir, 'jsx-dev-runtime.js');
fs.writeFileSync(jsxDevRuntimePath, `
// JSX Dev Runtime shim for deployment
const React = require('react');
module.exports = React.jsxDEV;
module.exports.jsxDEV = React.jsxDEV;
module.exports.Fragment = React.Fragment;
`);

console.log('JSX dev runtime patch created at: ' + jsxDevRuntimePath);

// Create empty module for any problematic imports
const createEmptyModule = (moduleName) => {
  const emptyModulePath = path.join(patchDir, `${moduleName.replace(/\//g, '-')}.js`);
  fs.writeFileSync(emptyModulePath, `
// Empty module shim for "${moduleName}"
module.exports = {};
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