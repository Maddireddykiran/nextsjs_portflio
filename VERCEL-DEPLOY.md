# Deploying to Vercel

This document provides instructions for deploying this Remix application to Vercel.

## Prerequisites

- A Vercel account
- Node.js 20+ installed locally
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
CI=false
```

### 5. Deploy

Click "Deploy" to start the deployment process.

## Troubleshooting

If you encounter any issues during deployment:

1. Check the build logs in the Vercel dashboard
2. Ensure all dependencies are properly installed
3. Verify that your `vercel.json` configuration is correct
4. Make sure your Remix version is compatible with Vercel

### Common Issues

#### Build fails due to Node.js version

Vercel uses Node.js 18 by default. This project requires Node.js 20+. Add the following in your `package.json`:

```json
"engines": {
  "node": ">=20.10.0"
}
```

#### CSS or asset loading issues

Make sure your assets are properly handled by Remix. Check the `vite.config.js` file and ensure the assets are being properly processed.

## Local Testing

To test your Vercel deployment locally:

1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel dev` in your project directory

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Remix Documentation](https://remix.run/docs/en/main)
- [Remix on Vercel Guide](https://vercel.com/guides/deploying-remix-with-vercel) 