import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import * as connectionsApi from '../../services/connectionsApi';

/**
 * Connection request state for a candidate (jobseeker user_id).
 */
export function useCandidateConnect(userId, displayName = '') {
  const [status, setStatus] = useState({
    loading: Boolean(userId),
    isConnected: false,
    pendingOutgoing: false,
    pendingIncoming: false,
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!userId) {
      setStatus({
        loading: false,
        isConnected: false,
        pendingOutgoing: false,
        pendingIncoming: false,
      });
      return;
    }

    let cancelled = false;

    (async () => {
      setStatus((prev) => ({ ...prev, loading: true }));
      try {
        const data = await connectionsApi.getConnectionStatus(userId);
        if (!cancelled) {
          setStatus({
            loading: false,
            isConnected: Boolean(data.isConnected),
            pendingOutgoing: Boolean(data.pendingOutgoing),
            pendingIncoming: Boolean(data.pendingIncoming),
          });
        }
      } catch {
        if (!cancelled) {
          setStatus({
            loading: false,
            isConnected: false,
            pendingOutgoing: false,
            pendingIncoming: false,
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const sendRequest = useCallback(async () => {
    if (!userId || sending) return;

    setSending(true);
    try {
      const result = await connectionsApi.sendConnectionRequest(userId);
      if (result?.connected) {
        toast.success(
          displayName
            ? `You are now connected with ${displayName}`
            : 'You are now connected',
        );
        setStatus((prev) => ({
          ...prev,
          isConnected: true,
          pendingOutgoing: false,
          pendingIncoming: false,
        }));
      } else {
        toast.success(
          displayName
            ? `Connection request sent to ${displayName}`
            : 'Connection request sent',
        );
        setStatus((prev) => ({ ...prev, pendingOutgoing: true }));
      }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to send connection request';
      toast.error(message);
    } finally {
      setSending(false);
    }
  }, [userId, displayName, sending]);

  const connectLabel = status.loading
    ? 'Connect'
    : status.isConnected
      ? 'Connected'
      : status.pendingOutgoing
        ? 'Pending'
        : status.pendingIncoming
          ? 'Respond in Connections'
          : 'Connect';

  const connectDisabled =
    !userId ||
    status.loading ||
    sending ||
    status.isConnected ||
    status.pendingOutgoing ||
    status.pendingIncoming;

  return {
    sendRequest,
    connectLabel,
    connectDisabled,
    sending,
    status,
  };
}
