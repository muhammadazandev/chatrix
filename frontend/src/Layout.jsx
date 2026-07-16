import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { Toaster } from "react-hot-toast";
import AppearanceBootstrap from "./bootstrap/AppearanceBootstrap";
import Loader from "./components/Loader";

const Homepage = lazy(() => import("./pages/homepage/Homepage"));
const Login = lazy(() => import("./pages/login/Login"));
const Signup = lazy(() => import("./pages/signup/Signup"));
const Chat = lazy(() => import("./pages/chat/Chat"));
const ForgotPassword = lazy(
  () => import("./pages/forgotPassword/ForgotPassword"),
);
const ResetPassword = lazy(() => import("./pages/resetPassword/ResetPassword"));

const Layout = () => {
  return (
    <>
      <AppearanceBootstrap />
      <Toaster
        position="top-right"
        reverseOrder={true}
        toastOptions={{
          style: {
            maxWidth: 550,
            wordBreak: "break-word",
            padding: "10px",
            boxShadow: "none",
            outline: "1px solid var(--foreground-secondary)",
          },
        }}
      />
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/chat"
              element={
                <ProtectedRoutes>
                  <Chat />
                </ProtectedRoutes>
              }
            />

            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};

export default Layout;
