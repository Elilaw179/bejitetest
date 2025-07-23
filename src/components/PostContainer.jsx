// PostContainer.jsx
import React from 'react';

const PostContainer = () => {
  return (
    <div className="max-w-3xl m-auto px-4 py-6 bg-[#F5F5F5] mt-3">
      <CreatePostSection />
      <Divider />
      <PostCard />
    </div>
  );
};

const CreatePostSection = () => {
  return (
    <div className="max-w-3xl mx-auto rounded-2xl p-6 bg-[#ffffff]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <ProfileImage />
        <PostInput />
      </div>
      <PostOptions />
    </div>
  );
};

const ProfileImage = () => {
  return (
    <img
      src="assets/images/eli.jpg"
      alt="profile"
      className="rounded-full w-[60px] h-[60px]"
    />
  );
};

const PostInput = () => {
  return (
    <div className="relative flex-1 w-full">
      <input
        name="post"
        id="post-input"
        placeholder="Share something"
        className="w-full p-3 pl-4 pr-20 text-sm border-2 border-[#16730F] focus:outline-none rounded-2xl"
      />
      <div className="absolute top-3 right-4 flex items-center space-x-1">
        <img src="assets/images/box-2.svg" alt="drafts icon" className="w-3 h-3" />
        <p className="text-[10px]">Drafts</p>
      </div>
    </div>
  );
};

const PostOptions = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-5 gap-4 px-2">
      <MediaOptions />
      <VisibilityOption />
    </div>
  );
};

const MediaOptions = () => {
  const options = [
    { icon: "assets/images/gallery.svg", label: "Image" },
    { icon: "assets/images/video-square.png", label: "Video" },
    { icon: "/assets/images/Amount_Icon_UIA.svg", label: "Poll" }
  ];

  return (
    <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
      {options.map((option, index) => (
        <div key={index} className="flex items-center gap-1">
          <img src={option.icon} alt={option.label} />
          <p className="text-[#1A3E32] text-sm">{option.label}</p>
        </div>
      ))}
    </div>
  );
};

const VisibilityOption = () => {
  return (
    <div className="flex items-center gap-2">
      <img src="/assets/images/public-icon.svg" alt="Public" />
      <select className="text-sm rounded-md border border-gray-300 px-2 py-1 text-[#1A3E32]">
        <option value="public">Public</option>
      </select>
    </div>
  );
};

const Divider = () => {
  return <div className="max-w-3xl mx-auto my-8 border-t-2 border-[#16730F]" />;
};

const PostCard = () => {
  return (
    <div className="bg-white p-6 max-w-3xl mx-auto rounded-2xl space-y-6">
      <PostHeader />
      <PostContent />
      <PostImage />
      <PostActions />
    </div>
  );
};

const PostHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
      <div className="flex items-center gap-4">
        <ProfileImage />
        <div>
          <p className="font-semibold text-lg text-[#16730F]">Osakwe Prisca</p>
          <p className="text-[#1A3E32] text-sm">Posted 12 minutes ago</p>
        </div>
      </div>
      <img
        src="assets/images/more.svg"
        alt="more options"
        className="w-4 h-4 self-end sm:self-auto"
      />
    </div>
  );
};

const PostContent = () => {
  return (
    <div>
      <p className="text-black">
        🚀 HIRING JUST GOT SMARTER | WELCOME TO BEJITE.COM....
      </p>
      <p className="text-[#16730F80] text-sm mt-1 cursor-pointer">See more</p>
    </div>
  );
};

const PostImage = () => {
  return (
    <div>
      <img
        src="assets/images/bejiteAdvert.png"
        alt="Advert"
        className="w-full rounded-xl"
      />
    </div>
  );
};

const PostActions = () => {
  const actions = [
    { icon: "assets/images/gallery.svg", label: "Like" },
    { icon: "assets/images/video-square.png", label: "Comment" },
    { icon: "/assets/images/Amount_Icon_UIA.svg", label: "Saved" }
  ];

  return (
    <div className="flex flex-wrap justify-between items-center gap-4">
      <div className="flex gap-6">
        {actions.map((action, index) => (
          <PostAction key={index} icon={action.icon} label={action.label} />
        ))}
      </div>
      <PostAction icon="/assets/images/public-icon.svg" label="Share" />
    </div>
  );
};

const PostAction = ({ icon, label }) => {
  return (
    <div className="flex flex-col items-center">
      <img src={icon} alt={label} />
      <p className="text-[#1A3E32] text-sm">{label}</p>
    </div>
  );
};

export default PostContainer;