// import React, { useState } from "react";
// import { FaArrowAltCircleLeft, FaArrowLeft } from "react-icons/fa";
// import { FaArrowRightArrowLeft } from "react-icons/fa6";
// import { useNavigate, useOutletContext } from "react-router-dom";

// const Bio = () => {
//   const countries = [
//     "Nigeria",
//     "United States",
//     "Canada",
//     "United Kingdom",
//     "Germany",
//     "France",
//     "India",
//     "China",
//     "South Africa",
//     "Brazil",
//     "Australia",
//     "Italy",
//     "Japan",
//     "Kenya",
//     "Mexico",
//     "Netherlands",
//     "Russia",
//     "Spain",
//     "Sweden",
//   ];

//   const [imagePreview, setImagePreview] = useState(null);

//   function handleImageChange(e) {
//     const file = e.target.files[0];
//     if (file) {
//       setImagePreview(URL.createObjectURL(file));
//     }
//   }

//   const [formData, setFormData] = useState({
//     nickname: "",
//     phone: "",
//     gender: "",
//     maritalStatus: "",
//     age: "",
//     country: "",
//     street: "",
//     city: "",
//     tribe: "",
//     zip: "",
//     bio: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const isFormComplete =
//     Object.values(formData).every((val) => val.trim() !== "") && imagePreview;

//   const navigate = useNavigate();

//   const { currentStep } = useOutletContext();

//   const steps = [
//     "Bio",
//     "Education",
//     "Skills",
//     "Work history",
//     "Certificate",
//     "Links",
//   ];

//   return (
//     <div className="bg-green-700">
//       <div className="w-full px-4 py-6 flex items-center max-w-screen-xl mx-auto">
//         <img src="/assets/images/logo.png" alt="logo" className="h-10" />
//       </div>

//       <div className="max-w-3xl bg-yellow-500 flex justify-between items-center m-auto mt-[5%]">
//         {steps.map((step, i) => (
//           <button
//             key={step}
//             className={`p-3 font-semibold rounded-[8px] text-white ${
//               i + 1 <= currentStep
//                 ? "bg-[#E63357] border-4 border-[#E63357] shadow-[#00000040]"
//                 : "bg-[#FF3C6140]"
//             }`}
//             onClick={() => {
//               /* optionally navigate if previous step completed */
//             }}
//           >
//             {step}
//           </button>
//         ))}
//       </div>

//       <div className="max-w-3xl m-auto bg-green-600 mt-[2%] py-6">
//         <div className="relative w-full h-1 bg-[#E0E0E0] rounded-full">
//           {/* Filled bar based on currentStep */}
//           <div
//             className="absolute top-0 left-0 h-1 bg-[#E63357] rounded-full transition-all duration-300"
//             style={{ width: `${((currentStep - 1 / 2) / 5) * 100}%` }} // 5 steps between 6 dots
//           ></div>

//           {/* Step Numbers */}
//           <div className="absolute top-[-14px] w-full flex justify-between px-1">
//             {[1, 2, 3, 4, 5, 6].map((num) => (
//               <div
//                 key={num}
//                 className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center transition-all duration-300 ${
//                   num <= currentStep
//                     ? "bg-[#E63357] text-white"
//                     : "bg-[#FF3C6140] text-white"
//                 }`}
//               >
//                 {num}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className=" w-3xl m-auto w-3x1 text-[#E63357] text-2xl font-semibold mt-[2%]">
//         <p>Bio/Personal Information</p>
//       </div>

//       <div className="bg-yellow-800 w-3xl m-auto text-[#333333] text-[15px]">
//         <p>Tell us who you are. This is the first impression employers get.</p>
//       </div>

//       <div className="w-4xl border-2 border-[#E0E0E0] h-[420px] m-auto mt-[3%] flex justify-center gap-8 ">
//         <div className="bg-yellow-400 w-48 text-center mt-[5%] ">
//           <div className="flex items-center bg-red-500 w-40 justify-center m-auto  ">
//             <label className="w-32 h-32 bg-[#000000] rounded-full flex flex-col items-center justify-center text-white cursor-pointer">
//               {imagePreview ? (
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   className="w-full h-full object-cover rounded-full"
//                 />
//               ) : (
//                 <span className="text-sm font-medium mb-2 text-center">
//                   Upload <br /> your image
//                 </span>
//               )}

//               <input
//                 type="file"
//                 className="hidden"
//                 onChange={handleImageChange}
//               />
//             </label>
//           </div>
//           <div className="m-auto bg-white text-[#000000] w-[100px] text-[10px] text-center font-medium">
//             <p>Accepted Format png,jpeg max file; 100kb</p>
//           </div>

