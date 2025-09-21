

import React from 'react';

const CandidateSearchResults = ({ onViewProfile }) => {
  const candidates = [
    {
      id: 1,
      name: "Osakwe Prisca",
      type: "Jobseeker",
      jobTitle: "Graphics Designer",
      location: "Lagos, Nigeria",
      image: "assets/images/eli.jpg",
      online: true
    },
  ];

  return (
    <div className="bg-[#1A3E32] w-full max-w-[500px] px-4 sm:px-6 md:px-10 py-4 rounded-2xl shadow-lg mx-auto">
     
      <SearchResultsHeader count={candidates.length} />
      
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            {candidates.map(candidate => (
              <React.Fragment key={`${candidate.id}-${i}`}>
                <CandidateProfile candidate={candidate} onViewProfile={onViewProfile} />
                <Divider />
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const SearchResultsHeader = ({ count }) => (
  <div className="text-center p-5">
    <p className="text-[#ffffff] text-[20px] font-semibold">Search Results</p>
    <p className="text-[#828282]">{count} Candidate{count !== 1 && "s"} found</p>
  </div>
);

const CandidateProfile = ({ candidate, onViewProfile }) => (
  <div className="flex flex-col md:flex-row justify-between gap-4 mt-6 p-2">
    <ProfileImage image={candidate.image} name={candidate.name} online={candidate.online} />
    <ProfileDetails
      name={candidate.name}
      type={candidate.type}
      jobTitle={candidate.jobTitle}
      location={candidate.location}
      onViewProfile={onViewProfile}
    />
  </div>
);

const ProfileImage = ({ image, name, online }) => (
  <div className="relative self-center md:self-start">
    <div className="rounded-full w-[100px] h-[100px] overflow-hidden">
      <img src={image} alt={`${name} profile`} className="w-full h-full object-cover" />
    </div>
    <span className={`absolute w-4 h-4 rounded-full border-2 border-white top-18 left-20 ${
      online ? 'bg-[#6B8E23]' : 'bg-[#828282]'
    }`} />
  </div>
);

const ProfileDetails = ({ name, type, jobTitle, location, onViewProfile }) => (
  <div className="ml-0 md:ml-3 flex-1 space-y-1">
    <div>
      <p className="text-[#6B8E23] text-[13px] font-medium">{name}</p>
      <p className="text-[5px] text-[#ffffff]">{type}</p>
    </div>
    <div>
      <p className="text-[#ffffff] text-[8px] font-medium">{jobTitle}</p>
      <p className="text-[#ffffff] text-[5px]">{location}</p>
    </div>
    <ProfileActions onViewProfile={onViewProfile} />
  </div>
);

const ProfileActions = ({ onViewProfile }) => (
  <div className="space-y-1 mt-1 space-x-6">
    <button
      onClick={onViewProfile}
      className="p-1 w-[100px] text-[5px] rounded-3xl bg-[#556B1F] hover:bg-[#6B8E23] text-white font-medium"
    >
      View Profile
    </button> 
    <button className="p-1 w-[100px] text-[5px] rounded-3xl border-2 border-[#6B8E23] hover:bg-[#6B8E23]/10 text-[#ffffff] font-medium">
      Invite for interview
    </button>
  </div>
);

const Divider = () => <div className="bg-[#556B1F] h-1 mt-4" />;

export default CandidateSearchResults;


































