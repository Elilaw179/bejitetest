import React from 'react';

const formatCandidateAddress = (candidate, bio) => {
  const bioParts = [bio?.street, bio?.city, bio?.country].filter(
    (part) => part != null && String(part).trim() !== '',
  );
  if (bioParts.length > 0) return bioParts.join(', ');

  if (!candidate) return null;
  const candidateParts = [candidate.address, candidate.street, candidate.city, candidate.country].filter(
    (part) => part != null && String(part).trim() !== '',
  );
  if (candidateParts.length > 0) return candidateParts.join(', ');
  return candidate.location || candidate.preferred_country || null;
};

const CandidateContactInfo = ({ candidate, bio }) => {
  const phone = candidate?.phone || candidate?.phone_number || bio?.phone;
  const address = formatCandidateAddress(candidate, bio);

  const contacts = [
    { type: 'Phone', value: phone },
    { type: 'Address', value: address },
    { type: 'Email', value: candidate?.email },
    { type: 'LinkedIn', value: candidate?.linkedin_url, href: true },
    { type: 'GitHub', value: candidate?.github_url, href: true },
    { type: 'Portfolio', value: candidate?.portfolio_url, href: true },
  ].filter((c) => c.value);

  if (contacts.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-[#1A3E32] mb-4">Contact info</h2>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.map((contact) => (
          <div key={contact.type}>
            <dt className="text-sm text-gray-500">{contact.type}</dt>
            <dd className="mt-1 text-[#1A3E32] text-sm font-medium break-all">
              {contact.href ? (
                <a
                  href={contact.value.startsWith('http') ? contact.value : `https://${contact.value}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#16730F] hover:underline"
                >
                  {contact.value}
                </a>
              ) : (
                contact.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default CandidateContactInfo;
