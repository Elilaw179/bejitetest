import { Outlet, useLocation } from "react-router-dom";
import useSyncProfilePhoto from "../hooks/useSyncProfilePhoto";

const stepMap = {
  "/individual/basic-details": 1,
  "/individual/profile-setup": 2,
  "/individual/location": 3,
  "/individual/verify": 4,
  "/individual/selectid": 5,
  "/individual/upload": 6,
};

const IndividualVerificationLayout = () => {
  useSyncProfilePhoto();
  const location = useLocation();
  const currentStep = stepMap[location.pathname] || 1;
  const isEditMode = false;

  const getPath = (step) => {
    const paths = [
      "/individual/basic-details",
      "/individual/profile-setup",
      "/individual/location",
      "/individual/verify",
      "/individual/selectid",
      "/individual/upload",
    ];
    return paths[step - 1];
  };

  return (
    <>
      <Outlet context={{ currentStep, isEditMode, getPath }} />
    </>
  );
};

export default IndividualVerificationLayout;
