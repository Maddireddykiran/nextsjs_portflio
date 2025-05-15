# Deploying to Netlify

This guide covers the steps to deploy your portfolio to Netlify and troubleshoot common issues.

## Prerequisites

1. A [Netlify](https://netlify.com) account
2. Git repository with your project (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Method 1: Deploy via Netlify UI

1. Log in to your Netlify account
2. Click "Add new site" → "Import an existing project"
3. Connect to your Git provider and select your repository
4. Configure build settings:
   - **Build command**: `npm run netlify-build`
   - **Publish directory**: `build/client`
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

## Troubleshooting 404 Errors

If you encounter 404 errors when navigating to pages on your deployed site:

1. **Check your redirects**: This repository includes a `netlify.toml` file and a `_redirects` file in the `public` directory. These should handle redirecting all routes to `index.html` for client-side routing.

2. **Verify build directory**: Make sure Netlify is publishing from the correct directory (`build/client`).

3. **Force deployment**: Sometimes you need to force a new deployment:
   ```bash
   netlify deploy --prod --force
   ```

4. **Clear cache**: Try clearing the Netlify cache:
   ```bash
   netlify deploy --prod --clear
   ```

5. **Check build logs**: Review the build logs in the Netlify dashboard for any errors.

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

## Continuous Deployment

Netlify automatically deploys when you push to your repository. You can configure deployment settings:

1. Go to your site dashboard in Netlify
2. Navigate to Site settings → Build & deploy → Continuous Deployment
3. Adjust branch deployment settings as needed 