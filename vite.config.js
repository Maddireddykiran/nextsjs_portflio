import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from '@remix-run/dev';
import { defineConfig } from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypeImgSize from 'rehype-img-size';
import rehypeSlug from 'rehype-slug';
import rehypePrism from '@mapbox/rehype-prism';
import path from 'path';
import fs from 'fs';

// Determine if we're running in Netlify environment
const isNetlify = process.env.NETLIFY === 'true';
const patchDir = process.env.NETLIFY_PATCH_DIR;

export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.hdr', '**/*.glsl'],
  build: {
    assetsInlineLimit: 1024,
    outDir: 'build/client',
    rollupOptions: {
      // Explicitly mark React as external but include in the bundle
      external: [],
      onwarn(warning, warn) {
        // Ignore certain warnings
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' || 
            warning.message.includes('Use of eval')) {
          return;
        }
        warn(warning);
      }
    }
  },
  server: {
    port: 7777,
  },
  resolve: {
    alias: {
      // First try the patch directory on Netlify if available
      ...(patchDir ? {
        'react/jsx-runtime': path.resolve(patchDir, 'jsx-runtime.js'),
        'react/jsx-dev-runtime': path.resolve(patchDir, 'jsx-dev-runtime.js'),
      } : {}),
      // Then fall back to node_modules
      'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime.js'),
      'react/jsx-dev-runtime': path.resolve(__dirname, 'node_modules/react/jsx-dev-runtime.js'),
      'react': path.resolve(__dirname, 'node_modules/react/index.js'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom/index.js')
    }
  },
  define: {
    // Force development mode to be false in production
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'process.env.REMIX_DEV_SERVER_WS_PORT': JSON.stringify(undefined)
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', '@remix-run/react'],
    esbuildOptions: {
      // Needed to ensure JSX runtime is properly processed
      jsx: 'automatic',
      jsxImportSource: 'react'
    }
  },
  plugins: [
    mdx({
      rehypePlugins: [[rehypeImgSize, { dir: 'public' }], rehypeSlug, rehypePrism],
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      providerImportSource: '@mdx-js/react',
    }),
    remixCloudflareDevProxy(),
    remix({
      routes(defineRoutes) {
        return defineRoutes(route => {
          route('/', 'routes/home/route.js', { index: true });
        });
      },
    }),
    jsconfigPaths(),
    // Custom plugin to handle JSX runtime missing issue
    {
      name: 'jsx-runtime-shim',
      resolveId(id) {
        if (id === 'react/jsx-runtime' || id === 'react/jsx-dev-runtime') {
          return { id, external: false };
        }
        return null;
      }
    }
  ],
});
