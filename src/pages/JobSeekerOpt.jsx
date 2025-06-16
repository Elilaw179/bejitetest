


import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MemberCard from "../components/MemberCard";

const JobSeekerOpt = () => {
  const [showActiveInfo, setShowActiveInfo] = useState(false);
  const [showFreelancerInfo, setShowFreelancerInfo] = useState(false);
  const [showInactiveInfo, setShowInactiveInfo] = useState(false);

  const activeRef = useRef(null);
  const freelancerRef = useRef(null);
  const inactiveRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeRef.current && !activeRef.current.contains(e.target)) setShowActiveInfo(false);
      if (freelancerRef.current && !freelancerRef.current.contains(e.target)) setShowFreelancerInfo(false);
      if (inactiveRef.current && !inactiveRef.current.contains(e.target)) setShowInactiveInfo(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col items-center ">
      
      <div className="w-full px-4 py-6 flex items-center max-w-screen-xl">
        <img src="/assets/images/logo.png" alt="logo" className="h-10" />
      </div>

    
      <div className="w-full px-4 sm:max-w-xl text-center mt-[10%]">
        <p className="text-3xl sm:text-4xl font-norican font-semibold text-[#E63357]">As a Jobseeker</p>
        <p className="text-lg sm:text-xl text-[#FF6F61] mt-2">
          Select one of the listed options below
        </p>
      </div>

    
      <div className="w-full max-w-6xl px-4 mt-12 flex flex-wrap justify-center gap-6 py-6 bg-[#E0E0E01A] rounded-2xl border border-[#82828226]">
        <MemberCard
          label="ACTIVE MEMBER"
          iconSrc="/assets/images/profiletick.svg"
          infoText="As an ACTIVE jobseeker, employers can search you out using the advanced search engine (ASE)."
          position="above-icon"
          showInfo={showActiveInfo}
          setShowInfo={setShowActiveInfo}
          containerRef={activeRef}
        />

        <MemberCard
          label="FREELANCER"
          iconSrc="/assets/images/freelic.svg"
          infoText="As a FREELANCER, employers can search you out using the advanced search engine (ASE)."
          position="above-icon"
          showInfo={showFreelancerInfo}
          setShowInfo={setShowFreelancerInfo}
          containerRef={freelancerRef}
          onClick={() => navigate("/jobconnection")}
        />

        <MemberCard
          label="INACTIVE MEMBER"
          iconSrc="/assets/images/profile.svg"
          infoText="As an INACTIVE jobseeker, employers cannot search you out on the platform."
          position="below-card"
          showInfo={showInactiveInfo}
          setShowInfo={setShowInactiveInfo}
          containerRef={inactiveRef}
        />
      </div>
    </div>
  );
};

export default JobSeekerOpt;

