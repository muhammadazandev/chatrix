import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // For accessing user info
  headers: {
    "Content-Type": "application/json",
  },
});

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/signup") &&
      !originalRequest.url?.includes("/auth/forgot-password") &&
      !originalRequest.url?.includes("/auth/reset-password") &&
      !originalRequest.url?.includes("/auth/verify-otp")
    ) {
      originalRequest._retry = true;

      try {
        await authApi.post("/auth/refresh");
        return authApi(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuthState();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

export { authApi, publicApi };
