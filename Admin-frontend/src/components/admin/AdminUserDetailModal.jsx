import React, { useEffect, useState } from 'react';
import { X, Mail, Shield, CheckCircle, XCircle } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { fetchFullUserProfile } from '../../services/fetchFullUserProfile';
import { mergeCvWithCandidateSkills } from '../../utils/profileSkills';
import { formatDisplayPersonName, formatDisplayRole } from '../../utils/personDisplayName';
import { getFormattedCandidateProfileFields } from '../../utils/displayFormatUtils';
import { profileAvatarSrc } from '../../utils/profilePhotoUrl';
import { pickAuthorProfilePhoto } from '../../utils/profileImageUtils';
import ProfileCvSections from '../ProfileCvSections';
import ContactInfoSection from '../ContactInfoSection';
import VerifiedBadge from '../VerifiedBadge';
import AdminUserJobPreferences from './AdminUserJobPreferences';

const DetailItem = ({ label, value }) => {
  if (value == null || value === '') return null;
  return (
    <div className="rounded-lg border border-gray-100 bg-[#F9FAF8] px-4 py-3 min-w-0">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#1A3E32] break-words">{value}</p>
    </div>
  );
};

const AdminUserDetailModal = ({ user, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [cvData, setCvData] = useState(null);
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const userId = user.id;
        let loadedUser = null;
        let cv = null;
        let candidateRow = null;

        const full = await fetchFullUserProfile(userId);
        if (full?.user) {
          loadedUser = full.user;
          cv = full.cv;
        } else {
          try {
            const { data: cvRes } = await axiosInstance.get(
              `/api/cv-builder/complete/${userId}`,
            );
            if (cvRes?.success && cvRes.data) {
              cv = {
                bio: cvRes.data.bio ?? null,
                education: cvRes.data.education ?? [],
                skills: cvRes.data.skills ?? [],
                workHistory: cvRes.data.workHistory ?? [],
                certificates: cvRes.data.certificates ?? [],
                links: cvRes.data.links ?? null,
              };
            }
          } catch {
            /* optional fallback */
          }
        }

        try {
          const { data: candRes } = await axiosInstance.get(`/api/candidates/${userId}`);
          candidateRow = candRes?.data ?? null;
        } catch {
          /* not every user has a candidate row */
        }

        const mergedProfile = {
          ...user,
          ...(loadedUser || {}),
          first_name: loadedUser?.first_name ?? user.firstName,
          last_name: loadedUser?.last_name ?? user.lastName,
          firstName: loadedUser?.firstName ?? user.firstName,
          lastName: loadedUser?.lastName ?? user.lastName,
        };

        setProfileUser(mergedProfile);
        setCvData(mergeCvWithCandidateSkills(cv, candidateRow));
        setCandidate(candidateRow);
      } catch (err) {
        console.error('Error loading user profile', err);
        setError(err.response?.data?.error || err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  if (!user) return null;

  const displayName = formatDisplayPersonName(
    {
      first_name: profileUser?.first_name ?? user.firstName,
      last_name: profileUser?.last_name ?? user.lastName,
      nickname: profileUser?.nickname,
      email: user.email,
    },
    'User',
  );

  const profileFields = getFormattedCandidateProfileFields(
    { ...candidate, ...profileUser },
    { cvBio: cvData?.bio },
  );

  const photoPath =
    pickAuthorProfilePhoto(profileUser) ||
    pickAuthorProfilePhoto(candidate) ||
    cvData?.bio?.profile_photo;

  const isVerified = user.verified || user.isEmailVerified || profileUser?.verified;

  const accountItems = [
    { label: 'User ID', value: String(user.id) },
    { label: 'Email', value: user.email },
    { label: 'Role', value: formatDisplayRole(user.role, 'Unassigned') },
    { label: 'First name', value: profileUser?.firstName ?? user.firstName },
    { label: 'Last name', value: profileUser?.lastName ?? user.lastName },
    { label: 'Nickname', value: profileUser?.nickname },
    { label: 'Username', value: profileUser?.username },
    { label: 'Phone', value: profileUser?.phone ?? profileUser?.phone_number },
    { label: 'Location', value: profileFields.location ?? profileUser?.location },
    { label: 'Company', value: profileUser?.company_name },
    { label: 'Job title', value: profileUser?.job_title ?? profileUser?.title },
    {
      label: 'Joined',
      value: user.created_at
        ? new Date(user.created_at).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : null,
    },
    {
      label: 'Email verified',
      value: isVerified ? 'Yes' : 'No',
    },
    {
      label: 'Admin account',
      value: user.is_admin ? 'Yes' : 'No',
    },
  ].filter((item) => item.value != null && item.value !== '');

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/50"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div
        className="bg-gray-50 w-full max-w-3xl h-full shadow-2xl flex flex-col"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">User profile</h2>
            <p className="text-sm text-gray-500 truncate">{displayName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 shrink-0"
            aria-label="Close profile"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto nfl-scroll p-4 sm:p-6 space-y-6">
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin inline-block rounded-full h-10 w-10 border-b-2 border-[#16730F]" />
              <p className="text-gray-500 mt-3">Loading full profile...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-600">{error}</div>
          ) : (
            <>
              <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <img
                    src={profileAvatarSrc(photoPath)}
                    alt={displayName}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold text-[#1A3E32]">{displayName}</h3>
                      {profileUser?.hasVerifiedBadge && <VerifiedBadge />}
                      {user.is_admin && (
                        <Shield className="text-blue-500" size={18} title="Admin" />
                      )}
                    </div>
                    {profileFields.title && (
                      <p className="text-gray-700 mt-1">{profileFields.title}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1 min-w-0">
                        <Mail size={14} className="shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          isVerified
                            ? 'bg-green-50 text-green-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {isVerified ? (
                          <CheckCircle size={12} />
                        ) : (
                          <XCircle size={12} />
                        )}
                        {isVerified ? 'Verified' : 'Pending verification'}
                      </span>
                      <span className="capitalize text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {formatDisplayRole(user.role, 'Unassigned')}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-[#1A3E32] mb-4">
                  Account details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {accountItems.map((item) => (
                    <DetailItem key={item.label} label={item.label} value={item.value} />
                  ))}
                </div>
              </section>

              {profileFields.bio && (
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1A3E32] mb-4">About</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                    {profileFields.bio}
                  </p>
                </section>
              )}

              <ProfileCvSections cv={cvData} candidate={candidate ?? profileUser} />

              <AdminUserJobPreferences candidate={candidate} profileUser={profileUser} />

              <ContactInfoSection
                candidate={{ ...candidate, ...profileUser, email: user.email }}
                bio={cvData?.bio}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetailModal;
