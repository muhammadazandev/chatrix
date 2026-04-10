import { create } from "zustand";
import { authApi } from "../utils/api";
import toast from "react-hot-toast";

const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  isLoading: false,
  isOtpSent: false,

  checkAuth: async () => {
    set({ isLoading: true });

    try {
      const res = await authApi.get("/auth/me");

      set({
        isAuthenticated: res.data.success || !!res.data.user,
        isLoading: false,
      });
    } catch (error) {
      if (!error.response) {
        toast.error("Network error—please try again.");
      } else {
        console.error(error);
      }
      set({ isAuthenticated: false, isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const res = await authApi.post("/auth/signup", {
        username: username,
        email: email,
        password: password,
      });

      toast.success(res?.data?.message);
      set({ isOtpSent: res.data.success });
    } catch (error) {
      if (!error.response) {
        toast.error("Network error—please try again.");
      } else {
        toast.error(error?.response?.data?.message);
        console.error(error, error.response);
      }
      set({ isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },

  verifyOtp: async (username, email, password, code) => {
    const isSent = get().isOtpSent;

    if (!isSent) {
      return toast.error("OTP not sended");
    }

    set({ isLoading: true });

    try {
      const res = await authApi.post("/auth/verify-otp", {
        username: username,
        email: email,
        password: password,
        otpCode: code.join(""),
      });

      if (res?.data?.success) {
        await get().login(email, password);
      }

      toast.success("Signup successful");
    } catch (error) {
      if (!error.response) {
        toast.error("Network error—please try again.");
      } else {
        toast.error(error?.response?.data?.message);
        console.error(error, error.response);
      }
      set({ isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const res = await authApi.post("/auth/login", {
        email: email,
        password: password,
      });

      toast.success(res?.data?.message);
      set({ isAuthenticated: true });
    } catch (error) {
      if (!error.response) {
        toast.error("Network error—please try again.");
      } else {
        toast.error(error?.response?.data?.message);
        console.error(error, error.response);
      }
      set({ isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },

  forgotPassword: async (email) => {
    if (!email) {
      toast.error("Please enter an email first");
    }

    set({ isLoading: true });

    try {
      const res = await authApi.post("/auth/forgot-password", {
        email: email,
      });
      toast.success(res?.data?.message);
    } catch (error) {
      if (!error.response) {
        toast.error("Network error—please try again.");
      } else {
        toast.error(error?.response?.data?.message);
        console.error(error, error.response);
      }
      set({ isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (password, token) => {
    set({ isLoading: true });

    try {
      const res = await authApi.post(`/auth/reset-password/${token}`, {
        password: password,
      });

      toast.success(res?.data?.message);
    } catch (error) {
      if (!error.response) {
        toast.error("Network error—please try again.");
      } else {
        toast.error(error?.response?.data?.message);
        console.error(error, error.response);
      }
      set({ isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      const res = await authApi.post("/auth/logout");

      set({ isAuthenticated: false, isLoading: false, isOtpSent: false });

      window.location.href = "http://localhost:5173/login";
    } catch (error) {
      if (!error.response) {
        toast.error("Network error—please try again.");
      } else {
        toast.error(error?.response?.data?.message);
        console.error(error, error.response);
      }
      set({ isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },

  clearAuthState: () => {
    set({ isAuthenticated: false, isLoading: false, isOtpSent: false });
  },
}));

export default useAuthStore;
