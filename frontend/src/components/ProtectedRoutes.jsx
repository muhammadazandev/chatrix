import { Navigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { authApi } from "../utils/api";

const ProtectedRoutes = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkIsLoggedIn() {
      try {
        const askFromBackend = await authApi.get("/auth/me");

        setIsLoggedIn(askFromBackend.isLoggedIn);

        console.log(askFromBackend);
      } catch (error) {
        console.error(error);
      }
    }
    checkIsLoggedIn();
  }, []);

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
