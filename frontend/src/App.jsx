import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Homepage from "./pages/homepage/Homepage";
import Chat from "./pages/chat/Chat";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/chat"
          element={
            <ProtectedRoutes>
              <Chat />
            </ProtectedRoutes>
          }
        ></Route>
        <Route path="/reset-password/:token" element={<ForgotPassword />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
