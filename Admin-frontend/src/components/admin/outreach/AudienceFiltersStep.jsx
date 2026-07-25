import { Users } from "lucide-react";
import { getAllCountryNames } from "../../../utils/countryStateData";

const PROFESSION_SUGGESTIONS = [
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
  "Marketing",
  "Legal",
  "Biotechnology",
];

const COUNTRY_OPTIONS = getAllCountryNames();

const AudienceFiltersStep = ({
  campaignForm = {},
  setCampaignForm = () => {},
  matchingCount = 0,
  audienceLoading = false,
  sampleRecipient = null,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Target audience</h3>
        <p className="text-gray-500 text-xs">
          Filter Bejite members who should receive this email.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-200 text-left">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Role
          </label>
          <select
            value={campaignForm.role || "Jobseeker"}
            onChange={(e) =>
              setCampaignForm({ ...campaignForm, role: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-[#16730F] focus:outline-none text-sm font-semibold text-gray-900"
          >
            <optgroup label="Portal roles">
              <option value="All Users">All users (active)</option>
              <option value="Jobseeker">Jobseekers</option>
              <option value="Employer">Employers / recruiters</option>
              <option value="Partners">Partners (verified badge)</option>
            </optgroup>
            <optgroup label="Engagement segments">
              <option value="Unverified">Unverified email only</option>
              <option value="Incomplete Profile">Incomplete profile only</option>
              <option value="Inactive">Inactive accounts only</option>
              <option value="Re-engagement">
                Re-engagement (unverified, incomplete, or inactive)
              </option>
            </optgroup>
          </select>
          {(campaignForm.role === "Unverified" ||
            campaignForm.role === "Incomplete Profile" ||
            campaignForm.role === "Inactive" ||
            campaignForm.role === "Re-engagement") && (
            <p className="text-[11px] text-gray-500 mt-1.5 leading-snug">
              {campaignForm.role === "Unverified" &&
                "Users whose email is not verified (includes inactive signup accounts)."}
              {campaignForm.role === "Incomplete Profile" &&
                "Active users who have not finished profile setup."}
              {campaignForm.role === "Inactive" &&
                "Users marked inactive (still need an email address to receive mail)."}
              {campaignForm.role === "Re-engagement" &&
                "Anyone who is unverified, incomplete, or inactive."}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Sector / profession
          </label>
          <input
            list="outreach-profession-suggestions"
            type="text"
            placeholder="e.g. Nurse, Software, Finance — leave blank for all"
            value={
              campaignForm.profession === "All" ? "" : campaignForm.profession || ""
            }
            onChange={(e) =>
              setCampaignForm({
                ...campaignForm,
                profession: e.target.value.trim() ? e.target.value : "All",
              })
            }
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-[#16730F] focus:ring-2 focus:ring-green-100 focus:outline-none text-sm text-gray-900"
          />
          <datalist id="outreach-profession-suggestions">
            {PROFESSION_SUGGESTIONS.map((ind) => (
              <option key={ind} value={ind} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Skills
          </label>
          <input
            type="text"
            placeholder="e.g. React, Node, AWS (comma separated)"
            value={campaignForm.skills || ""}
            onChange={(e) =>
              setCampaignForm({ ...campaignForm, skills: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-[#16730F] focus:ring-2 focus:ring-green-100 focus:outline-none text-sm text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Country
          </label>
          <select
            value={campaignForm.location || ""}
            onChange={(e) =>
              setCampaignForm({
                ...campaignForm,
                location: e.target.value,
              })
            }
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-[#16730F] focus:outline-none text-sm font-semibold text-gray-900"
          >
            <option value="">All countries</option>
            {COUNTRY_OPTIONS.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Profile completeness
          </label>
          <select
            value={campaignForm.completeness || "All"}
            onChange={(e) =>
              setCampaignForm({ ...campaignForm, completeness: e.target.value })
            }
            disabled={
              campaignForm.role === "Incomplete Profile" ||
              campaignForm.role === "Re-engagement"
            }
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:border-[#16730F] focus:outline-none text-sm font-semibold text-gray-900 disabled:opacity-50"
          >
            <option value="All">All profiles</option>
            <option value="high">High (most sections filled)</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
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
            className="text-xs text-[#16730F] font-semibold leading-snug cursor-pointer"
          >
            Only users with email notifications enabled
          </label>
        </div>
      </div>

      <div className="bg-[#16730F]/5 rounded-2xl p-6 border border-[#16730F]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-[#16730F] text-white flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div>
            <h4 className="text-[#16730F] text-xl font-black">
              {audienceLoading
                ? "Counting…"
                : `${matchingCount.toLocaleString()} users`}
            </h4>
            <p className="text-gray-500 text-xs mt-0.5">
              {sampleRecipient
                ? `Sample: ${sampleRecipient.firstName} · ${sampleRecipient.profession}`
                : "matching current filters"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceFiltersStep;
