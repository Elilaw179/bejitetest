import React from "react";

export default function PaymentProcessing() {
  return (
    <div className="bg-white ">
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="flex items-center justify-center m-auto mb-10 rounded-full w-25 h-25 bg-gradient-to-r from-[#1A3E32] via-[#16730F] to-white">
            <div className="flex items-center justify-center bg-white rounded-full h-23 w-23">
              <img
                src="/assets/images/logo.png"
                alt="Logo"
                className=""
              />
            </div>

          </div>
          <p className="text-2xl font-medium"> Processing Your Payment...</p>
          <p className="font-normal text-[15px]">Please do not refresh or close this page while we confirm your transaction.</p>
        </div>
      </div>

    </div>
  )
}