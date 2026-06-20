# Sentry Integration Documentation

## Overview

This branch adds Sentry error monitoring and source map support to the `bejite-frontend` application.

The branch contains:
- Newly created file: `src/sentry.js`
- Modifications to existing files:
  - `src/main.jsx`
  - `src/App.jsx`
  - `vite.config.js`
  - `package.json`
  - `package-lock.json`

## Detailed changes

### `src/sentry.js`

New file added to initialize Sentry.

Contents:
```js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
});
```

Purpose:
- Initializes the Sentry React SDK on app startup.
- Uses environment variable `VITE_SENTRY_DSN` for DSN configuration.

### `src/main.jsx`

Modified to import `src/sentry.js` before rendering the app.

Current contents:
```js
import './sentry';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { store } from './store/store.js'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
```

Purpose:
- Ensures Sentry initialization runs before React renders the app.
- Keeps entry-point side-effect import separate from app logic.

### `src/App.jsx`

Modified to wrap the root application in `Sentry.ErrorBoundary`.

Key changes:
- Added `import * as Sentry from "@sentry/react";`
- Wrapped the app tree with:
```jsx
<Sentry.ErrorBoundary fallback={<div className="min-h-screen flex items-center justify-center p-6 text-center">Something went wrong. Please refresh the page or contact support.</div>}>
  ...app content...
</Sentry.ErrorBoundary>
```

Purpose:
- Captures React rendering errors inside the component tree.
- Makes crashes visible to Sentry.
- Displays a user-friendly fallback message when a caught error occurs.

### `vite.config.js`

Modified to integrate the Sentry Vite plugin and enable source maps.

Current contents:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  plugins: [react(), tailwindcss(), sentryVitePlugin()],
  build: {
    sourcemap: true,
  },
});
```

Purpose:
- Adds `sentryVitePlugin()` to the Vite plugin pipeline.
- Enables `sourcemap: true` so production stacks can map back to original source.
- Prepares the build pipeline for Sentry source-map processing.

### `package.json`

Updated dependencies to include Sentry packages.

New additions:
- `@sentry/react`: `^10.56.0`
- `@sentry/vite-plugin`: `^5.3.0`

Purpose:
- Adds the Sentry React SDK dependency required by the app.
- Adds the Sentry Vite plugin dependency required for source map support.

### `package-lock.json`

Updated automatically by npm when installing the Sentry packages.

Contains:
- Added lock entries for `@sentry/react` and its dependency tree.
- Ensures reproducible installs for the newly added packages.

## Environment variable support

This branch introduces environment-based DSN configuration through:
- `import.meta.env.VITE_SENTRY_DSN`

That means the Sentry DSN must be provided through Vite environment variables, typically by adding it to a `.env` file or the Vercel environment settings.

## Summary

The branch fully integrates Sentry into the frontend with the following results:
- Sentry SDK initializes before React app rendering.
- React component errors are captured via `Sentry.ErrorBoundary`.
- Vite build generates source maps for better Sentry stack traces.
- Sentry dependencies are added to the project.
- DSN is configured from environment variables.

This documentation reflects all changes made in the current branch as of the latest commit.
