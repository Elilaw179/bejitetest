import React from 'react';
import { getAuthorProfileImageUrl } from '../../utils/profileImageUtils';

const ConnectionCard = ({ user, onRemove, showRemoveButton = false }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
    <div className="flex items-center gap-4">
      <img
        src={getAuthorProfileImageUrl(user)}
        alt={user.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <h3 className="font-semibold text-[#1A3E32]">{user.name}</h3>
        <p className="text-sm text-gray-600">{user.jobTitle || user.role || 'Professional'}</p>
      </div>
    </div>
    {showRemoveButton && (
      <button
        onClick={onRemove}
        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        Remove
      </button>
    )}
  </div>
);

export default ConnectionCard;