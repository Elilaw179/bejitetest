import { useCallback, useEffect, useRef, useState } from 'react';
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
 * Stale /auth/me responses are ignored. A failed fetch never treats an old
 * cached `true` as complete.
 */
export default function useProfileCompletionStatus({ enabled = true } = {}) {
  const dispatch = useDispatch();
  const requestIdRef = useRef(0);
  const hasServerResultRef = useRef(false);
  const [loading, setLoading] = useState(() => Boolean(enabled));
  const [profileCompleted, setProfileCompleted] = useState(false);

  const fetchStatus = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    if (!enabled || !isAuthenticated()) {
      if (requestId !== requestIdRef.current) return false;
      hasServerResultRef.current = false;
      setProfileCompleted(false);
      setLoading(false);
      return false;
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/auth/me');
      if (requestId !== requestIdRef.current) return null;

      const fromApi = data?.user?.profileCompleted === true;
      const local = getUser() || {};
      const merged = {
        ...mergeAuthUsers(local, data?.user ?? {}),
        profileCompleted: fromApi,
        mode: data?.user?.mode ?? local?.mode ?? null,
      };
      storeUser(merged);
      dispatch(updateUser({ profileCompleted: fromApi, mode: merged.mode }));
      hasServerResultRef.current = true;
      setProfileCompleted(fromApi);
      return fromApi;
    } catch {
      if (requestId !== requestIdRef.current) return null;
      if (!hasServerResultRef.current) {
        setProfileCompleted(false);
      }
      return hasServerResultRef.current ? null : false;
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [dispatch, enabled]);

  useEffect(() => {
    fetchStatus();
    return () => {
      requestIdRef.current += 1;
    };
  }, [fetchStatus]);

  return { profileCompleted, loading, refresh: fetchStatus };
}
