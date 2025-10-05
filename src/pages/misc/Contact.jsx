import React from "react";
import AboutPageHeader from "../../components/AboutPageHeader";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Contact() {
  const inputStyle = 'outline-none border-b-1 w-11/12 mb-5 mt-5 border-[#6B8E23] placeholder-[#6B8E23] text-white'
  const spanStyle = 'bg-[#D9D9D9] w-[35px] h-[35px] rounded-full p-2 cursor-pointer'
  const iconStyle = 'text-[#16730F] w-[20px] h-[20px]'
  return (
    <>
      <AboutPageHeader headerText="CONTACT US" />
      <main className="bg-white">
        <div className="bg-[#1A3E32] w-[300px] sm:w-[450px] h-[350px] m-auto p-7 font-normal rounded-2xl mt-6">
          <p className="text-[#6B8E23]">Send a Message</p>
          <form action="">
            <input
              type="text"
              placeholder="Name"
              className={inputStyle} />
            <br />
            <input
              type="email"
              placeholder="Email address"
              className={inputStyle} />
            <br />
            <textarea
              placeholder="Message"
              className="outline-none resize-none w-11/12 h-25 placeholder-[#6B8E23] text-white"
            >
            </textarea>
            <br />
            <div className="text-center">
              <button type="submit" className="bg-[#6B8E23] w-[170px] p-2 text-white rounded-3xl text-sm cursor-pointer hover:bg-[#6a8e23c9]">Submit</button>
            </div>
          </form>
        </div>
        <div className="w-full border-b-1 border-[#1a3e32a4] p-4"></div>
        <footer className="p-6 flex flex-col sm:flex-row justify-center items-center gap-12">
          <div className="text-sm font-semibold text-[#1A3E32]">
            <p>&#128231; Email:</p>
            <a href="mailto:complaint@bejite.com" className="underline">complaint@bejite.com</a>
            <p className="mt-4">&#128222; Phone:</p>
            <p>+234 806 873 5953</p>
          </div>
          <div>
            <p className="text-[#6B8E23] font-medium text-sm">Follow Us:</p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className={spanStyle}>
                <a href="https://facebook.com" target="_blank">
                  <FaFacebook
                    className={iconStyle} />
                </a>
              </span>
              <span className={spanStyle}>
                <a href="https://x.com" target="_blank">
                  <FaXTwitter
                    className={iconStyle} />
                </a>
              </span>
              <span className={spanStyle}>
                <a href="https://instagram.com" target="_blank">
                  <FaInstagram
                    className={iconStyle} />
                </a>
              </span>
              <span className={spanStyle}>
                <a href="https://linkedin.com" target="_blank">
                  <FaLinkedin
                    className={iconStyle} />
                </a>
              </span>
            </div>

          </div>
        </footer>
      </main>
    </>
  )
}