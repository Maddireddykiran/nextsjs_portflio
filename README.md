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
- Cloudflare Pages for deployment

## Installation & Development

Make sure you have nodejs `20.10.0` or higher and npm `10.x` or higher installed.

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

### Deploying to Cloudflare Pages

The project is configured for deployment to Cloudflare Pages. See the [CLOUDFLARE-DEPLOY.md](./CLOUDFLARE-DEPLOY.md) file for detailed instructions.

Quick deployment:

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
npm run deploy
```

You can also set up automatic deployments from GitHub by connecting your repository to Cloudflare Pages in the Cloudflare dashboard.

## Contact Form Setup

To get the contact form working:

1. Create an AWS account and set up SES (Simple Email service)
2. Create a `.dev.vars` file from the `.dev.vars.example` template 
3. Add the same environment variables in the Cloudflare Pages dashboard

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
