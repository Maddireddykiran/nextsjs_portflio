# Personal Portfolio Website

A modern, responsive portfolio website built with [Remix](https://remix.run/), [Three.js](https://threejs.org/), and [Framer Motion](https://www.framer.com/motion/).

## Features

- Interactive WebGL background effects
- Smooth page transitions and animations
- Responsive design for all devices
- Experience and Skills pages with animated elements
- Dark/light theme support

## Technologies

- Remix.js for routing and server-side rendering
- Three.js for 3D/WebGL effects
- Framer Motion for animations
- CSS Modules for styling
- Vercel/Netlify for deployment

## Installation & Development

Make sure you have nodejs `19.9.0` or higher and npm `9.6.3` or higher installed.

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. To view the components storybook:

```bash
npm run dev:storybook
```

## Deployment

### Deploying to Netlify

The project is configured for easy deployment to Netlify. See the [NETLIFY-DEPLOY.md](./NETLIFY-DEPLOY.md) file for detailed instructions.

Quick deployment:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to Netlify
netlify deploy --prod
```

### Deploying to Vercel

The project is configured for easy deployment to Vercel. See the [VERCEL-DEPLOY.md](./VERCEL-DEPLOY.md) file for detailed instructions.

Quick deployment:

```bash
# Deploy to Vercel
vercel

# Production deployment
vercel --prod
```

### Deploying to Cloudflare Pages

The project can also be deployed to Cloudflare Pages:

```bash
npm run deploy
```

## Contact Form Setup

To get the contact form working:

1. Create an AWS account and set up SES (Simple Email service)
2. Create a `.dev.vars` file from the `.dev.vars.example` template 
3. Add the same environment variables in your deployment platform

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
