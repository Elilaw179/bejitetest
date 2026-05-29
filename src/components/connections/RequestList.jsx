import React from 'react';
import { FaUserPlus } from 'react-icons/fa';
import RequestCard from './RequestCard';

const RequestList = ({ requests, type, onAccept, onReject, onCancel, onViewProfile, totalCount }) => {
  const requestsArray = Array.isArray(requests) ? requests : [];

  if ((totalCount ?? requestsArray.length) === 0) {
    return (
      <div className="text-center py-12">
        <FaUserPlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          {type === 'incoming' ? 'No pending invitations' : 'No sent requests'}
        </h3>
        <p className="text-gray-500">
          {type === 'incoming'
            ? 'Invitations from others will appear here'
            : 'Your sent connection requests will appear here'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requestsArray.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          type={type}
          onAccept={onAccept}
          onReject={onReject}
          onCancel={onCancel}
          onViewProfile={onViewProfile}
        />
      ))}
    </div>
  );
};

export default RequestList;