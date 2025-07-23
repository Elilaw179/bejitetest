// PeopleConnect.jsx
import React from "react";
import { FaSearch } from "react-icons/fa";

const PeopleConnect = () => {
  // Sample user data - could be fetched from an API in a real app
  const users = Array(8).fill({
    name: "John Samuel",
    role: "Jobseeker",
    connections: "34",
    image: "assets/images/eli.jpg"
  });

  return (
    <div className="max-w-3xl m-auto px-6 py-6 bg-[#F5F5F5] mt-2">
      {/* Search Section */}
      <div className="max-w-3xl mx-auto rounded-2xl p-4 sm:p-6 bg-white shadow-sm">
        <SearchBar />
      </div>
      
      <Divider />

      {/* Connections Section */}
      <div className="max-w-3xl mx-auto rounded-2xl p-4 sm:p-6 bg-white shadow-sm space-y-4">
        <ConnectionHeader />
        <Divider small />
        
        {/* User List */}
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

// Reusable Components
const SearchBar = () => (
  <div className="relative w-full sm:w-[300px] md:w-[400px] m-auto">
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
    <p className="text-[#1A3E32] font-semibold">Connect with people</p>
    <div className="flex space-x-3">
      <Button variant="suggestions">Suggestions</Button>
      <Button variant="connect">Connect</Button>
    </div>
  </>
);

const UserCard = ({ name, role, connections, image }) => (
  <div className="flex gap-3">
    <img className="w-20 h-20 rounded-full" src={image} alt={name} />
    <div className="">
      <p className="text-[14px] font-semibold">{name}</p>
      <div className="flex space-x-2">
        <p>{role}</p>
        <p className="text-[#FFB547]">.{connections}</p>
        <p className="text-[#FFB547]">connections</p>
      </div>
      <Button variant="connectUser">
        <img src="/assets/images/repeate-one.svg" alt="Connect icon" />
        <span>Connect</span>
      </Button>
    </div>
  </div>
);

const Button = ({ variant, children }) => {
  const baseClasses = "rounded-2xl p-2 text-[13px] flex items-center justify-center space-x-1";
  
  const variants = {
    suggestions: "bg-[#1A3E32] text-[#FFB547] w-36",
    connect: "bg-[#1A3E32] text-[#FFB547] w-36",
    connectUser: "bg-[#16730F] text-[#FFFFFF] w-40 p-2 rounded-3xl"
  };

  return (
    <button className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </button>
  );
};

const Divider = ({ small = false }) => (
  <div className={`max-w-3xl mx-auto my-4 border-t-2 ${small ? "border-[#E0E0E0]" : "border-[#16730F]"}`} />
);

export default PeopleConnect;