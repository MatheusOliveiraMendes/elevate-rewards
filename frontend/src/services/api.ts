import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333", // Base URL for API requests.
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Retrieves token from localStorage.
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`; // Adds token to Authorization header.
  }
  return config;
});

export default api; // Exports the configured Axios instance.