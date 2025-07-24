import React from 'react';
const StepTabs = ({ steps, currentStep }) => (
  <div className="max-w-3xl flex flex-wrap justify-center sm:justify-between items-center mx-auto mt-[5%] gap-2 p-2">
    {steps.map((step, i) => (
      <button
        key={step}
        className={`px-4 py-2 font-semibold rounded-[8px] text-white shadow-md ${
          i + 1 <= currentStep
            ? "bg-[#16730F] shadow-[#00000040]"
            : "bg-[#1A3E3240]"
        }`}
      >
        {step}
      </button>
    ))}
  </div>
);

export default StepTabs;

