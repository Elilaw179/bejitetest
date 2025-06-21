import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const NavigationButtons = ({ isFormComplete, onBack, onNext }) => (
  <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center mt-[5%] px-4 gap-4 mb-[7%]">
    <div className="flex justify-center w-full sm:w-auto bg-white items-center px-2 py-1 rounded cursor-pointer" onClick={onBack}>
      <FaArrowLeft />
      <button
       className="ml-1 ">Go back</button>
    </div>

    <button
      className={`w-full sm:w-[107px] ${
        isFormComplete ? "bg-[#E63357]" : "bg-[#FF3C6140] cursor-not-allowed"
      } rounded-2xl h-9 text-center text-white text-[14px]`}
      disabled={!isFormComplete}
      onClick={onNext}
    >
      Next
    </button>
  </div>
);

export default NavigationButtons;






