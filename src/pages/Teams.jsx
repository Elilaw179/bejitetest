import React from "react";
import AboutPageHeader from "../components/AboutPageHeader";
import { teamData } from "../data/teamData";

export default function Teams() {

  const data = teamData.map(member => (
    <div key={member.id} className="flex flex-col items-center">
      <div className="border-[#16730F] border-5 rounded-tl-[40px] border-b-0 w-[248px]">
        <img src={member.image}
          alt={member.name}
          className="w-[248px] h-[286px] object-cover rounded-tl-[35px]"
        />
      </div>
      <div className="relative">
        <div className="bg-[#1A3E32] w-[248px] rounded-br-3xl p-2 relative z-20 text-center">
          <p className="text-white text-sm">{member.name}</p>
          <p className="text-[#FFB547] text-xs">{member.role}</p>
        </div>

        <div className="w-[300px] sm:w-[325px] sm:h-[156px] bg-[#16730F] absolute top-0 -ml-6 sm:-ml-9 text-white text-xs text-center p-3">
          <p className="mt-13">{member.description}</p>
          <a href="#" className="font-extralight italic hover:text-[#FFB547]">
            {member.connect}
          </a>
        </div>
      </div>
    </div>
  ))

  return (
    <>
      <AboutPageHeader headerText="TEAMS" />
      <main className="bg-white p-3 mt-6">
        <p className="font-semibold text-center"><span className="text-[#16730F]">TEAM</span> MEMBERS</p>
        <p className="text-[#1A3E32] text-xs text-center">Behind Bejite is a passionate team of innovators, designers, and problem-solvers committed to reshaping the future of recruitment. We combine industry expertise with creativity and technology to make hiring and job seeking easier, faster, and more rewarding.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 mt-10 gap-y-38 gap-x-8 mb-[100px]">
          {data}
        </div>
      </main>
    </>

  )
}
