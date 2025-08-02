

import React from "react";
import { FaSearch } from "react-icons/fa";

const PeopleConnect = () => {
  const users = Array(8).fill({
    name: "John Samuel",
    role: "Jobseeker",
    connections: "34",
    image: "assets/images/eli.jpg"
  });

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
              name={user.name}
              role={user.role}
              connections={user.connections}
              image={user.image}
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

const UserCard = ({ name, role, connections, image }) => (
  <div className="flex flex-wrap sm:flex-nowrap gap-4 items-start">
    <img className="w-20 h-20 rounded-full" src={image} alt={name} />
    <div className="flex flex-col flex-1">
      <p className="text-[14px] font-semibold">{name}</p>
      <div className="flex flex-wrap items-center gap-x-2 text-sm text-gray-700">
        <p>{role}</p>
        <p className="text-[#FFB547]">• {connections} connections</p>
      </div>
      <div className="mt-2">
        <Button variant="connectUser">
          <img src="/assets/images/repeate-one.svg" alt="Connect icon" className="w-4 h-4" />
          <span>Connect</span>
        </Button>
      </div>
    </div>
  </div>
);

const Button = ({ variant, children }) => {
  const baseClasses = "rounded-2xl px-4 py-2 text-[13px] flex items-center gap-2";
  const variants = {
    suggestions: "bg-[#1A3E32] text-[#FFB547]",
    connect: "bg-[#1A3E32] text-[#FFB547]",
    connectUser: "bg-[#16730F] text-white rounded-3xl"
  };

  return (
    <button className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </button>
  );
};

const Divider = ({ small = false }) => (
  <div className={`w-full my-4 border-t-2 ${small ? "border-[#E0E0E0]" : "border-[#16730F]"}`} />
);

export default PeopleConnect;
