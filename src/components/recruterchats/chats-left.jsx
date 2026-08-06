import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import messagingService from '../../services/messagingService';
import { API_URL } from '../../config';
import { formatConversationPreview } from '../../utils/conversationPreview';
import { formatDisplayPersonName } from '../../utils/personDisplayName';
import DisplayNameWithBadge from '../DisplayNameWithBadge';

const CONVERSATION_UPDATED = 'chat:conversation-updated';

function ChatsLeft({ onSelectChat }) {
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
    const onUpdate = () => fetchConversations(true);
    window.addEventListener(CONVERSATION_UPDATED, onUpdate);
    const interval = setInterval(() => fetchConversations(true), 12000);
    return () => {
      window.removeEventListener(CONVERSATION_UPDATED, onUpdate);
      clearInterval(interval);
    };
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

  const fetchConversations = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await messagingService.getConversations();
      setConversations(data || []);
      if (!silent) setError(null);
    } catch (err) {
      if (!silent) setError('Failed to load conversations');
      console.error('Error fetching conversations:', err);
    } finally {
      if (!silent) setLoading(false);
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

  const Avatar = ({ imageUrl, firstName, lastName, alt, sizeClass = 'w-12 h-12' }) => (
    imageUrl ? (
      <img
        src={imageUrl}
        alt={alt}
        className={`${sizeClass} rounded-full object-cover`}
      />
    ) : (
      <div className={`${sizeClass} rounded-full bg-[#556B1F] text-white font-semibold flex items-center justify-center`}>
        {getInitials(firstName, lastName)}
      </div>
    )
  );

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
      <div className="flex-1 overflow-y-auto nfl-sidebar-scroll scroll-smooth border-t border-[#556B1F]">
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
                const displayName = formatDisplayPersonName(user, 'Unknown User');
                const profileImageRaw = user.profilePictureUrl || user.profilePhoto || user.profile_photo || '';
                const profileImage = getProfileImageUrl(profileImageRaw);

                return (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className="flex items-center gap-3 p-3 mx-2 rounded-lg hover:bg-[#556B1F]/20 cursor-pointer transition-colors"
                  >
                    <div className="relative">
                      <Avatar
                        imageUrl={profileImage}
                        firstName={user.firstName}
                        lastName={user.lastName}
                        alt={displayName}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <div className="min-w-0 flex-1">
                          <DisplayNameWithBadge
                            user={user}
                            fallback={displayName}
                            badgeSize="xs"
                            badgePlacement="below"
                            className="items-start"
                            nameClassName="text-white text-sm font-medium"
                          />
                        </div>
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
                const displayName = formatDisplayPersonName(otherUser, 'Unknown User');
                const profileImageRaw = otherUser?.profilePictureUrl || otherUser?.profilePhoto || otherUser?.profile_photo || '';
                const profileImage = getProfileImageUrl(profileImageRaw);
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
                      <Avatar
                        imageUrl={profileImage}
                        firstName={otherUser?.firstName}
                        lastName={otherUser?.lastName}
                        alt={displayName}
                      />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#fff] text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="min-w-0 flex-1">
                          <DisplayNameWithBadge
                            user={otherUser}
                            fallback={displayName}
                            badgeSize="xs"
                            badgePlacement="below"
                            className="items-start"
                            nameClassName={`text-sm truncate ${unreadCount > 0 ? 'text-white font-bold' : 'text-white font-medium'}`}
                          />
                        </div>
                        <span className={`text-xs flex-shrink-0 pt-0.5 ${unreadCount > 0 ? 'text-white font-semibold' : 'text-[#fff]'}`}>{lastMessageTime}</span>
                      </div>
                      <p className={`text-xs truncate ${unreadCount > 0 ? 'text-white/80 font-semibold' : 'text-[#fff]'}`}>
                        {formatConversationPreview(conversation)}
                      </p>
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