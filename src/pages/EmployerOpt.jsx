import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MemberCard from "../components/MemberCard";

const EmployerOpt = () => {
  const navigate = useNavigate();

  const [showIndividualInfo, setShowIndividualInfo] = useState(false);
  const [showCoperateInfo, setShowCoperateInfo] = useState(false);

  const individualRef = useRef(null);
  const coperateRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (individualRef.current && !individualRef.current.contains(e.target))
        setShowIndividualInfo(false);
      if (coperateRef.current && !coperateRef.current.contains(e.target))
        setShowCoperateInfo(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="w-full px-4 py-6 flex items-center max-w-screen-xl mx-auto">
        <img src="/assets/images/logo.png" alt="logo" className="h-10" />
      </div>

      <div className="flex flex-col items-center justify-center w-full px-4 py-10 sm:py-20 mt-[5%]">
        <h1 className="lg:text-5xl text-2xl text-[#16730F] font-[500] leading-relaxed">
          As an Employer
        </h1>
        <p className="lg:text-xl text-center text-[#333] font-[400] leading-relaxed">
          Choose the account type that fits your hiring needs
        </p>

        <div className="lg:w-[50%] w-full px-4 mt-12 flex flex-wrap justify-around gap-6 py-10 bg-[#E0E0E01A] rounded-2xl border border-[#82828226]">
          <MemberCard
            label="INDIVIDUAL"
            iconSrc="/assets/images/user.svg"
            infoText="As an ACTIVE jobseeker, employers can search you out using the advanced search engine (ASE)."
            position="above-icon"
            showInfo={showIndividualInfo}
            setShowInfo={setShowIndividualInfo}
            containerRef={individualRef}
            onClick={() => navigate("/individual/basic-details")}
          />

          <MemberCard
            label="COPERATE"
            iconSrc="/assets/images/freel ic.svg"
            infoText="As a FREELANCER, employers can search you out using the advanced search engine (ASE)."
            position="below-card"
            showInfo={showCoperateInfo}
            setShowInfo={setShowCoperateInfo}
            containerRef={coperateRef}
            onClick={() => navigate("/coperate/Basic-details")}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployerOpt;
