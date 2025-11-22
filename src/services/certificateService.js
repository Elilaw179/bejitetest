

import { useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

import axiosInstance from "../utils/axiosInstance";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const createCertificate = () => {
  //handle backend, axios and default errors
  const handleError = (error) => {
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";
    throw errorMessage;
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
