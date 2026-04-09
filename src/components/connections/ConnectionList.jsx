import React from 'react';
import { FaUserFriends } from 'react-icons/fa';
import ConnectionCard from './ConnectionCard';

const ConnectionList = ({ connections, onRemoveConnection, searchQuery }) => {
  // Ensure connections is an array
  const connectionsArray = Array.isArray(connections) ? connections : [];
  const filteredConnections = connectionsArray.filter(conn =>
    conn.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredConnections.length === 0) {
    return (
      <div className="text-center py-12">
        <FaUserFriends className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          {connections.length === 0 ? 'No connections yet' : 'No connections found'}
        </h3>
        <p className="text-gray-500">
          {connections.length === 0
            ? 'Start building your network by sending connection requests'
            : 'Try adjusting your search terms'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredConnections.map((connection) => (
        <ConnectionCard
          key={connection.id}
          user={connection}
          onRemove={() => onRemoveConnection(connection.id, connection.name)}
          showRemoveButton={true}
        />
      ))}
    </div>
  );
};

export default ConnectionList;