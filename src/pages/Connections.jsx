import React, { useState, useEffect } from 'react';
import NewsFeedHeader from '../components/NewsFeedHeader';
import { ConnectionList, RequestList } from '../components/connections';
import { FaUserFriends, FaUserPlus, FaClock, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import * as connectionsApi from '../services/connectionsApi';

const Connections = () => {
  const [activeTab, setActiveTab] = useState('network');
  const [connections, setConnections] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [discoverableUsers, setDiscoverableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadConnectionsData();
  }, []);

  const loadConnectionsData = async () => {
    setLoading(true);
    try {
      const [connectionsRes, incomingRes, outgoingRes, discoverRes] = await Promise.all([
        connectionsApi.getConnections(),
        connectionsApi.getIncomingRequests(),
        connectionsApi.getOutgoingRequests(),
        connectionsApi.discoverUsers()
      ]);

      // Transform connections data - handle both {connections: [...]} and direct array responses
      const connectionsArray = connectionsRes?.connections || connectionsRes || [];
      const transformedConnections = Array.isArray(connectionsArray) ? connectionsArray.map(conn => ({
        id: conn.user?.id,
        name: `${conn.user?.firstName || ''} ${conn.user?.lastName || ''}`.trim() || 'Unknown User',
        firstName: conn.user?.firstName,
        lastName: conn.user?.lastName,
        email: conn.user?.email,
        connectedAt: conn.connectedAt,
        image: null, // Backend doesn't provide image in connections
        role: 'Professional' // Default role
      })) : [];

      // Transform incoming requests data - handle both {requests: [...]} and direct array responses
      const incomingArray = incomingRes?.requests || incomingRes || [];
      const transformedIncoming = Array.isArray(incomingArray) ? incomingArray.map(req => ({
        id: req.id,
        requester: {
          id: req.fromUser?.id,
          name: `${req.fromUser?.firstName || ''} ${req.fromUser?.lastName || ''}`.trim() || 'Unknown User',
          firstName: req.fromUser?.firstName,
          lastName: req.fromUser?.lastName,
          email: req.fromUser?.email,
          image: null,
          role: 'Professional'
        },
        createdAt: req.createdAt
      })) : [];

      // Transform outgoing requests data - handle both {requests: [...]} and direct array responses
      const outgoingArray = outgoingRes?.requests || outgoingRes || [];
      const transformedOutgoing = Array.isArray(outgoingArray) ? outgoingArray.map(req => ({
        id: req.id,
        recipient: {
          id: req.toUser?.id,
          name: `${req.toUser?.firstName || ''} ${req.toUser?.lastName || ''}`.trim() || 'Unknown User',
          firstName: req.toUser?.firstName,
          lastName: req.toUser?.lastName,
          email: req.toUser?.email,
          image: null,
          role: 'Professional'
        },
        createdAt: req.createdAt
      })) : [];

      // Transform discoverable users data
      const usersArray = discoverRes?.users || discoverRes || [];
      const transformedUsers = Array.isArray(usersArray) ? usersArray.map(user => ({
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.profilePhoto,
        role: 'Professional'
      })) : [];

      setConnections(transformedConnections);
      setIncomingRequests(transformedIncoming);
      setOutgoingRequests(transformedOutgoing);
      setDiscoverableUsers(transformedUsers);
    } catch (error) {
      console.error('Error loading connections data:', error);
      toast.error('Failed to load connections data');
    } finally {
      setLoading(false);
    }
  };

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

      // Update local state - remove from discoverable users
      setDiscoverableUsers(prev => prev.filter(user => user.id !== userId));
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

  const tabs = [
    {
      id: 'network',
      label: 'My Network',
      icon: FaUserFriends,
      count: connections.length,
      content: (
        <ConnectionList
          connections={connections}
          onRemoveConnection={handleRemoveConnection}
          searchQuery={searchQuery}
        />
      )
    },
    {
      id: 'people',
      label: 'People',
      icon: FaUserPlus,
      count: discoverableUsers.length,
      content: (
        <PeopleList
          users={discoverableUsers}
          onSendRequest={handleSendRequest}
          searchQuery={searchQuery}
        />
      )
    },
    {
      id: 'invitations',
      label: 'Invitations',
      icon: FaUserPlus,
      count: incomingRequests.length,
      content: (
        <RequestList
          requests={incomingRequests}
          type="incoming"
          onAccept={handleAcceptRequest}
          onReject={handleRejectRequest}
        />
      )
    },
    {
      id: 'sent',
      label: 'Sent',
      icon: FaClock,
      count: outgoingRequests.length,
      content: (
        <RequestList
          requests={outgoingRequests}
          type="outgoing"
          onCancel={handleCancelRequest}
        />
      )
    }
  ];

  if (loading) {
    return (
      <div>
        <NewsFeedHeader />
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16730F] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading connections...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <NewsFeedHeader />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1A3E32] mb-2">Connections</h1>
          <p className="text-gray-600">Manage your professional network</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 border-[#16730F] p-3 pl-4 pr-12 rounded-2xl focus:outline-none"
            />
            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#1A3E32] h-5 w-5" />
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
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#16730F] text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activeTab === tab.id
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
          <div className="p-6">
            {tabs.find(tab => tab.id === activeTab)?.content}
          </div>
        </div>
      </div>
    </div>
  );
};



// People List Component
const PeopleList = ({ users, onSendRequest, searchQuery }) => {
  const usersArray = Array.isArray(users) ? users : [];
  const filteredUsers = usersArray.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-12">
        <FaUserFriends className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          {usersArray.length === 0 ? 'No people to connect with' : 'No people found'}
        </h3>
        <p className="text-gray-500">
          {usersArray.length === 0
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
              src={user.image || '/assets/images/eli.jpg'}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-[#1A3E32]">{user.name}</h3>
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

export default Connections;