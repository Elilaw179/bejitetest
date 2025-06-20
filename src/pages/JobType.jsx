// import Header from "../components/Header";
// import StepTabs from "../components/StepTabs";
// import ProgressBar from "../components/ProgressBar";
// import { useNavigate } from "react-router-dom";
// import NavigationButtons from "../components/NavigationButtons";

// function JobType() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen py-4 px-2 sm:px-4">
//       <Header />
//       <p className="max-w-3xl mx-auto font-medium text-[#E63357] text-center text-2xl ">
//         Almost there
//       </p>
//       <div className="max-w-3xl mx-auto  text-[#E63357] text-3xl text-center font-semibold">
//         <p> What type of job do you want</p>
//       </div>
//       <p className="max-w-3xl mx-auto text-[#000000] text-sm font-light mt-5 mb-7 text-center">
//         Tell us exactly what you're looking for, so the right employers can find
//         you faster. Our Advanced Search Engine (ASE) uses your preferences to
//         match you with your ideal job by industry, salary, location, and more.
//       </p>

//       <div className="max-w-full md:max-w-4xl mx-auto border-2 border-[#E0E0E0] p-4">
//         <div className="bg-[#82828280] flex justify-between w-full max-w-4xl mx-auto p-5 rounded-2xl">
//           <div>
//             <p className="text-[12px] font-semibold mb-1">JOB TITLE</p>
//             <select className="w-[400px] text-[#33333380] text-sm p-3 rounded-[10px] border-[#F5F5F5] border-2">
//               <option className="" value="">
//                 Enter your job
//               </option>
//               <option value="">Select</option>
//             </select>
//           </div>
//           <div>
//             <p className="text-[12px] font-semibold  mb-1">INDUSTRY / SECTOR</p>
//             <select className="w-[400px] p-3 text-[#33333380] text-sm rounded-[10px] border-[#F5F5F5] border-2">
//               <option className="text-[#33333380]" value="">
//                 Enter sector
//               </option>
//               <option value="">Select</option>
//             </select>
//           </div>
//         </div>



//         <div className="bg-[#82828280] mt-1 flex justify-between w-full max-w-4xl mx-auto p-5 rounded-2xl">
//           <div>
//             <p className="text-[12px] font-semibold  mb-1">
//               PREFERRED COUNTRY{" "}
//             </p>
//             <select className="w-[290px] text-[#33333380] text-sm p-3 rounded-[10px] border-[#F5F5F5] border-2">
//               <option className="" value="">
//                 Select
//               </option>
//               <option value="">Select</option>
//             </select>
//           </div>

//           <div>
//             <p className="text-[12px] font-semibold  mb-1">PREFERRED STATE</p>
//             <select className="w-[290px] p-3 text-[#33333380] text-sm rounded-[10px] border-[#F5F5F5] border-2">
//               <option className="text-[#33333380]" value="">
//                 Select
//               </option>
//               <option value="">Select</option>
//             </select>
//           </div>

//           <div>
//             <p className="text-[12px] font-semibold  mb-1">WORK TYPE</p>
//             <select className="w-[200px] p-3 text-[#33333380] text-sm rounded-[10px] border-[#F5F5F5] border-2">
//               <option className="text-[#33333380]" value="">
//                 Select
//               </option>
//               <option value="">Select</option>
//             </select>
//           </div>
          
//         </div>






//         <div className="bg-[#82828280] mt-1 flex justify-between w-full max-w-4xl mx-auto p-5 rounded-2xl">
       
//        <div className="flex ">

//    <div className="w-[170px]">
//             <p className="text-[12px] font-semibold  mb-1 w-[200px]">
//               EXPECTED SALARY
//             </p>
//            <input type="text" className="w-[150px] text-[#33333380] text-sm p-3 rounded-[10px] border-[#F5F5F5] border-2" placeholder="Enter salary"
//              />
//           </div>

//           <div>
//             <p className="text-[12px] font-semibold  mb-1">CURRENCY</p>
//             <select className="w-[110px] p-3 text-[#33333380] text-sm rounded-[10px] border-[#F5F5F5] border-2">
//               <option className="text-[#33333380]" value="">
//                 Select
//               </option>
//               <option value="">Select</option>
//             </select>
//           </div>

//        </div>

//           <div>
//             <p className="text-[12px] font-semibold  mb-1">REMOTE PREFERRENCE</p>
//             <select className="w-[230px] p-3 text-[#33333380] text-sm rounded-[10px] border-[#F5F5F5] border-2">
//               <option className="text-[#33333380]" value="">
//                 Select
//               </option>
//               <option value="">Select</option>
//             </select>
//           </div>
//           <div>
//             <p className="text-[12px] font-semibold  mb-1">AVAILABILITY</p>
//             <select className="w-[230px] p-3 text-[#33333380] text-sm rounded-[10px] border-[#F5F5F5] border-2">
//               <option className="text-[#33333380]" value="">
//                 Select
//               </option>
//               <option value="">Select</option>
//             </select>
//           </div>
//         </div>
//       </div>

//        <NavigationButtons
//         // isFormComplete={allFilled}
//         // onBack={() => navigate(-1)}
//         // onNext={() => allFilled && navigate("/job-type")}
//       /> 
//     </div>
//   );
// }

// export default JobType;










import { useState } from "react";
import Header from "../components/Header";
import NavigationButtons from "../components/NavigationButtons";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

