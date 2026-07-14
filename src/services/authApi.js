import axiosPublic from "./axiosPublic";

export async function signupUserRequest(userData) {
  const response = await axiosPublic.post("/auth/signup", userData);
  return response.data;
}

export async function loginUserRequest(credentials) {
  const response = await axiosPublic.post("/auth/login", credentials);
  return response.data;
}
