import { Outlet, useLocation } from "react-router-dom";

const stepMap = {
  "/coporate/basic-details": 1,
  "/coporate/profile-setup": 2,
  "/coporate/company-details": 3,
  "/coporate/location": 4,
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
