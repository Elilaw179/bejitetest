import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";

const UserProfilePanel = ({ candidateId, onViewMainProfile }) => {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      if (!candidateId) {
        setError("No candidate ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const url = `${API_URL}/api/candidates/${candidateId}`;

        console.log("Fetching candidate with ID:", candidateId);
        console.log("API URL:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          // If single candidate fetch fails, try getting from search endpoint
          console.log(
            "Single candidate endpoint failed, trying search endpoint..."
          );

          const searchUrl =
            `${API_URL}/api/candidates?search=${candidateId}`;
          const searchResponse = await fetch(searchUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!searchResponse.ok) {
            throw new Error(
              `Failed to fetch candidates. Status: ${searchResponse.status}`
            );
          }

          const searchData = await searchResponse.json();

          if (
            searchData.success &&
            searchData.data &&
            Array.isArray(searchData.data)
          ) {
            const foundCandidate = searchData.data.find(
              (c) => c.id === parseInt(candidateId)
            );

            if (foundCandidate) {
              console.log("Found candidate from search:", foundCandidate);
              setCandidate(foundCandidate);
            } else {
              throw new Error(
                `Candidate with ID ${candidateId} not found in the database`
              );
            }
          } else {
            throw new Error("Invalid data format from search endpoint");
          }
        } else {
          // Single candidate endpoint succeeded
          const data = await response.json();
          console.log("Received data:", data);

          if (data.success && data.data) {
            setCandidate(data.data);
          } else if (data.data) {
            // Handle case where success flag might be missing but data exists
            setCandidate(data.data);
          } else {
            throw new Error("No candidate data received from API");
          }
        }
      } catch (error) {
        console.error("Error fetching candidate details:", error);
        setError(error.message || "Failed to load candidate profile");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateDetails();
  }, [candidateId]);

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-8 py-6 bg-[#F5F5F5] mt-1">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8E23]"></div>
          <p className="text-[#6B8E23] mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-8 py-6 bg-[#F5F5F5] mt-1">
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-red-500 text-lg font-semibold">
            Error Loading Profile
          </p>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-8 py-6 bg-[#F5F5F5] mt-1">
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-gray-600">No candidate data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6 bg-[#F5F5F5] mt-1">
      <div className="max-w-4xl mx-auto">
        <ProfileHeader candidate={candidate} />
        <ProfileStats
          candidate={candidate}
          onViewMainProfile={onViewMainProfile}
        />
        <Divider />

        {candidate.education && candidate.education.length > 0 && (
          <ProfileSection title="Education">
            {candidate.education.map((edu, index) => (
              <EducationItem key={index} education={edu} />
            ))}
          </ProfileSection>
        )}

        {candidate.skills && candidate.skills.length > 0 && (
          <ProfileSection title="Skills">
            <SkillsList skills={candidate.skills} />
          </ProfileSection>
        )}

        {candidate.work_history && candidate.work_history.length > 0 && (
          <ProfileSection title="Work History">
            {candidate.work_history.map((work, index) => (
              <WorkHistoryItem key={index} work={work} />
            ))}
          </ProfileSection>
        )}

        {candidate.certifications && candidate.certifications.length > 0 && (
          <ProfileSection title="Certifications">
            {candidate.certifications.map((cert, index) => (
              <CertificationItem key={index} certification={cert} />
            ))}
          </ProfileSection>
        )}

        <ProfileSection title="Contact Info">
          <ContactInfoList candidate={candidate} />
        </ProfileSection>
        <PostCard candidate={candidate} />
      </div>
    </div>
  );
};

const ProfileHeader = ({ candidate }) => {
  const initials = `${candidate.first_name?.[0] || ""}${
    candidate.last_name?.[0] || ""
  }`;
  const isAvailable = candidate.availability === "Available";

  return (
    <div>
      <div className="p-4 sm:p-8 bg-gradient-to-r from-[#1A3E32] to-[#6B8E23] rounded-lg">
        <div className="h-32"></div>
      </div>
      <div className="relative left-8 sm:left-20 bottom-15 sm:bottom-16">
        <div className="relative rounded-full w-[80px] sm:w-[100px] h-[80px] sm:h-[100px]  bg-[#6B8E23] flex items-center justify-center border-4 border-white">
          <span className="text-white text-3xl font-bold">{initials}</span>
          <span
            className={`absolute w-4 h-4 rounded-full border-2 border-white bottom-0 right-0 z-99 ${
              isAvailable ? "bg-[#6B8E23]" : "bg-[#828282]"
            }`}
          ></span>
        </div>
        {/* <span
          className={`absolute w-4 h-4 rounded-full border-2 border-white bottom-0 right-2 ${
            isAvailable ? "bg-[#6B8E23]" : "bg-[#828282]"
          }`}
        ></span> */}
      </div>
    </div>
  );
};

const ProfileStats = ({ candidate, onViewMainProfile }) => (
  <div className="px-4 sm:px-8 mt-[-60px] sm:mt-[-40px]">
    <div className="flex gap-2 items-center">
      <p className="text-[#6B8E23] font-semibold text-[16px]">
        {candidate.first_name} {candidate.last_name}
      </p>
      <p className="text-[#E09A36] font-semibold text-[10px]">• Jobseeker</p>
    </div>

    {candidate.bio && (
      <div className="text-[12px] mt-2">
        <p className="text-[#6B8E23]">{candidate.bio}</p>
      </div>
    )}

    <div className="mt-4">
      <p className="text-[#E09A36] text-[14px] font-semibold">
        {candidate.title}
      </p>
      <p className="text-[#6B8E23] text-[10px]">📍 {candidate.location}</p>
      {candidate.experience_years > 0 && (
        <p className="text-[#6B8E23] text-[10px]">
          💼 {candidate.experience_years} years experience
        </p>
      )}
      {candidate.remote_preference && (
        <p className="text-[#6B8E23] text-[10px]">🏠 Open to remote work</p>
      )}
      {candidate.salary_expectation && (
        <p className="text-[#6B8E23] text-[10px]">
          💰 Expected: ₦{candidate.salary_expectation.toLocaleString()}
        </p>
      )}
    </div>

    <ActionButtons onViewMainProfile={onViewMainProfile} />
  </div>
);

const ActionButtons = ({ onViewMainProfile }) => (
  <div className="flex flex-col sm:flex-row sm:justify-start items-center mt-6 gap-3 w-full">
    <Button
      icon="/assets/images/repeate-one.svg"
      text="Connect"
      onClick={onViewMainProfile}
    />
    <Button icon="/assets/images/Send_Submit.svg" text="Message" />
    <button className="text-[#6B8E23] text-[12px] hover:underline">
      View Full Profile
    </button>
  </div>
);

const Button = ({ icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="bg-[#556B1F] hover:bg-[#6B8E23] w-full sm:w-[180px] text-center text-[12px] text-[#FFFFFF] flex p-2 rounded-3xl gap-2 justify-center items-center transition-colors"
  >
    <img className="w-4 h-4" src={icon} alt={text} />
    {text}
  </button>
);

const Divider = () => (
  <div className="w-full mx-auto my-6 border-t-2 border-[#6B8E23]"></div>
);

const ProfileSection = ({ title, children }) => (
  <div className="bg-[#556B1F] rounded-2xl mt-4 mb-4">
    <div className="pt-6 px-4 sm:px-8">
      <p className="text-[#E09A36] text-[18px] font-semibold mb-2">{title}</p>
    </div>
    <div className="w-full border-t-2 border-[#E0E0E0] mb-4"></div>
    {children}
  </div>
);

const EducationItem = ({ education }) => (
  <div className="px-4 sm:px-8 pb-6 text-[#F5F5F5] flex flex-col sm:flex-row justify-between gap-3 items-start">
    <div className="bg-gradient-to-br from-[#6B8E23] to-[#556B1F] w-16 h-16 rounded-lg flex items-center justify-center">
      <span className="text-white text-xl font-bold">🎓</span>
    </div>
    <div className="flex-1">
      <p className="text-[14px] font-semibold">{education.degree}</p>
      <p className="text-[12px]">{education.institution}</p>
      <p className="text-[11px] text-[#E0E0E0]">{education.field}</p>
      <span className="text-[#FFB54780] text-[11px]">{education.year}</span>
    </div>
  </div>
);

const SkillsList = ({ skills }) => (
  <div className="px-4 sm:px-8 pb-6">
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <span
          key={index}
          className="bg-[#1A3E32] text-[#FFFFFF] px-3 py-1.5 rounded-full text-[12px] font-medium"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
);

const WorkHistoryItem = ({ work }) => (
  <>
    <div className="px-4 sm:px-8 pb-6 text-[#F5F5F5] flex flex-col sm:flex-row gap-4 items-start">
      <div className="bg-gradient-to-br from-[#6B8E23] to-[#556B1F] w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xl font-bold">💼</span>
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-semibold">{work.title}</p>
        <p className="text-[13px]">{work.company}</p>
        <p className="text-[11px] text-[#E0E0E0] mt-1">{work.description}</p>
        <span className="text-[#FFB54780] text-[11px]">{work.duration}</span>
      </div>
    </div>
    <div className="w-full border-t-2 border-[#E0E0E0] mb-4"></div>
  </>
);

const CertificationItem = ({ certification }) => (
  <div className="px-4 sm:px-8 pb-6 text-[#F5F5F5] flex flex-col sm:flex-row gap-4 items-start">
    <div className="bg-gradient-to-br from-[#E09A36] to-[#6B8E23] w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0">
      <span className="text-white text-xl font-bold">🏆</span>
    </div>
    <div className="flex-1">
      <p className="text-[14px] font-semibold">{certification}</p>
    </div>
  </div>
);

const ContactInfoList = ({ candidate }) => {
  const contacts = [
    { type: "Mobile", value: candidate.phone, icon: "📱" },
    { type: "Email", value: candidate.email, icon: "📧" },
    { type: "LinkedIn", value: candidate.linkedin_url, icon: "💼" },
    { type: "GitHub", value: candidate.github_url, icon: "💻" },
    { type: "Portfolio", value: candidate.portfolio_url, icon: "🌐" },
  ].filter((contact) => contact.value);

  return (
    <div className="px-4 sm:px-8 pb-6 text-[#FFFFFF] space-y-4">
      {contacts.map((contact, index) => (
        <div key={index} className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full bg-[#1A3E32] flex items-center justify-center">
            <span className="text-xl">{contact.icon}</span>
          </div>
          <div>
            <p className="text-[13px] font-semibold break-all">
              {contact.value}
            </p>
            <p className="text-[11px] font-medium text-[#E0E0E0]">
              {contact.type}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const PostCard = ({ candidate }) => (
  <div className="bg-white p-4 sm:p-6 rounded-2xl space-y-4">
    <PostHeader candidate={candidate} />
    <PostContent />
    <PostImage />
    <PostActions />
  </div>
);

const PostHeader = ({ candidate }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div className="flex items-center gap-4">
      <img
        src="assets/images/eli.jpg"
        alt="profile"
        className="rounded-full w-12 h-12 sm:w-[60px] sm:h-[60px]"
      />
      <div>
        <p className="text-[#16730F] font-semibold text-sm">
          {candidate.first_name} {candidate.last_name}
        </p>
        <p className="text-[#1A3E32] text-[10px] sm:text-xs">
          Posted 12 minutes ago
        </p>
      </div>
    </div>
    <img src="assets/images/more.svg" alt="more" className="w-4 h-4" />
  </div>
);

const PostContent = () => (
  <div>
    <p className="text-black text-sm">
      🚀 HIRING JUST GOT SMARTER | WELCOME TO BEJITE.COM....
    </p>
    <p className="text-[#16730F80] text-xs sm:text-sm mt-1 cursor-pointer">
      See more
    </p>
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
