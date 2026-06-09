import axiosInstance from "../utils/axiosInstance";

export const getEmployerDashboard = async (params = {}) => {
  const response = await axiosInstance.get("/api/employer/dashboard", {
    params,
  });
  return response.data;
};

export const createEmployerJob = async (jobData) => {
  const response = await axiosInstance.post("/api/employer/jobs", jobData);
  return response.data;
};

export const getJobApplications = async (jobId, params = {}) => {
  const response = await axiosInstance.get(
    `/api/employer/jobs/${jobId}/applications`,
    { params },
  );
  return response.data;
};

export const updateJobApplicationStatus = async (
  jobId,
  applicationId,
  status,
) => {
  const response = await axiosInstance.patch(
    `/api/employer/jobs/${jobId}/applications/${applicationId}`,
    { status },
  );
  return response.data;
};

export const getJobExtendInfo = async (jobId) => {
  const response = await axiosInstance.get(`/api/employer/jobs/${jobId}/extend`);
  return response.data;
};

export const extendJobForSubscriber = async (jobId) => {
  const response = await axiosInstance.post(`/api/employer/jobs/${jobId}/extend`);
  return response.data;
};

export const initJobExtensionPayment = async (jobId, currency = "USD") => {
  const response = await axiosInstance.post(
    `/api/employer/jobs/${jobId}/extend/payment/init`,
    { currency },
  );
  return response.data;
};

export const verifyJobExtensionPayment = async (jobId, reference) => {
  const response = await axiosInstance.get(
    `/api/employer/jobs/${jobId}/extend/payment/verify/${reference}`,
  );
  return response.data;
};

export default {
  getEmployerDashboard,
  createEmployerJob,
  getJobApplications,
  updateJobApplicationStatus,
  getJobExtendInfo,
  extendJobForSubscriber,
  initJobExtensionPayment,
  verifyJobExtensionPayment,
};
