
// import React from 'react';

// const UserProfilePanel = ({ onViewMainProfile }) => {
//   return (
//     <div className="max-w-3xl m-auto px-4 py-6 bg-[#F5F5F5] mt-3">
//       <ProfileHeader onViewMainProfile={onViewMainProfile} />
//       <ActivitiesSection />
//       <PostCard />
//     </div>
//   );
// };

// const ProfileHeader = ({ onViewMainProfile }) => {
//   return (
//     <div className="max-w-3xl mx-auto rounded-2xl p-10 bg-[#FFFFFF]">
//       <div className="p-2 m-auto flex justify-center items-center gap-8">
//         <ProfileImageSection />
//         <ProfileStatsSection onViewMainProfile={onViewMainProfile} />
//       </div>
//       <MoreOptionsButton />
//     </div>
//   );
// };

// const ProfileImageSection = () => {
//   return (
//     <div >
//       <div className="relative p-4">
//         <div className="rounded-full w-[100px] h-[100px] overflow-hidden">
//           <img
//             src="assets/images/eli.jpg"
//             alt="Osakwe Prisca profile"
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <span className="absolute w-4 h-4 bg-[#6B8E23] rounded-full border-2 border-white top-24 left-23"></span>
//       </div>
//       <div className=" ">
//         <p className="text-[#6B8E23] font-semibold text-[13px]">Graphics Designer</p>
//         <p className="text-[7px] font-semibold text-[#556B1F]">@Lagos, Nigeria</p>
//       </div>
//     </div>
//   );
// };

// const ProfileStatsSection = ({ onViewMainProfile }) => {
//   return (
//     <div className="mt-4 flex items-center justify-center gap-4">
//       <ProfileInfo onViewMainProfile={onViewMainProfile} />
//       <ConnectionInfo />
//     </div>
//   );
// };

// const ProfileInfo = ({ onViewMainProfile }) => {
//   return (
//     <div className="flex flex-col items-center ml-[-34px] p-2  mt-6 ">
//       <div className=' w-full '>
//         <p className="text-[#6B8E23] ml-1 font-semibold text-[13px]">Osakwe Prisca</p>
//         <p className="text-[6px]  ml-1 font-semibold text-[#556B1F]">Jobseeker</p>
//       </div>
//       <div className="text-start  w-full">
//         <p className="text-[#556B1F] ml-2 text-[16px] font-medium">100</p>
//         <p className="text-[#556B1F] ml-2 text-[16px] font-medium">Post</p>
//       </div>
//       <button
//         onClick={onViewMainProfile}
//         className="bg-[#556B1F] text-[8px] text-white p-1 max- w-[150px] rounded-3xl mt-1"
//       >
//         View Profile
//       </button>
//     </div>
//   );
// };

// const ConnectionInfo = () => {
//   return (
//     <div className="flex flex-col items-center p-2  mt-12">
//       <div className="text-center">
//         <p className="text-[#556B1F] text-[16px] font-medium">202</p>
//         <p className="text-[#556B1F] text-[16px] font-medium">Connections</p>
//       </div>
//       <button className="bg-[#556B1F] flex gap-2 justify-center text-[8px] items-center text-white p-1 w-[140px] rounded-3xl mt-1">
//         <img src="/assets/images/Send_Submit.svg" alt="Send icon" className="w-3 h-3" />
//         Message
//       </button>
//     </div>
//   );
// };

// const MoreOptionsButton = () => {
//   return (
//     <span className="relative left-155 bottom-24">
//       <img src="/assets/images/more.svg" alt="More options" />
//     </span>
//   );
// };

// const ActivitiesSection = () => {
//   return (
//     <>
//       <p className="text-[13px] text-[#6B8E23] font-bold mb-2">Activities</p>
//       <div className="max-w-3xl mx-auto rounded-2xl p-4 shadow-2xl">
//         <div className="flex gap-10 text-[13px]">
//           <ActivityButton text="Posts" />
//           <ActivityButton text="Photos" />
//           <ActivityButton text="Videos" />
//         </div>
//       </div>
//       <div className="max-w-3xl mx-auto my-8 border-t-1 border-[#16730F]" />
//     </>
//   );
// };