//           <div className="m-auto">
//             <input
//               name="bio"
//               value={formData.bio}
//               onChange={handleChange}
//               type="text"
//               placeholder="Write short Bio about yourselfI"
//               className="w-44 bg-[#F5F5F5] text-center h-28 font-medium text-[10px]"
//             />
//           </div>
//         </div>

//         <div className="bg-[#82828280] space-y-1">
//           <div className="bg-[#82828280] w-[580px] h-24 rounded-2xl flex items-center justify-center">
//             <div className=" flex justify-center gap-5 space-y-3">
//               <div className=" text-[12px]">
//                 <p>NICKNAME</p>
//                 <input
//                   name="nickname"
//                   value={formData.nickname}
//                   onChange={handleChange}
//                   type="text"
//                   placeholder="e.g ndcreations "
//                   className="w-[279px] h-10 border-2 border-[#F5F5F5] rounded-[10px] p-3"
//                 />
//               </div>
//               <div className=" text-[12px]">
//                 <p>PHONE NUMBER</p>
//                 <input
//                   type="text"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   placeholder="e.g +234706004000"
//                   className=" w-[226px] h-10 border-2 border-[#F5F5F5] rounded-[10px] p-3"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="bg-[#82828280] w-[580px] h-24 rounded-2xl flex items-center justify-center">
//             <div className="flex justify-center gap-5">
//               {/* Gender Dropdown */}
//               <div className="w-44 text-[12px]">
//                 <p className="mb-1">GENDER</p>
//                 <select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   className="w-[179px] h-10 border-2 border-[#F5F5F5] rounded-[10px] text-center text-sm placeholder-gray-400"
//                 >
//                   <option value="" disabled>
//                     Select
//                   </option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>

//               {/* Marital Status Dropdown */}
//               <div className="w-44 text-[12px]">
//                 <p className="mb-1">MARITAL STATUS</p>

//                 <select
//                   name="maritalStatus"
//                   value={formData.maritalStatus}
//                   onChange={handleChange}
//                   className="w-[179px] h-10 border-2 border-[#F5F5F5] rounded-[10px] text-center text-sm placeholder-gray-400"
//                 >
//                   <option value="" disabled selected>
//                     Select
//                   </option>
//                   <option value="single">Single</option>
//                   <option value="married">Married</option>
//                   <option value="divorced">Divorced</option>
//                   <option value="widowed">Widowed</option>
//                 </select>
//               </div>

//               {/* Age Calendar Input */}
//               <div className="w-32 text-[12px]">
//                 <p className="mb-1">AGE</p>
//                 <input
//                   name="age"
//                   value={formData.age}
//                   onChange={handleChange}
//                   type="date"
//                   className="w-32 h-10 border-2 border-[#F5F5F5] rounded-[10px] text-center text-sm text-gray-700"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="bg-[#82828280] w-[580px] h-24 rounded-2xl flex items-center justify-center">
//             <div className="bg-[#82828280] flex justify-center gap-5 space-y-3">
//               <div className="bg-[#82828280] w-[179px] text-[12px]">
//                 <p className="mb-1">COUNTRY</p>
//                 <select
//                   name="country"
//                   value={formData.country}
//                   onChange={handleChange}
//                   className="w-full h-10 border-2 border-[#F5F5F5] rounded-[10px] text-center text-sm text-gray-700"
//                 >
//                   <option value="">Select</option>
//                   {countries.map((c, idx) => (
//                     <option key={idx} value={c}>
//                       {c}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="bg-[#82828280]  text-[12px]">
//                 <p>STREET ADDRESS</p>
//                 <input
//                   name="street"
//                   value={formData.street}
//                   onChange={handleChange}
//                   type="text"
//                   placeholder="e.g 11, Bawo street."
//                   className=" w-[322px] h-10 border-2 border-[#F5F5F5] rounded-[10px] p-3"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="bg-[#82828280] w-[580px] h-24 rounded-2xl flex items-center justify-center">
//             <div className="bg-[#82828280] flex justify-center gap-5 space-y-3">
//               <div className="bg-[#82828280]  text-[12px]">
//                 <p>CITY/TOWN</p>
//                 <input
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   type="text"
//                   placeholder="e.g Calabar"
//                   className=" w-[179px] h-10 border-2 border-[#F5F5F5] rounded-[10px] p-3"
//                 />
//               </div>
//               <div className="bg-[#82828280]  text-[12px]">
//                 <p>TRIBE</p>
//                 <input
//                   name="tribe"
//                   value={formData.tribe}
//                   onChange={handleChange}
//                   type="text"
//                   placeholder="Enter your tribe"
//                   className=" w-[179px] h-10 border-2 border-[#F5F5F5] rounded-[10px] p-3"
//                 />
//               </div>
//               <div className="bg-[#82828280]  text-[12px]">
//                 <p>ZIP CODE</p>
//                 <input
//                   name="zip"
//                   value={formData.zip}
//                   onChange={handleChange}
//                   type="text"
//                   placeholder="e.g 60094"
//                   className=" w-[126px] h-10 border-2 border-[#F5F5F5] rounded-[10px] p-3"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className=" w-3xl  m-auto items-center flex justify-between mt-[5%]">
//         <div className="flex justify-between w-24 bg-white items-center">
//           <FaArrowLeft />
//           <div>
//             <a className="decoration-solid" href="">
//               Go back
//             </a>
//           </div>
//         </div>

