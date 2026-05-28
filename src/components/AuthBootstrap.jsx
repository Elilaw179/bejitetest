import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hydrateAuth } from "../features/auth/authSlice";
import {
  clearAuthData,
  getAccessToken,
  getRefreshToken,
  getUser,
  refreshAccessToken,
} from "../utils/tokenManager";

/**
 * Restores user sessions from refresh token on app load (non-admin only).
 * Admin auth is unchanged and is not silently refreshed here.
 */
export default function AuthBootstrap({ children }) {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      dispatch(hydrateAuth());
      const storedUser = getUser();
      const refreshToken = getRefreshToken();
      const accessToken = getAccessToken();

      if (storedUser?.is_admin) {
        if (!cancelled) setReady(true);
        return;
      }

      if (refreshToken) {
        try {
          await refreshAccessToken();
        } catch {
          if (!accessToken) {
            clearAuthData();
          }
        }
      }

      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  if (!ready) {
    return null;
  }

  return children;
}