// const ActivityButton = ({ text }) => {
//   return (
//     <button className="text-[#FFFFFF] bg-[#556B1F] p-1 w-28 rounded-2xl">
//       {text}
//     </button>
//   );
// };

// const PostCard = () => {
//   return (
//     <div className="bg-white p-6 max-w-3xl mx-auto rounded-2xl space-y-6">
//       <PostHeader />
//       <PostContent />
//       <PostImage />
//       <PostActions />
//     </div>
//   );
// };

// const PostHeader = () => {
//   return (
//     <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
//       <div className="flex items-center gap-4">
//         <img
//           src="assets/images/eli.jpg"
//           alt="profile"
//           className="rounded-full w-[60px] h-[60px]"
//         />
//         <div>
//           <p className="font-semibold text-[11px] text-lg text-[#16730F]">Osakwe Prisca</p>
//           <p className="text-[#1A3E32] text-[8px] text-sm">Posted 12 minutes ago</p>
//         </div>
//       </div>
//       <img
//         src="assets/images/more.svg"
//         alt="more"
//         className="w-4 h-4 self-end sm:self-auto"
//       />
//     </div>
//   );
// };

// const PostContent = () => {
//   return (
//     <div>
//       <p className="text-black text-[10px]">
//         🚀 HIRING JUST GOT SMARTER | WELCOME TO BEJITE.COM....
//       </p>
//       <p className="text-[#16730F80] text-sm mt-1 cursor-pointer">See more</p>
//     </div>
//   );
// };

// const PostImage = () => {
//   return (
//     <div>
//       <img
//         src="assets/images/bejiteAdvert.png"
//         alt="Advert"
//         className="w-full rounded-xl"
//       />
//     </div>
//   );
// };

// const PostActions = () => {
//   return (
//     <div className="flex flex-wrap justify-between items-center gap-4">
//       <div className="flex gap-6  ">
//         <PostAction icon="assets/images/heart.svg" text="Like" />
//         <PostAction icon="assets/images/message-text.svg" text="Comment" />
//         <PostAction icon="/assets/images/frame-saved.svg" text="Saved" />
//       </div>
//       <PostAction icon="/assets/images/send.svg" text="Share" />
//     </div>
//   );
// };

// const PostAction = ({ icon, text }) => {
//   return (
//     <div className="flex flex-col items-center">
//       <img src={icon} alt={text} />
//       <p className="text-[#1A3E32] text-[10px] text-sm">{text}</p>
//     </div>
//   );
// };

// export default UserProfilePanel;






















import React from 'react';

const UserProfilePanel = ({ onViewMainProfile }) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 bg-[#F5F5F5] mt-3">
      <ProfileHeader onViewMainProfile={onViewMainProfile} />
      <ActivitiesSection />
      <PostCard />
    </div>
  );
};

const ProfileHeader = ({ onViewMainProfile }) => (
  <div className="w-full bg-white rounded-2xl p-4 sm:p-10">
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
      <ProfileImageSection />
      <ProfileStatsSection onViewMainProfile={onViewMainProfile} />
    </div>
    <div className="flex justify-end -mt-6">
      <img src="/assets/images/more.svg" alt="More options" className="w-4 h-4" />
    </div>
  </div>
);

