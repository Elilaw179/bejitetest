import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import DisplayNameWithBadge from '../DisplayNameWithBadge';

function ChatsRight({ selectedChat, onBack }) {
  const navigate = useNavigate();
  const otherUser = selectedChat?.other_user;
  const otherUserId =
    selectedChat?.other_user_id || otherUser?.id || null;

  const getProfileImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) {
      const baseUrl = API_URL || 'http://localhost:3001';
      return `${baseUrl}${imagePath}`;
    }
    return `${API_URL || 'http://localhost:3001'}${imagePath}`;
  };

  const getDisplayName = () => {
    if (!otherUser) return 'Select a chat';
    if (otherUser.name) return otherUser.name;
    const first = otherUser.firstName || '';
    const last = otherUser.lastName || '';
    const full = `${first} ${last}`.trim();
    return full || 'User';
  };

  const getDisplayRole = () => {
    if (!otherUser?.role) return 'User';
    return otherUser.role.charAt(0).toUpperCase() + otherUser.role.slice(1);
  };

  const getInitials = () => {
    const first = (otherUser?.firstName || '').trim().charAt(0).toUpperCase();
    const last = (otherUser?.lastName || '').trim().charAt(0).toUpperCase();
    return `${first}${last}` || 'U';
  };

  const profileImage = getProfileImageUrl(
    otherUser?.profilePictureUrl ||
      otherUser?.profile_photo ||
      otherUser?.profilePhoto
  );

  const handleViewProfile = () => {
    if (otherUserId) {
      navigate(`/user-profile/${otherUserId}`);
    }
  };

  if (!selectedChat || !otherUser) {
    return (
      <div className="bg-[#F5F5F5] h-full p-2 flex items-center justify-center">
        <p className="text-[#16730F] text-sm text-center px-4">
          Select a conversation to view profile details
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] h-full p-2">
      <aside className="bg-[#1A3E32] rounded-2xl h-full overflow-hidden">
        <div className="bg-[#16730F] rounded-t-2xl">
          <div className="p-5 lg:hidden">
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="flex items-center text-white hover:text-[#FFB547] transition"
            >
              <FaArrowLeft />
            </button>
          </div>

          <div className="flex flex-col items-center pb-6">
            <div className="relative mt-6 rounded-full border-[5px] border-[#16730F]">
              {profileImage ? (
                <img
                  className="w-20 h-20 rounded-full object-cover"
                  src={profileImage}
                  alt={getDisplayName()}
                  loading="lazy"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#556B1F] text-white font-bold text-xl flex items-center justify-center">
                  {getInitials()}
                </div>
              )}
            </div>
            <div className="text-white text-center mt-3">
              <DisplayNameWithBadge
                user={otherUser}
                fallback={getDisplayName()}
                badgeSize="sm"
                badgePlacement="below"
                className="items-center"
                nameClassName="text-lg font-semibold text-white"
              />
              <p className="text-sm opacity-80 mt-1">{getDisplayRole()}</p>
            </div>
            <div className="w-36 mx-auto mt-4">
              <button
                type="button"
                onClick={handleViewProfile}
                disabled={!otherUserId}
                className="bg-[#6B8E23] py-2 text-xs text-white w-full rounded-3xl hover:bg-[#5a7720] transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="View Profile"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#16730F] px-6 py-6 space-y-6 h-full">
          {[
            { label: 'Email', value: otherUser.email || 'Not provided' },
            { label: 'Website', value: otherUser.website || 'Not provided' },
          ].map((item) => (
            <div key={item.label}>
              <hr className="border-[#6B8E23] mb-2" />
              <p className="text-white/70 text-xs mb-1">{item.label}</p>
              <p className="text-white text-sm break-words">{item.value}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default ChatsRight;
