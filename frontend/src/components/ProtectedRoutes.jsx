import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const isLoggedIn = false;

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
