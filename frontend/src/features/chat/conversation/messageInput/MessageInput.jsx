import { RiEmotionHappyLine, RiSendPlane2Fill } from "@remixicon/react";
import IconsWrapper from "../../../../utils/IconsWrapper";
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { socket } from "../../../../socket/socket";
import { SOCKET_EVENTS } from "../../../../socket/events";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import useEmojiPicker from "../../../../hooks/useEmojiPicker";
import SharedEmojiPicker from "../../../../components/SharedEmojiPicker";
import Tooltip from "../../../../components/Tooltip";
import useTypingIndicator from "../../../../hooks/useTypingIndicator";

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

const MessageInput = () => {
  const errorTimeoutRef = useRef(null);
  const [isError, setIsError] = useState(false);
  const [searchParams] = useSearchParams();

  const conversationId = searchParams.get("conversationId");
  const conversationIdRef = useRef(conversationId);
  conversationIdRef.current = conversationId;

  const {
    value,
    setValue,
    isOpen,
    handleEmojiSelect,
    closePicker,
    togglePicker,
  } = useEmojiPicker("");

  const { stopTypingNow, handleTyping } = useTypingIndicator(conversationIdRef);

  const sendMessage = () => {
    if (!conversationIdRef.current) return;
    stopTypingNow();
    closePicker();

    const message = value.trim();

    if (message) {
      const data = {
        message,
        conversationId: conversationIdRef.current,
      };

      socket.emit(SOCKET_EVENTS["NEW_MESSAGE"], data, (res) => {
        if (!res?.success) {
          toast.error(
            `Failed to send message${res?.message ? `: ${res.message}` : ""}`,
          );
        }
      });

      setValue("");
    } else {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }

      setIsError(true);

      errorTimeoutRef.current = setTimeout(() => {
        setIsError(false);
      }, 500);
    }
  };

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setValue("");
  }, [conversationId]);

  return (
    <div className="mb-5 bg-(--bg-primary) px-5">
      <motion.div
        variants={shakeVariants}
        animate={isError ? "error" : "normal"}
        className="w-full rounded-full bg-(--bg-secondary) py-2 px-3 flex gap-4 border-2 border-transparent"
      >
        <Tooltip content="Open Emoji Picker" delay={[1000, 0]}>
          <button
            className="p-2 rounded-full shrink-0 z-50"
            onClick={togglePicker}
          >
            <IconsWrapper icon={RiEmotionHappyLine} size={25} />
          </button>
        </Tooltip>

        <SharedEmojiPicker
          isOpen={isOpen}
          handleEmojiSelect={handleEmojiSelect}
          closePicker={closePicker}
          classes="absolute origin-bottom-left bottom-25 left-2"
        />

        <input
          type="text"
          placeholder="Enter Your Message"
          className="w-full outline-none bg-transparent z-50"
          onChange={(e) => {
            setValue(e.target.value);
            handleTyping();
          }}
          value={value}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button
          className="p-3 bg-(--accent-color-primary) rounded-full shrink-0 z-50"
          onClick={sendMessage}
        >
          <IconsWrapper icon={RiSendPlane2Fill} size={18} />
        </button>
      </motion.div>
    </div>
  );
};

export default MessageInput;
