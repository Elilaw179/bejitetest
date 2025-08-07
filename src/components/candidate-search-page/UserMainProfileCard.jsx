

import React from 'react';

const UserMainProfileCard = ({ onConnect }) => {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6 bg-[#F5F5F5] mt-1">
      <div className="max-w-4xl mx-auto">
        <ProfileHeader />
        <ProfileStats onConnect={onConnect} />
        <Divider />
        <ProfileSection title="Education">
          <EducationItem />
        </ProfileSection>
        <ProfileSection title="Skills">
          <SkillsList />
        </ProfileSection>
        <ProfileSection title="Work History">
          <WorkHistoryItem />
          <WorkHistoryItem />
        </ProfileSection>
        <ProfileSection title="Certifications">
          <CertificationItem />
        </ProfileSection>
        <ProfileSection title="Contact Info">
          <ContactInfoList />
        </ProfileSection>
        <ProfileSection title="Suggested Connections ">
          {[...Array(6)].map((_, i) => (
            <RecommendedProfile key={i} onConnect={onConnect} />
          ))}
        </ProfileSection>
      </div>
    </div>
  );
};

const ProfileHeader = () => (
  <div>
    <div className="p-4 sm:p-8">
      <img className="w-full h-full m-auto" src="/assets/images/post-ads.png" alt="profile banner" />
    </div>
    <div className="relative left-8 sm:left-20 bottom-20 sm:bottom-24">
      <div className="rounded-full w-[80px] sm:w-[80px] h-[80px] sm:h-[80px] overflow-hidden">
        <img
          src="assets/images/eli.jpg"
          alt="Osakwe Prisca profile"
          className="w-full h-full object-cover"
        />
      </div>
      <span className="absolute w-4 h-4 bg-[#6B8E23] rounded-full border-2 border-white  top-[70%] sm:left-[10%]  "></span>
    </div>
  </div>
);

const ProfileStats = ({ onConnect }) => (
  <div className="px-4 sm:px-8 mt-[-60px] sm:mt-[-80px]">
    <div className="flex gap-2">
      <p className="text-[#6B8E23] font-semibold text-[13px]">Osakwe Prisca</p>
      <p className="text-[#E09A36] font-semibold text-[10px]">. Jobseeker</p>
    </div>
    <div className='text-[10px]'>
      <p className="text-[#6B8E23] font-semibold">Visual Strategist🎨💻</p>
      <p className="text-[#6B8E23] font-semibold">
        ▶ Helping Brands Bring Their Visions to Life Through Design.✨
      </p>
    </div>
    <div className="mt-4">
      <p className="text-[#E09A36] text-[8px]">Graphics Designer</p>
      <p className="text-[#6B8E23] text-[5px]"> @Lagos, Nigeria</p>
    </div>
    <StatsGrid />
    <ActionButtons onConnect={onConnect} />
  </div>
);

const StatsGrid = () => (
  <div className="flex flex-wrap gap-4 mt-3">
    <StatItem value="100" label="Post" />
    <StatItem value="5400" label="Followers" />
    <StatItem value="10" label="Following" />
    <StatItem value="2000" label="Connections" />
  </div>
);

const StatItem = ({ value, label }) => (
  <div className="flex gap-2">
    <p className="text-[#E09A36] font-semibold text-[12px]">{value}</p>
    <p className="text-[#556B1F] font-semibold text-[12px]">.{label}</p>
  </div>
);

const ActionButtons = ({ onConnect }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-4 gap-4 w-full">
    <Button icon="/assets/images/repeate-one.svg" text="Connect" onClick={onConnect} />
    <Button icon="/assets/images/Send_Submit.svg" text="Message" />
    <img src="assets/images/more.svg" alt="more options" className="w-4 h-4" />
  </div>
);

