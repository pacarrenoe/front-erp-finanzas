import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001",
  timeout: 15000,
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("HTTP Error:", err);
    return Promise.reject(err);
  }
);