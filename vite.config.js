import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
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
});