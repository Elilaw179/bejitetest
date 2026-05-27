
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import * as connectionsApi from "../../services/connectionsApi";
import { getAuthorProfileImageUrl } from "../../utils/profileImageUtils";

const formatUserName = (user) => {
  if (!user) return 'Unknown User';
  const first = user.firstName ?? user.first_name ?? '';
  const last = user.lastName ?? user.last_name ?? '';
  const full = `${first} ${last}`.trim();
  return full || user.email || 'Unknown User';
};

const PeopleConnect = () => {
  const [users, setUsers] = useState(() => 
    Array(8).fill({
      id: null,
      name: "John Samuel",
      role: "Jobseeker",
      connections: "34",
      image: "/assets/images/photo_placeholder.png",
      connectionStatus: "none" // none, pending, connected
    })
  );

  const handleSendRequest = async (userId, userName) => {
    try {
      await connectionsApi.sendConnectionRequest(userId);
      toast.success(`Connection request sent to ${userName}!`);
      
      // Update local state - mark as pending
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, connectionStatus: "pending" } : user
      ));
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast.error('Failed to send connection request');
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 py-6 bg-[#F5F5F5] mt-2">
      {/* Search Section */}
      <div className="w-full max-w-4xl mx-auto rounded-2xl p-4 sm:p-6 bg-white shadow-sm">
        <SearchBar />
      </div>

      <Divider />

      {/* Connections Section */}
      <div className="w-full max-w-4xl mx-auto rounded-2xl p-4 sm:p-6 bg-white shadow-sm space-y-4">
        <ConnectionHeader />
        <Divider small />

        {users.map((user, index) => (
          <React.Fragment key={index}>
            <UserCard
              user={user}
              onConnect={() => handleSendRequest(user.id || index, user.name)}
            />
            <Divider small />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const SearchBar = () => (
  <div className="relative w-full max-w-md mx-auto">
    <input
      type="text"
      placeholder="Search"
      className="w-full border-2 border-[#16730F] p-2 pl-4 rounded-2xl focus:outline-none"
    />
    <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
      <FaSearch className="text-[#1A3E32] h-5 w-5" />
    </span>
  </div>
);

const ConnectionHeader = () => (
  <>
    <p className="text-[#1A3E32] font-semibold text-[16px]">Connect with people</p>
    <div className="flex flex-wrap gap-3 mt-2">
      <Button variant="suggestions">Suggestions</Button>
      <Button variant="connect">Connect</Button>
    </div>
  </>
);

const UserCard = ({ user, onConnect }) => {
  const { name, role, connections, image, connectionStatus } = user;
  const isPending = connectionStatus === "pending";
  const isConnected = connectionStatus === "connected";

  return (
    <div className="flex flex-wrap sm:flex-nowrap gap-4 items-start">
      <img className="w-20 h-20 rounded-full" src={image} alt={name} />
      <div className="flex flex-col flex-1">
        <p className="text-[14px] font-semibold">{name}</p>
        <div className="flex flex-wrap items-center gap-x-2 text-sm text-gray-700">
          <p>{role}</p>
          <p className="text-[#FFB547]">• {connections} connections</p>
        </div>
        <div className="mt-2">
          <Button 
            variant="connectUser" 
            onClick={onConnect}
            disabled={isPending || isConnected}
          >
            <img src="/assets/images/repeate-one.svg" alt="Connect icon" className="w-4 h-4" />
            <span>{isPending ? "Pending" : isConnected ? "Connected" : "Connect"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

const Button = ({ variant, children, onClick, disabled }) => {
  const baseClasses = "rounded-2xl px-4 py-2 text-[13px] flex items-center gap-2";
  const variants = {
    suggestions: "bg-[#1A3E32] text-[#FFB547]",
    connect: "bg-[#1A3E32] text-[#FFB547]",
    connectUser: "bg-[#16730F] text-white rounded-3xl"
  };

  const disabledClasses = "opacity-50 cursor-not-allowed";

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${disabled ? disabledClasses : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Divider = ({ small = false }) => (
  <div className={`w-full my-4 border-t-2 ${small ? "border-[#E0E0E0]" : "border-[#16730F]"}`} />
);

export default PeopleConnect;
