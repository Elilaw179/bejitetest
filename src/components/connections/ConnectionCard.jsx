import React from 'react';
import { getAuthorProfileImageUrl } from '../../utils/profileImageUtils';

const ConnectionCard = ({ user, onRemove, onViewProfile, showRemoveButton = false }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
    <button
      type="button"
      onClick={() => onViewProfile?.(user?.id)}
      className="flex items-center gap-4 text-left hover:opacity-90"
    >
      <img
        src={getAuthorProfileImageUrl(user)}
        alt={user.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <h3 className="font-semibold text-[#1A3E32] hover:text-[#16730F]">{user.name}</h3>
        <p className="text-sm text-gray-600">{user.jobTitle || user.role || 'Professional'}</p>
      </div>
    </button>
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