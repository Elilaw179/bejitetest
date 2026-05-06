import axiosInstance from '../utils/axiosInstance';

const userProfileService = {
  /**
   * Get user profile by ID
   * Uses connections search response format for consistency (id, firstName, lastName, email, jobTitle, profilePhoto)
   */
  async getUserProfile(userId) {
    try {
      // Try multiple profile endpoints for compatibility
      try {
        // Primary: recruiter profile endpoint (matches searchUsers format)
        const response = await axiosInstance.get(`/auth/user/profile/${String(userId)}`);
        return {
          id: response.data.id || userId,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          jobTitle: response.data.jobTitle || null,
          profilePhoto: response.data.profilePhoto || response.data.profile_photo || null,
        };
      } catch {
        // Fallback: general user profile
        const response = await axiosInstance.get(`/api/profile/profile/${String(userId)}`);
        return {
          id: userId,
          firstName: response.data.firstName || response.data.first_name || '',
          lastName: response.data.lastName || response.data.last_name || '',
          email: response.data.email,
          jobTitle: null,
          profilePhoto: response.data.profilePhoto || response.data.profile_photo || null,
        };
      }
    } catch (error) {
      console.error(`Error fetching profile for user ${userId}:`, error);
      return null; // Graceful fallback
    }
  }
};

export default userProfileService;
