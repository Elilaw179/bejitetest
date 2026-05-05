import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import image from '../../assets/Ellipse.png';
import { FaArrowLeft, FaPhone, FaVideo, FaBars } from 'react-icons/fa';
import messagingService from '../../services/messagingService';

function ChatsMiddle({ selectedChat, onShowChatList, onShowChatInfo }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (selectedChat?.id) {
      fetchMessages(selectedChat.id);
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
      setMessages(data || []);
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
      // Refresh messages to show the new one
      fetchMessages(selectedChat.id);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
<main className="w-full h-full flex flex-col bg-gray-100">
  {/* Header */}
  <div className="bg-gray-200 flex items-center justify-between px-4 py-4 md:py-7">
    <div className="flex items-center gap-2 md:gap-3">
      <button
        onClick={onShowChatList}
        className="lg:hidden text-gray-600 hover:text-gray-800 transition-colors"
      >
        <FaArrowLeft />
      </button>
      <img
        src={selectedChat?.other_user?.profilePictureUrl || image}
        alt="Profile"
        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover lg:hidden"
      />
      <div>
          <h1 className="text-lg md:text-2xl font-semibold text-[#16730F]">
            {selectedChat?.other_user ? `${selectedChat.other_user.firstName} ${selectedChat.other_user.lastName}` : 'Chat'}
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
  <div className="flex-1 overflow-y-auto p-2 md:p-4">
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
          const isOwnMessage = `${msg.firstName || msg.first_name || ''} ${msg.lastName || msg.last_name || ''}`.trim() === `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim();
// Real names from backend JOIN
// Backend returns firstName/lastName directly on msg (JOIN), NOT msg.sender object
          const senderName = `${msg.firstName || msg.first_name || ''} ${msg.lastName || msg.last_name || ''}`.trim() || currentUser?.firstName || 'User';
          const messageTime = new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

          return (
            <div key={msg.id} className={isOwnMessage ? 'flex justify-start mb-2 md:mb-4' : 'flex justify-end mb-2 md:mb-4'}>
              <div className={`flex flex-col ${isOwnMessage ? 'items-start' : 'items-end'} w-full max-w-xs md:max-w-md`}>
                <div className={`p-2 md:p-3 rounded-2xl shadow-sm ${isOwnMessage ? 'bg-white text-gray-900 mr-8 md:mr-16 rounded-r-none border' : 'bg-green-500 text-white ml-8 md:ml-16 rounded-l-none'}`}>
                  {msg.image_url && (
                    <img src={msg.image_url} alt="attachment" className="mb-2 w-full max-w-xs rounded-lg max-h-32 md:max-h-48 object-cover" />
                  )}
                  <p className={msg.is_deleted ? 'italic text-gray-400 line-through' : ''}>
                    {msg.content}
                  </p>
                </div>
                <div className={`text-xs mt-1 ${isOwnMessage ? 'text-gray-500' : 'text-green-200 ml-auto'} text-xs md:text-xs`}>
                  {messageTime}
                </div>
                {!isOwnMessage && (
                  <div className="text-xs font-medium text-gray-500 mt-1">
                    {senderName}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>

  {/* Message Input */}
  <div className="p-2 md:p-4 bg-gray-100">
    <div className="flex flex-col gap-1 md:gap-2 border border-gray-300 rounded-2xl px-3 md:px-4 py-2 md:py-3 bg-gray-100 shadow-sm">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message"
          className="flex-1 outline-none text-xs md:text-sm bg-transparent placeholder-gray-400"
        />
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-1 md:space-x-2">
          <button
            type="button"
            className="text-gray-500 hover:text-green-600 text-base md:text-lg"
            aria-label="Add emoji"
          >
            😊
          </button>
          <button
            type="button"
            className="text-gray-500 hover:text-green-600 text-base md:text-lg"
            aria-label="Attach file"
          >
            ＋
          </button>
        </div>
        <div className="flex items-center space-x-1 md:space-x-2">
          <button
            type="button"
            className="text-gray-500 hover:text-green-600 text-base md:text-lg"
            aria-label="Record voice"
          >
            🎤
          </button>
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={sending || !message.trim()}
            className="bg-gray-700 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-full p-1 md:p-2 transition"
            aria-label="Send message"
          >
            {sending ? '...' : '➤'}
          </button>
        </div>
      </div>
    </div>
  </div>
</main>
  );
}

export default ChatsMiddle;