//         <button
//           className={`w-[107px] ${
//             isFormComplete
//               ? "bg-[#E63357]"
//               : "bg-[#FF3C6140] cursor-not-allowed"
//           } rounded-2xl h-9 text-center text-white text-[14px]`}
//           disabled={!isFormComplete}
//           onClick={() => {
//             if (isFormComplete) {
//               // navigate or do something
//               navigate("/education");
//             }
//           }}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Bio;












// import React, { useState } from "react";
// import { FaArrowAltCircleLeft, FaArrowLeft } from "react-icons/fa";
// import { FaArrowRightArrowLeft } from "react-icons/fa6";
// import { useNavigate, useOutletContext } from "react-router-dom";

// const Bio = () => {
//   const countries = [
//     "Nigeria",
//     "United States",
//     "Canada",
//     "United Kingdom",
//     "Germany",
//     "France",
//     "India",
//     "China",
//     "South Africa",
//     "Brazil",
//     "Australia",
//     "Italy",
//     "Japan",
//     "Kenya",
//     "Mexico",
//     "Netherlands",
//     "Russia",
//     "Spain",
//     "Sweden",
//   ];

//   const [imagePreview, setImagePreview] = useState(null);

//   function handleImageChange(e) {
//     const file = e.target.files[0];
//     if (file) {
//       setImagePreview(URL.createObjectURL(file));
//     }
//   }

//   const [formData, setFormData] = useState({
//     nickname: "",
//     phone: "",
//     gender: "",
//     maritalStatus: "",
//     age: "",
//     country: "",
//     street: "",
//     city: "",
//     tribe: "",
//     zip: "",
//     bio: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const isFormComplete =
//     Object.values(formData).every((val) => val.trim() !== "") && imagePreview;

//   const navigate = useNavigate();

//   const { currentStep } = useOutletContext();

//   const steps = [
//     "Bio",
//     "Education",
//     "Skills",
//     "Work history",
//     "Certificate",
//     "Links",
//   ];

//   return (
//     <div className="bg-green-700">
//       <div className="w-full px-4 py-6 flex items-center max-w-screen-xl mx-auto">
//         <img src="/assets/images/logo.png" alt="logo" className="h-10" />
//       </div>

//       <div className="max-w-3xl bg-yellow-500 flex flex-wrap justify-between items-center m-auto mt-[5%] p-1">
//         {steps.map((step, i) => (
//           <button
//             key={step}
//             className={`p-2 font-semibold rounded-[8px] text-white ${
//               i + 1 <= currentStep
//                 ? "bg-[#E63357] border-4 border-[#E63357] shadow-[#00000040]"
//                 : "bg-[#FF3C6140]"
//             }`}
//             onClick={() => {
           
//             }}
//           >
//             {step}
//           </button>
//         ))}
//       </div>

//       <div className="max-w-3xl m-auto bg-green-600 mt-[2%] py-6 px-4">
//         <div className="relative w-full h-1 bg-[#E0E0E0] rounded-full">
//           <div
//             className="absolute top-0 left-0 h-1 bg-[#E63357] rounded-full transition-all duration-300"
//             style={{ width: `${((currentStep - 1 / 2) / 5) * 100}%` }}
//           ></div>

//           <div className="absolute top-[-14px] w-full flex justify-between px-1">
//             {[1, 2, 3, 4, 5, 6].map((num) => (
//               <div
//                 key={num}
//                 className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center transition-all duration-300 ${
//                   num <= currentStep
//                     ? "bg-[#E63357] text-white"
//                     : "bg-[#FF3C6140] text-white"
//                 }`}
//               >
//                 {num}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="max-w-3xl m-auto text-[#E63357] text-2xl font-semibold mt-[2%] px-4">
//         <p>Bio/Personal Information</p>
//       </div>

