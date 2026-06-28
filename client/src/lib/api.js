import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Auto-attach JWT token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error message from all backend error shapes
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err.response?.data;
    // Zod validation error → show first field error
    if (data?.errors?.length) {
      err.message = data.errors[0].message;
    } else if (data?.message) {
      err.message = data.message;
    }
    return Promise.reject(err);
  }
);

export default api;
