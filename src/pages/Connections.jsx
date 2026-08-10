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
import DisplayNameWithBadge from '../components/DisplayNameWithBadge';
import { filterAdminUsersFromSearch } from '../utils/filterAdminUsers';

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
  role: user.jobTitle || 'Professional',
  hasVerifiedBadge: Boolean(user?.hasVerifiedBadge),
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
  hasVerifiedBadge: Boolean(user?.hasVerifiedBadge),
});

const Connections = () => {
  useSyncProfilePhoto();
  const navigate = useNavigate();
  const DEFAULT_PAGE_SIZE = 20;
  const [activeTab, setActiveTab] = useState('network');
  const [connections, setConnections] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [discoverableUsers, setDiscoverableUsers] = useState([]);
  const [peopleSearchResults, setPeopleSearchResults] = useState(null);
  const [peopleSearchLoading, setPeopleSearchLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [networkLoading, setNetworkLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [networkPage, setNetworkPage] = useState(1);
  const [invitationsPage, setInvitationsPage] = useState(1);
  const [sentPage, setSentPage] = useState(1);
  const [networkMeta, setNetworkMeta] = useState({ total: 0, pages: 1, page: 1, limit: DEFAULT_PAGE_SIZE });
  const [incomingMeta, setIncomingMeta] = useState({ total: 0, pages: 1, page: 1, limit: DEFAULT_PAGE_SIZE });
  const [outgoingMeta, setOutgoingMeta] = useState({ total: 0, pages: 1, page: 1, limit: DEFAULT_PAGE_SIZE });
  const [debouncedNetworkSearch, setDebouncedNetworkSearch] = useState('');
  const tabContentRef = useRef(null);
  const [networkReady, setNetworkReady] = useState(false);
  const networkRequestIdRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNetworkSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const applyNetworkResponse = useCallback((connectionsRes, page, limit) => {
    const connectionsArray = connectionsRes?.connections || connectionsRes || [];
    const transformedConnections = Array.isArray(connectionsArray)
      ? connectionsArray.map((conn) => transformConnectionUser(conn.user, conn.connectedAt))
      : [];

    setConnections(transformedConnections);
    setNetworkMeta(
      connectionsRes?.pagination || {
        total: transformedConnections.length,
        pages: 1,
        page,
        limit,
      },
    );
  }, []);

  const transformIncoming = useCallback((incomingRes, page = invitationsPage) => {
    const incomingArray = incomingRes?.requests || incomingRes || [];
    const transformedIncoming = Array.isArray(incomingArray)
      ? incomingArray.map((req) => ({
          id: req.id,
          requester: {
            id: req.fromUser?.id,
            name: formatUserName(req.fromUser),
            firstName: req.fromUser?.firstName ?? req.fromUser?.first_name,
            lastName: req.fromUser?.lastName ?? req.fromUser?.last_name,
            email: req.fromUser?.email,
            image: req.fromUser?.profilePhoto ?? req.fromUser?.profile_photo ?? null,
            role: req.fromUser?.jobTitle || 'Professional',
            hasVerifiedBadge: Boolean(req.fromUser?.hasVerifiedBadge),
          },
          createdAt: req.createdAt,
        }))
      : [];

    setIncomingRequests(transformedIncoming);
    setIncomingMeta(
      incomingRes?.pagination || {
        total: transformedIncoming.length,
        pages: 1,
        page,
        limit: pageSize,
      },
    );
    return transformedIncoming;
  }, [invitationsPage, pageSize]);

  const transformOutgoing = useCallback((outgoingRes, page = sentPage) => {
    const outgoingArray = outgoingRes?.requests || outgoingRes || [];
    const transformedOutgoing = Array.isArray(outgoingArray)
      ? outgoingArray.map((req) => ({
          id: req.id,
          recipient: {
            id: req.toUser?.id,
            name: formatUserName(req.toUser),
            firstName: req.toUser?.firstName ?? req.toUser?.first_name,
            lastName: req.toUser?.lastName ?? req.toUser?.last_name,
            email: req.toUser?.email,
            image: req.toUser?.profilePhoto ?? req.toUser?.profile_photo ?? null,
            role: req.toUser?.jobTitle || 'Professional',
            hasVerifiedBadge: Boolean(req.toUser?.hasVerifiedBadge),
          },
          createdAt: req.createdAt,
        }))
      : [];

    setOutgoingRequests(transformedOutgoing);
    setOutgoingMeta(
      outgoingRes?.pagination || {
        total: transformedOutgoing.length,
        pages: 1,
        page,
        limit: pageSize,
      },
    );
    return transformedOutgoing;
  }, [sentPage, pageSize]);

  const applySecondaryResponses = useCallback((incomingRes, outgoingRes, discoverRes) => {
    transformIncoming(incomingRes);
    transformOutgoing(outgoingRes);

    const usersArray = discoverRes?.users || discoverRes || [];
    const transformedUsers = Array.isArray(usersArray)
      ? usersArray.map(transformDiscoverableUser)
      : [];

    setDiscoverableUsers(shuffleArray(transformedUsers));
  }, [transformIncoming, transformOutgoing]);

  /**
   * After accept/decline/cancel, reload the current page.
   * If that page is now empty (but earlier pages still have items), step back.
   */
  const refreshIncomingPage = useCallback(async (preferredPage = invitationsPage) => {
    let page = Math.max(1, preferredPage);
    let incomingRes = await connectionsApi.getIncomingRequests(page, pageSize);
    let rows = transformIncoming(incomingRes, page);
    const pages = Math.max(1, incomingRes?.pagination?.pages || 1);

    if (rows.length === 0 && page > 1) {
      page = Math.min(page - 1, pages);
      page = Math.max(1, page);
      incomingRes = await connectionsApi.getIncomingRequests(page, pageSize);
      rows = transformIncoming(incomingRes, page);
    }

    if (page !== invitationsPage) {
      setInvitationsPage(page);
    }
    return rows;
  }, [invitationsPage, pageSize, transformIncoming]);

  const refreshOutgoingPage = useCallback(async (preferredPage = sentPage) => {
    let page = Math.max(1, preferredPage);
    let outgoingRes = await connectionsApi.getOutgoingRequests(page, pageSize);
    let rows = transformOutgoing(outgoingRes, page);
    const pages = Math.max(1, outgoingRes?.pagination?.pages || 1);

    if (rows.length === 0 && page > 1) {
      page = Math.min(page - 1, pages);
      page = Math.max(1, page);
      outgoingRes = await connectionsApi.getOutgoingRequests(page, pageSize);
      rows = transformOutgoing(outgoingRes, page);
    }

    if (page !== sentPage) {
      setSentPage(page);
    }
    return rows;
  }, [sentPage, pageSize, transformOutgoing]);

  const refreshNetworkFirstPage = useCallback(async () => {
    try {
      const connectionsRes = await connectionsApi.getConnections(
        networkPage,
        pageSize,
        debouncedNetworkSearch,
      );
      applyNetworkResponse(connectionsRes, networkPage, pageSize);
    } catch (error) {
      console.error('Error refreshing network after accept:', error);
    }
  }, [networkPage, pageSize, debouncedNetworkSearch, applyNetworkResponse]);

  // First visit only — full page spinner
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const [connectionsRes, incomingRes, outgoingRes, discoverRes] = await Promise.all([
          connectionsApi.getConnections(1, pageSize, ''),
          connectionsApi.getIncomingRequests(1, pageSize),
          connectionsApi.getOutgoingRequests(1, pageSize),
          connectionsApi.discoverUsers(),
        ]);
        if (cancelled) return;
        applyNetworkResponse(connectionsRes, 1, pageSize);
        applySecondaryResponses(incomingRes, outgoingRes, discoverRes);
        setNetworkReady(true);
      } catch (error) {
        if (cancelled) return;
        console.error('Error loading connections data:', error);
        toast.error('Failed to load connections data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only bootstrap
  }, []);

  // My Network search + pagination: update list only (no full-page reload)
  useEffect(() => {
    if (!networkReady) return undefined;

    let cancelled = false;
    const requestId = ++networkRequestIdRef.current;

    (async () => {
      setNetworkLoading(true);
      try {
        const connectionsRes = await connectionsApi.getConnections(
          networkPage,
          pageSize,
          debouncedNetworkSearch,
        );
        if (cancelled || requestId !== networkRequestIdRef.current) return;
        applyNetworkResponse(connectionsRes, networkPage, pageSize);
      } catch (error) {
        if (cancelled || requestId !== networkRequestIdRef.current) return;
        console.error('Error loading network connections:', error);
        toast.error('Failed to load connections');
      } finally {
        if (!cancelled && requestId === networkRequestIdRef.current) {
          setNetworkLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [networkReady, networkPage, pageSize, debouncedNetworkSearch, applyNetworkResponse]);

  // Invitations / Sent / People page changes
  useEffect(() => {
    if (!networkReady) return undefined;

    let cancelled = false;

    (async () => {
      try {
        const [incomingRes, outgoingRes, discoverRes] = await Promise.all([
          connectionsApi.getIncomingRequests(invitationsPage, pageSize),
          connectionsApi.getOutgoingRequests(sentPage, pageSize),
          connectionsApi.discoverUsers(),
        ]);
        if (cancelled) return;
        applySecondaryResponses(incomingRes, outgoingRes, discoverRes);
      } catch (error) {
        if (cancelled) return;
        console.error('Error loading connections data:', error);
        toast.error('Failed to load connections data');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [networkReady, invitationsPage, sentPage, pageSize, applySecondaryResponses]);

  // Pagination controls sit below the list; without this, the scroll container stays at the bottom.
  useEffect(() => {
    if (loading || networkLoading) return;
    tabContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [networkPage, invitationsPage, sentPage, loading, networkLoading]);

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
          ? filterAdminUsersFromSearch(usersArray).map(transformDiscoverableUser)
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
    setNetworkPage((prev) => (prev === 1 ? prev : 1));
  }, [debouncedNetworkSearch]);

  useEffect(() => {
    setNetworkPage(1);
    setInvitationsPage(1);
    setSentPage(1);
  }, [pageSize]);

  const handleAcceptRequest = async (requestId, requesterName) => {
    try {
      await connectionsApi.acceptConnectionRequest(requestId);
      toast.success(`Connected with ${requesterName}!`);
      await refreshIncomingPage(invitationsPage);
      await refreshNetworkFirstPage();
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept connection request');
    }
  };

  const handleRejectRequest = async (requestId, requesterName) => {
    try {
      await connectionsApi.rejectConnectionRequest(requestId);
      toast.success(`Declined request from ${requesterName}`);
      await refreshIncomingPage(invitationsPage);
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject connection request');
    }
  };

  const handleCancelRequest = async (requestId, recipientName) => {
    try {
      await connectionsApi.cancelConnectionRequest(requestId);
      toast.success(`Canceled request to ${recipientName}`);
      await refreshOutgoingPage(sentPage);
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

  const filteredConnections = connections;

  const connectionSearchBar = (
    <div className="mb-4 sm:mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-md min-w-0">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border-2 border-[#16730F] p-3 pl-4 pr-12 rounded-2xl focus:outline-none text-sm sm:text-base"
        />
        <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1A3E32] h-5 w-5 pointer-events-none" />
      </div>

    </div>
  );

  const tabs = [
    {
      id: 'network',
      label: 'My Network',
      icon: FaUserFriends,
      count: networkMeta.total,
      content: (
        <>
          {connectionSearchBar}
          {networkLoading ? (
            <div className="py-10 flex flex-col items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#16730F]" />
              <p className="text-sm text-gray-500">Updating network...</p>
            </div>
          ) : (
            <ConnectionList
              connections={filteredConnections}
              totalCount={networkMeta.total}
              onRemoveConnection={handleRemoveConnection}
              searchQuery=""
              onViewProfile={(userId) => navigate(`/user-profile/${userId}`)}
            />
          )}
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
        <>
          {connectionSearchBar}
          <PeopleList
            users={peopleSearchResults ?? discoverableUsers}
            onSendRequest={handleSendRequest}
            onViewProfile={(userId) => navigate(`/user-profile/${userId}`)}
            searchQuery={searchQuery}
            isSearching={Boolean(searchQuery.trim())}
            searchLoading={peopleSearchLoading}
          />
        </>
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
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16730F] mx-auto"></div>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading connections...</p>
          </div>
        </div>
      </NewsFeedLayout>
    );
  }

  return (
    <NewsFeedLayout showSidebars={false}>

      <div className="min-h-screen bg-[#F5F5F5] w-full min-w-0">
        <div className="w-full min-w-0 max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1A3E32] mb-1 sm:mb-2">Connections</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your professional network</p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden min-w-0">
            <div className="flex w-full border-b border-gray-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-1 min-w-0 flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 py-3 px-1 sm:py-4 sm:px-4 md:px-5 transition-colors ${
                      isActive
                        ? 'bg-[#16730F] text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                    <span className="font-medium text-[10px] sm:text-sm leading-tight text-center w-full min-w-0 truncate px-0.5">
                      {tab.label}
                    </span>
                    {tab.count > 0 && (
                      <span
                        className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs leading-none ${
                          isActive
                            ? 'bg-white text-[#16730F]'
                            : 'bg-[#16730F] text-white'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div ref={tabContentRef} className="p-3 sm:p-4 md:p-6 scroll-mt-20 min-w-0">
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
      <div className="text-center py-8 sm:py-12 px-2">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#16730F] mx-auto"></div>
        <p className="mt-4 text-gray-600 text-sm sm:text-base">Searching...</p>
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-2">
        <FaUserFriends className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-base sm:text-lg font-medium text-gray-600 mb-2">
          {isSearching || usersArray.length === 0 ? 'No people found' : 'No people to connect with'}
        </h3>
        <p className="text-gray-500 text-sm sm:text-base px-2">
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
    <div className="space-y-3 sm:space-y-4">
      {filteredUsers.map((user) => (
        <div
          key={user.id}
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-xl min-w-0"
        >
          <button
            type="button"
            onClick={() => onViewProfile(user.id)}
            className="flex items-center gap-3 sm:gap-4 min-w-0 text-left hover:opacity-90 w-full sm:w-auto"
          >
            <img
              src={getAuthorProfileImageUrl(user)}
              alt={user.name}
              className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-[#1A3E32] text-sm sm:text-base truncate hover:text-[#16730F] transition-colors">
                <DisplayNameWithBadge user={user} fallback={user.name} badgeSize="xs" />
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{user.role || 'Professional'}</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onSendRequest(user.id, user.name)}
            className="w-full sm:w-auto shrink-0 px-4 py-2.5 min-h-[44px] bg-[#16730F] text-white rounded-lg hover:bg-[#145a0c] transition-colors text-sm font-medium"
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
    <div className="flex flex-col items-stretch sm:items-center gap-3 mt-4 sm:mt-6 min-w-0">
      <span className="text-xs sm:text-sm text-gray-600 text-center order-first sm:order-none">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2 w-full">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="flex-1 sm:flex-none min-h-[44px] px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        <div className="hidden sm:flex items-center gap-1 flex-wrap justify-center">
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
                className={`min-w-8 h-8 px-2 rounded-md text-sm border transition-colors ${
                  isActive
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
          className="flex-1 sm:flex-none min-h-[44px] px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Connections;