# Deploying to Cloudflare Pages

This portfolio site is configured for deployment to Cloudflare Pages. Follow these steps to deploy your site.

## Prerequisites

- Node.js 20.10.0 or later
- npm 10.x or later
- A Cloudflare account
- Wrangler CLI installed globally (optional, but recommended): `npm install -g wrangler`

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open your browser to `http://localhost:7777`

## Manual Deployment

You can deploy your site manually using the Wrangler CLI:

1. Build your site:
   ```
   npm run build
   ```

2. Deploy to Cloudflare Pages:
   ```
   npm run deploy
   ```

   Or use the wrangler CLI directly:
   ```
   wrangler pages deploy ./build/client --project-name portfolio
   ```

## Automatic Deployment with GitHub

You can set up automatic deployments from GitHub to Cloudflare Pages:

1. Push your code to a GitHub repository
2. Log in to the Cloudflare dashboard
3. Navigate to Pages
4. Click "Create a project"
5. Connect your GitHub account and select your repository
6. Configure your build settings:
   - Build command: `./build.sh`
   - Build output directory: `build/client`
   - Node.js version: 20.x
   - Environment variables: 
     - `NODE_VERSION`: `20.10.0`
     - `CI`: `false`
     - `NPM_FLAGS`: `--legacy-peer-deps --no-fund --no-audit`
7. Click "Save and Deploy"

> **Important**: We use a custom build script (`build.sh`) to avoid the npm ci error that occurs with fs-extra version conflicts.

## Troubleshooting npm ci Errors

If you see errors related to `npm ci` and fs-extra version conflicts, the most reliable fix is to:

1. In the Cloudflare Pages dashboard, go to your project's settings
2. Under "Build settings", change the build command to `./build.sh`
3. This script will:
   - Remove the package-lock.json (preventing npm ci errors)
   - Use npm install with the --legacy-peer-deps flag
   - Explicitly install fs-extra@11.2.0
   - Run the build process

## Environment Variables

If your application requires environment variables, you can configure them in the Cloudflare dashboard:

1. Go to your Pages project in the Cloudflare dashboard
2. Click on "Settings" > "Environment variables"
3. Add your variables for both production and preview environments

## Troubleshooting

- **Build failures**: Check build logs for specific error messages
- **Package lock issues**: Our custom build script should handle these automatically
- **Runtime errors**: Check for missing environment variables or compatibility issues
- **Route issues**: Ensure your Remix routes are properly configured

For more information, see the [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/). 