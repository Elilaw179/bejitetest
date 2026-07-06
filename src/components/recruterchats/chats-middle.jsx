import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FaArrowLeft, FaPhone, FaVideo, FaBars } from 'react-icons/fa';
import { toast } from 'react-toastify';
import messagingService from '../../services/messagingService';
import { API_URL } from '../../config';
import ChatMessageInput from '../chat/ChatMessageInput';
import ChatMessageBubble, {
  formatChatMessageTime,
} from '../chat/ChatMessageBubble';
import { formatDisplayPersonName } from '../../utils/personDisplayName';

function ChatsMiddle({ selectedChat, onShowChatList, onShowChatInfo }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const stickToBottomRef = useRef(true);

  const isNearBottom = useCallback((threshold = 96) => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    return (
      container.scrollHeight - container.scrollTop - container.clientHeight <=
      threshold
    );
  }, []);

  const scrollToBottom = useCallback((behavior = 'auto') => {
    const end = messagesEndRef.current;
    if (end) {
      end.scrollIntoView({ behavior, block: 'end' });
      return;
    }

    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  }, []);

  const handleMessagesScroll = () => {
    stickToBottomRef.current = isNearBottom();
  };

  useEffect(() => {
    if (selectedChat?.id) {
      stickToBottomRef.current = true;
      setEditingMessageId(null);
      fetchMessages(selectedChat.id);
      // Mark conversation as read when opened
      messagingService.markConversationRead(selectedChat.id).catch((err) => {
        console.error('Error marking conversation as read:', err);
      });
    }
  }, [selectedChat]);

  useEffect(() => {
    if (!selectedChat?.id) return;

    const interval = setInterval(() => {
      fetchMessages(selectedChat.id, true); // silent fetch
    }, 5000); // poll every 5 seconds

    return () => clearInterval(interval);
  }, [selectedChat]);

  useEffect(() => {
    if (!messages.length || loading) return;
    if (!stickToBottomRef.current) return;

    requestAnimationFrame(() => {
      scrollToBottom('auto');
    });
  }, [messages, loading, scrollToBottom]);

  const fetchMessages = async (conversationId, silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await messagingService.getMessages(conversationId);
      setMessages((data || []).reverse());
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat?.id || sending) return;

    try {
      setSending(true);
      stickToBottomRef.current = true;
      await messagingService.sendMessage(selectedChat.id, message.trim());
      setMessage('');
      await fetchMessages(selectedChat.id, true);
      window.dispatchEvent(new CustomEvent('chat:conversation-updated'));
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleSendAttachment = async (url, caption = '') => {
    if (!selectedChat?.id || sending) return;

    try {
      setSending(true);
      stickToBottomRef.current = true;
      await messagingService.sendMessage(selectedChat.id, caption, url);
      setMessage('');
      await fetchMessages(selectedChat.id, true);
      window.dispatchEvent(new CustomEvent('chat:conversation-updated'));
    } catch (error) {
      console.error('Error sending attachment:', error);
    } finally {
      setSending(false);
    }
  };

  const handleEditMessage = async (messageId, content) => {
    if (!messageId || !content.trim() || savingEdit) return;

    try {
      setSavingEdit(true);
      await messagingService.editMessage(messageId, content.trim());
      setEditingMessageId(null);
      await fetchMessages(selectedChat.id, true);
      window.dispatchEvent(new CustomEvent('chat:conversation-updated'));
    } catch (error) {
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'Failed to edit message';
      toast.error(msg);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!messageId) return;
    if (!window.confirm('Delete this message?')) return;

    try {
      await messagingService.deleteMessage(messageId);
      if (editingMessageId === messageId) {
        setEditingMessageId(null);
      }
      await fetchMessages(selectedChat.id, true);
      window.dispatchEvent(new CustomEvent('chat:conversation-updated'));
    } catch (error) {
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'Failed to delete message';
      toast.error(msg);
    }
  };

  const isOwnMessage = (msg) => {
    const currentUserId =
      currentUser?.id ||
      currentUser?.user_id ||
      currentUser?.userId ||
      currentUser?.sub ||
      currentUser?.authId;

    const selectedOtherUserId =
      selectedChat?.other_user?.id ||
      selectedChat?.other_user?.user_id ||
      selectedChat?.otherUserId;

    const messageSenderId =
      msg.sender_id || msg.user_id || msg.sender?.id || msg.senderId;

    if (currentUserId != null && messageSenderId != null) {
      return String(messageSenderId) === String(currentUserId);
    }
    if (selectedOtherUserId != null && messageSenderId != null) {
      return String(messageSenderId) !== String(selectedOtherUserId);
    }

    return (
      `${msg.firstName || msg.first_name || ''} ${msg.lastName || msg.last_name || ''}`.trim() ===
      `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim()
    );
  };

  const getInitials = (firstName, lastName) => {
    const first = (firstName || '').trim().charAt(0).toUpperCase();
    const last = (lastName || '').trim().charAt(0).toUpperCase();
    return `${first}${last}` || 'U';
  };

  const getProfileImageUrl = (imagePath) => {
    if (!imagePath) return imagePath;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) {
      const baseUrl = API_URL || 'http://localhost:3001';
      return `${baseUrl}${imagePath}`;
    }
    return `${API_URL || 'http://localhost:3001'}${imagePath}`;
  };

  const selectedFirstName = selectedChat?.other_user?.firstName || '';
  const selectedLastName = selectedChat?.other_user?.lastName || '';
  const selectedFullName = formatDisplayPersonName(
    { firstName: selectedFirstName, lastName: selectedLastName },
    'Chat',
  );
  const selectedProfileImageRaw = selectedChat?.other_user?.profilePictureUrl || selectedChat?.other_user?.profilePhoto || '';
  const selectedProfileImage = getProfileImageUrl(selectedProfileImageRaw);

  if (!selectedChat) {
    return (
      <main className="w-full h-full min-h-0 flex flex-col overflow-hidden bg-gray-100 items-center justify-center">
        <p className="text-[#16730F] text-sm md:text-base">Select a conversation to start chatting</p>
      </main>
    );
  }

  return (
<main className="w-full h-full min-h-0 flex flex-col overflow-hidden bg-gray-100">
  {/* Header */}
  <div className="bg-gray-200 shrink-0 flex items-center justify-between px-4 py-4 md:py-7">
    <div className="flex items-center gap-2 md:gap-3">
      <button
        onClick={onShowChatList}
        className="md:hidden text-gray-600 hover:text-gray-800 transition-colors"
        aria-label="Back to conversations"
      >
        <FaArrowLeft />
      </button>
      {selectedProfileImage ? (
        <img
          src={selectedProfileImage}
          alt={selectedFullName}
          className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover lg:hidden"
        />
      ) : (
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#556B1F] text-white font-semibold flex items-center justify-center lg:hidden">
          {getInitials(selectedFirstName, selectedLastName)}
        </div>
      )}
      <div>
          <h1 className="text-lg md:text-2xl font-semibold text-[#16730F]">
            {selectedFullName}
          </h1>
          <p className="text-xs md:text-sm text-[#16730F]">Online</p>
       </div>
    </div>

    <div className='flex items-center gap-2'>
      <button className="bg-[#16730F] text-white p-2 rounded-full hover:bg-[#1a5c13] transition">
        <FaPhone className="text-sm" />
      </button>
      <button className="bg-[#16730F] text-white p-2 rounded-full hover:bg-[#1a5c13] transition">
        <FaVideo className="text-sm" />
      </button>
      <button 
        onClick={onShowChatInfo}
        className="lg:hidden text-gray-600 hover:text-gray-800 transition-colors ml-2"
      >
        <FaBars />
      </button>
    </div>
  </div>

  {/* Messages Area */}
  <div
    ref={messagesContainerRef}
    onScroll={handleMessagesScroll}
    className="flex-1 min-h-0 overflow-y-auto nfl-scroll scroll-smooth p-3 md:p-5 bg-[#F7F7F7]"
  >
    {loading ? (
      <div className="text-center text-[#16730F] py-2 md:py-4">
        Loading messages...
      </div>
    ) : messages.length === 0 ? (
      <div className="text-center text-[#16730F] py-4 md:py-8">
        <p className="text-sm md:text-lg font-medium mb-2">No messages yet</p>
        <p className="text-xs md:text-sm">Start a conversation by sending a message.</p>
      </div>
    ) : (
      /* Messages Display */
      <div className="px-1 md:px-2">
        {messages.map((msg) => {
          const senderName = formatDisplayPersonName(
            {
              firstName: msg.firstName ?? msg.first_name,
              lastName: msg.lastName ?? msg.last_name,
            },
            'User',
          );
          const messageTime = formatChatMessageTime(msg.created_at);
          const ownMessage = isOwnMessage(msg);
          const senderAvatar = getProfileImageUrl(
            msg.profilePictureUrl ||
              msg.profile_photo ||
              (!ownMessage
                ? selectedChat?.other_user?.profilePictureUrl ||
                  selectedChat?.other_user?.profilePhoto
                : null),
          );
          const senderInitials = getInitials(
            msg.firstName ?? msg.first_name,
            msg.lastName ?? msg.last_name,
          );

          return (
            <ChatMessageBubble
              key={msg.id}
              message={msg}
              isOwnMessage={ownMessage}
              senderName={senderName}
              senderAvatar={senderAvatar}
              senderInitials={senderInitials}
              messageTime={messageTime}
              editing={editingMessageId === msg.id}
              saving={savingEdit && editingMessageId === msg.id}
              onStartEdit={() => setEditingMessageId(msg.id)}
              onCancelEdit={() => setEditingMessageId(null)}
              onSaveEdit={(content) => handleEditMessage(msg.id, content)}
              onDelete={() => handleDeleteMessage(msg.id)}
            />
          );
        })}
        <div ref={messagesEndRef} aria-hidden="true" />
      </div>
    )}
  </div>

  {selectedChat?.id ? (
    <ChatMessageInput
      message={message}
      setMessage={setMessage}
      onSend={handleSendMessage}
      onSendAttachment={handleSendAttachment}
      sending={sending}
      disabled={!selectedChat?.id}
    />
  ) : (
    <div className="shrink-0 p-4 text-center text-sm text-gray-500">
      Select a conversation to send messages
    </div>
  )}
</main>
  );
}

export default ChatsMiddle;