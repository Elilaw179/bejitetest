import React from 'react';

const StepTabs = ({ steps, currentStep }) => (
  <div className="max-w-3xl flex flex-wrap justify-between items-center mx-auto mt-[5%] p-1">
    {steps.map((step, i) => (
      <button
        key={step}
        className={`p-2 font-semibold rounded-[8px] text-white mt-2 ${
          i + 1 <= currentStep
            ? "bg-[#E63357]  border-[#E63357] shadow-[#00000040]"
            : "bg-[#FF3C6140]"
        }`}
      >
        {step}
      </button>
    ))}
  </div>
);

export default StepTabs;
