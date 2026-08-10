import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FaEdit,
  FaArrowLeft,
  FaGlobe,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaMapMarkerAlt,
  FaBuilding,
  FaUserFriends,
  FaBriefcase,
  FaCamera,
  FaExternalLinkAlt,
} from "react-icons/fa";
import NewsFeedLayout from "../components/layout/NewsFeedLayout";
import ProfileCvSections from "../components/ProfileCvSections";
import axiosInstance from "../utils/axiosInstance";
import { fetchCurrentUserProfilePhoto } from "../services/profilePhotoService";
import { fetchFullUserProfile } from "../services/fetchFullUserProfile";
import {
  mergeCvWithCandidateSkills,
  normalizeProfileSkills,
  resolveProfileSkillSource,
} from "../utils/profileSkills";
import { getUser, pickProfilePhotoPath } from "../utils/tokenManager";
import { profileAvatarSrc } from "../utils/profilePhotoUrl";
import { pickAuthorProfilePhoto } from "../utils/profileImageUtils";
import { getRecruiterEditProfilePath } from "../utils/recruiterProfilePaths";
import {
  normalizeProfileData,
  unwrapAuthProfileBody,
  profilePayloadLooksUsable,
  profileFromSearchPreview,
} from "../utils/profileUtils";
import {
  formatDisplayPersonName,
  formatDisplayRole,
  formatDisplayHandle,
} from "../utils/personDisplayName";
import { formatDisplayText } from "../utils/displayFormatUtils";
import { truncateText } from "../utils/checksFormat";
import ProfileConnectActions from "../components/ProfileConnectActions";
import ProfilePostsSection from "../components/ProfilePostsSection";
import DisplayNameWithBadge from "../components/DisplayNameWithBadge";
import MutualConnectionsModal from "../components/MutualConnectionsModal";

const ABOUT_WORD_LIMIT = 100;

const formatConnectionCount = (count) => {
  const n = Number(count);
  if (!Number.isFinite(n) || n <= 0) return "0";
  if (n > 600) return "600+";
  return String(Math.floor(n));
};

const formatMutualConnectionsLabel = (count, samples = []) => {
  const n = Number(count) || 0;
  if (n <= 0) return null;

  const names = (Array.isArray(samples) ? samples : [])
    .map((person) =>
      [person?.firstName, person?.lastName].filter(Boolean).join(" ").trim(),
    )
    .filter(Boolean);

  const countLabel = formatConnectionCount(n);
  if (names.length === 0) {
    return `${countLabel} mutual ${n === 1 ? "connection" : "connections"}`;
  }

  if (n === 1) return `${names[0]} is a mutual connection`;
  if (n === 2 && names.length >= 2) {
    return `${names[0]} and ${names[1]} are mutual connections`;
  }

  const shown = names.slice(0, 2);
  const remaining = Math.max(n - shown.length, 0);
  if (remaining <= 0) {
    return `${shown.join(" and ")} are mutual connections`;
  }

  return `${shown.join(", ")} and ${formatConnectionCount(remaining)} other${
    remaining === 1 ? "" : "s"
  }`;
};

