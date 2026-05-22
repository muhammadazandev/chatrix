import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authApi } from "../utils/api";
import useAuthStore from "../store/useAuthStore";

const ProtectedRoutes = ({ children }) => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    async function runCheck() {
      await checkAuth();
    }

    runCheck();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
