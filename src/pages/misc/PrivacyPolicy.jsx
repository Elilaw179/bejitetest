import React from "react";
import AboutPageHeader from "../../components/AboutPageHeader"; import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  const ulStyle = 'list-disc pl-5'
  const spanStyle = 'text-sm md:text-lg font-semibold'
  const marginStyle = 'mt-5 mb-5'
  return (
    <>
      <AboutPageHeader headerText="PRIVACY POLICY" />
      <main className="bg-white p-6">
        <p className="text-[#16730F] font-bold mt-5 mb-5 text-xl">Bejite Privacy Policy</p>
        <div className="text-xs sm:text-sm font-medium text-[#1A3E32]">
          <p className="mt-5 mb-5">
            Effective Date: 1st May, 2025. Owned and operated by SolPro Innovative Technologies Limited
          </p>
          <ol className="list-decimal pl-5">
            <li className={marginStyle}>
              <span className={spanStyle}>Introduction</span> <br />
              SolPro Innovative Technologies Limited("SolPro") manages <a href="https://www.bejite.com/"  target="_blank" className="text-[#E09A36] underline">www.bejite.com</a>, a platform that connects employers with job seekers globally. <br />This Privacy Policy outlines how we collect, use, store, and disclose your personal information. It applies to all users of the Bejite platform, including:
              <ul className={ulStyle}>
                <li>Employers, employees, job seekers.</li>
                <li>Employment service providers and program participants.</li>
                <li>Contractors, suppliers, consultants, and grant applicants.</li>
                <li>Policy stakeholders, researchers, and competition entrants.</li>
                <li>Individuals whose data is shared with us by third parties</li>
                <li>Current, past, or prospective SolPro or Bejite employees</li>
              </ul>
            </li>
            <li className={marginStyle}>
              <span className={spanStyle}>Purpose of This Policy</span><br />
              This policy aims to:
              <ul className={ulStyle}>
                <li>Describe the types of personal information we collect.</li>
                <li>Explain how we collect, use, store, and disclose this data.</li>
                <li>Clarify your rights regarding your information.</li>
                <li>Ensure compliance with applicable Nigerian privacy laws.</li>
                <li>Inform you of your options for access, correction, or complaints</li>
              </ul>
            </li>
            <li className={marginStyle}>
              <span className={spanStyle}>What We Collect</span> <br />
              Personal information may include:
              <ul className={ulStyle}>
                <li>Name, contact details, address, and photo.</li>
                <li>Identity details(e.g., date of birth, NIN, passport, etc.)</li>
                <li>Employment history, financial records, and education</li>
                <li>Demographic and family - related details</li>
              </ul>
              Sensitive information includes:
              <ul className={ulStyle}>
                <li> Health, genetic, biometric, or disability status.</li>
                <li>Racial, ethnic, political, or religious affiliations.</li>
                <li>Sexual orientation, union memberships, or criminal history</li>
                We only collect sensitive data with your consent or where legally authorized.
              </ul>
            </li>
            <li className={marginStyle}>
              <span className={spanStyle}>How We Collect Your Data</span> <br />
              We collect personal information via:
              <ul className={ulStyle}>
                <li>Online forms, paper - based documents, emails, and phone calls.</li>
                <li>Meetings, events, websites, or social media interactions.</li>
                <li>Third parties(e.g., government bodies, employment agencies)</li>
              </ul>
              You may choose to remain anonymous or use a pseudonym where practical.
            </li>
            <li className={marginStyle}>
              <span className={spanStyle}>Use and Disclosure of Your Information</span><br />
              We use your data to:
              <ul className={ulStyle}>
                <li>Operate and improve our platform.</li>
                <li>Administer programs, manage staff, and provide services.</li>
                <li>Respond to feedback and inquiries.</li>
                <li>Conduct research, analysis, and audits.</li>
              </ul>
              Your data may be disclosed to:
              <ul className={ulStyle}>
                <li>External consultants, researchers, and law enforcement(where required)</li>
                <li>Overseas entities only with your consent or where compliant with law</li>
                <li>Contractors bound by privacy obligations</li>
              </ul>
              We never sell your personal data.
            </li>
            <li className={marginStyle}>
              <span className={spanStyle}>Children and Young People</span><br />
              For individuals under 18, we seek consent from a parent or guardian.Where appropriate, young people over 18 may consent directly.
            </li>
            <li className={marginStyle}>
              <span className={spanStyle}>Storage and <Link to="/security-advice" className="text-[#E09A36] underline">Security</Link></span> <br />
              We store personal information in secure electronic and paper formats, including cloud systems.We apply appropriate safeguards to prevent unauthorized access, loss, or misuse and conduct regular audits to ensure compliance.
            </li>
            <li className={marginStyle}>
              <span className={spanStyle}>Data Quality and Correction</span><br />
              We aim to maintain accurate and up - to - date information.You may request corrections if your data is inaccurate, outdated, or incomplete.
            </li>
            <li className={marginStyle}>
              <span className={spanStyle}>Your Rights</span><br />
              You may:
              <ul className={ulStyle}>
                <li>Request access to the personal information we hold about you.</li>
                <li>Ask for corrections to inaccurate or misleading data.</li>
                <li>Lodge complaints regarding breaches of your privacy</li>
              </ul>
              We will respond within 30 calendar days. If we deny a request, we will provide a written explanation.
            </li>
            <li className={marginStyle}>
              <span className={spanStyle}>Cookies, Analytics & Online Tracking</span><br />
              Our servers log standard visitor information. <br />We use:
              <ul className={ulStyle}>
                <li>Cookies: To enhance your browsing experience; these do not store personal data.</li>
                <li>Google Analytics: To anonymously analyze website usage; data may be stored on servers in the U.S.</li>
              </ul>
              You may disable cookies via your browser settings.
            </li>
            <li className={marginStyle}>
              <span className={spanStyle}>Links to Third - Party Websites</span><br />
              Our website may contain external links. We are not responsible for their content or privacy practices. We recommend reviewing their policies individually.
            </li>
            <li className={marginStyle}>
              <span className={spanStyle}>Email and Electronic Communications</span><br />
              Electronic communication involves risks. When you contact us by email or subscribe to updates, we use your information only for intended purposes.
            </li>
            <li className={marginStyle}>
              <span className={spanStyle}>Third - Party Disclosures</span><br />
              We may disclose data in specific circumstances, such as:
              <ul className={ulStyle}>
                <li>Publications(e.g., reports, media content with consent)</li>
                <li>Overseas research collaborations(with your consent)</li>
                <li>Legal or law enforcement purposes(if authorized)</li>
              </ul>
              We ensure third - party recipients follow privacy protections consistent with Nigerian law.
            </li>
            <li className={marginStyle}>
              <span className={spanStyle}>Breaches and Accidental Disclosures</span><br />
              We take any unauthorized disclosure seriously and follow proper breach - handling protocol. Sanctions may apply to unauthorized disclosures.
            </li>
            <li className={marginStyle}>
              <span className={spanStyle}>Complaints and Enquiries</span><br />
              To request access, corrections, or make a complaint: <br /><br /> &#128231; Email: <a href="mailto:complaint@bejite.com" className="text-[#E09A36] underline">complaint@bejite.com</a>  <br /> &#128222;Phone: +234 806 873 5953 <br /><br />If unsatisfied with our response, you may escalate to the Consumer Protection Council or another authorized oversight body.
            </li>
            <li className={marginStyle}>
              <span className={spanStyle}>Changes to This Policy</span><br />
              This Privacy Policy may be updated periodically. We encourage you to review it regularly for any changes.
            </li>
          </ol>
        </div>
      </main>
    </>

  )
}
