#!/bin/bash

# Simple build script for Cloudflare Pages
echo "Starting Cloudflare Pages build process..."
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Remove package-lock.json to prevent npm ci issues
if [ -f package-lock.json ]; then
  echo "Removing package-lock.json to prevent npm ci issues"
  rm package-lock.json
fi

# Install dependencies
echo "Installing dependencies..."
npm install --no-audit --no-fund --legacy-peer-deps

# Install fs-extra explicitly
echo "Installing fs-extra explicitly..."
npm install --no-save fs-extra@11.2.0

# Build the project
echo "Building the project..."
CI=false NODE_ENV=production npm run build

# Verify build output
if [ -f build/client/index.html ]; then
  echo "Build successful! index.html found."
else
  echo "Build may have failed. No index.html found."
  exit 1
fi

echo "Build completed successfully!" 