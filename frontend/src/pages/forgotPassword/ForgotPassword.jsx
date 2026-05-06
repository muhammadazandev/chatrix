import { useState } from "react";
import { Link } from "react-router-dom";
import { RiMailLine } from "@remixicon/react";
import IconsWrapper from "../../utils/IconsWrapper";
import useAuthStore from "../../store/useAuthStore";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const isLoading = useAuthStore((state) => state.isLoading);
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const [email, setEmail] = useState("");

  // useEffect(() => {
  //   async function wow() {
  //     try {
  //       const res = await axios.post(
  //         `http://localhost:3000/api/auth/reset-password/${token}`,
  //         {
  //           password: "mera password to yahi hay bhai",
  //           withCredentials: true,
  //         },
  //       );
  //       console.log("Success data:", res.data);
  //     } catch (error) {
  //       if (error.response) {
  //         console.log("Status:", error.response.status);
  //         console.log("Data from server:", error.response.data);
  //       } else if (error.request) {
  //         console.log("Request made but no response:", error.request);
  //       } else {
  //         console.log("Error config / message:", error.message);
  //       }
  //     }
  //   }
  //   wow();
  // }, []);

  async function handleOnClick() {
    if (!email) return toast.error("Please enter an email first");

    await forgotPassword(email);
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="rounded-sm border border-(--foreground-primary)/30 p-12">
        <h3 className="text-3xl text-center">Forgot password?</h3>

        <div className="mt-14 w-100 px-4 py-3 rounded-sm border border-(--foreground-primary)/30 flex gap-3 justify-between group focus-within:border-(--accent-color-primary) items-center">
          <span className="opacity-50">
            <IconsWrapper icon={RiMailLine} size={20} />
          </span>
          <input
            type="email"
            className="flex-1 no-focus"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col items-center gap-5 mt-8">
          <button
            className="w-100 bg-(--accent-color-primary) rounded-sm text-white py-2"
            onClick={handleOnClick}
            disabled={isLoading}
          >
            Reset Password
          </button>
          <Link
            to="/login"
            className="like-button py-2 w-100 text-center border border-(--foreground-primary)/30 rounded-sm"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
