import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Homepage from "./pages/homepage/Homepage";
import Chat from "./pages/chat/Chat";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import Signup from "./pages/signup/Signup";
import { Toaster } from "react-hot-toast";
import ResetPassword from "./pages/resetPassword/ResetPassword";

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={true} />
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

export default App;
