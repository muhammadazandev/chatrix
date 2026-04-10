import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isLoading, resetPassword } = useAuthStore();
  const navigate = useNavigate();

  async function handleOnClick() {
    if (!password || !confirmPassword) {
      return toast.error("Please fill in all fields");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    // Call the resetPassword function from the auth store
    await resetPassword(password, token);

    navigate("/login"); // Redirect to login page after successful password reset
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="rounded-sm border border-(--foreground-primary)/30 p-12">
        <h3 className="text-3xl text-center">Reset password?</h3>

        <div className="flex flex-col gap-8 mt-8">
          <input
            type={isShowPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={password}
            className="w-85 px-4 py-3 rounded-sm border border-(--foreground-primary)/30"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type={isShowPassword ? "text" : "password"}
            placeholder="Retype new password"
            value={confirmPassword}
            className="w-85 px-4 py-3 rounded-sm border border-(--foreground-primary)/30"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div>
            <input
              type="checkbox"
              id="showPassword"
              checked={isShowPassword}
              className="cursor-pointer"
              onChange={(e) => setIsShowPassword(e.target.checked)}
            />
            <label
              htmlFor="showPassword"
              className="ml-2 opacity-50 text-sm cursor-pointer"
            >
              Show password
            </label>
          </div>

          <button
            disabled={isLoading}
            className="py-2 rounded-sm text-white bg-(--accent-color-primary)"
            onClick={handleOnClick}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
