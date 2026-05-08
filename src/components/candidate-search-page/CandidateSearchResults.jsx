import React, { useEffect, useState, useRef } from "react";
import { API_URL } from "../../config";
import { profilePhotoUrl } from "../../utils/profilePhotoUrl";
import InterviewInviteModal from "./InterviewInviteModal";
import { useNavigate } from "react-router-dom";

const CandidateSearchResults = ({ onViewProfile, searchCriteria = {} }) => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [paymentRequired, setPaymentRequired] = useState(false);

  // Refs to track and cancel duplicate requests (handles React StrictMode)
  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    // Abort any pending request from previous render
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const fetchCandidates = async () => {
      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();
      const currentRequestId = ++requestIdRef.current;

      try {
        setLoading(true);
        setError(null);
        setPaymentRequired(false);

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

        // Build the API URL with query parameters
        const url = `${API_URL}/api/cv/employee/search?${queryParams.toString()}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
          },
          credentials: "include",
          signal: abortControllerRef.current.signal
        });

        // Check if this request was aborted (stale request)
        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          // Check if this request was aborted (stale request)
          if (currentRequestId !== requestIdRef.current) {
            return;
          }
          
          console.error("API Error Response:", errorData);
          
          // Check if it's a payment required error (403)
          if (response.status === 403 && errorData.code === 'PAYMENT_REQUIRED') {
            setPaymentRequired(true);
            throw new Error(errorData.message || 'Payment required to continue using search');
          }
          
          // Read message first, then error, then fallback
          const errorMessage = errorData.message || errorData.error || 'Unknown error';
          throw new Error(`HTTP error! status: ${response.status} - ${errorMessage}`);
        }

        const data = await response.json();

        // Check if this request was aborted (stale request)
        if (currentRequestId !== requestIdRef.current) {
          return;
        }

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
            image: profilePhotoUrl(candidate.profile_photo) ?? null,
          }));

          setCandidates(formatted);
        } else {
          throw new Error("Invalid data format received from API");
        }
      } catch (error) {
        // Ignore abort errors - they're expected when cancelling stale requests
        if (error.name === 'AbortError') {
          console.log('Request aborted');
          return;
        }
        
        console.error("Error fetching candidates:", error);
        
        // Check if this request was aborted (stale request)
        if (currentRequestId !== requestIdRef.current) {
          return;
        }
        
        setError(error.message);
      } finally {
        // Check if this request is still the latest one before updating loading state
        if (currentRequestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    fetchCandidates();

    // Cleanup: abort request when component unmounts or searchCriteria changes
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchCriteria]);

  if (loading) {
    return (
      <div className="bg-[#1A3E32] w-full max-w-[500px] px-10 py-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="text-white mt-4">Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1A3E32] w-full max-w-[500px] px-10 py-8 rounded-2xl shadow-lg">
        <div className="text-center">
          {paymentRequired ? (
            <>
              <svg className="w-16 h-16 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-white text-lg font-semibold mt-4">Free Trial Used</p>
              <p className="text-white mt-2 text-sm">{error}</p>
              <button
                onClick={() => navigate('/ase/pricing')}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Upgrade Now
              </button>
            </>
          ) : (
            <>
              <p className="text-white text-lg font-semibold">Error Loading Candidates</p>
              <p className="text-white mt-2 text-sm">{error}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  const handleInviteClick = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  const handleInviteSuccess = () => {
    setInviteSuccess(true);
    setTimeout(() => setInviteSuccess(false), 3000);
  };

  return (
    <div className="bg-[#1A3E32] w-full max-w-[500px] px-10 py-4 rounded-2xl shadow-lg">
      {inviteSuccess && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-sm text-center">
          Interview invitation sent successfully!
        </div>
      )}
      <SearchResultsHeader count={candidates.length} />
      <div>
        {candidates.length > 0 ? (
          candidates.map((candidate) => (
            <React.Fragment key={candidate.id}>
              <CandidateProfile 
                candidate={candidate} 
                onViewProfile={onViewProfile}
                onInvite={handleInviteClick}
              />
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <div className="text-center p-5">
            <p className="text-white text-[20px] font-semibold">No candidates found</p>
          </div>
        )}
      </div>
      <InterviewInviteModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        candidate={selectedCandidate}
        onSuccess={handleInviteSuccess}
      />
    </div>
  );
};

const SearchResultsHeader = ({ count }) => (
  <div className="text-center p-5">
    <p className="text-white text-[20px] font-semibold">Search Results</p>
    <p className="text-white">{count} Candidates found</p>
  </div>
);

const CandidateProfile = ({ candidate, onViewProfile, onInvite }) => (
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
      onInvite={() => onInvite(candidate)}
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


const ProfileDetails = ({ name, type, jobTitle, location, skills, experienceYears, onViewProfile, onInvite }) => (
  <div className="ml-3 flex-1 space-y-1">
    <div className="ml-0.5">
      <p className="text-white text-[13px] font-medium">{name}</p>
      <p className="text-[5px] text-white">{type}</p>
    </div>
    <div className="ml-0.5">
      <p className="text-white text-[8px] font-medium">{jobTitle}</p>
      <p className="text-white text-[5px]">{location}</p>

      {experienceYears > 0 && (
        <p className="text-white text-[5px]">{experienceYears} years experience</p>
      )}

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-0.5 mt-1">
          {skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="text-[4px] bg-[#556B1F] text-white px-1 py-0.5 rounded">
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="text-[4px] text-white">+{skills.length - 3} more</span>
          )}
        </div>
      )}
    </div>
    <ProfileActions onViewProfile={onViewProfile} onInvite={onInvite} />
  </div>
);

const ProfileActions = ({ onViewProfile, onInvite }) => (
  <div className="space-y-1 mt-2">
    <button
      onClick={onViewProfile}
      className="p-1 w-[100px] text-[5px] rounded-3xl bg-[#556B1F] hover:bg-[#6B8E23] text-white font-medium transition-colors"
    >
      View Profile
    </button>
    <button 
      onClick={onInvite}
      className="p-1 w-[100px] text-[5px] rounded-3xl border-2 border-[#6B8E23] hover:bg-[#6B8E23]/10 text-[#6B8E23] font-medium transition-colors"
    >
      Invite for interview
    </button>
  </div>
);

const Divider = () => <div className="bg-[#556B1F] h-1 mt-4" />;

export default CandidateSearchResults;
