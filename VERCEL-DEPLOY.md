# Deploying to Vercel

This guide covers the steps to deploy your portfolio to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. Git repository with your project (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Push your code to a repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Import your project in Vercel

1. Log in to your Vercel account
2. Click "Add New" → "Project"
3. Select the Git provider where your repository is hosted
4. Authorize Vercel to access your repositories
5. Select the repository containing your portfolio
6. Configure your project:
   - **Framework Preset**: Select "Remix"
   - Leave the other settings as default

### 3. Configure Environment Variables (if needed)

If your project requires environment variables:
1. In the project settings, go to the "Environment Variables" tab
2. Add the necessary variables

### 4. Deploy

1. Click "Deploy"
2. Vercel will automatically build and deploy your site
3. After deployment completes, you'll receive a URL to your live site

## Troubleshooting Build Errors

If you encounter build errors:

1. The project is configured to ignore build errors with the settings in `vercel.json`
2. You can also set the environment variable `CI=false` in Vercel's environment variables 
3. Check the build logs for specific errors to resolve them

## Custom Domains

To use a custom domain:

1. Go to your project in Vercel
2. Click on "Settings" → "Domains"
3. Add your domain and follow the instructions to configure DNS

## Continuous Deployment

Vercel automatically deploys changes when you push to your repository:

- Push to main/master branch: Updates production
- Create a pull request: Creates a preview deployment

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Remix Documentation](https://remix.run/docs/en/main) 