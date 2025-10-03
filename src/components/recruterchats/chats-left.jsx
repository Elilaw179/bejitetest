import React from 'react';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import image from '../../assets/Ellipse.png';


function ChatsLeft({ onSelectChat, onBack }) {

  const conversations = [
    { 
      id: 1, 
      name: "Okpata Favour", 
      image: "https://via.placeholder.com/50", 
      lastMessage: "Hi precika osak", 
      time: "09:45 AM", 
      unread: 1,
      online: true
    }
   
  ];

  return (
    <div className="bg-[#1A3E32] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 ">
        <button
          type="button"
          aria-label="Go back"
          onClick={onBack}
          className="flex items-center text-[#556B1F] hover:text-white transition "
        >
          <FaArrowLeft className='text-[#556B1F]'  />
        </button>
        <h2 className="text-[20px] text-[#556B1F]">Invitations</h2>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="flex items-center bg-white rounded-full px-3 py-2">
          <input
            className="w-full outline-none bg-transparent text-sm placeholder-gray-500"
            placeholder="Search"
          />
          <FaSearch className="text-gray-500 ml-2" />
        </div>
      </div>

    
   <div className="flex items-center justify-center gap-4">

     <div className="flex flex-col items-center">
  <img
    src={image}
    className="w-12 h-12 rounded-full object-cover"
    alt="Employer profile"
  />
  <span className="text-[#556B1F] text-sm text-center">
     Okpata
    </span>
    </div>

  {/* Icon + Text */}
  <div className="flex flex-col items-center">
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black text-white">
      <FaSearch />
    </div>
    <span className="text-[#556B1F] text-sm text-center">
      See More <br /> Employer
    </span>
  </div>


</div>


      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto border-t border-[#556B1F]">
        <div className="px-2 mt-4">
          {conversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`flex items-center gap-3 p-3 mx-2 rounded-lg hover:bg-[#556B1F]/20 cursor-pointer transition-colors `}
            >
              <div className="relative">
                <img
                  src={image}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              
                
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white text-sm font-medium truncate">{chat.name}</h3>
                  <span className="text-[#556B1F] text-xs flex-shrink-0">{chat.time}</span>
                </div>
                <p className="text-[#556B1F] text-xs truncate">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>

       
      </div>
    </div>
  );
}

export default ChatsLeft;