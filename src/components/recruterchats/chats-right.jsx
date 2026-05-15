import React, { useMemo } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { getUser } from '../../utils/tokenManager';
import { API_URL } from '../../config'; 


function ChatsRight({ onBack }) {
  // Get user from Redux store first (most up-to-date after login), fallback to localStorage
  const reduxUser = useSelector((state) => state.auth?.user);

  // Compute user - similar to NewsFeedHeader
  const user = useMemo(() => {
    // First priority: Redux store
    if (reduxUser) {
      return {
        name: reduxUser.name || reduxUser.firstName || reduxUser.lastName ? `${reduxUser.firstName || ''} ${reduxUser.lastName || ''}`.trim() : "Guest",
        image: reduxUser.image || reduxUser.profilePhoto || reduxUser.profile_photo || "",
        role: reduxUser.role || "user",
        email: reduxUser.email || "Not provided",
        phone: reduxUser.phone || "Not provided",
        website: reduxUser.website || "Not provided",
        ...reduxUser
      };
    }

    // Second priority: localStorage
    const localUser = getUser();
    return localUser || {
      name: "Guest",
      image: "",
      role: "user",
      email: "Not provided",
      phone: "Not provided",
      website: "Not provided",
    };
  }, [reduxUser]);

  // Get display name
  const getDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.firstName || user?.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return "Guest";
  };

  // Get display role (capitalize first letter)
  const getDisplayRole = () => {
    if (!user?.role) return "User";
    return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  };

  // Function to get full URL for profile photo
  const getProfileImageUrl = (imagePath) => {
    if (!imagePath) return imagePath;
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    // For local paths like /uploads/filename.jpg, use the config API_URL
    if (imagePath.startsWith('/uploads')) {
      const baseUrl = API_URL || 'http://localhost:3001';
      return `${baseUrl}${imagePath}`;
    }
    // Otherwise, prepend the API URL
    return `${API_URL || 'http://localhost:3001'}${imagePath}`;
  };

  const getInitials = () => {
    const first = (user?.firstName || '').trim().charAt(0).toUpperCase();
    const last = (user?.lastName || '').trim().charAt(0).toUpperCase();
    if (first || last) return `${first}${last}`;
    const fromName = (user?.name || '').trim().split(/\s+/).filter(Boolean);
    const firstFromName = (fromName[0] || '').charAt(0).toUpperCase();
    const lastFromName = (fromName[1] || '').charAt(0).toUpperCase();
    return `${firstFromName}${lastFromName}` || 'U';
  };

  return (
    <div className="bg-[#F5F5F5] h-full p-2">
      <aside className="bg-[#1A3E32] rounded-2xl h-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#16730F] rounded-t-2xl">
          <div className="p-5">
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="flex items-center text-white hover:text-[#FFB547] transition lg:hidden"
            >
              <FaArrowLeft />
            </button>
          </div>

          {/* Profile Section */}
          <div className="flex flex-col items-center pb-6">
            <div className="relative -mt-10 rounded-full border-[5px] border-[#16730F]">
              {getProfileImageUrl(user.image) ? (
                <img
                  className="w-20 h-20 rounded-full object-cover"
                  src={getProfileImageUrl(user.image)}
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
              <h1 className="text-lg font-semibold">{getDisplayName()}</h1>
              <p className="text-sm opacity-80">{getDisplayRole()}</p>
            </div>
            <div className="w-36 mx-auto mt-4">
              <button
                type="button"
                className="bg-[#6B8E23] py-2 text-xs text-white w-full rounded-3xl hover:bg-[#5a7720] transition"
                aria-label="View Profile"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* Contact + Links */}
        <div className="bg-[#16730F] px-6 py-6 space-y-6 h-full">
          {[
            { label: "Email", value: user.email },
            { label: "Phone", value: user.phone },
            { label: "Website", value: user.website },
          ].map((item, idx) => (
            <div key={idx}>
              <hr className="border-[#6B8E23] mb-2" />
              <p className="text-white text-sm break-words">{item.value}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default ChatsRight;