const toExternalHref = (url) => {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const ProfileDetailRow = ({
  icon: Icon,
  label,
  value,
  href,
  preserveCase = false,
  brandColor = "bg-emerald-50 text-[#16730F]",
}) => {
  const displayValue = value
    ? preserveCase
      ? String(value).trim()
      : formatDisplayText(value)
    : "Not provided";
  const isLink = Boolean(href && value);

  return (
    <div className="group relative flex items-center gap-3.5 min-w-0 rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50/60 via-white to-slate-50/30 p-3.5 sm:p-4 hover:border-emerald-300 hover:shadow-md transition-all duration-200">
      <div
        className={`p-2.5 rounded-xl ${brandColor} shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200`}
      >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </p>
        {isLink ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-semibold text-[#16730F] hover:text-[#145a0c] hover:underline break-all inline-flex items-center gap-1.5 mt-0.5"
          >
            <span className="truncate">{displayValue}</span>
            <FaExternalLinkAlt className="w-2.5 h-2.5 shrink-0 opacity-70 group-hover:opacity-100" />
          </a>
        ) : (
          <p className="text-xs sm:text-sm font-medium text-slate-700 break-words break-all mt-0.5">
            {displayValue}
          </p>
        )}
      </div>
    </div>
  );
};

const ProfileSkeleton = () => (
  <NewsFeedLayout showSidebars={false}>
    <div className="w-full min-w-0 max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 animate-pulse">
      <div className="h-6 w-24 bg-slate-200 rounded-lg mb-6"></div>
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm mb-6">
        <div className="h-44 sm:h-56 bg-slate-200 w-full"></div>
        <div className="-mt-14 sm:-mt-20 px-4 sm:px-8 pb-6 flex flex-col sm:flex-row items-start gap-4">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-slate-300 border-4 border-white shrink-0"></div>
          <div className="w-full pt-4 space-y-3">
            <div className="h-7 bg-slate-200 rounded-md w-48"></div>
            <div className="h-4 bg-slate-200 rounded-md w-32"></div>
            <div className="h-4 bg-slate-200 rounded-md w-64"></div>
          </div>
        </div>
      </div>
    </div>
  </NewsFeedLayout>
);

const buildAvatarCandidates = (rawPhoto) => {
  const candidates = [];
  const pushUnique = (value) => {
    if (!value || typeof value !== "string") return;
    const trimmed = value.trim();
    if (!trimmed || candidates.includes(trimmed)) return;
    candidates.push(trimmed);
  };

  pushUnique(profileAvatarSrc(rawPhoto));

  const raw = typeof rawPhoto === "string" ? rawPhoto.trim() : "";
  if (!raw) return candidates;

  pushUnique(raw);

  const isAbsolute =
    /^https?:\/\//i.test(raw) ||
    raw.startsWith("blob:") ||
    raw.startsWith("data:") ||
    raw.startsWith("/assets/") ||
    raw.startsWith("assets/");

  if (!isAbsolute) {
    const relativePath = raw.startsWith("/") ? raw : `/${raw}`;
    const baseUrl = String(import.meta.env.VITE_API_URL || "")
      .trim()
      .replace(/\/+$/, "");
    const baseApi = String(import.meta.env.VITE_API_BASE_URL || "")
      .trim()
      .replace(/\/+$/, "");
    pushUnique(baseUrl ? `${baseUrl}${relativePath}` : "");
    pushUnique(baseApi ? `${baseApi}${relativePath}` : "");
    pushUnique(`${window.location.origin}${relativePath}`);
  }

  return candidates;
};

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarCandidates, setAvatarCandidates] = useState([]);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);
  const [showMutualConnections, setShowMutualConnections] = useState(false);

  const user = getUser();

  const fetchProfileData = async ({ cancelled } = {}) => {
    const isCancelled = () => Boolean(cancelled?.());

    try {
      setLoading(true);
      setError(null);

      const currentUser = getUser();
      const targetUserId = userId || currentUser?.id;
      const viewingOwn =
        !userId || String(userId) === String(currentUser?.id ?? "");

      let profileFound = false;
      let merged = null;
      let cv = null;

      if (userId) {
        const preview = profileFromSearchPreview(
          location.state?.profilePreview,
          userId,
        );
        if (preview && profilePayloadLooksUsable(preview)) {
          merged = preview;
          profileFound = true;
        }
      }

      if (targetUserId) {
        const full = await fetchFullUserProfile(targetUserId);
        if (isCancelled()) return;
        if (full?.user) {
          merged = normalizeProfileData({ ...merged, ...full.user });
          cv = full.cv;
          profileFound = true;
        }

        const hasSkillLabels =
          normalizeProfileSkills(resolveProfileSkillSource({ cv })).length > 0;
        if (!hasSkillLabels) {
          try {
            const { data: cvRes } = await axiosInstance.get(
              `/api/cv-builder/complete/${targetUserId}`,
            );
            if (isCancelled()) return;
            if (cvRes?.success && cvRes.data) {
              cv = mergeCvWithCandidateSkills(
                {
                  bio: cv?.bio ?? cvRes.data.bio ?? null,
                  education: cv?.education ?? cvRes.data.education ?? [],
                  skills: cvRes.data.skills ?? [],
                  workHistory: cv?.workHistory ?? cvRes.data.workHistory ?? [],
                  certificates:
                    cv?.certificates ?? cvRes.data.certificates ?? [],
                  links: cv?.links ?? cvRes.data.links ?? null,
                },
                null,
              );
            }
          } catch {
            /* optional CV fallback */
          }
        }
      }

      // Fallback for normal /user-profile/:id visits when full profile lacks photo fields.
      if (targetUserId && !pickAuthorProfilePhoto(merged)) {
        try {
          const { data: candidateRes } = await axiosInstance.get(
            `/api/candidates/${targetUserId}`,
          );
          if (isCancelled()) return;
          const candidateRow = candidateRes?.data ?? candidateRes;
          const candidatePhoto = pickAuthorProfilePhoto(candidateRow);
          if (candidatePhoto) {
            merged = normalizeProfileData({
              ...merged,
              profile_photo: candidatePhoto,
              profilePhoto: candidatePhoto,
              image: candidatePhoto,
            });
            profileFound = true;
          }
        } catch {
          /* optional fallback only */
        }
      }

      if (viewingOwn && targetUserId) {
        if (!profileFound) {
          try {
            const { data } = await axiosInstance.get("/auth/me");
            if (isCancelled()) return;
            const row = unwrapAuthProfileBody(data);
            merged = normalizeProfileData({ ...merged, ...row });
            profileFound = profilePayloadLooksUsable(merged);
          } catch (meError) {
            console.warn("GET /auth/me failed:", meError?.message || meError);
          }
        }

        const role = merged?.role || currentUser?.role;
        if (role === "recruiter") {
          try {
            const response = await axiosInstance.get("/auth/user/profile");
            if (isCancelled()) return;
            const row = unwrapAuthProfileBody(response.data);
            merged = normalizeProfileData({ ...merged, ...row });
            profileFound = true;
          } catch (recruiterProfileError) {
            console.warn(
              "GET /auth/user/profile failed:",
              recruiterProfileError?.message || recruiterProfileError,
            );
          }
        }
      }

      if (viewingOwn) {
        try {
          const photoUrl = await fetchCurrentUserProfilePhoto();
          if (isCancelled()) return;
          if (photoUrl) {
            merged = merged
              ? { ...merged, profile_photo: photoUrl }
              : normalizeProfileData({
                  id: currentUser?.id,
                  profile_photo: photoUrl,
                  firstName: currentUser?.firstName,
                  lastName: currentUser?.lastName,
                  email: currentUser?.email,
                });
            profileFound = true;
          }
        } catch {
          /* photo endpoint unavailable */
        }
      }

      if (isCancelled()) return;

      if (merged) {
        // Never paint a profile for a different route user (race after back/forward).
        if (
          userId &&
          merged.id != null &&
          String(merged.id) !== String(userId)
        ) {
          return;
        }
        setProfileData(merged);
        setCvData(cv);
      }

      if (!profileFound) {
        setError("Profile data not found. Please complete your profile setup.");
      }
    } catch (err) {
      if (isCancelled()) return;
      console.error("Error fetching profile:", err);
      setError("Failed to load profile data");
    } finally {
      if (!isCancelled()) setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    // Drop the previous profile immediately so we never flash the wrong photo.
    setProfileData(null);
    setCvData(null);
    setAvatarCandidates([]);
    setAvatarIndex(0);
    setIsPhotoViewerOpen(false);
    setShowMutualConnections(false);
    setError(null);
    setLoading(true);

    fetchProfileData({ cancelled: () => !active });

    return () => {
      active = false;
    };
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const isViewingOwnProfile =
    !userId || String(userId) === String(user?.id ?? "");
  const profileMatchesRoute =
    !userId || !profileData?.id || String(profileData.id) === String(userId);
  const showProfileLoading =
    loading || Boolean(userId && profileData && !profileMatchesRoute);

  const profileAvatarStored = isViewingOwnProfile
    ? pickProfilePhotoPath(user) || pickAuthorProfilePhoto(profileData)
    : pickAuthorProfilePhoto(profileData);
  const activeAvatarSrc =
    avatarCandidates[avatarIndex] || profileAvatarSrc(profileAvatarStored);

  const viewedRole = profileData?.role || user?.role;
  const isJobseekerProfile = viewedRole === "jobseeker";
  const isRecruiterProfile = viewedRole === "recruiter";
  const displayHandle = formatDisplayHandle(profileData);

  useEffect(() => {
    const nextCandidates = buildAvatarCandidates(profileAvatarStored);
    setAvatarCandidates(nextCandidates);
    setAvatarIndex(0);
  }, [profileAvatarStored]);

  useEffect(() => {
    if (!isPhotoViewerOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsPhotoViewerOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isPhotoViewerOpen]);

  const handleEditProfile = () => {
    if (user?.role === "jobseeker") {
      navigate("/edit-profile/bio");
    } else {
      navigate(getRecruiterEditProfilePath(user));
    }
  };

  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const aboutTextRaw =
    (typeof profileData?.bio === "string" && profileData.bio.trim()) ||
    (typeof profileData?.summary === "string" && profileData.summary.trim()) ||
    (typeof cvData?.bio?.bio === "string" && cvData.bio.bio.trim()) ||
    "";
  const aboutText = aboutTextRaw || null;
  const aboutPreview = aboutText
    ? truncateText(aboutText, ABOUT_WORD_LIMIT, "words")
    : { text: "", needsTruncation: false };
  const needsTruncation = aboutPreview.needsTruncation;
  const recruiterLinks = profileData?.links || {};
  const linkedinUrl =
    profileData?.linkedin_url || recruiterLinks.linkedin || null;
  const twitterUrl = profileData?.twitter_url || recruiterLinks.twitter || null;
  const instagramUrl =
    profileData?.instagram_url || recruiterLinks.instagram || null;
  const recruiterPublicLocation = [profileData?.city, profileData?.country]
    .filter((value) => value != null && String(value).trim() !== "")
    .map((value) => formatDisplayText(value))
    .join(", ");
  const viewedProfileId = userId || profileData?.id;

  if (showProfileLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <NewsFeedLayout showSidebars={false}>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              !
            </div>
            <p className="text-slate-800 font-semibold mb-2">{error}</p>
            <p className="text-xs text-slate-500 mb-5">
              Something went wrong while loading this profile.
            </p>
            <button
              onClick={() => fetchProfileData()}
              className="bg-[#16730F] text-white px-5 py-2.5 rounded-xl hover:bg-[#145a0c] font-medium text-sm transition-all shadow-sm cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      </NewsFeedLayout>
    );
  }

  if (!profileData && !showProfileLoading) {
    return (
      <NewsFeedLayout classes={false} scrollable={false} showSidebars={false}>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#16730F] flex items-center justify-center mx-auto mb-4">
              <FaBriefcase className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No profile data found
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Please complete your profile setup to view your information here.
            </p>
            <button
              onClick={() =>
                navigate(
                  user?.role === "jobseeker"
                    ? "/edit-profile/bio"
                    : getRecruiterEditProfilePath(user),
                )
              }
              className="bg-[#16730F] text-white px-5 py-2.5 rounded-xl hover:bg-[#145a0c] font-semibold text-sm transition-all shadow-sm cursor-pointer"
            >
              Complete Profile Setup
            </button>
          </div>
        </div>
      </NewsFeedLayout>
    );
  }

  return (
    <NewsFeedLayout showSidebars={false}>
      <div className="w-full min-w-0 max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Main Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden mb-6 transition-all duration-300">
          {/* Hero Cover Banner */}
          <div className="relative h-44 sm:h-56 md:h-64 w-full bg-gradient-to-r from-[#0a3507] via-[#16730F] to-[#2aa51e] overflow-hidden">
            {/* Ambient Background Decorative Patterns */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-300/10 rounded-full blur-2xl"></div>

            {/* Top Navigation Bar inside Banner */}
            <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (isViewingOwnProfile) {
                    navigate("/news-feed");
                  } else {
                    navigate(-1);
                  }
                }}
                className="flex items-center gap-2 bg-black/25 hover:bg-black/40 text-white backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer"
              >
                <FaArrowLeft className="shrink-0 text-xs" />
                <span>Back</span>
              </button>

              {isViewingOwnProfile && (
                <button
                  type="button"
                  onClick={handleEditProfile}
                  className="flex items-center gap-2 bg-white/90 hover:bg-white text-[#16730F] backdrop-blur-md px-4 py-2 rounded-full border border-white/50 text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <FaEdit className="shrink-0" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Profile Content (Overlapping Hero Cover) */}
          <div className="relative z-10 -mt-14 sm:-mt-20 px-4 sm:px-8 pb-6 sm:pb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
              {/* Left Column: Avatar + Basic Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 flex-1 min-w-0">
                {/* Avatar with Interactive Zoom Overlay */}
                <div
                  className="relative group shrink-0 cursor-pointer"
                  onClick={() => setIsPhotoViewerOpen(true)}
                  title="Click to view full photo"
                >
                  <img
                    src={activeAvatarSrc}
                    alt="Profile"
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 sm:border-[5px] border-white shadow-xl ring-1 ring-slate-900/10 transition-transform duration-300 group-hover:scale-[1.02] bg-slate-100"
                    onError={() => {
                      setAvatarIndex((prev) =>
                        prev < avatarCandidates.length - 1 ? prev + 1 : prev,
                      );
                    }}
                  />
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 text-white text-xs font-semibold gap-1.5">
                    <FaCamera className="w-4 h-4" />
                    <span>View</span>
                  </div>
                </div>

                {/* Name & Title Block */}
                <div className="w-full min-w-0 text-center sm:text-left pt-1 sm:pt-4">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight break-words">
                      <DisplayNameWithBadge
                        user={profileData}
                        fallback="User"
                        badgeSize="md"
                        className="text-[#fff] mr-[200px]"
                      />
                    </h1>

                    {/* Role Pill */}
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold tracking-wide border shadow-2xs ${
                        isRecruiterProfile
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-emerald-50 text-[#16730F] border-emerald-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isRecruiterProfile ? "bg-purple-600" : "bg-[#16730F]"
                        }`}
                      ></span>
                      {formatDisplayRole(viewedRole)}
                    </span>
                  </div>

                  {/* Company Name */}
                  {isRecruiterProfile && profileData.company_name && (
                    <p className="text-slate-700 font-semibold text-sm sm:text-base mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                      <FaBuilding className="text-[#16730F] shrink-0 text-xs" />
                      <span className="break-words">
                        {formatDisplayText(profileData.company_name)}
                      </span>
                    </p>
                  )}

                  {/* Job Title / Headline */}
                  {(profileData.job_title || profileData.title) && (
                    <p className="text-slate-600 font-medium text-sm sm:text-base mt-1 break-words">
                      {formatDisplayText(
                        profileData.job_title || profileData.title,
                      )}
                    </p>
                  )}

                  {/* Handle & Location Row */}
                  <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap text-xs sm:text-sm text-slate-500 mt-2">
                    {displayHandle && (
                      <span className="font-mono bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-medium">
                        {displayHandle}
                      </span>
                    )}

                    {isRecruiterProfile && recruiterPublicLocation && (
                      <span className="flex items-center gap-1 text-slate-600">
                        <FaMapMarkerAlt className="text-[#16730F] shrink-0" />
                        <span className="break-words">
                          {recruiterPublicLocation}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Connections Stats Button / Pill */}
                  <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
                    {isViewingOwnProfile ? (
                      <button
                        type="button"
                        onClick={() => navigate("/connection")}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#16730F] text-xs font-semibold border border-emerald-200/80 transition-colors cursor-pointer"
                        title="View all your connections"
                      >
                        <FaUserFriends className="text-xs" />
                        <span>
                          {formatConnectionCount(profileData.connectionCount)}
                        </span>
                        <span className="text-slate-600 font-normal">
                          {Number(profileData.connectionCount) === 1
                            ? "Connection"
                            : "Connections"}
                        </span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                        <FaUserFriends className="text-xs text-[#16730F]" />
                        <span className="text-[#16730F]">
                          {formatConnectionCount(profileData.connectionCount)}
                        </span>
                        <span className="text-slate-600 font-normal">
                          {Number(profileData.connectionCount) === 1
                            ? "Connection"
                            : "Connections"}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Connect / Message Actions */}
                  {!isViewingOwnProfile && viewedProfileId && (
                    <div className="mt-4 pt-2">
                      <ProfileConnectActions
                        userId={viewedProfileId}
                        displayName={formatDisplayPersonName(
                          profileData,
                          "User",
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Mutual Connections Box */}
              {!isViewingOwnProfile &&
                Number(profileData.mutualConnectionCount) > 0 && (
                  <div className="shrink-0 w-full md:w-auto md:max-w-xs bg-slate-50/90 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-200 p-3.5 sm:p-4 rounded-xl transition-all duration-200 shadow-2xs">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                        <FaUserFriends className="text-[#16730F]" />
                        Mutual connections
                      </span>
                      <span className="text-xs font-semibold text-[#16730F] bg-emerald-100/70 px-2 py-0.5 rounded-full">
                        {formatConnectionCount(
                          profileData.mutualConnectionCount,
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center -space-x-2.5 overflow-hidden py-1">
                        {(profileData.mutualConnections || [])
                          .slice(0, 3)
                          .map((person) => {
                            const name = [person?.firstName, person?.lastName]
                              .filter(Boolean)
                              .join(" ")
                              .trim();
                            return (
                              <button
                                key={String(person.id)}
                                type="button"
                                onClick={() =>
                                  navigate(`/user-profile/${person.id}`)
                                }
                                className="relative h-9 w-9 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-200 hover:z-10 focus:z-10 focus:outline-none transition-transform hover:scale-110"
                                title={
                                  name
                                    ? `View ${name}'s profile`
                                    : "View profile"
                                }
                              >
                                <img
                                  src={profileAvatarSrc(person.profile_photo)}
                                  alt={name || "Mutual connection"}
                                  className="h-full w-full object-cover"
                                />
                              </button>
                            );
                          })}
                        {Number(profileData.mutualConnectionCount) > 3 && (
                          <button
                            type="button"
                            onClick={() => setShowMutualConnections(true)}
                            className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-emerald-100 text-[11px] font-bold text-[#16730F] shadow-sm hover:bg-emerald-200 transition-colors"
                            title="See all mutual connections"
                          >
                            +
                            {formatConnectionCount(
                              Number(profileData.mutualConnectionCount) - 3,
                            )}
                          </button>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-600 leading-snug truncate">
                          {formatMutualConnectionsLabel(
                            profileData.mutualConnectionCount,
                            profileData.mutualConnections,
                          )}
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowMutualConnections(true)}
                          className="text-xs font-semibold text-[#16730F] hover:underline mt-0.5 inline-block"
                        >
                          See all mutuals
                        </button>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Online Presence Card */}
        {isRecruiterProfile && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7 mb-6 transition-all">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#16730F] flex items-center justify-center shrink-0">
                <FaGlobe className="w-4 h-4" />
              </div>
              <span>Online Presence</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <ProfileDetailRow
                icon={FaGlobe}
                label="Website"
                value={profileData.website}
                href={toExternalHref(profileData.website)}
                preserveCase
                brandColor="bg-emerald-50 text-[#16730F]"
              />
              <ProfileDetailRow
                icon={FaLinkedin}
                label="LinkedIn"
                value={linkedinUrl}
                href={toExternalHref(linkedinUrl)}
                preserveCase
                brandColor="bg-blue-50 text-[#0A66C2]"
              />
              <ProfileDetailRow
                icon={FaTwitter}
                label="X (Twitter)"
                value={twitterUrl}
                href={toExternalHref(twitterUrl)}
                preserveCase
                brandColor="bg-slate-100 text-slate-900"
              />
              <ProfileDetailRow
                icon={FaInstagram}
                label="Instagram"
                value={instagramUrl}
                href={toExternalHref(instagramUrl)}
                preserveCase
                brandColor="bg-pink-50 text-pink-600"
              />
            </div>
          </div>
        )}

        {/* About Section Card */}
        {(isRecruiterProfile || isJobseekerProfile) && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7 mb-6 transition-all">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#16730F] flex items-center justify-center shrink-0">
                <FaBriefcase className="w-4 h-4" />
              </div>
              <span>{isRecruiterProfile ? "About Company" : "About"}</span>
            </h2>
            <div className="relative">
              {aboutText ? (
                <>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                    {!needsTruncation || isAboutExpanded
                      ? aboutText
                      : aboutPreview.text}
                  </p>
                  {needsTruncation && (
                    <button
                      onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                      className="mt-3 text-[#16730F] hover:text-[#145a0c] font-semibold text-xs sm:text-sm transition-colors inline-flex items-center gap-1 group cursor-pointer"
                    >
                      <span>
                        {isAboutExpanded ? "Show less" : "Read full bio"}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isAboutExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-400 italic">
                  No bio provided yet.
                </p>
              )}
            </div>
          </div>
        )}

        {/* CV Sections for Jobseeker */}
        {isJobseekerProfile && <ProfileCvSections cv={cvData} />}

        {/* User Posts Section */}
        {viewedProfileId && (
          <ProfilePostsSection
            userId={String(viewedProfileId)}
            currentUserId={user?.id}
          />
        )}
      </div>

      {/* Fullscreen Photo Viewer Modal */}
      {isPhotoViewerOpen && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsPhotoViewerOpen(false)}
        >
          <div className="relative max-w-[95vw] max-h-[90vh]">
            <img
              src={activeAvatarSrc}
              alt="Profile full view"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              onClick={(event) => event.stopPropagation()}
            />
            <button
              type="button"
              aria-label="Close photo viewer"
              className="absolute -top-4 -right-4 text-white text-xl bg-slate-800/80 hover:bg-slate-700 rounded-full w-10 h-10 flex items-center justify-center border border-white/20 shadow-lg transition-all cursor-pointer"
              onClick={() => setIsPhotoViewerOpen(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Mutual Connections Modal */}
      <MutualConnectionsModal
        open={showMutualConnections}
        onClose={() => setShowMutualConnections(false)}
        otherUserId={viewedProfileId}
        otherUserName={formatDisplayPersonName(profileData, "User")}
      />
    </NewsFeedLayout>
  );
};

export default Profile;