const ProfileImageSection = () => (
  <div className="text-center">
    <div className="relative p-4">
      <div className="rounded-full w-[80px] sm:w-[100px] h-[80px] sm:h-[100px] overflow-hidden mx-auto">
        <img
          src="assets/images/eli.jpg"
          alt="Osakwe Prisca profile"
          className="w-full h-full object-cover"
        />
      </div>
      <span className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-[#6B8E23] rounded-full border-2 border-white top-[72px] sm:top-[91px] left-[75%]"></span>
    </div>
    <p className="text-[#6B8E23] font-semibold text-xs sm:text-sm">Graphics Designer</p>
    <p className="text-[6px] sm:text-[8px] font-semibold text-[#556B1F]">@Lagos, Nigeria</p>
  </div>
);

const ProfileStatsSection = ({ onViewMainProfile }) => (
  <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-6">
    <ProfileInfo onViewMainProfile={onViewMainProfile} />
    <ConnectionInfo />
  </div>
);

const ProfileInfo = ({ onViewMainProfile }) => (
  <div className="text-center">
    <p className="text-[#6B8E23] font-semibold text-sm">Osakwe Prisca</p>
    <p className="text-[6px] font-semibold text-[#556B1F]">Jobseeker</p>
    <div className="mt-2">
      <p className="text-[#556B1F] text-base font-medium">100</p>
      <p className="text-[#556B1F] text-sm font-medium">Post</p>
    </div>
    <button
      onClick={onViewMainProfile}
      className="bg-[#556B1F] text-white text-[10px] py-1 px-4 mt-2 rounded-3xl"
    >
      View Profile
    </button>
  </div>
);

const ConnectionInfo = () => (
  <div className="text-center sm:mt-9 ">
    <p className="text-[#556B1F] text-base font-medium">202</p>
    <p className="text-[#556B1F] text-sm font-medium">Connections</p>
    <button className="bg-[#556B1F] flex items-center justify-center gap-2 text-white text-[10px] py-1 px-4 mt-2 rounded-3xl w-20sm:w-36">
      <img src="/assets/images/Send_Submit.svg" alt="Send icon" className="w-3 h-3" />
      Message
    </button>
  </div>
);

const ActivitiesSection = () => (
  <>
    <p className="text-sm text-[#6B8E23] font-bold my-4">Activities</p>
    <div className="bg-white p-4 rounded-2xl shadow-md flex flex-wrap justify-center gap-4">
      <ActivityButton text="Posts" />
      <ActivityButton text="Photos" />
      <ActivityButton text="Videos" />
    </div>
    <div className="w-full my-6 border-t border-[#16730F]" />
  </>
);

const ActivityButton = ({ text }) => (
  <button className="bg-[#556B1F] text-white text-xs px-4 py-1 rounded-2xl w-24 sm:w-28">
    {text}
  </button>
);

const PostCard = () => (
  <div className="bg-white p-4 sm:p-6 rounded-2xl space-y-4">
    <PostHeader />
    <PostContent />
    <PostImage />
    <PostActions />
  </div>
);

const PostHeader = () => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div className="flex items-center gap-4">
      <img
        src="assets/images/eli.jpg"
        alt="profile"
        className="rounded-full w-12 h-12 sm:w-[60px] sm:h-[60px]"
      />
      <div>
        <p className="text-[#16730F] font-semibold text-sm">Osakwe Prisca</p>
        <p className="text-[#1A3E32] text-[10px] sm:text-xs">Posted 12 minutes ago</p>
      </div>
    </div>
    <img src="assets/images/more.svg" alt="more" className="w-4 h-4" />
  </div>
);

const PostContent = () => (
  <div>
    <p className="text-black text-sm">🚀 HIRING JUST GOT SMARTER | WELCOME TO BEJITE.COM....</p>
    <p className="text-[#16730F80] text-xs sm:text-sm mt-1 cursor-pointer">See more</p>
  </div>
);

const PostImage = () => (
  <img
    src="assets/images/bejiteAdvert.png"
    alt="Advert"
    className="w-full rounded-xl"
  />
);

const PostActions = () => (
  <div className="flex flex-wrap justify-between items-center gap-4">
    <div className="flex gap-4">
      <PostAction icon="assets/images/heart.svg" text="Like" />
      <PostAction icon="assets/images/message-text.svg" text="Comment" />
      <PostAction icon="/assets/images/frame-saved.svg" text="Saved" />
    </div>
    <PostAction icon="/assets/images/send.svg" text="Share" />
  </div>
);

const PostAction = ({ icon, text }) => (
  <div className="flex flex-col items-center text-xs text-[#1A3E32]">
    <img src={icon} alt={text} className="w-4 h-4 sm:w-5 sm:h-5" />
    <p>{text}</p>
  </div>
);

export default UserProfilePanel;
