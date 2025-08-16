// utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const userId = localStorage.getItem("user_id");
  console.log("📦 attaching user_id", userId); // debug log
  if (userId) {
    config.headers["x-user-id"] = userId;
  }
  return config;
});

export default api;
