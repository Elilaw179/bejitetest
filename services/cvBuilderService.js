// src/services/cvBuilderService.js
import axios from "axios";

const BASE_URL = "https://bejite-backend.onrender.com/api/cv-builder";

export const submitBio = async (bioData) => {
  try {
    const response = await axios.post(`${BASE_URL}/bio`, bioData);
    return response.data;
  } catch (error) {
    console.error("Error submitting bio:", error);
    throw error;
  }
};
