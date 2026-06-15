import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import messagingService from '../../services/messagingService'
import ChatsRight from '../../components/recruterchats/chats-right'
import ChatsLeft from '../../components/recruterchats/chats-left'
import ChatsMiddle from '../../components/recruterchats/chats-middle'
import NewsFeedLayout from '../../components/layout/NewsFeedLayout'

function Chat() {
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentView, setCurrentView] = useState('chatList'); // 'chatList', 'chatView', 'chatInfo'

  useEffect(() => {
    const openConversationId = location.state?.openConversationId;
    if (!openConversationId) return;

    let cancelled = false;

    (async () => {
      try {
        const conversations = await messagingService.getConversations();
        const match = (conversations || []).find(
          (c) => String(c.id) === String(openConversationId),
        );
        if (!cancelled && match) {
          setSelectedChat(match);
          setCurrentView('chatView');
        }
      } catch (err) {
        console.error('Error opening conversation from profile:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [location.state?.openConversationId]);

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
    <NewsFeedLayout scrollable={false} classes={false} showSidebars={false}>
      <div className="h-[calc(100vh-72px)] w-full overflow-hidden p-2 sm:p-4">
        <div className="h-full w-full max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr_1fr] gap-4 h-full min-h-0">

            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-subgrid lg:col-span-3 lg:gap-4 h-full min-h-0">
              {/* Left Sidebar - Chat List */}
              <div className="bg-[#1A3E32] rounded-lg overflow-hidden h-full min-h-0">
                <ChatsLeft
                  onSelectChat={handleSelectChat}
                  selectedChat={selectedChat}
                />
              </div>

              {/* Middle Chat Section - Message Area */}
              <div className="bg-white rounded-lg overflow-hidden h-full min-h-0">
                <ChatsMiddle
                  selectedChat={selectedChat}
                  onShowChatList={showChatList}
                  onShowChatInfo={showChatInfo}
                />
              </div>

              {/* Right Sidebar - Chat Info */}
              <div className="bg-[#F5F5F5] rounded-lg overflow-hidden h-full min-h-0">
                <ChatsRight
                  selectedChat={selectedChat}
                  onBack={showChatView}
                />
              </div>
            </div>

            {/* Mobile/Tablet Layout */}
            <div className="lg:hidden h-full min-h-0">
              {currentView === 'chatList' && (
                <div className="bg-[#1A3E32] rounded-lg overflow-hidden h-full min-h-0">
                  <ChatsLeft
                    onSelectChat={handleSelectChat}
                    selectedChat={selectedChat}
                  />
                </div>
              )}

              {currentView === 'chatView' && (
                <div className="bg-white rounded-lg overflow-hidden h-full min-h-0">
                  <ChatsMiddle
                    selectedChat={selectedChat}
                    onShowChatList={showChatList}
                    onShowChatInfo={showChatInfo}
                  />
                </div>
              )}

              {currentView === 'chatInfo' && (
                <div className="bg-[#F5F5F5] rounded-lg overflow-hidden h-full min-h-0">
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
    </NewsFeedLayout>
  );
}

export default Chat;