//       <div className="max-w-3xl m-auto text-[#333333] text-[15px] px-4">
//         <p>Tell us who you are. This is the first impression employers get.</p>
//       </div>

//       <div className="max-w-4xl border-2 border-[#E0E0E0] m-auto mt-[3%] flex flex-col lg:flex-row justify-center gap-8 p-4">
//         <div className="bg-yellow-400 w-full lg:w-48 text-center mt-[5%]">
//           <div className="flex items-center bg-red-500 w-full lg:w-40 justify-center m-auto">
//             <label className="w-32 h-32 bg-[#000000] rounded-full flex flex-col items-center justify-center text-white cursor-pointer">
//               {imagePreview ? (
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   className="w-full h-full object-cover rounded-full"
//                 />
//               ) : (
//                 <span className="text-sm font-medium mb-2 text-center">
//                   Upload <br /> your image
//                 </span>
//               )}
//               <input type="file" className="hidden" onChange={handleImageChange} />
//             </label>
//           </div>
//           <div className="m-auto bg-white text-[#000000] w-[100px] text-[10px] text-center font-medium">
//             <p>Accepted Format png,jpeg max file; 100kb</p>
//           </div>
//           <div className="m-auto">
//             <input
//               name="bio"
//               value={formData.bio}
//               onChange={handleChange}
//               type="text"
//               placeholder="Write short Bio about yourselfI"
//               className="w-full lg:w-44 bg-[#F5F5F5] text-center h-28 font-medium text-[10px]"
//             />
//           </div>
//         </div>

//         <div className="bg-[#82828280] space-y-1 w-full">
//           <div className="bg-[#82828280] w-full h-auto rounded-2xl flex flex-wrap items-center justify-center gap-4 p-2">
//             <div className="text-[12px] w-full sm:w-[279px]">
//               <p>NICKNAME</p>
//               <input
//                 name="nickname"
//                 value={formData.nickname}
//                 onChange={handleChange}
//                 type="text"
//                 placeholder="e.g ndcreations "
//                 className="w-full h-10 border-2 border-[#F5F5F5] rounded-[10px] p-3"
//               />
//             </div>
//             <div className="text-[12px] w-full sm:w-[226px]">
//               <p>PHONE NUMBER</p>
//               <input
//                 type="text"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="e.g +234706004000"
//                 className="w-full h-10 border-2 border-[#F5F5F5] rounded-[10px] p-3"
//               />
//             </div>
//           </div>

//           <div className="bg-[#82828280] w-full rounded-2xl flex flex-wrap items-center justify-center gap-4 p-2">
//             <div className="w-full sm:w-44 text-[12px]">
//               <p className="mb-1">GENDER</p>
//               <select
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 className="w-full h-10 border-2 border-[#F5F5F5] rounded-[10px] text-center text-sm"
//               >
//                 <option value="" disabled>Select</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>

//             <div className="w-full sm:w-44 text-[12px]">
//               <p className="mb-1">MARITAL STATUS</p>
//               <select
//                 name="maritalStatus"
//                 value={formData.maritalStatus}
//                 onChange={handleChange}
//                 className="w-full h-10 border-2 border-[#F5F5F5] rounded-[10px] text-center text-sm"
//               >
//                 <option value="" disabled>Select</option>
//                 <option value="single">Single</option>
//                 <option value="married">Married</option>
//                 <option value="divorced">Divorced</option>
//                 <option value="widowed">Widowed</option>
//               </select>
//             </div>

//             <div className="w-full sm:w-32 text-[12px]">
//               <p className="mb-1">AGE</p>
//               <input
//                 name="age"
//                 value={formData.age}
//                 onChange={handleChange}
//                 type="date"
//                 className="w-full h-10 border-2 border-[#F5F5F5] rounded-[10px] text-center text-sm"
//               />
//             </div>
//           </div>

//           <div className="bg-[#82828280] w-full rounded-2xl flex flex-wrap items-center justify-center gap-4 p-2">
//             <div className="w-full sm:w-[179px] text-[12px]">
//               <p className="mb-1">COUNTRY</p>
//               <select
//                 name="country"
//                 value={formData.country}
//                 onChange={handleChange}
//                 className="w-full h-10 border-2 border-[#F5F5F5] rounded-[10px] text-center text-sm"
//               >
//                 <option value="">Select</option>
//                 {countries.map((c, idx) => (
//                   <option key={idx} value={c}>{c}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="text-[12px] w-full sm:w-[322px]">
//               <p>STREET ADDRESS</p>
//               <input
//                 name="street"
//                 value={formData.street}
//                 onChange={handleChange}
//                 type="text"
//                 placeholder="e.g 11, Bawo street."
//                 className="w-full h-10 border-2 border-[#F5F5F5] rounded-[10px] p-3"
//               />
//             </div>
//           </div>

