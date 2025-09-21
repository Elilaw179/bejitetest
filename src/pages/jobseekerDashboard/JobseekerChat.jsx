import React from 'react'
import { useState } from 'react'
import NewsFeedHeader from '../../components/NewsFeedHeader'
import ChatsRight from '../../components/jobseekerchats/chats-right'
import ChatsLeft from '../../components/jobseekerchats/chats-left'
import ChatsMiddle from '../../components/jobseekerchats/chats-middle'

function JobseekerChat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentView, setCurrentView] = useState('chatList'); // 'chatList', 'chatView', 'chatInfo'

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setCurrentView('chatView');
  };

  const showChatList = () => {
    setCurrentView('chatList');
  };

  const showChatInfo = () => {
    setCurrentView('chatInfo');
  };

  const showChatView = () => {
    setCurrentView('chatView');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header - Replace with your NewsFeedHeader */}
       <NewsFeedHeader />
       
      {/* Main Grid */}
      <div className="flex-1 w-full max-w-screen-xl mx-auto p-2 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr_1fr] gap-4 h-full">
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-subgrid lg:col-span-3 lg:gap-4 h-full">
            {/* Left Sidebar */}
            <div className="bg-[#1A3E32] rounded-lg overflow-y-auto">
              <ChatsLeft 
                onSelectChat={handleSelectChat} 
                selectedChat={selectedChat}
              />
            </div>

            {/* Middle Chat Section */}
            <div className="bg-white rounded-lg overflow-y-auto">
              <ChatsMiddle 
                selectedChat={selectedChat} 
                onShowChatList={showChatList}
                onShowChatInfo={showChatInfo}
              />
            </div>

            {/* Right Sidebar */}
            <div className="bg-[#F5F5F5] rounded-lg overflow-y-auto">
              <ChatsRight 
                selectedChat={selectedChat}
                onBack={showChatView}
              />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden col-span-1 h-full">
            {currentView === 'chatList' && (
              <div className="bg-[#1A3E32] rounded-lg overflow-y-auto h-full">
                <ChatsLeft 
                  onSelectChat={handleSelectChat} 
                  selectedChat={selectedChat}
                />
              </div>
            )}
            
            {currentView === 'chatView' && (
              <div className="bg-white rounded-lg overflow-y-auto h-full">
                <ChatsMiddle 
                  selectedChat={selectedChat} 
                  onShowChatList={showChatList}
                  onShowChatInfo={showChatInfo}
                />
              </div>
            )}
            
            {currentView === 'chatInfo' && (
              <div className="bg-[#F5F5F5] rounded-lg overflow-y-auto h-full">
                <ChatsRight 
                  selectedChat={selectedChat}
                  onBack={showChatView}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobseekerChat;