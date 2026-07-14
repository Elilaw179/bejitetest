import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

function manualChunkForPackage(id) {
  if (!id.includes("node_modules")) return undefined;

  if (id.includes("recharts") || id.includes("d3-")) return "vendor-charts";
  if (id.includes("xlsx")) return "vendor-xlsx";
  if (id.includes("framer-motion")) return "vendor-motion";
  if (id.includes("@sentry")) return "vendor-sentry";
  if (id.includes("socket.io-client")) return "vendor-socket";
  if (id.includes("emoji-picker-react")) return "vendor-emoji";
  if (
    id.includes("country-state-city/lib/assets/state") ||
    id.includes("country-state-city/lib/state")
  ) {
    return "vendor-geo-state";
  }
  if (id.includes("country-state-city")) return "vendor-geo-country";
  if (id.includes("nigeria-state-lga-data")) return "vendor-geo-nigeria";
  if (id.includes("libphonenumber-js")) return "vendor-phone";
  if (
    id.includes("react-dom") ||
    id.includes("react-router") ||
    id.includes("/react/")
  ) {
    return "vendor-react";
  }
  if (id.includes("@reduxjs") || id.includes("react-redux")) return "vendor-redux";
  if (id.includes("lucide-react") || id.includes("react-icons")) return "vendor-icons";
  if (id.includes("axios")) return "vendor-http";

  return "vendor";
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectRoot, "");
  const apiTarget = (env.VITE_API_URL || "http://localhost:3001").replace(/\/$/, "");
  const sentryAuthToken = env.SENTRY_AUTH_TOKEN;

  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(sentryAuthToken
        ? [
            sentryVitePlugin({
              org: env.SENTRY_ORG || "bejite",
              project: env.SENTRY_PROJECT || "bejite-frontend",
              url: env.SENTRY_URL || "https://app.glitchtip.com/",
              authToken: sentryAuthToken,
            }),
          ]
        : []),
    ],
    build: {
      sourcemap: !!sentryAuthToken,
      rollupOptions: {
        output: {
          manualChunks(id) {
            return manualChunkForPackage(id);
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
    server: {
      proxy: {
        "/p/": {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/p\//, "/share/post/"),
        },
        "/j/": {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/j\//, "/share/job/"),
        },
        "/a/": {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/a\//, "/share/ad/"),
        },
      },
    },
  };
});
