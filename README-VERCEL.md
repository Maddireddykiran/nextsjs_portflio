# Deploying to Vercel

This document provides instructions for deploying this Remix application to Vercel.

## Prerequisites

- A Vercel account
- Node.js 18+ installed locally
- Git

## Deployment Steps

### 1. Push your code to a Git repository

Make sure your project is in a GitHub, GitLab, or Bitbucket repository.

### 2. Import your project in Vercel

1. Log in to your Vercel account
2. Click "Add New" → "Project"
3. Select your Git repository
4. Configure the project with the following settings:

### 3. Configure Build Settings

- **Framework Preset**: `Remix`
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `build/client`
- **Install Command**: `npm install`

### 4. Environment Variables

Add the following environment variables:

```
NODE_ENV=production
VERCEL=1
```

### 5. Deploy

Click "Deploy" to start the deployment process.

## Troubleshooting

If you encounter any issues during deployment:

1. Check the build logs in the Vercel dashboard
2. Ensure all dependencies are properly installed
3. Verify that your `vercel.json` configuration is correct
4. Make sure your Remix version in package.json is compatible with Vercel

## Local Testing

To test your Vercel deployment locally:

1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel dev` in your project directory

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Remix Documentation](https://remix.run/docs/en/main) 