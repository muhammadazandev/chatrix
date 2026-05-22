import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Homepage from "./pages/homepage/Homepage";
import Chat from "./pages/chat/Chat";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import Signup from "./pages/signup/Signup";
import { Toaster } from "react-hot-toast";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import AppearanceBootstrap from "./bootstrap/AppearanceBootstrap";

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
        <Routes>
          <Route path="/" element={<Homepage />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route
            path="/chat"
            element={
              <ProtectedRoutes>
                <Chat />
              </ProtectedRoutes>
            }
          ></Route>
          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          ></Route>
          <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Layout;
