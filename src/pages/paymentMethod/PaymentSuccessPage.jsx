import React from "react";
import Header from "../../components/Header";

export default function PaymentSuccess() {
  return (
    <div className="bg-white">
      <header className="bg-[#F5F5F5] w-full relative z-50 p-3.5">
        <Header />
      </header>

      <div className="flex flex-col items-center justify-center mt-12 text-center text-[#1A3E32]">
        <img
          src="/assets/images/verified.png"
          alt="Payment Successful"
          className="w-24 h-24 mb-9" />
        <p className=" font-semibold text-[32px]">Payment Successful!</p>
        <p className="font-medium italic text-[14px] mb-8">Your account has been funded and your selected plan is now active. <br />You can now access the advanced search engine and begin recruiting.</p>
        <button className="bg-[#16730F] text-white font-medium text-[16px] py-3 w-60 sm:w-md rounded-3xl cursor-pointer">Continue to Use Advanced Search</button>
      </div>
    </div>

  )
}