import React from 'react';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import image1 from '../../assets/Ellipse 32 (3).png';
import image2 from '../../assets/Ellipse 32 (1).png';
import image3 from '../../assets/Ellipse 32 (2).png';
import image4 from '../../assets/Ellipse 32.png';


function ChatsLeft({ onSelectChat, onBack, selectedChat }) {
  
    const conversations = [
      { 
        id: 1, 
        name: "Osakwe Prisca", 
        secondname: "Ellen",
        image: image1, 
        lastMessage: "typing", 
       
      },
      {
        id: 2,
        name: "Efe Elisha",
        secondname: "Steve",
        image: image2,
        lastMessage: "typing", 
     
      },
      {
        id: 3,
        name: "Salik Raymond",
        secondname: "Micheal",
        image: image3,
        lastMessage: "you. Send your cv",
        
      },
      {
        id: 4,
        name: "Jaden ellen",
        secondname: "Favour",
        image: image4,
        lastMessage: "typing",
      
      }
    ];
    return (
      <div className="bg-[#1A3E32] h-full  p-1 flex flex-col">
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
          <h2 className="text-[20px] text-[#556B1F]">Invites</h2>
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
  
      <div className="flex gap-4 items-center">
  {
    conversations.map((chat) => (
      <div key={chat.id} className="flex flex-col items-center">
        <div className="relative">
          <img
            src={chat.image}
            className="w-12 h-12 rounded-full object-cover"
            alt="Employer profile"
          />
          {/* Online status indicator */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#556B1F] border-2 border-white rounded-full"></div>
        </div>
        <span className="text-[#aa6907] text-sm text-center">
          {chat.secondname}
        </span>
      </div>
    ))
  }
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
                    src={chat.image}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                
                  
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white text-sm font-medium truncate">{chat.name}</h3>
                    <span className="text-[#556B1F] text-xs flex-shrink-0">{chat.time}</span>
                  </div>
                  <p className="text-[#556B1F] text-xs  truncate">{chat.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
  
         
        </div>
      </div>
    );
}

export default ChatsLeft;