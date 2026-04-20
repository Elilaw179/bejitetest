import React from 'react';
import { getProfileImageUrl } from '../../utils/profileImageUtils';

const RequestCard = ({ request, type, onAccept, onReject, onCancel }) => {
  const user = type === 'incoming' ? request.requester : request.recipient;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-4">
        <img
          src={getProfileImageUrl(user?.image)}
          alt={user?.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-[#1A3E32]">{user?.name}</h3>
          <p className="text-sm text-gray-600">{user?.role || 'Professional'}</p>
          <p className="text-xs text-gray-500">
            {type === 'incoming' ? 'Wants to connect' : 'Request sent'}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        {type === 'incoming' ? (
          <>
            <button
              onClick={() => onAccept(request.id, user?.name)}
              className="px-4 py-2 bg-[#16730F] text-white rounded-lg hover:bg-[#145a0c] transition-colors"
            >
              Accept
            </button>
            <button
              onClick={() => onReject(request.id, user?.name)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Decline
            </button>
          </>
        ) : (
          <button
            onClick={() => onCancel(request.id, user?.name)}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default RequestCard;