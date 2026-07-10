import { Users, CheckCircle } from "lucide-react";

const INDUSTRIES_AND_PROFESSIONS = [
  "Information Technology",
  "Software Engineer",
  "Data Analyst",
  "Healthcare",
  "Nurse",
  "Finance",
  "Accountant",
  "Education",
  "Teacher",
  "Construction",
  "Manufacturing",
  "Retail",
  "Marketing & Advertising",
  "Legal",
  "Biotechnology",
];

const AudienceFiltersStep = ({
  campaignForm = {},
  setCampaignForm = () => {},
  matchingCount = 0,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          Target Audience Filters
        </h3>
        <p className="text-gray-500 text-xs">
          Precisely filter which Bejite accounts should receive this email.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-inner text-left">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            User Portal Role
          </label>
          <select
            value={campaignForm.role || "Jobseeker"}
            onChange={(e) =>
              setCampaignForm({ ...campaignForm, role: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-[#16730F] focus:outline-none text-sm font-semibold text-gray-900"
          >
            <option value="All Users">
              All Users (Jobseekers, Employers, Partners)
            </option>
            <option value="Jobseeker">Jobseekers Only</option>
            <option value="Employer">Employers / Recruiters Only</option>
            <option value="Partners">Partners Only</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Sector / Profession Focus
          </label>
          <select
            value={campaignForm.profession || "All"}
            onChange={(e) =>
              setCampaignForm({ ...campaignForm, profession: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-[#16730F] focus:outline-none text-sm font-semibold text-gray-900"
            disabled={campaignForm.role === "Partners"}
          >
            <option value="All">All Sectors</option>
            {INDUSTRIES_AND_PROFESSIONS.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Filter Skills Required
          </label>
          <input
            type="text"
            placeholder="e.g. React, Node, AWS (comma separated)"
            value={campaignForm.skills || ""}
            onChange={(e) =>
              setCampaignForm({ ...campaignForm, skills: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-[#16730F] focus:ring-2 focus:ring-green-100 focus:outline-none text-sm text-gray-900"
            disabled={
              campaignForm.role === "Employer" ||
              campaignForm.role === "Partners"
            }
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Location / Region Matching
          </label>
          <input
            type="text"
            placeholder="e.g. Lagos, Nigeria / Texas, USA"
            value={campaignForm.location || ""}
            onChange={(e) =>
              setCampaignForm({ ...campaignForm, location: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-[#16730F] focus:ring-2 focus:ring-green-100 focus:outline-none text-sm text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Profile Completeness Threshold
          </label>
          <select
            value={campaignForm.completeness || "All"}
            onChange={(e) =>
              setCampaignForm({ ...campaignForm, completeness: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-[#16730F] focus:outline-none text-sm font-semibold text-gray-900"
            disabled={campaignForm.role !== "Jobseeker"}
          >
            <option value="All">All profiles</option>
            <option value="high">High (&gt;80% profile setup completed)</option>
            <option value="medium">
              Medium (&gt;50% profile setup completed)
            </option>
            <option value="low">Low (Partial profile setup)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 md:mt-8 p-3 bg-[#16730F]/5 rounded-xl border border-[#16730F]/20">
          <input
            id="consent-check"
            type="checkbox"
            checked={campaignForm.consentChecked ?? true}
            onChange={(e) =>
              setCampaignForm({
                ...campaignForm,
                consentChecked: e.target.checked,
              })
            }
            className="h-4 w-4 text-[#16730F] focus:ring-[#16730F] border-gray-300 rounded"
          />
          <label
            htmlFor="consent-check"
            className="text-xs text-[#16730F] font-semibold leading-none cursor-pointer"
          >
            Filter only subscribed users who opted-in for email marketing
            (CASL/GDPR Compliant)
          </label>
        </div>
      </div>

      <div className="bg-[#16730F]/5 rounded-2xl p-6 border border-[#16730F]/25 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-[#16730F] text-white flex items-center justify-center">
            <Users size={22} />
          </div>
          <div>
            <h4 className="text-[#16730F] text-xl font-black">
              {matchingCount.toLocaleString()} Users
            </h4>
            <p className="text-gray-500 text-xs mt-0.5">
              matching selected filters on our database
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs bg-white text-green-700 px-3 py-1.5 rounded-xl border border-green-200 font-semibold shadow-inner">
          <CheckCircle size={14} className="text-[#16730F]" />
          Ready Segment
        </div>
      </div>
    </div>
  );
};

export default AudienceFiltersStep;
