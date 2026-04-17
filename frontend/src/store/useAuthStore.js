import { create } from "zustand";
import { authApi } from "../utils/api";
import toast from "react-hot-toast";
import { persist } from "zustand/middleware";

const handleError = (error) => {
  if (!error.response) return "Network error";

  const status = error.response.status;

  if (error.response.data.message === "No token, access denied") return;
  if (status === 429) return "Too many requests";
  if (status >= 500) return "Server error";

  return error.response.data?.message || "Something went wrong";
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isOtpSent: false,

      checkAuth: async () => {
        set({ isLoading: true });

        try {
          const res = await authApi.get("/auth/me");

          set({
            isAuthenticated: res.data.isLoggedIn,
            user: res.data.user,
          });
        } catch (error) {
          const message = handleError(error);
          if (message) {
            toast.error(message);
          }
          set({ isAuthenticated: false });
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
          const message = handleError(error);
          if (message) {
            toast.error(message);
          }
        } finally {
          set({ isLoading: false });
        }
      },

      verifyOtp: async (username, email, password, code) => {
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
          const message = handleError(error);
          if (message) {
            toast.error(message);
          }
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
          set({ isAuthenticated: true, user: res?.data?.user });
        } catch (error) {
          const message = handleError(error);
          if (message) {
            toast.error(message);
          }
        } finally {
          set({ isLoading: false });
        }
      },

      forgotPassword: async (email) => {
        if (!email) {
          return toast.error("Please enter an email first");
        }

        set({ isLoading: true });

        try {
          const res = await authApi.post("/auth/forgot-password", {
            email: email,
          });
          toast.success(res?.data?.message);
        } catch (error) {
          const message = handleError(error);
          if (message) {
            toast.error(message);
          }
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
          const message = handleError(error);
          if (message) {
            toast.error(message);
          }
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          await authApi.post("/auth/logout");

          set({
            isAuthenticated: false,
            isOtpSent: false,
            user: null,
          });
        } catch (error) {
          const message = handleError(error);
          if (message) {
            toast.error(message);
          }
        } finally {
          set({ isLoading: false });
        }
      },

      clearAuthState: () => {
        set({
          isAuthenticated: false,
          isLoading: false,
          isOtpSent: false,
          user: null,
        });
      },
    }),
    {
      name: "auth-storage",

      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    },
  ),
);

export default useAuthStore;
