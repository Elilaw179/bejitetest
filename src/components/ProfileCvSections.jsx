import React from 'react';

const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

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

const ProfileCvSections = ({ cv }) => {
  if (!cv) return null;

  const bio = cv.bio;
  const hasBioDetails =
    bio &&
    (bio.gender ||
      bio.marital_status ||
      bio.age ||
      bio.country ||
      bio.tribe ||
      bio.zip);

  return (
    <>
      {hasBioDetails && (
        <Section title="Personal details">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {bio.gender && (
              <>
                <dt className="text-gray-500">Gender</dt>
                <dd className="text-[#1A3E32] capitalize">{bio.gender}</dd>
              </>
            )}
            {bio.marital_status && (
              <>
                <dt className="text-gray-500">Marital status</dt>
                <dd className="text-[#1A3E32] capitalize">{bio.marital_status}</dd>
              </>
            )}
            {bio.age != null && bio.age !== '' && (
              <>
                <dt className="text-gray-500">Age</dt>
                <dd className="text-[#1A3E32]">{bio.age}</dd>
              </>
            )}
            {bio.country && (
              <>
                <dt className="text-gray-500">Country</dt>
                <dd className="text-[#1A3E32] capitalize">{bio.country}</dd>
              </>
            )}
            {bio.city && (
              <>
                <dt className="text-gray-500">City</dt>
                <dd className="text-[#1A3E32] capitalize">{bio.city}</dd>
              </>
            )}
            {bio.tribe && (
              <>
                <dt className="text-gray-500">Tribe</dt>
                <dd className="text-[#1A3E32] capitalize">{bio.tribe}</dd>
              </>
            )}
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
                {formatDate(edu.start_date)} – {formatDate(edu.end_date)}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Skills" empty={!cv.skills?.length}>
        <ul className="flex flex-wrap gap-2">
          {cv.skills?.map((skill) => (
            <li
              key={skill.id}
              className="px-3 py-1 bg-[#E8F5E6] text-[#1A3E32] rounded-full text-sm"
            >
              {skill.skill_sector} · {skill.category} ({skill.experience})
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Work history" empty={!cv.workHistory?.length}>
        <ul className="space-y-4">
          {cv.workHistory?.map((job) => (
            <li key={job.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <p className="font-semibold text-[#1A3E32]">{job.job_title}</p>
              <p className="text-gray-600">{job.company_name}</p>
              <p className="text-sm text-[#16730F]">
                {formatDate(job.start_date)} – {formatDate(job.end_date)}
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
          {cv.certificates?.map((cert) => (
            <li key={cert.id}>
              <p className="font-semibold text-[#1A3E32]">{cert.cert_name}</p>
              <p className="text-sm text-gray-600">
                {cert.issuer} · {formatDate(cert.issue_date)}
              </p>
              {cert.file_url && (
                <a
                  href={cert.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#16730F] hover:underline"
                >
                  View certificate
                </a>
              )}
            </li>
          ))}
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