function JobType() {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [statePref, setStatePref] = useState("");
  const [workType, setWorkType] = useState("");
  const [salary, setSalary] = useState("");
  const [currency, setCurrency] = useState("");
  const [remotePref, setRemotePref] = useState("");
  const [availability, setAvailability] = useState("");

  const allFilled = [
    jobTitle,
    industry,
    country,
    statePref,
    workType,
    salary,
    currency,
    remotePref,
    availability,
  ].every((val) => val.trim() !== "");

  const InputWithIcon = ({ showIcon, children }) => (
    <div className="relative w-full">
      {children}
      {showIcon && (
        <FiCheckCircle className="absolute right-3 top-3 text-green-500 text-lg pointer-events-none" />
      )}
    </div>
  );

  const selectClass = (filled) =>
    `select-with-check appearance-none ${filled ? "filled" : ""} w-full text-[#33333380] text-sm p-3 pr-10 rounded-[10px] border-[#F5F5F5] border-2`;

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4">
      <Header />
      <p className="max-w-3xl mx-auto font-medium text-[#E63357] text-center text-2xl">
        Almost there
      </p>
      <div className="max-w-3xl mx-auto text-[#E63357] text-3xl text-center font-semibold">
        <p> What type of job do you want</p>
      </div>
      <p className="max-w-3xl mx-auto text-[#000000] text-sm font-light mt-5 mb-7 text-center">
        Tell us exactly what you're looking for, so the right employers can find
        you faster. Our Advanced Search Engine (ASE) uses your preferences to
        match you with your ideal job by industry, salary, location, and more.
      </p>

      <div className="max-w-full md:max-w-4xl mx-auto border-2 border-[#E0E0E0] p-4 space-y-2">
        <div className="bg-[#82828280] flex flex-wrap gap-4 justify-between p-5 rounded-2xl">
          <div className="w-full md:w-[48%]">
            <p className="text-[12px] font-semibold mb-1">JOB TITLE</p>
            <InputWithIcon showIcon={!!jobTitle}>
              <select
                className={selectClass(!!jobTitle)}
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              >
                <option value="">Enter your job</option>
                <option value="Developer">Developer</option>
              </select>
            </InputWithIcon>
          </div>

          <div className="w-full md:w-[48%]">
            <p className="text-[12px] font-semibold mb-1">INDUSTRY / SECTOR</p>
            <InputWithIcon showIcon={!!industry}>
              <select
                className={selectClass(!!industry)}
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="">Enter sector</option>
                <option value="Tech">Tech</option>
              </select>
            </InputWithIcon>
          </div>
        </div>

        <div className="bg-[#82828280] flex flex-wrap gap-4 justify-between p-5 rounded-2xl">
          <div className="w-full md:w-[31%]">
            <p className="text-[12px] font-semibold mb-1">PREFERRED COUNTRY</p>
            <InputWithIcon showIcon={!!country}>
              <select
                className={selectClass(!!country)}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Select</option>
                <option value="USA">USA</option>
              </select>
            </InputWithIcon>
          </div>

          <div className="w-full md:w-[31%]">
            <p className="text-[12px] font-semibold mb-1">PREFERRED STATE</p>
            <InputWithIcon showIcon={!!statePref}>
              <select
                className={selectClass(!!statePref)}
                value={statePref}
                onChange={(e) => setStatePref(e.target.value)}
              >
                <option value="">Select</option>
                <option value="California">California</option>
              </select>
            </InputWithIcon>
          </div>

          <div className="w-full md:w-[31%]">
            <p className="text-[12px] font-semibold mb-1">WORK TYPE</p>
            <InputWithIcon showIcon={!!workType}>
              <select
                className={selectClass(!!workType)}
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Remote">Remote</option>
              </select>
            </InputWithIcon>
          </div>
        </div>

        <div className="bg-[#82828280] flex flex-wrap gap-4 justify-between p-5 rounded-2xl">
          <div className="flex flex-wrap gap-4 w-full md:w-[65%]">
            <div className="w-full md:w-[60%]">
              <p className="text-[12px] font-semibold mb-1">EXPECTED SALARY</p>
              <InputWithIcon showIcon={!!salary}>
                <input
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full text-[#33333380] text-sm p-3 pr-10 rounded-[10px] border-[#F5F5F5] border-2"
                  placeholder="Enter salary"
                />
              </InputWithIcon>
            </div>

            <div className="w-full md:w-[35%]">
              <p className="text-[12px] font-semibold mb-1">CURRENCY</p>
              <InputWithIcon showIcon={!!currency}>
                <select
                  className={selectClass(!!currency)}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="USD">USD</option>
                </select>
              </InputWithIcon>
            </div>
          </div>

          <div className="w-full md:w-[30%]">
            <p className="text-[12px] font-semibold mb-1">REMOTE PREFERENCE</p>
            <InputWithIcon showIcon={!!remotePref}>
              <select
                className={selectClass(!!remotePref)}
                value={remotePref}
                onChange={(e) => setRemotePref(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
              </select>
            </InputWithIcon>
          </div>

          <div className="w-full md:w-[30%]">
            <p className="text-[12px] font-semibold mb-1">AVAILABILITY</p>
            <InputWithIcon showIcon={!!availability}>
              <select
                className={selectClass(!!availability)}
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Immediately">Immediately</option>
              </select>
            </InputWithIcon>
          </div>
        </div>
      </div>

      <NavigationButtons
        isFormComplete={allFilled}
        onBack={() => navigate(-1)}
        onNext={() => allFilled && navigate("/next-page")}
      />
    </div>
  );
}

export default JobType;