const Button = ({ icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="bg-[#556B1F] w-full sm:w-[200px] text-center text-[8px] text-[#FFFFFF] flex p-1.5 rounded-3xl gap-2 justify-center items-center"
  >
    <img className="w-5" src={icon} alt={text} />
    {text}
  </button>
);

const Divider = () => (
  <div className="w-full mx-auto my-6 border-t-2 border-[#16730F]"></div>
);

const ProfileSection = ({ title, children }) => (
  <div className="bg-[#556B1F] rounded-2xl mt-2">
    <div className="pt-8 px-4 sm:px-8">
      <p className="text-[#E09A36] text-[20px] mb-1">{title}</p>
    </div>
    <div className="w-full border-t-2 border-[#E0E0E0] mb-4"></div>
    {children}
  </div>
);

const EducationItem = () => (
  <div className="px-4 sm:px-8 pb-8 text-[#F5F5F5] flex flex-col sm:flex-row justify-between gap-3 items-start">
    <div className="bg-[#D9D9D9] w-full sm:w-30 h-18"></div>
    <div className="mt-3">
      <p className='text-[13px]'>
        Chukwuemeka Odumegwu Ojukwu University Bachelor's degree,
        Computer and Information Science and Technology
      </p>
      <span className="text-[#FFB54780] text-[13px]">Sep 2022 - Jul 2027</span>
    </div>
  </div>
);

const SkillsList = () => {
  const skills = [
    { name: "Figma", experience: "4yrs experience" },
    { name: "Photoshop", experience: "2yrs experience" },
    { name: "Aftereffect", experience: "2yrs experience" },
    { name: "Content Creation", experience: "2yrs experience" },
  ];

  return (
    <div className="px-4 sm:px-8 pb-8 text-[#FFFFFF] space-y-4">
      {skills.map((skill, index) => (
        <div key={index}>
          <p className="text-[13px] font-semibold">{skill.name}</p>
          <p className="text-[8px] font-medium">{skill.experience}</p>
        </div>
      ))}
    </div>
  );
};

const WorkHistoryItem = () => (
  <>
    <div className="px-4 sm:px-8 pb-8 text-[#F5F5F5] flex flex-col sm:flex-row gap-5 items-start">
      <div className="bg-[#D9D9D9] w-18 h-18"></div>
      <div className="mt-3 text-[13px]">
        <p>Bejite ICT company limited</p>
        <p>@Lagos, Nigeria</p>
        <p>Senior Graphics Designer</p>
        <span className="text-[#FFB54780]">Sep 2022 - Jul 2027</span>
      </div>
    </div>
    <div className="w-full border-t-2 border-[#E0E0E0] mb-4"></div>
  </>
);

const CertificationItem = () => (
  <div className="px-4 sm:px-8 pb-8 text-[#F5F5F5] flex flex-col sm:flex-row gap-5 items-start">
    <div className="bg-[#D9D9D9] w-18 h-18"></div>
    <div className="mt-3 text-[13px]">
      <p>Graphics Design</p>
      <p>Issued By Bejite ICT Tech</p>
      <span className="text-[#FFB54780]">Date: 4th March</span>
    </div>
  </div>
);

const ContactInfoList = () => {
  const contacts = [
    { type: "Mobile", value: "0706 141 0614" },
    { type: "LinkedIn", value: "Osakwe Prisca" },
    { type: "X", value: "nd_creations" },
    { type: "Email", value: "0nd.creationss1@gmail.com" },
    { type: "Website", value: "https://linktr.ee/Nglinks" },
  ];

  return (
    <div className="px-4 sm:px-8 pb-8 text-[#FFFFFF] space-y-4">
      {contacts.map((contact, index) => (
        <div key={index} className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-[#D9D9D9]"></div>
          <div>
            <p className="text-[15px] font-semibold">{contact.value}</p>
            <p className="text-[13px] font-medium">{contact.type}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const RecommendedProfile = ({ onConnect }) => (
  <div>
    <div className="px-4 sm:px-8 pb-8 text-[#FFFFFF]">
      <div className="flex flex-col sm:flex-row gap-3">
        <img className="w-20 h-20 rounded-full" src="assets/images/eli.jpg" alt="Recommended profile" />
        <div>
          <p className="text-[10px] font-semibold">John Samuel</p>
          <div className="flex space-x-2 text-[5px]">
            <p>Jobseeker</p>
            <p className="text-[#E09A36]">.34</p>
            <p className="text-[#E09A36]">connections</p>
          </div>
          <button
            onClick={onConnect}
            className="bg-[#1A3E32] w-40 flex items-center justify-center mt-2 space-x-1 p-1 rounded-3xl text-[10px]">
            <img className='w-3 h-3' src="/assets/images/repeate-one.svg" alt="Connect" />
            <span>Connect</span>
          </button>
        </div>
      </div>
    </div>
    <div className="w-full border-t-2 border-[#E0E0E0] mb-4"></div>
  </div>
);

export default UserMainProfileCard;
