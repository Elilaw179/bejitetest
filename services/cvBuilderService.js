// src/services/cvBuilderService.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const submitBio = async (bioData) => {
  try {
    const response = await axios.post(`${BASE_URL}/bio`, bioData);
    return response.data;
  } catch (error) {
    console.error("Error submitting bio:", error);
    throw error;
  }
};
