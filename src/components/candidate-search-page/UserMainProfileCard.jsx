

import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import { getProfileImageUrl } from "../../utils/profileImageUtils";

const UserMainProfileCard = ({ candidateId, onConnect }) => {
  const [candidate, setCandidate] = useState(null);
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFullProfile = async () => {
      if (!candidateId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get candidate basic info
        const candidateRes = await fetch(`${API_URL}/api/candidates/${candidateId}`);
        const candidateData = await candidateRes.json();
        
        if (candidateData.success && candidateData.data) {
          setCandidate(candidateData.data);
          
          // Get user ID to fetch CV data
          const userId = candidateData.data.user_id;
          
          if (userId) {
            // Fetch full CV builder data
            const cvRes = await fetch(`${API_URL}/api/cv-builder/complete/${userId}`);
            const cvResult = await cvRes.json();
            
            if (cvResult.success) {
              setCvData(cvResult.data);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFullProfile();
  }, [candidateId]);

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-8 py-6 bg-[#F5F5F5] mt-1">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8E23]"></div>
          <p className="text-[#6B8E23] mt-4">Loading full profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-8 py-6 bg-[#F5F5F5] mt-1">
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  const initials = candidate?.first_name && candidate?.last_name 
    ? `${candidate.first_name[0]}${candidate.last_name[0]}` 
    : "?";
  
  const profileImage = candidate?.profile_photo 
    ? getProfileImageUrl(candidate.profile_photo) 
    : null;

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6 bg-[#F5F5F5] mt-1">
      <div className="max-w-4xl mx-auto">
        <ProfileHeader candidate={candidate} profileImage={profileImage} initials={initials} />
        <ProfileStats candidate={candidate} onConnect={onConnect} />
        <Divider />

        {/* Bio Section */}
        {cvData?.bio && (
          <ProfileSection title="About">
            <div className="px-4 sm:px-8 pb-6 text-[#F5F5F5]">
              <p className="text-sm">{cvData.bio.bio || "No bio available"}</p>
              {cvData.bio.nickname && (
                <p className="text-[12px] mt-2">Nickname: {cvData.bio.nickname}</p>
              )}
              {cvData.bio.phone && (
                <p className="text-[12px]">Phone: {cvData.bio.phone}</p>
              )}
              {cvData.bio.country && (
                <p className="text-[12px]">Location: {cvData.bio.country}, {cvData.bio.city}</p>
              )}
            </div>
          </ProfileSection>
        )}

        {/* Education Section */}
        {cvData?.education && cvData.education.length > 0 && (
          <ProfileSection title="Education">
            {cvData.education.map((edu, index) => (
              <EducationItem key={index} education={edu} />
            ))}
          </ProfileSection>
        )}

        {/* Skills Section */}
        {cvData?.skills && cvData.skills.length > 0 && (
          <ProfileSection title="Skills">
            <SkillsList skills={cvData.skills.map(s => s.skill_name || s.skill)} />
          </ProfileSection>
        )}

        {/* Work History Section */}
        {cvData?.workHistory && cvData.workHistory.length > 0 && (
          <ProfileSection title="Work History">
            {cvData.workHistory.map((work, index) => (
              <WorkHistoryItem key={index} work={work} />
            ))}
          </ProfileSection>
        )}

        {/* Certificates Section */}
        {cvData?.certificates && cvData.certificates.length > 0 && (
          <ProfileSection title="Certifications">
            {cvData.certificates.map((cert, index) => (
              <CertificationItem key={index} certification={cert} />
            ))}
          </ProfileSection>
        )}

        {/* Links Section */}
        {cvData?.links && (
          <ProfileSection title="Links">
            <div className="px-4 sm:px-8 pb-6 text-[#F5F5F5]">
              {cvData.links.linkedin && (
                <p className="text-[12px]">LinkedIn: {cvData.links.linkedin}</p>
              )}
              {cvData.links.twitter && (
                <p className="text-[12px]">Twitter: {cvData.links.twitter}</p>
              )}
              {cvData.links.instagram && (
                <p className="text-[12px]">Instagram: {cvData.links.instagram}</p>
              )}
              {cvData.links.portfolio && (
                <p className="text-[12px]">Portfolio: {cvData.links.portfolio}</p>
              )}
            </div>
          </ProfileSection>
        )}

        {/* Job Preferences Section */}
        {candidate && (
          <ProfileSection title="Job Preferences">
            <div className="px-4 sm:px-8 pb-6 text-[#F5F5F5]">
              {candidate.title && <p className="text-[12px]">Job Title: {candidate.title}</p>}
              {candidate.industry && <p className="text-[12px]">Industry: {candidate.industry}</p>}
              {candidate.preferred_country && <p className="text-[12px]">Preferred Country: {candidate.preferred_country}</p>}
              {candidate.work_type && <p className="text-[12px]">Work Type: {candidate.work_type}</p>}
              {candidate.remote_preference && <p className="text-[12px]">Remote Preference: {candidate.remote_preference}</p>}
              {candidate.availability && <p className="text-[12px]">Availability: {candidate.availability}</p>}
              {candidate.salary_expectation && <p className="text-[12px]">Salary Expectation: ₦{candidate.salary_expectation.toLocaleString()}</p>}
            </div>
          </ProfileSection>
        )}

        {/* Contact Info Section */}
        <ProfileSection title="Contact Info">
          <ContactInfoList candidate={candidate} />
        </ProfileSection>
      </div>
    </div>
  );
};

const ProfileHeader = ({ profileImage, initials }) => (
  <div>
    <div className="w-full h-32 bg-gradient-to-r from-[#1A3E32] to-[#6B8E23]"></div>
    <div className="relative left-8 sm:left-20 bottom-20 sm:bottom-24">
      <div className="rounded-full w-[80px] sm:w-[80px] h-[80px] sm:h-[80px] overflow-hidden bg-[#6B8E23] flex items-center justify-center">
        {profileImage ? (
          <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
        ) : (
          <span className="text-white text-2xl font-bold">{initials}</span>
        )}
      </div>
      <span className="absolute w-4 h-4 bg-[#6B8E23] rounded-full border-2 border-white top-[70%] sm:left-[10%]"></span>
    </div>
  </div>
);

const ProfileStats = ({ candidate, onConnect }) => (
  <div className="px-4 sm:px-8 mt-[-60px] sm:mt-[-80px]">
    <div className="flex gap-2">
      <p className="text-[#6B8E23] font-semibold text-[13px]">
        {candidate?.first_name} {candidate?.last_name}
      </p>
      <p className="text-[#E09A36] font-semibold text-[10px]">. Jobseeker</p>
    </div>
    <div className='text-[10px]'>
      <p className="text-[#6B8E23] font-semibold">{candidate?.title || "No title"}</p>
    </div>
    <div className="mt-4">
      <p className="text-[#E09A36] text-[14px] font-semibold">{candidate?.title || "Jobseeker"}</p>
      <p className="text-[#6B8E23] text-[5px]">
        📍 {candidate?.location || candidate?.preferred_country || "Location not set"}
      </p>
      {candidate?.experience_years > 0 && (
        <p className="text-[#6B8E23] text-[5px]">💼 {candidate.experience_years} years experience</p>
      )}
    </div>
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

const EducationItem = ({ education }) => (
  <div className="px-4 sm:px-8 pb-8 text-[#F5F5F5] flex flex-col sm:flex-row justify-between gap-3 items-start">
    <div className="bg-[#D9D9D9] w-full sm:w-30 h-18 flex items-center justify-center">
      <span className="text-2xl">🎓</span>
    </div>
    <div className="mt-3">
      <p className='text-[13px] font-semibold'>
        {education.degree || "Degree"}
        {education.field ? `, ${education.field}` : ""}
      </p>
      <p className="text-[11px]">{education.institution || "Institution"}</p>
      <span className="text-[#FFB54780] text-[13px]">
        {education.start_date ? new Date(education.start_date).getFullYear() : ""} - 
        {education.end_date ? new Date(education.end_date).getFullYear() : "Present"}
      </span>
    </div>
  </div>
);

const SkillsList = ({ skills = [] }) => {
  if (skills.length === 0) {
    return (
      <div className="px-4 sm:px-8 pb-8 text-[#F5F5F5]">
        <p className="text-sm">No skills listed</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 pb-8 text-[#FFFFFF] space-y-4">
      {skills.map((skill, index) => (
        <div key={index}>
          <p className="text-[13px] font-semibold">{skill}</p>
        </div>
      ))}
    </div>
  );
};

const WorkHistoryItem = ({ work }) => (
  <>
    <div className="px-4 sm:px-8 pb-8 text-[#F5F5F5] flex flex-col sm:flex-row gap-5 items-start">
      <div className="bg-[#D9D9D9] w-18 h-18 flex items-center justify-center flex-shrink-0">
        <span className="text-2xl">💼</span>
      </div>
      <div className="mt-3 text-[13px]">
        <p className="font-semibold">{work.company || "Company"}</p>
        <p>{work.title || "Position"}</p>
        <p className="text-[11px]">{work.location || ""}</p>
        <span className="text-[#FFB54780]">
          {work.start_date ? new Date(work.start_date).getFullYear() : ""} - 
          {work.end_date ? new Date(work.end_date).getFullYear() : "Present"}
        </span>
      </div>
    </div>
    <div className="w-full border-t-2 border-[#E0E0E0] mb-4"></div>
  </>
);

const CertificationItem = ({ certification }) => (
  <div className="px-4 sm:px-8 pb-8 text-[#F5F5F5] flex flex-col sm:flex-row gap-5 items-start">
    <div className="bg-[#D9D9D9] w-18 h-18 flex items-center justify-center flex-shrink-0">
      <span className="text-2xl">🏆</span>
    </div>
    <div className="mt-3 text-[13px]">
      <p className="font-semibold">{certification.cert_name || certification.name || "Certification"}</p>
      <p>{certification.issuer || certification.issuer_name || "Issuer"}</p>
      {certification.issue_date && (
        <span className="text-[#FFB54780]">
          Date: {new Date(certification.issue_date).toLocaleDateString()}
        </span>
      )}
    </div>
  </div>
);

const ContactInfoList = ({ candidate }) => {
  const contacts = [
    { type: "Mobile", value: candidate?.phone, icon: "📱" },
    { type: "Email", value: candidate?.email, icon: "📧" },
    { type: "Location", value: candidate?.location || candidate?.preferred_country, icon: "📍" },
  ].filter(contact => contact.value);

  return (
    <div className="px-4 sm:px-8 pb-8 text-[#FFFFFF] space-y-4">
      {contacts.length === 0 ? (
        <p className="text-sm">No contact info available</p>
      ) : (
        contacts.map((contact, index) => (
          <div key={index} className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-[#1A3E32] flex items-center justify-center">
              <span>{contact.icon}</span>
            </div>
            <div>
              <p className="text-[15px] font-semibold break-all">{contact.value}</p>
              <p className="text-[13px] font-medium">{contact.type}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const RecommendedProfile = ({ onConnect }) => (
  <div>
    <div className="px-4 sm:px-8 pb-8 text-[#FFFFFF]">
      <div className="flex flex-col sm:flex-row gap-3">
        <img className="w-20 h-20 rounded-full" src="/assets/images/photo_placeholder.png" alt="Recommended profile" />
        <div>
          <p className="text-[10px] font-semibold">John Samuel</p>
          <div className="flex space-x-2 text-[5px]">
            <p>Jobseeker</p>
            <p className="text-[#E09A36]">.34</p>
            <p className="text-[#E09A36]">connections</p>
          </div>
          <button
            onClick={onConnect}
            className="bg-[#1A3E32] w-40 flex items-center justify-center mt-2 space-x-1 p-1 rounded-3xl text-[10px] text-white">
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
