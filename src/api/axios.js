// src/api/axios.js
import axios from "axios";

export const api = axios.create({
  //   baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api",
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});
