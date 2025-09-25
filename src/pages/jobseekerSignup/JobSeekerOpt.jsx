<<<<<<< HEAD
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MemberCard from "../../components/MemberCard";

const JobSeekerOpt = () => {
  const [showActiveInfo, setShowActiveInfo] = useState(false);
  const [showFreelancerInfo, setShowFreelancerInfo] = useState(false);
  const [showInactiveInfo, setShowInactiveInfo] = useState(false);

  const activeRef = useRef(null);
  const freelancerRef = useRef(null);
  const inactiveRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Get email & role from location.state (from SignUpRole page)
  const { email, role } = location.state || {};

  // Log when component mounts
  useEffect(() => {
    console.log("JobSeekerOpt loaded. Email:", email, "Role:", role);
  }, [email, role]);

  // Close info popups on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeRef.current && !activeRef.current.contains(e.target))
        setShowActiveInfo(false);
      if (freelancerRef.current && !freelancerRef.current.contains(e.target))
        setShowFreelancerInfo(false);
      if (inactiveRef.current && !inactiveRef.current.contains(e.target))
        setShowInactiveInfo(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Cleaned navigation function
  const handleSelectMode = (mode) => {
    console.log("➡️ Mode selected:", { email, role, mode });

    if (!email || !role) {
      console.warn("⚠️ Email or role is missing. Cannot navigate.");
      return;
    }

    navigate(`/jobconnection?email=${email}&role=${role}&mode=${mode}`);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center">
      {/* Logo Header */}
      <div className="w-full px-4 py-6 flex items-center max-w-screen-xl">
        <img src="/assets/images/logo.png" alt="logo" className="h-10" />
      </div>

      {/* Title */}
      <div className="w-full px-4 sm:max-w-xl text-center mt-[10%]">
        <p className="font-dynapuff text-3xl sm:text-4xl font-semibold text-[#16730F]">
          As a Jobseeker
        </p>
        <p className="text-lg sm:text-xl text-[#333] mt-2">
          Select one of the listed options below
        </p>
      </div>

      {/* Options */}
      <div className="w-full max-w-6xl px-4 mt-12 flex flex-wrap justify-center gap-6 py-6 bg-[#E0E0E01A] rounded-2xl border border-[#82828226]">
        <MemberCard
          label={<span className="italic cursor-pointer">ACTIVE JOBSEEKER</span>}
          iconSrc="/assets/images/profile-tick.svg"
          infoText="As an ACTIVE jobseeker, employers can search you out using the advanced search engine (ASE)."
          position="above-icon"
          showInfo={showActiveInfo}
          setShowInfo={setShowActiveInfo}
          containerRef={activeRef}
          onClick={() => handleSelectMode("active_member")}
        />

        <MemberCard
          label={<span className="italic cursor-pointer">FREELANCER</span>}
          iconSrc="/assets/images/freelic2.svg"
          infoText="As a FREELANCER, employers can search you out using the advanced search engine (ASE)."
          position="above-icon"
          showInfo={showFreelancerInfo}
          setShowInfo={setShowFreelancerInfo}
          containerRef={freelancerRef}
          onClick={() => handleSelectMode("freelancer")}
        />

        <MemberCard
          label={<span className="italic cursor-pointer">INACTIVE JOBSEEKER</span>}
          iconSrc="/assets/images/profile.svg"
          infoText="As an INACTIVE jobseeker, employers cannot search you out on the platform."
          position="below-card"
          showInfo={showInactiveInfo}
          setShowInfo={setShowInactiveInfo}
          containerRef={inactiveRef}
          onClick={() => handleSelectMode("inactive_member")}
        />
      </div>
    </div>
  );
=======
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MemberCard from '../../components/MemberCard';

const JobSeekerOpt = () => {
    const [showActiveInfo, setShowActiveInfo] = useState(false);
    const [showFreelancerInfo, setShowFreelancerInfo] = useState(false);
    const [showInactiveInfo, setShowInactiveInfo] = useState(false);

    const activeRef = useRef(null);
    const freelancerRef = useRef(null);
    const inactiveRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();
    const { email, firstName, lastName, password, role } = location.state || {};

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (activeRef.current && !activeRef.current.contains(e.target))
                setShowActiveInfo(false);
            if (
                freelancerRef.current &&
                !freelancerRef.current.contains(e.target)
            )
                setShowFreelancerInfo(false);
            if (inactiveRef.current && !inactiveRef.current.contains(e.target))
                setShowInactiveInfo(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="bg-white min-h-screen flex flex-col items-center ">
            <div className="w-full px-4 py-6 flex items-center max-w-screen-xl">
                <img
                    src="/assets/images/logo.png"
                    alt="logo"
                    className="h-10"
                />
            </div>

            <div className="w-full px-4 sm:max-w-xl text-center mt-[10%]">
                <p className=" font-dynapuff text-3xl sm:text-4xl  font-semibold text-[#16730F] ">
                    As a Jobseeker
                </p>
                <p className="text-lg sm:text-xl text-[#333] mt-2">
                    Select one of the listed options below
                </p>
            </div>

            <div className="w-full   max-w-6xl px-4 mt-12 flex flex-wrap justify-center gap-6 py-6 bg-[#E0E0E01A] rounded-2xl border border-[#82828226]">
                <MemberCard
                    label={
                        <span className="italic cursor-pointer">
                            {' '}
                            ACTIVE JOBSEEKER
                        </span>
                    }
                    iconSrc="/assets/images/profile-tick.svg"
                    infoText="As an ACTIVE jobseeker, employers can search you out using the advanced search engine (ASE)."
                    position="above-icon"
                    showInfo={showActiveInfo}
                    setShowInfo={setShowActiveInfo}
                    containerRef={activeRef}
                    onClick={() => {
                        const selectedMode = 'active_member';
                        navigate('/jobconnection', {
                            state: {
                                email,
                                firstName,
                                lastName,
                                password,
                                role,
                                mode: selectedMode,
                            },
                        });
                    }}
                />

                <MemberCard
                    label={
                        <span className="cursor-pointer italic">
                            FREELANCER
                        </span>
                    }
                    iconSrc="/assets/images/freelic2.svg"
                    infoText="As a FREELANCER, employers can search you out using the advanced search engine (ASE)."
                    position="above-icon"
                    showInfo={showFreelancerInfo}
                    setShowInfo={setShowFreelancerInfo}
                    containerRef={freelancerRef}
                    onClick={() => {
                        const selectedMode = 'freelancer';
                        navigate('/jobconnection', {
                            state: {
                                email,
                                firstName,
                                lastName,
                                role,
                                mode: selectedMode,
                            },
                        });
                    }}
                />

                <MemberCard
                    label={
                        <span className="cursor-pointer italic">
                            INACTIVE JOBSEEKER
                        </span>
                    }
                    iconSrc="/assets/images/profile.svg"
                    infoText="As an INACTIVE jobseeker, employers cannot search you out on the platform."
                    position="below-card"
                    showInfo={showInactiveInfo}
                    setShowInfo={setShowInactiveInfo}
                    containerRef={inactiveRef}
                    onClick={() => {
                        const selectedMode = 'inactive_member';
                        navigate('/jobconnection', {
                            state: {
                                email,
                                firstName,
                                lastName,
                                role,
                                mode: selectedMode,
                            },
                        });
                    }}
                />
            </div>
        </div>
    );
>>>>>>> bd81adc0c17b7e4b733a0b4e8909a6c41c05447c
};

export default JobSeekerOpt;
