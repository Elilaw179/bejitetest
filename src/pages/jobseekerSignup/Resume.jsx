import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Resume = () => {

  const navigate = useNavigate()
    const location = useLocation();

    const { email, firstName, lastName, role, mode, followings } =
      location.state || {};

      console.log("followings:", followings);
  return (
    <div className="bg-white min-h-screen flex flex-col items-center">
     
      <div className="w-full px-4 py-6 flex justify-start items-center max-w-screen-xl mx-auto">
        <img
          src="/assets/images/logo.png"
          alt="logo"
          className="h-12 sm:h-16"
        />
      </div>

    
      <div className="flex flex-col items-center justify-center w-full px-4 max-w-4xl text-center mt-[5%]">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mb-6 mt-auto">
          <img src="/assets/images/Frame.svg" alt="Resume Visual" className="m-auto" />
        </div>

        <div className="w-full max-w-3xl mb-8">
          <p className="text-2xl sm:text-3xl md:text-5xl font-norican font-semibold text-[#16730F] mb-4">
            Build Your Resume. Get Noticed.
          </p>
          <p className="text-[#333] text-base sm:text-lg md:text-xl font-normal leading-relaxed">
            Follow the next steps to create a smart, professional CV that connects <br className="hidden sm:block" />
            you to the right employers faster and easier.
          </p>
        </div>

        <div className="mt-4 w-full flex justify-center">
          <button className="w-full max-w-[321px] h-12 bg-[#16730F] border border-none rounded-[30px] text-white shadow-md text-base font-medium transition-all hover:bg-[#1A3E32]"
           onClick={()=>navigate("/bio", { state: { email, firstName, lastName, role, mode, followings } })}>
            
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resume;

