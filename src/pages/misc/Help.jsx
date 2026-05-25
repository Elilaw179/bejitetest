import React from "react";
import AboutPageHeader from "../../components/AboutPageHeader";
import { Link } from "react-router-dom";

export default function Help() {
  const faqs = [
    {
      q: "How do I reset my password?",
      a: "Go to the login page and click 'Forgot Password'. Enter your email and follow the instructions sent to your inbox."
    },
    {
      q: "How do I update my profile information?",
      a: "Click your profile picture in the top right → 'Edit Profile'. You can update your bio, experience, skills, and photos there."
    },
    {
      q: "How do I connect with other professionals?",
      a: "Visit the Connections page from the sidebar. Search for users and send connection requests. You can also connect directly from profiles."
    },
    {
      q: "How do recruiters find and contact candidates?",
      a: "Recruiters can use the Advanced Candidate Search from the Recruitment section. Filter by skills, location, experience and more."
    },
    {
      q: "How do I apply for jobs on Bejite?",
      a: "Browse jobs in the recruitment feed or search. Click on a job to view details and use the chat feature to express interest directly to the employer."
    },
    {
      q: "What is AdPro / ASE and how do I subscribe?",
      a: "AdPro gives you premium visibility and advanced tools. Go to 'AdPro' in the left sidebar or visit the subscription dashboard under your profile menu."
    },
    {
      q: "How do I report inappropriate content or users?",
      a: "On any profile or post, look for the report option, or contact us directly through the form on the Contact page with details."
    },
    {
      q: "I’m having trouble with payments or subscriptions",
      a: "Visit your ASE Subscription Dashboard or Payment History. If issues persist, reach out via the support form or email us."
    }
  ];

  return (
    <>
      <AboutPageHeader headerText="HELP & SUPPORT" />

      <main className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-10">
          {/* Back to dashboard */}
          <Link
            to="/news-feed"
            className="inline-flex items-center gap-2 bg-[#16730F] text-white text-sm px-4 py-2 rounded-full hover:bg-[#145a0c] transition-colors mb-8"
          >
            ← Back to Dashboard
          </Link>

          {/* Hero */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-semibold text-[#1A3E32]">
              How can we help you?
            </h1>
            <p className="mt-3 text-[#6B8E23] text-lg">
              Find answers to common questions or get in touch with our support team.
            </p>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <Link
              to="/contact"
              className="block p-6 bg-[#F5F5F5] hover:bg-[#E8F5E9] rounded-2xl border border-[#16730F]/20 transition-colors"
            >
              <div className="font-semibold text-[#1A3E32] mb-1">Contact Support</div>
              <p className="text-sm text-[#1A3E32]/70">Send us a message and we’ll get back to you quickly.</p>
            </Link>

            <Link
              to="/profile"
              className="block p-6 bg-[#F5F5F5] hover:bg-[#E8F5E9] rounded-2xl border border-[#16730F]/20 transition-colors"
            >
              <div className="font-semibold text-[#1A3E32] mb-1">Manage Your Account</div>
              <p className="text-sm text-[#1A3E32]/70">Update profile, privacy settings, and preferences.</p>
            </Link>

            <a
              href="mailto:support@bejite.com"
              className="block p-6 bg-[#F5F5F5] hover:bg-[#E8F5E9] rounded-2xl border border-[#16730F]/20 transition-colors"
            >
              <div className="font-semibold text-[#1A3E32] mb-1">Email Us Directly</div>
              <p className="text-sm text-[#1A3E32]/70">support@bejite.com — we typically reply within 24 hours.</p>
            </a>
          </div>

          {/* FAQs */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-[#1A3E32] mb-6">Frequently Asked Questions</h2>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-white border border-[#16730F]/10 rounded-xl px-5 py-4 open:bg-[#F8F9F7]"
                >
                  <summary className="cursor-pointer font-medium text-[#1A3E32] select-none flex justify-between items-center">
                    {faq.q}
                    <span className="text-[#6B8E23] group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-[#1A3E32]/80">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Still need help */}
          <div className="bg-[#1A3E32] rounded-3xl p-8 text-center text-white">
            <p className="text-xl font-semibold mb-2">Still need assistance?</p>
            <p className="text-[#F5F5F5]/80 mb-6 max-w-md mx-auto">
              Our support team is ready to help with account issues, technical problems, or platform questions.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-[#6B8E23] hover:bg-[#5a7a1d] text-white font-medium px-8 py-3 rounded-3xl transition-colors"
              >
                Open Support Ticket
              </Link>

              <a
                href="mailto:support@bejite.com"
                className="inline-flex items-center justify-center border border-white/70 hover:bg-white/10 px-8 py-3 rounded-3xl transition-colors"
              >
                Email support@bejite.com
              </a>
            </div>
          </div>

          <p className="text-center text-xs text-[#1A3E32]/60 mt-10">
            Bejite Support • Available 24/7 for urgent issues
          </p>
        </div>
      </main>
    </>
  );
}
