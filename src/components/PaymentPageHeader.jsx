import React from "react";
import { FaChevronLeft } from "react-icons/fa";

export default function PaymentPageHeader() {
  return (
    <header className="bg-[#F5F5F5] w-full relative z-50 p-3.5">
      <div className="max-w-[1440px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-3 sm:gap-4">
        <div className="flex items-center justify-between gap-7 w-full sm:w-auto">
          <img
            src="/assets/images/logo.png"
            alt="Logo"
            className="h-10 md:h-14 lg:h-16"
          />
          <FaChevronLeft
            className="cursor-pointer" />
        </div>
        <div>
          <p>Step 1 of 3</p>
        </div>
      </div>
    </header>
  )
}
