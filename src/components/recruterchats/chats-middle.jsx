import React, { useState } from 'react';
import image from '../../assets/Ellipse.png'; 
import check from '../../assets/Group.png';
import { FaArrowLeft, FaPhone, FaVideo, FaBars } from 'react-icons/fa';

function ChatsMiddle({ selectedChat, onShowChatList, onShowChatInfo }) {
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState('');

  const handleAccept = () => {
    setAgreed(true);
  };


  return (
<main className="w-full h-full flex flex-col bg-gray-100">
  {/* Header */}
  <div className="bg-gray-200 flex items-center justify-between px-4 py-7 ">
    <div className="flex items-center gap-3">
      <button
        onClick={onShowChatList}
        className="lg:hidden text-gray-600 hover:text-gray-800 transition-colors"
      >
        <FaArrowLeft />
      </button>
      <img
        src={image}
        alt="Profile"
        className="w-10 h-10 rounded-full object-cover lg:hidden"
      />
      <div>
         <h1 className="text-2xl font-semibold text-[#16730F]">Okpata favour</h1>
         <p className="text-sm text-[#16730F]">Online</p>
      </div>
    </div>

    <div className='flex items-center gap-2'>
      <button className="bg-[#16730F] text-white p-2 rounded-full hover:bg-[#1a5c13] transition">
        <FaPhone className="text-sm" />
      </button>
      <button className="bg-[#16730F] text-white p-2 rounded-full hover:bg-[#1a5c13] transition">
        <FaVideo className="text-sm" />
      </button>
      <button 
        onClick={onShowChatInfo}
        className="lg:hidden text-gray-600 hover:text-gray-800 transition-colors ml-2"
      >
        <FaBars />
      </button>
    </div>
  </div>

  {/* Messages Area */}
  <div className="flex-1 overflow-y-auto p-4">
    {/* Interview Status */}
    <div className="text-center mt-10 mb-10">
      {!agreed ? (
        <>
          <p className="text-3xl font-semibold text-center text-[#16730F] mb-2">You've been invited for an interview!</p>
          <p className="text-sm text-center text-[#16730F] px-4">Okpata favour has invited you for an interview as a Graphics Designer on July 20th, 9:00am. Please respond within 72 hours. If no response, this invite will be automatically declined.</p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <img src={check} alt="Checkmark" className="w-10 h-10" />
          </div>
          <p className="text-xl font-semibold text-center text-[#16730F] mb-2">You have accepted the interview invite.</p>
          <p className="text-sm text-center text-[#16730F]">You can now start a conversation with Okpata Favour.</p>
        </>
      )}
    </div>

    <div className="flex justify-center mb-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-start"> 
          {/* Profile + Name */}
          <div className="flex items-center gap-3">
            <img
              src={image}
              alt="profile"
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <h1 className="text-gray-500 font-medium">Okpata Favour</h1>
          </div>

          {/* Message Bubble */}
          <div className="bg-gray-200 p-6 mt-3 rounded-2xl rounded-tl-none text-sm">
            <p className="text-[#1A3E32] font-medium">
              Hi Prisca Osakwe,<br />
              Great news! You've been shortlisted for the Graphics Designer position.
              We’d love to meet you during an interview on July 20th, 9:00am via{" "}
              https://meet.google.com/yqt-vbte-amu. Kindly confirm your availability.
              We're excited to learn more about you!
            </p>
          </div>
        </div>
        <p className='text-center text-[#556B1F] text-sm mt-2 font-medium'>SAT AT 11:06 AM</p>

        {!agreed && (
          <div className="flex gap-3  mt-4 justify-center">
            <button
              onClick={handleAccept}
              className="bg-[#16730F] text-[#FFB547] w-2xl px-8 py-2 rounded-md hover:bg-[#1a5c13] transition"
            >
              Accept
            </button>
            <button className="bg-[#EB5757] text-white w-2xl px-8 py-2 rounded-md hover:bg-[#d63a3a] transition">
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  </div>

  {/* Message Input */}
  <div className="p-4 bg-gray-100 ">
    <div className="flex flex-col gap-2 border border-gray-300 rounded-2xl px-4 py-3 bg-gray-100 shadow-sm">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className="flex-1 outline-none text-sm bg-transparent placeholder-gray-400"
      />
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="text-gray-500 hover:text-green-600 text-lg"
            aria-label="Add emoji"
          >
            😊
          </button>
          <button
            type="button"
            className="text-gray-500 hover:text-green-600 text-lg"
            aria-label="Attach file"
          >
            ＋
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="text-gray-500 hover:text-green-600 text-lg"
            aria-label="Record voice"
          >
            🎤
          </button>
          <button
            type="button"
            className="bg-gray-700 hover:bg-green-600 text-white rounded-full p-2 transition"
            aria-label="Send message"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  </div>
</main>
  );
}

export default ChatsMiddle;