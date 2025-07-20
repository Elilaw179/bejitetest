


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
    
      <div className="bg-[#1A3E32] w-full max-w-[400px] p-5 rounded-2xl shadow-lg">
         <SearchResultsHeader count={candidates.length} />
     <div>
       <Divider />
      {candidates.map(candidate => (
        <React.Fragment key={candidate.id}>
          <CandidateProfile candidate={candidate} onViewProfile={onViewProfile} />
          <Divider />
        </React.Fragment>
      ))}
     </div>
     <div>
      {candidates.map(candidate => (
        <React.Fragment key={candidate.id}>
          <CandidateProfile candidate={candidate} onViewProfile={onViewProfile} />
          <Divider />
        </React.Fragment>
      ))}
     </div>
     <div>
      {candidates.map(candidate => (
        <React.Fragment key={candidate.id}>
          <CandidateProfile candidate={candidate} onViewProfile={onViewProfile} />
          <Divider />
        </React.Fragment>
      ))}
     </div>
     <div>
      {candidates.map(candidate => (
        <React.Fragment key={candidate.id}>
          <CandidateProfile candidate={candidate} onViewProfile={onViewProfile} />
          <Divider />
        </React.Fragment>
      ))}
     </div>
      </div>
     
   
  );
};

const SearchResultsHeader = ({ count }) => (
  <div className="text-center p-5">
    <p className="text-[#6B8E23] text-[20px] font-semibold">Search Results</p>
    <p className="text-[#828282]">{count} Candidates found</p>
  </div>
);

const CandidateProfile = ({ candidate, onViewProfile }) => (
  <div className="flex justify-between mt-6 p-2">
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
  <div className="relative">
    <div className="rounded-full w-[100px] h-[100px] overflow-hidden">
      <img src={image} alt={`${name} profile`} className="w-full h-full object-cover" />
    </div>
    <span className={`absolute w-4 h-4 rounded-full border-2 border-white top-20 left-20 ${
      online ? 'bg-[#6B8E23]' : 'bg-[#828282]'
    }`} />
  </div>
);

const ProfileDetails = ({ name, type, jobTitle, location, onViewProfile }) => (
  <div className="ml-4 flex-1 space-y-2">
    <div>
      <p className="text-[#6B8E23] text-2xl font-medium">{name}</p>
      <p className="text-[#6B8E23] text-sm">{type}</p>
    </div>
    <div>
      <p className="text-[#6B8E23] text-xl font-medium">{jobTitle}</p>
      <p className="text-[#6B8E23] text-sm">{location}</p>
    </div>
    <ProfileActions onViewProfile={onViewProfile} />
  </div>
);

const ProfileActions = ({ onViewProfile }) => (
  <div className="space-y-2 mt-3">
    <button
      onClick={onViewProfile}
      className="p-2 w-full rounded-3xl bg-[#556B1F] hover:bg-[#6B8E23] text-white font-medium"
    >
      View Profile
    </button>
    <button className="p-2 w-full rounded-3xl border-2 border-[#6B8E23] hover:bg-[#6B8E23]/10 text-[#6B8E23] font-medium">
      Invite for interview
    </button>
  </div>
);

const Divider = () => <div className="bg-[#556B1F] h-1 mt-4" />;

export default CandidateSearchResults;
