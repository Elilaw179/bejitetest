import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaArrowLeft, FaPhone, FaVideo, FaBars } from 'react-icons/fa';
import messagingService from '../../services/messagingService';
import { API_URL } from '../../config';
import ChatMessageInput from '../chat/ChatMessageInput';
import MessageAttachment from '../chat/MessageAttachment';

function ChatsMiddle({ selectedChat, onShowChatList, onShowChatInfo }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (selectedChat?.id) {
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
      await messagingService.sendMessage(selectedChat.id, message.trim());
      setMessage('');
      fetchMessages(selectedChat.id);
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
      await messagingService.sendMessage(selectedChat.id, caption, url);
      setMessage('');
      fetchMessages(selectedChat.id);
      window.dispatchEvent(new CustomEvent('chat:conversation-updated'));
    } catch (error) {
      console.error('Error sending attachment:', error);
    } finally {
      setSending(false);
    }
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
  const selectedFullName = `${selectedFirstName} ${selectedLastName}`.trim() || 'Chat';
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
        className="lg:hidden text-gray-600 hover:text-gray-800 transition-colors"
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
  <div className="flex-1 min-h-0 overflow-y-auto p-2 md:p-4">
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
      <div className="space-y-4">
        {messages.map((msg) => {
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

          const messageSenderId = msg.sender_id || msg.user_id || msg.sender?.id || msg.senderId;

          // Prefer ID-based check for robust sender/receiver separation
          let isOwnMessage = false;
          if (currentUserId != null && messageSenderId != null) {
            isOwnMessage = String(messageSenderId) === String(currentUserId);
          } else if (selectedOtherUserId != null && messageSenderId != null) {
            // If current user ID is not available after refresh, infer from selected chat participant
            isOwnMessage = String(messageSenderId) !== String(selectedOtherUserId);
          } else {
            // Final fallback to name match only when IDs are missing
            isOwnMessage =
              `${msg.firstName || msg.first_name || ''} ${msg.lastName || msg.last_name || ''}`.trim() ===
              `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim();
          }

          // Real names from backend JOIN
          // Backend returns firstName/lastName directly on msg (JOIN), NOT msg.sender object
          const senderName =
            `${msg.firstName || msg.first_name || ''} ${msg.lastName || msg.last_name || ''}`.trim() ||
            'User';
          const messageTime = new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

          return (
            <div key={msg.id} className={isOwnMessage ? 'flex justify-end mb-2 md:mb-4' : 'flex justify-start mb-2 md:mb-4'}>
              <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} w-full max-w-xs md:max-w-md`}>
                {!isOwnMessage && (
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    {senderName}
                  </div>
                )}
                <div className={`p-2 md:p-3 rounded-2xl shadow-sm ${isOwnMessage ? 'bg-green-500 text-white ml-8 md:ml-16 rounded-r-none' : 'bg-white text-gray-900 mr-8 md:mr-16 rounded-l-none border'}`}>
                  {msg.image_url && (
                    <MessageAttachment url={msg.image_url} caption={msg.content} />
                  )}
                  {(() => {
                    const attachmentLabel =
                      msg.image_url &&
                      (msg.content === '🎬 Video' ||
                        msg.content === '🎤 Voice message' ||
                        msg.content?.startsWith('📎'));
                    if (!msg.content || attachmentLabel) return null;
                    return (
                      <p className={msg.is_deleted ? 'italic text-gray-400 line-through' : ''}>
                        {msg.content}
                      </p>
                    );
                  })()}
                </div>
                <div className={`text-xs mt-1 ${isOwnMessage ? 'text-gray-500 ml-auto' : 'text-gray-500'}`}>
                  {messageTime}
                </div>
              </div>
            </div>
          );
        })}
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