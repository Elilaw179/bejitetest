import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaComment } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCandidateConnect } from '../hooks/useCandidateConnect';
import messagingService from '../services/messagingService';
import { getUser } from '../utils/tokenManager';

export default function ProfileConnectActions({ userId, displayName }) {
  const navigate = useNavigate();
  const currentUser = getUser();
  const normalizedUserId =
    userId != null && userId !== '' ? String(userId) : null;
  const isSelf =
    normalizedUserId &&
    currentUser?.id != null &&
    String(currentUser.id) === normalizedUserId;

  const { sendRequest, acceptRequest, connectLabel, connectDisabled, status, sending } =
    useCandidateConnect(normalizedUserId, displayName);
  const [messaging, setMessaging] = useState(false);

  if (!normalizedUserId || isSelf) return null;

  const isStatusLoading = Boolean(status.loading);
  const showConnectSpinner = isStatusLoading || sending;

  const handleConnect = async () => {
    if (isStatusLoading || sending) return;
    if (status.pendingIncoming) {
      await acceptRequest();
      return;
    }
    if (!connectDisabled) {
      sendRequest();
    }
  };

  const handleMessage = async () => {
    if (messaging) return;
    try {
      setMessaging(true);
      const conversation = await messagingService.startConversation(normalizedUserId);
      navigate('/chats', {
        state: { openConversationId: conversation?.id },
      });
    } catch (error) {
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'Could not start conversation';
      toast.error(msg);
    } finally {
      setMessaging(false);
    }
  };

  const connectButtonClass = isStatusLoading
    ? 'bg-[#16730F]/80 cursor-wait'
    : connectDisabled
      ? 'bg-gray-400 cursor-not-allowed'
      : 'bg-[#16730F] hover:bg-[#145a0c]';

  return (
    <div className="mt-4 grid grid-cols-1 min-[420px]:grid-cols-2 gap-2 sm:gap-3 w-full max-w-lg mx-auto sm:mx-0 min-w-0">
      <button
        type="button"
        onClick={handleConnect}
        disabled={connectDisabled || isStatusLoading}
        aria-busy={showConnectSpinner}
        className={`inline-flex w-full min-h-[44px] items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-full text-sm font-semibold text-white transition-colors ${connectButtonClass}`}
      >
        {showConnectSpinner ? (
          <span
            className="inline-block h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-white border-t-transparent"
            aria-hidden="true"
          />
        ) : (
          <>
            <FaUserPlus className="shrink-0" />
            <span className="truncate">{connectLabel}</span>
          </>
        )}
        {showConnectSpinner && (
          <span className="sr-only">Loading connection status</span>
        )}
      </button>
      <button
        type="button"
        onClick={handleMessage}
        disabled={messaging}
        aria-busy={messaging}
        className="inline-flex w-full min-h-[44px] items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-full text-sm font-semibold text-[#16730F] border-2 border-[#16730F] bg-white hover:bg-[#16730F]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {messaging ? (
          <span
            className="inline-block h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-[#16730F] border-t-transparent"
            aria-hidden="true"
          />
        ) : (
          <FaComment className="shrink-0" />
        )}
        <span>Message</span>
      </button>
    </div>
  );
}
