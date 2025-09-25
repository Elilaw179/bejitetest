import React from "react";
import AboutPageHeader from "../components/AboutPageHeader";

export default function About() {
  const marginStyle = 'mt-5 mb-5'
  const coloredText = 'text-[#16730F] mt-5 mb-5'
  return (
    <>
      <AboutPageHeader headerText="ABOUT US" />
      <main className="bg-white">
        <div className="bg-[#1A3E32] m-6 rounded-2xl flex justify-center">
          <img src="/Bejite-icon.svg" alt=""
            className="h-50" />
        </div>
        <div className="text-[#1A3E32] font-semibold m-8 text-xs sm:text-sm">
          <p>Bejite is an authority in job sourcing and helps millions of job seekers and employers find the right fit every day. At Bejite, you have the rare opportunity of chatting with a prospect/jobseeker/employer and getting hired immediately. The opportunity Bejite gives jobseekers is beyond their wildest dreams as they connect to their favourite employers and other jobseekers to learn, share and network easily. Start hiring now on the world's best job site!</p>
          <p className={coloredText}>Why Post a Job?</p>
          <p>Yes. With bejite.com, you do not have any need to post a job. That will be a waste of your precious time. We aim at filling those vacancies with your first few clicks instead of waiting for 3 months to fill an important vacancy.</p>
          <p className={coloredText}>The right fit for your jobs</p>
          <p className={marginStyle}>Millions of people visit bejite.com every month, giving you access to the best talents in every field.</p>
          <p className={coloredText}>On desktop</p>
          <p className={marginStyle}>Over 80% of job searches are desktop. Our mobile app will be announced in due course.</p>
          <p className={coloredText}>More quality hires</p>
          <p className={marginStyle}>Bejite is the best job site external source of hire and provides twice more hires than any other job site existing on the internet. In fact, bejite is the fastest means of bridging the gap between an employer and an employee in any field, anywhere.</p>
          <p className={coloredText}>How bejite.com helps you hire</p>
          <p className={marginStyle}>Reach the most job seekers today</p>
          <p className={marginStyle}>Create and log in into your account as an employer. Visit the advanced search page and fill in the required fields and qualifications you want your new hire to have. Click search and all the people who met the criteria will appear. Conduct your interview online through our dedicated chat system or simply call them and conduct the physical interview. <br />Most of our users prefer the online chat as the first step of interview. It is easy and FREE! <br />Create an account and enter your job description. Review applications, manage candidates and schedule interviews from your bejite account. It is that simple!</p>
          <p className={marginStyle}>Reach the most Employers today</p>
          <p className={marginStyle}>Create and log in into your account as a jobseeker and follow as many employers as you wish. This will give you the double privileges of having a personal relationship with the employer as well as be in the know of the latest developments in the sector you have chosen to work in. Ensure that you fill-in all the fields in your profile as this will expose you more to employers who may desire your services. You can also connect to other jobseekers to share information and desires.</p>
          <p className={marginStyle}>Create an account and enter your job description. Review applications, manage offers and interviews from your bejite account.</p>
          <p className={marginStyle}>Elevate your Employer and Jobseeker brand</p>
          <p className={marginStyle}>With more than 10 million employer/jobseeker reviews, company/jobseeker pages give people insights into potential employers and jobseekers and help you create a memorable candidate experience. Build your talent brand for free with your Bejite Personal/Company Page.</p>
            <a href="#" className="text-[#E09A36] mt-5 mb-5 underline">
              Get started with Bejite.com
            </a>
          <p className={marginStyle}>Socialize. Hire. Share in 2 minutes!</p>
        </div>
      </main>
    </>
  )
}











