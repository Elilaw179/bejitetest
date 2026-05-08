import axiosInstance from '../utils/axiosInstance';

const userProfileService = {
  /**
   * Get user profile by ID
   * Uses connections search response format for consistency (id, firstName, lastName, email, jobTitle, profilePhoto)
   */
  async getUserProfile(userId) {
    try {
      try {
        const response = await axiosInstance.get(`/api/candidates/${String(userId)}`);
        if (response.data.success && response.data.data) {
          const d = response.data.data;
          return {
            id: d.id || userId,
            firstName: d.firstName ?? d.first_name ?? '',
            lastName: d.lastName ?? d.last_name ?? '',
            email: d.email,
            jobTitle: d.jobTitle ?? d.title ?? null,
            profilePhoto: d.profilePhoto ?? d.profile_photo ?? null,
          };
        }
      } catch {
        /* try fallback */
      }
      const response = await axiosInstance.get(`/api/profile/profile/${String(userId)}`);
      return {
        id: userId,
        firstName: response.data.firstName || response.data.first_name || '',
        lastName: response.data.lastName || response.data.last_name || '',
        email: response.data.email,
        jobTitle: null,
        profilePhoto: response.data.profilePhoto || response.data.profile_photo || null,
      };
    } catch (error) {
      console.error(`Error fetching profile for user ${userId}:`, error);
      return null;
    }
  }
};

export default userProfileService;
