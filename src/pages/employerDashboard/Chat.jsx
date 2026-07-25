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
    const params = new URLSearchParams(location.search);
    const openConversationId =
      location.state?.openConversationId || params.get('conversation');
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
        console.error('Error opening conversation from notification/profile:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [location.state?.openConversationId, location.search]);

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
      <div className="flex-1 min-h-0 w-full overflow-hidden overscroll-none p-2 sm:p-4 flex flex-col">
        <div className="flex-1 min-h-0 w-full max-w-screen-xl mx-auto flex flex-col overflow-hidden">

          {/* Phone: single-panel navigation */}
          <div className="md:hidden flex-1 min-h-0 flex flex-col overflow-hidden">
            {currentView === 'chatList' && (
              <div className="bg-[#1A3E32] rounded-lg overflow-hidden flex-1 min-h-0">
                <ChatsLeft
                  onSelectChat={handleSelectChat}
                  selectedChat={selectedChat}
                />
              </div>
            )}

            {currentView === 'chatView' && (
              <div className="bg-white rounded-lg overflow-hidden flex-1 min-h-0 flex flex-col">
                <ChatsMiddle
                  selectedChat={selectedChat}
                  onShowChatList={showChatList}
                  onShowChatInfo={showChatInfo}
                />
              </div>
            )}

            {currentView === 'chatInfo' && (
              <div className="bg-[#F5F5F5] rounded-lg overflow-hidden flex-1 min-h-0">
                <ChatsRight
                  selectedChat={selectedChat}
                  onBack={showChatView}
                />
              </div>
            )}
          </div>

          {/* Tablet: conversation list + messages side by side */}
          <div className="hidden md:grid lg:hidden grid-cols-[minmax(240px,300px)_1fr] gap-3 flex-1 min-h-0 overflow-hidden">
            <div className="bg-[#1A3E32] rounded-lg overflow-hidden min-h-0 h-full">
              <ChatsLeft
                onSelectChat={handleSelectChat}
                selectedChat={selectedChat}
              />
            </div>

            <div className="relative bg-white rounded-lg overflow-hidden min-h-0 h-full flex flex-col">
              <ChatsMiddle
                selectedChat={selectedChat}
                onShowChatList={showChatList}
                onShowChatInfo={showChatInfo}
              />
              {currentView === 'chatInfo' && (
                <div className="absolute inset-0 z-40 bg-[#F5F5F5] rounded-lg overflow-hidden min-h-0">
                  <ChatsRight
                    selectedChat={selectedChat}
                    onBack={showChatView}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Desktop: list + messages + profile */}
          <div className="hidden lg:grid lg:grid-cols-[minmax(260px,320px)_1fr_minmax(240px,300px)] gap-4 flex-1 min-h-0 overflow-hidden">
            <div className="bg-[#1A3E32] rounded-lg overflow-hidden min-h-0 h-full">
              <ChatsLeft
                onSelectChat={handleSelectChat}
                selectedChat={selectedChat}
              />
            </div>

            <div className="bg-white rounded-lg overflow-hidden min-h-0 h-full flex flex-col">
              <ChatsMiddle
                selectedChat={selectedChat}
                onShowChatList={showChatList}
                onShowChatInfo={showChatInfo}
              />
            </div>

            <div className="bg-[#F5F5F5] rounded-lg overflow-hidden min-h-0 h-full">
              <ChatsRight
                selectedChat={selectedChat}
                onBack={showChatView}
              />
            </div>
          </div>

        </div>
      </div>
    </NewsFeedLayout>
  );
}

export default Chat;
