import React from "react";
import PaymentPageHeader from "../../components/PaymentPageHeader";

const spanStyle = 'bg-white rounded-2xl px-2'
const imgStyle = 'w-10'

export default function PaymentType() {
  return (
    <div className="bg-white">
      <PaymentPageHeader />

      <section className="bg-[#F5F5F5] border border-[#1A3E32] mt-1 max-w-[1000px] h-screen m-auto p-2.5">
        <p className="mt-12 text-2xl font-normal text-center">Choose Payment Type</p>
        <p className="text-base font-normal text-center">How would you like to pay?</p>

        <div className="bg-[#16730F] border-[#1A3E32] border-2 rounded-2xl flex justify-between items-center max-w-[565px] h-[80px] px-3.5 cursor-pointer m-auto mt-20 flex-col py-2.5 md:flex-row">
          <div className="text-[#FFFFFF] font-semibold">Debit/Credit Card</div>
          <div className="flex gap-1.5">
            <span className={spanStyle}>
              <img
                src="/assets/images/paymenticons/visa.svg"
                alt="Visa icon"
                className={imgStyle} />
            </span>

            <span className={spanStyle}>
              <img
                src="/assets/images/paymenticons/mastercard.svg"
                alt="Mastercard icon"
                className={imgStyle} />
            </span>

            <span className={spanStyle}>
              <img
                src="/assets/images/paymenticons/paypal.svg"
                alt="PayPal icon"
                className={imgStyle} />
            </span>

            <span className={spanStyle}>
              <img
                src="/assets/images/paymenticons/google-pay.svg"
                alt="GooglePay icon"
                className={imgStyle} />
            </span>

            <span className={spanStyle}>
              <img
                src="/assets/images/paymenticons/apple-pay.svg"
                alt="ApplePay icon"
                className={imgStyle} />
            </span>
          </div>
        </div>


        <div className="bg-[#16730F] border-[#1A3E32] border-2 rounded-2xl flex justify-between items-center max-w-[565px] h-[80px] px-3.5 cursor-pointer m-auto mt-2.5 flex-col md:flex-row py-2.5">
          <div className="text-[#FFFFFF] font-semibold">Cryptocurrency</div>
          <div className="flex gap-1.5">
            <img
              src="/assets/images/paymenticons/bitcoin.svg"
              alt="Bitcoin icon"
              className="w-10 h-10"
            />

            <img
              src="/assets/images/paymenticons/ethereum.svg"
              alt="Ethereum icon"
              className="w-10 h-10"
            />
            <img
              src="/assets/images/paymenticons/solana.png"
              alt="Solana icon"
              className="w-10 h-10"
            />
          </div>
        </div>

        <p className="text-center text-[#1A3E32] italic font-medium mt-14">Note: All payments are secure and encrypted.</p>
      </section>
    </div>

  )
}