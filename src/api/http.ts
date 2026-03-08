import axios from "axios";

const http = axios.create({
  baseURL: "http://192.168.1.90:3001"
});

http.interceptors.request.use((config) => {

  const token = sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default http;