import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';

export default function Hyperlinks() {
  const borderStyle = 'w-0.5 h-4 bg-[#1A3E32]'

  return (
    <div className="text-[10px] font-extrabold text-[#1A3E32] flex flex-col items-center mt-2 p-2">
      <div className='grid grid-flow-col gap-2'>
        <Link to="/about">About</Link>
        <div className={borderStyle}></div>
        <Link to="/Teams">Team</Link>
        <div className={borderStyle}></div>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <div className={borderStyle}></div>
        <HashLink to="/about#how-to-use-bejite">How to use Bejite</HashLink>
        <div className={borderStyle}></div>
        <Link to="/security-advice">Security</Link>
        <div className={borderStyle}></div>
        <Link to="/contact">Contact</Link>
      </div>
      <p>All rights reserved Bejite © 2025</p>
    </div>
  )
}