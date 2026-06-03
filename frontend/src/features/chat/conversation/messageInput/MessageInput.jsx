import { RiSendPlane2Fill } from "@remixicon/react";
import IconsWrapper from "../../../../utils/IconsWrapper";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { socket } from "../../../../socket/socket";
import { SOCKET_EVENTS } from "../../../../socket/events";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const MessageInput = () => {
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);
  const [isError, setIsError] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const sendMessage = () => {
    if (!inputRef.current || !searchParams.get("conversationId")) return;

    const message = inputRef.current.value.trim();

    if (message) {
      const data = {
        message,
        conversationId: searchParams.get("conversationId"),
      };

      socket.emit(SOCKET_EVENTS["NEW_MESSAGE"], data, (res) => {
        if (!res?.success) {
          toast.error("Failed to send message:" + (res?.message || ""));
        }
      });

      inputRef.current.value = "";
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setIsError(true);

      timeoutRef.current = setTimeout(() => {
        setIsError(false);
      }, 500);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const shakeVariants = {
    error: {
      x: [-10, 10, -10, 10, -5, 5, 0],
      borderColor: "#ef4444",
      transition: { duration: 0.4 },
    },
    normal: {
      x: 0,
      borderColor: "transparent",
    },
  };

  return (
    <div className="mb-5 bg-(--bg-primary) px-5">
      <motion.div
        variants={shakeVariants}
        animate={isError ? "error" : "normal"}
        className="w-full rounded-full bg-(--bg-secondary) py-2 pl-5 pr-2 flex gap-4 border-2 border-transparent"
      >
        <input
          type="text"
          placeholder="Enter Your Message"
          className="w-full outline-none bg-transparent"
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button
          className="p-3 bg-(--accent-color-primary) rounded-full shrink-0"
          onClick={sendMessage}
        >
          <IconsWrapper icon={RiSendPlane2Fill} size={18} />
        </button>
      </motion.div>
    </div>
  );
};

export default MessageInput;
