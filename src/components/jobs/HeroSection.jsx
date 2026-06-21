import { FaBriefcase, FaBuilding, FaUsers } from "react-icons/fa";

export const HeroSection = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#16730F] to-[#1A3E32] p-8 md:p-12 text-white mb-8">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
      <div className="relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Find Your Next Opportunity
        </h1>
        <p className="text-green-100 max-w-2xl text-sm md:text-base">
          Discover thousands of job vacancies from top companies across Africa.
          Apply instantly and get matched using Bejite's Advanced Search Engine
          (ASE).
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2">
            <FaBriefcase /> 1,200+ Jobs
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2">
            <FaBuilding /> 500+ Companies
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2">
            <FaUsers /> 10k+ Candidates
          </div>
        </div>
      </div>
    </div>
  );
};
