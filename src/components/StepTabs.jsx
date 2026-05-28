import React from 'react';
const StepTabs = ({ steps, currentStep, onStepClick, getPath, isEditMode = false }) => (
  <div className="max-w-3xl flex flex-wrap justify-center sm:justify-between items-center mx-auto mt-[5%] gap-2 p-2">
    {steps.map((step, i) => {
      const stepNumber = i + 1;
      const isCompleted = stepNumber < currentStep;
      const isCurrent = stepNumber === currentStep;
      const isFuture = stepNumber > currentStep;
      const isClickable = onStepClick && isEditMode; // Only clickable in edit mode

      return (
        <button
          key={step}
          onClick={() => {
            if (isClickable) {
              if (getPath) {
                // If getPath is provided, use it for navigation
                const path = getPath(stepNumber);
                if (path) {
                  onStepClick(path);
                }
              } else {
                // Otherwise, pass the step number
                onStepClick(stepNumber);
              }
            }
          }}
          disabled={!isClickable}
          className={`px-4 py-2 font-semibold rounded-[8px] text-white shadow-md transition-colors ${
            isCompleted
              ? "bg-[#16730F] shadow-[#00000040] hover:bg-[#145a0c] cursor-pointer text-white"
              : isCurrent
              ? "bg-[#2A4E42] hover:bg-[#3A5E52] cursor-pointer text-white"
              : isFuture
              ? "bg-[#1A3E32] hover:bg-[#2A4E42] cursor-pointer text-white"
              : "bg-[#1A3E3240] cursor-not-allowed text-white"
          }`}
        >
          {step}
        </button>
      );
    })}
  </div>
);

export default StepTabs;

