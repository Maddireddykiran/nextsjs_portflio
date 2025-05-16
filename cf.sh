#!/bin/bash
# Simple build script for Cloudflare Pages
set -e

echo "Starting Cloudflare build process..."
NODE_VER=$(node -v)
echo "Using Node.js $NODE_VER"

# Step 1: Remove package-lock.json
echo "Removing package-lock.json if it exists..."
rm -f package-lock.json

# Step 2: Install core dependencies first
echo "Installing core dependencies..."
npm install --no-fund --no-audit --no-save fs-extra@11.2.0 react@18.2.0 react-dom@18.2.0 @remix-run/react@2.7.1 @remix-run/dev@2.7.1 cross-env

# Step 3: Run the build
echo "Running build command..."
CI=false NODE_ENV=production npx remix vite:build

# Check if build succeeded
if [ -d "./build/client" ]; then
  if [ -f "./build/client/index.html" ]; then
    echo "Build successful! Found index.html in build/client directory."
  else
    echo "Error: No index.html found in build/client directory."
    exit 1
  fi
else
  echo "Error: build/client directory not found."
  exit 1
fi

echo "Cloudflare build completed successfully!" 