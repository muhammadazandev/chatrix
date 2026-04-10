import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authApi } from "../utils/api";
// import useAuthStore from "../store/auth/authStore"; // Your store

const ProtectedRoutes = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const setAuth = useAuthStore((state) => state.setAuthenticated); // Sync to store

  useEffect(() => {
    async function checkIsLoggedIn() {
      try {
        const response = await authApi.get("/auth/me");
        const loggedIn = response.data.isLoggedIn || !!response.data.user;
        setIsLoggedIn(loggedIn);
        // setAuth(loggedIn);
      } catch (error) {
        console.error(error);
        setIsLoggedIn(false);
        // setAuth(false);
      } finally {
        setLoading(false);
      }
    }
    checkIsLoggedIn();
  }, []);

  if (loading) return <div>Loading...</div>;

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
