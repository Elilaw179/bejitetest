import React from "react";
import AboutPageHeader from "../../components/AboutPageHeader";

export default function SecurityAdvice() {
  const greenStyle = 'text-[#16730F] font-bold'
  const hyperlinkStyle = 'text-[#E09A36] underline'
  const marginStyle = 'mt-5 mb-5'
  return (
    <>
      <AboutPageHeader headerText="SECURITY ADVICE" />
      <main className="bg-white font-semibold p-6">
        <p className={`${greenStyle} ${marginStyle} text-xl`}>Bejite Security Advice</p>
        <div className="text-xs sm:text-sm text-[#1A3E32]">
          <p><a href="https://www.bejite.com" target="_blank" className={hyperlinkStyle}>Bejite.com</a> is a platform that connects jobseekers and employers. We are not a recruitment agency, labor consultant, or employment partner of any organization. Rather, Bejite serves as a public platform utilized by a wide range of recruiters, placement agencies, and corporate employers.<br />To maintain a safe and trustworthy environment for all users, every employer must accept and abide by our Terms and Conditions, which include strict measures to detect and prevent fraud and misuse.</p>
          <p className={marginStyle}><span className={greenStyle}>Stay Alert: Avoid Recruitment Scams</span> <br />Unfortunately, some individuals may attempt to misuse platforms like Bejite by sending fake job offers or conducting fraudulent interviews in order to collect personal information or money from unsuspecting users. <br />If we receive reports or complaints of suspicious messages, impersonations, or employers requesting payments, we immediately investigate and may suspend or permanently block the offender's access.</p>
          <p className="text-[#EB5757] font-bold">Red Flags to Watch For</p>
          <p>Be cautious of employers or recruiters who:</p>
          <ul className="list-disc pl-5">
            <li>Request sensitive personal details like bank or card information via phone, chat, or email.</li>
            <li>Fail to provide verifiable contact or business information.</li>
            <li>Ask for money for job placement, registration, training, or recruitment processes.</li>
            <li>Promise visas, travel documents, or overseas employment in exchange for payment.</li>
          </ul>
          <p className="mt-5">Before responding to such messages:</p>
          <ul className="list-disc pl-5 mb-5">
            <li>Conduct independent research about the employer.</li>
            <li>Verify their business registration and online presence.</li>
            <li>Visit physical addresses with a trusted companion when necessary.</li>
            <li>Be skeptical of free email domains (e.g. Gmail, Yahoo) being used for official communication.</li>
          </ul>
          <p className={greenStyle}>Note:</p>
          <p>Bejite does not endorse any employer who engages in fraudulent communication or activity, which is a direct violation of our terms of service.</p>
          <p className={`${greenStyle} mt-5`}>Reporting Suspicious Activity</p>
          <p>If you receive a suspicious message or job offer:</p>
          <ol className="list-decimal pl-5 mb-5 mt-5">
            <li>Use the “Report” button immediately.</li>
            <li>Use the “Block” button to prevent further contact.</li>
            <li>You may also email us at <a href="mailto:complaint@bejite.com" target="_blank" className={hyperlinkStyle}>complaint@bejite.com</a>
            </li>
          </ol>
          <p>We are committed to ensuring that your job search on Bejite remains secure, professional, and fraud-free.</p>
          <p className={`${greenStyle} mt-5`}>Understand Online Scams:</p>
          <p className={greenStyle}>Phishing vs. Spoofing</p>
          <p className="mt-5"> <span className={greenStyle}>Phishing</span> <br />Phishing refers to fake emails or links designed to trick you into revealing login credentials or personal data. These messages often direct you to counterfeit login pages that capture your details or ask you to download harmful files.</p>
          <p className={marginStyle}>&#128274; Bejite will never ask you to download software or provide personal details through external links. <br /> Learn more: <a href="https://www.antiphishing.org/resources/overview" target="_blank" className={hyperlinkStyle}>www.antiphishing.org/resources/overview</a>
          </p>
          <p className={marginStyle}><span className={greenStyle}>Spoofing</span> <br />Spoofing involves sending fake emails that appear to come from reputable companies. They may contain job offers, financial requests, or misleading attachments.</p>
          <p>Always check for:</p>
          <ul className="list-disc pl-5 mb-5">
            <li>Mismatch between email domain and company name.</li>
            <li>Lack of full contact details.</li>
            <li>Overseas offers with minimal verification.</li>
            <li>Unsolicited job offers that ask for payment</li>
          </ul>
          <p className={greenStyle}>Tips to Verify Employer Authenticity</p>
          <p>Before engaging further, consider these checks:</p>
          <ul className="list-disc pl-5 mb-5">
            <li>Have you heard of the company before?</li>
            <li>Does the company have a verified website and physical address?</li>
            <li>Does the recruiter use a professional company email domain? (e.g. hr@xyzgroup.com vs xyzgroup@gmail.com)</li>
            <li>Are they asking you to visit a private residence? Proceed with caution and bring someone along.</li>
            <li>Does the company request payment for interviews, visas, or job offers?</li>
            <li>Search online for reviews or scam alerts related to the company.</li>
            <li>Be extra cautious with offers from high-risk regions or involving vague job descriptions.</li>
          </ul>
          <p className={greenStyle}>In Summary</p>
          <p>Bejite is committed to creating a safe and empowering job search experience for everyone. While we actively monitor and respond to fraudulent activity, your vigilance and quick reporting help protect others too. <br />If in doubt, don't engage—report instead. <br />Together, we can build a trustworthy and transparent job marketplace.</p>
        </div>
      </main>
    </>
  )

}




