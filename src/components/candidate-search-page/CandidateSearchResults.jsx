import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";

const CandidateSearchResults = ({ onViewProfile }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);

        //  Correct backend route
        const url = `${API_URL}/api/candidates`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Validate & format
        if (data.success && Array.isArray(data.data)) {
          const formatted = data.data.map((candidate) => ({
            id: candidate.id,
            name: `${candidate.first_name} ${candidate.last_name}`,
            type: "Jobseeker",
            jobTitle: candidate.title || "N/A",
            location: candidate.location || "Unknown",
            skills: candidate.skills || [],
            availability: candidate.availability || "Unknown",
            experienceYears: candidate.experience_years || 0,
            initials: `${candidate.first_name?.[0] || ""}${candidate.last_name?.[0] || ""}`,
            online: candidate.availability === "Available",
          }));

          setCandidates(formatted);
        } else {
          throw new Error("Invalid data format received from API");
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#1A3E32] w-full max-w-[500px] px-10 py-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B8E23]"></div>
          <p className="text-[#6B8E23] mt-4">Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1A3E32] w-full max-w-[500px] px-10 py-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <p className="text-red-400 text-lg font-semibold">Error Loading Candidates</p>
          <p className="text-[#828282] mt-2 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A3E32] w-full max-w-[500px] px-10 py-4 rounded-2xl shadow-lg">
      <SearchResultsHeader count={candidates.length} />
      <div>
        {candidates.length > 0 ? (
          candidates.map((candidate) => (
            <React.Fragment key={candidate.id}>
              <CandidateProfile candidate={candidate} onViewProfile={onViewProfile} />
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <div className="text-center p-5">
            <p className="text-[#6B8E23] text-[20px] font-semibold">No candidates found</p>
          </div>
        )}
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
    <ProfileImage initials={candidate.initials} name={candidate.name} online={candidate.online} image={candidate.image} />
    <ProfileDetails
      name={candidate.name}
      type={candidate.type}
      jobTitle={candidate.jobTitle}
      location={candidate.location}
      skills={candidate.skills}
      experienceYears={candidate.experienceYears}
      onViewProfile={() => onViewProfile(candidate.id)}
    />
  </div>
);

const ProfileImage = ({ initials, name, online, image }) => (
  <div className="relative">
    <div className="rounded-full w-[100px] h-[100px] overflow-hidden bg-[#6B8E23] flex items-center justify-center">
      
      {image ? (
        <img src={image} alt={`${name} profile`} className="w-full h-full object-cover" />
      ) : (
        <span className="text-white text-2xl font-bold">{initials}</span>
      )}

    </div>

    <span
      className={`absolute w-4 h-4 rounded-full border-2 border-white bottom-2 right-2 ${
        online ? "bg-[#6B8E23]" : "bg-[#828282]"
      }`}
    />
  </div>
);


const ProfileDetails = ({ name, type, jobTitle, location, skills, experienceYears, onViewProfile }) => (
  <div className="ml-3 flex-1 space-y-1">
    <div className="ml-0.5">
      <p className="text-[#6B8E23] text-[13px] font-medium">{name}</p>
      <p className="text-[5px] text-[#6B8E23]">{type}</p>
    </div>
    <div className="ml-0.5">
      <p className="text-[#6B8E23] text-[8px] font-medium">{jobTitle}</p>
      <p className="text-[#6B8E23] text-[5px]">{location}</p>

      {experienceYears > 0 && (
        <p className="text-[#6B8E23] text-[5px]">{experienceYears} years experience</p>
      )}

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-0.5 mt-1">
          {skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="text-[4px] bg-[#556B1F] text-white px-1 py-0.5 rounded">
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="text-[4px] text-[#6B8E23]">+{skills.length - 3} more</span>
          )}
        </div>
      )}
    </div>
    <ProfileActions onViewProfile={onViewProfile} />
  </div>
);

const ProfileActions = ({ onViewProfile }) => (
  <div className="space-y-1 mt-2">
    <button
      onClick={onViewProfile}
      className="p-1 w-[100px] text-[5px] rounded-3xl bg-[#556B1F] hover:bg-[#6B8E23] text-white font-medium transition-colors"
    >
      View Profile
    </button>
    <button className="p-1 w-[100px] text-[5px] rounded-3xl border-2 border-[#6B8E23] hover:bg-[#6B8E23]/10 text-[#6B8E23] font-medium transition-colors">
      Invite for interview
    </button>
  </div>
);

const Divider = () => <div className="bg-[#556B1F] h-1 mt-4" />;

export default CandidateSearchResults;
