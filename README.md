# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

##  Code Quality (ESLint)

We use **ESLint** in this project to enforce code quality and consistency.  
This ensures that unused variables, undefined functions, and other potential issues are caught early.

### Running ESLint
To check your code for linting errors:
```bash
npm run lint
```

## Environment variables

Copy `.env.example` to `.env` for local development. Vite exposes only variables prefixed with `VITE_`.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend origin **without** a trailing slash (for example `https://bejite-backend-9mg2.onrender.com`). Used as the Axios/fetch base URL and to resolve relative profile media paths such as `/uploads/profilePhoto-….png`. |
| `VITE_API_KEY` | No | Optional API key if your deployment uses one. |

Profile photos may be stored as full `https://` URLs (for example Cloudinary) or as paths like `/uploads/…`; the shared helpers `profilePhotoUrl` / `profileAvatarSrc` in `src/utils/profilePhotoUrl.js` resolve the latter against `VITE_API_URL`.

