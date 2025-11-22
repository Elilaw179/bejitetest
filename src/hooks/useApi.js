import { useCallback, useState } from "react";
import axiosInstance from "../services/axios";
import { API_URL } from "../config";

const API_BASE = API_URL || "https://bejite-backend-9mg2.onrender.com";

const useApi = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // -------------------------
  // POST (fetch)
  // -------------------------
  const postData = useCallback(async (url, payload) => {
    const fullUrl = `${API_BASE}${url}`;
    console.log("[useApi] POST request to:", fullUrl);

    try {
      setLoading(true);

      const response = await fetch(fullUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Unknown error");
      }

      setData(result);
    } catch (err) {
      setError(err.message);
      console.error("[useApi] POST error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // -------------------------
  // GET (fetch)
  // -------------------------
  const getData = useCallback(async (url) => {
    const fullUrl = `${API_BASE}${url}`;
    console.log("[useApi] GET request to:", fullUrl);

    try {
      setLoading(true);

      const response = await fetch(fullUrl);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch data");
      }

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // -------------------------
  // POST (Axios promise)
  // -------------------------
  const postDataPromise = useCallback(async (data) => {
    const fullUrl = `${API_BASE}/api/cv-builder/bio`;

    try {
      const response = await axiosInstance.post(fullUrl, data);

      return response.data;
    } catch (err) {
      console.error("[useApi] POST (Promise) error:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, data, error, postData, getData, postDataPromise };
};

export default useApi;
