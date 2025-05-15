# Deploying to Netlify

This guide covers the steps to deploy your portfolio to Netlify and troubleshoot common issues.

## Prerequisites

1. A [Netlify](https://netlify.com) account
2. Git repository with your project (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Method 1: Deploy via Netlify UI (Recommended)

1. Log in to your Netlify account
2. Click "Add new site" → "Import an existing project"
3. Connect to your Git provider and select your repository
4. Configure build settings:
   - **Build command**: `npm run netlify-build`
   - **Publish directory**: `build/client`
   - Add environment variable: `CI = false` 
5. Click "Deploy site"

### Method 2: Deploy via Netlify CLI

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize Netlify in your project:
   ```bash
   netlify init
   ```

4. Follow the prompts to create a new site or link to an existing one
5. Deploy your site:
   ```bash
   netlify deploy --prod
   ```

## Fixing 404 Errors

If you encounter 404 errors when navigating to pages on your deployed site:

### Solution 1: Redeploy with the netlify-build Script

Our custom `netlify-build` script creates necessary redirect files in the build output:

1. Go to your site's Netlify dashboard
2. Navigate to Site settings → Build & deploy → Build settings
3. Change the build command to: `npm run netlify-build` 
4. Add an environment variable named `CI` with value `false`
5. Trigger a new deploy

### Solution 2: Manual File Creation

If you're still seeing 404 errors, try these steps:

1. Build your site locally: `npm run build`
2. Create a file named `_redirects` in the `build/client` directory with content:
   ```
   /*  /index.html  200
   ```
3. Deploy using the Netlify CLI:
   ```bash
   netlify deploy --prod --dir=build/client
   ```

### Solution 3: Try Direct Upload

Sometimes bypassing Git-based deployment helps:

1. Build locally: `npm run build`
2. Go to Netlify dashboard → Sites
3. Drag and drop the `build/client` folder directly onto the Netlify UI
4. This creates a new site with the correct files

## Environment Variables

If your app requires environment variables:

1. Go to your site dashboard in Netlify
2. Navigate to Site settings → Build & deploy → Environment
3. Add your environment variables

## Custom Domain Setup

To use a custom domain:

1. Go to your site dashboard in Netlify
2. Navigate to Site settings → Domain management
3. Click "Add custom domain"
4. Follow the instructions to configure DNS

## Troubleshooting More Issues

If you're still having problems:

1. **Check for build errors**: Review the build logs in Netlify dashboard
2. **Verify redirects are working**: Go to Site settings → Build & deploy → Post processing → Asset optimization
3. **Try disabling asset optimization**: Sometimes this can interfere with routing
4. **Contact Netlify support**: They can help with more complex issues

## Continuous Deployment

Netlify automatically deploys when you push to your repository. You can configure deployment settings:

1. Go to your site dashboard in Netlify
2. Navigate to Site settings → Build & deploy → Continuous Deployment
3. Adjust branch deployment settings as needed 