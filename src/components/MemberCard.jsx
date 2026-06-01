import React from "react";
import InfoBox from "./InfoBox";

const MemberCard = ({
  label,
  iconSrc,
  infoText,
  position,
  showInfo,
  setShowInfo,
  containerRef,
  onClick,
}) => {
  const handleClick = () => {
    console.log("🧩 MemberCard clicked:", label);
    if (onClick) onClick();
  };

  const handleInfoClick = (e) => {
    e.stopPropagation();
    setShowInfo((prev) => !prev);
  };

  return (
    <div className="w-[90%] sm:w-[270px] h-auto relative text-center">
      <img
        onClick={handleClick}
        className="m-auto cursor-pointer"
        src={iconSrc}
        alt={label}
      />
      <div 
        onClick={handleClick}
        className="mt-5 relative bg-[#16730F] shadow-2xl rounded-2xl py-3 flex justify-center items-center gap-2"
      >
        <p className="text-white text-sm sm:text-base font-medium">{label}</p>
        <div ref={containerRef} className="relative" onClick={(e) => e.stopPropagation()}>
          {showInfo && <InfoBox text={infoText} position={position} />}
          <img
            src="/assets/images/questiontag.svg"
            alt="info"
            className="w-5 h-5 cursor-pointer"
            onClick={handleInfoClick}
          />
        </div>
      </div>
    </div>
  );
};

export default MemberCard;