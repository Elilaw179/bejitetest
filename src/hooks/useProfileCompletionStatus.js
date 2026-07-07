import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance from '../utils/axiosInstance';
import { updateUser } from '../features/auth/authSlice';
import {
  getUser,
  isAuthenticated,
  storeUser,
  mergeAuthUsers,
} from '../utils/tokenManager';

/**
 * Loads profileCompleted from /auth/me and syncs Redux + localStorage.
 */
export default function useProfileCompletionStatus({ enabled = true } = {}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(() => {
    const u = getUser();
    return u?.profileCompleted === true;
  });

  const refresh = useCallback(async () => {
    if (!isAuthenticated()) {
      setProfileCompleted(false);
      return false;
    }
    if (!enabled) {
      return null;
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/auth/me');
      const fromApi = data?.user?.profileCompleted === true;
      const local = getUser() || {};
      const merged = {
        ...mergeAuthUsers(local, data?.user ?? {}),
        profileCompleted: fromApi,
        mode: data?.user?.mode ?? local?.mode ?? null,
      };
      storeUser(merged);
      dispatch(updateUser({ profileCompleted: fromApi, mode: merged.mode }));
      setProfileCompleted(fromApi);
      return fromApi;
    } catch {
      const local = getUser();
      const fallback = local?.profileCompleted === true;
      setProfileCompleted(fallback);
      return fallback;
    } finally {
      setLoading(false);
    }
  }, [dispatch, enabled]);

  useEffect(() => {
    if (!enabled) return;
    refresh();
  }, [enabled, refresh]);

  return { profileCompleted, loading, refresh };
}
