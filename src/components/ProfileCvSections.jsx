import React from 'react';
import {
  formatDateRange,
  formatDateToMonthYear,
  isOngoingCvEntry,
} from '../utils/checksFormat';
import { CertificateViewLink } from './CertificateViewerModal';
import { normalizeProfileSkills, resolveProfileSkillSource } from '../utils/profileSkills';
import ProfileSkillsDisplay from './ProfileSkillsDisplay';

const Section = ({ title, children, empty }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
    <h2 className="text-xl font-semibold text-[#1A3E32] mb-4">{title}</h2>
    {empty ? (
      <p className="text-gray-500 text-sm">Not provided</p>
    ) : (
      children
    )}
  </div>
);

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
    { label: 'Gender', value: bio?.gender, capitalize: true },
    { label: 'Marital status', value: bio?.marital_status, capitalize: true },
    { label: 'Age', value: bio?.age },
    { label: 'Country', value: bio?.country, capitalize: true },
    { label: 'City', value: bio?.city, capitalize: true },
    { label: 'Tribe', value: bio?.tribe, capitalize: true },
  ].filter(
    (detail) => detail.value != null && String(detail.value).trim() !== '',
  );

  return (
    <>
      {hasBioDetails && (
        <Section title="Personal details">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {personalDetails.map((detail) => (
              <div
                key={detail.label}
                className="rounded-lg border border-gray-100 bg-[#F9FAF8] px-4 py-3"
              >
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {detail.label}
                </dt>
                <dd
                  className={`mt-1 text-sm font-semibold text-[#1A3E32] ${
                    detail.capitalize ? 'capitalize' : ''
                  }`}
                >
                  {String(detail.value)}
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      <Section title="Education" empty={!cv.education?.length}>
        <ul className="space-y-4">
          {cv.education?.map((edu) => (
            <li key={edu.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <p className="font-semibold text-[#1A3E32]">{edu.degree}</p>
              <p className="text-gray-600">{edu.institution_name}</p>
              <p className="text-sm text-gray-500">
                {edu.field_of_study} · {edu.location}
              </p>
              <p className="text-sm text-[#16730F]">
                {formatDateRange(
                  edu.start_date ?? edu.startDate,
                  edu.end_date ?? edu.endDate,
                  isOngoingCvEntry(edu),
                )}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Skills" empty={!skillItems.length}>
        <ProfileSkillsDisplay
          skills={resolveProfileSkillSource({ cv, candidate })}
          variant="card"
        />
      </Section>

      <Section title="Work history" empty={!cv.workHistory?.length}>
        <ul className="space-y-4">
          {cv.workHistory?.map((job) => (
            <li key={job.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <p className="font-semibold text-[#1A3E32]">{job.job_title}</p>
              <p className="text-gray-600">{job.company_name}</p>
              <p className="text-sm text-[#16730F]">
                {formatDateRange(
                  job.start_date ?? job.startDate,
                  job.end_date ?? job.endDate,
                  isOngoingCvEntry(job),
                )}
              </p>
              {job.responsibilities && (
                <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                  {job.responsibilities}
                </p>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Certificates" empty={!cv.certificates?.length}>
        <ul className="space-y-3">
          {cv.certificates?.map((cert) => {
            const issueDate = formatDateToMonthYear(
              cert.issue_date ?? cert.issueDate,
            );
            const meta = [cert.issuer, issueDate].filter(Boolean).join(' · ');
            const certTitle = cert.cert_name ?? cert.certName;

            return (
              <li key={cert.id}>
                <p className="font-semibold text-[#1A3E32]">{certTitle}</p>
                {meta && <p className="text-sm text-gray-600">{meta}</p>}
                <CertificateViewLink
                  fileUrl={cert.file_url ?? cert.fileUrl}
                  title={certTitle}
                  className="text-sm text-[#16730F] hover:underline mt-1"
                />
              </li>
            );
          })}
        </ul>
      </Section>

      <Section
        title="Links"
        empty={
          !cv.links ||
          !['linkedin', 'twitter', 'instagram', 'portfolio'].some(
            (k) => cv.links[k],
          )
        }
      >
        <ul className="space-y-2">
          {cv.links?.linkedin && (
            <li>
              <span className="text-gray-500 text-sm">LinkedIn: </span>
              <a
                href={cv.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#16730F] hover:underline break-all"
              >
                {cv.links.linkedin}
              </a>
            </li>
          )}
          {cv.links?.twitter && (
            <li>
              <span className="text-gray-500 text-sm">Twitter: </span>
              <a
                href={cv.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#16730F] hover:underline break-all"
              >
                {cv.links.twitter}
              </a>
            </li>
          )}
          {cv.links?.instagram && (
            <li>
              <span className="text-gray-500 text-sm">Instagram: </span>
              <a
                href={cv.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#16730F] hover:underline break-all"
              >
                {cv.links.instagram}
              </a>
            </li>
          )}
          {cv.links?.portfolio && (
            <li>
              <span className="text-gray-500 text-sm">Portfolio: </span>
              <a
                href={cv.links.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#16730F] hover:underline break-all"
              >
                {cv.links.portfolio}
              </a>
            </li>
          )}
        </ul>
      </Section>
    </>
  );
};

export default ProfileCvSections;
