import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectRoot, '');
  const apiTarget = (env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      sentryVitePlugin({
        org: "bejite",
        project: "bejite-frontend",
        url: "https://app.glitchtip.com/",
      }),
    ],
    build: {
      sourcemap: true,
    },
    server: {
      proxy: {
        '/p/': {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/p\//, '/share/post/'),
        },
        '/j/': {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/j\//, '/share/job/'),
        },
        '/a/': {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/a\//, '/share/ad/'),
        },
      },
    },
  };
});
