import axiosInstance from '../utils/axiosInstance';
import { normalizeProfileData, mergeCvBioIntoProfile } from '../utils/profileUtils';

/**
 * GET /api/users/:userId/profile/full — summary + full CV sections.
 * @param {string} userId
 * @returns {Promise<{ user: object, cv: object }|null>}
 */
export async function fetchFullUserProfile(userId) {
  const id = String(userId);
  const endpoints = [
    `/api/users/${id}/profile/full`,
    `/api/connections/users/${id}/profile/full`,
  ];

  for (const url of endpoints) {
    try {
      const { data } = await axiosInstance.get(url);
      const payload = data?.data;
      if (!payload?.user) return null;

      let user = normalizeProfileData(payload.user);
      if (payload.cv?.bio) {
        user = mergeCvBioIntoProfile(user, payload.cv.bio);
      }

      return {
        user,
        cv: {
          bio: payload.cv?.bio ?? null,
          education: Array.isArray(payload.cv?.education) ? payload.cv.education : [],
          skills: Array.isArray(payload.cv?.skills) ? payload.cv.skills : [],
          workHistory: Array.isArray(payload.cv?.workHistory)
            ? payload.cv.workHistory
            : [],
          certificates: Array.isArray(payload.cv?.certificates)
            ? payload.cv.certificates
            : [],
          links: payload.cv?.links ?? null,
        },
      };
    } catch {
      /* try next */
    }
  }

  return null;
}
