import { RiSendPlane2Fill } from "@remixicon/react";
import IconsWrapper from "../../../../utils/IconsWrapper";
import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { socket } from "../../../../socket/socket";
import { SOCKET_EVENTS } from "../../../../socket/events";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const MessageInput = () => {
  const inputRef = useRef(null);
  const errorTimeoutRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const [isError, setIsError] = useState(false);
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const conversationIdRef = useRef(conversationId);

  const emitStartTyping = () => {
    if (!conversationIdRef.current) return;

    socket.emit(SOCKET_EVENTS.START_TYPING, {
      conversationId: conversationIdRef.current,
    });
  };

  const emitStopTyping = () => {
    if (!conversationIdRef.current) return;

    socket.emit(SOCKET_EVENTS.STOP_TYPING, {
      conversationId: conversationIdRef.current,
    });
  };

  const stopTypingNow = (conversationIdToStop) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTypingRef.current) {
      isTypingRef.current = false;
      const stopId = conversationIdToStop || conversationIdRef.current;
      if (stopId) {
        socket.emit(SOCKET_EVENTS.STOP_TYPING, {
          conversationId: stopId,
        });
      }
    }
  };

  const sendMessage = () => {
    if (!inputRef.current || !conversationIdRef.current) return;
    stopTypingNow();

    const message = inputRef.current.value.trim();

    if (message) {
      const data = {
        message,
        conversationId: conversationIdRef.current,
      };

      socket.emit(SOCKET_EVENTS["NEW_MESSAGE"], data, (res) => {
        if (!res?.success) {
          toast.error("Failed to send message:" + (res?.message || ""));
        }
      });

      inputRef.current.value = "";
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

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        emitStopTyping(); // important safety call
      }
    };
  }, []);

  useEffect(() => {
    const previousConversationId = conversationIdRef.current;

    if (previousConversationId && previousConversationId !== conversationId) {
      stopTypingNow(previousConversationId);
    }

    conversationIdRef.current = conversationId;

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [conversationId]);

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

  const handleTyping = () => {
    if (!conversationIdRef.current) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      emitStartTyping();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      emitStopTyping();
    }, 1500);
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
          onInput={handleTyping}
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
