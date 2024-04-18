import axios from "axios";
import { config } from "./config";
import { SESSION_ENUMS } from "../enums/enums";
import { getFromSessionStorage } from "../utils/editSessionStorage";

export default axios.create({
  baseURL: config.api_url,
});

export const axiosSignupInstance = axios.create({
  baseURL: config.api_url,
  timeout: 5000,
});

axiosSignupInstance.interceptors.request.use((config) => {
  const token = getFromSessionStorage(SESSION_ENUMS.SIGNUPSESSIONKEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const axiosPrivate = axios.create({
  baseURL: config.api_url,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
