import axiosInstance from '../utils/axiosInstance';

const assertBearerAuth = () => {
  const token =
    localStorage.getItem('accessToken') || localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Not authenticated. Please sign in again.');
  }
};

const isActivityLogRouteMissing = (error) => {
  const status = error?.response?.status;
  return status === 404 || status === 501;
};

export const getJobseekerPreferences = async (params = {}) => {
  assertBearerAuth();
  const response = await axiosInstance.get(
    '/api/activity-log/jobseeker-preferences',
    { params },
  );
  return response.data;
};

export const getJobseekerPreferenceById = async (id) => {
  assertBearerAuth();
  const response = await axiosInstance.get(
    `/api/activity-log/jobseeker-preferences/${id}`,
  );
  return response.data;
};

/** Prefer candidates API; fall back to jobs list when backend is not deployed yet. */
export const getRecruiterJobApplications = async (params = {}, getJobs) => {
  try {
    return await getJobseekerPreferences(params);
  } catch (error) {
    if (isActivityLogRouteMissing(error) && typeof getJobs === 'function') {
      return getJobs({ ...params, poster_role: 'jobseeker' });
    }
    throw error;
  }
};

/** Prefer candidates detail; fall back to job record when activity-log route is unavailable. */
export const getRecruiterJobApplicationById = async (id, getJobById) => {
  try {
    return await getJobseekerPreferenceById(id);
  } catch (error) {
    if (isActivityLogRouteMissing(error) && typeof getJobById === 'function') {
      return getJobById(id);
    }
    throw error;
  }
};
