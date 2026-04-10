import { useEffect, useState } from "react";

const useCounter = ({ initialSeconds = 90, active = false, resetKey = 0 }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!active) {
      setSecondsLeft(initialSeconds);
      setIsExpired(false);
      return;
    }

    setSecondsLeft(initialSeconds);
    setIsExpired(false);
  }, [active, initialSeconds, resetKey]);

  useEffect(() => {
    if (!active || secondsLeft <= 0) {
      if (active && secondsLeft <= 0) {
        setIsExpired(true);
      }
      return;
    }

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [active, secondsLeft]);

  return { secondsLeft, isExpired };
};

export default useCounter;
