import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import image from '../../assets/Ellipse.png';
import messagingService from '../../services/messagingService';

function ChatsLeft({ onSelectChat, onBack }) {
  const [conversations, setConversations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);



  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      handleUserSearch(searchTerm);
      setIsSearching(true);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, [searchTerm]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await messagingService.getConversations();
      setConversations(data || []);
    } catch (err) {
      setError('Failed to load conversations');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSearch = async (query) => {
    if (!query.trim()) return;

    try {
      setSearchLoading(true);
      const users = await messagingService.searchUsers(query);
      setSearchResults(users || []);
    } catch (err) {
      console.error('Error searching users:', err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleUserSelect = async (user) => {
    try {
      // Start a conversation with the selected user (ensure string ID)
      const conversation = await messagingService.startConversation(String(user.id));
      
      // Fetch the updated conversations list to get the fully populated conversation object
      const updatedConversations = await messagingService.getConversations();
      setConversations(updatedConversations || []);
      
      // Find the fully populated conversation (which includes other_user details)
      const fullConversation = (updatedConversations || []).find(c => c.id === conversation.id);
      
      // Select the fully populated conversation, fallback to manually attaching user info if needed
      onSelectChat(fullConversation || { ...conversation, other_user: user });
      
      // Clear search
      setSearchTerm('');
      setIsSearching(false);
    } catch (err) {
      console.error('Error starting conversation:', err);
      setError(`Failed to start conversation: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="bg-[#1A3E32] h-full flex flex-col">
      {/* Header */}
      {/* <div className="flex items-center gap-2 p-4 ">
        <button
          type="button"
          aria-label="Go back"
          onClick={onBack}
          className="flex items-center text-[#556B1F] hover:text-white transition "
        >
          <FaArrowLeft className='text-[#556B1F]'  />
        </button>
        <h2 className="text-[20px] text-[#556B1F]">Invitations</h2>
      </div> */}

      {/* Search Bar */}
      <div className="p-4">
        <div className="flex items-center bg-white rounded-full px-3 py-2">
          <input
            className="w-full outline-none bg-transparent text-sm placeholder-gray-500"
            placeholder="Search users to start a conversation"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 ml-2"></div>
          ) : (
            <FaSearch className="text-gray-500 ml-2" />
          )}
        </div>
      </div>

    
   


      {/* Conversations/Search Results List */}
      <div className="flex-1 overflow-y-auto border-t border-[#556B1F]">
        <div className="px-2 mt-4">
          {loading && !isSearching ? (
            <div className="text-center text-[#556B1F] py-4">
              Loading conversations...
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-4">
              {error}
            </div>
          ) : isSearching ? (
            // Show search results
            searchResults.length === 0 ? (
              <div className="text-center text-[#fff] py-4">
                {searchLoading ? 'Searching...' : 'No users found'}
              </div>
            ) : (
              searchResults.map((user) => {
                const displayName = `${user.firstName} ${user.lastName}`;
                const profileImage = user.profilePhoto || image;

                return (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className="flex items-center gap-3 p-3 mx-2 rounded-lg hover:bg-[#556B1F]/20 cursor-pointer transition-colors"
                  >
                    <div className="relative">
                      <img
                        src={profileImage}
                        alt={displayName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white text-sm font-medium truncate">{displayName}</h3>
                      </div>
                      <p className="text-[#fff] text-xs truncate">
                        {user.jobTitle || 'Click to start conversation'}
                      </p>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            // Show conversations
            conversations.length === 0 ? (
              <div className="text-center text-[#556B1F] py-4">
                No conversations yet. Search for users to start chatting!
              </div>
            ) : (
conversations.map((conversation) => {
                const otherUser = conversation.other_user;
                const displayName = otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Unknown User';
                const profileImage = otherUser?.profilePictureUrl || otherUser?.profilePhoto || image;
                const lastMessageTime = conversation.last_message_at ?
                  new Date(conversation.last_message_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) :
                  '';
                const unreadCount = conversation.unread_count || 0;

                return (
                  <div
                    key={conversation.id}
                    onClick={() => onSelectChat(conversation)}
                    className={`flex items-center gap-3 p-3 mx-2 rounded-lg hover:bg-[#556B1F]/20 cursor-pointer transition-colors ${unreadCount > 0 ? 'bg-[#556B1F]/10' : ''}`}
                  >
                    <div className="relative">
                      <img
                        src={profileImage}
                        alt={displayName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#fff] text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm truncate ${unreadCount > 0 ? 'text-white font-bold' : 'text-white font-medium'}`}>{displayName}</h3>
                        <span className={`text-xs flex-shrink-0 ${unreadCount > 0 ? 'text-white font-semibold' : 'text-[#fff]'}`}>{lastMessageTime}</span>
                      </div>
                      <p className={`text-xs truncate ${unreadCount > 0 ? 'text-white/80 font-semibold' : 'text-[#fff]'}`}>{conversation.lastMessage || 'No messages yet'}</p>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatsLeft;