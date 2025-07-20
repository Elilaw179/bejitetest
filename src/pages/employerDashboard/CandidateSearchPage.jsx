
import React, { useState } from 'react';
import SearchCriteria from './SearchCriteria';
import CandidateSearchResults from '../../components/CandidateSearchResults';
import NewsFeedHeader from '../../components/NewsFeedHeader';
import UserProfilePanel from '../../components/UserProfilePanel';
import JobSearchFormGreen from '../../components/JobSearchFormGreen';
import UserMainProfileCard from '../../components/UserMainProfileCard';
import PeopleConnect from '../../components/PeopleConnect';

const CandidateSearchPage = () => {
  const [formData, setFormData] = useState({
    jobInput: "",
    industryInput: "",
    countryInput: "",
    stateInput: "",
    workTypeInput: "",
    salaryInput: "",
    currencyInput: "",
    remoteInput: "",
    availabilityInput: "",
    educationInput: "",
    skillInput: "",
    tribeInput: "",
    ageInput: "",
    genderInput: "",
    maritalInput: ""
  });

  const [showResults, setShowResults] = useState(false);
  const [viewProfile, setViewProfile] = useState(false);
  const [showMainProfile, setShowMainProfile] = useState(false);
  const [showPeopleConnect, setShowPeopleConnect] = useState(false);

  const isFormComplete = Object.values(formData).every(val => val.trim() !== "");

  return (
    <div className="bg-[#FFFFFF]">
      <NewsFeedHeader />
      <div className="flex w-full min-h-screen  mt-2">

        {/* Left Column: CandidateSearchResults */}
        <div className="w-1/4 p-4  border-gray-300">
          {showResults &&
            <CandidateSearchResults onViewProfile={() => setViewProfile(true)} />}
        </div>

        {/* Middle Column: dynamic content */}
        <div className="w-1/2 p-4 bg-[#F5F5F5]">
          {!viewProfile ? (
            <SearchCriteria
              formData={formData}
              setFormData={setFormData}
              isFormComplete={isFormComplete}
              onSearch={() => setShowResults(true)}
            />
          ) : !showMainProfile ? (
            <UserProfilePanel onViewMainProfile={() => setShowMainProfile(true)} />
          ) : !showPeopleConnect ? (
            <UserMainProfileCard onConnect={() => setShowPeopleConnect(true)} />
          ) : (
            <PeopleConnect />
          )}
        </div>

        {/* Right Column: Always show JobSearchFormGreen once a profile is viewed */}
        <div className="w-1/4 p-4">
          {viewProfile && <JobSearchFormGreen />}
        </div>

      </div>
    </div>
  );
};

export default CandidateSearchPage;
