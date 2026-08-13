import React from 'react';
import {
  formatDateRange,
  formatDateToMonthYear,
  isOngoingCvEntry,
} from '../utils/checksFormat';
import { CertificateViewLink } from './CertificateViewerModal';
import { normalizeProfileSkills, resolveProfileSkillSource } from '../utils/profileSkills';
import ProfileSkillsDisplay from './ProfileSkillsDisplay';
import ResponsibilitiesList from './ResponsibilitiesList';
import {
  getFormattedEducationFields,
  getFormattedWorkHistoryFields,
  toTitleCaseWords,
} from '../utils/displayFormatUtils';
import SectionLabel from './profile/SectionLabel';
import { FaGraduationCap, FaBriefcase, FaAward, FaUser, FaLink } from 'react-icons/fa';

const Section = ({ title, tone = "#16730F", children, empty }) => {
  if (empty) return null;
  return (
    <div className="mb-8 last:mb-0 min-w-0">
      <SectionLabel tone={tone}>{title}</SectionLabel>
      {children}
    </div>
  );
};

const ProfileCvSections = ({ cv, candidate = null }) => {
  if (!cv) return null;

  const bio = cv.bio;
  const skillItems = normalizeProfileSkills(
    resolveProfileSkillSource({ cv, candidate }),
  );

  const hasBioDetails =
    bio &&
    (bio.gender ||
      bio.marital_status ||
      bio.age ||
      bio.country ||
      bio.tribe ||
      bio.zip);

  const personalDetails = [
    { label: 'Gender', value: bio?.gender, format: 'title' },
    { label: 'Marital status', value: bio?.marital_status, format: 'title' },
    { label: 'Age', value: bio?.age },
    { label: 'Country', value: bio?.country, format: 'title' },
    { label: 'City', value: bio?.city, format: 'title' },
    { label: 'Tribe', value: bio?.tribe, format: 'title' },
  ]
    .filter((detail) => detail.value != null && String(detail.value).trim() !== '')
    .map((detail) => ({
      ...detail,
      display:
        detail.format === 'title'
          ? toTitleCaseWords(detail.value)
          : String(detail.value),
    }));

  return (
    <div className="space-y-8">
      {/* Personal Details */}
      {hasBioDetails && personalDetails.length > 0 && (
        <Section title="Personal Details" tone="#475569">
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            {personalDetails.map((detail) => (
              <div
                key={detail.label}
                className="rounded-sm border border-slate-200/80 bg-slate-50/60 p-3 hover:border-slate-300 transition-colors"
              >
                <dt className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  {detail.label}
                </dt>
                <dd className="mt-1 text-xs sm:text-sm font-semibold text-slate-800 break-words">
                  {detail.display}
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {/* Work History Timeline */}
      <Section title="Work History" tone="#0284c7" empty={!cv.workHistory?.length}>
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {cv.workHistory?.map((job) => {
            const formatted = getFormattedWorkHistoryFields(job);
            const isOngoing = isOngoingCvEntry(job);
            return (
              <div key={job.id} className="relative group min-w-0">
                {/* Timeline Dot */}
                <span
                  className={`absolute -left-[23px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow-xs transition-transform duration-200 group-hover:scale-125 ${
                    isOngoing
                      ? "bg-sky-600 ring-2 ring-sky-100"
                      : "bg-slate-400 group-hover:bg-sky-600"
                  }`}
                />
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  {formatted.title && (
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base break-words">
                      {formatted.title}
                    </h3>
                  )}
                  <span className="text-[11px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-xs border border-sky-200/60 shrink-0 self-start sm:self-auto">
                    {formatDateRange(
                      job.start_date ?? job.startDate,
                      job.end_date ?? job.endDate,
                      isOngoing,
                    )}
                  </span>
                </div>

                {formatted.company && (
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 flex items-center gap-1.5 mt-0.5">
                    <FaBriefcase className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{formatted.company}</span>
                  </p>
                )}

                {formatted.description && (
                  <ResponsibilitiesList
                    text={formatted.description}
                    className="mt-2.5 space-y-1 list-disc list-outside pl-4 text-xs sm:text-sm text-slate-600 break-words leading-relaxed"
                  />
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* Education Timeline */}
      <Section title="Education" tone="#16730F" empty={!cv.education?.length}>
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {cv.education?.map((edu) => {
            const formatted = getFormattedEducationFields(edu);
            const isOngoing = isOngoingCvEntry(edu);
            const meta = [formatted.field, formatted.location]
              .filter(Boolean)
              .join(' · ');

            return (
              <div key={edu.id} className="relative group min-w-0">
                {/* Timeline Dot */}
                <span className="absolute -left-[23px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-600 shadow-xs transition-transform duration-200 group-hover:scale-125" />
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div>
                    {formatted.educationLevel && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        {formatted.educationLevel}
                      </span>
                    )}
                    {formatted.degree && (
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base break-words">
                        {formatted.degree}
                      </h3>
                    )}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200/60 shrink-0 self-start sm:self-auto">
                    {formatDateRange(
                      edu.start_date ?? edu.startDate,
                      edu.end_date ?? edu.endDate,
                      isOngoing,
                    )}
                  </span>
                </div>

                {formatted.institution && (
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 flex items-center gap-1.5 mt-0.5">
                    <FaGraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{formatted.institution}</span>
                  </p>
                )}

                {meta && (
                  <p className="text-xs text-slate-500 mt-1 break-words">
                    {meta}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* Skills Section */}
      <Section title="Skills & Competencies" tone="#7e22ce" empty={!skillItems.length}>
        <ProfileSkillsDisplay
          skills={resolveProfileSkillSource({ cv, candidate })}
          variant="card"
        />
      </Section>

      {/* Certifications */}
      <Section title="Certifications" tone="#d97706" empty={!cv.certificates?.length}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cv.certificates?.map((cert) => {
            const issueDate = formatDateToMonthYear(
              cert.issue_date ?? cert.issueDate,
            );
            const meta = [cert.issuer, issueDate].filter(Boolean).join(' · ');
            const certTitle = cert.cert_name ?? cert.certName;

            return (
              <div
                key={cert.id}
                className="p-3.5 rounded-sm border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs hover:border-amber-300 transition-all duration-200 min-w-0"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded bg-amber-50 text-amber-700 shrink-0 mt-0.5">
                    <FaAward className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm break-words">
                      {certTitle}
                    </h4>
                    {meta && (
                      <p className="text-[11px] text-slate-500 mt-0.5 break-words">
                        {meta}
                      </p>
                    )}
                    <CertificateViewLink
                      fileUrl={cert.file_url ?? cert.fileUrl}
                      title={certTitle}
                      className="text-xs font-semibold text-[#16730F] hover:underline inline-flex items-center gap-1 mt-2"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* External Links */}
      <Section
        title="Links & References"
        tone="#0f172a"
        empty={
          !cv.links ||
          !['linkedin', 'twitter', 'instagram', 'portfolio'].some(
            (k) => cv.links[k],
          )
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
          {cv.links?.linkedin && (
            <a
              href={cv.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2.5 rounded-sm border border-slate-200 bg-slate-50/60 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors text-xs font-semibold text-slate-700 hover:text-[#16730F] group"
            >
              <FaLink className="w-3 h-3 text-slate-400 group-hover:text-[#16730F] shrink-0" />
              <span className="truncate">LinkedIn: {cv.links.linkedin}</span>
            </a>
          )}
          {cv.links?.twitter && (
            <a
              href={cv.links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2.5 rounded-sm border border-slate-200 bg-slate-50/60 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors text-xs font-semibold text-slate-700 hover:text-[#16730F] group"
            >
              <FaLink className="w-3 h-3 text-slate-400 group-hover:text-[#16730F] shrink-0" />
              <span className="truncate">Twitter: {cv.links.twitter}</span>
            </a>
          )}
          {cv.links?.instagram && (
            <a
              href={cv.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2.5 rounded-sm border border-slate-200 bg-slate-50/60 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors text-xs font-semibold text-slate-700 hover:text-[#16730F] group"
            >
              <FaLink className="w-3 h-3 text-slate-400 group-hover:text-[#16730F] shrink-0" />
              <span className="truncate">Instagram: {cv.links.instagram}</span>
            </a>
          )}
          {cv.links?.portfolio && (
            <a
              href={cv.links.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2.5 rounded-sm border border-slate-200 bg-slate-50/60 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors text-xs font-semibold text-slate-700 hover:text-[#16730F] group"
            >
              <FaLink className="w-3 h-3 text-slate-400 group-hover:text-[#16730F] shrink-0" />
              <span className="truncate">Portfolio: {cv.links.portfolio}</span>
            </a>
          )}
        </div>
      </Section>
    </div>
  );
};

export default ProfileCvSections;
