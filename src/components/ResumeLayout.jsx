

import { Outlet, useLocation } from "react-router-dom";

const stepMap = {
  "/bio": 1,
  "/education": 2,
  "/skills": 3,
  "/work-history": 4,
  "/certificate": 5,
  "/links": 6,
};

const FormLayout = () => {
  const location = useLocation();
  const currentStep = stepMap[location.pathname] || 1;

  return (
    <>
      <Outlet context={{ currentStep }} />
    </>
  );
};

export default FormLayout;
