
import axios from "axios";

const api = axios.create({
<<<<<<< HEAD
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
=======
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true,
>>>>>>> 908a7b0 (add variable)
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;