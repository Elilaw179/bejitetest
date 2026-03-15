import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";

const CandidateSearchResults = ({ onViewProfile, searchCriteria = {} }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);

        // Build query parameters from search criteria
        const queryParams = new URLSearchParams();
        
        // Use 'q' for general text search - combine job title and skills
        // This searches across multiple fields: name, title, bio, industry, etc.
        const searchTerms = [];
        if (searchCriteria.jobInput) searchTerms.push(searchCriteria.jobInput);
        // Don't add skill to q - use separate skills filter
        
        if (searchTerms.length > 0) {
          queryParams.append('q', searchTerms.join(' '));
        }
        
        // Individual filters - these work independently of 'q'
        if (searchCriteria.industryInput) queryParams.append('industry', searchCriteria.industryInput);
        if (searchCriteria.countryInput) queryParams.append('preferred_country', searchCriteria.countryInput);
        if (searchCriteria.stateInput) queryParams.append('preferred_state', searchCriteria.stateInput);
        if (searchCriteria.workTypeInput) queryParams.append('work_type', searchCriteria.workTypeInput);
        if (searchCriteria.salaryInput) queryParams.append('salary_min', searchCriteria.salaryInput);
        if (searchCriteria.currencyInput) queryParams.append('currency', searchCriteria.currencyInput);
        if (searchCriteria.remoteInput) queryParams.append('remote_preference', searchCriteria.remoteInput);
        if (searchCriteria.availabilityInput) queryParams.append('availability', searchCriteria.availabilityInput);
        if (searchCriteria.educationInput) queryParams.append('education_level', searchCriteria.educationInput);
        // Always pass skills filter separately (not as part of q)
        if (searchCriteria.skillInput) queryParams.append('skills', searchCriteria.skillInput);
        if (searchCriteria.tribeInput) queryParams.append('tribe', searchCriteria.tribeInput);
        if (searchCriteria.ageInput) queryParams.append('age', searchCriteria.ageInput);
        if (searchCriteria.genderInput) queryParams.append('gender', searchCriteria.genderInput);
        if (searchCriteria.maritalInput) queryParams.append('marital_status', searchCriteria.maritalInput);

        // Add default pagination
        queryParams.append('page', '1');
        queryParams.append('limit', '10');

        // Get auth token from localStorage (check multiple keys for compatibility)
        const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken') || localStorage.getItem('token');
        
        console.log("Token retrieval - accessToken:", !!localStorage.getItem('accessToken'));
        console.log("Token retrieval - authToken:", !!localStorage.getItem('authToken'));
        console.log("Token retrieval - token:", !!localStorage.getItem('token'));
        console.log("Final token value:", token ? token.substring(0, 20) + "..." : "NULL");
        
        // Build the API URL with query parameters
        const url = `${API_URL}/api/cv/employee/search?${queryParams.toString()}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
          },
          credentials: "include"
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("API Error Response:", errorData);
          throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || 'Unknown error'}`);
        }

        const data = await response.json();

        console.log("API Response:", data);

        // Validate & format - handle different response formats
        const candidatesData = data.data || data.candidates || [];
        if (Array.isArray(candidatesData)) {
          const formatted = candidatesData.map((candidate) => ({
            id: candidate.id,
            name: `${candidate.first_name} ${candidate.last_name}`,
            type: "Jobseeker",
            jobTitle: candidate.title || "N/A",
            location: candidate.location || candidate.preferred_country || "Unknown",
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
  }, [searchCriteria]);

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
