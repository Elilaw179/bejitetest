import { Outlet, useLocation } from "react-router-dom";

const stepMap = {
  "/individual/basic-details": 1,
  "/individual/profile-setup": 2,
  "/individual/location": 3,
};

const IndividualVerificationLayout = () => {


  const location = useLocation();
  const currentStep = stepMap[location.pathname] || 1;

  return (
    <>
      <Outlet context={{ currentStep }} />
    </>
  );
};

export default IndividualVerificationLayout;
