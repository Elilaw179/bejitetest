

import { useCallback } from "react";


import axiosInstance from "../utils/axiosInstance";


const BASE_URL = import.meta.env.VITE_API_URL;

export const useCreateCertificate = () => {
  //handle backend, axios and default errors
  const handleError = (error) => {
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";
    throw new Error(errorMessage);
  };

  //post certificate data

  const postCertficateData = useCallback(async (data) => {
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/api/cv-builder/certificates/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }, []);

  return { postCertficateData };
};
