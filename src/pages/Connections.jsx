import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsFeedHeader from '../components/NewsFeedHeader';
import { ConnectionList, RequestList } from '../components/connections';
import { FaUserFriends, FaUserPlus, FaClock, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import * as connectionsApi from '../services/connectionsApi';
import { getAuthorProfileImageUrl } from '../utils/profileImageUtils';
import useSyncProfilePhoto from '../hooks/useSyncProfilePhoto';
import NewsFeedLayout from '../components/layout/NewsFeedLayout';
import { formatDisplayPersonName } from '../utils/personDisplayName';

const shuffleArray = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const formatUserName = (user) => formatDisplayPersonName(user, 'Unknown User');

const transformDiscoverableUser = (user) => ({
  id: user.id,
  name: formatUserName(user),
  firstName: user.firstName ?? user.first_name,
  lastName: user.lastName ?? user.last_name,
  email: user.email,
  image: user.profilePhoto ?? user.profile_photo ?? user.image ?? null,
  role: user.jobTitle || 'Professional'
});

const transformConnectionUser = (user, connectedAt) => ({
  id: user?.id,
  name: formatUserName(user),
  firstName: user?.firstName ?? user?.first_name,
  lastName: user?.lastName ?? user?.last_name,
  email: user?.email,
  connectedAt,
  image: user?.profilePhoto ?? user?.profile_photo ?? user?.image ?? null,
  role: user?.jobTitle || 'Professional',
});

const Connections = () => {
  useSyncProfilePhoto();
  const navigate = useNavigate();
  const DEFAULT_PAGE_SIZE = 10;
  const [activeTab, setActiveTab] = useState('network');
  const [connections, setConnections] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [discoverableUsers, setDiscoverableUsers] = useState([]);
  const [peopleSearchResults, setPeopleSearchResults] = useState(null);
  const [peopleSearchLoading, setPeopleSearchLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [networkPage, setNetworkPage] = useState(1);
  const [invitationsPage, setInvitationsPage] = useState(1);
  const [sentPage, setSentPage] = useState(1);
  const [networkMeta, setNetworkMeta] = useState({ total: 0, pages: 1, page: 1, limit: DEFAULT_PAGE_SIZE });
  const [incomingMeta, setIncomingMeta] = useState({ total: 0, pages: 1, page: 1, limit: DEFAULT_PAGE_SIZE });
  const [outgoingMeta, setOutgoingMeta] = useState({ total: 0, pages: 1, page: 1, limit: DEFAULT_PAGE_SIZE });
  const tabContentRef = useRef(null);

  const loadConnectionsData = useCallback(async () => {
    setLoading(true);
    try {
      const [connectionsRes, incomingRes, outgoingRes, discoverRes] = await Promise.all([
        connectionsApi.getConnections(networkPage, pageSize),
        connectionsApi.getIncomingRequests(invitationsPage, pageSize),
        connectionsApi.getOutgoingRequests(sentPage, pageSize),
        connectionsApi.discoverUsers()
      ]);

      // Transform connections data - handle both {connections: [...]} and direct array responses
      const connectionsArray = connectionsRes?.connections || connectionsRes || [];
      const transformedConnections = Array.isArray(connectionsArray)
        ? connectionsArray.map((conn) => transformConnectionUser(conn.user, conn.connectedAt))
        : [];

      // Transform incoming requests data - handle both {requests: [...]} and direct array responses
      const incomingArray = incomingRes?.requests || incomingRes || [];
      const transformedIncoming = Array.isArray(incomingArray) ? incomingArray.map(req => ({
        id: req.id,
        requester: {
          id: req.fromUser?.id,
          name: formatUserName(req.fromUser),
          firstName: req.fromUser?.firstName ?? req.fromUser?.first_name,
          lastName: req.fromUser?.lastName ?? req.fromUser?.last_name,
          email: req.fromUser?.email,
          image: req.fromUser?.profilePhoto ?? req.fromUser?.profile_photo ?? null,
          role: req.fromUser?.jobTitle || 'Professional'
        },
        createdAt: req.createdAt
      })) : [];

      // Transform outgoing requests data - handle both {requests: [...]} and direct array responses
      const outgoingArray = outgoingRes?.requests || outgoingRes || [];
      const transformedOutgoing = Array.isArray(outgoingArray) ? outgoingArray.map(req => ({
        id: req.id,
        recipient: {
          id: req.toUser?.id,
          name: formatUserName(req.toUser),
          firstName: req.toUser?.firstName ?? req.toUser?.first_name,
          lastName: req.toUser?.lastName ?? req.toUser?.last_name,
          email: req.toUser?.email,
          image: req.toUser?.profilePhoto ?? req.toUser?.profile_photo ?? null,
          role: req.toUser?.jobTitle || 'Professional'
        },
        createdAt: req.createdAt
      })) : [];

      // Transform discoverable users data
      const usersArray = discoverRes?.users || discoverRes || [];
      const transformedUsers = Array.isArray(usersArray)
        ? usersArray.map(transformDiscoverableUser)
        : [];

      // Robust randomization to avoid deterministic/alphabetic order
      const randomizedUsers = shuffleArray(transformedUsers);

      setConnections(transformedConnections);
      setIncomingRequests(transformedIncoming);
      setOutgoingRequests(transformedOutgoing);
      setDiscoverableUsers(randomizedUsers);
      setNetworkMeta(
        connectionsRes?.pagination || {
          total: transformedConnections.length,
          pages: 1,
          page: networkPage,
          limit: pageSize,
        },
      );
      setIncomingMeta(
        incomingRes?.pagination || {
          total: transformedIncoming.length,
          pages: 1,
          page: invitationsPage,
          limit: pageSize,
        },
      );
      setOutgoingMeta(
        outgoingRes?.pagination || {
          total: transformedOutgoing.length,
          pages: 1,
          page: sentPage,
          limit: pageSize,
        },
      );
    } catch (error) {
      console.error('Error loading connections data:', error);
      toast.error('Failed to load connections data');
    } finally {
      setLoading(false);
    }
  }, [networkPage, invitationsPage, sentPage, pageSize]);

  useEffect(() => {
    loadConnectionsData();
  }, [loadConnectionsData]);

  // Pagination controls sit below the list; without this, the scroll container stays at the bottom.
  useEffect(() => {
    if (loading) return;
    tabContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [networkPage, invitationsPage, sentPage, loading]);

  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setPeopleSearchResults(null);
      setPeopleSearchLoading(false);
      return undefined;
    }

    const timer = setTimeout(async () => {
      setPeopleSearchLoading(true);
      try {
        const searchRes = await connectionsApi.searchUsers(query);
        const usersArray = searchRes?.users || searchRes || [];
        const transformed = Array.isArray(usersArray)
          ? usersArray.map(transformDiscoverableUser)
          : [];
        setPeopleSearchResults(transformed);
      } catch (error) {
        console.error('Error searching users:', error);
        toast.error('Failed to search for people');
        setPeopleSearchResults([]);
      } finally {
        setPeopleSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setNetworkPage(1);
  }, [searchQuery]);

  useEffect(() => {
    setNetworkPage(1);
    setInvitationsPage(1);
    setSentPage(1);
  }, [pageSize]);

  const handleAcceptRequest = async (requestId, requesterName) => {
    try {
      await connectionsApi.acceptConnectionRequest(requestId);
      toast.success(`Connected with ${requesterName}!`);

      // Update local state
      const acceptedRequest = incomingRequests.find(req => req.id === requestId);
      if (acceptedRequest) {
        setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
        setConnections(prev => [...prev, acceptedRequest.requester]);
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept connection request');
    }
  };

  const handleRejectRequest = async (requestId, requesterName) => {
    try {
      await connectionsApi.rejectConnectionRequest(requestId);
      toast.success(`Declined request from ${requesterName}`);

      // Update local state
      setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject connection request');
    }
  };

  const handleCancelRequest = async (requestId, recipientName) => {
    try {
      await connectionsApi.cancelConnectionRequest(requestId);
      toast.success(`Canceled request to ${recipientName}`);

      // Update local state
      setOutgoingRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error canceling request:', error);
      toast.error('Failed to cancel connection request');
    }
  };

  const handleSendRequest = async (userId, userName) => {
    try {
      await connectionsApi.sendConnectionRequest(userId);
      toast.success(`Connection request sent to ${userName}!`);

      // Update local state - remove from discoverable users and search results
      setDiscoverableUsers(prev => prev.filter(user => user.id !== userId));
      setPeopleSearchResults(prev =>
        prev ? prev.filter(user => user.id !== userId) : prev
      );
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast.error('Failed to send connection request');
    }
  };

  const handleRemoveConnection = async (peerUserId, peerName) => {
    try {
      await connectionsApi.removeConnection(peerUserId);
      toast.success(`Removed connection with ${peerName}`);

      // Update local state
      setConnections(prev => prev.filter(conn => conn.id !== peerUserId));
    } catch (error) {
      console.error('Error removing connection:', error);
      toast.error('Failed to remove connection');
    }
  };

  const filteredConnections = connections.filter(conn =>
    conn.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    {
      id: 'network',
      label: 'My Network',
      icon: FaUserFriends,
      count: networkMeta.total,
      content: (
        <>
          <ConnectionList
            connections={filteredConnections}
            totalCount={networkMeta.total}
            onRemoveConnection={handleRemoveConnection}
            searchQuery=""
            onViewProfile={(userId) => navigate(`/user-profile/${userId}`)}
          />
          <PaginationControls
            currentPage={networkPage}
            totalPages={Math.max(networkMeta.pages || 1, 1)}
            onPageChange={setNetworkPage}
          />
        </>
      )
    },
    {
      id: 'people',
      label: 'People',
      icon: FaUserPlus,
      count: discoverableUsers.length,
      content: (
        <PeopleList
          users={peopleSearchResults ?? discoverableUsers}
          onSendRequest={handleSendRequest}
          onViewProfile={(userId) => navigate(`/user-profile/${userId}`)}
          searchQuery={searchQuery}
          isSearching={Boolean(searchQuery.trim())}
          searchLoading={peopleSearchLoading}
        />
      )
    },
    {
      id: 'invitations',
      label: 'Invitations',
      icon: FaUserPlus,
      count: incomingMeta.total,
      content: (
        <>
          <RequestList
            requests={incomingRequests}
            totalCount={incomingMeta.total}
            type="incoming"
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
            onViewProfile={(userId) => navigate(`/user-profile/${userId}`)}
          />
          <PaginationControls
            currentPage={invitationsPage}
            totalPages={Math.max(incomingMeta.pages || 1, 1)}
            onPageChange={setInvitationsPage}
          />
        </>
      )
    },
    {
      id: 'sent',
      label: 'Sent',
      icon: FaClock,
      count: outgoingMeta.total,
      content: (
        <>
          <RequestList
            requests={outgoingRequests}
            totalCount={outgoingMeta.total}
            type="outgoing"
            onCancel={handleCancelRequest}
            onViewProfile={(userId) => navigate(`/user-profile/${userId}`)}
          />
          <PaginationControls
            currentPage={sentPage}
            totalPages={Math.max(outgoingMeta.pages || 1, 1)}
            onPageChange={setSentPage}
          />
        </>
      )
    }
  ];

  if (loading) {
    return (
      <NewsFeedLayout showSidebars={false}>

        {/* <NewsFeedHeader /> */}
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16730F] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading connections...</p>
          </div>
        </div>
      </NewsFeedLayout>
    );
  }

  return (
    <NewsFeedLayout showSidebars={false}>

      <div className="min-h-screen bg-[#F5F5F5]">
        {/* <NewsFeedHeader /> */}

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#1A3E32] mb-2">Connections</h1>
            <p className="text-gray-600">Manage your professional network</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative max-w-md w-full">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-2 border-[#16730F] p-3 pl-4 pr-12 rounded-2xl focus:outline-none"
                />
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#1A3E32] h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="connections-page-size" className="text-sm text-gray-600 whitespace-nowrap">
                  Page size
                </label>
                <select
                  id="connections-page-size"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#1A3E32] focus:outline-none focus:ring-2 focus:ring-[#16730F]/30"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 transition-colors ${activeTab === tab.id
                      ? 'bg-[#16730F] text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                    {tab.count > 0 && (
                      <span className={`px-2 py-1 rounded-full text-xs ${activeTab === tab.id
                        ? 'bg-white text-[#16730F]'
                        : 'bg-[#16730F] text-white'
                        }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div ref={tabContentRef} className="p-6 scroll-mt-20">
              {tabs.find(tab => tab.id === activeTab)?.content}
            </div>
          </div>
        </div>
      </div>
    </NewsFeedLayout>
  );
};



// People List Component
const PeopleList = ({ users, onSendRequest, onViewProfile, searchQuery, isSearching, searchLoading }) => {
  const usersArray = Array.isArray(users) ? users : [];
  const filteredUsers = isSearching
    ? usersArray
    : usersArray.filter(user =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (searchLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#16730F] mx-auto"></div>
        <p className="mt-4 text-gray-600">Searching...</p>
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-12">
        <FaUserFriends className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          {isSearching || usersArray.length === 0 ? 'No people found' : 'No people to connect with'}
        </h3>
        <p className="text-gray-500">
          {isSearching
            ? 'Try a different name or email'
            : usersArray.length === 0
              ? 'All users are already connected or have pending requests'
              : 'Try adjusting your search terms'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredUsers.map((user) => (
        <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-4">
            <img
              src={getAuthorProfileImageUrl(user)}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3
                className="font-semibold text-[#1A3E32] cursor-pointer hover:text-[#16730F] transition-colors"
                onClick={() => onViewProfile(user.id)}
              >
                {user.name}
              </h3>
              <p className="text-sm text-gray-600">{user.role || 'Professional'}</p>
            </div>
          </div>
          <button
            onClick={() => onSendRequest(user.id, user.name)}
            className="px-4 py-2 bg-[#16730F] text-white rounded-lg hover:bg-[#145a0c] transition-colors"
          >
            Connect
          </button>
        </div>
      ))}
    </div>
  );
};

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const buildPageItems = () => {
    const items = [];
    const add = (value) => items.push(value);

    add(1);

    const windowStart = Math.max(2, currentPage - 1);
    const windowEnd = Math.min(totalPages - 1, currentPage + 1);

    if (windowStart > 2) add('left-ellipsis');
    for (let page = windowStart; page <= windowEnd; page += 1) add(page);
    if (windowEnd < totalPages - 1) add('right-ellipsis');

    if (totalPages > 1) add(totalPages);

    return items;
  };

  const pageItems = buildPageItems();

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Previous
      </button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex items-center gap-1">
        {pageItems.map((item, index) => {
          if (typeof item !== 'number') {
            return (
              <span key={`${item}-${index}`} className="px-2 text-gray-500 select-none">
                …
              </span>
            );
          }

          const isActive = item === currentPage;
          return (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={`min-w-8 h-8 px-2 rounded-md text-sm border transition-colors ${isActive
                  ? 'bg-[#16730F] border-[#16730F] text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  );
};

export default Connections;