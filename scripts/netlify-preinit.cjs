#!/usr/bin/env node

// Pre-initialization script for Netlify to ensure fs-extra is installed
const { execSync } = require('child_process');

console.log('Running Netlify pre-initialization script...');

// Install fs-extra before any build starts
try {
  console.log('Installing fs-extra...');
  execSync('npm install --no-save fs-extra', { stdio: 'inherit' });
  console.log('fs-extra installed successfully');
} catch (error) {
  console.warn('Could not install fs-extra:', error.message);
  // Don't fail the build - we have fallbacks
}

console.log('Pre-initialization completed'); 