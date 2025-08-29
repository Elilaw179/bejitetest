
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8888/api", 
  withCredentials: true, 
});

export default axiosInstance;
