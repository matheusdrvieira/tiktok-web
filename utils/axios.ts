import axios from "axios";

export const appApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FRONTEND_URL,
});

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});
