import axios from "axios";
import { BASE_URL } from "./apiEndpoints";
import { API_ENDPOINT } from "./apiEndpoints";

const axiosConfig = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const excludeEndpoint = [
  "/profile/login",
  "/profile/register",
  "/status",
  "/profile/activate",
  "/health",
];

const getRequestPath = (url) => {
  if (!url) {
    return "";
  }

  try {
    return new URL(url, BASE_URL || window.location.origin).pathname;
  } catch {
    return url;
  }
};

axiosConfig.interceptors.request.use(
  (config) => {
    const requestPath = getRequestPath(config.url);
    const shouldSkipToken = excludeEndpoint.some((endpoint) => requestPath.endsWith(endpoint));

    if (!shouldSkipToken) {
      const accessToken = localStorage.getItem("token");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const requestUrl = error.config?.url || "";
      const isLoginRequest = requestUrl.includes(API_ENDPOINT.LOGIN);

      if (error.response.status === 401 && !isLoginRequest) {
        localStorage.removeItem("token");
        if (window.location.hash !== "#/login") {
          window.location.hash = "/login";
        }
      } else if (error.response.status === 500) {
        console.log("Server error please try again later");
      } else if (error.code === "ECONNABORTED") {
        console.log("Request timeout please try again");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosConfig;
