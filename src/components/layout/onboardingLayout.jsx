import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StepTabs from "../StepTabs";
import ProgressBar from "../ProgressBar";
import { Link } from "react-router-dom";

const OnboardingLayout = ({
  children,
  steps,
  currentStep,
  handleStepClick,
  getPath,
  isEditMode,
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname, currentStep]);

  return (
    <header
      style={{ fontFamily: "NunitoSemi" }}
      className="w-full px-4 py-6 font-nunito-semi max-w-screen-xl mx-auto "
    >
      <button
        className=" bg-transparent "
        onClick={() => {
          if (isEditMode) {
            navigate(getPath(currentStep - 1));
          } else {
            navigate(-1);
          }
        }}
      >
        <img
          src="/assets/images/logo.png"
          alt="logo"
          className="h-12 sm:h-16 "
        />
      </button>
      <div className="bg-white">
        {steps && (
          <>
            <StepTabs
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
              getPath={getPath}
              isEditMode={isEditMode}
            />
            <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
          </>
        )}
        {children}
      </div>
    </header>
  );
};

export default OnboardingLayout;
