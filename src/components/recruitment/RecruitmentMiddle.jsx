
import React from "react";

export default function RecruitmentMiddle() {
  return (
    <main className="w-full px-4 py-6 space-y-8 bg-[#F5F5F5]">
      
      <div className="max-w-3xl mx-auto rounded-2xl p-6 bg-white shadow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <img src="assets/images/eli.jpg" alt="profile" className="rounded-full w-[60px] h-[60px]" />
          <input
            placeholder="Share something"
            className="flex-1 w-full p-3 pl-4 border-2 border-[#16730F] rounded-xl focus:outline-none"
          />
          <div className="flex relative right-20  items-center space-x-1">
            <img src="assets/images/box-2.svg" alt="drafts" className="w-3 h-3" />
            <p className="text-[10px]">Draft</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-5 gap-4 px-2">
          <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
            {[
              { img: "gallery.svg", label: "Image" },
              { img: "video-square.png", label: "Video" },
              { img: "Amount_Icon_UIA.svg", label: "Poll" },
            ].map(({ img, label }) => (
              <div key={label} className="flex items-center gap-1">
                <img src={`/assets/images/${img}`} alt={label} />
                <p className="text-[#1A3E32] text-sm">{label}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/images/public-icon.svg" alt="Public" />
            <select className="text-sm rounded-md border px-2 py-1 text-[#1A3E32]">
              <option value="public">Public</option>
            </select>
          </div>
        </div>
      </div>

      <hr className="border-t-2 border-[#16730F]" />
      <div className="bg-white p-6 max-w-3xl mx-auto rounded-2xl shadow space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <img src="assets/images/eli.jpg" alt="profile" className="rounded-full w-[60px] h-[60px]" />
            <div>
              <p className="font-semibold text-lg text-[#16730F]">Osakwe Prisca</p>
              <p className="text-[#1A3E32] text-[8px] text-sm">Posted 12 minutes ago</p>
            </div>
          </div>
          <img src="/assets/images/more.svg" alt="more" className="w-4 h-4" />
        </div>

        <p className="text-[11px]">🚀 HIRING JUST GOT SMARTER | WELCOME TO BEJITE.COM....</p>
        <p className="text-[#16730F80] text-sm cursor-pointer">See more</p>

        <img src="assets/images/bejiteAdvert.png" alt="Advert" className="w-full rounded-xl" />

        <div className="flex flex-wrap justify-between items-center gap-4">
          {["Like", "Comment", "Saved"].map((label) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <img src={`/assets/images/${label === "Like" ? "gallery.svg" : label === "Comment" ? "video-square.png" : "Amount_Icon_UIA.svg"}`} alt={label} />
              <p className="text-[#1A3E32] text-sm">{label}</p>
            </div>
          ))}
          <div className="flex flex-col items-center">
            <img src="/assets/images/public-icon.svg" alt="Share" />
            <p className="text-sm">Share</p>
          </div>
        </div>
      </div>
    </main>
  );
}
