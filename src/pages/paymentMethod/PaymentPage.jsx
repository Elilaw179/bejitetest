import React from "react";
import PaymentPageHeader from "../../components/PaymentPageHeader";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const navigate = useNavigate();

  function handleButtonClick() {
    navigate('/payment-type');
  }

  const styles = {
    box: "bg-white w-[300px] h-[529px] border-1 border-[#1A3E32] px-3.5 py-12",
    paragraph1: "font-normal text-[#16730F] text-2xl",
    paragraph2: "font-medium text-[#1A3E32] text-[12px]",
    paragraph3: "font-medium text-[50px] text-[#1A3E32] mt-5 mb-5",
    span: "font-normal text-[15px]",
    paragraph4: "font-normal text-[#1A3E32] text-[11px]",
    button: "bg-[#16730F] text-white font-medium text-[15px] text-center w-[220px] h-10 py-2.5 mt-5 mb-5 cursor-pointer",
    paragraph5: "font-normal text-[14px] text-[#16730F]",
    listItem: "text-[#1A3E32] text-[9px] font-medium list-disc list-inside mt-2"
  };


  return (
    <div className="bg-white">
      <PaymentPageHeader />

      <section className="bg-[#F5F5F5] border border-[#1A3E32] mt-1 max-w-[1000px] max-h-full m-auto px-4.5 py-3.5">
        <p className="font-fredoka text-[#333333] font-normal text-center text-2xl mt-12">Choose the perfect plan</p>
        <p className="text-center text-[12px]">Unlock Advanced Recruitment With Bejite's Flexible Plans</p>
        <div className="flex flex-col items-center justify-around gap-5 mt-12 lg:flex-row">
          <div className={styles.box}>
            <p className={styles.paragraph1}>Free Plan</p>
            <p className={styles.paragraph2}>First-Time Users: Enjoy 2 <br /> free searches to explore our platform</p>
            <p className={styles.paragraph3}>O<span className={styles.span}>us$</span></p>
            <p className={styles.paragraph4}>Test-drive our AI-powered recruitment engine. <br />Access full candidate profiles and CV.</p>
            <button className={styles.button}>Start Free Trial</button>
            <p className={styles.paragraph5}>Limitations</p>
            <ul className={styles.listItem}>
              <li>
                Free searches expire in 7 days.
              </li>
              <li>
                Maximum 5 candidate views per search.
              </li>
            </ul>
          </div>
          <div className={styles.box}>
            <p className={styles.paragraph1}>Starter Plan</p>
            <p className={styles.paragraph2}>Recruit up to 20 people.</p>
            <p className={styles.paragraph3}>10<span className={styles.span}>us$</span></p>
            <p className={styles.paragraph4}>Ideal for: Small businesses or occasional recruiters.</p>
            <button className={styles.button} onClick={handleButtonClick}>Upgrade</button>
            <p className={styles.paragraph5}>Benefits</p>
            <ul className={styles.listItem}>
              <li>20 Recruitment Slots - Source up to 20 candidates.</li>
              <li>Filters - Access essential search filters (skills, location).</li>
              <li>Candidate Profiles - View full profiles and CV details.</li>
              <li>Email Alerts - Get notified for new matching candidates.</li>
              <li>24/7 Support - Priority email support.</li>
            </ul>
          </div>
          <div className={styles.box}>
            <p className={styles.paragraph1}>Standard Plan</p>
            <p className={styles.paragraph2}>Recruit up to 60 people.</p>
            <p className={styles.paragraph3}>30<span className={styles.span}>us$</span></p>
            <p className={styles.paragraph4}>Ideal for: Growing teams and frequent recruiters.</p>
            <button className={styles.button} onClick={handleButtonClick}>Upgrade</button>
            <p className={styles.paragraph5}>Benefits</p>
            <ul className={styles.listItem}>
              <li>60 Recruitment Slots - Scale your hiring effortlessly.</li>
              <li>Filters - Access essential search filters (skills, location).</li>
              <li>Bulk Messaging - Contact multiple candidates at once.</li>
              <li>Candidate Profiles - View full profiles and CV details.</li>
              <li>Email Alerts - Get notified for new matching candidates.</li>
              <li>24/7 Support - Priority email support.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}