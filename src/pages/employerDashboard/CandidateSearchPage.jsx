// import React, { useState } from 'react';
// import SearchCriteria from '../../components/candidate-search-page/SearchCriteria';
// import CandidateSearchResults from '../../components/candidate-search-page/CandidateSearchResults';
// import NewsFeedHeader from '../../components/NewsFeedHeader';
// import UserProfilePanel from '../../components/candidate-search-page/UserProfilePanel';
// import JobSearchFormGreen from '../../components/candidate-search-page/JobSearchFormGreen';
// import UserMainProfileCard from '../../components/candidate-search-page/UserMainProfileCard';
// import PeopleConnect from '../../components/candidate-search-page/PeopleConnect';

// const CandidateSearchPage = () => {
//   const [formData, setFormData] = useState({
//     jobInput: "", industryInput: "", countryInput: "", stateInput: "", workTypeInput: "",
//     salaryInput: "", currencyInput: "", remoteInput: "", availabilityInput: "",
//     educationInput: "", skillInput: "", tribeInput: "", ageInput: "", genderInput: "", maritalInput: ""
//   });

//   const [showResults, setShowResults] = useState(false);
//   const [viewProfile, setViewProfile] = useState(false);
//   const [showMainProfile, setShowMainProfile] = useState(false);
//   const [showPeopleConnect, setShowPeopleConnect] = useState(false);

//   const isFormComplete = Object.values(formData).every(val => val.trim() !== "");

//   return (
//   <div>
//      <NewsFeedHeader />
//   <div className="bg-[#FFFFFF] max-w-[1440px] mx-auto">
     
//       <div className="flex flex-col lg:flex-row w-full min-h-screen mt-2">

//         {/* Left Column */}
//         <div className="w-full lg:w-1/4 p-4 border-gray-300">
//           {showResults && (
//             <CandidateSearchResults onViewProfile={() => setViewProfile(true)} />
//           )}
//         </div>

//         {/* Middle Column */}
//         <div className="w-full lg:w-1/2  bg-[#F5F5F5] ">
//           {!viewProfile ? (
//             <SearchCriteria
//               formData={formData}
//               setFormData={setFormData}
//               isFormComplete={isFormComplete}
//               onSearch={() => setShowResults(true)}
//             />
//           ) : !showMainProfile ? (
//             <UserProfilePanel onViewMainProfile={() => setShowMainProfile(true)} />
//           ) : !showPeopleConnect ? (
//             <UserMainProfileCard onConnect={() => setShowPeopleConnect(true)} />
//           ) : (
//             <PeopleConnect />
//           )}
//         </div>

//         {/* Right Column */}
//         <div className="w-full lg:w-1/4 p-4">
//           {viewProfile && <JobSearchFormGreen />}
//         </div>

//       </div>
//     </div>
//   </div>
  
//   );
// };

// export default CandidateSearchPage;






















import React, { useState } from 'react';
import SearchCriteria from '../../components/candidate-search-page/SearchCriteria';
import CandidateSearchResults from '../../components/candidate-search-page/CandidateSearchResults';
import NewsFeedHeader from '../../components/NewsFeedHeader';
import UserProfilePanel from '../../components/candidate-search-page/UserProfilePanel';
import JobSearchFormGreen from '../../components/candidate-search-page/JobSearchFormGreen';
import UserMainProfileCard from '../../components/candidate-search-page/UserMainProfileCard';
import PeopleConnect from '../../components/candidate-search-page/PeopleConnect';

const CandidateSearchPage = () => {
  const [formData, setFormData] = useState({
    jobInput: "", industryInput: "", countryInput: "", stateInput: "", workTypeInput: "",
    salaryInput: "", currencyInput: "", remoteInput: "", availabilityInput: "",
    educationInput: "", skillInput: "", tribeInput: "", ageInput: "", genderInput: "", maritalInput: ""
  });

  const [showResults, setShowResults] = useState(false);
  const [viewProfile, setViewProfile] = useState(false);
  const [showMainProfile, setShowMainProfile] = useState(false);
  const [showPeopleConnect, setShowPeopleConnect] = useState(false);

  const isFormComplete = Object.values(formData).every(val => val.trim() !== "");

  return (
    <div className="h-screen flex flex-col">
      <NewsFeedHeader />

      <div className="bg-[#FFFFFF] max-w-[1440px] mx-auto flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] h-full">

          {/* Left Column - Scrollable */}
          <div className="overflow-y-auto h-full p-4 border-gray-300">
            {showResults && (
              <CandidateSearchResults onViewProfile={() => setViewProfile(true)} />
            )}
          </div>

          {/* Middle Column - Scrollable */}
          <div className="overflow-y-auto h-full bg-[#F5F5F5] p-4 overflow-x-hidden">
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

          {/* Right Column - Scrollable */}
          <div className="overflow-y-auto h-full p-4">
            {viewProfile && <JobSearchFormGreen />}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CandidateSearchPage;

