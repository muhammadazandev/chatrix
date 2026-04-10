import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

const VerifyOtp = ({
  onBtnClick,
  otp,
  setOtp,
  isExpired,
  secondsLeft,
  isLoading,
}) => {
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (isExpired) {
      toast.error(
        "Your verification code is no longer valid. Please request a new code.",
      );
    }
  }, [isExpired]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-(--bg-primary)/95 backdrop-blur-sm">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between">
            <h3 className="text-2xl">Verify OTP</h3>
            <p className="opacity-50 mt-2 text-sm">{secondsLeft}s</p>
          </div>
          <div className="flex gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-16 h-16 text-center text-xl border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          <button
            className={`py-2 rounded-md bg-(--accent-color-primary) text-white transition-all`}
            onClick={onBtnClick}
            disabled={isLoading}
          >
            {isExpired ? "Resend Code" : "Verify"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VerifyOtp;