//           <div className="bg-[#82828280] w-full rounded-2xl flex flex-wrap items-center justify-center gap-4 p-2">
//             <div className="text-[12px] w-full sm:w-[179px]">
//               <p>CITY/TOWN</p>
//               <input
//                 name="city"
//                 value={formData.city}
//                 onChange={handleChange}
//                 type="text"
//                 placeholder="e.g Calabar"
//                 className="w-full h-10 border-2 border-[#F5F5F5] rounded-[10px] p-3"
//               />
//             </div>
//             <div className="text-[12px] w-full sm:w-[179px]">
//               <p>TRIBE</p>
//               <input
//                 name="tribe"
//                 value={formData.tribe}
//                 onChange={handleChange}
//                 type="text"
//                 placeholder="Enter your tribe"
//                 className="w-full h-10 border-2 border-[#F5F5F5] rounded-[10px] p-3"
//               />
//             </div>
//             <div className="text-[12px] w-full sm:w-[126px]">
//               <p>ZIP CODE</p>
//               <input
//                 name="zip"
//                 value={formData.zip}
//                 onChange={handleChange}
//                 type="text"
//                 placeholder="e.g 60094"
//                 className="w-full h-10 border-2 border-[#F5F5F5] rounded-[10px] p-3"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center mt-[5%] px-4 gap-4 mb-[1%] bg-blue-600">
//         <div className="flex justify-center w-full sm:w-2xs bg-red-500 items-center px-2 py-1 rounded">
//           <FaArrowLeft />
//           <a className="decoration-solid" href="">Go back</a>
//         </div>

//         <button
//           className={`w-full sm:w-[107px]  ${
//             isFormComplete
//               ? "bg-[#E63357]"
//               : "bg-[#FF3C6140] cursor-not-allowed"
//           } rounded-2xl h-9 text-center text-white text-[14px]`}
//           disabled={!isFormComplete}
//           onClick={() => {
//             if (isFormComplete) {
//               navigate("/education");
//             }
//           }}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Bio;

















import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import StepTabs from '../components/StepTabs';
import ProgressBar from '../components/ProgressBar';
import ImageUpload from '../components/ImageUpload';
import FieldGroup from '../components/FieldGroup';
import NavigationButtons from '../components/NavigationButtons';

const Bio = () => {
  const navigate = useNavigate();
  const { currentStep } = useOutletContext();
  const steps = ["Bio", "Education", "Skills", "Work history", "Certificate", "Links"];

  const countries = [
    "Nigeria", "United States", "Canada", "United Kingdom", "Germany", "France",
    "India", "China", "South Africa", "Brazil", "Australia", "Italy", "Japan",
    "Kenya", "Mexico", "Netherlands", "Russia", "Spain", "Sweden",
  ];
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    nickname: "", phone: "", gender: "", maritalStatus: "",
    age: "", country: "", street: "", city: "", tribe: "", zip: "", bio: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const isFormComplete = Object.values(formData).every((v) => v.trim() !== "") && imagePreview;

  return (
    <div className="bg-white">
      <header className="w-full px-4 py-6 flex items-center max-w-screen-xl mx-auto">
        <img src="/assets/images/logo.png" alt="logo" className="h-10" />
      </header>

      <StepTabs steps={steps} currentStep={currentStep} />
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

      <section className="max-w-3xl mx-auto px-4 mt-4 text-[#E63357] text-2xl font-semibold">
        Bio/Personal Information
      </section>
      <p className="max-w-3xl mx-auto px-4 text-[#333] text-[15px]">
        Tell us who you are. This is the first impression employers get.
      </p>

      <div className="max-w-4xl mx-auto mt-6 border-2 border-[#E0E0E0] flex flex-col lg:flex-row gap-8 p-4">
        <ImageUpload
          imagePreview={imagePreview}
          handleImageChange={handleImageChange}
          bio={formData.bio}
          onBioChange={handleChange}
        />

        <FieldGroup
          formData={formData}
          handleChange={handleChange}
          countries={countries}
        />
      </div>

      <NavigationButtons
        isFormComplete={isFormComplete}
        onBack={() => navigate(-1)}
        onNext={() => isFormComplete && navigate("/education")}
      />
    </div>
  );
};

export default Bio;
