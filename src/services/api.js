/**
 * API Service
 * Example functions showing how to make authenticated API calls
 * The axiosInstance automatically attaches the access token to all requests
 */

import axiosInstance from '../utils/axiosInstance';

// ============================================
// USER ENDPOINTS
// ============================================

/**
 * Get current user profile
 */
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get('/user/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put('/user/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// ============================================
// JOB ENDPOINTS
// ============================================

/**
 * Get all jobs
 */
export const getJobs = async (filters = {}) => {
  try {
    const response = await axiosInstance.get('/jobs', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

/**
 * Create a new job posting
 */
export const createJob = async (jobData) => {
  try {
    const response = await axiosInstance.post('/jobs', jobData);
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

/**
 * Apply to a job
 */
export const applyToJob = async (jobId, applicationData) => {
  try {
    const response = await axiosInstance.post(`/jobs/${jobId}/apply`, applicationData);
    return response.data;
  } catch (error) {
    console.error('Error applying to job:', error);
    throw error;
  }
};

// ============================================
// FILE UPLOAD EXAMPLE
// ============================================

/**
 * Upload file (e.g., resume, profile picture)
 */
export const uploadFile = async (file, fileType = 'resume') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', fileType);

    const response = await axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// ============================================
// CONNECTION/CHAT ENDPOINTS
// ============================================

/**
 * Get user connections
 */
export const getConnections = async () => {
  try {
    const response = await axiosInstance.get('/connections');
    return response.data;
  } catch (error) {
    console.error('Error fetching connections:', error);
    throw error;
  }
};

/**
 * Send connection request
 */
export const sendConnectionRequest = async (userId) => {
  try {
    const response = await axiosInstance.post('/connections/request', { userId });
    return response.data;
  } catch (error) {
    console.error('Error sending connection request:', error);
    throw error;
  }
};

/**
 * Get chat messages
 */
export const getChatMessages = async (chatId) => {
  try {
    const response = await axiosInstance.get(`/chats/${chatId}/messages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
};

/**
 * Send a chat message
 */
export const sendMessage = async (chatId, message) => {
  try {
    const response = await axiosInstance.post(`/chats/${chatId}/messages`, { message });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// ============================================
// EXAMPLE: Using in a component
// ============================================

/*
import { getUserProfile, updateUserProfile } from '../services/api';
import { toast } from 'react-toastify';

function ProfileComponent() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch user profile on component mount
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (newData) => {
    setLoading(true);
    try {
      const updatedProfile = await updateUserProfile(newData);
      setProfile(updatedProfile);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? <p>Loading...</p> : <div>{profile?.name}</div>}
    </div>
  );
}
*/

