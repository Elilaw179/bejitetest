
import React from "react";
import NewsFeedHeader from "../../components/NewsFeedHeader";
import { FaArrowLeft, FaHome } from "react-icons/fa";

const Recruitment = () => {
  return (
    <div>
      <NewsFeedHeader />
      <div className="bg-[#F5F5F5] p-4 border-b-2 border-[#16730F] grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] gap-4 mt-2 w-full max-w-screen-xl mx-auto">
        
        {/* Left Sidebar */}
        <div className="hidden md:block bg-[#16730F] rounded-2xl">
          <div className="p-7 space-y-2">
            <FaArrowLeft className="text-[#1A3E32]" />
            <h1 className="text-[20px] text-[#1A3E32]">Dashboard</h1>
          </div>

          <div className="max-w-48 m-auto space-y-4 cursor-pointer">
            <div className="flex space-x-3 items-center">
              <FaHome className="text-[#F5F5F5]" />
              <p className="text-[#F5F5F5]">News Feed</p>
            </div>
            <div className="flex space-x-3 items-center">
              <img src="/assets/images/repeate-one.svg" alt="" />
              <p className="text-[#F5F5F5]">Connections</p>
            </div>
            <div className="flex space-x-3 items-center">
              <img src="/assets/images/messages-2.svg" alt="" />
              <p className="text-[#F5F5F5]">Chats</p>
            </div>
            <div className="flex space-x-3 items-center">
              <img src="/assets/images/user-search.svg" alt="" />
              <p className="text-[#F5F5F5]">Recruitment</p>
            </div>
            <div className="flex space-x-3 items-center">
              <img src="/assets/images/notification.svg" alt="" />
              <p className="text-[#F5F5F5]">Recruitment</p>
            </div>
          </div>

          <div className="bg-[#1A3E32] h-[560px] rounded-b-2xl mt-10">
            <div className="mt-10 p-10 space-y-5">
              <h1 className="text-[#FFFFFF] text-center">ADD PRO</h1>
              <div className="w-[200px] h-[200px] m-auto bg-[#FFFFFF]"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <div className="w-full px-4 py-6">
            <div className="max-w-3xl mx-auto rounded-2xl p-6 bg-[#FFFFFF]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <img
                  src="assets/images/eli.jpg"
                  alt="profile"
                  className="rounded-full w-[60px] h-[60px]"
                />
                <div className="relative flex-1 w-full">
                  <textarea
                    placeholder="Share something"
                    className="w-full p-3 pl-4 pr-20 text-sm border-2 border-[#16730F] focus:outline-none"
                  ></textarea>
                  <div className="absolute top-3 right-4 flex items-center space-x-1">
                    <img src="assets/images/box-2.svg" alt="icon" className="w-3 h-3" />
                    <p className="text-[10px]">Drafts</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center mt-5 gap-4 px-2">
                <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
                  <div className="flex items-center gap-1">
                    <img src="assets/images/gallery.svg" alt="Image" />
                    <p className="text-[#1A3E32] text-sm">Image</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <img src="assets/images/video-square.png" alt="Video" />
                    <p className="text-[#1A3E32] text-sm">Video</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <img src="/assets/images/Amount_Icon_UIA.svg" alt="Poll" />
                    <p className="text-[#1A3E32] text-sm">Poll</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <img src="/assets/images/public-icon.svg" alt="Public" />
                  <select className="text-sm rounded-md border border-gray-300 px-2 py-1 text-[#1A3E32]">
                    <option value="public">Public</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto my-8 border-t-2 border-[#16730F]" />

            <div className="bg-white p-6 max-w-3xl mx-auto rounded-2xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
                <div className="flex items-center gap-4">
                  <img
                    src="assets/images/eli.jpg"
                    alt="profile"
                    className="rounded-full w-[60px] h-[60px]"
                  />
                  <div>
                    <p className="font-semibold text-lg text-[#16730F]">Osakwe Prisca</p>
                    <p className="text-[#1A3E32] text-sm">Posted 12 minutes ago</p>
                  </div>
                </div>
                <img src="assets/images/more.svg" alt="more" className="w-4 h-4 self-end sm:self-auto" />
              </div>

              <div>
                <p className="text-black">🚀 HIRING JUST GOT SMARTER | WELCOME TO BEJITE.COM....</p>
                <p className="text-[#16730F80] text-sm mt-1 cursor-pointer">See more</p>
              </div>

              <div>
                <img
                  src="assets/images/bejiteAdvert.png"
                  alt="Advert"
                  className="w-full rounded-xl"
                />
              </div>

              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <img src="assets/images/gallery.svg" alt="Like" />
                    <p className="text-[#1A3E32] text-sm">Like</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <img src="assets/images/video-square.png" alt="Comment" />
                    <p className="text-[#1A3E32] text-sm">Comment</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <img src="/assets/images/Amount_Icon_UIA.svg" alt="Saved" />
                    <p className="text-[#1A3E32] text-sm">Saved</p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <img src="/assets/images/public-icon.svg" alt="Share" />
                  <p className="text-sm">Share</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden md:block bg-[#1A3E32]">
          <div className="bg-[#16730F] rounded-2xl ">
            <div className="p-5 space-y-2">
              <FaArrowLeft className="text-[#1A3E32]" />
            </div>
            <div className="flex flex-col items-center  space-y-0">
              <img className="w-[90%]" src="/assets/images/post-ads.png" alt="" />
              <div className="border-[#16730F] border-5 rounded-full relative bottom-10">
                <img className="w-16 h-16 rounded-full" src="assets/images/prisca.jpg" alt="" />
              </div>
              <div className="text-[#FFFFFF] text-center">
                <p className="text-[20px]">Osakwe Prisca</p>
                <p className="text-[11px]">@nd_creations</p>
              </div>
            </div>
            <div className="text-[#ffffff] mt-5">
              <div className="flex justify-around  m-auto">
                <p>100</p>
                <p>200</p>
              </div>
              <div className="flex justify-around">
                <p>Post</p>
                <p>Connections</p>
              </div>
            </div>

            <div className="w-[150px] m-auto mt-4">
              <button className="bg-[#6B8E23] p-3 text-[#FFFFFF] w-full rounded-3xl">View Profile</button>
            </div>
          </div>

          <div className="bg-[#1A3E32] h-[500px] mt-3">
            <div className="max-w-60 m-auto space-y-5 p-8  cursor-pointer">
              <div className="flex space-x-3 items-center">
                <img src="assets/images/setting.png" alt="df" />
                <p className="text-[#F5F5F5]">Saved Posts</p>
              </div>
              <div className="flex space-x-3 items-center">
                <img src="/assets/images/task-square.svg" alt="" />
                <p className="text-[#F5F5F5]">Activity Log</p>
              </div>
              <div className="flex space-x-3 items-center">
                <img src="/assets/images/award.svg" alt="" />
                <p className="text-[#F5F5F5]">Badge Status</p>
              </div>
              <div className="flex space-x-3 items-center">
                <img src="/assets/images/setting-2.svg" alt="" />
                <p className="text-[#F5F5F5]">Account Settings</p>
              </div>
            </div>

            <div className=" w-32 ml-10 mt-20">
              <div className="flex space-x-2">
                <p>Help</p>
                <img src="/assets/images/questiontag.svg" alt="" />
              </div>
              <p className="text-[#6B8E23] text-[16px] font-medium">Logout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recruitment;






































// // import React, { useState } from "react";
// // import { FaCheck, FaSearch } from "react-icons/fa";
// // import NewsFeedHeader from "../../components/NewsFeedHeader";

// // const Recruitment = () => {
// //   const [formData, setFormData] = useState({
// //     jobInput: "",
// //     industryInput: "",
// //     countryInput: "",
// //     stateInput: "",
// //     workTypeInput: "",
// //     salaryInput: "",
// //     currencyInput: "",
// //     remoteInput: "",
// //     availabilityInput: "",
// //     educationInput: "",
// //     skillInput: "",
// //     tribeInput: "",
// //     ageInput: "",
// //     genderInput: "",
// //     maritalInput: ""
// //   });

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //   };

// //   return (
// //     <div className="">
// //       <NewsFeedHeader />

// //       <div className="w-3xl m-auto px-6 py-6 bg-[#F5F5F5] mt-2 ">
// //         <div className="max-w-3xl mx-auto rounded-2xl p-4 sm:p-6 bg-white shadow-sm">
// //           <p className="text-xl sm:text-2xl font-medium text-[#16730F] text-center">
// //             Search Criteria
// //           </p>
// //         </div>
// //            <div className="max-w-3xl mx-auto my-4 border-t-2 border-[#16730F]" />

// //         <div className="max-w-3xl mx-auto rounded-2xl p-4 sm:p-6 bg-white shadow-sm space-y-4">
// //           {/* Job Title */}
// //           <div className="w-full p-3 sm:p-4 rounded-lg">
// //             <label
// //               htmlFor="jobInput"
// //               className="text-[#16730F] text-sm sm:text-[15px] font-medium block mb-1"
// //             >
// //               JOB TITLE
// //             </label>
// //             <div className="relative">
// //               <input
// //                 list="jobTitles"
// //                 id="jobInput"
// //                 name="jobInput"
// //                 value={formData.jobInput}
// //                 onChange={handleChange}
// //                 className="w-full rounded-xl px-4 py-2 sm:py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16730F] bg-white text-gray-800 text-sm sm:text-base"
// //                 placeholder="Enter your job or select from list"
// //               />
// //               {formData.jobInput && (
// //                 <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
// //               )}
// //               <datalist id="jobTitles">
// //                 <option value="Software Engineer">Software Engineer</option>
// //                 <option value="Product Designer">Product Designer</option>
// //                 <option value="Data Analyst">Data Analyst</option>
// //                 <option value="Project Manager">Project Manager</option>
// //                 <option value="Marketing Specialist">Marketing Specialist</option>
// //               </datalist>
// //             </div>
// //           </div>

// //           {/* Industry */}
// //           <div className="w-full p-3 sm:p-4 rounded-lg">
// //             <label
// //               htmlFor="industryInput"
// //               className="text-[#16730F] text-sm sm:text-[15px] font-medium block mb-1"
// //             >
// //               INDUSTRY
// //             </label>
// //             <div className="relative">
// //               <input
// //                 list="industries"
// //                 id="industryInput"
// //                 name="industryInput"
// //                 value={formData.industryInput}
// //                 onChange={handleChange}
// //                 className="w-full rounded-xl px-4 py-2 sm:py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16730F] bg-white text-gray-800 text-sm sm:text-base"
// //                 placeholder="Enter sector"
// //               />
// //               {formData.industryInput && (
// //                 <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
// //               )}
// //               <datalist id="industries">
// //                 <option value="Technology">Technology</option>
// //                 <option value="Healthcare">Healthcare</option>
// //                 <option value="Finance">Finance</option>
// //                 <option value="Education">Education</option>
// //                 <option value="Retail">Retail</option>
// //               </datalist>
// //             </div>
// //           </div>

// //           {/* Preferred Country */}
// //           <div className="w-full p-3 sm:p-4 rounded-lg">
// //             <label
// //               htmlFor="countryInput"
// //               className="text-[#16730F] text-sm sm:text-[15px] font-medium block mb-1"
// //             >
// //               PREFERRED COUNTRY
// //             </label>
// //             <div className="relative">
// //               <input
// //                 list="countries"
// //                 id="countryInput"
// //                 name="countryInput"
// //                 value={formData.countryInput}
// //                 onChange={handleChange}
// //                 className="w-full rounded-xl px-4 py-2 sm:py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16730F] bg-white text-gray-800 text-sm sm:text-base"
// //                 placeholder="Enter or select"
// //               />
// //               {formData.countryInput && (
// //                 <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
// //               )}
// //               <datalist id="countries">
// //                 <option value="United States">United States</option>
// //                 <option value="United Kingdom">United Kingdom</option>
// //                 <option value="Canada">Canada</option>
// //                 <option value="Germany">Germany</option>
// //                 <option value="Australia">Australia</option>
// //               </datalist>
// //             </div>
// //           </div>

// //           {/* Preferred State */}
// //           <div className="w-full p-3 sm:p-4 rounded-lg">
// //             <label
// //               htmlFor="stateInput"
// //               className="text-[#16730F] text-sm sm:text-[15px] font-medium block mb-1"
// //             >
// //               PREFERRED STATE
// //             </label>
// //             <div className="relative">
// //               <input
// //                 list="states"
// //                 id="stateInput"
// //                 name="stateInput"
// //                 value={formData.stateInput}
// //                 onChange={handleChange}
// //                 className="w-full rounded-xl px-4 py-2 sm:py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16730F] bg-white text-gray-800 text-sm sm:text-base"
// //                 placeholder="Enter or select"
// //               />
// //               {formData.stateInput && (
// //                 <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
// //               )}
// //               <datalist id="states">
// //                 <option value="California">California</option>
// //                 <option value="Texas">Texas</option>
// //                 <option value="New York">New York</option>
// //                 <option value="Florida">Florida</option>
// //                 <option value="Illinois">Illinois</option>
// //               </datalist>
// //             </div>
// //           </div>

// //           {/* Work Type */}
// //           <div className="w-full p-3 sm:p-4 rounded-lg">
// //             <label
// //               htmlFor="workTypeInput"
// //               className="text-[#16730F] text-sm sm:text-[15px] font-medium block mb-1"
// //             >
// //               WORK TYPE
// //             </label>
// //             <div className="relative">
// //               <input
// //                 list="workTypes"
// //                 id="workTypeInput"
// //                 name="workTypeInput"
// //                 value={formData.workTypeInput}
// //                 onChange={handleChange}
// //                 className="w-full rounded-xl px-4 py-2 sm:py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16730F] bg-white text-gray-800 text-sm sm:text-base"
// //                 placeholder="Enter or select"
// //               />
// //               {formData.workTypeInput && (
// //                 <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
// //               )}
// //               <datalist id="workTypes">
// //                 <option value="Full-time">Full-time</option>
// //                 <option value="Part-time">Part-time</option>
// //                 <option value="Contract">Contract</option>
// //                 <option value="Freelance">Freelance</option>
// //                 <option value="Remote">Remote</option>
// //               </datalist>
// //             </div>
// //           </div>

// //           {/* Salary & Currency */}
// //           <div className="w-full p-3 sm:p-4 rounded-lg">
// //             <div className="flex flex-col sm:flex-row gap-4">
// //               <div className="w-full sm:w-1/2">
// //                 <label
// //                   htmlFor="salaryInput"
// //                   className="text-[#16730F] text-sm sm:text-[15px] font-medium block mb-1"
// //                 >
// //                   SALARY
// //                 </label>
// //                 <div className="relative">
// //                   <input
// //                     type="text"
// //                     id="salaryInput"
// //                     name="salaryInput"
// //                     value={formData.salaryInput}
// //                     onChange={handleChange}
// //                     placeholder="Enter"
// //                     className="w-full rounded-xl px-4 py-2 sm:py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16730F] bg-white text-gray-800 text-sm sm:text-base"
// //                   />
// //                   {formData.salaryInput && (
// //                     <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
// //                   )}
// //                 </div>
// //               </div>
// //               <div className="w-full sm:w-1/2">
// //                 <label
// //                   htmlFor="currencyInput"
// //                   className="text-[#16730F] text-sm sm:text-[15px] font-medium block mb-1"
// //                 >
// //                   CURRENCY
// //                 </label>
// //                 <div className="relative">
// //                   <input
// //                     list="currencies"
// //                     id="currencyInput"
// //                     name="currencyInput"
// //                     value={formData.currencyInput}
// //                     onChange={handleChange}
// //                     className="w-full rounded-xl px-4 py-2 sm:py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16730F] bg-white text-gray-800 text-sm sm:text-base"
// //                     placeholder="Enter or select"
// //                   />
// //                   {formData.currencyInput && (
// //                     <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
// //                   )}
// //                   <datalist id="currencies">
// //                     <option value="USD">USD</option>
// //                     <option value="EUR">EUR</option>
// //                     <option value="GBP">GBP</option>
// //                     <option value="JPY">JPY</option>
// //                     <option value="CAD">CAD</option>
// //                   </datalist>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Remote Reference & Availability */}
// //           <div className="w-full p-3 sm:p-4 rounded-lg">
// //             <div className="flex flex-col sm:flex-row gap-4">
// //               <div className="w-full sm:w-1/2">
// //                 <label
// //                   htmlFor="remoteInput"
// //                   className="text-[#16730F] text-sm sm:text-[15px] font-medium block mb-1"
// //                 >
// //                   REMOTE REFERENCE
// //                 </label>
// //                 <div className="relative">
// //                   <input
// //                     type="text"
// //                     id="remoteInput"
// //                     name="remoteInput"
// //                     value={formData.remoteInput}
// //                     onChange={handleChange}
// //                     placeholder="Enter"
// //                     className="w-full rounded-xl px-4 py-2 sm:py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16730F] bg-white text-gray-800 text-sm sm:text-base"
// //                   />
// //                   {formData.remoteInput && (
// //                     <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
// //                   )}
// //                 </div>
// //               </div>
// //               <div className="w-full sm:w-1/2">
// //                 <label
// //                   htmlFor="availabilityInput"
// //                   className="text-[#16730F] text-sm sm:text-[15px] font-medium block mb-1"
// //                 >
// //                   AVAILABILITY
// //                 </label>
// //                 <div className="relative">
// //                   <input
// //                     list="availabilities"
// //                     id="availabilityInput"
// //                     name="availabilityInput"
// //                     value={formData.availabilityInput}
// //                     onChange={handleChange}
// //                     className="w-full rounded-xl px-4 py-2 sm:py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16730F] bg-white text-gray-800 text-sm sm:text-base"
// //                     placeholder="Enter or select"
// //                   />
// //                   {formData.availabilityInput && (
// //                     <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
// //                   )}
// //                   <datalist id="availabilities">
// //                     <option value="Immediately">Immediately</option>
// //                     <option value="1-2 weeks">1-2 weeks</option>
// //                     <option value="1 month">1 month</option>
// //                     <option value="2 months">2 months</option>
// //                     <option value="3+ months">3+ months</option>
// //                   </datalist>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Education */}
// //           <div className="w-full p-3 sm:p-4 rounded-lg">
// //             <label
// //               htmlFor="educationInput"
// //               className="text-[#16730F] text-sm sm:text-[15px] font-medium block mb-1"
// //             >
// //               EDUCATION
// //             </label>
// //             <div className="relative">
// //               <input
// //                 list="educations"
// //                 id="educationInput"
// //                 name="educationInput"
// //                 value={formData.educationInput}
// //                 onChange={handleChange}
// //                 className="w-full rounded-xl px-4 py-2 sm:py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16730F] bg-white text-gray-800 text-sm sm:text-base"
// //                 placeholder="Enter or select"
// //               />
// //               {formData.educationInput && (
// //                 <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
// //               )}
// //               <datalist id="educations">
// //                 <option value="High School">High School</option>
// //                 <option value="Associate Degree">Associate Degree</option>
// //                 <option value="Bachelor's Degree">Bachelor's Degree</option>
// //                 <option value="Master's Degree">Master's Degree</option>
// //                 <option value="PhD">PhD</option>
// //               </datalist>
// //             </div>
// //           </div>

// //           {/* Skill */}
// //           <div className="w-full p-3 sm:p-4 rounded-lg">
// //             <label
// //               htmlFor="skillInput"
// //               className="text-[#16730F] text-sm sm:text-[15px] font-medium block mb-1"
// //             >
// //               SKILL
// //             </label>
// //             <div className="relative">
// //               <input
// //                 list="skills"
// //                 id="skillInput"
// //                 name="skillInput"
// //                 value={formData.skillInput}
// //                 onChange={handleChange}
// //                 className="w-full rounded-xl px-4 py-2 sm:py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16730F] bg-white text-gray-800 text-sm sm:text-base"
// //                 placeholder="Enter or select"
// //               />
// //               {formData.skillInput && (
// //                 <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
// //               )}
// //               <datalist id="skills">
// //                 <option value="JavaScript">JavaScript</option>
// //                 <option value="React">React</option>
// //                 <option value="Node.js">Node.js</option>
// //                 <option value="Python">Python</option>
// //                 <option value="SQL">SQL</option>
// //               </datalist>
// //             </div>
// //           </div>

// //           {/* Tribe & Age */}
// //           <div className="w-full p-3 sm:p-4 rounded-lg">
// //             <div className="flex flex-col sm:flex-row gap-4">
// //               <div className="w-full sm:w-1/2">
// //                 <label
// //                   htmlFor="tribeInput"
// //                   className="text-[#16730F] text-sm sm:text-[15px] font-medium block mb-1"
// //                 >
// //                   TRIBE
// //                 </label>
// //                 <div className="relative">
// //                   <input
// //                     type="text"
// //                     id="tribeInput"
// //                     name="tribeInput"
// //                     value={formData.tribeInput}
// //                     onChange={handleChange}
// //                     placeholder="Enter"
// //                     className="w-full rounded-xl px-4 py-2 sm:py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16730F] bg-white text-gray-800 text-sm sm:text-base"
// //                   />
// //                   {formData.tribeInput && (
// //                     <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
// //                   )}
// //                 </div>
// //               </div>
// //               <div className="w-full sm:w-1/2">
// //                 <label
// //                   htmlFor="ageInput"
// //                   className="text-[#16730F] text-sm sm:text-[15px] font-medium block mb-1"
// //                 >
// //                   AGE
// //                 </label>
// //                 <div className="relative">
// //                   <input
// //                     list="ages"
// //                     id="ageInput"
// //                     name="ageInput"
// //                     value={formData.ageInput}
// //                     onChange={handleChange}
// //                     className="w-full rounded-xl px-4 py-2 sm:py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16730F] bg-white text-gray-800 text-sm sm:text-base"
// //                     placeholder="Enter or select"
// //                   />
// //                   {formData.ageInput && (
// //                     <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
// //                   )}
// //                   <datalist id="ages">
// //                     <option value="18-24">18-24</option>
// //                     <option value="25-34">25-34</option>
// //                     <option value="35-44">35-44</option>
// //                     <option value="45-54">45-54</option>
// //                     <option value="55+">55+</option>
// //                   </datalist>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Gender & Marital Status */}
// //           <div className="w-full p-3 sm:p-4 rounded-lg">
// //             <div className="flex flex-col sm:flex-row gap-4">
// //               <div className="w-full sm:w-1/2">
// //                 <label
// //                   htmlFor="genderInput"
// //                   className="text-[#16730F] text-sm sm:text-[15px] font-medium block mb-1"
// //                 >
// //                   GENDER
// //                 </label>
// //                 <div className="relative">
// //                   <input
// //                     type="text"
// //                     id="genderInput"
// //                     name="genderInput"
// //                     value={formData.genderInput}
// //                     onChange={handleChange}
// //                     placeholder="Enter"
// //                     className="w-full rounded-xl px-4 py-2 sm:py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16730F] bg-white text-gray-800 text-sm sm:text-base"
// //                   />
// //                   {formData.genderInput && (
// //                     <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
// //                   )}
// //                 </div>
// //               </div>
// //               <div className="w-full sm:w-1/2">
// //                 <label
// //                   htmlFor="maritalInput"
// //                   className="text-[#16730F] text-sm sm:text-[15px] font-medium block mb-1"
// //                 >
// //                   MARITAL
// //                 </label>
// //                 <div className="relative">
// //                   <input
// //                     list="maritalStatuses"
// //                     id="maritalInput"
// //                     name="maritalInput"
// //                     value={formData.maritalInput}
// //                     onChange={handleChange}
// //                     className="w-full rounded-xl px-4 py-2 sm:py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#16730F] bg-white text-gray-800 text-sm sm:text-base"
// //                     placeholder="Enter or select"
// //                   />
// //                   {formData.maritalInput && (
// //                     <FaCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg" />
// //                   )}
// //                   <datalist id="maritalStatuses">
// //                     <option value="Single">Single</option>
// //                     <option value="Married">Married</option>
// //                     <option value="Divorced">Divorced</option>
// //                     <option value="Widowed">Widowed</option>
// //                     <option value="Separated">Separated</option>
// //                   </datalist>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Search Button */}
// //           <div className="mt-6 sm:mt-10">
// //             <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#16730F] px-6 py-2 sm:py-3 rounded-2xl mx-auto text-white font-medium hover:bg-[#125a0c] transition-colors">
// //               Search
// //               <svg
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 className="h-5 w-5"
// //                 viewBox="0 0 20 20"
// //                 fill="currentColor"
// //               >
// //                 <path
// //                   fillRule="evenodd"
// //                   d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
// //                   clipRule="evenodd"
// //                 />
// //               </svg>
// //             </button>
// //           </div>
// //         </div>
// //       </div>




      
// //       {/* <div className="w-3xl m-auto px-6 py-6 bg-[#F5F5F5] mt-2 ">
                  
// //          <div className="max-w-3xl mx-auto rounded-2xl p-4 sm:p-6 bg-white shadow-sm">
         
// //                    <div className="relative w-full sm:w-[300px] md:w-[400px] m-auto">
// //                      <input
// //                        type="text"
// //                        placeholder="Search"
                    
// //                        className="w-full border-2 border-[#16730F] p-2 pl-4 rounded-2xl focus:outline-none"
// //                      />
// //                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
// //                        <FaSearch className="text-[#1A3E32] h-5 w-5" />
// //                      </span>
// //                    </div>   

// //                </div>
// //         <div className="max-w-3xl mx-auto my-4 border-t-2 border-[#16730F]" />  
      
// //         <div className="max-w-3xl mx-auto rounded-2xl p-4 sm:p-6 bg-white shadow-sm space-y-4">
// //         <p className="text-[#1A3E32] font-semibold">Connect with people</p>
// //         <div  className="flex space-x-3" >
// //           <button className="bg-[#1A3E32] text-[#FFB547] rounded-2xl p-2 w-36 text-[13px]">Suggestions</button>
// //           <button className="bg-[#1A3E32] text-[#FFB547] rounded-2xl p-2 w-36 text-[13px]">Connect</button>
// //           </div>
// //           <div className="max-w-3xl mx-auto my-4 border-t-2 border-[#16730F]" />  
      

// //   <div className="flex gap-3">
// //     <div >
// //       <img className="w-20 h-20 rounded-full" src="assets/images/eli.jpg" alt="" />
// //     </div>
// //     <div className="">
// //       <p className="text-[14px] font-semibold">John Samuel</p>
// //         <div className="flex space-x-2">
// //           <p>Jobseeker </p>
// //           <p className="text-[#FFB547]">.34</p>
// //           <p className="text-[#FFB547]">connections</p>
// //         </div>
// //         <button className="bg-[#16730F] text-[#FFFFFF] w-40 flex items-center justify-center space-x-1 p-2 rounded-3xl"><img src="/assets/images/repeate-one.svg" alt="" /><p>Connect</p></button>
// //     </div>
// //     </div>
// //      <div className="w-full border-t-2 border-[#E0E0E0] mb-4"></div>
      
// //   <div className="flex gap-3">
// //     <div >
// //       <img className="w-20 h-20 rounded-full" src="assets/images/eli.jpg" alt="" />
// //     </div>
// //     <div className="">
// //       <p className="text-[14px] font-semibold">John Samuel</p>
// //         <div className="flex space-x-2">
// //           <p>Jobseeker </p>
// //           <p className="text-[#FFB547]">.34</p>
// //           <p className="text-[#FFB547]">connections</p>
// //         </div>
// //         <button className="bg-[#16730F] text-[#FFFFFF] w-40 flex items-center justify-center space-x-1 p-2 rounded-3xl"><img src="/assets/images/repeate-one.svg" alt="" /><p>Connect</p></button>
// //     </div>
// //     </div>
// //      <div className="w-full border-t-2 border-[#E0E0E0] mb-4"></div>
      
// //   <div className="flex gap-3">
// //     <div >
// //       <img className="w-20 h-20 rounded-full" src="assets/images/eli.jpg" alt="" />
// //     </div>
// //     <div className="">
// //       <p className="text-[14px] font-semibold">John Samuel</p>
// //         <div className="flex space-x-2">
// //           <p>Jobseeker </p>
// //           <p className="text-[#FFB547]">.34</p>
// //           <p className="text-[#FFB547]">connections</p>
// //         </div>
// //         <button className="bg-[#16730F] text-[#FFFFFF] w-40 flex items-center justify-center space-x-1 p-2 rounded-3xl"><img src="/assets/images/repeate-one.svg" alt="" /><p>Connect</p></button>
// //     </div>
// //     </div>
// //      <div className="w-full border-t-2 border-[#E0E0E0] mb-4"></div>
      
// //   <div className="flex gap-3">
// //     <div >
// //       <img className="w-20 h-20 rounded-full" src="assets/images/eli.jpg" alt="" />
// //     </div>
// //     <div className="">
// //       <p className="text-[14px] font-semibold">John Samuel</p>
// //         <div className="flex space-x-2">
// //           <p>Jobseeker </p>
// //           <p className="text-[#FFB547]">.34</p>
// //           <p className="text-[#FFB547]">connections</p>
// //         </div>
// //         <button className="bg-[#16730F] text-[#FFFFFF] w-40 flex items-center justify-center space-x-1 p-2 rounded-3xl"><img src="/assets/images/repeate-one.svg" alt="" /><p>Connect</p></button>
// //     </div>
// //     </div>
// //      <div className="w-full border-t-2 border-[#E0E0E0] mb-4"></div>
      
// //   <div className="flex gap-3">
// //     <div >
// //       <img className="w-20 h-20 rounded-full" src="assets/images/eli.jpg" alt="" />
// //     </div>
// //     <div className="">
// //       <p className="text-[14px] font-semibold">John Samuel</p>
// //         <div className="flex space-x-2">
// //           <p>Jobseeker </p>
// //           <p className="text-[#FFB547]">.34</p>
// //           <p className="text-[#FFB547]">connections</p>
// //         </div>
// //         <button className="bg-[#16730F] text-[#FFFFFF] w-40 flex items-center justify-center space-x-1 p-2 rounded-3xl"><img src="/assets/images/repeate-one.svg" alt="" /><p>Connect</p></button>
// //     </div>
// //     </div>
// //      <div className="w-full border-t-2 border-[#E0E0E0] mb-4"></div>
      
// //   <div className="flex gap-3">
// //     <div >
// //       <img className="w-20 h-20 rounded-full" src="assets/images/eli.jpg" alt="" />
// //     </div>
// //     <div className="">
// //       <p className="text-[14px] font-semibold">John Samuel</p>
// //         <div className="flex space-x-2">
// //           <p>Jobseeker </p>
// //           <p className="text-[#FFB547]">.34</p>
// //           <p className="text-[#FFB547]">connections</p>
// //         </div>
// //         <button className="bg-[#16730F] text-[#FFFFFF] w-40 flex items-center justify-center space-x-1 p-2 rounded-3xl"><img src="/assets/images/repeate-one.svg" alt="" /><p>Connect</p></button>
// //     </div>
// //     </div>
// //      <div className="w-full border-t-2 border-[#E0E0E0] mb-4"></div>
      
// //   <div className="flex gap-3">
// //     <div >
// //       <img className="w-20 h-20 rounded-full" src="assets/images/eli.jpg" alt="" />
// //     </div>
// //     <div className="">
// //       <p className="text-[14px] font-semibold">John Samuel</p>
// //         <div className="flex space-x-2">
// //           <p>Jobseeker </p>
// //           <p className="text-[#FFB547]">.34</p>
// //           <p className="text-[#FFB547]">connections</p>
// //         </div>
// //         <button className="bg-[#16730F] text-[#FFFFFF] w-40 flex items-center justify-center space-x-1 p-2 rounded-3xl"><img src="/assets/images/repeate-one.svg" alt="" /><p>Connect</p></button>
// //     </div>
// //     </div>
// //      <div className="w-full border-t-2 border-[#E0E0E0] mb-4"></div>
      
// //   <div className="flex gap-3">
// //     <div >
// //       <img className="w-20 h-20 rounded-full" src="assets/images/eli.jpg" alt="" />
// //     </div>
// //     <div className="">
// //       <p className="text-[14px] font-semibold">John Samuel</p>
// //         <div className="flex space-x-2">
// //           <p>Jobseeker </p>
// //           <p className="text-[#FFB547]">.34</p>
// //           <p className="text-[#FFB547]">connections</p>
// //         </div>
// //         <button className="bg-[#16730F] text-[#FFFFFF] w-40 flex items-center justify-center space-x-1 p-2 rounded-3xl"><img src="/assets/images/repeate-one.svg" alt="" /><p>Connect</p></button>
// //     </div>
// //     </div>
// //      <div className="w-full border-t-2 border-[#E0E0E0] mb-4"></div>
      
      
// //         </div>

// //         </div> */}



// //     </div>
// //   );
// // };

// // export default Recruitment;


































// import React, { useState } from "react";
// import NewsFeedHeader from "../../components/NewsFeedHeader";
// import RecruitmentForm from "../../components/RecruitmentForm";
// import SearchCriteriaBlock from "./SearchCriteriarBlock";

// const Recruitment = () => {
//    const [showResults, setShowResults] = useState(false);
//      const [showResults, setShowResults] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [formData, setFormData] = useState({
//     jobInput: "",
//     industryInput: "",
//     countryInput: "",
//     stateInput: "",
//     workTypeInput: "",
//     salaryInput: "",
//     currencyInput: "",
//     remoteInput: "",
//     availabilityInput: "",
//     educationInput: "",
//     skillInput: "",
//     tribeInput: "",
//     ageInput: "",
//     genderInput: "",
//     maritalInput: "",
//   });



//    const handleSearch = () => {
//     setShowResults(true); // Show results when search is clicked
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//    const handleViewProfile = () => {
//     setShowProfile(true);
//     setShowThirdColumn(true); // Show third column when view profile is clicked
//   };
//   const groupedInputs = [
//     {
//       label: "JOB TITLE",
//       id: "jobInput",
//       options: ["Software Engineer", "Product Designer", "Data Analyst", "Project Manager", "Marketing Specialist"]
//     },
//     {
//       label: "INDUSTRY",
//       id: "industryInput",
//       options: ["Technology", "Healthcare", "Finance", "Education", "Retail"]
//     },
//     {
//       label: "PREFERRED COUNTRY",
//       id: "countryInput",
//       options: ["United States", "United Kingdom", "Canada", "Germany", "Australia"]
//     },
//     {
//       label: "PREFERRED STATE",
//       id: "stateInput",
//       options: ["California", "Texas", "New York", "Florida", "Illinois"]
//     },
//     {
//       label: "WORK TYPE",
//       id: "workTypeInput",
//       options: ["Full-time", "Part-time", "Contract", "Freelance", "Remote"]
//     },
//     {
//       label: "SALARY",
//       id: "salaryInput",
//     },
//     {
//       label: "CURRENCY",
//       id: "currencyInput",
//       options: ["USD", "EUR", "GBP", "JPY", "CAD"]
//     },
//     {
//       label: "REMOTE REFERENCE",
//       id: "remoteInput",
//     },
//     {
//       label: "AVAILABILITY",
//       id: "availabilityInput",
//       options: ["Immediately", "1-2 weeks", "1 month", "2 months", "3+ months"]
//     },
//     {
//       label: "EDUCATION",
//       id: "educationInput",
//       options: ["High School", "Associate Degree", "Bachelor's Degree", "Master's Degree", "PhD"]
//     },
//     {
//       label: "SKILL",
//       id: "skillInput",
//       options: ["JavaScript", "React", "Node.js", "Python", "SQL"]
//     },
//     {
//       label: "TRIBE",
//       id: "tribeInput",
//     },
//     {
//       label: "AGE",
//       id: "ageInput",
//       options: ["18-24", "25-34", "35-44", "45-54", "55+"]
//     },
//     {
//       label: "GENDER",
//       id: "genderInput",
//     },
//     {
//       label: "MARITAL",
//       id: "maritalInput",
//       options: ["Single", "Married", "Divorced", "Widowed", "Separated"]
//     },
//   ];

//   return (
//     <div>
//       <NewsFeedHeader />
    
// <div className="grid grid-cols-[1fr_2fr_1fr] gap-4">
//   {showResults &&(  <div className="bg-red-500">

//   <div className="bg-[#1A3E32] w-[400px] p-5 rounded-2xl shadow-lg">
      
//         <div className="text-center p-5">
//           <p className="text-[#6B8E23] text-[20px] font-semibold">Search Result</p>
//           <p className="text-[#828282]">5 Candidates found</p>
//         </div> 
        
//         <div className="bg-[#556B1F] h-1"></div>
    
//         <div className="flex justify-between   mt-12 p-2">
        
//           <div className="relative">
//             <div className=" rounded-full w-[120px] h-[120px] overflow-hidden">
//               <img
//                 src="assets/images/eli.jpg"
//                 alt="Osakwe Prisca profile"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//              <span className="absolute w-4 h-4 bg-[#6B8E23] rounded-full border-2 border-white top-24 left-24 "></span>
//           </div>
          
//            <div className="ml-4 flex-1 space-y-2">
          
//             <div>
//               <p className="text-[#6B8E23] text-2xl font-medium">Osakwe Prisca</p>
//               <p className="text-[#6B8E23] text-sm">Jobseeker</p>
//             </div>
            
          
//             <div>
//               <p className="text-[#6B8E23] text-xl font-medium">Graphics Designer</p>
//               <p className="text-[#6B8E23] text-sm">Lagos, Nigeria</p>
//             </div>
            
           
//             <div className="space-y-2 mt-3">
//               <button className="bg-[#556B1F] hover:bg-[#6B8E23] transition-colors p-2 w-full rounded-3xl text-white font-medium">
//                 View Profile
//               </button>
//               <button className="border-2 border-[#6B8E23] hover:bg-[#6B8E23]/10 p-2 w-full rounded-3xl text-[#6B8E23] font-medium">
//                 Invite for interview
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="bg-[#556B1F] h-1 mt-4"></div>
        
   
//         <div className="flex justify-between   mt-12 p-2">
//           <div className="relative">
//             <div className=" rounded-full w-[120px] h-[120px] overflow-hidden">
//               <img
//                 src="assets/images/eli.jpg"
//                 alt="Osakwe Prisca profile"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//              <span className="absolute w-4 h-4 bg-[#828282] rounded-full border-2 border-white top-24 left-24 "></span>
//           </div>
          
//            <div className="ml-4 flex-1 space-y-2">
//              <div>
//               <p className="text-[#6B8E23] text-2xl font-medium">Osakwe Prisca</p>
//               <p className="text-[#6B8E23] text-sm">Jobseeker</p>
//             </div>
            
//              <div>
//               <p className="text-[#6B8E23] text-xl font-medium">Graphics Designer</p>
//               <p className="text-[#6B8E23] text-sm">Lagos, Nigeria</p>
//             </div>
            
//              <div className="space-y-2 mt-3">
//               <button className="bg-[#556B1F] hover:bg-[#6B8E23] transition-colors p-2 w-full rounded-3xl text-white font-medium">
//                 View Profile
//               </button>
//               <button className="border-2 border-[#6B8E23] hover:bg-[#6B8E23]/10 p-2 w-full rounded-3xl text-[#6B8E23] font-medium">
//                 Invite for interview
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="bg-[#556B1F] h-1 mt-4"></div>
        
//         <div className="flex justify-between   mt-12 p-2">
//            <div className="relative">
//             <div className=" rounded-full w-[120px] h-[120px] overflow-hidden">
//               <img
//                 src="assets/images/eli.jpg"
//                 alt="Osakwe Prisca profile"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//              <span className="absolute w-4 h-4 bg-[#6B8E23] rounded-full border-2 border-white top-24 left-24 "></span>
//           </div>
          
//           <div className="ml-4 flex-1 space-y-2">
//             <div>
//               <p className="text-[#6B8E23] text-2xl font-medium">Osakwe Prisca</p>
//               <p className="text-[#6B8E23] text-sm">Jobseeker</p>
//             </div>
            
//              <div>
//               <p className="text-[#6B8E23] text-xl font-medium">Graphics Designer</p>
//               <p className="text-[#6B8E23] text-sm">Lagos, Nigeria</p>
//             </div>
            
//     <div className="space-y-2 mt-3">
//               <button className="bg-[#556B1F] hover:bg-[#6B8E23] transition-colors p-2 w-full rounded-3xl text-white font-medium">
//                 View Profile
//               </button>
//               <button className="border-2 border-[#6B8E23] hover:bg-[#6B8E23]/10 p-2 w-full rounded-3xl text-[#6B8E23] font-medium">
//                 Invite for interview
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="bg-[#556B1F] h-1 mt-4"></div>
        
//         <div className="flex justify-between   mt-12 p-2">
//            <div className="relative">
//             <div className=" rounded-full w-[120px] h-[120px] overflow-hidden">
//               <img
//                 src="assets/images/eli.jpg"
//                 alt="Osakwe Prisca profile"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//              <span className="absolute w-4 h-4 bg-[#828282] rounded-full border-2 border-white top-24 left-24 "></span>
//           </div>
          
//            <div className="ml-4 flex-1 space-y-2">
//              <div>
//               <p className="text-[#6B8E23] text-2xl font-medium">Osakwe Prisca</p>
//               <p className="text-[#6B8E23] text-sm">Jobseeker</p>
//             </div>
            
//              <div>
//               <p className="text-[#6B8E23] text-xl font-medium">Graphics Designer</p>
//               <p className="text-[#6B8E23] text-sm">Lagos, Nigeria</p>
//             </div>
            
//              <div className="space-y-2 mt-3">
//               <button className="bg-[#556B1F] hover:bg-[#6B8E23] transition-colors p-2 w-full rounded-3xl text-white font-medium">
//                 View Profile
//               </button>
//               <button className="border-2 border-[#6B8E23] hover:bg-[#6B8E23]/10 p-2 w-full rounded-3xl text-[#6B8E23] font-medium">
//                 Invite for interview
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//   </div>)}






//   <div className="bg-blue-500">
//  <div className="w-3xl m-auto px-6 py-6 bg-[#F5F5F5] mt-2">
//         <div className="max-w-3xl mx-auto rounded-2xl p-4 sm:p-6 bg-white shadow-sm">
//           <p className="text-xl sm:text-2xl font-medium text-[#16730F] text-center">Search Criteria</p>
//         </div>
//         <div className="max-w-3xl mx-auto my-4 border-t-2 border-[#16730F]" />
//         <div className="max-w-3xl mx-auto rounded-2xl p-4 sm:p-6 bg-white shadow-sm space-y-4">
//           {groupedInputs.map(({ label, id, options }) => (
//             <RecruitmentForm
//               key={id}
//               label={label}
//               id={id}
//               name={id}
//               value={formData[id]}
//               onChange={handleChange}
//               placeholder="Enter or select"
//               datalistId={options ? `${id}-list` : undefined}
//               options={options}
//             />
//           ))}
//           <div className="mt-6 sm:mt-10">
//             <button
//             onClick={handleSearch}
//             className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#16730F] px-6 py-2 sm:py-3 rounded-2xl mx-auto text-white font-medium hover:bg-[#125a0c] transition-colors">
//               Search
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//   </div>


//      {showThirdColumn && showProfile && <SearchCriteriaBlock/>}
 
//   <div className="bg-green-500">3</div>















// </div>




//     </div>
//   );
// };

// export default Recruitment;

