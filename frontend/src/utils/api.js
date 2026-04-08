import axios from "axios";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // For accessing user info
  headers: {
    "Content-Type": "application/json",
  },
});

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

export { authApi, publicApi };
