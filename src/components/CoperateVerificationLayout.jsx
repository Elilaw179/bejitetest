import { Outlet, useLocation } from "react-router-dom";

const stepMap = {
  "/coperate/basic-details": 1,
  "/coperate/profile-setup": 2,
  "/coperate/company-details": 3,
  "/coperate/location": 4,
};

const CoperateVerificationLayout = () => {
  const location = useLocation();
  const currentStep = stepMap[location.pathname] || 1;

  return (   
    <>
      <Outlet context={{ currentStep }} />
    </>
  );
};

export default CoperateVerificationLayout;
