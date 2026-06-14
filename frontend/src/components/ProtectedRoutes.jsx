import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const ProtectedRoutes = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authChecked = useAuthStore((state) => state.authChecked);

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoutes;
