import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "./Form";
import useAuthStore from "../../store/useAuthStore";
import toast from "react-hot-toast";
import VerifyOtp from "./VerifyOtp";
import { AnimatePresence } from "motion/react";
import useCounter from "../../hooks/useCounter";

const Signup = () => {
  const isLoading = useAuthStore((state) => state.isLoading);
  const signup = useAuthStore((state) => state.signup);
  const isOtpSent = useAuthStore((state) => state.isOtpSent);
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [otp, setOtp] = useState(["", "", "", ""]);

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [timerResetKey, setTimerResetKey] = useState(0);
  const navigate = useNavigate();
  const { isExpired, secondsLeft } = useCounter({
    initialSeconds: 90,
    active: isOtpSent,
    resetKey: timerResetKey,
  });

  async function submitForm(e) {
    e.preventDefault();

    if (!userData.username || !userData.email || !userData.password) {
      return toast.error("Please fill in all fields");
    }

    if (username.length > 25) return toast.error("Username cannot exceed 25 characters")

    await signup(userData.username, userData.email, userData.password);
  }

  async function onBtnClick() {
    if (!userData.username || !userData.email || !userData.password) return;

    if (!isExpired) {
      await verifyOtp(
        userData.username,
        userData.email,
        userData.password,
        otp,
      );
      return;
    }

    await signup(userData.username, userData.email, userData.password);
    setTimerResetKey((prev) => prev + 1);
    setOtp(["", "", "", ""]);
  }

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="rounded-sm border border-(--foreground-primary)/30 p-8">
        <h3 className="text-3xl">Sign up</h3>

        <Form
          setUserData={setUserData}
          userData={userData}
          submitForm={submitForm}
          isLoading={isLoading}
        />

        <p className="opacity-50 mt-5">
          Already have an account?
          <Link to="/login" className="ml-2 text-blue-500 hover:underline">
            Log in
          </Link>
        </p>

        <AnimatePresence mode="wait">
          {isOtpSent && (
            <VerifyOtp
              onBtnClick={onBtnClick}
              otp={otp}
              setOtp={setOtp}
              isExpired={isExpired}
              secondsLeft={secondsLeft}
              isLoading={isLoading}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Signup;
