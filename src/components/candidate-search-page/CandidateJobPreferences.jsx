import React from 'react';
import { formatSalaryExpectation } from '../../utils/formatSalary';

const PreferenceItem = ({ label, value }) => {
  if (value == null || value === '') return null;
  return (
    <div className="rounded-lg border border-gray-100 bg-[#F9FAF8] px-4 py-3">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#1A3E32] capitalize">{String(value)}</p>
    </div>
  );
};

const CandidateJobPreferences = ({ candidate }) => {
  if (!candidate) return null;

  const salary = formatSalaryExpectation(
    candidate.salary_expectation,
    candidate.currency,
  );

  const items = [
    { label: 'Job title', value: candidate.title },
    { label: 'Industry', value: candidate.industry },
    { label: 'Preferred country', value: candidate.preferred_country },
    { label: 'Preferred state', value: candidate.preferred_state },
    { label: 'Work type', value: candidate.work_type },
    { label: 'Remote preference', value: candidate.remote_preference },
    { label: 'Availability', value: candidate.availability },
    { label: 'Rate', value: candidate.rate || 'Not Set' },
    ...(salary
      ? [{ label: 'Salary expectation', value: salary }]
      : candidate.currency
        ? [{ label: 'Currency', value: candidate.currency }]
        : []),
  ].filter((item) => item.value != null && item.value !== '');

  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-[#1A3E32] mb-4">Job preferences</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <PreferenceItem key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
};

export default CandidateJobPreferences;
