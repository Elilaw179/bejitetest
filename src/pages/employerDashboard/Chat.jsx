import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Search,
  Phone,
  Video,
  MoreHorizontal,
  Smile,
  Plus,
  Paperclip,
  Mic,
  Send,
} from 'lucide-react';
import user1Avatar from '../../assets/user1.png';
import user2Avatar from '../../assets/user2.png';
import user3Avatar from '../../assets/user3.png';
import user4Avatar from '../../assets/user4.png';
import user5Avatar from '../../assets/user5.png';
import user6Avatar from '../../assets/user6.png';
import placeholderImage from '../../assets/image.png';

const Chat = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [activeUsers] = useState([1, 3, 5]);

  const users = [
    { id: 1, name: 'Okpata Favour', lastMessage: 'Hey...', avatar: user1Avatar, jobTitle: 'Recruiter', email: 'okpata.favour@example.com', phone: '+234 8012345678', linktree: 'https://linktree.com/okpata' },
    { id: 2, name: 'Osakwe Prisca', lastMessage: 'online', avatar: user2Avatar, jobTitle: 'Jobseeker', email: 'osakweprisca@gmail.com', phone: '+234 7067410614', linktree: 'https://linktree.com/prisca' },
    { id: 3, name: 'Efe Elisha', lastMessage: 'Hey...', avatar: user3Avatar, jobTitle: 'Software Engineer', email: 'efe.elisha@example.com', phone: '+234 9012345678', linktree: 'https://linktree.com/elisha' },
    { id: 4, name: 'Salik Raymond', lastMessage: 'Hey...', avatar: user4Avatar, jobTitle: 'Designer', email: 'salik.raymond@example.com', phone: '+234 8112345678', linktree: 'https://linktree.com/raymond' },
    { id: 5, name: 'Jaden Ellen', lastMessage: 'Hey...', avatar: user5Avatar, jobTitle: 'Product Manager', email: 'jaden.ellen@example.com', phone: '+234 7112345678', linktree: 'https://linktree.com/jaden' },
    { id: 6, name: 'Quadson Pritex', lastMessage: 'Hey...', avatar: user6Avatar, jobTitle: 'Marketing Specialist', email: 'quadson.pritex@example.com', phone: '+234 9212345678', linktree: 'https://linktree.com/quadson' },
  ];

  const currentActiveUser = users.find(user => user.id === activeChat);

  const initialMessages = {
    1: [
      {
        id: 1,
        sender: 'Okpata Favour',
        text: "Hello Prisca, We've reviewed your CV and portfolio...",
        time: 'Sat at 11:00 AM',
        type: 'received',
      },
      {
        id: 2,
        sender: 'You',
        text: "Thank you for reaching out. I'm interested in the role...",
        time: 'Sat at 11:05 AM',
        type: 'sent',
      },
      {
        id: 3,
        sender: 'Okpata Favour',
        text: "Great! Let's go with Friday at 10:00 AM.",
        time: 'Sun at 5:05 AM',
        type: 'received',
      },
    ],
    2: [], 3: [], 4: [], 5: [], 6: [],
  };

  const [messages, setMessages] = useState(initialMessages);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChat]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;

    const newMsg = {
      id: Date.now(),
      sender: 'You',
      text: newMessage.trim(),
      time: new Date().toLocaleString('en-US', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      type: 'sent',
    };

    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMsg],
    }));

    setNewMessage('');
  };

  return (
    <main className="flex flex-col h-screen font-inter">
      <section className="flex flex-1 bg-gray-100 rounded-lg">
        {/* Sidebar */}
        <div className="w-72 bg-[#143d2a] text-white flex flex-col p-4 rounded-tl-lg rounded-bl-lg">
          <div className="flex items-center gap-2 mb-4">
            <ChevronLeft size={20} color="#556B1F" />
            <h2 className="text-xl font-semibold text-[#556B1F]">Chat</h2>
          </div>

          {/* Search */}
          <div className="flex items-center bg-white rounded-xl px-3 py-2 mb-4">
            <input
              type="text"
              placeholder="Search"
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-[#1A3E32] text-sm"
            />
            <Search size={16} color="#1A3E32" />
          </div>

          {/* Active Users Row */}
          <div className="flex gap-3 overflow-x-auto mb-4">
            {users
              .filter(user => activeUsers.includes(user.id))
              .map(user => (
                <div key={user.id} className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                </div>
              ))}
          </div>

          {/* Divider */}
          <div className=" border-t-2 border-[#16730F] " />

          {/* Chat List */}
          <div className="flex flex-col gap-3 overflow-y-auto">
            {users.map(user => (
              <div
                key={user.id}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                  activeChat === user.id ? 'bg-[#2d5a2d]' : 'hover:bg-[#1f523c]'
                }`}
                onClick={() => setActiveChat(user.id)}
              >
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-sm font-medium">{user.name}</h4>
                  <p className="text-xs text-gray-300">{user.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        {activeChat ? (
          <div className="flex-1 flex flex-col bg-gray-50 rounded-tr-lg rounded-br-lg">
            {/* Chat Header */}
            <div className="bg-white p-4 flex items-center justify-between rounded-tr-lg shadow">
              <div className="flex items-center gap-3">
                <img
                  src={currentActiveUser?.avatar}
                  alt={currentActiveUser?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{currentActiveUser?.name}</h3>
                  <p className="text-green-500 text-sm">online</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-gray-600 hover:text-[#143d2a] cursor-pointer" />
                <Video className="text-gray-600 hover:text-[#143d2a] cursor-pointer" />
                <MoreHorizontal className="text-gray-600 hover:text-[#143d2a] cursor-pointer" />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto">
              {(messages[activeChat] || []).map(message => (
                <div
                  key={message.id}
                  className={`flex mb-4 ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg shadow text-sm ${
                      message.type === 'sent'
                        ? 'bg-[#143d2a] text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {message.type === 'received' && (
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={currentActiveUser.avatar}
                          alt={message.sender}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="font-semibold">{message.sender}</span>
                      </div>
                    )}
                    <p>{message.text}</p>
                    <span className="block text-xs mt-1 text-right text-gray-400">{message.time}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="w-full flex items-center bg-gray-200 border border-green-500 rounded-2xl px-4 py-2 mx-auto">
              {/* Left icons */}
              <div className="flex items-center space-x-2">
                <button className="text-black hover:text-green-600">
                  <Smile size={22} />
                </button>
                <button className="text-black hover:text-green-600">
                  <Plus size={22} />
                </button>
              </div>

              {/* Input */}
              <input
                type="text"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-transparent focus:outline-none text-green-700 placeholder-green-600 ml-3"
              />

              {/* Right icons */}
              <div className="flex items-center space-x-3">
                <button className="text-black hover:text-green-600">
                  <Paperclip size={22} />
                </button>
                <button className="text-black hover:text-green-600">
                  <Mic size={22} />
                </button>
                <button
                  className="bg-green-900 text-yellow-400 p-2 rounded-full hover:bg-green-800"
                  onClick={handleSendMessage}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Placeholder
          <div className="flex-1 flex flex-col justify-center items-center text-center text-[#2d5a2d] p-4 rounded-tr-lg rounded-br-lg">
            <img src={placeholderImage} alt="" />
            <h2 className="text-2xl font-bold mb-2">No Conversation Selected</h2>
            <p className="text-gray-600">
              Choose a conversation on the left to view or respond to messages.
            </p>
          </div>
        )}

        {/* Profile Panel */}
        {activeChat && currentActiveUser && (
          <div className="w-72 bg-[#2d5a2d] text-white flex flex-col items-center p-6 rounded-tr-lg rounded-br-lg">
            <img
              src={currentActiveUser.avatar}
              alt={currentActiveUser.name}
              className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-white"
            />
            <h3 className="text-lg font-bold">{currentActiveUser.name}</h3>
            <p className="text-sm text-gray-200 mb-4">{currentActiveUser.jobTitle}</p>
            <button className="bg-[#f4a300] text-[#143d2a] px-6 py-2 rounded-full font-semibold mb-6 hover:bg-yellow-400 transition">
              View Profile
            </button>

            <div className="w-full">
              <div className="bg-[#143d2a] rounded-md p-3 mb-3">
                <p className="text-xs text-gray-300">Email</p>
                <p className="text-sm font-medium">{currentActiveUser.email}</p>
              </div>
              <div className="bg-[#143d2a] rounded-md p-3 mb-3">
                <p className="text-xs text-gray-300">Phone</p>
                <p className="text-sm font-medium">{currentActiveUser.phone}</p>
              </div>
              <div className="bg-[#143d2a] rounded-md p-3">
                <p className="text-xs text-gray-300">Linktree</p>
                <a
                  href={currentActiveUser.linktree}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium underline hover:text-yellow-200"
                >
                  {currentActiveUser.linktree}
                </a>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Chat;